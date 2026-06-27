# DESIGN.md

Knuckleheads Fantasy Football — single source of truth.
Theme name: **Arcade After Dark**. Retro arcade × dark cyberpunk.

## Brand & voice
- **Who it's for:** the commissioner running four MFL fantasy leagues from one hub, and the managers in them.
- **Feeling in 3 words:** nostalgic, neon, cocky.
- **How it sounds:** trash-talk swagger meets arcade nostalgia. Address the manager as **you**; the commissioner is mythologized in third person ("Built by the commissioner. Feared by the league."). Headlines make a claim, not a feature description. Numbers are loud. Terse — buttons 1–3 words, body 1–2 punchy sentences. No emoji in product chrome.
- **Casing:** display = sentence case, one neon word for punch. Labels/kickers/nav = UPPERCASE, wide tracking. Arcade micro-labels = UPPERCASE Press Start 2P, very short.

## Color
Named by role · hex · token.

- **Background (page):** `#0a0a0f` · `--kn-bg` (near-black CRT)
- **Background (deepest):** `#06060c` · `--kn-black`
- **Surface (card):** `#14141f` · `--kn-surface`
- **Surface (nav / elevated):** `#1a1a2e` · `--kn-surface-2`
- **Surface (hover / inset):** `#22223a` · `--kn-surface-3`
- **Hairline border:** `#2c2c44` · `--kn-line`  ·  stronger `#3d3d5c` · `--kn-line-bright`
- **Text strong:** `#f1f1fb` · `--kn-text`
- **Text body:** `#b7b7d4` · `--kn-text-dim`
- **Text muted:** `#6f6f93` · `--kn-text-mute`
- **Primary accent (CTA):** electric yellow `#ffe600` · `--kn-yellow`
- **Secondary accent:** hot pink `#ff2d78` · `--kn-pink`
- **Tertiary accent:** cyan `#00f0ff` · `--kn-cyan`  ·  violet `#a855f7` · `--kn-violet`
- **Status:** success `#2de38a` · warning `#ffb020` · danger `#ff4d4d`

**League themes** (one hue each, used everywhere that league appears):
- KKL cyan `#00f0ff` · KDL violet `#a855f7` · MMH emerald `#2de38a` · BSB rose `#ff3b6b`

Rule: dark canvas, saturated neon accents. One league = one hue. Never rainbow soup. Dark text `#0a0a0f` sits on yellow/cyan fills.

## Typography
- **Headings / display:** Orbitron (700–900). `--font-display`
- **Arcade labels (sparingly):** Press Start 2P. `--font-arcade`
- **Body / UI:** Rajdhani (400–700). `--font-body`
- **Numbers / stats:** Share Tech Mono. `--font-mono`
- **Size scale (px):** 12 · 14 · 16 (body) · 18 · 22 (card title) · 28 (section) · 38 (page) · 54 · 76 (hero)
- **Line height:** 1.05 display, 1.2 headings, 1.45 body.
- **Line length cap:** ~520–560px for running body copy.
- Fonts load from Google Fonts CDN (no bundled binaries yet).

## Spacing & layout
- **Rhythm:** 8px base grid → 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 112.
- **Card padding:** 16–24px. **Section gaps:** 64–112px between major bands.
- **Max widths:** content `1200px` · wide `1360px`, centered.
- **Nav height:** 68px, sticky, translucent (`rgba` + backdrop blur).
- **Grids:** responsive auto-fit, min ~320–330px columns.
- **Whitespace:** generous between sections, tight inside cards. Dense but legible — dashboard, not landing page.

## Shape & elevation
- **Corner radius (boxy on purpose):** chips 4px · controls 6px · cards 10px · pixel tiles 0. Pills (`999px`) reserved for count badges only.
- **Borders:** the signature. Default 2px solid; often a neon hue at low opacity that brightens to full on hover. Hairlines separate rows/panels.
- **Shadow — two systems:** soft dark elevation (`--shadow-sm/md/lg`) for depth; neon **glow** (`--glow-*`, colored, blurred) for emphasis. Plus hard 8-bit **pixel edge** (blur-0, stepped) for cabinet accents.
- **Glow discipline:** glow = "alive / important" only — filled CTAs, active tabs, live dots, big stats. Don't glow everything.
- **Cards:** dark surface, hairline or tinted-neon border, optional 3px neon top keyline + edge glow when themed, optional scanline overlay. Hover lifts −4/−5px, border goes full-neon, glow intensifies.

## Motion
- **Easing:** `--ease-snap` (UI), `--ease-arcade` (slight overshoot, playful moments).
- **Speed:** 120ms fast · 200ms base · 360ms slow.
- **Allowed to animate:** hover lift + brighten + glow; button press translates down 2px; tab underline; live-dot pulse; crown float; occasional CRT flicker.
- Restrained and snappy. Honor `prefers-reduced-motion`.

## Components
- **Button:** uppercase Orbitron, 2px border, 6px radius. Filled variants (yellow/pink/cyan) glow; ghost/outline don't. Presses down 2px, brightens on hover. Sizes sm/md/lg. Labels 1–3 words.
- **Card:** dark surface + hairline/neon border, 10px radius. Accent = neon top keyline + tinted edge + glow. Optional scanlines. Interactive variant lifts on hover.
- **Input:** dark inset well, Share Tech Mono, 6px radius, 2px border, neon focus ring. Uppercase label above; optional prefix glyph.
- **Badge:** small uppercase chip, tracked. Tinted-outline default; `solid` for emphasis; `dot` pulses; `pixel` uses Press Start 2P + square corners.
- **Tabs:** uppercase Orbitron, neon underline-glow on active, optional count pill.
- **LeagueCard / ToolCard / StatPill:** league-themed hub pieces — pixel crest, stat rows, glowing mono numbers.

## Bans
- No light/white backgrounds — canvas is always CRT-dark.
- No pill-rounded surfaces (only count badges go pill).
- No emoji in product chrome.
- No rainbow — one league = one hue; don't mix league colors on one element.
- No glow on everything — reserve it for what matters.
- No bluish-purple hero gradients, no soft "AI slop" gradients beyond the subtle radial neon glows.
- No recoloring the crown logo; always on dark with a soft gold drop-glow.
- No icon-font dependency — use unicode glyphs in neon pixel tiles.
- No long paragraphs — keep copy terse.
