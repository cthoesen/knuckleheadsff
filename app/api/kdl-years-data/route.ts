import { NextResponse } from 'next/server';
import { getLeagueRoster } from '@/lib/mfl';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year when ready to roll to new season
const SEASON_YEAR = '2026';
const LEAGUE_ID = '68756';

export async function GET() {
  try {
    const { players, pointsSeason } = await getLeagueRoster({
      code: 'kdl',
      leagueId: LEAGUE_ID,
      season: SEASON_YEAR,
    });

    // This tool only reports players still missing a contract length —
    // MFL leaves those as a blank/zero contractYear.
    const unassigned = players.filter((p) => p.contractYear === 0);

    return NextResponse.json({ players: unassigned, pointsSeason, season: SEASON_YEAR });
  } catch (error: any) {
    console.error('KDL Years Data API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
