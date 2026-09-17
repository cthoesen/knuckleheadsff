#!/usr/bin/env node
/**
 * Pre-warms the player-photo proxy's edge cache.
 *
 *   npm run prewarm            # all four leagues
 *   npm run prewarm -- bsb     # one league
 *   npm run prewarm -- --dry   # list what would be fetched, hit nothing
 *
 * /api/player-photo converts a 96x96 PNG from mflscripts to webp on first
 * request, which costs about a second. After that it is served from Vercel's
 * edge for 30 days. That first hit otherwise lands on whoever opens a roster
 * page first — usually a league member during a game window. This walks every
 * rostered player and absorbs those misses ahead of time.
 *
 * Requests are sent with `Accept: image/webp` because the proxy sets
 * `Vary: Accept`: the webp and png variants cache separately, and webp is what
 * real browsers negotiate. Warming without that header would fill the wrong one.
 *
 * Safe to re-run — already-cached photos come back as a HIT and cost nothing.
 */
import process from 'node:process';

const LEAGUES = { kkl: '45267', kdl: '68756', mmh: '72966', bsb: '62908' };
const SEASON = '2026';
const SITE = 'https://knuckleheadsff.com';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Enough to finish 661 photos quickly, low enough to stay polite to both our
// own function and the mflscripts origin each miss pulls from.
const CONCURRENCY = 6;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry');
const picked = args.filter((a) => !a.startsWith('--')).map((a) => a.toLowerCase());
const targets = picked.length ? picked : Object.keys(LEAGUES);

for (const t of targets) {
  if (!LEAGUES[t]) {
    console.error(`unknown league "${t}" — expected one of: ${Object.keys(LEAGUES).join(', ')}`);
    process.exit(2);
  }
}

const toArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

async function rosteredIds(code) {
  const url = `https://api.myfantasyleague.com/${SEASON}/export?TYPE=rosters&L=${LEAGUES[code]}&JSON=1`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${code}: rosters fetch failed (${res.status})`);
  const json = await res.json();
  if (json?.error) throw new Error(`${code}: ${json.error.$t ?? json.error}`);
  const ids = [];
  for (const f of toArray(json?.rosters?.franchise)) {
    for (const p of toArray(f.player)) if (p?.id) ids.push(p.id);
  }
  return ids;
}

async function warm(id) {
  const started = Date.now();
  try {
    const res = await fetch(`${SITE}/api/player-photo?id=${id}`, {
      headers: { 'User-Agent': UA, Accept: 'image/webp,image/*,*/*;q=0.8' },
    });
    const body = await res.arrayBuffer();
    return {
      id,
      ok: res.ok,
      status: res.status,
      bytes: body.byteLength,
      ms: Date.now() - started,
      // Vercel reports HIT when the edge already had it.
      cached: (res.headers.get('x-vercel-cache') || '').toUpperCase() === 'HIT',
      fallback: res.headers.get('x-photo-source') === 'fallback',
    };
  } catch (err) {
    return { id, ok: false, status: 0, bytes: 0, ms: Date.now() - started, error: err.message };
  }
}

/** Run `task` over `items` with a fixed number of workers. */
async function pool(items, limit, task, onDone) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const item = items[next++];
        const r = await task(item);
        results.push(r);
        onDone(results.length, items.length, r);
      }
    })
  );
  return results;
}

async function main() {
  console.log(`pre-warming ${targets.join(', ')} (season ${SEASON})\n`);

  const seen = new Set();
  for (const code of targets) {
    const ids = await rosteredIds(code);
    const before = seen.size;
    for (const id of ids) seen.add(id);
    console.log(`  ${code.toUpperCase().padEnd(4)} ${String(ids.length).padStart(4)} rostered  (+${seen.size - before} new)`);
  }

  const ids = [...seen];
  console.log(`\n${ids.length} unique players to warm`);

  if (dryRun) {
    console.log('--dry: nothing fetched');
    return;
  }

  const started = Date.now();
  let lastLogged = 0;
  const results = await pool(ids, CONCURRENCY, warm, (done, total) => {
    // Progress every 10%, so a scheduled run's log stays short.
    const pct = Math.floor((done / total) * 10);
    if (pct > lastLogged) {
      lastLogged = pct;
      process.stdout.write(`  ${done}/${total}\n`);
    }
  });

  const hits = results.filter((r) => r.cached).length;
  const misses = results.filter((r) => r.ok && !r.cached).length;
  const failed = results.filter((r) => !r.ok);
  const fallbacks = results.filter((r) => r.fallback).length;
  const bytes = results.reduce((n, r) => n + r.bytes, 0);
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);

  console.log(`\ndone in ${elapsed}s`);
  console.log(`  already cached : ${hits}`);
  console.log(`  newly warmed   : ${misses}`);
  console.log(`  no photo (FA)  : ${fallbacks}`);
  console.log(`  failed         : ${failed.length}`);
  console.log(`  transferred    : ${(bytes / 1048576).toFixed(1)} MB`);

  if (failed.length) {
    console.warn('\nfailures:');
    for (const f of failed.slice(0, 15)) {
      console.warn(`  ${f.id}: ${f.error ?? 'HTTP ' + f.status}`);
    }
    // A few failures are not worth failing a scheduled run over; a broad
    // outage is.
    if (failed.length > ids.length * 0.1) {
      console.error(`\n>10% failed — treating as an outage`);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
