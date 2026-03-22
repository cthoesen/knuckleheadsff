# Player Card Images

This folder contains the player card images used by the **Players of the Week** slider displayed on each league's homepage (KKL, KDL, MMH, BSB).

---

## How the Slider Works

Each league's homepage includes an MFL homepage module (HPM #7) that:

1. Loads **FlexSlider** (`flex-slider.min.js`) — a jQuery-based image carousel plugin.
2. Makes an AJAX call to `https://mfl-leagues.com/api/slider-images?league={league}` (e.g. `?league=kkl`), handled by `/app/api/slider-images/route.ts`. The API resolves images using the following priority:
   - **League-specific first:** checks `/public/images/league/{league}/cards/` — if this folder exists and contains at least one supported image file (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`), those images are used.
   - **Shared fallback:** if no league-specific folder/images are found, falls back to `/public/images/shared/cards/` (this folder).
   - The resolved image URLs are returned as a JSON array, **sorted alphabetically by filename**, which is why the numeric position prefix controls display order.
3. Builds the slide HTML and initializes the FlexSlider carousel with the following settings:
   - **Animation:** Crossfade between slides
   - **Slideshow Speed:** 2 seconds per slide
   - **Transition Speed:** 400ms fade
   - **Pause on Hover:** Yes
   - **Direction Nav (arrows):** Hidden

Because the API returns images in **alphabetical filename order**, the numeric prefix on each filename controls the display order within the slider.

---

## File Naming Convention

All active player card images follow this naming pattern:

```
{position-number}-card-{first-last}.webp
```

### Position Prefix Key

| Prefix | Position             |
|--------|----------------------|
| `1-`   | Quarterback (QB)     |
| `2-`   | Running Back (RB)    |
| `3-`   | Wide Receiver (WR)   |
| `4-`   | Tight End (TE)       |
| `5-`   | Place Kicker (K)     |
| `6-`   | Defensive Lineman (DL) |
| `7-`   | Linebacker (LB)      |
| `8-`   | Defensive Back (DB)  |

### Examples

```
1-card-patrick-mahomes.webp   → QB, sorts first
2-card-bijan-robinson.webp    → RB, sorts after all QBs
3-card-justin-jefferson.webp  → WR, sorts after all RBs
4-card-trey-mcbride.webp      → TE, sorts after all WRs
```

This ensures the slider always displays players in a logical position order (QBs → RBs → WRs → TEs → Ks → DLs → LBs → DBs) rather than random alphabetical order by player name.

---

## Inactive Folder

The `/inactive/` subfolder holds player card images that are **temporarily or permanently excluded** from the slider. Moving an image here removes it from the carousel without deleting the file.

**Use cases:**
- Players that are no longer relevant (injured, traded, cut, etc.)
- Images staged for future use
- Off-season archiving

To reactivate a card, move it back to the parent `/cards/` directory and ensure the filename follows the position-prefix naming convention above.

---

## Image Format

All cards should be saved as **`.webp`** for optimal file size and browser performance. Recommended dimensions match the FlexSlider container width defined in the league HPM layout.
