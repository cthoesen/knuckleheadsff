# CSS Directory

Place your league stylesheets here.

## Current Files

- `leagues.css` - Master stylesheet containing styles for all four leagues (KKL, KDL, MMH, BSB)

## Usage in MFL

Link to your CSS file in MFL's custom CSS settings:

```
https://mfl-leagues.com/css/leagues.css
```

## CSS Structure

The master stylesheet uses body IDs to target specific leagues:
- `#body-kkl` - Knuckleheads Keeper League
- `#body-kdl` - Knuckleheads Dynasty League  
- `#body-mmh` - Monday Morning Hangover
- `#body-bsb` - Blood, Sweat, and Beers

Use `body:has(#body-kkl)` to modify background and other body-level properties.
