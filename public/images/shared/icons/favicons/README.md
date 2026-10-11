# League favicon logos

Drop a league's logo here as `favicon-<league>.svg` (`favicon-kkl.svg`,
`favicon-kdl.svg`, `favicon-mmh.svg`, `favicon-bsb.svg`), then run
`npm run favicons`.

- Must be an SVG with a `viewBox` (Illustrator's default export has one).
- Transparent background: the script puts it on a rounded tile coloured with
  the league's `--primary` from `public/css/dark-<league>.css`.
- Any shape works: wide or tall logos are scaled to fit and centred.
- A league with no file here uses the knuckleheadsff logo.
