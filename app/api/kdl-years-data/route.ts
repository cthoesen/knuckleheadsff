import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year to match the current season
const SEASON_YEAR = '2026';
const SERVER = 'www47';
const LEAGUE_ID = '68756';

export async function GET() {
  const MFL_URL = `https://${SERVER}.myfantasyleague.com/${SEASON_YEAR}/options?L=${LEAGUE_ID}&O=07&PRINTER=1`;

  try {
    const response = await fetch(MFL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch MFL data" }, { status: 500 });
    }

    const htmlText = await response.text();
    const players = [];

    const sections = htmlText.split('<caption');

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];

      // Extract Team Name directly from the caption's <a> tag
      const teamMatch = section.match(/<a[^>]*>([\s\S]*?)<\/a>/);
      const teamName = teamMatch ? teamMatch[1].replace(/<[^>]*>/g, '').trim() : "Unknown Team";

      // Process Rows
      const rows = section.split('<tr');
      let isTaxiSquad = false;

      for (const rowFragment of rows) {
        const row = '<tr' + rowFragment;

        if (row.includes('Taxi Squad') && row.includes('<th')) {
          isTaxiSquad = true;
          continue;
        }

        if (!row.includes('class="player"')) continue;

        const playerMatch = row.match(/class="player">([\s\S]*?)<\/td>/);
        const salaryMatch = row.match(/class="salary">([\s\S]*?)<\/td>/);
        const yearsMatch = row.match(/class="contractyear">([\s\S]*?)<\/td>/);

        if (playerMatch) {
          const clean = (text: string) => text.replace(/<[^>]*>/g, '').trim();

          const pName = clean(playerMatch[1]);
          const years = yearsMatch ? clean(yearsMatch[1]) : '';

          // Only include players with 0 or blank years
          if (years === '' || years === '0') {
            const nameParts = pName.split(' ');
            const rawPos = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'UNK';
            const position = rawPos.replace(/[^a-zA-Z]/g, '');

            players.push({
              Team: teamName,
              Player: pName,
              Position: position,
              Salary: salaryMatch ? clean(salaryMatch[1]).replace(/[^0-9.]/g, '') : '0',
              Years: years,
              IsTaxi: isTaxiSquad
            });
          }
        }
      }
    }

    return NextResponse.json(players);

  } catch (error: any) {
    console.error("KDL Years API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
