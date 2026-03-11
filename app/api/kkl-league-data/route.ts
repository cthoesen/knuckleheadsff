import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year when ready to roll to new season
const SEASON_YEAR = '2025';
const SERVER = 'www47';
const LEAGUE_ID = '45267';

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
      console.error(`MFL Fetch Error: ${response.status}`);
      return NextResponse.json({ error: "Failed to fetch MFL data" }, { status: 500 });
    }

    const htmlText = await response.text();
    const players = [];

    // Split by caption to isolate each team's table
    const sections = htmlText.split('<caption');

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];

      // Extract Team Name directly from the caption's <a> tag
      const teamMatch = section.match(/<a[^>]*>([\s\S]*?)<\/a>/);
      const teamName = teamMatch ? teamMatch[1].replace(/<[^>]*>/g, '').trim() : "Unknown Team";

      const rowMatches = section.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs);

      for (const row of rowMatches) {
        const rowContent = row[1];
        if (rowContent.includes('<th')) continue;

        const playerMatch = rowContent.match(/<td class="player">(.*?)<\/td>/s);
        const yearsMatch = rowContent.match(/<td class="contractyear">([^<]*)<\/td>/);
        const keeperMatch = rowContent.match(/<td class="contractinfo">([^<]*)/);
        const acquiredMatch = rowContent.match(/<td class="drafted">([^<]*)<\/td>/);

        if (playerMatch) {
          const cleanPlayerName = playerMatch[1].replace(/<[^>]*>/g, '').trim();

          players.push({
            Team: teamName,
            Player: cleanPlayerName,
            Years: yearsMatch ? yearsMatch[1].trim() : '',
            Keeper: keeperMatch ? keeperMatch[1].replace(/\n/g, ' ').trim() : '',
            Acquired: acquiredMatch ? acquiredMatch[1].trim() : ''
          });
        }
      }
    }

    return NextResponse.json(players);

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
