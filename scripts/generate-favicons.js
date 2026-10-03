#!/usr/bin/env node
/**
 * Generates the site favicons from the brand logo SVG.
 *
 * Run after changing public/images/shared/icons/knuckleheads-logo.svg:
 *   npm run favicons
 *
 * The source logo is tall (viewBox 65.65 x 99) and has no background. Favicons
 * are square, so the logo is centred on a square brand-yellow tile: at 16px on
 * a dark tab bar a transparent background makes the dark cap disappear, leaving
 * a floating skull. The yellow tile keeps the silhouette readable in both
 * light and dark browser themes.
 *
 * Site outputs use Next.js App Router file conventions, so the <link> tags are
 * generated automatically — no manual metadata.icons entry needed:
 *   app/icon.svg       scalable, preferred by modern browsers
 *   app/favicon.ico    16/32/48 multi-size fallback
 *   app/apple-icon.png 180x180 iOS home screen
 *
 * Each MFL league site gets the same logo on its own colour tile, taken from
 * the first --primary in public/css/dark-<league>.css (the :root value — later
 * ones belong to the selectable skins). Change the CSS, re-run, bump the ?v=
 * in the league's #1 - Header. Outputs, per league:
 *   public/images/league/<league>/favicon.ico           16/32/48
 *   public/images/league/<league>/apple-touch-icon.png  180x180
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public/images/shared/icons/knuckleheads-logo.svg');
const APP = path.join(ROOT, 'app');

const BRAND_YELLOW = '#fee816';
const LEAGUES = ['kkl', 'kdl', 'mmh', 'bsb'];
const CANVAS = 100; // icon.svg viewBox units
const INSET = 0.84; // fraction of the tile the logo occupies

function buildSquareSvg(sourceSvg, fill) {
  // Pull the source viewBox and inner markup so the paths can be re-centred
  // on a square tile without touching the artwork itself.
  const vb = sourceSvg.match(/viewBox="([\d.\s-]+)"/);
  if (!vb) throw new Error('source SVG has no viewBox');
  const [, , vw, vh] = vb[1].trim().split(/\s+/).map(Number);

  const inner = sourceSvg
    .replace(/[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();

  const scale = (CANVAS * INSET) / Math.max(vw, vh);
  const tx = (CANVAS - vw * scale) / 2;
  const ty = (CANVAS - vh * scale) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <rect width="${CANVAS}" height="${CANVAS}" rx="18" fill="${fill}"/>
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})">
${inner}
  </g>
</svg>
`;
}

/** Minimal ICO container: header + directory entries wrapping PNG payloads. */
function encodeIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

function leaguePrimary(league) {
  const css = fs.readFileSync(path.join(ROOT, `public/css/dark-${league}.css`), 'utf8');
  const m = css.match(/--primary\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/);
  if (!m) throw new Error(`dark-${league}.css has no hex --primary`);
  return m[1];
}

const ICO_SIZES = [16, 32, 48];

// density high enough that the smallest raster is still supersampled
const render = (svg, size) =>
  sharp(Buffer.from(svg), { density: 900 }).resize(size, size).png().toBuffer();

async function writeSet(svg, icoPath, applePath) {
  const pngs = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, data: await render(svg, size) }))
  );
  fs.writeFileSync(icoPath, encodeIco(pngs));
  fs.writeFileSync(applePath, await render(svg, 180));
  console.log(`${path.relative(ROOT, icoPath)} (${ICO_SIZES.join('/')})`);
  console.log(`${path.relative(ROOT, applePath)} (180)`);
}

(async () => {
  const source = fs.readFileSync(SRC, 'utf8');

  const siteSvg = buildSquareSvg(source, BRAND_YELLOW);
  fs.writeFileSync(path.join(APP, 'icon.svg'), siteSvg);
  console.log('app/icon.svg');
  await writeSet(siteSvg, path.join(APP, 'favicon.ico'), path.join(APP, 'apple-icon.png'));

  for (const league of LEAGUES) {
    const fill = leaguePrimary(league);
    const dir = path.join(ROOT, 'public/images/league', league);
    console.log(`\n${league.toUpperCase()} ${fill}`);
    await writeSet(
      buildSquareSvg(source, fill),
      path.join(dir, 'favicon.ico'),
      path.join(dir, 'apple-touch-icon.png')
    );
  }
})();
