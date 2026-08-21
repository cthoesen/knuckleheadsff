import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year when ready to roll to new season
const SEASON_YEAR = '2026';
const SERVER = 'www47';
const LEAGUE_ID = '72966';

export async function GET() {
  const MFL_URL = `https://${SERVER}.myfantasyleague.com/${SEASON_YEAR}/options?L=${LEAGUE_ID}&O=07&PRINTER=1`;

  try {
    const response = await fetch(MFL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch MFL data' }, { status: 500 });
    }

    const htmlText = await response.text();
    const players = [];

    // Each franchise has its own <caption> — split on that to get per-team sections
    const sections = htmlText.split('<caption');

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];

      // Extract Team Name from the franchise link inside the caption
      const teamMatch = section.match(/<a[^>]*>([\s\S]*?)<\/a>/);
      const teamName = teamMatch ? teamMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown Team';

      // Process rows — track which roster section we are in
      const rows = section.split('<tr');
      let isTaxiSquad = false;
      let isInjuredReserve = false;

      for (const rowFragment of rows) {
        const row = '<tr' + rowFragment;

        // Section header rows contain <th> — use them to track Taxi / IR state
        if (row.includes('<th')) {
          if (row.includes('Taxi Squad'))      { isTaxiSquad = true;  isInjuredReserve = false; }
          else if (row.includes('Injured Reserve')) { isTaxiSquad = false; isInjuredReserve = true; }
          continue;
        }

        if (!row.includes('class="player"')) continue;

        const clean = (text: string) => text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim();

        const playerMatch   = row.match(/class="player">([\s\S]*?)<\/td>/);
        const pointsMatch   = row.match(/class="points">([\s\S]*?)<\/td>/);
        const salaryMatch   = row.match(/class="salary">([\s\S]*?)<\/td>/);
        const yearsMatch    = row.match(/class="contractyear">([\s\S]*?)<\/td>/);
        const baseMatch     = row.match(/class="contractstatus">([\s\S]*?)<\/td>/);
        const infoMatch     = row.match(/class="contractinfo">([\s\S]*?)<\/td>/);
        const acquiredMatch = row.match(/class="drafted">([\s\S]*?)<\/td>/);

        if (!playerMatch) continue;

        const pName = clean(playerMatch[1]);

        // Skip non-player rows like "Salary Adjustments (3)"
        if (pName.toLowerCase().includes('salary adjustment')) continue;

        // Extract position from player name.
        // MFL format: "Mixon, Joe HOU RB (I)" — last token is status designation,
        // second-to-last is position, third-to-last is NFL team.
        const nameParts = pName.split(/\s+/);
        let posIdx = nameParts.length - 1;
        while (posIdx >= 0 && nameParts[posIdx].startsWith('(')) posIdx--;
        const position = posIdx >= 0 ? nameParts[posIdx].replace(/[^a-zA-Z]/g, '') : 'UNK';

        // Parse season points from the built-in class="points" column.
        // Regular players show a linked score; IR/unavailable players show "&dash;" which
        // cleans to an empty string — those get null.
        let points: number | null = null;
        if (pointsMatch) {
          const rawPts = clean(pointsMatch[1]);
          const parsed = parseFloat(rawPts);
          if (!isNaN(parsed)) points = parsed;
        }

        players.push({
          Team:     teamName,
          Player:   pName,
          Position: position,
          Salary:   salaryMatch   ? clean(salaryMatch[1]).replace(/[^0-9.]/g, '') : '0',
          Years:    yearsMatch    ? clean(yearsMatch[1]) : '',
          Base:     baseMatch     ? clean(baseMatch[1]).replace(/[^0-9.]/g, '') : '0',
          Info:     infoMatch     ? clean(infoMatch[1]) : '',
          Acquired: acquiredMatch ? clean(acquiredMatch[1]) : '',
          IsTaxi:   isTaxiSquad,
          IsIR:     isInjuredReserve,
          Points:   points,
        });
      }
    }

    return NextResponse.json(players);

  } catch (error: any) {
    console.error('MMH API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
