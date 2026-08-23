import { NextResponse } from 'next/server';
import { mflExport } from '@/lib/mfl';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// TargetYear: the season in which players were cut (current season)
// NewYear:    the season in which dead money will be charged
const TARGET_YEAR = '2026';
const NEW_YEAR = '2027';
const LEAGUE_ID = '68756';

// Dead money minimums by years-remaining-when-cut (bylaws)
const DEAD_MONEY_MINIMUMS: Record<number, number> = {
  2: 2,
  3: 5,
  4: 10,
  5: 20,
};

function calcDeadMoney(salary: number, yearsWhenCut: number): number {
  if (yearsWhenCut <= 1) return 0;
  const raw = (yearsWhenCut - 1) * 0.2 * salary;
  const minimum = DEAD_MONEY_MINIMUMS[yearsWhenCut] ?? 0;
  return Math.ceil(Math.max(raw, minimum));
}

export interface CutRow {
  franchiseId: string;
  franchise: string;
  playerCut: string;
  salaryWhenCut: number;
  yearsWhenCut: number;
  salaryCapPenalty: number; // in-season penalty (already applied by MFL)
  deadMoney: number;        // next-season dead money charge
  /** Unix seconds, straight from MFL. */
  timestamp: number;
  /** ISO 8601 instant of the cut. */
  cutAt: string;
}

export async function GET() {
  try {
    const [adjustments, leagueData] = await Promise.all([
      mflExport(TARGET_YEAR, 'salaryAdjustments', { leagueId: LEAGUE_ID, code: 'kdl' }),
      mflExport(TARGET_YEAR, 'league', { leagueId: LEAGUE_ID, code: 'kdl' }),
    ]);

    const franchiseNames = new Map<string, string>();
    const rawFranchises = leagueData?.league?.franchises?.franchise;
    for (const f of Array.isArray(rawFranchises) ? rawFranchises : [rawFranchises].filter(Boolean)) {
      franchiseNames.set(f.id, f.name);
    }

    const rawAdjustments = adjustments?.salaryAdjustments?.salaryAdjustment;
    const list = Array.isArray(rawAdjustments) ? rawAdjustments : [rawAdjustments].filter(Boolean);

    const rows: CutRow[] = [];
    for (const adj of list) {
      const description: string = adj?.description ?? '';

      // "PY Dead Money" rows are next-season penalties MFL has already applied;
      // only actual cuts ("Dropped …") generate a new charge.
      if (description.includes('PY Dead Money')) continue;
      if (!description.includes('Dropped')) continue;

      // e.g. "Dropped Penix Jr., Michael ATL QB (Salary: $5, Years: 2)"
      const playerMatch = description.match(/Dropped\s+(.+?)\s+\(/);
      const playerCut = playerMatch ? playerMatch[1].trim() : description;

      const salaryMatch = description.match(/Salary:\s*\$?([\d.]+)/i);
      const salaryWhenCut = salaryMatch ? parseFloat(salaryMatch[1]) : 0;

      const yearsMatch = description.match(/Years:\s*(\d+)/i);
      const yearsWhenCut = yearsMatch ? parseInt(yearsMatch[1], 10) : 1;

      // MFL stores the in-season penalty as the adjustment amount.
      const salaryCapPenalty = Math.abs(parseFloat(adj?.amount) || 0);

      const timestamp = parseInt(adj?.timestamp, 10) || 0;

      rows.push({
        franchiseId: adj?.franchise_id ?? '',
        franchise: franchiseNames.get(adj?.franchise_id) ?? adj?.franchise_id ?? '',
        playerCut,
        salaryWhenCut,
        yearsWhenCut,
        salaryCapPenalty,
        deadMoney: calcDeadMoney(salaryWhenCut, yearsWhenCut),
        timestamp,
        cutAt: timestamp ? new Date(timestamp * 1000).toISOString() : '',
      });
    }

    // Franchise name, then most-recent cut first.
    rows.sort((a, b) => {
      const fc = a.franchise.localeCompare(b.franchise);
      return fc !== 0 ? fc : b.timestamp - a.timestamp;
    });

    // Per-franchise summary
    const franchiseMap = new Map<
      string,
      { cuts: CutRow[]; totalDeadMoney: number; totalInSeasonPenalty: number }
    >();
    for (const row of rows) {
      if (!franchiseMap.has(row.franchise)) {
        franchiseMap.set(row.franchise, { cuts: [], totalDeadMoney: 0, totalInSeasonPenalty: 0 });
      }
      const entry = franchiseMap.get(row.franchise)!;
      entry.cuts.push(row);
      entry.totalDeadMoney += row.deadMoney;
      entry.totalInSeasonPenalty += row.salaryCapPenalty;
    }

    const franchises = Array.from(franchiseMap.entries()).map(([name, data]) => ({
      name,
      cuts: data.cuts,
      totalDeadMoney: data.totalDeadMoney,
      totalInSeasonPenalty: data.totalInSeasonPenalty,
    }));

    return NextResponse.json({
      targetYear: TARGET_YEAR,
      newYear: NEW_YEAR,
      franchises,
      allCuts: rows,
    });
  } catch (error: any) {
    console.error('KDL Dead Money API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
