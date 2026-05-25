// ------------------ CONFIG ------------------
const THEMES = {
  "theme-cerulean":   "#1f4fd1",
  "theme-dk-purple":   "#7e22ce",
  "theme-jade":   "#38b569",
  "theme-dk-red": "#d93636",
     
};

// How much to shift lightness for ramps (0..100 in HSL)
const LIGHT_STEPS = {
  light:  +12,
  lighter:+26,
  dark:   -14,
  darker: -26
};

// Accent hue rules (degrees)
const HUE_RULES = {
  square: 90,
  complementary: 180,
  split: 30  // split complementary offset (+/-)
};

// Background opacity alphas
const BG_ALPHA = { base: 0.05, brighter: 0.20 };

// Optional: force “dark theme” look by clamping saturation/lightness
const SAT_CLAMP = { min: 35, max: 95 };
const L_CLAMP   = { min: 18, max: 78 };

// ------------------ COLOR UTILS ------------------
function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

function hexToRgb(hex) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  const to = (v) => v.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toLowerCase();
}

// RGB (0-255) -> HSL (H 0-360, S/L 0-100)
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
}

// HSL -> RGB
function hslToRgb({ h, s, l }) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r1=0, g1=0, b1=0;
  if (0 <= h && h < 60) { r1=c; g1=x; b1=0; }
  else if (60 <= h && h < 120) { r1=x; g1=c; b1=0; }
  else if (120 <= h && h < 180) { r1=0; g1=c; b1=x; }
  else if (180 <= h && h < 240) { r1=0; g1=x; b1=c; }
  else if (240 <= h && h < 300) { r1=x; g1=0; b1=c; }
  else { r1=c; g1=0; b1=x; }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function hslToHex(hsl) {
  return rgbToHex(hslToRgb(hsl));
}

function rotateHue(hsl, deg) {
  return { ...hsl, h: (hsl.h + deg + 360) % 360 };
}

function adjustLightness(hsl, delta) {
  return { ...hsl, l: clamp(hsl.l + delta, L_CLAMP.min, L_CLAMP.max) };
}

function clampSatLight(hsl) {
  return {
    ...hsl,
    s: clamp(hsl.s, SAT_CLAMP.min, SAT_CLAMP.max),
    l: clamp(hsl.l, L_CLAMP.min, L_CLAMP.max),
  };
}

// ------------------ THEME DERIVATION ------------------
function deriveThemeVars(primaryHex) {
  const baseHsl = clampSatLight(rgbToHsl(hexToRgb(primaryHex)));

  // Primary ramps
  const primary = hslToHex(baseHsl);
  const primaryLight   = hslToHex(adjustLightness(baseHsl, LIGHT_STEPS.light));
  const primaryLighter = hslToHex(adjustLightness(baseHsl, LIGHT_STEPS.lighter));
  const primaryDark    = hslToHex(adjustLightness(baseHsl, LIGHT_STEPS.dark));
  const primaryDarker  = hslToHex(adjustLightness(baseHsl, LIGHT_STEPS.darker));

  // Accents from hue rules
  const accent     = hslToHex(clampSatLight(rotateHue(baseHsl, HUE_RULES.square)));
  const accentOne  = hslToHex(clampSatLight(rotateHue(baseHsl, HUE_RULES.complementary)));

  // Split complementary: pick one side (+split). If you prefer the other, use -HUE_RULES.split.
  const accentTwo  = hslToHex(clampSatLight(rotateHue(baseHsl, HUE_RULES.complementary + HUE_RULES.split)));

  // Background opacity derived from primaryDark (looks nicer for dark themes)
  const bgRgb = hexToRgb(primaryDark);

  return {
    primary,
    faMainColor: primary,
    primaryLight,
    primaryLighter,
    primaryDark,
    primaryDarker,
    accent,
    accentOne,
    accentTwo,
    bgOpacity: `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${BG_ALPHA.base})`,
    bgOpacityBrighter: `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${BG_ALPHA.brighter})`,
  };
}

function cssBlock(themeName, primaryHex) {
  const v = deriveThemeVars(primaryHex);
  return `
html.${themeName} {
  --primary: ${v.primary};
  --fa-main-color: ${v.faMainColor};
  --primary-light: ${v.primaryLight};
  --primary-lighter: ${v.primaryLighter}; /* mfl scoreboard font */
  --primary-dark: ${v.primaryDark};
  --primary-darker: ${v.primaryDarker};
  --accent: ${v.accent}; /* accent color for button icons */
  --accent-one: ${v.accentOne}; /* color for warnings */
  --accent-two: ${v.accentTwo}; /* color for player positions, bye week font */
  --bg-opacity: ${v.bgOpacity};
  --bg-opacity-brighter: ${v.bgOpacityBrighter};
}
`.trim();
}

// ------------------ GENERATE CSS ------------------
const cssOut = Object.entries(THEMES)
  .map(([name, hex]) => cssBlock(name, hex))
  .join("\n\n");

console.log(cssOut);