import { NextResponse } from 'next/server';
import { mflExport, LeagueCode } from '@/lib/mfl';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update the season when ready to roll to a new one.
const LEAGUES: Record<LeagueCode, { leagueId: string; season: string }> = {
  kkl: { leagueId: '45267', season: '2026' },
  kdl: { leagueId: '68756', season: '2026' },
  mmh: { leagueId: '72966', season: '2026' },
  bsb: { leagueId: '62908', season: '2026' },
};

const toArray = <T,>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const num = (v: unknown) => {
  const n = parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : 0;
};
const wlt = (v: unknown) => {
  const [w, l, t] = String(v ?? '').split('-').map((x) => parseInt(x, 10) || 0);
  return { w: w ?? 0, l: l ?? 0, t: t ?? 0 };
};

export interface StandingsRow {
  rank: number;
  divisionRank: number | null;
  franchiseId: string;
  team: string;
  division: string;
  wins: number;
  losses: number;
  ties: number;
  pct: number;
  divWins: number;
  divLosses: number;
  divTies: number;
  pointsFor: number;
  pointsAgainst: number;
  avgPointsFor: number;
  avgPointsAgainst: number;
  streak: string;
}

const CSV_COLUMNS: [string, (r: StandingsRow) => string | number][] = [
  ['Rank', (r) => r.rank],
  ['Team', (r) => r.team],
  ['Division', (r) => r.division],
  ['Div Rank', (r) => r.divisionRank ?? ''],
  ['W', (r) => r.wins],
  ['L', (r) => r.losses],
  ['T', (r) => r.ties],
  ['Pct', (r) => r.pct.toFixed(3)],
  ['Div W', (r) => r.divWins],
  ['Div L', (r) => r.divLosses],
  ['Div T', (r) => r.divTies],
  ['PF', (r) => r.pointsFor.toFixed(2)],
  ['PA', (r) => r.pointsAgainst.toFixed(2)],
  ['Avg PF', (r) => r.avgPointsFor.toFixed(1)],
  ['Avg PA', (r) => r.avgPointsAgainst.toFixed(1)],
  ['Streak', (r) => r.streak],
  ['Franchise ID', (r) => r.franchiseId],
];

function toCsv(rows: StandingsRow[]) {
  const cell = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [CSV_COLUMNS.map(([h]) => h).join(','), ...rows.map((r) => CSV_COLUMNS.map(([, f]) => cell(f(r))).join(','))].join('\r\n') + '\r\n';
}

/**
 * Current standings for one league, from MFL's leagueStandings export joined to
 * franchise names and divisions from the league export.
 *
 *   /api/standings/kkl              JSON for the standings page
 *   /api/standings/kkl?format=csv   CSV, for Excel's Data > From Web
 *
 * Rows keep MFL's order, which already applies the league's tiebreakers, so
 * that order is the overall rank. Only names and divisions leave this route:
 * with an API key the league export also carries owner emails and usernames.
 */
export async function GET(request: Request, { params }: { params: Promise<{ league: string }> }) {
  const code = (await params).league.toLowerCase() as LeagueCode;
  const cfg = LEAGUES[code];
  if (!cfg) return NextResponse.json({ error: 'unknown league' }, { status: 404 });

  try {
    const opts = { leagueId: cfg.leagueId, code, revalidate: 300 };
    const [standingsJson, leagueJson] = await Promise.all([
      mflExport(cfg.season, 'leagueStandings', opts),
      mflExport(cfg.season, 'league', opts),
    ]);

    const league = leagueJson?.league ?? {};
    const divisionName = new Map(toArray<any>(league.divisions?.division).map((d) => [d.id, d.name]));
    const franchises = new Map(
      toArray<any>(league.franchises?.franchise).map((f) => [
        f.id,
        { name: String(f.name ?? f.id).trim(), division: divisionName.get(f.division) ?? '' },
      ])
    );

    const divisionCounter = new Map<string, number>();
    const rows: StandingsRow[] = toArray<any>(standingsJson?.leagueStandings?.franchise).map((s, i) => {
      const f = franchises.get(s.id) ?? { name: s.id, division: '' };
      const rec = s.h2hwlt ? wlt(s.h2hwlt) : { w: num(s.h2hw), l: num(s.h2hl), t: num(s.h2ht) };
      const div = wlt(s.divwlt);
      let divisionRank: number | null = null;
      if (f.division) {
        divisionRank = (divisionCounter.get(f.division) ?? 0) + 1;
        divisionCounter.set(f.division, divisionRank);
      }
      return {
        rank: i + 1,
        divisionRank,
        franchiseId: s.id,
        team: f.name,
        division: f.division,
        wins: rec.w,
        losses: rec.l,
        ties: rec.t,
        pct: num(s.h2hpct),
        divWins: div.w,
        divLosses: div.l,
        divTies: div.t,
        pointsFor: num(s.pf),
        pointsAgainst: num(s.pa),
        avgPointsFor: num(s.avgpf),
        avgPointsAgainst: num(s.avgpa),
        streak: String(s.strk ?? ''),
      };
    });

    if (new URL(request.url).searchParams.get('format') === 'csv') {
      // Leading BOM so Excel reads the file as UTF-8 — without it, apostrophes
      // like the curly one in "Hawking’s" open as mojibake.
      return new NextResponse('\uFEFF' + toCsv(rows), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `inline; filename="${code}-standings-${cfg.season}.csv"`,
        },
      });
    }

    return NextResponse.json({
      league: code,
      leagueName: String(league.name ?? code.toUpperCase()).trim(),
      leagueId: cfg.leagueId,
      season: cfg.season,
      divisions: [...divisionName.values()],
      fetchedAt: new Date().toISOString(),
      rows,
    });
  } catch (error: any) {
    console.error(`Standings (${code}) API Error:`, error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
