import { NextResponse } from 'next/server';
import { getLeagueRoster } from '@/lib/mfl';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year when ready to roll to new season
const SEASON_YEAR = '2026';
const LEAGUE_ID = '45267';

export async function GET() {
  try {
    const { players, pointsSeason } = await getLeagueRoster({
      code: 'kkl',
      leagueId: LEAGUE_ID,
      season: SEASON_YEAR,
    });
    return NextResponse.json({ players, pointsSeason, season: SEASON_YEAR });
  } catch (error: any) {
    console.error('KKL League Data API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
