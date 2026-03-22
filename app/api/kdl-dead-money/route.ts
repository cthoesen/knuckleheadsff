import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// TargetYear: the season in which players were cut (current season)
// NewYear:    the season in which dead money will be charged
const TARGET_YEAR = '2025';
const NEW_YEAR = '2026';
const SERVER = 'www47';
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
  franchise: string;
  playerCut: string;
  salaryWhenCut: number;
  yearsWhenCut: number;
  salarCapPenalty: number; // in-season penalty (already applied by MFL)
  deadMoney: number;       // next-season dead money charge
  dateCut: string;
  timeCut: string;
}

export async function GET() {
  const MFL_URL = `https://${SERVER}.myfantasyleague.com/${TARGET_YEAR}/options?L=${LEAGUE_ID}&O=142&PRINTER=1`;

  try {
    const response = await fetch(MFL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch MFL salary adjustments' }, { status: 500 });
    }

    const html = await response.text();

    // The O=142 page renders a table with columns: Franchise | Amount | Explanation | Date
    // Each data row is a <tr> with <td> cells.
    // We'll extract rows by splitting on <tr and parsing each one.

    const rows: CutRow[] = [];

    // Split into rows
    const rawRows = html.split(/<tr[\s>]/i);

    for (const rawRow of rawRows) {
      // Each cell is wrapped in <td ... >content</td>
      const cells = [...rawRow.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m =>
        m[1].replace(/<[^>]*>/g, '').trim()
      );

      if (cells.length < 4) continue;

      const [franchise, amountStr, explanation, dateRaw] = cells;

      // Skip header-like rows and PY Dead Money entries (already-applied next-season penalties)
      if (!franchise || franchise.toLowerCase() === 'franchise') continue;
      if (explanation.includes('PY Dead Money')) continue;

      // Only process rows that represent a player cut (explanation contains "Dropped")
      if (!explanation.includes('Dropped')) continue;

      // Parse amount (in-season penalty, stored as a negative number by MFL)
      const salarCapPenalty = Math.abs(parseFloat(amountStr.replace(/[^0-9.-]/g, '')) || 0);

      // Extract player name: "Dropped PlayerName (Salary: $N, Years:N)"
      const playerMatch = explanation.match(/Dropped\s+(.+?)\s+\(/);
      const playerCut = playerMatch ? playerMatch[1].trim() : explanation;

      // Extract salary
      const salaryMatch = explanation.match(/Salary:\s*\$?([\d.]+)/i);
      const salaryWhenCut = salaryMatch ? parseFloat(salaryMatch[1]) : 0;

      // Extract years — may or may not have a Status field after Years
      const yearsMatch = explanation.match(/Years:\s*(\d+)/i);
      const yearsWhenCut = yearsMatch ? parseInt(yearsMatch[1]) : 1;

      // Parse date — MFL format varies: "Fri Aug 1 10:30:00 a.m. MT 2025"
      let dateCut = '';
      let timeCut = '';
      try {
        // Strip leading day-of-week word if present
        const cleanDate = dateRaw.replace(/^[A-Za-z]+\s+/, '');
        // cleanDate is now like: "Aug 1 10:30:00 a.m. MT 2025"
        const parts = cleanDate.split(/\s+/);
        // parts: [Month, Day, Time, AMPM, TZ, Year]
        if (parts.length >= 6) {
          const monthNames: Record<string, number> = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
          };
          const month = monthNames[parts[0]] ?? 1;
          const day = parseInt(parts[1]);
          const year = parseInt(parts[5]);
          dateCut = `${month}/${day}/${year}`;
          const ampmNorm = parts[3].toLowerCase().includes('p') ? 'PM' : 'AM';
          timeCut = `${parts[2]} ${ampmNorm}`;
        } else {
          dateCut = cleanDate;
        }
      } catch {
        dateCut = dateRaw;
      }

      const deadMoney = calcDeadMoney(salaryWhenCut, yearsWhenCut);

      rows.push({
        franchise,
        playerCut,
        salaryWhenCut,
        yearsWhenCut,
        salarCapPenalty,
        deadMoney,
        dateCut,
        timeCut,
      });
    }

    // Sort by franchise name then by cut date descending
    rows.sort((a, b) => {
      const fc = a.franchise.localeCompare(b.franchise);
      if (fc !== 0) return fc;
      return b.dateCut.localeCompare(a.dateCut);
    });

    // Build per-franchise summary
    const franchiseMap = new Map<string, { cuts: CutRow[]; totalDeadMoney: number; totalInSeasonPenalty: number }>();
    for (const row of rows) {
      if (!franchiseMap.has(row.franchise)) {
        franchiseMap.set(row.franchise, { cuts: [], totalDeadMoney: 0, totalInSeasonPenalty: 0 });
      }
      const entry = franchiseMap.get(row.franchise)!;
      entry.cuts.push(row);
      entry.totalDeadMoney += row.deadMoney;
      entry.totalInSeasonPenalty += row.salarCapPenalty;
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
    console.error('Dead Money API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
