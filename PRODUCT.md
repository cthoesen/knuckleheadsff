# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences carry equal weight:

- **League members.** The owners in the four Knuckleheads leagues. They come to check their keeper costs, contracts, cap room and trade value, and they see the MFL league sites that this project styles.
- **The commissioner.** Runs all four leagues (with a co-commissioner on BSB). Uses the site as a workbench: keeper boards, contract planning, dead-money tracking, and exports into Excel and Power Query.

Both use it on phones and on desktop, depending on the task: phones for quick checks, often on game day; desktop for planning tools, offseason decisions and exports.

## Product Purpose

knuckleheadsff.com does what MyFantasyLeague (MFL) can't do on its own for these four leagues:

1. **League-specific math.** Keeper costs, contract years, franchise and restricted tags, dead money and salary cap, following each league's own bylaws.
2. **Styling the MFL sites.** It hosts the skins, scripts, logos, headshots and favicons that the four MFL league sites load, so they look and load the way the leagues want.
3. **League identity.** A shared home and brand for the Knuckleheads leagues: hubs, champions, bylaws, display banners, the Wall of Fame cards.
4. **Getting data out of MFL.** Clean standings and roster exports for spreadsheets.

Success: owners make keeper, contract and trade decisions from the site instead of by hand, the MFL sites stay fast and on-brand, and the commissioner's season admin takes less manual work.

## Positioning

A private companion to MFL, built for four specific leagues and their bylaws. MFL holds the league data; this site computes, presents and exports it the way these leagues actually run. No other site can encode these leagues' keeper rules, contracts or history, and none hosts their MFL skins.

## Operating Context

- **Leagues** (all on MFL, season 2026):
  - **KKL**, league 45267. Keeper league, 12 teams, offense plus team defense.
  - **KDL**, league 68756. Dynasty league with IDP, salaries and contract years, franchise and restricted tags, and dead money.
  - **MMH**, league 72966. Salary-cap league with IDP.
  - **BSB**, league 62908. Keeper league with IDP and a team kicker (TMPK), 16 teams; a private league from 2026, so its data needs an API key.
- **Data:** read live from the MFL export API through the site's own API routes. Some inputs exist only in the commissioner's files: keeper selections come from an Excel workbook with Power Query, and the KDL tag baselines are a Week 12 snapshot.
- **MFL sites:** each league's MFL site loads this site's CSS and JS through "#1 - Header" and homepage message modules (HPMs). Changes go live when the commissioner bumps the `?v=` cache-buster, after the Vercel deploy has finished.
- **Calendar:** tools follow the NFL season. Season years are constants that are rolled over each year; tag costs refresh after Week 12; keeper decisions happen in the offseason.
- **Hosting:** Next.js on Vercel, deployed from `main`.

## Capabilities and Constraints

- **Live tools:**
  - KKL: Keeper Analyzer, Keeper Board.
  - KDL: Contract Manager (season planner), Unassigned Years, Tag Calculator, Dead Money Tracker.
  - MMH: Salary Cap Manager.
  - BSB: Keeper Analyzer.
  - All four leagues: Trade Analyzer, Standings and Rosters (with Excel and CSV export).
- **Announced but not built:** KKL Draft Assistant, MMH Contract Optimizer and Auction Draft Tool, BSB Draft Strategy Tool and Matchup Analyzer. Keeper boards for BSB and MMH are planned.
- **Public:** there is no login. Everything the site serves is public, so it shows only league data that owners already share (team names, rosters, keepers). Owner names, emails and usernames from MFL never leave the API routes.
- **Secrets:** MFL API keys live only in `.env.local` and in Vercel environment variables. They are never committed or shown on a page.
- **MFL is the source of truth.** The site doesn't write back to MFL.
- **MFL itself can't be redesigned.** The league sites can only be changed through MFL's header and HPM slots, and the CSS and JS this site hosts.

## Brand Commitments

- Name: **Knuckleheads Fantasy Football** (knuckleheadsff.com). League names and codes are fixed: KKL, KDL, MMH, BSB.
- Brand mark: the Knuckleheads skull logo (`public/images/shared/icons/knuckleheads-logo.svg`). Each league has its own logo, banner and color, and per-league favicon logos are being redesigned.
- Voice: a confident, trash-talking commissioner (see DESIGN.md).

## Evidence on Hand

- Bylaws for each league: `public/docs/<league>/<league>-bylaws.pdf`.
- League banners, team icons, display banners and champion gallery: `public/images/league/<league>/`.
- Wall of Fame trading cards: `public/images/shared/cards/`, made in Photoshop and refreshed 3–4 times a season.
- NFL team logos: `public/images/shared/icons/nfl/` and `nfl-avatar/`.
- Live league data from MFL; keeper data from the commissioner's workbook.
- None exists, so future work must not invent: testimonials, user counts, outside press, or any public or commercial offering.

## Product Principles

1. **Encode the bylaws exactly.** A tool that gets a keeper cost or cap number wrong is worse than no tool, so every calculation follows the league's written rules.
2. **MFL stays the source of truth.** Read live, show where and when data came from, and never let cached data pass for current.
3. **Public by default, private by design.** Show only what owners already share, and keep keys and owner details out of every response.
4. **Make the commissioner's season lighter.** Prefer one command or one export over a manual step that recurs every season.
5. **Fast on MFL's pages.** Anything the league sites load has to earn its weight; owners load those pages every week.
