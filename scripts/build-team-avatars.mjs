#!/usr/bin/env node
/**
 * Generates square, centred versions of the NFL team logos for use as player
 * images (team defense on KKL, team kicker on BSB).
 *
 *   npm run avatars:build
 *
 * Source: public/images/shared/icons/nfl/        (tight-cropped, varying aspect)
 * Output: public/images/shared/icons/nfl-avatar/ (uniform square artboard)
 *
 * Both sets are needed and neither replaces the other:
 *
 *   - The tight-cropped originals are right for the small corner badge on a
 *     player photo, where the logo is the only thing in its box.
 *   - These square ones are right for the circular avatar slot that a team
 *     defense or team kicker occupies in place of a headshot. That slot is
 *     border-radius:50%, so a wide logo dropped straight in renders letterboxed
 *     — measured at 66-81% of the area a square logo fills, and inconsistent
 *     between teams. mflscripts solves this the same way, with a 222x222 board.
 *
 * The artwork is untouched: each source is re-centred on a square viewBox with
 * a margin, so re-running after a logo change needs no redraw.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public/images/shared/icons/nfl');
const OUT = path.join(ROOT, 'public/images/shared/icons/nfl-avatar');

/**
 * Relocated franchises. teamLogoUrl() folds these into their current code
 * before building a URL, but pushCustomPlayerImages() — which is what renders a
 * team defense or team kicker — does not, so a historical page can still ask
 * for OAK. mflscripts served all four, so they are emitted here too rather than
 * 404ing on pages that look back at prior seasons.
 */
const RELOCATED = { OAK: 'LVR', SDC: 'LAC', STL: 'LAR', RAM: 'LAR' };

const CANVAS = 222;  // matches the board mflscripts uses, so sizing is unchanged
const INSET = 0.93;  // tuned so output matches the mflscripts 222x222 boards it replaces

function squareify(svg, name) {
  const vb = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!vb) throw new Error(`${name}: no viewBox`);
  const parts = vb[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4) throw new Error(`${name}: malformed viewBox`);
  const [minX, minY, vw, vh] = parts;

  const inner = svg
    .replace(/[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();

  // Scale to fit the inset box, then centre on the square.
  const scale = (CANVAS * INSET) / Math.max(vw, vh);
  const tx = (CANVAS - vw * scale) / 2 - minX * scale;
  const ty = (CANVAS - vh * scale) / 2 - minY * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})">
${inner}
  </g>
</svg>
`;
}

const files = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.svg'));
if (!files.length) {
  console.error(`no SVGs found in ${path.relative(ROOT, SRC)}`);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
let written = 0;
const failed = [];
for (const f of files.sort()) {
  try {
    fs.writeFileSync(path.join(OUT, f), squareify(fs.readFileSync(path.join(SRC, f), 'utf8'), f));
    written++;
  } catch (err) {
    failed.push(`${f}: ${err.message}`);
  }
}

// Relocated codes reuse the current team's artwork.
let aliased = 0;
for (const [old, current] of Object.entries(RELOCATED)) {
  const from = path.join(OUT, `${current}.svg`);
  if (!fs.existsSync(from)) {
    failed.push(`${old}: source ${current}.svg not found`);
    continue;
  }
  fs.copyFileSync(from, path.join(OUT, `${old}.svg`));
  aliased++;
}

console.log(`source ${path.relative(ROOT, SRC)}  (${files.length} logos)`);
console.log(`wrote  ${path.relative(ROOT, OUT)}  (${written} square ${CANVAS}x${CANVAS} + ${aliased} relocated)`);
if (failed.length) {
  console.error(`\n${failed.length} failed:`);
  for (const f of failed) console.error(`  ${f}`);
  process.exit(1);
}
