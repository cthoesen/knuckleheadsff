# DESIGN.md

Source of truth for knuckleheadsff.com. Real values live in `styles.css` → `tokens/`.
When in doubt, use a token, not a raw value.

## Brand & voice
- For: members of the four leagues (KKL, KDL, MMH, BSB) + the commissioner.
- Feeling in 3 words: **arcade, electric, cocky.** (retro arcade × cyberpunk)
- Voice: confident trash-talking commissioner. Short, declarative, fragments OK.
  Periods as drumbeats — "Four leagues. One hub. Zero excuses."
- Person: speak to "you" / "the league"; the commissioner is third person.
- Casing: Title Case or ALL-CAPS arcade labels for headers; sentence case for body.
- Numbers always read like a HUD readout (W12 · 9-3 · $184 CAP).
- No emoji. Unicode arcade glyphs OK as accents: ▸ ◂ ● ◆ ✦ ★ ▮.

## Color
Near-black CRT ground; saturated neon hues used as *light*, never large flat fields.
One league hue dominates per surface; the rest are small accents.

Ground & ink
- `--bg-base` background → `#0D0D16`
- `--bg-deep` deepest / cabinet → `#07070C`
- `--surface-card` raised surface → `#14141F`
- `--surface-inset` inset / header → `#1C1C2B`
- `--border-hairline` → `#2A2A3D`
- `--text-heading` → `#F3F3FB`
- `--text-body` → `#A8A8C2`
- `--text-muted` → `#6C6C86`
- text on bright fills → `#07070C`

Accents (one per role)
- `--color-primary` electric lemon (site, non-league) → `#FFE920`
- KKL secondary / azure → `#1FB6FF`
- KDL accent / violet → `#8A2BE2`
- MMH quaternary / jade → `#38E66B`
- BSB tertiary / racing red → `#FF3B4E`

Theming: wrap a subtree in `.league-kkl|kdl|mmh|bsb`; components read `--league-color`.
Status maps onto hues: success=green, warning=yellow, danger=red, info=azure.

## Typography
- Pixel / arcade labels: **Press Start 2P** (`--font-pixel`) — short labels only, uppercase, its own `--pixel-*` scale (8–36px). Never body, never glow behind dense text.
- Headings: **Orbitron** (`--font-display`) — weight 700–900, uppercase, `--tracking-wide`+.
- Body / UI: **Rajdhani** (`--font-body`) — weight 500, base **17px** (it reads small).
- Numbers / stats: **Share Tech Mono** (`--font-mono`) — every figure, record, cap, count.
- Size scale: 11 · 13 · 15 · 17 · 20 · 24 · 32 · 44 · 60 · 80 (`--text-2xs`…`--text-5xl`).
- Line length cap: ~**560px** for paragraphs/taglines (keep them to one or two lines).

## Spacing & layout
- 8px grid: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (`--space-1`…`--space-10`).
- No odd one-off values; snap to the scale.
- Max content width 1200–1400px (`--container-lg` / `--container-xl`), centered.
- Section vertical rhythm: 64–96px top/bottom (`--space-8` / `--space-9`).
- Whitespace: generous and dark — let the neon edges breathe, don't crowd.

## Shape & elevation
- Radii are tight: default chamfer `--radius-xs` 2px; then 4 / 6 / 10px. Pills only for tags.
- Borders are load-bearing: 2px, league-colored. Most surfaces are defined by their
  glowing **edge**, not by fill.
- Signature surface = the **pixel frame**: 2px league border with chamfered corners
  (`.kff-pixel-frame` / `PixelFrame`) + a neon halo.
- Two shadow systems, kept separate:
  - **Neon glow** (`--glow-sm/md/lg`, tinted to `--league-color`) = the "powered-on"
    signal — on text, borders, active controls. NOT behind dense pixel text.
  - **Elevation** (`--shadow-1/2/3`, cool/deep) = real stacking only (modals, menus).
- Cards also carry an inner CRT vignette (`--crt-vignette`).

## Motion
- Easing: presses `--ease-snap` cubic-bezier(.2,.9,.3,1); entrances `--ease-out` cubic-bezier(.22,1,.36,1).
- Speed: 120 / 200 / 360ms (`--dur-fast/base/slow`). Snappy, mechanical — never floaty.
- Allowed to animate: glow intensity (sm→lg) on hover, a 2px `translateY` press,
  border/text brighten, blinking "INSERT COIN" (`.kff-blink`), pulse on live items
  (`.kff-pulse`), slow CRT sweep (`.kff-crt-sweep`).
- No infinite decorative loops on content. Always honor `prefers-reduced-motion`.

## Components
- **Buttons** — Orbitron uppercase, 2px border, `--radius-xs`. Variants: `primary`
  (yellow fill), `league` (solid league hue), `secondary` (league outline), `ghost`
  (neutral). Sizes sm/md/lg. Hover = glow steps up; press = nudge 2px down; disabled =
  muted, no glow, `not-allowed`.
- **Cards** — `Card`: dark surface, hairline border that lights to the league hue + lifts
  on hover. `PixelFrame`: the chamfered cabinet bezel for hero/feature panels.
  `LeagueCard`: full-width header (code + tool-count `Badge` + name + tagline) → featured
  pixel "PLAYER SELECT" portrait → Hub + MFL buttons. No tool pills, no per-user data.
- **Inputs** — terminal style: mono text, inset surface, hairline border that lights to
  the league hue with a glow on focus; error state turns red. Label in Orbitron caps.
- **Badge** (pixel-font count/status, e.g. "3 TOOLS") · **Tag** (Rajdhani pill) ·
  **Stat** (mono value + pixel label). Pixel art always `image-rendering: pixelated`.

## Bans
- No emoji.
- No glow behind dense or small text (pixel labels, league abbreviations, body).
- No large flat fields of accent color — color is light, used on edges/glows/small fills.
- No soft mesh/blurred gradient backgrounds; grounds are near-black + grid + scanlines.
- No rounded-corner cards with a single colored left border.
- No photographic imagery; pixel-art sprites only.
- No per-user / per-owner data on shared pages (e.g. season records).
- No Inter, Roboto, or Arial. No bluish-purple "AI" gradients.
