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
 * Outputs use Next.js App Router file conventions, so the <link> tags are
 * generated automatically — no manual metadata.icons entry needed:
 *   app/icon.svg       scalable, preferred by modern browsers
 *   app/favicon.ico    16/32/48 multi-size fallback
 *   app/apple-icon.png 180x180 iOS home screen
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public/images/shared/icons/knuckleheads-logo.svg');
const APP = path.join(ROOT, 'app');

const BRAND_YELLOW = '#fee816';
const CANVAS = 100; // icon.svg viewBox units
const INSET = 0.84; // fraction of the tile the logo occupies

function buildSquareSvg(sourceSvg) {
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
  <rect width="${CANVAS}" height="${CANVAS}" rx="18" fill="${BRAND_YELLOW}"/>
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

(async () => {
  const squareSvg = buildSquareSvg(fs.readFileSync(SRC, 'utf8'));
  fs.writeFileSync(path.join(APP, 'icon.svg'), squareSvg);
  console.log('app/icon.svg');

  // density high enough that the smallest raster is still supersampled
  const render = (size) =>
    sharp(Buffer.from(squareSvg), { density: 900 }).resize(size, size).png().toBuffer();

  const icoSizes = [16, 32, 48];
  const pngs = await Promise.all(
    icoSizes.map(async (size) => ({ size, data: await render(size) }))
  );
  fs.writeFileSync(path.join(APP, 'favicon.ico'), encodeIco(pngs));
  console.log(`app/favicon.ico (${icoSizes.join('/')})`);

  fs.writeFileSync(path.join(APP, 'apple-icon.png'), await render(180));
  console.log('app/apple-icon.png (180)');
})();
