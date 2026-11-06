import { NextResponse } from 'next/server';
import { getLeagueRoster, LeagueCode, LeaguePlayer } from '@/lib/mfl';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update the season when ready to roll to a new one.
const LEAGUES: Record<LeagueCode, { leagueId: string; season: string }> = {
  kkl: { leagueId: '45267', season: '2026' },
  kdl: { leagueId: '68756', season: '2026' },
  mmh: { leagueId: '72966', season: '2026' },
  bsb: { leagueId: '62908', season: '2026' },
};

/**
 * What each league uses MFL's generic contract fields for. A field is listed
 * here only if the league uses it; columns that turn out empty for every
 * player are dropped anyway, so a field falling out of use needs no edit.
 */
type ContractField = 'salary' | 'contractYear' | 'contractStatus' | 'contractInfo' | 'acquired';
const CONTRACT_LABELS: Record<LeagueCode, Partial<Record<ContractField, string>>> = {
  kkl: { contractYear: 'Keeper Yrs', contractInfo: 'Keeper', acquired: 'Drafted' },
  kdl: { salary: 'Salary', contractYear: 'Years', contractStatus: 'Status', acquired: 'Acquired' },
  mmh: { salary: 'Salary', contractYear: 'Years', contractStatus: 'Base', contractInfo: 'Info', acquired: 'Drafted' },
  bsb: { contractYear: 'Keeper Yrs', contractInfo: 'Keeper', acquired: 'Drafted' },
};

const STATUS_LABEL: Record<string, string> = { ROSTER: 'Active', INJURED_RESERVE: 'IR', TAXI_SQUAD: 'Taxi' };
const STATUS_ORDER = ['Active', 'IR', 'Taxi'];
const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE', 'PK', 'TMPK', 'Def', 'DT', 'DE', 'LB', 'CB', 'S'];
const rankOf = (list: string[], v: string) => {
  const i = list.indexOf(v);
  return i < 0 ? list.length : i;
};

type Cell = string | number;
export interface RosterColumn {
  key: string;
  label: string;
  numeric?: boolean;
}

const PICK = /^\d+\.\d+$/;

function buildTable(code: LeagueCode, players: LeaguePlayer[], pointsSeason: string | null) {
  const labels = CONTRACT_LABELS[code];
  const has = (f: ContractField) =>
    !!labels[f] && players.some((p) => (f === 'salary' || f === 'contractYear' ? Number(p[f]) > 0 : String(p[f]).trim() !== ''));

  // A column of draft picks ("10.10") would be read by Excel as the number 10.1,
  // losing the slot, so it is split into two whole-number columns instead.
  const acquiredValues = players.map((p) => p.acquired).filter(Boolean);
  const acquiredIsPick = acquiredValues.length > 0 && acquiredValues.every((v) => PICK.test(v));

  const columns: RosterColumn[] = [
    { key: 'team', label: 'Team' },
    { key: 'player', label: 'Player' },
    { key: 'pos', label: 'Pos' },
    { key: 'nfl', label: 'NFL' },
    { key: 'status', label: 'Status' },
    { key: 'injury', label: 'Injury' },
  ];
  if (has('salary')) columns.push({ key: 'salary', label: labels.salary!, numeric: true });
  if (has('contractYear')) columns.push({ key: 'contractYear', label: labels.contractYear!, numeric: true });
  if (has('contractStatus')) columns.push({ key: 'contractStatus', label: labels.contractStatus! });
  if (has('contractInfo')) columns.push({ key: 'contractInfo', label: labels.contractInfo! });
  if (has('acquired')) {
    if (acquiredIsPick) {
      columns.push({ key: 'draftRound', label: `${labels.acquired} Rd`, numeric: true });
      columns.push({ key: 'draftPick', label: `${labels.acquired} Pick`, numeric: true });
    } else {
      columns.push({ key: 'acquired', label: labels.acquired! });
    }
  }
  if (players.some((p) => p.isRookie)) columns.push({ key: 'rookie', label: 'Rookie' });
  if (pointsSeason) columns.push({ key: 'points', label: `${pointsSeason} Pts`, numeric: true });
  columns.push({ key: 'playerId', label: 'Player ID' }, { key: 'franchiseId', label: 'Franchise ID' });

  const rows = players
    .map((p) => {
      const status = STATUS_LABEL[p.status] ?? p.status;
      const [rd, pk] = acquiredIsPick && PICK.test(p.acquired) ? p.acquired.split('.').map(Number) : ['', ''];
      const row: Record<string, Cell> = {
        team: p.franchise,
        player: p.name,
        pos: p.position,
        nfl: p.nflTeam,
        status,
        injury: p.injuryStatus,
        salary: p.salary || '',
        contractYear: p.contractYear || '',
        contractStatus: p.contractStatus,
        contractInfo: p.contractInfo,
        acquired: p.acquired,
        draftRound: rd,
        draftPick: pk,
        rookie: p.isRookie ? 'R' : '',
        points: p.points == null ? '' : Number(p.points.toFixed(2)),
        playerId: p.id,
        franchiseId: p.franchiseId,
      };
      return row;
    })
    // Team, then active before IR before taxi, then lineup position order,
    // then best scorer first.
    .sort(
      (a, b) =>
        String(a.team).localeCompare(String(b.team)) ||
        rankOf(STATUS_ORDER, String(a.status)) - rankOf(STATUS_ORDER, String(b.status)) ||
        rankOf(POSITION_ORDER, String(a.pos)) - rankOf(POSITION_ORDER, String(b.pos)) ||
        (Number(b.points) || 0) - (Number(a.points) || 0) ||
        String(a.player).localeCompare(String(b.player))
    )
    .map((r) => Object.fromEntries(columns.map((c) => [c.key, r[c.key] ?? ''])));

  return { columns, rows };
}

function toCsv(columns: RosterColumn[], rows: Record<string, Cell>[]) {
  const cell = (v: Cell) => {
    const s = String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.map((c) => cell(c.label)).join(','), ...rows.map((r) => columns.map((c) => cell(r[c.key])).join(','))].join('\r\n') + '\r\n';
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Every rostered player in one league, flattened into spreadsheet rows.
 *
 *   /api/rosters/kkl                          JSON for the rosters page
 *   /api/rosters/kkl?format=csv               CSV, all teams
 *   /api/rosters/kkl?format=csv&team=0003     CSV, one franchise
 *
 * The column list is decided here and returned with the rows, so the page,
 * its copy button and the CSV always agree.
 */
export async function GET(request: Request, { params }: { params: Promise<{ league: string }> }) {
  const code = (await params).league.toLowerCase() as LeagueCode;
  const cfg = LEAGUES[code];
  if (!cfg) return NextResponse.json({ error: 'unknown league' }, { status: 404 });

  try {
    const { players, pointsSeason } = await getLeagueRoster({ code, ...cfg }, { fresh: true });
    const { columns, rows: allRows } = buildTable(code, players, pointsSeason);

    const teams = [...new Map(allRows.map((r) => [String(r.franchiseId), String(r.team)])).entries()]
      .map(([id, name]) => ({ id, name, players: allRows.filter((r) => r.franchiseId === id).length }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const url = new URL(request.url);
    const team = url.searchParams.get('team');
    if (team && !teams.some((t) => t.id === team)) {
      return NextResponse.json({ error: 'unknown team' }, { status: 404 });
    }
    const rows = team ? allRows.filter((r) => r.franchiseId === team) : allRows;

    if (url.searchParams.get('format') === 'csv') {
      const teamName = team ? teams.find((t) => t.id === team)!.name : 'all-teams';
      // Leading BOM so Excel reads the file as UTF-8 (curly apostrophes in names).
      return new NextResponse('﻿' + toCsv(columns, rows), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `inline; filename="${code}-rosters-${cfg.season}-${slug(teamName)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      league: code,
      season: cfg.season,
      pointsSeason,
      fetchedAt: new Date().toISOString(),
      teams,
      columns,
      rows,
    });
  } catch (error: any) {
    console.error(`Rosters (${code}) API Error:`, error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
