import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year when ready to roll to new season
const SEASON_YEAR = '2025';
const SERVER = 'www47';
const LEAGUE_ID = '72966';

export async function GET() {
  const MFL_HTML_URL  = `https://${SERVER}.myfantasyleague.com/${SEASON_YEAR}/options?L=${LEAGUE_ID}&O=07&PRINTER=1`;
  const MFL_SCORES_URL = `https://api.myfantasyleague.com/${SEASON_YEAR}/export?TYPE=playerScores&L=${LEAGUE_ID}&W=YTD&JSON=1`;

  try {
    // Fetch roster HTML and YTD player scores in parallel
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

    // Build score map: MFL playerID → YTD fantasy points
    const scoreMap = new Map<string, number>();
    if (scoresResponse?.ok) {
      try {
        const scoresJson = await scoresResponse.json();
        const scorePlayers = scoresJson?.playerScores?.player;
        if (scorePlayers) {
          const arr = Array.isArray(scorePlayers) ? scorePlayers : [scorePlayers];
          for (const sp of arr) {
            if (sp.id) scoreMap.set(String(sp.id), parseFloat(sp.score) || 0);
          }
        }
      } catch {
        // Scores parse error — continue without points data
      }
    }

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
          const rawPlayerCell = playerMatch[1];

          // Extract MFL player ID from the link in the player cell.
          // MFL typically renders: <a href="...PlayerID=12345...">Name</a>
          const playerIdMatch =
            rawPlayerCell.match(/PlayerID=(\d+)/i) ||
            rawPlayerCell.match(/player_detail[^"]*?id=(\d+)/i) ||
            rawPlayerCell.match(/\/player\/(\d+)/i);
          const playerId = playerIdMatch ? playerIdMatch[1] : '';

          const clean = (text: string) => text.replace(/<[^>]*>/g, '').trim();
          const pName = clean(rawPlayerCell);

          // Skip non-player rows like "Salary Adjustments (3)"
          if (pName.toLowerCase().includes('salary adjustment')) continue;

          players.push({
            Team: teamName,
            Player: pName,
            Salary: salaryMatch   ? clean(salaryMatch[1]).replace(/[^0-9.]/g, '') : '0',
            Years:  yearsMatch    ? clean(yearsMatch[1]) : '',
            Base:   baseMatch     ? clean(baseMatch[1]).replace(/[^0-9.]/g, '') : '0',
            Info:   infoMatch     ? clean(infoMatch[1]) : '',
            Acquired: acquiredMatch ? clean(acquiredMatch[1]) : '',
            IsTaxi: isTaxiSquad,
            // null when no player ID found in HTML (shows "—" in UI)
            Points: playerId ? (scoreMap.get(playerId) ?? null) : null,
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
