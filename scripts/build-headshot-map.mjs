#!/usr/bin/env node
/**
 * Builds the MFL player id -> NFL.com headshot map used by /api/player-photo.
 *
 *   npm run headshots:build
 *
 * Joins two sources on ESPN's player id:
 *   - MFL's players export (DETAILS=1) gives us espn_id per MFL player id
 *   - nflverse-data's players.csv gives us a headshot URL per espn_id
 *
 * The headshots are NFL.com Cloudinary URLs; only the delivery type and public
 * id are stored, and the route rebuilds the URL with its own sizing transform.
 * That keeps this file small and lets the crop change without rebuilding it.
 *
 * Run it when rosters churn enough that new players are missing photos — the
 * map covers every MFL player it can match, not just currently rostered ones,
 * so it goes stale slowly. nflverse publishes players.csv on its own schedule.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'lib/nfl-headshots.json');
const SEASON = '2026';
const LEAGUE_ID = '45267'; // any league works; the players export is global
const NFLVERSE_CSV =
  'https://github.com/nflverse/nflverse-data/releases/download/players/players.csv';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Headshots come in two Cloudinary delivery types and they are NOT
 * interchangeable — asking for a private asset under /upload/ (or the reverse)
 * 404s. Store "<type>/<publicId>" so the route can rebuild either.
 *
 *   https://static.www.nfl.com/image/private/f_auto,q_auto/league/<id>
 *   https://static.www.nfl.com/image/upload/f_auto,q_auto/league/<id>
 */
function assetRefFrom(url) {
  const m = String(url || '').match(/\/image\/(private|upload)\/[^/]*\/league\/([A-Za-z0-9_-]+)$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

/** Minimal CSV reader — nflverse quotes fields containing commas. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

async function main() {
  process.stdout.write('fetching MFL players … ');
  const mflRes = await fetch(
    `https://api.myfantasyleague.com/${SEASON}/export?TYPE=players&L=${LEAGUE_ID}&JSON=1&DETAILS=1`,
    { headers: { 'User-Agent': UA } }
  );
  if (!mflRes.ok) throw new Error(`MFL players failed: ${mflRes.status}`);
  const mflPlayers = (await mflRes.json())?.players?.player ?? [];
  console.log(`${mflPlayers.length}`);

  process.stdout.write('fetching nflverse players.csv … ');
  const csvRes = await fetch(NFLVERSE_CSV, { headers: { 'User-Agent': UA } });
  if (!csvRes.ok) throw new Error(`nflverse fetch failed: ${csvRes.status}`);
  const rows = parseCsv(await csvRes.text());
  console.log(`${rows.length - 1} rows`);

  const header = rows[0];
  const iEspn = header.indexOf('espn_id');
  const iShot = header.indexOf('headshot');
  if (iEspn < 0 || iShot < 0) throw new Error('nflverse columns changed — espn_id/headshot missing');

  const shotByEspn = new Map();
  for (const r of rows.slice(1)) {
    const espn = r[iEspn];
    const pid = assetRefFrom(r[iShot]);
    if (espn && pid) shotByEspn.set(espn, pid);
  }

  const map = {};
  let noEspn = 0, unmatched = 0;
  for (const p of mflPlayers) {
    if (!p.espn_id) { noEspn++; continue; }
    const pid = shotByEspn.get(p.espn_id);
    if (pid) map[p.id] = pid;
    else unmatched++;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(
    OUT,
    JSON.stringify({ generatedAt: new Date().toISOString(), source: 'nflverse-data/players.csv', players: map }, null, 0) + '\n'
  );

  const size = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`\nmapped   ${Object.keys(map).length} MFL players to a headshot`);
  console.log(`no espn_id ${noEspn}  |  espn_id with no headshot ${unmatched}`);
  console.log(`wrote    ${path.relative(ROOT, OUT)} (${size} KB)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
