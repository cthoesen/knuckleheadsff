import { NextResponse } from 'next/server';
import keeperData from './keeper-data.json';

export const dynamic = 'force-dynamic';

/**
 * Serves the keeper board's data.
 *
 * Unlike the other league routes this does not read MFL live: keeper
 * selections are hidden by MFL until the commissioner processes them, so they
 * exist only in the commissioner's workbook. keeper-data.json is generated
 * from it by scripts/kkl-keeper-import.mjs — see that file for the pipeline.
 *
 * Only selected keepers are exposed. Unselected players are a team's private
 * deliberation until the deadline; the Keeper Analyzer already covers "what
 * could I have kept".
 */
export async function GET() {
  try {
    const teams = (keeperData.teams ?? [])
      .map((t: any) => ({
        team: t.team,
        franchiseId: t.franchiseId,
        draftPicks: t.draftPicks ?? [],
        keepers: (t.players ?? [])
          .filter((p: any) => p.selected)
          .map((p: any) => ({
            playerId: p.playerId,
            player: p.player,
            keeperRound: p.keeperRound,
            keeperDraftPick: p.keeperDraftPick,
            yearsRemaining: p.yearsRemaining,
            pyRoundDrafted: p.pyRoundDrafted,
            pyPoints: p.pyPoints,
          }))
          // Cheapest keeper first — that is the order they come off the board.
          .sort((a: any, b: any) => pickValue(a.keeperDraftPick) - pickValue(b.keeperDraftPick)),
      }))
      .sort((a: any, b: any) => a.team.localeCompare(b.team));

    return NextResponse.json({
      season: keeperData.season,
      generatedAt: keeperData.generatedAt,
      teamsInLeague: keeperData.teamsInLeague,
      teamsReported: teams.filter((t) => t.keepers.length > 0).length,
      totalKeepers: teams.reduce((n, t) => n + t.keepers.length, 0),
      teams,
    });
  } catch (error: any) {
    console.error('KKL Keepers API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

/** "5.08" -> 508, so picks sort by round then slot rather than as decimals. */
function pickValue(pick?: string | null): number {
  if (!pick) return Number.MAX_SAFE_INTEGER;
  const [round, slot] = pick.split('.');
  return parseInt(round, 10) * 100 + (parseInt(slot, 10) || 0);
}
