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
 * Teams sit in side-by-side column groups on "Keeper Info" — six down B..L and
 * six more down R..Z. Blocks are located by their shape (a team name with
 * "Player" directly beneath) rather than by fixed columns, so re-arranging or
 * adding a group needs no change here. See parseBlocks for the column offsets.
 *
 * The draft-pick column is NOT row-aligned with the players — it is that team's
 * own list of picks running down the block, so it is collected separately.
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
  return { rowCount: ws.rowCount, columnCount: ws.columnCount, cell, wb };
}

/**
 * The teams are laid out in side-by-side column groups — six down columns B..L
 * and six more down R..Z — so blocks are found by their signature rather than
 * by hard-coded columns: a team name in some column with "Player" directly
 * beneath it. Adding another group to the workbook needs no change here.
 *
 * Column offsets within a block, relative to the name column:
 *   +0 Player  +1 PY Points  +2 PY Round Drafted  +3 Years  +4 Keeper
 *   +6 Keeper Selection  +7 Selection Draft Pick  +8 Draft Picks
 */
const COL = { points: 1, pyRound: 2, years: 3, keeper: 4, selected: 6, keeperPick: 7, picks: 8 };

function parseBlocks({ rowCount, columnCount, cell }) {
  const teams = [];
  for (let r = 1; r <= rowCount; r++) {
    for (let c = 1; c <= columnCount; c++) {
      const name = cell(r, c);
      if (!name || clean(cell(r + 1, c)) !== 'Player') continue;

      const team = { team: clean(name), players: [], draftPicks: [] };
      for (let pr = r + 2; pr <= rowCount; pr++) {
        // Stop at the next block in this same column group.
        if (cell(pr, c) && clean(cell(pr + 1, c)) === 'Player') break;

        // The draft-pick column runs independently of the player rows.
        const pick = formatPick(cell(pr, c + COL.picks));
        if (pick) team.draftPicks.push(pick);

        const label = clean(cell(pr, c));
        if (!label || label === 'Player') continue;

        const years = clean(cell(pr, c + COL.years));
        const keeper = clean(cell(pr, c + COL.keeper));
        const eligible = years.toUpperCase() !== 'NA' && keeper.toUpperCase() !== 'NA';

        team.players.push({
          player: label,
          pyPoints: numOrNull(cell(pr, c + COL.points)),
          pyRoundDrafted: numOrNull(cell(pr, c + COL.pyRound)),
          yearsRemaining: eligible ? numOrNull(cell(pr, c + COL.years)) : null,
          keeperRound: eligible ? keeper : null,
          eligible,
          selected: clean(cell(pr, c + COL.selected)).toLowerCase() === 'x',
          keeperDraftPick: formatPick(cell(pr, c + COL.keeperPick)),
        });
      }
      teams.push(team);
    }
  }
  return teams;
}

/**
 * Optional "TeamAliases" sheet mapping a prior-year team name to its current
 * name. The roster data is built from last season, so a team that renamed (or
 * changed owner) still carries its old label; without this it cannot be matched
 * to a current MFL franchise. Two columns, header row then pairs:
 *
 *   PriorYearTeam            CurrentYearTeam
 *   Wa Wa Wee Wa             Dirty Mike and the Boys
 *   Guinness All Blacks      Hey Donkeys
 */
function readAliases(wb) {
  const map = new Map();

  // Repo-side file first, so aliases survive the workbook being regenerated
  // (the distro copy carries only Keeper Info and Keeper Rules).
  const local = path.join(ROOT, 'scripts/kkl-team-aliases.json');
  let source = null;
  if (fs.existsSync(local)) {
    const json = JSON.parse(fs.readFileSync(local, 'utf8'));
    for (const [from, to] of Object.entries(json.aliases ?? {})) map.set(from, to);
    if (map.size) source = 'kkl-team-aliases.json';
  }

  const ws =
    wb.getWorksheet('TeamAliases') ||
    wb.worksheets.find((s) => /alias/i.test(s.name));
  if (!ws) return { map, sheet: source };
  for (let r = 1; r <= ws.rowCount; r++) {
    const from = clean(ws.getCell(r, 1).value);
    const to = clean(ws.getCell(r, 2).value);
    if (!from || !to) continue;
    if (/prior|old|last/i.test(from) && /current|new/i.test(to)) continue; // header
    map.set(from, to); // sheet wins over the repo file
  }
  return { map, sheet: source ? `${source} + ${ws.name}` : ws.name };
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node scripts/kkl-keeper-import.mjs <keeper-info.xlsx>');
    process.exit(2);
  }

  const sheet = await readSheet(file);
  const teams = parseBlocks(sheet);
  const { map: aliases, sheet: aliasSheet } = readAliases(sheet.wb);

  const [players, league] = await Promise.all([mflJson('players'), mflJson('league')]);
  const idByName = new Map(toArray(players?.players?.player).map((p) => [p.name.trim(), p.id]));
  const franchises = toArray(league?.league?.franchises?.franchise);
  const idByTeam = new Map(franchises.map((f) => [f.name.trim(), f.id]));

  const unresolvedPlayers = [];
  const unresolvedTeams = [];

  for (const t of teams) {
    // Prior-year label -> current franchise, when the team renamed.
    const alias = aliases.get(t.team);
    if (alias) {
      t.priorYearTeam = t.team;
      t.team = alias;
    }
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
  console.log(
    `aliases  ${aliasSheet ? `${aliases.size} from "${aliasSheet}"` : 'no TeamAliases sheet found'}`
  );
  console.log(`teams    ${teams.length} of ${franchises.length} in the league`);
  console.log(`players  ${totalPlayers} (${totalSelected} marked as keepers)`);
  console.log(`wrote    ${path.relative(ROOT, OUT)}`);

  if (unresolvedTeams.length) {
    console.warn(`\n!! ${unresolvedTeams.length} team name(s) not in MFL — franchiseId is null:`);
    for (const t of unresolvedTeams) console.warn(`     ${t}`);
    console.warn(
      '   Add a "TeamAliases" sheet to the workbook (PriorYearTeam | CurrentYearTeam)\n' +
        '   mapping each to its current MFL name, or rename it in the workbook.'
    );
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
