/**
 * Shared MyFantasyLeague export-API client.
 *
 * Replaces the old approach of scraping the printable HTML reports
 * (`options?L=…&O=07&PRINTER=1`). The export API returns the same data as
 * typed JSON, plus fields the HTML never exposed cleanly — notably an explicit
 * roster `status` (ROSTER / TAXI_SQUAD / INJURED_RESERVE), so taxi and IR no
 * longer have to be inferred from where a row sat in the page.
 *
 * API keys are optional: every data type used here is readable without one.
 * When a key is present in the environment it is sent for rate-limit headroom.
 * Keys must live in .env.local / Vercel env vars — never in the repo.
 */

export type LeagueCode = 'kkl' | 'kdl' | 'mmh' | 'bsb';

export interface LeagueConfig {
  code: LeagueCode;
  leagueId: string;
  season: string;
}

export interface LeaguePlayer {
  /** MFL player id. */
  id: string;
  /** "Last, First" as MFL stores it. */
  name: string;
  position: string;
  nflTeam: string;
  /** Injury status word from MFL ("Questionable", "Out", …), '' when healthy. */
  injuryStatus: string;
  franchiseId: string;
  /** Franchise (fantasy team) name. */
  franchise: string;
  /** Raw MFL roster status. */
  status: string;
  isTaxi: boolean;
  isIR: boolean;
  salary: number;
  /** Contract years remaining (MFL `contractYear`). */
  contractYear: number;
  /** MFL `contractStatus` — rendered as "Base" in MMH, "Status" in KDL. */
  contractStatus: string;
  /** MFL `contractInfo` — rendered as "Keeper" in KKL, "Info" in KDL/MMH. */
  contractInfo: string;
  /** MFL `drafted` — how the player was acquired. */
  acquired: string;
  /** NFL draft class year, '' when undrafted/unknown. */
  draftYear: string;
  /** True when the player's draft class is the current season (MFL's "(R)"). */
  isRookie: boolean;
  /** Fantasy points for `pointsSeason`; null when the player has no score. */
  points: number | null;
}

export interface LeagueRosterResult {
  players: LeaguePlayer[];
  /** Season the `points` values came from (see resolvePointsSeason). */
  pointsSeason: string;
}

const API_HOST = 'https://api.myfantasyleague.com';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** MFL omits the array wrapper when a collection has exactly one member. */
function toArray<T>(v: T | T[] | undefined | null): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

/**
 * MFL issues a separate key per league *per season*, and this client routinely
 * spans two seasons (see resolvePointsSeason). So the season-specific name wins,
 * then a league-wide key, then a global one. All optional — when nothing is set
 * the APIKEY param is omitted entirely.
 *
 *   MFL_API_KEY_BSB_2026  ← preferred: exact league + season
 *   MFL_API_KEY_BSB       ← fallback: any season for that league
 *   MFL_API_KEY           ← last resort: any league
 */
function apiKeyFor(code: LeagueCode, season?: string): string | undefined {
  const league = code.toUpperCase();
  return (
    (season ? process.env[`MFL_API_KEY_${league}_${season}`] : undefined) ||
    process.env[`MFL_API_KEY_${league}`] ||
    process.env.MFL_API_KEY ||
    undefined
  );
}

/**
 * Fetch one export type. `leagueId` is omitted for league-independent types
 * (e.g. injuries) — passing L= on those makes MFL redirect to a league server
 * that then rejects the request.
 */
export async function mflExport(
  season: string,
  type: string,
  opts: { leagueId?: string; code?: LeagueCode; params?: Record<string, string>; revalidate?: number } = {}
): Promise<any> {
  const qs = new URLSearchParams({ TYPE: type, JSON: '1' });
  if (opts.leagueId) qs.set('L', opts.leagueId);
  for (const [k, v] of Object.entries(opts.params ?? {})) qs.set(k, v);
  if (opts.code) {
    const key = apiKeyFor(opts.code, season);
    if (key) qs.set('APIKEY', key);
  }

  const res = await fetch(`${API_HOST}/${season}/export?${qs}`, {
    headers: { 'User-Agent': UA },
    next: { revalidate: opts.revalidate ?? 300 },
  });
  if (!res.ok) throw new Error(`MFL ${type} failed: ${res.status}`);

  const json = await res.json();
  if (json?.error) throw new Error(`MFL ${type} error: ${json.error.$t ?? json.error}`);
  return json;
}

/** Map of player id -> YTD score, or null when the season has no scores yet. */
async function fetchScores(season: string, leagueId: string, code: LeagueCode) {
  const data = await mflExport(season, 'playerScores', {
    leagueId,
    code,
    params: { W: 'YTD' },
  });
  const list = toArray<any>(data?.playerScores?.playerScore).filter((s) => s?.id);
  if (list.length === 0) return null;
  const map = new Map<string, number>();
  for (const s of list) {
    const n = parseFloat(s.score);
    if (!isNaN(n)) map.set(s.id, n);
  }
  return map.size > 0 ? map : null;
}

/**
 * Points come from the current season once it has scores, and fall back to the
 * previous season before kickoff — so the column stays populated year-round
 * instead of going blank every offseason.
 */
async function resolvePointsSeason(season: string, leagueId: string, code: LeagueCode) {
  // playerScores is the one type some leagues gate behind an APIKEY (BSB does).
  // Points are supplementary, so a gated or failing fetch degrades to null
  // points rather than failing the whole roster request.
  const current = await fetchScores(season, leagueId, code).catch(() => null);
  if (current) return { scores: current, pointsSeason: season };
  const prevSeason = String(Number(season) - 1);
  const prev = await fetchScores(prevSeason, leagueId, code).catch(() => null);
  return { scores: prev ?? new Map<string, number>(), pointsSeason: prev ? prevSeason : '' };
}

/**
 * Assemble every rostered player in a league with contract, status, and points.
 * This is the single replacement for the old per-league HTML scrapers.
 */
export async function getLeagueRoster(cfg: LeagueConfig): Promise<LeagueRosterResult> {
  const { season, leagueId, code } = cfg;

  const [leagueData, rostersData, playersData, injuriesData, scoreInfo] = await Promise.all([
    mflExport(season, 'league', { leagueId, code }),
    mflExport(season, 'rosters', { leagueId, code, revalidate: 60 }),
    mflExport(season, 'players', { leagueId, code, params: { DETAILS: '1' }, revalidate: 86400 }),
    // League-independent: no L= (see mflExport).
    mflExport(season, 'injuries', { code }).catch(() => null),
    resolvePointsSeason(season, leagueId, code),
  ]);

  const playerMap = new Map<string, { name: string; position: string; team: string; draftYear: string }>();
  for (const p of toArray<any>(playersData?.players?.player)) {
    playerMap.set(p.id, {
      name: p.name ?? '',
      position: p.position ?? '',
      team: p.team ?? '',
      draftYear: p.draft_year ?? '',
    });
  }

  const injuryMap = new Map<string, string>();
  for (const i of toArray<any>(injuriesData?.injuries?.injury)) {
    if (i?.id) injuryMap.set(i.id, i.status ?? '');
  }

  const franchiseNames = new Map<string, string>();
  for (const f of toArray<any>(leagueData?.league?.franchises?.franchise)) {
    franchiseNames.set(f.id, f.name);
  }

  const players: LeaguePlayer[] = [];
  for (const franchise of toArray<any>(rostersData?.rosters?.franchise)) {
    const franchiseId = franchise.id;
    const franchiseName = franchiseNames.get(franchiseId) ?? franchiseId;

    for (const rp of toArray<any>(franchise.player)) {
      const info = playerMap.get(rp.id);
      if (!info) continue; // unknown id (rare); nothing useful to show

      const status = String(rp.status ?? '').toUpperCase();
      // MFL pads several contract fields with a trailing \r.
      const clean = (v: unknown) => String(v ?? '').replace(/\r/g, '').trim();

      players.push({
        id: rp.id,
        name: info.name,
        position: info.position,
        nflTeam: info.team,
        injuryStatus: injuryMap.get(rp.id) ?? '',
        franchiseId,
        franchise: franchiseName,
        status,
        isTaxi: status === 'TAXI_SQUAD',
        isIR: status === 'INJURED_RESERVE',
        salary: parseFloat(clean(rp.salary)) || 0,
        contractYear: parseInt(clean(rp.contractYear), 10) || 0,
        contractStatus: clean(rp.contractStatus),
        contractInfo: clean(rp.contractInfo),
        acquired: clean(rp.drafted),
        draftYear: info.draftYear,
        isRookie: info.draftYear === season,
        points: scoreInfo.scores.get(rp.id) ?? null,
      });
    }
  }

  return { players, pointsSeason: scoreInfo.pointsSeason };
}
