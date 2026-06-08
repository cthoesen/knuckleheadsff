import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year when ready to roll to new season
const SEASON_YEAR = '2025';
const SERVER = 'www47';
const LEAGUE_ID = '72966';

/**
 * Build a match key from a player name + NFL team code.
 *
 * Handles both:
 *   HTML format  → "Hall, Breece NYJ RB (Q)"  →  namePart="Hall, Breece", team="NYJ"
 *   API format   → "Breece Hall",  team="NYJ"
 *
 * Strategy: strip commas, lowercase, split into words, sort alphabetically, rejoin.
 * Sorting means "Hall Breece" and "Breece Hall" both become "breece hall".
 * Appending the NFL team code ensures players with the same name on different teams
 * are matched correctly.
 *
 * Result: "breece hall-NYJ"
 */
function makeNameKey(namePart: string, teamCode: string): string {
  const normalized = namePart
    .replace(/,/g, '')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0)
    .sort()
    .join(' ');
  return `${normalized}-${teamCode.toUpperCase()}`;
}

export async function GET() {
  const MFL_HTML_URL   = `https://${SERVER}.myfantasyleague.com/${SEASON_YEAR}/options?L=${LEAGUE_ID}&O=07&PRINTER=1`;
  const MFL_SCORES_URL = `https://api.myfantasyleague.com/${SEASON_YEAR}/export?TYPE=playerScores&L=${LEAGUE_ID}&W=YTD&JSON=1`;

  try {
    // Phase 1: Fetch HTML roster data and YTD scores in parallel
    const [htmlResponse, scoresResponse] = await Promise.all([
      fetch(MFL_HTML_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        next: { revalidate: 0 },
      }),
      fetch(MFL_SCORES_URL, { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    if (!htmlResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch MFL data' }, { status: 500 });
    }

    // Phase 2: Build score map from playerScores, then fetch player names for those IDs
    const scoreMap = new Map<string, number>(); // playerID → YTD score
    const playerIds: string[] = [];

    if (scoresResponse?.ok) {
      try {
        const scoresJson = await scoresResponse.json();
        const scorePlayers = scoresJson?.playerScores?.player;
        if (scorePlayers) {
          const arr = Array.isArray(scorePlayers) ? scorePlayers : [scorePlayers];
          for (const sp of arr) {
            const score = parseFloat(sp.score);
            if (sp.id && score > 0) {
              scoreMap.set(String(sp.id), score);
              playerIds.push(String(sp.id));
            }
          }
        }
      } catch { /* continue without scores */ }
    }

    // Fetch player name + NFL team for every scored player ID, then build a
    // normalized "name-TEAM" → score lookup used during HTML parsing below.
    const nameKeyToScore = new Map<string, number>();
    if (playerIds.length > 0) {
      try {
        const playersUrl = `https://api.myfantasyleague.com/${SEASON_YEAR}/export?TYPE=players&PLAYERS=${playerIds.join(',')}&DETAILS=1&JSON=1`;
        const playersRes = await fetch(playersUrl, { next: { revalidate: 86400 } });
        if (playersRes.ok) {
          const playersJson = await playersRes.json();
          const pList = playersJson?.players?.player;
          if (pList) {
            const arr = Array.isArray(pList) ? pList : [pList];
            for (const p of arr) {
              const score = scoreMap.get(String(p.id));
              if (score != null && p.name && p.team) {
                nameKeyToScore.set(makeNameKey(p.name, p.team), score);
              }
            }
          }
        }
      } catch { /* continue without name lookup */ }
    }

    // Phase 3: Parse HTML roster, attaching scores via name+team key
    const htmlText = await htmlResponse.text();
    const players = [];

    const sections = htmlText.split('<caption');

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];

      // Extract Team Name directly from the caption's <a> tag
      const teamMatch = section.match(/<a[^>]*>([\s\S]*?)<\/a>/);
      const teamName = teamMatch ? teamMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown Team';

      // Process Rows
      const rows = section.split('<tr');
      let isTaxiSquad = false;

      for (const rowFragment of rows) {
        const row = '<tr' + rowFragment;

        // Check for Taxi Squad Header
        if (row.includes('Taxi Squad') && row.includes('<th')) {
          isTaxiSquad = true;
          continue;
        }

        if (!row.includes('class="player"')) continue;

        // Robust Extraction
        const playerMatch   = row.match(/class="player">([\s\S]*?)<\/td>/);
        const salaryMatch   = row.match(/class="salary">([\s\S]*?)<\/td>/);
        const yearsMatch    = row.match(/class="contractyear">([\s\S]*?)<\/td>/);
        const baseMatch     = row.match(/class="contractstatus">([\s\S]*?)<\/td>/);
        const infoMatch     = row.match(/class="contractinfo">([\s\S]*?)<\/td>/);
        const acquiredMatch = row.match(/class="drafted">([\s\S]*?)<\/td>/);

        if (playerMatch) {
          const clean = (text: string) => text.replace(/<[^>]*>/g, '').trim();
          const pName = clean(playerMatch[1]);

          // Skip non-player rows like "Salary Adjustments (3)"
          if (pName.toLowerCase().includes('salary adjustment')) continue;

          // Parse the HTML player name to extract the core name and NFL team code.
          // HTML format: "Hall, Breece NYJ RB" or "Hall, Breece NYJ RB (Q)"
          //   tokens:     [0]       [1]    [2]  [3]        [4]
          //   endIdx points at the position token (skipping trailing parentheticals)
          //   NFL team = token at endIdx-1
          //   Name part = tokens 0…endIdx-2
          const parts  = pName.split(/\s+/);
          let endIdx   = parts.length - 1;
          if (endIdx >= 0 && parts[endIdx].startsWith('(')) endIdx--; // skip (Q)/(I)/etc.
          const nflTeam  = endIdx >= 1 ? parts[endIdx - 1] : '';
          const namePart = parts.slice(0, Math.max(0, endIdx - 1)).join(' '); // "Hall, Breece"

          // Look up the season total using the normalized name+team key
          const nameKey = makeNameKey(namePart, nflTeam);
          const points  = nameKeyToScore.has(nameKey) ? nameKeyToScore.get(nameKey)! : null;

          players.push({
            Team:     teamName,
            Player:   pName,
            Salary:   salaryMatch   ? clean(salaryMatch[1]).replace(/[^0-9.]/g, '') : '0',
            Years:    yearsMatch    ? clean(yearsMatch[1]) : '',
            Base:     baseMatch     ? clean(baseMatch[1]).replace(/[^0-9.]/g, '') : '0',
            Info:     infoMatch     ? clean(infoMatch[1]) : '',
            Acquired: acquiredMatch ? clean(acquiredMatch[1]) : '',
            IsTaxi:   isTaxiSquad,
            Points:   points,
          });
        }
      }
    }

    return NextResponse.json(players);

  } catch (error: any) {
    console.error('MMH API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
