/**
 * KDL Franchise Name Aliases
 *
 * When a team changes ownership or renames between seasons, their prior-season
 * name appears in the Dead Money tool while their new name appears in the
 * Contract Manager roster. Add an entry here so dead money is correctly matched.
 *
 * Update at the start of each season for any ownership/name changes.
 *
 * Format:
 *   'prior season name (exact, any case)': 'current season name (exact, any case)'
 *
 * Matching is case-insensitive on both sides, so capitalization doesn't matter.
 */
export const FRANCHISE_ALIASES: Record<string, string> = {
  // 2025 → 2026 changes
  '13 seconds never again!': 'Dan the Painter',
};
