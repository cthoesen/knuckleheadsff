// ------------------ CONFIG ------------------
// Add a theme name + primary hex to generate its CSS block.
// Run with: node theme-generator.js
const THEMES = {
  "theme-cerulean":  "#1f4fd1",
  "theme-dk-purple": "#7e22ce",
  "theme-jade":      "#38b569",
  "theme-dk-red":    "#d93636",
};

// Monochromatic lightness steps (HSL units, 0-100)
const LIGHT_STEPS = { light: +10, dark: -10 };

// Hue rotation angles for the four harmony options.
// Pick any two of the four outputs to assign to --secondary and --accent in your theme.
// secondary  = H+150°  (split complement, complement − 30°)
// accent     = H+210°  (split complement, complement + 30°)
// tertiary   = H+60°   (analogous-adjacent)
// quaternary = H+270°  (square / tetradic)
const SPLIT_OFFSET = 30;

// Background opacity alphas
const BG_ALPHA = { base: 0.05, bright: 0.20 };

// Saturation / lightness clamps applied to derived colors
const SAT_CLAMP = { min: 35, max: 95 };
const L_CLAMP   = { min: 18, max: 78 };

// ------------------ COLOR UTILS ------------------
function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

function hexToRgb(hex) {
  const h    = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n    = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  const to = (v) => v.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

// RGB (0-255) → HSL (H: 0-360, S/L: 0-100)
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d   = max - min;
  let h     = 0;
  const l   = (max + min) / 2;
  const s   = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2;   break;
      case b: h = (r - g) / d + 4;   break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

// HSL → RGB
function hslToRgb({ h, s, l }) {
  s /= 100; l /= 100;
  const c  = (1 - Math.abs(2 * l - 1)) * s;
  const x  = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m  = l - c / 2;

  let r1 = 0, g1 = 0, b1 = 0;
  if      (h <  60) { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else              { r1 = c; g1 = 0; b1 = x; }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function hslToHex(hsl)          { return rgbToHex(hslToRgb(hsl)); }
function rotateHue(hsl, deg)    { return { ...hsl, h: (hsl.h + deg + 360) % 360 }; }
function shiftL(hsl, delta)     { return { ...hsl, l: clamp(hsl.l + delta, L_CLAMP.min, L_CLAMP.max) }; }
function clampSL(hsl)           { return { ...hsl, s: clamp(hsl.s, SAT_CLAMP.min, SAT_CLAMP.max), l: clamp(hsl.l, L_CLAMP.min, L_CLAMP.max) }; }

// ------------------ THEME DERIVATION ------------------
function deriveTheme(primaryHex) {
  const base = clampSL(rgbToHsl(hexToRgb(primaryHex)));

  // Monochromatic light / dark ramps
  const primaryLight = hslToHex(shiftL(base, LIGHT_STEPS.light));
  const primaryDark  = hslToHex(shiftL(base, LIGHT_STEPS.dark));

  // Four harmony options — same S+L as primary, rotated hue.
  // Choose any two to use as --secondary and --accent in the final theme block.
  const secondary  = hslToHex(clampSL(rotateHue(base, 180 - SPLIT_OFFSET))); // H+150°
  const accent     = hslToHex(clampSL(rotateHue(base, 180 + SPLIT_OFFSET))); // H+210°
  const tertiary   = hslToHex(clampSL(rotateHue(base, 60)));                  // H+60°
  const quaternary = hslToHex(clampSL(rotateHue(base, 270)));                 // H+270°

  // Background opacity — derived from primary RGB
  const { r, g, b } = hexToRgb(primaryHex);

  return {
    primary:        primaryHex.toUpperCase(),
    primaryLight,
    primaryDark,
    secondary,
    accent,
    tertiary,
    quaternary,
    bgOpacity:      `rgba(${r}, ${g}, ${b}, ${BG_ALPHA.base})`,
    bgOpacityBright:`rgba(${r}, ${g}, ${b}, ${BG_ALPHA.bright})`,
  };
}

// ------------------ CSS OUTPUT ------------------
function cssBlock(themeName, primaryHex) {
  const v = deriveTheme(primaryHex);
  return [
    `html.${themeName} {`,
    `  --primary: ${v.primary};`,
    `  --fa-main-color: ${v.primary};`,
    `  --primary-light: ${v.primaryLight};`,
    `  --primary-dark: ${v.primaryDark};`,
    `  /* harmony options — pick two for --secondary and --accent */`,
    `  /* secondary  (H+150°): ${v.secondary} */`,
    `  /* accent     (H+210°): ${v.accent}     */`,
    `  /* tertiary   (H+60°):  ${v.tertiary}  */`,
    `  /* quaternary (H+270°): ${v.quaternary} */`,
    `  --secondary: ${v.secondary}; /* color for contrast elements like the "X" on the close button */`,
    `  --accent: ${v.accent}; /* accent color for button icons */`,
    `  --bg-opacity: ${v.bgOpacity};`,
    `  --bg-opacity-bright: ${v.bgOpacityBright};`,
    `}`,
  ].join("\n");
}

// ------------------ GENERATE ------------------
const cssOut = Object.entries(THEMES)
  .map(([name, hex]) => cssBlock(name, hex))
  .join("\n\n");

console.log(cssOut);
