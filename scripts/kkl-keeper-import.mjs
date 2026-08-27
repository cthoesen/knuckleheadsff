#!/usr/bin/env node
/**
 * Converts the KKL keeper-information workbook into the JSON that backs the
 * keeper board.
 *
 *   node scripts/kkl-keeper-import.mjs "/path/to/kkl-keeper-info-2026-distro.xlsx"
 *
 * Use the "-distro" workbook, not "-new": the distro copy is hard-coded values,
 * so it reads back without needing Excel to recalculate the formulas and Power
 * Query in the master.
 *
 * Sheet layout (as of the 2026 file): one block per team on "Keeper Info",
 * blocks 26 rows apart. A block is a team name alone in column B, a header row,
 * then player rows:
 *
 *   B Player   C PY Points   D PY Round Drafted   E Years   F Keeper (K-round)
 *   H Keeper Selection ("x")  I Keeper Selection Draft Pick   J Draft Picks
 *
 * Column J is NOT row-aligned with the players — it is that team's own list of
 * draft picks running down the block, so it is collected separately.
 *
 * Player names are resolved to MFL player ids against the live players export;
 * ids are what the app joins on, so a rename in either system cannot silently
 * mismatch a player. Anything that fails to resolve is reported and the exit
 * code is non-zero — this never writes a partially-resolved file silently.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ExcelJS = tryRequire('exceljs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'app/api/kkl-keepers/keeper-data.json');
const SEASON = '2026';
const LEAGUE_ID = '45267';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function tryRequire(name) {
  try {
    return require(name);
  } catch {
    return null;
  }
}

/** MFL pads several fields with a trailing CR, which Excel shows as _x000D_. */
const clean = (v) =>
  String(v ?? '')
    .replace(/_x000D_/g, '')
    .replace(/\r/g, '')
    .trim();

/**
 * Draft picks are stored as numbers, so 9.10 reads back as 9.1 and loses the
 * trailing zero. Rebuild "round.pick" with a two-digit pick.
 */
function formatPick(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') return value.trim() || null;
  const round = Math.floor(value);
  const pick = Math.round((value - round) * 100);
  return `${round}.${String(pick).padStart(2, '0')}`;
}

function numOrNull(v) {
  if (v == null || v === '' || clean(v).toUpperCase() === 'NA') return null;
  const n = typeof v === 'number' ? v : parseFloat(clean(v));
  return Number.isFinite(n) ? n : null;
}

async function mflJson(type, params = {}) {
  const qs = new URLSearchParams({ TYPE: type, L: LEAGUE_ID, JSON: '1', ...params });
  const res = await fetch(`https://api.myfantasyleague.com/${SEASON}/export?${qs}`, {
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`MFL ${type} failed: ${res.status}`);
  const json = await res.json();
  if (json?.error) throw new Error(`MFL ${type}: ${json.error.$t ?? json.error}`);
  return json;
}

const toArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

async function readSheet(file) {
  if (!ExcelJS) {
    throw new Error(
      'exceljs is not installed. Run:  npm install --save-dev exceljs\n' +
        '(kept as a devDependency — the site itself never reads the workbook.)'
    );
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  const ws = wb.getWorksheet('Keeper Info');
  if (!ws) throw new Error('sheet "Keeper Info" not found');
  const cell = (r, c) => {
    const v = ws.getCell(r, c).value;
    return v && typeof v === 'object' && 'result' in v ? v.result : v;
  };
  return { rowCount: ws.rowCount, cell };
}

function parseBlocks({ rowCount, cell }) {
  const teams = [];
  for (let r = 1; r <= rowCount; r++) {
    const name = cell(r, 2);
    // A team block opens with the name alone in column B (column C empty).
    if (!name || cell(r, 3) != null) continue;
    const team = { team: clean(name), headerRow: r + 1, players: [], draftPicks: [] };

    for (let pr = r + 2; pr <= rowCount; pr++) {
      const playerName = cell(pr, 2);
      const nextIsTeam = playerName && cell(pr, 3) == null;
      if (nextIsTeam) break; // next block started

      // Column J runs independently of the player rows.
      const pick = formatPick(cell(pr, 10));
      if (pick) team.draftPicks.push(pick);

      if (!playerName) continue;
      const label = clean(playerName);
      if (!label || label === 'Player') continue;

      const years = clean(cell(pr, 5));
      const keeper = clean(cell(pr, 6));
      const eligible = years.toUpperCase() !== 'NA' && keeper.toUpperCase() !== 'NA';

      team.players.push({
        player: label,
        pyPoints: numOrNull(cell(pr, 3)),
        pyRoundDrafted: numOrNull(cell(pr, 4)),
        yearsRemaining: eligible ? numOrNull(cell(pr, 5)) : null,
        keeperRound: eligible ? keeper : null,
        eligible,
        selected: clean(cell(pr, 8)).toLowerCase() === 'x',
        keeperDraftPick: formatPick(cell(pr, 9)),
      });
    }
    teams.push(team);
  }
  return teams;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node scripts/kkl-keeper-import.mjs <keeper-info.xlsx>');
    process.exit(2);
  }

  const teams = parseBlocks(await readSheet(file));

  const [players, league] = await Promise.all([mflJson('players'), mflJson('league')]);
  const idByName = new Map(toArray(players?.players?.player).map((p) => [p.name.trim(), p.id]));
  const franchises = toArray(league?.league?.franchises?.franchise);
  const idByTeam = new Map(franchises.map((f) => [f.name.trim(), f.id]));

  const unresolvedPlayers = [];
  const unresolvedTeams = [];

  for (const t of teams) {
    t.franchiseId = idByTeam.get(t.team) ?? null;
    if (!t.franchiseId) unresolvedTeams.push(t.team);
    for (const p of t.players) {
      p.playerId = idByName.get(p.player) ?? null;
      if (!p.playerId) unresolvedPlayers.push(`${t.team} — ${p.player}`);
    }
  }

  const totalPlayers = teams.reduce((n, t) => n + t.players.length, 0);
  const totalSelected = teams.reduce((n, t) => n + t.players.filter((p) => p.selected).length, 0);

  const payload = {
    league: 'kkl',
    season: SEASON,
    generatedAt: new Date().toISOString(),
    source: path.basename(file),
    teamsReported: teams.length,
    teamsInLeague: franchises.length,
    teams: teams.map(({ headerRow, ...t }) => t),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');

  console.log(`read     ${path.basename(file)}`);
  console.log(`teams    ${teams.length} of ${franchises.length} in the league`);
  console.log(`players  ${totalPlayers} (${totalSelected} marked as keepers)`);
  console.log(`wrote    ${path.relative(ROOT, OUT)}`);

  if (unresolvedTeams.length) {
    console.warn(`\n!! ${unresolvedTeams.length} team name(s) not in MFL — franchiseId is null:`);
    for (const t of unresolvedTeams) console.warn(`     ${t}`);
    console.warn('   Rename in the workbook to match MFL, or the board cannot link the team.');
  }
  if (unresolvedPlayers.length) {
    console.warn(`\n!! ${unresolvedPlayers.length} player(s) did not resolve to an MFL id:`);
    for (const p of unresolvedPlayers.slice(0, 20)) console.warn(`     ${p}`);
  }
  if (unresolvedTeams.length || unresolvedPlayers.length) process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
