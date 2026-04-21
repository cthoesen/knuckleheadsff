//HEADER VERSION NUMBER
//console.log('HEADER SCRIPT LAST UPDATED 5-27-23');

// MFL year constants — used by API caching and cache-busting logic
const CurrentMFLYear = 2026;
const MFLPastSeason = (CurrentMFLYear !== year);
let updatedMFLCacheFile = true;

// ONLY USE THIS FOR TEMPLATE TO REMOVE IF ANYONE LOADED A CUSTOM SKIN ONTO THE SITE

["skin", "responsive"].forEach(id => {
	const el = document.getElementById(id);
	if (el) el.remove();
});

window.MFL_DEBUG_API = false;

// API dependency map — determines which modules require each API call.
// Used by needsAPI() to skip unnecessary API fetches when all dependents have cached data.
const _API_DEPS = {
	loadMyLeaguesJSON:        ["mflLive"],
	reportInjuriesAPI:        ["irReport", "contract", "moduleScoreboard", "replaceMFLScoring", "mflLive", "MondayNight", "overview", "miniBoxscore"],
	reportTransactionsAPI:    ["irReport", "contract"],
	reportRostersAPI:         ["irReport", "contract"],
	reportProjectedScoresAPI: ["moduleScoreboard", "replaceMFLScoring", "mflLive", "MondayNight", "Marquee", "overview", "miniBoxscore"],
	reportLeagueAPI:          ["contract", "allPlay", "mflLive", "prizePayouts", "playoffs", "overview", "survivor"],
	reportStandingsAPI:       ["moduleScoreboard", "allPlay", "replaceMFLScoring", "MondayNight", "FantasyTicker", "Marquee", "prizePayouts", "playoffs", "overview", "miniBoxscore", "survivor"],
	reportTopStartersAPI:     ["overview"],
	reportWeeklyResultsAPI:   ["moduleScoreboard", "allPlay", "replaceMFLScoring", "MondayNight", "FantasyTicker", "Marquee", "prizePayouts", "playoffs", "overview", "miniBoxscore", "survivor"],
	getLiveScoringAPI:        ["moduleScoreboard", "mflLive", "MondayNight", "FantasyTicker", "Marquee", "miniBoxscore"],
};

// Returns true if the named API call is needed.
// Returns false (skip the call) only when every dependent module is confirmed to have cached data.
function needsAPI(apiName) {
	const deps = _API_DEPS[apiName];
	return !deps || deps.some(dep => {
		const cached = window["useCache_" + dep];
		return cached === undefined || cached === true;
	});
}

function logApi(label, data) {
	if (!window.MFL_DEBUG_API) return;

	console.groupCollapsed(
		`%c[MFL API] ${label}`,
		"color:#0aa;font-weight:bold"
	);
	console.log(data);
	console.trace();
	console.groupEnd();
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//     SCRIPTS INCLUDED IN HEADER JS FILE
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/global/cache.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//     START GLOBAL BASE FILE
//////////////////////////////////////////////////////////////////////////////////////////////////
//     UPDATE MFL EACH YEAR AND COPY ALL PREVIOUS YEAR HPMs
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/tabs/script.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/mobileMenu/script.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/chat/enhanced.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/popups/players/script.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/scoreboard/mini-boxscore/script.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/marquee/script.js
//////////////////////////////////////////////////////////////////////////////////////////////////
//     https://www.mflscripts.com/mfl-apps/lineups/submit/script.js
//////////////////////////////////////////////////////////////////////////////////////////////////

////////CALCULATE PX TO REM///////////////////////////////////////////////////////////////////////

if (load_mobileMenu_script === undefined) var load_mobileMenu_script = true;
if (load_chat_enhanced === undefined) var load_chat_enhanced = true;
if (load_popup === undefined) var load_popup = true;
if (load_mini_boxscore === undefined) var load_mini_boxscore = true;
if (load_marquee === undefined) var load_marquee = false;
if (load_lineups_submit_scriptV3 === undefined) var load_lineups_submit_scriptV3 = true;
if (load_tabs_script === undefined) var load_tabs_script = false;
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START GLOBAL CACHE JS/////////////////////////////////////////////////////////////////////
///////https://www.mflscripts.com/mfl-apps/global/cache.js////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////            SET VARIABLES           ///////////////////////////////////
////////////////////     LIVE STATS XML POLLER (NO LOCALSTORAGE)      ////////////////////////////
////////////////////      VARIABLES FOR FIVE MINUTE CACHE ITEMS       ////////////////////////////
////////////////////            FIVE MINUTE CACHE FUNCTIONS           ////////////////////////////
////////////////////                    PLAYER DATABASE               ////////////////////////////
////////////////////                    ROSTERS API                   ////////////////////////////
////////////////////                     INJURIES API                 ////////////////////////////
////////////////////                  TRANSACTIONS API                ////////////////////////////
////////////////////                  NEWSBREAKER API                 ////////////////////////////
////////////////////                   MY LEAGUES API                 ////////////////////////////
////////////////////                 SIGNAL CACHE READY               ////////////////////////////
////////////////////                    WEATHER API                   ////////////////////////////

////////////////////          VARIABLES FOR DAILY CACHE ITEMS         ////////////////////////////
////////////////////               DAILY CACHE FUNCTIONS              ////////////////////////////
////////////////////                   PROJECTIONS API                ////////////////////////////
////////////////////                     LEAGUE API                   ////////////////////////////
////////////////////                     STANDINGS API                ////////////////////////////
////////////////////                   TOP STARTERS API               ////////////////////////////
////////////////////                     BYEWEEKS API                 ////////////////////////////

////////////////////                  CONTINUE WITH API               ////////////////////////////
////////////////////                  SCORE ADJUSTIMENTS              ////////////////////////////
////////////////////                  WEEKLY RESULTS API              ////////////////////////////
////////////////////                  NFL SCHEDULE API                ////////////////////////////
////////////////////                REPORT H2H RESULTS                ////////////////////////////
////////////////////              REPORT ALL PLAY RESULTS             ////////////////////////////
////////////////// BACKGROUND REFRESH FIVE MIN CACHE AND NFL SCHEDULE ////////////////////////////

////////////////////                  PARSE JSON HELPER               ////////////////////////////
////////////////////       CLEAR AND RESPONSE CACHE FUNCTIONS         ////////////////////////////

////////////////////      SETUP INDEXED DB VARIABLE AND FUNCTIONS     ////////////////////////////


////////////////////                HIDE IF OFFSEASON                 ////////////////////////////
////////////////////                      SET REM                     ////////////////////////////
////////////////////                  HISTORY SCRIPT                  ////////////////////////////
////////////////////              SWIPE ENABLE FUNCTION               ////////////////////////////
////////////////////             REPORT COLLAPSE FUNCTION             ////////////////////////////
////////////////////              FUNCTION FORMATMFLDATE              ////////////////////////////
////////////////////             GETREPORTSNAMEICON FUNCTION          ////////////////////////////
////////////////////           SCOREADJUSTMENT HTML FUNCTION          ////////////////////////////

////////////////////         MFL: Kill ads but keep your iframes      ////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////            SET VARIABLES           ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var NFLlastWk = 18; // define last week of NFL regular season
var AllGamesCount = 22; // define how many total weeks of NFL games regular and playoff
if (typeof useOPR === "undefined") useOPR = false;
if (typeof completedWeek === 'undefined') completedWeek = 0;
if (typeof liveScoringWeek === 'undefined') liveScoringWeek = 0;
if (typeof precision === 'undefined') precision = 0;
var mflNFLscheduleLive = true;
if (liveScoringWeek > 0 && completedWeek !== AllGamesCount) mflNFLscheduleLive = true;
if (typeof standingsEndWeek === "undefined" || standingsEndWeek === "") standingsEndWeek = NFLlastWk;
else standingsEndWeek = parseInt(standingsEndWeek, 10);
if (typeof startWeek === "undefined" || startWeek === "") startWeek = 1;
if (typeof endWeek === "undefined" || endWeek === "") endWeek = NFLlastWk;
var tickerEndWeek = endWeek; // For Marquee Script
if (tickerEndWeek > NFLlastWk) isPlayoffLeague = true;
var isLeagueHeadToHead = (typeof h2h_setting !== "undefined" && h2h_setting === "YES");
var isAllPlay = !isLeagueHeadToHead;
var preventDBLClick = true;
var real_ls_week = liveScoringWeek;
var backgroundTimersStarted = false;

var liveScoringLiveWeek = null;
let lsm_refreshMs = 3600000;
let lsm_pollTimerId = null;
let lsm_manualOverrideMs = null;
let lsm_scheduleStarted = false;
let lsm_last_update_secs_first = 0;
var lsm_stats = [];
var lsm_tstats = [];
var lsm_firstFetchDone = false;

// --------------------------------------------------
// Weekly results throttling (cross-poll state)
// --------------------------------------------------
let lsm_lastWeeklyResultsCheck = 0;
const WEEKLY_RESULTS_RECHECK_MS = 2 * 60 * 1000; // 2 minutes

// -------------------------
// Stable per-tab id (locks)
// -------------------------
window.MFL_TAB_ID = (() => {
	const k = "MFL_TAB_ID";
	let v = sessionStorage.getItem(k);
	if (!v) {
		v = "tab-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
		sessionStorage.setItem(k, v);
	}
	return v;
})();

// -------------------------
// 5-minute bucket (ms) - shared across tabs on same origin
// -------------------------
window.__MFL_inflight = window.__MFL_inflight || new Map();

const FIVE_MIN_MS = 5 * 60 * 1000;
const FIVE_MIN_KEY = "serverFiveMinMs";

function computeFiveMinBucketMs(ms) {
	return Math.floor(ms / FIVE_MIN_MS) * FIVE_MIN_MS;
}

// Read-or-create the current 5-min bucket in localStorage
function getCacheFiveMinutes() {
	const storedRaw = parseInt(localStorage.getItem(FIVE_MIN_KEY), 10);
	const stored = Number.isFinite(storedRaw) ? computeFiveMinBucketMs(storedRaw) : NaN;
	const nowBucket = computeFiveMinBucketMs(Date.now());

	// âœ… if stored is valid and is the same or newer, keep it
	if (Number.isFinite(stored) && stored > 0 && stored >= nowBucket) return stored;

	// âœ… otherwise write the current one
	try {
		localStorage.setItem(FIVE_MIN_KEY, String(nowBucket));
	} catch {}
	return nowBucket;
}

// Optional: force-advance (rarely needed)
function setCacheFiveMinutesNow() {
	const nowBucket = computeFiveMinBucketMs(Date.now());
	try {
		localStorage.setItem(FIVE_MIN_KEY, String(nowBucket));
	} catch {}
	return nowBucket;
}

function resolveFiveMinBucket(bucketArg) {
	const b = Number(bucketArg);
	if (Number.isFinite(b) && b > 0) return b;

	// âœ… use the already-synced global (set by getCacheFiveMinutes + storage listener)
	const g = Number(cacheFiveMinutes);
	if (Number.isFinite(g) && g > 0) return g;

	// absolute last resort (should be rare)
	return getCacheFiveMinutes();
}

// If you want a global variable:
var cacheFiveMinutes = getCacheFiveMinutes();


// -------------------------
// 6-hour bucket (seconds) - used for MyLeagues
// -------------------------
const SIX_HOURS_SEC = 6 * 60 * 60;

function computeSixHourBucket(serverTimeSeconds) {
	return Math.floor(serverTimeSeconds / SIX_HOURS_SEC) * SIX_HOURS_SEC;
}

function getCacheSixHours(serverTimeSeconds) {
	const key = "serverSixHours_" + year;

	const st = Number.isFinite(Number(serverTimeSeconds)) ?
		Number(serverTimeSeconds) :
		Math.floor(Date.now() / 1000);

	const computed = computeSixHourBucket(st);
	const stored = parseInt(localStorage.getItem(key), 10);

	if (!Number.isFinite(stored) || stored <= 0 || stored !== computed) {
		try {
			localStorage.setItem(key, String(computed));
		} catch {}
		return computed;
	}
	return stored;
}

var cacheSixHours = getCacheSixHours(currentServerTime);


// -------------------------
// Daily bucket (seconds)
// -------------------------
function normalizeServerTimeSeconds(t) {
	const n = Number(t);
	if (!Number.isFinite(n)) return null;
	return (n > 1e12) ? Math.floor(n / 1000) : Math.floor(n);
}

function computeDailyBucketFromServerTime(serverTimeSeconds) {
	const day = Math.floor((serverTimeSeconds + 60 * 60 * 15) / (60 * 60 * 24));
	return day * (60 * 60 * 24);
}

function getCacheDaily(serverTimeSeconds) {
	const key = "serverDaily_" + year;

	const st = normalizeServerTimeSeconds(serverTimeSeconds) ?? Math.floor(Date.now() / 1000);
	const computed = computeDailyBucketFromServerTime(st);
	const stored = parseInt(localStorage.getItem(key), 10);

	if (!Number.isFinite(stored) || stored <= 0 || stored !== computed) {
		try {
			localStorage.setItem(key, String(computed));
		} catch {}
		return computed;
	}
	return stored;
}

function setCacheDaily(serverTimeSeconds) {
	const key = "serverDaily_" + year;
	const st = normalizeServerTimeSeconds(serverTimeSeconds) ?? Math.floor(Date.now() / 1000);
	const bucket = computeDailyBucketFromServerTime(st);
	try {
		localStorage.setItem(key, String(bucket));
	} catch {}
	return bucket;
}

var cacheDaily = getCacheDaily(currentServerTime);


function stillOwnLock(lockKey) {
	try {
		const cur = localStorage.getItem(lockKey);
		if (!cur) return false;

		const o = JSON.parse(cur);
		const myToken = sessionStorage.getItem(lockKey + "_token");

		return !!(o &&
			o.tab === window.MFL_TAB_ID &&
			o.token &&
			myToken &&
			o.token === myToken &&
			typeof o.exp === "number" &&
			o.exp > Date.now()
		);
	} catch {
		return false;
	}
}

// -------------------------
// Cross-tab lock (CAS + token)
// -------------------------
function tryAcquireLock(lockKey, ttlMs) {
	const now = Date.now();
	const tabId = window.MFL_TAB_ID;

	const cur = localStorage.getItem(lockKey);

	let curObj = null;
	if (cur) {
		try {
			curObj = JSON.parse(cur);
		} catch {
			curObj = null;
		}
	}

	// If valid lock held by someone else -> fail fast
	if (curObj && typeof curObj.exp === "number" && curObj.exp > now && curObj.tab && curObj.tab !== tabId) {
		return false;
	}

	// âœ… Re-entrant: if we already hold a valid lock, keep it
	if (curObj && typeof curObj.exp === "number" && curObj.exp > now && curObj.tab === tabId) {
		return true;
	}

	// Optional cleanup: expired lock
	if (curObj && typeof curObj.exp === "number" && curObj.exp <= now) {
		try {
			localStorage.removeItem(lockKey);
		} catch {}
	}

	const token = (crypto?.randomUUID?.() || (Math.random().toString(36).slice(2) + "-" + now.toString(36)));
	const myObj = {
		tab: tabId,
		exp: now + ttlMs,
		token
	};
	const my = JSON.stringify(myObj);

	try {
		// CAS guard: ensure lock value has not changed since our first read
		const cur2 = localStorage.getItem(lockKey);
		if (cur2 !== cur) return false;

		localStorage.setItem(lockKey, my);
	} catch {
		return false;
	}

	const after = localStorage.getItem(lockKey);
	if (after !== my) return false;

	try {
		sessionStorage.setItem(lockKey + "_token", token);
		sessionStorage.setItem(lockKey + "_value", my);
	} catch {}

	return true;
}

function releaseLock(lockKey) {
	const cur = localStorage.getItem(lockKey);
	if (!cur) return;

	try {
		const o = JSON.parse(cur);
		const myToken = sessionStorage.getItem(lockKey + "_token");
		if (o && o.tab === window.MFL_TAB_ID && o.token && myToken && o.token === myToken) {
			localStorage.removeItem(lockKey);
		}
	} catch {
		// leave it; TTL will expire
	}
}


// -------------------------
// Wait for cacheKey to appear via storage event
// -------------------------
function waitForStorageValue(key, timeoutMs) {
	return new Promise((resolve) => {
		const v = localStorage.getItem(key);
		if (v != null) return resolve(v);

		let done = false;

		const t = setTimeout(() => {
			if (done) return;
			done = true;
			window.removeEventListener("storage", onStorage);
			resolve(null);
		}, timeoutMs);

		function onStorage(e) {
			if (done) return;
			if (e.key === key && e.newValue != null) {
				// Re-read latest from localStorage (more reliable than e.newValue)
				const latest = localStorage.getItem(key);
				if (latest != null) {
					done = true;
					clearTimeout(t);
					window.removeEventListener("storage", onStorage);
					resolve(latest);
				}
			}
		}

		window.addEventListener("storage", onStorage);
	});
}


// -------------------------
// fetchOnceCrossTab (FULL) - with inflight dedupe + safe defaults
// -------------------------
function fetchOnceCrossTab(opts) {
	const {
		cacheKey,
		lockKey,
		readCached,
		fetcher,
		storeRaw,
		apply,
		lockTtlMs = 20000,
		waitMs = 20000,
		// NEW: settle time to let storage converge across tabs at cold-start
		lockSettleMs = 50,
	} = opts;

	const safeReadCached = (typeof readCached === "function") ? readCached : () => null;
	const safeFetcher = (typeof fetcher === "function") ? fetcher : () => Promise.resolve(null);
	const safeStoreRaw = (typeof storeRaw === "function") ? storeRaw : () => {};
	const safeApply = (typeof apply === "function") ? apply : () => {};

	// SAME-TAB DEDUPE
	const existing = window.__MFL_inflight.get(cacheKey);
	if (existing) {
		logApi("INFLIGHT REUSE (same tab)", {
			cacheKey,
			tab: window.MFL_TAB_ID
		});
		return existing;
	}

	const p = (function run() {
		// 1) fast path: cache hit
		try {
			const cached = safeReadCached();
			if (cached) {
				logApi("CACHE HIT", {
					cacheKey,
					lockKey,
					tab: window.MFL_TAB_ID
				});
				try {
					safeApply(cached, "cache");
				} catch {}
				return Promise.resolve(cached);
			}
		} catch (e) {
			logApi("CACHE READ ERROR (continuing)", {
				cacheKey,
				err: String(e)
			});
		}

		// 2) lock: only one tab fetches
		logApi("LOCK TRY", {
			cacheKey,
			lockKey,
			bucket: String(cacheKey).split("_").slice(-1)[0],
			tab: window.MFL_TAB_ID
		});

		const rawLock = localStorage.getItem(lockKey);
		logApi("LOCK SEEN", {
			lockKey,
			rawLock: rawLock ? rawLock.slice(0, 120) : null,
			tab: window.MFL_TAB_ID
		});

		const haveLock = tryAcquireLock(lockKey, lockTtlMs);

		if (!haveLock) {
			logApi("WAITING (another tab owns lock)", {
				cacheKey,
				lockKey,
				tab: window.MFL_TAB_ID
			});

			return waitForStorageValue(cacheKey, waitMs).then((raw) => {
				if (raw != null) {
					try {
						const cached2 = safeReadCached();
						if (cached2) {
							logApi("GOT FROM STORAGE", {
								cacheKey,
								lockKey,
								tab: window.MFL_TAB_ID
							});
							try {
								safeApply(cached2, "storage");
							} catch {}
							return cached2;
						}
					} catch (e) {
						logApi("STORAGE PARSE/READ ERROR (fallback)", {
							cacheKey,
							err: String(e)
						});
					}
				}

				// follower must NOT fetch
				logApi("WAIT TIMEOUT -> NO FETCH (follower)", {
					cacheKey,
					lockKey,
					tab: window.MFL_TAB_ID
				});
				return null;
			});
		}

		// âœ… We think we have the lock. Now we must "settle + confirm"
		logApi("LOCK ACQUIRED (pre-confirm)", {
			cacheKey,
			lockKey,
			tab: window.MFL_TAB_ID
		});

		return new Promise((resolve) => setTimeout(resolve, lockSettleMs)).then(() => {
			if (!stillOwnLock(lockKey)) {
				// Another tab actually won; do NOT fetch
				logApi("LOCK LOST AFTER SETTLE -> FOLLOWER", {
					cacheKey,
					lockKey,
					tab: window.MFL_TAB_ID
				});

				// Wait for cacheKey (or give up as follower)
				return waitForStorageValue(cacheKey, waitMs).then(() => {
					try {
						const cached3 = safeReadCached();
						if (cached3) {
							logApi("GOT FROM STORAGE (post-lock-loss)", {
								cacheKey,
								lockKey,
								tab: window.MFL_TAB_ID
							});
							try {
								safeApply(cached3, "storage");
							} catch {}
							return cached3;
						}
					} catch {}
					logApi("NO CACHE AFTER LOCK LOSS (follower)", {
						cacheKey,
						lockKey,
						tab: window.MFL_TAB_ID
					});
					return null;
				});
			}

			// âœ… Confirmed winner
			logApi("LOCK CONFIRMED (this tab will fetch)", {
				cacheKey,
				lockKey,
				tab: window.MFL_TAB_ID
			});
			return doFetch(true);
		});

		function doFetch(release) {
			return Promise.resolve()
				.then(safeFetcher)
				.then((data) => {
					try {
						safeStoreRaw(data);
					} catch (e) {
						logApi("STORE ERROR", {
							cacheKey,
							err: String(e)
						});
					}
					try {
						safeApply(data, "api");
					} catch (e) {
						logApi("APPLY ERROR", {
							cacheKey,
							err: String(e)
						});
					}
					return data;
				})
				.catch((e) => {
					console.error("fetchOnceCrossTab error:", e);
					return null;
				})
				.finally(() => {
					if (release) {
						releaseLock(lockKey);
						logApi("LOCK RELEASED", {
							lockKey,
							tab: window.MFL_TAB_ID
						});
					}
				});
		}
	})();

	window.__MFL_inflight.set(cacheKey, p);

	return p.finally(() => {
		if (window.__MFL_inflight.get(cacheKey) === p) window.__MFL_inflight.delete(cacheKey);
	});
}


window.addEventListener("storage", (e) => {
	if (!e.key || e.newValue == null) return;

	// Keep 5-minute bucket aligned across tabs (normalize)
	if (e.key === FIVE_MIN_KEY) {
		const t = parseInt(e.newValue, 10);
		if (Number.isFinite(t) && t > 0) cacheFiveMinutes = computeFiveMinBucketMs(t);
		return;
	}

	// Keep 6-hour bucket aligned across tabs
	if (e.key === ("serverSixHours_" + year)) {
		const t = parseInt(e.newValue, 10);
		if (Number.isFinite(t) && t > 0) cacheSixHours = t;
		return;
	}

	// Keep DAILY bucket aligned across tabs
	if (e.key === ("serverDaily_" + year)) {
		const t = parseInt(e.newValue, 10);
		if (Number.isFinite(t) && t > 0) cacheDaily = t;
		return;
	}

	// NFL Bye Weeks (shared daily, all leagues)
	const bwPrefix = "cache_nflByeWeeks_" + year + "_";
	if (e.key.startsWith(bwPrefix)) {
		const parsed = safeJSONParse(e.newValue, () => {
			nflByeWeeksJsonError = true;
		});
		if (parsed) reportNflByeWeeks_ar = parsed;
		return;
	}

	// Injuries (shared)
	const injPrefix = "cache_injuries_" + year + "_";
	if (e.key.startsWith(injPrefix)) {
		const parsed = safeJSONParse(e.newValue, () => {
			injuryJsonError = true;
		});
		if (parsed) {
			reportInjuries_ar = parsed;
			if (parsed?.injuries?.injury) reportInjuriesResponse(reportInjuries_ar);
		}
		return;
	}

	// NewsBreaker (shared)
	if (e.key.startsWith("cache_newsBreaker_")) {
		const parsed = safeJSONParse(e.newValue);
		if (parsed) applyNewsBreakerFromJSON(parsed);
		return;
	}

	// MyLeagues (shared) - âœ… ONLY accept the CURRENT 6-hour bucket
	const mlKey = "cache_myLeagues_" + cacheSixHours;
	if (e.key === mlKey) {
		const parsed = safeJSONParse(e.newValue);
		if (parsed) applyMyLeaguesFromJSON(parsed);
		return;
	}

	// Transactions (league-specific)
	const txPrefix = "cache_transactions_" + year + "_" + league_id + "_";
	if (e.key.startsWith(txPrefix)) {
		const parsed = safeJSONParse(e.newValue, () => {
			transactionsJsonError = true;
		});
		if (parsed) reportTransactions_ar = parsed;
		return;
	}

	// Rosters (league-specific) âœ… PATCH: pass bucket from key suffix
	const rPrefix = "cache_roster_" + year + "_" + league_id + "_";
	if (e.key.startsWith(rPrefix)) {
		const parsed = safeJSONParse(e.newValue, () => {
			rosterJsonError = true;
		});
		if (parsed) {
			reportRoster_ar = parsed;
			const bucket = Number(e.key.slice(rPrefix.length));
			reportRosterResponse(reportRoster_ar, bucket);
		}
		return;
	}

	// League (league-specific, daily bucketed)
	const lgPrefix = "cache_league_" + year + "_" + league_id + "_";
	if (e.key.startsWith(lgPrefix)) {
		const parsed = safeJSONParse(e.newValue, () => {
			leagueJsonError = true;
		});
		if (parsed) {
			reportLeague_ar = parsed;
			reportLeagueResponse(reportLeague_ar);
			logApi("STORAGE UPDATE league", {
				league_id,
				key: e.key,
				tab: window.MFL_TAB_ID
			});
		}
		return;
	}

	// League Standings (league-specific, daily bucketed)
	const stPrefix = "cache_leagueStandings_" + year + "_" + league_id + "_";
	if (e.key.startsWith(stPrefix)) {
		const parsed = safeJSONParse(e.newValue, () => {
			standingsJsonError = true;
		});
		if (parsed) {
			reportStandingsResponse(parsed);
			logApi("STORAGE UPDATE standings", {
				league_id,
				key: e.key,
				tab: window.MFL_TAB_ID
			});
		}
		return;
	}

	// Player DB text (shared per-year) âœ… PATCH: load on direct write too
	const pdbKey = `playerDB_${year}`;
	if (e.key === pdbKey) {
		try {
			window.eval(e.newValue);
			if (!dbLooksPopulated(window.playerDatabase) && typeof playerDatabase !== "undefined") {
				window.playerDatabase = playerDatabase;
			}
		} catch (err) {
			console.warn("[MFLCache] playerDB storage update eval failed:", err);
		}
		return;
	}

	// Player DB refresh signal (shared per-year) âœ… PATCH: always reload from storage
	const pdbUpdatedKey = `playerDB_${year}_updatedAt`;
	if (e.key === pdbUpdatedKey) {
		try {
			const text = localStorage.getItem(`playerDB_${year}`);
			if (text) {
				window.eval(text);
				if (!dbLooksPopulated(window.playerDatabase) && typeof playerDatabase !== "undefined") {
					window.playerDatabase = playerDatabase;
				}
			}
		} catch (err) {
			console.warn("[MFLCache] playerDB updatedAt reload failed:", err);
		}
		return;
	}

	// Top Starters (shared per-year, per-week, daily bucketed)
	const tsPrefix = "cache_topStarters_" + year + "_w";
	if (e.key.startsWith(tsPrefix)) {
		const parsed = safeJSONParse(e.newValue, () => {
			topsJsonError = true;
		});
		if (parsed) {
			reportTopStarters_ar = parsed;
			logApi("STORAGE UPDATE topStarters", {
				key: e.key,
				tab: window.MFL_TAB_ID
			});
		}
		return;
	}

});


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                 SIGNAL CACHE READY               ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

window.MFLGlobalCache = window.MFLGlobalCache || {};
(function (api) {
	if (typeof api._ready === 'undefined') api._ready = false;
	if (!api._callbacks) api._callbacks = [];
	api.isReady = function () {
		return !!api._ready;
	};
	api.onReady = function (cb) {
		if (typeof cb !== 'function') return;
		if (api._ready) {
			try {
				cb();
			} catch (e) {
				console.error(e);
			}
		} else {
			api._callbacks.push(cb);
		}
	};
	api._fireReady = function () {
		if (api._ready) return;
		api._ready = true;
		// Fire a DOM event for scripts that prefer addEventListener
		try {
			window.dispatchEvent(new CustomEvent('MFLGlobalCacheReady', {
				detail: {
					fiveMinute: !!window.reportFiveMinuteFullyLoaded,
					daily: !!window.reportDailyFullyLoaded
				}
			}));
		} catch (e) {}
		var cbs = api._callbacks.slice();
		api._callbacks.length = 0;
		for (var i = 0; i < cbs.length; i++) {
			try {
				cbs[i]();
			} catch (e) {
				console.error(e);
			}
		}
	};
})(window.MFLGlobalCache);

function maybeSignalMFLGlobalCacheReady() {
	if (window.MFLGlobalCache && !window.MFLGlobalCache._ready && window.reportFiveMinuteFullyLoaded && window.reportDailyFullyLoaded && lsm_firstFetchDone) {
		window.MFLGlobalCache._fireReady();
	}
}

function signalMFLCacheUpdate(key, extraDetail) {
	if (typeof window === 'undefined' ||
		typeof CustomEvent === 'undefined' ||
		typeof window.dispatchEvent !== 'function') {
		return;
	}
	try {
		window.dispatchEvent(new CustomEvent("MFLCacheUpdate", {
			detail: Object.assign({
				key
			}, extraDetail || {})
		}));
	} catch (e) {}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////     LIVE STATS XML POLLER (NO LOCALSTORAGE)      ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function allGamesFinalFromLiveFeed(weekNum) {
	if (weekNum < completedWeek) return true;

	const wk = Number(weekNum);
	const weekly = reportWeeklyResults_ar?.["w_" + wk]?.weeklyResults;
	if (!weekly) return false;

	const toArray = (x) => (Array.isArray(x) ? x : (x ? [x] : []));
	const isReal = (id) => {
		const s = String(id ?? "");
		return s && s !== "BYE" && s !== "AVG";
	};

	// Collect best view per franchise id (avoid duplicate/partial copies)
	const byFid = Object.create(null);

	for (const fr of toArray(weekly.franchise)) {
		const id = String(fr?.id ?? "");
		if (!isReal(id)) continue;
		if (fr && typeof fr === "object") byFid[id] = fr;
	}

	for (const m of toArray(weekly.matchup)) {
		for (const fr of toArray(m?.franchise)) {
			const id = String(fr?.id ?? "");
			if (!isReal(id)) continue;
			if (fr && typeof fr === "object") {
				// prefer the copy that actually has score if one does
				if (!byFid[id] || !Object.prototype.hasOwnProperty.call(byFid[id], "score")) {
					byFid[id] = fr;
				}
			}
		}
	}

	const fids = Object.keys(byFid);
	if (!fids.length) return false;

	// Require that every real franchise we saw has a score field (even "0")
	for (const fid of fids) {
		const fr = byFid[fid];
		if (!Object.prototype.hasOwnProperty.call(fr, "score")) return false;
	}

	return true;
}

// -------------------- Global state --------------------
// Reactive live-state wrapper so other scripts can detect when games go LIVE
(function setupLsmLiveState() {
	let liveState = (typeof window.lsm_is_live_now === "boolean") ? window.lsm_is_live_now : false;

	Object.defineProperty(window, "lsm_is_live_now", {
		configurable: true,
		get() {
			return liveState;
		},
		set(value) {
			const newVal = !!value;
			if (newVal === liveState) return;

			const oldVal = liveState;
			liveState = newVal;

			try {
				window.dispatchEvent(new CustomEvent("lsmLiveChange", {
					detail: {
						oldValue: oldVal,
						newValue: newVal
					}
				}));
			} catch (e) {
				console.warn("[LS] lsmLiveChange event dispatch failed", e);
			}
		}
	});
})();

// âœ… No week: current-week liveScoring only
function bcNameLive(year, leagueId) {
	return `MFL_LIVESCORING_${year}_${leagueId}`;
}

function ensureLiveScoringChannel(year, leagueId) {
	if (!("BroadcastChannel" in window)) return null;

	const name = bcNameLive(year, leagueId);
	if (window.__LSM_bc && window.__LSM_bc.name === name) return window.__LSM_bc;

	// close old channel (different league/year)
	try {
		if (window.__LSM_bc) window.__LSM_bc.close();
	} catch {}

	const bc = new BroadcastChannel(name);
	window.__LSM_bc = bc;

	// follower listener: update in-memory array
	bc.addEventListener("message", (ev) => {
		const msg = ev.data;
		if (!msg || msg.type !== "liveScoring") return;

		// âœ… sanity: match league + year only
		if (String(msg.league_id) !== String(leagueId)) return;
		if (String(msg.year) !== String(year)) return;

		window.liveScoringLiveWeek = msg.payload;
	});

	return bc;
}

async function getLiveScoringAPI() {
	if (!liveScoringWeek || !league_id) return null;

	// âœ… No week in lock: current-week only
	const lockKey = `lock_liveScoring_${year}_${league_id}`;
	const bc = ensureLiveScoringChannel(year, league_id);

	// follower: do NOT fetch, wait briefly for leader broadcast
	const haveLock = tryAcquireLock(lockKey, 25000);

	if (!haveLock) {
		if (bc) {
			const got = await new Promise((resolve) => {
				const t = setTimeout(() => resolve(null), 6000);

				function onMsg(ev) {
					const msg = ev.data;
					if (
						msg &&
						msg.type === "liveScoring" &&
						String(msg.league_id) === String(league_id) &&
						String(msg.year) === String(year)
					) {
						clearTimeout(t);
						bc.removeEventListener("message", onMsg);
						resolve(msg.payload);
					}
				}

				bc.addEventListener("message", onMsg);
			});

			if (got) {
				window.liveScoringLiveWeek = got;
				return got;
			}
		}
		return window.liveScoringLiveWeek || null;
	}

	// leader fetches
	try {
		const week = Number(liveScoringWeek); // still used for the API URL
		const url = `${baseURLDynamic}/${year}/export?TYPE=liveScoring&L=${league_id}&W=${week}&DETAILS=1&JSON=1`;

		const response = await fetch(url, {
			cache: "no-store"
		});
		if (!response.ok) throw new Error("liveScoring HTTP " + response.status);

		const data = await response.json();
		window.liveScoringLiveWeek = data;

		// publish to other tabs (same league)
		if (bc) {
			try {
				bc.postMessage({
					type: "liveScoring",
					year,
					league_id,
					ts: Date.now(),
					payload: data
				});
			} catch {}
		}

		return data;
	} catch (e) {
		console.warn("[LS] getLiveScoringAPI failed:", e);
		return null;
	} finally {
		releaseLock(lockKey);
	}
}


// Decide if a given REFRESH (ms) means "live"
function lsmIsLiveFromRefreshMs(ms) {
	if (!Number.isFinite(ms) || ms <= 0) return false;
	// Treat anything <= 5 minutes as "live"
	return ms <= 5 * 60 * 1000;
}

// Parse XML text into temp snapshots, then swap atomically into lsm_stats / lsm_tstats
function lsmParseXmlIntoStats(xmlText) {
	const newStats = [];
	const newTstats = [];

	const lines = xmlText.split("\n");

	for (const line of lines) {
		if (!line.trim()) continue;

		const fields = line.split("|");
		const tag = fields[0];

		if (tag === "DATE") {
			lsm_last_update_secs_first = fields[1];
			continue;
		}

		if (tag === "REFRESH") {
			const n = Number(fields[1]);
			if (Number.isFinite(n) && n > 0) {
				lsm_refreshMs = n;
				window.lsm_is_live_now = lsmIsLiveFromRefreshMs(n);
			}
			continue;
		}

		if (!isNaN(tag)) {
			// Position player line (numeric id)
			if (!newStats[tag]) newStats[tag] = {};
			for (let j = 1; j < fields.length; j++) {
				const [key, value] = fields[j].split(" ");
				if (key) {
					newStats[tag][key] = value;
				}
			}
		} else {
			// Team stats line (e.g. "DAL", "PHI", "CIN")
			if (!newTstats[tag]) newTstats[tag] = {};
			for (let j = 1; j < fields.length; j++) {
				const [key, value] = fields[j].split(" ");
				if (key) {
					newTstats[tag][key] = value;
				}
			}
		}
	}
	lsm_stats = newStats;
	lsm_tstats = newTstats;
	lsm_firstFetchDone = true;
	maybeSignalMFLGlobalCacheReady();
}

// Set or clear a manual refresh interval override for live games
function lsmSetLiveRefreshOverride(ms) {
	if (!Number.isFinite(ms) || ms <= 0) {
		lsm_manualOverrideMs = null;
		return;
	}
	lsm_manualOverrideMs = ms;

	// If we're already polling and games are live, restart timer using new interval
	if (window.lsm_is_live_now && lsm_pollTimerId !== null) {
		clearTimeout(lsm_pollTimerId);
		lsm_pollTimerId = null;
		lsm_get_stats(true);
	}
}

// Main fetch + polling function
// scheduleNext = true  -> fetch + schedule another fetch
// scheduleNext = false -> fetch once, no polling
async function lsm_get_stats(scheduleNext = true) {
	// Prevent double timers
	if (lsm_pollTimerId !== null) {
		clearTimeout(lsm_pollTimerId);
		lsm_pollTimerId = null;
	}
	let isAllFinal = false;
	let now = Date.now ? Date.now() : new Date().getTime();

	// Use liveScoringWeek as the source week
	let weekNum = liveScoringWeek || 1; // safe fallback
	let weekStr = weekNum < 10 ? "0" + weekNum : String(weekNum);

	// Build URL (with IDP if needed)
	let baseUrl = xmlBaseURL + "live_stats_idp_";
	let url = baseUrl + weekStr + ".txt?RANDOM=" + now;

	try {
		const response = await fetch(url, {
			cache: "no-store"
		});
		if (!response.ok) {
			throw new Error("Network response was not ok: " + response.status);
		}

		const xmlText = await response.text();

		// Parse XML into arrays + REFRESH + live flag
		lsmParseXmlIntoStats(xmlText);

		if (lsm_scheduleStarted) {
			// Make sure these complete before we check finals
			await reportNflScheduleAPI(liveScoringWeek);
			await getLiveScoringAPI();

			if (liveScoringWeek === completedWeek) {
				isAllFinal = allGamesFinalFromLiveFeed(liveScoringWeek);
				if (!isAllFinal) {
					const now = Date.now();
					if (now - lsm_lastWeeklyResultsCheck >= WEEKLY_RESULTS_RECHECK_MS) {
						lsm_lastWeeklyResultsCheck = now;
						reportWeeklyResultsAPI(liveScoringWeek, true);
					}
				}
			}

			try {
				if (typeof window.LSMupdate === "function" && document.getElementById("lsmShowHide")) {
					await window.LSMupdate();
				}
				if (window.doMFLBox === true && typeof window.doMFLBoxLiveUpdate === "function") {
					await window.doMFLBoxLiveUpdate();
				}
				if (window.doTicker === true && typeof window.getTickerLiveStats === "function") {
					await window.getTickerLiveStats();
				}
			} catch (err) {
				console.error("Delayed update chain failed:", err);
			}

			// âœ… stop AFTER final UI update, regardless of UI errors
			if (isAllFinal) {
				lsmStopLiveStatsPolling();
				return; // prevents scheduling next timeout
			}
		}

		lsm_scheduleStarted = true;

	} catch (error) {
		console.warn("[LS] lsm_get_stats fetch/parse error:", error);
		if (!Number.isFinite(lsm_refreshMs) || lsm_refreshMs <= 0) {
			lsm_refreshMs = 5 * 60 * 1000;
		}
		if (!lsm_firstFetchDone) {
			lsm_firstFetchDone = true;
			maybeSignalMFLGlobalCacheReady();
		}
		if (lsm_scheduleStarted) {
			await reportNflScheduleAPI(liveScoringWeek);
			await getLiveScoringAPI();

			if (allGamesFinalFromLiveFeed(liveScoringWeek)) {
				lsmStopLiveStatsPolling();
				return;
			}
		}
		lsm_scheduleStarted = true;
	}

	// If we only wanted a single fetch (no polling), stop here
	if (!scheduleNext) return;

	// Schedule next poll based on REFRESH
	let nextDelay = lsm_refreshMs;

	// If games are live AND you set an override, use that instead:
	if (window.lsm_is_live_now &&
		Number.isFinite(lsm_manualOverrideMs) &&
		lsm_manualOverrideMs > 0) {
		nextDelay = lsm_manualOverrideMs;
	}

	// Safety caps
	const MIN_MS = 15 * 1000; // never less than 15s
	const MAX_MS = 5 * 60 * 1000; // never more than 5m
	//const MAX_MS = 60 * 1000; // never more than 1m
	//const MAX_MS = 10 * 60 * 1000; // never more than 10m

	if (!Number.isFinite(nextDelay) || nextDelay <= 0) {
		//nextDelay = 60 * 1000; // fallback 1m
		//nextDelay = 10 * 60 * 1000; // fallback 10m
		nextDelay = 5 * 60 * 1000; // fallback 5m
	} else {
		if (nextDelay < MIN_MS) nextDelay = MIN_MS;
		if (nextDelay > MAX_MS) nextDelay = MAX_MS;
	}

	// e.g. REFRESH=3600000 pregame, REFRESH=40000 when live
	lsm_pollTimerId = setTimeout(function () {
		lsm_get_stats(true);
	}, nextDelay);
}

// Stop polling (if you ever need to)
function lsmStopLiveStatsPolling() {
	if (lsm_pollTimerId !== null) {
		clearTimeout(lsm_pollTimerId);
		lsm_pollTimerId = null;
	}
}

lsmSetLiveRefreshOverride(20000);

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////      VARIABLES FOR FIVE MINUTE CACHE ITEMS       ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// VARS SET BY ROSTERS API
if (reportRoster_ar === undefined) var reportRoster_ar = [];
if (mfl_rosters === undefined) var mfl_rosters = [];
if (reportCustomPlayer_ar === undefined) var reportCustomPlayer_ar = [];
if (customPlayerString === undefined) var customPlayerString = "";

// VARS SET BY INJURIES API 
if (reportInjuries_ar === undefined) var reportInjuries_ar = [];
if (mfl_injuries === undefined) var mfl_injuries = [];

// VARS SET BY TRANSACTIONS API 
if (reportTransactions_ar === undefined) var reportTransactions_ar = [];

// VARS SET BY NEWSBREAKER API 
if (typeof newsBreaker === "undefined") var newsBreaker = undefined;

// VARS SET BY WEATHER API 
if (typeof weather === "undefined") var weather = undefined;

// VARS SET BY MYLEAGUES API 
if (typeof myLeagues === "undefined") var myLeagues = undefined;

// SET UP GLOBAL VARS FOR FIVE MINUTE CACHED ITEMS
if (reportFiveMinuteApi_ran === undefined) var reportFiveMinuteApi_ran = false;
if (reportFiveMinuteApiNoCache === undefined) var reportFiveMinuteApiNoCache = false;
if (reportFiveMinuteFullyLoaded === undefined) var reportFiveMinuteFullyLoaded = false;

// VARS FOR ERRORS
var rosterJsonError = false;
var injuryJsonError = false;
var transactionsJsonError = false;
var leagueJsonError = false;
var standingsJsonError = false;
var nflByeWeeksJsonError = false;
var projectionsJsonError = false;
var topsJsonError = false;
var resultsJsonError = false;
var nflScheduleJsonError = false;


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////            FIVE MINUTE CACHE FUNCTIONS           ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function doFiveMinuteCache(bucketArg) {
	reportFiveMinuteApi_ran = true;
	reportFiveMinuteApiNoCache = false;
	await waitForPlayerDatabase();

	const bucket = resolveFiveMinBucket(bucketArg); // snapshot once

	try {
		const [rosters, injuries, transactions, newsBreaker, myLeagues] = await Promise.all([
			reportRostersAPI(bucket),
			reportInjuriesAPI(bucket),
			reportTransactionsAPI(bucket),
			loadNewsBreakerJSON(bucket),
			loadMyLeaguesJSON()
		]);

		if (reportFiveMinuteApiNoCache && usingIndexedDB && db) {
			updateDbTimestamp(db, "lid_" + year + "_" + league_id + "_fiveMinute", bucket);
		}

		reportFiveMinuteFullyLoaded = true;
		maybeSignalMFLGlobalCacheReady();
		loadWeatherJSONDelayed();
	} catch (error) {
		console.error(error);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                    PLAYER DATABASE               ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// =========================
// PLAYER DB HELPERS (PATCHED)
// =========================
if (typeof window.Player === "undefined") {
	window.Player = function (id, name, position, team, bye1, bye2, extra) {
		this.id = id;
		this.name = name;
		this.position = position;
		this.team = team;
		this.bye_week = bye1;
	};
}

function getLivePlayerDB() {
	return window.playerDatabase || null;
}

function dbLooksPopulated(DB) {
	if (!DB) return false;
	if (Array.isArray(DB)) return DB.length > 0 || Object.keys(DB).length > 0;
	return Object.keys(DB).length > 0;
}

function preloadPlayerDB(year) {
	try {
		const text = localStorage.getItem(`playerDB_${year}`);
		if (!text) return false;

		window.eval(text);

		// âœ… PATCH: assign if not populated (not just undefined)
		if (!dbLooksPopulated(window.playerDatabase) && typeof playerDatabase !== "undefined") {
			window.playerDatabase = playerDatabase;
		}

		const live = window.playerDatabase;
		const keyCount = live ? Object.keys(live).length : 0;
		if (!live || keyCount === 0) {
			console.warn("[MFLCache] preloadPlayerDB: eval did not create a populated playerDatabase");
			return false;
		}
		return true;
	} catch (e) {
		console.warn("[MFLCache] preloadPlayerDB failed:", e);
		return false;
	}
}

async function downloadAndCachePlayerDB(year) {
	const url = `${baseURLDynamic}/fflnet${year}/mfl_player_database.js`;

	const res = await fetch(url, {
		cache: "no-store"
	});
	if (!res.ok) throw new Error("playerDB HTTP " + res.status);

	const text = await res.text();

	window.eval(text);

	// âœ… PATCH: assign if not populated (not just undefined)
	if (!dbLooksPopulated(window.playerDatabase) && typeof playerDatabase !== "undefined") {
		window.playerDatabase = playerDatabase;
	}

	try {
		localStorage.setItem(`playerDB_${year}`, text);
		localStorage.setItem(`playerDB_${year}_updatedAt`, String(Date.now()));
	} catch (e) {
		console.warn("[MFLCache] Could not store playerDB in localStorage:", e);
	}

	return window.playerDatabase || null;
}

async function ensurePlayerDB(year) {
	const live = getLivePlayerDB();
	if (dbLooksPopulated(live)) return live;

	const cacheKey = `playerDB_${year}`; // cross-tab wake key (JS text)
	const lockKey = `lock_playerDB_${year}`; // only one tab downloads

	await fetchOnceCrossTab({
		cacheKey,
		lockKey,
		lockTtlMs: 60000,
		waitMs: 60000,

		readCached: () => {
			const live0 = getLivePlayerDB();
			if (dbLooksPopulated(live0)) return live0;

			if (preloadPlayerDB(year)) {
				const live1 = getLivePlayerDB();
				return dbLooksPopulated(live1) ? live1 : null;
			}
			return null;
		},

		fetcher: async () => {
			logApi("API FETCH playerDB", {
				year,
				tab: window.MFL_TAB_ID
			});

			await downloadAndCachePlayerDB(year); // eval + writes `playerDB_${year}_updatedAt`

			logApi("API RESP playerDB", {
				year,
				tab: window.MFL_TAB_ID
			});

			// Return JS text for cross-tab wake write
			try {
				return localStorage.getItem(`playerDB_${year}`) || null;
			} catch {
				return null;
			}
		},

		storeRaw: (text) => {
			// Always write the cross-tab wake key (even though download stored playerDB_${year})
			if (!text) return;
			try {
				localStorage.setItem(cacheKey, text);
				localStorage.setItem(`playerDB_${year}_updatedAt`, String(Date.now()));
			} catch {}
		},

		apply: (data) => {
			// Sanity: if we got text but DB still not populated, eval it
			const live2 = getLivePlayerDB();
			if (!dbLooksPopulated(live2) && typeof data === "string") {
				try {
					window.eval(data);
					if (!dbLooksPopulated(window.playerDatabase) && typeof playerDatabase !== "undefined") {
						window.playerDatabase = playerDatabase;
					}
				} catch {}
			}
		}
	});

	const liveFinal = getLivePlayerDB();
	return dbLooksPopulated(liveFinal) ? liveFinal : null;
}

async function waitForPlayerDatabase() {
	return ensurePlayerDB(year);
}

function maybeRefreshPlayerDBInBackground(year) {
	try {
		const text = localStorage.getItem(`playerDB_${year}`);
		if (!text) return;

		const updatedAtStr = localStorage.getItem(`playerDB_${year}_updatedAt`);
		const updatedAt = updatedAtStr ? parseInt(updatedAtStr, 10) : 0;

		const now = Date.now();
		const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
		if (updatedAt && (now - updatedAt) < oneWeekMs) return;

		setTimeout(function () {
			const lockKey = `lock_playerDB_${year}`;
			const haveLock = tryAcquireLock(lockKey, 60000);
			if (!haveLock) return;

			downloadAndCachePlayerDB(year)
				.then(() => {
					// âœ… PATCH: bump updatedAt to trigger other tabs reliably
					try {
						localStorage.setItem(`playerDB_${year}_updatedAt`, String(Date.now()));
					} catch {}
				})
				.catch((e) => console.warn("[MFLCache] background playerDB refresh failed:", e))
				.finally(() => releaseLock(lockKey));
		}, 5000);
	} catch (e) {
		console.warn("[MFLCache] maybeRefreshPlayerDBInBackground error:", e);
	}
}

// Keep your existing init lines
window.playerDatabase = window.playerDatabase || [];
maybeRefreshPlayerDBInBackground(year);

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                    ROSTERS API                   ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportRostersAPI(bucketArg) {
	const bucket = resolveFiveMinBucket(bucketArg);

	const cacheKey = "cache_roster_" + year + "_" + league_id + "_" + bucket;
	const lockKey = `lock_roster_${year}_${league_id}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,

		readCached: () => {
			if (usingIndexedDB) {
				const rec = reportDb_ar["lid_" + year + "_" + league_id + "_fiveMinute"];
				if (rec && Number(rec.timestamp) === bucket && rec.ar && rec.ar.rosters) {
					const parsed = safeJSONParse(rec.ar.rosters, () => {
						rosterJsonError = true;
					});
					if (parsed) {
						reportRoster_ar = parsed;
						if (parsed?.rosters?.franchise) reportRosterResponse(reportRoster_ar, bucket);
						return parsed;
					}
				}
				return null;
			}

			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached, () => {
				rosterJsonError = true;
			});
			if (parsed) {
				reportRoster_ar = parsed;
				if (parsed?.rosters?.franchise) reportRosterResponse(reportRoster_ar, bucket);
				return parsed;
			}
			return null;
		},

		fetcher: () => {
			logApi("API FETCH rosters", {
				league_id,
				bucket,
				tab: window.MFL_TAB_ID
			});

			reportFiveMinuteApiNoCache = true;
			return fetch(`${baseURLDynamic}/${year}/export?TYPE=rosters&L=${league_id}&JSON=1`, {
					cache: "no-store"
				})
				.then(r => {
					logApi("API RESP rosters", {
						league_id,
						bucket,
						status: r.status
					});
					if (!r.ok) throw new Error("rosters HTTP " + r.status);
					return r.json();
				});
		},

		storeRaw: (data) => {
			// cross-tab wakeup signal (always)
			try {
				clearCacheKey("cache_roster_" + year + "_" + league_id);
				localStorage.setItem(cacheKey, JSON.stringify(data));
			} catch {}

			// optional: IndexedDB for persistence
			if (usingIndexedDB) {
				updateDbLocalStr(db, "lid_" + year + "_" + league_id + "_fiveMinute", "rosters", JSON.stringify(data));
			}
		},


		apply: (data, source) => {
			if (!data) return;

			reportRoster_ar = data;
			if (data?.rosters?.franchise) reportRosterResponse(reportRoster_ar, bucket);

			if (source === "api") {
				signalMFLCacheUpdate("rosters", {
					source: "api",
					ttl: "fiveMinute",
					league_id
				});
			}
		}
	});
}

function reportRosterResponse(response, bucketArg) {
	const bucket = resolveFiveMinBucket(bucketArg);

	customPlayerString = "";

	if (!response || !response.rosters || !response.rosters.franchise) return;

	for (var i = 0; i < response.rosters.franchise.length; i++) {
		var fid = response.rosters.franchise[i].id;
		mfl_rosters["fid_" + fid] = ({
			"id": fid,
			"player": []
		});

		try {
			if (response.rosters.franchise[i].player.length !== undefined) {
				for (var j = 0; j < response.rosters.franchise[i].player.length; j++) {
					var player = response.rosters.franchise[i].player[j];
					var pid = player.id;
					doMFL_rosters_player(fid, pid, player);
				}
			} else {
				var player = response.rosters.franchise[i].player;
				var pid = player.id;
				doMFL_rosters_player(fid, pid, player);
			}
		} catch (er) {
			try {
				var player = response.rosters.franchise[i].player;
				var pid = player.id;
				doMFL_rosters_player(fid, pid, player);
			} catch (er) {}
		}
	}

	if (customPlayerString !== "") {
		var missingPlayers = customPlayerString.split(",");
		for (var k = 0; k < missingPlayers.length - 1; k++) {
			var mpid = missingPlayers[k];
			playerDatabase["pid_" + mpid].name = "Invalid Player";
			playerDatabase["pid_" + mpid].position = "na";
			playerDatabase["pid_" + mpid].team = "FA";
			playerDatabase["pid_" + mpid].status = "na";
		}

		// âœ… use bucket (not cacheFiveMinutes)
		const cacheKey = "cache_customPlayer_" + year + "_" + league_id + "_" + bucket;
		const cached = cacheResponse(cacheKey);

		if (cached !== false) {
			const parsed = safeJSONParse(cached);
			if (parsed) {
				reportCustomPlayer_ar = parsed;
				return reportCustomPlayerResponse(reportCustomPlayer_ar);
			}
		}

		return fetch(`${baseURLDynamic}/${year}/export?TYPE=players&PLAYERS=${customPlayerString}&L=${league_id}&JSON=1`)
			.then(response => {
				if (response.ok) return response.json();
				throw new Error("Network response was not ok");
			})
			.then(data => {
				reportCustomPlayer_ar = data;
				clearCacheKey("cache_customPlayer_" + year + "_" + league_id);

				// âœ… use bucket (not cacheFiveMinutes)
				localStorage.setItem(
					"cache_customPlayer_" + year + "_" + league_id + "_" + bucket,
					JSON.stringify(reportCustomPlayer_ar)
				);

				reportCustomPlayerResponse(data);
			})
			.catch(error => {
				console.error("Error fetching custom player data:", error);
			});
	}
}

function reportCustomPlayerResponse(response) {
	try { //THERE WILL BE AN ERROR IF NO PLAYERS FOUND IN PLAYERS
		for (var i = 0; i < response.players.player.length; i++) {
			var player = response.players.player[i];
			var pid = player.id;
			playerDatabase["pid_" + pid].name = player.name;
			playerDatabase["pid_" + pid].position = player.position;
			playerDatabase["pid_" + pid].team = player.team;
			if (player.status === undefined) playerDatabase["pid_" + pid].status = "";
			else playerDatabase["pid_" + pid].status = player.status;
		}
	} catch (er) {}
}

function doMFL_rosters_player(fid, pid, player) {
	mfl_rosters["fid_" + fid]["player"]["pid_" + pid] = ({
		"id": pid,
		"status": player.status
	});
	if (playerDatabase["pid_" + pid] == undefined) {
		playerDatabase["pid_" + pid] = [];
		customPlayerString += pid + ",";
	}
	if (playerDatabase["pid_" + pid].fid == undefined) playerDatabase["pid_" + pid].fid = fid + ",";
	else playerDatabase["pid_" + pid].fid += fid + ",";
	if (playerDatabase["pid_" + pid].rosterStatus == undefined) playerDatabase["pid_" + pid].rosterStatus = player.status + ",";
	else playerDatabase["pid_" + pid].rosterStatus += player.status + ",";
	if (player.contractStatus == undefined) {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].contractStatus = "";
		playerDatabase["pid_" + pid].contractStatus = "";
	} else {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].contractStatus = player.contractStatus;
		playerDatabase["pid_" + pid].contractStatus = player.contractStatus;
	}
	if (player.contractYear == undefined) {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].contractYear = "";
		playerDatabase["pid_" + pid].contractYear = "";
	} else {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].contractYear = player.contractYear;
		playerDatabase["pid_" + pid].contractYear = player.contractYear;
	}
	if (player.contractInfo == undefined) {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].contractInfo = "";
		playerDatabase["pid_" + pid].contractInfo = "";
	} else {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].contractInfo = player.contractInfo;
		playerDatabase["pid_" + pid].contractInfo = player.contractInfo;
	}
	if (player.drafted == undefined) {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].drafted = "";
		playerDatabase["pid_" + pid].drafted = "";
	} else {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].drafted = player.drafted;
		playerDatabase["pid_" + pid].drafted = player.drafted;
	}
	if (player.salary == undefined) {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].salary = "";
		playerDatabase["pid_" + pid].salary = "";
	} else {
		mfl_rosters["fid_" + fid]["player"]["pid_" + pid].salary = player.salary;
		playerDatabase["pid_" + pid].salary = player.salary;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                     INJURIES API                 ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

const INJURY_CODE_MAP = {
	"SUSPENDED": "S",
	"PROBABLE": "P",
	"QUESTIONABLE": "Q",
	"DOUBTFUL": "D",
	"OUT": "O",
	"IR": "I",
	"IR-R": "I",
	"IR-PUP": "I",
	"IR-NFI": "I",
	"COVID-IR": "C",
	"HOLDOUT": "H"
};

async function reportInjuriesAPI(bucketArg) {
	const bucket = resolveFiveMinBucket(bucketArg);
	const cacheKey = "cache_injuries_" + year + "_" + bucket;
	const lockKey = `lock_injuries_${year}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,

		readCached: () => {
			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;
			const parsed = safeJSONParse(cached, () => {
				injuryJsonError = true;
			});
			return parsed || null;
		},

		fetcher: () => {
			logApi("API FETCH injuries", {
				endpoint: "injuries",
				bucket, // âœ… use the computed bucket
				tab: window.MFL_TAB_ID
			});

			reportFiveMinuteApiNoCache = true;

			return fetch(`https://api.myfantasyleague.com/${year}/export?TYPE=injuries&JSON=1`, {
					cache: "no-store"
				})
				.then(r => {
					logApi("API RESP injuries", {
						endpoint: "injuries",
						status: r.status,
						tab: window.MFL_TAB_ID
					});

					if (!r.ok) throw new Error("Network response was not ok");
					return r.json();
				});
		},


		storeRaw: (data) => {
			clearCacheKey("cache_injuries_" + year + "_");
			localStorage.setItem(cacheKey, JSON.stringify(data));
		},

		apply: (data, source) => {
			if (!data) return;
			reportInjuries_ar = data;
			reportInjuriesResponse(reportInjuries_ar);

			// only signal when WE fetched; storage listener already handles propagation
			if (source === "api") {
				signalMFLCacheUpdate("injuries", {
					source: "api",
					ttl: "fiveMinute"
				});
			}
		}
	});
}

function reportInjuriesResponse(response) {
	if (!response || !response.injuries || !response.injuries.injury) return;
	mfl_injuries = {
		week: response.injuries.week,
		timestamp: response.injuries.timestamp,
		player: []
	};
	for (var i = 0; i < response.injuries.injury.length; i++) {
		var player = response.injuries.injury[i];
		var pid = player.id;
		var status = player.status || "";
		var normalized = status.toUpperCase();
		var code = INJURY_CODE_MAP[normalized] || status.substr(0, 1);
		mfl_injuries.player["pid_" + pid] = {
			id: pid,
			status: player.status,
			details: player.details,
			code: code
		};
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  TRANSACTIONS API                ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportTransactionsAPI(bucketArg) {
	const bucket = resolveFiveMinBucket(bucketArg);

	const cacheKey = "cache_transactions_" + year + "_" + league_id + "_" + bucket;
	const lockKey = `lock_transactions_${year}_${league_id}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,

		readCached: () => {
			if (usingIndexedDB) {
				const rec = reportDb_ar["lid_" + year + "_" + league_id + "_fiveMinute"];
				if (rec && rec.timestamp === bucket && rec.ar && rec.ar.transactions) {
					const parsed = safeJSONParse(rec.ar.transactions, () => {
						transactionsJsonError = true;
					});
					if (parsed) {
						reportTransactions_ar = parsed;
						return parsed;
					}
				}
				return null;
			}

			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached, () => {
				transactionsJsonError = true;
			});
			if (parsed) {
				reportTransactions_ar = parsed;
				return parsed;
			}
			return null;
		},

		fetcher: () => {
			// If you have `bucket` in outer scope (recommended), log that.
			// Otherwise, fall back to resolveFiveMinBucket().
			const b = resolveFiveMinBucket(bucket);

			logApi("API FETCH transactions", {
				endpoint: "transactions",
				league_id,
				bucket,
				tab: window.MFL_TAB_ID
			});

			reportFiveMinuteApiNoCache = true;

			return fetch(`${baseURLDynamic}/${year}/export?TYPE=transactions&L=${league_id}&JSON=1`, {
					cache: "no-store"
				})
				.then(r => {
					logApi("API RESP transactions", {
						endpoint: "transactions",
						league_id,
						bucket: b,
						status: r.status,
						tab: window.MFL_TAB_ID
					});

					if (!r.ok) throw new Error("Network response was not ok");
					return r.json();
				});
		},


		storeRaw: (data) => {
			// cross-tab wakeup signal (always)
			try {
				clearCacheKey("cache_transactions_" + year + "_" + league_id);
				localStorage.setItem(cacheKey, JSON.stringify(data));
			} catch {}

			// optional: IndexedDB for persistence
			if (usingIndexedDB) {
				updateDbLocalStr(
					db,
					"lid_" + year + "_" + league_id + "_fiveMinute",
					"transactions",
					JSON.stringify(data)
				);
			}
		},


		apply: (data, source) => {
			if (!data) return;

			reportTransactions_ar = data;

			// Only signal when THIS tab actually fetched.
			if (source === "api") {
				signalMFLCacheUpdate("transactions", {
					source: "api",
					ttl: "fiveMinute",
					league_id
				});
			}
		}
	});
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  NEWSBREAKER API                 ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function applyNewsBreakerFromJSON(obj) {
	try {
		if (!obj || typeof obj !== "object") return false;

		// New format: { "newsBreaker": { "pid_123": 0, ... } }
		if (obj.newsBreaker && typeof obj.newsBreaker === "object") {
			window.newsBreaker = obj.newsBreaker;
			return true;
		}

		// Legacy/fallback: { "pid_123": 0, ... }
		window.newsBreaker = obj;
		return true;
	} catch (e) {
		return false;
	}
}

function loadNewsBreakerJSON(bucketArg) {
	const bucket = resolveFiveMinBucket(bucketArg);
	const cacheKey = "cache_newsBreaker_" + bucket;
	const lockKey = `lock_newsBreaker_${year}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,

		readCached: () => {
			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached);
			if (parsed && applyNewsBreakerFromJSON(parsed)) {
				return window.newsBreaker || parsed; // either is fine
			}
			return null;
		},

		fetcher: async () => {
			logApi("API FETCH newsBreaker", {
				bucket,
				tab: window.MFL_TAB_ID
			});
			const url = "https://www.mflscripts.com/mfl-apps/popups/assets/newsBreaker.json?rand=" + currentServerTime;
			const response = await fetch(url, {
				cache: "no-store"
			});
			if (!response.ok) throw new Error("newsBreaker JSON HTTP " + response.status);
			return response.json();
		},

		storeRaw: (data) => {
			clearCacheKey("cache_newsBreaker");
			localStorage.setItem(cacheKey, JSON.stringify(data));
		},

		apply: (data, source) => {
			applyNewsBreakerFromJSON(data);

			if (source === "api") {
				signalMFLCacheUpdate("newsBreaker", {
					source: "api",
					ttl: "fiveMinute"
				});
			}
		}
	}).then(() => window.newsBreaker || null);
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                   MY LEAGUES API                 ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function applyMyLeaguesFromJSON(obj) {
	try {
		const league = obj?.leagues?.league;

		if (Array.isArray(league)) {
			window.myLeagues = league;
			return true;
		}
		if (league && typeof league === "object") {
			window.myLeagues = [league];
			return true;
		}

		// âœ… Donâ€™t wipe good state on malformed/empty responses
		return false;
	} catch (e) {
		return false;
	}
}


async function loadMyLeaguesJSON() {
	// bucketArg intentionally ignored (5-min bucket); myLeagues is 6-hour TTL

	// âœ… recompute each run
	const sixBucket = getCacheSixHours(currentServerTime);

	const basePrefix = "cache_myLeagues_";
	const cacheKey = basePrefix + sixBucket;
	const lockKey = `lock_myLeagues_${year}`;

	//console.groupCollapsed(`[myLeagues] loadMyLeaguesJSON`);
	//console.log("sixBucket:", sixBucket, "cacheKey:", cacheKey, "lockKey:", lockKey);
	//console.log("existing window.myLeagues len:", Array.isArray(window.myLeagues) ? window.myLeagues.length : window.myLeagues);

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,
		lockTtlMs: 45000,
		waitMs: 45000,

		readCached: () => {
			const raw = localStorage.getItem(cacheKey);
			//console.log("[readCached] localStorage.getItem len:", raw ? raw.length : null);

			const cached = cacheResponse(cacheKey);
			//console.log("[readCached] cacheResponse:", cached === false ? false : `string(len=${String(cached).length})`);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached, (e) => {
				console.warn("[readCached] safeJSONParse failed:", e);
			});
			//console.log("[readCached] parsed keys:", parsed ? Object.keys(parsed) : parsed);

			const ok = parsed && applyMyLeaguesFromJSON(parsed);
			//console.log("[readCached] apply ok:", !!ok, "myLeagues len now:", Array.isArray(window.myLeagues) ? window.myLeagues.length : window.myLeagues);

			if (ok) return window.myLeagues || [];
			return null;
		},

		fetcher: async () => {
			const url = `https://api.myfantasyleague.com/${year}/export?TYPE=myleagues&JSON=1`;
			//console.log("[fetcher] requesting:", url);

			const response = await fetch(url, {
				cache: "no-store",
				credentials: "include"
			});
			//console.log("[fetcher] status:", response.status, response.statusText);

			if (!response.ok) throw new Error("myleagues HTTP " + response.status);

			const data = await response.json();
			//console.log("[fetcher] response keys:", data ? Object.keys(data) : data);
			//console.log("[fetcher] leagues exists?", !!data?.leagues, "league type:", typeof data?.leagues?.league);

			return data;
		},

		storeRaw: (data) => {
			//console.log("[storeRaw] clearing prefix:", basePrefix);
			clearCacheKey(basePrefix);
			localStorage.setItem(cacheKey, JSON.stringify(data));
			//console.log("[storeRaw] stored key:", cacheKey, "len:", localStorage.getItem(cacheKey)?.length);
		},

		apply: (data, source) => {
			//console.log("[apply] source:", source, "data keys:", data ? Object.keys(data) : data);

			const ok = applyMyLeaguesFromJSON(data);
			//console.log("[apply] apply ok:", !!ok, "myLeagues len now:", Array.isArray(window.myLeagues) ? window.myLeagues.length : window.myLeagues);

			if (ok && source === "api") {
				signalMFLCacheUpdate("myLeagues", {
					source: "api",
					ttl: "sixHour"
				});
			}
		}
	}).then(() => {
		//console.log("[done] returning myLeagues len:", Array.isArray(window.myLeagues) ? window.myLeagues.length : window.myLeagues);
		console.groupEnd();
		return window.myLeagues || null;
	}).catch((e) => {
		console.error("[myLeagues] fetchOnceCrossTab error:", e);
		console.groupEnd();
		throw e;
	});
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                    WEATHER API                   ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// =========================
// WEATHER (broadcast + request/response, no localStorage payload)
// =========================

function bcNameWeather(year) {
	return "MFL_WEATHER_" + year;
}

// Keep one channel per tab/origin/year so you can receive future updates
function ensureWeatherChannel(year) {
	if (!("BroadcastChannel" in window)) return null;

	const name = bcNameWeather(year);
	if (window.__MFL_weatherBC && window.__MFL_weatherBC.name === name) return window.__MFL_weatherBC;

	// close old (different year)
	try {
		if (window.__MFL_weatherBC) window.__MFL_weatherBC.close();
	} catch {}

	const bc = new BroadcastChannel(name);
	window.__MFL_weatherBC = bc;

	// Message handler: accept pushes + respond to requests
	bc.addEventListener("message", (ev) => {
		const msg = ev.data;

		// Back-compat: if someone posts raw data (your old code), accept it
		if (msg && typeof msg === "object" && !msg.type) {
			const w = normalizeWeather(msg);
			window.weather = w;
			window.__MFL_weatherLast = w;
			window.__MFL_weatherLastTs = Date.now();
			return;
		}

		if (!msg || msg.type !== "weather") return;
		if (String(msg.year) !== String(year)) return;

		// Leader push: update local tab memory
		if (msg.action === "push" && msg.payload) {
			const w = normalizeWeather(msg.payload);
			window.weather = w;
			window.__MFL_weatherLast = w;
			window.__MFL_weatherLastTs = Number(msg.ts) || Date.now();
			return;
		}

		// Someone asked for weather; if we have it, respond
		if (msg.action === "request") {
			const have = window.__MFL_weatherLast;
			if (have) {
				try {
					bc.postMessage({
						type: "weather",
						action: "push",
						year,
						ts: window.__MFL_weatherLastTs || Date.now(),
						payload: have
					});
				} catch {}
			}
		}
	});

	return bc;
}

function waitForWeatherPush(bc, year, timeoutMs) {
	return new Promise((resolve) => {
		const t = setTimeout(() => {
			bc.removeEventListener("message", onMsg);
			resolve(null);
		}, timeoutMs);

		function onMsg(ev) {
			const msg = ev.data;

			// Back-compat: raw payload
			if (msg && typeof msg === "object" && !msg.type) {
				clearTimeout(t);
				bc.removeEventListener("message", onMsg);
				resolve(msg);
				return;
			}

			if (
				msg &&
				msg.type === "weather" &&
				msg.action === "push" &&
				String(msg.year) === String(year) &&
				msg.payload
			) {
				clearTimeout(t);
				bc.removeEventListener("message", onMsg);
				resolve(msg.payload);
			}
		}

		bc.addEventListener("message", onMsg);
	});
}

// Call this when you want to "rebuild weather" in THIS tab without forcing a fetch.
// If another tab has it, it will respond quickly.
async function requestWeatherFromTabs(year, timeoutMs = 2500) {
	const bc = ensureWeatherChannel(year);
	if (!bc) return null;

	// If we already have it locally, return immediately
	if (window.weather && typeof window.weather === "object" && Object.keys(window.weather).length) {
		return window.weather;
	}

	// Ask other tabs to push their last payload
	try {
		bc.postMessage({
			type: "weather",
			action: "request",
			year,
			ts: Date.now()
		});
	} catch {}

	const got = await waitForWeatherPush(bc, year, timeoutMs);
	if (got) {
		const w = normalizeWeather(got);
		window.weather = w;
		window.__MFL_weatherLast = w;
		window.__MFL_weatherLastTs = Date.now();
		return w;
	}

	return null;
}

async function loadWeatherJSONDelayed() {
	// IMPORTANT: keep this per-tab (so a tab that cleared weather can re-run it)
	if (window.__weatherRequested) return;
	window.__weatherRequested = true;

	const lockKey = "lock_weather_" + year; // per-origin shared
	const bc = ensureWeatherChannel(year);

	// 0) If weather was cleared in this tab, try to recover from other tabs FIRST
	// (no fetch, just request)
	if (!window.weather || !Object.keys(window.weather || {}).length) {
		const fromTabs = await requestWeatherFromTabs(year, 2000);
		if (fromTabs) return fromTabs;
	}

	// 1) If we can receive a push quickly (someone else may be fetching), wait briefly
	if (bc) {
		const got = await waitForWeatherPush(bc, year, 1500);
		if (got) {
			const w = normalizeWeather(got);
			window.weather = w;
			window.__MFL_weatherLast = w;
			window.__MFL_weatherLastTs = Date.now();
			return w;
		}
	}

	// 2) Become the fetcher (ONLY ONE TAB)
	const haveLock = tryAcquireLock(lockKey, 20000);
	if (!haveLock) {
		// Another tab is fetching; request/poll for push a bit longer
		if (bc) {
			// Ask explicitly (in case leader fetched earlier and didn't push recently)
			try {
				bc.postMessage({
					type: "weather",
					action: "request",
					year,
					ts: Date.now()
				});
			} catch {}
			const got2 = await waitForWeatherPush(bc, year, 15000);
			if (got2) {
				const w = normalizeWeather(got2);
				window.weather = w;
				window.__MFL_weatherLast = w;
				window.__MFL_weatherLastTs = Date.now();
				return w;
			}
		}
		// strict mode: follower does not fetch
		return null;
	}

	try {
		const url = "https://www.mflscripts.com/mfl-apps/weather/weather.json?rand=" + Date.now();
		const r = await fetch(url, {
			cache: "no-store"
		});
		if (!r.ok) throw new Error("weather JSON HTTP " + r.status);
		const data = await r.json();

		const w = normalizeWeather(data);
		window.weather = w;
		window.__MFL_weatherLast = w;
		window.__MFL_weatherLastTs = Date.now();

		// publish to other tabs
		if (bc) {
			try {
				bc.postMessage({
					type: "weather",
					action: "push",
					year,
					ts: Date.now(),
					payload: data // raw or normalized both ok; normalize on receive
				});
			} catch {}
		}

		return w;
	} catch (e) {
		console.warn("[Weather] Failed:", e);
		return null;
	} finally {
		releaseLock(lockKey);
	}
}

function normalizeWeather(data) {
	if (data && typeof data === "object" && data.weather && typeof data.weather === "object") {
		return data.weather;
	}
	return data;
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////          VARIABLES FOR DAILY CACHE ITEMS         ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

//SETUP GLOBAL VARS FOR DAILY CACHED ITEMS
if (typeof countPtsScoredOncePerWeek === 'undefined') var countPtsScoredOncePerWeek = true;
if (reportDailyApi_ran === undefined) var reportDailyApi_ran = false;
if (reportDailyApiNoCache === undefined) var reportDailyApiNoCache = false;
if (reportDailyFullyLoaded === undefined) var reportDailyFullyLoaded = false;

//VARS SET BY LEAGUE API	
if (reportLeague_ar === undefined) var reportLeague_ar = [];
if (reportConferences_ar === undefined) var reportConferences_ar = [];
if (reportDivisions_ar === undefined) var reportDivisions_ar = [];
if (reportDivisionConference_ar === undefined) var reportDivisionConference_ar = [];
//VARS SET BY STANDINGS API
if (reportStandings_ar === undefined) var reportStandings_ar = [];
if (reportStandingsFid_ar === undefined) var reportStandingsFid_ar = [];
//VARS SET BY WEEKLY RESULTS API
if (reportScoresFid_ar === undefined) var reportScoresFid_ar = [];
if (reportScoresAdjFid_ar === undefined) var reportScoresAdjFid_ar = [];
if (reportScoresFidBench_ar === undefined) var reportScoresFidBench_ar = [];
if (reportScoresFidTiebreakPlayer_ar === undefined) var reportScoresFidTiebreakPlayer_ar = [];
if (reportScoresFidTiebreakPlayerTracker_ar === undefined) var reportScoresFidTiebreakPlayerTracker_ar = [];
if (reportScoresWeek_ar === undefined) var reportScoresWeek_ar = [];
if (reportScoresWeekAdj_ar === undefined) var reportScoresWeekAdj_ar = [];
if (reportWeeklyResults_ar === undefined) var reportWeeklyResults_ar = [];
if (reportMatchupFid_ar === undefined) var reportMatchupFid_ar = [];
if (reportHTH_ar === undefined) var reportHTH_ar = [];
if (reportSOS_ar === undefined) var reportSOS_ar = [];
if (reportSOV_ar === undefined) var reportSOV_ar = [];
if (typeof leagueAverage === 'undefined') leagueAverage = false;
if (typeof leagueAverageCreated === 'undefined') leagueAverageCreated = false;
//VARS SET BY NFL SCHEDULE API
if (reportNflSchedule_ar === undefined) var reportNflSchedule_ar = [];
if (reportNflScheduleFid_ar === undefined) var reportNflScheduleFid_ar = [];
if (reportNflScheduleWeek_ar === undefined) var reportNflScheduleWeek_ar = [];
//VARS SET BY NFL BYE WEEK API
if (reportNflByeWeeks_ar === undefined) var reportNflByeWeeks_ar = [];
//VARS SET BY TOP STARTERS API (COMPLETED WEEK + 1)
if (reportTopStarters_ar === undefined) var reportTopStarters_ar = [];
//VARS SET BY PROJECTED SCORES API (COMPLETED WEEK + 1)
if (reportProjectedScores_ar === undefined) var reportProjectedScores_ar = [];


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////               DAILY CACHE FUNCTIONS              ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function doDailyCache() {
	if (!reportDailyApi_ran) {
		reportDailyApi_ran = true;

		clearLocalStorageWhenIndexedDBOn();
		clearCacheOtherLeague();

		try {
			// snapshot daily bucket once (use currentServerTime if you have it)
			const dailyBucket = getCacheDaily(currentServerTime);

			const criticalWeeks = new Set();
			if (completedWeek >= 1 && completedWeek <= AllGamesCount) criticalWeeks.add(completedWeek);
			if (completedWeek + 1 >= 1 && completedWeek + 1 <= AllGamesCount) criticalWeeks.add(completedWeek + 1);
			if (endWeek >= 1 && endWeek <= AllGamesCount) criticalWeeks.add(endWeek);

			const critPromises = Array.from(criticalWeeks).map(week =>
				reportProjectedScoresAPI(week, dailyBucket) // only if you want; otherwise leave it
			);
			await Promise.allSettled(critPromises);

			const [leagues, standings, tops, byeweeks] = await Promise.all([
				reportLeagueAPI(dailyBucket),
				reportStandingsAPI(dailyBucket),
				reportTopStartersAPI(completedWeek + 1, dailyBucket),
				reportNflByeWeeksAPI(dailyBucket)
			]);

			continueWithApiRun();
		} catch (error) {
			console.error(error);
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                   PROJECTIONS API                ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportProjectedScoresAPI(week) {
	// Base prefix for LS keys for this week
	const lsPrefix = "cache_projectedScores-" + week + "_" + year + "_" + league_id + "_";
	const cacheKey = lsPrefix + cacheDaily;
	const isPastWeek = (typeof completedWeek === "number" && week < completedWeek);
	if (isPastWeek) {
		let cached = cacheResponse(cacheKey);
		if (cached === false) {
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (k && k.indexOf(lsPrefix) === 0) {
					try {
						cached = localStorage.getItem(k);
					} catch (e) {
						cached = false;
					}
					if (cached) break;
				}
			}
		}
		if (cached && cached !== false) {
			const parsed = safeJSONParse(cached, (e) => {
				console.warn("Projections past-week LS JSON error", e);
				projectionsJsonError = true;
			});
			if (parsed) {
				reportProjectedScores_ar["w_" + week] = parsed;
				return reportProjectedScores_ar;
			}
		}
	}
	if (!isPastWeek) {
		const cached = cacheResponse(cacheKey);
		if (cached !== false) {
			const parsed = safeJSONParse(cached, () => {
				projectionsJsonError = true;
			});
			if (parsed) {
				reportProjectedScores_ar["w_" + week] = parsed;
				return reportProjectedScores_ar;
			}
		}
	}
	try {
		const response = await fetch(
			`${baseURLDynamic}/${year}/export?TYPE=projectedScores&L=${league_id}&W=${week}&JSON=1`
		);
		const data = await response.json();
		reportProjectedScores_ar["w_" + week] = data;
		if (!isPastWeek) {
			clearCacheKey(`cache_projectedScores-${week}_${year}`);
		}
		localStorage.setItem(cacheKey, JSON.stringify(reportProjectedScores_ar["w_" + week]));
		signalMFLCacheUpdate("projectedScores", {
			source: "api",
			ttl: "daily",
			league_id,
			week
		});
		return reportProjectedScores_ar;
	} catch (error) {
		projectionsJsonError = true;
	}
}
async function backfillProjectedScoresInBackground() {
	for (let w = 1; w <= AllGamesCount; w++) {
		if (reportProjectedScores_ar["w_" + w]) continue;
		try {
			await reportProjectedScoresAPI(w);
		} catch (e) {
			console.warn("ProjectedScores backfill error for week", w, e);
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                     LEAGUE API                   ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportLeagueAPI(bucketArg) {
	const dailyBucket = (bucketArg != null) ? bucketArg : getCacheDaily(currentServerTime);

	const cacheKey = "cache_league_" + year + "_" + league_id + "_" + dailyBucket;
	const lockKey = `lock_league_${year}_${league_id}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,

		readCached: () => {
			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached, () => {
				leagueJsonError = true;
			});
			if (parsed) {
				reportLeague_ar = parsed;
				reportLeagueResponse(reportLeague_ar);
				return parsed; // important for Promise.all
			}
			return null;
		},

		fetcher: () => {
			reportDailyApiNoCache = true;

			logApi("API FETCH league", {
				endpoint: "league",
				league_id,
				dailyBucket,
				tab: window.MFL_TAB_ID
			});

			return fetch(`${baseURLDynamic}/${year}/export?TYPE=league&L=${league_id}&JSON=1`, {
				cache: "no-store"
			}).then(r => {
				logApi("API RESP league", {
					endpoint: "league",
					league_id,
					dailyBucket,
					status: r.status,
					tab: window.MFL_TAB_ID
				});

				if (!r.ok) throw new Error("league HTTP " + r.status);
				return r.json();
			});
		},

		storeRaw: (data) => {
			clearCacheKey("cache_league_" + year + "_" + league_id); // wipe older buckets
			localStorage.setItem(cacheKey, JSON.stringify(data));
		},

		apply: (data, source) => {
			if (!data) return;

			reportLeague_ar = data;
			reportLeagueResponse(reportLeague_ar);

			if (source === "api") {
				signalMFLCacheUpdate("league", {
					source: "api",
					ttl: "daily",
					league_id
				});
			}
		}
	});
}

function reportLeagueResponse(response) {
	reportConferences_ar = [];
	reportDivisions_ar = [];
	reportDivisionConference_ar = Object.create(null);
	if (response.league.hasOwnProperty("conferences")) {
		if (response.league.conferences.hasOwnProperty("conference")) {
			for (var i = 0; i < response.league.conferences.conference.length; i++) {
				reportConferences_ar.push(({
					"id": response.league.conferences.conference[i].id,
					"name": response.league.conferences.conference[i].name
				}));
			}
		}
	}
	if (response.league.hasOwnProperty("divisions")) {
		if (response.league.divisions.hasOwnProperty("division")) {
			for (var i = 0; i < response.league.divisions.division.length; i++) {
				reportDivisions_ar.push(({
					"id": response.league.divisions.division[i].id,
					"name": response.league.divisions.division[i].name,
					"conference": "00"
				}));
				if (response.league.divisions.division[i].hasOwnProperty("conference")) {
					reportDivisions_ar[i].conference = response.league.divisions.division[i].conference;
					reportDivisionConference_ar[response.league.divisions.division[i].id] = response.league.divisions.division[i].conference;
				}
			}
		}
	}
	if (reportConferences_ar.length > 0) {
		for (var key in franchiseDatabase) {
			if (franchiseDatabase.hasOwnProperty(key) && key !== "fid_0000") {
				if (franchiseDatabase[key].hasOwnProperty("division")) franchiseDatabase[key].conference = reportDivisionConference_ar[franchiseDatabase[key].division];
			}
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                     STANDINGS API                ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportStandingsAPI(bucketArg) {
	const dailyBucket = (bucketArg != null) ? bucketArg : getCacheDaily(currentServerTime);

	const cacheKey = "cache_leagueStandings_" + year + "_" + league_id + "_" + dailyBucket;
	const lockKey = `lock_leagueStandings_${year}_${league_id}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,

		readCached: () => {
			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached, () => {
				standingsJsonError = true;
			});
			if (parsed) {
				reportStandingsResponse(parsed);
				return parsed; // keep Promise.all happy
			}
			return null;
		},

		fetcher: () => {
			reportDailyApiNoCache = true;

			logApi("API FETCH standings", {
				endpoint: "leagueStandings",
				league_id,
				dailyBucket,
				tab: window.MFL_TAB_ID
			});

			return fetch(`${baseURLDynamic}/${year}/export?TYPE=leagueStandings&L=${league_id}&JSON=1`, {
				cache: "no-store"
			}).then(r => {
				logApi("API RESP standings", {
					endpoint: "leagueStandings",
					league_id,
					dailyBucket,
					status: r.status,
					tab: window.MFL_TAB_ID
				});

				if (!r.ok) throw new Error("leagueStandings HTTP " + r.status);
				return r.json();
			});
		},

		storeRaw: (data) => {
			clearCacheKey("cache_leagueStandings_" + year + "_" + league_id); // remove older buckets
			localStorage.setItem(cacheKey, JSON.stringify(data));
		},

		apply: (data, source) => {
			if (!data) return;

			reportStandingsResponse(data);

			// only signal when THIS tab actually fetched (others get storage sync)
			if (source === "api") {
				signalMFLCacheUpdate("standings", {
					source: "api",
					ttl: "daily",
					league_id
				});
			}
		}
	});
}

function reportStandingsResponse(response) {
	reportStandings_ar = [];
	reportStandingsFid_ar = [];
	for (var i = 0; i < response.leagueStandings.franchise.length; i++) {
		var fid = response.leagueStandings.franchise[i].id;
		var h2hwlt_notFound = true;
		try {
			var [wins, losses, ties] = response.leagueStandings.franchise[i].h2hwlt.split('-');
			var h2hwlt_notFound = false;
			var wins = parseInt(wins);
			var losses = parseInt(losses);
			var ties = parseInt(ties);
		} catch (er) {
			var wins = 0;
			var losses = 0;
			var ties = 0;
			var h2hwlt_notFound = true;
		}
		if (h2hwlt_notFound) {
			try {
				var wins = parseInt(response.leagueStandings.franchise[i].h2hw);
				if (isNaN(wins)) wins = 0;
			} catch (er) {
				var wins = 0;
			}
			try {
				var losses = parseInt(response.leagueStandings.franchise[i].h2hl);
				if (isNaN(losses)) losses = 0;
			} catch (er) {
				var losses = 0;
			}
			try {
				var ties = parseInt(response.leagueStandings.franchise[i].h2ht);
				if (isNaN(ties)) ties = 0;
			} catch (er) {
				var ties = 0;
			}
		}

		reportStandingsFid_ar[fid] = ({
			"win": wins,
			"loss": losses,
			"tie": ties
		});

		var index = parseInt(fid, 10);
		try {
			var pf = parseFloat(response.leagueStandings.franchise[i].pf);
			if (isNaN(pf)) pf = 0;
		} catch (er) {
			var pf = 0;
		}
		try {
			var pa = parseFloat(response.leagueStandings.franchise[i].pa);
			if (isNaN(pa)) pa = 0;
		} catch (er) {
			var pa = 0;
		}
		try {
			var op = parseFloat(response.leagueStandings.franchise[i].op);
			if (isNaN(op)) op = 0;
		} catch (er) {
			var op = 0;
		}
		try {
			var dp = parseFloat(response.leagueStandings.franchise[i].dp);
			if (isNaN(dp)) dp = 0;
		} catch (er) {
			var dp = 0;
		}

		var divwlt_notFound = true;
		try {
			var [div_wins, div_losses, div_ties] = response.leagueStandings.franchise[i].divwlt.split('-');
			var divwlt_notFound = false;
			var div_wins = parseInt(div_wins);
			var div_losses = parseInt(div_losses);
			var div_ties = parseInt(div_ties);
		} catch (er) {
			var div_wins = 0;
			var div_losses = 0;
			var div_ties = 0;
			var divwlt_notFound = true;
		}
		if (divwlt_notFound) {
			try {
				var div_wins = parseInt(response.leagueStandings.franchise[i].divw);
				if (isNaN(div_wins)) div_wins = 0;
			} catch (er) {
				var div_wins = 0;
			}
			try {
				var div_losses = parseInt(response.leagueStandings.franchise[i].divl);
				if (isNaN(div_losses)) div_losses = 0;
			} catch (er) {
				var div_losses = 0;
			}
			try {
				var div_ties = parseInt(response.leagueStandings.franchise[i].divt);
				if (isNaN(div_ties)) div_ties = 0;
			} catch (er) {
				var div_ties = 0;
			}
		}
		try {
			var div_pf = parseFloat(response.leagueStandings.franchise[i].divpf);
			if (isNaN(div_pf)) div_pf = 0;
		} catch (er) {
			var div_pf = 0;
		}
		try {
			var div_pa = parseFloat(response.leagueStandings.franchise[i].divpa);
			if (isNaN(div_pa)) div_pa = 0;
		} catch (er) {
			var div_pa = 0;
		}
		var non_div_wins = wins - div_wins;
		var non_div_losses = losses - div_losses;
		var non_div_ties = ties - div_ties;
		var non_div_pf = pf - div_pf;
		var non_div_pa = pa - div_pa;


		var confwlt_notFound = true;
		try {
			var [conf_wins, conf_losses, conf_ties] = response.leagueStandings.franchise[i].confwlt.split('-');
			var confwlt_notFound = false;
			var conf_wins = parseInt(conf_wins);
			var conf_losses = parseInt(conf_losses);
			var conf_ties = parseInt(conf_ties);
		} catch (er) {
			var conf_wins = 0;
			var conf_losses = 0;
			var conf_ties = 0;
			var confwlt_notFound = true;
		}
		if (confwlt_notFound) {
			try {
				var conf_wins = parseInt(response.leagueStandings.franchise[i].confw);
				if (isNaN(conf_wins)) conf_wins = 0;
			} catch (er) {
				var conf_wins = 0;
			}
			try {
				var conf_losses = parseInt(response.leagueStandings.franchise[i].confl);
				if (isNaN(conf_losses)) conf_losses = 0;
			} catch (er) {
				var conf_losses = 0;
			}
			try {
				var conf_ties = parseInt(response.leagueStandings.franchise[i].conft);
				if (isNaN(conf_ties)) conf_ties = 0;
			} catch (er) {
				var conf_ties = 0;
			}
		}
		try {
			var conf_pf = parseFloat(response.leagueStandings.franchise[i].confpf);
			if (isNaN(conf_pf)) conf_pf = 0;
		} catch (er) {
			var conf_pf = 0;
		}
		try {
			var conf_pa = parseFloat(response.leagueStandings.franchise[i].confpa);
			if (isNaN(conf_pa)) conf_pa = 0;
		} catch (er) {
			var conf_pa = 0;
		}
		var non_conf_wins = wins - conf_wins;
		var non_conf_losses = losses - conf_losses;
		var non_conf_ties = ties - conf_ties;
		var non_conf_pf = pf - conf_pf;
		var non_conf_pa = pa - conf_pa;

		try {
			var pwr = parseFloat(response.leagueStandings.franchise[i].pwr);
			if (isNaN(pwr)) pwr = 0;
		} catch (er) {
			var pwr = 0;
		}
		try {
			var vp = parseFloat(response.leagueStandings.franchise[i].vp);
			if (isNaN(vp)) vp = 0;
		} catch (er) {
			var vp = 0;
		}
		try {
			var pp = parseFloat(response.leagueStandings.franchise[i].pp);
			if (isNaN(pp)) pp = 0;
		} catch (er) {
			var pp = 0;
		}

		try {
			var [ap_wins, ap_losses, ap_ties] = response.leagueStandings.franchise[i].all_play_wlt.split('-');
			var ap_wins = parseInt(ap_wins);
			var ap_losses = parseInt(ap_losses);
			var ap_ties = parseInt(ap_ties);
		} catch (er) {
			var ap_wins = 0;
			var ap_losses = 0;
			var ap_ties = 0;
		}

		let all_play_pct = null;

		const apiVal = response?.leagueStandings?.franchise?.[i]?.all_play_pct;
		if (apiVal !== undefined && apiVal !== null && apiVal !== "") {
			const v = parseFloat(apiVal);
			if (!isNaN(v)) all_play_pct = v;
		}

		if (all_play_pct == null) {
			const total = ap_wins + ap_losses + ap_ties;
			all_play_pct = total ? Math.round(((ap_wins + ap_ties * 0.5) / total) * 1000) / 1000 : 0;
		}

		var hth_win_pct = 0; // head to head set here but assigned once head to head matches are run 			
		if ((wins + losses + ties) !== 0) var pct = parseInt((wins + (ties * 0.5)) * 1000 / (wins + losses + ties)) / 1000;
		else var pct = 0;
		var record = wins + '-' + losses + '-' + ties;

		// Correct way to set the variable , then determine if it exists in API or not
		var div_pct = 0; // Initialize div_pct to 0
		if (response.leagueStandings.franchise[i].divpct) {
			// Check if the value exists
			var parsedValuedivpct = parseFloat(response.leagueStandings.franchise[i].divpct);
			if (!isNaN(parsedValuedivpct)) {
				// Check if the parsed value is a valid integer
				div_pct = parsedValuedivpct; // Set div_pct to the parsed value
			}
		} else if ((div_wins + div_losses + div_ties) !== 0) {
			div_pct = parseInt((div_wins + (div_ties * 0.5)) * 1000 / (div_wins + div_losses + div_ties)) / 1000;
		} else {
			div_pct = 0;
		}
		var conf_pct = 0; // Initialize conf_pct to 0
		if (response.leagueStandings.franchise[i].confpct) {
			// Check if the value exists
			var parsedValueconfpct = parseFloat(response.leagueStandings.franchise[i].confpct);
			if (!isNaN(parsedValueconfpct)) {
				// Check if the parsed value is a valid integer
				conf_pct = parsedValueconfpct; // Set conf_pct to the parsed value
			}
		} else if ((conf_wins + conf_losses + conf_ties) !== 0) {
			conf_pct = parseInt((conf_wins + (conf_ties * 0.5)) * 1000 / (conf_wins + conf_losses + conf_ties)) / 1000;
		} else {
			conf_pct = 0;
		}

		var div_record = div_wins + '-' + div_losses + '-' + div_ties;
		if ((non_div_wins + non_div_losses + non_div_ties) !== 0) var non_div_pct = parseInt((non_div_wins + (non_div_ties * 0.5)) * 1000 / (non_div_wins + non_div_losses + non_div_ties)) / 1000;
		else var non_div_pct = 0;
		var non_div_record = non_div_wins + '-' + non_div_losses + '-' + non_div_ties;
		var conf_record = conf_wins + '-' + conf_losses + '-' + conf_ties;
		if ((non_conf_wins + non_conf_losses + non_conf_ties) !== 0) var non_conf_pct = parseInt((non_conf_wins + (non_conf_ties * 0.5)) * 1000 / (non_conf_wins + non_conf_losses + non_conf_ties)) / 1000;
		else var non_conf_pct = 0;
		var non_conf_record = non_conf_wins + '-' + non_conf_losses + '-' + non_conf_ties;

		var ap_record = ap_wins + '-' + ap_losses + '-' + ap_ties;
		var sos_record = ""; // strength of schedule and strength of victory are set up here but assigned once head to head matches are run 
		var sos_win_pct = 0;
		var sov_record = "";
		var sov_win_pct = 0;

		try {
			if (custom1.hasOwnProperty(fid)) var customContent1 = custom1[fid];
			else var customContent1 = 0;
		} catch (er) {
			var customContent1 = 0;
		}
		try {
			if (custom2.hasOwnProperty(fid)) var customContent2 = custom2[fid];
			else var customContent2 = 0;
		} catch (er) {
			var customContent2 = 0;
		}
		try {
			if (custom3.hasOwnProperty(fid)) var customContent3 = custom3[fid];
			else var customContent3 = 0;
		} catch (er) {
			var customContent3 = 0;
		}

		if (useOPR) {
			var avgpf = parseFloat(response.leagueStandings.franchise[i].avgpf) || 0;
			var maxpf = parseFloat(response.leagueStandings.franchise[i].maxpf) || 0;
			var minpf = parseFloat(response.leagueStandings.franchise[i].minpf) || 0;
			var teamOPR = ((avgpf * 6) + (maxpf + minpf) + ((pct * 200) * 2)) / 10;
			teamOPR = parseFloat(teamOPR) || 0;
			totalOPR += teamOPR;

			reportStandingsFid_ar[fid] = ({
				"teamOPR": teamOPR,
				"win": wins,
				"loss": losses,
				"tie": ties,
				"w": wins,
				"l": losses,
				"t": ties,
				"record": record,
				"pct": pct,
				"pf": pf,
				"pa": pa,
				"dw": div_wins,
				"dl": div_losses,
				"dt": div_ties,
				"drecord": div_record,
				"dpct": div_pct,
				"dpf": div_pf,
				"dpa": div_pa,
				"pwr": pwr,
				"vp": vp,
				"apw": ap_wins,
				"apl": ap_losses,
				"apt": ap_ties,
				"apr": ap_record,
				"all_play_pct": all_play_pct,
				"ndw": non_div_wins,
				"ndl": non_div_losses,
				"ndt": non_div_ties,
				"ndr": non_div_record,
				"ndpct": non_div_pct,
				"ndpf": non_div_pf,
				"ndpa": non_div_pa,
				"cw": conf_wins,
				"cl": conf_losses,
				"ct": conf_ties,
				"cpf": conf_pf,
				"cpa": conf_pa,
				"cr": conf_record,
				"cpct": conf_pct,
				"ncw": non_conf_wins,
				"ncl": non_conf_losses,
				"nct": non_conf_ties,
				"ncpct": non_conf_pct,
				"ncpf": non_conf_pf,
				"ncpa": non_conf_pa,
				"ncr": non_conf_record,
				"hthpct": hth_win_pct,
				"sosr": sos_record,
				"sospct": sos_win_pct,
				"sovr": sov_record,
				"sovpct": sov_win_pct,
				"pp": pp,
				"op": op,
				"dp": dp,
				"custom1": customContent1,
				"custom2": customContent2,
				"custom3": customContent3
			});
		} else {
			reportStandingsFid_ar[fid] = ({
				"win": wins,
				"loss": losses,
				"tie": ties,
				"w": wins,
				"l": losses,
				"t": ties,
				"record": record,
				"pct": pct,
				"pf": pf,
				"pa": pa,
				"dw": div_wins,
				"dl": div_losses,
				"dt": div_ties,
				"drecord": div_record,
				"dpct": div_pct,
				"dpf": div_pf,
				"dpa": div_pa,
				"pwr": pwr,
				"vp": vp,
				"apw": ap_wins,
				"apl": ap_losses,
				"apt": ap_ties,
				"apr": ap_record,
				"all_play_pct": all_play_pct,
				"ndw": non_div_wins,
				"ndl": non_div_losses,
				"ndt": non_div_ties,
				"ndr": non_div_record,
				"ndpct": non_div_pct,
				"ndpf": non_div_pf,
				"ndpa": non_div_pa,
				"cw": conf_wins,
				"cl": conf_losses,
				"ct": conf_ties,
				"cpf": conf_pf,
				"cpa": conf_pa,
				"cr": conf_record,
				"cpct": conf_pct,
				"ncw": non_conf_wins,
				"ncl": non_conf_losses,
				"nct": non_conf_ties,
				"ncpct": non_conf_pct,
				"ncpf": non_conf_pf,
				"ncpa": non_conf_pa,
				"ncr": non_conf_record,
				"hthpct": hth_win_pct,
				"sosr": sos_record,
				"sospct": sos_win_pct,
				"sovr": sov_record,
				"sovpct": sov_win_pct,
				"pp": pp,
				"op": op,
				"dp": dp,
				"custom1": customContent1,
				"custom2": customContent2,
				"custom3": customContent3
			});
		}

		reportStandings_ar.push({
			"index": index,
			"fid": fid,
			"name": franchiseDatabase['fid_' + fid].name,
			"w": wins,
			"l": losses,
			"t": ties,
			"record": record,
			"pct": pct,
			"pf": pf,
			"pa": pa,
			"dw": div_wins,
			"dl": div_losses,
			"dt": div_ties,
			"drecord": div_record,
			"dpct": div_pct,
			"dpf": div_pf,
			"dpa": div_pa,
			"pwr": pwr,
			"vp": vp,
			"apw": ap_wins,
			"apl": ap_losses,
			"apt": ap_ties,
			"apr": ap_record,
			"all_play_pct": all_play_pct,
			"ndw": non_div_wins,
			"ndl": non_div_losses,
			"ndt": non_div_ties,
			"ndr": non_div_record,
			"ndpct": non_div_pct,
			"ndpf": non_div_pf,
			"ndpa": non_div_pa,
			"cw": conf_wins,
			"cl": conf_losses,
			"ct": conf_ties,
			"cpf": conf_pf,
			"cpa": conf_pa,
			"cr": conf_record,
			"cpct": conf_pct,
			"ncw": non_conf_wins,
			"ncl": non_conf_losses,
			"nct": non_conf_ties,
			"ncpct": non_conf_pct,
			"ncpf": non_conf_pf,
			"ncpa": non_conf_pa,
			"ncr": non_conf_record,
			"hthpct": hth_win_pct,
			"sosr": sos_record,
			"sospct": sos_win_pct,
			"sovr": sov_record,
			"sovpct": sov_win_pct,
			"pp": pp,
			"op": op,
			"dp": dp,
			"custom1": customContent1,
			"custom2": customContent2,
			"custom3": customContent3
		});
	}
	if (useOPR) {
		var teamsArray = [];
		var aveOPR = totalOPR / leagueAttributes['Franchises'];
		for (var fid in reportStandingsFid_ar) {
			if (reportStandingsFid_ar.hasOwnProperty(fid)) {
				var teamOPR = reportStandingsFid_ar[fid].teamOPR;
				var adjustedOPR = (teamOPR / aveOPR).toFixed(3);
				if (isNaN(adjustedOPR) || adjustedOPR === undefined) {
					adjustedOPR = '0.00';
				}
				reportStandingsFid_ar[fid].teamOPR = adjustedOPR;
				teamsArray.push({
					fid: fid,
					adjustedOPR: parseFloat(adjustedOPR)
				});
			}
		}
		teamsArray.sort(function (a, b) {
			return b.adjustedOPR - a.adjustedOPR;
		});
		for (var rank = 0; rank < teamsArray.length; rank++) {
			var team = teamsArray[rank];
			if (totalOPR === 0) {
				reportStandingsFid_ar[team.fid].teamRank = 0;
			} else {
				reportStandingsFid_ar[team.fid].teamRank = rank + 1;
			}
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                   TOP STARTERS API               ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportTopStartersAPI(weekArg, dailyBucketArg) {
	const week = Number(weekArg);
	if (!Number.isFinite(week) || week <= 0) return null;

	// âœ… daily bucket snapshot (passed from doDailyCache)
	const dailyBucket = Number.isFinite(Number(dailyBucketArg)) ?
		Number(dailyBucketArg) :
		getCacheDaily(currentServerTime);

	// âœ… SHARED across ALL leagues
	const cacheKey = `cache_topStarters_${year}_w${week}_${dailyBucket}`;
	const lockKey = `lock_topStarters_${year}_w${week}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,
		lockTtlMs: 60000,
		waitMs: 60000,

		readCached: () => {
			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached, () => {
				topsJsonError = true;
			});

			if (parsed) {
				reportTopStarters_ar = parsed;
				return parsed;
			}
			return null;
		},

		fetcher: () => {
			logApi("API FETCH topStarters", {
				endpoint: "topStarters",
				week,
				dailyBucket,
				tab: window.MFL_TAB_ID
			});

			reportDailyApiNoCache = true;

			return fetch(
					`https://api.myfantasyleague.com/${year}/export?TYPE=topStarters&COUNT=1000&W=${week}&JSON=1`, {
						cache: "no-store"
					}
				)
				.then(r => {
					logApi("API RESP topStarters", {
						endpoint: "topStarters",
						week,
						status: r.status,
						tab: window.MFL_TAB_ID
					});
					if (!r.ok) throw new Error("topStarters HTTP " + r.status);
					return r.json();
				});
		},

		storeRaw: (data) => {
			try {
				localStorage.setItem(cacheKey, JSON.stringify(data));
			} catch {}
		},

		apply: (data, source) => {
			if (!data) return;
			reportTopStarters_ar = data;

			if (source === "api") {
				signalMFLCacheUpdate("topstarters", {
					source: "api",
					ttl: "daily",
					week
				});
			}
		}
	});
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                     BYEWEEKS API                 ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportNflByeWeeksAPI(dailyBucketArg) {
	const dailyBucket = Number(dailyBucketArg != null ? dailyBucketArg : getCacheDaily(currentServerTime));

	const cacheKey = "cache_nflByeWeeks_" + year + "_" + dailyBucket;
	const lockKey = `lock_nflByeWeeks_${year}`;

	return fetchOnceCrossTab({
		cacheKey,
		lockKey,
		lockTtlMs: 30000,
		waitMs: 30000,

		readCached: () => {
			const cached = cacheResponse(cacheKey);
			if (cached === false) return null;

			const parsed = safeJSONParse(cached, () => {
				nflByeWeeksJsonError = true;
			});
			if (parsed) {
				reportNflByeWeeks_ar = parsed;
				return parsed;
			}
			return null;
		},

		fetcher: () => {
			logApi("API FETCH nflByeWeeks", {
				dailyBucket,
				tab: window.MFL_TAB_ID
			});

			return fetch(`https://api.myfantasyleague.com/${year}/export?TYPE=nflByeWeeks&JSON=1`, {
					cache: "no-store"
				})
				.then(r => {
					logApi("API RESP nflByeWeeks", {
						dailyBucket,
						status: r.status
					});
					if (!r.ok) throw new Error("nflByeWeeks HTTP " + r.status);
					return r.json();
				});
		},


		storeRaw: (data) => {
			clearCacheKey("cache_nflByeWeeks_" + year + "_");
			localStorage.setItem(cacheKey, JSON.stringify(data));
		},

		apply: (data, source) => {
			if (!data) return;
			reportNflByeWeeks_ar = data;

			if (source === "api") {
				signalMFLCacheUpdate("byeweeks", {
					source: "api",
					ttl: "daily"
				});
			}
		}
	});
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  CONTINUE WITH API               ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function continueWithApiRun() {
	doScoreAdjustments();

	const results = [];

	// First: YTD weekly results + ALL NFL schedule (cached where possible)
	let p = Promise.allSettled([
		reportWeeklyResultsAPI("YTD"),
		reportNflScheduleAPI("ALL")
	]);

	if (liveScoringWeek > 0) {
		p = p.then(() => {
			return Promise.allSettled([
				reportWeeklyResultsAPI(liveScoringWeek, true),
				reportNflScheduleAPI(liveScoringWeek),
				getLiveScoringAPI()
			]);
		});
	}

	return p
		.then((responses) => {
			if (Array.isArray(responses)) {
				responses.forEach((response) => {
					if (response.status === "fulfilled") {
						results.push(response.value);
					}
				});
			}
		})
		.then(() => {
			reportHeadToHeadResults();
			reportAllPlayResults();

			if (reportDailyApiNoCache) {
				if (usingIndexedDB) {
					updateDbTimestamp(db, "lid_" + year + "_" + league_id + "_daily", cacheDaily);
				}
			}

			reportDailyFullyLoaded = true;
			maybeSignalMFLGlobalCacheReady();

			try {
				backfillProjectedScoresInBackground();
			} catch (e) {}

			startBackgroundTimersOnce();
		});
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  SCORE ADJUSTIMENTS              ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function doScoreAdjustments() {
	try {
		for (var i = 0; i < global_scoreAdjustment.length; i++) {
			var fid = global_scoreAdjustment[i][0];
			var week = global_scoreAdjustment[i][1];
			var score = global_scoreAdjustment[i][2];
			if (!reportScoreAdjustment_ar.hasOwnProperty("w_" + week)) reportScoreAdjustment_ar["w_" + week] = [];
			reportScoreAdjustment_ar["w_" + week][fid] = score;
		}
	} catch (er) {}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  WEEKLY RESULTS API              ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportWeeklyResultsAPI(weekAPI, bypassCache) {
	// Normalize week
	let week = (weekAPI === "YTD") ? completedWeek : weekAPI;

	// Proper local flag for bypassing cache READ (not fetch/write)
	let bypass = !!bypassCache;

	if (week === 0) {
		week = startWeek;
		// For startup YTD / early season, allow normal caching behavior
		if (weekAPI === "YTD") {
			bypass = false;
		}
	}
	if (week > endWeek) {
		week = endWeek;
	}
	if (week < startWeek) {
		week = startWeek;
		// If caller explicitly forced bypass, keep it as "skip cache read"
	}

	// Guard for future weeks: only when NOT bypassing cache
	if (!bypass) {
		if (week === 1 && completedWeek === 0) {
			// allow weekly results to build before start of season
		} else if (week > completedWeek) {
			// For normal calls, don't hit API for weeks beyond completedWeek
			return true;
		}
	}

	// --------------------
	// CACHE READ SECTION
	// --------------------
	// If bypass === true, we skip all cache read logic and go straight to fetch.
	if (!bypass) {
		if (weekAPI === "YTD") {
			// ----- YTD path -----
			if (usingIndexedDB) {
				const rec = reportDb_ar["lid_" + year + "_" + league_id + "_daily"];
				if (rec && rec.timestamp === cacheDaily && rec.ar && rec.ar.weeklyResults) {
					for (let i = startWeek; i <= endWeek; i++) {
						const raw = rec.ar.weeklyResults["w_" + i];
						if (!raw) continue;
						const parsed = safeJSONParse(
							raw,
							() => {
								// Optional: original error behavior
								// resultsJsonError = true;
							}
						);
						if (parsed) {
							reportWeeklyResults_ar["w_" + i] = parsed;
							reportWeeklyResultsResponse(parsed, i);
						}
					}
					return true;
				}
			} else {
				// LocalStorage path for YTD
				const guardKey = "cache_weeklyResults-" + week + "_" + year + "_" + league_id + "_" + cacheDaily;
				const guardCached = cacheResponse(guardKey);
				if (guardCached !== false) {
					for (let i = startWeek; i <= endWeek; i++) {
						const key = "cache_weeklyResults-" + i + "_" + year + "_" + league_id + "_" + cacheDaily;
						const cached = cacheResponse(key);
						if (cached !== false) {
							const parsed = safeJSONParse(
								cached,
								() => {
									//console.log("Weekly Results YTD - Cache.js - JSON parse error");
								}
							);
							if (parsed) {
								reportWeeklyResults_ar["w_" + i] = parsed;
								//console.log("using cached Weekly Results " + i + " API key:" + key);
								reportWeeklyResultsResponse(parsed, i);
							}
						}
					}
					return true;
				}
			}
		} else {
			// ----- Single-week path -----
			if (usingIndexedDB) {
				const rec = reportDb_ar["lid_" + year + "_" + league_id + "_daily"];
				if (rec && rec.timestamp === cacheDaily && rec.ar && rec.ar.weeklyResults) {
					const raw = rec.ar.weeklyResults["w_" + week];
					if (raw) {
						const parsed = safeJSONParse(
							raw,
							() => {
								// resultsJsonError = true; // optional
							}
						);
						if (parsed) {
							reportWeeklyResults_ar["w_" + week] = parsed;
							return reportWeeklyResultsResponse(parsed, week);
						}
					}
				}
			} else {
				const cacheKey = "cache_weeklyResults-" + week + "_" + year + "_" + league_id + "_" + cacheDaily;
				const cached = cacheResponse(cacheKey);
				if (cached !== false) {
					const parsed = safeJSONParse(cached, () => {
						//console.log("Weekly Results - Cache.js - JSON parse error");
					});
					if (parsed) {
						reportWeeklyResults_ar["w_" + week] = parsed;
						//console.log("using cached Weekly Results " + week + " API key:" + cacheKey);
						return reportWeeklyResultsResponse(parsed, week);
					}
				}
			}
		}
	}

	// If we reach here:
	//  - either cache was missing/stale, OR
	//  - bypass === true (force fresh API)
	reportDailyApiNoCache = true;

	return fetch(`${baseURLDynamic}/${year}/export?TYPE=weeklyResults&L=${league_id}&W=${weekAPI}&JSON=1`)
		.then(response => response.json())
		.then(data => {
			try {
				if (weekAPI === "YTD") {
					// ---- YTD API response: populate all weeks ----
					for (let i = startWeek; i <= endWeek; i++) {
						for (let j = 0; j < data.allWeeklyResults.weeklyResults.length; j++) {
							if (i === parseInt(data.allWeeklyResults.weeklyResults[j].week, 10)) {
								reportWeeklyResults_ar[`w_${i}`] = {
									version: "1.0",
									encoding: "utf-8",
									weeklyResults: {
										week: String(i)
									}
								};
								if (data.allWeeklyResults.weeklyResults[j].hasOwnProperty("matchup")) {
									reportWeeklyResults_ar[`w_${i}`].weeklyResults.matchup = data.allWeeklyResults.weeklyResults[j].matchup;
								}
								if (data.allWeeklyResults.weeklyResults[j].hasOwnProperty("franchise")) {
									reportWeeklyResults_ar[`w_${i}`].weeklyResults.franchise = data.allWeeklyResults.weeklyResults[j].franchise;
								}

								if (usingIndexedDB) {
									updateDbLocalArray(
										db,
										`lid_${year}_${league_id}_daily`,
										"weeklyResults",
										i,
										JSON.stringify(reportWeeklyResults_ar[`w_${i}`])
									);
								} else {
									clearCacheKey(`cache_weeklyResults-${i}_${year}_${league_id}`);
									// Always write YTD weeklyResults to LS when we fetched them
									localStorage.setItem(
										`cache_weeklyResults-${i}_${year}_${league_id}_${cacheDaily}`,
										JSON.stringify(reportWeeklyResults_ar[`w_${i}`])
									);
								}

								reportWeeklyResultsResponse(reportWeeklyResults_ar[`w_${i}`], i);
							}
						}
					}
					signalMFLCacheUpdate("weeklyResults", {
						source: "api",
						ttl: "daily",
						league_id,
						week: "YTD"
					});
				} else {
					// ---- Single-week API response ----
					reportWeeklyResults_ar[`w_${week}`] = data;

					if (usingIndexedDB) {
						updateDbLocalArray(
							db,
							`lid_${year}_${league_id}_daily`,
							"weeklyResults",
							week,
							JSON.stringify(reportWeeklyResults_ar[`w_${week}`])
						);
					} else {
						clearCacheKey(`cache_weeklyResults-${week}_${year}_${league_id}`);
						// ðŸ”¹ IMPORTANT: always write this fresh live week to LS,
						// even when bypass === true (forced refresh).
						localStorage.setItem(
							`cache_weeklyResults-${week}_${year}_${league_id}_${cacheDaily}`,
							JSON.stringify(reportWeeklyResults_ar[`w_${week}`])
						);
					}

					signalMFLCacheUpdate("weeklyResults", {
						source: "api",
						ttl: "daily",
						league_id,
						week
					});

					return reportWeeklyResultsResponse(reportWeeklyResults_ar[`w_${week}`], week);
				}
			} catch (e) {
				console.log("Weekly Results - Cache.js - Error Json Not Found");
				resultsJsonError = true;
			}
		});
}

function reportWeeklyResultsResponse(response, week) {
	var reportScoresFid_tracker = [];
	//CHECK ALL MATCHUPS (THERE MAY ONLY BE ONE)
	if (response.weeklyResults.hasOwnProperty("matchup")) {
		var matchups = [];
		if (response.weeklyResults.matchup.hasOwnProperty("franchise"))
			matchups[0] = response.weeklyResults.matchup;
		else
			matchups = response.weeklyResults.matchup;
		for (var i = 0; i < matchups.length; i++) {
			var fidRoad = matchups[i].franchise[0].id;
			var fidHome = matchups[i].franchise[1].id;
			var addToTotalRoad = true;
			var addToTotalHome = true;
			if (fidRoad !== "BYE") {
				var roadScore = parseFloat(matchups[i].franchise[0].score, 10);
				var roadScoreAdj = roadScore;
				try {
					if (reportScoreAdjustment_ar.hasOwnProperty("w_" + week))
						if (reportScoreAdjustment_ar["w_" + week].hasOwnProperty(fidRoad)) roadScoreAdj += reportScoreAdjustment_ar["w_" + week][fidRoad];
				} catch (er) {}
				if (!reportScoresFid_ar.hasOwnProperty(fidRoad)) reportScoresFid_ar[fidRoad] = [];
				if (!reportScoresAdjFid_ar.hasOwnProperty(fidRoad)) reportScoresAdjFid_ar[fidRoad] = [];
				if (!reportScoresFid_tracker.hasOwnProperty(fidRoad)) {
					reportScoresFid_ar[fidRoad]["w_" + week] = roadScore;
					reportScoresAdjFid_ar[fidRoad]["w_" + week] = roadScoreAdj;
					reportScoresFid_tracker[fidRoad] = 1;
				} else if (!countPtsScoredOncePerWeek) {
					reportScoresFid_ar[fidRoad]["w_" + week] += roadScore;
					reportScoresAdjFid_ar[fidRoad]["w_" + week] += roadScoreAdj;
				} else {
					addToTotalRoad = false;
				}

				if (!reportScoresWeek_ar.hasOwnProperty("w_" + week)) reportScoresWeek_ar["w_" + week] = [];
				if (!reportScoresWeekAdj_ar.hasOwnProperty("w_" + week)) reportScoresWeekAdj_ar["w_" + week] = [];
				reportScoresWeek_ar["w_" + week][fidRoad] = roadScore;
				reportScoresWeekAdj_ar["w_" + week][fidRoad] = roadScoreAdj;
				//SET TIEBREAKERS IF ANY
				var tiebreakerTracker = [];
				if (matchups[i].franchise[0].hasOwnProperty("tiebreaker")) {
					var tiebreakerList = matchups[i].franchise[0]["tiebreaker"].split(",");
					for (var j = 0; j < tiebreakerList.length - 1; j++) {
						if (tiebreakerList[j] !== "") tiebreakerTracker[tiebreakerList[j]] = 1;
					}
				}
				//LOOP FOR BENCH SCORES AND TIEBREAKERS
				if (matchups[i].franchise[0].hasOwnProperty("player")) {
					for (var j = 0; j < matchups[i].franchise[0].player.length; j++) {
						if (matchups[i].franchise[0].player[j].hasOwnProperty("score"))
							var playerScore = parseFloat(matchups[i].franchise[0].player[j].score, 10);
						else
							var playerScore = 0;
						if (!reportScoresFidTiebreakPlayer_ar.hasOwnProperty(fidRoad)) reportScoresFidTiebreakPlayer_ar[fidRoad] = [];
						if (!reportScoresFidTiebreakPlayer_ar[fidRoad].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayer_ar[fidRoad]["w_" + week] = 0;
						if (tiebreakerTracker.hasOwnProperty(matchups[i].franchise[0].player[j].id)) reportScoresFidTiebreakPlayer_ar[fidRoad]["w_" + week] += playerScore;
						if (!reportScoresFidTiebreakPlayerTracker_ar.hasOwnProperty(fidRoad)) reportScoresFidTiebreakPlayerTracker_ar[fidRoad] = [];
						if (!reportScoresFidTiebreakPlayerTracker_ar[fidRoad].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayerTracker_ar[fidRoad]["w_" + week] = [];
						if (tiebreakerTracker.hasOwnProperty(matchups[i].franchise[0].player[j].id)) reportScoresFidTiebreakPlayerTracker_ar[fidRoad]["w_" + week].push(({
							"pid": matchups[i].franchise[0].player[j].id,
							"score": playerScore
						}));
						if (matchups[i].franchise[0].player[j].status === "nonstarter") {
							if (!reportScoresFidBench_ar.hasOwnProperty(fidRoad)) reportScoresFidBench_ar[fidRoad] = [];
							if (!reportScoresFidBench_ar[fidRoad].hasOwnProperty("w_" + week)) reportScoresFidBench_ar[fidRoad]["w_" + week] = 0;
							reportScoresFidBench_ar[fidRoad]["w_" + week] += playerScore;
						}
					}
				} else {
					//NO LINEUP SUBMITTED
					if (!reportScoresFidTiebreakPlayer_ar.hasOwnProperty(fidRoad)) reportScoresFidTiebreakPlayer_ar[fidRoad] = [];
					if (!reportScoresFidTiebreakPlayer_ar[fidRoad].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayer_ar[fidRoad]["w_" + week] = 0;
					if (!reportScoresFidTiebreakPlayerTracker_ar.hasOwnProperty(fidRoad)) reportScoresFidTiebreakPlayerTracker_ar[fidRoad] = [];
					if (!reportScoresFidTiebreakPlayerTracker_ar[fidRoad].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayerTracker_ar[fidRoad]["w_" + week] = [];
				}
			}
			if (fidHome !== "BYE") {
				var homeScore = parseFloat(matchups[i].franchise[1].score, 10);
				var homeScoreAdj = homeScore;
				try {
					if (reportScoreAdjustment_ar.hasOwnProperty("w_" + week))
						if (reportScoreAdjustment_ar["w_" + week].hasOwnProperty(fidHome)) homeScoreAdj += reportScoreAdjustment_ar["w_" + week][fidHome];
				} catch (er) {}
				if (!reportScoresFid_ar.hasOwnProperty(fidHome)) reportScoresFid_ar[fidHome] = [];
				if (!reportScoresAdjFid_ar.hasOwnProperty(fidHome)) reportScoresAdjFid_ar[fidHome] = [];
				if (!reportScoresFid_tracker.hasOwnProperty(fidHome)) {
					reportScoresFid_ar[fidHome]["w_" + week] = homeScore;
					reportScoresAdjFid_ar[fidHome]["w_" + week] = homeScoreAdj;
					reportScoresFid_tracker[fidHome] = 1;
				} else if (!countPtsScoredOncePerWeek) {
					reportScoresFid_ar[fidHome]["w_" + week] += homeScore;
					reportScoresAdjFid_ar[fidHome]["w_" + week] += homeScoreAdj;
				} else {
					addToTotalHome = false;
				}

				if (!reportScoresWeek_ar.hasOwnProperty("w_" + week)) reportScoresWeek_ar["w_" + week] = [];
				if (!reportScoresWeekAdj_ar.hasOwnProperty("w_" + week)) reportScoresWeekAdj_ar["w_" + week] = [];
				reportScoresWeek_ar["w_" + week][fidHome] = homeScore;
				reportScoresWeekAdj_ar["w_" + week][fidHome] = homeScoreAdj;
				//SET TIEBREAKERS IF ANY
				var tiebreakerTracker = [];
				if (matchups[i].franchise[1].hasOwnProperty("tiebreaker")) {
					var tiebreakerList = matchups[i].franchise[1]["tiebreaker"].split(",");
					for (var j = 0; j < tiebreakerList.length - 1; j++) {
						if (tiebreakerList[j] !== "") tiebreakerTracker[tiebreakerList[j]] = 1;
					}
				}
				//LOOP FOR BENCH SCORES AND TIEBREAKERS
				if (matchups[i].franchise[1].hasOwnProperty("player")) {
					for (var j = 0; j < matchups[i].franchise[1].player.length; j++) {
						if (matchups[i].franchise[1].player[j].hasOwnProperty("score"))
							var playerScore = parseFloat(matchups[i].franchise[1].player[j].score, 10);
						else
							var playerScore = 0;
						if (!reportScoresFidTiebreakPlayer_ar.hasOwnProperty(fidHome)) reportScoresFidTiebreakPlayer_ar[fidHome] = [];
						if (!reportScoresFidTiebreakPlayer_ar[fidHome].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayer_ar[fidHome]["w_" + week] = 0;
						if (tiebreakerTracker.hasOwnProperty(matchups[i].franchise[1].player[j].id)) reportScoresFidTiebreakPlayer_ar[fidHome]["w_" + week] += playerScore;
						if (!reportScoresFidTiebreakPlayerTracker_ar.hasOwnProperty(fidHome)) reportScoresFidTiebreakPlayerTracker_ar[fidHome] = [];
						if (!reportScoresFidTiebreakPlayerTracker_ar[fidHome].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayerTracker_ar[fidHome]["w_" + week] = [];
						if (tiebreakerTracker.hasOwnProperty(matchups[i].franchise[1].player[j].id)) reportScoresFidTiebreakPlayerTracker_ar[fidHome]["w_" + week].push(({
							"pid": matchups[i].franchise[1].player[j].id,
							"score": playerScore
						}));
						if (matchups[i].franchise[1].player[j].status === "nonstarter") {
							if (!reportScoresFidBench_ar.hasOwnProperty(fidHome)) reportScoresFidBench_ar[fidHome] = [];
							if (!reportScoresFidBench_ar[fidHome].hasOwnProperty("w_" + week)) reportScoresFidBench_ar[fidHome]["w_" + week] = 0;
							reportScoresFidBench_ar[fidHome]["w_" + week] += playerScore;
						}
					}
				} else {
					//NO LINEUP SUBMITTED
					if (!reportScoresFidTiebreakPlayer_ar.hasOwnProperty(fidHome)) reportScoresFidTiebreakPlayer_ar[fidHome] = [];
					if (!reportScoresFidTiebreakPlayer_ar[fidHome].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayer_ar[fidHome]["w_" + week] = 0;
					if (!reportScoresFidTiebreakPlayerTracker_ar.hasOwnProperty(fidHome)) reportScoresFidTiebreakPlayerTracker_ar[fidHome] = [];
					if (!reportScoresFidTiebreakPlayerTracker_ar[fidHome].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayerTracker_ar[fidHome]["w_" + week] = [];
				}
			}
			if (fidRoad !== "BYE" && fidHome !== "BYE") {
				//UPDATE ROAD TEAM
				if (!reportMatchupFid_ar.hasOwnProperty(fidRoad)) reportMatchupFid_ar[fidRoad] = [];
				if (!reportMatchupFid_ar[fidRoad].hasOwnProperty("total")) reportMatchupFid_ar[fidRoad]["total"] = ({
					"gp": 0,
					"w": 0,
					"l": 0,
					"t": 0,
					"pf": 0,
					"pa": 0,
					"wadj": 0,
					"ladj": 0,
					"tadj": 0,
					"pfadj": 0,
					"paadj": 0,
					"hgp": 0,
					"hw": 0,
					"hl": 0,
					"ht": 0,
					"hpf": 0,
					"hpa": 0,
					"hwadj": 0,
					"hladj": 0,
					"htadj": 0,
					"hpfadj": 0,
					"hpaadj": 0,
					"rgp": 0,
					"rw": 0,
					"rl": 0,
					"rt": 0,
					"rpf": 0,
					"rpa": 0,
					"rwadj": 0,
					"rladj": 0,
					"rtadj": 0,
					"rpfadj": 0,
					"rpaadj": 0,
					"dgp": 0,
					"dw": 0,
					"dl": 0,
					"dt": 0,
					"dpf": 0,
					"dpa": 0,
					"cgp": 0,
					"cw": 0,
					"cl": 0,
					"ct": 0,
					"cpf": 0,
					"cpa": 0
				});

				if (!reportMatchupFid_ar[fidRoad].hasOwnProperty("w_" + week)) reportMatchupFid_ar[fidRoad]["w_" + week] = [];
				if (!reportMatchupFid_ar[fidRoad].hasOwnProperty("opp_" + fidHome)) reportMatchupFid_ar[fidRoad]["opp_" + fidHome] = [];
				var w = 0,
					l = 0,
					t = 0,
					wadj = 0,
					ladj = 0,
					tadj = 0;
				if (roadScore > homeScore) w = 1;
				else if (roadScore < homeScore) l = 1;
				else t = 1;
				if (roadScoreAdj > homeScoreAdj) wadj = 1;
				else if (roadScoreAdj < homeScoreAdj) ladj = 1;
				else tadj = 1;
				reportMatchupFid_ar[fidRoad]["w_" + week].push(({
					"opp": fidHome,
					"isHome": false,
					"gp": 1,
					"w": w,
					"l": l,
					"t": t,
					"pf": roadScore,
					"pa": homeScore,
					"wadj": wadj,
					"ladj": ladj,
					"tadj": tadj,
					"pfadj": roadScoreAdj,
					"paadj": homeScoreAdj,
					"hgp": 0,
					"hw": 0,
					"hl": 0,
					"ht": 0,
					"hpf": 0,
					"hpa": 0,
					"hwadj": 0,
					"hladj": 0,
					"htadj": 0,
					"hpfadj": 0,
					"hpaadj": 0,
					"rgp": 1,
					"rw": w,
					"rl": l,
					"rt": t,
					"rpf": roadScore,
					"rpa": homeScore,
					"rwadj": wadj,
					"rladj": ladj,
					"rtadj": tadj,
					"rpfadj": roadScoreAdj,
					"rpaadj": homeScoreAdj,
					"dgp": 0,
					"dw": 0,
					"dl": 0,
					"dt": 0,
					"dpf": 0,
					"dpa": 0,
					"cgp": 0,
					"cw": 0,
					"cl": 0,
					"ct": 0,
					"cpf": 0,
					"cpa": 0
				}));
				reportMatchupFid_ar[fidRoad]["opp_" + fidHome].push(({
					"week": week,
					"isHome": false,
					"gp": 1,
					"w": w,
					"l": l,
					"t": t,
					"pf": roadScore,
					"pa": homeScore,
					"wadj": wadj,
					"ladj": ladj,
					"tadj": tadj,
					"pfadj": roadScoreAdj,
					"paadj": homeScoreAdj,
					"hgp": 0,
					"hw": 0,
					"hl": 0,
					"ht": 0,
					"hpf": 0,
					"hpa": 0,
					"hwadj": 0,
					"hladj": 0,
					"htadj": 0,
					"hpfadj": 0,
					"hpaadj": 0,
					"rgp": 1,
					"rw": w,
					"rl": l,
					"rt": t,
					"rpf": roadScore,
					"rpa": homeScore,
					"rwadj": wadj,
					"rladj": ladj,
					"rtadj": tadj,
					"rpfadj": roadScoreAdj,
					"rpaadj": homeScoreAdj,
					"dgp": 0,
					"dw": 0,
					"dl": 0,
					"dt": 0,
					"dpf": 0,
					"dpa": 0,
					"cgp": 0,
					"cw": 0,
					"cl": 0,
					"ct": 0,
					"cpf": 0,
					"cpa": 0
				}));
				reportMatchupFid_ar[fidRoad]["total"].gp++;
				reportMatchupFid_ar[fidRoad]["total"].w += w;
				reportMatchupFid_ar[fidRoad]["total"].l += l;
				reportMatchupFid_ar[fidRoad]["total"].t += t;
				if (addToTotalRoad) reportMatchupFid_ar[fidRoad]["total"].pf += roadScore;
				reportMatchupFid_ar[fidRoad]["total"].pa += homeScore;

				reportMatchupFid_ar[fidRoad]["total"].wadj += wadj;
				reportMatchupFid_ar[fidRoad]["total"].ladj += ladj;
				reportMatchupFid_ar[fidRoad]["total"].tadj += tadj;
				if (addToTotalRoad) reportMatchupFid_ar[fidRoad]["total"].pfadj += roadScoreAdj;
				reportMatchupFid_ar[fidRoad]["total"].paadj += homeScoreAdj;

				reportMatchupFid_ar[fidRoad]["total"].rgp++;
				reportMatchupFid_ar[fidRoad]["total"].rw += w;
				reportMatchupFid_ar[fidRoad]["total"].rl += l;
				reportMatchupFid_ar[fidRoad]["total"].rt += t;
				if (addToTotalRoad) reportMatchupFid_ar[fidRoad]["total"].rpf += roadScore;
				reportMatchupFid_ar[fidRoad]["total"].rpa += homeScore;

				reportMatchupFid_ar[fidRoad]["total"].rwadj += wadj;
				reportMatchupFid_ar[fidRoad]["total"].rladj += ladj;
				reportMatchupFid_ar[fidRoad]["total"].rtadj += tadj;
				if (addToTotalRoad) reportMatchupFid_ar[fidRoad]["total"].rpfadj += roadScoreAdj;
				reportMatchupFid_ar[fidRoad]["total"].rpaadj += homeScoreAdj;

				//UPDATE HOME TEAM
				if (!reportMatchupFid_ar.hasOwnProperty(fidHome)) reportMatchupFid_ar[fidHome] = [];
				if (!reportMatchupFid_ar[fidHome].hasOwnProperty("total")) reportMatchupFid_ar[fidHome]["total"] = ({
					"gp": 0,
					"w": 0,
					"l": 0,
					"t": 0,
					"pf": 0,
					"pa": 0,
					"wadaj": 0,
					"ladj": 0,
					"tadj": 0,
					"pfadj": 0,
					"paadj": 0,
					"hgp": 0,
					"hw": 0,
					"hl": 0,
					"ht": 0,
					"hpf": 0,
					"hpa": 0,
					"hwadj": 0,
					"hladj": 0,
					"htadj": 0,
					"hpfadj": 0,
					"hpaadj": 0,
					"rgp": 0,
					"rw": 0,
					"rl": 0,
					"rt": 0,
					"rpf": 0,
					"rpa": 0,
					"rwadj": 0,
					"rladj": 0,
					"rtadj": 0,
					"rpfadj": 0,
					"rpaadj": 0,
					"dgp": 0,
					"dw": 0,
					"dl": 0,
					"dt": 0,
					"dpf": 0,
					"dpa": 0,
					"cgp": 0,
					"cw": 0,
					"cl": 0,
					"ct": 0,
					"cpf": 0,
					"cpa": 0
				});

				if (!reportMatchupFid_ar[fidHome].hasOwnProperty("w_" + week)) reportMatchupFid_ar[fidHome]["w_" + week] = [];
				if (!reportMatchupFid_ar[fidHome].hasOwnProperty("opp_" + fidRoad)) reportMatchupFid_ar[fidHome]["opp_" + fidRoad] = [];
				var w = 0,
					l = 0,
					t = 0,
					wadj = 0,
					ladj = 0,
					tadj = 0;
				if (homeScore > roadScore) w = 1;
				else if (homeScore < roadScore) l = 1;
				else t = 1;
				if (homeScoreAdj > roadScoreAdj) wadj = 1;
				else if (homeScoreAdj < roadScoreAdj) ladj = 1;
				else tadj = 1;
				reportMatchupFid_ar[fidHome]["w_" + week].push(({
					"opp": fidRoad,
					"isHome": true,
					"gp": 1,
					"w": w,
					"l": l,
					"t": t,
					"pf": homeScore,
					"pa": roadScore,
					"wadj": wadj,
					"ladj": ladj,
					"tadj": tadj,
					"pfadj": homeScoreAdj,
					"paadj": roadScoreAdj,
					"hgp": 1,
					"hw": w,
					"hl": l,
					"ht": t,
					"hpf": homeScore,
					"hpa": roadScore,
					"hwadj": wadj,
					"hladj": ladj,
					"htadj": tadj,
					"hpfadj": homeScoreAdj,
					"hpaadj": roadScoreAdj,
					"rgp": 0,
					"rw": 0,
					"rl": 0,
					"rt": 0,
					"rpf": 0,
					"rpa": 0,
					"rwadj": 0,
					"rladj": 0,
					"rtadj": 0,
					"rpfadj": 0,
					"rpaadj": 0,
					"dgp": 0,
					"dw": 0,
					"dl": 0,
					"dt": 0,
					"dpf": 0,
					"dpa": 0,
					"cgp": 0,
					"cw": 0,
					"cl": 0,
					"ct": 0,
					"cpf": 0,
					"cpa": 0
				}));
				reportMatchupFid_ar[fidHome]["opp_" + fidRoad].push(({
					"week": week,
					"isHome": true,
					"gp": 1,
					"w": w,
					"l": l,
					"t": t,
					"pf": homeScore,
					"pa": roadScore,
					"wadj": wadj,
					"ladj": ladj,
					"tadj": tadj,
					"pfadj": homeScoreAdj,
					"paadj": roadScoreAdj,
					"hgp": 1,
					"hw": w,
					"hl": l,
					"ht": t,
					"hpf": homeScore,
					"hpa": roadScore,
					"hwadj": wadj,
					"hladj": ladj,
					"htadj": tadj,
					"hpfadj": homeScoreAdj,
					"hpaadj": roadScoreAdj,
					"rgp": 0,
					"rw": 0,
					"rl": 0,
					"rt": 0,
					"rpf": 0,
					"rpa": 0,
					"rwadj": 0,
					"rladj": 0,
					"rtadj": 0,
					"rpfadj": 0,
					"rpaadj": 0,
					"dgp": 0,
					"dw": 0,
					"dl": 0,
					"dt": 0,
					"dpf": 0,
					"dpa": 0,
					"cgp": 0,
					"cw": 0,
					"cl": 0,
					"ct": 0,
					"cpf": 0,
					"cpa": 0
				}));
				reportMatchupFid_ar[fidHome]["total"].gp++;
				reportMatchupFid_ar[fidHome]["total"].w += w;
				reportMatchupFid_ar[fidHome]["total"].l += l;
				reportMatchupFid_ar[fidHome]["total"].t += t;
				if (addToTotalHome) reportMatchupFid_ar[fidHome]["total"].pf += homeScore;
				reportMatchupFid_ar[fidHome]["total"].pa += roadScore;

				reportMatchupFid_ar[fidHome]["total"].wadj += wadj;
				reportMatchupFid_ar[fidHome]["total"].ladj += ladj;
				reportMatchupFid_ar[fidHome]["total"].tadj += tadj;
				if (addToTotalHome) reportMatchupFid_ar[fidHome]["total"].pfadj += homeScoreAdj;
				reportMatchupFid_ar[fidHome]["total"].paadj += roadScoreAdj;

				reportMatchupFid_ar[fidHome]["total"].hgp++;
				reportMatchupFid_ar[fidHome]["total"].hw += w;
				reportMatchupFid_ar[fidHome]["total"].hl += l;
				reportMatchupFid_ar[fidHome]["total"].ht += t;
				if (addToTotalHome) reportMatchupFid_ar[fidHome]["total"].hpf += homeScore;
				reportMatchupFid_ar[fidHome]["total"].hpa += roadScore;

				reportMatchupFid_ar[fidHome]["total"].hwadj += wadj;
				reportMatchupFid_ar[fidHome]["total"].hladj += ladj;
				reportMatchupFid_ar[fidHome]["total"].htadj += tadj;
				if (addToTotalHome) reportMatchupFid_ar[fidHome]["total"].hpfadj += homeScoreAdj;
				reportMatchupFid_ar[fidHome]["total"].hpaadj += roadScoreAdj;
			}
		}
	}
	//CHECK FOR FRANCHISES WITH NO MATCHUPS (THERE MAY ONLY BE ONE)
	if (response.weeklyResults.hasOwnProperty("franchise")) {
		var franchise_ar = [];
		if (response.weeklyResults.franchise.hasOwnProperty("score"))
			franchise_ar.push(response.weeklyResults.franchise);
		else
			franchise_ar = response.weeklyResults.franchise;
		for (var i = 0; i < franchise_ar.length; i++) {
			var fid = franchise_ar[i].id;
			var score = parseFloat(franchise_ar[i].score, 10);
			var scoreAdj = score;
			try {
				if (reportScoreAdjustment_ar.hasOwnProperty["w_" + week])
					if (reportScoreAdjustment_ar["w_" + week].hasOwnProperty[fid]) scoreAdj += reportScoreAdjustment_ar["w_" + week][fid];
			} catch (er) {}
			if (!reportScoresFid_ar.hasOwnProperty(fid)) reportScoresFid_ar[fid] = [];
			if (!reportScoresAdjFid_ar.hasOwnProperty(fid)) reportScoresAdjFid_ar[fid] = [];
			if (!reportScoresFid_tracker.hasOwnProperty(fid)) {
				reportScoresFid_ar[fid]["w_" + week] = score;
				reportScoresAdjFid_ar[fid]["w_" + week] = scoreAdj;
				reportScoresFid_tracker[fid] = 1;
			} else if (!countPtsScoredOncePerWeek) {
				reportScoresFid_ar[fid]["w_" + week] += score;
				reportScoresAdjFid_ar[fid]["w_" + week] += scoreAdj;
			}

			if (!reportScoresWeek_ar.hasOwnProperty("w_" + week)) reportScoresWeek_ar["w_" + week] = [];
			if (!reportScoresWeekAdj_ar.hasOwnProperty("w_" + week)) reportScoresWeekAdj_ar["w_" + week] = [];
			reportScoresWeek_ar["w_" + week][fid] = score;
			reportScoresWeekAdj_ar["w_" + week][fid] = scoreAdj;
			//SET TIEBREAKERS IF ANY
			var tiebreakerTracker = [];
			if (franchise_ar[i].hasOwnProperty("tiebreaker")) {
				var tiebreakerList = franchise_ar[i]["tiebreaker"].split(",");
				for (var j = 0; j < tiebreakerList.length - 1; j++) {
					if (tiebreakerList[j] !== "") tiebreakerTracker[tiebreakerList[j]] = 1;
				}
			}
			//LOOP FOR BENCH SCORES AND TIEBREAKERS
			if (franchise_ar[i].hasOwnProperty("player")) {
				for (var j = 0; j < franchise_ar[i].player.length; j++) {
					if (franchise_ar[i].player[j].hasOwnProperty("score"))
						var playerScore = parseFloat(franchise_ar[i].player[j].score, 10);
					else
						var playerScore = 0;
					if (!reportScoresFidTiebreakPlayer_ar.hasOwnProperty(fid)) reportScoresFidTiebreakPlayer_ar[fid] = [];
					if (!reportScoresFidTiebreakPlayer_ar[fid].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayer_ar[fid]["w_" + week] = 0;
					if (tiebreakerTracker.hasOwnProperty(franchise_ar[i].player[j].id)) reportScoresFidTiebreakPlayer_ar[fid]["w_" + week] += playerScore;
					if (!reportScoresFidTiebreakPlayerTracker_ar.hasOwnProperty(fid)) reportScoresFidTiebreakPlayerTracker_ar[fid] = [];
					if (!reportScoresFidTiebreakPlayerTracker_ar[fid].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayerTracker_ar[fid]["w_" + week] = [];
					if (tiebreakerTracker.hasOwnProperty(franchise_ar[i].player[j].id)) reportScoresFidTiebreakPlayerTracker_ar[fid]["w_" + week].push(({
						"pid": franchise_ar[i].player[j].id,
						"score": playerScore
					}));
					if (franchise_ar[i].player[j].status === "nonstarter") {
						if (!reportScoresFidBench_ar.hasOwnProperty(fid)) reportScoresFidBench_ar[fid] = [];
						if (!reportScoresFidBench_ar[fid].hasOwnProperty("w_" + week)) reportScoresFidBench_ar[fid]["w_" + week] = 0;
						reportScoresFidBench_ar[fid]["w_" + week] += playerScore;
					}
				}
			} else {
				//NO LINEUP SUBMITTED
				if (!reportScoresFidTiebreakPlayer_ar.hasOwnProperty(fid)) reportScoresFidTiebreakPlayer_ar[fid] = [];
				if (!reportScoresFidTiebreakPlayer_ar[fid].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayer_ar[fid]["w_" + week] = 0;
				if (!reportScoresFidTiebreakPlayerTracker_ar.hasOwnProperty(fid)) reportScoresFidTiebreakPlayerTracker_ar[fid] = [];
				if (!reportScoresFidTiebreakPlayerTracker_ar[fid].hasOwnProperty("w_" + week)) reportScoresFidTiebreakPlayerTracker_ar[fid]["w_" + week] = [];
			}
			//NO MATCHUPS FOR WEEK BUT WE STILL NEED TO SET MATCHUP FID ARRAY TO DEFAULT VALUES
			if (!reportMatchupFid_ar.hasOwnProperty(fid)) {
				reportMatchupFid_ar[fid] = [];
				reportMatchupFid_ar[fid]["total"] = ({
					"gp": 0,
					"w": 0,
					"l": 0,
					"t": 0,
					"pf": 0,
					"pa": 0,
					"wadj": 0,
					"ladj": 0,
					"tadj": 0,
					"pfadj": 0,
					"paadj": 0,
					"hgp": 0,
					"hw": 0,
					"hl": 0,
					"ht": 0,
					"hpf": 0,
					"hpa": 0,
					"hwadj": 0,
					"hladj": 0,
					"htadj": 0,
					"hpfadj": 0,
					"hpaadj": 0,
					"rgp": 0,
					"rw": 0,
					"rl": 0,
					"rt": 0,
					"rpf": 0,
					"rpa": 0,
					"rwadj": 0,
					"rladj": 0,
					"rtadj": 0,
					"rpfadj": 0,
					"rpaadj": 0,
					"dgp": 0,
					"dw": 0,
					"dl": 0,
					"dt": 0,
					"dpf": 0,
					"dpa": 0,
					"cgp": 0,
					"cw": 0,
					"cl": 0,
					"ct": 0,
					"cpf": 0,
					"cpa": 0
				});
			}
			if (!reportMatchupFid_ar[fid].hasOwnProperty("w_" + week)) reportMatchupFid_ar[fid]["w_" + week] = [];
			reportMatchupFid_ar[fid]["w_" + week].push(({
				"opp": "",
				"isHome": false,
				"gp": 0,
				"w": 0,
				"l": 0,
				"t": 0,
				"pf": score,
				"pa": 0,
				"wadj": 0,
				"ladj": 0,
				"tadj": 0,
				"pfadj": scoreAdj,
				"paadj": 0,
				"hgp": 0,
				"hw": 0,
				"hl": 0,
				"ht": 0,
				"hpf": 0,
				"hpa": 0,
				"hwadj": 0,
				"hladj": 0,
				"htadj": 0,
				"hpfadj": 0,
				"hpaadj": 0,
				"rgp": 0,
				"rw": 0,
				"rl": 0,
				"rt": 0,
				"rpf": 0,
				"rpa": 0,
				"rwadj": 0,
				"rladj": 0,
				"rtadj": 0,
				"rpfadj": 0,
				"rpaadj": 0,
				"dgp": 0,
				"dw": 0,
				"dl": 0,
				"dt": 0,
				"dpf": 0,
				"dpa": 0,
				"cgp": 0,
				"cw": 0,
				"cl": 0,
				"ct": 0,
				"cpf": 0,
				"cpa": 0
			}));
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  NFL SCHEDULE API                ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function reportNflScheduleAPI(weekAPI) {
	const cacheKey = `cache_nflSchedule-${weekAPI}_${year}`;
	if (weekAPI === "ALL") {
		var week = completedWeek;
	} else if (weekAPI === 0) {
		weekAPI = 1;
		var week = weekAPI;
	} else if (weekAPI > AllGamesCount) {
		weekAPI = AllGamesCount;
		var week = weekAPI;
	} else {
		var week = weekAPI;
	}
	var completedWeekCheck = completedWeek;
	if (completedWeek === 0) {
		completedWeekCheck = 1;
	}
	if (weekAPI === "ALL") {
		let allResponsesCached = true;
		const nflCacheHits = {};
		for (let i = 1; i <= AllGamesCount; i++) {
			const key = `cache_nflSchedule-${i}_${year}_${cacheDaily}`;
			if (i === liveScoringWeek && liveScoringWeek > completedWeek) {
				// Live week is allowed to be missing for the fast-path; just record whatever is there
				nflCacheHits[i] = cacheResponse(key);
				continue;
			}
			const raw = cacheResponse(key);
			nflCacheHits[i] = raw;

			if (raw === false) {
				allResponsesCached = false;
				break;
			}
		}
		if (allResponsesCached) {
			for (let i = 1; i <= AllGamesCount; i++) {
				const cachedRaw = nflCacheHits.hasOwnProperty(i) ?
					nflCacheHits[i] :
					cacheResponse(`cache_nflSchedule-${i}_${year}_${cacheDaily}`);
				if (cachedRaw && cachedRaw !== false) {

					const parsed = safeJSONParse(
						cachedRaw,
						() => console.warn('[nflSchedule] JSON parse error for week', i)
					);
					if (parsed) {
						reportNflSchedule_ar[`w_${i}`] = parsed;
						reportNflScheduleResponse(parsed, i);
					}
					// If parsed = null â†’ fall through (same as original)
				}
			}
			return true;
		}
	} else {
		const isLiveAhead = (week === liveScoringWeek);
		if (!isLiveAhead) {
			const key = `cache_nflSchedule-${week}_${year}_${cacheDaily}`;
			const cached = cacheResponse(key);
			if (cached !== false) {
				const parsed = safeJSONParse(cached, () => {
					console.warn('[nflSchedule] JSON parse error for week', week);
				});
				if (parsed) {
					reportNflSchedule_ar["w_" + week] = parsed;
					return reportNflScheduleResponse(parsed, week);
				}
				// If parsed is null â†’ fall through to fetch() just like original
			}
		}
		// If isLiveAhead === true, or cache was missing/invalid, we fall through to fetch() below
	}
	let thisURL;
	if (weekAPI <= NFLlastWk || completedWeek >= weekAPI) {
		if (weekAPI === "ALL") {
			thisURL = `${baseURLDynamic}/fflnetdynamic${year}/nfl_sched.json`;
		} else {
			thisURL = `${baseURLDynamic}/fflnetdynamic${year}/nfl_sched_${weekAPI}.json`;
		}
	} else {
		if (weekAPI === "ALL") {
			thisURL = `${baseURLDynamic}/fflnetdynamic${year}/nfl_sched.json`;
		} else {
			thisURL = `https://api.myfantasyleague.com/${year}/export?TYPE=nflSchedule&W=${weekAPI}&JSON=1`;
		}
	}
	try {
		return fetch(thisURL)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					//console.log("No Schedule For NFL Week Requested");
					throw new Error("Invalid response from server");
				}
			})
			.then(data => {
				if (weekAPI === "ALL") {
					const nflWeeksTotal = data.fullNflSchedule.nflSchedule.length;
					for (var i = 1; i <= nflWeeksTotal; i++) {
						for (var j = 0; j < data.fullNflSchedule.nflSchedule.length; j++) {
							if (i === parseInt(data.fullNflSchedule.nflSchedule[j].week)) {
								reportNflSchedule_ar[`w_${i}`] = [];
								reportNflSchedule_ar[`w_${i}`] = {
									"version": "1.0",
									"encoding": "utf-8"
								};
								reportNflSchedule_ar[`w_${i}`].nflSchedule = {
									"week": `${i}`
								};
								if (data.fullNflSchedule.nflSchedule[j].hasOwnProperty("matchup")) {
									reportNflSchedule_ar[`w_${i}`].nflSchedule.matchup = data.fullNflSchedule.nflSchedule[j].matchup;
								}
								// clear all prior days for this week/year
								clearCacheKey(`cache_nflSchedule-${i}_${year}`);
								localStorage.setItem(`cache_nflSchedule-${i}_${year}_${cacheDaily}`, JSON.stringify(reportNflSchedule_ar[`w_${i}`]));
								reportNflScheduleResponse(reportNflSchedule_ar[`w_${i}`], i);
							}
						}
					}
					signalMFLCacheUpdate("nflSchedule", {
						source: "api",
						ttl: "daily",
						week: "ALL"
					});
				} else {
					reportNflSchedule_ar[`w_${week}`] = data;
					clearCacheKey(`cache_nflSchedule-${week}_${year}`);
					localStorage.setItem(`cache_nflSchedule-${week}_${year}_${cacheDaily}`, JSON.stringify(reportNflSchedule_ar[`w_${week}`]));
					reportNflScheduleResponse(reportNflSchedule_ar[`w_${week}`], week);
					signalMFLCacheUpdate("nflSchedule", {
						source: "api",
						ttl: "daily",
						week: week
					});
				}
			})
			.catch(error => {
				console.log(error.message);
				nflScheduleJsonError = true;
			});
	} catch (error) {
		console.log(error.message);
		nflScheduleJsonError = true;
	}
}

function reportNflScheduleResponse(response, week) {
	if (reportNflScheduleWeek_ar[week] === undefined) reportNflScheduleWeek_ar[week] = [];
	try { // MORE THAN ONE NFL MATCHUP (NORMAL)
		for (var j = 0; j < response.nflSchedule.matchup.length; j++) {
			reportNflScheduleResponse_matchup(week, response.nflSchedule.matchup[j]);
			reportNflScheduleWeek_ar[week][j] = response.nflSchedule.matchup[j];
		}
	} catch (er) {
		try { // ONE NFL MATCHUP (RARE-SUPERBOWL WEEK)
			reportNflScheduleResponse_matchup(week, response.nflSchedule.matchup);
			reportNflScheduleWeek_ar[week][0] = response.nflSchedule.matchup;
		} catch (er) {
			// NO NFL MATCHUPS (RARE-UNSCHEDULED PLAYOFF MATCHUPS)
		}
	}
	buildRunningRecordsForAllTeams(reportNflScheduleFid_ar, AllGamesCount);
}

function buildRunningRecordsForAllTeams(data, maxWeek) {
	for (const teamId in data) {
		const weeksArr = data[teamId];
		if (!weeksArr) continue;

		let w = 0,
			l = 0,
			t = 0;

		for (let wk = 1; wk <= maxWeek; wk++) {
			const rec = weeksArr[wk];
			if (!rec) continue;

			const decided = rec.result === "WIN" || rec.result === "LOSS" || rec.result === "TIED";

			if (decided) {
				w += rec.win ? 1 : 0;
				l += rec.loss ? 1 : 0;
				t += rec.tie ? 1 : 0;
			}

			// âœ… Always set runRec for every existing week object
			rec.runW = w;
			rec.runL = l;
			rec.runT = t;
			rec.runRec = `${w}-${l}-${t}`;
		}
	}
}

function reportNflScheduleResponse_matchup(week, matchup) {
	const team0 = matchup.team[0];
	const team1 = matchup.team[1];

	// Ensure arrays exist
	if (!reportNflScheduleFid_ar[team0.id]) reportNflScheduleFid_ar[team0.id] = [];
	if (!reportNflScheduleFid_ar[team1.id]) reportNflScheduleFid_ar[team1.id] = [];

	// Create base objects for this week if not present
	if (!reportNflScheduleFid_ar[team0.id][week]) {
		reportNflScheduleFid_ar[team0.id][week] = {
			kickoff: matchup.kickoff,
			gameSecondsRemaining: matchup.gameSecondsRemaining,
			isHome: false,
			opponent: team1.id,
			score: team0.score,
			opponentScore: team1.score,
			rushDefenseRank: team0.rushDefenseRank,
			passDefenseRank: team0.passDefenseRank,
			rushOffenseRank: team0.rushOffenseRank,
			passOffenseRank: team0.passOffenseRank,
			hasPossession: team0.hasPossession,
			inRedZone: team0.inRedZone,
			spread: team0.spread,
			win: 0,
			loss: 0,
			tie: 0,
			pf: 0,
			pa: 0,
			result: ""
		};
	}

	if (!reportNflScheduleFid_ar[team1.id][week]) {
		reportNflScheduleFid_ar[team1.id][week] = {
			kickoff: matchup.kickoff,
			gameSecondsRemaining: matchup.gameSecondsRemaining,
			isHome: true,
			opponent: team0.id,
			score: team1.score,
			opponentScore: team0.score,
			rushDefenseRank: team1.rushDefenseRank,
			passDefenseRank: team1.passDefenseRank,
			rushOffenseRank: team1.rushOffenseRank,
			passOffenseRank: team1.passOffenseRank,
			hasPossession: team1.hasPossession,
			inRedZone: team1.inRedZone,
			spread: team1.spread,
			win: 0,
			loss: 0,
			tie: 0,
			pf: 0,
			pa: 0,
			result: ""
		};
	}

	const isFinal =
		typeof matchup.status === "string" &&
		matchup.status.toUpperCase() === "FINAL";

	// Only compute W/L/T & PF/PA for completed games
	if (isFinal || week <= completedWeek) {
		const score0 = parseInt(team0.score, 10) || 0;
		const score1 = parseInt(team1.score, 10) || 0;

		const rec0 = reportNflScheduleFid_ar[team0.id][week];
		const rec1 = reportNflScheduleFid_ar[team1.id][week];

		// âœ… Make this idempotent: always *set* to the current game values,
		// not += (we only have one game per week per team)
		rec0.pf = score0;
		rec0.pa = score1;
		rec1.pf = score1;
		rec1.pa = score0;

		// Reset W/L/T before assigning, to avoid double-count on re-runs
		rec0.win = rec0.loss = rec0.tie = 0;
		rec1.win = rec1.loss = rec1.tie = 0;

		if (score0 > score1) {
			// Road team wins
			rec0.win = 1;
			rec1.loss = 1;

			rec0.result = "WIN";
			rec1.result = "LOSS";

		} else if (score0 < score1) {
			// Home team wins
			rec0.loss = 1;
			rec1.win = 1;

			rec0.result = "LOSS";
			rec1.result = "WIN";

		} else {
			// Tie
			rec0.tie = 1;
			rec1.tie = 1;

			rec0.result = "TIED";
			rec1.result = "TIED";
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                REPORT H2H RESULTS                ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function reportHeadToHeadResults() {
	for (var fid in reportMatchupFid_ar) {
		if (reportMatchupFid_ar.hasOwnProperty(fid)) {
			for (var opp_fid in reportMatchupFid_ar[fid]) {
				if (opp_fid.startsWith("opp_")) {
					if (!reportMatchupFid_ar[fid][opp_fid].hasOwnProperty("hth")) {
						reportMatchupFid_ar[fid][opp_fid].hth = {
							"gp": 0,
							"w": 0,
							"l": 0,
							"t": 0,
							"pf": 0,
							"pa": 0
						};
					}
					var matchups = reportMatchupFid_ar[fid][opp_fid];
					for (var i = 0; i < matchups.length; i++) {
						var matchup = matchups[i];
						reportMatchupFid_ar[fid][opp_fid].hth.gp += matchup.gp;
						reportMatchupFid_ar[fid][opp_fid].hth.w += matchup.w;
						reportMatchupFid_ar[fid][opp_fid].hth.l += matchup.l;
						reportMatchupFid_ar[fid][opp_fid].hth.t += matchup.t;
						reportMatchupFid_ar[fid][opp_fid].hth.pf += matchup.pf;
						reportMatchupFid_ar[fid][opp_fid].hth.pa += matchup.pa;
					}
				}
			}
		}
	}
	doHeadToHeadArray();
}

function doHeadToHeadArray() {
	for (var fidKey in franchiseDatabase) {
		if (franchiseDatabase.hasOwnProperty(fidKey) && fidKey !== "fid_0000") {
			reportHTH_ar.push([]); // This for-next loop creates all the multi-dimensional arrays required
			reportSOS_ar.push(({
				"oppw": 0,
				"oppl": 0,
				"oppt": 0
			})); // [Opp. Overall W, Opp. Overall L, Opp. Overall T
			reportSOV_ar.push(({
				"oppw": 0,
				"oppl": 0,
				"oppt": 0
			})); // [Opp. Overall W, Opp. Overall L, Opp. Overall T
			for (var fidKey2 in franchiseDatabase) {
				if (franchiseDatabase.hasOwnProperty(fidKey2) && fidKey2 !== "fid_0000") {
					reportHTH_ar[reportHTH_ar.length - 1].push(({
						"r": "*",
						"count": 0,
						"gp": 0,
						"title": "",
						"w": 0,
						"l": "",
						"t": 0,
						"pf": 0,
						"tooltip": ""
					})); // [WLT text, +1 for W; -1 for L; 0 for tie, Games Played Head to Head, title text, wins, losses, ties, points scored, tooltip text]
				}
			}
		}
	}
	//ADD EXTRA FOR LEAGUE AVERAGE
	reportHTH_ar.push([]);
	reportHTH_ar[reportHTH_ar.length - 1].push(({
		"r": "*",
		"count": 0,
		"gp": 0,
		"title": 0,
		"w": 0,
		"l": "",
		"t": 0,
		"pf": 0,
		"tooltip": ""
	})); //was ["*",0,0,"",0,0,0,0,""]
	reportSOS_ar.push(({
		"oppw": 0,
		"oppl": 0,
		"oppt": 0
	}));
	reportSOV_ar.push(({
		"oppw": 0,
		"oppl": 0,
		"oppt": 0
	}));
	createHeadToHeadArray();
}

function createHeadToHeadArray() { // Also will create reportSOS_ar (Strength of Schedule) and reportSOV_ar (Strength of Victory)
	if (completedWeek <= standingsEndWeek) var _endWeek = completedWeek;
	else _endWeek = standingsEndWeek;
	reportStandings_ar.sort(function (a, b) { //RESET STANDINGS ARRAY; NOT SURE IF NEEDED OR NOT
		if (a.index < b.index) return -1;
		if (a.index > b.index) return 1;
		return 0;
	});
	for (var w = startWeek; w <= _endWeek; w++) {
		if (reportWeeklyResults_ar.hasOwnProperty("w_" + w)) {
			fillHeadToHeadArray(reportWeeklyResults_ar["w_" + w], w);
			fillSOSArray(reportWeeklyResults_ar["w_" + w], w);
			fillSOVArray(reportWeeklyResults_ar["w_" + w], w);
		}
	}
	//WE CAN NOW UPDATE STANDINGS WITH SOS & SOV
	if (leagueAverageCreated) var standingsLength = reportStandings_ar.length - 1;
	else var standingsLength = reportStandings_ar.length;
	for (var i = 0; i < standingsLength; i++) {
		if (reportSOS_ar[i].oppw + reportSOS_ar[i].oppl + reportSOS_ar[i].oppt > 0)
			var sospct = parseInt((reportSOS_ar[i].oppw + reportSOS_ar[i].oppt * 0.5) / (reportSOS_ar[i].oppw + reportSOS_ar[i].oppl + reportSOS_ar[i].oppt) * 1000) / 1000;
		else
			var sospct = 0;
		reportStandings_ar[i].sospct = sospct;
		if (reportSOV_ar[i].oppw + reportSOV_ar[i].oppl + reportSOV_ar[i].oppt > 0)
			var sovpct = parseInt((reportSOV_ar[i].oppw + reportSOV_ar[i].oppt * 0.5) / (reportSOV_ar[i].oppw + reportSOV_ar[i].oppl + reportSOV_ar[i].oppt) * 1000) / 1000;
		else
			var sovpct = 0;
		reportStandings_ar[i].sovpct = sovpct;
	}
}

function fillSOSArray(thisArray, thisWeek) {
	//SOS IS THE RECORD OF ALL THE TEAMS A TEAM HAS PLAYED
	if (!thisArray.weeklyResults.hasOwnProperty("matchup")) return false; //NO MATCHUPS
	var matchup_ar = [];
	if (thisArray.weeklyResults.matchup.hasOwnProperty("franchise")) {
		matchup_ar.matchup = [];
		matchup_ar.matchup.push(thisArray.weeklyResults.matchup);
	} else
		matchup_ar = thisArray.weeklyResults;
	for (var m = 0; m < matchup_ar.matchup.length; m++) {
		var awayIDStr = matchup_ar.matchup[m].franchise[0].id;
		var homeIDStr = matchup_ar.matchup[m].franchise[1].id;
		var awayID = parseInt(awayIDStr, 10) - 1;
		var homeID = parseInt(homeIDStr, 10) - 1;
		if (awayID < 0 || homeID < 0) continue;
		if (awayIDStr !== "BYE" && homeIDStr !== "BYE" && awayIDStr !== "AVG" && homeIDStr !== "AVG") {
			reportSOS_ar[awayID].oppw += reportStandings_ar[homeID].w;
			reportSOS_ar[awayID].oppl += reportStandings_ar[homeID].l;
			reportSOS_ar[awayID].oppt += reportStandings_ar[homeID].t;
			reportSOS_ar[homeID].oppw += reportStandings_ar[awayID].w;
			reportSOS_ar[homeID].oppl += reportStandings_ar[awayID].l;
			reportSOS_ar[homeID].oppt += reportStandings_ar[awayID].t;
		}
	}
}

function fillSOVArray(thisArray, thisWeek) {
	//SOS IS THE RECORD OF ALL THE TEAMS A TEAM HAS WON AGAINST
	if (!thisArray.weeklyResults.hasOwnProperty("matchup")) return false; //NO MATCHUPS
	var matchup_ar = [];
	if (thisArray.weeklyResults.matchup.hasOwnProperty("franchise")) {
		matchup_ar.matchup = [];
		matchup_ar.matchup.push(thisArray.weeklyResults.matchup);
	} else
		matchup_ar = thisArray.weeklyResults;
	for (var m = 0; m < matchup_ar.matchup.length; m++) {
		var awayIDStr = matchup_ar.matchup[m].franchise[0].id;
		var homeIDStr = matchup_ar.matchup[m].franchise[1].id;
		var awayID = parseInt(awayIDStr, 10) - 1;
		var homeID = parseInt(homeIDStr, 10) - 1;
		if (awayID < 0 || homeID < 0) continue;
		var awayResult = matchup_ar.matchup[m].franchise[0].result;
		var homeResult = matchup_ar.matchup[m].franchise[1].result;
		if (awayIDStr !== "BYE" && homeIDStr !== "BYE" && awayIDStr !== "AVG" && homeIDStr !== "AVG") {
			if (awayResult === "W") {
				reportSOV_ar[awayID].oppw += reportStandings_ar[homeID].w;
				reportSOV_ar[awayID].oppl += reportStandings_ar[homeID].l;
				reportSOV_ar[awayID].oppt += reportStandings_ar[homeID].t;
			}
			if (homeResult === "W") {
				reportSOV_ar[homeID].oppw += reportStandings_ar[awayID].w;
				reportSOV_ar[homeID].oppl += reportStandings_ar[awayID].l;
				reportSOV_ar[homeID].oppt += reportStandings_ar[awayID].t;
			}
		}
	}
}

function fillHeadToHeadArray(thisArray, thisWeek) {
	var skipMatchup = false;
	if (!thisArray.weeklyResults.hasOwnProperty("matchup")) return false; //NO MATCHUPS
	var matchup_ar = [];
	if (thisArray.weeklyResults.matchup.hasOwnProperty("franchise")) {
		matchup_ar.matchup = [];
		matchup_ar.matchup.push(thisArray.weeklyResults.matchup);
	} else
		matchup_ar = thisArray.weeklyResults;
	for (var m = 0; m < matchup_ar.matchup.length; m++) {
		var awayIDStr = matchup_ar.matchup[m].franchise[0].id;
		var homeIDStr = matchup_ar.matchup[m].franchise[1].id;
		var awayID = parseInt(awayIDStr, 10) - 1;
		var homeID = parseInt(homeIDStr, 10) - 1;
		if (awayID < 0 || homeID < 0) continue;
		if (awayIDStr === "AVG") {
			awayID = leagueAttributes['Franchises'];
			leagueAverage = true;
		}
		if (homeIDStr === "AVG") {
			homeID = leagueAttributes['Franchises'];
			leagueAverage = true;
		}
		if (leagueAverage && !leagueAverageCreated) {
			reportStandings_ar.push(({
				"w": 0,
				"l": 0,
				"t": 0,
				"pf": 0
			}));
			leagueAverageCreated = true;
		}
		if (awayIDStr === "BYE" || homeIDStr === "BYE") skipMatchup = true;

		if (!skipMatchup) {
			var awayScore = parseFloat(matchup_ar.matchup[m].franchise[0].score);
			var homeScore = parseFloat(matchup_ar.matchup[m].franchise[1].score);
			var awayResult = matchup_ar.matchup[m].franchise[0].result;
			var homeResult = matchup_ar.matchup[m].franchise[1].result;
			if (awayScore > homeScore || awayResult === "W") {
				if (awayScore === homeScore) {
					var asterisk = "*";
					var asteriskExplanation = "won tiebreaker";
				} else {
					var asterisk = "";
					var asteriskExplanation = "";
				}
				var awayCount = 1;
				var homeCount = -1;
				if (awayIDStr === "AVG")
					var awayTitle = 'Week #' + thisWeek + ': Average ' + awayScore + asterisk + ' defeated ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + '   ' + asterisk + asteriskExplanation;
				else if (homeIDStr === "AVG")
					var awayTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + asterisk + ' defeated Average ' + homeScore + '   ' + asterisk + asteriskExplanation;
				else
					var awayTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + asterisk + ' defeated ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + '   ' + asterisk + asteriskExplanation;
				if (homeIDStr === "AVG")
					var homeTitle = 'Week #' + thisWeek + ': Average ' + homeScore + ' lost to ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + asterisk + '   ' + asterisk + asteriskExplanation;
				else if (awayIDStr === "AVG")
					var homeTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + ' lost to Average ' + awayScore + asterisk + '   ' + asterisk + asteriskExplanation;
				else
					var homeTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + ' lost to ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + asterisk + '   ' + asterisk + asteriskExplanation;
				var awayWin = 1;
				var homeWin = 0;
				var awayLoss = 0;
				var homeLoss = 1;
				var awayTie = 0;
				var homeTie = 0;
			} else if (awayScore < homeScore || awayResult === "L") {
				if (awayScore === homeScore) {
					var asterisk = "*";
					var asteriskExplanation = "won tiebreaker";
				} else {
					var asterisk = "";
					var asteriskExplanation = "";
				}
				var awayCount = -1;
				var homeCount = 1;
				if (awayIDStr === "AVG")
					var awayTitle = 'Week #' + thisWeek + ': Average ' + awayScore + ' lost to ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + asterisk + '   ' + asterisk + asteriskExplanation;
				else if (homeIDStr === "AVG")
					var awayTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + ' lost to Average ' + homeScore + asterisk + '   ' + asterisk + asteriskExplanation;
				else
					var awayTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + ' lost to ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + asterisk + '   ' + asterisk + asteriskExplanation;
				if (homeIDStr === "AVG")
					var homeTitle = 'Week #' + thisWeek + ': Average ' + homeScore + asterisk + ' defeated ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + '   ' + asterisk + asteriskExplanation;
				else if (awayIDStr === "AVG")
					var homeTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + asterisk + ' defeated Average ' + awayScore + '   ' + asterisk + asteriskExplanation;
				else
					var homeTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + asterisk + ' defeated ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + '   ' + asterisk + asteriskExplanation;
				var awayWin = 0;
				var homeWin = 1;
				var awayLoss = 1;
				var homeLoss = 0;
				var awayTie = 0;
				var homeTie = 0;
			} else { // TIE
				var awayCount = 0;
				var homeCount = 0;
				if (awayIDStr === "AVG")
					var awayTitle = 'Week #' + thisWeek + ': Average ' + awayScore + ' tied ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore;
				else if (homeIDStr === "AVG")
					var awayTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + ' tied Average ' + homeScore;
				else
					var awayTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore + ' tied ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore;
				if (homeIDStr === "AVG")
					var homeTitle = 'Week #' + thisWeek + ': Average ' + homeScore + ' tied ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore;
				else if (awayIDStr === "AVG")
					var homeTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + ' tied Average ' + awayScore;
				else
					var homeTitle = 'Week #' + thisWeek + ': ' + franchiseDatabase["fid_" + homeIDStr].name + ' ' + homeScore + ' tied ' + franchiseDatabase["fid_" + awayIDStr].name + ' ' + awayScore;
				var awayWin = 0;
				var homeWin = 0;
				var awayLoss = 0;
				var homeLoss = 0;
				var awayTie = 1;
				var homeTie = 1;
			}

			if (awayIDStr !== "AVG" && homeIDStr !== "AVG") {
				if (reportHTH_ar[homeID][awayID].r === "*") {
					reportHTH_ar[homeID][awayID].r = homeResult;
					reportHTH_ar[homeID][awayID].count = homeCount;
					reportHTH_ar[homeID][awayID].gp = 1;
					reportHTH_ar[homeID][awayID].title = homeTitle;
					reportHTH_ar[homeID][awayID].w = homeWin;
					reportHTH_ar[homeID][awayID].l = homeLoss;
					reportHTH_ar[homeID][awayID].t = homeTie;
					reportHTH_ar[homeID][awayID].pf = homeScore;
					reportHTH_ar[homeID][awayID].tooltip = ' ' + homeTitle + ' ';
					reportHTH_ar[awayID][homeID].r = awayResult;
					reportHTH_ar[awayID][homeID].count = awayCount;
					reportHTH_ar[awayID][homeID].gp = 1;
					reportHTH_ar[awayID][homeID].title = awayTitle;
					reportHTH_ar[awayID][homeID].w = awayWin;
					reportHTH_ar[awayID][homeID].l = awayLoss;
					reportHTH_ar[awayID][homeID].t = awayTie;
					reportHTH_ar[awayID][homeID].pf = awayScore;
					reportHTH_ar[awayID][homeID].tooltip = ' ' + awayTitle + ' ';
				} else {
					reportHTH_ar[homeID][awayID].r += ',' + homeResult;
					reportHTH_ar[homeID][awayID].count += homeCount;
					reportHTH_ar[homeID][awayID].gp += 1;
					reportHTH_ar[homeID][awayID].title += '\n' + homeTitle;
					reportHTH_ar[homeID][awayID].w += homeWin;
					reportHTH_ar[homeID][awayID].l += homeLoss;
					reportHTH_ar[homeID][awayID].t += homeTie;
					reportHTH_ar[homeID][awayID].pf += homeScore;
					reportHTH_ar[homeID][awayID].tooltip += '<br /> ' + homeTitle + ' ';
					reportHTH_ar[awayID][homeID].r += ',' + awayResult;
					reportHTH_ar[awayID][homeID].count += awayCount;
					reportHTH_ar[awayID][homeID].gp += 1;
					reportHTH_ar[awayID][homeID].title += '\n' + awayTitle;
					reportHTH_ar[awayID][homeID].w += awayWin;
					reportHTH_ar[awayID][homeID].l += awayLoss;
					reportHTH_ar[awayID][homeID].t += awayTie;
					reportHTH_ar[awayID][homeID].pf += awayScore;
					reportHTH_ar[awayID][homeID].tooltip += '<br /> ' + awayTitle + ' ';
				}
			}
		} //END IF !SkipMatchup
		skipMatchup = false;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////              REPORT ALL PLAY RESULTS             ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function reportAllPlayResults() {
	for (var fid_key in franchiseDatabase) {
		if (franchiseDatabase.hasOwnProperty(fid_key) && fid_key !== "fid_0000") {
			var fid = franchiseDatabase[fid_key].id;
			if (reportMatchupFid_ar.hasOwnProperty(fid)) {
				if (!reportMatchupFid_ar[fid].hasOwnProperty("all_play")) reportMatchupFid_ar[fid].all_play = [];
				if (!reportMatchupFid_ar[fid].hasOwnProperty("all_play_adj")) reportMatchupFid_ar[fid].all_play_adj = [];
				reportMatchupFid_ar[fid].all_play.total = ({
					"gp": 0,
					"w": 0,
					"l": 0,
					"t": 0
				});
				reportMatchupFid_ar[fid].all_play_adj.total = ({
					"gp": 0,
					"w": 0,
					"l": 0,
					"t": 0
				});
				for (var i = startWeek; i <= completedWeek; i++) {
					for (var fid_key2 in franchiseDatabase) {
						if (franchiseDatabase.hasOwnProperty(fid_key2) && fid_key2 !== "fid_0000") {
							var fid2 = franchiseDatabase[fid_key2].id;
							if (fid !== fid2) {
								if (!reportMatchupFid_ar[fid].all_play.hasOwnProperty("w_" + i)) reportMatchupFid_ar[fid].all_play["w_" + i] = ({
									"gp": 0,
									"w": 0,
									"l": 0,
									"t": 0
								});
								reportMatchupFid_ar[fid].all_play.total.gp++;
								reportMatchupFid_ar[fid].all_play["w_" + i].gp++;
								if (reportScoresFid_ar[fid]["w_" + i] > reportScoresFid_ar[fid2]["w_" + i]) {
									reportMatchupFid_ar[fid].all_play.total.w++;
									reportMatchupFid_ar[fid].all_play["w_" + i].w++;
								} else if (reportScoresFid_ar[fid]["w_" + i] < reportScoresFid_ar[fid2]["w_" + i]) {
									reportMatchupFid_ar[fid].all_play.total.l++;
									reportMatchupFid_ar[fid].all_play["w_" + i].l++;
								} else {
									reportMatchupFid_ar[fid].all_play.total.t++;
									reportMatchupFid_ar[fid].all_play["w_" + i].t++;
								}
								//do the same for adjusted scores
								if (!reportMatchupFid_ar[fid].all_play_adj.hasOwnProperty("w_" + i)) reportMatchupFid_ar[fid].all_play_adj["w_" + i] = ({
									"gp": 0,
									"w": 0,
									"l": 0,
									"t": 0
								});
								reportMatchupFid_ar[fid].all_play_adj.total.gp++;
								reportMatchupFid_ar[fid].all_play_adj["w_" + i].gp++;
								if (reportScoresAdjFid_ar[fid]["w_" + i] > reportScoresAdjFid_ar[fid2]["w_" + i]) {
									reportMatchupFid_ar[fid].all_play_adj.total.w++;
									reportMatchupFid_ar[fid].all_play_adj["w_" + i].w++;
								} else if (reportScoresAdjFid_ar[fid]["w_" + i] < reportScoresAdjFid_ar[fid2]["w_" + i]) {
									reportMatchupFid_ar[fid].all_play_adj.total.l++;
									reportMatchupFid_ar[fid].all_play_adj["w_" + i].l++;
								} else {
									reportMatchupFid_ar[fid].all_play_adj.total.t++;
									reportMatchupFid_ar[fid].all_play_adj["w_" + i].t++;
								}
							}
						}
					}
				}
			} else {
				//THERE MUST BE NO WEEKLY MATCHUPS SO SET UP ALL PLAY TO ZEROES; THIS CAN HAPPEN AT START OF SEASON OR PLAYOFF LEAGUES
				reportMatchupFid_ar[fid] = [];
				reportMatchupFid_ar[fid].all_play = [];
				reportMatchupFid_ar[fid].all_play_adj = [];
				reportMatchupFid_ar[fid].all_play.total = ({
					"gp": 0,
					"w": 0,
					"l": 0,
					"t": 0
				});
				reportMatchupFid_ar[fid].all_play_adj.total = ({
					"gp": 0,
					"w": 0,
					"l": 0,
					"t": 0
				});
				for (var i = startWeek; i <= completedWeek; i++) {
					for (var fid_key2 in franchiseDatabase) {
						if (franchiseDatabase.hasOwnProperty(fid_key2) && fid_key2 !== "fid_0000") {
							var fid2 = franchiseDatabase[fid_key2].id;
							if (fid !== fid2) {
								reportMatchupFid_ar[fid].all_play["w_" + i] = ({
									"gp": 0,
									"w": 0,
									"l": 0,
									"t": 0
								});
							}
						}
					}
				}
			}
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////         BACKGROUND REFRESH FIVE MIN CACHE          ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


function checkFiveMinuteBucketAndRun() {
	// compute + write bucket (also syncs across tabs via storage)
	const bucket = getCacheFiveMinutes();

	// only run once per bucket per tab session (avoids repeated runs if called often)
	const last = Number(sessionStorage.getItem("lastFiveMinRunBucket") || 0);
	if (Number.isFinite(last) && last === bucket) return;

	sessionStorage.setItem("lastFiveMinRunBucket", String(bucket));

	try {
		doFiveMinuteCache(bucket); // snapshot bucket
	} catch (e) {
		console.warn("doFiveMinuteCache() failed:", e);
	}
}

function startBackgroundTimersOnce() {
	if (backgroundTimersStarted) return;
	if (liveScoringWeek === AllGamesCount) return;
	backgroundTimersStarted = true;

	// run immediately once (optional)
	checkFiveMinuteBucketAndRun();

	// check every 2 minutes
	setInterval(checkFiveMinuteBucketAndRun, 2 * 60 * 1000);
}



//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  PARSE JSON HELPER               ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function safeJSONParse(str, onError) {
	try {
		return JSON.parse(str);
	} catch (e) {
		if (onError) onError(e);
		return null;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////       CLEAR AND RESPONSE CACHE FUNCTIONS         ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function cacheResponse(cacheKey) {
	const val = localStorage.getItem(cacheKey);
	return val === null ? false : val;
}

function clearCacheOtherLeague() {
	var arr = [];
	var yearStr = String(year);

	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (!key) continue;

		// Matches: playerDB_2024 or playerDB_2024_updatedAt
		var match = key.match(/^playerDB_(20\d{2})(?:_updatedAt)?$/);
		if (match) {
			var keyYear = match[1];
			if (keyYear !== yearStr) {
				arr.push(key);
			}
			continue;
		}
	}
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (!key || !key.startsWith("cache_")) continue;
		if (key.indexOf("weather") !== -1) {
			arr.push(key);
			continue;
		}
		var yearMatch = key.match(/_(20\d{2})_/);
		if (yearMatch) {
			var keyYear = yearMatch[1];
			if (keyYear !== yearStr) {
				arr.push(key);
				continue;
			}
		}
		var isGlobalKeep =
			key.indexOf("nflSchedule") !== -1 ||
			key.indexOf("injuries") !== -1 ||
			key.indexOf("nflByeWeeks") !== -1 ||
			key.indexOf("newsBreaker") !== -1 ||
			key.indexOf("myLeagues") !== -1 ||
			key.indexOf("topStarters") !== -1;

		if (!isGlobalKeep && key.indexOf(league_id) === -1) {
			arr.push(key);
		}
	}
	for (var j = 0; j < arr.length; j++) {
		localStorage.removeItem(arr[j]);
	}
}

function clearCacheKey(thisKey) {
	var arr = [];
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key && key.substring(0, thisKey.length) === thisKey) {
			arr.push(key);
		}
	}
	for (var j = 0; j < arr.length; j++) {
		localStorage.removeItem(arr[j]);
	}
}

function clearLocalStorageWhenIndexedDBOn() {
	if (!usingIndexedDB) return;

	const yearStr = String(year);
	const leagueStr = String(league_id);

	for (let i = localStorage.length - 1; i >= 0; i--) {
		const key = localStorage.key(i);
		if (!key) continue;

		// Delete all weeklyResults LS keys
		if (key.startsWith("cache_weeklyResults-")) {
			localStorage.removeItem(key);
			continue;
		}

		// Delete roster LS keys for this league/year
		if (key.startsWith("cache_roster_" + yearStr + "_" + leagueStr)) {
			localStorage.removeItem(key);
			continue;
		}

		// Delete transactions LS keys for this league/year
		if (key.startsWith("cache_transactions_" + yearStr + "_" + leagueStr)) {
			localStorage.removeItem(key);
			continue;
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////      SETUP INDEXED DB VARIABLE AND FUNCTIONS     ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

if (reportDbSupported === undefined) try {
	if (!('indexedDB' in window)) var reportDbSupported = false;
	else var reportDbSupported = true;
} catch (er) {
	var reportDbSupported = false;
}
if (reportDbRan === undefined) var reportDbRan = false;
if (reportDbArrayFilled === undefined) var reportDbArrayFilled = false;
if (reportDb_ar === undefined) var reportDb_ar = [];
if (dbIntervalArray === undefined) var dbIntervalArray;
if (dbIntervalArray_count === undefined) var dbIntervalArray_count = 0;
if (dbIntervalLoaded === undefined) var dbIntervalLoaded;
if (dbIntervalLoaded_count === undefined) var dbIntervalLoaded_count = 0;
if (dbStepCount === undefined) var dbStepCount = 0;
if (clearLocalCacheAppended === undefined) var clearLocalCacheAppended = false;
if (localStorageIsDefault === undefined) var localStorageIsDefault = true;
if (dbDisabled === undefined) var dbDisabled = localStorageIsDefault;
if (localStorage.getItem("dbDisabled_" + year + "_" + league_id) !== null) dbDisabled = parseInt(localStorage.getItem("dbDisabled_" + year + "_" + league_id), 10);
if (forceIndexedDB === undefined) var forceIndexedDB = false;
if (leagueAttributes.Franchises >= 30 && leagueAttributes.MinStarters >= 30) forceIndexedDB = true;
var usingIndexedDB = !!(reportDbSupported && (!dbDisabled || forceIndexedDB));

function checkDbFullyLoaded() {
	dbIntervalLoaded_count++;
	if (dbStepCount >= 3) {
		clearInterval(dbIntervalLoaded);
		dbIntervalArray = setInterval(checkDbArrayFilled, 100);
		fillDbArray(db);
	}
	if (dbIntervalLoaded_count > 50) {
		clearInterval(dbIntervalLoaded);
		//console.log("Stopped trying to access Indexed Database after 5 seconds");
	}
}

function fillDbArray(db) {
	let tx = db.transaction(['globals'], 'readonly');
	let store = tx.objectStore('globals');
	let cursorRequest = store.openCursor();
	cursorRequest.onsuccess = e => {
		let cursor = e.target.result;
		if (cursor) {
			reportDb_ar[cursor.value.key] = cursor.value;
			cursor.continue();
		} else {
			reportDbArrayFilled = true;
		}
	}
}
async function checkDbArrayFilled() {
	dbIntervalArray_count++;
	if (reportDbArrayFilled) {
		clearInterval(dbIntervalArray);
		lsm_get_stats(true);
		if (typeof reportDailyApi_ran !== "undefined" && !reportDailyApi_ran) {
			doDailyCache();
		}
		if (typeof reportFiveMinuteApi_ran !== "undefined" && !reportFiveMinuteApi_ran) {
			doFiveMinuteCache();
		}
	}
	if (dbIntervalArray_count > 50) {
		clearInterval(dbIntervalArray);
	}
}

function addGlobal(db, key, which) {
	// Start a database transaction and get the globals object store
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');

	// Add league key for Five Minute apps if they don't exist
	if (which === 0) store.add({
		key: key,
		timestamp: 0,
		value: ''
	});
	else if (which === 1) store.add({
		key: key,
		timestamp: 0,
		ar: []
	});

	// Wait for the database transaction to complete
	tx.oncomplete = function () {
		dbStepCount++;
	} //SUCCESSFULLY ADDED
	tx.onerror = function (event) {
		dbStepCount++;
	} //FAILED AS IT MOST LIKELY EXISTS
}

function addLeagueDaily(db) {
	// Start a database transaction and get the globals object store
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');

	// Add league key for Daily apps if they don't exist
	store.add({
		key: "lid_" + year + "_" + league_id + "_daily",
		timestamp: 0,
		ar: ({
			"weeklyResults": []
		})
	});

	// Wait for the database transaction to complete
	tx.oncomplete = function () {
		dbStepCount++;
	} //SUCCESSFULLY ADDED
	tx.onerror = function (event) {
		dbStepCount++;
	} //FAILED AS IT MOST LIKELY EXISTS
}

function addLeagueFiveMinute(db) {
	// Start a database transaction and get the globals object store
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');

	// Add league key for Five Minute apps if they don't exist
	store.add({
		key: "lid_" + year + "_" + league_id + "_fiveMinute",
		timestamp: 0,
		ar: ({
			"rosters": '',
			"transactions": ''
		})
	});

	// Wait for the database transaction to complete
	tx.oncomplete = function () {
		dbStepCount++;
	} //SUCCESSFULLY ADDED
	tx.onerror = function (event) {
		dbStepCount++;
	} //FAILED AS IT MOST LIKELY EXISTS
}

function addLeagueOther(db) {
	// Start a database transaction and get the globals object store
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');

	store.add({
		key: "lid_" + year + "_" + league_id + "_playerScores",
		timestamp: 0,
		"playerScores": []
	});

	// Wait for the database transaction to complete
	tx.oncomplete = function () {
		dbStepCount++;
	} //SUCCESSFULLY ADDED
	tx.onerror = function (event) {
		dbStepCount++;
	} //FAILED AS IT MOST LIKELY EXISTS
}

function resetDb(allCached) {
	updateDbTimestamp(db, "lid_" + year + "_" + league_id + "_fiveMinute", 0);
	if (allCached) {
		updateDbTimestamp(db, "lid_" + year + "_" + league_id + "_daily", 0);
		updateDbTimestamp(db, "lid_" + year + "_" + league_id + "_playerScores", 0);
	}
	location.reload(true);
}

function deleteItems() {
	localStorage.clear();
	alert("Click OK to load latest API cached files");
	location.reload(true);
}

function dbDisable() {
	localStorage.setItem("dbDisabled_" + year + "_" + league_id, 1);
	alert("You have disabled IndexedDB caching and enabled Local Storage caching.\n\nWhile Local Storage is faster it has limited storage capacity.\n\nThis is only recommended for MFL users that have leagues on different mfl servers.\n\nIf apps fail to load re-enable IndexedDb.");
	location.reload(true);
}

function dbEnable() {
	usingIndexedDB = true;
	clearLocalStorageWhenIndexedDBOn();
	localStorage.setItem("dbDisabled_" + year + "_" + league_id, 0);
	alert("You have enabled IndexedDB caching");
	location.reload(true);
}

function updateDbTimestamp(db, key, timestamp) {
	// If IndexedDB isn't available or connection not ready, bail
	if (!db || typeof db.transaction !== "function") {
		return;
	}
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');

	let req = store.get(key);

	req.onsuccess = function (e) {
		let obj = e.target.result;
		// If the record doesn't exist yet, create a minimal one
		if (!obj) {
			obj = {
				key: key,
				timestamp: timestamp
			};
		} else {
			obj.timestamp = timestamp;
		}

		store.put(obj);
	};

	req.onerror = function (e) {
		console.warn('[MFLCache] updateDbTimestamp get error for key', key, e);
	};

	tx.onerror = function (e) {
		console.warn('[MFLCache] updateDbTimestamp tx error', e);
	};
}

function updateDbLocalStr(db, key, field, value) {
	if (!db) return;
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');

	let req = store.get(key);
	req.onsuccess = function (e) {
		let obj = e.target.result;

		// If missing, create a shell record with an "ar" object
		if (!obj) {
			obj = {
				key: key,
				timestamp: 0,
				ar: {}
			};
		}

		if (!obj.ar || typeof obj.ar !== 'object') {
			obj.ar = {};
		}

		obj.ar[field] = value;
		store.put(obj);
	};

	req.onerror = function (e) {
		console.warn('[MFLCache] updateDbLocalStr get error for key', key, e);
	};

	tx.onerror = function (e) {
		console.warn('[MFLCache] updateDbLocalStr tx error', e);
	};
}

function updateDbGlobalStr(db, key, value) {
	if (!db) return;
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');

	let req = store.get(key);
	req.onsuccess = function (e) {
		let obj = e.target.result;

		// Create the record if it doesn't exist
		if (!obj) {
			obj = {
				key: key,
				timestamp: 0,
				value: value
			};
		} else {
			obj.value = value;
		}

		store.put(obj);
	};

	req.onerror = function (e) {
		console.warn('[MFLCache] updateDbGlobalStr get error for key', key, e);
	};

	tx.onerror = function (e) {
		console.warn('[MFLCache] updateDbGlobalStr tx error', e);
	};
}

function updateDbGlobalArray(db, key, week, value) {
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');
	store.get(key).onsuccess = function (e) {
		var obj = e.target.result;
		obj.ar["w_" + week] = value;
		store.put(obj);
	};
}

function updateDbLocalArray(db, key, key2, week, value) {
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');
	store.get(key).onsuccess = function (e) {
		var obj = e.target.result;
		obj.ar[key2]["w_" + week] = value;
		store.put(obj);
	};
}

function updateDbOtherArray(db, key, key2, week, value) {
	let tx = db.transaction(['globals'], 'readwrite');
	let store = tx.objectStore('globals');
	store.get(key).onsuccess = function (e) {
		var obj = e.target.result;
		obj[key2]["w_" + week] = value;
		store.put(obj);
	};
}

function updateMobileMenu() {
	//only applicable if mobile menu is installed
	jQuery('.myfantasyleague_menuMobile li#cache-addon>a').append('<span class="menu_arrow"></span>');
	jQuery('.myfantasyleague_menuMobile li#cache-addon ul').hide();

	// CLICK TO EXPAND AND COLLAPSE OUTER LI
	jQuery('#cache-addon > a').on('click', function () {
		var $first_level_uls = $('#cache-addon > ul');
		var $second_level_uls = $('#cache-addon > ul > li > ul');
		var $this_ul = $(this).parent('li').children('ul');
		//SLIDE EVERYTHING UP
		$first_level_uls.each(function () {
			$(this).slideUp();
		});
		$second_level_uls.each(function () {
			$(this).slideUp();
		});
		//APPLY CURRENT CLICK
		if ($this_ul.hasClass('thisExpanded')) {
			$this_ul.slideUp().removeClass("thisExpanded");
		} else {
			$this_ul.slideDown().addClass("thisExpanded");
		}
		//REMOVE LAST CLICKED FROM ALL UL'S THEN ADD BACK TO CURRENT UL
		$first_level_uls.removeClass("lastClicked");
		$second_level_uls.removeClass("lastClicked");
		$this_ul.addClass("lastClicked");
		//REMOVED EXPANDED CLASS FROM ALL UL'S EXCEPT FOR CURRENT UL
		$first_level_uls.each(function () {
			if (!$(this).hasClass("lastClicked")) $(this).removeClass("thisExpanded");
		});
		$second_level_uls.each(function () {
			$(this).removeClass("thisExpanded");
		});
		//ADD CLASS FOR ARROW RIGHT AND DOWN
		$('ul').parent('li').removeClass('arrow-down');
		$('ul.thisExpanded').parent('li').addClass('arrow-down');
		$('li').removeClass('sub-arrow-down');
	});

	// CLICK TO EXPAND AND COLLAPSE INNER LI
	jQuery('#cache-addon > ul > li > a').on('click', function () {
		var $second_level_uls = $('#cache-addon > ul > li > ul');
		var $this_ul = $(this).parent('li').children('ul');
		//SLIDE EVERYTHING UP
		$second_level_uls.each(function () {
			$(this).slideUp();
		});
		if ($this_ul.hasClass('thisExpanded')) {
			$this_ul.slideUp().removeClass("thisExpanded");
		} else {
			$this_ul.slideDown().addClass("thisExpanded");
		}
		//REMOVE LAST CLICKED FROM ALL UL'S THEN ADD BACK TO CURRENT UL
		$second_level_uls.removeClass("lastClicked");
		$this_ul.addClass("lastClicked");
		//REMOVED EXPANDED CLASS FROM ALL UL'S EXCEPT FOR CURRENT UL
		$second_level_uls.each(function () {
			if (!$(this).hasClass("lastClicked")) $(this).removeClass("thisExpanded");
		});
		//ADD CLASS FOR ARROW RIGHT AND DOWN
		$('ul').parent('li').removeClass('sub-arrow-down');
		$('ul.thisExpanded').parent('li').addClass('sub-arrow-down');
	});
}
if (usingIndexedDB) {
	const parentUl_1 = document.querySelector('.mm-help ul:first-of-type');
	if (!reportDbRan) {
		reportDbRan = true;
		if (forceIndexedDB) {
			const newHTML_1 = `<li id="cache-addon" class="has-sub sub-default"><a>Manage Cache</a><b aria-haspopup="true" aria-controls="p101"></b><input id="sub101" type="checkbox"><label for="sub101"><span></span></label><ul id="p201"><li><a class="no-sub" onclick="resetDb(false)">Recent Items Only (Recommended)</a></li><li><a class="no-sub" onclick="resetDb(true)">All Cached Items</a></li></ul></li>`;
			parentUl_1.innerHTML = newHTML_1 + parentUl_1.innerHTML;
		} else {
			const newHTML_1 = `<li id="cache-addon" class="has-sub sub-default"><a>Manage Cache</a><b aria-haspopup="true" aria-controls="p101"></b><input id="sub101" type="checkbox"><label for="sub101"><span></span></label><ul id="p201"><li><a class="no-sub" onclick="resetDb(false)">Recent Items Only (Recommended)</a></li><li><a class="no-sub" onclick="resetDb(true)">All Cached Items</a></li><li><a class="no-sub" onclick="dbDisable()">Disable IndexedDB</a></li></ul></li>`;
			parentUl_1.innerHTML = newHTML_1 + parentUl_1.innerHTML;
			updateMobileMenu();
		}
		var db;
		let dbReq = indexedDB.open('mflscripts', 1);
		dbReq.onupgradeneeded = function (event) {

			db = event.target.result;
			let globals = db.createObjectStore('globals', {
				keyPath: "key"
			});
		}
		dbReq.onsuccess = function (event) {
			db = event.target.result;
			addLeagueDaily(db);
			addLeagueFiveMinute(db);
			addLeagueOther(db);
		}
		dbReq.onerror = function (event) {
			//console.log('error opening database ' + event.target.errorCode);
		}
		dbIntervalLoaded = setInterval(checkDbFullyLoaded, 100);
	}
} else {
	lsm_get_stats(true);
	if (typeof reportDailyApi_ran !== "undefined")
		if (!reportDailyApi_ran) doDailyCache();
	if (typeof reportFiveMinuteApi_ran !== "undefined")
		if (!reportFiveMinuteApi_ran) doFiveMinuteCache();
	const parentUl_1 = document.querySelector('.mm-help ul:first-of-type');
	if (!clearLocalCacheAppended) {
		clearLocalCacheAppended = true;
		if (reportDbSupported) {
			const newHTML_1 = `<li id="cache-addon" class="has-sub sub-default"><a>Manage Cache</a><b aria-haspopup="true" aria-controls="p101"></b><input id="sub101" type="checkbox"><label for="sub101"><span></span></label><ul id="p201"><li><a class="no-sub" onclick="deleteItems()">Clear Local Storage</a></li><li><a class="no-sub" onclick="dbEnable()">Enable IndexedDB</a></li></ul></li>`;
			parentUl_1.innerHTML = newHTML_1 + parentUl_1.innerHTML;
			updateMobileMenu();
		} else {
			const newHTML_1 = `<li><a onclick="deleteItems()">Clear Local Storage</a></li>`;
			parentUl_1.innerHTML = newHTML_1 + parentUl_1.innerHTML;
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                HIDE IF OFFSEASON                 ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function toEpochSeconds(input) {
	if (input instanceof Date) {
		const t = input.getTime();
		return Number.isFinite(t) ? Math.floor(t / 1000) : null;
	}
	if (typeof input === "number") {
		return input > 1e12 ? Math.floor(input / 1000) : Math.floor(input); // ms -> sec
	}
	if (typeof input === "string" && input.trim()) {
		const n = Number(input);
		if (Number.isFinite(n)) return n > 1e12 ? Math.floor(n / 1000) : Math.floor(n);
	}
	return null;
}
const toEpochSecondsLocal = (y, m, d) => Math.floor(new Date(y, m - 1, d).getTime() / 1000);

function parseUserDate(input) {
	const numOrDate = toEpochSeconds(input);
	if (Number.isFinite(numOrDate)) return numOrDate;
	if (!input || typeof input !== "string") return null;
	const s = input.trim();
	let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (m) {
		const [, Y, M, D] = m;
		return toEpochSecondsLocal(+Y, +M, +D);
	}
	m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (m) {
		const [, MM, DD, YYYY] = m;
		return toEpochSecondsLocal(+YYYY, +MM, +DD);
	}
	const t = new Date(s).getTime();
	return Number.isFinite(t) ? Math.floor(t / 1000) : null;
}
var setCustomDates = (typeof setCustomDates !== "undefined") ? !!setCustomDates : false;
var nflStartWk = (typeof nflStartWk !== "undefined") ? nflStartWk : undefined;
var nflEndWk = (typeof nflEndWk !== "undefined") ? nflEndWk : undefined;
var currentServerTimeSec = (function (v) {
	if (typeof v === "undefined") return Math.floor(Date.now() / 1000);
	const s = toEpochSeconds(v);
	return Number.isFinite(s) ? s : Math.floor(Date.now() / 1000);
})(typeof currentServerTime !== "undefined" ? currentServerTime : undefined);
let seasonStartSec = null;
let seasonEndSec = null;
if (setCustomDates) {
	seasonStartSec = parseUserDate(nflStartWk);
	seasonEndSec = parseUserDate(nflEndWk);
}
if (!Number.isFinite(seasonStartSec) || !Number.isFinite(seasonEndSec)) {
	const seasonByYear = {
		2021: ["2021-08-04", "2022-02-14"],
		2022: ["2022-08-03", "2023-02-13"],
		2023: ["2023-08-02", "2024-02-12"],
		2024: ["2024-08-07", "2025-02-10"],
		2025: ["2025-07-30", "2026-02-09"],
	};

	if (typeof year !== "undefined" && seasonByYear[year]) {
		const [s, e] = seasonByYear[year];
		seasonStartSec = parseUserDate(s);
		seasonEndSec = parseUserDate(e);
	}
}
var is_offseason = true;
if (Number.isFinite(seasonStartSec) && Number.isFinite(seasonEndSec)) {
	if (seasonStartSec > seasonEndSec) {
		[seasonStartSec, seasonEndSec] = [seasonEndSec, seasonStartSec]; // swap if inverted
	}
	if (currentServerTimeSec >= seasonStartSec && currentServerTimeSec <= seasonEndSec) {
		is_offseason = false;
	}
}
var hide_extra = (typeof hide_extra !== "undefined") ? hide_extra : "";
if (is_offseason && hide_extra && typeof window.jQuery === "function") {
	jQuery(function ($) {
		$(hide_extra).hide().parent('.mobile-wrap').hide();
	});
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                      SET REM                     ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

if (typeof useREM === 'undefined') var useREM = false;

function calcREM(px) {
	if (!isNaN(px)) {
		var remInPx = parseFloat($("html").css("font-size"));
		return (parseFloat(px) / remInPx).toString() + "rem";
	}
}

function calcREM2(px) {
	if (!isNaN(px)) {
		var remInPx = parseFloat($("html").css("font-size"));
		return (parseFloat(px) / remInPx).toString();
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////                  HISTORY SCRIPT                  ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var historicalLinkFormData;
var createHistoricalLink;
var ajaxRan = false;
var historicalLinkDate = new Date();
var historicalLinkYear = historicalLinkDate.getFullYear();
var historicalLinkLastSeason = $(`li.mm-myacct li a[href*="home/${league_id}"]`).attr('href')

$(document).on('submit', 'form[action*="copy_league"]', function () {
	if (ajaxRan) return true; // after initial run and ajax success to get form string - then allow form to submit to upgrade to new season
	var urlGET = baseURLDynamic + "/" + year + "/csetup?L=" + league_id + "&C=HMPGMSG&SEQNO=3000&PRINTER=1";
	$.ajax({
		url: urlGET,
		type: "GET",
		dataType: 'html',
		xhrFields: {
			withCredentials: true
		},
		success: function (data) {
			var historicalURL = $(data).find('#MSG').val();
			if (historicalURL.length > 0) {
				var historicalLinkFormData = historicalURL;
				var createHistoricalLink = baseURLDynamic + "/" + (year + 1) + "/options?" + historicalLinkFormData + "&SAVE=Save+Linked+Franchises";
				localStorage.setItem("historicalLink_" + league_id, createHistoricalLink);
				ajaxRan = true;
				$('form[action*="copy_league"]').submit(); // rerun form submit so we can update to next season
			} else {
				$.ajax({
					type: "GET",
					url: baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=170&PRINTER=1',
					xhrFields: {
						withCredentials: true
					},
					success: function (Data) {
						thisFormExists = $(Data).find('form[action=options]').html();
						if (!$.trim(thisFormExists)) {
							$.ajax({
								type: "GET",
								url: historicalLinkLastSeason + '&PRINTER=1',
								xhrFields: {
									withCredentials: true
								},
								success: function (Data) {
									thisFormExists = $(Data).find('form[action=options]').html();
									if (!$.trim(thisFormExists)) {
										// Form does not exist - exit and continue upgrade
										ajaxRan = true;
										$('form[action*="copy_league"]').submit(); // rerun form submit so we can update to next season
									} else {
										//console.log("FORM EXIST")
										historicalLinkFormData = $(Data).find('form[action=options]').serialize();
										createHistoricalLink = baseURLDynamic + "/" + historicalLinkYear + "/options?" + historicalLinkFormData + "&SAVE=Save+Linked+Franchises";
										localStorage.setItem("historicalLink_" + league_id, createHistoricalLink);
										ajaxRan = true;
										$('form[action*="copy_league"]').submit(); // rerun form submit so we can update to next season
									}
								},
								error: function (xhr) {
									ajaxRan = true;
									$('form[action*="copy_league"]').submit(); // rerun form submit so we can update to next season
								}
							});
						} else {
							//console.log("FORM EXIST")
							historicalLinkFormData = $(Data).find('form[action=options]').serialize();
							createHistoricalLink = baseURLDynamic + "/" + historicalLinkYear + "/options?" + historicalLinkFormData + "&SAVE=Save+Linked+Franchises";
							localStorage.setItem("historicalLink_" + league_id, createHistoricalLink);
							ajaxRan = true;
							$('form[action*="copy_league"]').submit(); // rerun form submit so we can update to next season
						}
					},
					error: function (xhr) {
						ajaxRan = true;
						$('form[action*="copy_league"]').submit(); // rerun form submit so we can update to next season
					}
				});
			}
		},
		error: function (xhr) {
			ajaxRan = true;
			$('form[action*="copy_league"]').submit(); // rerun form submit so we can update to next season
		}
	});
	if (!ajaxRan) return false; // on initial form submission prevent upgrade to next season - allow ajax to run to get form string to build url
});
$(document).on('submit', '#body_options_170 form[action="options"]', function () {
	if (ajaxRan) return true; // after initial run and ajax success save form string - then allow form to submit
	var historicalLinkFormData = $('#body_options_170 form[action=options]').serialize();
	var hpm_txt = historicalLinkFormData + "&SAVE=Save+Linked+Franchises";
	var hpm_name = "#3000 Historical Link Form";
	var urlPOST = baseURLDynamic + "/" + year + "/message?LEAGUE_ID=" + league_id + "&NAME=message3000";
	$.ajax({
		url: urlPOST,
		xhrFields: {
			withCredentials: true
		},
		data: {
			MSG: hpm_txt,
			LABEL: hpm_name
		},
		cache: false,
		type: "POST",
		success: function (response) {
			ajaxRan = true;
			$('#body_options_170 form[action="options"] input').trigger("click"); // rerun form submit so we can update to next season
		},
		error: function (xhr) {
			ajaxRan = true;
			$('#body_options_170 form[action="options"] input').trigger("click"); // rerun form submit so we can update to next season
		}
	});
	if (!ajaxRan) return false; // on initial form submission prevent form submission
});
if (localStorage.hasOwnProperty("historicalLink_" + league_id)) {
	url = localStorage.getItem("historicalLink_" + league_id);
	$.ajax({
		type: "POST",
		url: url,
		xhrFields: {
			withCredentials: true
		},
		success: function (Data) {
			localStorage.removeItem("historicalLink_" + league_id); // remove local storage item once ajax has posted form
		},
		error: function (xhr) {
			localStorage.removeItem("historicalLink_" + league_id); // remove local storage item once ajax has posted form
		}
	});
}
const currentHistoryTime = currentServerTime * 1000;

async function runHistoryUpdateHPM() {
	try {
		const updateHistoryurl = `${baseURLDynamic}/${year}/message?LEAGUE_ID=${league_id}&NAME=message801&MSG=${encodeURIComponent(historyUpdateMSG)}&LABEL=${encodeURIComponent('#801')}+History+Update&IN_HEADER=Yes`;
		await fetch(updateHistoryurl, {
			method: 'POST',
		});
		//console.log('Updated History and Player Current Week Files');
		//runHistoryDeleteHPM();
	} catch (error) {
		console.error('Error occurred during the requests:', error);
	}
}

historyUpdateMSG = `<script>
let historyHPMupdateNotloadedV2 = false;
let updateHistoryTime;
const HScurrentDate = new Date();
const HScurrentMonth = HScurrentDate.getMonth();
if ([0, 1, 7, 8, 9, 10, 11].includes(HScurrentMonth)) {
	fetch('https://mflscripts.com/mfl-apps/history/integrated/' + year + '/leagues/' + league_id + '/hsTime.json')
		.then(response => response.json())
		.then(data => {
if (typeof currentHistoryTime === "undefined") {
    var currentHistoryTime =
        (typeof currentServerTime !== "undefined" && currentServerTime != null)
            ? Number(currentServerTime) * 1000
            : Date.now();
}
			updateHistoryTime = data.updateHistoryTime;
			const historyTimeDiff = (currentHistoryTime - updateHistoryTime) / (1000 * 60);
			//console.log("History Update Time Countdown to 1440 minutes: " + historyTimeDiff + " min. have passed");
			if (historyTimeDiff >= 1440) {
				const HSiframe = document.createElement("iframe");
				HSiframe.src = 'https://mflscripts.com/mfl-apps/history/integrated/createPlayerHistory.php?year=' + year + '&league_id=' + league_id + '&full_history=false';
				HSiframe.style.display = "none";
				document.body.appendChild(HSiframe);
				const HSiframe2 = document.createElement("iframe");
				HSiframe2.src = 'https://mflscripts.com/mfl-apps/history/integrated/createHistory.php?year=' + year + '&league_id=' + league_id + '&full_history=false';
				HSiframe2.style.display = "none";
				document.body.appendChild(HSiframe2);
				if (typeof hsSetTimestamp === 'function') {
					hsSetTimestamp();
				} else {
					window.addEventListener("load", () => {
						if (typeof hsSetTimestamp === 'function') hsSetTimestamp();
					});
				}
			}
		})
		.catch(error => {
			console.log("Error retrieving updateHistoryTime:", error);
			if (typeof hsSetTimestamp === 'function') {
				hsSetTimestamp();
			} else {
				window.addEventListener("load", () => {
					if (typeof hsSetTimestamp === 'function') hsSetTimestamp();
				});
			}
		});
}
</script>`;


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////              SWIPE ENABLE FUNCTION               ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function isSwipeEnabled() {
	if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
		return true; // Touch events are supported, swipe is likely enabled
	} else {
		return false; // Touch events are not supported, swipe is likely not enabled
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////             REPORT COLLAPSE FUNCTION             ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function doReportCustomCollapse() {
	try {
		if (document.getElementById("body_home") && location.href.indexOf("MODULE=MESSAGE") === -1 && location.href.indexOf("/message") === -1 && location.href.indexOf("SEQNO=") === -1) doCustomCollapseHPM();
	} catch (er) {}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////              FUNCTION FORMATMFLDATE              ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function formatMFLDate(date, format, utc) {
	var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	function ii(i, len) {
		var s = i + "";
		len = len || 2;
		while (s.length < len) s = "0" + s;
		return s;
	}
	var y = utc ? date.getUTCFullYear() : date.getFullYear();
	format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
	format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
	format = format.replace(/(^|[^\\])y/g, "$1" + y);

	var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
	format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
	format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
	format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
	format = format.replace(/(^|[^\\])M/g, "$1" + M);

	var d = utc ? date.getUTCDate() : date.getDate();
	format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
	format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
	format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
	format = format.replace(/(^|[^\\])d/g, "$1" + d);

	var H = utc ? date.getUTCHours() : date.getHours();
	format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
	format = format.replace(/(^|[^\\])H/g, "$1" + H);

	var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
	format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
	format = format.replace(/(^|[^\\])h/g, "$1" + h);

	var m = utc ? date.getUTCMinutes() : date.getMinutes();
	format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
	format = format.replace(/(^|[^\\])m/g, "$1" + m);

	var s = utc ? date.getUTCSeconds() : date.getSeconds();
	format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
	format = format.replace(/(^|[^\\])s/g, "$1" + s);

	var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
	format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
	f = Math.round(f / 10);
	format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
	f = Math.round(f / 10);
	format = format.replace(/(^|[^\\])f/g, "$1" + f);

	var T = H < 12 ? "AM" : "PM";
	format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
	format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

	var t = T.toLowerCase();
	format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
	format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

	var tz = -date.getTimezoneOffset();
	var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
	if (!utc) {
		tz = Math.abs(tz);
		var tzHrs = Math.floor(tz / 60);
		var tzMin = tz % 60;
		K += ii(tzHrs) + ":" + ii(tzMin);
	}
	format = format.replace(/(^|[^\\])K/g, "$1" + K);

	var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
	format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
	format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

	format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
	format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

	format = format.replace(/\\(.)/g, "$1");

	return format;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////             GETREPORTSNAMEICON FUNCTION          ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function getReportsNameIcon(fid, nameIconLogoAbbrev) {
	switch (nameIconLogoAbbrev) { // setup my html for the franchise name
		case 0:
			return franchiseDatabase["fid_" + fid].name;
			break;
		case 1:
			if (franchiseDatabase["fid_" + fid].icon !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].icon + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" />';
			else if (franchiseDatabase["fid_" + fid].logo !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].logo + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" />';
			else
				return franchiseDatabase["fid_" + fid].name;
			break;
		case 2:
			if (franchiseDatabase["fid_" + fid].logo !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].logo + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" />';
			else if (franchiseDatabase["fid_" + fid].icon !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].icon + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" />';
			else
				return franchiseDatabase["fid_" + fid].name;
			break;
		case 3:
			if (franchiseDatabase["fid_" + fid].abbrev !== "")
				return franchiseDatabase["fid_" + fid].abbrev;
			else
				return franchiseDatabase["fid_" + fid].name;
			break;
		case 4:
			if (franchiseDatabase["fid_" + fid].icon !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].icon + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" /> ' + franchiseDatabase["fid_" + fid].name;
			else if (franchiseDatabase["fid_" + fid].logo !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].logo + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" /> ' + franchiseDatabase["fid_" + fid].name;
			else
				return franchiseDatabase["fid_" + fid].name;
			break;
		case 5:
			if (franchiseDatabase["fid_" + fid].logo !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].logo + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" /> ' + franchiseDatabase["fid_" + fid].name;
			else if (franchiseDatabase["fid_" + fid].icon !== "")
				return '<img src="' + franchiseDatabase["fid_" + fid].icon + '" class="franchise-icon" alt="' + franchiseDatabase["fid_" + fid].name + '" /> ' + franchiseDatabase["fid_" + fid].name;
			else
				return franchiseDatabase["fid_" + fid].name;
			break;
		default:
			return franchiseDatabase["fid_" + fid].name;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////           SCOREADJUSTMENT HTML FUNCTION          ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function scoreAdjustmentHtml(which) {
	try {
		if (!enableScoreAdjustment_ar.hasOwnProperty("which")) return '';
		var rowCount = 0;
		var weekCount = -1;
		var html = '';
		for (var i = 0; i < global_scoreAdjustment.length; i++) {
			if (weekCount !== -1 && weekCount !== global_scoreAdjustment[i][1])
				html = html.substring(0, html.length - 2) + '</td></tr>';
			if (weekCount !== global_scoreAdjustment[i][1]) {
				weekCount = global_scoreAdjustment[i][1];
				if (rowCount % 2)
					html += '<tr class="eventablerow"><td style="text-align:center">' + weekCount + '</td><td>';
				else
					html += '<tr class="oddtablerow"><td style="text-align:center">' + weekCount + '</td><td>';
				rowCount++;
			}
			html += franchiseDatabase["fid_" + global_scoreAdjustment[i][0]].name + ' (' + global_scoreAdjustment[i][2] + '), ';
			if (i === (global_scoreAdjustment.length - 1))
				html = html.substring(0, html.length - 2) + '</td></tr>';
		}
		if (html !== '')
			return '<div class="mobile-wrap" style="display:inline-block"><table align="center" cellspacing="1" class="homepagemodule report" id="scoreadjustment-table"><caption><span>Franchise Score Adjustments</span></caption><tbody><tr><th>Week #</th><th>* Adjustment(s)</th></tr>' + html + '</tbody></table></div>';
		else
			return '';
	} catch (er) {
		return '';
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////         MFL: Kill ads but keep your iframes      ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

(function () {
	// --- 1) Disable Freestar slot registration (prevents new ad slots) ---
	const lockedSlots = [];
	Object.defineProperty(lockedSlots, "push", {
		value: () => 0,
		writable: false
	});

	window.freestar = window.freestar || {};
	freestar.queue = [];
	freestar.config = freestar.config || {};
	freestar.config.enabled_slots = lockedSlots;
	freestar.initCallbackCalled = true;
	freestar.initCallback = function () {};
	freestar.newAdSlots = function () {};
	freestar.refresh = function () {};

	// --- 2) Helpers ---
	const AD_SRC_HINTS = [
		"a.pub.network",
		"pub.network",
		"freestar",
		"btloader",
		"confiant",
		"amazon-adsystem",
		"googlesyndication",
		"doubleclick.net",
		"googleadservices",
		"adnxs",
		"criteo",
		"taboola",
		"outbrain"
	];

	function isAdScript(el) {
		const src = (el.src || "").toLowerCase();
		return AD_SRC_HINTS.some(h => src.includes(h));
	}

	function isAdIframe(iframe) {
		const src = (iframe.getAttribute("src") || "").toLowerCase();
		const id = (iframe.id || "").toLowerCase();
		const cls = (iframe.className || "").toLowerCase();

		if (AD_SRC_HINTS.some(h => src.includes(h))) return true;
		if (id.includes("google_ads") || cls.includes("google_ads")) return true;
		if (id.includes("freestar") || cls.includes("freestar")) return true;

		const adParent = iframe.closest?.(
			'[data-freestar-ad], [id*="freestar"], [class*="freestar"], .fs-sticky-footer,' +
			' [id*="pubnetwork"], [class*="pubnetwork"], [id*="leaderboard"], [class*="leaderboard"]'
		);
		return !!adParent;
	}

	function removeAdsNow(root) {
		const scope = root && root.querySelectorAll ? root : document;

		// Remove known ad containers
		scope.querySelectorAll(
			'[data-freestar-ad], [id*="freestar"], [class*="freestar"], .fs-sticky-footer, #myfantasyleague_leaderboard_atf_desktop'
		).forEach(el => el.remove());

		// Remove ad-only iframes (leave your iframes alone)
		scope.querySelectorAll("iframe").forEach(ifr => {
			if (isAdIframe(ifr)) ifr.remove();
		});

		// Remove ad loader scripts already in DOM (pubfig, etc.)
		scope.querySelectorAll("script").forEach(scr => {
			if (isAdScript(scr)) scr.remove();
		});

		// Optional: remove ad-related preconnects/styles
		scope.querySelectorAll('link[href]').forEach(link => {
			const href = (link.getAttribute("href") || "").toLowerCase();
			if (AD_SRC_HINTS.some(h => href.includes(h))) link.remove();
		});
	}

	// run immediately
	removeAdsNow(document);

	// keep cleaning late injections
	const mo = new MutationObserver(muts => {
		for (const m of muts) {
			for (const node of m.addedNodes) {
				if (!node || node.nodeType !== 1) continue;

				// Kill ad scripts immediately
				if (node.tagName === "SCRIPT" && isAdScript(node)) {
					node.remove();
					continue;
				}

				removeAdsNow(node);
			}
		}
	});

	mo.observe(document.documentElement, {
		childList: true,
		subtree: true
	});
})();


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END GLOBAL CACHE JS///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START GLOBAL BASE FILE////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// SVG SPRITE LOADER — fetches svg-sprites.svg and caches in localStorage
(function (window, document) {
	'use strict';
	const file = 'https://mfl-leagues.com/images/shared/icons/svg-sprites.svg';
	const revision = 18;

	if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
		return true;
	}

	const isLocalStorage = 'localStorage' in window && window.localStorage !== null;
	let data;
	const insertIT = () => {
		const div = document.createElement('div');
		div.className = 'svgSprite';
		div.innerHTML = data;
		document.body.insertBefore(div, document.body.childNodes[0]);
	};

	const insert = () => {
		if (document.body) {
			insertIT();
		} else {
			document.addEventListener('DOMContentLoaded', insertIT);
		}
	};

	if (isLocalStorage && localStorage.getItem('inlineSVGrev') === String(revision)) {
		data = localStorage.getItem('inlineSVGdata');
		if (data) {
			insert();
			return true;
		}
	}

	try {
		fetch(file)
			.then(response => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error('Network response was not ok.');
				}
			})
			.then(svgData => {
				data = svgData;
				insert();
				if (isLocalStorage) {
					localStorage.setItem('inlineSVGdata', data);
					localStorage.setItem('inlineSVGrev', String(revision));
				}
			});
	} catch (e) {}
})(window, document);


var loginNotLoaded = false; // on our template load login text and links - if login is loaded and load_mobileMenu_script=true , then we DO NOT want to load it again

function createLoginMenuTemplate(baseURLDynamic, year, league_id) {
	const slideMenuLoginTemplate = document.querySelector('.myfantasyleague_menu > ul');
	const menuHTML = `<li class="has-sub sub-default" id="slide-menu-login"><a>Login</a><b aria-haspopup="true" aria-controls="p50"></b><input id="sub50" type="checkbox"><label for="sub50"><span></span></label><ul id="p50"><li class="user-login"><a class="no-sub" href="${baseURLDynamic}/${year}/login?L=${league_id}">Login to league</a></li></ul></li>`;

	slideMenuLoginTemplate.insertAdjacentHTML('beforeend', menuHTML);
}

function populateWelcomeLinksTemplate(baseURLDynamic, year, league_id) {
	fetch(`${baseURLDynamic}/${year}/home/${league_id}?MODULE=WELCOME`)
		.then(response => response.text())
		.then(data => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(data, 'text/html');
			const welcomeLinks = Array.from(doc.querySelectorAll('#welcome td a'));
			const slideMenuLoginTemplates = document.querySelectorAll('#slide-menu-login ul');
			welcomeLinks.forEach(link => {
				const linkHTML = `<li><a class="no-sub" href="${link.href}">${link.textContent}</a></li>`;
				slideMenuLoginTemplates.forEach(slideMenu => {
					const userLogin = slideMenu.querySelector('.user-login');
					if (userLogin) userLogin.remove();
					slideMenu.insertAdjacentHTML('beforeend', linkHTML);
				});
			});
		})
		.catch(error => {
			console.error('Error:', error);
		});
}

function addLogintoMenu() {
	createLoginMenuTemplate(baseURLDynamic, year, league_id);
	populateWelcomeLinksTemplate(baseURLDynamic, year, league_id);
}

addLogintoMenu();

function changeFont(e, el) {
	var type = $(el).attr('class');
	var curFontSize = $('html').css('font-size');
	if (type == 'increaseFont fontChange') {
		$('html').css('font-size', parseInt(curFontSize) + 1);
		var fontSize = $("html").attr('style');
		localStorage.setItem("fontSize_" + year + "_" + league_id, fontSize);
	} else {
		$('html').css('font-size', parseInt(curFontSize) - 1);
		var fontSize = $("html").attr('style');
		localStorage.setItem("fontSize_" + year + "_" + league_id, fontSize);
	}
}

function resetFont() {
	$('html').css('font-size', '');
	var fontSize = $("html").attr('style');
	localStorage.setItem("fontSize_" + year + "_" + league_id, fontSize);
}
if (typeof increaseFont === 'undefined') var increaseFont = false;
if (increaseFont) {
	const parentUl = document.querySelector('.mm-help ul:first-of-type');
	const newHTML = `
  		<li class="mm_sizing_head">
    			<a>Customize Page Size</a>
  		</li>
  		<li title="Click to Zoom Page In">
    			<a class="increaseFont fontChange" onclick="changeFont(event, this)">Enlarge +</a>
  		</li>
  		<li title="Click to Zoom Page Out">
    			<a class="decreaseFont fontChange" onclick="changeFont(event, this)">Shrink -</a>
  		</li>
  		<li title="Click to Reset Zoom">
    			<a class="decreaseFont fontChange" onclick="resetFont()">Reset</a>
  		</li>
`;

	parentUl.innerHTML += newHTML;
}

// REMOVE MENU ITEMS
document.querySelectorAll('.pageheader, .myfantasyleague_menu li a:empty, div.myfantasyleague_menu ul li:empty').forEach(function (element) {
	element.remove();
});

// MFL Skin Selector for all my personal skins
function setTheme(themeName) {
	localStorage.setItem('theme_' + year + '_' + league_id, themeName);
	document.documentElement.className = themeName;
}

(() => {
	if (localStorage.hasOwnProperty(`theme_${year}_${league_id}`)) {
		setTheme(localStorage.getItem(`theme_${year}_${league_id}`));
	}
})();

var logoSvgInsertIcon = document.getElementById("logo_svg_inserticon");
if (logoSvgInsertIcon) {
	logoSvgInsertIcon.classList.add("nfl-icon-onload");
}

// New function to popup new css styles
document.querySelectorAll(".MFLSkinSelectionbtn").forEach(function (element) {
	element.addEventListener("click", function () {
		document.getElementById("myMFLSkinSelection").style.display = "block";
		document.querySelector(".ThemeSwith_overlay").style.display = "block";
		document.getElementById("menu-trigger").style.opacity = "0.3";
		document.getElementById("menu-trigger").style.pointerEvents = "none";
		document.getElementById("myMFLSkinSelection").scrollTop = 0;
		try {
			bodyScrollLock.disableBodyScroll(document.querySelector("#myMFLSkinSelection"));
		} catch (error) {}
	});
});
document.querySelectorAll("#myMFLSkinSelection a").forEach(function (element) {
	element.addEventListener("click", function () {
		document.getElementById("myMFLSkinSelection").style.display = "none";
		document.querySelector(".ThemeSwith_overlay").style.display = "none";
		document.getElementById("menu-trigger").style.opacity = "";
		document.getElementById("menu-trigger").style.pointerEvents = "";
		try {
			var skinSelectPop = document.querySelector("#myMFLSkinSelection");
			bodyScrollLock.enableBodyScroll(skinSelectPop);
		} catch (error) {}
	});
});
document.querySelectorAll(".ThemeSwith_overlay, #myMFLSkinSelection .as_close_btn").forEach(function (element) {
	element.addEventListener("click", function () {
		document.getElementById("myMFLSkinSelection").style.display = "none";
		document.querySelector(".ThemeSwith_overlay").style.display = "none";
		document.getElementById("menu-trigger").style.opacity = "";
		document.getElementById("menu-trigger").style.pointerEvents = "";
		try {
			var skinSelectPop = document.querySelector("#myMFLSkinSelection");
			bodyScrollLock.enableBodyScroll(skinSelectPop);
		} catch (error) {}
	});
});


// LINKS IN MAIN MENU - SCORING - ROSTER - CUSTOM ABILITIES
if (add_abilities_link === undefined) var add_abilities_link = false;
if (add_seedings_link === undefined) var add_seedings_link = false;

if (add_abilities_link) {
	const menuLink = document.querySelector('.myfantasyleague_menu li.mm-league a[href*="commissioner_setup"]');
	if (menuLink) {
		const customAbilitiesLink = document.createElement('a');
		customAbilitiesLink.classList.add('no-sub');
		customAbilitiesLink.href = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=MESSAGE${SetHPMability}`;
		customAbilitiesLink.textContent = 'Custom Abilities';
		const listItem = document.createElement('li');
		listItem.appendChild(customAbilitiesLink);
		menuLink.parentElement.insertAdjacentElement('afterend', listItem);
	}
}

if (add_seedings_link) {
	document.addEventListener('DOMContentLoaded', function () {
		const links = Array.from(document.querySelectorAll('a')).filter((link) => {
			return link.textContent.includes('Projected') &&
				link.textContent.includes('Playoff') &&
				link.textContent.includes('Seedings');
		});

		if (links.length > 0) {
			const link = links[0];
			link.href = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=MESSAGE${SetHPMseeding}`;
		}
	});
}


// SCRIPT TO PLACE LOGGED IN USER TABLES FIRST
document.addEventListener('DOMContentLoaded', () => {
	const isUserLoggedIn = typeof franchise_id === 'undefined' ? false : true;
	if (isUserLoggedIn) {
		const url = document.URL;
		const shouldReplaceTable = endsWith(url, 'O=01') || endsWith(url, 'O=07') || url.includes('O=07&DISPLAY');
		if (shouldReplaceTable) {
			const elements = document.querySelectorAll('table.report:not(#welcome,#player_search,.toggle_module_login table.report,.toggle_module_search table.report,.mm-module .report)');
			for (let i = 0; i < elements.length; i++) {
				const htmlContent = elements[i].innerHTML;
				if (htmlContent.includes('FID=' + franchise_id) || htmlContent.includes('franchise_' + franchise_id)) {
					const selected = `<table align="center" cellspacing="1" class="report">${htmlContent}</table>`;
					const replace = `<table align="center" cellspacing="1" class="report">${elements[0].innerHTML}</table>`;
					elements[0].innerHTML = selected;
					elements[i].innerHTML = replace;
					break;
				}
			}
		}
	}
});

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


// KEEP FOOTER AT BOTTOM OF PAGE
function footerAlign() {
	const footer = document.querySelector('footer');
	const vsubmenu = document.querySelector('#vsubmenu.vsub_shift');
	const body = document.body;
	if (footer) {
		footer.style.display = 'block';
		footer.style.height = 'auto';
		const footerHeight = footer.offsetHeight;
		const addFooter = footerHeight + 10;
		if (body) {
			body.style.paddingBottom = `${footerHeight}px`;
		}
		if (footer) {
			footer.style.height = `${footerHeight}px`;
		}
		if (vsubmenu) {
			vsubmenu.style.marginBottom = `${addFooter}px`;
		}
	}
}
document.addEventListener('DOMContentLoaded', () => {
	footerAlign();
});
window.addEventListener('resize', () => {
	footerAlign();
});

// ADP AND AAV PAGES
jQuery(document).ready(function () {
	jQuery('#body_adp #container-wrap .report,#body_aav #container-wrap .report').wrap('<div class="mobile-wrap"></div>');
	jQuery("#body_adp #container-wrap form,#body_aav #container-wrap form").addClass("reportform");
	jQuery('#body_adp #container-wrap h3,#body_aav #container-wrap h3,#body_adp #container-wrap h2,#body_aav #container-wrap h2').addClass('h3-menu');
	jQuery('#body_adp #container-wrap .reportnavigation:contains("Hint:")').removeClass().addClass('alert alert-info-body');
	jQuery('#body_aav #container-wrap .reportnavigation:contains("Hint:")').removeClass().addClass('alert alert-info-body');
	jQuery('#body_aav #container-wrap blockquote:contains("Hint:")').removeClass().addClass('alert alert-info-body');
});

jQuery(document).ready(function () {
	jQuery('#body_api_info #container-wrap .pagebody').wrapInner('<div class="mobile-wrap">');
});

jQuery('head').append('<style>#body_api_info #container-wrap{display:none}</style>');

setTimeout(function () {
	$('#body_api_info #container-wrap').wrapInner('<div class="mobile-wrap">');
	$('#body_api_info #container-wrap form[action="api_info"]').css('text-align', 'center');
	$('#body_api_info #container-wrap .pagebody .mobile-wrap').removeClass('mobile-wrap');
	$('#body_api_info #container-wrap').css('display', 'block');
}, 700);


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END GLOBAL BASE FILE//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//     UPDATE MFL EACH YEAR AND COPY ALL PREVIOUS YEAR HPMs //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

let mflUpdateYear;
let mflUpdateID;
let mflUpdateServer;

$(document).on('click', 'form[action*="copy_league"] input[type="submit"]', function () {
	MFL_updatedSerID = baseURLStatic.substr(baseURLStatic.indexOf("www") + 3, 2);
	localStorage.setItem("MFL_updatedYear", year);
	localStorage.setItem("MFL_updatedID", league_id);
	localStorage.setItem("MFL_updatedSERVER", MFL_updatedSerID);
});


if (localStorage.getItem("MFL_updatedYear") !== null) {
	const interval = 100; // Check every 100ms
	const maxTime = 3000; // Stop after 2 seconds
	const checkForElement = setInterval(() => {
		const element = document.querySelector('#MFLPlayerPopupContainer');

		if (element) {
			MFLPlayerPopupClose(); // Run the function if the element exists
			clearInterval(checkForElement); // Stop checking
		}
	}, interval);
	setTimeout(() => {
		clearInterval(checkForElement);
	}, maxTime);
	$('body').css("pointer-events", "none");
	$('body').append('<div class="mflUpdateWrap" style="display:block;z-index:9999999999!important"></div><div style="display:block;z-index:9999999999!important" id="mflUpdateWrapContent"><table><caption><span>MFL Scripts: Template Update</span></caption><tbody><tr class="oddtablerow"><td>Do not leave page until MFL Scripts updates all Homepage Messages from your previous season to the new season.</td></tr><tr class="eventablerow"><td>Approximate wait time is 10 seconds</td></tr><tr class="oddtablerow"><td>This page will refresh when completed</td></tr></tbody></table></div>');
	//set variable from local storage items
	mflUpdateYear = localStorage.getItem("MFL_updatedYear");
	mflUpdateID = localStorage.getItem("MFL_updatedID");
	mflUpdateServer = localStorage.getItem("MFL_updatedSERVER");

	//remove local storage items after restoring all HPM's
	localStorage.removeItem("MFL_updatedYear");
	localStorage.removeItem("MFL_updatedID");
	localStorage.removeItem("MFL_updatedSERVER");
	// run function to load HPMs from previous years site
	mflUpdateTransferHPMs();
}

function mflUpdateTransferHPMs() {
	ajaTransfer = true;
	var i = 0;
	var hpmCount = setInterval(function () {
		if (ajaTransfer) {
			ajaTransfer = false;
			if (i <= 30) {
				if (i === 1) {
					urlGET = "https://www" + mflUpdateServer + ".myfantasyleague.com/" + mflUpdateYear + "/csetup?L=" + mflUpdateID + "&C=HMPGMSG&PRINTER=1";

				} else {
					urlGET = "https://www" + mflUpdateServer + ".myfantasyleague.com/" + mflUpdateYear + "/csetup?L=" + mflUpdateID + "&C=HMPGMSG&SEQNO=" + i + "&PRINTER=1";
				}
				$.ajax({
					url: urlGET,
					type: "GET",
					dataType: 'html',
					xhrFields: {
						withCredentials: true
					},
					success: function (data) {
						hpm_txt = $(data).find('#MSG').val();
						hpm_name = $(data).find('form table.report input[name="LABEL"]').val();
						isFooter = $(data).find('#IN_FOOTER_Yes[checked="checked"]');
						isHeader = $(data).find('#IN_HEADER_Yes[checked="checked"]');
						if (isFooter.length > 0) {
							if (i === 1) {
								urlPOST = baseURLDynamic + "/" + year + "/message?LEAGUE_ID=" + league_id + "&NAME=message&IN_FOOTER=Yes";
							} else {
								urlPOST = baseURLDynamic + "/" + year + "/message?LEAGUE_ID=" + league_id + "&NAME=message" + i + "&IN_FOOTER=Yes";
							}
						} else if (isHeader.length > 0) {
							if (i === 1) {
								urlPOST = baseURLDynamic + "/" + year + "/message?LEAGUE_ID=" + league_id + "&NAME=message&IN_HEADER=Yes";
							} else {
								urlPOST = baseURLDynamic + "/" + year + "/message?LEAGUE_ID=" + league_id + "&NAME=message" + i + "&IN_HEADER=Yes";
							}
						} else {
							if (i === 1) {
								urlPOST = baseURLDynamic + "/" + year + "/message?LEAGUE_ID=" + league_id + "&NAME=message";
							} else {
								urlPOST = baseURLDynamic + "/" + year + "/message?LEAGUE_ID=" + league_id + "&NAME=message" + i;
							}
						}
						$.ajax({
							url: urlPOST,
							xhrFields: {
								withCredentials: true
							},
							data: {
								MSG: hpm_txt,
								LABEL: hpm_name
							},
							cache: false,
							type: "POST",
							success: function (response) {
								ajaTransfer = true;
								hpm_txt = void 0;
								hpm_name = void 0;
								isFooter = void 0;
								isHeader = void 0;
								urlPOST = void 0;
								i++; // add +1 to counter after success of both ajax calls
							},
							error: function (xhr) {
								i++
							}
						});
					},
					error: function (xhr) {
						i++
					}
				});
			} else {
				clearInterval(hpmCount);
				ajaTransfer = void 0;
				$('body').css("pointer-events", "");
				setTimeout(() => {
					location.reload();
				}, 100);
			}
		}
	}, 400);
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//   END  UPDATE MFL EACH YEAR AND COPY ALL PREVIOUS YEAR HPMs ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START TABS SCRIPT/////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (load_tabs_script) { // only use for header.js and option to load tabs script
	/////////////////////////////////////////////////
	// MFL TABS https://www.mflscripts.com/mfl-apps/tabs/script.js
	/////////////////////////////////////////////////
	//////////DO NOT EDIT BELOW HERE///////////////
	if (showTabsAllPages == undefined) var showTabsAllPages = true;
	if (changeMainTabName == undefined) var changeMainTabName = "Home";
	if (swipeHPM == undefined) var swipeHPM = false;
	if (swipePosition == undefined) var swipePosition = "content";
	var tabNumberSwipe;
	var lastTabSwipe;
	var firstTabSwipe = 0;
	var thresholdTab = 50;
	var startTabX, distTabX;
	var isScrolling = false;
	var scrollingElement = null;


	if (showTabsAllPages || !(jQuery('#body_home').length === 0 || (jQuery('#body_home').length === 1 && location.href.indexOf("MODULE=MESSAGE") != -1))) {
		//console.log("showTabsAllPages ran")
		// Add styles dynamically
		const Tabshead = document.querySelector('head');
		const Tabsstyle = document.createElement('style');
		Tabsstyle.textContent = `div.myfantasyleague_tabmenu.main_tabmenu{display:none}.myfantasyleague_tabmenu.all_page #homepagetabs li a{text-decoration:none}.myfantasyleague_tabmenu.all_page li a{display:flex;flex-grow:1;flex-shrink:1;justify-content:center}`;
		Tabshead.appendChild(Tabsstyle);

		let html = '';
		html += `<div id="tabmenu-wrap" style="padding: 0 0.188rem"><div class="myfantasyleague_tabmenu all_page" style="display: block"><span id="tab_title"></span><input id="sub100" type="checkbox"><label for="sub100"><span></span></label><ul id="homepagetabs" class="customhomepagetabs"><li id="tab0" onclick="javascript:show_tab('0');" class=""><a class="tab_link" href="${baseURLDynamic}/${year}/home/${league_id}#0" class="no-sub">Home<input id="sub100" type="checkbox"><label for="sub100"></label></a></li></ul></div></div>`;

		const scriptTag = document.currentScript;
		scriptTag.insertAdjacentHTML('beforebegin', html);

		let html2 = '';
		let url = `${baseURLDynamic}/${year}/export?TYPE=appearance&L=${league_id}&JSON=1`;
		fetch(url)
			.then(response => {
				if (response.ok) return response.json();
				throw new Error(`Error: ${response.status}`);
			})
			.then(appearanceData => {
				let MFL_customTabs_DefaultTabs = appearanceData.appearance.tab.map(tab => tab.name);

				if (changeMainTabName !== "") {
					MFL_customTabs_DefaultTabs[0] = changeMainTabName;
				}

				MFL_customTabs_DefaultTabs.forEach((tab, i) => {
					html2 += `<li id="tab${i}" onclick="javascript:show_tab('${i}');" class=""><a class="tab_link" href="${baseURLDynamic}/${year}/home/${league_id}#${i}" class="no-sub">${tab}<input id="sub100" type="checkbox"><label for="sub100"></label></a></li>`;
				});

				let fakeTabs = MFL_customTabs_DefaultTabs.length;
				for (let key in MFL_customTabs_FakeTabs) {
					if (Object.hasOwnProperty.call(MFL_customTabs_FakeTabs, key)) {
						html2 += `<li id="tab${fakeTabs}" class="disable_sort"><a href="${MFL_customTabs_FakeTabs[key].href}#${fakeTabs}" target="${MFL_customTabs_FakeTabs[key].target}">${key}</a></li>`;
						fakeTabs++;
					}
				}

				//const scriptTag = document.currentScript;
				//const withMenusElement = document.querySelector('#withmenus');
				//const mainTabMenu = document.querySelector('div.myfantasyleague_tabmenu.main_tabmenu');
				//if (mainTabMenu) {
				//console.log("Replacing mainTabMenu with HTML");
				//mainTabMenu.outerHTML = html; // Replace the entire element with HTML
				//} else if (withMenusElement) {
				//console.log("YES HAS #withmenus");
				//withMenusElement.insertAdjacentHTML('afterbegin', html);
				//} else {
				//console.log("DOES NOT HAVE #withmenus");
				//scriptTag.insertAdjacentHTML('beforebegin', html);
				//}

				const customHomePageTabs = document.querySelector('.customhomepagetabs');
				if (customHomePageTabs) {
					customHomePageTabs.innerHTML = html2;
				}

				document.querySelectorAll(".myfantasyleague_tabmenu.all_page ul#homepagetabs li label").forEach(label => label.style.display = "none");

				let currentTab = document.querySelector(`#tab${location.hash.substr(1)}`);
				if (currentTab) {
					currentTab.classList.add("currenttab");
				}

				if (!location.href.includes("MODULE=")) {
					document.querySelectorAll("#body_home .myfantasyleague_tabmenu.all_page li a.tab_link").forEach(link => link.removeAttribute("href"));
					document.querySelectorAll("#body_home .myfantasyleague_tabmenu.all_page ul#homepagetabs li label").forEach(label => label.style.display = "block");
				}

				try {
					var tabHash = location.hash.substr(1); // Get the hash without the '#' character
					var tabElement = document.getElementById("tab" + tabHash);

					if (tabElement) {
						// If the tab element exists, set its text as the tab title
						document.getElementById("tab_title").innerHTML = tabElement.firstChild.textContent || tabElement.firstChild.innerText;
					} else {
						// Fallback titles based on the value of thisProgram
						switch (thisProgram) {
							case "options_07":
								document.getElementById("tab_title").innerHTML = "Rosters";
								break;
							case "lineup":
								document.getElementById("tab_title").innerHTML = "Lineup";
								break;
							case "standings":
								document.getElementById("tab_title").innerHTML = "Standings";
								break;
							case "options_06":
								document.getElementById("tab_title").innerHTML = "Lineup";
								break;
							case "options_79":
								document.getElementById("tab_title").innerHTML = "Playoff";
								break;
							case "select_franchise":
								document.getElementById("tab_title").innerHTML = "Select Franchise";
								break;
							case "commissioner_setup":
								document.getElementById("tab_title").innerHTML = "Settings";
								break;
							case "options_22":
								document.getElementById("tab_title").innerHTML = "Scoring";
								break;
							default:
								document.getElementById("tab_title").innerHTML = "Home";
						}
					}
					// Call the doAppendIcon function
					doAppendIcon();
				} catch (er) {
					//console.error("An error occurred:", er);
				}
			})
			.catch(error => console.error('Error:', error));

	}

	document.addEventListener("DOMContentLoaded", () => {

		const mainTabMenu = document.querySelector('div.myfantasyleague_tabmenu.main_tabmenu');
		if (mainTabMenu) {
			mainTabMenu.remove();
			try {
				doAppendIcon();
			} catch (er) {}
		}

		// Function to initialize top-level and nested tabs
		const initializeTabs = (container = document) => {
			// Filter #myfantasyleague_tabs that have a sibling with a span.tabName,
			// are not already initialized, and do not have #homepagetabs > li[onclick]
			const tabGroups = Array.from(container.querySelectorAll("#myfantasyleague_tabs")).filter(tabGroup =>
				tabGroup.querySelector(".myfantasyleague_tabmenu .tabName") && // Must have a .tabName
				!tabGroup.classList.contains("initialized") && // Skip already initialized groups
				!tabGroup.querySelector("#homepagetabs > li[onclick]") // Exclude groups with li having onclick
			);

			tabGroups.forEach(tabGroup => {
				//console.log("tabGroups ran");
				tabGroup.classList.add("initialized"); // Mark this group as initialized

				const tabMenu = tabGroup.querySelector(".myfantasyleague_tabmenu");
				const tabs = tabMenu.querySelectorAll("#homepagetabs > li");
				const tabContents = Array.from(
					tabGroup.querySelectorAll(".tabs_scroll > .homepagetabcontent")
				);

				// Add click handler to the label for each upper-level tab group
				const tabLabel = tabMenu.querySelector(".tabLabel");
				if (tabLabel) {
					tabLabel.addEventListener("click", (event) => {
						if (tabGroup.classList.contains("nested-tabs")) return;

						//console.log("tabLabel ran for upper-level tab");
						const inputElement = tabLabel.parentElement.querySelector("input[type='checkbox']");
						if (inputElement) {
							inputElement.checked = !inputElement.checked;
						}
					});
				}

				// Hide all tab contents on page load
				tabContents.forEach(content => (content.style.display = "none"));

				// Display content for the current tab on page load
				const currentTab = tabMenu.querySelector(".currenttab");
				if (currentTab) {
					const currentIndex = Array.from(tabs).indexOf(currentTab);
					if (currentIndex > -1 && tabContents[currentIndex]) {
						tabContents[currentIndex].style.display = "block";
					}
					const tabName = tabMenu.querySelector(".tabName");
					if (tabName) {
						tabName.textContent = currentTab.textContent.trim();
					}
				}

				// Initialize all nested tabs inside the parent tab group (including hidden content)
				tabContents.forEach(content => initializeNestedTabs(content));

				// Add click event listeners to tabs
				tabs.forEach((tab, index) => {
					tab.addEventListener("click", (event) => {
						if (tabGroup.classList.contains("nested-tabs")) {
							return; // Ignore clicks from nested tabs
						}

						//console.log("upper level tab is clicked");
						tabs.forEach(t => t.classList.remove("currenttab"));
						tab.classList.add("currenttab");

						tabContents.forEach(content => (content.style.display = "none"));

						if (tabContents[index]) {
							tabContents[index].style.display = "block";
							initializeNestedTabs(tabContents[index]); // Initialize nested tabs in this content
						}

						const tabName = tabMenu.querySelector(".tabName");
						if (tabName) {
							tabName.textContent = tab.textContent.trim();
						}
						// Handle associated checkbox toggle
						const toggleTabs = tab.closest(".toggle_tabs");
						const inputElementCK = toggleTabs.querySelector("input[type='checkbox']");
						if (inputElementCK) {
							inputElementCK.checked = false;
						}
					});
				});
			});
		};

		// Function to initialize nested tabs (for each content block)
		const initializeNestedTabs = (parentContent) => {
			const nestedTabGroups = Array.from(parentContent.querySelectorAll("#myfantasyleague_tabs")).filter(nestedTabGroup =>
				!nestedTabGroup.classList.contains("initialized") && // Skip already initialized nested groups
				!nestedTabGroup.querySelector("#homepagetabs > li[onclick]") // Exclude nested groups with li having onclick
			);

			nestedTabGroups.forEach(nestedTabGroup => {
				nestedTabGroup.classList.add("initialized"); // Mark this group as initialized
				nestedTabGroup.classList.add("nested-tabs"); // Add class to identify nested tabs

				//console.log("nestedTabGroups ran");
				const tabMenu = nestedTabGroup.querySelector(".myfantasyleague_tabmenu");
				const tabs = tabMenu.querySelectorAll("#homepagetabs > li");
				const tabContents = Array.from(
					nestedTabGroup.querySelectorAll(".homepagetabcontent")
				);

				// Add click handler to the label for each nested tab group
				const tabLabel = tabMenu.querySelector(".tabLabel");
				if (tabLabel) {
					tabLabel.addEventListener("click", (event) => {
						event.stopPropagation(); // Prevent bubbling to parent handlers
						//console.log("tabLabel ran for nested tab");
						const inputElement = tabLabel.parentElement.querySelector("input[type='checkbox']");
						if (inputElement) {
							inputElement.checked = !inputElement.checked;
						}
					});
				}

				tabContents.forEach(content => (content.style.display = "none"));

				const currentTab = tabMenu.querySelector(".currenttab");
				if (currentTab) {
					const currentIndex = Array.from(tabs).indexOf(currentTab);
					if (currentIndex > -1 && tabContents[currentIndex]) {
						tabContents[currentIndex].style.display = "block";
					}
				}

				tabs.forEach((tab, index) => {
					tab.addEventListener("click", (event) => {
						event.stopPropagation(); // Prevent bubbling to the parent
						//console.log("nested tab is clicked");
						tabs.forEach(t => t.classList.remove("currenttab"));
						tab.classList.add("currenttab");

						tabContents.forEach(content => (content.style.display = "none"));

						if (tabContents[index]) {
							tabContents[index].style.display = "block";
						}

						const tabName = tabMenu.querySelector(".tabName");
						if (tabName) {
							tabName.textContent = tab.textContent.trim();
						}
						// Handle associated checkbox toggle
						const toggleTabs = tab.closest(".toggle_tabs");
						const inputElementCK = toggleTabs.querySelector("input[type='checkbox']");
						if (inputElementCK) {
							inputElementCK.checked = false;
						}
					});
				});
			});
		};

		// Initialize top-level tabs on page load
		initializeTabs();


		// Select the table inside #myfantasyleague_tabs and add 'mobile-wrap' to its parent
		const reportTable = document.querySelector('#myfantasyleague_tabs > table.report');
		if (reportTable) {
			const parent = reportTable.parentElement;
			parent.classList.add('mobile-wrap');
		}

		// Remove 'mobile-wrap' from parent divs of specific tables
		const mobileWrapTables = document.querySelectorAll('div.mobile-wrap #myfantasyleague_tabs > table.report');
		mobileWrapTables.forEach(table => {
			const parent = table.parentElement;
			if (parent) {
				parent.classList.remove('mobile-wrap');
			}
		});

		// Unwrap tables inside .mobile-wrap that are not within specified wrappers
		const wrappedTables = document.querySelectorAll('#myfantasyleague_tabs .mobile-wrap table:not(#custom_draftroom #myfantasyleague_tabs .mobile-wrap table):not(#overview_wrapper.mobile-wrap table):not(#league-history-wrapper.mobile-wrap table)');
		wrappedTables.forEach(table => {
			const parent = table.parentElement;
			if (parent) {
				parent.replaceWith(table); // Replaces the parent div with the table itself (unwrap)
			}
		});

		setTimeout(() => {
			const homeTabMenu = document.querySelector('#home .myfantasyleague_tabmenu');
			if (homeTabMenu && swipeHPM && !location.href.includes("MODULE=")) {
				const swipeContents = document.querySelectorAll('#home .homepagetabcontent:not(#home .homepagetabcontent .homepagetabcontent)');
				const swipeTabs = document.querySelector('#home .myfantasyleague_tabmenu');
				swipeContents.forEach(element => element.classList.add('swipeContent'));
				swipeTabs.classList.add('swipeTabs');

				// Exclude .disable_sort tabs from swipe functionality
				const validTabs = document.querySelectorAll('#home .swipeTabs li:not(.disable_sort)');
				const currentTab = document.querySelector('#home .swipeTabs li.currenttab:not(.disable_sort)');
				if (currentTab) {
					tabNumberSwipe = parseInt(currentTab.id.replace('tab', ''), 10);
					const lastTab = validTabs[validTabs.length - 1];
					if (lastTab) lastTabSwipe = parseInt(lastTab.id.replace('tab', ''), 10);
				}

				validTabs.forEach(tab => {
					tab.addEventListener('click', () => {
						tabNumberSwipe = parseInt(tab.id.replace('tab', ''), 10);
						const lastTab = validTabs[validTabs.length - 1];
						if (lastTab) lastTabSwipe = parseInt(lastTab.id.replace('tab', ''), 10);
					});
				});

				if (swipePosition === "content") {
					const swipeStyle = document.createElement('style');
					swipeStyle.textContent = '.swipeContent { min-height: 200px }';
					document.head.appendChild(swipeStyle);

					document.addEventListener('touchstart', event => {
						if (event.target.closest('.swipeContent')) {
							startTabX = event.changedTouches[0].pageX;
							isScrolling = false;
							scrollingElement = null;
						}
					});

					document.addEventListener('touchmove', event => {
						const target = event.target.closest('.swipeContent');
						if (target && target.scrollLeft > 0 && target.scrollLeft < target.scrollWidth - target.clientWidth) {
							isScrolling = true;
							scrollingElement = target;
						}
					});

					document.addEventListener('touchend', event => {
						if (!isScrolling && event.target.closest('.swipeContent')) {
							distTabX = event.changedTouches[0].pageX - startTabX;
							if (Math.abs(distTabX) >= thresholdTab) {
								if (distTabX > 0) {
									tabNumberSwipe = tabNumberSwipe === 0 ? lastTabSwipe : tabNumberSwipe - 1;
								} else {
									tabNumberSwipe = tabNumberSwipe === lastTabSwipe ? firstTabSwipe : tabNumberSwipe + 1;
								}
								show_tab(tabNumberSwipe);
							}
						}
					});
				}
				if (swipePosition === "tabs") {
					const validTabs = Array.from(document.querySelectorAll('#home .myfantasyleague_tabmenu.swipeTabs li:not(.disable_sort)'));
					const validTabIndices = validTabs.map(tab => parseInt(tab.id.replace('tab', ''), 10));

					document.addEventListener("touchstart", (e) => {
						if (e.target.closest("#home .myfantasyleague_tabmenu.swipeTabs")) {
							startTabX = e.changedTouches[0].pageX;
						}
					});

					document.addEventListener("touchend", (e) => {
						if (e.target.closest("#home .myfantasyleague_tabmenu.swipeTabs")) {
							distTabX = e.changedTouches[0].pageX - startTabX;
							if (Math.abs(distTabX) >= thresholdTab) {
								let currentIndex = validTabIndices.indexOf(tabNumberSwipe);
								if (distTabX > 0) {
									// Swipe right (previous tab)
									currentIndex = currentIndex === 0 ? validTabIndices.length - 1 : currentIndex - 1;
								} else {
									// Swipe left (next tab)
									currentIndex = currentIndex === validTabIndices.length - 1 ? 0 : currentIndex + 1;
								}
								tabNumberSwipe = validTabIndices[currentIndex];
								show_tab(tabNumberSwipe);
							}
						}
					});
				}

			}
		}, 1000);

	});

	// FUNCTION FOR OLD STYLE TABS
	function show_custom_tab(tab_id) {
		var done = false;
		var tabs_offset = parseInt(tab_id) - parseInt(parseInt(tab_id) / Math.pow(10, parseInt(tab_id).toString().length - 1)) * Math.pow(10, parseInt(tab_id).toString().length - 1);
		tabs_offset = parseInt(tabs_offset / 100) * 100;
		var counter = tabs_offset + parseInt(parseInt(tab_id) / Math.pow(10, parseInt(tab_id).toString().length - 1)) * Math.pow(10, parseInt(tab_id).toString().length - 1);
		while (!done) {
			var this_tab_content = document.getElementById("tabcontent" + counter);
			var this_tab = document.getElementById("tab" + counter);
			if (!this_tab_content || !this_tab) {
				done = true;
				continue;
			}
			if (counter == parseInt(tab_id)) {
				this_tab_content.style.display = '';
				this_tab.className = "currenttab";

				var title_id = "tab_title_" + (tabs_offset + parseInt(parseInt(tab_id) / Math.pow(10, parseInt(tab_id).toString().length - 1)) * Math.pow(10, parseInt(tab_id).toString().length - 1));
				var title_element = document.getElementById(title_id);

				if (title_element) {
					title_element.innerHTML = this_tab.firstChild.text;
				}
			} else {
				this_tab_content.style.display = 'none';
				this_tab.className = "";
			}
			counter++;
		}
	}

	// REWRITE MFL SHOW TAB FUNCTION
	function show_tab(tab_id) {
		var done = false;
		var counter = 0;
		while (!done) {
			var this_tab_content = document.getElementById("tabcontent" + counter);
			var this_tab = document.getElementById("tab" + counter);
			if (!this_tab_content) {
				done = true;
			} else {
				if (counter == tab_id && this_tab) { // Added check for this_tab
					this_tab_content.style.display = '';
					this_tab.className = "currenttab";
					//document.getElementById("tab_title").innerHTML = document.getElementById("tab" + tab_id).firstChild.text;
					document.getElementById("tab_title").innerHTML = document.getElementById("tab" + tab_id).querySelector("a").textContent.trim();
					var elmId = $(".currenttab").attr("id");
					$('#tab_title').removeClass().addClass(elmId);
				} else if (this_tab) { // Added check for this_tab
					this_tab_content.style.display = 'none';
					this_tab.className = "";
				}
			}
			counter++;
		}
		location.hash = tab_id;
	}
} // only use for header.js and option to load tabs script

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END TABS SCRIPT///////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START MOBILE MENU SCRIPT//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

if (load_mobileMenu_script) {
	/////////////////////////////////////////////////
	// MFL MOBILE MENU https://www.mflscripts.com/mfl-apps/mobileMenu/script.js
	/////////////////////////////////////////////////
	if (menuPositionY == undefined) var menuPositionY = 10;
	if (menuPositionIsLeft == undefined) var menuPositionIsLeft = true;
	if (showMenuIcons == undefined) var showMenuIcons = true;
	if (usePopupLogin == undefined) var usePopupLogin = false;
	if (loginNotLoaded === undefined) var loginNotLoaded = true;
	if (MFLPopupNotifyFontAwesome === undefined) var MFLPopupNotifyFontAwesome = '<i class="fa-regular fa-circle-exclamation MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupNotify" aria-hidden="true"></i>';

	if (loginNotLoaded) {
		function createLoginMenu(baseURLDynamic, year, league_id) {
			const slideMenuLogin = document.querySelector('.myfantasyleague_menu > ul');
			const menuHTML = `<li class="has-sub sub-default" id="slide-menu-login"><a>Login</a><b aria-haspopup="true" aria-controls="p50"></b><input id="sub50" type="checkbox"><label for="sub50"><span></span></label><ul id="p50"><li class="user-login"><a class="no-sub" href="${baseURLDynamic}/${year}/login?L=${league_id}">Login to league</a></li></ul></li>`;

			slideMenuLogin.insertAdjacentHTML('beforeend', menuHTML);
		}

		function populateWelcomeLinks(baseURLDynamic, year, league_id) {
			fetch(`${baseURLDynamic}/${year}/home/${league_id}?MODULE=WELCOME`)
				.then(response => response.text())
				.then(data => {
					const parser = new DOMParser();
					const doc = parser.parseFromString(data, 'text/html');
					const welcomeLinks = Array.from(doc.querySelectorAll('#welcome td a'));
					const slideMenuLogins = document.querySelectorAll('#slide-menu-login ul');
					welcomeLinks.forEach(link => {
						const linkHTML = `<li><a class="no-sub" href="${link.href}">${link.textContent}</a></li>`;
						slideMenuLogins.forEach(slideMenu => {
							const userLogin = slideMenu.querySelector('.user-login');
							if (userLogin) userLogin.remove();
							slideMenu.insertAdjacentHTML('beforeend', linkHTML);
						});
					});
				})
				.catch(error => {
					console.error('Error:', error);
				});
		}

		function runLoginLinks() {
			createLoginMenu(baseURLDynamic, year, league_id);
			populateWelcomeLinks(baseURLDynamic, year, league_id);
		}
		runLoginLinks();
	}

	// Create a mobileMenuHTML div and add its content
	const mobileMenuHTML = document.createElement("div");
	mobileMenuHTML.innerHTML = `<div id="menu-trigger" style="display:none"><div class="hamburger hamburger--spin js-hamburger"><div class="hamburger-box"><div class="hamburger-inner"></div></div></div></div><div id="menu-overlay" class="menu-overlayclass" style="display:none"></div><div id="click-blocker" style="display: none;"></div>`;
	document.body.prepend(mobileMenuHTML);

	// Find `.myfantasyleague_menu` and add `.myfantasyleague_menuMobile` with modifications
	const myFantasyLeagueMenu = document.querySelector('.myfantasyleague_menu');
	if (myFantasyLeagueMenu) {
		// Create the `.myfantasyleague_menuMobile` container
		const mobileMenuContainer = document.createElement("div");
		mobileMenuContainer.className = "myfantasyleague_menuMobile";
		myFantasyLeagueMenu.parentNode.insertBefore(mobileMenuContainer, myFantasyLeagueMenu);

		// Copy and modify content
		mobileMenuContainer.innerHTML = myFantasyLeagueMenu.innerHTML;

		// Add a menu arrow to `.has-sub.sub-default > a`
		mobileMenuContainer.querySelectorAll('.has-sub.sub-default > a').forEach(anchor => {
			const menuArrow = document.createElement('span');
			menuArrow.className = 'menu_arrow';
			anchor.appendChild(menuArrow);
		});

		// Append hidden items to `.myfantasyleague_menuMobile > ul`
		const menuMobileUl = mobileMenuContainer.querySelector('ul');
		if (menuMobileUl) {
			menuMobileUl.innerHTML += `<li class="has-sub sub-default" style="visibility:hidden"><a>Blank</a><ul></ul></li><li class="has-sub sub-default" style="visibility:hidden"><a>Blank</a><ul></ul></li>`;
		}

		// Hide all `.has-sub.sub-default ul`
		mobileMenuContainer.querySelectorAll('.has-sub.sub-default ul').forEach(ul => {
			ul.style.display = 'none';
		});

		// Replace specific anchor links containing "League" and "Chat"
		const leagueChatLinks = Array.from(mobileMenuContainer.querySelectorAll('a')).filter(link =>
			link.textContent.includes('League') && link.textContent.includes('Chat')
		);
		leagueChatLinks.forEach(link => {
			const newLink = document.createElement('a');
			newLink.href = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=LEAGUE_CHAT`;
			newLink.textContent = 'League Chat';
			newLink.target = '_blank';
			newLink.onclick = function () {
				openChatWindow(this);
				return false;
			};
			link.replaceWith(newLink);
		});

		// Remove any `<li>` containing "My Leagues" with `$75,000`
		Array.from(mobileMenuContainer.querySelectorAll('ul li')).forEach(li => {
			const anchor = li.querySelector('a');
			if (li.textContent.includes('My Leagues') && anchor?.textContent.includes('$75,000')) {
				li.remove();
			}
		});

		// Add `mm-home` class to the second `.no-sub` anchor's parent element
		const noSubLinks = mobileMenuContainer.querySelectorAll('ul > li a.no-sub');
		if (noSubLinks[1]) {
			noSubLinks[1].parentElement.classList.add('mm-home');
		}

		// Append additional elements to `.myfantasyleague_menuMobile`
		const iconWrapper = document.createElement('div');
		iconWrapper.id = 'icon-wrapper-mobile';
		iconWrapper.style = 'float:left;display:none';
		iconWrapper.innerHTML = `<li class="notification-icon-popup" title="Notifications" style="display:none"><span onclick="MFLPlayerPopupPopulateOnload(true)">${MFLPopupNotifyFontAwesome}</span></li><li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/mb/message_list.pl?bid=${year}${league_id}'" class="notification-icon-new-mb-private-message addon-icons-mobile" title="New Private Message!"><i class="fa-regular fa-inbox fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/options?L=${league_id}&O=28'" class="notification-icon-new-mb-message addon-icons-mobile" title="New Message Board Post!"><i class="fa-regular fa-comments fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/options?L=${league_id}&O=69'" class="notification-icon-new-poll addon-icons-mobile" title="Vote Required!"><i class="fa-regular fa-check-to-slot fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/csetup?L=${league_id}&C=REVTRAD'" class="notification-pending-trade addon-icons-mobile" title="Pending Trade to Approve!"><i class="fa-regular fa-triangle-exclamation fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="alert('You have ${leagueAttributes["PendingTradesAwaitingCommishApproval"]} trade(s) awaiting Commissioner Approval!')" class="notification-awaiting-approval addon-icons-mobile" title="Trade(s) Awaiting Commissioner Approval!"><i class="fa-regular fa-hourglass-half fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/options?L=${league_id}&O=05'" class="notification-outstandings-offers-received addon-icons-mobile" title="You have been offered a trade!"><i class="fa-regular fa-handshake fa-beat MFLPopupFontAwesomeMenu"></i></li>`;
		mobileMenuContainer.appendChild(iconWrapper);
	}

	function MobileMenuslideUp(element, duration = 500) {
		element.style.height = `${element.offsetHeight}px`; // Set the current height
		element.offsetHeight; // Trigger reflow
		element.style.transition = `height ${duration}ms ease`;
		element.style.overflow = 'hidden';
		element.style.height = '0';

		setTimeout(() => {
			element.style.display = 'none'; // Hide after animation
			element.style.removeProperty('height');
			element.style.removeProperty('overflow');
			element.style.removeProperty('transition');
		}, duration);
	}

	function MobileMenuslideDown(element, duration = 500) {
		// If already visible, do nothing
		if (window.getComputedStyle(element).display !== 'none') return;

		element.style.display = 'block'; // Ensure it's visible to measure height
		const height = element.scrollHeight; // Measure full height (including overflowing content)
		element.style.height = '0'; // Start at 0 height
		element.style.overflow = 'hidden';
		element.style.transition = `height ${duration}ms ease`;

		// Trigger reflow to apply starting height
		element.offsetHeight;

		// Animate to full height
		element.style.height = `${height}px`;

		setTimeout(() => {
			element.style.removeProperty('height');
			element.style.removeProperty('overflow');
			element.style.removeProperty('transition');
		}, duration);
	}

	// CLICK TO EXPAND AND COLLAPSE OUTER LI
	document.querySelectorAll('.myfantasyleague_menuMobile > ul > li.has-sub.sub-default > a').forEach(anchor => {
		anchor.addEventListener('click', function () {
			const liElements = document.querySelectorAll('.myfantasyleague_menuMobile > ul > li');
			const firstLevelUls = document.querySelectorAll('.myfantasyleague_menuMobile > ul > li.has-sub.sub-default > ul');
			const secondLevelUls = document.querySelectorAll('.myfantasyleague_menuMobile > ul > li.has-sub.sub-default > ul > li > ul');
			const thisUl = this.parentElement.querySelector('ul');

			// Disable pointer events on all `li` elements
			liElements.forEach(li => li.style.pointerEvents = 'none');

			// SLIDE EVERYTHING UP
			firstLevelUls.forEach(ul => {
				if (ul !== thisUl) {
					MobileMenuslideUp(ul);
					ul.classList.remove('thisExpanded', 'lastClicked');
				}
			});
			secondLevelUls.forEach(ul => {
				MobileMenuslideUp(ul);
				ul.classList.remove('thisExpanded', 'lastClicked');
			});

			// APPLY CURRENT CLICK
			if (thisUl.classList.contains('thisExpanded')) {
				MobileMenuslideUp(thisUl);
				thisUl.classList.remove('thisExpanded');
			} else {
				MobileMenuslideDown(thisUl);
				thisUl.classList.add('thisExpanded');
			}

			// REMOVE LAST CLICKED FROM ALL UL'S THEN ADD BACK TO CURRENT UL
			thisUl.classList.add('lastClicked');

			// REMOVE EXPANDED CLASS FROM ALL UL'S EXCEPT FOR CURRENT UL
			firstLevelUls.forEach(ul => {
				if (!ul.classList.contains('lastClicked')) {
					ul.classList.remove('thisExpanded');
				}
			});
			secondLevelUls.forEach(ul => {
				ul.classList.remove('thisExpanded');
			});

			// ADD CLASS FOR ARROW RIGHT AND DOWN
			document.querySelectorAll('ul').forEach(ul => {
				ul.parentElement.classList.remove('arrow-down');
			});
			document.querySelectorAll('ul.thisExpanded').forEach(ul => {
				ul.parentElement.classList.add('arrow-down');
			});
			document.querySelectorAll('li').forEach(li => {
				li.classList.remove('sub-arrow-down');
			});

			// Re-enable pointer events after animation
			setTimeout(() => {
				liElements.forEach(li => li.style.removeProperty('pointer-events'));
			}, 500); // Match animation duration
		});
	});

	// CLICK TO EXPAND AND COLLAPSE INNER LI
	document.querySelectorAll('.myfantasyleague_menuMobile > ul > li.has-sub.sub-default > ul > li > a').forEach(innerAnchor => {
		innerAnchor.addEventListener('click', function (event) {
			// Prevent the click from bubbling to outer elements
			event.stopPropagation();
			const secondLevelUls = document.querySelectorAll('.myfantasyleague_menuMobile > ul > li.has-sub.sub-default > ul > li > ul');
			const thisUl = this.parentElement.querySelector('ul');
			// SLIDE EVERYTHING UP
			secondLevelUls.forEach(ul => {
				if (ul !== thisUl) {
					MobileMenuslideUp(ul);
					ul.classList.remove('thisExpanded', 'lastClicked');
				}
			});
			// APPLY CURRENT CLICK
			if (thisUl && thisUl.classList.contains('thisExpanded')) {
				MobileMenuslideUp(thisUl);
				thisUl.classList.remove('thisExpanded');
			} else if (thisUl) {
				MobileMenuslideDown(thisUl);
				thisUl.classList.add('thisExpanded');
			}
			// REMOVE LAST CLICKED FROM ALL UL'S THEN ADD BACK TO CURRENT UL
			secondLevelUls.forEach(ul => ul.classList.remove('lastClicked'));
			if (thisUl) thisUl.classList.add('lastClicked');
			// REMOVE EXPANDED CLASS FROM ALL UL'S EXCEPT FOR CURRENT UL
			secondLevelUls.forEach(ul => {
				if (!ul.classList.contains('lastClicked')) {
					ul.classList.remove('thisExpanded');
				}
			});
			// ADD CLASS FOR ARROW RIGHT AND DOWN
			document.querySelectorAll('ul').forEach(ul => {
				ul.parentElement.classList.remove('sub-arrow-down');
			});
			document.querySelectorAll('ul.thisExpanded').forEach(ul => {
				ul.parentElement.classList.add('sub-arrow-down');
			});
		});
	});

	function animateMargin(elements, property, delta, duration) {
		elements.forEach(element => {
			const computedStyle = getComputedStyle(element);
			const startMargin = parseFloat(computedStyle[property].replace('px', '')) || 0;
			const targetMargin = startMargin + delta;

			const startTime = performance.now();

			function update(currentTime) {
				const elapsedTime = currentTime - startTime;
				const progress = Math.min(elapsedTime / duration, 1); // Progress in range [0, 1]
				const currentMargin = startMargin + (delta * progress);

				element.style[property] = `${currentMargin}px`;

				if (progress < 1) {
					requestAnimationFrame(update);
				}
			}

			requestAnimationFrame(update);
		});
	}

	document.querySelector('#menu-trigger').addEventListener('click', function () {
		const menuTrigger = document.querySelector('#menu-trigger');
		const mobileMenu = document.querySelector('.myfantasyleague_menuMobile');
		const overlay = document.querySelector('#menu-overlay');
		const htmlBody = document.querySelector('html, body');
		const hamburger = document.querySelector('.hamburger');
		const skinSelectorContainer = document.querySelector('.skinSelectorContainer');

		// Calculate the width of the menu trigger dynamically
		const triggerWidth = parseFloat(getComputedStyle(menuTrigger).width);
		const menuWidth = parseFloat(getComputedStyle(mobileMenu).width);

		// Combine triggerWidth and menuWidth to get the sliding distance
		const distance = Math.max(triggerWidth, menuWidth);

		// Determine if the menu is open based on the trigger's margins
		const triggerMarginRight = parseFloat(getComputedStyle(menuTrigger).marginRight) || 0;
		const triggerMarginLeft = parseFloat(getComputedStyle(menuTrigger).marginLeft) || 0;
		const isOpen = triggerMarginRight === distance || triggerMarginLeft === distance;

		if (isOpen) {
			// Slide out (close)
			if (menuPositionIsLeft) {
				animateMargin([menuTrigger, mobileMenu], "marginLeft", -distance, 400);
			} else {
				animateMargin([menuTrigger, mobileMenu], "marginRight", -distance, 400);
			}
			htmlBody.classList.remove('mobile-menu-open');
		} else {
			// Slide in (open)
			if (menuPositionIsLeft) {
				animateMargin([menuTrigger, mobileMenu], "marginLeft", distance, 400);
			} else {
				animateMargin([menuTrigger, mobileMenu], "marginRight", distance, 400);
			}
			htmlBody.classList.add('mobile-menu-open');
		}

		// Toggle overlay visibility
		overlay.style.display = isOpen ? 'none' : 'block';

		// Reset UI elements
		if (skinSelectorContainer) skinSelectorContainer.style.display = 'none';

		document.querySelectorAll('.myfantasyleague_menuMobile ul li').forEach(li => {
			li.classList.remove('arrow-down', 'sub-arrow-down');
		});

		document.querySelectorAll('.myfantasyleague_menuMobile ul li.has-sub.sub-default ul').forEach(ul => {
			ul.classList.remove('thisExpanded');
			ul.style.display = 'none'; // Equivalent to slideUp
		});

		hamburger.classList.toggle('is-active');
	});

	document.querySelector('#menu-overlay').addEventListener('click', function () {
		const menuTrigger = document.querySelector('#menu-trigger');
		const mobileMenu = document.querySelector('.myfantasyleague_menuMobile');
		const overlay = document.querySelector('#menu-overlay');
		const clickBlocker = document.querySelector('#click-blocker');
		const htmlBody = document.querySelector('html, body');
		const hamburger = document.querySelector('.hamburger');
		const skinSelectorContainer = document.querySelector('.skinSelectorContainer');

		const distance = 15.625 * 16; // Convert rem to pixels (15.625rem = 250px)

		clickBlocker.style.display = 'block';

		// Slide out (close)
		if (menuPositionIsLeft) {
			animateMargin([menuTrigger, mobileMenu], "marginLeft", -distance, 400);
		} else {
			animateMargin([menuTrigger, mobileMenu], "marginRight", -distance, 400);
		}

		overlay.style.display = 'none';

		// Reset UI elements
		if (skinSelectorContainer) skinSelectorContainer.style.display = 'none';

		document.querySelectorAll('.myfantasyleague_menuMobile ul li').forEach(li => {
			li.classList.remove('arrow-down', 'sub-arrow-down');
		});

		document.querySelectorAll('.myfantasyleague_menuMobile ul li.has-sub.sub-default ul').forEach(ul => {
			ul.classList.remove('thisExpanded');
			ul.style.display = 'none'; // Equivalent to slideUp
		});

		htmlBody.classList.remove('mobile-menu-open');

		setTimeout(() => {
			clickBlocker.style.display = 'none';
		}, 400);

		hamburger.classList.remove('is-active');
	});

	const mobileMenuStyle = document.createElement('style');
	mobileMenuStyle.textContent = `.myfantasyleague_menuMobile li a{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.myfantasyleague_menuMobile{display:none;position:fixed;z-index:99999999;width:15.625rem;overflow-y:auto;-webkit-overflow-scrolling:touch;height:100%}#menu-trigger{position:fixed;top: ${menuPositionY}${useREM ? "rem" : "px"};padding:0.313rem;z-index:9999999;cursor:pointer;font-size:2.25rem;line-height:2.5rem;height:3rem;width:2.625rem;text-align:center}.myfantasyleague_menuMobile #icon-wrapper-mobile{position:absolute;left:auto;display:block;z-index:1;font-size:1.5rem;top:0;right:0.438rem}.myfantasyleague_menuMobile #icon-wrapper-mobile i{line-height:2.563rem;padding-top:0}.myfantasyleague_menuMobile #skinSelectorContainer{margin:0;position:fixed;top:2.5rem;}.myfantasyleague_menuMobile li.notification-icon-search,.myfantasyleague_menuMobile .toggle_module_search{display:none!important}.myfantasyleague_menuMobile #icon-wrapper-mobile img{margin:0!important}.myfantasyleague_menuMobile li{list-style:none;cursor:pointer}.myfantasyleague_menuMobile li,.myfantasyleague_menuMobile ul{margin:0;padding:0}.myfantasyleague_menuMobile a{text-overflow: ellipsis;text-decoration:none;padding-right:0.625rem;display:block;-webkit-transition: background-color 300ms linear;-ms-transition: background-color 300ms linear;transition: background-color 300ms linear;}#menu-overlay{height:100%;width:100%;position:fixed;left:0;top:0;background:rgba(0,0,0,.6);z-index:999999}.myfantasyleague_menuMobile > ul > li > a,.myfantasyleague_menuMobile > ul > li > a:active,.myfantasyleague_menuMobile > ul > li > a:visited,.myfantasyleague_menuMobile > ul > li > a:hover{text-indent:0.313rem;font-size:1.25rem;line-height:2.5rem}.myfantasyleague_menuMobile > ul > li > ul > li > a,.myfantasyleague_menuMobile > ul > li > ul > li > a:active,.myfantasyleague_menuMobile > ul > li > ul > li > a:visited,.myfantasyleague_menuMobile > ul > li > ul > li > a:hover{font-size:1rem;line-height:2.125rem;padding-left:0.625rem}.myfantasyleague_menuMobile > ul > li > ul > li > ul > li > a,.myfantasyleague_menuMobile > ul > li > ul > li > ul > li > a:active,.myfantasyleague_menuMobile > ul > li > ul > li > ul > li > a:visited,.myfantasyleague_menuMobile > ul > li > ul > li > ul > li > a:hover{padding-left:0.938rem;font-size:0.875rem;line-height:1.75rem}.myfantasyleague_menuMobile > ul > li.has-sub > a{position:relative}.myfantasyleague_menuMobile #icon-wrapper-mobile span{display:inline-block}.myfantasyleague_menuMobile #skinSelectorOptions span,.myfantasyleague_menuMobile #skinSelectorContainer input{vertial-align:top}.myfantasyleague_menuMobile .mfl-icon,.myfantasyleague_menuMobile span,.myfantasyleague_menuMobile input[type="checkbox"],.myfantasyleague_menuMobile label{display:none}@media only screen and (max-width: 48em){.mobile-menu-open{position:fixed;overflow:hidden;height:100%;width:100%}}#click-blocker{position:fixed;top:0;bottom:0;left:0;right:0;z-index:100000}@media only screen and (min-width: 48.1em){#menu-overlay{display:none!important}}.hamburger-inner,.hamburger-inner::before,.hamburger-inner::after{background:var(--accent,#B82601)}.hamburger.is-active .hamburger-inner,.hamburger.is-active .hamburger-inner::before,.hamburger.is-active .hamburger-inner::after{background:var(--accent,#B82601)}.hamburger{cursor:pointer;transition-property:opacity,filter;transition-duration:.15s;transition-timing-function:linear;font:inherit;color:inherit;text-transform:none;background-color:transparent;border:0;margin:0;overflow:visible}.hamburger-box{width:2.5rem;height:1.5rem}.hamburger-inner{top:0;bottom:0;left:0;right:0;margin:auto}.hamburger-inner,.hamburger-inner::before,.hamburger-inner::after{width:1.563rem;height:0.25rem;border-radius:0;position:absolute;transition-property:transform;transition-duration:.15s;transition-timing-function:ease}.hamburger-inner::before,.hamburger-inner::after{content:"";display:block}.hamburger-inner::before{top:-0.625rem}.hamburger-inner::after{bottom:-0.625rem}.hamburger--3dx .hamburger-box{perspective:5rem}.hamburger--3dx .hamburger-inner{transition:transform .15s cubic-bezier(0.645,0.045,0.355,1),background-color 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dx .hamburger-inner::before,.hamburger--3dx .hamburger-inner::after{transition:transform 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dx.is-active .hamburger-inner{background-color:transparent!important;transform:rotateY(180deg)}.hamburger--3dx.is-active .hamburger-inner::before{transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--3dx.is-active .hamburger-inner::after{transform:translate3d(0,-0.625rem,0) rotate(-45deg)}.hamburger--3dx-r .hamburger-box{perspective:5rem}.hamburger--3dx-r .hamburger-inner{transition:transform .15s cubic-bezier(0.645,0.045,0.355,1),background-color 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dx-r .hamburger-inner::before,.hamburger--3dx-r .hamburger-inner::after{transition:transform 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dx-r.is-active .hamburger-inner{background-color:transparent!important;transform:rotateY(-180deg)}.hamburger--3dx-r.is-active .hamburger-inner::before{transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--3dx-r.is-active .hamburger-inner::after{transform:translate3d(0,-0.625rem,0) rotate(-45deg)}.hamburger--3dy .hamburger-box{perspective:5rem}.hamburger--3dy .hamburger-inner{transition:transform .15s cubic-bezier(0.645,0.045,0.355,1),background-color 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dy .hamburger-inner::before,.hamburger--3dy .hamburger-inner::after{transition:transform 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dy.is-active .hamburger-inner{background-color:transparent!important;transform:rotateX(-180deg)}.hamburger--3dy.is-active .hamburger-inner::before{transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--3dy.is-active .hamburger-inner::after{transform:translate3d(0,-0.625rem,0) rotate(-45deg)}.hamburger--3dy-r .hamburger-box{perspective:5rem}.hamburger--3dy-r .hamburger-inner{transition:transform .15s cubic-bezier(0.645,0.045,0.355,1),background-color 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dy-r .hamburger-inner::before,.hamburger--3dy-r .hamburger-inner::after{transition:transform 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dy-r.is-active .hamburger-inner{background-color:transparent!important;transform:rotateX(180deg)}.hamburger--3dy-r.is-active .hamburger-inner::before{transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--3dy-r.is-active .hamburger-inner::after{transform:translate3d(0,-0.625rem,0) rotate(-45deg)}.hamburger--3dxy .hamburger-box{perspective:5rem}.hamburger--3dxy .hamburger-inner{transition:transform .15s cubic-bezier(0.645,0.045,0.355,1),background-color 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dxy .hamburger-inner::before,.hamburger--3dxy .hamburger-inner::after{transition:transform 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dxy.is-active .hamburger-inner{background-color:transparent!important;transform:rotateX(180deg) rotateY(180deg)}.hamburger--3dxy.is-active .hamburger-inner::before{transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--3dxy.is-active .hamburger-inner::after{transform:translate3d(0,-0.625rem,0) rotate(-45deg)}.hamburger--3dxy-r .hamburger-box{perspective:5rem}.hamburger--3dxy-r .hamburger-inner{transition:transform .15s cubic-bezier(0.645,0.045,0.355,1),background-color 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dxy-r .hamburger-inner::before,.hamburger--3dxy-r .hamburger-inner::after{transition:transform 0 .1s cubic-bezier(0.645,0.045,0.355,1)}.hamburger--3dxy-r.is-active .hamburger-inner{background-color:transparent!important;transform:rotateX(180deg) rotateY(180deg) rotateZ(-180deg)}.hamburger--3dxy-r.is-active .hamburger-inner::before{transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--3dxy-r.is-active .hamburger-inner::after{transform:translate3d(0,-0.625rem,0) rotate(-45deg)}.hamburger--arrow.is-active .hamburger-inner::before{transform:translate3d(-0.5rem,0,0) rotate(-45deg) scale(0.7,1)}.hamburger--arrow.is-active .hamburger-inner::after{transform:translate3d(-0.5rem,0,0) rotate(45deg) scale(0.7,1)}.hamburger--arrow-r.is-active .hamburger-inner::before{transform:translate3d(0.5rem,0,0) rotate(45deg) scale(0.7,1)}.hamburger--arrow-r.is-active .hamburger-inner::after{transform:translate3d(0.5rem,0,0) rotate(-45deg) scale(0.7,1)}.hamburger--arrowalt .hamburger-inner::before{transition:top .1s .1s ease,transform .1s cubic-bezier(0.165,0.84,0.44,1)}.hamburger--arrowalt .hamburger-inner::after{transition:bottom .1s .1s ease,transform .1s cubic-bezier(0.165,0.84,0.44,1)}.hamburger--arrowalt.is-active .hamburger-inner::before{top:0;transform:translate3d(-0.5rem,-0.625rem,0) rotate(-45deg) scale(0.7,1);transition:top .1s ease,transform .1s .1s cubic-bezier(0.895,0.03,0.685,0.22)}.hamburger--arrowalt.is-active .hamburger-inner::after{bottom:0;transform:translate3d(-0.5rem,0.625rem,0) rotate(45deg) scale(0.7,1);transition:bottom .1s ease,transform .1s .1s cubic-bezier(0.895,0.03,0.685,0.22)}.hamburger--arrowalt-r .hamburger-inner::before{transition:top .1s .1s ease,transform .1s cubic-bezier(0.165,0.84,0.44,1)}.hamburger--arrowalt-r .hamburger-inner::after{transition:bottom .1s .1s ease,transform .1s cubic-bezier(0.165,0.84,0.44,1)}.hamburger--arrowalt-r.is-active .hamburger-inner::before{top:0;transform:translate3d(0.5rem,-0.625rem,0) rotate(45deg) scale(0.7,1);transition:top .1s ease,transform .1s .1s cubic-bezier(0.895,0.03,0.685,0.22)}.hamburger--arrowalt-r.is-active .hamburger-inner::after{bottom:0;transform:translate3d(0.5rem,0.625rem,0) rotate(-45deg) scale(0.7,1);transition:bottom .1s ease,transform .1s .1s cubic-bezier(0.895,0.03,0.685,0.22)}.hamburger--arrowturn.is-active .hamburger-inner{transform:rotate(-180deg)}.hamburger--arrowturn.is-active .hamburger-inner::before{transform:translate3d(0.5rem,0,0) rotate(45deg) scale(0.7,1)}.hamburger--arrowturn.is-active .hamburger-inner::after{transform:translate3d(0.5rem,0,0) rotate(-45deg) scale(0.7,1)}.hamburger--arrowturn-r.is-active .hamburger-inner{transform:rotate(-180deg)}.hamburger--arrowturn-r.is-active .hamburger-inner::before{transform:translate3d(-0.5rem,0,0) rotate(-45deg) scale(0.7,1)}.hamburger--arrowturn-r.is-active .hamburger-inner::after{transform:translate3d(-0.5rem,0,0) rotate(45deg) scale(0.7,1)}.hamburger--boring .hamburger-inner,.hamburger--boring .hamburger-inner::before,.hamburger--boring .hamburger-inner::after{transition-property:none}.hamburger--boring.is-active .hamburger-inner{transform:rotate(45deg)}.hamburger--boring.is-active .hamburger-inner::before{top:0;opacity:0}.hamburger--boring.is-active .hamburger-inner::after{bottom:0;transform:rotate(-90deg)}.hamburger--collapse .hamburger-inner{top:auto;bottom:0;transition-duration:.13s;transition-delay:.13s;transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--collapse .hamburger-inner::after{top:-1.25rem;transition:top .2s .2s cubic-bezier(0.33333,0.66667,0.66667,1),opacity .1s linear}.hamburger--collapse .hamburger-inner::before{transition:top .12s .2s cubic-bezier(0.33333,0.66667,0.66667,1),transform .13s cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--collapse.is-active .hamburger-inner{transform:translate3d(0,-0.625rem,0) rotate(-45deg);transition-delay:.22s;transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)}.hamburger--collapse.is-active .hamburger-inner::after{top:0;opacity:0;transition:top .2s cubic-bezier(0.33333,0,0.66667,0.33333),opacity .1s .22s linear}.hamburger--collapse.is-active .hamburger-inner::before{top:0;transform:rotate(-90deg);transition:top .1s .16s cubic-bezier(0.33333,0,0.66667,0.33333),transform .13s .25s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--collapse-r .hamburger-inner{top:auto;bottom:0;transition-duration:.13s;transition-delay:.13s;transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--collapse-r .hamburger-inner::after{top:-1.25rem;transition:top .2s .2s cubic-bezier(0.33333,0.66667,0.66667,1),opacity .1s linear}.hamburger--collapse-r .hamburger-inner::before{transition:top .12s .2s cubic-bezier(0.33333,0.66667,0.66667,1),transform .13s cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--collapse-r.is-active .hamburger-inner{transform:translate3d(0,-0.625rem,0) rotate(45deg);transition-delay:.22s;transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)}.hamburger--collapse-r.is-active .hamburger-inner::after{top:0;opacity:0;transition:top .2s cubic-bezier(0.33333,0,0.66667,0.33333),opacity .1s .22s linear}.hamburger--collapse-r.is-active .hamburger-inner::before{top:0;transform:rotate(90deg);transition:top .1s .16s cubic-bezier(0.33333,0,0.66667,0.33333),transform .13s .25s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--elastic .hamburger-inner{top:0.125rem;transition-duration:.275s;transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)}.hamburger--elastic .hamburger-inner::before{top:0.625rem;transition:opacity .125s .275s ease}.hamburger--elastic .hamburger-inner::after{top:1.25rem;transition:transform .275s cubic-bezier(0.68,-0.55,0.265,1.55)}.hamburger--elastic.is-active .hamburger-inner{transform:translate3d(0,0.625rem,0) rotate(135deg);transition-delay:.075s}.hamburger--elastic.is-active .hamburger-inner::before{transition-delay:0;opacity:0}.hamburger--elastic.is-active .hamburger-inner::after{transform:translate3d(0,-1.25rem,0) rotate(-270deg);transition-delay:.075s}.hamburger--elastic-r .hamburger-inner{top:0.125rem;transition-duration:.275s;transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)}.hamburger--elastic-r .hamburger-inner::before{top:0.625rem;transition:opacity .125s .275s ease}.hamburger--elastic-r .hamburger-inner::after{top:1.25rem;transition:transform .275s cubic-bezier(0.68,-0.55,0.265,1.55)}.hamburger--elastic-r.is-active .hamburger-inner{transform:translate3d(0,0.625rem,0) rotate(-135deg);transition-delay:.075s}.hamburger--elastic-r.is-active .hamburger-inner::before{transition-delay:0;opacity:0}.hamburger--elastic-r.is-active .hamburger-inner::after{transform:translate3d(0,-1.25rem,0) rotate(270deg);transition-delay:.075s}.hamburger--emphatic{overflow:hidden}.hamburger--emphatic .hamburger-inner{transition:background-color .125s .175s ease-in}.hamburger--emphatic .hamburger-inner::before{left:0;transition:transform .125s cubic-bezier(0.6,0.04,0.98,0.335),top .05s .125s linear,left .125s .175s ease-in}.hamburger--emphatic .hamburger-inner::after{top:0.625rem;right:0;transition:transform .125s cubic-bezier(0.6,0.04,0.98,0.335),top .05s .125s linear,right .125s .175s ease-in}.hamburger--emphatic.is-active .hamburger-inner{transition-delay:0;transition-timing-function:ease-out;background-color:transparent!important}.hamburger--emphatic.is-active .hamburger-inner::before{left:-5rem;top:-5rem;transform:translate3d(5rem,5rem,0) rotate(45deg);transition:left .125s ease-out,top .05s .125s linear,transform .125s .175s cubic-bezier(0.075,0.82,0.165,1)}.hamburger--emphatic.is-active .hamburger-inner::after{right:-5rem;top:-5rem;transform:translate3d(-5rem,5rem,0) rotate(-45deg);transition:right .125s ease-out,top .05s .125s linear,transform .125s .175s cubic-bezier(0.075,0.82,0.165,1)}.hamburger--emphatic-r{overflow:hidden}.hamburger--emphatic-r .hamburger-inner{transition:background-color .125s .175s ease-in}.hamburger--emphatic-r .hamburger-inner::before{left:0;transition:transform .125s cubic-bezier(0.6,0.04,0.98,0.335),top .05s .125s linear,left .125s .175s ease-in}.hamburger--emphatic-r .hamburger-inner::after{top:0.625rem;right:0;transition:transform .125s cubic-bezier(0.6,0.04,0.98,0.335),top .05s .125s linear,right .125s .175s ease-in}.hamburger--emphatic-r.is-active .hamburger-inner{transition-delay:0;transition-timing-function:ease-out;background-color:transparent!important}.hamburger--emphatic-r.is-active .hamburger-inner::before{left:-5rem;top:5rem;transform:translate3d(5rem,-5rem,0) rotate(-45deg);transition:left .125s ease-out,top .05s .125s linear,transform .125s .175s cubic-bezier(0.075,0.82,0.165,1)}.hamburger--emphatic-r.is-active .hamburger-inner::after{right:-5rem;top:5rem;transform:translate3d(-5rem,-5rem,0) rotate(45deg);transition:right .125s ease-out,top .05s .125s linear,transform .125s .175s cubic-bezier(0.075,0.82,0.165,1)}.hamburger--minus .hamburger-inner::before,.hamburger--minus .hamburger-inner::after{transition:bottom .08s 0 ease-out,top .08s 0 ease-out,opacity 0 linear}.hamburger--minus.is-active .hamburger-inner::before,.hamburger--minus.is-active .hamburger-inner::after{opacity:0;transition:bottom .08s ease-out,top .08s ease-out,opacity 0 .08s linear}.hamburger--minus.is-active .hamburger-inner::before{top:0}.hamburger--minus.is-active .hamburger-inner::after{bottom:0}.hamburger--slider .hamburger-inner{top:0.125rem}.hamburger--slider .hamburger-inner::before{top:0.625rem;transition-property:transform,opacity;transition-timing-function:ease;transition-duration:.15s}.hamburger--slider .hamburger-inner::after{top:1.25rem}.hamburger--slider.is-active .hamburger-inner{transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--slider.is-active .hamburger-inner::before{transform:rotate(-45deg) translate3d(-0.357rem,-0.375rem,0);opacity:0}.hamburger--slider.is-active .hamburger-inner::after{transform:translate3d(0,-1.25rem,0) rotate(-90deg)}.hamburger--slider-r .hamburger-inner{top:0.125rem}.hamburger--slider-r .hamburger-inner::before{top:0.625rem;transition-property:transform,opacity;transition-timing-function:ease;transition-duration:.15s}.hamburger--slider-r .hamburger-inner::after{top:1.25rem}.hamburger--slider-r.is-active .hamburger-inner{transform:translate3d(0,0.625rem,0) rotate(-45deg)}.hamburger--slider-r.is-active .hamburger-inner::before{transform:rotate(45deg) translate3d(0.357rem,-0.375rem,0);opacity:0}.hamburger--slider-r.is-active .hamburger-inner::after{transform:translate3d(0,-1.25rem,0) rotate(90deg)}.hamburger--spin .hamburger-inner{transition-duration:.22s;transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spin .hamburger-inner::before{transition:top .1s .25s ease-in,opacity .1s ease-in}.hamburger--spin .hamburger-inner::after{transition:bottom .1s .25s ease-in,transform .22s cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spin.is-active .hamburger-inner{transform:rotate(225deg);transition-delay:.12s;transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)}.hamburger--spin.is-active .hamburger-inner::before{top:0;opacity:0;transition:top .1s ease-out,opacity .1s .12s ease-out}.hamburger--spin.is-active .hamburger-inner::after{bottom:0;transform:rotate(-90deg);transition:bottom .1s ease-out,transform .22s .12s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--spin-r .hamburger-inner{transition-duration:.22s;transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spin-r .hamburger-inner::before{transition:top .1s .25s ease-in,opacity .1s ease-in}.hamburger--spin-r .hamburger-inner::after{transition:bottom .1s .25s ease-in,transform .22s cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spin-r.is-active .hamburger-inner{transform:rotate(-225deg);transition-delay:.12s;transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)}.hamburger--spin-r.is-active .hamburger-inner::before{top:0;opacity:0;transition:top .1s ease-out,opacity .1s .12s ease-out}.hamburger--spin-r.is-active .hamburger-inner::after{bottom:0;transform:rotate(90deg);transition:bottom .1s ease-out,transform .22s .12s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--spring .hamburger-inner{top:0.125rem;transition:background-color 0 .13s linear}.hamburger--spring .hamburger-inner::before{top:0.625rem;transition:top .1s .2s cubic-bezier(0.33333,0.66667,0.66667,1),transform .13s cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spring .hamburger-inner::after{top:1.25rem;transition:top .2s .2s cubic-bezier(0.33333,0.66667,0.66667,1),transform .13s cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spring.is-active .hamburger-inner{transition-delay:.22s;background-color:transparent!important}.hamburger--spring.is-active .hamburger-inner::before{top:0;transition:top .1s .15s cubic-bezier(0.33333,0,0.66667,0.33333),transform .13s .22s cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0.625rem,0) rotate(45deg)}.hamburger--spring.is-active .hamburger-inner::after{top:0;transition:top .2s cubic-bezier(0.33333,0,0.66667,0.33333),transform .13s .22s cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0.625rem,0) rotate(-45deg)}.hamburger--spring-r .hamburger-inner{top:auto;bottom:0;transition-duration:.13s;transition-delay:0;transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spring-r .hamburger-inner::after{top:-1.25rem;transition:top .2s .2s cubic-bezier(0.33333,0.66667,0.66667,1),opacity 0 linear}.hamburger--spring-r .hamburger-inner::before{transition:top .1s .2s cubic-bezier(0.33333,0.66667,0.66667,1),transform .13s cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--spring-r.is-active .hamburger-inner{transform:translate3d(0,-0.625rem,0) rotate(-45deg);transition-delay:.22s;transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)}.hamburger--spring-r.is-active .hamburger-inner::after{top:0;opacity:0;transition:top .2s cubic-bezier(0.33333,0,0.66667,0.33333),opacity 0 .22s linear}.hamburger--spring-r.is-active .hamburger-inner::before{top:0;transform:rotate(90deg);transition:top .1s .15s cubic-bezier(0.33333,0,0.66667,0.33333),transform .13s .22s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--stand .hamburger-inner{transition:transform .075s .15s cubic-bezier(0.55,0.055,0.675,0.19),background-color 0 .075s linear}.hamburger--stand .hamburger-inner::before{transition:top .075s .075s ease-in,transform .075s 0 cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--stand .hamburger-inner::after{transition:bottom .075s .075s ease-in,transform .075s 0 cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--stand.is-active .hamburger-inner{transform:rotate(90deg);background-color:transparent!important;transition:transform .075s 0 cubic-bezier(0.215,0.61,0.355,1),background-color 0 .15s linear}.hamburger--stand.is-active .hamburger-inner::before{top:0;transform:rotate(-45deg);transition:top .075s .1s ease-out,transform .075s .15s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--stand.is-active .hamburger-inner::after{bottom:0;transform:rotate(45deg);transition:bottom .075s .1s ease-out,transform .075s .15s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--stand-r .hamburger-inner{transition:transform .075s .15s cubic-bezier(0.55,0.055,0.675,0.19),background-color 0 .075s linear}.hamburger--stand-r .hamburger-inner::before{transition:top .075s .075s ease-in,transform .075s 0 cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--stand-r .hamburger-inner::after{transition:bottom .075s .075s ease-in,transform .075s 0 cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--stand-r.is-active .hamburger-inner{transform:rotate(-90deg);background-color:transparent!important;transition:transform .075s 0 cubic-bezier(0.215,0.61,0.355,1),background-color 0 .15s linear}.hamburger--stand-r.is-active .hamburger-inner::before{top:0;transform:rotate(-45deg);transition:top .075s .1s ease-out,transform .075s .15s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--stand-r.is-active .hamburger-inner::after{bottom:0;transform:rotate(45deg);transition:bottom .075s .1s ease-out,transform .075s .15s cubic-bezier(0.215,0.61,0.355,1)}.hamburger--squeeze .hamburger-inner{transition-duration:.075s;transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}.hamburger--squeeze .hamburger-inner::before{transition:top .075s .12s ease,opacity .075s ease}.hamburger--squeeze .hamburger-inner::after{transition:bottom .075s .12s ease,transform .075s cubic-bezier(0.55,0.055,0.675,0.19)}`;
	document.head.appendChild(mobileMenuStyle);

	if (menuPositionIsLeft) {
		const mobileMenuStyleFour = document.createElement('style');
		mobileMenuStyleFour.textContent = `.myfantasyleague_menuMobile{border:0;border-right-width:0.125rem;border-style:solid;left:0;margin-left:-15.625rem}#menu-trigger{left:0;border-left:0;-webkit-border-top-right-radius:0.188rem;-webkit-border-bottom-right-radius:0.188rem;-moz-border-radius-topright:0.188rem;-moz-border-radius-bottomright:0.188rem;border-top-right-radius:0.188rem;border-bottom-right-radius:0.188rem}.myfantasyleague_menuMobile #skinSelectorContainer{left:0.938rem}`;
		document.head.appendChild(mobileMenuStyleFour);
	} else {
		const mobileMenuStyleFive = document.createElement('style');
		mobileMenuStyleFive.textContent = `.myfantasyleague_menuMobile{border:0;border-left-width:0.125rem;border-style:solid;right:0;margin-right:-15.625rem}#menu-trigger{right:0;border-right:0;-webkit-border-top-left-radius:0.188rem;-webkit-border-bottom-left-radius:0.188rem;-moz-border-radius-topleft:0.188rem;-moz-border-radius-bottomleft:0.188rem;border-top-left-radius:0.188rem;border-bottom-left-radius:0.188rem}.myfantasyleague_menuMobile #skinSelectorContainer{right:1.875rem}`;
		document.head.appendChild(mobileMenuStyleFive);
	}

	if (showMenuIcons) {
		const mobileMenuStyleTwo = document.createElement('style');
		mobileMenuStyleTwo.textContent = `.myfantasyleague_menuMobile > ul > li > a:before {font-family: "Font Awesome 6 Pro";width: 1.375rem;display: inline-block;text-indent: 0;text-align: center;margin-right: 0.625rem;}.myfantasyleague_menuMobile > ul > li.mm-home > a:before {content: "\\f015";}.myfantasyleague_menuMobile > ul > li.mm-myleagues > a:before {content: "\\f0cb";}.myfantasyleague_menuMobile > ul > li.mm-reports > a:before {content: "\\f080";}.myfantasyleague_menuMobile > ul > li.mm-forowners > a:before {content: "\\f0c0";}.myfantasyleague_menuMobile > ul > li.mm-forcommissioners > a:before {content: "\\f085";}.myfantasyleague_menuMobile > ul > li.mm-communications > a:before {content: "\\f0e6";}.myfantasyleague_menuMobile > ul > li.mm-links > a:before {content: "\\f0c1";}.myfantasyleague_menuMobile > ul > li.mm-help > a:before {content: "\\f29c";}.myfantasyleague_menuMobile > ul > li#slide-menu-login > a:before {content: "\\f30d";}.myfantasyleague_menuMobile > ul > li.mm-login > a:before {content: "\\f30d";}.myfantasyleague_menuMobile > ul > li.mm-thispage > a:before {content: "\\f0f6";}.myfantasyleague_menuMobile > ul > li.mm-player > a:before {content: "\\f0c0";}.myfantasyleague_menuMobile > ul > li.mm-social > a:before {content: "\\f0e6";}.myfantasyleague_menuMobile > ul > li.mm-trans > a:before {content: "\\f2b5";}.myfantasyleague_menuMobile > ul > li.mm-myacct > a:before {content: "\\f007";}.myfantasyleague_menuMobile > ul > li.mm-draft > a:before {content: "\\f0a1";}.myfantasyleague_menuMobile > ul > li.mm-league > a:before {content: "\\f085";}.myfantasyleague_menuMobile > ul > li.mm-scores > a:before {content: "\\e005";font-family: "Font Awesome 6 Pro";}.myfantasyleague_menuMobile > ul > li.mm-franchise > a:before {content: "\\f234";}`;
		document.head.appendChild(mobileMenuStyleTwo);
	}

	if (usePopupLogin) {
		const mobileMenuStyleThree = document.createElement('style');
		mobileMenuStyleThree.textContent = `.myfantasyleague_menu #slide-menu-login{display:none!important}`;
		document.head.appendChild(mobileMenuStyleThree);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

if (load_chat_enhanced) {
	/////////////////////////////////////////////////
	// MFL CHAT  https://www.mflscripts.com/mfl-apps/chat/enhanced.js
	/////////////////////////////////////////////////
	// add styling if url is MODULE=LEAGUE_CHAT
	if (window.location.href.indexOf("MODULE=LEAGUE_CHAT") > -1) {
		if (window.location.href.indexOf("MODULE=LEAGUE_CHAT&NAME") > -1) {} else {
			document.body.classList.add('chat_popup');
			const ChatAppendStyle = document.createElement('style');
			ChatAppendStyle.textContent = "body.chat_popup{background:#fff}body.chat_popup .mobile-wrap {position:absolute;top:0.313rem;width:98%;left:0;right:0;margin:0 auto}body.chat_popup .mobile-wrap .report caption span a{display:none}body.chat_popup .pagebody,body.chat_popup {height:0;min-height:0}";
			document.head.appendChild(ChatAppendStyle);
			const ChatToRemove = document.querySelectorAll('body.chat_popup .pagefooter, body.chat_popup .homepagemessage, body.chat_popup .myfantasyleague_menu, body.chat_popup .pageheader');
			ChatToRemove.forEach((element) => element.remove());
		}
	}

	if (chatAddonInsertImage == undefined) var chatAddonInsertImage = true;
	if (chatAddonInsertLink == undefined) var chatAddonInsertLink = true;
	if (chatAddonCustomEmoji == undefined) var chatAddonCustomEmoji = true;
	if (chatHideVideoLink == undefined) var chatHideVideoLink = true;
	if (chatBottomUp == undefined) var chatBottomUp = true;
	if (chatShowLapsedTime == undefined) var chatShowLapsedTime = true;
	if (chatShowMore == undefined) var chatShowMore = true;
	if (chatDefaultDisplayMessages == undefined) var chatDefaultDisplayMessages = 8;
	if (chatUseFranchiseIcons == undefined) var chatUseFranchiseIcons = true;
	if (chatFranchiseIconHeight == undefined) var chatFranchiseIconHeight = 20;
	if (chatImageMaxHeight == undefined) var chatImageMaxHeight = 50;
	if (chatImageMaxWidth == undefined) var chatImageMaxWidth = 200;
	if (chatElapsedTimeColor == undefined) var chatElapsedTimeColor = "#888";
	if (chatPopupWidth == undefined) var chatPopupWidth = 425;
	if (chatPopupHeight == undefined) var chatPopupHeight = 450;
	if (chatImagePath == undefined) var chatImagePath = 'https://www.mflscripts.com/ImageDirectory/script-images/chat-icons/';
	if (chatEmojiPath == undefined) var chatEmojiPath = 'https://www.mflscripts.com/ImageDirectory/script-images/chat-icons/';
	if (chatEmojiList == undefined) var chatEmojiList = ({
		'bowtie': 'bowtie.png',
		'smile': 'smile.png',
		'laughing': 'laughing.png',
		'blush': 'blush.png',
		'smiley': 'smiley.png',
		'relaxed': 'relaxed.png',
		'smirk': 'smirk.png',
		'heart_eyes': 'heart_eyes.png',
		'kissing_heart': 'kissing_heart.png',
		'kissing_closed_eyes': 'kissing_closed_eyes.png',
		'flushed': 'flushed.png',
		'relieved': 'relieved.png',
		'satisfied': 'satisfied.png',
		'grin': 'grin.png',
		'wink': 'wink.png',
		'stuck_out_tongue_winking_eye': 'stuck_out_tongue_winking_eye.png',
		'stuck_out_tongue_closed_eyes': 'stuck_out_tongue_closed_eyes.png',
		'grinning': 'grinning.png',
		'kissing': 'kissing.png',
		'kissing_smiling_eyes': 'kissing_smiling_eyes.png',
		'stuck_out_tongue': 'stuck_out_tongue.png',
		'sleeping': 'sleeping.png',
		'worried': 'worried.png',
		'frowning': 'frowning.png',
		'anguished': 'anguished.png',
		'_open_mouth': 'open_mouth.png',
		'grimacing': 'grimacing.png',
		'confused': 'confused.png',
		'hushed': 'hushed.png',
		'expressionless': 'expressionless.png',
		'unamused': 'unamused.png',
		'sweat_smile': 'sweat_smile.png',
		'sweat': 'sweat.png',
		'weary': 'weary.png',
		'_pensive': 'pensive.png',
		'disappointed': 'disappointed.png',
		'confounded': 'confounded.png',
		'fearful': 'fearful.png',
		'cold_sweat': 'cold_sweat.png',
		'_persevere': 'persevere.png',
		'joy': 'joy.png',
		'astonished': 'astonished.png',
		'scream': 'scream.png',
		'neckbeard': 'neckbeard.png',
		'tired_face': 'tired_face.png',
		'angry': 'angry.png',
		'rage': 'rage.png',
		'triumph': 'triumph.png',
		'sleepy': 'sleepy.png',
		'yum': 'yum.png',
		'mask': 'mask.png',
		'sunglasses': 'sunglasses.png',
		'dizzy_face': 'dizzy_face.png',
		'imp': 'imp.png',
		'smiling_imp': 'smiling_imp.png',
		'neutral_face': 'neutral_face.png',
		'no_mouth': 'no_mouth.png',
		'innocent': 'innocent.png',
		'alien': 'alien.png',
		'ari': 'ari.png',
		'atl': 'atl.png',
		'bal': 'bal.png',
		'buf': 'buf.png',
		'car': 'car.png',
		'chi': 'chi.png',
		'cin': 'cin.png',
		'cle': 'cle.png',
		'dal': 'dal.png',
		'den': 'den.png',
		'det': 'det.png',
		'gbp': 'gbp.png',
		'hou': 'hou.png',
		'ind': 'ind.png',
		'jac': 'jac.png',
		'kcc': 'kcc.png',
		'lac': 'lac.png',
		'mia': 'mia.png',
		'min': 'min.png',
		'nep': 'nep.png',
		'nos': 'nos.png',
		'nyg': 'nyg.png',
		'nyj': 'nyj.png',
		'_oak': 'oak.png',
		'_phi': 'phi.png',
		'_pit': 'pit.png',
		'lar': 'lar.png',
		'sea': 'sea.png',
		'sfo': 'sfo.png',
		'tbb': 'tbb.png',
		'ten': 'ten.png',
		'was': 'was.png',
		'broken_heart': 'broken_heart.png',
		'boom': 'boom.png',
		'exclamation': 'exclamation.png',
		'question': 'question.png',
		'zzz': 'zzz.png',
		'fire': 'fire.png',
		'shit': 'shit.png',
		'thumbsup': 'thumbsup.png',
		'thumbsdown': 'thumbsdown.png',
		'_ok_hand': 'ok_hand.png',
		'facepunch': 'facepunch.png',
		'fist': 'fist.png',
		'v': 'v.png',
		'_pray': 'pray.png',
		'eyes': 'eyes.png',
		'speech_balloon': 'speech_balloon.png',
		'thought_balloon': 'thought_balloon.png',
		'sunny': 'sunny.png',
		'umbrella': 'umbrella.png',
		'cloud': 'cloud.png',
		'snowflake': 'snowflake.png',
		'snowman': 'snowman.png',
		'zap': 'zap.png',
		'four_leaf_clover': 'four_leaf_clover.png',
		'maple_leaf': 'maple_leaf.png',
		'jack_o_lantern': 'jack_o_lantern.png',
		'ghost': 'ghost.png',
		'santa': 'santa.png',
		'christmas_tree': 'christmas_tree.png',
		'bell': 'bell.png',
		'loudspeaker': 'loudspeaker.png',
		'hourglass': 'hourglass.png',
		'toilet': 'toilet.png',
		'hammer': 'hammer.png',
		'moneybag': 'moneybag.png',
		'football': 'football.png',
		'basketball': 'basketball.png',
		'soccer': 'soccer.png',
		'baseball': 'baseball.png',
		'tennis': 'tennis.png',
		'8ball': '8ball.png',
		'rugby_football': 'rugby_football.png',
		'bowling': 'bowling.png',
		'golf': 'golf.png',
		'trophy': 'trophy.png'
	});

	var chatServerTime = currentServerTime;
	var chatRowAdjustment = 1;
	var chatAddMoreRows = false;
	var chatRowsToAdd = false;
	var chatReversingDirection = false;
	if (parseInt(chatDefaultDisplayMessages) < 2) chatDefaultDisplayMessages = 8;

	if (localStorage.getItem("emojiChat_bottomUp_" + year + "_" + league_id) == "no") chatBottomUp = false;
	if (localStorage.getItem("emojiChat_bottomUp_" + year + "_" + league_id) == "yes") chatBottomUp = true;
	if (typeof franchise_id === "undefined") chatRowAdjustment = 0;

	function openChatWindow(windowChat) {
		var x = screen.width / 2 - chatPopupWidth / 2;
		var y = screen.height / 2 - chatPopupHeight / 2;
		window.open(windowChat.href, 'popchaturl', 'height=' + chatPopupHeight + ',width=' + chatPopupWidth + ',left=' + x + ',top=' + y);
	}

	function parseChatXML(chatXML) {
		//THIS WILL RE-DEFINE NORMAL parseChatXML FOUND IN mfl_common.js CHANGES MADE BY ME ARE SHOWN AS "TWEAKS BY HABMAN"
		var messages = chatXML.getElementsByTagName("message");
		// START TWEAKS BY HABMAN
		chatRowsToAdd = false;
		if (chatAddMoreRows || chatReversingDirection) {
			//remove all chat
			var myChat = document.getElementById("league_chat");
			var myChatTR = myChat.getElementsByTagName("TR");
			for (var i = (myChatTR.length - 1); i >= 0; i--) {
				if (parseInt(myChatTR[i].getAttribute("id")) > 0) myChat.deleteRow(i);
			}
			chatAddMoreRows = false;
			chatReversingDirection = false;
		}
		try {
			var lastMessageTime = parseInt(messages[0].getAttribute("id"));
		} catch (er) {
			var lastMessageTime = chatServerTime;
		}
		chatServerTime += checkEverySeconds;
		if (chatServerTime < lastMessageTime) chatServerTime = lastMessageTime; //re-adjust in case we have lost time due to inactivity
		//IF REVERSE (BOTTOM UP) THEN WE NEED TO COUNT THE MESSAGES TO DISPLAY INCLUDING PRIVATE THEN RE-DEFINE MESSAGES VAR
		if (chatBottomUp) {
			var messagesDisplayed = 0;
			var tempMessages = [];
			for (var i = 0; i < messages.length; i++) {
				if (messagesDisplayed > displayMessages) {
					chatRowsToAdd = true;
					break;
				}
				var id = messages[i].getAttribute("id");
				if (!document.getElementById(id)) {
					var this_fid = messages[i].getAttribute("franchise_id");
					var to_fid = messages[i].getAttribute("to");
					if (to_fid != null) {
						// don't display it to folks who haven't logged in.
						if (typeof franchise_id === "undefined") {
							// displayMessages++;
							continue;
						}
						// don't display it unless i'm the sender or receiver!
						if (to_fid != franchise_id && this_fid != franchise_id) {
							// displayMessages++;
							continue;
						}
					}
				}
				tempMessages.unshift(messages[i]);
				messagesDisplayed++;
			}
			messages = tempMessages;
		}
		// END TWEAKS BY HABMAN

		var chat_table = document.getElementById("league_chat");
		var table_body;
		if (chat_table) {
			table_body = chat_table.getElementsByTagName("TBODY");
		} else {
			table_body = document.getElementsByTagName("TBODY");
		}
		var do_clear = false;
		var action = chatXML.getElementsByTagName("messages")[0].getAttribute("action");
		if (action && action == "clear") {
			do_clear = true;
		}
		var body_rows = table_body[0].getElementsByTagName("TR");
		var second_row = body_rows[1];
		var newMessage = 0;
		// todo - compare each message's "to" value to the current franchise_id - if it exists, and it's the same
		// display it, otherwise, don't
		if (!do_clear) {
			var messagesDisplayed = 0;
			for (var i = 0; i < messages.length; i++) {
				if (messagesDisplayed > displayMessages) {
					// START TWEAKS BY HABMAN
					chatRowsToAdd = true;
					// END TWEAKS BY HABMAN
					break;
				}
				var id = messages[i].getAttribute("id");
				if (!document.getElementById(id)) {
					var this_fid = messages[i].getAttribute("franchise_id");
					if (typeof franchise_id !== "undefined")
						if (this_fid == franchise_id) chatServerTime -= checkEverySeconds; //need this to ignore extra time advances from user posts
					var to_fid = messages[i].getAttribute("to");
					if (to_fid != null) {
						// don't display it to folks who haven't logged in.
						if (typeof franchise_id === "undefined") {
							// displayMessages++;
							continue;
						}
						// don't display it unless i'm the sender or receiver!
						if (to_fid != franchise_id && this_fid != franchise_id) {
							// displayMessages++;
							continue;
						}
					}
					var message = messages[i].getAttribute("message");
					// START TWEAKS BY HABMAN
					var tempMessage = message.replace("::", ": :");
					var checks = 0;
					while (tempMessage.indexOf(":") != -1 && checks < 100) {
						tempMessage = tempMessage.substring(tempMessage.indexOf(":") + 1, tempMessage.length);
						var thisWord = tempMessage.substring(0, tempMessage.indexOf(":"));
						if (chatEmojiList[thisWord] != undefined) message = message.replace(":" + thisWord + ":", "<img src='" + chatEmojiPath + chatEmojiList[thisWord] + "' title='~:~" + thisWord + "~:~' class='chatEmoji' />");
						checks++;
					}
					message = message.replace(/~:~/g, ":");
					// END TWEAKS BY HABMAN
					var posted = messages[i].getAttribute("posted");
					var new_row = document.createElement("TR");
					new_row.setAttribute("id", id);
					new_row.setAttribute("title", "Posted: " + posted);
					var make_it_bold = false;
					if (to_fid != null) {
						make_it_bold = true;
					}
					var by_cell = document.createElement("TD");
					// START TWEAKS BY HABMAN
					if (chatUseFranchiseIcons) {
						var thisImage = "<img src='" + franchiseDatabase['fid_' + this_fid].icon + "' alt='" + franchiseDatabase['fid_' + this_fid].name + "' title='" + franchiseDatabase['fid_' + this_fid].name + "' class='chatTeamIcon' />";
						if (make_it_bold)
							var toImage = "<img src='" + franchiseDatabase['fid_' + to_fid].icon + "' alt='to " + franchiseDatabase['fid_' + to_fid].name + "' title='to " + franchiseDatabase['fid_' + to_fid].name + "' class='chatTeamIcon' />"
						else
							var toImage = "";
						by_cell.innerHTML = thisImage + toImage;
					} else by_cell.innerHTML = (make_it_bold ? "<b>" : "") + franchiseDatabase['fid_' + this_fid].name + (make_it_bold ? "</b>" : "");
					// END TWEAKS BY HABMAN
					new_row.appendChild(by_cell);
					var message_cell = document.createElement("TD");
					message_cell.innerHTML = (make_it_bold ? "<b>" : "") + message + (make_it_bold ? "</b>" : "");
					if (chatShowLapsedTime) message_cell.innerHTML += "<br/><span class='chatLapsedTime' id='chatid_" + id + "'></span>";
					new_row.appendChild(message_cell);
					// START TWEAKS BY HABMAN
					if (chatBottomUp) {
						var bottom_row = body_rows[i + (body_rows.length - i) - chatRowAdjustment];
						table_body[0].insertBefore(new_row, bottom_row);
					} else table_body[0].insertBefore(new_row, second_row);
					// END TWEAKS BY HABMAN
					if (typeof franchise_id !== "undefined" && this_fid != franchise_id) {
						newMessage++;
					}
				}
				if (chatShowLapsedTime) updateChatPostTime(id);
				messagesDisplayed++;
			}
			body_rows = table_body[0].getElementsByTagName("TR");
			for (var i = body_rows.length; i > displayMessages + 1; i--) {
				if (body_rows[i] && body_rows[i].getAttribute("id")) {
					// START TWEAKS BY HABMAN
					if (chatBottomUp) table_body[0].deleteRow(1);
					else table_body[0].deleteRow(i);
					// END TWEAKS BY HABMAN
				}
			}
			body_rows = table_body[0].getElementsByTagName("TR");
			for (var i = 1; i < body_rows.length; i++) {
				if (body_rows[i] && body_rows[i].getAttribute("id") && body_rows[i].getAttribute("id") == "loadingchatdata") {
					table_body[0].deleteRow(i);
				}
			}
		} else {
			while (body_rows.length > 2) {
				table_body[0].deleteRow(1);
				body_rows = table_body[0].getElementsByTagName("TR");
			}
		}

		body_rows = table_body[0].getElementsByTagName("TR");
		for (var i = 1; i < body_rows.length; i++) {
			var this_class = "eventablerow";
			if (i % 2 == 1) {
				this_class = "oddtablerow";
			}
			body_rows[i].setAttribute("className", this_class);
			body_rows[i].setAttribute("class", this_class);
		}
		messages = null;
		if (newMessage == 1) {
			play_audio_clip("ohoh", "chat_audio_clip");
			// only do this if it's not the initial page load time!
			if (!document.getElementById("body_home")) {
				setTimeout("document.chat.chat.focus()", 100);
			}
		}
		// START TWEAKS BY HABMAN
		if (chatRowsToAdd && chatShowMore)
			document.getElementById("chatMore").style.display = "inline";
		else
			document.getElementById("chatMore").style.display = "none";
		// END TWEAKS BY HABMAN
	}

	function addMoreBottomUpToChat() {
		var myChat = document.getElementById("league_chat");
		var myChatTH = myChat.getElementsByTagName("TH");
		myChatTH[1].innerHTML = "Message <span id='chatMore' style='display:none'>(<span style='cursor:pointer' onclick='addMoreChat()'>more</span>)</span>";
		if (chatBottomUp)
			myChatTH[1].innerHTML += " <span id='bottom-up-chat'><img src='" + chatImagePath + "bottom-up-chat.png' style='cursor:pointer; vertical-align:bottom' alt='Click for Top-Down Chat!' title='Click for Top-Down Chat!' onclick='doBottomUpChat(false)' /></span>";
		else
			myChatTH[1].innerHTML += " <span id='bottom-up-chat'><img src='" + chatImagePath + "top-down-chat.png' style='cursor:pointer; vertical-align:bottom' alt='Click for Bottom-Up Chat!' title='Click for Bottom Chat!' onclick='doBottomUpChat(true)' /></span>";
	}

	function doBottomUpChat(bottomUp) {
		chatBottomUp = bottomUp;
		chatReversingDirection = true;
		if (bottomUp)
			document.getElementById("bottom-up-chat").innerHTML = "<img src='" + chatImagePath + "bottom-up-chat.png' style='cursor:pointer; vertical-align:bottom' alt='Click for Top-Down Chat!' title='Click for Top-Down Chat!' onclick='doBottomUpChat(false)' />";
		else
			document.getElementById("bottom-up-chat").innerHTML = "<img src='" + chatImagePath + "top-down-chat.png' style='cursor:pointer; vertical-align:bottom' alt='Click for Bottom-Up Chat!' title='Click for Bottom-up Chat!' onclick='doBottomUpChat(true)' />";
		var chat_table = document.getElementById("league_chat");
		var table_body;
		if (chat_table) {
			table_body = chat_table.getElementsByTagName("TBODY");
		} else {
			table_body = document.getElementsByTagName("TBODY");
		}
		var body_rows = table_body[0].getElementsByTagName("TR");
		var second_row = body_rows[1];
		var new_row = document.createElement("TR");
		new_row.setAttribute("id", 1);
		var by_cell = document.createElement("TD");
		by_cell.setAttribute("colspan", 2);
		by_cell.setAttribute("class", "chatNotification");
		by_cell.innerHTML = "<b>reversing chat direction . . . </b>";
		new_row.appendChild(by_cell);
		table_body[0].insertBefore(new_row, second_row);
		if (bottomUp) //DEFAULT
			localStorage.setItem("emojiChat_bottomUp_" + year + "_" + league_id, "yes");
		else
			localStorage.setItem("emojiChat_bottomUp_" + year + "_" + league_id, "no");
	}

	function addMoreChat() {
		displayMessages += 5;
		chatAddMoreRows = true;
		var chat_table = document.getElementById("league_chat");
		var table_body;
		if (chat_table) {
			table_body = chat_table.getElementsByTagName("TBODY");
		} else {
			table_body = document.getElementsByTagName("TBODY");
		}
		var body_rows = table_body[0].getElementsByTagName("TR");
		var second_row = body_rows[1];
		var new_row = document.createElement("TR");
		new_row.setAttribute("id", 1);
		var by_cell = document.createElement("TD");
		by_cell.setAttribute("colspan", 2);
		by_cell.setAttribute("class", "chatNotification");
		by_cell.innerHTML = "<b>adding more rows . . . </b>";
		new_row.appendChild(by_cell);
		table_body[0].insertBefore(new_row, second_row);
	}

	function addEmoji(thisEmoji) {
		MFLChatPopupClose();
		const chatTextField = document.getElementById("chat_text_field");
		if (chatTextField) {
			chatTextField.value = chatTextField.value + ' :' + thisEmoji + ':';
		}
		document.getElementById("chat_text_field").focus();
	}

	function updateChatPostTime(currentPostTime) {
		var myLastPost = parseInt(currentPostTime) * 1000;
		var chatTime = chatServerTime * 1000;
		var postTime = parseInt((chatTime - myLastPost) / 1000);
		if (postTime < 0) postTime = 0;

		//pull out month and day from myLastPost
		var d = new Date(parseInt(myLastPost));
		var monthName = new Array(12);
		monthName[0] = "January";
		monthName[1] = "February";
		monthName[2] = "March";
		monthName[3] = "April";
		monthName[4] = "May";
		monthName[5] = "June";
		monthName[6] = "July";
		monthName[7] = "August";
		monthName[8] = "September";
		monthName[9] = "October";
		monthName[10] = "November";
		monthName[11] = "December";
		var chatMonthDay = monthName[d.getMonth()] + " " + d.getDate();

		//pull out weekday from myLastPost
		var d = new Date(parseInt(myLastPost));
		var weekday = new Array(7);
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		var chatWeekDay = weekday[d.getDay()];

		//pull out time from myLastPost
		var d = new Date(parseInt(myLastPost));
		if (d.getHours() < 12)
			var chatAMPM = "am";
		else
			var chatAMPM = "pm";
		var chatHour = d.getHours();
		if (chatHour == 0) chatHour = 12;
		if (chatHour > 12) chatHour = chatHour - 12;
		var chatMinute = d.getMinutes();
		if (chatMinute < 10) chatMinute = "0" + chatMinute;
		var chatTime = chatHour + ":" + chatMinute + " " + chatAMPM;

		if (postTime == 1) var postStr = postTime + " second ago";
		else if (postTime == 60) var postStr = "1 minute ago";
		else if (postTime == 3600) var postStr = "1 hour ago";
		else if (postTime == 86400) var postStr = "Yesterday";
		else if (postTime < 60) var postStr = postTime + " seconds ago";
		else if (postTime < 120) var postStr = "1 minute ago";
		else if (postTime < 3600) var postStr = (parseInt(postTime / 60)) + " minutes ago";
		else if (postTime < 7200) var postStr = "1 hour ago";
		else if (postTime < 86400) var postStr = parseInt(postTime / 3600) + " hours ago";
		else if (postTime < 604800) var postStr = chatWeekDay + " " + chatTime;
		else var postStr = chatMonthDay + " " + chatTime;

		document.getElementById("chatid_" + currentPostTime).innerHTML = postStr;
	}

	function MFLChatPopupClose() {
		// Hide MFLChatPopupOverlay and MFLChatPopupContainer
		const chatPopupOverlay = document.getElementById("MFLChatPopupOverlay");
		const chatPopupContainer = document.getElementById("MFLChatPopupContainer");

		if (chatPopupOverlay) {
			chatPopupOverlay.style.display = "none";
		}
		if (chatPopupContainer) {
			chatPopupContainer.style.display = "none";
		}
		try {
			bodyScrollLock.clearAllBodyScrollLocks();
		} catch (er) {};
	}

	// Popup for inserting an image
	function chatPopupImage() {
		const html = `
        <table class="report popreport">
            <tbody>
                <tr class="oddtablerow">
                    <td style="text-align:center">
                        <br />
                        Image URL: <input type="text" id="chat_imagetext_field" size="23" maxlength="150" />
                        <input type="button" value="Insert" class="imageinsert" style="margin-left:0.313rem" />
                        <br />
                    </td>
                </tr>
            </tbody>
        </table>
    `;
		createCusChatPopup(html, "Add Image to Chat");

		document.querySelector('.imageinsert').addEventListener("click", () => {
			const fieldValue = document.querySelector("#chat_imagetext_field").value;
			if (fieldValue) {
				const cleanedValue = fieldValue.replace(/https?:\/\//, "").replace(/^\/\//, "");
				const chatTextField = document.querySelector("#chat_text_field");
				chatTextField.value += ` <img src="//${cleanedValue}" />`;
			}
			MFLChatPopupClose();
		});
	}

	// Popup for inserting a link
	function chatPopupLink() {
		const html = `
        <table class="report popreport">
            <tbody>
                <tr class="oddtablerow">
                    <td style="text-align:center">
                        Link URL: <input type="text" id="chat_link_field" size="27" maxlength="150" /><br/><br/>
                        Link Text: <input type="text" id="chat_linktext_field" size="23" maxlength="150" />
                        <input type="button" value="Insert" class="linkinsert" style="margin-left:0.313rem" />
                    </td>
                </tr>
            </tbody>
        </table>
    `;
		createCusChatPopup(html, "Add Link to Chat");

		document.querySelector('.linkinsert').addEventListener("click", () => {
			const linkField = document.querySelector("#chat_link_field").value;
			const linkTextField = document.querySelector("#chat_linktext_field").value || linkField;
			if (linkField) {
				const cleanedValue = linkField.replace(/https?:\/\//, "").replace(/^\/\//, "");
				const chatTextField = document.querySelector("#chat_text_field");
				chatTextField.value += ` <a href="//${cleanedValue}" target="_blank">${linkTextField}</a>`;
			}
			MFLChatPopupClose();
		});
	}

	// Popup for adding an emoji
	function chatPopupEmoji() {
		let html = `
        <table class="report popreport">
            <tbody>
                <tr class="oddtablerow">
                    <td style="text-align:center">
                        <div id="chatScrollDiv" style="overflow-y:scroll;-webkit-overflow-scrolling: touch;height:10rem">
    `;
		for (const iconKey in chatEmojiList) {
			if (chatEmojiList.hasOwnProperty(iconKey)) {
				html += `<img src="${chatEmojiPath}${chatEmojiList[iconKey]}" title=":${iconKey}:" class="chatTableEmoji" onclick="addEmoji('${iconKey}')" />`;
			}
		}
		html += `
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
		createCusChatPopup(html, "Add Emoji to Chat");
	}

	// Utility to create and display popups
	function createCusChatPopup(content, caption) {
		document.querySelector("#MFLChatPopupOverlay").style.display = "block";
		document.querySelector("#MFLChatPopupContainer").style.display = "block";
		document.querySelector("#MFLChatPopupCaption").innerHTML = caption;
		document.querySelector("#MFLChatPopupHeader").innerHTML = content;

		const Chatpopup = document.querySelector('#MFLChatPopupContainer');
		try {
			bodyScrollLock.disableBodyScroll(Chatpopup);
		} catch (er) {}
	}

	document.addEventListener("DOMContentLoaded", function () {
		// Replace Main Menu League Chat link with new popup window
		document.querySelectorAll('a').forEach(anchor => {
			if (anchor.textContent.includes("League") && anchor.textContent.includes("Chat")) {
				const newAnchor = document.createElement("a");
				newAnchor.href = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=LEAGUE_CHAT`;
				newAnchor.onclick = function () {
					openChatWindow(this);
					return false;
				};
				newAnchor.target = "_blank";
				newAnchor.textContent = "League Chat";

				anchor.replaceWith(newAnchor);
			}
		});

		if (document.getElementById("league_chat")) {
			if (chatDefaultDisplayMessages > 1) displayMessages = chatDefaultDisplayMessages - 1;
			// Replace League Chat caption link with new popup window
			const link = document.querySelector("#league_chat caption span a");
			if (link) {
				const newLink = document.createElement("a");
				newLink.href = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=LEAGUE_CHAT`;
				newLink.onclick = function () {
					openChatWindow(this);
					return false;
				};
				newLink.target = "_blank";

				const img = document.createElement("img");
				img.src = "//www03.myfantasyleague.com/window-16x16.png";
				img.title = "New Window";
				img.alt = "New Window";
				img.width = 16;
				img.height = 16;
				img.border = "0";

				newLink.appendChild(img);

				link.replaceWith(newLink);
			}

			// Set width of input field, if it exists, and adjust for various settings
			if (typeof franchise_id !== "undefined" && document.getElementById("chat_text_field")) {
				var inputBoxWidth = 17.5;
				if (franchise_id == "0000") inputBoxWidth -= 1.25; //adjust for clear chat icon
				if (chatHideVideoLink) inputBoxWidth += 1.125;
				if (chatAddonCustomEmoji) inputBoxWidth -= 1.125;
				if (chatAddonInsertLink) inputBoxWidth -= 1.125;
				if (chatAddonInsertImage) inputBoxWidth -= 1.125;
				document.getElementById("chat_text_field").style.width = inputBoxWidth + "rem";
			}
			addMoreBottomUpToChat();

			const EnhanceChatStyle = `#league_chat td .chatTeamIcon + .chatTeamIcon {margin-top: 0.313rem;}#league_chat td:nth-child(2) img.chatEmoji {max-height: 1.5rem;width: auto;}.chatTableEmoji {max-height: 1.5rem;width: auto;cursor: pointer;margin: 0.25rem;}.chatTeamIcon {height: ${chatFranchiseIconHeight}${useREM?"rem":"px"};width: auto;display: block;}.chatLapsedTime {font-style: italic;font-size: 0.563rem;color: ${chatElapsedTimeColor};}.chatNotification {text-align: center;font-style: italic;}#league_chat input, #league_chat a, #league_chat img {vertical-align: middle;}#chat_text_field {margin: 0.188rem 0;}#league_chat td:nth-child(2) img {max-height: ${chatImageMaxHeight}${useREM?"rem":"px"};max-width: ${chatImageMaxWidth}${useREM?"rem":"px"};width: auto;}#league_chat td:nth-child(1) {width: 0.188rem;}@media only screen and (max-height: 35.5em) and (orientation: landscape) {#MFLChatPopupContainer {max-height: 14.688rem;}}#MFLChatPopupContainer {overflow: hidden;position: fixed;z-index: 99999;width: 100%;max-width: 25rem;height: max-content;margin: auto;left: 0;right: 0;top: 0;bottom: 0;}#MFLChatPopupContainer .report {height: auto;padding: 0;border-width: 0.125rem;overflow: hidden;}#MFLChatPopupContainer caption {width: 100%;border-left: 0;border-right: 0;border-top: 0;display: inline-block;border-radius: 0;}#MFLChatPopupContainer .popreport {width: 100%;height: auto;border-spacing: 0;border: 0;margin-bottom: 0.313rem;}#MFLChatPopupContainer .popreport td {padding: 0.625rem 0.313rem;}#MFLChatPopupHeader {text-align: center;width: 100%;}#MFLChatPopupOverlay {height: 100%;left: 0;opacity: 0.7;position: fixed;top: 0;width: 100%;z-index: 99999;background-color: #000;}`;

			const ChatAppendStyle2 = document.createElement('style');
			ChatAppendStyle2.textContent = EnhanceChatStyle;
			document.head.appendChild(ChatAppendStyle2);

			const chatPopupOverlay = document.getElementById("MFLChatPopupOverlay");
			if (chatPopupOverlay) {
				// Remove any existing click event listeners
				chatPopupOverlay.replaceWith(chatPopupOverlay.cloneNode(true));

				// Add a new click event listener
				chatPopupOverlay.addEventListener("click", function () {
					MFLChatPopupClose();
				});
			}

			// Append MFLChatPopupOverlay and MFLChatPopupContainer to .pagebody
			const ChatpageBody = document.querySelector(".pagebody");
			if (ChatpageBody) {
				const overlay = document.createElement("div");
				overlay.id = "MFLChatPopupOverlay";
				overlay.style.display = "none";

				const container = document.createElement("div");
				container.id = "MFLChatPopupContainer";
				container.style.display = "none";

				const report = document.createElement("div");
				report.className = "report";

				const caption = document.createElement("caption");
				const captionSpan = document.createElement("span");
				captionSpan.id = "MFLChatPopupCaption";
				caption.appendChild(captionSpan);

				const closeSpan = document.createElement("span");
				closeSpan.id = "MFLPlayerPopupClose";
				closeSpan.textContent = "X";
				closeSpan.onclick = MFLChatPopupClose;

				const header = document.createElement("div");
				header.id = "MFLChatPopupHeader";

				report.appendChild(caption);
				report.appendChild(closeSpan);
				report.appendChild(header);

				container.appendChild(report);

				ChatpageBody.appendChild(overlay);
				ChatpageBody.appendChild(container);
			}

			// Append additional buttons if conditions are met
			const ChatpostInput = document.querySelector('#league_chat input[value="Post"]');
			if (ChatpostInput) {
				const buttonsConfig = [{
						condition: chatAddonCustomEmoji,
						src: `${chatEmojiPath}smile.png`,
						alt: "Show Emojis",
						title: "Show Emojis",
						clickHandler: chatPopupEmoji
					},
					{
						condition: chatAddonInsertLink,
						src: `${chatImagePath}link.png`,
						alt: "Insert Link",
						title: "Insert Link",
						clickHandler: chatPopupLink
					},
					{
						condition: chatAddonInsertImage,
						src: `${chatImagePath}insert_image.png`,
						alt: "Insert Image",
						title: "Insert Image",
						clickHandler: chatPopupImage
					}
				];

				buttonsConfig.forEach(({
					condition,
					src,
					alt,
					title,
					clickHandler
				}) => {
					if (condition) {
						const button = document.createElement("img");
						button.src = src;
						button.alt = alt;
						button.title = title;
						button.style.cssText = "height:1rem;width:1rem;cursor:pointer;margin-left:0.125rem";
						button.onclick = clickHandler;
						ChatpostInput.after(button);
					}
				});
			}

			// Remove the video link if the condition is met
			if (chatHideVideoLink) {
				const videoLink = document.querySelector("#league_chat a[href*='O=222']");
				if (videoLink) {
					videoLink.remove();
				}
			}

		}
	});
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END MOBILE MENU SCRIPT////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START PLAYER POPUP SCRIPT/////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (load_popup) {
	ShowMFLlogin = false; // Our template - set this var to false so never used - DO NOT EVER REMOVE THIS LINE
	$('.mm-myacct li a[href*=BECOME]').parent().remove();
	$('.mm-myacct li a[href*=login]').parent().remove();
	$('.mm-myacct li a[href*=logout]').parent().remove();

	//PLAYER POPUP VERSION NUMBER
	//console.log('PLAYER POPUP SCRIPT LAST UPDATED 12-21-21');
	/////////////////////////////////////////////////
	// MFL POPUP V2  https://www.mflscripts.com/mfl-apps/popups/players/script.js
	/////////////////////////////////////////////////
	var MFLPlayerPopupTracker = [];
	var MFLPlayerPopupTeamNames = [];
	var MFLPlayerPopupOnloadContent = [];
	var MFLPlayerPopupStart = new Date().getTime();
	var MFLPlayerPopupExtraTitles = ({
		"salary": "Salary",
		"contractyear": "Contract Year",
		"contractstatus": "Contract Status",
		"contractinfo": "Contract Information",
		"drafted": "Drafted"
	});
	var MFLPlayerPopupCurrentPID;

	MFLnewsEnableScoreboard = true;

	if (MFLPopupOmitLinks === undefined) var MFLPopupOmitLinks = false;
	if (MFLPopupOmitStatus === undefined) var MFLPopupOmitStatus = false;
	if (MFLPopupEnableAutoNotification === undefined) var MFLPopupEnableAutoNotification = false;
	if (MFLPopupEnableTrade === undefined) var MFLPopupEnableTrade = true;
	if (MFLPopupEnableTradePoll === undefined) var MFLPopupEnableTradePoll = true;
	if (MFLPopupEnableReminders === undefined) var MFLPopupEnableReminders = true;
	if (MFLPopupEnableMessages === undefined) var MFLPopupEnableMessages = true;
	if (MFLPopupEnableCommishMessage === undefined) var MFLPopupEnableCommishMessage = false;
	if (MFLPopupCommishMessage === undefined) var MFLPopupCommishMessage = "";
	if (MFLPlayerPopupIncludeNFLLogo === undefined) var MFLPlayerPopupIncludeNFLLogo = true;
	if (ShowMFLsearch === undefined) var ShowMFLsearch = false;
	if (MFLFranchisePopup === undefined) var MFLFranchisePopup = false;
	if (MFLScoreDetailsPopup === undefined) var MFLScoreDetailsPopup = false;
	if (includeBiologo === undefined) var includeBiologo = false;
	if (MFLFranchisePopup) MFLScoreDetailsPopup = true;
	if (includeBiologoAsset === undefined) var includeBiologoAsset = false;
	if (ShowMFLlogin === undefined) var ShowMFLlogin = false;
	if (LoginSearchMobileCSS === undefined) var LoginSearchMobileCSS = false;
	if (MFLPlayerPopupIncludeProjections === undefined) var MFLPlayerPopupIncludeProjections = true;
	//FONT AWESOME
	if (MFLPopupWelcomeFontAwesome === undefined) var MFLPopupWelcomeFontAwesome = '<i class="fa-sharp fa-regular fa-lock-keyhole MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupWelcome" aria-hidden="true"></i>';
	if (MFLPopupSearchFontAwesome === undefined) var MFLPopupSearchFontAwesome = '<i class="fa-regular fa-magnifying-glass MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupSearch" aria-hidden="true"></i>';
	if (MFLPopupNotifyFontAwesome === undefined) var MFLPopupNotifyFontAwesome = '<i class="fa-regular fa-circle-exclamation MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupNotify" aria-hidden="true"></i>';

	if (typeof NewsNoneIconHeight === "undefined") NewsNoneIconHeight = 9;
	if (typeof NewsNoneIconWidth === "undefined") NewsNoneIconWidth = 11;
	if (typeof NewsOldIconHeight === "undefined") NewsOldIconHeight = 9;
	if (typeof NewsOldIconWidth === "undefined") NewsOldIconWidth = 11;
	if (typeof NewsNewIconHeight === "undefined") NewsNewIconHeight = 11;
	if (typeof NewsNewIconWidth === "undefined") NewsNewIconWidth = 18;

	$('.myfantasyleague_menu ul li:eq(0)').parent().append('<div id="icon-wrapper" style="float:left;display:none"><li onclick="toggleLogin()" class="notification-icon-login" style="display:none">' + MFLPopupWelcomeFontAwesome + '</li><div class="toggle_module_login" style="display:none;"><table class="toggle_login_content report" style="white-space:initial"><tbody><tr><th>Welcome</th></tr><tr class="oddtablerow"></tr></tbody></table></div><li onclick="toggleSearch()" class="notification-icon-search" title="Player Search" style="display:none">' + MFLPopupSearchFontAwesome + '</li><div class="toggle_module_search" style="display:none"><table class="toggle_search_content report" style="white-space:initial"><tbody><tr><th>Find A Player</th></tr><tr class="oddtablerow"><td><form method="get" action="' + baseURLDynamic + '/' + year + '/player_search"><input name="L" value="' + league_id + '" type="hidden"><input name="NAME" size="15" type="text"><input value="Search" type="submit"></form></td></tr></tbody></table></div><li class="notification-icon-popup" title="Notifications" style="display:none"><span onclick="MFLPlayerPopupPopulateOnload(true)">' + MFLPopupNotifyFontAwesome + '</span></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + '/' + year + '/mb/message_list.pl?bid=' + year + league_id + '\'" class="notification-icon-new-mb-private-message addon-icons" title="New Private Message!"><i class="fa-regular fa-inbox fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=28\'" class="notification-icon-new-mb-message addon-icons" title="New Message Board Post!"><i class="fa-regular fa-comments fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=69\'" class="notification-icon-new-poll addon-icons" title="Vote Required!"><i class="fa-regular fa-check-to-slot fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + '/' + year + '/csetup?L=' + league_id + '&C=REVTRAD\'" class="notification-pending-trade addon-icons" title="Pending Trade to Approve!"><i class="fa-regular fa-triangle-exclamation fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="alert(\'You have ' + leagueAttributes["PendingTradesAwaitingCommishApproval"] + ' trade(s) awaiting Commissioner Approval!\')" class="notification-awaiting-approval addon-icons" title="Trade(s) Awaiting Commissioner Approval!"><i class="fa-regular fa-hourglass-half fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=05\'" class="notification-outstandings-offers-received addon-icons" title="You have been offered a trade!"><i class="fa-regular fa-handshake fa-beat MFLPopupFontAwesomeMenu"></i></li></div>');

	// ======================= FEATURE GATE & NORMALIZATION =======================
	// Normalize toggles once, then gate the whole module off them.
	var MFLEnablePlayerImages = typeof MFLEnablePlayerImages === "undefined" ? false : !!MFLEnablePlayerImages;
	var MFLPopupEnablePlayerNews = typeof MFLPopupEnablePlayerNews === "undefined" ? false : !!MFLPopupEnablePlayerNews;
	var MFLPopupEnableArticle = typeof MFLPopupEnableArticle === "undefined" ? false : !!MFLPopupEnableArticle;
	var HidePlayerDetails = typeof HidePlayerDetails === "undefined" ? false : !!HidePlayerDetails;

	const __FEATURES_ON__ = !!(MFLEnablePlayerImages || MFLPopupEnablePlayerNews);
	let mo = null;

	// ======================= NEWS / ARTICLE CSS INJECTOR =======================
	(function ensureNewsCss() {
		const STYLE_NEWS_ID = 'mfl-news-icons-style';
		const STYLE_ARTICLE_ID = 'mfl-article-icons-style';

		function ensureStyle(id, css) {
			if (document.getElementById(id)) return;
			const style = document.createElement('style');
			style.id = id;
			style.textContent = css;
			document.head.appendChild(style);
		}

		const isValidUrl = v => typeof v === "string" && v.trim().length > 0;

		// Are custom icon URLs defined?
		const hasCustom = isValidUrl(window.MFLPlayerPopupNewsNew) && isValidUrl(window.MFLPlayerPopupNewsOld) && isValidUrl(window.MFLPlayerPopupNewsNone);

		// -------- ARTICLE ICONS (only when MFLPopupEnableArticle is true) --------
		if (MFLPopupEnableArticle) {
			const cssArticle = hasCustom ?
				`
/*MFLPlayerPopupNewsOld*/
a[data-news-article="1"]::after {
    height: ${NewsOldIconHeight}px!important;
    width: ${NewsOldIconWidth}px!important;
}
a[data-news-article="1"]::after {
  content: "";
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.3em;
  background: url("${MFLPlayerPopupNewsOld}") no-repeat center / contain!important;
}` :
				`
a[data-news-article="1"]::after {
  content: "";
  width: calc(1em * 16 / 14);
  aspect-ratio: 16 / 14;
  display: inline-flex;
  vertical-align: text-top;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 14'><rect fill='%23eb008b' opacity='0' width='16' height='14'/><path fill='%23ebc971' d='M214.41,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33h3.27v-5.56A1.1,1.1,0,0,0,214.41,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-199.5 -133.93)'/><polygon fill='%23f7ea0c' points='12.59 8.63 12.59 11.08 15.05 8.63 12.59 8.63'/><path fill='%23cc9800' d='M215.5,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,215.5,137.11Zm-4.36,4.45V146h1.09v-3.33h3.27v-1.11Z' transform='translate(-199.5 -133.93)'/><path fill='%23eaca71' d='M203.84,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,203.84,145.69Z' transform='translate(-199.5 -133.93)'/><path fill='%23fbfc00' d='M214.41,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-199.5 -133.93)'/><path fill='%23ebc971' d='M212.36,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,212.36,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,206.86,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-199.5 -133.93)'/></svg>") no-repeat center / contain!important;}`;
			ensureStyle(STYLE_ARTICLE_ID, cssArticle);
		}

		// -------- PLAYER NEWS ICONS (when player-news feature is on) --------------


		if (__FEATURES_ON__) {
			let cssNews = "";

			if (MFLPopupEnablePlayerNews) {
				cssNews += hasCustom ?
					`
/*MFLPlayerPopupNewsNone*/
a[data-news="no-news"]::after,
a[data-news="no-news"]::before,
a[data-news="no-news"] div.playerLastName::after,
a[data-news="no-news"] div.playerLastName::before {
    height: ${NewsNoneIconHeight}px!important;
    width: ${NewsNoneIconWidth}px!important;
}
/*MFLPlayerPopupNewsOld*/
a[data-news="news"]::after,
a[data-news="news"]::before,
a[data-news="news"] div.playerLastName::after,
a[data-news="news"] div.playerLastName::before,
a[data-news="recent-news"]::after,
a[data-news="recent-news"]::before,
a[data-news="recent-news"] div.playerLastName::after,
a[data-news="recent-news"] div.playerLastName::before,
a[data-news_preload="1"]:after,
a[data-news_preload="1"] div.playerLastName::after,
a[data-news_preload="1"] div.playerLastName::before {
    height: ${NewsOldIconHeight}px!important;
    width: ${NewsOldIconWidth}px!important;
}
/*MFLPlayerPopupNewsNew*/
a[data-news="new-news"]::after,
a[data-news="new-news"]::before,
a[data-news="new-news"] div.playerLastName::after,
a[data-news="new-news"] div.playerLastName::before {
    height: ${NewsNewIconHeight}px!important;
    width: ${NewsNewIconWidth}px!important;
}

td.mondayHomeTeam a[data-news_preload="1"] div.playerLastName::after,
td.mondayHomeTeam a[data-news*="news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news*="news"]::after {
  content: none!important;
}
td.mondayHomeTeam a[data-news_preload="1"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"]::before {
  margin-right:.2em;
}
a[data-news_preload="1"] div.playerLastName::after,
a[data-news*="news"] div.playerLastName::after,
a[data-news*="news"]::after,
td.mondayHomeTeam a[data-news_preload="1"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"]::before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.3em;
  background: url("${MFLPlayerPopupNewsOld}") no-repeat center / contain!important;
}
a[data-news="recent-news"]::after,
a[data-news="news"]::after,
a[data-news="recent-news"] div.playerLastName::after,
a[data-news="news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news="recent-news"]::before,
td.mondayHomeTeam a[data-news="news"]::before,
td.mondayHomeTeam a[data-news="recent-news"] div.playerLastName::before,
td.mondayHomeTeam a[data-news="news"] div.playerLastName::before {
  background: url("${MFLPlayerPopupNewsOld}") no-repeat center / contain!important;
}
a[data-news="no-news"]::after,
a[data-news="no-news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news="no-news"]::before,
td.mondayHomeTeam a[data-news="no-news"] div.playerLastName::before {
  background: url("${MFLPlayerPopupNewsNone}") no-repeat center / contain!important;
}
a[data-news="new-news"]::after,
a[data-news="new-news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news="new-news"]::before,
td.mondayHomeTeam a[data-news="new-news"] div.playerLastName::before {
  background: url("${MFLPlayerPopupNewsNew}") no-repeat center / contain!important;
}
a[data-pimg-processed]::after,
td.mondayHomeTeam a[data-pimg-processed]::before { content: none!important; }

@media (min-width: 768px) {
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news*="news"]::after {
        content: none!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news*="news"]::before {
        margin-right: 0.2em;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news*="news"]::before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.3em;
        background: url("${MFLPlayerPopupNewsOld}") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="recent-news"]::before,
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="news"]::before {
        background: url("${MFLPlayerPopupNewsOld}") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="no-news"]::before {
        background: url("${MFLPlayerPopupNewsNone}") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="new-news"]::before {
        background: url("${MFLPlayerPopupNewsNew}") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-pimg-processed]::before {
        content: none!important;
    }
}` :
					`
td.mondayHomeTeam a[data-news_preload="1"] div.playerLastName::after,
td.mondayHomeTeam a[data-news*="news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news*="news"]::after{
  content: none!important;
}
td.mondayHomeTeam a[data-news_preload="1"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"]::before {
  margin-right:.2em;
}
a[data-news_preload="1"] div.playerLastName::after,
a[data-news*="news"] div.playerLastName::after,
a[data-news*="news"]::after,
td.mondayHomeTeam a[data-news_preload="1"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"] div.playerLastName::before,
td.mondayHomeTeam a[data-news*="news"]::before {
  content: "";
  width: calc(1em * 16 / 14);
  aspect-ratio: 16 / 14;
  display: inline-flex;
  vertical-align: text-top;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 14'><rect fill='%23eb008b' opacity='0' width='16' height='14'/><path fill='%23ebc971' d='M214.41,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33h3.27v-5.56A1.1,1.1,0,0,0,214.41,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-199.5 -133.93)'/><polygon fill='%23f7ea0c' points='12.59 8.63 12.59 11.08 15.05 8.63 12.59 8.63'/><path fill='%23cc9800' d='M215.5,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,215.5,137.11Zm-4.36,4.45V146h1.09v-3.33h3.27v-1.11Z' transform='translate(-199.5 -133.93)'/><path fill='%23eaca71' d='M203.84,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,203.84,145.69Z' transform='translate(-199.5 -133.93)'/><path fill='%23fbfc00' d='M214.41,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-199.5 -133.93)'/><path fill='%23ebc971' d='M212.36,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,212.36,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,206.86,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-199.5 -133.93)'/></svg>") no-repeat center / contain!important;
}
a[data-news="recent-news"]::after,
a[data-news="news"]::after,
a[data-news="recent-news"] div.playerLastName::after,
a[data-news="news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news="recent-news"]::before,
td.mondayHomeTeam a[data-news="news"]::before,
td.mondayHomeTeam a[data-news="recent-news"] div.playerLastName::before,
td.mondayHomeTeam a[data-news="news"] div.playerLastName::before {
  width: calc(1em * 16 / 14);
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 14'><rect fill='%23eb008b' opacity='0' width='16' height='14'/><path fill='%23ebc971' d='M214.41,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33h3.27v-5.56A1.1,1.1,0,0,0,214.41,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-199.5 -133.93)'/><polygon fill='%23f7ea0c' points='12.59 8.63 12.59 11.08 15.05 8.63 12.59 8.63'/><path fill='%23cc9800' d='M215.5,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,215.5,137.11Zm-4.36,4.45V146h1.09v-3.33h3.27v-1.11Z' transform='translate(-199.5 -133.93)'/><path fill='%23eaca71' d='M203.84,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,203.84,145.69Z' transform='translate(-199.5 -133.93)'/><path fill='%23fbfc00' d='M214.41,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-199.5 -133.93)'/><path fill='%23ebc971' d='M212.36,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,212.36,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,206.86,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-199.5 -133.93)'/></svg>") no-repeat center / contain!important;
}
a[data-news="no-news"]::after,
a[data-news="no-news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news="no-news"]::before,
td.mondayHomeTeam a[data-news="no-news"] div.playerLastName::before {
  width: calc(1em * 16 / 14);
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 14'><rect fill='%23eb008b' opacity='0' width='16' height='14'/><path fill='%23ebc971' d='M210.91,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33H212v-5.56A1.1,1.1,0,0,0,210.91,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-196 -134)'/><polygon fill='%23d6d6d6' points='12.59 8.55 12.59 11 15.05 8.55 12.59 8.55'/><path fill='%23a6a6a6' d='M212,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,212,137.11Zm-4.36,4.45V146h1.09v-3.33H212v-1.11Z' transform='translate(-196 -134)'/><path fill='%23d6d6d6' d='M200.34,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,200.34,145.69Z' transform='translate(-196 -134)'/><path fill='%23ffffff' d='M210.91,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-196 -134)'/><path fill='%23d6d6d6' d='M208.86,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,208.86,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,203.36,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-196 -134)'/></svg>") no-repeat center / contain!important;
}
a[data-news="new-news"]::after,
a[data-news="new-news"] div.playerLastName::after,
td.mondayHomeTeam a[data-news="new-news"]::before,
td.mondayHomeTeam a[data-news="new-news"] div.playerLastName::before {
  width: calc(1em * 27 / 14);
  aspect-ratio: 27 / 14;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 14'><rect fill='%23eb008b' opacity='0' width='27' height='14'/><path fill='%23ebc971' d='M214.41,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33h3.27v-5.56A1.1,1.1,0,0,0,214.41,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-199.45 -134)'/><polygon fill='%23f7ea0c' points='12.64 8.55 12.64 11 15.1 8.55 12.64 8.55'/><path fill='%23cc9800' d='M215.5,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,215.5,137.11Zm-4.36,4.45V146h1.09v-3.33h3.27v-1.11Z' transform='translate(-199.45 -134)'/><path fill='%23eaca71' d='M203.84,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,203.84,145.69Z' transform='translate(-199.45 -134)'/><path fill='%23fbfc00' d='M214.41,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-199.45 -134)'/><path fill='%23ebc971' d='M212.36,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,212.36,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,206.86,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-199.45 -134)'/><path fill='%23ffb878' d='M223.93,141.39v-.71h-2.67l1.88-1.88-.5-.5-1.89,1.89v-2.68H220v2.69l-1.9-1.89-.5.5,1.89,1.87h-2.67v.71h2.7l-1.91,1.9.5.5L220,141.9v2.66h.71v-2.67l1.9,1.89.5-.5-1.91-1.89h2.69Zm-3.53.38a.74.74,0,1,1,.73-.74A.74.74,0,0,1,220.4,141.77Z' transform='translate(-199.45 -134)'/><path fill='%23ff320d' d='M226.4,141.6v-1.2h-4.53l3.19-3.21-.85-.84L221,139.57V135h-1.2v4.58l-3.23-3.22-.85.85,3.21,3.19H214.4v1.2H219l-3.24,3.25.85.85,3.21-3.23V147H221v-4.53l3.23,3.21.85-.85-3.25-3.23h4.57Zm-5.25-.3h0l1.62,1.61-.43.43-1.61-1.61V144h-.6v-2.25h0l-1.6,1.61-.43-.43,1.62-1.62H217.4v-.6h2.26l-1.6-1.59.43-.43,1.61,1.61V138h.6v2.28l1.6-1.61.43.43-1.6,1.6h2.27v.6Z' transform='translate(-199.45 -134)'/></svg>") no-repeat center / contain!important;
}
a[data-pimg-processed]::after,
td.mondayHomeTeam a[data-pimg-processed]::before { content: none!important; }
@media (min-width: 768px) {
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news*="news"]::after {
        content: none!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news*="news"]::before {
        margin-right: 0.2em;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news*="news"]::before {
        content: "";
        width: calc(1em * 16 / 14);
        aspect-ratio: 16 / 14;
        display: inline-flex;
        vertical-align: text-top;
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 14'><rect fill='%23eb008b' opacity='0' width='16' height='14'/><path fill='%23ebc971' d='M214.41,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33h3.27v-5.56A1.1,1.1,0,0,0,214.41,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-199.5 -133.93)'/><polygon fill='%23f7ea0c' points='12.59 8.63 12.59 11.08 15.05 8.63 12.59 8.63'/><path fill='%23cc9800' d='M215.5,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,215.5,137.11Zm-4.36,4.45V146h1.09v-3.33h3.27v-1.11Z' transform='translate(-199.5 -133.93)'/><path fill='%23eaca71' d='M203.84,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,203.84,145.69Z' transform='translate(-199.5 -133.93)'/><path fill='%23fbfc00' d='M214.41,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-199.5 -133.93)'/><path fill='%23ebc971' d='M212.36,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,212.36,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,206.86,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-199.5 -133.93)'/></svg>") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="recent-news"]::before,
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="news"]::before {
        width: calc(1em * 16 / 14);
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 14'><rect fill='%23eb008b' opacity='0' width='16' height='14'/><path fill='%23ebc971' d='M214.41,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33h3.27v-5.56A1.1,1.1,0,0,0,214.41,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-199.5 -133.93)'/><polygon fill='%23f7ea0c' points='12.59 8.63 12.59 11.08 15.05 8.63 12.59 8.63'/><path fill='%23cc9800' d='M215.5,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,215.5,137.11Zm-4.36,4.45V146h1.09v-3.33h3.27v-1.11Z' transform='translate(-199.5 -133.93)'/><path fill='%23eaca71' d='M203.84,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,203.84,145.69Z' transform='translate(-199.5 -133.93)'/><path fill='%23fbfc00' d='M214.41,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-199.5 -133.93)'/><path fill='%23ebc971' d='M212.36,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,212.36,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,206.86,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-199.5 -133.93)'/></svg>") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="no-news"]::before {
        width: calc(1em * 16 / 14);
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 14'><rect fill='%23eb008b' opacity='0' width='16' height='14'/><path fill='%23ebc971' d='M210.91,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33H212v-5.56A1.1,1.1,0,0,0,210.91,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-196 -134)'/><polygon fill='%23d6d6d6' points='12.59 8.55 12.59 11 15.05 8.55 12.59 8.55'/><path fill='%23a6a6a6' d='M212,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,212,137.11Zm-4.36,4.45V146h1.09v-3.33H212v-1.11Z' transform='translate(-196 -134)'/><path fill='%23d6d6d6' d='M200.34,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,200.34,145.69Z' transform='translate(-196 -134)'/><path fill='%23ffffff' d='M210.91,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-196 -134)'/><path fill='%23d6d6d6' d='M208.86,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,208.86,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,203.36,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-196 -134)'/></svg>") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-news="new-news"]::before {
        width: calc(1em * 27 / 14);
        aspect-ratio: 27 / 14;
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 14'><rect fill='%23eb008b' opacity='0' width='27' height='14'/><path fill='%23ebc971' d='M214.41,136h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78a1.1,1.1,0,0,0,1.09,1.11h7.64v-3.33h3.27v-5.56A1.1,1.1,0,0,0,214.41,136Zm0,5.56h-3.27v3.33h-5.46a1.1,1.1,0,0,1-1.09-1.11v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.1,1.1,0,0,1,1.09,1.11Z' transform='translate(-199.45 -134)'/><polygon fill='%23f7ea0c' points='12.64 8.55 12.64 11 15.1 8.55 12.64 8.55'/><path fill='%23cc9800' d='M215.5,137.11v4.45h-1.09v-3.34a1.1,1.1,0,0,0-1.09-1.11h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,1.09,1.11h5.46V146h-6.55a1.1,1.1,0,0,1-1.09-1.11v-7.78a1.1,1.1,0,0,1,1.09-1.11h9.82A1.1,1.1,0,0,1,215.5,137.11Zm-4.36,4.45V146h1.09v-3.33h3.27v-1.11Z' transform='translate(-199.45 -134)'/><path fill='%23eaca71' d='M203.84,145.69l1.25-1a1.12,1.12,0,0,1-.5-.91v-5.56a1.1,1.1,0,0,1,1.09-1.11h7.64a1.08,1.08,0,0,1,.76.32l1.2-1a1.07,1.07,0,0,0-.87-.47h-9.82a1.1,1.1,0,0,0-1.09,1.11v7.78A1.11,1.11,0,0,0,203.84,145.69Z' transform='translate(-199.45 -134)'/><path fill='%23fbfc00' d='M214.41,138.22a1,1,0,0,0-.09-.43,1.08,1.08,0,0,0-.24-.36,1,1,0,0,0-.34-.23,1,1,0,0,0-.42-.09h-7.64a1.1,1.1,0,0,0-1.09,1.11v5.56a1.1,1.1,0,0,0,.07.36l.06.13a.5.5,0,0,0,.08.12,1.18,1.18,0,0,0,.29.3,1.1,1.1,0,0,0,.59.2h5.46v-3.33h3.27Z' transform='translate(-199.45 -134)'/><path fill='%23ebc971' d='M212.36,140.52v.81a.14.14,0,0,1-.14.14h-5.36a.15.15,0,0,1-.14-.14v-.81a.14.14,0,0,1,.14-.13h5.36A.13.13,0,0,1,212.36,140.52Zm-5.5-1.73h5.36a.13.13,0,0,0,.14-.13v-.81a.14.14,0,0,0-.14-.14h-5.36a.14.14,0,0,0-.14.14v.81A.14.14,0,0,0,206.86,138.79Zm4.19,4.11h-4.27a.13.13,0,0,0-.14.13v.81a.14.14,0,0,0,.14.14h4.27Z' transform='translate(-199.45 -134)'/><path fill='%23ffb878' d='M223.93,141.39v-.71h-2.67l1.88-1.88-.5-.5-1.89,1.89v-2.68H220v2.69l-1.9-1.89-.5.5,1.89,1.87h-2.67v.71h2.7l-1.91,1.9.5.5L220,141.9v2.66h.71v-2.67l1.9,1.89.5-.5-1.91-1.89h2.69Zm-3.53.38a.74.74,0,1,1,.73-.74A.74.74,0,0,1,220.4,141.77Z' transform='translate(-199.45 -134)'/><path fill='%23ff320d' d='M226.4,141.6v-1.2h-4.53l3.19-3.21-.85-.84L221,139.57V135h-1.2v4.58l-3.23-3.22-.85.85,3.21,3.19H214.4v1.2H219l-3.24,3.25.85.85,3.21-3.23V147H221v-4.53l3.23,3.21.85-.85-3.25-3.23h4.57Zm-5.25-.3h0l1.62,1.61-.43.43-1.61-1.61V144h-.6v-2.25h0l-1.6,1.61-.43-.43,1.62-1.62H217.4v-.6h2.26l-1.6-1.59.43-.43,1.61,1.61V138h.6v2.28l1.6-1.61.43.43-1.6,1.6h2.27v.6Z' transform='translate(-199.45 -134)'/></svg>") no-repeat center / contain!important;
    }
    #LSscoringBox .head-to-head .teamAway + .teamHome .player-name a[data-pimg-processed]::before {
        content: none!important;
    }
}
`;
			}
			if (MFLEnablePlayerImages) {
				cssNews += `
/***********************************************************/
/*************** CSS FOR PLAYER IMAGES HTML*****************/
/***********************************************************/
/* CSS FOR anchor containing player image html */
a[data-pimg-processed] {
    display: block;
    max-width: 100%;
    text-decoration: none!important;
}
th.fixed-side a[data-pimg-processed],
li a[data-pimg-processed],
#options_138 a[data-pimg-processed],
#nfl_team_stats a[data-pimg-processed],
#lineup td[data-type="hasinput"] input,
#lineup td[data-type="hasinput"] a,
#lineup td[data-type="hasinput"] b,
#submit_lineup td[data-type="hasinput"] input,
#submit_lineup td[data-type="hasinput"] a,
#submit_lineup td[data-type="hasinput"] b,
.articlecaption a[data-pimg-processed],
#options_144 td[data-type="hasinput"] input,
#options_144 td[data-type="hasinput"] a,
#options_144 td[data-type="hasinput"] b {
    display: inline-block;
    vertical-align: middle;
    white-space: break-spaces;
}
/* CSS FOR playerImgTable */
.playerImgTable div {
    vertical-align: middle;
}
a[data-pimg-processed] .playerImgTable {
    border: 0 !important;
    box-shadow: none !important;
    text-align: left !important;
    padding: 0 !important;
    margin: 0 !important;
    border-spacing: 0!important;
    border-collapse: collapse;
    text-indent: 0!important;
    width: 100%;
    max-width: 17em;
    line-height: 1.4;
}
a[data-pimg-processed][data-narrow="1"] .playerImgTable {
    width: auto;
}
.articlecaption a[data-pimg-processed] .playerImgTable {
    width: unset!important;
    max-width: unset!important;
}
td.mondayHomeTeam a[data-pimg-processed] .playerImgTable {
    margin-left: auto !important;
    margin-right: 0 !important;
}
/* CSS FOR playerImg */
a[data-pimg-processed] .playerImgTable .playerImg {
    text-align: center!important;
}
.articlecaption a[data-pimg-processed] .playerImg {
    display: none !important;
}
.playerImgTable .playerImg {
    width: 4em;
    min-width: 4em;
}
/* CSS FOR playerPhoto */
.playerImgTable .playerWrapper {
    position: relative;
}
/* CSS FOR playerPhoto */
.playerImgTable .playerPhoto {
    border-radius: 50%;
    height: 3.1em;
    width: 3.1em;
}
/* CSS FOR TeamLogo */
.playerImgTable .playerWrapper img.TeamLogo {
    height: 1.7em;
    width: 1.7em;
    position: absolute;
    bottom: 0;
    right: 0.2em;
}
td.mondayHomeTeam .playerImgTable .playerWrapper img.TeamLogo {
    left: 0.2em;
    right: auto;
}
/* CSS FOR teamPositionCircle */
#pro_matchup[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#options_117[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#injury[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#options_207[data-page-narrow="1"] .recap_preview_players .playerImgTable .teamPositionCircle,
#options_177[data-page-narrow="1"] .recap_preview_players .playerImgTable .teamPositionCircle,
#fantasy_box_score[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#options_205[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#weekly[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#options_22[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#options_06[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#options_07[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
table.box_details_table[data-page-narrow="1"] .playerImgTable .teamPositionCircle,
#trade_offer .playerImgTable .teamPositionCircle,
#options_05 .playerImgTable .teamPositionCircle,
#options_138 .playerImgTable .teamPositionCircle,
#options_105 .playerImgTable .teamPositionCircle,
#nfl_team_stats .playerImgTable .teamPositionCircle,
#options_17 .playerImgTable .teamPositionCircle,
#options_03 .playerImgTable .teamPositionCircle,
#transactions .playerImgTable .teamPositionCircle,
th.fixed-side a[data-pimg-processed] .teamPositionCircle {
    display: block!important;
}
.playerImgTable .teamPositionCircle {
    position: absolute;
    width: 1.3em;
    height: 1.3em;
    line-height: 1.3em;
    border-radius: 50%;
    left: 0;
    top: 0;
    display: none;
}
a[data-narrow="1"] .playerImgTable .teamPositionCircle {
    display: block;
}
td.mondayHomeTeam .playerImgTable .teamPositionCircle {
    right: 0;
    left: auto;
}
.playerImgTable .teamPositionCircleTxt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.5em;
    font-weight: bold;
}
/* CSS FOR playerNames */
td.mondayHomeTeam .playerImgTable .playerNames {
    text-align: right!important;
}
/* CSS FOR playerLastName */
.playerImgTable .playerLastName {
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: left;
    flex-wrap: wrap;
}
td.mondayHomeTeam .playerImgTable .playerLastName {
    justify-content: right;
}
/* CSS FOR playerFirstName */
.playerImgTable .playerFirstName {
    font-size: 0.9em;
    font-weight: 400;
}
.articlecaption a[data-pimg-processed] .playerFirstName {
    display: none !important;
}
.playerFirstName .warning {
    font-size: inherit;
}
/* CSS FOR playerDetails */
#pro_matchup[data-page-narrow="1"] .playerImgTable .playerDetails,
#options_117[data-page-narrow="1"] .playerImgTable .playerDetails,
#injury[data-page-narrow="1"] .playerImgTable .playerDetails,
#options_207[data-page-narrow="1"] .recap_preview_players .playerImgTable .playerDetails,
#options_177[data-page-narrow="1"] .recap_preview_players .playerImgTable .playerDetails,
#fantasy_box_score[data-page-narrow="1"] .playerImgTable .playerDetails,
#options_205[data-page-narrow="1"] .playerImgTable .playerDetails,
#weekly[data-page-narrow="1"] .playerImgTable .playerDetails,
#options_22[data-page-narrow="1"] .playerImgTable .playerDetails,
#options_06[data-page-narrow="1"] .playerImgTable .playerDetails,
#options_07[data-page-narrow="1"] .playerImgTable .playerDetails,
.playerDetails table.box_details_table[data-page-narrow="1"] .playerImgTable .playerDetails,
#trade_offer .playerImgTable .playerDetails,
#options_05 .playerImgTable .playerDetails,
#options_138 .playerImgTable .playerDetails,
#options_105 .playerImgTable .playerDetails,
#nfl_team_stats .playerImgTable .playerDetails,
#options_17 .playerImgTable .playerDetails,
#options_03 .playerImgTable .playerDetails,
#transactions .playerImgTable .playerDetails,
th.fixed-side a[data-pimg-processed] .playerDetails,
.articlecaption a[data-pimg-processed] .playerDetails,
a[data-pimg-processed][data-narrow="1"] .playerDetails {
    display: none!important;
}
a[data-pimg-processed] .playerImgTable .playerDetails {
    text-align: center!important;
}
.playerImgTable .playerDetails {
    width: 2.6em;
    font-size: 0.9em;
    font-weight: 900;
}
/* CSS FIXES FOR SOME REPORTS USING PLAYER IMAGE HTML */
.monday_player_team_position {
    display: none!important;
}
th.fixed-side,
td[data-type="hasinput"],
span.plus-toggle-stats + a {
    padding-right: calc(1em * 27 / 14) !important;
}
#submit_lineup > tbody > tr > th:first-child {
    max-width: 9em;
    width: 9em;
}
#lineup td[data-type="hasinput"],
#submit_lineup td[data-type="hasinput"] {
    white-space: nowrap;
}
#top .report td.points.tot,
#top .report td.points.avg,
#options_08 .report td.points.tot,
#options_08 .report td.points.avg {
    cursor: text;
    pointer-events: auto;
    user-select: text;
}
#top .report td.points.tot a,
#top .report td.points.avg a,
#options_08 .report td.points.tot a,
#options_08 .report td.points.avg a {
    pointer-events: none;
    text-decoration: none!important;
}
#options_138 .report th.player,
#options_105 .report td.player,
#nfl_team_stats .report th[colspan] {
    text-align: left!important;
}
.box_details_table td.player {
    max-width: 13em;
    width: 13em;
    min-width: 13em;
}
#detailed.pagebody table.report td b:has(> a[data-pimg-processed]) + br,
#ScoreDetails table.report td b:has(> a[data-pimg-processed]) + br {
    display: none !important;
}
#teamBox td a[href*="player"][data-pimg-processed] {
    pointer-events: all !important;
}
/***********************************************************/
/*******CSS MEDIA QUERIES FOR PLAYER NEWS AND IMAGES********/
/***********************************************************/
@media only screen and (max-width: 62.5em) {
    #MFLroster .playerImgTable .playerDetails {
        display: none !important;
    }
    #MFLroster .playerImgTable .teamPositionCircle {
        display: block !important;
    }
    #MFLroster .playerImgTable {
        width: auto;
    }
    #options_03 li a[data-pimg-processed],
    #transactions li a[data-pimg-processed] {
        display: block;
    }
}`;
			}
			ensureStyle(STYLE_NEWS_ID, cssNews);
		}
	})();

	// ======================= Helpers =======================
	function mergeSelectors(defaults, extras) {
		const base = Array.isArray(defaults) ? defaults.slice() : [];
		const extraRaw = (extras == null) ? [] : (Array.isArray(extras) ? extras : [extras]);
		const out = [];
		const seen = new Set();
		for (const s of [...base, ...extraRaw]) {
			const v = (typeof s === 'string') ? s.trim() : '';
			if (!v) continue;
			if (seen.has(v)) continue;
			seen.add(v);
			out.push(v);
		}
		return out;
	}

	// ======================= EXCLUSIONS =======================
	const DEFAULT_DO_NOT_PROCESS_IMAGES = [
		'.myfantasyleague_menu',
		'.team_lineup_table',
		'#MFLPlayerPopupLinks',
		'#player_stats_table',
		'.biohistory',
		'.recap_preview_writeup',
		'#fantasy_recap p',
		'#fantasy_preview p',
		'#top .report td.points.tot',
		'#top .report td.points.avg',
		'#options_08 .report td.points.tot',
		'#options_08 .report td.points.avg',
		'#options_182 p',
		'.player-lineup-link',
		'#LSscoringBox',
		'#body_ajax_ls',
		'.previews_table p',
		'#todays_league_news p',
		'#options_185 table p',
		'#options_185 #toolData'
	];

	const DEFAULT_DO_NOT_PROCESS_NEWSICONS = [
		'#LSscoringBox',
		'#MFLPlayerPopupLinks',
		'#player_stats_table',
		'.biohistory',
		'#top .report td.points.tot',
		'#top .report td.points.avg',
		'#options_08 .report td.points.tot',
		'#options_08 .report td.points.avg'
	];

	const DEFAULT_DO_NOT_PROCESS_ARTICLEICONS = [
		'#nodivhere'
	];

	const DO_NOT_PROCESS_IMAGES = mergeSelectors(DEFAULT_DO_NOT_PROCESS_IMAGES, window.DO_NOT_PROCESS_IMAGES_EXTRA);
	const DO_NOT_PROCESS_NEWSICONS = mergeSelectors(DEFAULT_DO_NOT_PROCESS_NEWSICONS, window.DO_NOT_PROCESS_NEWSICONS_EXTRA);
	const DO_NOT_PROCESS_ARTICLEICONS = mergeSelectors(DEFAULT_DO_NOT_PROCESS_ARTICLEICONS, window.DO_NOT_PROCESS_ARTICLEICONS_EXTRA);

	// ======================= CONSTANTS =======================
	const NAME_SUFFIXES = new Set(["JR", "SR", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]);
	const SEL_PLAYER_LINKS = "a[href*='player?'][href*='P='], a[href*='player?'][href*='p='], a[href^='javascript:launch_player_modal']";
	const SEL_ARTICLE_LINKS = 'td.headline a[href*="view_news_article?"], table.bionews.report tbody tr > td:not(.reportfooter) > a[href*="view_news_article?"]';

	const TEAM_RE = /^(ARI|ATL|BAL|BUF|CAR|CHI|CIN|CLE|DAL|DEN|DET|GBP|HOU|IND|JAC|KCC|LAC|SDC|LAR|STL|RAM|LVR|OAK|MIA|MIN|NEP|NOS|NYG|NYJ|PHI|PIT|SEA|SFO|TBB|TEN|WAS|FA)$/;
	const POS_RE = /^(COACH|QB|TMQB|TM|RB|TMRB|FB|WR|TMWR|TE|TMTE|KR|PK|TMPK|PN|TMPN|DE|DT|TMDL|LB|TMLB|CB|S|TMDB|OFF|DEF|ST)$/;

	const LOGO_BASE = 'https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/';
	const TEAM_PRIMARY_ALIAS = {
		OAK: 'LVR',
		SDC: 'LAC',
		STL: 'LAR',
		RAM: 'LAR'
	};

	const firstIsInitial = v => typeof v === 'string' && v.replace(/[^A-Za-z]/g, '').trim().length === 1;

	function isTeam(v) {
		return TEAM_RE.test(String(v || '').toUpperCase());
	}

	function teamLogoUrl(teamCode) {
		const t = String(teamCode || 'FA').toUpperCase();
		const norm = TEAM_PRIMARY_ALIAS[t] || t;
		return isTeam(norm) ? (LOGO_BASE + norm + '.svg') : (LOGO_BASE + 'FA.svg');
	}

	// POS maps
	const TEAM_IMG_SET = {
		"Coach": 1,
		"Off": 1,
		"Def": 1,
		"ST": 1,
		"TM": 1,
		"TMQB": 1,
		"TMRB": 1,
		"TMWR": 1,
		"TMTE": 1,
		"TMPK": 1,
		"TMPN": 1,
		"TMDL": 1,
		"TMLB": 1,
		"TMDB": 1
	};
	const TEAM_POS_SETS = new Set(Object.keys(TEAM_IMG_SET).map(k => k.toUpperCase()));

	const POS_DISPLAY_MAPS = {
		TMQB: "QB",
		TMRB: "RB",
		TM: "TM",
		TMWR: "WR",
		TMTE: "TE",
		TMPK: "PK",
		COACH: "C",
		TMPN: "PN",
		TMDL: "DL",
		TMLB: "LB",
		TMDB: "DB",
		OFF: "O",
		DEF: "D",
		ST: "ST"
	};
	const POS_DISPLAY_MAPS_FULL = {
		TMQB: "QB",
		TMRB: "RB",
		TM: "TM",
		TMWR: "WR",
		TMTE: "TE",
		TMPK: "PK",
		COACH: "C",
		TMPN: "PN",
		TMDL: "DL",
		TMLB: "LB",
		TMDB: "DB",
		OFF: "OFF",
		DEF: "DEF",
		ST: "ST"
	};

	const PROCESSED_ATTR = "data-pimg-processed";

	// ======================= UTILITIES =======================
	function normalizePos(p) {
		if (!p) return "";
		const u = String(p).toUpperCase();
		return POS_RE.test(u) ? u : "";
	}

	function isPos(p) {
		const u = normalizePos(p);
		return !!u && POS_RE.test(u);
	}

	function inDoNotProcessImages(el) {
		return !!el && (
			el.dataset?.pimgSkip === '1' ||
			DO_NOT_PROCESS_IMAGES.some(sel => el.closest?.(sel))
		);
	}

	function inDoNotProcessNews(el) {
		return !!el && DO_NOT_PROCESS_NEWSICONS.some(sel => el.closest?.(sel));
	}

	function inDoNotProcessArticles(el) {
		return !!el && DO_NOT_PROCESS_ARTICLEICONS.some(sel => el.closest?.(sel));
	}

	// ======================= Player DB helpers =======================
	let __playerIndexs = null;
	let __playerReadys = false;


	// REPLACE your buildDbIndex with this:
	function buildDbIndex(force = false) {
		const DB = getLivePlayerDB();
		if (__playerReadys && !force) return;
		if (!dbLooksPopulated(DB)) return;

		const idx = new Map();
		const add = (id, rec) => {
			if (!id || !rec) return;
			const s = String(id);
			const n0 = s.replace(/^0+/, '');
			idx.set(s, rec);
			if (n0 && n0 !== s) idx.set(n0, rec);
			idx.set('pid_' + s, rec);
			idx.set('pid_' + n0, rec);
		};

		const addFromRecord = (k, v) => {
			if (!v) return;
			const guessed = v?.id ?? v?.pid ?? v?.playerID ?? v?.PlayerID ?? (k ? String(k).replace(/^pid_/, '') : null);
			add(guessed, v);
		};

		if (Array.isArray(DB)) {
			// 1) numeric items (rare in your case, but keep it)
			for (const r of DB) addFromRecord(null, r);

			// 2) string-key items sitting *on* the array (the â€œarray-as-mapâ€ case)
			for (const [k, v] of Object.entries(DB)) {
				// skip numeric index keys like "0", "1", â€¦
				if (/^\d+$/.test(k)) continue;
				addFromRecord(k, v);
			}
		} else if (typeof DB === 'object') {
			for (const [k, v] of Object.entries(DB)) {
				if (Array.isArray(v)) {
					for (const r of v) addFromRecord(null, r);
				} else {
					addFromRecord(k, v);
				}
			}
		}

		__playerIndexs = idx;
		__playerReadys = idx.size > 0;
	}

	// REPLACE your getDbPlayerById with this:
	function getDbPlayerById(pid) {
		if (!__playerReadys) buildDbIndex(false);
		const s = String(pid || '');
		const n0 = s.replace(/^0+/, '');

		if (!__playerReadys) {
			const DB = getLivePlayerDB();
			if (!dbLooksPopulated(DB)) return null;

			let rec = null;
			if (Array.isArray(DB)) {
				// try scanning numeric items first
				rec = DB.find(r => String(r?.id ?? r?.pid ?? r?.playerID ?? r?.PlayerID) === s) ||
					DB.find(r => String(r?.id ?? r?.pid ?? r?.playerID ?? r?.PlayerID) === n0);

				// then try string-keyed props on the array (array-as-map)
				if (!rec) rec = DB[s] || DB[n0] || DB['pid_' + s] || DB['pid_' + n0] || null;
			} else {
				rec = DB[s] || DB[n0] || DB['pid_' + s] || DB['pid_' + n0] || null;
			}

			if (rec) {
				if (!__playerIndexs) __playerIndexs = new Map();
				__playerIndexs.set(s, rec);
				__playerIndexs.set(n0, rec);
				__playerIndexs.set('pid_' + s, rec);
				__playerIndexs.set('pid_' + n0, rec);
				__playerReadys = __playerIndexs.size > 0;
				return rec;
			}
			buildDbIndex(true);
		}

		if (__playerIndexs) {
			return __playerIndexs.get(s) ||
				__playerIndexs.get(n0) ||
				__playerIndexs.get('pid_' + s) ||
				__playerIndexs.get('pid_' + n0) ||
				null;
		}
		return null;
	}

	// ======================= Images / Parsing =======================
	function pushCustomPlayerImages(position, nfl_team, playerID) {
		return TEAM_POS_SETS.has(String(position || '').toUpperCase()) ?
			`https://www.mflscripts.com/playerImages_96x96/mfl_${nfl_team}.svg` :
			`https://www.mflscripts.com/playerImages_96x96/mfl_${playerID}.png`;
	}

	function getArticleIdFromHref(href) {
		if (!href) return "";
		try {
			const u = new URL(href, location.href);
			return u.searchParams.get("ID") || "";
		} catch {
			const m = href.match(/[?&]ID=([^&]+)/i);
			return m ? decodeURIComponent(m[1]) : "";
		}
	}

	function getArticleMeta(a) {
		const articleHeadline = a.innerHTML; // jQuery(this).html()
		const tr = a.closest("tr");
		const articleAgo = tr?.querySelector("td.timestamp")?.innerHTML || ""; // .html()
		const articleLink = getArticleIdFromHref(a.getAttribute("href")) || ""; // ID only
		return {
			articleHeadline,
			articleAgo,
			articleLink
		};
	}

	function extractPidFromHref(href) {
		if (!href) return null;
		if (href.toLowerCase().startsWith("javascript:")) {
			const m = href.match(/launch_player_modal\('\d+','(\d+)'\)/);
			return m ? m[1] : null;
		}
		const m = href.match(/[?&]P=(\d+)/i);
		return m ? m[1] : null;
	}

	function getAnchorNameText(a) {
		const tn = Array.from(a.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
		const raw = (tn ? tn.textContent : a.textContent) || "";
		return raw.trim().replace(/\s+/g, " ");
	}

	function resolveFromHtmlThenDb(ctx, link, playerID) {
		let getFirstLastName = false;
		let first = "",
			last = "",
			team = "",
			pos = "";

		const nameRaw = getAnchorNameText(link);

		if (nameRaw.includes(",")) {
			// Strict parse for comma cases
			({
				first,
				last,
				team,
				pos
			} = parseNameTeamPosFromAnchorText(nameRaw));
		} else if (nameRaw) {
			// No comma â†’ try DB first
			const recForName = getDbPlayerById(playerID);
			if (recForName?.name) {
				const nm = String(recForName.name);
				const i = nm.indexOf(',');
				last = (i >= 0 ? nm.slice(0, i) : nm).trim();
				first = (i >= 0 ? nm.slice(i + 1) : '').trim();
			} else {
				const parts = nameRaw.split(/\s+/);
				if (parts.length === 1) {
					last = parts[0];
					first = "";
				} else {
					const lastTokRaw = parts[parts.length - 1];
					const lastTok = lastTokRaw.replace(/\./g, "").toUpperCase();
					if (NAME_SUFFIXES.has(lastTok)) {
						const coreLast = parts[parts.length - 2];
						last = coreLast + " " + lastTokRaw;
						first = parts.slice(0, parts.length - 2).join(" ");
					} else {
						last = parts.pop();
						first = parts.join(" ");
					}
				}
			}
		}

		if (last === "Team") getFirstLastName = true;

		// pos from CSS class, if present
		if (!pos) {
			const m = (link.className || "").match(/(^|\s)position_([a-z0-9]+)/i);
			if (m) pos = m[2];
		}
		pos = normalizePos(pos);
		if (!isPos(pos)) pos = "";

		const htmlTeamProvided = !!team;
		let usedDbTeam = false;

		// Decide if we still need DB names later
		let needNameRehydrate = (!first || !last || getFirstLastName || firstIsInitial(first));

		if (!first || !last || !team || !pos || getFirstLastName || firstIsInitial(first)) {
			const rec = getDbPlayerById(playerID);
			if (rec) {
				if ((getFirstLastName || !first || !last) && rec.name) {
					const name = String(rec.name || '');
					const i = name.indexOf(',');
					const dbLast = (i >= 0 ? name.slice(0, i) : name).trim();
					const dbFirst = (i >= 0 ? name.slice(i + 1) : '').trim();
					if ((getFirstLastName || !first) && dbFirst) first = dbFirst;
					if ((getFirstLastName || !last) && dbLast) last = dbLast;
					needNameRehydrate = (!first || !last || firstIsInitial(first));
				}
				if (!team && rec.team) {
					const t = String(rec.team).toUpperCase();
					if (!(t === 'FA' && htmlTeamProvided)) {
						team = t;
						usedDbTeam = true;
					}
				}
				if (!pos && (rec.position || rec.pos)) {
					const p = normalizePos(rec.position || rec.pos || '');
					if (p) pos = p;
				}
			}
		}

		team = String(team || "FA").toUpperCase();
		pos = String(pos || "").toUpperCase();
		if (!isPos(pos)) pos = "";

		if (!first && !last) return null;
		return {
			first,
			last,
			team,
			pos,
			htmlTeamProvided,
			usedDbTeam,
			needNameRehydrate
		};
	}


	function cloneNormalizedWarning(span) {
		const clone = span.cloneNode(true);
		let txt = (span.textContent || "").trim();
		// Strip parentheses; keep only A-Z letters we care about (Q, D, O, PUP, etc.)
		txt = txt.replace(/[()]/g, "").trim();
		clone.textContent = txt; // only the letter(s), no parentheses
		return clone;
	}


	function pluckRookieAndInjury(anchor) {
		const isText = n => n && n.nodeType === 3;
		const text = n => (n.textContent || "");
		const isWS = n => isText(n) && /^\s*$/.test(text(n));
		const isOpen = n => isText(n) && /^\s*\(\s*$/.test(text(n));
		const isClose = n => isText(n) && /^\s*\)\s*$/.test(text(n));
		const kill = n => {
			if (n && n.parentNode) n.parentNode.removeChild(n);
		};

		let rookieText = null;
		let injurySpanClone = null;
		let irSupClone = null; // NEW

		let cur = anchor.nextSibling;

		while (cur) {
			// skip harmless whitespace
			if (isWS(cur)) {
				cur = cur.nextSibling;
				continue;
			}

			// bare "(R)" in a single text node
			if (isText(cur) && /\(\s*R\s*\)/i.test(text(cur))) {
				rookieText = "(R)";
				const next = cur.nextSibling;
				kill(cur);
				cur = next;
				continue;
			}

			// "(" [ws]* <span.warning> [ws]* ")"
			if (isOpen(cur)) {
				let n1 = cur.nextSibling;
				while (isWS(n1)) n1 = n1.nextSibling;
				if (n1 && n1.nodeType === 1 && n1.matches("span.warning")) {
					injurySpanClone = cloneNormalizedWarning(n1);

					// remove open, the span, optional ws, and the closing paren if present
					let after = n1.nextSibling;
					while (isWS(after)) after = after.nextSibling;
					if (isClose(after)) kill(after);
					kill(n1);

					const next = cur.nextSibling;
					kill(cur);
					cur = next;
					continue;
				}
			}

			// lone <span.warning> optionally followed by whitespace + ")"
			if (cur.nodeType === 1 && cur.matches("span.warning")) {
				injurySpanClone = cloneNormalizedWarning(cur);
				let next = cur.nextSibling;
				kill(cur);
				while (isWS(next)) {
					const n2 = next.nextSibling;
					kill(next);
					next = n2;
				}
				if (isClose(next)) {
					const n2 = next.nextSibling;
					kill(next);
					next = n2;
				}
				cur = next;
				continue;
			}

			// NEW: lone <sup>IR</sup> (or mixed case)
			if (cur.nodeType === 1 && cur.tagName === 'SUP') {
				const t = (cur.textContent || '').trim().toUpperCase();
				if (t === 'IR') {
					irSupClone = cur.cloneNode(true);
					// normalize innerText to 'IR' (belt & suspenders)
					irSupClone.textContent = 'IR';
					let next = cur.nextSibling;
					kill(cur);
					// purge trailing ws crumbs
					while (isWS(next)) {
						const n2 = next.nextSibling;
						kill(next);
						next = n2;
					}
					cur = next;
					continue;
				}
			}

			// stray ")" leftover â†’ remove
			if (isClose(cur)) {
				const next = cur.nextSibling;
				kill(cur);
				cur = next;
				continue;
			}

			// first real content after anchor â€” stop scanning
			break;
		}

		return {
			rookieText,
			injurySpanClone,
			irSupClone
		}; // NEW field
	}


	function pluckTrailingStar(anchor) {
		let n = anchor.nextSibling;
		while (n && n.nodeType === 3 && /^\s*$/.test(n.textContent)) n = n.nextSibling;
		if (n && n.nodeType === 3 && /^\s*\*\s*$/.test(n.textContent)) {
			n.parentNode.removeChild(n);
			return true;
		}
		return false;
	}

	function removeResidualMarkersAfterAnchor(anchor) {
		const isText = n => n && n.nodeType === 3;
		const txt = n => (n.textContent || "");
		const onlyParens = s => /^[\s\u00A0]*[()]+[\s\u00A0]*$/.test(s);
		const parenLetters = s => /^\s*\(\s*[A-Za-z]{1,4}\s*\)\s*$/.test(s);
		const onlyWS = s => /^[\s\u00A0]+$/.test(s);

		let n = anchor.nextSibling;

		while (n) {
			if (isText(n) && (onlyParens(txt(n)) || parenLetters(txt(n)) || onlyWS(txt(n)))) {
				const next = n.nextSibling;
				n.remove();
				n = next;
				continue;
			}
			// stop at first non-marker content
			break;
		}

		// belt & suspenders: purge any remaining paren-only crumbs immediately after the anchor
		while (anchor.nextSibling && isText(anchor.nextSibling) && onlyParens(txt(anchor.nextSibling))) {
			anchor.nextSibling.remove();
		}
	}

	// Remove any leftover plain-text crumbs inside the anchor itself,
	// e.g. "NYJ Def" or "J Def" that some other script may have appended.
	function purgeAnchorTextCrumbs(anchor) {
		if (!anchor) return;
		let removed = false;

		// Only allow our inner table as a direct child.
		const allowElement = (el) => el.matches && el.matches('.playerImgTable');

		// Clean direct children first
		for (const node of Array.from(anchor.childNodes)) {
			if (node.nodeType === 3) {
				// Text node
				if (!/^\s*$/.test(node.textContent || '')) {
					node.remove();
					removed = true;
				} else {
					// even pure whitespace â€” normalize away to avoid growing nodes
					node.remove();
					removed = true;
				}
			} else if (node.nodeType === 1 && !allowElement(node)) {
				// Any unexpected element directly under <a> â€” remove it
				node.remove();
				removed = true;
			}
		}

		// As a belt-and-suspenders: if the (only) child is our table, make sure
		// thereâ€™s no stray text wrapped *inside* it right after or before.
		const tbl = anchor.querySelector('.playerImgTable');
		if (!tbl) return;

		// Remove any sibling text nodes *around* the table due to later appends.
		let prev = tbl.previousSibling;
		while (prev) {
			const n = prev.previousSibling;
			if (prev.nodeType === 3) prev.remove();
			prev = n;
		}
		let next = tbl.nextSibling;
		while (next) {
			const n = next.nextSibling;
			if (next.nodeType === 3) next.remove();
			next = n;
		}

		// Optional normalize to merge text nodes if any remained (safe no-op now)
		if (removed && anchor.normalize) anchor.normalize();
	}

	function buildInnerTableForAnchor(link) {
		if (!MFLEnablePlayerImages) return null;
		if (link.classList.contains('mfl-orig-link') || link.dataset.pimgSkip === '1' || link.hidden) return null;
		const href = link.getAttribute("href") || "";
		const playerID = extractPidFromHref(href);
		if (!playerID) return null;
		if (playerID && !link.dataset.playerId) link.dataset.playerId = String(playerID);
		link.setAttribute(PROCESSED_ATTR, "1");

		const ctx = link.closest("td") || link.closest("tr") || link.parentElement || link;
		const R = resolveFromHtmlThenDb(ctx, link, playerID);
		if (!R) return null;
		const hadTrailingStar = pluckTrailingStar(link);
		const {
			rookieText,
			injurySpanClone,
			irSupClone
		} = pluckRookieAndInjury(link);
		const isMondayHome = !!(ctx.classList?.contains("mondayHomeTeam") || ctx.closest?.(".mondayHomeTeam"));

		(function markHasInput(a) {
			const prevIsInput = el => el?.previousElementSibling?.tagName === 'INPUT';
			const parent = a.parentElement;
			const hasPrevInput = prevIsInput(a) || (parent && parent.tagName === 'B' && prevIsInput(parent));
			if (!hasPrevInput) return;
			const td = a.closest('td');
			if (!td) return;
			const existing = (td.dataset.type || "").trim();
			if (!existing) td.dataset.type = "hasinput";
			else if (!existing.split(/\s+/).includes("hasinput")) td.dataset.type = `${existing} hasinput`;
		})(link);

		const p = link.parentElement;
		if (p) {
			if (p.tagName === "TD") {
				p.classList.add("player");
				if (isMondayHome) p.classList.add("reverse_row");
			} else if (p.tagName === "B" && p.parentElement && p.parentElement.tagName === "TD") {
				p.parentElement.classList.add("player");
				if (isMondayHome) p.parentElement.classList.add("reverse_row");
			}
		}

		const {
			first,
			last,
			team,
			pos,
			htmlTeamProvided,
			needNameRehydrate
		} = R;

		// Set datasets directly from R
		if (pos) link.dataset.pos = String(pos).toUpperCase();
		if (team && team.toUpperCase() !== 'FA') link.dataset.team = String(team).toUpperCase();

		const posKey = String(pos || '').toUpperCase();
		const displayPos = POS_DISPLAY_MAPS[posKey] || pos;
		const displayPosFull = POS_DISPLAY_MAPS_FULL[posKey] || pos;
		const hideTeamLogo = Object.prototype.hasOwnProperty.call(POS_DISPLAY_MAPS, posKey);
		const logo = teamLogoUrl(team);

		const imgTd = document.createElement("div");
		imgTd.style.display = "table-cell";
		imgTd.className = "playerImg";
		const wrapper = document.createElement("div");
		wrapper.className = "playerWrapper";

		const pImg = document.createElement("img");
		pImg.className = "playerPhoto";
		pImg.loading = "lazy";
		pImg.decoding = "async";
		pImg.width = 96;
		pImg.height = 96;
		pImg.alt = `${last || ''} ${first || ''}`.trim() || "Player";
		pImg.src = pushCustomPlayerImages(pos, team, playerID);
		pImg.onerror = () => {
			pImg.src = "https://www.mflscripts.com/playerImages_96x96/free_agent.png";
		};

		if (!hideTeamLogo) {
			const tLogo = document.createElement("img");
			tLogo.className = "TeamLogo";
			tLogo.width = 24;
			tLogo.height = 24;
			tLogo.decoding = "async";
			tLogo.alt = "";
			tLogo.setAttribute('aria-hidden', 'true');
			tLogo.src = logo;
			wrapper.appendChild(tLogo);
		}

		const posMobile = document.createElement("div");
		posMobile.className = `teamPositionCircleTxt ${String(pos).toLowerCase()}`;
		posMobile.title = `Position: ${String(pos || "").toUpperCase()}`;
		posMobile.textContent = displayPos || "";

		const posCircle = document.createElement("div");
		posCircle.className = "teamPositionCircle";

		if (HidePlayerDetails) {
			posCircle.style.setProperty("display", "block", "important");
		}

		posCircle.appendChild(posMobile);
		posCircle.setAttribute('aria-hidden', 'true');
		posMobile.setAttribute('aria-hidden', 'true');

		wrapper.prepend(pImg);
		wrapper.appendChild(posCircle);
		imgTd.appendChild(wrapper);

		const posTd = document.createElement("div");
		if (HidePlayerDetails) {
			posTd.style.setProperty("display", "none", "important");
		} else {
			posTd.style.display = "table-cell";
		}
		posTd.className = "playerDetails";
		const posDiv = document.createElement("div");
		posDiv.className = `playerPosition`;
		posDiv.textContent = displayPosFull || "";
		const teamDiv = document.createElement("div");
		teamDiv.className = "playerTeam";
		teamDiv.textContent = team;
		posTd.append(posDiv, teamDiv);

		const lastNameLink = document.createElement("div");
		lastNameLink.className = `playerLastName`;
		lastNameLink.textContent = last || "";

		const nameTd = document.createElement("div");
		nameTd.style.display = "table-cell";
		nameTd.className = "playerNames";
		const firstNameDiv = document.createElement("div");
		firstNameDiv.className = "playerFirstName";
		firstNameDiv.textContent = first || "";

		if (hadTrailingStar) firstNameDiv.appendChild(document.createTextNode(" *"));

		if (rookieText) {
			const span = document.createElement("span");
			span.className = "rookie_status";
			span.textContent = rookieText;
			span.style.display = "inline-block";
			span.title = "Rookie";
			if (isMondayHome) span.style.marginRight = "0.188rem";
			else span.style.marginLeft = "0.188rem";
			if (isMondayHome) firstNameDiv.prepend(span);
			else firstNameDiv.appendChild(span);
		}

		const warningClone = injurySpanClone || null;

		if (warningClone) {
			const txt = (warningClone.textContent || "").replace(/[()]/g, "").trim();
			if (txt) {
				warningClone.textContent = `(${txt})`; // wrap in ( )
				if (isMondayHome) warningClone.style.marginRight = "0.188rem";
				else warningClone.style.marginLeft = "0.188rem";
				if (isMondayHome) firstNameDiv.prepend(warningClone);
				else firstNameDiv.appendChild(warningClone);
			}
		}

		// NEW: IR superscript
		if (irSupClone) {
			// style + a11y niceties
			irSupClone.classList.add('warning');
			irSupClone.title = "Injured Reserve";
			// spacing like other badges
			try {
				irSupClone.style.marginLeft = "0.188rem";
				irSupClone.style.verticalAlign = "middle";
			} catch (_) {}

			if (isMondayHome) firstNameDiv.prepend(irSupClone);
			else firstNameDiv.appendChild(irSupClone);
		}

		removeResidualMarkersAfterAnchor(link);
		purgeAnchorTextCrumbs(link);
		queueMicrotask(() => purgeAnchorTextCrumbs(link)); // same tick, after other microtasks
		setTimeout(() => purgeAnchorTextCrumbs(link), 0);

		const parentOfLink = link.parentElement;
		const parentHasShouldStart = parentOfLink?.classList?.contains('shouldstart');
		const parentHasShouldBench = parentOfLink?.classList?.contains('shouldbench');

		if (parentHasShouldStart) {
			parentOfLink.classList.remove('shouldstart');
			const span = document.createElement("span");
			span.className = "shouldHavestart";
			span.style.marginLeft = "0.188rem";
			span.innerHTML = `<i class="fas fa-angle-double-up" title="Should Have Started" style="color:green;vertical-align:middle"></i>`;
			firstNameDiv.appendChild(span);
		}
		if (parentHasShouldBench) {
			parentOfLink.classList.remove('shouldbench');
			const span = document.createElement("span");
			span.className = "shouldHavebench";
			span.style.marginLeft = "0.188rem";
			span.innerHTML = `<i class="fa-solid fa-angles-down" title="Should Have Benched" style="color:red;vertical-align:middle"></i>`;
			firstNameDiv.appendChild(span);
		}

		nameTd.append(lastNameLink, firstNameDiv);

		const innerTable = document.createElement("div");
		innerTable.className = "playerImgTable";
		innerTable.style.display = "table";
		const innerTr = document.createElement("div");
		innerTr.style.display = "table-row";
		if (isMondayHome) innerTr.append(posTd, nameTd, imgTd);
		else innerTr.append(imgTd, nameTd, posTd);
		innerTable.appendChild(innerTr);

		const frag = document.createDocumentFragment();
		frag.appendChild(innerTable)
		link.textContent = ""; // <â€” add this line
		link.replaceChildren(frag);
		purgeAnchorTextCrumbs(link);

		const aria = [first, last, team && `(${team})`, displayPosFull].filter(Boolean).join(' ');
		if (aria) {
			link.setAttribute('aria-label', aria);
			link.title = aria;
		}

		if (MFLPopupEnablePlayerNews && !inDoNotProcessNews(ctx)) {
			link.setAttribute('aria-haspopup', 'dialog');
			link.setAttribute('aria-expanded', 'false');
		}

		// Queue rehydrate if team/pos missing OR name still needs DB
		const needsTeamPosRehydrate = (!isPos(pos) || ((team || '').toUpperCase() === 'FA' && !htmlTeamProvided));
		if (needsTeamPosRehydrate || needNameRehydrate) {
			if (needNameRehydrate) link.dataset.namePending = "1";
			queueRehydrate(playerID, {
				teamDiv,
				wrapper,
				pImg,
				posDiv,
				posMobile,
				pos
			});
		}

		if (window.observePlayerLinkWidth) observePlayerLinkWidth(link);

		if (MFLPopupEnablePlayerNews && !inDoNotProcessNews(ctx)) {
			link.setAttribute("data-news_preload", "1"); // always
			try {
				tagAnchorNewsFast(link, playerID); // may or may not succeed
			} catch (_) {}
		} else {
			link.removeAttribute("data-news_preload");
		}

		return innerTable;
	}

	// ======================= Rehydrate queue (images + names) =======================
	const __rehydrates = {
		pending: new Map(),
		timer: null
	};

	function queueRehydrate(pid, refs) {
		if (!MFLEnablePlayerImages || !pid || !refs) return;

		let anchor =
			refs?.teamDiv?.closest?.('a') ||
			refs?.wrapper?.closest?.('a') ||
			refs?.posDiv?.closest?.('a') ||
			refs?.posMobile?.closest?.('a') || null;

		if (!anchor) anchor = document.querySelector(`a[data-player-id="${String(pid)}"]`);
		if (!anchor) return;

		if (!anchor.dataset.playerId) anchor.dataset.playerId = String(pid);

		if (!__rehydrates.pending.has(pid)) __rehydrates.pending.set(pid, new Set());
		__rehydrates.pending.get(pid).add(anchor);

		// Try to build the index now
		try {
			buildDbIndex(false);
		} catch (_) {}

		// If DB is ready, do it now (skip 700ms wait)
		if (__playerReadys) {
			rehydrateNow();
			return;
		}

		// Otherwise: short debounce + coalesce (was 700ms)
		if (__rehydrates.timer) clearTimeout(__rehydrates.timer);
		__rehydrates.timer = setTimeout(() => {
			__rehydrates.timer = null;
			rehydrateNow();
		}, 120);
	}

	function rehydrateNow() {
		if (!MFLEnablePlayerImages) return;
		if (__rehydrates.pending.size === 0) return;
		buildDbIndex(false);

		if (!__playerReadys) {
			return; // a later one-shot (see #3) will flush it
		}

		for (const [pid, anchors] of __rehydrates.pending.entries()) {
			const rec = getDbPlayerById(pid);
			if (!rec) {
				__rehydrates.pending.delete(pid);
				continue;
			}

			const team = String(rec.team || '').toUpperCase();
			const recPos = normalizePos(rec.position || rec.pos || '');
			const hasPos = isPos(recPos);

			anchors.forEach(anchor => {
				if (!anchor || !anchor.isConnected) return;

				const teamDiv = anchor.querySelector('.playerTeam');
				const wrapper = anchor.querySelector('.playerWrapper');
				const pImg = anchor.querySelector('img.playerPhoto');
				const posDiv = anchor.querySelector('.playerPosition');
				const posMobile = anchor.querySelector('.teamPositionCircleTxt');

				anchor.dataset.playerId = String(pid);
				if (hasPos) anchor.dataset.pos = recPos;
				if (team) anchor.dataset.team = team;

				if (teamDiv) {
					const curTeam = (teamDiv.textContent || '').trim().toUpperCase();
					if (team && team !== curTeam) teamDiv.textContent = team;
				}
				if (hasPos) {
					if (posDiv) posDiv.textContent = (POS_DISPLAY_MAPS_FULL[recPos] || recPos);
					if (posMobile) posMobile.textContent = (POS_DISPLAY_MAPS[recPos] || recPos);
				}

				// === NEW: name rehydrate ===
				if (anchor.dataset.namePending === "1" && rec?.name) {
					const name = String(rec.name);
					const i = name.indexOf(',');
					const dbLast = (i >= 0 ? name.slice(0, i) : name).trim();
					const dbFirst = (i >= 0 ? name.slice(i + 1) : '').trim();

					const lastDiv = anchor.querySelector('.playerLastName');
					const firstDiv = anchor.querySelector('.playerFirstName');

					if (lastDiv && dbLast) lastDiv.textContent = dbLast;

					if (firstDiv && dbFirst) {
						// replace/insert only the leading text node (keep badges/spans)
						const tn = Array.from(firstDiv.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
						if (tn) tn.textContent = dbFirst;
						else firstDiv.insertBefore(document.createTextNode(dbFirst), firstDiv.firstChild);
					}

					// update img alt and aria
					const pImgNow = anchor.querySelector('img.playerPhoto');
					if (pImgNow) pImgNow.alt = `${dbLast || ''} ${dbFirst || ''}`.trim() || "Player";

					const teamText = (team || '').trim();
					const recPosKey = String(recPos || anchor.dataset.pos || '').toUpperCase();
					const displayPosFullNow = POS_DISPLAY_MAPS_FULL[recPosKey] || recPosKey || '';
					const ariaNow = [dbFirst, dbLast, teamText && `(${teamText})`, displayPosFullNow].filter(Boolean).join(' ');
					if (ariaNow) {
						anchor.setAttribute('aria-label', ariaNow);
						anchor.title = ariaNow;
					}

					delete anchor.dataset.namePending;
				}

				// Keep ARIA fresh when only team/pos updated
				try {
					const lastNameNow = anchor.querySelector('.playerLastName')?.textContent?.trim() || '';
					const firstNode = anchor.querySelector('.playerFirstName')?.firstChild;
					const firstNow = (firstNode && firstNode.nodeType === Node.TEXT_NODE) ?
						firstNode.textContent.trim() :
						(anchor.querySelector('.playerFirstName')?.textContent || '').split('(')[0].trim();
					const teamText = (team || '').trim();
					const recPosKey = String(recPos || '').toUpperCase();
					const displayPosFullNow = POS_DISPLAY_MAPS_FULL[recPosKey] || recPosKey || '';
					const ariaNow = [firstNow, lastNameNow, teamText && `(${teamText})`, displayPosFullNow].filter(Boolean).join(' ');
					if (ariaNow) {
						anchor.setAttribute('aria-label', ariaNow);
						anchor.title = ariaNow;
					}
				} catch (_) {}

				// Team logo + portrait source update
				if (wrapper) {
					const useTeamPortrait = TEAM_POS_SETS.has(recPos);
					let tLogo = wrapper.querySelector?.('.TeamLogo');
					if (useTeamPortrait) {
						if (tLogo) tLogo.remove();
					} else {
						const logo = teamLogoUrl(team);
						if (!tLogo) {
							tLogo = document.createElement('img');
							tLogo.className = 'TeamLogo';
							tLogo.width = 24;
							tLogo.height = 24;
							tLogo.decoding = "async";
							tLogo.alt = "";
							tLogo.setAttribute('aria-hidden', 'true');
							wrapper.appendChild(tLogo);
						}
						if (logo && tLogo.src !== logo) tLogo.src = logo;
					}
				}
				if (pImg) {
					const priorPos = anchor.dataset.pos || '';
					const basisPos = hasPos ? recPos : priorPos;
					const src = pushCustomPlayerImages(basisPos, team || 'FA', pid);
					if (src && pImg.src !== src) pImg.src = src;
				}
			});

			anchors.clear();
			__rehydrates.pending.delete(pid);
		}
	}

	// ======================= Batch processors =======================
	function processAllPlayerLinks(root = document) {
		if (!MFLEnablePlayerImages) return;
		const links = root.querySelectorAll(SEL_PLAYER_LINKS);

		const canDisconnect = !!(mo && typeof mo.disconnect === "function");
		if (canDisconnect) {
			try {
				mo.disconnect();
			} catch (_) {}
		}

		try {
			links.forEach(link => {
				if (link.getAttribute(PROCESSED_ATTR) === "1") return;
				if (inDoNotProcessImages(link)) return;
				try {
					buildInnerTableForAnchor(link);
				} catch (_) {}
			});
		} finally {
			if (canDisconnect) {
				try {
					mo.observe(document.body, {
						childList: true,
						subtree: true,
						attributes: true,
						attributeFilter: ['href', 'data-player-id'],
						characterData: true
					});
				} catch (_) {}
			}
		}
	}

	// ======================= News tagging =======================
	function getNewsAttr(pid) {
		if (typeof newsBreaker === "undefined") return "news";
		if (newsBreaker["pid_" + pid] === undefined) return "no-news";
		if (newsBreaker["pid_" + pid] === 0) return "new-news";
		return "recent-news";
	}

	let _pendingNews = new Set();
	let _scheduledNews = false;
	const idleOrTimeout = (() => {
		const ric = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback.bind(window) : null;
		let t = null;
		return (cb) => {
			if (ric) return ric(cb, {
				timeout: 150
			});
			clearTimeout(t);
			t = setTimeout(cb, 16);
		};
	})();

	function scheduleFlushNews() {
		if (_scheduledNews) return;
		_scheduledNews = true;
		idleOrTimeout(flushNews);
	}

	function flushNews() {
		_scheduledNews = false;
		if (_pendingNews.size === 0) return;
		for (const a of _pendingNews) {
			try {
				tagAnchorNews(a);
			} catch (_) {}
		}
		_pendingNews.clear();
	}

	function enqueueNews(a) {
		if (!MFLPopupEnablePlayerNews) return;
		if (!a || inDoNotProcessNews(a)) return;
		annotateAnchorMeta(a);
		_pendingNews.add(a);
		scheduleFlushNews();
	}

	function annotateAnchorMeta(a) {
		if (!a) return;
		if (a.getAttribute(PROCESSED_ATTR) === "1") return;
		// quick-out if we already have pos+team (performance)
		if (a.dataset?.pos && a.dataset?.team) return;

		let pid = a.dataset?.playerId;
		if (!pid) {
			const href = a.getAttribute('href') || '';
			pid = extractPidFromHref(href);
			if (pid) a.dataset.playerId = String(pid);
		}
		if (!pid) return;

		if (!MFLEnablePlayerImages || inDoNotProcessImages(a)) return;

		if (!a.dataset?.pos) {
			const m = (a.className || '').match(/(?:^|\s)position_([a-z0-9]+)(?:\s|$)/i);
			if (m) {
				const p = normalizePos(m[1]);
				if (p) a.dataset.pos = p;
			}
		}

		try {
			if (!a.dataset.pos || !a.dataset.team) {
				const ctx = a.closest("td") || a.closest("tr") || a.parentElement || a;
				const R = resolveFromHtmlThenDb(ctx, a, pid);
				if (R) {
					if (!a.dataset.pos && R.pos) a.dataset.pos = String(R.pos).toUpperCase();
					if (!a.dataset.team && R.team) {
						const t = String(R.team).toUpperCase();
						a.dataset.team = R.htmlTeamProvided ? t : (t !== 'FA' ? t : (a.dataset.team || ''));
					}
				}
			}
		} catch (_) {}

		if (!a.dataset.pos || !a.dataset.team) {
			const rec = getDbPlayerById(pid);
			if (rec) {
				if (!a.dataset.pos) {
					const p = normalizePos(rec.position || rec.pos || '');
					if (p) a.dataset.pos = p;
				}
				if (!a.dataset.team && rec.team) {
					const t = String(rec.team).toUpperCase();
					if (t !== 'FA') a.dataset.team = t;
				}
			}
		}
	}

	// Parse "Last, First [TEAM] [POS]" exactly:
	// - everything before comma => last
	// - on the right side, pluck exact TEAM (TEAM_RE) and exact POS (POS_RE) tokens
	// - remaining tokens => first
	function parseNameTeamPosFromAnchorText(nameRaw) {
		const clean = String(nameRaw || "").trim().replace(/\s+/g, " ");
		let first = "",
			last = "",
			team = "",
			pos = "";
		if (!clean) return {
			first,
			last,
			team,
			pos
		};

		const i = clean.indexOf(",");
		if (i >= 0) {
			last = clean.slice(0, i).trim();
			const right = clean.slice(i + 1).trim();
			if (right) {
				const parts = right.split(/\s+/);
				let teamIdx = -1,
					posIdx = -1;

				for (let idx = 0; idx < parts.length; idx++) {
					const u = parts[idx].toUpperCase();

					if (teamIdx === -1 && TEAM_RE.test(u)) {
						teamIdx = idx;
						team = u;
						continue;
					}

					const p = normalizePos(u);
					if (posIdx === -1 && p) {
						posIdx = idx;
						pos = p;
						continue;
					}
				}

				const kept = parts.filter((_, idx) => idx !== teamIdx && idx !== posIdx);
				first = kept.join(" ").trim();
			}
		} else {
			// No comma â†’ fallback heuristics
			const parts = clean.split(/\s+/);
			if (parts.length === 1) {
				last = parts[0];
			} else {
				const lastTokRaw = parts[parts.length - 1];
				const lastTok = lastTokRaw.replace(/\./g, "").toUpperCase();
				if (NAME_SUFFIXES.has(lastTok) && parts.length >= 2) {
					const coreLast = parts[parts.length - 2];
					last = coreLast + " " + lastTokRaw;
					first = parts.slice(0, parts.length - 2).join(" ");
				} else {
					last = parts.pop();
					first = parts.join(" ");
				}
			}
		}

		return {
			first,
			last,
			team,
			pos
		};
	}

	function tagAnchorNewsFast(a, pidHint) {
		if (!MFLPopupEnablePlayerNews) return;
		if (!a || inDoNotProcessNews(a)) return;

		// If newsBreaker is not ready yet, mark generic and bail quickly.
		if (typeof newsBreaker === "undefined") {
			if (a.dataset.news !== "news") a.dataset.news = "news";
			return;
		}

		// Use the known player id if we have it
		let pid = pidHint || a.dataset.playerId;
		if (!pid) {
			const href = a.getAttribute("href") || "";
			pid = extractPidFromHref(href);
			if (pid) a.dataset.playerId = String(pid);
		}
		if (!pid) return;

		const desired = getNewsAttr(pid);
		if (a.dataset.news !== desired) a.dataset.news = desired;
	}

	function tagAnchorNews(a) {
		if (!MFLPopupEnablePlayerNews) return;
		if (!a || inDoNotProcessNews(a)) return;

		let pid = a.dataset.playerId;
		if (!pid) {
			pid = extractPidFromHref(a.getAttribute("href"));
			if (pid) a.dataset.playerId = String(pid);
		}
		if (!pid) return;

		annotateAnchorMeta(a);
		const desired = getNewsAttr(pid);
		if (a.dataset.news !== desired) a.dataset.news = desired;
	}

	function ensureArticleDataset(a) {
		if (!MFLPopupEnableArticle) return;
		if (!a || inDoNotProcessArticles(a)) return;
		if (!a.dataset.newsArticle) a.dataset.newsArticle = "1";
	}

	// ======================= Delegated interactions (gated attach) =======================
	if (__FEATURES_ON__ && MFLPopupEnablePlayerNews) {
		document.addEventListener('click', function (ev) {
			const a = ev.target && (ev.target.closest ? ev.target.closest(SEL_PLAYER_LINKS) : null);
			if (!a) return;

			const inScoreboard = !!a.closest?.('#LSscoringBox');
			const scoreboardEnabled = (window.MFLnewsEnableScoreboard === true);

			// block excluded areas, EXCEPT allow scoreboard when enabled
			if (inDoNotProcessNews(a) && !(inScoreboard && scoreboardEnabled)) return;


			if (ev.metaKey || ev.ctrlKey) return;

			if (!('news' in a.dataset)) {
				try {
					tagAnchorNews(a);
				} catch (_) {}
				if (!('news' in a.dataset)) return;
			}

			ev.preventDefault();
			ev.stopPropagation();

			const newsPane = document.getElementById('MFLPlayerPopupNews');
			if (newsPane) {
				newsPane.classList.add('active_div_tab_scroll');
				try {
					bodyScrollLock?.disableBodyScroll?.(newsPane);
				} catch (_) {}
			}
			const pid = a.dataset.playerId || extractPidFromHref(a.getAttribute('href')) || "(unknown)";
			MFLPlayerPopupCurrentPID = pid;

			let pPosition = "",
				pTeam = "",
				pName = "",
				pFirst = "",
				pLast = "",
				captionName = "";
			const rec = getDbPlayerById(pid);

			if (rec) {
				const name = String(rec?.name || '');
				const i = name.indexOf(',');
				pLast = i >= 0 ? name.slice(0, i).trim() : name.trim();
				pFirst = i >= 0 ? name.slice(i + 1).trim() : '';
				pTeam = String(rec.team || "").toUpperCase();
				if (pTeam === "FA") pTeam = a.dataset.team || "FA";
				pPosition = normalizePos(rec.position || rec.pos || "");
				pName = rec.name || `${pLast}, ${pFirst}`;
				captionName = `${pLast}, ${pFirst} ${pTeam} ${pPosition}`;
			} else {
				const targetUrl = a.href;
				const msg = "MFL Database for selected player has no data.\n\nYou can view the player's info by going to the year this data is available.\n\nClick OK to continue.";
				if (confirm(msg)) {
					const w = window.open(targetUrl, "_blank", "noopener");
					if (w) w.opener = null;
				}
				return;
			}

			if (!isPos(pPosition) || !isTeam(pTeam)) {
				if (typeof baseURLDynamic === 'string' && baseURLDynamic && typeof year !== 'undefined') {
					fetch(`${baseURLDynamic}/${year}/export?TYPE=players&PLAYERS=${pid}&JSON=1`)
						.then(r => r.json())
						.then(playerDetailData => {
							try {
								const pl = playerDetailData?.players?.player;
								if (pl) {
									pName = pl.name || pName;
									pTeam = (pl.team || pTeam || '').toUpperCase();
									pPosition = normalizePos(pl.position || pPosition);
									captionName = `${pName} ${pTeam} ${pPosition}`;
								}
							} catch (_) {}
						})
						.catch(() => {});
				}
			}

			const $ = (sel, ctx = document) => ctx.querySelector(sel);
			const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
			const show = el => {
				if (el) el.style.display = el.dataset._display || 'block';
			};
			const hide = el => {
				if (el) el.style.display = 'none';
			};

			show($("#MFLPlayerPopupOverlay"));
			show($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));

			$$(".MFLPlayerPopupPlayerTabs").forEach(el => {
				if (!el.closest("#TeamDetails")) el.style.display = "table-cell";
			}); {
				const bio = $("#MFLPlayerPopupBioTab");
				if (bio) {
					bio.style.display = "none";
					bio.removeAttribute("style");
				}
			}
			$$(".MFLPlayerPopupNotificationTabs").forEach(hide); {
				const links = $("#MFLPlayerPopupLinks");
				if (links) links.style.display = (typeof MFLPopupOmitLinks !== "undefined" && MFLPopupOmitLinks) ? "none" : "block";
			}

			hide($("#MFLPlayerPopupLoaded"));
			hide($("#MFLPlayerPopupArticleLoaded")); {
				const nameEl = $("#MFLPlayerPopupName");
				if (nameEl) nameEl.textContent = captionName || "";
			}

			show($("#MFLPlayerPopupContainer"));
			a.setAttribute('aria-expanded', 'true');

			setTimeout(() => {
				try {
					MFLPlayerPopupPopulate(pid, pName, pTeam, pPosition);
				} catch (_) {}
			}, 10);

			$$(".teamdetailsWrap, #TeamDetails").forEach(hide);
			$("#leftTeam") && ($("#leftTeam").innerHTML = "");
			$("#rightTeam") && ($("#rightTeam").innerHTML = "");
			$("#ScoreDetails tbody") && ($("#ScoreDetails tbody").innerHTML = "");
			$$("#teamToggles input").forEach(inp => {
				inp.value = "";
			});

			const fullSeason = $("#fullSeasonPts");
			if (fullSeason && fullSeason.parentNode) fullSeason.parentNode.removeChild(fullSeason);

			$$(".scoredetailsWrap, #ScoreDetails, .scoredetailsWrap, #ScoreNFLDetails").forEach(hide);

			$$("#ScoreNFLDetails table").forEach(t => t.classList.remove("box_details_table"));
			$$("#ScoreDetails table").forEach(t => t.classList.remove("scoring_details_table", "overview_details_table"));

			const popup = $("#MFLPlayerPopupContainer");
			popup?.querySelectorAll("a.dblClicks").forEach(a => a.classList.remove("dblClicks"));
		}, true);

		// Keyboard activation
		document.addEventListener('keydown', function (ev) {
			const a = ev.target && (ev.target.closest ? ev.target.closest(SEL_PLAYER_LINKS) : null);
			if (!a) return;

			const inScoreboard = !!a.closest?.('#LSscoringBox');
			const scoreboardEnabled = (window.MFLnewsEnableScoreboard === true);

			if (inDoNotProcessNews(a) && !(inScoreboard && scoreboardEnabled)) return;
			const isEnter = ev.key === 'Enter';
			const isSpace = ev.key === ' ' || ev.key === 'Spacebar';
			if (isEnter || isSpace) {
				ev.preventDefault();
				a.click();
			}
		}, true);
	}

	// ======================= Responsive/narrow flagger (unchanged core) =======================
	(function enableElementWidthHiding() {
		const WIDTH_IN_EM = 16;
		const seen = new WeakSet();
		let pageFlagScheduled = false;

		const getPageBody = () => document.querySelector("div.pagebody");
		const scopeRoot = () => getPageBody() || document;

		function updatePageNarrowFlagNow() {
			pageFlagScheduled = false;
			const pagebody = getPageBody();
			const scope = scopeRoot();
			const nodes = scope.querySelectorAll('[data-narrow="1"]');
			const anyVisibleNarrow = nodes.length > 0 && Array.from(nodes).some(el => el.offsetParent !== null);

			if (pagebody) {
				if (anyVisibleNarrow) pagebody.setAttribute('data-page-narrow', '1');
				else pagebody.removeAttribute('data-page-narrow');
			} else {
				if (anyVisibleNarrow) document.documentElement.setAttribute('data-page-narrow', '1');
				else document.documentElement.removeAttribute('data-page-narrow');
			}

			document.querySelectorAll('table.box_details_table').forEach(tbl => {
				const anyInTable = Array.from(tbl.querySelectorAll('[data-narrow="1"]')).some(el => el.offsetParent !== null);
				if (anyInTable) tbl.setAttribute('data-page-narrow', '1');
				else tbl.removeAttribute('data-page-narrow');
			});
		}

		let lastNarrowRun = 0;

		function scheduleUpdatePageNarrowFlag() {
			const now = performance.now();
			if (pageFlagScheduled) return;
			pageFlagScheduled = true;
			const delay = (now - lastNarrowRun < 80) ? 80 : 0;
			setTimeout(() => {
				lastNarrowRun = performance.now();
				updatePageNarrowFlagNow();
			}, delay);
		}

		const ro = new ResizeObserver(entries => {
			for (const entry of entries) {
				const a = entry.target;
				const fs = parseFloat(getComputedStyle(a).fontSize) || 16;
				const thresholdPx = WIDTH_IN_EM * fs;
				let inlinePx;
				if (entry.contentBoxSize) {
					const box = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
					inlinePx = box.inlineSize;
				} else inlinePx = a.clientWidth;

				if (inlinePx <= thresholdPx) a.setAttribute('data-narrow', '1');
				else a.removeAttribute('data-narrow');
			}
			scheduleUpdatePageNarrowFlag();
		});

		window.observePlayerLinkWidth = function (a) {
			if (!a || seen.has(a)) return;
			seen.add(a);
			ro.observe(a);
			requestAnimationFrame(() => {
				const fs = parseFloat(getComputedStyle(a).fontSize) || 16;
				const thresholdPx = WIDTH_IN_EM * fs;
				const w = a.clientWidth;
				if (w <= thresholdPx) a.setAttribute('data-narrow', '1');
				else a.removeAttribute('data-narrow');
				scheduleUpdatePageNarrowFlag();
			});
		};

		window.addEventListener('resize', scheduleUpdatePageNarrowFlag);
		window.addEventListener('orientationchange', scheduleUpdatePageNarrowFlag);
		document.addEventListener('visibilitychange', scheduleUpdatePageNarrowFlag);

		const moFlag = new MutationObserver(() => scheduleUpdatePageNarrowFlag());
		moFlag.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['data-narrow']
		});

		window.updatePageNarrowFlag = scheduleUpdatePageNarrowFlag;
		document.addEventListener('DOMContentLoaded', scheduleUpdatePageNarrowFlag);
	})();

	// ======================= MutationObserver (gated bootstrap) =======================
	mo = new MutationObserver(muts => {
		for (const mut of muts) {
			if (mut.type === 'childList') {
				for (const node of mut.addedNodes) {
					if (node.nodeType !== 1) continue;
					const el = /** @type {Element} */ (node);

					const newsBlocked = inDoNotProcessNews(el);
					const imgBlocked = inDoNotProcessImages(el);

					const selfIsAnchor = el.matches?.(SEL_PLAYER_LINKS);

					if (selfIsAnchor) {
						if (MFLPopupEnablePlayerNews && !newsBlocked) enqueueNews(el);
						if (MFLEnablePlayerImages && !imgBlocked && el.getAttribute(PROCESSED_ATTR) !== "1") {
							try {
								buildInnerTableForAnchor(el);
							} catch (_) {}
						}
						// NEW: if already processed, keep it clean
						if (el.getAttribute && el.getAttribute(PROCESSED_ATTR) === "1") {
							purgeAnchorTextCrumbs(el);
						}
					}
					if (!selfIsAnchor) el.querySelectorAll?.(SEL_PLAYER_LINKS).forEach(a => {
						if (MFLPopupEnablePlayerNews && !inDoNotProcessNews(a)) enqueueNews(a);
						if (MFLEnablePlayerImages && !inDoNotProcessImages(a) && a.getAttribute(PROCESSED_ATTR) !== "1") {
							try {
								buildInnerTableForAnchor(a);
							} catch (_) {}
						}
						// NEW: anchors that were already processed but received new children
						if (a.getAttribute(PROCESSED_ATTR) === "1") purgeAnchorTextCrumbs(a);
					});
					if (MFLPopupEnableArticle) {
						const selfIsArticle = el.matches?.(SEL_ARTICLE_LINKS);
						if (selfIsArticle) ensureArticleDataset(el);
						else el.querySelectorAll?.(SEL_ARTICLE_LINKS).forEach(ensureArticleDataset);
					}
				}
			} else if (mut.type === 'attributes') {
				const t = mut.target;
				if (t.nodeType === 1 && /** @type {Element} */ (t).matches?.(SEL_PLAYER_LINKS)) {
					const a = /** @type {Element} */ (t);
					if (MFLPopupEnablePlayerNews && !inDoNotProcessNews(a)) enqueueNews(a);
					if (MFLEnablePlayerImages && !inDoNotProcessImages(a) && a.getAttribute(PROCESSED_ATTR) !== "1") {
						try {
							buildInnerTableForAnchor(a);
						} catch (_) {}
					}
					// NEW: attribute changes sometimes come with stray text inserts elsewhere
					if (a.getAttribute(PROCESSED_ATTR) === "1") purgeAnchorTextCrumbs(a);
				}
				if (MFLPopupEnableArticle && t.nodeType === 1 && /** @type {Element} */ (t).matches?.(SEL_ARTICLE_LINKS)) {
					ensureArticleDataset( /** @type {Element} */ (t));
				}
			} else if (mut.type === 'characterData') {
				const a = mut.target.parentNode?.closest?.(SEL_PLAYER_LINKS);
				if (a && a.nodeType === 1) {
					if (MFLPopupEnablePlayerNews && !inDoNotProcessNews(a)) enqueueNews(a);
					if (MFLEnablePlayerImages && !inDoNotProcessImages(a) && a.getAttribute(PROCESSED_ATTR) !== "1") {
						try {
							buildInnerTableForAnchor(a);
						} catch (_) {}
					}
					// NEW: text changed under a processed anchor â†’ purge crumbs
					if (a.getAttribute(PROCESSED_ATTR) === "1") purgeAnchorTextCrumbs(a);
				}
				if (MFLPopupEnableArticle) {
					const a2 = mut.target?.parentNode?.closest?.(SEL_ARTICLE_LINKS);
					if (a2) ensureArticleDataset(a2);
				}
			}
		}
	});


	if ((__FEATURES_ON__ || MFLPopupEnableArticle) && typeof MutationObserver !== "undefined") {
		const startObserving = () => mo.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['href', 'data-player-id'],
			characterData: true
		});
		if (document.body) startObserving();
		else document.addEventListener('DOMContentLoaded', startObserving, {
			once: true
		});
	}

	// ======================= Bulk hydrator used by news + refresh hooks =======================
	function hydrateAllAnchorMeta(root = document, fastNewsOnly = false) {
		if (!MFLPopupEnablePlayerNews) return;

		const anchors = root.querySelectorAll(SEL_PLAYER_LINKS);

		// Fast path: only set news icon types, skip heavy metadata and DB index
		if (fastNewsOnly) {
			anchors.forEach(a => {
				if (inDoNotProcessNews(a)) return;
				tagAnchorNewsFast(a);
			});
			return;
		}

		// Full path: build DB index + metadata + queued news tagging
		try {
			buildDbIndex(false);
		} catch (_) {}
		anchors.forEach(a => {
			if (inDoNotProcessNews(a)) return;
			if (!a.dataset?.pos || !a.dataset?.team) annotateAnchorMeta(a);
			enqueueNews(a);
		});
	}


	// ======================= Initial passes (gated) =======================
	document.addEventListener('DOMContentLoaded', function () {
		if (MFLPopupEnableArticle) {
			document.querySelectorAll(SEL_ARTICLE_LINKS).forEach(a => {
				if (inDoNotProcessArticles(a)) return;
				if (!a.dataset.newsArticle) a.dataset.newsArticle = "1";
			});
		}
		if (!__FEATURES_ON__) return;
		if (MFLPopupEnablePlayerNews) {
			// Fast news-only path: set data-news ASAP on page load
			hydrateAllAnchorMeta(document, true);
		}
		if (MFLEnablePlayerImages) {
			processAllPlayerLinks(document);
			if (__rehydrates.pending.size > 0) {
				setTimeout(() => {
					buildDbIndex(false);
					// â¬‡ï¸ Only flush if DB is actually ready
					if (__playerReadys) rehydrateNow();
				}, 400);
			}
		}
	});

	document.addEventListener('click', function (ev) {
		if (!MFLPopupEnableArticle) return;

		const a = ev.target?.closest?.(SEL_ARTICLE_LINKS);
		if (!a || inDoNotProcessArticles(a)) return;

		// Let modified / middle / target=_blank clicks behave normally
		if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
		if (ev.button === 1) return;
		if (a.target === "_blank") return;

		ev.preventDefault();
		ev.stopPropagation();

		// mirror your old per-link setup
		const {
			articleHeadline,
			articleAgo,
			articleLink
		} = getArticleMeta(a);
		try {
			MFLPlayerPopupArticleSetup(articleHeadline, articleAgo, articleLink);
		} catch (e) {
			// Optional fallback: open the real page if your modal setup fails
			try {
				const w = window.open(a.href, "_blank", "noopener");
				if (w) w.opener = null; // safe assignment
			} catch (_) {}
		}
	}, true);

	// ======================= Player DB ready + one-shot rehydrate (MFLCache OR other) =======================
	(function () {
		if (!__FEATURES_ON__) return;

		let __didInitialPlayerDbHydrate = false; // one-shot guard
		let __playerDbWatch = {
			started: false,
			rafLeft: 60,
			intId: null
		};

		function ensurePlayerDbHydratedOnce() {
			if (__didInitialPlayerDbHydrate) return false;

			const DB = getLivePlayerDB();
			if (!dbLooksPopulated(DB)) return false; // DB not ready yet

			try {
				// Build the index the first time DB is real
				buildDbIndex(true);

				// Drain the queue once, now that DB is ready
				if (MFLEnablePlayerImages && __rehydrates?.pending?.size > 0) {
					rehydrateNow(); // safe: rehydrateNow() should early-return if DB weren't ready
				}
			} catch (_) {}

			__didInitialPlayerDbHydrate = true;

			// stop any watchers
			if (__playerDbWatch.intId) {
				clearInterval(__playerDbWatch.intId);
				__playerDbWatch.intId = null;
			}
			return true;
		}

		function runPostCacheTasks() {
			try {
				if (MFLPopupEnablePlayerNews) {
					(function watchNewsBreaker() {
						if (typeof window.newsBreaker !== "undefined") {
							hydrateAllAnchorMeta(document); // full
							return;
						}
						let tries = 0;
						const int = setInterval(() => {
							if (typeof window.newsBreaker !== "undefined") {
								clearInterval(int);
								hydrateAllAnchorMeta(document);
							} else if (++tries > 200) {
								clearInterval(int);
							}
						}, 25);
					})();
				}
				ensurePlayerDbHydratedOnce();
			} catch (_) {}
		}
		try {
			window.MFLGlobalCache.onReady(() => {
				runPostCacheTasks();
			});
		} catch (_) {}
	})();

	window.addEventListener("MFLCacheUpdate", (e) => {
		if (!__FEATURES_ON__) return;
		if (e.detail.key === "newsBreaker" && MFLPopupEnablePlayerNews) {
			hydrateAllAnchorMeta(document, true);
		}
	});

	// ======================= Public helpers (gated no-ops) =======================
	(function attachMFLHelpers() {
		function _resolveRoot(root) {
			if (!root) return document;
			if (root instanceof Element || root === document) return root;
			if (typeof root === 'string') return document.querySelector(root) || document;
			return document;
		}

		function refreshNewsIcons(root) {
			if (!__FEATURES_ON__ || !window.MFLPopupEnablePlayerNews) return;
			const el = _resolveRoot(root);
			if (inDoNotProcessNews(el)) return;
			if (el.matches?.(SEL_PLAYER_LINKS) && !inDoNotProcessNews(el)) enqueueNews(el);
			el.querySelectorAll?.(SEL_PLAYER_LINKS).forEach(a => {
				if (!inDoNotProcessNews(a)) enqueueNews(a);
			});
		}

		function refreshPlayerImages(root) {
			if (!__FEATURES_ON__ || !window.MFLEnablePlayerImages) return;
			const el = _resolveRoot(root);
			if (inDoNotProcessImages(el)) return;

			if (el.matches?.(SEL_PLAYER_LINKS) && el.getAttribute(PROCESSED_ATTR) !== "1" && !inDoNotProcessImages(el)) {
				try {
					buildInnerTableForAnchor(el);
				} catch (_) {}
			}
			el.querySelectorAll?.(SEL_PLAYER_LINKS).forEach(a => {
				if (a.getAttribute(PROCESSED_ATTR) === "1") return;
				if (inDoNotProcessImages(a)) return;
				try {
					buildInnerTableForAnchor(a);
				} catch (_) {}
			});

			if (__rehydrates?.pending?.size > 0) {
				setTimeout(() => {
					buildDbIndex(false);
					rehydrateNow();
				}, 200);
			}
		}

		function refreshAll(root) {
			refreshNewsIcons(root);
			refreshPlayerImages(root);
		}

		function markAllNewsDirty(root) {
			if (!__FEATURES_ON__ || !MFLPopupEnablePlayerNews) return;
			const el = _resolveRoot(root);
			if (inDoNotProcessNews(el)) return;
			const maybeAll = [];
			if (el.matches?.(SEL_PLAYER_LINKS)) maybeAll.push(el);
			el.querySelectorAll?.(SEL_PLAYER_LINKS).forEach(a => maybeAll.push(a));
			for (const a of maybeAll) {
				if (inDoNotProcessNews(a)) continue;
				if (a.dataset && 'news' in a.dataset) delete a.dataset.news;
				enqueueNews(a);
			}
		}

		function rehydratePendingNow() {
			if (!__FEATURES_ON__ || !MFLEnablePlayerImages) return;
			try {
				buildDbIndex(true);
				rehydrateNow();
			} catch (_) {}
		}

		if (!__FEATURES_ON__) {
			const noop = () => {};
			window.refreshNewsIcons = noop;
			window.refreshPlayerImages = noop;
			window.refreshAll = noop;
			window.markAllNewsDirty = noop;
			window.rehydratePendingNow = noop;
			return;
		}

		window.refreshNewsIcons = refreshNewsIcons;
		window.refreshPlayerImages = refreshPlayerImages;
		window.refreshAll = refreshAll;
		window.markAllNewsDirty = markAllNewsDirty;
		window.rehydratePendingNow = rehydratePendingNow;
	})();

	// ======================= Popup a11y close + focus restore (gated) =======================
	(function wirePopupA11yClose() {
		if (!__FEATURES_ON__ || !MFLPopupEnablePlayerNews) return;

		const overlay = document.getElementById('MFLPlayerPopupOverlay');
		const closeBtn = document.getElementById('MFLPlayerPopupClose');
		let lastTrigger = null;

		document.addEventListener('click', (ev) => {
			const a = ev.target && (ev.target.closest ? ev.target.closest(SEL_PLAYER_LINKS) : null);
			if (!a) return;
			if (!MFLPopupEnablePlayerNews || inDoNotProcessNews(a)) return;
			lastTrigger = a;
		}, true);

		function closePopupAndRestoreFocus() {
			if (lastTrigger && lastTrigger.isConnected) {
				lastTrigger.setAttribute('aria-expanded', 'false');
				try {
					lastTrigger.focus({
						preventScroll: true
					});
				} catch (_) {}
			}
		}

		if (overlay) overlay.addEventListener('click', closePopupAndRestoreFocus, true);
		if (closeBtn) closeBtn.addEventListener('click', closePopupAndRestoreFocus, true);

		document.addEventListener('keydown', function (ev) {
			if (ev.key === 'Escape') closePopupAndRestoreFocus();
		}, true);
	})();

	$(document).ready(function () {
		if (document.getElementById('body_player')) {
			const profileURL = new URL(window.location.href)
			const profileID = profileURL.searchParams.get('P')
			var profile_image = "https://www.mflscripts.com/playerImages_80x107/mfl_" + profileID + ".png"
			var profile_imageError = "https://www.mflscripts.com/playerImages_80x107/free_agent.png"
			$('body').addClass('espn_body_player')
			$('head').append('<style>.espn_body_player td.player_photo img{-webkit-box-sizing:unset;-moz-box-sizing:unset;box-sizing:unset;background:#fff}.espn_body_player td.player_photo{text-align:center}</style>')
			$('#body_player td.player_photo img').each(function (index, el) {
				var $el
				$el = $(this)
				$el.attr("src", profile_image)
				$el.one('error', function () {
					$el.one('error', function () {
						$el.one('error', function () {
							// THIS IS THIRD ERROR TRY - IF MFL SCRIPTS HAS NO DEFAULT PLAYER IMAGE - USE MFL DEFAULT NO PLAYER IMAGE
							$(this).attr('src', "https://www63.myfantasyleague.com/player_photos_2010/no_photo_available.jpg")
							$('body').removeClass('espn_body_player')
							//console.log('MFL Script default image no available - use MFL default image')
						});
						// THIS IS SECOND ERROR TRY - IF MFL NO IMAGE - USE MFL SCRIPTS DEFAULT IMAGE
						$(this).attr('src', profile_imageError)
						$('body').addClass('espn_body_player')
						//console.log('MFL has no image of this player - use MFL Scripts default player image')
					});
					// THIS IS FIRST ERROR TRY - IF MFL SCRIPTS HAS NO IMAGE - TRY TO USE MFL IMAGE IF AVAILABE
					$(this).attr('src', '//www.myfantasyleague.com/player_photos_2014/' + profileID + '_thumb.jpg')
					$('body').removeClass('espn_body_player')
					//console.log('MFL Scripts has no image of this player - try to use MFL image if available')
				});
			});
		}
		var articleTargetID = '#body_options_185,#options_177,#options_207,#fantasy_articles,#fantasy_recap,#fantasy_preview';
		$('head').append('<style>.espnImg .articlepicture[src*="playerImages"]{-webkit-box-sizing:unset;-moz-box-sizing:unset;box-sizing:unset;background:#fff;width:auto!important}.espnImg td{display:table;margin:0 auto!important}</style>');
		$(articleTargetID).find('img.articlepicture[src*="_thumb"]').each(function () {
			var imgSrc = $(this).attr('src')
			var playerNum = imgSrc.match((/\/(\d+).*\.jpg$/) || ['', ''])[1]
			var profile_image = "https://www.mflscripts.com/playerImages_80x107/mfl_" + playerNum + ".png";
			var profile_imageError = "https://www.mflscripts.com/playerImages_80x107/free_agent.png";
			$(this).closest('.articlepicturetable').addClass('espnImg');
			$(this).attr("src", profile_image);
			$(this).each(function (index, el) {
				var $el
				$el = $(this)
				$el.attr("src", profile_image)
				$el.one('error', function () {
					$el.one('error', function () {
						$el.one('error', function () {
							// THIS IS THIRD ERROR TRY - IF MFL SCRIPTS HAS NO DEFAULT PLAYER IMAGE - USE MFL DEFAULT NO PLAYER IMAGE
							$(this).attr('src', "https://www63.myfantasyleague.com/player_photos_2010/no_photo_available.jpg")
							$(this).closest('.articlepicturetable').removeClass('espnImg')
							//console.log('MFL Script default image no available - use MFL default image')
						});
						// THIS IS SECOND ERROR TRY - IF MFL NO IMAGE - USE MFL SCRIPTS DEFAULT IMAGE
						$(this).attr('src', profile_imageError)
						$(this).closest('.articlepicturetable').addClass('espnImg')
						//console.log('MFL has no image of this player - use MFL Scripts default player image')
					});
					// THIS IS FIRST ERROR TRY - IF MFL SCRIPTS HAS NO IMAGE - TRY TO USE MFL IMAGE IF AVAILABE
					$(this).attr('src', '//www.myfantasyleague.com/player_photos_2014/' + playerNum + '_thumb.jpg')
					$(this).closest('.articlepicturetable').removeClass('espnImg')
					//console.log('MFL Scripts has no image of this player - try to use MFL image if available')
				});
			});
		});
	});

	jQuery('head').append('<style>#MFLPlayerPopupHeader > table > tbody > tr:nth-child(4) br,#MFLPlayerPopupBio > table > tbody > tr:nth-child(4) br{display:none}#MFLPlayerPopupHeader > table > tbody > tr:nth-child(4) td:nth-child(1),#MFLPlayerPopupBio > table > tbody > tr:nth-child(4) td:nth-child(1){overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:6.25rem}.playerPopupIcon[src*=".svg"],.playerPopupIcon[src*=".svg"][src*="newsNew"]{height:0.875rem!important;padding-left:0!important;margin-top:-0.188rem!important;vertical-align: middle!important}#MFLPlayerPopupOverlay[style*="display: block"] + #MFLPlayerPopupContainer{display:block!important}.MFLPlayerPopupNFLTeamLogo{right:0.375rem;left:auto;top:0.188rem;max-width:1.375rem;max-height:1.375rem}#MFLPlayerPopupHeader .popreport td,#MFLPlayerPopupBio .popreport td.pop-photo{padding-right:0.313rem}.MFLPopupFontAwesomeMenu {font-size:1.5rem;float:right;padding-left:0.5rem;padding-top: 0.375rem;}.MFLPopupNotify2{float:initial;font-size:1.25rem}.MFLPopupFontAwesomeCaption {font-size: 1.125rem;}.MFLPlayerPopupHeaderCaption .MFLPopupFontAwesomeMenu{float:none;padding:0;font-size:100%}@media only screen and (max-width: 26.25em){.pt-hide{display:none}}</style>');

	if (MFLPlayerPopupIncludeProjections) jQuery("head").append("<style>#MFLPlayerPopupProjections{position:relative;height:17.5rem;height:17.5rem;overflow:auto;-webkit-overflow-scrolling:touch}</style>");

	try {
		CameraTag.jQueryPreInstalled = true
	} catch (er) {}

	//////////////////////////////////////////////////
	// CUSTOM PLAYER POPUP FUNCTIONS
	//////////////////////////////////////////////////
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	function MFLPlayerPopupCreateContainer() {
		jQuery("body").append("<div id='isMediaContainer' style='display:none'>");
		jQuery("#isMediaContainer").append("<div class='isMedia'>"); //CAN USE if(jQuery(".isMedia").css("display")==="none") THEN MEDIA ELSE !MEDIA
		jQuery("body").append("<div id='MFLPlayerPopupOverlay'>");
		jQuery("body").append("<div id='MFLPlayerPopupContainer' style='left:0!important;right:0!important;top:0!important;bottom:0!important;margin:auto'>");
		jQuery("#MFLPlayerPopupContainer").append("<caption class='MFLPlayerPopupHeaderCaption'><span id='MFLPlayerPopupName'></span></caption>");
		jQuery("#MFLPlayerPopupContainer").append("<span id='MFLPlayerPopupClose' onclick='MFLPlayerPopupClose()'>X</span>");
		jQuery("#MFLPlayerPopupContainer").append("<div id='MFLPlayerPopupLoading'><center>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></center></div>");
		jQuery("#MFLPlayerPopupContainer").append("<div id='MFLPlayerPopupArticleLoaded'>");
		jQuery("#MFLPlayerPopupContainer").append("<div id='MFLPlayerPopupLoaded'>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupHeader'></div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div class='MFLPopTabWrap'><ul class='MFLPlayerPopupTab'></ul></div><div id='MFLPlayerPopupLinks'></div>");
		jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupNews')\" id='MFLPlayerPopupTabLinksNews'><span class='pt-hide'>Player</span> News</a></li>");
		jQuery(".MFLPlayerPopupTab:not('#TeamDetails .MFLPlayerPopupTab')").append("<li class='MFLPlayerPopupPlayerTabs' id='MFLPlayerPopupBioTab'><a href='javascript:void(0)' class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupBio')\">Bio</a></li>");
		jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupStats')\"><span class='pt-hide'>" + year + "</span> Stats</a></li>");
		if (MFLPlayerPopupIncludeProjections) jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupProjections')\">Proj.</a></li>");
		jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupStatsHistory')\">Career <span class='pt-hide'>Stats</span></a></li>");
		if (MFLPopupEnableTrade || MFLPopupEnableTradePoll) jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupTrades')\" id='MFLPlayerPopupTabLinksTrades'>Trades</a></li>");
		if (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "") jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupCommishMessage')\" id='MFLPlayerPopupTabLinksCommishMessage'>Commish Msg</a></li>");
		if (MFLPopupEnableReminders) jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupReminders')\" id='MFLPlayerPopupTabLinksReminders'>Reminders</a></li>");
		if (MFLPopupEnableMessages) jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupMessages')\" id='MFLPlayerPopupTabLinksMessages'>Messages</a></li>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupNews' class='MFLPlayerPopupTabContent'></div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupBio' class='MFLPlayerPopupTabContent'>Bio Table</div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupStatsHistory' class='MFLPlayerPopupTabContent'>Stats History Table</div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupStats' class='MFLPlayerPopupTabContent'>Stats Table</div>");
		if (MFLPlayerPopupIncludeProjections) jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupProjections' class='MFLPlayerPopupTabContent'><div id='MFLPlayerPopupLoading'><center>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></center></div></div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupTrades' class='MFLPlayerPopupTabContent'>No Data</div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupCommishMessage' class='MFLPlayerPopupTabContent'>No Data</div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupReminders' class='MFLPlayerPopupTabContent'>No Data</div>");
		jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupMessages' class='MFLPlayerPopupTabContent'>No Data</div>");
		jQuery("#MFLPlayerPopupContainer").wrapInner("<div class='report'></div>");
		//allow to close on overlay click
		jQuery("#MFLPlayerPopupOverlay").off().on("click", function () {
			MFLPlayerPopupClose();
		});
	}

	function isElementVisible(el) {
		if (!el) return false;
		const style = getComputedStyle(el);
		// must be in DOM, displayed, visible, and have size
		const rect = el.getBoundingClientRect();
		const inViewport = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0;
		return (
			style.display !== 'none' &&
			style.visibility !== 'hidden' &&
			style.opacity !== '0' &&
			inViewport
		);
	}

	function MFLPlayerPopupClose() {
		jQuery("#MFLPlayerPopupOverlay").hide();
		jQuery("#MFLPlayerPopupContainer").hide();
		jQuery(".MFLPlayerPopupTabContent").hide();
		jQuery('#MFLPlayerPopupContainer').removeClass('MFLPlayerPopupArticleContainer');
		jQuery('#MFLPlayerPopupContainer').removeClass('MFLPlayerPopupNotificationContainer');
		try {
			if (typeof LSMteamBox !== 'undefined' && LSMteamBox) {
				if (isElementVisible(LSMteamBox)) {
					//do nothing
				} else {
					bodyScrollLock.clearAllBodyScrollLocks();
				}
			} else {
				bodyScrollLock.clearAllBodyScrollLocks();
			}
		} catch (er) {};
		$('.MFLPlayerPopupTabContent').removeClass('active_div_tab_scroll');
		$('.MFLPlayerPopupPlayerTabs a,.MFLPlayerPopupNotificationTabs a').not('#TeamDetails .MFLPlayerPopupPlayerTabs a').removeClass('active');
	}

	function MFLPlayerPopupOpenTab(evt, MFLPlayerPopupTab) {
		$('#TeamDetails .MFLPlayerPopupTab a.active').addClass("dummyClass");
		var i, MFLPlayerPopupTabContent, MFLPlayerPopupTabLinks;
		MFLPlayerPopupTabContent = document.getElementsByClassName("MFLPlayerPopupTabContent");
		for (i = 0; i < MFLPlayerPopupTabContent.length; i++) MFLPlayerPopupTabContent[i].style.display = "none";
		MFLPlayerPopupTabLinks = document.getElementsByClassName("MFLPlayerPopupTabLinks");
		for (i = 0; i < MFLPlayerPopupTabLinks.length; i++) MFLPlayerPopupTabLinks[i].className = MFLPlayerPopupTabLinks[i].className.replace(" active", "");
		document.getElementById(MFLPlayerPopupTab).style.display = "block";
		evt.currentTarget.className += " active";
		if (MFLPlayerPopupTab === "MFLPlayerPopupProjections") setTimeout("MFLPlayerPopupPopulateProjections()", 5);
		$('#TeamDetails .MFLPlayerPopupTab a.dummyClass').addClass("active");
		$('#TeamDetails .MFLPlayerPopupTab a.dummyClass').removeClass("dummyClass");
		//MIKE ADDED FOR BODY SCROLL
		$('.MFLPlayerPopupTabContent:visible').addClass('active_div_tab_scroll');
		$('.MFLPlayerPopupTabContent:hidden').removeClass('active_div_tab_scroll');
		const pop_popPlayer = document.querySelector('.active_div_tab_scroll');
		try {
			bodyScrollLock.disableBodyScroll(pop_popPlayer);
		} catch (er) {};
	}

	function includes(container, value) {
		var returnValue = false;
		var pos = container.indexOf(value);
		if (pos >= 0) {
			returnValue = true;
		}
		return returnValue;
	}

	function MFLPlayerPopupSetupTeamNames() {
		for (var key in franchiseDatabase)
			if (key !== 'fid_0000' && franchiseDatabase.hasOwnProperty(key)) MFLPlayerPopupTeamNames[franchiseDatabase[key].name] = ({
				'id': franchiseDatabase[key].id,
				'abbrev': franchiseDatabase[key].abbrev
			});
	}

	function MFLPlayerPopupMoreNews(link, cellId) {
		fetch(`${baseURLDynamic}/${year}/${link}`)
			.then(response => response.text())
			.then(articleData => {
				var newsRow = 0;
				var articleHTML = "";
				jQuery(articleData).find(".report tr").each(function () {
					if (newsRow === 1) {
						// remove all links from article
						jQuery(this).find("td a").contents().unwrap();
						articleHTML = jQuery(this).find("td:eq(0)").html();
						if (articleHTML.indexOf("Article Link") > 0) articleHTML = articleHTML.substring(0, articleHTML.indexOf("Article Link") - 2);
						if (articleHTML.indexOf("Roto Pass from") > 0) articleHTML = articleHTML.substring(0, articleHTML.indexOf("Roto Pass from") - 3);
					}
					newsRow++;
				});
				if (articleHTML !== "") jQuery("#" + cellId).html(articleHTML);
			});
	}

	function MFLPlayerPopupArticleSetup(headline, ago, link) {
		// container class & base visibility
		const container = document.getElementById('MFLPlayerPopupContainer');
		if (container) container.classList.add('MFLPlayerPopupArticleContainer');

		const overlay = document.getElementById('MFLPlayerPopupOverlay');
		const loading = document.querySelector('#MFLPlayerPopupContainer #MFLPlayerPopupLoading');
		const loaded = document.getElementById('MFLPlayerPopupLoaded');
		const articleLoaded = document.getElementById('MFLPlayerPopupArticleLoaded');
		const nameEl = document.getElementById('MFLPlayerPopupName');

		if (overlay) overlay.style.display = 'block';
		if (loading) loading.style.display = 'block';
		if (loaded) loaded.style.display = 'none';
		if (articleLoaded) articleLoaded.style.display = 'none';
		if (nameEl) nameEl.textContent = `Article Posted ${ago} Ago`;
		if (container) container.style.display = 'block';

		// Hide team details like before
		document.querySelectorAll('.teamdetailsWrap, #TeamDetails').forEach(el => {
			el.style.display = 'none';
		});

		// Body scroll lock (if available)
		try {
			const popArticle = document.querySelector('#MFLPlayerPopupArticleLoaded');
			if (popArticle && window.bodyScrollLock?.disableBodyScroll) {
				window.bodyScrollLock.disableBodyScroll(popArticle);
			}
		} catch {}

		// Small delay like your original (but with a real function)
		setTimeout(() => {
			MFLPlayerPopupArticlePopulate(headline, ago, link);
		}, 200);
	}

	function MFLPlayerPopupNotificationPreSetup() {
		jQuery('#MFLPlayerPopupContainer').addClass('MFLPlayerPopupNotificationContainer');
		jQuery("#MFLPlayerPopupOverlay").show();
		jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show();
		jQuery(".MFLPlayerPopupPlayerTabs:not(#TeamDetails .MFLPlayerPopupPlayerTabs)").css("display", "none");
		jQuery("#MFLPlayerPopupBioTab").attr("style", "display:none!important");
		jQuery(".MFLPlayerPopupNotificationTabs").css("display", "table-cell");
		jQuery("#MFLPlayerPopupLinks").css("display", "none");
		jQuery("#MFLPlayerPopupLoaded").hide();
		jQuery("#MFLPlayerPopupArticleLoaded").hide();
		//MIKE ADDED FOR BODY SCROLL
		if (MFLPopupEnableTrade && (MFLPlayerPopupOnloadContent[0] !== "" || MFLPlayerPopupOnloadContent[1] !== "")) {
			$("#MFLPlayerPopupTrades").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksTrades").addClass('active');
		} else if (MFLPopupEnableCommishMessage && MFLPlayerPopupOnloadContent[4] !== "") {
			$("#MFLPlayerPopupCommishMessage").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksCommishMessage").addClass("active");
		} else if (MFLPopupEnableReminders && MFLPlayerPopupOnloadContent[2] !== "") {
			$("#MFLPlayerPopupReminders").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksReminders").addClass("active");
		} else if (MFLPopupEnableMessages && MFLPlayerPopupOnloadContent[3] !== "") {
			$("#MFLPlayerPopupMessages").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksMessages").addClass("active");
		} else if (MFLPopupEnableTrade) {
			$("#MFLPlayerPopupTrades").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksTrades").addClass('active');
		} else if (MFLPopupEnableCommishMessage) {
			$("#MFLPlayerPopupCommishMessage").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksCommishMessage").addClass("active");
		} else if (MFLPopupEnableReminders) {
			$("#MFLPlayerPopupReminders").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksReminders").addClass("active");
		} else if (MFLPopupEnableMessages) {
			$("#MFLPlayerPopupMessages").addClass('active_div_tab_scroll').show();
			$("#MFLPlayerPopupTabLinksMessages").addClass("active");
		} else {
			jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>").parent().addClass("noHide");
			$("#MFLPlayerPopupMessages").addClass('active_div_tab_scroll').show();
		}
		const pop_popPlayer = document.querySelector('.active_div_tab_scroll');
		try {
			bodyScrollLock.disableBodyScroll(pop_popPlayer);
		} catch (er) {};
		jQuery("#MFLPlayerPopupName").html("League Notifications <span class='MFLPopupLeagueNotification' style='padding:0;background:none' title='Notifications'>" + MFLPopupNotifyFontAwesome + "</span>");
		jQuery("#MFLPlayerPopupContainer").show();
	}

	function MFLPlayerPopupNotificationSetup(isOnclick) {
		if (MFLPlayerPopupTracker[0] === 1 && MFLPlayerPopupTracker[1] === 1 && MFLPlayerPopupTracker[2] === 1 && MFLPlayerPopupTracker[3] === 1 && MFLPlayerPopupTracker[4] === 1) {
			if (isOnclick || MFLPlayerPopupOnloadContent[0] !== "" || MFLPlayerPopupOnloadContent[1] !== "" || MFLPlayerPopupOnloadContent[2] !== "" || MFLPlayerPopupOnloadContent[3] !== "" || MFLPlayerPopupOnloadContent[4] !== "") {
				if (!isOnclick) MFLPlayerPopupNotificationPreSetup();
				if (MFLPlayerPopupOnloadContent[0] === "" && MFLPlayerPopupOnloadContent[1] === "" && MFLPlayerPopupOnloadContent[2] === "" && MFLPlayerPopupOnloadContent[3] === "" && MFLPlayerPopupOnloadContent[4] === "") jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>").parent().addClass("noHide");
				else if (MFLPopupEnableAutoNotification) jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications that have been set to automatically display once per browser session.<br><br>After closing this popup you can re-open notifications by either closing and re-opening the browser or clicking on the notification icon in the menu.</td></tr></tbody></table>");
				else jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications. Check the tabs below to view them.</td></tr></tbody></table>");
				if (MFLPlayerPopupOnloadContent[0] === "" && MFLPlayerPopupOnloadContent[1] === "") jQuery("#MFLPlayerPopupTrades").html("<br /><center><i>No Current Trade Notifications</i></center>");
				else jQuery("#MFLPlayerPopupTrades").html(MFLPlayerPopupOnloadContent[0].replace(/report/g, "popreport").replace("<caption><span>Pending Trades</span></caption>", "") + MFLPlayerPopupOnloadContent[1].replace(/report/g, "popreport").replace("<caption><span></span></caption>", ""));
				if (MFLPlayerPopupOnloadContent[2] === "") jQuery("#MFLPlayerPopupReminders").html("<br /><center><i>No Active League Reminders<br/><br/>OR<br/><br/>League Reminders are Disabled in <a href='" + baseURLDynamic + "/" + year + "/csetup?L=" + league_id + "&C=FCUSTOM&F=" + franchise_id + "'>Franchise Customization</a> Settings</i></center>");
				else jQuery("#MFLPlayerPopupReminders").html(MFLPlayerPopupOnloadContent[2].replace(/report/g, "popreport"));
				if (MFLPlayerPopupOnloadContent[3] === "") jQuery("#MFLPlayerPopupMessages").html("<br /><center><i>No Active Messages from MyFantasyLeague</i></center>");
				else jQuery("#MFLPlayerPopupMessages").html(MFLPlayerPopupOnloadContent[3].replace(/report/g, "popreport"));
				if (MFLPlayerPopupOnloadContent[4] === "") jQuery("#MFLPlayerPopupCommishMessage").html("<br /><center><i>No Active Messages from Commissioner</i></center>");
				else jQuery("#MFLPlayerPopupCommishMessage").html(MFLPlayerPopupOnloadContent[4].replace(/report/g, "popreport"));
				setTimeout("MFLPlayerPopupInitiate(2)", 1000);
			}
		}
	}

	function MFLPlayerPopupPopulateProjections() {
		jQuery("#MFLPlayerPopupProjections #MFLPlayerPopupLoading").show();

		setTimeout(function () {
			if (jQuery("#MFLPlayerPopupProjections").text() === "Loading Content . . .") {

				fetch(`${baseURLDynamic}/${year}/player?L=${league_id}&P=${MFLPlayerPopupCurrentPID}&YEAR=${year}&DISPLAY_TYPE=projections`)
					.then(function (response) {
						if (!response.ok) throw new Error("Network response was not OK.");
						return response.text();
					})
					.then(function (projectionsData) {

						var $doc = jQuery(projectionsData);

						// Find the "Status" column index from the header row (Week/Pts/Opponent/Status/...)
						var statusColIndex = -1;
						$doc.find("#player_stats_table tr").each(function () {
							var $ths = jQuery(this).find("th");
							if ($ths.length) {
								$ths.each(function (i) {
									if (jQuery(this).text().trim().toLowerCase() === "status") {
										statusColIndex = i;
										return false; // break each()
									}
								});
								if (statusColIndex !== -1) return false; // break tr each()
							}
						});

						var currentRow = 0;
						var projectionsHTML = "<table class='popreport'><tbody>";

						$doc.find("#player_stats_table tr").each(function () {
							var $tr = jQuery(this);

							// ignore form rows
							if ($tr.find("form").length > 0) return;

							// Header rows
							if ($tr.find("th").length > 0) {
								// First header row with colspan=4 (blank area) should become colspan=3
								var $firstTh = $tr.find("th:eq(0)");
								var cs = parseInt($firstTh.attr("colspan"), 10);

								if (cs === 4) {
									$firstTh.attr("colspan", 3);
								} else if (statusColIndex !== -1) {
									// Remove the Status header cell if present on this header row
									var $ths = $tr.find("th");
									if ($ths.length > statusColIndex) {
										$ths.eq(statusColIndex).remove();
									}
								}

								projectionsHTML += "<tr>" + $tr.html() + "</tr>";
								return;
							}

							// Data rows
							var $tds = $tr.find("td");
							if ($tds.length > 1) {

								if (statusColIndex !== -1) {
									// Special case: Total row has a colspan cell that spans Opponent+Status.
									// If we remove Status, reduce that colspan from 2 -> 1.
									// (This is the <td colspan="2">&nbsp;</td> cell in your Total row)
									var $colspanTd = $tr.find('td[colspan]');
									if ($colspanTd.length) {
										var col = parseInt($colspanTd.attr("colspan"), 10);
										if (Number.isFinite(col) && col > 1) {
											// In this table it should be 2, but keep it safe:
											$colspanTd.attr("colspan", col - 1);
										}
									} else {
										// Normal rows: remove the Status cell by index
										if ($tds.length > statusColIndex) {
											$tds.eq(statusColIndex).remove();
										}
									}
								}

								if (currentRow % 2) projectionsHTML += "<tr class='eventablerow'>" + $tr.html() + "</tr>";
								else projectionsHTML += "<tr class='oddtablerow'>" + $tr.html() + "</tr>";

								currentRow++;
							}
						});

						projectionsHTML += "</tbody></table>";
						jQuery("#MFLPlayerPopupProjections").html(projectionsHTML);
					})
					.catch(function (error) {
						console.error("Error:", error);
					});
			}
		}, 1000);
	}

	function MFLPlayerPopupPopulate(pid, pName, pTeam, pPosition) { //ADD HTML TO PLAYER NEWS POPUP
		MFLPlayerPopupTracker = [];
		var pStatus = "";
		jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show();
		jQuery("#MFLPlayerPopupLoaded").hide();
		jQuery("#MFLPlayerPopupArticleLoaded").hide();
		fetch(`${baseURLDynamic}/${year}/export?TYPE=playerStatus&L=${league_id}&P=${pid}&JSON=1`)
			.then(response => response.json())
			.then(statusData => {
				try {
					pStatus = MFLPopupCustomRule("pStatus", null, null, pid, pName, pTeam, pPosition, statusData, null, null);
				} catch (er) {
					try {
						pStatus = statusData.playerStatus.status;
					} catch (er) {}
				}
				const playerUrl = `${baseURLDynamic}/${year}/player?L=${league_id}&P=${pid}`;
				return fetch(playerUrl);
			})
			.then(response => response.text())
			.then(playerData => {

				var photo = jQuery(playerData).find(".player_photo img").each(function () {
					$(this).attr("src", "https://www.mflscripts.com/playerImages_80x107/mfl_" + pid + ".png")
				}).parent().html();
				//var photo = jQuery(playerData).find(".player_photo").html();
				var playerDetail = ({
					'ht': '--',
					'wt': '--',
					'dob': '--',
					'age': '--',
					'college': '---',
					'draftYear': 'n/a',
					'draftTeam': '',
					'round': '',
					'pick': '',
					'jersey': '--',
					'experience': '',
					'acquired': '',
					'photo': photo
				});
				var includeNFLLogo = true;

				// Ensure TEAM_POS_SETS exists somewhere above (keys uppercased)
				const isTeamPos = TEAM_POS_SETS.has(String(pPosition ?? playerDetail?.position ?? "").toUpperCase());

				if (playerDetail.photo == null || isTeamPos) {
					// Use team logo when no photo or for team/aggregate positions
					const teamCode = String(pTeam ?? playerDetail?.team ?? "FA").toUpperCase();
					const logoSrc = teamLogoUrl(teamCode);

					playerDetail.photo = `<img class="playerPhoto" src="${logoSrc}" alt="${teamCode}" title="${teamCode}" align="middle">`;

					// If you overlay NFL logos elsewhere, disable that when using the team image as the photo
					if (typeof includeNFLLogo !== "undefined") includeNFLLogo = false;

				} else {
					// Harden the fallback: swap any "no_photo_available.jpg" for an FA placeholder image
					playerDetail.photo = String(playerDetail.photo).replace(
						/no_photo_available\.jpg/gi,
						"https://www.mflscripts.com/playerImages_80x107/free_agent.png"
					);
				}


				playerDetail.photo = playerDetail.photo.replace("img", "img class='articlepicture'");

				//LINKS
				if (!MFLPopupOmitLinks) {
					var linksHTML = "<table class='popreport'><tbody>";
					linksHTML += "<tr class='oddtablerow'>";
					// FULL PROFILE
					linksHTML += "<td style='text-align:center; text-indent:0;'><a href='" + baseURLDynamic + "/" + year + "/player?L=" + league_id + "&P=" + pid + "'>Full Profile</a></td>";
					// FANTASY SHARKS
					var fantasySharksLink = "";
					jQuery(playerData).find("h3 a").each(function () {
						if (jQuery(this).text() === "FantasySharks Profile") {
							fantasySharksLink = "<a href='" + jQuery(this).attr("href") + "' title='Fantasy Sharks Profile' target='_blank'>Fantasy Sharks</a>";
							return false;
						}
					});
					if (fantasySharksLink !== "") linksHTML += "<td class='screen-hide' style='text-align:center; text-indent:0;'>" + fantasySharksLink + "</td>";
					if (typeof franchise_id !== 'undefined') { // IF LOGGED IN TO LEAGUE 
						if (franchise_id !== "0000") { // AND NOT COMMISH
							// ADD/TRADE/DROP
							var addPlayerLink = "<a href='" + baseURLDynamic + "/" + year + "/add_drop?L=" + league_id + "&P=" + pid + "'>Add Player</a>";
							try {
								if (playerDatabase["pid_" + pid].fid !== undefined) //PLAYER IS NOT A FREE AGENT
									if (playerDatabase["pid_" + pid].fid.indexOf(franchise_id) === -1) //NOT ON CURRENT OWNERS ROSTER
										addPlayerLink = "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=05&FRANCHISE=" + franchise_id + "," + playerDatabase["pid_" + pid].fid.substring(0, 4) + "&P=" + pid + "'>Propose Trade</a>";
									else addPlayerLink = "<a href='" + baseURLDynamic + "/" + year + "/add_drop?L=" + league_id + "'>Drop Player</a>";
							} catch (er) {
								//ERROR OCCURS IN PLAYER POPUP WHEN PLAYER TO ADD IS CLICKED IN ADD/DROP FORM 
							}
							linksHTML += "<td style='text-align:center; text-indent:0;'>" + addPlayerLink + "</td>";
							// WATCH LIST LINK
							var watchListLink = "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=178&PID=" + pid + "'>Watchlist</a>";
							jQuery(playerData).find("h3 a").each(function () {
								if (jQuery(this).text().indexOf("Remove") > -1) {
									watchListLink = "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=178&PID=" + pid + "&ACTION=delete'>Watchlist Remove</a>";
									return false;
								}
								if (jQuery(this).text().indexOf("Add") > -1) {
									watchListLink = "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=178&PID=" + pid + "&ACTION=add'>Watchlist Add</a>";
									return false;
								}
							});
							linksHTML += "<td style='text-align:center; text-indent:0;'>" + watchListLink + "</td>";
						}
					}
					// TRANSACTION HISTORY LINK
					linksHTML += "<td style='text-align:center; text-indent:0;'><a href='" + baseURLDynamic + "/" + year + "/player_history?L=" + league_id + "&PLAYERS=" + pid + "'>Trans. History</a></td>";
					linksHTML += "</tr></tbody></table>";
					// UPDATE LINKS
					jQuery("#MFLPlayerPopupLinks").html(linksHTML);
				}
				var extrasFound = [];
				jQuery(playerData).find(".biography.report tr").each(function () {
					var cellHead = jQuery(this).find("th:eq(0)").html();
					var cellInfo = jQuery(this).find("td:eq(0)").html();
					switch (cellHead) {
						case "Height/Weight:":
							playerDetail.ht = cellInfo.substring(0, cellInfo.indexOf("/") - 1);
							playerDetail.wt = cellInfo.substring(cellInfo.indexOf("/") + 2, cellInfo.length);
							break;
						case "DOB/Age:":
							playerDetail.dob = cellInfo.substring(0, cellInfo.indexOf("/") - 1);
							playerDetail.age = cellInfo.substring(cellInfo.indexOf("/") + 2, cellInfo.length);
							break;
						case "Jersey Num:":
							playerDetail.jersey = parseInt(cellInfo);
							break;
						case "College:":
							playerDetail.college = cellInfo;
							break;
						case "Drafted:":
							if (cellInfo === "Undrafted") {
								playerDetail.draftYear = "?";
								playerDetail.draftTeam = "FA";
								playerDetail.round = "n/a";
								playerDetail.pick = "n/a";
							} else {
								playerDetail.draftYear = cellInfo.substring(0, cellInfo.indexOf("/") - 1);
								playerDetail.draftTeam = cellInfo.substring(cellInfo.indexOf("/") + 2, cellInfo.indexOf("Round") - 3);
								playerDetail.round = parseInt(cellInfo.substring(cellInfo.indexOf("Round") + 6, cellInfo.length));
								playerDetail.pick = parseInt(cellInfo.substring(cellInfo.indexOf("Pick") + 5, cellInfo.length));
							}
							break;
						case "Experience:":
							if (isNaN(parseInt(cellInfo))) {
								playerDetail.experience = "(Exp.: Rookie)";
								playerDetail.experienceInt = 1;
							} else {
								playerDetail.experience = "(Exp.: " + parseInt(cellInfo) + " years)";
								playerDetail.experienceInt = parseInt(cellInfo);
							}
							break;
						case "Acquired:":
							playerDetail.acquired = cellInfo;
							break;
						case "Salary:":
							try {
								extrasFound[extrasFound.length] = MFLPopupCustomRule("salary", MFLPlayerPopupExtraTitles.salary, cellInfo, pid, pName, pTeam, pPosition, statusData, pStatus, playerDetail);
							} catch (er) {
								extrasFound[extrasFound.length] = ({
									"title": MFLPlayerPopupExtraTitles.salary,
									"info": cellInfo
								});
							}
							break;
						case "Contract Year:":
							try {
								extrasFound[extrasFound.length] = MFLPopupCustomRule("contract_year", MFLPlayerPopupExtraTitles.contractyear, cellInfo, pid, pName, pTeam, pPosition, statusData, pStatus, playerDetail);
							} catch (er) {
								extrasFound[extrasFound.length] = ({
									"title": MFLPlayerPopupExtraTitles.contractyear,
									"info": cellInfo
								});
							}
							break;
						case "Contract Status:":
							try {
								extrasFound[extrasFound.length] = MFLPopupCustomRule("contract_status", MFLPlayerPopupExtraTitles.contractstatus, cellInfo, pid, pName, pTeam, pPosition, statusData, pStatus, playerDetail);
							} catch (er) {
								extrasFound[extrasFound.length] = ({
									"title": MFLPlayerPopupExtraTitles.contractstatus,
									"info": cellInfo
								});
							}
							break;
						case "Contract Info:":
							try {
								extrasFound[extrasFound.length] = MFLPopupCustomRule("contract_info", MFLPlayerPopupExtraTitles.contractinfo, cellInfo, pid, pName, pTeam, pPosition, statusData, pStatus, playerDetail);
							} catch (er) {
								extrasFound[extrasFound.length] = ({
									"title": MFLPlayerPopupExtraTitles.contractinfo,
									"info": cellInfo
								});
							}
							break;
					}
				});
				if (extrasFound.length > 0) var thisRowSpan = 6;
				else var thisRowSpan = 4;
				if (MFLPopupOmitStatus && extrasFound.length === 1) thisRowSpan = 4;
				if (includeNFLLogo && MFLPlayerPopupIncludeNFLLogo) var myNFLLogo = "<img src='https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/" + pTeam + ".svg' class='MFLPlayerPopupNFLTeamLogo' />";
				else var myNFLLogo = "";

				const jersey = String(playerDetail?.jersey ?? "").trim();
				var myJerseySpan = (!isTeamPos && jersey && jersey !== "--") ? `<span class='MFLPlayerPopupJersey'><span>${jersey}</span></span>` : "";

				var headerHTML = "<table class='popreport'><tbody>";
				headerHTML += "<tr class='oddtablerow rows-" + thisRowSpan + "'><td class='pop-photo' rowspan='" + thisRowSpan + "'>" + playerDetail.photo + myNFLLogo + myJerseySpan + "</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Ht:</span> " + playerDetail.ht + "</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Wt:</span> " + playerDetail.wt + "</td></tr>";
				headerHTML += "<tr class='eventablerow rows-" + thisRowSpan + "'><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Born:</span> " + playerDetail.dob + " <span class='screen-hide'>(" + playerDetail.age + ")</span></td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>College:</span> " + playerDetail.college + "</td></tr>";
				if (playerDetail.draftTeam === "FA") var draftDetail = (year - playerDetail.experienceInt + 1) + " Undrafted " + playerDetail.experience;
				else if (playerDetail.round === "") var draftDetail = playerDetail.draftYear + " " + playerDetail.experience;
				else var draftDetail = playerDetail.draftYear + " #" + playerDetail.round + "." + playerDetail.pick + " " + playerDetail.draftTeam + " <span class='screen-hide'>" + playerDetail.experience + "</span>";
				headerHTML += "<tr class='oddtablerow rows-" + thisRowSpan + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Draft:</span> " + draftDetail + "</td></tr>";
				if (MFLPopupOmitStatus) {
					var row1 = "even";
					var row2 = "odd";
				} else {
					headerHTML += "<tr class='eventablerow rows-" + thisRowSpan + "'><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Status:</span> " + pStatus + "</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Acquired:</span> " + playerDetail.acquired + "</td></tr>";
					var row1 = "odd";
					var row2 = "even";
				}
				switch (extrasFound.length) {
					case 1:
						headerHTML += "<tr class='" + row1 + "tablerow rows-" + thisRowSpan + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold' id='extras-0-title'>" + extrasFound[0].title + ":</span> " + extrasFound[0].info + "</td></tr>";
						if (!MFLPopupOmitStatus) headerHTML += "<tr class='" + row2 + "tablerow rows-" + thisRowSpan + "'><td colspan='2'> </td></tr>";
						break;
					case 2:
						headerHTML += "<tr class='" + row1 + "tablerow rows-" + thisRowSpan + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-0-title'style='font-weight:bold'>" + extrasFound[0].title + ":</span> " + extrasFound[0].info + "</td></tr>";
						headerHTML += "<tr class='" + row2 + "tablerow rows-" + thisRowSpan + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>" + extrasFound[1].title + ":</span> " + extrasFound[1].info + "</td></tr>";
						break;
					case 3:
						headerHTML += "<tr class='" + row1 + "tablerow rows-" + thisRowSpan + "'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>" + extrasFound[0].title + ":</span> " + extrasFound[0].info + "</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>" + extrasFound[1].title + ":</span> " + extrasFound[1].info + "</td></tr>";
						headerHTML += "<tr class='" + row2 + "tablerow rows-" + thisRowSpan + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>" + extrasFound[2].title + ":</span> " + extrasFound[2].info + "</td></tr>";
						break;
					case 4:
						headerHTML += "<tr class='" + row1 + "tablerow rows-" + thisRowSpan + "'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>" + extrasFound[0].title + ":</span> " + extrasFound[0].info + "</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>" + extrasFound[1].title + ":</span> " + extrasFound[1].info + "</td></tr>";
						headerHTML += "<tr class='" + row2 + "tablerow rows-" + thisRowSpan + "'><td><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>" + extrasFound[2].title + ":</span> " + extrasFound[2].info + "</td><td><span class='MFLPlayerPopupHeaderTitle extras-3-title' style='font-weight:bold'>" + extrasFound[3].title + ":</span> " + extrasFound[3].info + "</td></tr>";
						break;
					default:
						break;
				}
				headerHTML += "</tbody></table>";
				jQuery("#MFLPlayerPopupHeader").html(headerHTML);
				jQuery("#MFLPlayerPopupBio").html(headerHTML);
				var currentRow = 0;
				var statsHistoryHTML = "<table class='popreport'><tbody>";
				jQuery(playerData).find(".biohistory.report tr").each(function () {
					if (jQuery(this).find("form").length > 0) {
						// ignore
					} else if (jQuery(this).find("th").length > 0) { //header row
						statsHistoryHTML += "<tr>" + jQuery(this).html() + "</tr>";
					} else if (jQuery(this).find("td").length > 0) { //cell row
						//remove links
						jQuery(this).find("td a").contents().unwrap();
						jQuery(this).find("td a").remove();
						if (currentRow % 2) statsHistoryHTML += "<tr class='eventablerow'>" + jQuery(this).html() + "</tr>";
						else statsHistoryHTML += "<tr class='oddtablerow'>" + jQuery(this).html() + "</tr>";
						currentRow++;
					}
				});
				statsHistoryHTML += "</tbody></table>";
				jQuery("#MFLPlayerPopupStatsHistory").html(statsHistoryHTML);
				var currentRow = 0;
				var removeIdx = []; // indexes of Opp Avg / Opp Rank columns to remove
				var statsHTML = "<table class='popreport'><tbody>";

				// Build removal indexes from the main header row (Week/Pts/...)
				jQuery(playerData).find("#player_stats_table tr").each(function () {
					var $tr = jQuery(this);
					var $ths = $tr.find("th");
					if (!$ths.length) return;

					var texts = $ths.map(function () {
						return jQuery(this).text().trim().replace(/\s+/g, " ");
					}).get();

					// main header row contains Week + Pts
					var hasWeek = texts.some(t => /^week$/i.test(t));
					var hasPts = texts.some(t => /^pts$/i.test(t));
					if (!hasWeek || !hasPts) return;

					for (var i = 0; i < texts.length; i++) {
						var t = texts[i];
						if (/^opp\s*avg\b/i.test(t) || /^opp\s*rank\b/i.test(t)) {
							removeIdx.push(i);
						}
					}

					return false; // break once found
				});

				// remove from right-to-left so indexes don't shift
				removeIdx.sort(function (a, b) {
					return b - a;
				});

				function removeCellsByIndex($cells, idxList) {
					for (var k = 0; k < idxList.length; k++) {
						var idx = idxList[k];
						if ($cells.length > idx) $cells.eq(idx).remove();
					}
				}

				// Reduce a colspan cell if it spans removed columns (Total row and/or group header row)
				function adjustColspanForRemoved($tr, idxList) {
					var $cs = $tr.find("td[colspan], th[colspan]").first();
					if (!$cs.length) return;

					var span = parseInt($cs.attr("colspan"), 10);
					if (!Number.isFinite(span) || span <= 1) return;

					var $all = $tr.children("th,td");
					var start = $all.index($cs);
					if (start < 0) return;

					var end = start + span - 1;

					var removedInside = 0;
					for (var i = 0; i < idxList.length; i++) {
						var colIdx = idxList[i];
						if (colIdx >= start && colIdx <= end) removedInside++;
					}

					if (removedInside > 0) {
						var newSpan = span - removedInside;
						if (newSpan < 1) newSpan = 1;
						$cs.attr("colspan", newSpan);
					}
				}

				jQuery(playerData).find("#player_stats_table tr").each(function () {
					var $tr = jQuery(this);

					if ($tr.find("form").length > 0) return;

					// header row
					if ($tr.find("th").length > 0) {
						adjustColspanForRemoved($tr, removeIdx);
						removeCellsByIndex($tr.find("th"), removeIdx);
						statsHTML += "<tr>" + $tr.html() + "</tr>";
						return;
					}

					// data row
					var $tds = $tr.find("td");
					if ($tds.length > 1) {

						// remove links
						$tr.find("td a").contents().unwrap();
						$tr.find("td a").remove();

						var hasColspanTd = $tr.find("td[colspan]").length > 0;

						// TOTAL ROW: only fix colspan (do NOT remove by index or you'll delete real stat cells)
						if (hasColspanTd) {
							adjustColspanForRemoved($tr, removeIdx);
						} else {
							// normal rows: remove Opp Avg / Opp Rank cells
							removeCellsByIndex($tds, removeIdx);

							// status abbreviation (status shifts left by 2 when opp cols removed)
							var $tdsNow = $tr.find("td");
							var statusIndex = (removeIdx.length ? 3 : 5);

							var statusHtml = $tdsNow.eq(statusIndex).html() || "";
							var dashPos = statusHtml.indexOf(" - ");
							if (dashPos > 0) {
								var statusColumnTeam = statusHtml.substring(0, dashPos);
								if (MFLPlayerPopupTeamNames.hasOwnProperty(statusColumnTeam)) {
									if (MFLPlayerPopupTeamNames[statusColumnTeam].abbrev !== "") {
										$tdsNow.eq(statusIndex).html(
											statusHtml.replace(
												statusColumnTeam,
												"<span title='" + statusColumnTeam + "'>" + MFLPlayerPopupTeamNames[statusColumnTeam].abbrev
											) + "</span>"
										);
									}
								}
							}
						}

						if (currentRow % 2) statsHTML += "<tr class='eventablerow'>" + $tr.html() + "</tr>";
						else statsHTML += "<tr class='oddtablerow'>" + $tr.html() + "</tr>";

						currentRow++;
					}
				});


				statsHTML += "</tbody></table>";

				jQuery("#MFLPlayerPopupStats").html(statsHTML);
				if (MFLPlayerPopupIncludeProjections) jQuery("#MFLPlayerPopupProjections").html("<div id='MFLPlayerPopupLoading'><center>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></center></div>");
				MFLPlayerPopupTracker[0] = 1;
				MFLPlayerPopupInitiate(0);


			})
			.catch(error => {
				console.error('Error:', error);
				// Handle the error here, e.g., show an error message to the user
			});

		fetch(`${baseURLDynamic}/${year}/news_articles?PLAYERS=${pid}&DAYS=30`)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Error: ${response.status} ${response.statusText}`);
				}
				return response.text();
			})
			.then(newsData => {
				fetch(`${baseURLDynamic}/${year}/news_articles?TEAM=${pTeam}&SOURCE=RotoWire&DAYS=30`)
					.then(response2 => {
						if (!response2.ok) {
							throw new Error(`Error: ${response2.status} ${response2.statusText}`);
						}
						return response2.text();
					})
					.then(newsData2 => {
						var newsCaption = "";
						if (jQuery(newsData).find(".report tr").length < 2) {
							newsData = newsData2;
							newsCaption = "<h3 class='warning'>No News for Player - Showing Recent News for " + pTeam + "</h3>";
						}
						var newsHTML = "<table class='popreport'>" + newsCaption + "<tbody>";
						var newsRow = 0;
						jQuery(newsData).find(".report tr").each(function () {
							if (newsRow > 0) {
								//grab article link
								var articleLink = jQuery(this).find("td:eq(1) a").attr("href");
								var articleId = pid + "_" + newsRow;
								//remove all links from article
								jQuery(this).find("td a").contents().unwrap();
								//add back appended link to (More) if applicable
								var articleHTML = jQuery(this).find("td:eq(2)").html();
								articleHTML = articleHTML.replace("Analysis:", "<br><br><b>Analysis:</b>");
								articleHTML = articleHTML.replace("(More)", "(<span class='MFLPlayerPopupMoreNews warning' onclick='MFLPlayerPopupMoreNews(\"" + articleLink + "\",\"" + articleId + "\")'>More</span>)");
								newsHTML += "<tr class='oddtablerow headline'><th>" + jQuery(this).find("td:eq(1)").html() + "<span>" + jQuery(this).find("td:eq(3)").html() + " ago</span></th></tr>";
								newsHTML += "<tr class='eventablerow article'><td id='" + articleId + "' style='position:relative'>" + articleHTML + "</td></tr>";
							}
							newsRow++;
						});
						newsHTML += "</tbody></table>";
						jQuery("#MFLPlayerPopupNews").html(newsHTML);
					})
					.catch(error => {
						// Handle error for the second fetch request
						console.error("Error fetching newsData2:", error);
					});
			})
			.catch(error => {
				// Handle error for the first fetch request
				console.error("Error fetching newsData:", error);
			});
		MFLPlayerPopupTracker[1] = 1;
		MFLPlayerPopupInitiate(0);
	}


	function MFLPlayerPopupArticlePopulate(headline, ago, link) {
		const loading = document.querySelector('#MFLPlayerPopupContainer #MFLPlayerPopupLoading');
		const loaded = document.getElementById('MFLPlayerPopupLoaded');
		const articleLoaded = document.getElementById('MFLPlayerPopupArticleLoaded');

		if (loading) loading.style.display = 'block';
		if (loaded) loaded.style.display = 'none';
		if (articleLoaded) articleLoaded.style.display = 'none';

		const url = `${baseURLDynamic}/${year}/view_news_article?ID=${encodeURIComponent(link)}`;

		fetch(url)
			.then(r => {
				if (!r.ok) throw new Error(`Error: ${r.status} ${r.statusText}`);
				return r.text();
			})
			.then(html => {
				// Parse returned HTML
				const doc = new DOMParser().parseFromString(html, 'text/html');
				const rows = Array.from(doc.querySelectorAll('.report tr'));

				let articleHTML = '';
				// mimic newsRow logic (row index 1 = second row)
				if (rows.length > 1) {
					const row = rows[1];
					const td = row.querySelector('td');
					if (td) {
						// unwrap all anchors (remove link, keep text/content)
						td.querySelectorAll('a').forEach(a => {
							const frag = document.createDocumentFragment();
							while (a.firstChild) frag.appendChild(a.firstChild);
							a.replaceWith(frag);
						});
						let raw = td.innerHTML || '';

						// strip trailing boilerplate like original code
						const cut1 = raw.indexOf('Article Link');
						if (cut1 > 0) raw = raw.substring(0, cut1 - 2);
						const cut2 = raw.indexOf('Roto Pass from');
						if (cut2 > 0) raw = raw.substring(0, cut2 - 3);

						articleHTML = raw;
					}
				}

				// Build the popup content (preserve headline markup)
				if (articleLoaded) {
					// Build DOM nodes instead of big string concat
					const table = document.createElement('table');
					table.className = 'popreport';
					const tbody = document.createElement('tbody');

					const trHead = document.createElement('tr');
					trHead.className = 'oddtablerow headline';
					const th = document.createElement('th');
					// headline came from your linkâ€™s innerHTML on purpose
					th.innerHTML = headline;
					trHead.appendChild(th);

					const trArticle = document.createElement('tr');
					trArticle.className = 'eventablerow article';
					const td = document.createElement('td');
					td.innerHTML = articleHTML; // article content from MFL page
					trArticle.appendChild(td);

					tbody.append(trHead, trArticle);
					table.appendChild(tbody);

					articleLoaded.innerHTML = '';
					articleLoaded.appendChild(table);

					// whatever your init does after content is ready
					try {
						MFLPlayerPopupInitiate(1);
					} catch {}
				}
			})
			.catch(err => {
				console.error('Error fetching articleData:', err);
			});
	}

	function MFLPlayerPopupPopulateOnload(isOnclick) { // ADD HTML TO NOTIFICATION POPUP
		if (isOnclick) {
			MFLPlayerPopupNotificationPreSetup();
			setTimeout("MFLPlayerPopupPopulateNotification(true)", 200);
		} else MFLPlayerPopupPopulateNotification(false);
		jQuery('.toggle_module_login').hide();
		jQuery('.toggle_module_search').hide();
		jQuery(".skinSelectorContainer").hide();
	}

	function MFLPlayerPopupPopulateNotification(isOnclick) {
		MFLPlayerPopupTracker = [];
		MFLPlayerPopupOnloadContent[0] = ""; //TRADES MODULE
		MFLPlayerPopupOnloadContent[1] = ""; //TRADE POLL
		MFLPlayerPopupOnloadContent[2] = ""; //LEAGUE REMINDERS
		MFLPlayerPopupOnloadContent[3] = ""; //LEAGUE MESSAGES
		MFLPlayerPopupOnloadContent[4] = ""; //COMMISH MESSAGE
		jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show();
		jQuery("#MFLPlayerPopupLoaded").hide();
		jQuery("#MFLPlayerPopupArticleLoaded").hide();
		if (MFLPopupEnableTrade) {
			fetch(`${baseURLDynamic}/${year}/home/${league_id}?MODULE=TRADES`)
				.then(response => {
					if (!response.ok) {
						throw new Error(`Error: ${response.status} ${response.statusText}`);
					}
					return response.text();
				})
				.then(tradeData => {
					jQuery(tradeData).find("#trades td").each(function () {
						if (jQuery(this).text().indexOf("proposed by me") !== -1 && parseInt(jQuery(this).text()) > 0) {
							MFLPlayerPopupOnloadContent[0] = jQuery(tradeData).find("#trades").parent().html();
						}
						if (jQuery(this).text().indexOf("proposed by others") !== -1 && parseInt(jQuery(this).text()) > 0) {
							MFLPlayerPopupOnloadContent[0] = jQuery(tradeData).find("#trades").parent().html();
						}
						if (jQuery(this).text().indexOf("awaiting your review") !== -1 && parseInt(jQuery(this).text()) > 0) {
							MFLPlayerPopupOnloadContent[0] = jQuery(tradeData).find("#trades").parent().html();
						}
						if (jQuery(this).text().indexOf("pending commissioner review") !== -1 && parseInt(jQuery(this).text()) > 0) {
							MFLPlayerPopupOnloadContent[0] = jQuery(tradeData).find("#trades").parent().html();
						}
					});
					MFLPlayerPopupTracker[0] = 1;
					MFLPlayerPopupNotificationSetup(isOnclick);
				})
				.catch(error => {
					// Handle error for the fetch request
					console.error("Error fetching tradeData:", error);
				});
		} else {
			MFLPlayerPopupTracker[0] = 1;
			MFLPlayerPopupNotificationSetup(isOnclick);
		}
		if (MFLPopupEnableTradePoll) {
			var tradePollCount = 0;
			fetch(`${baseURLDynamic}/${year}/options?L=${league_id}&O=69`)
				.then(response => {
					if (!response.ok) {
						throw new Error(`Error: ${response.status} ${response.statusText}`);
					}
					return response.text();
				})
				.then(pollData => {
					jQuery(pollData).find('table.report[id^="poll_"]').each(function () {
						if (jQuery(this).find("th:eq(0)").text().indexOf("gave up") !== -1) {
							tradePollCount++;
							MFLPlayerPopupOnloadContent[1] += jQuery(this).parent().parent().html();
						}
					});
					MFLPlayerPopupTracker[1] = 1;
					MFLPlayerPopupNotificationSetup(isOnclick);
				})
				.catch(error => {
					// Handle error for the fetch request
					console.error("Error fetching pollData:", error);
				});
		} else {
			MFLPlayerPopupTracker[1] = 1;
			MFLPlayerPopupNotificationSetup(isOnclick);
		}
		if (MFLPopupEnableReminders || MFLPopupEnableMessages) {

			fetch(`${baseURLDynamic}/${year}/home/${league_id}`)
				.then(function (response) {
					if (response.ok) {
						return response.text();
					} else {
						throw new Error('Network response was not ok.');
					}
				})
				.then(function (homePageMessageData) {
					if (MFLPopupEnableReminders) {
						jQuery(homePageMessageData).find("#league_reminders").each(function () {
							MFLPlayerPopupOnloadContent[2] = "<table align='center' cellspacing='1' class='homepagemodule report'>" + jQuery(this).html() + "</table>";
						});
					}
					MFLPlayerPopupTracker[2] = 1;
					if (MFLPopupEnableMessages) {
						jQuery(homePageMessageData).find(".homepagemessage:not(#league_reminders)").each(function () {
							MFLPlayerPopupOnloadContent[3] += "<table align='center' cellspacing='1' class='homepagemodule report'>" + jQuery(this).html() + "</table>";
						});
					}
					MFLPlayerPopupTracker[3] = 1;
					MFLPlayerPopupNotificationSetup(isOnclick);
				})
				.catch(function (error) {
					console.log('Error:', error);
				});


		} else {
			MFLPlayerPopupTracker[2] = 1;
			MFLPlayerPopupTracker[3] = 1;
			MFLPlayerPopupNotificationSetup(isOnclick);
		}
		if (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "") {
			MFLPlayerPopupOnloadContent[4] = "<table align='center' cellspacing='1' class='homepagemodule report'><tr><th>From the Commissioner's Desk</th></tr><tr class='oddtablerow'><td>" + MFLPopupCommishMessage + "</td></tr></table>";
			MFLPlayerPopupTracker[4] = 1;
			MFLPlayerPopupNotificationSetup(isOnclick);
		} else {
			MFLPlayerPopupTracker[4] = 1;
			MFLPlayerPopupNotificationSetup(isOnclick);
		}
	}


	function getPidFromHref(href) {
		if (!href) return null;
		// Case 1: player?L=...&P=16581
		let m = href.match(/[?&]P=(\d+)/);
		if (m) return m[1];

		// Case 2: javascript:launch_player_modal('10065','16581');
		m = href.match(/launch_player_modal\(\s*['"]\d+['"]\s*,\s*['"](\d+)['"]\s*\)/);
		if (m) return m[1];

		return null;
	}

	$(document).on('click', '#roster_column_middle a[href*="player?L="][href*="P="], ' + '#roster_column_middle a[href^="javascript:launch_player_modal"]',
		function (e) {
			e.preventDefault();
			e.stopPropagation();

			const href = this.getAttribute('href') || '';
			const pid = getPidFromHref(href);
			if (!pid) return false;

			const pDetails = $(this).html().replace(/[\\"']/g, '\\').replace(/\u0000/g, '\\0');
			return false;
		}
	);


	function MFLPlayerPopupInitiate(which) {
		if (which === 0) { //PLAYER POPUP
			if (MFLPlayerPopupTracker[0] === 1 && MFLPlayerPopupTracker[1] === 1) {
				jQuery("#MFLPlayerPopupNews").show();
				jQuery("#MFLPlayerPopupTabLinksNews").addClass('active');
				jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").hide();
				jQuery("#MFLPlayerPopupArticleLoaded").hide();
				jQuery("#MFLPlayerPopupLoaded").show();
				jQuery('#MFLPlayerPopupNews').scrollTop(0);
				jQuery('#MFLPlayerPopupBio').scrollTop(0);
				jQuery('#MFLPlayerPopupStats').scrollTop(0);
				jQuery('#MFLPlayerPopupProjections').scrollTop(0);
				jQuery('#MFLPlayerPopupStatsHistory').scrollTop(0);
				//MIKE ADDED FOR BODY SCROLL
				$('#MFLPlayerPopupNews').addClass('active_div_tab_scroll');
			}
		}
		if (which === 1) { //ARTICLE POPUP
			jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").hide();
			jQuery("#MFLPlayerPopupLoaded").hide();
			jQuery("#MFLPlayerPopupArticleLoaded").show();
		}
		if (which === 2) { //TRADE, REMINDERS, HOME PAGE MESSAGE
			//jQuery("#MFLPlayerPopupLoaded.noHide #MFLPlayerPopupMessages").show();
			//jQuery("#MFLPlayerPopupLoaded.noHide #MFLPlayerPopupTabLinksMessages").addClass("active");
			jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").hide();
			jQuery("#MFLPlayerPopupLoaded").show();
			jQuery("#MFLPlayerPopupArticleLoaded").hide();
			setCookie("MFLPlayerPopup_" + year + "_" + league_id + "_" + franchise_id);
		}
	}

	// HIDE STATUS COLUMN ON PLAYER POPUP
	if (MFLPopupOmitStatus) jQuery("head").append("<style>#MFLPlayerPopupStats th:nth-child(4), #MFLPlayerPopupStats td:nth-child(4) {display:none}</style>");

	// USER LOGIN FUNCTION
	if (ShowMFLlogin) {
		jQuery("head").append("<style>.pageheader .welcome{display:none}.toggle_login_content td b{display:block}.toggle_login_content td{text-align:center;font-size:90%}.toggle_module_login{position:absolute;z-index:999999;width:18.75rem;width:18.750rem;margin-top:0.313rem;margin-top:0.313rem;margin-left:-5.938rem;}</style>");

		function toggleLogin() {
			jQuery(".skinSelectorContainer").fadeOut(700);
			if (jQuery(".toggle_module_login").css("display") === "none") {
				jQuery('.toggle_module_login').show(700);
				jQuery('.toggle_module_search').hide(700);
			} else {
				jQuery('.toggle_module_login').hide(700);
			}
		}
		$('head').append('<style>li.notification-icon-login{display:inline-block!important}</style>');
		$('#icon-wrapper-mobile,#icon-wrapper').show();
		jQuery(".pageheader .welcome").appendTo(".toggle_login_content .oddtablerow");
		jQuery('.toggle_login_content .welcome small').remove();
		jQuery('.toggle_login_content .welcome').removeClass();
	}

	// PLAYER SEARCH FUNCTION
	if (ShowMFLsearch) {
		jQuery("head").append("<style>.toggle_search_content td{text-align:center;font-size:90%}.toggle_search_content input[type='submit']{margin:0 0.313rem;margin:0 0.313rem;border-radius:0.188rem;border-radius:0.188rem;padding:0.188rem;padding:0.188rem}.toggle_search_content input{position:relative;display:inline}.toggle_module_search{position:absolute;z-index:999999;width:18.75rem;margin-top:0.313rem;margin-left:-8.125rem;}.toggle_search_content td,.toggle_search_content form,.toggle_search_content input{vertical-align:middle;}</style>");

		function toggleSearch() {
			jQuery(".skinSelectorContainer").fadeOut(700);
			if (jQuery(".toggle_module_search").css("display") === "none") {
				jQuery('.toggle_module_search').show(700);
				jQuery('.toggle_module_login').hide(700);
			} else {
				jQuery('.toggle_module_search').hide(700);
			}
		}
		$('head').append('<style>li.notification-icon-search{display:inline-block!important}</style>');
		$('#icon-wrapper-mobile,#icon-wrapper').show();
	}

	if ((LoginSearchMobileCSS) && (jQuery(window).width() < 768)) {
		// POSITION LOGIN AND SEARCH POPUP
		jQuery.fn.toggle_center = function () {
			this.css("position", "absolute");
			this.css("left", Math.max(0, ((jQuery(window).width() - jQuery(this).outerWidth()) / 2) + jQuery(window).scrollLeft()) + "px");
			return this;
		}
		jQuery('.toggle_module_search,.toggle_module_login').toggle_center();
		jQuery("head").append("<style>.toggle_module_search,.toggle_module_login{margin-left:-8.125rem;margin-top:0.875rem}#skinSelectorContainer{margin-top:0.875rem}</style>");
	}

	if (typeof franchise_id !== 'undefined') { // IF LOGGED IN CHECK FOR POPUPS
		if (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "")) {
			$('head').append('<style>li.notification-icon-popup{display:inline-block!important}</style>');
			$('#icon-wrapper-mobile,#icon-wrapper').show();
		}
	}

	if (MFLPopupEnableReminders) jQuery("#body_home .homepagemessage").css("display", "none");
	if (MFLPopupEnableMessages) jQuery("#league_reminders").css("display", "none");
	MFLPlayerPopupSetupTeamNames();
	if (jQuery("#MFLPlayerPopupContainer").length === 0) MFLPlayerPopupCreateContainer();
	if (typeof franchise_id !== 'undefined') { // IF LOGGED IN CHECK FOR POPUPS
		if (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "")) {
			if (MFLPopupEnableAutoNotification && !getCookie("MFLPlayerPopup_" + year + "_" + league_id + "_" + franchise_id)) MFLPlayerPopupPopulateOnload(false);
		}
	}
	//UPDATE USER DEFINED CONTRACT TITLES IF THEY EXIST
	fetch(`${baseURLDynamic}/${year}/home/${league_id}?MODULE=ROSTER`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`Error: ${response.status} ${response.statusText}`);
			}
			return response.text();
		})
		.then(extrasTitleData => {
			for (var key in MFLPlayerPopupExtraTitles) {
				if (MFLPlayerPopupExtraTitles.hasOwnProperty(key)) {
					if (jQuery(extrasTitleData).find('th[class="' + key + '"]').length > 0) {
						MFLPlayerPopupExtraTitles[key] = jQuery(extrasTitleData).find('th[class="' + key + '"]').text();
					}
				}
			}
		})
		.catch(error => {
			// Handle error for the fetch request
			console.error("Error fetching extrasTitleData:", error);
		});

	if (MFLScoreDetailsPopup) {
		if (detailsOverlay === undefined) var detailsOverlay = "rgba(0,0,0,.7)";
		if (detailsWrapBG === undefined) var detailsWrapBG = "#fff";
		if (detailsWrapBorder === undefined) var detailsWrapBorder = "#000";
		if (detailsWrapBorWidh === undefined) var detailsWrapBorWidh = "0";
		if (detailsWrapBoxShdw === undefined) var detailsWrapBoxShdw = "0 0 0.188rem 0.188rem rgba(0,0,0,.1)";
		if (detailsWrapPadding === undefined) var detailsWrapPadding = "0.625rem";
		if (detailsWrapRadius === undefined) var detailsWrapRadius = "0.188rem";
		$('body').append('<div class="scoredetailsWrap" style="display:none;position:fixed;height:100%;width:100%;background:' + detailsOverlay + ';left:0;top:0;z-index:999991"></div><div id="ScoreDetails" class="detailsReportWrap" style="z-index: 999991;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:' + detailsWrapBG + ';border:' + detailsWrapBorWidh + ' solid ' + detailsWrapBorder + ';box-shadow:' + detailsWrapBoxShdw + ';border-radius:' + detailsWrapRadius + ';padding:' + detailsWrapPadding + ';max-height: 90%;overflow:auto"><table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span><tbody></tbody></table></div><div id="ScoreNFLDetails" class="detailsReportWrap" style="z-index: 999991;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:' + detailsWrapBG + ';border:' + detailsWrapBorWidh + ' solid ' + detailsWrapBorder + ';box-shadow:' + detailsWrapBoxShdw + ';border-radius:' + detailsWrapRadius + ';padding:' + detailsWrapPadding + ';max-height:90%;overflow:auto"><table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span><tbody><tr><td><div id="teamToggles"><div class="leftT" style="vertical-align:top;display:inline-block;width:50%;text-align:center"><input type="submit" value="" style="min-width:6.25rem;outline:none"></div><div class="rightT" style="vertical-align:top;opacity:.5;display:inline-block;width:50%;text-align:center"><input type="submit" value="" style="min-width:6.25rem;outline:none"></div></div></td></tr></tbody><tbody id="leftTeam"></tbody><tbody id="rightTeam" style="display:none"></tbody></table></div><style>a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]{display:none}table.scoring_details_table td.points,table.box_details_table td,table.box_details_table th {text-align:center!important}table.scoring_details_table th,table.scoring_details_table td,table.box_details_table td:nth-child(1),table.box_details_table tr:nth-child(2) > th:nth-child(1){text-align:left!important}#body_ajax_ls td.ls_game_info{pointer-events:none}a.boxmatchLink{display:block!important}</style>');
		$('body').on('click', '.scoredetailsWrap', function () {
			$('#ScoreDetails tbody,#leftTeam ,#rightTeam').html("");
			$('.scoredetailsWrap,#ScoreDetails,#ScoreNFLDetails').hide();
			$('#teamToggles input').val("");
			$('#fullSeasonPts').remove();
			$('#ScoreNFLDetails table').removeClass("box_details_table");
			$('#ScoreDetails table').removeClass("scoring_details_table overview_details_table");
			$('a').removeClass('dblClicks');
			try {
				if (typeof LSMteamBox !== 'undefined' && LSMteamBox) {
					if (isElementVisible(LSMteamBox)) {
						//do nothing
					} else {
						bodyScrollLock.clearAllBodyScrollLocks();
					}
				} else {
					bodyScrollLock.clearAllBodyScrollLocks();
				}
			} catch (er) {};
		});
		$('body').on('click', '.dblClicks', function (e) {
			e.preventDefault();
		});
		// PLAYER SCORES - LINKS THAT SHOW A PLAYERS WEEKLY SCORE
		$('body').on('click', '.report a[href*="detailed?L"][href*="P="]:not(#player_records a):not(#body_options_157 a)', function (e) {
			$('.scoredetailsWrap').show();
			$('.detailsReportWrap table').addClass("report");
			var href = $(this).attr('href');
			var url = href.substring(href.indexOf("detailed?") - 1, href.length);
			var detailedLinkFull = `${baseURLDynamic}/${year}/${url}&PRINTER=1`;
			if (this.href.substring(this.href.indexOf("YEAR=") + 5, this.href.length) < year) {
				var hideThis = true;
			}
			fetch(detailedLinkFull)
				.then(response => response.text())
				.then(data => {
					var dataDetails = $(data).find('.report tbody');
					$('#ScoreDetails caption span').html("Scoring Breakdown");
					$('#fullSeasonPts').remove();
					$('#ScoreDetails tbody').replaceWith(dataDetails);
					$('#ScoreNFLDetails table').removeClass("box_details_table");
					$('#ScoreDetails table').removeClass("overview_details_table");
					$('#ScoreDetails table').addClass("scoring_details_table");
					if (hideThis) {
						$('a[href*="&MATCHUP="]').remove();
						$('#ScoreDetails tr.oddtablerow:nth-child(2) td:nth-child(1)').css('visibility', 'hidden');
						$('#ScoreDetails tr.oddtablerow:nth-child(2) td:nth-child(1) b').css('visibility', 'visible');
					}
					$('#ScoreDetails td b a[class*="position_').attr('href', function (i, href) {
						return href.replace('&PRINTER=1', '');
					});
					$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]').remove();
					$('.scoredetailsWrap,#ScoreDetails').show();
					//MIKE ADDED FOR BODY SCROLL
					const scoreDetailspop = document.querySelector('#ScoreDetails');
					try {
						bodyScrollLock.disableBodyScroll(scoreDetailspop);
					} catch (er) {};
					$('#leftTeam ,#rightTeam').html("");
					$('#teamToggles input').val("");
					$('#ScoreNFLDetails').hide();
					$('#ScoreDetails #MFLPlayerPopupClose').on('click', function () {
						$('#ScoreDetails tbody').html("");
						$('.scoredetailsWrap,#ScoreDetails').hide();
						try {
							if (typeof LSMteamBox !== 'undefined' && LSMteamBox) {
								if (isElementVisible(LSMteamBox)) {
									//do nothing
								} else {
									bodyScrollLock.clearAllBodyScrollLocks();
								}
							} else {
								bodyScrollLock.clearAllBodyScrollLocks();
							}
						} catch (er) {};
						$('#ScoreNFLDetails table').removeClass("box_details_table");
						$('#ScoreDetails table').removeClass("scoring_details_table overview_details_table");
						$('a').removeClass('dblClicks');
					});
				})
				.catch(error => {
					console.error('Error:', error);
				});
			e.preventDefault();
		});
		// NFL SCORES - LINKS THAT SHOW NFL MATCHUP-SCORES
		$('body').on('click', '.report a[href*="MATCHUP"]', function (e) {
			$('#fullSeasonPts').remove();
			$('.detailsReportWrap table').addClass("report");
			var detailedNFLLink = $(this).attr('href');
			var detailedNFLLinkFull = `${detailedNFLLink}&PRINTER=1`;
			$('#ScoreNFLDetails caption span').html("Detailed Results");
			fetch(detailedNFLLinkFull)
				.then(response => response.text())
				.then(data => {
					var dataNFLDetailsLeft = $(data).find('td.two_column_layout:nth-of-type(1) .report tbody:nth-child(2)').contents();
					var dataNFLDetailsRight = $(data).find('td.two_column_layout:nth-of-type(2) .report tbody:nth-child(2)').contents();
					var dataNFLDetailsLeftTeam = $(data).find('td.two_column_layout:nth-of-type(1) .report caption:nth-child(1) span').text();
					var dataNFLDetailsRightTeam = $(data).find('td.two_column_layout:nth-of-type(2) .report caption:nth-child(1) span').text();
					$('#fullSeasonPts').remove();
					$('#ScoreDetails table').removeClass("scoring_details_table overview_details_table");
					$('#ScoreNFLDetails table').addClass("box_details_table");
					$('tbody#leftTeam').html(dataNFLDetailsLeft);
					$('tbody#rightTeam').html(dataNFLDetailsRight);
					$('#ScoreNFLDetails td a[class*="position_').attr('href', function (i, href) {
						return href.replace('&PRINTER=1', '');
					});
					$('#teamToggles .leftT input').val(dataNFLDetailsLeftTeam);
					$('#teamToggles .rightT input').val(dataNFLDetailsRightTeam);
					$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]').remove();
					$('#ScoreDetails tbody').html("");
					$('#ScoreDetails').hide();
					$('.scoredetailsWrap,#ScoreNFLDetails').show();
					//MIKE ADDED FOR BODY SCROLL
					const scoreNFLDetailspop = document.querySelector('#ScoreNFLDetails');
					try {
						bodyScrollLock.disableBodyScroll(scoreNFLDetailspop);
					} catch (er) {};
					$(".leftT").click(function () {
						$(this).css('opacity', '1');
						$(".rightT").css('opacity', '.5');
						$("#leftTeam").show();
						$("#rightTeam").hide();
					});
					$(".rightT").click(function () {
						$(this).css('opacity', '1');
						$(".leftT").css('opacity', '.5');
						$("#leftTeam").hide();
						$("#rightTeam").show();
					});
					$('#ScoreNFLDetails #MFLPlayerPopupClose').on('click', function () {
						$('#leftTeam ,#rightTeam').html("");
						$('#teamToggles input').val("");
						$('.scoredetailsWrap,#ScoreNFLDetails').hide();
						try {
							if (typeof LSMteamBox !== 'undefined' && LSMteamBox) {
								if (isElementVisible(LSMteamBox)) {
									//do nothing
								} else {
									bodyScrollLock.clearAllBodyScrollLocks();
								}
							} else {
								bodyScrollLock.clearAllBodyScrollLocks();
							}
						} catch (er) {};
						$('#ScoreNFLDetails table').removeClass("box_details_table");
						$('#ScoreDetails table').removeClass("scoring_details_table overview_details_table");
						$('a').removeClass('dblClicks');
					});
					if ($('.box_details_table a[href*="player?"]').length) {
						$('#teamToggles').show();
						$('.no_detail_data').remove();
					} else if ($('.no_detail_data').length < 1) {
						$('#teamToggles').hide();
						$('#teamToggles').after('<div class="no_detail_data"><h3 class="warning">Game Not Started</h3></div>');
					}
				})
				.catch(error => {
					console.error('Error:', error);
				});
			e.preventDefault();
		});
		// TOP PLAYER - PLAYERS LINKS THAT SHOW YTD TOTAL POINTS
		$('body').on('click', '.report a[href*="options?L="][href*="O=08"][href*="PLAYER_ID="]:not(#body_options_08 a):not([class*="dblClicks"])', function (e) {
			$(this).addClass('dblClicks');
			$('#fullSeasonPts').remove();
			$('.detailsReportWrap table').addClass("report");
			$('<tbody id="fullSeasonPts"><tr><th colspan="4" style="text-align:center!important">Points Summary</th></tr><tr class="oddtablerow"><td style="text-align:right!important">YTD Pts:</td><td class="dYTDpoints" style="text-align:left!important"></td><td style="text-align:right!important">Avg Pts:</td><td class="dAVGpoints" style="text-align:left!important"></td></tr><tr><th colspan="4" style="text-align:center!important">Weekly Point Totals</th></tr></tbody>').insertAfter('#ScoreDetails tbody');
			var detailedTopLink = $(this).attr('href');
			var detailedTopLinkFull = detailedTopLink + "&PRINTER=1";
			fetch(detailedTopLinkFull)
				.then(response => response.text())
				.then(data => {
					// CHANGE CAPTION TO PLAYER NAME
					$('#ScoreDetails caption span').html($(data).find('.report tbody td.player a').contents());
					// YTD POINTS
					$(data).find('.report td.points.tot').contents().appendTo('td.dYTDpoints');
					// AVG POINTS
					$(data).find('.report td.points.avg').contents().appendTo('td.dAVGpoints');
					var thlength = $(data).find('.report tbody th a[href*="SORT="]:not([href*="SORT=NAME"]):not([href*="SORT=TOT"]):not([href*="SORT=AVG"]):not([href*="SORT=SALARY"]):not([href*="SORT=YEAR"])').length;
					var html = '';
					var href = $(data).find('table.report tr:nth-child(2) th:nth-child(5) a').attr('href');
					var firstWeek = parseInt(href.substr(href.indexOf("SORT=") + 5, 2));
					for (var i = 5; i < (thlength + 5); i++) {
						if (i % 2) html += '<tr class="dRow">'; //START ROW
						html += '<td style="text-align:right!important">Week ' + (firstWeek + i - 5) + ':</td>';
						html += '<td style="text-align:left!important"> ' + $(data).find('table.report td:nth-child(' + i + ')').html() + '</td>';
						if (!i % 2) html += '</tr>'; //CLOSE ROW
					}
					if (!thlength % 2) html += '</tr>'; //CLOSE TABLE ROW FOR ODD NUMBER OF WEEKS
					$('#fullSeasonPts').append(html);
					$('#ScoreDetails th a').removeAttr('href');
					$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]').remove();
					$('#ScoreNFLDetails table').removeClass("box_details_table");
					$('#ScoreDetails table').removeClass("scoring_details_table");
					$('#ScoreDetails table').addClass("overview_details_table");
					$('#ScoreDetails td.dYTDpoints a,#ScoreDetails td.dAVGpoints a').contents().unwrap();
					$('.scoredetailsWrap,#ScoreDetails').show();
					$('#leftTeam ,#rightTeam').html("");
					$('#teamToggles input').val("");
					$('#ScoreNFLDetails,#TeamDetails,.teamdetailsWrap').hide();
					//MIKE ADDED FOR BODY SCROLL
					const scoreDetailspop = document.querySelector('#ScoreDetails');
					try {
						bodyScrollLock.disableBodyScroll(scoreDetailspop);
					} catch (er) {};
					$('#ScoreDetails #MFLPlayerPopupClose').on('click', function () {
						$('#fullSeasonPts').remove();
						$('#ScoreDetails tbody').html("");
						$('.scoredetailsWrap,#ScoreDetails').hide();
						try {
							if (typeof LSMteamBox !== 'undefined' && LSMteamBox) {
								if (isElementVisible(LSMteamBox)) {
									//do nothing
								} else {
									bodyScrollLock.clearAllBodyScrollLocks();
								}
							} else {
								bodyScrollLock.clearAllBodyScrollLocks();
							}
						} catch (er) {};
						$('#ScoreNFLDetails table').removeClass("box_details_table");
						$('#ScoreDetails table').removeClass("scoring_details_table overview_details_table");
						$('a').removeClass('dblClicks');
					});
					$("#fullSeasonPts td").html(function (i, html) {
						return html.replace(/&nbsp;/g, '0');
					});
					$("#fullSeasonPts td").html(function (i, html) {
						return html.replace(/B/g, 'Bye');
					});
					$("#fullSeasonPts tr.dRow:odd").addClass("oddtablerow");
					$("#fullSeasonPts tr.dRow:even").addClass("eventablerow");
					if ($('#fullSeasonPts tr:last').children().length < 3) {
						$('#fullSeasonPts tr:last').append('<td></td><td></td>');
					}
					$('td.dYTDpoints img').remove();
				})
				.catch(error => {
					console.error('Error:', error);
				});
			e.preventDefault();
		});
	}
	if (MFLFranchisePopup) {
		if (load_playerIcons === undefined) var load_playerIcons = false;

		window.lu_popup_weatherPopup = function (tid, href) {
			if (typeof weather === "undefined") {
				//alert('Weather for this game is not defined');
				return false;
			}
			if (weather.hasOwnProperty(tid) && weather[tid].location) {
				var styleElementFour = document.createElement('style');
				styleElementFour.innerHTML = `.current-conditions-wrapper{margin-bottom:0.625rem}.current-conditions-wrapper,.kickoff-conditions-wrapper{border:0.188rem solid #ccc;border-radius:0.313rem;padding:0.625rem}.current-conditions-text,.kickoff-conditions-text{font-size:1rem;font-weight:700}.current-conditions-localtime{display:block;font-size:0.688rem;font-style:italic}.current-conditions-temp,.kickoff-conditions-temp{font-size:2.25rem;display:inline-block;vertical-align:top;margin-top:0.25rem;font-weight:700}.current-conditions-extras-wrapper,.kickoff-conditions-extras-wrapper{display:inline-block;vertical-align:top;margin-top:0.625rem;margin-left:0.938rem}.current-conditions-wind-wrapper,.current-conditions-rain-wrapper,.current-conditions-snow-wrapper,.kickoff-conditions-wind-wrapper,.kickoff-conditions-rain-wrapper,.kickoff-conditions-snow-wrapper{display:block}.weather-more-link{text-align:center;margin-top:0.375rem;cursor:pointer}#popup-weather-wrapper.modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:111111111;background:rgba(0,0,0,.7);display:none}#popup-weather-container{background:#fff;z-index:99999;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);border:0 solid #000;box-shadow:#000 0 0 1.563rem;border-radius:0.188rem;padding:0.625rem;max-height:95%;overflow:auto}img.kickoff-conditions-icon,img.current-conditions-icon{height:3.125rem;width:auto}.weather_caption{line-height:1.875rem;height:1.875rem;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;padding-right:1.438rem}.current-conditions-place{font-size:1.25rem;font-weight:700;max-width:0}.as_close_btn{position:absolute;z-index:1;cursor:pointer;border-radius:0.188rem;text-align:center;border:0.125rem solid transparent;font-weight:700;background:red;color:#fff;right:0;height:1.375rem;width:1.375rem;line-height:1.4;top:50%;transform:translateY(-50%)}.as_close_btn:hover{background:#000;color:#fff}`;
				document.head.appendChild(styleElementFour);
				//ADD POPUP CONTAINER 
				// Create and append the popup elements to the body
				let body = document.querySelector('body');
				let popupWrapper = document.createElement('div');
				popupWrapper.id = 'popup-weather-wrapper';
				popupWrapper.className = 'modal';
				popupWrapper.style.display = 'none';
				let popupContainer = document.createElement('div');
				popupContainer.id = 'popup-weather-container';
				popupContainer.className = 'modal-content animate';
				popupContainer.style.display = 'none';
				popupWrapper.appendChild(popupContainer);
				body.appendChild(popupWrapper);
				let html = '';
				html += '<div id="weather-wrapper">';
				html += '<div class="weather_caption"><span class="current-conditions-place">' + weather[tid].location.name + ', ' + weather[tid].location.region + '</span><span class="as_close_btn">X</span></div>';
				html += '<div class="current-conditions-wrapper">';
				html += '<div class="current-conditions-header"><span class="current-conditions-text">Current Conditions</span><span class="current-conditions-localtime"> last updated ' + weather[tid].current.last_updated + ' local time</span></div>';
				html += '<div class="current-conditions-detail">';
				html += '<span class="current-conditions-temp">' + weather[tid].current.temp_f + '&degF</span><span class="current-conditions-icon-wrapper"><img class="current-conditions-icon" src="' + weather[tid].current.condition.icon + '" /></span>';

				html += '<span class="current-conditions-extras-wrapper">';
				html += '<span class="current-conditions-wind-wrapper">Wind: <span class="current-conditions-wind-speed">' + weather[tid].current.wind_mph + 'mph</span> <span class="current-conditions-wind-direction">' + weather[tid].current.wind_dir + '</span></span>';

				for (let i = 0; i < weather[tid].forecast.forecastday[0].hour.length; i++) {
					const current_hour = weather[tid].forecast.forecastday[0].hour[i];
					const prev_hour = i === 0 ? current_hour : weather[tid].forecast.forecastday[0].hour[i - 1];
					if (current_hour.time_epoch >= currentServerTime) {
						if (prev_hour.chance_of_rain > 0) html += '<span class="current-conditions-rain-wrapper">Rain: <span class="current-conditions-chance-of-rain">' + prev_hour.chance_of_rain + '%</span></span>';
						if (prev_hour.chance_of_snow > 0) html += '<span class="current-conditions-snow-wrapper">Snow: <span class="current-conditions-chance-of-snow">' + prev_hour.chance_of_snow + '%</span></span>';
						break;
					}
				}
				html += '</span>';
				html += '<div class="current-conditions-text">' + weather[tid].current.condition.text + '</div>';
				html += '</div>';
				html += '</div>';

				html += '<div class="kickoff-conditions-wrapper">';
				html += '<div class="kickoff-conditions-header"><span class="kickoff-conditions-text">Expected Conditions at Kickoff</span></div>';
				try {
					html += '<div class="kickoff-conditions-detail">';
					html += '<span class="kickoff-conditions-temp">' + weather[tid].kickoff_weather.temp_f + '&degF</span><span class="kickoff-conditions-icon-wrapper"><img class="kickoff-conditions-icon" src="' + weather[tid].kickoff_weather.condition.icon + '" /></span>';
					html += '<span class="kickoff-conditions-extras-wrapper">';
					html += '<span class="kickoff-conditions-wind-wrapper">Wind: <span class="kickoff-conditions-wind-speed">' + weather[tid].kickoff_weather.wind_mph + 'mph</span> <span class="kickoff-conditions-wind-direction">' + weather[tid].kickoff_weather.wind_dir + '</span></span>';
					if (weather[tid].kickoff_weather.chance_of_rain > 0) html += '<span class="kickoff-conditions-rain-wrapper">Rain: <span class="kickoff-conditions-chance-of-rain">' + weather[tid].kickoff_weather.chance_of_rain + '%</span></span>';
					if (weather[tid].kickoff_weather.chance_of_snow > 0) html += '<span class="kickoff-conditions-snow-wrapper">Snow: <span class="kickoff-conditions-chance-of-snow">' + weather[tid].kickoff_weather.chance_of_snow + '%</span></span>';
					html += '</span>';
					html += '<div class="current-conditions-text">' + weather[tid].kickoff_weather.condition.text + '</div>';
				} catch (er) {
					html += '<div class="kickoff-conditions-no-data-available" style="color:red">Future forecasts available 72 hours prior to kickoff</div>';
				}
				html += '</div>';
				html += '</div>';

				html += '<div class="weather-more-link"><a onclick="window.open(\'' + href + '\', \'_blank\')">More at Weather.com</a></div>';
				html += '</div>';
				popupContainer.innerHTML = html;
				popupWrapper.style.display = 'block';
				popupContainer.style.display = 'block';
				try {
					bodyScrollLock.disableBodyScroll(popupWrapper)
				} catch (er) {}

				let teamDetailsWrap = document.querySelector('.teamdetailsWrap');
				let teamDetails = document.querySelector('#TeamDetails');

				if (teamDetailsWrap) teamDetailsWrap.style.display = 'none';
				if (teamDetails) teamDetails.style.display = 'none';


				// Add listener for #popup-weather-wrapper and .as_close_btn
				popupWrapper.addEventListener('click', function (e) {
					// Check if the click is on #popup-weather-wrapper or .as_close_btn
					if (e.target === e.currentTarget || e.target.classList.contains('as_close_btn')) {
						popupWrapper.remove();
						document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
						document.querySelectorAll('.modal-content').forEach(content => content.style.display = 'none');
						if (teamDetailsWrap) teamDetailsWrap.style.display = 'block';
						if (teamDetails) teamDetails.style.display = 'block';
					} else {
						if (teamDetailsWrap) teamDetailsWrap.style.display = 'block';
						if (teamDetails) teamDetails.style.display = 'block';
					}
				});

			} else {
				alert('Weather for this game is not defined');
			}
		}
		$('body').append('<div class="teamdetailsWrap" style="display:none;position:fixed;height:100%;width:100%;background:' + detailsOverlay + ';left:0;top:0;z-index:99999"></div><div id="TeamDetails" class="detailsReportWrap" style="z-index:99999;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:3.125rem;left:50%;transform:translate(-50%, 0%);background:' + detailsWrapBG + ';border:' + detailsWrapBorWidh + ' solid ' + detailsWrapBorder + ';box-shadow:' + detailsWrapBoxShdw + ';border-radius:' + detailsWrapRadius + ';padding:' + detailsWrapPadding + ';max-height: calc(90% - 3.125rem);overflow:auto"><table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span><tbody id="allTabview"><tr><td colspan="100"><div class="MFLPopTabWrap" style="margin:0"><ul class="MFLPlayerPopupTab" style="padding:0"><li class="MFLPlayerPopupPlayerTabs" id="frachiseBioTab"><a class="MFLPlayerPopupTabLinks active">Bio</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseRostersTab"><a class="MFLPlayerPopupTabLinks">Roster</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseScheduleTab"><a class="MFLPlayerPopupTabLinks">Schedule</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseAwardsTab"><a class="MFLPlayerPopupTabLinks">Awards</a></li></ul></div></td></tr></tbody><tbody id="ownerTabview"><tr><td colspan="100"><div class="MFLPopTabWrap" style="margin:0"><ul class="MFLPlayerPopupTab" style="padding:0"><li class="MFLPlayerPopupPlayerTabs" id="frachiseLineupTab"><a class="MFLPlayerPopupTabLinks">Lineup</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseOptionsTab"><a class="MFLPlayerPopupTabLinks">Options</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseNewsTab"><a class="MFLPlayerPopupTabLinks">News</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseWatchTab"><a class="MFLPlayerPopupTabLinks">WatchList</a></li></ul></div></td></tr></tbody><tbody id="teamLinks"><tr><td colspan="100" style="text-align:center"><div><ul><li id="full_profile_link"><a>Full Profile</a></li><li id="propose_trade_link"><a>Propose Trade</a></li><li id="trade_bait_link"><a>Trade Bait</a></li><li id="transactions_link"><a>Transactions</a></li></ul></div></td></tr></tbody><tbody class="TeamData team_roster_table" style="display:none"></tbody><tbody class="TeamData team_bio_table" style="display:none"></tbody><tbody class="TeamData team_schedule_table" style="display:none"></tbody><tbody class="TeamData team_awards_table" style="display:none"></tbody><tbody class="TeamData team_lineup_table" style="display:none"></tbody><tbody class="TeamData team_options_table" style="display:none"></tbody><tbody class="TeamData team_news_table" style="display:none"></tbody><tbody class="TeamData team_watch_table" style="display:none"></tbody></table></div><style>#TeamDetails caption span img{height:2.5rem;vertical-align:middle;width:auto}#TeamDetails ul.MFLPlayerPopupTab{display:flex;padding:0 0.188rem;}#TeamDetails li.MFLPlayerPopupPlayerTabs{flex:1;margin:0;cursor:pointer}#TeamDetails ul.MFLPlayerPopupTab li a:hover{text-decoration:none}#teamLinks ul{display:table;width:100%;margin:0;padding:0.188rem 0}#teamLinks li{display:inline-block;padding:0 0.313rem;margin:0;list-style:none;cursor:pointer;text-align:center}#teamLinks li a:hover,#teamLinks li a:visited, #teamLinks li a:link{text-decoration:none!important}#ownerTabview td div ul{margin-top:0.25rem}.TeamData.team_roster_table td,.TeamData.team_roster_table th{text-align:center!important}.TeamData.team_roster_table td.player,.TeamData.team_roster_table th.player{text-align:left!important}.team_schedule_table .week,.team_schedule_table .points{text-align:center!important}.team_schedule_table th.matchup,.team_schedule_table td{text-align:left!important}.team_schedule_table img{width:auto;height:1.875rem}.team_awards_table td,.team_awards_table th{text-align:center!important}.team_awards_table td.awardtitle,.team_awards_table th.awardtitle{text-align:left!important}.team_awards_table .franchisename,.team_awards_table .comments{display:none}.team_options_table td{text-align:left!important}.team_bio_table td[class="inputlabel"]{text-align:right!important;white-space:nowrap}.team_bio_table td{text-align:left!important}.team_news_table td,.team_news_table th{text-align:center!important}.team_news_table td.headline,.team_news_table th.headline{text-align:left!important}.team_watch_table td,.team_watch_table th{text-align:center!important}.team_watch_table td.player+td,.team_watch_table td.player,.team_watch_table th:nth-child(1){text-align:left!important}.TeamData.team_roster_table th[colspan="3"]{text-align:right!important}.team_roster_table th:nth-child(9),.team_roster_table td:nth-child(9),.team_roster_table th:nth-child(8),.team_roster_table td:nth-child(8),.team_roster_table th:nth-child(7),.team_roster_table td:nth-child(7),.team_roster_table th:nth-child(6),.team_roster_table td:nth-child(6),.team_roster_table th:nth-child(5),.team_roster_table td:nth-child(5),.team_roster_table th[colspan="3"] + th + th,.team_roster_table th[colspan="3"] + th + th + th,.team_roster_table th[colspan="3"] + th + th + th + th,.team_roster_table td[colspan="3"] + td + td,.team_roster_table td[colspan="3"] + td + td + td,.team_roster_table td[colspan="3"] + td + td + td + td{display:none}.current-conditions-wrapper{margin-bottom:0.625rem}.current-conditions-wrapper,.kickoff-conditions-wrapper{border:0.188rem solid #ccc;border-radius:0.313rem;padding:0.625rem}.current-conditions-text,.kickoff-conditions-text{font-size:1rem;font-weight:700}.current-conditions-localtime{display:block;font-size:0.688rem;font-style:italic}.current-conditions-temp,.kickoff-conditions-temp{font-size:2.25rem;display:inline-block;vertical-align:top;margin-top:0.25rem;font-weight:700}.current-conditions-extras-wrapper,.kickoff-conditions-extras-wrapper{display:inline-block;vertical-align:top;margin-top:0.625rem;margin-left:0.938rem}.current-conditions-wind-wrapper,.current-conditions-rain-wrapper,.current-conditions-snow-wrapper,.kickoff-conditions-wind-wrapper,.kickoff-conditions-rain-wrapper,.kickoff-conditions-snow-wrapper{display:block}.team_lineup_table .reportnavigation{display:none}.weather-more-link{text-align:center;margin-top:0.375rem;cursor:pointer}#popup-weather-wrapper.modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:111111111;background:rgba(0,0,0,.7);display:none}#popup-weather-container{background:#fff;z-index:99999;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);border:0 solid #000;box-shadow:#000 0 0 1.563rem;border-radius:0.188rem;padding:0.625rem;max-height:95%;overflow:auto}img.kickoff-conditions-icon,img.current-conditions-icon{height:3.125rem;width:auto}.weather_caption{line-height:1.875rem;height:1.875rem;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;padding-right:1.438rem}.current-conditions-place{font-size:1.25rem;font-weight:700;max-width:0}.as_close_btn{position:absolute;z-index:1;cursor:pointer;border-radius:0.188rem;text-align:center;border:0.125rem solid transparent;font-weight:700;background:red;color:#fff;right:0;height:1.375rem;width:1.375rem;line-height:1.4;top:50%;transform:translateY(-50%)}.as_close_btn:hover{background:#000;color:#fff}td.pphoto img{image-rendering:-webkit-optimize-contrast;image-rendering: optimize-contrast}.lineup_player_row td.weekly-opp .warning:before{content:"Player\\00a0"}.lineup_player_row td.weekly-opp .warning:after{content:"\\00a0Week"}.lineup_player_row td.weekly-opp .warning{font-weight:400}.lineup_head{padding:0.125rem 0.313rem;font-size:1rem;font-weight:bold;display:block;text-align:left}.target_report tr.lineup_player_row{position:relative;display:block;height:3.75rem}.target_report .lineup_player_row.eventablerow td,.target_report .lineup_player_row.oddtablerow td,.target_report tr.lineup_player_row td{border:0!important;box-shadow:none!important;padding: 0!important;text-align:left!important;background:none!important}.target_report tr.starters_pos_row + tr.lineup_player_row{border-top:0}.target_report tr.lineup_player_row:after{font-family:"Font Awesome 6 Pro";position:absolute;z-index:1;right:0;top:50%;transform:translateY(-50%);width:2.063rem;font-size:1.6rem}.target_report tr.current_starters_row:after{content: "\\f046"}.target_report tr.current_bench_row:after{content:"\\f096"}.target_report tr.lineup_player_row.locked_starter:after,.target_report tr.lineup_player_row.locked_bench::after{content:"\\f30d"}.target_report tr.lineup_player_row:hover{cursor:pointer}.target_report{width:100%}.target_report tr.lineup_player_row input{display:none}.target_report .tie_breakers_row select,.target_report textarea{width:100%;margin:0 auto;}.target_report tr.lineup_player_row input{display:none}.target_report tr.lineup_player_row .weekly-opp a{text-decoration:none}.target_report .headshot{height: 100%;width: 100%;border-radius: 50%}.target_report .headshot[src*="player_photos_"]{object-fit:contain}.target_report td.pphoto {text-align: center!important;border-radius: 50%;width: 3.125rem;height: 3.125rem;position: absolute;left: 0;top: 50%;transform: translateY(-50%);}.target_report tr.lineup_player_row td.pos-rank {font-size: 0.625rem;position: absolute;text-align: center!important;width: 3rem;z-index: 1;pointer-events: none;text-decoration: none;left: 0.188rem;bottom: 0.125rem;border-radius: 0.313rem}.target_report{width:100%}.target_report tr.previous_starter td.pphoto:before{content:"\\f05d";font-family:"Font Awesome 6 Pro";position:absolute;top:0;z-index:1;font-size:1rem;left:0;cursor:default;height:0.75rem;width:0.75rem;background:none}.target_report tr.lineup_player_row td.pos-rank:before{content:attr(data-content) "\\00a0#";display:inline;padding-bottom:0.313rem;margin-top:-1.25rem;text-transform:uppercase}.target_report tr.lineup_player_row td.pos-rank:empty:before{content:attr(data-content) "\\00a0#0";display:inline;padding-bottom:0.313rem;margin-top:-1.25rem;text-transform:uppercase}.target_report tr.lineup_player_row.last_row td.pos-rank{bottom:0.188rem}.target_report tr.lineup_player_row td.inj{text-align:center!important}.target_report tr.lineup_player_row td.player{position:absolute;top:0.188rem;left:3.75rem;font-size:1rem;white-space:nowrap}.target_report td.pphoto img[src*="nflTeamsvg_lineup"]{object-fit: cover;object-position: 50% -0.188rem}.target_report td.pphoto img[src*="svg"]{padding: 0.25rem}.target_report tr.lineup_player_row td.player a{font-weight:700;text-decoration:none}.target_report tr.lineup_player_row td.weekly-opp{position:absolute;top:1.375rem;left:4.063rem;font-size:0.875rem;white-space:nowrap}.target_report td.inj b.warning{font-size:0.625rem;font-weight:400;border-radius:50%;width:1rem;height:1rem;line-height:1rem;display:block;top:2.125rem;left:2.5rem;position:absolute;z-index:2}.target_report tr.lineup_player_row td.bye,.target_report tr.lineup_player_row td.pass-rank,.target_report tr.lineup_player_row td.rush-rank,.target_report tr.lineup_player_row td[class*="-start"]{display:none}tr.lineup_player_row{border-top:0.188rem solid #182a4a}tr.lineup_player_row.last_row{border-bottom:0.188rem solid #182a4a}tr.lineup_player_row.current_bench_row:after{color:red}tr.lineup_player_row.locked_bench:after{color:red}tr.lineup_player_row td.inj b.warning{color:#fff;background:red}tr.lineup_player_row.current_starters_row:after{color:green}tr.lineup_player_row.locked_starter:after{color:green}tr.previous_starter td.pphoto:before{color:green}tr.lineup_player_row td.pos-rank{background:#182a4a;color:#fff}tr.lineup_player_row td.weekly-opp{color:#cd2122}.target_report span.points_row{position:absolute;top:2.5rem;left:4.063rem}.target_report span.points_row span.ytd-pts,.target_report span.points_row span.proj-pts{margin-left:0.625rem}.target_report span.points_row span span{margin-left:0.188rem}.target_report span.points_row span.avg-pts,.target_report span.points_row span.ytd-pts,.target_report span.points_row span.proj-pts{font-size:0.813rem}.target_report span.points_row span.avg-pts span:empty:after{content:"0.0"}.target_report span.points_row span.ytd-pts span:empty:after{content:"0.0"}.target_report span.points_row span.proj-pts span:empty:after{content:"0.0"}tr.lineup_player_row span.points_row span.proj-pts{color:green}@media only screen and (max-width: 28em){.target_report tr.lineup_player_row td.player{font-size:0.875rem}.target_report tr.lineup_player_row td.weekly-opp{font-size:0.75rem}.target_report tr.lineup_player_row td.player{left:3.125rem;font-size:0.875rem}.target_report tr.lineup_player_row td.weekly-opp{left:3.438rem;font-size:0.75rem}.target_report span.points_row{left:3.75rem}.target_report span.points_row span.avg-pts,.target_report span.points_row span.proj-pts,.target_report span.points_row span.ytd-pts{font-size:0.688rem}}</style>');
		if (removeSchedule === undefined) var removeSchedule = false; // set to true to remove the tab and table content for Schedules - which may not apply to All Play or Best Ball Leagues
		if (removeWatchlist === undefined) var removeWatchlist = false; // set to true to remove the tab and table content for Watch List - which may not apply to All Play or Best Ball Leagues
		if (removeLineup === undefined) var removeLineup = false; // set to true to remove the tab and table content for Lineup - which may not apply to All Play or Best Ball Leagues
		if (hideLinks === undefined) var hideLinks = false; // set to true to remove links for "Propose Trade" , "Trade Bait" and "Transactions"  - which may not apply to All Play or Best Ball Leagues
		//if (franchise_id === undefined) var franchise_id = "9999"; // set to true to remove links for "Propose Trade" , "Trade Bait" and "Transactions"  - which may not apply to All Play or Best Ball Leagues
		if (commishTeam === undefined) var commishTeam = "0001";
		if (removeSchedule) {
			$('#frachiseScheduleTab,.team_schedule_table').remove()
		}
		if (removeWatchlist) {
			$('#frachiseWatchTab,.team_watch_table').remove()
		}
		if (removeLineup) {
			$('#frachiseLineupTab,.team_lineup_table').remove()
		}
		if (hideLinks) {
			$('#teamLinks #propose_trade_link,#teamLinks #trade_bait_link,#teamLinks #transactions_link').remove()
		}
		$('body').on('click', '.teamdetailsWrap', function () {
			$('#TeamDetails .TeamData').html("");
			$('.teamdetailsWrap,#TeamDetails').hide();
			$('#MFLPlayerPopupContainer #MFLPlayerPopupClose,#MFLPlayerPopupOverlay').removeClass("teamdetails_activated");
			$('#ScoreDetails #MFLPlayerPopupClose,#ScoreNFLDetails #MFLPlayerPopupClose,.scoredetailsWrap').removeClass("scoredetails_activated");
			$('a').removeClass('dblClick');
			try {
				if (typeof LSMteamBox !== 'undefined' && LSMteamBox) {
					if (isElementVisible(LSMteamBox)) {
						//do nothing
					} else {
						bodyScrollLock.clearAllBodyScrollLocks();
					}
				} else {
					bodyScrollLock.clearAllBodyScrollLocks();
				}
			} catch (er) {};
			//$('html').css('overflow',''); // Mike added for scrolling of body
		});
		$('body').on('click', '.teamdetails_activated , .scoredetails_activated', function () {
			$('#TeamDetails,.teamdetailsWrap').show();
			//MIKE ADDED FOR BODY SCROLL
			const franchisepop = document.querySelector('#TeamDetails');
			try {
				bodyScrollLock.disableBodyScroll(franchisepop);
			} catch (er) {};
		});
		$('body').on('click', '#TeamDetails li.MFLPlayerPopupPlayerTabs a', function () {
			$('#TeamDetails li.MFLPlayerPopupPlayerTabs a').removeClass("active");
			$(this).addClass("active");
		});
		$('body').on('click', '#TeamDetails li#frachiseRostersTab', function () {
			$('.TeamData').hide();
			$('.team_roster_table').show();
		});
		$('body').on('click', '#TeamDetails li#frachiseBioTab', function () {
			$('.TeamData').hide();
			$('.team_bio_table').show();
		});
		$('body').on('click', '#TeamDetails li#frachiseScheduleTab', function () {
			$('.TeamData').hide();
			$('.team_schedule_table').show();
		});
		$('body').on('click', '#TeamDetails li#frachiseAwardsTab', function () {
			$('.TeamData').hide();
			$('.team_awards_table').show();
		});
		$('body').on('click', '#TeamDetails li#frachiseLineupTab', function () {
			$('.TeamData').hide();
			$('.team_lineup_table').show();
			//UPDATE WEATHER LINKS
			$("td.weekly-opp:contains('Weather')").each(function () {
				var home_id;
				if ($(this).text().indexOf("@") === -1) {
					var playerLink = $(this).closest('tr').find('td.player a');
					if (playerLink.length) {
						var playerNameParts = playerLink.text().split(' ');
						home_id = playerNameParts[playerNameParts.length - 2];
					}
				} else {
					home_id = $(this).text().substr(1, 3);
				}
				var link = $(this).find("a");
				var href = link.length ? link.attr("href") : "#"; // Default "#" if href is missing
				link.attr('onclick', `lu_popup_weatherPopup("${home_id}", "${href}")`)
					.attr('title', 'View Weather')
					.removeAttr("target")
					.removeAttr("href");
			});
		});
		$('body').on('click', '#TeamDetails li#frachiseOptionsTab', function () {
			$('.TeamData').hide();
			$('.team_options_table').show();
		});
		$('body').on('click', '#TeamDetails li#frachiseNewsTab', function () {
			$('.TeamData').hide();
			$('.team_news_table').show();
		});
		$('body').on('click', '#TeamDetails li#frachiseWatchTab', function () {
			$('.TeamData').hide();
			$('.team_watch_table').show();
		});
		// PREVENT DOUBLE CLICK
		$('body').on('click', '.dblClick', function (e) {
			e.preventDefault();
		});
		// PLAYER POPUP CLOSE CLICK
		$('body').on('click', '#TeamDetails #MFLPlayerPopupClose', function () {
			$('#TeamDetails .TeamData').html("");
			$('.teamdetailsWrap,#TeamDetails').hide();
			try {
				if (typeof LSMteamBox !== 'undefined' && LSMteamBox) {
					if (isElementVisible(LSMteamBox)) {
						//do nothing
					} else {
						bodyScrollLock.clearAllBodyScrollLocks();
					}
				} else {
					bodyScrollLock.clearAllBodyScrollLocks();
				}
			} catch (er) {};
			//$('html').css('overflow',''); // Mike added for scrolling of body
			$('#MFLPlayerPopupContainer #MFLPlayerPopupClose,#MFLPlayerPopupOverlay').removeClass("teamdetails_activated");
			$('#ScoreDetails #MFLPlayerPopupClose,#ScoreNFLDetails #MFLPlayerPopupClose,.scoredetailsWrap').removeClass("scoredetails_activated");
			$('a').removeClass('dblClick');
		});
		// FRANCHISE NAMES POPUP FRANCHISE BOX
		$('body').on('click', '#LSscoringBox .franchise-icon a , #LSscoringBox .franchise-name a , .report a[href*="options?L="][href*="F="][href*="O=07"]:not([class*="dblClick"]):not([href*="F=0000"]):not([href*="api.myfantasyleague.com"]),.report a[href*="options?L="][href*="F="][href*="O=01"]:not([class*="dblClick"]):not([class*="pop_profile"]):not([href*="F=0000"]):not([href*="api.myfantasyleague.com"]),.report a[class*="franchise_"][href*="options?L="][href*="F="]:not([class*="dblClick"]):not([href*="F=0000"]):not([href*="api.myfantasyleague.com"])', function (e) {
			// ADD CLASS TO PREVENT DOUBLE CLICK
			$(this).addClass('dblClick');
			// GLOBAL USE
			$('#TeamDetails table').addClass("report");
			$('#MFLPlayerPopupContainer #MFLPlayerPopupClose,#MFLPlayerPopupOverlay').addClass("teamdetails_activated");
			$('#ScoreDetails #MFLPlayerPopupClose,#ScoreNFLDetails #MFLPlayerPopupClose,.scoredetailsWrap').addClass("scoredetails_activated");
			var href = $(this).attr('href');
			var franid = href.substring(href.indexOf("F=") + 2, href.length);
			franid = franid.substring(0, franid.indexOf('&'));
			// LOGIC FOR OWNER - GUEST OR COMMISH CLICKING LINK
			var href2 = $(this).parent().find("a").attr("href");
			var target_fid = href2.substr(href2.indexOf("F=") + 2, 4);
			//if (typeof franchise_id === "undefined" || franchise_id === "9999") {
			if (typeof franchise_id === "undefined") {
				$('#ownerTabview,#teamLinks #propose_trade_link,#teamLinks #trade_bait_link').remove();
				//console.log("Guest clicked a franchise popup link");
			} else if (target_fid === franchise_id) {
				$('#ownerTabview').attr('style', 'display:table-row-group!important');
				$('#teamLinks #propose_trade_link').html('<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=05">Propose A Trade</a>');
				var userLogginAsset = true;
				//console.log("Owner clicked their own franchise link popup");
			} else if (franchise_id === "0000" && target_fid === commishTeam) {
				$('#ownerTabview').attr('style', 'display:table-row-group!important');
				$('#teamLinks #propose_trade_link').html('<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=05">Propose A Trade</a>');
				var userLogginAsset = true;
				//console.log("commish clicked his own franchise he owns as owner");
			} else if (franchise_id === "0000") {
				$('#ownerTabview').attr('style', 'display:table-row-group!important');
				$('#teamLinks #propose_trade_link').html('<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&FRANCHISE=' + commishTeam + '&OPTION=05&FRANCHISE=' + franid + '">Offer A Trade</a>');
				var userLogginAsset = true;
				//console.log("commish clicked a franchise he doesn't own as owner");
			} else {
				$('#ownerTabview').attr('style', 'display:none!important');
				$('#teamLinks #propose_trade_link').html('<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&FRANCHISE=' + franchise_id + '&OPTION=05&FRANCHISE=' + franid + '">Offer A Trade</a>');
				var userLogginAsset = true;
				//console.log("owner clicked franchise link they do not own");
			}
			// APPEND GLOBAL LINKS
			$('#teamLinks #full_profile_link').html('<a class="pop_profile" href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&F=' + franid + '&O=01">Full Profile</a>');
			$('#teamLinks #trade_bait_link').html('<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=133">Trade Bait</a>');
			$('#teamLinks #transactions_link').html('<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=03&F=' + franid + '">Transactions</a>');
			// ROSTER
			$('#TeamDetails caption span').html($(this).html());
			if (load_playerIcons) {
				var fidPop = $(this).attr("class").substr($(this).attr("class").indexOf('franchise_') + 10, 4);
				try {
					$('#TeamDetails caption span').css('white-space', 'nowrap');
					$('#TeamDetails caption span').prepend("<div class='franTeam_" + fidPop + "' title='" + franchiseDatabase["fid_" + fidPop].name + "'></div>");
				} catch (er) {}
			}
			$('#TeamDetails caption span a').contents().unwrap();
			$('#TeamDetails li.MFLPlayerPopupPlayerTabs a').removeClass("active");
			$('#TeamDetails #frachiseBioTab a').addClass("active");
			var getRosterdata = `${baseURLDynamic}/${year}/options?L=${league_id}&O=07&F=${franid}&PRINTER=1`;
			fetch(getRosterdata)
				.then(response => response.text())
				.then(data => {
					var rosterTable = $(data).find('.report tbody').contents();
					$('#TeamDetails .team_roster_table').html(rosterTable);
					$('#TeamDetails td a[class*="position_').attr('href', function (i, href) {
						return href.replace('&PRINTER=1', '');
					});
					$('.team_roster_table th.points').text("Pts");
				})
				.catch(error => {
					console.error('Error:', error);
				});

			// BIO
			var getBiodata = `${baseURLDynamic}/${year}/options?L=${league_id}&F=${franid}&O=01&PRINTER=1`;
			var popteamLogo = '<tr><td colspan="2" style="text-align:center!important;border:0;box-shadow:none;padding:0"><img style="max-width:100%;margin:0;width:100%" src="' + franchiseDatabase["fid_" + franid].logo + '" class="franchiselogo pop_logo"/></td></tr>';
			fetch(getBiodata)
				.then(response => response.text())
				.then(data => {
					if (includeBiologo) {
						$('#TeamDetails .team_bio_table').append(popteamLogo);
					}
					$('#TeamDetails .team_bio_table').append('<tr><th colspan="2">Owner Information</th></tr>');
					var bioTable = $(data).find('.report tr.emailaddress,.report tr.ownername,.report tr.daytimephone,.report tr.cellnumber,.report tr.mailingaddress,.report tr.lastvisit,.report tr.conference,.report tr.division,.report tr.accounting,.report tr.bbidtotalspent,.report tr.h2hrecord,.report tr.ytdpoints');
					$('#TeamDetails .team_bio_table').append(bioTable);
					$('#TeamDetails .team_bio_table').append('<tr class="eventablerow reportfooter"><td colspan="2" style="text-align:center!important"><a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=208">Career Record</a> |  <a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=171&FID=' + franid + '">All-Time Series Records</a></td></tr>');
					jQuery("#TeamDetails .h2hrecord td:nth-child(2)").text(jQuery(".h2hrecord td:nth-child(2)").text().substr(0, jQuery(".h2hrecord td:nth-child(2)").text().indexOf("(")));
					$('.TeamData').hide();
					if (includeBiologoAsset && userLogginAsset) {
						if (franchise_id === "0000") {
							var getBiodataAsset = `${baseURLDynamic}/${year}/options?L=${league_id}&FRANCHISE=${commishTeam}&OPTION=05&FRANCHISE=${franid}&PRINTER=1`;
						} else {
							var getBiodataAsset = `${baseURLDynamic}/${year}/options?L=${league_id}&FRANCHISE=${franchise_id}&OPTION=05&FRANCHISE=${franid}&PRINTER=1`;
						}
						fetch(getBiodataAsset)
							.then(response => response.text())
							.then(data => {
								$('#TeamDetails .team_bio_table').append('<tr><th colspan="2">Owner Assets</th></tr>');
								var bioTablePICKS = $(data).find('form table tr td:nth-child(2) table tr:contains("Draft Pick")').addClass("alter_td");
								var bioTableBBID = $(data).find('form table tr td:nth-child(2) table tr:contains("Blind Bidding Dollars")').addClass("alter_td");
								$('#TeamDetails .team_bio_table').append(bioTablePICKS);
								$('#TeamDetails .team_bio_table').append(bioTableBBID);
								$(".alter_td td:nth-child(1)").remove();
								$(".alter_td td").attr('colspan', '2');
								$(".alter_td td").attr('style', 'text-align:center!important');
								if ($("#TeamDetails .team_bio_table tr.alter_td").length > 0) {
									//DO NOTHING
								} else {
									if (franchise_id === "0000") {
										$('#TeamDetails .team_bio_table').append('<tr class="oddtablerow"><td colspan="2" class="warning" style="text-align:center!important">Commish Abilities Do Not Permit Access To Trades Data</th></tr>');
									} else {
										$('#TeamDetails .team_bio_table').append('<tr class="oddtablerow"><td colspan="2" class="warning" style="text-align:center!important">If Trades Disabled, No Assets Will Be Displayed</th></tr>');
									}
								}
								$('.team_bio_table').show();
								$('.teamdetailsWrap,#TeamDetails').show();
								//MIKE ADDED FOR BODY SCROLL
								const franchisepop = document.querySelector('#TeamDetails');
								try {
									bodyScrollLock.disableBodyScroll(franchisepop);
								} catch (er) {};
								//$('html').css('overflow','hidden'); // Mike added for scrolling of body
							})
							.catch(error => {
								console.error('Error fetching biodata asset:', error);
							});
					} else {
						$('.team_bio_table').show();
						$('.teamdetailsWrap,#TeamDetails').show();
						//MIKE ADDED FOR BODY SCROLL
						const franchisepop = document.querySelector('#TeamDetails');
						try {
							bodyScrollLock.disableBodyScroll(franchisepop);
						} catch (er) {};
						//$('html').css('overflow','hidden'); // Mike added for scrolling of body
					}
				})
				.catch(error => {
					console.error('Error fetching biodata:', error);
				});
			// SCHEDULE
			var getScheduledata = `${baseURLDynamic}/${year}/options?L=${league_id}&O=16&F=${franid}&PRINTER=1`;
			fetch(getScheduledata)
				.then(response => response.text())
				.then(data => {
					var scheduleTable = $(data).find('.report tbody').contents();
					$('#TeamDetails .team_schedule_table').html(scheduleTable);
					if (load_playerIcons) {
						$('body').find('.team_schedule_table a[class*="franchise_"]').each(function () {
							var fidPoptwo = $(this).attr("class").substr($(this).attr("class").indexOf('franchise_') + 10, 4);
							try {
								$(this).parent().css('white-space', 'nowrap');
								$(this).parent().prepend("<div class='franTeam_" + fidPoptwo + "' title='" + franchiseDatabase["fid_" + fidPoptwo].name + "'></div>");
								setTimeout(function () {
									$(".team_schedule_table a").contents().unwrap();
								}, 1000);
							} catch (er) {};
						});
					} else {
						$(".team_schedule_table a").contents().unwrap();
					}
				})
				.catch(error => {
					console.error('Error:', error);
				});
			// AWARDS
			var getAwardsdata = `${baseURLDynamic}/${year}/options?L=${league_id}&O=202&FID=${franid}&PRINTER=1`;
			fetch(getAwardsdata)
				.then(response => response.text())
				.then(data => {
					var awardsTable = $(data).find('.report tbody').contents();
					$('#TeamDetails .team_awards_table').html(awardsTable);
					$('#TeamDetails .team_awards_table td.reportfooter').html('<a href="' + baseURLDynamic + '/' + year + '/csetup?C=AWARDS&L=' + league_id + '">Create New Award</a> |  <a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=201">Edit League Awards</a>');
				})
				.catch(error => {
					console.error('Error:', error);
				});
			// LINEUP
			if (completedWeek >= endWeek) {
				var getLineupdata = `${baseURLDynamic}/${year}/lineup?L=${league_id}&FRANCHISE=${franid}&WEEK=${endWeek}&PRINTER=1`;
			} else {
				var getLineupdata = `${baseURLDynamic}/${year}/lineup?L=${league_id}&FRANCHISE=${franid}&PRINTER=1`;
			}
			fetch(getLineupdata)
				.then(response => response.text())
				.then(data => {
					var lineupTable = $(data).find('.mobile-wrap form');
					var lineupTableWarning = $(data).find('h3.warning');
					$('#TeamDetails .team_lineup_table').append(lineupTableWarning);
					$('#TeamDetails .team_lineup_table h3.warning a').contents().unwrap();
					$('#TeamDetails .team_lineup_table').append(lineupTable);
					$('.team_lineup_table form').wrap('<tr><td>');
					$('.team_lineup_table table.report caption a').remove();
					$('.team_lineup_table table.report caption').contents().unwrap().prependTo('.team_lineup_table').addClass('lineup_head');
					$('.team_lineup_table .lineup_head').append('<div class="lineup_filter" style="float:right;font-size:1.375rem"><div style="padding:0;text-indent:0;display:inline;margin-right:0.625rem;cursor:pointer" id="LineupResetRow" title="Reset Starting Lineup"><i class="fa-regular fa-arrows-rotate" aria-hidden="true"></i></div><div style="padding:0;text-indent:0;display:inline;cursor:pointer" id="LineupClearRow" title="Clear Starting Lineup"><i class="fa-regular fa-eraser" aria-hidden="true"></i></div></div>');
					$('.team_lineup_table table.report').removeClass('report').addClass('target_report');
					// CLASS NAMES FOR TD AND TH
					var LineupclassNames = [];
					$(".target_report tr:eq(0) th").each(function () {
						var className = $(this).text().toLowerCase().replace(/ /g, "-");
						if (className === "rush" || className === "pass") className += "-rank";
						if (className === "opp-avgvs-pos") className = "pass-rank";
						if (className === "opp-rankvs-pos") className = "rush-rank";
						if (className.indexOf("select-a") !== -1) className = "select-total-starters";
						if (className.indexOf("week-") !== -1) className = "weekly-opp";
						$(this).addClass(className);
						LineupclassNames.push(className);
					});
					var rowCount = 0;
					$(".target_report tr").each(function () {
						var tdCount = 0;
						$(this).find("td").each(function () {
							$(this).addClass(LineupclassNames[tdCount + 1]);
							tdCount++;
						});
						rowCount++;
					});
					$(".target_report tr:has(select)").addClass('tie_breakers_row');
					$('.target_report .nfl-news,.target_report table .pass-rank').remove();
					$('.target_report tr th:contains("Select"):contains(":")').addClass('starters_pos_th');
					$('.target_report .starters_pos_th').parent('tr').before('<tr class="starters_pos_row"></tr>');
					$('.target_report .starters_pos_th').each(function () {
						$(this).attr('colspan', '100');
						$(this).parent('tr').prev(".starters_pos_row").append(this);
					});
					$('.target_report tr th:contains("Select"):contains("A"):contains("Total"):contains("Of")').addClass('starters_count_th');
					$('.target_report .starters_count_th').parent('tr').before('<tr class="starters_count_row"></tr>');
					$('.target_report .starters_count_th').each(function () {
						$(this).attr('colspan', '100');
						$(this).parent('tr').prev(".starters_count_row").append(this);
					});
					$('.target_report tr th:contains("Optional"):contains("Message")').addClass('message_th');
					$('.target_report .message_th').parent('tr').before('<tr class="message_row"></tr>');
					$('.target_report .message_th').each(function () {
						$(this).attr('colspan', '100');
						$(this).parent('tr').prev(".message_row").append(this);
					});
					$('.target_report th:not(.starters_pos_th):not(.starters_count_th):not(.message_th)').remove();
					$(".target_report tr td.player").not(':has(a[href*="player?"])').removeClass('player');
					$('.team_lineup_table td.pass-rank a,.team_lineup_table td.rush-rank a,.team_lineup_table td.ytd-pts a').contents().unwrap();
					$('.team_lineup_table td.pass-rank a:empty,.team_lineup_table td.rush-rank a:empty,.team_lineup_table td.ytd-pts a:empty').remove();
					$('.team_lineup_table tr').removeClass('newposition');
					$('.target_report td a[class*="position_').attr('href', function (i, href) {
						return href.replace('&PRINTER=1', '');
					});
					jQuery(".target_report td.player a").each(function () {
						jQuery(this).closest('tr').addClass("lineup_player_row");
					});
					$('.target_report tr.lineup_player_row td.player input').closest('tr').addClass("current_bench_row");
					$('.target_report tr.lineup_player_row td.player input[checked="checked"]').closest('tr').removeClass("current_bench_row").addClass("current_starters_row previous_starter");
					$('.target_report tr.lineup_player_row td.player input[checked="checked"][disabled="disabled"]').closest('tr').removeClass("current_bench_row current_starters_row").addClass("locked_starter");
					$('.target_report tr.lineup_player_row td.player input[disabled="disabled"]').not('input[checked="checked"]').closest('tr').removeClass("current_bench_row locked_starter").addClass("locked_bench");
					jQuery(".starters_pos_row").each(function () {
						$(this).nextUntil(".starters_pos_row").addBack().wrapAll("<tbody>");
					});
					$(document).on('click', '.target_report tr.current_starters_row', function () {
						if (($(this).nextAll('.locked_bench').length) && ($(this).nextAll('.current_bench_row').length < 1)) {
							$(this).nextAll('.locked_bench:first').before(this);
						} else if (($(this).nextAll('.locked_bench').length) && ($(this).nextAll('.current_bench_row').length > 0)) {
							$(this).nextAll('.current_bench_row:first').before(this);
						} else if ($(this).nextAll('.current_bench_row').length) {
							$(this).nextAll('.current_bench_row:first').before(this);
						} else if ($(this).nextAll('.current_starters_row').length) {
							$(this).nextAll('.current_starters_row:last').after(this);
						}
						$(this).not('.locked_starter').not('.locked_bench').find(':checkbox').prop('checked', false).change();
						$(this).not('.locked_starter').not('.locked_bench').removeClass('current_starters_row').addClass('current_bench_row');
						$(this).not('.locked_starter').not('.locked_bench').attr('title', 'Move To Starting Lineup');
						$('.target_report .lineup_player_row:odd').removeClass('oddtablerow eventablerow').addClass('eventablerow');
						$('.target_report .lineup_player_row:even').removeClass('oddtablerow eventablerow').addClass('oddtablerow');
						$('.target_report tr.lineup_player_row').removeClass('last_row').last().addClass('last_row');
					});
					$(document).on('click', '.target_report tr.current_bench_row', function () {
						if (($(this).prevAll('.locked_starter').length) && ($(this).prevAll('.current_starters_row').length < 1)) {
							$(this).prevAll('.locked_starter:first').after(this)
						} else if ($(this).prevAll('.current_starters_row').length) {
							$(this).prevAll('.current_starters_row:first').after(this)
						} else if ($(this).prevAll('.starters_pos_row').length) {
							$(this).prevAll('.starters_pos_row:first').after(this)
						}
						$(this).not('.locked_starter').not('.locked_bench').find(':checkbox').prop("checked", true).change();
						$(this).not('.locked_starter').not('.locked_bench').removeClass('current_bench_row').addClass('current_starters_row');
						$(this).not('.locked_starter').not('.locked_bench').attr('title', 'Move To Bench');
						$('.target_report .lineup_player_row:odd').removeClass('oddtablerow eventablerow').addClass('eventablerow');
						$('.target_report .lineup_player_row:even').removeClass('oddtablerow eventablerow').addClass('oddtablerow');
						$('.target_report tr.lineup_player_row').removeClass('last_row').last().addClass('last_row');
					});
					$(document).on('click', '.target_report tr.lineup_player_row.previous_starter.cleared', function () {
						if (($(this).prevAll('.locked_starter').length) && ($(this).prevAll('.current_starters_row').length < 1)) {
							$(this).prevAll('.locked_starter:first').after(this)
						} else if ($(this).prevAll('.current_starters_row').length) {
							$(this).prevAll('.current_starters_row:first').after(this)
						} else if ($(this).prevAll('.starters_pos_row').length) {
							$(this).prevAll('.starters_pos_row:first').after(this)
						}
						$(this).not('.current_starter').find(':checkbox').prop("checked", true).change();
						$(this).removeClass('current_bench_row').addClass('current_starters_row');
						$(this).not('.locked_starter').attr('title', 'Move To Bench');
						$('.target_report .lineup_player_row:odd').removeClass('oddtablerow eventablerow').addClass('eventablerow');
						$('.target_report .lineup_player_row:even').removeClass('oddtablerow eventablerow').addClass('oddtablerow');
						$('.target_report tr.lineup_player_row').removeClass('last_row').last().addClass('last_row');
						$('.target_report tr.lineup_player_row.previous_starter.cleared').removeClass('cleared');
					});
					//CLEAR PLAYERS CHECKED
					$(document).on('click', '#LineupClearRow', function () {
						$('.target_report tr.lineup_player_row').not('tr.locked_starter').not('tr.locked_bench').find('input').prop('checked', false).change();
						$('.target_report tr.lineup_player_row').not('tr.locked_starter').not('tr.locked_bench').removeClass('current_starters_row').addClass('current_bench_row');
						$('.target_report tr.lineup_player_row').not('tr.locked_starter').not('tr.locked_bench').attr('title', 'Move To Starting Lineup');
					});
					//RESET TO PREVIOUS STARTERS
					$(document).on('click', '#LineupResetRow', function () {
						$('.target_report tr.lineup_player_row.previous_starter').not('tr.locked_starter').addClass('cleared');
						// RESET ALL TO BENCH
						$('.target_report tr.lineup_player_row').not('tr.locked_starter').not('tr.locked_bench').find('input').prop('checked', false).change();
						$('.target_report tr.lineup_player_row').not('tr.locked_starter').not('tr.locked_bench').removeClass('current_starters_row').addClass('current_bench_row');
						// SET ALL PREVIOUS STARTERS TO CURRENT STARTERS
						$('.target_report tr.lineup_player_row.previous_starter.cleared').trigger("click");
					});
					$(".target_report tr.lineup_player_row td.weekly-opp,.target_report tr.lineup_player_row td.player").click(function (e) {
						e.stopPropagation();
					});
					$('.team_lineup_table tr.current_bench_row').not('.locked_bench').attr('title', 'Move To Starting Lineup');
					$('.team_lineup_table tr.current_starters_row').not('.locked_starter').attr('title', 'Move To Bench');
					$('.team_lineup_table tr.locked_starter,.team_lineup_table tr.locked_bench').attr('title', 'Game Has Started - Player Locked');
					$(".target_report tr.lineup_player_row").each(function () {
						$('.target_report td.points,.target_report td.ytd,.target_report td.avg').hide();
						var proj_html = $(this).find("td.proj-pts").html();
						var ytd_html = $(this).find("td.ytd-pts").html();
						var avg_html = $(this).find("td.avg-pts").html();
						if (avg_html === undefined) avg_html = 0;
						if (proj_html === undefined) proj_html = 0;
						if (ytd_html === undefined) ytd_html = 0;
						$(this).append('<span class="points_row"><span class="avg-pts">Avg:<span>' + avg_html + '</span></span><span class="ytd-pts">YTD:<span>' + ytd_html + '</span></span><span class="proj-pts">Proj:<span>' + proj_html + '</span></span></span>');
						setTimeout(function () {
							$('.target_report td.points,.target_report td.ytd,.target_report td.avg').remove();
						}, 1000);
					});
					$(".target_report tr.tie_breakers_row").before('<tr><th class="tiebreaker_th" colspan="100" valign="top">Select Tie-Breakers</th></tr>');
					// TEAM AND PLAYER IMAGES
					var lu_logoPathPop = "https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_lineup/";
					var lu_useTeamLogoPop = {
						"Coach": true,
						"QB": false,
						"TMQB": true,
						"TMRB": true,
						"RB": false,
						"FB": false,
						"WR": false,
						"TMWR": true,
						"TE": false,
						"TMTE": true,
						"KR": false,
						"PK": false,
						"TMPK": true,
						"PN": false,
						"TMPN": true,
						"Off": true,
						"DT": false,
						"DE": false,
						"TMDL": true,
						"LB": false,
						"TMLB": true,
						"CB": false,
						"S": false,
						"TMDB": true,
						"Def": true,
						"ST": true
					}
					if (typeof franchise_id !== "undefined") {
						(function () {
							var default_image_uri, get_player_id_from, get_position_from, get_nfl_team_from;
							default_image_uri = 'https://www.mflscripts.com/playerImages_96x96/free_agent.png';
							get_player_id_from = function (url) {
								var entry, field, qs, _i, _len;
								if (url.indexOf("launch_player_modal") !== -1) {
									qs = url.split(',');
									field = qs[1].replace(/'/g, "").replace(");", "");
									return field;
								} else {
									qs = url.split('?')[1].split('&');
									for (_i = 0, _len = qs.length; _i < _len; _i++) {
										field = qs[_i];
										entry = field.split('=');
										if (entry[0] === 'P') {
											return entry[1];
										}
									}
								}
							};
							get_position_from = function (playerName) {
								var qs;
								qs = playerName.split(' ');
								return qs[qs.length - 1];
							};
							get_nfl_team_from = function (playerName) {
								var qs;
								qs = playerName.split(' ');
								return qs[qs.length - 2];
							};
							$(function () {
								var $lineup_table, $links;
								$lineup_table = $('.team_lineup_table');
								if ($lineup_table.length) {
									$links = $('a[class^="position"]');
									$links.each(function (index, el) {
										var $el, current_year_img_url, id, position, nfl;
										$el = $(el);
										id = get_player_id_from($el.attr('href'));
										position = get_position_from($el.text());
										nfl = get_nfl_team_from($el.text());
										if (lu_useTeamLogoPop[position]) current_year_img_url = lu_logoPathPop + nfl + ".svg";
										else current_year_img_url = "https://www.mflscripts.com/playerImages_96x96/mfl_" + id + ".png";
										//else if(espn_ar.hasOwnProperty("pid_"+id)) current_year_img_url = "https://www.mflscripts.com/playerImages_96x96/" + espn_ar["pid_"+id] + ".png";
										//else current_year_img_url = "//www.myfantasyleague.com/player_photos_2014/" + id + "_thumb.jpg";
										return $el.parentsUntil('.team_lineup_table tr', '.team_lineup_table td').before("<td class=\"pphoto\"><img class=\"headshot\" data-player-img-url=\"" + current_year_img_url + "\" /></td>").find('img');
									});
									return $lineup_table.find('img').each(function (index, el) {
										var $el;
										$el = $(this);
										$el.one('error', function () {
											$el.one('error', function () {
												$el.one('error', function () {
													return $(this).attr('src', default_image_uri);
												});
												$el1 = $(this);
												return $el1.attr('src', $el1.attr('src').replace("2014", String(year)));
											});
											$el1 = $(this);
											id = get_player_id_from($el.parent().parent().find("td.player a").attr('href'));
											return $el1.attr('src', '//www.myfantasyleague.com/player_photos_2014/' + id + '_thumb.jpg');
										});
										return $el.attr('src', $el.data('player-img-url'));
									});
								}
							});
						}).call(this);
					}
					$(".target_report tr.lineup_player_row").each(function () {
						var playerName = $(this).find("td.player a").text();
						var playerPosition = playerName.split(' ')[playerName.split(' ').length - 1];
						$(this).addClass("position_" + playerPosition.toLowerCase());
						$(this).find("td.pos-rank").attr('data-content', playerPosition.toUpperCase());
					});
					setTimeout(function () {
						$('.target_report tr.locked_bench').each(function () {
							$(this).prevAll('.starters_pos_row:first').after(this);
						});
					}, 10);
					setTimeout(function () {
						$('.target_report tr.current_bench_row').each(function () {
							$(this).prevAll('.starters_pos_row:first').after(this);
						});
					}, 40);
					setTimeout(function () {
						$('.target_report tr.current_starters_row').each(function () {
							$(this).prevAll('.starters_pos_row:first').after(this);
						});
					}, 70);
					setTimeout(function () {
						$('.target_report tr.locked_starter').each(function () {
							$(this).prevAll('.starters_pos_row:first').after(this);
						});
					}, 100);
					setTimeout(function () {
						$('.target_report .lineup_player_row:odd').removeClass('oddtablerow eventablerow').addClass('eventablerow');
						$('.target_report .lineup_player_row:even').removeClass('oddtablerow eventablerow').addClass('oddtablerow');
						$('.target_report tr.lineup_player_row').last().addClass('last_row');
					}, 150);
					if (typeof franchise_id !== "undefined" && franchise_id !== "0000") {
						if (completedWeek >= endWeek) {

							const STYLE_ID = 'team-lineup-week-over-style';

							if (!document.getElementById(STYLE_ID)) {
								$('head').append(`
				<style id="${STYLE_ID}">
					.team_lineup_table.week_over tr.locked_starter_game_over,
					.team_lineup_table.week_over tr.locked_bench_game_over{pointer-events:none}

					.team_lineup_table.week_over tr.locked_starter_game_over:after,
					.team_lineup_table.week_over tr.locked_bench_game_over::after{
						content:"\\f30d"!important;
						width:2.25rem!important;
						font-size:2.25rem!important;
						right:-0.188rem!important
					}

					.team_lineup_table.week_over .lineup_filter,
					.team_lineup_table.week_over input[type="submit"]{pointer-events:none}

					.team_lineup_table.week_over input[type="submit"],
					.team_lineup_table.week_over .form_buttons:before{opacity:.5}

					.team_lineup_table.week_over .starter_count,
					.team_lineup_table.week_over .starter_count_sub{display:none!important}

					.team_lineup_table.week_over tr.locked_starter_game_over td.player,
					.team_lineup_table.week_over tr.locked_bench_game_over td.player{pointer-events:all}
				</style>
			`);
							}

							$('.team_lineup_table').addClass('week_over');
							$('.team_lineup_table.week_over .current_starters_row').addClass('locked_starter_game_over');
							$('.team_lineup_table.week_over .current_bench_row').addClass('locked_bench_game_over');
							$('.team_lineup_table.week_over .player_row').attr('title', 'Game Over');
						}
					}

				})
				.catch(error => {
					console.error('Error:', error);
				});
			// OPTIONS
			var getOptionsdata = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=MY_OPTIONS`;
			fetch(getOptionsdata)
				.then(response => response.text())
				.then(data => {
					var optionsTable = $(data).find('#my_options tbody').contents();
					$('#TeamDetails .team_options_table').html(optionsTable);
					$('.myoptions td[class="inputlabel"]').remove();
					$("tr.mailingaddress td a").contents().unwrap();
				})
				.catch(error => {
					console.error('Error:', error);
				});
			// NEWS
			var getNewsdata = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=MY_NEWS`;
			fetch(getNewsdata)
				.then(response => response.text())
				.then(data => {
					var newsTable = $(data).find('#my_news tbody').contents();
					$('#TeamDetails .team_news_table').html(newsTable);
				})
				.catch(error => {
					console.error('Error:', error);
				});
			// WATCHLIST
			var getWatchdata = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=MY_WATCH_LIST`;
			fetch(getWatchdata)
				.then(response => response.text())
				.then(data => {
					var watchTable = $(data).find('#my_watch_list tbody').contents();
					$('#TeamDetails .team_watch_table').html(watchTable);
					$('.TeamData.team_watch_table > tr:nth-child(1)').replaceWith('<tr><th>Player</th><th style="text-align: left!important">Owner Status</th><th>YTD Pts</th></tr>');
				})
				.catch(error => {
					console.error('Error:', error);
				});
			e.preventDefault();
		});
	}
} // end load popup
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END PLAYER POPUP SCRIPT///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START MINI BOX SCORE//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (load_mini_boxscore) { // for template users ONLY
	if (mini_offseason_hide === undefined) var mini_offseason_hide = false;
	if (deactivate_all_offseason === undefined) var deactivate_all_offseason = false;
	if ((is_offseason && mini_offseason_hide) || (is_offseason && deactivate_all_offseason)) {
		$('#MFLBoxWrapper').parent('.mobile-wrap').remove();
		$('#MFLBoxWrapper').remove();
		//console.log("Offseason - Mini Boxscores Script");
	} else {

		//MINI SCOREBOARD VERSION NUMBER
		//console.log('MINISCOREBOARD SCRIPT LAST UPDATED 01-11-22');

		//SETUP MINI-BOXSCORE USER VAR DEFAULT SETTINGS
		if (mflBoxHomePageOnly === undefined) var mflBoxHomePageOnly = true;
		if (mflBoxUseIcon === undefined) var mflBoxUseIcon = false;
		if (mflBoxUseLogo === undefined) var mflBoxUseLogo = false;
		if (mflBoxUseAbbrev === undefined) var mflBoxUseAbbrev = false;
		if (mflBoxIconBase === undefined) var mflBoxIconBase = "";
		if (mflBoxIconExt === undefined) var mflBoxIconExt = "";
		if (mflBoxNFLLogoPath === undefined) var mflBoxNFLLogoPath = "https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/";
		if (mflBoxNFLLogoExt === undefined) var mflBoxNFLLogoExt = "svg";
		if (mflBoxPositionSort === undefined) var mflBoxPositionSort = new Array("Coach", "Off", "QB", "TMQB", "RB", "TMRB", "WR", "TMWR", "TE", "TMTE", "PK", "TMPK", "PN", "TMPN", "DT", "DE", "TMDL", "LB", "TMLB", "CB", "S", "TMDB", "Def", "ST");
		if (mflBoxIncludeTiebreaker === undefined) var mflBoxIncludeTiebreaker = false;
		if (mflBoxShowNonStarter === undefined) var mflBoxShowNonStarter = false;
		if (mflBoxShowMFLByeTeams === undefined) var mflBoxShowMFLByeTeams = true;
		if (mflBoxHideNFLMatchups === undefined) var mflBoxHideNFLMatchups = false;
		if (mflBoxHideFantasyMatchups === undefined) var mflBoxHideFantasyMatchups = false;
		if (mflBoxHidePaceScores === undefined) var mflBoxHidePaceScores = false;
		if (precision === undefined) var precision = 0;
		if (mflBoxIsTotalPts === undefined) var mflBoxIsTotalPts = false;

		var doMFLBox = false;
		if (mflBoxHomePageOnly) {
			if (window.location.href.indexOf("/home/") > -1) doMFLBox = true;
			if (window.location.href.toUpperCase().indexOf("MODULE=") > -1) doMFLBox = false;
		} else {
			doMFLBox = true;
		}

		function initMiniDomCaches() {
			try {
				if (typeof window !== 'undefined') {
					if (!window.__mini_nodes) window.__mini_nodes = Object.create(null);
					if (!window.__mini_lists) window.__mini_lists = Object.create(null);
					if (!window.el$) window.el$ = function el$(id) {
						const cache = window.__mini_nodes;
						return cache[id] || (cache[id] = document.getElementById(id));
					};
					if (!window.els$) window.els$ = function els$(sel) {
						const cache = window.__mini_lists;
						return cache[sel] || (cache[sel] = document.querySelectorAll(sel));
					};
					if (!window.invalidateMiniQsCache) window.invalidateMiniQsCache = function () {
						try {
							for (const k in window.__mini_lists) delete window.__mini_lists[k];
							for (const k in window.__mini_nodes) delete window.__mini_nodes[k];
						} catch (_) {}
					};
				}
			} catch (_) {}
		}

		function initMiniOnce() {
			try {
				if (typeof window !== 'undefined') {
					if (!window.__mini_once) window.__mini_once = new Set();
					if (!window.addHeadStyleOnce) window.addHeadStyleOnce = function (key, cssText) {
						try {
							if (window.__mini_once.has(key)) return;
							window.__mini_once.add(key);
							const s = document.createElement('style');
							s.textContent = cssText;
							document.head.appendChild(s);
						} catch (_) {}
					};
				}
			} catch (_) {}
		}

		if (doMFLBox) {
			initMiniDomCaches();
			initMiniOnce();
		}

		if (doMFLBox) {
			if (!document.getElementById("MFLBoxWrapper")) document.write('<div id="MFLBoxWrapper"></div>'); //EARLY VERSIONS DID NOT INCLUDE HTML SO WE NEED TO WRITE IT IF IT DOESN'T EXIST
			jQuery("#MFLBoxWrapper").html('<div id="MFLBoxContainer"></div><div id="MFLBoxPlayerDetails" style="display:none"></div><div id="MFLBoxOverlay" onclick="mflBoxPlayerDetailsClose()" style="display:none"></div>');
			addHeadStyleOnce('css-b31e9c4a', '#MFLBoxContainer .MFLGameLinks .matchupLolite{border-right:0.375rem solid transparent}#MFLBoxContainer .MFLGameLinks .matchupLolite:last-child{border-right:0}#MFLBoxWrapper .MFLBoxPlayerDetailsTR[onclick*="BYE"]:hover,#MFLBoxWrapper .MFLBoxPlayerDetailsTR[onclick*="AVG"]:hover{background:none!important;cursor:default!important}#MFLBoxWrapper{margin:0.625rem auto}#MFLBoxContainer .MFLGameLinks{width:auto;margin:0 auto;}#MFLBoxContainer .MFLGameLinks tr{height:1.688rem}#MFLBoxContainer .MFLGameLinks .MFLLiveTeam,#MFLBoxContainer .MFLGameLinks .MFLNFLLiveTeam{width:100%}#MFLBoxContainer .MFLGameLinks .MFLPaceScore{font-size:80%;font-style:italic;padding:0 0.313rem;padding:0 .313rem}#MFLBoxContainer .MFLGameLinks .nflicon{height:1.5rem;height:1.5rem;width:auto}#MFLBoxContainer .MFLGameLinks .MFLLiveScore,#MFLBoxContainer .MFLGameLinks .MFLNFLLiveScore{font-weight:700}#MFLBoxContainer .MFLBoxNav .MFLGameLinks td{font-size:0.625rem;text-transform:uppercase;text-align:center}#MFLBoxContainer .MFLGameTable{white-space:nowrap;border:0;padding:0 0.125rem;border-radius:0.188rem;min-width:auto;border-spacing:0;min-width:8.125rem}#MFLBoxMatchups td.matchupLolite:nth-child(1) .MFLGameTable{border-left:0}#MFLBoxContainer .matchupLolite,#MFLBoxContainer .matchupHilite{cursor:default;margin-bottom:0.188rem}#MFLBoxContainer .MFLLiveTeam img{max-height:0.938rem}#MFLBoxContainer .MFLLiveClock,#MFLBoxContainer .MFLNFLLiveClock{text-align:center}#MFLBoxContainer .MFLLiveScore,#MFLBoxContainer .MFLNFLLiveScore{text-align:right}#MFLBoxContainer .MFLExtrasPMR,#MFLBoxContainer .MFLExtrasCP,#MFLBoxContainer .MFLExtrasYTP{text-align:center;font-size:smaller;display:none}#MFLBoxContainer .MFLBoxDetailsArrow{position:absolute;bottom:0.375rem;right:0.125rem;cursor:pointer}.MFLBoxArrowRight:before{content:"\\f054";font-family:"Font Awesome 6 Pro";position:absolute;right:0.125rem;top:2.875rem;font-size:1.875rem;cursor:pointer}.MFLBoxArrowLeft:before{content:"\\f053";font-family:"Font Awesome 6 Pro";position:absolute;right:0.313rem;top:0.375rem;font-size:1.875rem;cursor:pointer}.MFLBoxArrowLeft.MFLBoxArrowFaded:before,.MFLBoxArrowRight.MFLBoxArrowFaded:before{cursor:default;opacity:.4}.mflBoxButtonFaded{opacity:.5}#MFLBoxOverlay{display:none;height:100%;left:0;opacity:.7;position:fixed;top:0;width:100%;z-index:99999;background-color:#000}#MFLBoxWrapper .MFLBoxPlayerDetailsClose{position:absolute;z-index:1;cursor:pointer;text-align:center;font-weight:700;padding:0;right:0.75rem;top:0.938rem;height:1.375rem;width:1.375rem;line-height:1.4;border-radius:0.188rem;border-radius:.188rem;font-family:"Open Sans",sans-serif;font-size:0.813rem;font-size:.813rem;opacity:.6}#MFLBoxWrapper .MFLBoxPlayerDetailsClose:hover{opacity:1}#MFLBoxWrapper .MFLBoxPlayerDetailsNone{text-align:center;font-style:italic}#MFLBoxWrapper #MFLBoxPlayerDetails{position:fixed;z-index:100000;overflow-y:auto;-webkit-overflow-scrolling:touch;border-radius:0.188rem;padding:0.625rem;width:90%;max-width:28.125rem;height:80%;max-height:25rem;overflow-y: auto;left: 0!important;right: 0!important;top: 0!important;bottom: 0!important;margin: auto;}#MFLBoxWrapper .MFLBoxPlayerDetailsTR:hover{cursor:pointer}#MFLBoxWrapper #MFLBoxPlayerDetails td{font-size:small;}#MFLBoxWrapper #MFLBoxPlayerDetails .MFLPaceScore{font-style:italic}#MFLBoxWrapper #MFLBoxPlayerDetailsTable{padding:0.25rem}#MFLBoxWrapper .MFLBoxLiveStatsScore{cursor:pointer}#MFLBoxWrapper .MFLBoxLiveStatsWrapper{position:relative}#MFLBoxWrapper .MFLBoxLiveStatsContent{position:absolute;right:1.875rem;top:-3.25rem;cursor:default;padding:0.625rem 0.875rem 0.625rem 0.5rem;border-radius:0.313rem;font-weight:700;width:12.5rem;text-align:center;white-space:pre-wrap}#MFLBoxWrapper .MFLBoxLiveStatsClose{position:absolute;right:0.188rem;top:0.188rem;cursor:pointer;font-weight:700}#MFLBoxWrapper #MFLBoxContainer{position:relative;margin:0.625rem 0;margin-top:0}#MFLBoxWrapper #MFLBoxMatchups{min-height:5.313rem;border:0.188rem solid transparent;overflow-y:hidden}#MFLBoxWrapper #MFLBoxMatchups div.warning{line-height:5.188rem;margin:0!important;padding:0!important;border-radius:0.188rem;display:table;width:100%}#MFLBoxWrapper #MFLBoxContainer input[type="button"]{padding:0.188rem;margin:0;font-weight:400;font-size:0.875rem;opacity:1}#MFLBoxWrapper #MFLBoxContainer .matchupAllPlay{cursor:pointer}#MFLBoxWrapper .MFLNFLBoxContainer{overflow:auto;width:auto!important;margin-left:2.188rem;margin-right:1.875rem;-webkit-overflow-scrolling:touch}#MFLBoxWrapper .MFLBoxMFLNFL{position:absolute;top:0.125rem;width:auto;margin-left:-1.563rem;width:2.813rem}.MFLLiveTeam{min-width:3.75rem}#MFLBoxWrapper .downDistance{font-size:0.563rem;font-style:italic}#MFLBoxWrapper .possession:before{background-image:url(https://www.mflscripts.com/ImageDirectory/script-images/football.svg)}#MFLBoxWrapper .redzone:before{background-image:url(https://www.mflscripts.com/ImageDirectory/script-images/goal-post.svg)}#MFLBoxWrapper .possession,#MFLBoxWrapper .redzone{position:relative;padding-left:0.875rem}#MFLBoxWrapper .possession:before,#MFLBoxWrapper .redzone:before{content: "";background-size:0.75rem 0.75rem;height:0.75rem;width:0.75rem;position:absolute;top:50%;transform:translateY(-50%);left:0}#MFLBoxWrapper .redzone{background-image:none;padding-right:0}@media only screen and (max-width: 38em){#MFLBoxWrapper #MFLBoxPlayerDetails td,#MFLBoxWrapper #MFLBoxPlayerDetails th{font-size:0.688rem}}@media only screen and (max-width: 22em){#MFLBoxWrapper #MFLBoxPlayerDetails td,#MFLBoxWrapper #MFLBoxPlayerDetails th{font-size:0.563rem}}');
			jQuery("#MFLBoxContainer").append('<div class="MFLBoxNav MFLBoxArrowLeft MFLBoxArrowFaded" onclick="mflBoxNewWeek(-1)" style="left:0;"></div>');
			jQuery("#MFLBoxContainer").append('<div class="MFLBoxNav MFLBoxMFLNFL" style="left:1.125rem;"><table class="MFLGameLinks"><tbody><tr><td id="MFLBoxMFLCell" class="mflBoxCell"><span class="form_buttons"><input id="mflBoxButtonMFL" class="mflBoxButton" onclick="mflBoxMFLSchedule=true;jQuery(\'#mflBoxButtonMFL\').attr(\'style\',\'cursor:default\');jQuery(\'#mflBoxButtonNFL\').attr(\'style\',\'cursor:pointer\');jQuery(\'#mflBoxButtonMFL\').removeClass(\'mflBoxButtonFaded\');jQuery(\'#mflBoxButtonNFL\').addClass(\'mflBoxButtonFaded\');mflBoxNewWeek(0);" style="cursor:default" type="button" value="MFL"></span></td></tr><tr><td id="MFLBoxWeekCell"></td></tr><tr><td id="MFLBoxNFLCell" class="mflBoxCell mflBoxCellInactive"><span class="form_buttons"><input id="mflBoxButtonNFL" class="mflBoxButton mflBoxButtonFaded" onclick="mflBoxMFLSchedule=false;jQuery(\'#mflBoxButtonNFL\').attr(\'style\',\'cursor:default\');jQuery(\'#mflBoxButtonMFL\').attr(\'style\',\'cursor:pointer\');jQuery(\'#mflBoxButtonMFL\').addClass(\'mflBoxButtonFaded\');jQuery(\'#mflBoxButtonNFL\').removeClass(\'mflBoxButtonFaded\');mflBoxNewWeek(0);" type="button" value="NFL"></span></td></tr></tbody></table></div>');
			jQuery("#MFLBoxContainer").append('<div id="MFLBoxMatchups" class="report MFLNFLBoxContainer"><div class="warning" style="padding:0.938rem;font-weight:bold;vertical-align:middle;text-align:center;font-style:italic;font-size:1.125rem">Retrieving Scoreboard . . . </div></div>');
			jQuery("#MFLBoxContainer").append('<div class="MFLBoxNav MFLBoxArrowRight" onclick="mflBoxNewWeek(1)"></div>');
		} else {
			jQuery("#MFLBoxWrapper").remove();
		}
		jQuery('.mobile-wrap #MFLBoxWrapper').unwrap();

		//SETUP MINI-BOXSCORE GLOBAL VARS
		var mflBoxJSON_league;
		var mflBox_byeWeek = [];
		var mflBoxJSON_matchups;
		var mflBoxJSON_nflSchedule;
		var mflBoxJSON_projectedScores = [];
		var mflBoxJSON_projectedScoresWeek = [];
		var mflBox_league = [];
		var mflBox_matchups = [];
		var mflBox_nflSchedule = [];
		var mflBox_nflOpponents = [];
		var mflBox_players = [];
		var mflBoxStartWeek;
		var mflBoxLastRegularSeasonWeek;
		var mflBoxEndWeek;
		var mflBoxMFLSchedule = true;
		var mflBoxStarters = leagueAttributes['MaxStarters'];
		var mflBoxCurrentWeekKickoff = 0;
		var mflBoxActiveWeekKickoff = 0;
		var mflBoxCurrentWeek = completedWeek;
		var mflBoxCurrentLiveScoring = false;
		var mflBoxActiveWeek;
		var mflBoxHasNextFantasyWeek = false;
		var mflBoxHasNextNFLWeek = false;
		var mflBoxIsAllPlay = false;
		var mflBoxAllPlayId = "0001";
		var mflBoxDetailsTracker = [];
		var mflBoxFirstKickoff = [];
		var mflBoxNFLKickoff = [];
		var mflBoxFranchise = [];
		var mflBoxPlayerDetailsFid = ({
			"fid": '',
			boxid: 0
		});
		var mflBoxPlayerProjected = [];
		var mflBoxLiveStatsPlayer = [];
		var mflBoxLiveStatsTeam = [];
		var mflBoxTiebreaker = [];
		if (typeof franchise_id !== "undefined")
			if (franchise_id !== "0000") mflBoxAllPlayId = franchise_id;
		var mflBoxWeekDay = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
		var mflBoxMonth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		var mflBoxNflGameStatus = [];

		///////////////////////////////////////////////////////////////////////////////////////////////////
		//
		//                              MINI-BOXSCORE CUSTOM FUNCTIONS
		//
		///////////////////////////////////////////////////////////////////////////////////////////////////

		function doMFLBoxFantasyWeek() {
			if (!mflBoxMFLSchedule) return;

			// same as old version
			mflBoxJSON_matchups = [];

			if (mflBoxActiveWeek === mflBoxCurrentWeek && liveScoringWeek > completedWeek && !liveScoringLiveWeek?.error) {
				if (mflBoxCurrentLiveScoring) {
					// LIVE PATH -> use cached liveScoringLiveWeek instead of fetch
					return Promise.resolve().then(() => {
						// fall back to empty object if cache isn't there yet
						const data = liveScoringLiveWeek || {};

						// ---- this block is identical to your old fetch-based code ----
						if (data.liveScoring?.matchup) {
							if (data.liveScoring.matchup.franchise) {
								// single matchup object
								mflBoxJSON_matchups.matchup = [data.liveScoring.matchup];
							} else {
								// already an array
								mflBoxJSON_matchups.matchup = data.liveScoring.matchup;
							}
						}
						if (data.liveScoring?.franchise) {
							if (data.liveScoring?.id) {
								// single franchise object
								mflBoxJSON_matchups.franchise = [data.liveScoring.franchise];
							} else {
								// already an array
								mflBoxJSON_matchups.franchise = data.liveScoring.franchise;
							}
						}
						if (mflBoxIncludeTiebreaker) {
							const thisBoxWeek = Math.min(mflBoxActiveWeek, endWeek);
							const prop = `w_${thisBoxWeek}`;
							const data2 = reportWeeklyResults_ar[prop];
							try {
								mflBoxPopulateTiebreaker(data2.weeklyResults);
							} catch {}
						}
						// optional: return the object if you want to `await` this
						return mflBoxJSON_matchups;
					}).catch(err => {
						console.log('Error:', err);
					});
				} else {
					// cached weeklyResults path -> wrap in resolved Promise (unchanged)
					return Promise.resolve().then(() => {
						const thisBoxWeek = Math.min(mflBoxActiveWeek, endWeek);
						const prop = `w_${thisBoxWeek}`;
						const data = reportWeeklyResults_ar[prop];
						try {
							mflBoxJSON_matchups = data.weeklyResults;
						} catch {}
						return mflBoxJSON_matchups;
					});
				}
			} else {
				// not current live week -> wrap in resolved Promise (unchanged)
				return Promise.resolve().then(() => {
					const thisBoxWeek = Math.min(mflBoxActiveWeek, endWeek);
					const prop = `w_${thisBoxWeek}`;
					const data = reportWeeklyResults_ar[prop];
					try {
						mflBoxJSON_matchups = data.weeklyResults;
					} catch {}
					return mflBoxJSON_matchups;
				});
			}
		}

		function mflBoxCheckWeeklyResultsForScore(week) {
			// pick the week: passed-in > active, cap at endWeek
			const wk = Math.min(Number(week ?? mflBoxActiveWeek) || 0, endWeek);
			const key = "w_" + wk;

			// safely read weeklyResults blob
			const weekly = reportWeeklyResults_ar?.[key]?.weeklyResults;
			if (!weekly || !weekly.matchup) return false;

			// normalize matchup(s) and franchise(s)
			const matchups = Array.isArray(weekly.matchup) ? weekly.matchup : [weekly.matchup];
			for (const m of matchups) {
				const frs = Array.isArray(m?.franchise) ? m.franchise : (m?.franchise ? [m.franchise] : []);
				for (const f of frs) {
					const n = Number(f?.score);
					if (!Number.isNaN(n) && n > 0) return true; // found posted score
				}
			}
			return false; // no scores yet
		}

		function doMFLBoxNFLWeek() {
			//console.log("doMFLBoxNFLWeek ran");
			return Promise.resolve().then(() => {
				const prop = `w_${mflBoxActiveWeek}`;
				mflBoxJSON_nflSchedule = reportNflSchedule_ar[prop].nflSchedule;
				doMFLBoxNFLWeek_response(mflBoxJSON_nflSchedule);
			});
		}

		function doMFLBoxNFLWeek_response(response) {
			//console.log("doMFLBoxNFLWeek_response ran");
			mflBoxNflGameStatus = [];
			var matchup = [];

			// Normalize: some feeds use a single matchup object, some an array
			if (response.matchup && response.matchup.hasOwnProperty('team')) {
				matchup[0] = response.matchup;
			} else {
				matchup = response.matchup || [];
			}

			for (var i = 0; i < matchup.length; i++) {
				var game = matchup[i];
				if (!game || !game.team || game.team.length < 2) continue;

				var road = game.team[0];
				var home = game.team[1];

				var roadId = road.id;
				var homeId = home.id;

				var kickoff = parseInt(game.kickoff, 10) || 0;

				// Scores are strings in the JSON â€“ convert to numbers if present
				var roadScore = (typeof road.score !== 'undefined') ? parseInt(road.score, 10) : null;
				var homeScore = (typeof home.score !== 'undefined') ? parseInt(home.score, 10) : null;

				mflBoxNflGameStatus[roadId] = {
					time: kickoff,
					isHome: false,
					isBye: false,
					score: roadScore
				};

				mflBoxNflGameStatus[homeId] = {
					time: kickoff,
					isHome: true,
					isBye: false,
					score: homeScore
				};
			}

			//console.log(mflBoxNflGameStatus);
		}

		function doMFLBoxProjectedScores() {
			if (
				!(mflBoxCurrentWeek >= mflBoxActiveWeek &&
					!mflBoxHideFantasyMatchups &&
					mflBoxMFLSchedule)
			) {
				return Promise.resolve(); // silently exit
			}
			return Promise.resolve().then(() => {
				const prop = `w_${mflBoxActiveWeek}`;

				if (mflBoxJSON_projectedScoresWeek.hasOwnProperty(prop)) {
					mflBoxJSON_projectedScores = mflBoxJSON_projectedScoresWeek[prop];
				} else {
					try {
						mflBoxJSON_projectedScoresWeek[prop] = reportProjectedScores_ar[prop];
						mflBoxJSON_projectedScores = reportProjectedScores_ar[prop];
					} catch (error) {
						console.error('Error:', error);
					}
				}
			});
		}

		function doNFLBoxArrays() {
			//reset each time
			mflBox_players = [];
			mflBox_player_fid_tracker = [];
			mflBox_matchups = [];
			mflBox_nflSchedule = [];
			mflBox_nflOpponents = [];

			//DO NFL BOXSCORE
			var matchups_ar = [];
			if (mflBoxJSON_nflSchedule.matchup.length === undefined) {
				matchups_ar.matchup = [];
				matchups_ar.matchup.push(mflBoxJSON_nflSchedule.matchup);
			} else
				matchups_ar = mflBoxJSON_nflSchedule;

			for (var j = 0; j < 3; j++) {
				for (var i = 0; i < matchups_ar.matchup.length; i++) {
					var road = matchups_ar.matchup[i].team[0];
					var home = matchups_ar.matchup[i].team[1];
					switch (j) {
						case 0:
							if (mflBoxNflGameStatus[home.id].status !== "INPROG") continue;
							break;
						case 1:
							if (mflBoxNflGameStatus[home.id].status !== "SCHED") continue;
							break;
						case 2:
							if (mflBoxNflGameStatus[home.id].status !== "OVER") continue;
							break;
					}
					//SPREAD
					if (parseFloat(road.spread) < 0) var roadSpread = parseFloat(road.spread).toFixed(1);
					else var roadSpread = "";
					if (parseFloat(home.spread) < 0) var homeSpread = parseFloat(home.spread).toFixed(1);
					else var homeSpread = "";

					if (mflBoxActiveWeek > liveScoringWeek && mflBoxActiveWeek > (completedWeek + 1)) {
						homeSpread = "";
						roadSpread = "";
					}

					mflBox_nflSchedule.push({
						"roadId": road.id,
						"homeId": home.id,
						"roadScore": mflBoxLiveStatsTeam[road.id].TPS,
						"homeScore": mflBoxLiveStatsTeam[home.id].TPS,
						"roadSpread": roadSpread,
						"homeSpread": homeSpread,
						"roadResult": mflBoxLiveStatsTeam[road.id].RES,
						"homeResult": mflBoxLiveStatsTeam[home.id].RES,
						"kickoff": mflBoxNflGameStatus[home.id].kickoff,
						"gameSecondsRemaining": mflBoxNflGameStatus[home.id].secs_left,
						"clock": mflBoxNflGameStatus[home.id].clock,
						"roadPossession": mflBoxNflGameStatus[road.id].possession,
						"roadRedzone": mflBoxNflGameStatus[road.id].redzone,
						"roadDownAndDist": mflBoxNflGameStatus[road.id].down_and_dist,
						"homePossession": mflBoxNflGameStatus[home.id].possession,
						"homeRedzone": mflBoxNflGameStatus[home.id].redzone,
						"homeDownAndDist": mflBoxNflGameStatus[home.id].down_and_dist
					});
					if (mflBoxCurrentWeekKickoff === 0) mflBoxCurrentWeekKickoff = parseInt(matchups_ar.matchup[i].kickoff);
					if (i === 0) mflBoxActiveWeekKickoff = parseInt(matchups_ar.matchup[i].kickoff);
					mflBox_nflOpponents[road.id] = ({
						"opponent": home.id,
						"isHome": false,
						"score": mflBoxLiveStatsTeam[road.id].TPS,
						"result": mflBoxLiveStatsTeam[road.id].RES
					});
					mflBox_nflOpponents[home.id] = ({
						"opponent": road.id,
						"isHome": true,
						"score": mflBoxLiveStatsTeam[home.id].TPS,
						"result": mflBoxLiveStatsTeam[home.id].RES
					});
				}
			}
			return true;
		}

		function doMFLBoxArrays() {
			//reset each time
			mflBox_players = [];
			mflBox_player_fid_tracker = []; //Avoid doubling up fid's due to double header games
			mflBox_matchups = [];
			mflBox_nflSchedule = [];
			mflBox_nflOpponents = [];
			mflBoxIsAllPlay = false;
			mflBoxFranchise = [];
			mflBoxPlayerProjected = [];

			for (var fid in reportStandingsFid_ar) {
				if (reportStandingsFid_ar.hasOwnProperty(fid)) {
					var win = "0";
					var loss = "0";
					var tie = "0";
					if (reportStandingsFid_ar[fid].hasOwnProperty("w")) win = reportStandingsFid_ar[fid].w;
					if (reportStandingsFid_ar[fid].hasOwnProperty("l")) loss = reportStandingsFid_ar[fid].l;
					if (reportStandingsFid_ar[fid].hasOwnProperty("t")) tie = reportStandingsFid_ar[fid].t;
					franchiseDatabase["fid_" + fid].record = "(" + win + "-" + loss + "-" + tie + ")";
				}
			}

			// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
			// SAFETY: Normalize/guard mflBoxJSON_matchups
			// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
			var hasMatchupBlob =
				mflBoxJSON_matchups &&
				typeof mflBoxJSON_matchups === "object" &&
				(
					mflBoxJSON_matchups.hasOwnProperty("matchup") ||
					mflBoxJSON_matchups.hasOwnProperty("franchise")
				);

			// If there's no usable matchup data at all, we skip fantasy matchups entirely.
			// mflBox_matchups stays [], and we still build NFL part below (if schedule exists).
			if (!hasMatchupBlob) {
				// nothing to do on fantasy side
			} else if (mflBoxJSON_matchups.hasOwnProperty("matchup")) { //MATCH UP EXISTS BUT IT MAY ONLY BE ONE
				var matchup_ar = [];
				if (mflBoxJSON_matchups.matchup.hasOwnProperty("franchise"))
					matchup_ar.push(mflBoxJSON_matchups.matchup);
				else
					matchup_ar = mflBoxJSON_matchups.matchup;

				for (var i = 0; i < matchup_ar.length; i++) {
					var road = matchup_ar[i].franchise[0];
					var home = matchup_ar[i].franchise[1];
					mflBox_matchups[i] = ({
						"roadId": road.id,
						"homeId": home.id,
						"roadScore": road.score,
						"homeScore": home.score,
						"roadProjected": 0,
						"homeProjected": 0,
						"roadYetToPlay": 0,
						"homeYetToPlay": 0,
						"roadCurrentlyPlaying": 0,
						"homeCurrentlyPlaying": 0,
						"roadPlayerMinutesRemaining": 0,
						"homePlayerMinutesRemaining": 0
					});
					//SPREAD IS FROM WEEKLY RESULTS ONLY
					mflBox_matchups[i].roadSpread = "";
					mflBox_matchups[i].homeSpread = "";
					if (road.spread !== undefined) {
						if (parseFloat(road.spread) < 0) mflBox_matchups[i].roadSpread = parseFloat(road.spread).toFixed(1);
					}
					if (home.spread !== undefined) {
						if (parseFloat(home.spread) < 0) mflBox_matchups[i].homeSpread = parseFloat(home.spread).toFixed(1);
					}
					if (mflBoxActiveWeek > liveScoringWeek && mflBoxActiveWeek > (completedWeek + 1)) {
						mflBox_matchups[i].roadSpread = "";
						mflBox_matchups[i].homeSpread = "";
					}
					//RESULT IS FROM WEEKLY RESULTS ONLY
					mflBox_matchups[i].roadResult = "";
					mflBox_matchups[i].homeResult = "";
					if (road.result !== undefined) mflBox_matchups[i].roadResult = road.result;
					if (home.result !== undefined) mflBox_matchups[i].homeResult = home.result;
					//STARTERS IS FROM WEEKLY RESULTS ONLY
					mflBox_matchups[i].roadStarters = "";
					mflBox_matchups[i].homeStarters = "";
					if (road.hasOwnProperty('starters'))
						if (road.starters !== undefined) mflBox_matchups[i].roadStarters = road.starters;
					if (home.hasOwnProperty('starters'))
						if (home.starters !== undefined) mflBox_matchups[i].homeStarters = home.starters;
					try { //IF LIVE SCORING WANT TO GET PLAYER DETAILS AND GAME SECONDS REMAINING
						mflBox_matchups[i].roadYetToPlay = parseInt(matchup_ar[i].franchise[0].playersYetToPlay);
						mflBox_matchups[i].homeYetToPlay = parseInt(matchup_ar[i].franchise[1].playersYetToPlay);
						mflBox_matchups[i].roadCurrentlyPlaying = parseInt(matchup_ar[i].franchise[0].playersCurrentlyPlaying);
						mflBox_matchups[i].homeCurrentlyPlaying = parseInt(matchup_ar[i].franchise[1].playersCurrentlyPlaying);
						mflBox_matchups[i].roadPlayerMinutesRemaining = parseInt(parseInt(matchup_ar[i].franchise[0].gameSecondsRemaining) / 60 + 0.99); //round up;
						mflBox_matchups[i].homePlayerMinutesRemaining = parseInt(parseInt(matchup_ar[i].franchise[1].gameSecondsRemaining) / 60 + 0.99); //round up;
						if (matchup_ar[i].franchise[0].players.hasOwnProperty("player")) {
							for (var j = 0; j < matchup_ar[i].franchise[0].players.player.length; j++) {
								var player = matchup_ar[i].franchise[0].players.player[j];
								if (player.status === "starter") var isStarter = "1";
								else isStarter = "0";
								if (mflBox_players["pid_" + player.id] === undefined) {
									mflBox_players["pid_" + player.id] = ({
										"id": player.id,
										"fid": road.id,
										"score": player.score,
										"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
										"isStarter": isStarter
									});
									mflBox_player_fid_tracker[player.id + "_" + road.id] = 1;
								} else {
									if (mflBox_player_fid_tracker[player.id + "_" + road.id] === undefined) {
										mflBox_players["pid_" + player.id].fid += "," + road.id;
										mflBox_players["pid_" + player.id].isStarter += "," + isStarter;
										mflBox_player_fid_tracker[player.id + "_" + road.id] = 1;
									}
								}
								if (isStarter === "1") {
									try { //calculate earliest kickoff for road franchise id
										if (mflBoxFirstKickoff[matchup_ar[i].franchise[0].id] === undefined) {
											if (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) mflBoxFirstKickoff[matchup_ar[i].franchise[0].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
										} else if ((mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] < mflBoxFirstKickoff[matchup_ar[i].franchise[0].id])) mflBoxFirstKickoff[matchup_ar[i].franchise[0].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
									} catch (er) {
										console.log("error road");
									}
								}
								//CREATE FRANCHISE PLAYERS (ROAD)
								if (mflBoxFranchise["fid_" + road.id] === undefined) mflBoxFranchise["fid_" + road.id] = ({
									"starter": [],
									"bench": [],
									"tiebreaker": []
								});
								if (player.status === "starter") mflBoxFranchise["fid_" + road.id].starter[player.id] = ({
									"score": player.score,
									"gsr": player.gameSecondsRemaining
								});
								if (player.status === "nonstarter") mflBoxFranchise["fid_" + road.id].bench[player.id] = ({
									"score": player.score,
									"gsr": player.gameSecondsRemaining
								});
							}
						}
						if (matchup_ar[i].franchise[1].players.hasOwnProperty("player")) {
							for (var j = 0; j < matchup_ar[i].franchise[1].players.player.length; j++) {
								var player = matchup_ar[i].franchise[1].players.player[j];
								if (player.status === "starter") var isStarter = "1";
								else isStarter = "0";
								if (mflBox_players["pid_" + player.id] === undefined) {
									mflBox_players["pid_" + player.id] = ({
										"id": player.id,
										"fid": home.id,
										"score": player.score,
										"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
										"isStarter": isStarter
									})
									mflBox_player_fid_tracker[player.id + "_" + home.id] = 1;
								} else {
									if (mflBox_player_fid_tracker[player.id + "_" + home.id] === undefined) {
										mflBox_players["pid_" + player.id].fid += "," + home.id;
										mflBox_players["pid_" + player.id].isStarter += "," + isStarter;
										mflBox_player_fid_tracker[player.id + "_" + home.id] = 1;
									}
								}
								if (isStarter === "1") {
									try { //calculate earliest kickoff for home franchise id
										if (mflBoxFirstKickoff[matchup_ar[i].franchise[1].id] === undefined) {
											if (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) mflBoxFirstKickoff[matchup_ar[i].franchise[1].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
										} else if ((mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] < mflBoxFirstKickoff[matchup_ar[i].franchise[1].id])) mflBoxFirstKickoff[matchup_ar[i].franchise[1].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
									} catch (er) {
										console.log("error home");
									}
								}
								//CREATE FRANCHISE PLAYER (HOME)
								if (mflBoxFranchise["fid_" + home.id] === undefined) mflBoxFranchise["fid_" + home.id] = ({
									"starter": [],
									"bench": [],
									"tiebreaker": []
								});
								if (player.status === "starter") mflBoxFranchise["fid_" + home.id].starter[player.id] = ({
									"score": player.score,
									"gsr": player.gameSecondsRemaining
								});
								if (player.status === "nonstarter") mflBoxFranchise["fid_" + home.id].bench[player.id] = ({
									"score": player.score,
									"gsr": player.gameSecondsRemaining
								});
							}
						}
					} catch (er) { //MUST BE COMPLETED WEEK BUT WE STILL WANT THIS INFO
						try {
							if (mflBoxActiveWeek <= completedWeek) {
								var road = matchup_ar[i].franchise[0];
								var home = matchup_ar[i].franchise[1];
								try {
									for (var m = 0; m < matchup_ar[i].franchise[0].player.length; m++) {
										var player = matchup_ar[i].franchise[0].player[m];
										//CREATE FRANCHISE PLAYER (ROAD)
										if (mflBoxFranchise["fid_" + road.id] === undefined) mflBoxFranchise["fid_" + road.id] = ({
											"starter": [],
											"bench": [],
											"tiebreaker": []
										});
										if (player.status === "starter") mflBoxFranchise["fid_" + road.id].starter[player.id] = ({
											"score": player.score,
											"gsr": 0
										});
										if (player.status === "nonstarter") mflBoxFranchise["fid_" + road.id].bench[player.id] = ({
											"score": player.score,
											"gsr": 0
										});
									}
								} catch (er) {}
								try {
									for (var m = 0; m < matchup_ar[i].franchise[1].player.length; m++) {
										var player = matchup_ar[i].franchise[1].player[m];
										//CREATE FRANCHISE PLAYER (HOME)
										if (mflBoxFranchise["fid_" + home.id] === undefined) mflBoxFranchise["fid_" + home.id] = ({
											"starter": [],
											"bench": [],
											"tiebreaker": []
										});
										if (player.status === "starter") mflBoxFranchise["fid_" + home.id].starter[player.id] = ({
											"score": player.score,
											"gsr": 0
										});
										if (player.status === "nonstarter") mflBoxFranchise["fid_" + home.id].bench[player.id] = ({
											"score": player.score,
											"gsr": 0
										});
									}
								} catch (er) {}
							}
						} catch (er) {}
					}
				}
			} else if (mflBoxJSON_matchups && mflBoxJSON_matchups.franchise && mflBoxJSON_matchups.franchise.length) {
				// SETUP ALL PLAY SINCE NO MATCHUPS
				mflBoxIsAllPlay = true;
				var home = null;
				for (var i = 0; i < mflBoxJSON_matchups.franchise.length; i++) {
					if (mflBoxAllPlayId === mflBoxJSON_matchups.franchise[i].id) {
						home = mflBoxJSON_matchups.franchise[i];
						break;
					}
				}
				// If we somehow didn't find a home franchise, abort all-play safely
				if (home) {
					var matchupCount = 0;
					for (var i = 0; i < mflBoxJSON_matchups.franchise.length; i++) {
						if (mflBoxAllPlayId !== mflBoxJSON_matchups.franchise[i].id) {
							var road = mflBoxJSON_matchups.franchise[i];
							mflBox_matchups[matchupCount] = ({
								"roadId": road.id,
								"homeId": home.id,
								"roadScore": road.score,
								"homeScore": home.score,
								"roadProjected": 0,
								"homeProjected": 0,
								"roadYetToPlay": 0,
								"homeYetToPlay": 0,
								"roadCurrentlyPlaying": 0,
								"homeCurrentlyPlaying": 0,
								"roadPlayerMinutesRemaining": 0,
								"homePlayerMinutesRemaining": 0
							});
							//SPREAD IS FROM WEEKLY RESULTS ONLY
							mflBox_matchups[matchupCount].roadSpread = "";
							mflBox_matchups[matchupCount].homeSpread = "";
							//RESULT IS FROM WEEKLY RESULTS ONLY
							mflBox_matchups[matchupCount].roadResult = "";
							mflBox_matchups[matchupCount].homeResult = "";
							if (mflBoxActiveWeek <= completedWeek) {
								if (parseFloat(road.score) > parseFloat(home.score)) mflBox_matchups[matchupCount].roadResult = "W";
								if (parseFloat(home.score) > parseFloat(road.score)) mflBox_matchups[matchupCount].homeResult = "W";
							}
							mflBox_matchups[matchupCount].roadYetToPlay = parseInt(road.playersYetToPlay);
							mflBox_matchups[matchupCount].homeYetToPlay = parseInt(home.playersYetToPlay);
							mflBox_matchups[matchupCount].roadCurrentlyPlaying = parseInt(road.playersCurrentlyPlaying);
							mflBox_matchups[matchupCount].homeCurrentlyPlaying = parseInt(home.playersCurrentlyPlaying);
							mflBox_matchups[matchupCount].roadPlayerMinutesRemaining = parseInt(parseInt(road.gameSecondsRemaining) / 60 + 0.99) //round up;
							mflBox_matchups[matchupCount].homePlayerMinutesRemaining = parseInt(parseInt(home.gameSecondsRemaining) / 60 + 0.99) //round up;
							matchupCount++;
						}
						try { //IF LIVE SCORING WANT TO GET PLAYER DETAILS AND GAME SECONDS REMAINING
							for (var j = 0; j < mflBoxJSON_matchups.franchise[i].players.player.length; j++) {
								var road = mflBoxJSON_matchups.franchise[i];
								var player = mflBoxJSON_matchups.franchise[i].players.player[j];
								if (player.status === "starter") var isStarter = "1";
								else isStarter = "0";
								if (mflBox_players["pid_" + player.id] === undefined) {
									mflBox_players["pid_" + player.id] = ({
										"id": player.id,
										"fid": road.id,
										"score": player.score,
										"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
										"isStarter": isStarter
									});
									mflBox_player_fid_tracker[player.id + "_" + road.id] = 1;
								} else {
									if (mflBox_player_fid_tracker[player.id + "_" + road.id] === undefined) {
										mflBox_players["pid_" + player.id].fid += "," + road.id;
										mflBox_players["pid_" + player.id].isStarter += "," + isStarter;
										mflBox_player_fid_tracker[player.id + "_" + road.id] = 1;
									}
								}
								if (isStarter === "1") {
									try { //calculate earliest kickoff for road franchise id
										if (mflBoxFirstKickoff[mflBoxJSON_matchups.franchise[i].id] === undefined) {
											if (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) mflBoxFirstKickoff[mflBoxJSON_matchups.franchise[i].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
										} else if ((mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] < mflBoxFirstKickoff[mflBoxJSON_matchups.franchise[i].id])) mflBoxFirstKickoff[mflBoxJSON_matchups.franchise[i].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
									} catch (er) {}
								}
								//CREATE FRANCHISE PLAYERS (ROAD)
								if (mflBoxFranchise["fid_" + road.id] === undefined) mflBoxFranchise["fid_" + road.id] = ({
									"starter": [],
									"bench": [],
									"tiebreaker": []
								});
								if (player.status === "starter") mflBoxFranchise["fid_" + road.id].starter[player.id] = ({
									"score": player.score,
									"gsr": player.gameSecondsRemaining
								});
								if (player.status === "nonstarter") mflBoxFranchise["fid_" + road.id].bench[player.id] = ({
									"score": player.score,
									"gsr": player.gameSecondsRemaining
								});
							}
						} catch (er) { //MUST BE COMPLETED WEEK BUT WE STILL WANT THIS INFO
							try {
								if (mflBoxActiveWeek <= completedWeek) {
									var road = mflBoxJSON_matchups.franchise[i];
									for (var m = 0; m < mflBoxJSON_matchups.franchise[i].player.length; m++) {
										var player = mflBoxJSON_matchups.franchise[i].player[m];
										//CREATE FRANCHISE PLAYER (ROAD)
										if (mflBoxFranchise["fid_" + road.id] === undefined) mflBoxFranchise["fid_" + road.id] = ({
											"starter": [],
											"bench": [],
											"tiebreaker": []
										});
										if (player.status === "starter") mflBoxFranchise["fid_" + road.id].starter[player.id] = ({
											"score": player.score,
											"gsr": 0
										});
										if (player.status === "nonstarter") mflBoxFranchise["fid_" + road.id].bench[player.id] = ({
											"score": player.score,
											"gsr": 0
										});
									}
								}
							} catch (er) {}
						}
					}
					//SORT ALL PLAY
					mflBox_matchups.sort(function (a, b) {
						if (parseFloat(a.roadScore) < parseFloat(b.roadScore)) return 1;
						if (parseFloat(a.roadScore) > parseFloat(b.roadScore)) return -1;
						return 0;
					});
				}
			}

			//CHECK IF IS NOT ALL PLAY AND IF TO DISPLAY BYE WEEK TEAM(S) AND IF AT LEAST ONE TEAM IS ON BYE
			if (
				!mflBoxIsAllPlay &&
				mflBoxShowMFLByeTeams &&
				mflBoxJSON_matchups &&
				mflBoxJSON_matchups.hasOwnProperty("franchise")
			) {
				if (mflBoxJSON_matchups.franchise.hasOwnProperty("id")) { //ONLY ONE BYE WEEK TEAM
					var temp_matchups = [];
					temp_matchups.franchise = [];
					temp_matchups.franchise.push(mflBoxJSON_matchups.franchise);
				} else {
					var temp_matchups = mflBoxJSON_matchups;
				}
				for (var i = 0; i < temp_matchups.franchise.length; i++) {
					var matchupCount = mflBox_matchups.length;

					var road = temp_matchups.franchise[i];
					mflBox_matchups[matchupCount] = ({
						"roadId": road.id,
						"homeId": "BYE",
						"roadScore": road.score,
						"homeScore": 0,
						"roadProjected": 0,
						"homeProjected": 0,
						"roadYetToPlay": 0,
						"homeYetToPlay": 0,
						"roadCurrentlyPlaying": 0,
						"homeCurrentlyPlaying": 0,
						"roadPlayerMinutesRemaining": 0,
						"homePlayerMinutesRemaining": 0
					});
					//SPREAD IS FROM WEEKLY RESULTS ONLY
					mflBox_matchups[matchupCount].roadSpread = "";
					mflBox_matchups[matchupCount].homeSpread = "";
					//RESULT IS FROM WEEKLY RESULTS ONLY
					mflBox_matchups[matchupCount].roadResult = "";
					mflBox_matchups[matchupCount].homeResult = "";
					mflBox_matchups[matchupCount].roadYetToPlay = parseInt(road.playersYetToPlay);
					mflBox_matchups[matchupCount].homeYetToPlay = 0;
					mflBox_matchups[matchupCount].roadCurrentlyPlaying = parseInt(road.playersCurrentlyPlaying);
					mflBox_matchups[matchupCount].homeCurrentlyPlaying = 0;
					mflBox_matchups[matchupCount].roadPlayerMinutesRemaining = parseInt(parseInt(road.gameSecondsRemaining) / 60 + 0.99) //round up;
					mflBox_matchups[matchupCount].homePlayerMinutesRemaining = 0;
					matchupCount++;

					try { //IF LIVE SCORING WANT TO GET PLAYER DETAILS AND GAME SECONDS REMAINING
						for (var j = 0; j < temp_matchups.franchise[i].players.player.length; j++) {
							var player = temp_matchups.franchise[i].players.player[j];
							if (player.status === "starter") var isStarter = "1";
							else isStarter = "0";
							if (mflBox_players["pid_" + player.id] === undefined) {
								mflBox_players["pid_" + player.id] = ({
									"id": player.id,
									"fid": road.id,
									"score": player.score,
									"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
									"isStarter": isStarter
								});
								mflBox_player_fid_tracker[player.id + "_" + road.id] = 1;
							} else {
								if (mflBox_player_fid_tracker[player.id + "_" + road.id] === undefined) {
									mflBox_players["pid_" + player.id].fid += "," + road.id;
									mflBox_players["pid_" + player.id].isStarter += "," + isStarter;
									mflBox_player_fid_tracker[player.id + "_" + road.id] = 1;
								}
							}
							if (isStarter === "1") {
								try { //calculate earliest kickoff for road franchise id
									if (mflBoxFirstKickoff[temp_matchups.franchise[i].id] === undefined) {
										if (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) mflBoxFirstKickoff[temp_matchups.franchise[i].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
									} else if ((mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team] < mflBoxFirstKickoff[temp_matchups.franchise[i].id])) mflBoxFirstKickoff[temp_matchups.franchise[i].id] = mflBoxNFLKickoff[playerDatabase["pid_" + player.id].team];
								} catch (er) {}
							}
							//CREATE FRANCHISE PLAYERS (ROAD)
							if (mflBoxFranchise["fid_" + road.id] === undefined) mflBoxFranchise["fid_" + road.id] = ({
								"starter": [],
								"bench": [],
								"tiebreaker": []
							});
							if (player.status === "starter") mflBoxFranchise["fid_" + road.id].starter[player.id] = ({
								"score": player.score,
								"gsr": player.gameSecondsRemaining
							});
							if (player.status === "nonstarter") mflBoxFranchise["fid_" + road.id].bench[player.id] = ({
								"score": player.score,
								"gsr": player.gameSecondsRemaining
							});
						}
					} catch (er) { //MUST BE COMPLETED WEEK BUT WE STILL WANT THIS INFO
						try {
							if (mflBoxActiveWeek <= completedWeek) {
								var road = temp_matchups.franchise[i];
								for (var m = 0; m < temp_matchups.franchise[i].player.length; m++) {
									var player = temp_matchups.franchise[i].player[m];
									//CREATE FRANCHISE PLAYER (ROAD)
									if (mflBoxFranchise["fid_" + road.id] === undefined) mflBoxFranchise["fid_" + road.id] = ({
										"starter": [],
										"bench": [],
										"tiebreaker": []
									});
									if (player.status === "starter") mflBoxFranchise["fid_" + road.id].starter[player.id] = ({
										"score": player.score,
										"gsr": 0
									});
									if (player.status === "nonstarter") mflBoxFranchise["fid_" + road.id].bench[player.id] = ({
										"score": player.score,
										"gsr": 0
									});
								}
							}
						} catch (er) {}
					}
				}
			}

			//DO NFL BOXSCORE
			var matchups_ar = [];

			// Guard NFL schedule too; if missing, just exit gracefully
			if (!mflBoxJSON_nflSchedule || !mflBoxJSON_nflSchedule.matchup) {
				return true;
			}

			if (mflBoxJSON_nflSchedule.matchup.length === undefined) {
				matchups_ar.matchup = [];
				matchups_ar.matchup.push(mflBoxJSON_nflSchedule.matchup);
			} else
				matchups_ar = mflBoxJSON_nflSchedule;

			for (var j = 0; j < 3; j++) {
				for (var i = 0; i < matchups_ar.matchup.length; i++) {
					var road = matchups_ar.matchup[i].team[0];
					var home = matchups_ar.matchup[i].team[1];
					switch (j) {
						case 0:
							if (mflBoxNflGameStatus[home.id].status !== "INPROG") continue;
							break;
						case 1:
							if (mflBoxNflGameStatus[home.id].status !== "SCHED") continue;
							break;
						case 2:
							if (mflBoxNflGameStatus[home.id].status !== "OVER") continue;
							break;
					}
					//SPREAD
					if (parseFloat(road.spread) < 0) var roadSpread = parseFloat(road.spread).toFixed(1);
					else var roadSpread = "";
					if (parseFloat(home.spread) < 0) var homeSpread = parseFloat(home.spread).toFixed(1);
					else var homeSpread = "";

					if (mflBoxActiveWeek > liveScoringWeek && mflBoxActiveWeek > (completedWeek + 1)) {
						homeSpread = "";
						roadSpread = "";
					}

					mflBox_nflSchedule.push({
						"roadId": road.id,
						"homeId": home.id,
						"roadScore": mflBoxLiveStatsTeam[road.id].TPS,
						"homeScore": mflBoxLiveStatsTeam[home.id].TPS,
						"roadSpread": roadSpread,
						"homeSpread": homeSpread,
						"roadResult": mflBoxLiveStatsTeam[road.id].RES,
						"homeResult": mflBoxLiveStatsTeam[home.id].RES,
						"kickoff": mflBoxNflGameStatus[home.id].kickoff,
						"gameSecondsRemaining": mflBoxNflGameStatus[home.id].secs_left,
						"clock": mflBoxNflGameStatus[home.id].clock,
						"roadPossession": mflBoxNflGameStatus[road.id].possession,
						"roadRedzone": mflBoxNflGameStatus[road.id].redzone,
						"roadDownAndDist": mflBoxNflGameStatus[road.id].down_and_dist,
						"homePossession": mflBoxNflGameStatus[home.id].possession,
						"homeRedzone": mflBoxNflGameStatus[home.id].redzone,
						"homeDownAndDist": mflBoxNflGameStatus[home.id].down_and_dist
					});
					if (mflBoxCurrentWeekKickoff === 0) mflBoxCurrentWeekKickoff = parseInt(matchups_ar.matchup[i].kickoff);
					if (i === 0) mflBoxActiveWeekKickoff = parseInt(matchups_ar.matchup[i].kickoff);
					mflBox_nflOpponents[road.id] = ({
						"opponent": home.id,
						"isHome": false,
						"score": mflBoxLiveStatsTeam[road.id].TPS,
						"result": mflBoxLiveStatsTeam[road.id].RES
					});
					mflBox_nflOpponents[home.id] = ({
						"opponent": road.id,
						"isHome": true,
						"score": mflBoxLiveStatsTeam[home.id].TPS,
						"result": mflBoxLiveStatsTeam[home.id].RES
					});
				}
			}
			return true;
		}

		async function doMFLBoxArrows() {
			//console.log("doMFLBoxArrows ran")
			// Clamp active week if MFL schedule is enabled
			if (typeof mflBoxMFLSchedule !== "undefined" && mflBoxMFLSchedule) {
				if (mflBoxActiveWeek > mflBoxEndWeek) mflBoxActiveWeek = mflBoxEndWeek;
			}

			// Update week cell text
			const weekCell = el$("MFLBoxWeekCell");
			if (weekCell) weekCell.textContent = "Wk " + mflBoxActiveWeek;

			// Helpers to toggle faded state on arrow NodeLists
			const leftArrows = els$(".MFLBoxArrowLeft");
			const rightArrows = els$(".MFLBoxArrowRight");
			const setFaded = (nodes, faded) => nodes.forEach(el => el.classList.toggle("MFLBoxArrowFaded", faded));

			// LEFT ARROW: MFL schedule good if > mflBoxStartWeek; NFL schedule good if > 1
			if (mflBoxMFLSchedule) {
				setFaded(leftArrows, !(mflBoxActiveWeek > mflBoxStartWeek));
			} else {
				setFaded(leftArrows, !(mflBoxActiveWeek > 1));
			}

			const fadedNFLButton = document.querySelector('#mflBoxButtonMFL.mflBoxButtonFaded');
			const fadedNFLButtonTwo = document.querySelector('#mflBoxButtonNFL.mflBoxButtonFaded');
			if (fadedNFLButton) {
				// RIGHT ARROW: Has next week schedule?
				setFaded(rightArrows, false);
				let hasSchedule = false;
				try {
					const nextWeek = mflBoxActiveWeek + 1;
					const property = "w_" + nextWeek;
					const nfl = reportNflSchedule_ar?.[property]?.nflSchedule;

					if (nfl && parseInt(nfl.week, 10) === nextWeek) {
						// Handle both shapes: matchup as array, or single matchup with team array
						if (Array.isArray(nfl.matchup)) {
							hasSchedule = nfl.matchup.length > 0;
						} else if (nfl.matchup && Array.isArray(nfl.matchup.team)) {
							hasSchedule = nfl.matchup.team.length > 0;
						}
					}

					setFaded(rightArrows, !hasSchedule);
				} catch (error) {
					console.log("No Schedule For NFL Week Requested");
					setFaded(rightArrows, true);
				}
			} else if (fadedNFLButtonTwo) {
				if (mflBoxActiveWeek >= endWeek) {
					setFaded(rightArrows, true);
				} else {
					setFaded(rightArrows, false);
				}
			}
		}

		function mflBoxExpand(thisBaseId, doExpand) {
			if (doExpand) {
				jQuery(".MFLExtras_" + thisBaseId).show();
				jQuery("#mflBoxCollapse_" + thisBaseId).show();
				jQuery("#mflBoxExpand_" + thisBaseId).hide();
				mflBoxDetailsTracker[thisBaseId] = doExpand;
			} else {
				jQuery(".MFLExtras_" + thisBaseId).hide();
				jQuery("#mflBoxCollapse_" + thisBaseId).hide();
				jQuery("#mflBoxExpand_" + thisBaseId).show();
				mflBoxDetailsTracker[thisBaseId] = doExpand;
			}
		}

		function mflBoxProjectedScoresHistorical() {
			for (var i = 0; i < mflBoxJSON_projectedScores.projectedScores.playerScore.length; i++) {
				var player = mflBoxJSON_projectedScores.projectedScores.playerScore[i];
				var pid = player.id;
				mflBoxPlayerProjected[pid] = parseFloat(player.score);
				if (isNaN(mflBoxPlayerProjected[pid])) mflBoxPlayerProjected[pid] = 0;
			}
		}

		function mflBoxApplyLiveSettings() {
			if (mflBoxMFLSchedule) {
				var paceFranchise = [];
				var paceTracker = [];
				try { //LOOP THROUGH PLAYERS AND ADD PROJECTED SCORE OF ZERO TO MISSING PROJECTED PLAYERS
					var projectedScoreTracker = [];
					for (var i = 0; i < mflBoxJSON_projectedScores.projectedScores.playerScore.length; i++) {
						projectedScoreTracker["pid_" + mflBoxJSON_projectedScores.projectedScores.playerScore[i].id] = ({
							"id": mflBoxJSON_projectedScores.projectedScores.playerScore[i].id,
							"score": mflBoxJSON_projectedScores.projectedScores.playerScore[i].score
						});
					}
					for (var key in playerDatabase) {
						if (playerDatabase.hasOwnProperty(key)) {
							if (!projectedScoreTracker.hasOwnProperty(key)) {
								mflBoxJSON_projectedScores.projectedScores.playerScore.push(({
									"id": playerDatabase[key].id,
									"score": 0
								}));
							}
						}
					}
					projectedScoreTracker = null;
				} catch (er) {}
				try { //NO PROJECTIONS DUE TO NO ROSTERS CAUSES ERROR
					for (var i = 0; i < mflBoxJSON_projectedScores.projectedScores.playerScore.length; i++) {
						var player = mflBoxJSON_projectedScores.projectedScores.playerScore[i];
						var pid = player.id;
						mflBoxPlayerProjected[pid] = parseFloat(player.score);
						if (isNaN(mflBoxPlayerProjected[pid])) mflBoxPlayerProjected[pid] = 0;
						try {
							var playerScore = parseFloat(mflBox_players["pid_" + pid].score);
							var ar_fid = mflBox_players["pid_" + pid].fid.split(",");
							var ar_isStarter = mflBox_players["pid_" + pid].isStarter.split(",");
							if (player.score === "") var projectedScore = 0;
							else var projectedScore = parseFloat(player.score);
							var gameSecondsRemaining = mflBox_players["pid_" + pid].gameSecondsRemaining;
							var paceScore = playerScore + (gameSecondsRemaining / 3600) * projectedScore;
							var expectedPaceScore = projectedScore;
							for (var j = 0; j < ar_fid.length; j++) {
								var fid = ar_fid[j];
								var isStarter = ar_isStarter[j];
								if (paceFranchise[fid] === undefined) paceFranchise[fid] = ({
									"pace": 0,
									"expected_pace": 0,
									"players": 0,
									"gameSecondsRemaining": 0
								});
								if (isStarter === "1") {
									if (paceTracker[pid + "_" + fid] === undefined) {
										paceTracker[pid + "_" + fid] = 1;
										paceFranchise[fid].pace += paceScore;
										paceFranchise[fid].expected_pace += expectedPaceScore;
										paceFranchise[fid].players++;
										paceFranchise[fid].gameSecondsRemaining += gameSecondsRemaining;
									}
								}
							}
						} catch (er) {}
					}
				} catch (er) {}
				for (var key in paceFranchise) {
					if (paceFranchise.hasOwnProperty(key)) {
						if (paceFranchise[key].gameSecondsRemaining > 0) {
							var paceClass = "";
							if (paceFranchise[key].pace > paceFranchise[key].expected_pace) paceClass = " MFLPaceScorePositive";
							if (paceFranchise[key].pace < paceFranchise[key].expected_pace) paceClass = " MFLPaceScoreNegative";
							jQuery('[id^="mflBoxPace_' + key + '_"]').html('<span class="warning' + paceClass + '" title="Original projection ' + paceFranchise[key].expected_pace.toFixed(precision) + '">' + paceFranchise[key].pace.toFixed(precision) + '</span>');
						}
					}
				}
				for (var i = 0; i < mflBox_matchups.length; i++) {
					if (mflBoxIsAllPlay)
						var html_swap = '<span style="position:absolute;left:0.313rem;bottom:0.438rem;cursor:pointer" title="Swap All Play Team" onclick="mflBoxAllPlayId=\'' + mflBox_matchups[i].roadId + '\';mflBoxNewWeek(0)"><i class="fa-regular fa-arrow-right-arrow-left" aria-hidden="true"></i></span>';
					else
						var html_swap = '';
					try {
						var totalPlayers = paceFranchise[mflBox_matchups[i].roadId].players + paceFranchise[mflBox_matchups[i].homeId].players;
						var totalGameSecondsRemaining = paceFranchise[mflBox_matchups[i].roadId].gameSecondsRemaining + paceFranchise[mflBox_matchups[i].homeId].gameSecondsRemaining;
						var totalGameSeconds = totalPlayers * 3600;
					} catch (er) {
						var totalGameSecondsRemaining = 1;
						var totalGameSeconds = 1;
					}
					if (mflBox_matchups[i].homeId === "BYE") {
						jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html(" ");
					} else {
						if (totalGameSecondsRemaining === totalGameSeconds) {
							try {
								if (mflBoxFirstKickoff[mflBox_matchups[i].roadId] === undefined || mflBoxFirstKickoff[mflBox_matchups[i].homeId] === undefined) jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html(mflBoxGameClock(mflBoxActiveWeekKickoff, 2) + html_swap);
								else if (mflBoxFirstKickoff[mflBox_matchups[i].roadId] < mflBoxFirstKickoff[mflBox_matchups[i].homeId]) jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html(mflBoxGameClock(mflBoxFirstKickoff[mflBox_matchups[i].roadId], 2) + html_swap);
								else jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html(mflBoxGameClock(mflBoxFirstKickoff[mflBox_matchups[i].homeId], 2) + html_swap);
							} catch (er) {
								jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html(mflBoxGameClock(mflBoxActiveWeekKickoff, 2) + html_swap);
							}
						} else if (totalGameSecondsRemaining > 0) {
							jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html(mflBoxGameClock(totalGameSecondsRemaining / totalGameSeconds * 100, 0) + '<span class="MFLBoxDetailsArrow" id="mflBoxExpand_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" onclick="mflBoxExpand(\'' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '\',true)"><i class="fa-regular fa-square-right" aria-hidden="true"></i></span><span class="MFLBoxDetailsArrow" id="mflBoxCollapse_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" onclick="mflBoxExpand(\'' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '\',false)" style="display:none"><i class="fa-regular fa-square-left" aria-hidden="true"></i></span>' + html_swap);
							if (mflBoxDetailsTracker[mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId]) mflBoxExpand(mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId, true);
						} else {
							jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html(mflBoxGameClock(totalGameSecondsRemaining / totalGameSeconds * 100, 3) + html_swap);
							if (parseFloat(mflBox_matchups[i].roadScore) > parseFloat(mflBox_matchups[i].homeScore)) jQuery('[id="mflBoxWin_' + mflBox_matchups[i].roadId + '_' + i + '"]').html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
							if (parseFloat(mflBox_matchups[i].homeScore) > parseFloat(mflBox_matchups[i].roadScore)) jQuery('[id="mflBoxWin_' + mflBox_matchups[i].homeId + '_' + i + '"]').html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
						}
					}
					jQuery('[id="mflBoxScore_' + mflBox_matchups[i].roadId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].roadScore).toFixed(precision));
					if (mflBox_matchups[i].homeId === "BYE")
						jQuery('[id="mflBoxScore_' + mflBox_matchups[i].homeId + '_' + i + '"]').html(" ");
					else
						jQuery('[id="mflBoxScore_' + mflBox_matchups[i].homeId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].homeScore).toFixed(precision));
					jQuery('[id="mflBoxPMR_' + mflBox_matchups[i].roadId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].roadPlayerMinutesRemaining));
					jQuery('[id="mflBoxPMR_' + mflBox_matchups[i].homeId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].homePlayerMinutesRemaining));
					jQuery('[id="mflBoxYTP_' + mflBox_matchups[i].roadId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].roadYetToPlay));
					jQuery('[id="mflBoxYTP_' + mflBox_matchups[i].homeId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].homeYetToPlay));
					jQuery('[id="mflBoxCP_' + mflBox_matchups[i].roadId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].roadCurrentlyPlaying));
					jQuery('[id="mflBoxCP_' + mflBox_matchups[i].homeId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].homeCurrentlyPlaying));
				}
			} else {
				for (var i = 0; i < mflBox_nflSchedule.length; i++) {
					mflBoxNFLBox(mflBox_nflSchedule[i], i);
				}
			}
		}

		function mflBoxPopulateTiebreaker(weekResults) {
			mflBoxTiebreaker = [];
			for (var fidKey in franchiseDatabase) {
				if (franchiseDatabase.hasOwnProperty(fidKey) && parseInt(franchiseDatabase[fidKey].id) > 0) {
					mflBoxTiebreaker[fidKey] = [];
				}
			}
			try { //POSSIBLE THAT NO MATCHUPS ARE SET SO WE NEED TO USE TRY
				for (var i = 0; i < weekResults.matchup.length; i++) {
					var road = weekResults.matchup[i].franchise[0];
					var home = weekResults.matchup[i].franchise[1];
					if (road.tiebreaker !== undefined && road.tiebreaker.length !== 0) {
						var temp = road.tiebreaker.split(",");
						for (var j = 0; j < temp.length; j++) {
							if (parseInt(temp[j]) > 0) mflBoxTiebreaker["fid_" + road.id]["pid_" + temp[j]] = 1;
						}
					}
					if (home.tiebreaker !== undefined && home.tiebreaker.length !== 0) {
						var temp = home.tiebreaker.split(",");
						for (var j = 0; j < temp.length; j++) {
							if (parseInt(temp[j]) > 0) mflBoxTiebreaker["fid_" + home.id]["pid_" + temp[j]] = 1;
						}
					}
				}
			} catch (er) {
				try { //POSSIBLE THAT ONLY ONE MATCHUP EXISTS
					var road = weekResults.matchup.franchise[0];
					var home = weekResults.matchup.franchise[1];
					if (road.tiebreaker !== undefined && road.tiebreaker.length !== 0) {
						var temp = road.tiebreaker.split(",");
						for (var j = 0; j < temp.length; j++) {
							if (parseInt(temp[j]) > 0) mflBoxTiebreaker["fid_" + road.id]["pid_" + temp[j]] = 1;
						}
					}
					if (home.tiebreaker !== undefined && home.tiebreaker.length !== 0) {
						var temp = home.tiebreaker.split(",");
						for (var j = 0; j < temp.length; j++) {
							if (parseInt(temp[j]) > 0) mflBoxTiebreaker["fid_" + home.id]["pid_" + temp[j]] = 1;
						}
					}
				} catch (er) { // SETUP ALL PLAY SINCE NO MATCHUPS
					for (var i = 0; i < weekResults.franchise.length; i++) {
						if (mflBoxAllPlayId !== weekResults.franchise[i].id) {
							var road = weekResults.franchise[i];
							if (road.tiebreaker !== undefined && road.tiebreaker.length !== 0) {
								var temp = road.tiebreaker.split(",");
								for (var j = 0; j < temp.length; j++) {
									if (parseInt(temp[j]) > 0) mflBoxTiebreaker["fid_" + road.id]["pid_" + temp[j]] = 1;
								}
							}
						}
					}
				}
			}
		}

		function mflBoxApplyUncompletedSettings() {
			try {
				if (mflBoxMFLSchedule) {
					// Build a quick lookup for projected scores (safe guards)
					const projByPid = {};
					const ps = mflBoxJSON_projectedScores?.projectedScores?.playerScore;
					if (Array.isArray(ps)) {
						for (let k = 0, n = ps.length; k < n; k++) {
							const row = ps[k];
							if (row?.id != null) {
								projByPid['pid_' + row.id] = {
									id: row.id,
									score: Number(row.score) || 0
								};
							}
						}
					}

					const matchups = Array.isArray(mflBox_matchups) ? mflBox_matchups : [];
					const L = matchups.length;

					for (let i = 0; i < L; i++) {
						try {
							const m = matchups[i];
							if (!m) continue;
							const roadId = m.roadId;
							const homeId = m.homeId;

							// Swap icon (only if all-play)
							const htmlSwap = mflBoxIsAllPlay ?
								`<span style="position:absolute;left:0.313rem;bottom:0.438rem;cursor:pointer" title="Swap All Play Team" onclick="mflBoxAllPlayId='${roadId}';mflBoxNewWeek(0)"><i class="fa-regular fa-arrow-right-arrow-left" aria-hidden="true"></i></span>` :
								'';

							// Game clock
							jQuery(`[id^="mflBoxClock_${roadId}_${homeId}"]`)
								.html(mflBoxGameClock(mflBoxActiveWeekKickoff, 1) + htmlSwap);

							// Helper to update spread/projected
							const updateProjected = (startersCsv, fid, idx, side) => {
								const $el = jQuery(`[id="mflBoxSpread_${fid}_${idx}"]`);
								const starters = (startersCsv || '').split(',').filter(Boolean);
								if (starters.length) {
									let total = 0;
									for (let j = 0; j < starters.length; j++) {
										const p = projByPid['pid_' + starters[j]];
										if (p) total += p.score || 0;
									}
									const prec = typeof precision === 'number' ? precision : 0;
									$el.html(`<span class="warning projected" title="Projected Score">${total.toFixed(prec)}</span>`);
								} else {
									const spreadVal = side === 'road' ? m.roadSpread : m.homeSpread;
									$el.html(`<span class="warning">${spreadVal ?? ''}</span>`);
								}
							};

							updateProjected(m.roadStarters, roadId, i, 'road');
							updateProjected(m.homeStarters, homeId, i, 'home');

							// Scores/records
							const setScore = (fid, idx, val) => {
								jQuery(`[id="mflBoxScore_${fid}_${idx}"]`).html(String(val));
							};

							if (mflBoxIsAllPlay && mflBoxIsTotalPts) {
								setScore(roadId, i, 0);
								setScore(homeId, i, 0);
							} else {
								const roadRec = franchiseDatabase?.['fid_' + roadId]?.record ?? '';
								const homeRec = franchiseDatabase?.['fid_' + homeId]?.record ?? '';
								setScore(roadId, i, roadRec);
								setScore(homeId, i, homeRec);
							}
						} catch (innerErr) {
							console.error('[mflBoxApplyUncompletedSettings] matchup failed', {
								i,
								err: innerErr
							});
							// continue to next matchup
						}
					}
				} else {
					const sched = Array.isArray(mflBox_nflSchedule) ? mflBox_nflSchedule : [];
					for (let i = 0; i < sched.length; i++) {
						try {
							mflBoxNFLBox(sched[i], i);
						} catch (innerErr) {
							console.error('[mflBoxApplyUncompletedSettings] nflBox failed', {
								i,
								err: innerErr
							});
						}
					}
				}
			} catch (er) {
				console.error('[mflBoxApplyUncompletedSettings] fatal', er);
			}
		}

		function mflBoxApplyCompletedSettings() {
			if (mflBoxMFLSchedule) {
				for (var i = 0; i < mflBox_matchups.length; i++) {
					if (mflBoxIsAllPlay)
						var html_swap = '<span style="position:absolute;right:0.313rem;bottom:0.438rem;cursor:pointer" title="Swap All Play Team" onclick="mflBoxAllPlayId=\'' + mflBox_matchups[i].roadId + '\';mflBoxNewWeek(0)"><i class="fa-regular fa-arrow-right-arrow-left" aria-hidden="true"></i></span>';
					else
						var html_swap = '';
					jQuery('[id^="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"]').html("Final" + html_swap);
					jQuery('[id="mflBoxScore_' + mflBox_matchups[i].roadId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].roadScore).toFixed(precision));
					jQuery('[id="mflBoxScore_' + mflBox_matchups[i].homeId + '_' + i + '"]').html(parseFloat(mflBox_matchups[i].homeScore).toFixed(precision));
					if (mflBox_matchups[i].roadResult === "W") jQuery('[id="mflBoxWin_' + mflBox_matchups[i].roadId + '_' + i + '"]').html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
					if (mflBox_matchups[i].homeResult === "W") jQuery('[id="mflBoxWin_' + mflBox_matchups[i].homeId + '_' + i + '"]').html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
				}
			} else {
				for (var i = 0; i < mflBox_nflSchedule.length; i++) {
					mflBoxNFLBox(mflBox_nflSchedule[i], i);
				}
			}
		}

		function mflBoxNFLBox(thisBox, thisGame) {
			if (parseInt(thisBox.gameSecondsRemaining) === 0) {
				jQuery('[id^="mflBoxClock_' + thisBox.roadId + '_' + thisBox.homeId + '"]').html("Final");
				jQuery('[id="mflBoxScore_' + thisBox.roadId + '_' + thisGame + '"]').html(thisBox.roadScore);
				jQuery('[id="mflBoxScore_' + thisBox.homeId + '_' + thisGame + '"]').html(thisBox.homeScore);
				var roadResult = "T";
				var homeResult = "T";
				if (parseFloat(thisBox.roadScore) > parseFloat(thisBox.homeScore)) {
					roadResult = "W";
					homeResult = "L";
				}
				if (parseFloat(thisBox.homeScore) > parseFloat(thisBox.roadScore)) {
					roadResult = "L";
					homeResult = "W";
				}
				if (roadResult === "W") jQuery('[id="mflBoxWin_' + thisBox.roadId + '_' + thisGame + '"]').html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
				if (homeResult === "W") jQuery('[id="mflBoxWin_' + thisBox.homeId + '_' + thisGame + '"]').html('<i class="fa-regular fa-caret-left" aria-hidden="true"></i>');
			} else if (parseInt(thisBox.gameSecondsRemaining) === 3600) {
				jQuery('[id^="mflBoxClock_' + thisBox.roadId + '_' + thisBox.homeId + '"]').html(thisBox.clock);
				//if (liveScoringWeek < 1) {
				//jQuery('[id="mflBoxSpread_' + thisBox.roadId + '_' + thisGame + '"]').html('<span class="warning"></span>');
				//jQuery('[id="mflBoxSpread_' + thisBox.homeId + '_' + thisGame + '"]').html('<span class="warning"></span>');
				//} else {
				jQuery('[id="mflBoxSpread_' + thisBox.roadId + '_' + thisGame + '"]').html('<span class="warning">' + thisBox.roadSpread + '</span>');
				jQuery('[id="mflBoxSpread_' + thisBox.homeId + '_' + thisGame + '"]').html('<span class="warning">' + thisBox.homeSpread + '</span>');
				//}
			} else {
				jQuery('[id^="mflBoxClock_' + thisBox.roadId + '_' + thisBox.homeId + '"]').html(mflBoxGameClock(parseInt(thisBox.gameSecondsRemaining) / 3600 * 100, 3));
				jQuery('[id="mflBoxScore_' + thisBox.roadId + '_' + thisGame + '"]').html(thisBox.roadScore);
				jQuery('[id="mflBoxScore_' + thisBox.homeId + '_' + thisGame + '"]').html(thisBox.homeScore);
				if (thisBox.roadRedzone)
					jQuery('[id="mflBoxSpread_' + thisBox.roadId + '_' + thisGame + '"]').html('<span class="downDistance redzone">' + thisBox.roadDownAndDist + '</span>');
				else if (thisBox.roadPossession)
					jQuery('[id="mflBoxSpread_' + thisBox.roadId + '_' + thisGame + '"]').html('<span class="downDistance possession">' + thisBox.roadDownAndDist + '</span>');
				else
					jQuery('[id="mflBoxSpread_' + thisBox.roadId + '_' + thisGame + '"]').html('');
				if (thisBox.homeRedzone)
					jQuery('[id="mflBoxSpread_' + thisBox.homeId + '_' + thisGame + '"]').html('<span class="downDistance redzone">' + thisBox.homeDownAndDist + '</span>');
				else if (thisBox.homePossession)
					jQuery('[id="mflBoxSpread_' + thisBox.homeId + '_' + thisGame + '"]').html('<span class="downDistance possession">' + thisBox.homeDownAndDist + '</span>');
				else
					jQuery('[id="mflBoxSpread_' + thisBox.homeId + '_' + thisGame + '"]').html('');
			}
		}

		function mflBoxCheckLive() {
			if (mflBoxCurrentLiveScoring && (mflBoxActiveWeek === mflBoxCurrentWeek) && !liveScoringLiveWeek?.error) return true;
			return false;
		}

		function mflBoxCheckCompletedWeek() {
			if (mflBoxActiveWeek <= completedWeek) return true;
			return false;
		}

		function mflBoxNewWeek(advance) {
			$("#MFLBoxPlayerDetails").hide();
			mflBoxPlayerDetailsFid.fid = '';
			if (advance > 0) {
				if (jQuery(".MFLBoxArrowRight").hasClass("MFLBoxArrowFaded")) return false;
			} else if (advance < 0) {
				if (jQuery(".MFLBoxArrowLeft").hasClass("MFLBoxArrowFaded")) return false;
			}
			mflBoxActiveWeek += advance;
			doMFLBoxArrows();
			doMFLBoxUpdate(true);
		}

		function mflBoxGameClockMinutes(clockValue) {
			var minutes = parseInt(clockValue * 60 / 100);
			var secondsPct = clockValue * 60 / 100 - parseInt(clockValue * 60 / 100);
			var seconds = parseInt(secondsPct * 60);
			if (seconds < 10) seconds = "0" + seconds;
			return (minutes + ":" + seconds);
		}

		function mflBoxGameClock(clockValue, clockType) {
			if (clockType === 0 || clockType === 3) { //LIVE, CLOCK VALUE IS PCT
				if (clockType === 3)
					if (clockValue === 0) return ("Final");
					else
				if (clockValue === 0) return ("4th - 0:00");
				if (clockValue < 25) return ("4th - " + mflBoxGameClockMinutes(clockValue));
				if (clockValue === 25) return ("4th - 15:00");
				if (clockValue < 50) return ("3rd - " + mflBoxGameClockMinutes(clockValue - 25));
				if (clockValue === 50) return ("Halftime");
				if (clockValue < 75) return ("2nd - " + mflBoxGameClockMinutes(clockValue - 50));
				if (clockValue === 75) return ("2nd - 15:00");
				if (clockValue < 100) return ("1st - " + mflBoxGameClockMinutes(clockValue - 75));
				return ("1st - 15:00");
			}
			if (clockType === 1) { //FIRST GAME OF UNCOMPLETED WEEK
				var d = new Date(clockValue * 1000);
				return mflBoxWeekDay[d.getDay()] + " " + mflBoxMonth[d.getMonth()] + " " + d.getDate();
			}
			if (clockType === 2) { //DAY & TIME
				var d = new Date(clockValue * 1000);
				if (d.getHours() > 11) var dd = "pm";
				else var dd = "am";
				if (d.getHours() > 12) var hh = d.getHours() - 12;
				else var hh = d.getHours();
				if (hh === 0) hh = 12;
				mm = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
				return mflBoxWeekDay[d.getDay()] + " " + hh + ":" + mm + dd;
			}
		}
		////////////////////////////////////////////////////////////////////////////////////
		// LIVE STATS FUNCTIONS BUILD OFF OF //www.myfantasyleague.com/mfl_live_scoring.js
		////////////////////////////////////////////////////////////////////////////////////
		function doMFLBoxLiveStatsClose() {
			$(".MFLBoxLiveStatsWrapper").attr("style", "display:none");
		}

		function doMFLBoxLiveStatsPopup(fid, pid) {
			$(".MFLBoxLiveStatsWrapper").attr("style", "display:none");
			$("#MFLBoxLiveStatsWrapper_" + fid + "_" + pid).removeAttr("style");
			var statStr = mflBoxGetStatsStr(pid);
			if (statStr === "") statStr = "no stats";
			$("#MFLBoxLiveStatsContent_" + fid + "_" + pid).html(statStr + '<span class="MFLBoxLiveStatsClose" onclick="doMFLBoxLiveStatsClose()"></span>');
		}

		function mflBoxGetStatsStr(pid) {
			var groups = [];
			if (mflBoxLiveStatsPlayer[pid] == undefined) {
				return "";
			}
			if (mflBoxLiveStatsPlayer[pid].PA > 0) {
				var subgr = [];
				if (mflBoxLiveStatsPlayer[pid].PC === undefined) {
					mflBoxLiveStatsPlayer[pid].PC = 0;
				}
				if (mflBoxLiveStatsPlayer[pid].PY === undefined) {
					mflBoxLiveStatsPlayer[pid].PY = 0;
				}
				subgr.push("Pass: " + mflBoxLiveStatsPlayer[pid].PC + "-" + mflBoxLiveStatsPlayer[pid].PA + "-" + mflBoxLiveStatsPlayer[pid].PY);
				if (mflBoxLiveStatsPlayer[pid]["#P"] > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid]["#P"] + " PaTD (" + mflBoxLiveStatsPlayer[pid].PS + ")");
				}
				if (mflBoxLiveStatsPlayer[pid].IN > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid].IN + " Int");
				}
				if (mflBoxLiveStatsPlayer[pid]["P2"] > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid]["P2"] + " Pa2P");
				}
				groups.push(subgr.join(", "));
			}
			if (mflBoxLiveStatsPlayer[pid].RA > 0) {
				var subgr = [];
				if (mflBoxLiveStatsPlayer[pid].RY === undefined) {
					mflBoxLiveStatsPlayer[pid].RY = 0;
				}
				subgr.push("Rush: " + mflBoxLiveStatsPlayer[pid].RA + "-" + mflBoxLiveStatsPlayer[pid].RY);
				if (mflBoxLiveStatsPlayer[pid]["#R"] > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid]["#R"] + " RuTD (" + mflBoxLiveStatsPlayer[pid].RS + ")");
				}
				if (mflBoxLiveStatsPlayer[pid]["R2"] > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid]["R2"] + " Ru2P");
				}
				groups.push(subgr.join(", "));
			}
			if (mflBoxLiveStatsPlayer[pid].CC > 0) {
				var subgr = [];
				if (mflBoxLiveStatsPlayer[pid].CY === undefined) {
					mflBoxLiveStatsPlayer[pid].CY = 0;
				}
				subgr.push("Rec: " + mflBoxLiveStatsPlayer[pid].CC + "-" + mflBoxLiveStatsPlayer[pid].CY);
				if (mflBoxLiveStatsPlayer[pid]["#C"] > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid]["#C"] + " ReTD (" + mflBoxLiveStatsPlayer[pid].RC + ")");
				}
				if (mflBoxLiveStatsPlayer[pid]["C2"] > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid]["C2"] + " Re2P");
				}
				groups.push(subgr.join(", "));
			}
			if (mflBoxLiveStatsPlayer[pid].FL > 0) {
				groups.push(mflBoxLiveStatsPlayer[pid].FL + " Fum Lost");
			}
			if (mflBoxLiveStatsPlayer[pid].TK > 0 || mflBoxLiveStatsPlayer[pid].AS > 0 || mflBoxLiveStatsPlayer[pid].PD > 0) {
				var subgr = [];
				if (mflBoxLiveStatsPlayer[pid].TK > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid].TK + " T");
				}
				if (mflBoxLiveStatsPlayer[pid].TFL > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid].TKL + " TFL");
				}
				if (mflBoxLiveStatsPlayer[pid].AS > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid].AS + " A");
				}
				if (mflBoxLiveStatsPlayer[pid].SK > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid].SK + " SK");
				}
				if (mflBoxLiveStatsPlayer[pid].PD > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid].PD + " PD");
				}
				if (mflBoxLiveStatsPlayer[pid].IC > 0) {
					var str = mflBoxLiveStatsPlayer[pid].IC + " INT";
					if (mflBoxLiveStatsPlayer[pid]["#IR"] > 0) {
						str = str + " " + mflBoxLiveStatsPlayer[pid]["#IR"] + " IntTD (" + mflBoxLiveStatsPlayer[pid].IR + ")";
					}
					subgr.push(str);
				}
				if (mflBoxLiveStatsPlayer[pid].FF > 0) {
					subgr.push(mflBoxLiveStatsPlayer[pid].FF + " FF");
				}
				if (mflBoxLiveStatsPlayer[pid].FC > 0) {
					var str = mflBoxLiveStatsPlayer[pid].FC + " FR";
					if (mflBoxLiveStatsPlayer[pid]["#DR"] > 0) {
						str = str + " " + mflBoxLiveStatsPlayer[pid]["#DR"] + " FRTD (" + mflBoxLiveStatsPlayer[pid].DR + ")";
					}
					subgr.push(str);
				}
				groups.push(subgr.join(", "));
			}
			if (mflBoxLiveStatsPlayer[pid]["#A"] > 0 || mflBoxLiveStatsPlayer[pid].EA > 0) {
				var subgr = [];
				var str = "Kick: ";
				if (mflBoxLiveStatsPlayer[pid]["#A"] > 0) {
					var dist = "";
					if (mflBoxLiveStatsPlayer[pid]["#F"] === undefined) {
						mflBoxLiveStatsPlayer[pid]["#F"] = 0;
					}
					if (mflBoxLiveStatsPlayer[pid].FG !== undefined) {
						dist = "(" + mflBoxLiveStatsPlayer[pid].FG + ")";
					}
					subgr.push(str + mflBoxLiveStatsPlayer[pid]["#F"] + "-" + mflBoxLiveStatsPlayer[pid]["#A"] + " FG " + dist);
					str = "";
				}
				if (mflBoxLiveStatsPlayer[pid].EA > 0) {
					if (mflBoxLiveStatsPlayer[pid].EP === undefined) {
						mflBoxLiveStatsPlayer[pid].EP = 0;
					}
					subgr.push(str + mflBoxLiveStatsPlayer[pid].EP + "-" + mflBoxLiveStatsPlayer[pid].EA + " XP");
					str = "";
				}
				groups.push(subgr.join(", "));
			}
			return groups.join("; ");
		}

		function mflBoxGetTeamStatsStr(team) {
			var groups = [];
			for (var i = 0; i < show_tstats.length; i++) {
				var stat = show_tstats[i];
				if (mflBoxLiveStatsTeam[team][stat] !== undefined && mflBoxLiveStatsTeam[team][stat] !== 0) {
					groups.push(mflBoxLiveStatsTeam[team][stat] + " " + stat);
				}
			}
			if (mflBoxLiveStatsTeam[team].FC > 0) {
				groups.push(mflBoxLiveStatsTeam[team].FC + " FR");
				if (mflBoxLiveStatsTeam[team]["#DR"] > 0) {
					groups.push(mflBoxLiveStatsTeam[team]["#DR"] + " FR TD (" + mflBoxLiveStatsTeam[team].DR + ")");
				}
			}
			if (mflBoxLiveStatsTeam[team].IC > 0) {
				groups.push(mflBoxLiveStatsTeam[team].IC + " Int");
				if (mflBoxLiveStatsTeam[team]["#IR"] > 0) {
					groups.push(mflBoxLiveStatsTeam[team]["#IR"] + " Int TD (" + mflBoxLiveStatsTeam[team].IR + ")");
				}
			}
			if (mflBoxLiveStatsTeam[team]["#KT"] > 0) {
				groups.push(mflBoxLiveStatsTeam[team]["#KT"] + " KTD (" + mflBoxLiveStatsTeam[team].KO + ")");
			}
			if (mflBoxLiveStatsTeam[team]["#UT"] > 0) {
				groups.push(mflBoxLiveStatsTeam[team]["#UT"] + " PTD (" + mflBoxLiveStatsTeam[team].PR + ")");
			}
			if (mflBoxLiveStatsTeam[team].BLF > 0) {
				groups.push(mflBoxLiveStatsTeam[team].BLF + " BLF");
				if (mflBoxLiveStatsTeam[team]["#BF"] > 0) {
					groups.push(mflBoxLiveStatsTeam[team]["#BF"] + " BF (" + mflBoxLiveStatsTeam[team].BF + ")");
				}
			}
			if (mflBoxLiveStatsTeam[team].BLP > 0) {
				groups.push(mflBoxLiveStatsTeam[team].BLP + " BLP");
				if (mflBoxLiveStatsTeam[team]["#BP"] > 0) {
					groups.push(mflBoxLiveStatsTeam[team]["#BP"] + " BP (" + mflBoxLiveStatsTeam[team].BP + ")");
				}
			}
			if (mflBoxLiveStatsTeam[team].BLE > 0) {
				groups.push(mflBoxLiveStatsTeam[team].BLE + " BLE");
			}
			return (groups.join(", "));
		}

		function mflBoxNflGameTime(timestamp) {
			var day_ar = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
			var date = new Date(parseInt(timestamp) * 1000);
			var day = day_ar[date.getDay()];
			var hours = date.getHours();
			if (hours >= 12) var ampm = "pm";
			else var ampm = "am";
			if (hours === 0) hours = 12;
			else if (hours > 12) hours -= 12;
			var minutes = "0" + date.getMinutes();
			var formattedTime = day + " " + hours + ':' + minutes.substr(-2) + ampm;
			return formattedTime;
		}

		function mflBoxParseLiveStats(resp, time) {
			mflBoxLiveStatsPlayer = [];
			mflBoxLiveStatsTeam = [];
			if (resp === "CACHE") {
				lsm_last_update_secs = lsm_last_update_secs_first;
				if (typeof structuredClone === "function") {
					mflBoxLiveStatsPlayer = structuredClone(lsm_stats);
					mflBoxLiveStatsTeam = structuredClone(lsm_tstats);
				} else {
					// Fallback for older browsers
					mflBoxLiveStatsPlayer = JSON.parse(JSON.stringify(lsm_stats));
					mflBoxLiveStatsTeam = JSON.parse(JSON.stringify(lsm_tstats));
				}
			} else {
				var lines = resp.split("\n");
				for (var i in lines) {
					if (lines.hasOwnProperty(i)) {
						var fields = lines[i].split("|");
						if (fields[0] === 'DATE') {
							lsm_last_update_secs = fields[1];
							ls_last_update = fields[2];
						} else if (fields[0] === 'REFRESH') {
							//IGNORE
						} else if (!isNaN(fields[0])) {
							// is a position player
							if (typeof mflBoxLiveStatsPlayer[fields[0]] === 'undefined') {
								mflBoxLiveStatsPlayer[fields[0]] = {};
							}
							for (j = 1; j < fields.length; j++) {
								var onestat = fields[j].split(" ");
								mflBoxLiveStatsPlayer[fields[0]][onestat[0]] = onestat[1];
							}
						} else {
							// is a team stat
							if (typeof mflBoxLiveStatsTeam[fields[0]] === 'undefined') {
								mflBoxLiveStatsTeam[fields[0]] = {};
							}
							for (j = 1; j < fields.length; j++) {
								var onestat = fields[j].split(" ");
								mflBoxLiveStatsTeam[fields[0]][onestat[0]] = onestat[1];
							}
						}
					}
				}
			}

			//CHECK HERE
			for (var team in mflBoxNflGameStatus) {
				if (!mflBoxLiveStatsTeam.hasOwnProperty(team)) mflBoxLiveStatsTeam[team] = {};
			}
			for (var team in mflBoxNflGameStatus) {
				//for (var team in mflBoxLiveStatsTeam) {
				if (mflBoxLiveStatsTeam.hasOwnProperty(team)) {
					if (!mflBoxNflGameStatus.hasOwnProperty(team)) mflBoxNflGameStatus[team] = ({
						"time": 0,
						"isBye": true
					});
					if (!mflBoxLiveStatsTeam.hasOwnProperty(team)) mflBoxLiveStatsTeam[team] = [];
					mflBoxNFLKickoff[team] = mflBoxNflGameStatus[team].time;
					if (mflBoxNflGameStatus[team].time === 0) {
						mflBoxNflGameStatus[team].clock = 'BYE';
						mflBoxNflGameStatus[team].secs_left = 0;
						mflBoxNflGameStatus[team].status = "BYE";
						mflBoxLiveStatsTeam[team].TPS = "";
						mflBoxLiveStatsTeam[team].TPA = "";
					} else if (mflBoxNflGameStatus[team].time > lsm_last_update_secs) { //GAME HASN'T STARTED
						mflBoxNflGameStatus[team].clock = mflBoxNflGameTime(mflBoxNflGameStatus[team].time);
						mflBoxNflGameStatus[team].secs_left = 3600;
						mflBoxNflGameStatus[team].status = "SCHED";
						mflBoxLiveStatsTeam[team].TPS = "";
						mflBoxLiveStatsTeam[team].TPA = "";
					} else { //GAME IS FINAL OR IN PROGRESS
						//mflBoxLiveStatsTeam[team].TPS = 0;
						//mflBoxLiveStatsTeam[team].TPA = 0;
						try {
							if (mflBoxLiveStatsTeam[team].TPS === undefined) mflBoxLiveStatsTeam[team].TPS = 0;
							if (mflBoxLiveStatsTeam[mflBoxLiveStatsTeam[team].OPP].TPS === undefined) mflBoxLiveStatsTeam[team].TPA = 0;
							if (mflBoxLiveStatsTeam[team].QUARTER === '' || mflBoxLiveStatsTeam[team].QUARTER === 'F') {
								mflBoxNflGameStatus[team].secs_left = 0;
								mflBoxNflGameStatus[team].status = "OVER";
							} else {
								var when;
								mflBoxNflGameStatus[team].status = "INPROG";
								var parts = mflBoxLiveStatsTeam[team].REMAINING.split(":");
								mflBoxNflGameStatus[team].secs_left = parts[0] * 60 + Number(parts[1]);
								if (mflBoxLiveStatsTeam[team].QUARTER === 'O' || mflBoxLiveStatsTeam[team].QUARTER > 4) {
									when = "OT";
								} else if (mflBoxLiveStatsTeam[team].QUARTER === 'H') {
									when = "H";
									mflBoxNflGameStatus[team].secs_left += 15 * 60 * 2;
									custom_is_half = true;
								} else {
									mflBoxNflGameStatus[team].secs_left += 15 * 60 * (4 - mflBoxLiveStatsTeam[team].QUARTER);
									when = mflBoxLiveStatsTeam[team].QUARTER + "Q";
								}
								when = when + "&nbsp;" + mflBoxLiveStatsTeam[team].REMAINING;
								mflBoxNflGameStatus[team].clock = when;

								var down = parseInt(mflBoxLiveStatsTeam[team].DOWN);
								if (isNaN(down) || down === 0 || down === undefined) {
									down = 1;
								}
								if (down === 1) {
									down = down + "st";
								} else if (down === 2) {
									down = down + "nd";
								} else if (down === 3) {
									down = down + "rd";
								} else if (down === 4) {
									down = down + "th";
								}
								mflBoxNflGameStatus[team].possession = false;
								mflBoxNflGameStatus[team].redzone = false;
								mflBoxNflGameStatus[team].down_and_dist = '';
								if (mflBoxLiveStatsTeam[team].YARDLINE !== undefined && mflBoxLiveStatsTeam[team].YARDLINE !== "") {
									var fieldpos = mflBoxLiveStatsTeam[team].YARDLINE.split(":");
									var side = fieldpos[0];
									var yardline = Number(fieldpos[1]);
									if (side == '50') {
										side = "";
										yardline = 50;
									}
									if (mflBoxLiveStatsTeam[team].TOGO !== undefined && mflBoxLiveStatsTeam[team].TOGO !== "") {
										var downdist = down + "&nbsp;and&nbsp;" + mflBoxLiveStatsTeam[team].TOGO + " at " + side + "&nbsp;" + yardline;
										//game_status = game_status + "<br>" + downdist;
										mflBoxNflGameStatus[team].down_and_dist = downdist;
										if (mflBoxLiveStatsTeam[team].POSSESSION > 0) {
											mflBoxNflGameStatus[team].possession = true;
											//console.log(team + " poss=" + mflBoxLiveStatsTeam[team].POSSESSION + " yard=" + mflBoxLiveStatsTeam[team].YARDLINE + " " + side + " " + yardline);
											if (side !== team && yardline < 20) {
												mflBoxNflGameStatus[team].redzone = true;
											}
										}
									}
								}
							}
						} catch (e) {}
					}
					//console.log(team+" "+mflBoxLiveStatsTeam[team].TPS+" "+mflBoxLiveStatsTeam[team].OPP+ " "+mflBoxLiveStatsTeam[team].TPA+" "+mflBoxLiveStatsTeam[team].RES);
				}
			}
		}

		////////////////////////////////////////////////////////////////////////////////////
		// END LIVE STATS
		////////////////////////////////////////////////////////////////////////////////////

		function getMFLBoxNameIcon(fid) {
			if (fid === "BYE") return '<span class="mflBoxBye">BYE</span>';
			if (fid === "AVG") return '<span class="mflBoxAvg">AVG</span>';
			if (mflBoxUseAbbrev && franchiseDatabase["fid_" + fid].abbrev !== "" && mflBoxIconBase !== "" && mflBoxIconExt !== "") return '<img src="' + mflBoxIconBase + fid + '.' + mflBoxIconExt + '" title="' + franchiseDatabase["fid_" + fid].name + '" style="vertical-align:middle" /> <span style="vertical-align:middle">' + franchiseDatabase["fid_" + fid].abbrev + '</span>';
			if (mflBoxUseAbbrev && franchiseDatabase["fid_" + fid].abbrev !== "" && mflBoxUseIcon && franchiseDatabase["fid_" + fid].icon !== "") return '<img src="' + franchiseDatabase["fid_" + fid].icon + '" title="' + franchiseDatabase["fid_" + fid].name + '" style="vertical-align:middle" /> <span style="vertical-align:middle">' + franchiseDatabase["fid_" + fid].abbrev + '</span>';
			if (mflBoxUseAbbrev && franchiseDatabase["fid_" + fid].abbrev !== "" && mflBoxUseLogo && franchiseDatabase["fid_" + fid].logo !== "") return '<img src="' + franchiseDatabase["fid_" + fid].logo + '" title="' + franchiseDatabase["fid_" + fid].name + '" style="vertical-align:middle" /> <span style="vertical-align:middle">' + franchiseDatabase["fid_" + fid].abbrev + '</span>';
			if (mflBoxIconBase !== "" && mflBoxIconExt !== "") return '<img src="' + mflBoxIconBase + fid + '.' + mflBoxIconExt + '" title="' + franchiseDatabase["fid_" + fid].name + '" />';
			if (mflBoxUseIcon && franchiseDatabase["fid_" + fid].icon !== "") return '<img src="' + franchiseDatabase["fid_" + fid].icon + '" title="' + franchiseDatabase["fid_" + fid].name + '" />';
			if (mflBoxUseLogo && franchiseDatabase["fid_" + fid].logo !== "") return '<img src="' + franchiseDatabase["fid_" + fid].logo + '" title="' + franchiseDatabase["fid_" + fid].name + '" />';
			if (mflBoxUseAbbrev && franchiseDatabase["fid_" + fid].abbrev !== "") return '<span title="' + franchiseDatabase["fid_" + fid].name + '">' + franchiseDatabase["fid_" + fid].abbrev + '</span>';
			return franchiseDatabase["fid_" + fid].name;
		}

		function getMFLBoxNFLIcon(fid) {
			if (mflBoxNFLLogoPath !== "" && mflBoxNFLLogoExt !== "") return '<img src="' + mflBoxNFLLogoPath + fid + '.' + mflBoxNFLLogoExt + '" title="' + fid + '" style="vertical-align:middle;max-height:1rem;max-width:1.25rem" />';
			return fid;
		}

		function mflBoxPlayerDetailsClose() {
			$("#MFLBoxOverlay").hide();
			$("#MFLBoxPlayerDetails").hide();
			const miniScorespop = document.querySelector('#MFLBoxPlayerDetails');
			try {
				bodyScrollLock.enableBodyScroll(miniScorespop);
			} catch (er) {};
			mflBoxPlayerDetailsFid.fid = "";
		}

		function doMFLBoxPlayerDetails(fid, which) {
			mflBoxPlayerDetailsFid.fid = fid;
			mflBoxPlayerDetailsFid.boxid = which;
			var html = '';
			html += '<table align="center" cellspacing="1" class="report" id="MFLBoxPlayerDetailsTable"><caption><span>' + franchiseDatabase["fid_" + fid].name + '</span><span class="MFLBoxPlayerDetailsClose" onclick="mflBoxPlayerDetailsClose()">X</span></caption>';
			for (var i = 0; i < 4; i++) {
				if (i === 3 && !mflBoxShowNonStarter) continue;
				if ((i === 0 || i === 1) && (liveScoringWeek === completedWeek || mflBoxActiveWeek < liveScoringWeek)) {
					continue;
				}
				var html2 = '';
				if (i === 0) html += '<tr class="MFLBoxPlayerDetailsHeader"><th colspan="5">Players Games In Progress</th></tr>';
				if (i === 1) html += '<tr class="MFLBoxPlayerDetailsHeader"><th colspan="5">Players Games Scheduled</th></tr>';
				if (i === 2) html += '<tr class="MFLBoxPlayerDetailsHeader"><th colspan="5">Players Games Over</th></tr>';
				if (i === 3) html += '<tr class="MFLBoxPlayerDetailsHeader"><th colspan="5">Bench Player</th></tr>';
				var rowCount = 0;
				for (var j = 0; j < mflBoxPositionSort.length; j++) {
					try {
						if (i === 3) var mflBoxFid = mflBoxFranchise["fid_" + fid].bench;
						else var mflBoxFid = mflBoxFranchise["fid_" + fid].starter;
						for (var key in mflBoxFid) {
							if (mflBoxFid.hasOwnProperty(key)) {
								if (playerDatabase["pid_" + key].position === mflBoxPositionSort[j]) {
									var onBye = false;
									if (mflBox_byeWeek.hasOwnProperty(playerDatabase["pid_" + key].team))
										if (mflBox_byeWeek[playerDatabase["pid_" + key].team] === mflBoxActiveWeek) onBye = true;
									var doIt = false;
									var liveStatsClick = '';
									if (!onBye && (i === 0 || i === 3) && parseInt(mflBoxFid[key].gsr) > 0 && parseInt(mflBoxFid[key].gsr) < 3600) {
										var clock = mflBoxGameClock(parseInt(mflBoxFid[key].gsr) / 3600 * 100, 3);
										var actualScoreHTML = '<span class="MFLBoxLiveStatsScore" onmouseout="doMFLBoxLiveStatsClose()" onmouseover="doMFLBoxLiveStatsPopup(\'' + fid + '\',\'' + key + '\')">' + mflBoxFid[key].score + '</span><span id="MFLBoxLiveStatsWrapper_' + fid + '_' + key + '" class="MFLBoxLiveStatsWrapper" style="display:none"><span  id="MFLBoxLiveStatsContent_' + fid + '_' + key + '" class="MFLBoxLiveStatsContent"></span><span class="MFLBoxLiveStatsArrow"></span></span>';
										try {
											var paceScore = mflBoxPlayerProjected[key] * (parseInt(mflBoxFid[key].gsr) / 3600) + parseFloat(mflBoxFid[key].score)
											if (paceScore > mflBoxPlayerProjected[key]) var paceScoreHTML = '<span title="On Pace Points" class="MFLPaceScore MFLPaceScorePositive">' + paceScore.toFixed(precision) + '</span>';
											else var paceScoreHTML = '<span title="On Pace Points" class="MFLPaceScore MFLPaceScoreNegative">' + paceScore.toFixed(precision) + '</span>';
										} catch (er) {
											var paceScoreHTML = (0).toFixed(precision);
										}
										doIt = true;
									}
									if (!onBye && (i === 1 || i === 3) && parseInt(mflBoxFid[key].gsr) === 3600) {
										var clock = mflBoxGameClock(mflBoxNFLKickoff[playerDatabase["pid_" + key].team], 2);
										var actualScoreHTML = mflBoxFid[key].score;
										try {
											var paceScore = mflBoxPlayerProjected[key].toFixed(precision);
											var paceScoreHTML = '<span title="Projected Points" class="MFLPaceScore">' + paceScore + '</span>';
										} catch (er) {
											var paceScoreHTML = (0).toFixed(precision);
										}
										doIt = true;
									}
									if ((i === 2 || i === 3) && parseInt(mflBoxFid[key].gsr) === 0) {
										if (onBye) {
											var clock = "--";
										} else {
											try {
												var clock = mflBox_nflOpponents[playerDatabase["pid_" + key].team].result;
											} catch (er) {
												var clock = "";
											}
										}
										if (!onBye) var actualScoreHTML = '<span class="MFLBoxLiveStatsScore" style="cursor: pointer" onmouseout="doMFLBoxLiveStatsClose()" onmouseover="doMFLBoxLiveStatsPopup(\'' + fid + '\',\'' + key + '\')">' + mflBoxFid[key].score + '</span><span id="MFLBoxLiveStatsWrapper_' + fid + '_' + key + '" class="MFLBoxLiveStatsWrapper" style="display:none"><span  id="MFLBoxLiveStatsContent_' + fid + '_' + key + '" class="MFLBoxLiveStatsContent"></span><span class="MFLBoxLiveStatsArrow"></span></span>';
										else var actualScoreHTML = "--";
										if (onBye) {
											var paceScoreHTML = "--";
										} else {
											try {
												var paceScore = mflBoxPlayerProjected[key];
												var paceScoreHTML = '<span title="Original Projection" class="MFLPaceScore">' + paceScore.toFixed(precision) + '</span>';
												if (parseFloat(mflBoxFid[key].score) > mflBoxPlayerProjected[key]) var actualScoreHTML = '<span class="MFLPaceScorePositive">' + actualScoreHTML + '</span>';
												else var actualScoreHTML = '<span class="MFLPaceScoreNegative" style="cursor: pointer;">' + actualScoreHTML + '</span>';
											} catch (er) {
												var paceScoreHTML = (0).toFixed(precision);
											}
										}
										doIt = true;
									}
									if (doIt) {
										if (onBye) {
											var opponent = 'BYE';
										} else {
											try {
												if (mflBox_nflOpponents[playerDatabase["pid_" + key].team].isHome) var opponent = "v " + mflBox_nflOpponents[playerDatabase["pid_" + key].team].opponent;
												else var opponent = "@ " + mflBox_nflOpponents[playerDatabase["pid_" + key].team].opponent;
											} catch (er) {
												var oppenent = '';
											}
										}
										try {
											var injuryHTML = ' (<span style="color:red" title="' + mfl_injuries["player"]["pid_" + key].details + '">' + mfl_injuries["player"]["pid_" + key].code + '</span>)';
										} catch (er) {
											var injuryHTML = '';
										}
										if (rowCount % 2) var rowClass = "eventablerow";
										else rowClass = "oddtablerow";
										if (i === 3) {
											if (parseInt(mflBoxFid[key].gsr) === 3600) html2 += '<tr class="' + rowClass + '"><td colspan="2">' + playerDatabase["pid_" + key].name + ' ' + playerDatabase["pid_" + key].team + ' ' + playerDatabase["pid_" + key].position + injuryHTML + '</td><td style="text-align:center;white-space:nowrap">' + opponent + '</td><td style="text-align:center">' + paceScoreHTML + ' </td><td style="text-align:center">-- </td></tr>';
											else html2 += '<tr class="' + rowClass + '"><td colspan="2">' + playerDatabase["pid_" + key].name + ' ' + playerDatabase["pid_" + key].team + ' ' + playerDatabase["pid_" + key].position + injuryHTML + '</td><td style="text-align:center;white-space:nowrap">' + opponent + '</td><td style="text-align:center">' + paceScoreHTML + ' </td><td style="text-align:center">' + actualScoreHTML + ' </td></tr>';
										} else if (i === 1) html2 += '<tr class="' + rowClass + '"><td>' + playerDatabase["pid_" + key].name + ' ' + playerDatabase["pid_" + key].team + ' ' + playerDatabase["pid_" + key].position + injuryHTML + '</td><td style="text-align:center;white-space:nowrap">' + opponent + '</td><td colspan="2" style="text-align:center">' + clock + '</td><td style="text-align:center">' + paceScoreHTML + ' </td></tr>';
										else html2 += '<tr class="' + rowClass + '"><td>' + playerDatabase["pid_" + key].name + ' ' + playerDatabase["pid_" + key].team + ' ' + playerDatabase["pid_" + key].position + injuryHTML + '</td><td style="text-align:center;white-space:nowrap">' + opponent + '</td><td style="text-align:center">' + clock + '</td><td style="text-align:center">' + paceScoreHTML + ' </td><td style="text-align:center">' + actualScoreHTML + ' </td></tr>';
										rowCount++;
									}
								}
							}
						}
					} catch (er) {}
				}
				if (html2 === '') html += '<tr class="oddtablerow"><td colspan="5" class="MFLBoxPlayerDetailsNone">NONE</td></tr>';
				else {
					if (i === 0) html += '<tr class="MFLBoxPlayerDetailsSubHeader"><th style="text-align:left">Player</th><th>Opp</th><th>Clock</th><th>Pace</th><th>Actual</th></tr>';
					if (i === 1) html += '<tr class="MFLBoxPlayerDetailsSubHeader"><th style="text-align:left">Player</th><th>Opp</th><th colspan="2">Game Time</th><th>Proj.</th></tr>';
					if (i === 2) html += '<tr class="MFLBoxPlayerDetailsSubHeader"><th style="text-align:left">Player</th><th>Opp</th><th>Result</th><th>Proj.</th><th>Actual</th></tr>';
					if (i === 3) html += '<tr class="MFLBoxPlayerDetailsSubHeader"><th colspan="2" style="text-align:left">Player</th><th>Opp</th><th>Proj/Pace</th><th>Actual</th></tr>';
					html += html2;
				}
			}
			if (mflBoxIncludeTiebreaker) {
				html += '<tr class="MFLBoxPlayerDetailsHeader"><th colspan="5">Tiebreaker(s)</th></tr>';
				var rowCount = 0;
				for (var pidKey in mflBoxTiebreaker["fid_" + fid]) {
					if (mflBoxTiebreaker["fid_" + fid].hasOwnProperty(pidKey)) {
						if (rowCount % 2) var rowClass = "eventablerow";
						else rowClass = "oddtablerow";
						html += '<tr class="' + rowClass + '"><td colspan="5">' + playerDatabase[pidKey].name + ' ' + playerDatabase[pidKey].team + ' ' + playerDatabase[pidKey].position + '</td></tr>';
						rowCount++;
					}
				}
			}
			html += '</tbody></table>';
			$("#MFLBoxOverlay").show();
			const miniScorespop = document.querySelector('#MFLBoxPlayerDetails');
			try {
				bodyScrollLock.disableBodyScroll(miniScorespop);
			} catch (er) {};
			$("#MFLBoxPlayerDetails").html(html).show();
			$('#MFLBoxPlayerDetails td span.MFLBoxLiveStatsScore:contains("undefined")').parents('td').replaceWith('<td style="text-align:center">-- </td>');
		}

		function doMFLBoxHTML(doScroll) {
			//console.log("doMFLBoxHTML ran");
			var html = '';
			if (mflBoxMFLSchedule && !mflBoxHideFantasyMatchups) {
				//console.log("mflBoxMFLSchedule html ran");
				html += '<table class="MFLGameLinks fantasyBoxMatchup"><tbody><tr>';
				if (mflBox_matchups.length === 0) html += '<td class="warning" style="text-align:center!important">NO MATCHUPS FOUND - STARTERS MAY BE HIDDEN UNTIL KICKOFF</td>';
				for (var i = 0; i < mflBox_matchups.length; i++) {
					html += '<td class="matchupLolite">';
					html += ' <table class="MFLGameTable matchupLolite" id="mflBoxMatchup_' + i + '">';
					html += '  <tbody>';
					if (mflBoxActiveWeek <= completedWeek || mflBoxActiveWeek === liveScoringWeek) html += '   <tr class="MFLBoxPlayerDetailsTR" onclick="doMFLBoxPlayerDetails(\'' + mflBox_matchups[i].roadId + '\',' + i + ')">';
					else html += '   <tr>';
					html += '    <td class="MFLLiveTeam">' + getMFLBoxNameIcon(mflBox_matchups[i].roadId) + '</td>';
					html += '    <td class="MFLPaceSpread" id="mflBoxSpread_' + mflBox_matchups[i].roadId + '_' + i + '"></td>';
					html += '    <td class="MFLPaceScore" id="mflBoxPace_' + mflBox_matchups[i].roadId + '_' + i + '"></td>';
					html += '    <td class="MFLLiveScore" id="mflBoxScore_' + mflBox_matchups[i].roadId + '_' + i + '" style="text-align:right"></td>';
					html += '    <td class="MFLWinMarker" id="mflBoxWin_' + mflBox_matchups[i].roadId + '_' + i + '"></td>';
					if (mflBoxCheckLive()) {
						html += '    <td class="MFLExtras MFLExtrasPMR MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" id="mflBoxPMR_' + mflBox_matchups[i].roadId + '_' + i + '"></td>';
						html += '    <td class="MFLExtras MFLExtrasYTP MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" id="mflBoxYTP_' + mflBox_matchups[i].roadId + '_' + i + '"></td>';
						html += '    <td class="MFLExtras MFLExtrasCP MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" id="mflBoxCP_' + mflBox_matchups[i].roadId + '_' + i + '"></td>';
					}
					html += '   </tr>';
					if (mflBoxActiveWeek <= completedWeek || mflBoxActiveWeek === liveScoringWeek) html += '   <tr class="MFLBoxPlayerDetailsTR" onclick="doMFLBoxPlayerDetails(\'' + mflBox_matchups[i].homeId + '\',' + i + ')">';
					else html += '   <tr>';
					html += '    <td class="MFLLiveTeam">' + getMFLBoxNameIcon(mflBox_matchups[i].homeId) + '</td>';
					html += '    <td class="MFLPaceSpread" id="mflBoxSpread_' + mflBox_matchups[i].homeId + '_' + i + '"></td>';
					html += '    <td class="MFLPaceScore" id="mflBoxPace_' + mflBox_matchups[i].homeId + '_' + i + '"></td>';
					html += '    <td class="MFLLiveScore" id="mflBoxScore_' + mflBox_matchups[i].homeId + '_' + i + '" style="text-align:right"></td>';
					html += '    <td class="MFLWinMarker" id="mflBoxWin_' + mflBox_matchups[i].homeId + '_' + i + '"></td>';
					if (mflBoxCheckLive()) {
						html += '    <td class="MFLExtras MFLExtrasPMR MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" id="mflBoxPMR_' + mflBox_matchups[i].homeId + '_' + i + '"></td>';
						html += '    <td class="MFLExtras MFLExtrasYTP MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" id="mflBoxYTP_' + mflBox_matchups[i].homeId + '_' + i + '"></td>';
						html += '    <td class="MFLExtras MFLExtrasCP MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" id="mflBoxCP_' + mflBox_matchups[i].homeId + '_' + i + '"></td>';
					}
					html += '   </tr>';
					html += '   <tr>';
					html += '    <td colspan="5" class="MFLLiveClock" style="position:relative" id="mflBoxClock_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '"></td>';
					if (mflBoxCheckLive()) {
						html += '    <td class="MFLExtras MFLExtrasPMR MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" title="Player Minutes Remaining">PMR</td>';
						html += '    <td class="MFLExtras MFLExtrasYTP MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" title="Players Yet To Play">YTP</td>';
						html += '    <td class="MFLExtras MFLExtrasCP MFLExtras_' + mflBox_matchups[i].roadId + '_' + mflBox_matchups[i].homeId + '" title="Players Currently Playing">CP</td>';
					}
					html += '   </tr>';
					html += '  </tbody>';
					html += ' </table>';
					html += '</td>';
				}
				html += '</tr></tbody></table>';
			} else if (!mflBoxHideNFLMatchups) {
				//console.log("mflBoxMFLSchedule html NFL boxes ran");
				html += '<table class="MFLGameLinks NFLBoxMatchup"><tbody><tr>';
				if (mflBox_nflSchedule.length !== undefined) {
					for (var i = 0; i < mflBox_nflSchedule.length; i++) {
						var gameSecRem = parseInt(mflBox_nflSchedule[i].gameSecondsRemaining);
						if (gameSecRem < 3500) {
							html += `<td class="matchupLolite" style="position:relative"><a class="boxmatchLink" style="display:none;position:absolute;width:100%;height:100%;z-index:1;" href="${baseURLDynamic}/${year}/pro_matchup?L=${league_id}&W=${mflBoxActiveWeek}&MATCHUP=${mflBox_nflSchedule[i].homeId},${mflBox_nflSchedule[i].roadId}"></a>`;
						} else {
							html += `<td class="matchupLolite" style="position:relative">`;
						}
						html += ' <table class="MFLGameTable matchupLolite" id="mflBoxMatchup_' + i + '">';
						html += '  <tbody>';
						html += '   <tr>';
						html += '    <td class="MFLLiveTeam">' + getMFLBoxNFLIcon(mflBox_nflSchedule[i].roadId) + ' <span class="MFLLiveAbbrev" style="vertical-align:middle">' + mflBox_nflSchedule[i].roadId + '</span></td>';
						html += '    <td class="MFLPaceSpread" id="mflBoxSpread_' + mflBox_nflSchedule[i].roadId + '_' + i + '"></td>';
						html += '    <td class="MFLPaceScore" id="mflBoxPace_' + mflBox_nflSchedule[i].roadId + '_' + i + '"></td>';
						html += '    <td class="MFLLiveScore" id="mflBoxScore_' + mflBox_nflSchedule[i].roadId + '_' + i + '" style="text-align:right"></td>';
						html += '    <td class="MFLWinMarker" id="mflBoxWin_' + mflBox_nflSchedule[i].roadId + '_' + i + '"></td>';
						html += '   </tr>';
						html += '   <tr>';
						html += '    <td class="MFLLiveTeam">' + getMFLBoxNFLIcon(mflBox_nflSchedule[i].homeId) + ' <span class="MFLLiveAbbrev" style="vertical-align:middle">' + mflBox_nflSchedule[i].homeId + '</span></td>';
						html += '    <td class="MFLPaceSpread" id="mflBoxSpread_' + mflBox_nflSchedule[i].homeId + '_' + i + '"></td>';
						html += '    <td class="MFLPaceScore" id="mflBoxPace_' + mflBox_nflSchedule[i].homeId + '_' + i + '"></td>';
						html += '    <td class="MFLLiveScore" id="mflBoxScore_' + mflBox_nflSchedule[i].homeId + '_' + i + '" style="text-align:right"></td>';
						html += '    <td class="MFLWinMarker" id="mflBoxWin_' + mflBox_nflSchedule[i].homeId + '_' + i + '"></td>';
						html += '   </tr>';
						html += '   <tr>';
						html += '    <td colspan="5" class="MFLLiveClock" id="mflBoxClock_' + mflBox_nflSchedule[i].roadId + '_' + mflBox_nflSchedule[i].homeId + '"></td>';
						html += '   </tr>';
						html += '  </tbody>';
						html += ' </table>';
						html += '</td>';
					}
				}
				html += '</tr></tbody></table>';
			}
			//console.log(html)
			jQuery("#MFLBoxMatchups").html(html);
			if (doScroll) jQuery('#MFLBoxMatchups').scrollLeft(0);
			if (mflBoxCheckLive()) {
				mflBoxApplyLiveSettings();
			} else if (mflBoxCheckCompletedWeek()) {
				mflBoxApplyCompletedSettings();
				try {
					mflBoxProjectedScoresHistorical();
				} catch (er) {}
			} else {
				mflBoxApplyUncompletedSettings();
			}
			//CHECK IF DETAILS POPPED
			if (mflBoxMFLSchedule && mflBoxPlayerDetailsFid.fid !== '') doMFLBoxPlayerDetails(mflBoxPlayerDetailsFid.fid, mflBoxPlayerDetailsFid.boxid);
			if (mflBoxShowMFLByeTeams) {
				addHeadStyleOnce('css-2eb4dcec', '#MFLBoxContainer .MFLGameLinks.fantasyBoxMatchup{width:100%}')
			};
			if (mflBoxHideNFLMatchups) {
				addHeadStyleOnce('css-2c106b0d', '#MFLBoxNFLCell,#MFLBoxMFLCell{display:none!important}');
			}
			if (mflBoxHidePaceScores) {
				addHeadStyleOnce('css-f3634b97', '.MFLGameTable .MFLPaceScore,.MFLGameTable .MFLPaceScore .warning{font-size:0!important;color:transparent!important}');
			}
		}

		function mflBoxLeagueSettings() {
			//console.log("mflBoxLeagueSettings ran");
			mflBoxStartWeek = startWeek;
			mflBoxLastRegularSeasonWeek = standingsEndWeek;
			if (endWeek === undefined)
				mflBoxEndWeek = 18;
			else
				mflBoxEndWeek = endWeek;

			if (completedWeek === liveScoringWeek) {
				mflBoxCurrentWeek = completedWeek;
				//ON MONDAY NIGHT COMPLETED WEEK MAY EQUAL LIVESCORING WEEK BUT WEEKLYRESULTS NOT UPDATED WHICH CAUSES ZEROES TO SHOW.  WE NEED TO MAKE SURE WE HAVE SCORES
				if (mflBoxCheckWeeklyResultsForScore(mflBoxCurrentWeek))
					mflBoxCurrentLiveScoring = false;
				else
					mflBoxCurrentLiveScoring = true;
			} else {
				mflBoxCurrentWeek = liveScoringWeek;
				mflBoxCurrentLiveScoring = true;
			}
			if (mflBoxCurrentWeek > mflBoxEndWeek) {
				mflBoxCurrentWeek = mflBoxEndWeek;
				mflBoxCurrentLiveScoring = false;
			}
			if (liveScoringWeek === 0) mflBoxCurrentLiveScoring = false;
			if (mflBoxCurrentWeek < 1) mflBoxCurrentWeek = 1;
			//SET THE ACTIVE WEEK
			mflBoxActiveWeek = mflBoxCurrentWeek;

			for (var i = 0; i < reportNflByeWeeks_ar.nflByeWeeks.team.length; i++) {
				mflBox_byeWeek[reportNflByeWeeks_ar.nflByeWeeks.team[i].id] = parseInt(reportNflByeWeeks_ar.nflByeWeeks.team[i].bye_week);
			}
		}

		function doMFLBoxLiveStats() {
			if (liveScoringWeek < 1 || mflBoxActiveWeek > liveScoringWeek) {
				for (var team in mflBoxNflGameStatus) {
					if (mflBoxNflGameStatus.hasOwnProperty(team)) {
						mflBoxNflGameStatus[team].clock = mflBoxNflGameTime(mflBoxNflGameStatus[team].time);
						mflBoxNflGameStatus[team].secs_left = 3600;
						mflBoxNflGameStatus[team].status = "SCHED";
						if (!mflBoxLiveStatsTeam.hasOwnProperty(team)) mflBoxLiveStatsTeam[team] = [];
						mflBoxLiveStatsTeam[team].TPS = "";
						mflBoxLiveStatsTeam[team].TPA = "";
					}
				}
				doMFLBoxArrays();
				return true;
			} else if ((mflBoxActiveWeek !== liveScoringWeek || mflBoxActiveWeek === completedWeek) && !mflBoxMFLSchedule) {
				for (var team in mflBoxNflGameStatus) {
					if (mflBoxNflGameStatus.hasOwnProperty(team)) {
						var thisScore = mflBoxNflGameStatus[team].score ?? 0;
						delete mflBoxNflGameStatus[team].clock;
						mflBoxNflGameStatus[team].secs_left = 0;
						mflBoxNflGameStatus[team].status = "OVER";
						if (!mflBoxLiveStatsTeam.hasOwnProperty(team)) mflBoxLiveStatsTeam[team] = [];
						mflBoxLiveStatsTeam[team].TPS = thisScore;
						mflBoxLiveStatsTeam[team].TPA = "";
					}
				}
				doMFLBoxArrays();
				return true;
			} else if (mflBoxActiveWeek === liveScoringWeek) {
				var now;
				if (!Date.now) now = new Date().getTime();
				else now = Date.now();
				data = "CACHE";
				mflBoxParseLiveStats(data, now);
				doMFLBoxArrays();
				return true;
			} else {
				var now;
				if (!Date.now) now = new Date().getTime();
				else now = Date.now();
				var week = (mflBoxActiveWeek < 10) ? "0" + mflBoxActiveWeek : mflBoxActiveWeek;
				var url = xmlBaseURL + 'live_stats_';
				url = url + "idp_";
				url = url + week + '.txt?RANDOM=' + now;
				jQuery.ajax({
					url: url,
					success: function (data) {
						mflBoxParseLiveStats(data, now);
						doMFLBoxArrays();
						data = null;
					},
					async: false
				});
			}
		}

		function doMFLBoxLiveUpdate(doScroll) {
			if (!doMFLBox) return;
			if (mflBoxActiveWeek !== liveScoringWeek) return;
			//console.log("TEST Ran doMFLBoxLiveUpdate");
			Promise.all([
				doMFLBoxFantasyWeek(),
				doMFLBoxNFLWeek(),
				doMFLBoxProjectedScores()
			]).then(() => {
				doMFLBoxLiveStats();
				doMFLBoxHTML(doScroll);
				//console.log("refreshing box score . . .");
			});
		}

		function doMFLBoxUpdate(doScroll) {
			//console.log("TEST Ran doMFLBoxUpdate");
			Promise.all([
				doMFLBoxFantasyWeek(),
				doMFLBoxNFLWeek(),
				doMFLBoxProjectedScores()
			]).then(() => {
				doMFLBoxLiveStats();
				doMFLBoxHTML(doScroll);
				//console.log("refreshing box score . . .");
			});
		}

		try {
			window.MFLGlobalCache.onReady(() => {
				if (!doMFLBox) return;
				if (mflBoxHideFantasyMatchups) {
					mflBoxMFLSchedule = false;
				}
				mflBoxLeagueSettings();
				Promise.all([
					doMFLBoxFantasyWeek(),
					doMFLBoxNFLWeek(),
					doMFLBoxProjectedScores()
				]).then(() => {
					doMFLBoxLiveStats();
					doMFLBoxArrows();
					doMFLBoxHTML(true);
				});
			});
		} catch {
			console.log("MFL CACHE DID NOT LOAD");
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END MINI BOX SCORE////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START MARQUEE SCRIPT//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
if (load_marquee) {
	//////////////////////////////////////////////////////////////////////////////////////////////////
	//     https://www.mflscripts.com/mfl-apps/marquee/script.js
	//////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	//DO NOT EDIT BELOW HERE
	///////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	if (marq_offseason_hide === undefined) var marq_offseason_hide = false;
	if (deactivate_all_offseason === undefined) var deactivate_all_offseason = false;
	if ((is_offseason && marq_offseason_hide) || (is_offseason && deactivate_all_offseason)) {
		$('.ticker-wrapper').parent('.mobile-wrap').remove();
		$('.ticker-wrapper').remove();
		//console.log("Offseason - Marquee Script");
	} else {
		//MARQUEE VERSION NUMBER
		//console.log('MARQUEE SCRIPT LAST UPDATED 11-12-21');

		if (tickerHomePageOnly === undefined) var tickerHomePageOnly = true; // SET TO TRUE IF YOU HAVE TICKER AS A HEADER MESSAGE BUT ONLY WANT IT ON HOME PAGE; FALSE FOR ALL PAGES
		var doTicker = false;
		if (tickerHomePageOnly) {
			if (window.location.href.indexOf("/home/") > -1) doTicker = true;
			if (window.location.href.toUpperCase().indexOf("MODULE=") > -1) doTicker = false;
		} else {
			doTicker = true;
		}

		if (doTicker) {

			var currentMessage = 0;
			var counter = 0;
			var counter_interval;
			var tickerIndexTracker = [];

			// TICKER SPEED
			var tickerSpeedIndex = [2, 3, 4, 5, 6, 7, 8];
			var tickerSpeedMax = 6;
			var tickerSpeedMin = 0;
			var tickerSpeedBase = 3;
			var minimum_duration = 2;

			var tickerAllPlayId = '0001';
			if (typeof franchise_id !== "undefined")
				if (franchise_id !== "0000") tickerAllPlayId = franchise_id;
			//IF TICKERCONTENT ARRAY IS MISSING IN USER SETTINGS
			if (tickerContent === undefined) var tickerContent = [];
			// TICKER DISPLAY DEFAULT SETTINGS
			if (tickerName === undefined) var tickerName = "Headlines"; // ENTER TICKER NAME - IF NOT NAMED "Headlines" THEN ADJUST THE NEXT TWO SETTINGS TO REPOSITION TICKER AND HEADING
			if (responsiveTicker === undefined) var responsiveTicker = true; // SET TO TRUE IF YOUR MFL THEME/SKIN IS RESPONSIVE FOR MOBILE SO THAT THE MARQUEE WILL BE ALSO
			if (isLeagueIDP === undefined) var isLeagueIDP = false; // SET TO TRUE IF YOU WANT TO INCLUDE IDP OPTIONS; IF FALSE THEN ALL IDP SETTINGS BELOW WILL BE IGNORED	
			if (tickerSize === undefined) var tickerSize = "medium"; // ENTER TICKER SIZE "small" , "medium" or "large" 
			if (tickerLastPlayoffWeek === undefined) var tickerLastPlayoffWeek = 16; // SET TO LAST PLAYOFF WEEK 
			if (tickerSpeedDefault === undefined) var tickerSpeedDefault = 2; // # - SET DEFAULT SCROLL SPEED FROM 0 (slowest) to 6 (fastest)
			if (tickerDelay === undefined) var tickerDelay = 3; //SECONDS TO DELAY BEFORE SCROLLING

			//SET TICKER SPEED TO USER PREFERENCE OR DEFAULT OF USER PREFERENCE IS NOT DEFINED
			if (localStorage.hasOwnProperty("ticker_speed_" + league_id))
				var tickerSpeed = parseInt(localStorage.getItem("ticker_speed_" + league_id));
			else
				var tickerSpeed = tickerSpeedDefault;

			//OTHER VARS DEFAULTED TO SYSTEM
			var tickerStartWeek = startWeek;
			var tickerEndWeek = endWeek;
			var tickerLastRegularWeek = standingsEndWeek;
			var tickerCompletedWeek = completedWeek;
			var tickerLiveScoringWeek = liveScoringWeek;
			if (tickerLiveScoringWeek === 0) tickerLiveScoringWeek = 1;

			var isPlayoffLeague = false;
			var scrollingTriggered = false;

			if (localStorage.hasOwnProperty("ticker_tickerSize_" + league_id)) tickerSize = localStorage.getItem("ticker_tickerSize_" + league_id);
			if (tickerSize !== 'large' && tickerSize !== 'medium' && tickerSize !== 'small') tickerSize = 'medium';


			//BOTH STANDARD AND LIVE DISPLAY (also includes custom messages above if any)
			if (includeFranchiseIcons === undefined) var includeFranchiseIcons = false; // true or false; when showing players include franchise icon if on a MFL roster REQUIRES cache.js
			if (includeLatestArticles === undefined) var includeLatestArticles = 5; // 0=disabled; #=The number of articles to show
			//STANDARD DISPLAY SETTINGS (when nfl games have not kicked off in a week)
			if (includeTopPlayerStats === undefined) var includeTopPlayerStats = 3; // 0=disabled; #=The number of top yardage (Pass/Rush/Rec/Kick) to show;
			if (includeTopPlayerStatsIDP === undefined) var includeTopPlayerStatsIDP = false; // true or false; only applicable when displaying top players and shows the number of top tackles/sacks for IDP;
			if (includeTopPlayerPts === undefined) var includeTopPlayerPts = 3; // 0=disabled; #=The number of ytd fantasy pts by position offense to show;
			if (includePowerRank === undefined) var includePowerRank = false; // true or false; show power rank
			if (includeAltPowerRank === undefined) var includeAltPowerRank = false; // true or false; show alternate power rank
			if (includePointScoredTeam === undefined) var includePointScoredTeam = false; // true or false; show franchise point scored ranking
			if (includeAllplayRecord === undefined) var includeAllplayRecord = false; // true or false; show all play ranking
			if (includeLastWeekResults == undefined) var includeLastWeekResults = true; // true or false; show results for fantasy matchups
			if (includeNextWeekMatchups == undefined) var includeNextWeekMatchups = true; // true or false; show next weeks fantasy matchups
			if (includeLastWeekNflResults === undefined) var includeLastWeekNflResults = true; // true or false; show results for nfl matchups
			if (includeNextWeekNflMatchups === undefined) var includeNextWeekNflMatchups = true; // true or false; show next weeks nfl matchups
			if (includeWaiverOrder === undefined) var includeWaiverOrder = true; // true or false; current waiver priority
			if (includeDraft === undefined) var includeDraft = false; // true or false; used in conjunction with below draft settings
			if (draftShowEntire === undefined) var draftShowEntire = false; // true or false; show entire draft; both picks made and future pending selections
			if (draftTopPicksOnly === undefined) var draftTopPicksOnly = 0; // #=Display the top # of picks in the draft; only appicable if draftShowEntire = false;
			if (draftShowPicksMade === undefined) var draftShowPicksMade = 5; // #=Display the last # of picks made; only appicable if draftShowEntire = false;
			if (draftShowPicksPending === undefined) var draftShowPicksPending = 5; // #=Display the next # of picks pending; only appicable if draftShowEntire = false;
			//LIVE DISPLAY SETTINGS (when nfl games have kicked off in a week)
			if (includeLiveLeaders === undefined) var includeLiveLeaders = 5; // 0=disabled; #=The number of live leaders (Pass/Rush/Rec), when applicable, to show;
			if (includeLiveLeadersIDP === undefined) var includeLiveLeadersIDP = false; // true or false; only applicable when displaying live leaders
			if (includeNflMatchups === undefined) var includeNflMatchups = true; // true or false; show live NFL matchups
			if (includeNflMatchupLeaders === undefined) var includeNflMatchupLeaders = true; // true or false; show live NFL matchup leaders
			if (includeFantasyMatchups === undefined) var includeFantasyMatchups = true; // true or false; show live Fantasy matchups

			// TICKER DEFAULT COLORING - LIGHT SKIN
			// NOTES: tickerWidth - when used inside the container wrap set to "100%" , when used outside the container wrap set to "calc(71.75rem - 0.375rem)"
			if (tickerWidth === undefined) var tickerMargin = "100%"; // set max width of ticker - set to 100% if you want it full width
			// NOTES: tickerWidth - when used inside the container wrap set to "0 auto 0.625rem auto" , when used outside the container wrap set to "0.625rem auto 0 auto"
			if (tickerMargin === undefined) var tickerMargin = "0 auto 0.625rem auto"; // set ticker margin - currently set for margin top 0.625rem , margin bottom 0 and side to side auto to center  
			if (tickerFont === undefined) var tickerFont = "Roboto Condensed"; // set font for ticker - default is Roboto Condensed
			if (bigHeadingBG === undefined) var bigHeadingBG = "var(--accent, #B82601)"; // set color of background behind text "Headlines" and the border of the ticker
			if (bigHeadingClr === undefined) var bigHeadingClr = "#fff"; // set color of the text for "Headlines"
			if (tickerHeadBG === undefined) var tickerHeadBG = "#fff"; // set the bg color for the ticker header
			if (tickerTxtShdw === undefined) var tickerTxtShdw = "transparent"; // set the color of the drop shadow for "Headlines" text and icons set to "transparent" to remove
			if (tickerHeadClr === undefined) var tickerHeadClr = "var(--accent, #B82601)"; // set the text color for the ticker header
			if (tickerTxtBG === undefined) var tickerTxtBG = "#eee"; // set the bg color for the ticker scrolling text
			if (tickerTxtClr === undefined) var tickerTxtClr = "#000"; // set the text color for the ticker scrolling text
			if (tickerTxtWgt === undefined) var tickerTxtWgt = "300"; // set the color for the links in scrolling// set the text weight for the ticker scrolling text
			if (tickerTxtTrans === undefined) var tickerTxtTrans = "none"; // set the color for the links in scrolling// set the text weight for the ticker scrolling text
			if (tickerLinkClr === undefined) var tickerLinkClr = "#000"; // set the color for the links in scrolling text
			if (tickerLinkHvr === undefined) var tickerLinkHvr = "var(--accent, #B82601)"; // set the color for the links on hover in scrolling text
			if (tickerBoxShdw === undefined) var tickerBoxShdw = "0 0 0.188rem 0.188rem rgba(0,0,0,0.1)"; // set box shadow - if you dont want shadow set to "none"
			if (controlsGreen === undefined) var controlsGreen = "green"; // set color for the controls boxes when positive setting - current color green
			if (controlsRed === undefined) var controlsRed = "red"; // set color for the controls boxes when negative setting - current color red
			if (tickerBorder === undefined) var tickerBorder = bigHeadingBG;
			if (tickerCogWheel === undefined) var tickerCogWheel = tickerHeadClr;

			//Make sure tickerSpeed is a number and not greater than Max or less than Min
			tickerSpeed = parseInt(tickerSpeed, 10);
			if (isNaN(tickerSpeed)) tickerSpeed = tickerSpeedDefault;
			else if (tickerSpeed > tickerSpeedMax) tickerSpeed = tickerSpeedMax;
			else if (tickerSpeed < tickerSpeedMin) tickerSpeed = tickerSpeedMin;

			//Make sure tickerDelay is a number and not greater that 6 seconds
			tickerDelay = parseInt(tickerDelay, 10);
			if (isNaN(tickerDelay)) tickerDelay = 3;
			if (tickerDelay > 6) tickerDelay = 6;
			if (tickerDelay < 1) tickerDelay = 1;
			var tickerOnloadDelay = tickerDelay + 2;
			if (tickerOnloadDelay > 6) tickerOnloadDelay = 6;

			// LIVE STATS ARRAYS
			var tickerLiveStatsPlayer = [];
			var tickerLiveStatsTeam = [];
			var tickerNflGameStatus = [];
			var tickerNflGameResults = [];
			var tickerNflGameNext = [];
			var tickerNFLKickoff = [];
			var liveUpdateScheduled = false;
			var draftResultsInterval;
			var fantasyMatchupsInterval;

			//Advance currentMessage to latest stored message
			if (sessionStorage.getItem("ticker_position_" + league_id)) currentMessage = parseInt(sessionStorage.getItem("ticker_position_" + league_id));

			// UNWRAP TICKER WHEN PLACED IN HPM TAB FROM MFL WRAPPER
			jQuery('.mobile-wrap > .ticker-wrapper').unwrap();

			// APPEND TICKER NAME AND BUTTONS
			jQuery('.ticker-wrapper').append('<div class="bigHeading"><i class="fa-regular fa-circle-pause icon_state_pause" aria-hidden="true" title="Pause Ticker"></i><i class="fa-regular fa-circle-play icon_state_play" aria-hidden="true" title="Resume Ticker" style="display:none"></i><i class="fa-regular fa-forward-step icon_state_skip" aria-hidden="true" title="Skip Forward"></i><span>' + tickerName + '<span></div><div class="ticker-core-wrapper"><div class="ticker-header"><div class="title"></div><span class="settings_cog_span" style="position:absolute;z-index:1;right:0.313rem;top:50%;transform:translateY(-50%);cursor:pointer"><i title="Display Settings" class="fa-regular fa-gear ticker_setting" aria-hidden="true" style="font-size:0.875rem;color:' + tickerCogWheel + '"></i></span></i></div><div class="ticker-update" title="Ticker Paused On Hover"></div></div>').after('<div class="ticker-update-dummy"></div><div class="marquee_settings_table"><table align="center" cellspacing="1"><caption><span>Marquee Settings</span></caption><tbody><tr><th colspan="3" style="text-align:center">Control Ticker Speed</th></tr><tr class="oddtablerow"><td colspan="3"><div class="ticker_controls"></div></td></tr><tr><th colspan="3" style="text-align:center">Play / Pause / Skip</th></tr><tr class="eventablerow"><td colspan="3" style="text-align: center"><i class="fa-regular fa-circle-play icon_state_play" aria-hidden="true" title="Resume Ticker"></i><i class="fa-regular fa-circle-pause icon_state_pause" aria-hidden="true" title="Pause Ticker"></i><i class="fa-regular fa-forward-step icon_state_skip" aria-hidden="true" title="Skip Forward"></i></td></tr><tr><th colspan="3" style="text-align:center">Display Options</th></tr></tbody><tbody id="tbody_display_settings"></tbody></table></div>');

			// APPEND TICKER CSS
			jQuery("head").append('<style>.ticker-wrapper{overflow:hidden;position:relative;margin:' + tickerMargin + ';max-width:' + tickerWidth + ';border:0.125rem solid ' + tickerBorder + ';font-family:' + tickerFont + '!important;border-radius:0.188rem;box-shadow:' + tickerBoxShdw + '}.ticker-core-wrapper{overflow:hidden}.bigHeading{white-space: nowrap;background:' + bigHeadingBG + ';color:' + bigHeadingClr + ';display:block;position:absolute;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.188rem;font-weight:600;z-index:2;height:2.25rem;line-height:2.25rem}.bigHeading::before{content:"";width:0;position:absolute;border-width: 2.25rem 2.25rem 0 0;border-style:solid;top:0;z-index:-1}.bigHeading::before{border-color: ' + bigHeadingBG + ' transparent transparent transparent;right:-2.25rem}.icon_state_pause,.icon_state_play,.icon_state_skip{font-weight:300;font-size:1.125rem;width:1.563rem;text-align:right;line-height:2.25rem}.icon_state_skip{font-size:1rem;text-align:center}.ticker-header{white-space:nowrap;height:1.125rem;line-height: 1.125rem;position:relative;color:' + tickerHeadClr + ';text-transform:uppercase;font-size:0.75rem;font-weight:600;background:' + tickerHeadBG + ';font-style:italic}.ticker-update{height:1.125rem;line-height: 1.125rem;background:' + tickerTxtBG + ';position:relative;color:' + tickerTxtClr + ';font-size:0.75rem;align-items:center}.animation{white-space:nowrap;position:absolute;margin:0;text-align:left;animation:moving linear;font-weight:' + tickerTxtWgt + ';text-transform:' + tickerTxtTrans + '}.animation a,.animation a:link,.animation a:active,.animation a:visited{font-family:' + tickerFont + '!important;display:block;color:' + tickerLinkClr + ';outline:none;text-decoration:none}.animation a:hover,.animation a:link:hover,.animation a:active:hover,.animation a:visited:hover{color:' + tickerLinkHvr + '}.ticker-update:hover .animation{animation-play-state:paused!important;cursor:pointer}.bigHeading i,.bigHeading i:hover,.ticker-update:hover{cursor:pointer}.ticker-update-dummy{position:fixed;top:0;left:0;font-family:' + tickerFont + '!important;height:1.125rem;text-transform:' + tickerTxtTrans + ';font-size:0.75rem;visibility:hidden;align-items:center;white-space:nowrap}.bigHeading,.ticker_setting{text-shadow:-0.188rem 0.188rem ' + tickerTxtShdw + '}.animation span{display:inline-flex;align-items:center;vertical-align:top}.animation a span{display:inline-block}.franchise_icon_ticker,.redzone_ticker,.has_ball_ticker{vertical-align:middle;height:1rem;width:auto;padding:0.188rem 0}.redzone_ticker,.has_ball_ticker{height:0.75rem}.settings_cog_span:after{content:".";position:absolute;width:93.75rem;z-index:-1;left:-81.25rem;color:transparent}.franchise_icon_ticker.icon_ticker_nfl{height:0.875rem;max-width:1.25rem}.matchup-leaders-content{padding-right:0.875rem}.matchup-leaders-wrapper {font-style:italic}.ticker_points .warning{font-size: 0.563rem}</style>');

			// APPEND CONTROLS CSS
			jQuery("head").append('<style>.marquee_settings_table.mobile-wrap,.marquee_settings_table{display:none;margin:0.625rem auto;max-width:25.875rem}.ticker_controls{text-align:center;width:100%;margin:0.625rem 0}.speed-inactive{display:inline-block;width:0.5rem;height:0.5rem;border:0.188rem solid ' + controlsRed + ';vertical-align:middle;margin:0.125rem}.speed-active{display:inline-block;width:0.5rem;height:0.5rem;background-color:' + controlsGreen + ';border:0.188rem solid green;vertical-align:middle;margin:0.125rem}.speed-active.red{background-color:' + controlsRed + ';border:0.188rem solid ' + controlsRed + '}.speed-active.green{background-color:' + controlsGreen + '}.speed-slower i,.speed-faster i{vertical-align:middle;font-size:1.25rem;margin:0 0.625rem;cursor:pointer}.speed-slower i{color:' + controlsRed + '}.speed-faster i{color:' + controlsGreen + '}.marquee_settings_table .icon_state_pause,.marquee_settings_table .icon_state_play,.marquee_settings_table .icon_state_skip{display:inline-block!important;position: relative;top: auto;transform: none;margin: 0.625rem;left: auto!important;cursor: pointer;font-size: 1.25rem;line-height:initial;width:auto}.marquee_settings_table .icon_state_pause{color:' + controlsRed + '}.marquee_settings_table .icon_state_play,.marquee_settings_table .icon_state_skip{color:' + controlsGreen + '}#tbody_display_settings td{position:relative}#tbody_display_settings div{position:relative}#tbody_display_settings input[type="checkbox"]{display:none}#tbody_display_settings label{padding-left:1.25rem;cursor:pointer;display:block}#tbody_display_settings input+label:before{color:' + controlsRed + ';font-family:"Font Awesome 6 Pro";display:inline-block;content:"\\f096";position:absolute;left:0.188rem;transform:translate(0,-50%);top:50%}#tbody_display_settings input:checked+label:before{color:' + controlsGreen + ';content:"\\f046";z-index:0}#tbody_display_settings .select-display-options{font-size:0.75rem}#tbody_display_settings .display-options-disabled,#tbody_display_settings .display-options-disabled label{opacity:0.65;cursor:default}#tbody_display_settings input[type="button"]{min-width:5rem}#tbody_display_settings .form_buttons input{text-transform: uppercase}.marquee_settings_table #tbody_display_settings td{text-align:left;text-indent:0}.cp_hidden {display:none}.displayToggleSet:before{content:".";position:absolute;color:transparent;width:31.25rem;left:-25rem;top:50%;transform:translateY(-50%)}</style>');

			if (tickerSize == "medium") {
				jQuery("head").append('<style>.bigHeading{font-size:1rem;height:2.5rem;line-height:2.5rem}.bigHeading .icon_state_pause,.bigHeading .icon_state_play,.bigHeading .icon_state_skip{font-size:1.125rem;line-height:2.5rem}.bigHeading .icon_state_skip{font-size:1rem}.ticker-header{height:1.25rem;line-height:1.25rem;font-size:0.875rem}.ticker-update,.ticker-update-dummy{height:1.25rem;line-height:1.25rem;font-size:0.938rem}.franchise_icon_ticker{height:1.25rem}.bigHeading::before{right:-2.5rem;border-width: 2.5rem 2.5rem 0 0;}.fa-gear.ticker_setting{font-size:.9rem!important}.franchise_icon_ticker.icon_ticker_nfl{height:1rem;max-width:1.375rem}.ticker_points .warning{font-size:0.625rem}.redzone_ticker,.has_ball_ticker{height:0.875rem}</style>');
				if (responsiveTicker) {
					jQuery("head").append('<style>@media only screen and (max-width:25.875em) {.bigHeading .icon_state_pause,.bigHeading .icon_state_play{font-size:1.25rem}.bigHeading .icon_state_skip{font-size:1.125rem}}</style>');
				}
			}

			if (tickerSize == "large") {
				// APPEND TICKER CSS LARGE
				jQuery("head").append('<style>.bigHeading{font-size:1.125rem;height:2.75rem;line-height:2.75rem}.bigHeading .icon_state_pause,.bigHeading .icon_state_play,.bigHeading .icon_state_skip{font-size:1.25rem;line-height:2.75rem}.bigHeading .icon_state_skip{font-size:1.125rem}.ticker-header{height:1.375rem;line-height:1.375rem;font-size:1rem}.ticker-update,.ticker-update-dummy{height:1.375rem;line-height:1.375rem;font-size:1rem}.franchise_icon_ticker{height:1.375rem}.bigHeading::before{right:-2.75rem;border-width: 2.75rem 2.75rem 0 0;}.fa-gear.ticker_setting{font-size:1rem!important}.franchise_icon_ticker.icon_ticker_nfl{height:1.125rem;max-width:1.5rem}.ticker_points .warning{font-size:0.688rem}.redzone_ticker,.has_ball_ticker{height:1rem}</style>');
				if (responsiveTicker) {
					jQuery("head").append('<style>@media only screen and (max-width:25.875em) {.bigHeading .icon_state_pause,.bigHeading .icon_state_play{font-size:1.375rem}.bigHeading .icon_state_skip{font-size:1.25rem}}</style>');
				}
			}

			//TWEAK AFTER APPENDING ALL THE CSS I CAN DETERMINE SIZE OF BIG HEADING
			switch (tickerSize) {
				case 'large':
					break;
				case 'medium':
					break;
				case 'small':
					break;
			}

			if (responsiveTicker) {
				jQuery("head").append('<style>@media only screen and (max-width:25.875em) {.bigHeading{width:3.75rem}.bigHeading span{display:none}.icon_state_skip{text-align:right}.ticker-header{padding-left:6.563rem}}@media only screen and (max-width:25.875em) {.animation{transform: translateX(5.438rem)}@keyframes moving{0%{transform:translateX(5.438rem)}100%{transform:translateX(-100%)}}</style>');
			}

			$(document).ready(function () {
				var getWidth = parseFloat($(".bigHeading").width());
				var BigHeading = calcREM2(getWidth);
				var BigHeadingBefore = calcREM2(40);
				var addSpace = calcREM2(9);
				var addSpace1 = calcREM2(29);
				var tickerHeaderLeft = (+BigHeading) + (+BigHeadingBefore) + (+addSpace);
				var tickerLeftOffset = (+BigHeading) + (+addSpace1);
				jQuery("head").append('<style>.ticker-header{padding-left:' + tickerHeaderLeft + 'rem}.animation{transform:translateX(' + tickerLeftOffset + 'rem)}@keyframes moving{0%{transform:translateX(' + tickerLeftOffset + 'rem)}100%{transform:translateX(-100%)}}</style>');
			});

			// PAUSE - RESUME BUTTONS FUNCTIONS
			jQuery(".icon_state_pause").on("click", function () {
				$(".animation").css('animation-play-state', 'paused');
				$(".icon_state_play").css('display', 'inline-block');
				$(".icon_state_pause").hide();
			});
			jQuery(".icon_state_play").on("click", function () {
				$(".animation").css('animation-play-state', '');
				$(".icon_state_pause").css('display', 'inline-block');
				$(".icon_state_play").hide();
			});
			jQuery(".icon_state_skip").on("click", function () {
				updateTicker(false);
				$(".animation").css('animation-play-state', '');
				$(".icon_state_pause").css('display', 'inline-block');
				$(".icon_state_play").hide();
			});
			jQuery(".settings_cog_span").on("click", function () {
				$('.marquee_settings_table').slideToggle(500);
				$('.marquee_settings_table').addClass('mobile-wrap');
				$('.marquee_settings_table table').addClass('report');
				$('.about_row,.global_row,.live_row,.button_row,.standard_row').hide();
				$('.displayToggleSet').show();
				$('.cp_hidden').hide();
			});

			function animationListener() {
				const el = document.querySelector('.animation');
				try {
					el.addEventListener('animationend', function () {
						updateTicker(false);
					}, {
						passive: true
					});
				} catch (er) {}
			}


			function updateSpeedControl() {
				var html = '';
				html += '<span class="speed-slower" onclick="changeTickerSpeed(false)"><i title="Decrease Speed" class="fa-regular fa-circle-minus" aria-hidden="true"></i></span>';
				for (var i = tickerSpeedMin; i <= tickerSpeedMax; i++) {
					if (tickerSpeed < i)
						html += '<span class="speed-inactive"></span>';
					else
						html += '<span class="speed-active"></span>';
				}
				html += '<span class="speed-faster" onclick="changeTickerSpeed(true)"><i title="Increase Speed" class="fa-regular fa-circle-plus" aria-hidden="true"></i></span>';
				jQuery('.ticker_controls').html(html);
			}

			function addTickerContent(header, message, track) {
				tickerContent.push(({
					"header": header,
					"message": message
				}));
				if (track !== undefined) tickerIndexTracker[track] = ({
					"index": (tickerContent.length - 1),
					"message": message
				});
			}

			function changeTickerSpeed(isAdvance) {
				//Make sure tickerSpeed is a number and not greater than 17 or less than 1
				if (isAdvance && tickerSpeed >= tickerSpeedMax) return false;
				if (!isAdvance && tickerSpeed <= tickerSpeedMin) return false;
				if (isAdvance) {
					tickerSpeed++;
					setTimeout(function () {
						$('.speed-active').addClass("green");
					}, 5);
				} else {
					tickerSpeed--;
					setTimeout(function () {
						$('.speed-active').addClass("red");
					}, 5);
				}
				updateSpeedControl();
				localStorage.setItem("ticker_speed_" + league_id, tickerSpeed);
				jQuery(".animation").attr("style", getAnimationStyle(false));
			}

			function getAnimationStyle(isInitial) {
				var animation_width_px = jQuery(".ticker-update-dummy").width();
				var animation_width_pct = parseInt(animation_width_px / jQuery(".ticker-core-wrapper").width() * 100);
				var animation_speed_factor = jQuery(".ticker-core-wrapper").width() / 1000;
				var animation_duration = parseInt((animation_speed_factor * (tickerSpeedBase / tickerSpeedIndex[tickerSpeed]) * animation_width_px) / jQuery(".ticker-core-wrapper").width() * 100) / 10;
				var adjusted = "";
				if (animation_duration < minimum_duration) {
					animation_duration = minimum_duration;
					var adjusted = " (slowed for short messages)";
				}
				//console.log("animating at "+(parseInt(animation_width_px/animation_duration,10))+"px/second" + adjusted);
				if (isInitial)
					return 'width:' + animation_width_px + 'px;animation-delay:' + tickerOnloadDelay + 's;animation-duration:' + animation_duration + 's';
				else
					return 'width:' + animation_width_px + 'px;animation-delay:' + tickerDelay + 's;animation-duration:' + animation_duration + 's';
			}

			function updateTicker(isInitial) {
				if (isInitial) {
					var headerText = sessionStorage.getItem("ticker_header_" + league_id);
					var messageText = sessionStorage.getItem("ticker_message_" + league_id);
					scrollingTriggered = true;
				} else {
					currentMessage++;
					if (currentMessage > (tickerContent.length - 1)) currentMessage = 0;
					var headerText = tickerContent[currentMessage].header;
					var messageText = tickerContent[currentMessage].message;
					sessionStorage.setItem("ticker_position_" + league_id, currentMessage);
					sessionStorage.setItem("ticker_header_" + league_id, headerText);
					sessionStorage.setItem("ticker_message_" + league_id, messageText);
					scrollingTriggered = true;
				}
				jQuery(".ticker-header .title").html(headerText);
				jQuery(".ticker-update-dummy").html(messageText);
				if (liveUpdateScheduled && currentMessage === 0) {
					for (var key in tickerIndexTracker) {
						if (tickerIndexTracker.hasOwnProperty(key)) {
							tickerContent[tickerIndexTracker[key].index].message = tickerIndexTracker[key].message;
						}
					}
					liveUpdateScheduled = false;
				}
				var animationElement = jQuery('<p class="animation" style="display:none;' + getAnimationStyle(isInitial) + '">' + messageText + '</p>');
				animationElement.on('touchmove', function (event) {
					// Your event handler code here
				}, {
					passive: true
				});
				jQuery(".ticker-update").empty().append(animationElement);
				animationElement.slideDown(500);
				animationListener();
			}

			function doCounter() {
				//ONLY FOR TESTING PURPOSES
				counter++;
				jQuery("#counter").text(counter);
			}

			function getFranchiseIcon(pid, fid) {
				if (fid !== undefined) {
					if (franchiseDatabase.hasOwnProperty("fid_" + fid)) {
						if (franchiseDatabase["fid_" + fid].icon !== '') {
							return '<img src="' + franchiseDatabase["fid_" + fid].icon + '" class="franchise_icon franchise_icon_ticker" alt="' + franchiseDatabase["fid_" + fid].name + '" title="' + franchiseDatabase["fid_" + fid].name + '" />';
						}
					}
				}
				if (typeof playerDatabase !== "undefined") {
					if (playerDatabase.hasOwnProperty("pid_" + pid)) {
						if (playerDatabase["pid_" + pid].hasOwnProperty('fid')) {
							fid_ar = playerDatabase["pid_" + pid].fid.split(",");
							if (franchiseDatabase.hasOwnProperty("fid_" + fid_ar[0])) {
								if (franchiseDatabase["fid_" + fid_ar[0]].icon !== '') {
									return '<img src="' + franchiseDatabase["fid_" + fid_ar[0]].icon + '" class="franchise_icon franchise_icon_ticker" alt="' + franchiseDatabase["fid_" + fid_ar[0]].name + '" title="' + franchiseDatabase["fid_" + fid_ar[0]].name + '" />';
								}
							}
						}
					}
				}
				return '';
			}

			////////////////////////////////////////////////////////////////////////////////////
			// LIVE STATS FUNCTIONS BUILD OFF OF //www.myfantasyleague.com/mfl_live_scoring.js
			////////////////////////////////////////////////////////////////////////////////////
			function getNflMatchupsForWeek(property) {
				try {
					var schedObj = reportNflSchedule_ar[property];
					if (!schedObj || !schedObj.nflSchedule) return null;

					var nflSchedule = schedObj.nflSchedule;
					if (!nflSchedule.hasOwnProperty('matchup')) return null;

					// Always return an array of matchups
					if (nflSchedule.matchup.hasOwnProperty('team')) {
						// Single matchup object -> wrap in array
						return [nflSchedule.matchup];
					} else {
						// Already an array
						return nflSchedule.matchup;
					}
				} catch (e) {
					return null;
				}
			}

			function initTickerNflSchedule() {
				try {
					// --- Upcoming week (Next) ---
					var nextProperty = "w_" + (completedWeek + 1);
					var nextMatchups = getNflMatchupsForWeek(nextProperty);

					if (nextMatchups && nextMatchups.length) {
						tickerNflGameStatus = [];
						for (var i = 0; i < nextMatchups.length; i++) {
							var matchup = nextMatchups[i];
							var roadId = matchup.team[0].id;
							var homeId = matchup.team[1].id;
							var roadSpread = matchup.team[0].spread;
							var homeSpread = matchup.team[1].spread;
							var kickoff = parseInt(matchup.kickoff, 10);

							tickerNflGameStatus[roadId] = {
								time: kickoff,
								isHome: false,
								isBye: false,
								opponent: homeId,
								spread: roadSpread
							};
							tickerNflGameStatus[homeId] = {
								time: kickoff,
								isHome: true,
								isBye: false,
								opponent: roadId,
								spread: homeSpread
							};
						}

						for (var team in tickerNflGameStatus) {
							if (tickerNflGameStatus.hasOwnProperty(team)) {
								tickerNflGameStatus[team].clock = tickerNflGameTime(tickerNflGameStatus[team].time);
								tickerNflGameStatus[team].secs_left = 3600;
								tickerNflGameStatus[team].status = "SCHED";
							}
						}
						tickerNflGameNext = tickerNflGameStatus;
					}

					// --- Completed week (Results) ---
					var completedProp;
					if (completedWeek === 0) {
						completedProp = "w_1";
					} else {
						completedProp = "w_" + completedWeek;
					}
					var completedMatchups = getNflMatchupsForWeek(completedProp);

					if (completedMatchups && completedMatchups.length) {
						tickerNflGameResults = [];
						for (var j = 0; j < completedMatchups.length; j++) {
							var m2 = completedMatchups[j];
							var roadId2 = m2.team[0].id;
							var homeId2 = m2.team[1].id;
							var roadScore = m2.team[0].score;
							var homeScore = m2.team[1].score;
							var roadSpread2 = m2.team[0].spread;
							var homeSpread2 = m2.team[1].spread;

							tickerNflGameResults[roadId2] = {
								isHome: false,
								score: roadScore,
								opponent: homeId2,
								spread: roadSpread2
							};
							tickerNflGameResults[homeId2] = {
								isHome: true,
								score: homeScore,
								opponent: roadId2,
								spread: homeSpread2
							};
						}
					}
				} catch (er) {
					// swallow like you were doing before
				}
			}


			function tickerNflGameTime(timestamp) {
				var day_ar = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				var date = new Date(parseInt(timestamp) * 1000);
				var day = day_ar[date.getDay()];
				var hours = date.getHours();
				if (hours >= 12) var ampm = "pm";
				else var ampm = "am";
				if (hours === 0) hours = 12;
				else if (hours > 12) hours -= 12;
				var minutes = "0" + date.getMinutes();
				var formattedTime = day + " " + hours + ':' + minutes.substr(-2) + ampm;
				return formattedTime;
			}

			function getNflMatchupLeaders(team, baseImage, baseExt) {
				var p_yds = -100;
				var ru_yds = -100;
				var re_yds = -100;
				var tkl = -100;
				var passingLeader_str = '';
				var rushingLeader_str = '';
				var receivingLeader_str = '';
				var idpLeader_str = '';
				for (var key in tickerLiveStatsPlayer) {
					if (tickerLiveStatsPlayer.hasOwnProperty(key)) {
						if (key !== "" && key.substring(0, 1) !== "0") {
							if (playerDatabase.hasOwnProperty("pid_" + key)) {
								if (playerDatabase["pid_" + key].team === team) {
									var player_name = playerDatabase["pid_" + key].name;
									var first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
									var last_name = player_name.substring(0, player_name.indexOf(","));
									if (parseInt(tickerLiveStatsPlayer[key].PY) > p_yds && parseInt(tickerLiveStatsPlayer[key].PY) > 0) {
										p_yds = parseInt(tickerLiveStatsPlayer[key].PY);
										passingLeader_str = '<span class="matchup-leaders-content">' + first_name + ' ' + last_name + ' ' + p_yds + 'yds passing ' + ((tickerLiveStatsPlayer[key]['#P'] > 0) ? parseInt(tickerLiveStatsPlayer[key]['#P']) + 'td ' : '') + ((tickerLiveStatsPlayer[key].IN > 0) ? parseInt(tickerLiveStatsPlayer[key].IN) + 'int ' : '') + '</span>';
									}
									if (parseInt(tickerLiveStatsPlayer[key].RY) > ru_yds && parseInt(tickerLiveStatsPlayer[key].RY) > 0) {
										ru_yds = parseInt(tickerLiveStatsPlayer[key].RY);
										rushingLeader_str = '<span class="matchup-leaders-content">' + first_name + ' ' + last_name + ' ' + ru_yds + 'yds rushing ' + ((tickerLiveStatsPlayer[key]['#R'] > 0) ? parseInt(tickerLiveStatsPlayer[key]['#R']) + 'td ' : '') + ((tickerLiveStatsPlayer[key].FL > 0) ? parseInt(tickerLiveStatsPlayer[key].FL) + 'fl ' : '') + '</span>';
									}
									if (parseInt(tickerLiveStatsPlayer[key].CY) > re_yds && parseInt(tickerLiveStatsPlayer[key].CY) > 0) {
										re_yds = parseInt(tickerLiveStatsPlayer[key].CY);
										receivingLeader_str = '<span class="matchup-leaders-content">' + first_name + ' ' + last_name + ' ' + re_yds + 'yds receiving ' + ((tickerLiveStatsPlayer[key].CC > 0) ? parseInt(tickerLiveStatsPlayer[key].CC) + 'catches ' : '') + ((tickerLiveStatsPlayer[key]['#C'] > 0) ? parseInt(tickerLiveStatsPlayer[key]['#C']) + 'td ' : '') + '</span>';
									}
									if (isLeagueIDP) {
										if (parseInt(tickerLiveStatsPlayer[key].TK) > tkl && parseInt(tickerLiveStatsPlayer[key].TK) > 0) {
											tkl = parseInt(tickerLiveStatsPlayer[key].TK);
											idpLeader_str = '<span class="matchup-leaders-content">' + first_name + ' ' + last_name + ' ' + tkl + 'tackles ' + ((tickerLiveStatsPlayer[key].AS > 0) ? parseInt(tickerLiveStatsPlayer[key].AS) + 'assists ' : '') + ((tickerLiveStatsPlayer[key].SK > 0) ? parseInt(tickerLiveStatsPlayer[key].SK) + 'sacks ' : '') + ((tickerLiveStatsPlayer[key].PD > 0) ? parseInt(tickerLiveStatsPlayer[key].PD) + 'pd ' : '') + '</span>';
										}
									}
								}
							}
						}
					}
				}
				var str = '';
				if (passingLeader_str !== '' || rushingLeader_str !== '' || receivingLeader_str !== '' || idpLeader_str != '') {
					str += ' <img src="' + baseImage + team + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + team + '" /><span style="display:inline-block;visibility:hidden">.</span>';
					str += passingLeader_str + rushingLeader_str + receivingLeader_str + idpLeader_str;
				}
				return str;
			}

			function tickerParseLiveStats(time, isUpdate) {
				tickerLiveStatsPlayer = [];
				tickerLiveStatsTeam = [];

				lsm_last_update_secs = lsm_last_update_secs_first;

				if (typeof structuredClone === "function") {
					tickerLiveStatsPlayer = structuredClone(lsm_stats);
					tickerLiveStatsTeam = structuredClone(lsm_tstats);
				} else {
					// Fallback for older browsers
					tickerLiveStatsPlayer = JSON.parse(JSON.stringify(lsm_stats));
					tickerLiveStatsTeam  = JSON.parse(JSON.stringify(lsm_tstats));
				}

				if (includeNflMatchups) {
					for (var team in tickerNflGameStatus) {
						if (tickerNflGameStatus.hasOwnProperty(team)) {
							if (!tickerNflGameStatus.hasOwnProperty(team)) tickerNflGameStatus[team] = ({
								"time": 0,
								"isBye": true
							});
							if (!tickerLiveStatsTeam.hasOwnProperty(team)) tickerLiveStatsTeam[team] = [];
							tickerNFLKickoff[team] = tickerNflGameStatus[team].time;
							if (tickerNflGameStatus[team].time === 0) {
								tickerNflGameStatus[team].clock = 'BYE';
								tickerNflGameStatus[team].secs_left = 0;
								tickerNflGameStatus[team].status = "BYE";
								tickerLiveStatsTeam[team].TPS = "";
								tickerLiveStatsTeam[team].TPA = "";
							} else if (tickerNflGameStatus[team].time > lsm_last_update_secs) { //GAME HASN'T STARTED
								tickerNflGameStatus[team].clock = tickerNflGameTime(tickerNflGameStatus[team].time);
								tickerNflGameStatus[team].secs_left = 3600;
								tickerNflGameStatus[team].status = "SCHED";
								tickerLiveStatsTeam[team].TPS = "";
								tickerLiveStatsTeam[team].TPA = "";
							} else { //GAME IS FINAL OR IN PROGRESS
								try {
									//tickerLiveStatsTeam[team].TPS = 0;
									//tickerLiveStatsTeam[team].TPA = 0;
									if (tickerLiveStatsTeam[team].TPS === undefined) tickerLiveStatsTeam[team].TPS = 0;
									if (tickerLiveStatsTeam[tickerLiveStatsTeam[team].OPP].TPS === undefined) tickerLiveStatsTeam[team].TPA = 0;
									if (tickerLiveStatsTeam[team].QUARTER === '' || tickerLiveStatsTeam[team].QUARTER === 'F') {
										tickerNflGameStatus[team].secs_left = 0;
										tickerNflGameStatus[team].status = "OVER";
									} else {
										var when;
										tickerNflGameStatus[team].status = "INPROG";
										var parts = tickerLiveStatsTeam[team].REMAINING.split(":");
										tickerNflGameStatus[team].secs_left = parts[0] * 60 + Number(parts[1]);
										if (tickerLiveStatsTeam[team].QUARTER === 'O' || tickerLiveStatsTeam[team].QUARTER > 4) {
											when = "OT";
										} else if (tickerLiveStatsTeam[team].QUARTER === 'H') {
											when = "H";
											tickerNflGameStatus[team].secs_left += 15 * 60 * 2;
											custom_is_half = true;
										} else {
											tickerNflGameStatus[team].secs_left += 15 * 60 * (4 - tickerLiveStatsTeam[team].QUARTER);
											when = tickerLiveStatsTeam[team].QUARTER + "Q";
										}
										when = when + "&" + "nbsp;" + tickerLiveStatsTeam[team].REMAINING;
										tickerNflGameStatus[team].clock = when;

										var down = parseInt(tickerLiveStatsTeam[team].DOWN, 10);
										if (isNaN(down) || down === 0 || down === undefined) {
											down = 1;
										}
										if (down === 1) {
											down = down + "st";
										} else if (down === 2) {
											down = down + "nd";
										} else if (down === 3) {
											down = down + "rd";
										} else if (down === 4) {
											down = down + "th";
										}
										tickerNflGameStatus[team].possession = false;
										tickerNflGameStatus[team].redzone = false;
										tickerNflGameStatus[team].down_and_dist = '';
										if (tickerLiveStatsTeam[team].YARDLINE !== undefined && tickerLiveStatsTeam[team].YARDLINE !== "") {
											var fieldpos = tickerLiveStatsTeam[team].YARDLINE.split(":");
											var side = fieldpos[0];
											var yardline = Number(fieldpos[1]);
											if (side == '50') {
												side = "";
												yardline = 50;
											}
											if (tickerLiveStatsTeam[team].TOGO !== undefined && tickerLiveStatsTeam[team].TOGO !== "") {
												var downdist = down + "&" + "nbsp;and&" + "nbsp;" + tickerLiveStatsTeam[team].TOGO + " at " + side + "&" + "nbsp;" + yardline;
												//game_status = game_status + "<br>" + downdist;
												tickerNflGameStatus[team].down_and_dist = downdist;
												if (tickerLiveStatsTeam[team].POSSESSION > 0) {
													tickerNflGameStatus[team].possession = true;
													//console.log(team + " poss=" + tickerLiveStatsTeam[team].POSSESSION + " yard=" + tickerLiveStatsTeam[team].YARDLINE + " " + side + " " + yardline);
													if (side !== team && yardline < 20) {
														tickerNflGameStatus[team].redzone = true;
													}
												}
											}
										}
									}
								} catch (e) {}
							}
							//console.log(team+" "+tickerLiveStatsTeam[team].TPS+" "+tickerLiveStatsTeam[team].OPP+ " "+tickerLiveStatsTeam[team].TPA+" "+tickerLiveStatsTeam[team].RES);
						}
					}
					var last_home_team = '';
					for (var i = 0; i < 3; i++) {
						for (var team in tickerNflGameStatus) {
							if (tickerNflGameStatus.hasOwnProperty(team)) {
								if (tickerNflGameStatus[team].isHome) {
									last_home_team = team;
								}
							}
						}
					}
					var str = '';
					var baseImage = '//www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/';
					var baseExt = '.svg';
					for (var i = 0; i < 3; i++) {
						for (var team in tickerNflGameStatus) {
							if (tickerNflGameStatus.hasOwnProperty(team)) {
								if (tickerNflGameStatus[team].isHome) {
									if (i === 0 && tickerNflGameStatus[team].status === "INPROG") {
										var game_leaders = '';
										var roadHasBall = '';
										var homeHasBall = '';
										var downDist = '';
										if (tickerNflGameStatus[tickerNflGameStatus[team].opponent].possession) roadHasBall = '<img src="//www.mflscripts.com/ImageDirectory/script-images/football.svg" class="has_ball_ticker" alt="has ball" title="has ball" />';
										if (tickerNflGameStatus[tickerNflGameStatus[team].opponent].redzone) roadHasBall = '<img src="//www.mflscripts.com/ImageDirectory/script-images/goal-post.svg" class="redzone_ticker" alt="redzone" title="redzone" />';
										if (tickerNflGameStatus[tickerNflGameStatus[team].opponent].possession) downDist = tickerNflGameStatus[tickerNflGameStatus[team].opponent].down_and_dist;
										if (tickerNflGameStatus[team].possession) homeHasBall = '<img src="//www.mflscripts.com/ImageDirectory/script-images/football.svg" class="has_ball_ticker" alt="has ball" title="has ball" />';
										if (tickerNflGameStatus[team].redzone) homeHasBall = '<img src="//www.mflscripts.com/ImageDirectory/script-images/goal-post.svg" class="redzone_ticker" alt="redzone" title="redzone" />';
										if (tickerNflGameStatus[team].possession) downDist = tickerNflGameStatus[team].down_and_dist;
										if (includeNflMatchupLeaders) {
											var str_roadLeaders = getNflMatchupLeaders(tickerNflGameStatus[team].opponent, baseImage, baseExt);
											var str_homeLeaders = getNflMatchupLeaders(team, baseImage, baseExt);
											if (str_roadLeaders !== '' || str_homeLeaders !== '') game_leaders = '<span class="matchup-leaders-wrapper"><span style="display:inline-block;visibility:hidden">.......</span>Leaders:<span style="display:inline-block;visibility:hidden">....</span>' + str_roadLeaders + '<span style="display:inline-block;visibility:hidden">....</span>' + str_homeLeaders + '</span>';
										}
										if (last_home_team === team)
											str += '<span style="margin-right:0">' + roadHasBall + '<span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + tickerNflGameStatus[team].opponent + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + tickerNflGameStatus[team].opponent + '" /><span style="display:inline-block;visibility:hidden">.</span>' + tickerLiveStatsTeam[team].TPA + '<span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span>' + tickerLiveStatsTeam[team].TPS + '<span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + team + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + team + '" /><span style="display:inline-block;visibility:hidden">.</span>' + homeHasBall + '<span style="display:inline-block;visibility:hidden">.</span> ' + tickerNflGameStatus[team].clock + ' ' + downDist + game_leaders + '</span>';
										else
											str += '<span style="margin-right:3.75rem">' + roadHasBall + '<span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + tickerNflGameStatus[team].opponent + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + tickerNflGameStatus[team].opponent + '" /><span style="display:inline-block;visibility:hidden">.</span>' + tickerLiveStatsTeam[team].TPA + '<span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span>' + tickerLiveStatsTeam[team].TPS + '<span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + team + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + team + '" /><span style="display:inline-block;visibility:hidden">.</span>' + homeHasBall + '<span style="display:inline-block;visibility:hidden">.</span> ' + tickerNflGameStatus[team].clock + ' ' + downDist + game_leaders + '</span>';
									} else if (i === 1 && tickerNflGameStatus[team].status === "SCHED") {
										if (last_home_team === team)
											str += '<span style="margin-right:0"><img src="' + baseImage + tickerNflGameStatus[team].opponent + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + tickerNflGameStatus[team].opponent + '" /><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + team + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + team + '" /><span style="display:inline-block;visibility:hidden">.</span>' + tickerNflGameStatus[team].clock + '</span>';
										else
											str += '<span style="margin-right:3.75rem"><img src="' + baseImage + tickerNflGameStatus[team].opponent + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + tickerNflGameStatus[team].opponent + '" /><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + team + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + team + '" /><span style="display:inline-block;visibility:hidden">.</span>' + tickerNflGameStatus[team].clock + '</span>';
									} else if (i === 2 && tickerNflGameStatus[team].status === "OVER") {
										var game_leaders = '';
										if (includeNflMatchupLeaders) {
											var str_roadLeaders = getNflMatchupLeaders(tickerNflGameStatus[team].opponent, baseImage, baseExt);
											var str_homeLeaders = getNflMatchupLeaders(team, baseImage, baseExt);
											if (str_roadLeaders !== '' || str_homeLeaders !== '') game_leaders = '<span class="matchup-leaders-wrapper"><span style="display:inline-block;visibility:hidden">.......</span>Leaders:<span style="display:inline-block;visibility:hidden">....</span>' + str_roadLeaders + '<span style="display:inline-block;visibility:hidden">....</span>' + str_homeLeaders + '</span>';
										}
										var road_winner_marker = '';
										var home_winner_marker = '';
										if (parseInt(tickerLiveStatsTeam[team].TPA) > parseInt(tickerLiveStatsTeam[team].TPS)) road_winner_marker = '<i class="fa-regular fa-caret-right" aria-hidden="true" style="margin-right:0.188rem;color:' + controlsGreen + '"></i>';
										if (parseInt(tickerLiveStatsTeam[team].TPS) > parseInt(tickerLiveStatsTeam[team].TPA)) home_winner_marker = '<i class="fa-regular fa-caret-left" aria-hidden="true" style="margin-left:0.188rem;color:' + controlsGreen + '"></i>';
										if (last_home_team === team)
											str += '<span class="ticker_gameover" style="margin-right:0"><img src="' + baseImage + tickerNflGameStatus[team].opponent + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + tickerNflGameStatus[team].opponent + '" /><span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + tickerLiveStatsTeam[team].TPA + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + tickerLiveStatsTeam[team].TPS + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + team + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + team + '" /><span style="display:inline-block;visibility:hidden">.</span>' + game_leaders + '</span>';
										else
											str += '<span class="ticker_gameover" style="margin-right:3.75rem"><img src="' + baseImage + tickerNflGameStatus[team].opponent + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + tickerNflGameStatus[team].opponent + '" /><span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + tickerLiveStatsTeam[team].TPA + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + tickerLiveStatsTeam[team].TPS + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span><img src="' + baseImage + team + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + team + '" /><span style="display:inline-block;visibility:hidden">.</span>' + game_leaders + '</span>';
									}
								}
							}
						}
					}
					if (isUpdate) {
						tickerIndexTracker['liveMatchups'].message = str; //tickerContent[tickerIndexTracker['liveMatchups']].message = str;
					} else if (str !== '') {
						tickerLiveLeaders_ar.Matchups[0] = ({
							"header": "Week " + (completedWeek + 1) + " NFL Matchups",
							"message": str
						});
					}
				}
			}

			function getTickerLiveStats(isUpdate) {
				if (parseInt(includeLiveLeaders) <= 0 && !includeNflMatchups) return false;
				if (isNaN(parseInt(includeLiveLeaders))) return false;
				if (liveScoringWeek !== tickerLiveScoringWeek) return false;
				if (!doTicker) return;

				var now;
				if (!Date.now) now = new Date().getTime();
				else now = Date.now();
				var liveStats = [];

						tickerParseLiveStats(now, isUpdate);
						for (var key in tickerLiveStatsPlayer) {
							if (tickerLiveStatsPlayer.hasOwnProperty(key)) {
								if (key !== "" && key.substring(0, 1) !== "0") {
									if (playerDatabase.hasOwnProperty("pid_" + key)) {
										//console.log(key);
										liveStats.push(({
											"id": key,
											"pa_yds": (tickerLiveStatsPlayer[key].PY === undefined) ? -100 : parseInt(tickerLiveStatsPlayer[key].PY),
											"ru_att": (tickerLiveStatsPlayer[key].RA === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key].RA),
											"ru_yds": (tickerLiveStatsPlayer[key].RY === undefined) ? -100 : parseInt(tickerLiveStatsPlayer[key].RY),
											"re_cmp": (tickerLiveStatsPlayer[key].CC === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key].CC),
											"re_yds": (tickerLiveStatsPlayer[key].CY === undefined) ? -100 : parseInt(tickerLiveStatsPlayer[key].CY),
											"pa_td": (tickerLiveStatsPlayer[key]['#P'] === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key]['#P']),
											"pa_int": (tickerLiveStatsPlayer[key].IN === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key].IN),
											"ru_td": (tickerLiveStatsPlayer[key]['#R'] === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key]['#R']),
											"re_td": (tickerLiveStatsPlayer[key]['#C'] === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key]['#C']),
											"idp_tk": (tickerLiveStatsPlayer[key].TK === undefined) ? -100 : parseInt(tickerLiveStatsPlayer[key].TK),
											"idp_as": (tickerLiveStatsPlayer[key].AS === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key].AS),
											"idp_sk": (tickerLiveStatsPlayer[key].SK === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key].SK),
											"idp_pd": (tickerLiveStatsPlayer[key].PD === undefined) ? 0 : parseInt(tickerLiveStatsPlayer[key].PD)
										}));
									}
								}
							}
						}
						//SORT PASSERS
						liveStats.sort(function (a, b) {
							if (a.pa_yds > b.pa_yds) return -1;
							else return 1;
						});
						var str = '';
						for (var i = 0; i < liveStats.length; i++) {
							if (liveStats[i].pa_yds <= -100) break;
							liveLeadersFound = true;
							var nextPlayerCounts = true;
							if ((i + 1) !== liveStats.length)
								if (liveStats[i + 1].pa_yds <= -100) nextPlayerCounts = false;
							var player = playerDatabase["pid_" + liveStats[i].id];
							var player_name = player.name;
							first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
							last_name = player_name.substring(0, player_name.indexOf(","));
							var iconHtml = '';
							if (includeFranchiseIcons) iconHtml = getFranchiseIcon(liveStats[i].id);
							if ((i + 1) < parseInt(includeLiveLeaders) && nextPlayerCounts)
								str += '<span style="margin-right:3.75rem">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].pa_yds + ' yds ' + liveStats[i].pa_td + ' tds ' + liveStats[i].pa_int + ' ints</span>';
							else {
								str += '<span style="margin-right:0">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].pa_yds + ' yds ' + liveStats[i].pa_td + ' tds ' + liveStats[i].pa_int + ' ints</span>';
								break;
							}
						}
						if (isUpdate) {
							//console.log("UPDATING LIVE LEADERS SCHEDULED");
							liveUpdateScheduled = true;
							tickerIndexTracker['livePassers'].message = str; //tickerContent[tickerIndexTracker['livePassers']].message = str;
						} else {
							if (str !== '')
								tickerLiveLeaders_ar.Passing[0] = ({
									"header": "Top " + includeLiveLeaders + " Live Passing Leaders ",
									"message": str
								});
							else
								tickerLiveLeaders_ar.Passing[0] = ({
									"header": "Top " + includeLiveLeaders + " Live Passing Leaders ",
									"message": "will update as stats become available"
								});
						}

						//SORT RUSHERS
						liveStats.sort(function (a, b) {
							if (a.ru_yds > b.ru_yds) return -1;
							else return 1;
						});
						var str = '';
						for (var i = 0; i < liveStats.length; i++) {
							if (liveStats[i].ru_yds <= -100) break;
							liveLeadersFound = true;
							var nextPlayerCounts = true;
							if ((i + 1) !== liveStats.length)
								if (liveStats[i + 1].ru_yds <= -100) nextPlayerCounts = false;
							var player = playerDatabase["pid_" + liveStats[i].id];
							var player_name = player.name;
							first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
							last_name = player_name.substring(0, player_name.indexOf(","));
							var iconHtml = '';
							if (includeFranchiseIcons) iconHtml = getFranchiseIcon(liveStats[i].id);
							if ((i + 1) < parseInt(includeLiveLeaders) && nextPlayerCounts)
								str += '<span style="margin-right:3.75rem">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].ru_yds + ' yds ' + liveStats[i].ru_att + ' att ' + liveStats[i].ru_td + ' tds</span>';
							else {
								str += '<span style="margin-right:0">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].ru_yds + ' yds ' + liveStats[i].ru_att + ' att ' + liveStats[i].ru_td + ' tds</span>';
								break;
							}
						}
						if (isUpdate) {
							tickerIndexTracker['liveRushers'].message = str; //tickerContent[tickerIndexTracker['liveRushers']].message = str;
						} else {
							if (str !== '')
								tickerLiveLeaders_ar.Rushing[0] = ({
									"header": "Top " + includeLiveLeaders + " Live Rushing Leaders ",
									"message": str
								});
							else
								tickerLiveLeaders_ar.Rushing[0] = ({
									"header": "Top " + includeLiveLeaders + " Live Rushing Leaders ",
									"message": "will update as stats become available"
								});
						}

						//SORT RECEIVERS
						liveStats.sort(function (a, b) {
							if (a.re_yds > b.re_yds) return -1;
							else return 1;
						});
						var str = '';
						for (var i = 0; i < liveStats.length; i++) {
							if (liveStats[i].re_yds <= -100) break;
							liveLeadersFound = true;
							var nextPlayerCounts = true;
							if ((i + 1) !== liveStats.length)
								if (liveStats[i + 1].re_yds <= -100) nextPlayerCounts = false;
							var player = playerDatabase["pid_" + liveStats[i].id];
							var player_name = player.name;
							first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
							last_name = player_name.substring(0, player_name.indexOf(","));
							var iconHtml = '';
							if (includeFranchiseIcons) iconHtml = getFranchiseIcon(liveStats[i].id);
							if ((i + 1) < parseInt(includeLiveLeaders) && nextPlayerCounts)
								str += '<span style="margin-right:3.75rem">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].re_yds + ' yds ' + liveStats[i].re_cmp + ' rec. ' + liveStats[i].re_td + ' tds</span>';
							else {
								str += '<span style="margin-right:0">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].re_yds + ' yds ' + liveStats[i].re_cmp + ' rec. ' + liveStats[i].re_td + ' tds</span>';
								break;
							}
						}
						if (isUpdate) {
							tickerIndexTracker['liveReceivers'].message = str; //tickerContent[tickerIndexTracker['liveReceivers']].message = str;
						} else {
							if (str !== '')
								tickerLiveLeaders_ar.Receiving[0] = ({
									"header": "Top " + includeLiveLeaders + " Live Receiving Leaders ",
									"message": str
								});
							else
								tickerLiveLeaders_ar.Receiving[0] = ({
									"header": "Top " + includeLiveLeaders + " Live Receiving Leaders ",
									"message": "will update as stats become available"
								});
						}


						//SORT DEFENDERS
						if (includeLiveLeadersIDP && isLeagueIDP) {
							liveStats.sort(function (a, b) {
								if (a.idp_tk > b.idp_tk) return -1;
								if (a.idp_tk < b.idp_tk) return 1;
								if (a.idp_as > b.idp_as) return -1;
								if (a.idp_as < b.idp_as) return 1;
								return 1;
							});
							var str = '';
							for (var i = 0; i < liveStats.length; i++) {
								if (liveStats[i].idp_tk <= -100) break;
								liveLeadersFound = true;
								var nextPlayerCounts = true;
								if ((i + 1) !== liveStats.length)
									if (liveStats[i + 1].idp_tk <= -100) nextPlayerCounts = false;
								var player = playerDatabase["pid_" + liveStats[i].id];
								var player_name = player.name;
								first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
								last_name = player_name.substring(0, player_name.indexOf(","));
								var iconHtml = '';
								if (includeFranchiseIcons) iconHtml = getFranchiseIcon(liveStats[i].id);
								if ((i + 1) < parseInt(includeLiveLeaders) && nextPlayerCounts)
									str += '<span style="margin-right:3.75rem">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].idp_tk + ' tackles ' + liveStats[i].idp_as + ' assists ' + liveStats[i].idp_sk + ' sacks</span>';
								else {
									str += '<span style="margin-right:0">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player.position + ' ' + first_name + ' ' + last_name + ' ' + player.team + ' ' + liveStats[i].idp_tk + ' tackles ' + liveStats[i].idp_as + ' assists ' + liveStats[i].idp_sk + ' sacks</span>';
									break;
								}
							}
							if (isUpdate) {
								tickerIndexTracker['liveDefenders'].message = str; //tickerContent[tickerIndexTracker['liveDefenders']].message = str;
							} else {
								if (str !== '')
									tickerLiveLeaders_ar.Defenders[0] = ({
										"header": "Top " + includeLiveLeaders + " Live IDP Leaders ",
										"message": str
									});
								else
									tickerLiveLeaders_ar.Defenders[0] = ({
										"header": "Top " + includeLiveLeaders + " Live IDP Leaders ",
										"message": "will update as stats become available"
									});
							}
						}

			}

			////////////////////////////////////////////////////////////////////////////////////
			// END LIVE STATS
			////////////////////////////////////////////////////////////////////////////////////


			///////////////////////////////////////////////////
			//
			// FUNCTIONS THAT SCRAPE PAGES TO GET DATA
			//
			///////////////////////////////////////////////////
			function getLatestArticles() {
				if (parseInt(includeLatestArticles) <= 0) return false;
				if (isNaN(parseInt(includeLatestArticles))) return false;
				const url = `${baseURLDynamic}/${year}/news_articles?P=*&L=${league_id}&PRINTER=1`;
				return fetch(url)
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.text();
					})
					.then(data => {
						var articles_table = jQuery(data).find(".headline").closest('table').parent();
						for (var i = 0; i < articles_table.find("tr").length; i++) {
							var thisRow = articles_table.find("tr")[i];
							if (jQuery(thisRow).find("th").length > 0) continue;
							var a_href = baseURLDynamic + '/' + year + '/' + jQuery(thisRow).find("td.headline b a").attr('href').replace("&PRINTER=1", "");
							var a_text = jQuery(thisRow).find("td.headline b a").text();
							var a_text = jQuery(thisRow).find("td.headline b a").text();
							var td_timestamp = jQuery(thisRow).find("td.timestamp").text();
							//console.log(a_href+ " " + a_text + " " + td_timestamp);
							var message = '<a href="' + a_href + '" target="_blank">' + a_text + ' <span style="color:' + tickerHeadClr + '"><i class="fa-solid fa-square-arrow-up-right" aria-hidden="true"></i> View</span></a>';
							latestArticles_ar.push(({
								"header": "Latest Articles",
								"message": message
							}));
							if (latestArticles_ar.length === parseInt(includeLatestArticles)) break; //EXIT LOOP
						}
					})
					.catch(error => {
						console.error('Error fetching latest articles:', error);
						// Handle the error gracefully
						return false;
					});
			}

			function getTopPlayerStats(which) {
				if (parseInt(includeTopPlayerStats) <= 0) return false;
				if (isNaN(parseInt(includeTopPlayerStats))) return false;
				if (which === "Defenders")
					if (!isLeagueIDP) return false;
				if (which === "Defenders")
					if (!includeTopPlayerStatsIDP) return false;
				return fetch(`${baseURLDynamic}/${year}/top?L=${league_id}&SEARCHTYPE=ADVANCED&COUNT=100&YEAR=${year}&START_WEEK=${tickerStartWeek}&END_WEEK=${tickerCompletedWeek}&CATEGORY=overall&POSITION=*&DISPLAY=${which}&TEAM=*&PRINTER=1`)
					.then(response => response.text())
					.then(data => {
						var table = jQuery(data).find(".points").closest('table').parent();
						var bad_data = false;
						var str = '';
						var player_count = 0;
						for (var i = 0; i < table.find("tr").length; i++) {
							var thisRow = table.find("tr")[i];
							if (jQuery(thisRow).find("th").length > 0) continue;
							var player_id = jQuery(thisRow).find("td.player a").attr('href');
							player_id = player_id.substring(player_id.indexOf('P=') + 2, player_id.length);
							player_id = player_id.replace("&PRINTER=1", "");
							var player_name = jQuery(thisRow).find("td.player").text();
							player_name = player_name.replace("(R)", "").trim();
							var player_position = player_name.substr(-3).trim();
							if (player_position === "Def" || player_position === "Off") continue;
							var player_position = player_name.substr(-4).trim();
							if (player_position === "TMQB" || player_position === "TMRB" || player_position === "TMWR" || player_position === "TMTE" || player_position === "TMPK" || player_position === "TMPN" || player_position === "TMDL" || player_position === "TMLB" || player_position === "TMDB") continue;
							var player_position = player_name.substr(-5).trim();
							if (player_position === "Coach") continue;
							var player_position = player_name.substr(-2).trim();
							if (player_position === "PN" || player_position === "ST") continue;
							var team_abbrev = player_name.substring(0, player_name.length - 2).trim();
							team_abbrev = team_abbrev.substr(-3);
							player_name = player_name.substring(0, player_name.length - 6).trim();
							first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
							last_name = player_name.substring(0, player_name.indexOf(","));
							var iconHtml = '';
							if (includeFranchiseIcons) iconHtml = getFranchiseIcon(player_id);
							switch (which) {
								case 'Passers':
									if (player_position !== "QB") bad_data = true;
									var yards = jQuery(thisRow).find("td:nth-child(5)").text();
									yards = yards.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
									var tds = jQuery(thisRow).find("td:nth-child(8)").text();
									var ints = jQuery(thisRow).find("td:nth-child(9)").text();
									player_count++;
									if (player_count < parseInt(includeTopPlayerStats))
										str += '<span style="margin-right:3.75rem">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + yards + ' yds ' + tds + ' tds ' + ints + ' ints</span>';
									else
										str += '<span style="margin-right:0">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + yards + ' yds ' + tds + ' tds ' + ints + ' ints</span>';
									break;
								case 'Rushers':
									if (player_position !== "QB" && player_position !== "RB" && player_position !== "WR" && player_position !== "TE") bad_data = true;
									var rushes = jQuery(thisRow).find("td:nth-child(6)").text();
									var yards = jQuery(thisRow).find("td:nth-child(5)").text();
									yards = yards.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
									var tds = jQuery(thisRow).find("td:nth-child(7)").text();
									player_count++;
									if (player_count < parseInt(includeTopPlayerStats))
										str += '<span style="margin-right:3.75rem">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + yards + ' yds ' + rushes + ' atts ' + tds + ' tds</span>';
									else
										str += '<span style="margin-right:0">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + yards + ' yds ' + rushes + ' atts ' + tds + ' tds</span>';
									break;
								case 'Receivers':
									if (player_position !== "RB" && player_position !== "WR" && player_position !== "TE") bad_data = true;
									var receptions = jQuery(thisRow).find("td:nth-child(6)").text();
									var yards = jQuery(thisRow).find("td:nth-child(5)").text();
									yards = yards.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
									var tds = jQuery(thisRow).find("td:nth-child(7)").text();
									var targets = jQuery(thisRow).find("td:nth-child(9)").text();
									player_count++;
									if (player_count < parseInt(includeTopPlayerStats))
										str += '<span style="margin-right:3.75rem">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + yards + ' yds ' + receptions + ' rec. ' + targets + ' targets ' + tds + ' tds</span>';
									else
										str += '<span style="margin-right:0">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + yards + ' yds ' + receptions + ' rec. ' + targets + ' targets ' + tds + ' tds</span>';
									break;
								case 'Kickers':
									if (player_position !== "PK") bad_data = true;
									var fg = jQuery(thisRow).find("td:nth-child(5)").text();
									var fg_miss = jQuery(thisRow).find("td:nth-child(6)").text();
									var fg_att = parseInt(fg) + parseInt(fg_miss);
									player_count++;
									if (player_count < parseInt(includeTopPlayerStats))
										str += '<span style="margin-right:3.75rem">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + fg + ' field goals ' + fg_att + ' attempts</span>';
									else
										str += '<span style="margin-right:0">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + ' ' + last_name + ' ' + team_abbrev + ' ' + fg + ' field goals ' + fg_att + ' attempts</span>';
									break;
								case 'Defenders':
									if (player_position === "QB" || player_position === "RB" || player_position === "WR" || player_position === "TE" || player_position === "PK") bad_data = true;
									var tackles = jQuery(thisRow).find("td:nth-child(5)").text();
									var assists = jQuery(thisRow).find("td:nth-child(7)").text();
									var sacks = jQuery(thisRow).find("td:nth-child(11)").text();
									player_count++;
									if (player_count < parseInt(includeTopPlayerStats))
										str += '<span style="margin-right:3.75rem">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + tackles + ' tackles ' + assists + ' assists ' + sacks + ' sacks</span>';
									else
										str += '<span style="margin-right:0">' + player_count + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + player_position + ' ' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + tackles + ' tackles ' + assists + ' assists ' + sacks + ' sacks</span>';
									break;
							}
							if (bad_data) break; //EXIT LOOP WITHOUT FILLING ARRAY
							if (which !== "Defenders" && player_count >= parseInt(includeTopPlayerStats) || which === "Defenders" && player_count >= parseInt(includeTopPlayerStats)) {
								topPlayerStats_ar[which][0] = ({
									"header": "Top " + includeTopPlayerStats + " " + which,
									"message": str
								});
								break; //EXIT LOOP
							}
						}
					})
					.catch(error => {
						console.log('Fetch error:', error);
					});
			}

			function getTopPlayerPts(isRegular) {
				if (parseInt(includeTopPlayerPts) <= 0) return false;
				if (isPlayoffLeague && !isRegular) return false;
				if (isRegular) {
					if (isPlayoffLeague) {
						var startWeek = tickerStartWeek;
						var endWeek = tickerEndWeek;
					} else {
						var startWeek = tickerStartWeek;
						var endWeek = tickerLastRegularWeek;
					}
				} else {
					var startWeek = tickerLastRegularWeek + 1;
					var endWeek = tickerLastPlayoffWeek;
				}
				if (endWeek > completedWeek) var endWeek = completedWeek;
				if (startWeek > endWeek) return false;
				var playerCountPosition_ar = [];
				var playerPts_ar = [];
				return fetch(`${baseURLDynamic}/${year}/top?L=${league_id}&SEARCHTYPE=ADVANCED&COUNT=500&YEAR=${year}&START_WEEK=${startWeek}&END_WEEK=${endWeek}&CATEGORY=overall&POSITION=*&DISPLAY=points&TEAM=*&PRINTER=1`)
					.then(response => response.text())
					.then(data => {
						var table = jQuery(data).find(".points").closest('table').parent();
						var str = '';
						for (var i = 0; i < table.find("tr").length; i++) {
							var thisRow = table.find("tr")[i];
							if (jQuery(thisRow).find("th").length > 0) continue;
							var player_id = jQuery(thisRow).find("td.player a").attr('href');
							player_id = player_id.substring(player_id.indexOf('P=') + 2, player_id.length);
							player_id = player_id.replace("&PRINTER=1", "");
							var player_name = jQuery(thisRow).find("td.player").text();
							player_name = player_name.replace("(R)", "").trim();
							var valid_position = false;
							if (!valid_position) var player_position = player_name.substr(-3).trim();
							if (player_position === "Def") valid_position = true;
							if (!valid_position) var player_position = player_name.substr(-5).trim();
							if (player_position === "Coach") valid_position = true;
							if (!valid_position) var player_position = player_name.substr(-2).trim();
							if (player_position === "QB" || player_position === "RB" || player_position === "WR" || player_position === "TE" || player_position === "PK" || player_position === "DT" || player_position === "DE" || player_position === "LB" || player_position === "CB" || player_position === "S") valid_position = true;
							if (!valid_position) continue;

							if (!playerCountPosition_ar.hasOwnProperty(player_position)) {
								playerCountPosition_ar[player_position] = 0;
								playerPts_ar[player_position] = '';
							}
							if (playerCountPosition_ar[player_position] >= includeTopPlayerPts) continue;

							var team_abbrev = player_name.replace(player_position, "").trim();
							team_abbrev = team_abbrev.substr(-3);
							player_name = player_name.substring(0, player_name.length - player_position.length).trim();
							player_name = player_name.substring(0, player_name.length - team_abbrev.length).trim();
							first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
							last_name = player_name.substring(0, player_name.indexOf(","));
							var iconHtml = '';
							if (includeFranchiseIcons) iconHtml = getFranchiseIcon(player_id);

							var pts = jQuery(thisRow).find("td:nth-child(3)").text();

							playerCountPosition_ar[player_position]++;
							if (playerCountPosition_ar[player_position] < parseInt(includeTopPlayerPts))
								playerPts_ar[player_position] += '<span style="margin-right:3.75rem">' + playerCountPosition_ar[player_position] + '.<span style="display:inline-block;visibility:hidden">.</span> ' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + pts + ' pts</span>';
							else
								playerPts_ar[player_position] += '<span style="margin-right:0">' + playerCountPosition_ar[player_position] + '.<span style="display:inline-block;visibility:hidden">.</span> ' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + first_name + ' ' + last_name + ' ' + team_abbrev + ' ' + pts + ' pts</span>';

						}
						for (var key in playerPts_ar) {
							if (playerPts_ar.hasOwnProperty(key)) {
								if (isRegular) {
									if (isPlayoffLeague) {
										topPlayerPts_ar.regular[key][0] = ({
											"header": "Top " + includeTopPlayerPts + " Fantasy Pts " + key,
											"message": playerPts_ar[key]
										});
									} else {
										topPlayerPts_ar.regular[key][0] = ({
											"header": "Top " + includeTopPlayerPts + " Pts " + key + " Fantasy Regular Season",
											"message": playerPts_ar[key]
										});
									}
								} else {
									topPlayerPts_ar.playoff[key][0] = ({
										"header": "Top " + includeTopPlayerPts + " Pts " + key + " Fantasy Playoffs",
										"message": playerPts_ar[key]
									});
								}
							}
						}
					})
					.catch(error => {
						console.log('Fetch error:', error);
					});
			}

			function getLastWeekResults() {
				if (tickerCompletedWeek === 0) return false;
				if (!includeLastWeekResults) return false;
				var endWeek = tickerCompletedWeek;
				if (!isAllPlay && !isPlayoffLeague && endWeek > tickerLastPlayoffWeek) var endWeek = tickerLastPlayoffWeek;

				return fetch(`${baseURLDynamic}/${year}/weekly?L=${league_id}&W=${endWeek}&PRINTER=1`)
					.then(response => response.text())
					.then(data => {
						var table = jQuery(data).find(".scoresummary").closest('table');
						//LOOP THROUGH ENTIRE DRAFT THEN FIND CURRENT PICK
						var road_ar = [];
						var home_ar = [];
						var row_count = 0;
						for (var i = 0; i < table.find("tr").length; i++) {
							var thisRow = table.find("tr")[i];
							if (jQuery(thisRow).find("th").length > 0) continue;
							var fran_name = jQuery(thisRow).find("td:first-child").text();
							var fran_id = jQuery(thisRow).find("td:first-child a").attr('href');
							if (fran_id === undefined || fran_id === '') {
								fran_id = "BYE";
								var score = '';
							} else {
								fran_id = fran_id.substr(fran_id.indexOf('F=') + 2, 4);
								var score = jQuery(thisRow).find("td:last-child").text();
							}
							if (isAllPlay)
								road_ar.push(({
									"fid": fran_id,
									"score": score
								}));
							else {
								if (row_count % 2)
									home_ar.push(({
										"fid": fran_id,
										"score": score
									}));
								else
									road_ar.push(({
										"fid": fran_id,
										"score": score
									}));
								row_count++;
							}
						}
						var str = '';
						for (var i = 0; i < road_ar.length; i++) {
							var roadIconHtml = '';
							var homeIconHtml = '';
							if (includeFranchiseIcons) {
								if (road_ar[i].fid === "BYE")
									roadIconHtml = "BYE";
								else if (road_ar[i].fid === "AVG")
									roadIconHtml = "AVG";
								else
									roadIconHtml = getFranchiseIcon('', road_ar[i].fid);
								if (!isAllPlay) {
									if (home_ar[i].fid === 'BYE')
										homeIconHtml = 'BYE';
									else if (home_ar[i].fid === 'AVG')
										homeIconHtml = 'AVG';
									else
										homeIconHtml = getFranchiseIcon('', home_ar[i].fid);
								}
							}
							if (roadIconHtml === '') {
								if (road_ar[i].fid === "BYE")
									roadIconHtml = "BYE";
								else if (road_ar[i].fid === "AVG")
									roadIconHtml = "AVG";
								else
									roadIconHtml = franchiseDatabase["fid_" + road_ar[i].fid].name;
							}
							if (!isAllPlay)
								if (homeIconHtml === '')
									if (home_ar[i].fid === "BYE") homeIconHtml = "BYE";
									else if (home_ar[i].fid === "AVG") homeIconHtml = "AVG";
							else homeIconHtml = franchiseDatabase["fid_" + home_ar[i].fid].name;

							if (!isAllPlay) {
								var road_winner_marker = '';
								var home_winner_marker = '';
								if (parseFloat(road_ar[i].score, 10) > parseFloat(home_ar[i].score, 10)) road_winner_marker = '<i class="fa-regular fa-caret-right" aria-hidden="true" style="margin-right:0.188rem;color:' + controlsGreen + '"></i>';
								if (parseFloat(home_ar[i].score, 10) > parseFloat(road_ar[i].score, 10)) home_winner_marker = '<i class="fa-regular fa-caret-left" aria-hidden="true" style="margin-left:0.188rem;color:' + controlsGreen + '"></i>';
							}
							if (!isAllPlay) {
								if (i === (road_ar.length - 1))
									str += '<span class="ticker_gameover" style="margin-right:0">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + road_ar[i].score + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + home_ar[i].score + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
								else
									str += '<span class="ticker_gameover" style="margin-right:3.75rem">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + road_ar[i].score + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + home_ar[i].score + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
							} else {
								if (i === (road_ar.length - 1))
									str += '<span class="ticker_gameover" style="margin-right:0">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_ar[i].score + '</span></span>';
								else
									str += '<span class="ticker_gameover" style="margin-right:3.75rem">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_ar[i].score + '</span></span>';
							}
						}
						if (str !== '') tickerLastWeekResults_ar[0] = ({
							"header": "Week " + endWeek + " Fantasy Results",
							"message": str
						});
					})
					.catch(error => {
						console.log('Fetch error:', error);
					});
			}

			function getNextWeekMatchups() {
				if (!includeNextWeekMatchups) return false;
				if (tickerCompletedWeek + 1 > tickerEndWeek) return false;

				return fetch(`${baseURLDynamic}/${year}/weekly?L=${league_id}&W=${tickerCompletedWeek + 1}&PRINTER=1`)
					.then(response => response.text())
					.then(data => {
						var table = jQuery(data).find(".scoresummary").closest('table');
						//LOOP THROUGH ENTIRE DRAFT THEN FIND CURRENT PICK
						var road_ar = [];
						var home_ar = [];
						var row_count = 0;

						for (var i = 0; i < table.find("tr").length; i++) {
							var thisRow = table.find("tr")[i];
							if (jQuery(thisRow).find("th").length > 0) continue;
							var fran_name = jQuery(thisRow).find("td:first-child").text();
							var fran_id = jQuery(thisRow).find("td:first-child a").attr('href');

							if (fran_id === undefined || fran_id === '') {
								fran_id = "BYE";
							} else {
								fran_id = fran_id.substr(fran_id.indexOf('F=') + 2, 4);
							}

							if (isAllPlay) {
								road_ar.push({
									"fid": fran_id
								});
							} else {
								if (row_count % 2) {
									home_ar.push({
										"fid": fran_id
									});
								} else {
									road_ar.push({
										"fid": fran_id
									});
								}
								row_count++;
							}
						}

						var str = '';
						for (var i = 0; i < road_ar.length; i++) {
							var roadIconHtml = '';
							var homeIconHtml = '';

							if (includeFranchiseIcons) {
								if (road_ar[i].fid === 'BYE')
									roadIconHtml = 'BYE';
								else if (road_ar[i].fid === 'AVG')
									roadIconHtml = 'AVG';
								else
									roadIconHtml = getFranchiseIcon('', road_ar[i].fid);

								if (!isAllPlay && home_ar[i] && home_ar[i].fid) { // Added check for home_ar[i]
									if (home_ar[i].fid === 'BYE')
										homeIconHtml = 'BYE';
									else
										homeIconHtml = getFranchiseIcon('', home_ar[i].fid);
								}
							}

							if (roadIconHtml === '') {
								if (road_ar[i].fid === "BYE")
									roadIconHtml = "BYE";
								else if (road_ar[i].fid === "AVG")
									roadIconHtml = "AVG";
								else
									roadIconHtml = franchiseDatabase["fid_" + road_ar[i].fid].name;
							}

							var roadRecord = '';
							var homeRecord = '';
							if (!isAllPlay && reportStandingsFid_ar !== "undefined") {
								if (reportStandingsFid_ar.hasOwnProperty(road_ar[i].fid) &&
									reportStandingsFid_ar[road_ar[i].fid].hasOwnProperty('record')) {
									roadRecord = '<span class="warning ticker-record fantasy-record">(' + reportStandingsFid_ar[road_ar[i].fid].record + ')</span>';
								}

								if (home_ar[i] && home_ar[i].fid && reportStandingsFid_ar.hasOwnProperty(home_ar[i].fid) && // Added check for home_ar[i]
									reportStandingsFid_ar[home_ar[i].fid].hasOwnProperty('record')) {
									homeRecord = '<span class="warning ticker-record fantasy-record">(' + reportStandingsFid_ar[home_ar[i].fid].record + ')</span>';
								}
							}

							if (!isAllPlay) {
								if (homeIconHtml === '') {
									if (home_ar[i] && home_ar[i].fid === "BYE") // Added check for home_ar[i]
										homeIconHtml = "BYE";
									else if (home_ar[i] && home_ar[i].fid === "AVG") // Added check for home_ar[i]
										homeIconHtml = "AVG";
									else if (home_ar[i]) // Added check for home_ar[i]
										homeIconHtml = franchiseDatabase["fid_" + home_ar[i].fid].name;
								}

								if (i === (road_ar.length - 1))
									str += '<span style="margin-right:0">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + roadRecord + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + homeRecord + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
								else
									str += '<span style="margin-right:3.75rem">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + roadRecord + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + homeRecord + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
							}
						}

						if (str !== '') {
							tickerNextWeekMatchups_ar[0] = {
								"header": "Week " + (tickerCompletedWeek + 1) + " Fantasy Matchups",
								"message": str
							};
						}
					})
					.catch(error => {
						// Handle fetch error here
						console.error(error);
					});
			}


			function getLastWeekNflResults() {
				if (tickerCompletedWeek === 0) return false;
				if (!includeLastWeekNflResults) return false;
				var str = '';
				var baseImage = '//www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/';
				var baseExt = '.svg';
				var last_road = '';
				for (var team in tickerNflGameNext) {
					if (tickerNflGameNext.hasOwnProperty(team)) {
						if (!tickerNflGameNext[team].isHome) {
							last_road = team;
						}
					}
				}
				for (var team in tickerNflGameResults) {
					if (tickerNflGameResults.hasOwnProperty(team)) {
						if (!tickerNflGameResults[team].isHome) {
							var roadTeam = team;
							var homeTeam = tickerNflGameResults[team].opponent;

							var roadIconHtml = '<img src="' + baseImage + roadTeam + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + roadTeam + '" /><span style="display:inline-block;visibility:hidden">.</span>';
							var homeIconHtml = '<img src="' + baseImage + homeTeam + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + homeTeam + '" /><span style="display:inline-block;visibility:hidden">.</span>';

							var road_winner_marker = '';
							var home_winner_marker = '';
							if (parseInt(tickerNflGameResults[roadTeam].score, 10) > parseInt(tickerNflGameResults[homeTeam].score, 10)) road_winner_marker = '<i class="fa-regular fa-caret-right" aria-hidden="true" style="margin-right:0.188rem;color:' + controlsGreen + '"></i>';
							if (parseInt(tickerNflGameResults[homeTeam].score, 10) > parseInt(tickerNflGameResults[roadTeam].score, 10)) home_winner_marker = '<i class="fa-regular fa-caret-left" aria-hidden="true" style="margin-left:0.188rem;color:' + controlsGreen + '"></i>';
							if (roadTeam === last_road)
								str += '<span class="ticker_gameover" style="margin-right:0">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + tickerNflGameResults[roadTeam].score + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + tickerNflGameResults[homeTeam].score + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
							else
								str += '<span class="ticker_gameover" style="margin-right:3.75rem">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + tickerNflGameResults[roadTeam].score + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + tickerNflGameResults[homeTeam].score + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
						}
					}
				}
				if (str !== '') tickerLastWeekNflResults_ar[0] = ({
					"header": "Week " + (completedWeek) + " NFL Results",
					"message": str
				});
			}

			function getNextWeekNflMatchups() {
				if (!includeNextWeekNflMatchups) return false;
				var str = '';
				var baseImage = '//www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/';
				var baseExt = '.svg';
				var last_road = '';
				for (var team in tickerNflGameNext) {
					if (tickerNflGameNext.hasOwnProperty(team)) {
						if (!tickerNflGameNext[team].isHome) {
							last_road = team;
						}
					}
				}
				for (var team in tickerNflGameNext) {
					if (tickerNflGameNext.hasOwnProperty(team)) {
						if (!tickerNflGameNext[team].isHome) {
							var roadTeam = team;
							var homeTeam = tickerNflGameNext[team].opponent;

							var roadIconHtml = '<img src="' + baseImage + roadTeam + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + roadTeam + '" /><span style="display:inline-block;visibility:hidden">.</span>';
							var homeIconHtml = '<img src="' + baseImage + homeTeam + baseExt + '" class="franchise_icon_ticker icon_ticker_nfl" alt="' + homeTeam + '" /><span style="display:inline-block;visibility:hidden">.</span>';

							var road_spread = '';
							var home_spread = '';

							var clock = tickerNflGameNext[roadTeam].clock;
							if (parseFloat(tickerNflGameNext[roadTeam].spread, 10) < 0) road_spread = '<span class="warning" title="spread">' + tickerNflGameNext[roadTeam].spread + '</span>';
							if (parseFloat(tickerNflGameNext[homeTeam].spread, 10) < 0) home_spread = '<span class="warning" title="spread">' + tickerNflGameNext[homeTeam].spread + '</span>';
							if (roadTeam === last_road)
								str += '<span class="ticker_gameover" style="margin-right:0">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_spread + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + home_spread + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + ' ' + clock + '</span>';
							else
								str += '<span class="ticker_gameover" style="margin-right:3.75rem">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_spread + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + home_spread + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + ' ' + clock + '</span>';
						}
					}
				}
				if (str !== '') tickerNextWeekNflMatchups_ar[0] = ({
					"header": "Week " + (completedWeek + 1) + " NFL Games",
					"message": str
				});
			}

			function getWaiverOrder() {
				if (!includeWaiverOrder) return false;
				const url = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=WAIVER_ORDER`;
				return fetch(url)
					.then(response => {
						if (!response.ok) {
							throw new Error(`Error: ${response.status} ${response.statusText}`);
						}
						return response.text();
					})
					.then(data => {
						var table = jQuery(data).find("#waiver_order");
						var waiver_ar = [];
						for (var i = 0; i < table.find("tr").length; i++) {
							var thisRow = table.find("tr")[i];
							if (jQuery(thisRow).find("th").length > 0) continue;
							var fran_name = jQuery(thisRow).find("td.franchisename").text();
							var fran_id = jQuery(thisRow).find("td.franchisename a").attr('href');
							try {
								fran_id = fran_id.substr(fran_id.indexOf('F=') + 2, 4);
								waiver_ar.push(({
									"fid": fran_id
								}));
							} catch (er) {}
						}
						var str = '';
						for (var i = 0; i < waiver_ar.length; i++) {
							var iconHtml = '';
							if (includeFranchiseIcons) iconHtml = getFranchiseIcon('', waiver_ar[i].fid);
							if (iconHtml === '') iconHtml = franchiseDatabase["fid_" + waiver_ar[i].fid].name;
							if (i === (waiver_ar.length - 1))
								str += '<span style="margin-right:0">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '</span>';
							else
								str += '<span style="margin-right:3.75rem">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '</span>';
						}
						if (str !== '') tickerWaiverOrder_ar[0] = ({
							"header": "Current Waiver Priority",
							"message": str
						});
					})
					.catch(error => {
						// Handle the error
						console.error('Error:', error);
						throw error; // Rethrow the error for further handling, if necessary
					});
			}

			function getPowerRank(which) {
				switch (which) {
					case 0:
						if (!includePowerRank) return false;
						else var url = `${baseURLDynamic}/${year}/options/?L=${league_id}&O=101&SORT=PWR&PRINTER=1`;
						break;
					case 1:
						if (!includeAltPowerRank) return false;
						else var url = `${baseURLDynamic}/${year}/options/?L=${league_id}&O=101&SORT=ALTPWR&PRINTER=1`;
						break;
					case 2:
						if (!includePointScoredTeam) return false;
						else var url = `${baseURLDynamic}/${year}/options/?L=${league_id}&O=101&SORT=PTS&PRINTER=1`;
						break;
					case 3:
						if (!includeAllplayRecord) return false;
						else var url = `${baseURLDynamic}/${year}/options/?L=${league_id}&O=101&SORT=ALLPLAY&PRINTER=1`;
						break;
				}

				return fetch(url)
					.then(response => {
						if (!response.ok) {
							throw new Error(`Network response was not OK. Status: ${response.status}`);
						}
						return response.text();
					})
					.then(data => {
						var table = jQuery(data).find(".power_rank").closest("table").parent();
						var rank_ar = [];
						for (var i = 0; i < table.find("tr").length; i++) {
							var thisRow = table.find("tr")[i];
							if (jQuery(thisRow).find("th").length > 0) continue;
							var fran_name = jQuery(thisRow).find("td.franchisename").text();
							var fran_id = jQuery(thisRow).find("td.franchisename a").attr('href');
							fran_id = fran_id.substr(fran_id.indexOf('F=') + 2, 4);
							switch (which) {
								case 0:
									var rank = jQuery(thisRow).find("td.power_rank").text();
									break;
								case 1:
									var rank = jQuery(thisRow).find("td.alt_power_rank").text();
									break;
								case 2:
									var rank = jQuery(thisRow).find("td.total_points").text();
									break;
								case 3:
									var rank = jQuery(thisRow).find("td.all_play_w").text() + '-' + jQuery(thisRow).find("td.all_play_l").text() + '-' + jQuery(thisRow).find("td.all_play_t").text();
									break;
							}


							rank_ar.push(({
								"fid": fran_id,
								"rank": rank
							}));
						}
						var str = '';
						for (var i = 0; i < rank_ar.length; i++) {
							var iconHtml = '';
							if (includeFranchiseIcons) iconHtml = getFranchiseIcon('', rank_ar[i].fid);
							if (iconHtml === '') iconHtml = franchiseDatabase["fid_" + rank_ar[i].fid].name;
							if (i === (rank_ar.length - 1))
								str += '<span style="margin-right:0">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + rank_ar[i].rank + '</span>';
							else
								str += '<span style="margin-right:3.75rem">' + (i + 1) + '.<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + rank_ar[i].rank + '</span>';
						}
						switch (which) {
							case 0:
								if (str !== '') tickerRankOrder_ar['power'][0] = ({
									"header": "Power Ranking",
									"message": str
								});
								break;
							case 1:
								if (str !== '') tickerRankOrder_ar['alt_power'][0] = ({
									"header": "Alternate Power Ranking",
									"message": str
								});
								break;
							case 2:
								if (str !== '') tickerRankOrder_ar['points_scored'][0] = ({
									"header": "Franchise Leaders by Point Scored",
									"message": str
								});
								break;
							case 3:
								if (str !== '') tickerRankOrder_ar['all_play_record'][0] = ({
									"header": "All Play Record",
									"message": str
								});
								break;
						}
					})
					.catch(error => {
						// Handle the error
						console.error('Error:', error);
						// Return an appropriate value or throw an error if desired
					});
			}

			function getTickerDraftResults(isUpdate) {
				if (!includeDraft) return false;
				const url = `${baseURLDynamic}/${year}/options?L=${league_id}&O=17&PRINTER=1`;
				return fetch(url)
					.then(response => response.text())
					.then(data => {
						var table = jQuery(data).find(".franchisename").closest('table').parent();
						//LOOP THROUGH ENTIRE DRAFT THEN FIND CURRENT PICK
						var pickNotFound = false;
						var draft_ar = [];
						var currentIndex = -1;
						var row_with_th_count = 0;
						for (var i = 0; i < table.find("tr").length; i++) {
							try {
								var thisRow = table.find("tr")[i];
								if (jQuery(thisRow).find("th").length > 0) {
									row_with_th_count++;
									if (row_with_th_count > 1) break;
									else continue;
								} //THERE ARE TWO TABLES

								var pick = jQuery(thisRow).find("td:first-child").text();
								var fran_name = jQuery(thisRow).find("td.franchisename").text();
								var fran_id = jQuery(thisRow).find("td.franchisename a").attr('href');
								if (fran_id === undefined) fran_id = "";
								else fran_id = fran_id.substr(fran_id.indexOf('F=') + 2, 4);
								var player_name = jQuery(thisRow).find("td.player").text();
								if (player_name !== "") player_name = player_name.replace("(R)", "").trim();
								if (player_name !== "") player_name = player_name.replace("(I)", "").trim();
								if (player_name !== "") player_name = player_name.replace("(S)", "").trim();
								if (player_name !== "") player_name = player_name.replace("(O)", "").trim();
								if (player_name !== "") player_name = player_name.replace("(D)", "").trim();
								if (player_name !== "") player_name = player_name.replace("(Q)", "").trim();
								if (player_name !== "") player_name = player_name.replace("(C)", "").trim();
								if (player_name !== "") player_name = player_name.replace("(H)", "").trim();
								var player_id = '';
								var player_position = '';
								var team_abbrev = '';
								var first_name = '';
								var last_name = '';

								if (player_name !== "") currentIndex++;

								if (fran_id === "" || player_name === "" || jQuery(thisRow).find("td.player a").attr('href') === '' || jQuery(thisRow).find("td.player a").attr('href') === undefined) {
									pickNotFound = true;
									if (fran_id !== "") {
										draft_ar.push(({
											"pick": pick,
											"fid": fran_id,
											"pid": "",
											"first_name": "",
											"last_name": "",
											"position": "",
											"team_abbrev": ""
										}));
									}
								} else {
									player_id = jQuery(thisRow).find("td.player a").attr('href');
									player_id = player_id.substring(player_id.indexOf('P=') + 2, player_id.length);
									player_id = player_id.replace("&PRINTER=1", "");
									var valid_position = false;
									player_position = '';
									if (!valid_position) player_position = player_name.substr(-5);
									if (player_position === "Coach") valid_position = true;
									if (!valid_position) player_position = player_name.substr(-4);
									if (player_position === "TMQB" || player_position === "TMRB" || player_position === "TMWR" || player_position === "TMTE" || player_position === "TMPK" || player_position === "TMPN" || player_position === "TMDL" || player_position === "TMLB" || player_position === "TMDB") valid_position = true;
									if (!valid_position) player_position = player_name.substr(-3);
									if (player_position === "Off" || player_position === "Def") valid_position = true;
									if (!valid_position) player_position = player_name.substr(-2).trim();
									team_abbrev = player_name.replace(player_position, "").trim();
									team_abbrev = team_abbrev.substr(-3);
									player_name = player_name.substring(0, player_name.length - player_position.length).trim();
									player_name = player_name.substring(0, player_name.length - team_abbrev.length).trim();
									first_name = player_name.substring(player_name.indexOf(",") + 2, player_name.length);
									last_name = player_name.substring(0, player_name.indexOf(","));

									draft_ar.push(({
										"pick": pick,
										"fid": fran_id,
										"pid": player_id,
										"first_name": first_name,
										"last_name": last_name,
										"position": player_position,
										"team_abbrev": team_abbrev
									}));
								}
							} catch (er) {}
						}
						var start = 0;
						var end = draft_ar.length;
						if (!draftShowEntire) {
							if (parseInt(draftTopPicksOnly) > 0) {
								start = 0;
								end = parseInt(draftTopPicksOnly);
							} else {
								if (currentIndex === -1) currentIndex = draft_ar.length;
								start = currentIndex - draftShowPicksMade + 1;
								if (start < 0) start = 0;
								end = currentIndex + draftShowPicksPending + 1;
								if (end > draft_ar.length) end = draft_ar.length;
							}
						}
						var str = '';
						for (var i = start; i < end; i++) {
							var iconHtml = '';
							if (includeFranchiseIcons)
								if (draft_ar[i].hasOwnProperty("pid") && draft_ar[i].hasOwnProperty("fid")) iconHtml = getFranchiseIcon(draft_ar[i].pid, draft_ar[i].fid);
							if (iconHtml === '') iconHtml = franchiseDatabase["fid_" + draft_ar[i].fid].name;
							if (i === (end - 1)) {
								if (draft_ar[i].first_name === '')
									str += '<span style="margin-right:0">' + draft_ar[i].pick + '<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '</span>';
								else
									str += '<span style="margin-right:0">' + draft_ar[i].pick + '<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span>' + draft_ar[i].first_name + ' ' + draft_ar[i].last_name + ' ' + draft_ar[i].team_abbrev + ' ' + draft_ar[i].position + '</span>';
							} else {
								if (draft_ar[i].first_name === '')
									str += '<span style="margin-right:3.75rem">' + draft_ar[i].pick + '<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '</span>';
								else
									str += '<span style="margin-right:3.75rem">' + draft_ar[i].pick + '<span style="display:inline-block;visibility:hidden">.</span>' + iconHtml + '<span style="display:inline-block;visibility:hidden">.</span> ' + draft_ar[i].first_name + ' ' + draft_ar[i].last_name + ' ' + draft_ar[i].team_abbrev + ' ' + draft_ar[i].position + '</span>';

							}
						}
						if (isUpdate) {
							//console.log("UPDATING DRAFT RESULTS SCHEDULED");
							liveUpdateScheduled = true;
							tickerIndexTracker['draftResults'].message = str;
						} else {
							if (str !== '') {
								if (draftShowEntire)
									tickerDraftResults_ar[0] = ({
										"header": "Fantasy Draft",
										"message": str
									});
								else if (parseInt(draftTopPicksOnly) > 0)
									tickerDraftResults_ar[0] = ({
										"header": "Fantasy Draft Top " + parseInt(draftTopPicksOnly) + " Picks",
										"message": str
									});
								else if (parseInt(draftShowPicksMade) > 0 && parseInt(draftShowPicksPending) < 1)
									tickerDraftResults_ar[0] = ({
										"header": "Fantasy Draft Latest Picks",
										"message": str
									});
								else if (parseInt(draftShowPicksMade) < 1 && parseInt(draftShowPicksPending) > 0)
									tickerDraftResults_ar[0] = ({
										"header": "Fantasy Draft Pending Picks",
										"message": str
									});
								else
									tickerDraftResults_ar[0] = ({
										"header": "Fantasy Draft Latest And Pending Picks",
										"message": str
									});
							}
						}
					})
					.catch(error => {
						console.error('Error:', error);
					});
			}


			///////////////////////////////////////////////////
			//
			// LIVE FANTASY MATCHUPS
			//
			///////////////////////////////////////////////////
			var tickerJSON_matchups = [];
			var tickerJSON_projectedScores = [];
			var ticker_players = [];
			var ticker_player_fid_tracker = []; //Avoid doubling up fid's due to double header games
			var ticker_matchups = [];
			var ticker_nflSchedule = [];
			var ticker_nflOpponents = [];
			var tickerShowMFLByeTeams = false;
			var tickerIsAllPlay = false;
			var tickerFirstKickoff = [];
			var tickerFranchise = [];
			var tickerPlayerProjected = [];
			var tickerJSON_projectedScoresWeek = [];

			async function doTickerProjectedScores(isUpdate) {
				if (isUpdate) {
					return true;
				}
				try {
					var property = "w_" + (tickerLiveScoringWeek);
					tickerJSON_projectedScoresWeek[`w_${tickerLiveScoringWeek}`] = reportProjectedScores_ar[property];
					tickerJSON_projectedScores = reportProjectedScores_ar[property];
					return tickerJSON_projectedScores;
				} catch (error) {}
			}
			
			async function doTickerFantasyWeek() {
				// Always return a safe shape
				tickerJSON_matchups = {
					matchup: [],
					franchise: []
				};

				let data;
				try {
					data = (typeof structuredClone === "function") ?
						structuredClone(liveScoringLiveWeek) :
						JSON.parse(JSON.stringify(liveScoringLiveWeek));
				} catch (e) {
					console.error("doTickerFantasyWeek: failed to clone liveScoringLiveWeek", e);
					return tickerJSON_matchups;
				}

				// If MFL returns { error: { $t: "..." } } there is no liveScoring key
				const ls = data && data.liveScoring;
				if (!ls || typeof ls !== "object") {
					// Optional: log the reason once for debugging
					if (data && data.error && data.error.$t) {
						console.warn("doTickerFantasyWeek:", data.error.$t);
					}
					return tickerJSON_matchups; // keep script alive
				}

				try {
					if (Object.prototype.hasOwnProperty.call(ls, "matchup")) {
						if (Array.isArray(ls.matchup)) tickerJSON_matchups.matchup = ls.matchup;
						else if (ls.matchup && typeof ls.matchup === "object") tickerJSON_matchups.matchup = [ls.matchup];
					}

					if (Object.prototype.hasOwnProperty.call(ls, "franchise")) {
						if (Array.isArray(ls.franchise)) tickerJSON_matchups.franchise = ls.franchise;
						else if (ls.franchise && typeof ls.franchise === "object") tickerJSON_matchups.franchise = [ls.franchise];
					}

					return tickerJSON_matchups;
				} catch (error) {
					console.error("Error in doTickerFantasyWeek:", error);
					// IMPORTANT: don't throw, or Promise.all rejects and can break your init flow
					return tickerJSON_matchups;
				}
			}

			function doTickerArrays(isUpdate) {
				//reset each time
				ticker_players = [];
				ticker_player_fid_tracker = []; //Avoid doubling up fid's due to double header games
				ticker_matchups = [];
				ticker_nflSchedule = [];
				ticker_nflOpponents = [];
				tickerIsAllPlay = false;
				tickerFranchise = [];
				tickerPlayerProjected = [];
				if (tickerJSON_matchups.hasOwnProperty("matchup")) { //MATCH UP EXISTS BUT IT MAY ONLY BE ONE
					var matchup_ar = [];
					if (tickerJSON_matchups.matchup.hasOwnProperty("franchise"))
						matchup_ar.push(tickerJSON_matchups.matchup);
					else
						matchup_ar = tickerJSON_matchups.matchup;

					for (var i = 0; i < matchup_ar.length; i++) {
						var road = matchup_ar[i].franchise[0];
						var home = matchup_ar[i].franchise[1];
						ticker_matchups[i] = ({
							"roadId": road.id,
							"homeId": home.id,
							"roadScore": road.score,
							"homeScore": home.score,
							"roadProjected": 0,
							"homeProjected": 0,
							"roadYetToPlay": 0,
							"homeYetToPlay": 0,
							"roadCurrentlyPlaying": 0,
							"homeCurrentlyPlaying": 0,
							"roadPlayerMinutesRemaining": 0,
							"homePlayerMinutesRemaining": 0
						});
						ticker_matchups[i].roadYetToPlay = parseInt(matchup_ar[i].franchise[0].playersYetToPlay);
						ticker_matchups[i].homeYetToPlay = parseInt(matchup_ar[i].franchise[1].playersYetToPlay);
						ticker_matchups[i].roadCurrentlyPlaying = parseInt(matchup_ar[i].franchise[0].playersCurrentlyPlaying);
						ticker_matchups[i].homeCurrentlyPlaying = parseInt(matchup_ar[i].franchise[1].playersCurrentlyPlaying);
						ticker_matchups[i].roadPlayerMinutesRemaining = parseInt(parseInt(matchup_ar[i].franchise[0].gameSecondsRemaining) / 60 + 0.99); //round up;
						ticker_matchups[i].homePlayerMinutesRemaining = parseInt(parseInt(matchup_ar[i].franchise[1].gameSecondsRemaining) / 60 + 0.99); //round up;
						if (matchup_ar[i].franchise[0].hasOwnProperty("players")) {
							if (matchup_ar[i].franchise[0].players.hasOwnProperty("player")) {
								for (var j = 0; j < matchup_ar[i].franchise[0].players.player.length; j++) {
									var player = matchup_ar[i].franchise[0].players.player[j];
									if (player.status === "starter") var isStarter = "1";
									else isStarter = "0";
									if (ticker_players["pid_" + player.id] === undefined) {
										ticker_players["pid_" + player.id] = ({
											"id": player.id,
											"fid": road.id,
											"score": player.score,
											"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
											"isStarter": isStarter
										});
										ticker_player_fid_tracker[player.id + "_" + road.id] = 1;
									} else {
										if (ticker_player_fid_tracker[player.id + "_" + road.id] === undefined) {
											ticker_players["pid_" + player.id].fid += "," + road.id;
											ticker_players["pid_" + player.id].isStarter += "," + isStarter;
											ticker_player_fid_tracker[player.id + "_" + road.id] = 1;
										}
									}
									if (isStarter === "1") {
										try { //calculate earliest kickoff for road franchise id
											if (tickerFirstKickoff[matchup_ar[i].franchise[0].id] === undefined) {
												if (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) tickerFirstKickoff[matchup_ar[i].franchise[0].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
											} else if ((tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] < tickerFirstKickoff[matchup_ar[i].franchise[0].id])) tickerFirstKickoff[matchup_ar[i].franchise[0].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
										} catch (er) {
											console.log("error road");
										}
									}
									//CREATE FRANCHISE PLAYERS (ROAD)
									if (tickerFranchise["fid_" + road.id] === undefined) tickerFranchise["fid_" + road.id] = ({
										"starter": [],
										"bench": [],
										"tiebreaker": []
									});
									if (player.status === "starter") tickerFranchise["fid_" + road.id].starter[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
									if (player.status === "nonstarter") tickerFranchise["fid_" + road.id].bench[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
								}
							}
						}
						if (matchup_ar[i].franchise[1].hasOwnProperty("players")) {
							if (matchup_ar[i].franchise[1].players.hasOwnProperty("player")) {
								for (var j = 0; j < matchup_ar[i].franchise[1].players.player.length; j++) {
									var player = matchup_ar[i].franchise[1].players.player[j];
									if (player.status === "starter") var isStarter = "1";
									else isStarter = "0";
									if (ticker_players["pid_" + player.id] === undefined) {
										ticker_players["pid_" + player.id] = ({
											"id": player.id,
											"fid": home.id,
											"score": player.score,
											"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
											"isStarter": isStarter
										})
										ticker_player_fid_tracker[player.id + "_" + home.id] = 1;
									} else {
										if (ticker_player_fid_tracker[player.id + "_" + home.id] === undefined) {
											ticker_players["pid_" + player.id].fid += "," + home.id;
											ticker_players["pid_" + player.id].isStarter += "," + isStarter;
											ticker_player_fid_tracker[player.id + "_" + home.id] = 1;
										}
									}
									if (isStarter === "1") {
										try { //calculate earliest kickoff for home franchise id
											if (tickerFirstKickoff[matchup_ar[i].franchise[1].id] === undefined) {
												if (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) tickerFirstKickoff[matchup_ar[i].franchise[1].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
											} else if ((tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] < tickerFirstKickoff[matchup_ar[i].franchise[1].id])) tickerFirstKickoff[matchup_ar[i].franchise[1].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
										} catch (er) {
											console.log("error home");
										}
									}
									//CREATE FRANCHISE PLAYER (HOME)
									if (tickerFranchise["fid_" + home.id] === undefined) tickerFranchise["fid_" + home.id] = ({
										"starter": [],
										"bench": [],
										"tiebreaker": []
									});
									if (player.status === "starter") tickerFranchise["fid_" + home.id].starter[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
									if (player.status === "nonstarter") tickerFranchise["fid_" + home.id].bench[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
								}
							}
						}
					}
				} else {
					// SETUP ALL PLAY SINCE NO MATCHUPS
					tickerIsAllPlay = true;
					var matchupCount = 0;
					for (var i = 0; i < tickerJSON_matchups.franchise.length; i++) {
						var road = tickerJSON_matchups.franchise[i];
						ticker_matchups[matchupCount] = ({
							"roadId": road.id,
							"homeId": 'BYE',
							"roadScore": road.score,
							"homeScore": 0,
							"roadProjected": 0,
							"homeProjected": 0,
							"roadYetToPlay": 0,
							"homeYetToPlay": 0,
							"roadCurrentlyPlaying": 0,
							"homeCurrentlyPlaying": 0,
							"roadPlayerMinutesRemaining": 0,
							"homePlayerMinutesRemaining": 0
						});
						ticker_matchups[matchupCount].roadYetToPlay = parseInt(road.playersYetToPlay);
						ticker_matchups[matchupCount].roadCurrentlyPlaying = parseInt(road.playersCurrentlyPlaying);
						ticker_matchups[matchupCount].roadPlayerMinutesRemaining = parseInt(parseInt(road.gameSecondsRemaining) / 60 + 0.99) //round up;
						matchupCount++;
						if (tickerJSON_matchups.franchise[i].hasOwnProperty('players')) {
							if (tickerJSON_matchups.franchise[i].players.hasOwnProperty('player')) {
								for (var j = 0; j < tickerJSON_matchups.franchise[i].players.player.length; j++) {
									var road = tickerJSON_matchups.franchise[i];
									var player = tickerJSON_matchups.franchise[i].players.player[j];
									if (player.status === "starter") var isStarter = "1";
									else isStarter = "0";
									if (ticker_players["pid_" + player.id] === undefined) {
										ticker_players["pid_" + player.id] = ({
											"id": player.id,
											"fid": road.id,
											"score": player.score,
											"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
											"isStarter": isStarter
										});
										ticker_player_fid_tracker[player.id + "_" + road.id] = 1;
									} else {
										if (ticker_player_fid_tracker[player.id + "_" + road.id] === undefined) {
											ticker_players["pid_" + player.id].fid += "," + road.id;
											ticker_players["pid_" + player.id].isStarter += "," + isStarter;
											ticker_player_fid_tracker[player.id + "_" + road.id] = 1;
										}
									}
									if (isStarter === "1") {
										try { //calculate earliest kickoff for road franchise id
											if (tickerFirstKickoff[tickerJSON_matchups.franchise[i].id] === undefined) {
												if (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) tickerFirstKickoff[tickerJSON_matchups.franchise[i].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
											} else if ((tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] < tickerFirstKickoff[tickerJSON_matchups.franchise[i].id])) tickerFirstKickoff[tickerJSON_matchups.franchise[i].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
										} catch (er) {}
									}
									//CREATE FRANCHISE PLAYERS (ROAD)
									if (tickerFranchise["fid_" + road.id] === undefined) tickerFranchise["fid_" + road.id] = ({
										"starter": [],
										"bench": [],
										"tiebreaker": []
									});
									if (player.status === "starter") tickerFranchise["fid_" + road.id].starter[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
									if (player.status === "nonstarter") tickerFranchise["fid_" + road.id].bench[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
								}
							}
						}
					}
					//SORT ALL PLAY
					ticker_matchups.sort(function (a, b) {
						if (parseFloat(a.roadScore) < parseFloat(b.roadScore)) return 1;
						if (parseFloat(a.roadScore) > parseFloat(b.roadScore)) return -1;
						return 0;
					});
				}
				//CHECK IF IS NOT ALL PLAY AND IF TO DISPLAY BYE WEEK TEAM(S) AND IF AT LEAST ONE TEAM IS ON BYE
				if (!tickerIsAllPlay && tickerShowMFLByeTeams && tickerJSON_matchups.hasOwnProperty("franchise")) {
					if (tickerJSON_matchups.franchise.hasOwnProperty("id")) { //ONLY ONE BYE WEEK TEAM
						var temp_matchups = [];
						temp_matchups.franchise = [];
						temp_matchups.franchise.push(tickerJSON_matchups.franchise);
					} else {
						var temp_matchups = tickerJSON_matchups;
					}
					for (var i = 0; i < temp_matchups.franchise.length; i++) {
						var matchupCount = ticker_matchups.length;

						var road = temp_matchups.franchise[i];
						ticker_matchups[matchupCount] = ({
							"roadId": road.id,
							"homeId": "BYE",
							"roadScore": road.score,
							"homeScore": 0,
							"roadProjected": 0,
							"homeProjected": 0,
							"roadYetToPlay": 0,
							"homeYetToPlay": 0,
							"roadCurrentlyPlaying": 0,
							"homeCurrentlyPlaying": 0,
							"roadPlayerMinutesRemaining": 0,
							"homePlayerMinutesRemaining": 0
						});
						//SPREAD IS FROM WEEKLY RESULTS ONLY
						ticker_matchups[matchupCount].roadSpread = "";
						ticker_matchups[matchupCount].homeSpread = "";
						//RESULT IS FROM WEEKLY RESULTS ONLY
						ticker_matchups[matchupCount].roadResult = "";
						ticker_matchups[matchupCount].homeResult = "";
						ticker_matchups[matchupCount].roadYetToPlay = parseInt(road.playersYetToPlay);
						ticker_matchups[matchupCount].homeYetToPlay = 0;
						ticker_matchups[matchupCount].roadCurrentlyPlaying = parseInt(road.playersCurrentlyPlaying);
						ticker_matchups[matchupCount].homeCurrentlyPlaying = 0;
						ticker_matchups[matchupCount].roadPlayerMinutesRemaining = parseInt(parseInt(road.gameSecondsRemaining) / 60 + 0.99) //round up;
						ticker_matchups[matchupCount].homePlayerMinutesRemaining = 0;
						matchupCount++;

						if (temp_matchups.franchise[i].hasOwnProperty('players')) {
							if (temp_matchups.franchise[i].players.hasOwnProperty('player')) {
								for (var j = 0; j < temp_matchups.franchise[i].players.player.length; j++) {
									var player = temp_matchups.franchise[i].players.player[j];
									if (player.status === "starter") var isStarter = "1";
									else isStarter = "0";
									if (ticker_players["pid_" + player.id] === undefined) {
										ticker_players["pid_" + player.id] = ({
											"id": player.id,
											"fid": road.id,
											"score": player.score,
											"gameSecondsRemaining": parseInt(player.gameSecondsRemaining),
											"isStarter": isStarter
										});
										ticker_player_fid_tracker[player.id + "_" + road.id] = 1;
									} else {
										if (ticker_player_fid_tracker[player.id + "_" + road.id] === undefined) {
											ticker_players["pid_" + player.id].fid += "," + road.id;
											ticker_players["pid_" + player.id].isStarter += "," + isStarter;
											ticker_player_fid_tracker[player.id + "_" + road.id] = 1;
										}
									}
									if (isStarter === "1") {
										try { //calculate earliest kickoff for road franchise id
											if (tickerFirstKickoff[temp_matchups.franchise[i].id] === undefined) {
												if (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) tickerFirstKickoff[temp_matchups.franchise[i].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
											} else if ((tickerNFLKickoff[playerDatabase["pid_" + player.id].team] > 0) && (tickerNFLKickoff[playerDatabase["pid_" + player.id].team] < tickerFirstKickoff[temp_matchups.franchise[i].id])) tickerFirstKickoff[temp_matchups.franchise[i].id] = tickerNFLKickoff[playerDatabase["pid_" + player.id].team];
										} catch (er) {}
									}
									//CREATE FRANCHISE PLAYERS (ROAD)
									if (tickerFranchise["fid_" + road.id] === undefined) tickerFranchise["fid_" + road.id] = ({
										"starter": [],
										"bench": [],
										"tiebreaker": []
									});
									if (player.status === "starter") tickerFranchise["fid_" + road.id].starter[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
									if (player.status === "nonstarter") tickerFranchise["fid_" + road.id].bench[player.id] = ({
										"score": player.score,
										"gsr": player.gameSecondsRemaining
									});
								}
							}
						}
					}
				}
				var str = '';
				for (var i = 0; i < ticker_matchups.length; i++) {
					//console.log(ticker_matchups[i].roadId+" "+ticker_matchups[i].roadScore+" "+ticker_matchups[i].homeId+" "+ticker_matchups[i].homeScore);
					//str+=ticker_matchups[i].roadId+" "+ticker_matchups[i].roadScore+" "+ticker_matchups[i].homeId+" "+ticker_matchups[i].homeScore;
					var roadIconHtml = '';
					var homeIconHtml = '';
					if (includeFranchiseIcons) {
						if (ticker_matchups[i].roadId === 'BYE')
							roadIconHtml = 'BYE';
						else if (ticker_matchups[i].roadId === 'AVG')
							roadIconHtml = 'AVG';
						else
							roadIconHtml = getFranchiseIcon('', ticker_matchups[i].roadId);
						if (!tickerIsAllPlay) {
							if (ticker_matchups[i].homeId === 'BYE')
								homeIconHtml = 'BYE';
							else if (ticker_matchups[i].homeId === 'AVG')
								homeIconHtml = 'AVG';
							else
								homeIconHtml = getFranchiseIcon('', ticker_matchups[i].homeId);
						}
					}
					if (roadIconHtml === '') {
						if (ticker_matchups[i].roadId === "BYE")
							roadIconHtml = "BYE";
						else if (ticker_matchups[i].roadId === "AVG")
							roadIconHtml = "AVG";
						else
							roadIconHtml = franchiseDatabase["fid_" + ticker_matchups[i].roadId].name;
					}
					if (!tickerIsAllPlay)
						if (homeIconHtml === '')
							if (ticker_matchups[i].homeId === "BYE") homeIconHtml = "BYE";
							else if (ticker_matchups[i].homeId === "AVG") homeIconHtml = "AVG";
					else homeIconHtml = franchiseDatabase["fid_" + ticker_matchups[i].homeId].name;

					if (!tickerIsAllPlay) {
						var road_winner_marker = '';
						var home_winner_marker = '';
						if ((ticker_matchups[i].roadPlayerMinutesRemaining + ticker_matchups[i].homePlayerMinutesRemaining) === 0) {
							if (parseFloat(ticker_matchups[i].roadScore, 10) > parseFloat(ticker_matchups[i].homeScore, 10)) road_winner_marker = '<i class="fa-regular fa-caret-right" aria-hidden="true" style="margin-right:0.188rem;color:' + controlsGreen + '"></i>';
							if (parseFloat(ticker_matchups[i].homeScore, 10) > parseFloat(ticker_matchups[i].roadScore, 10)) home_winner_marker = '<i class="fa-regular fa-caret-left" aria-hidden="true" style="margin-left:0.188rem;color:' + controlsGreen + '"></i>';
						}
					}
					if (!tickerIsAllPlay) {
						if (i === (ticker_matchups.length - 1))
							str += '<span class="ticker_gameover" style="margin-right:0">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + ticker_matchups[i].roadScore + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + ticker_matchups[i].homeScore + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
						else
							str += '<span class="ticker_gameover" style="margin-right:3.75rem">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + road_winner_marker + ticker_matchups[i].roadScore + '</span><span style="display:inline-block;visibility:hidden">.</span>at<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points right_team">' + ticker_matchups[i].homeScore + home_winner_marker + '</span><span style="display:inline-block;visibility:hidden">.</span>' + homeIconHtml + '</span>';
					} else {
						if (i === (ticker_matchups.length - 1))
							str += '<span class="ticker_gameover" style="margin-right:0">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + ticker_matchups[i].roadScore + '</span></span>';
						else
							str += '<span class="ticker_gameover" style="margin-right:3.75rem">' + roadIconHtml + '<span style="display:inline-block;visibility:hidden">.</span><span class="ticker_points left_team">' + ticker_matchups[i].roadScore + '</span></span>';
					}
				}
				if (isUpdate) {
					//console.log("UPDATING FANTASY MATCHUPS SCHEDULED");
					liveUpdateScheduled = true;
					tickerIndexTracker['fantasyMatchups'].message = str;
				} else {
					if (str !== '') {
						if (!tickerIsAllPlay)
							tickerFantasyMatchups_ar[0] = ({
								"header": "Week " + tickerLiveScoringWeek + " Fantasy Matchups",
								"message": str
							});
						else
							tickerFantasyMatchups_ar[0] = ({
								"header": "Week " + tickerLiveScoringWeek + " Fantasy Scores",
								"message": str
							});
					}
				}
				return true;
			}

			function getFantasyMatchups(isUpdate) {
				if (!includeFantasyMatchups) return false;
				if (liveScoringWeek === 0) return false;
				return Promise.all([
					doTickerFantasyWeek(),
					doTickerProjectedScores(isUpdate)
				]).then(([a1, a2]) => {
					doTickerArrays(isUpdate);
				});
			}


			///////////////////////////////////////////////////
			//
			// DISPLAY OPTIONS SETTINGS
			//
			///////////////////////////////////////////////////
			function userResetDisplayOptions() {
				localStorage.removeItem('ticker_includeFranchiseIcons_' + league_id);
				localStorage.removeItem('ticker_tickerSize_' + league_id);
				localStorage.removeItem('ticker_tickerDelay_' + league_id);
				localStorage.removeItem('ticker_includeLatestArticles_' + league_id);
				localStorage.removeItem('ticker_includeTopPlayerStats_' + league_id);
				localStorage.removeItem('ticker_includeTopPlayerStatsIDP_' + league_id);
				localStorage.removeItem('ticker_includeTopPlayerPts_' + league_id);
				localStorage.removeItem('ticker_includePowerRank_' + league_id);
				localStorage.removeItem('ticker_includeAltPowerRank_' + league_id);
				localStorage.removeItem('ticker_includePointScoredTeam_' + league_id);
				localStorage.removeItem('ticker_includeAllplayRecord_' + league_id);
				localStorage.removeItem('ticker_includeLastWeekResults_' + league_id);
				localStorage.removeItem('ticker_includeNextWeekMatchups_' + league_id);
				localStorage.removeItem('ticker_includeLastWeekNflResults_' + league_id);
				localStorage.removeItem('ticker_includeNextWeekNflMatchups_' + league_id);
				localStorage.removeItem('ticker_includeWaiverOrder_' + league_id);
				localStorage.removeItem('ticker_includeDraft_' + league_id);
				localStorage.removeItem('ticker_draftShowEntire_' + league_id);
				localStorage.removeItem('ticker_draftTopPicksOnly_' + league_id);
				localStorage.removeItem('ticker_draftShowPicksMade_' + league_id);
				localStorage.removeItem('ticker_draftShowPicksPending_' + league_id);
				localStorage.removeItem('ticker_includeFantasyMatchups_' + league_id);
				localStorage.removeItem('ticker_includeLiveLeaders_' + league_id);
				localStorage.removeItem('ticker_includeLiveLeadersIDP_' + league_id);
				localStorage.removeItem('ticker_includeNflMatchups_' + league_id);
				localStorage.removeItem('ticker_includeNflMatchupLeaders_' + league_id);
				setTimeout("location.reload()", 500);
			}

			function userSetDisplayOptions() {
				for (var key in displayOptionsTracker) {
					if (displayOptionsTracker.hasOwnProperty(key)) {
						localStorage.setItem(key, displayOptionsTracker[key]);
					}
				}
				setTimeout("location.reload()", 500);
			}

			function userCancelDisplayOptions() {
				includeFranchiseIcons = displayOptionsInitialSettings['ticker_includeFranchiseIcons'];
				tickerSize = displayOptionsInitialSettings['ticker_tickerSize'];
				tickerDelay = displayOptionsInitialSettings['ticker_tickerDelay'];
				includeLatestArticles = displayOptionsInitialSettings['ticker_includeLatestArticles'];
				includeTopPlayerStats = displayOptionsInitialSettings['ticker_includeTopPlayerStats'];
				includeTopPlayerStatsIDP = displayOptionsInitialSettings['ticker_includeTopPlayerStatsIDP'];
				includeTopPlayerPts = displayOptionsInitialSettings['ticker_includeTopPlayerPts'];
				includePowerRank = displayOptionsInitialSettings['ticker_includePowerRank'];
				includeAltPowerRank = displayOptionsInitialSettings['ticker_includeAltPowerRank'];
				includePointScoredTeam = displayOptionsInitialSettings['ticker_includePointScoredTeam'];
				includeAllplayRecord = displayOptionsInitialSettings['ticker_includeAllplayRecord'];
				includeLastWeekResults = displayOptionsInitialSettings['ticker_includeLastWeekResults'];
				includeNextWeekMatchups = displayOptionsInitialSettings['ticker_includeNextWeekMatchups'];
				includeLastWeekNflResults = displayOptionsInitialSettings['ticker_includeLastWeekNflResults'];
				includeNextWeekNflMatchups = displayOptionsInitialSettings['ticker_includeNextWeekNflMatchups'];
				includeWaiverOrder = displayOptionsInitialSettings['ticker_includeWaiverOrder'];
				includeDraft = displayOptionsInitialSettings['ticker_includeDraft'];
				draftShowEntire = displayOptionsInitialSettings['ticker_draftShowEntire'];
				draftTopPicksOnly = displayOptionsInitialSettings['ticker_draftTopPicksOnly'];
				draftShowPicksMade = displayOptionsInitialSettings['ticker_draftShowPicksMade'];
				draftShowPicksPending = displayOptionsInitialSettings['ticker_draftShowPicksPending'];
				includeFantasyMatchups = displayOptionsInitialSettings['ticker_includeFantasyMatchups'];
				includeLiveLeaders = displayOptionsInitialSettings['ticker_includeLiveLeaders'];
				includeLiveLeadersIDP = displayOptionsInitialSettings['ticker_includeLiveLeadersIDP'];
				includeNflMatchups = displayOptionsInitialSettings['ticker_includeNflMatchups'];
				includeNflMatchupLeaders = displayOptionsInitialSettings['ticker_includeNflMatchupLeaders'];

				userUpdateDisplayOptions('franchiseIcon', includeFranchiseIcons, true);
				userUpdateDisplayOptions('tickerSize', tickerSize, true);
				userUpdateDisplayOptions('tickerDelay', tickerDelay, true);
				userUpdateDisplayOptions('articles', includeLatestArticles, true);
				userUpdateDisplayOptions('topPlayerStats', includeTopPlayerStats, true);
				userUpdateDisplayOptions('topPlayerStatsIDP', includeTopPlayerStatsIDP, true);
				userUpdateDisplayOptions('topPlayerPts', includeTopPlayerPts, true);
				userUpdateDisplayOptions('powerRank', includePowerRank, true);
				userUpdateDisplayOptions('altPowerRank', includeAltPowerRank, true);
				userUpdateDisplayOptions('pointScoredTeam', includePointScoredTeam, true);
				userUpdateDisplayOptions('allplayRecord', includeAllplayRecord, true);
				userUpdateDisplayOptions('lastWeekResults', includeLastWeekResults, true);
				userUpdateDisplayOptions('nextWeekMatchups', includeNextWeekMatchups, true);
				userUpdateDisplayOptions('lastWeekNflResults', includeLastWeekNflResults, true);
				userUpdateDisplayOptions('nextWeekNflMatchups', includeNextWeekNflMatchups, true);
				userUpdateDisplayOptions('waiverOrder', includeWaiverOrder, true);
				userUpdateDisplayOptions('draft', includeDraft, true);
				userUpdateDisplayOptions('draftShowEntire', draftShowEntire, true);
				userUpdateDisplayOptions('draftTopPicksOnly', draftTopPicksOnly, true);
				userUpdateDisplayOptions('draftShowPicksMade', draftShowPicksMade, true);
				userUpdateDisplayOptions('draftShowPicksPending', draftShowPicksPending, true);
				userUpdateDisplayOptions('fantasyMatchups', includeFantasyMatchups, true);
				userUpdateDisplayOptions('liveLeaders', includeLiveLeaders, true);
				userUpdateDisplayOptions('liveLeadersIDP', includeLiveLeadersIDP, true);
				userUpdateDisplayOptions('nflMatchups', includeNflMatchups, true);
				userUpdateDisplayOptions('nflMatchupLeaders', includeNflMatchupLeaders, true);
				setTimeout('jQuery(".settings_cog_span").click()', 1000);
			}

			function userUpdateDisplayOptions(which, value, isApply) {
				if (isApply === undefined) var apply = false;
				else var apply = isApply;
				switch (which) {
					case 'franchiseIcon':
						if (value) {
							includeFranchiseIcons = true;
							//localStorage.setItem("ticker_includeFranchiseIcons_"+league_id,1);
							displayOptionsTracker["ticker_includeFranchiseIcons_" + league_id] = 1;
							if (apply) jQuery("#includeFranchiseIcons_checkbox").prop("checked", true);
						} else {
							includeFranchiseIcons = false;
							//localStorage.setItem("ticker_includeFranchiseIcons_"+league_id,0);
							displayOptionsTracker["ticker_includeFranchiseIcons_" + league_id] = 0;
							if (apply) jQuery("#includeFranchiseIcons_checkbox").prop("checked", false);
						}
						break;
					case 'tickerSize':
						tickerSize = value;
						//localStorage.setItem("ticker_tickerSize_"+league_id,value);
						displayOptionsTracker["ticker_tickerSize_" + league_id] = value;
						if (apply) jQuery("#tickerSize_select").val(value);
						break;
					case 'tickerDelay':
						tickerSize = value;
						//localStorage.setItem("ticker_tickerDelay_"+league_id,value);
						displayOptionsTracker["ticker_tickerDelay_" + league_id] = value;
						if (apply) jQuery("#tickerDelay_select").val(value);
						break;
					case 'articles':
						includeLatestArticles = parseInt(value);
						//localStorage.setItem("ticker_includeLatestArticles_"+league_id,value);
						displayOptionsTracker["ticker_includeLatestArticles_" + league_id] = value;
						if (apply) jQuery("#includeLatestArticles_select").val(value);
						break;
					case 'topPlayerStats':
						includeTopPlayerStats = parseInt(value);
						//localStorage.setItem("ticker_includeTopPlayerStats_"+league_id,value);
						displayOptionsTracker["ticker_includeTopPlayerStats_" + league_id] = value;
						if (apply) jQuery("#topPlayerStats_select").val(value);
						if (includeTopPlayerStats === 0) {
							jQuery("#topPlayerStatsIDP_checkbox").prop("disabled", "disabled");
							jQuery("#topPlayerStatsIDP_checkbox").parent().addClass("display-options-disabled");
						} else {
							jQuery("#topPlayerStatsIDP_checkbox").removeAttr("disabled");
							jQuery("#topPlayerStatsIDP_checkbox").parent().removeClass("display-options-disabled");
						}
						break;
					case 'topPlayerStatsIDP':
						if (value) {
							includeTopPlayerStatsIDP = true;
							//localStorage.setItem("ticker_includeTopPlayerStatsIDP_"+league_id,1);
							displayOptionsTracker["ticker_includeTopPlayerStatsIDP_" + league_id] = 1;
							if (apply) jQuery("#topPlayerStatsIDP_checkbox").prop("checked", true);
						} else {
							includeTopPlayerStatsIDP = false;
							//localStorage.setItem("ticker_includeTopPlayerStatsIDP_"+league_id,0);
							displayOptionsTracker["ticker_includeTopPlayerStatsIDP_" + league_id] = 0;
							if (apply) jQuery("#topPlayerStatsIDP_checkbox").prop("checked", false);
						}
						break;
					case 'topPlayerPts':
						includeTopPlayerPts = parseInt(value);
						//localStorage.setItem("ticker_includeTopPlayerPts_"+league_id,value);
						displayOptionsTracker["ticker_includeTopPlayerPts_" + league_id] = value;
						if (apply) jQuery("#topPlayerPts_select").val(value);
						break;
					case 'powerRank':
						if (value) {
							includePowerRank = true;
							//localStorage.setItem("ticker_includePowerRank_"+league_id,1);
							displayOptionsTracker["ticker_includePowerRank_" + league_id] = 1;
							if (apply) jQuery("#includePowerRank_checkbox").prop("checked", true);
						} else {
							includePowerRank = false;
							//localStorage.setItem("ticker_includePowerRank_"+league_id,0);
							displayOptionsTracker["ticker_includePowerRank_" + league_id] = 0;
							if (apply) jQuery("#includePowerRank_checkbox").prop("checked", false);
						}
						break;
					case 'altPowerRank':
						if (value) {
							includeAltPowerRank = true;
							//localStorage.setItem("ticker_includeAltPowerRank_"+league_id,1);
							displayOptionsTracker["ticker_includeAltPowerRank_" + league_id] = 1;
							if (apply) jQuery("#includeAltPowerRank_checkbox").prop("checked", true);
						} else {
							includeAltPowerRank = false;
							//localStorage.setItem("ticker_includeAltPowerRank_"+league_id,0);
							displayOptionsTracker["ticker_includeAltPowerRank_" + league_id] = 0;
							if (apply) jQuery("#includeAltPowerRank_checkbox").prop("checked", false);
						}
						break;
					case 'pointScoredTeam':
						if (value) {
							includePointScoredTeam = true;
							//localStorage.setItem("ticker_includePointScoredTeam_"+league_id,1);
							displayOptionsTracker["ticker_includePointScoredTeam_" + league_id] = 1;
							if (apply) jQuery("#includePointScoredTeam_checkbox").prop("checked", true);
						} else {
							includePointScoredTeam = false;
							//localStorage.setItem("ticker_includePointScoredTeam_"+league_id,0);
							displayOptionsTracker["ticker_includePointScoredTeam_" + league_id] = 0;
							if (apply) jQuery("#includePointScoredTeam_checkbox").prop("checked", false);
						}
						break;
					case 'allplayRecord':
						if (value) {
							includeAllplayRecord = true;
							//localStorage.setItem("ticker_includeAllplayRecord_"+league_id,1);
							displayOptionsTracker["ticker_includeAllplayRecord_" + league_id] = 1;
							if (apply) jQuery("#includeAllplayRecord_checkbox").prop("checked", true);
						} else {
							includeAllplayRecord = false;
							//localStorage.setItem("ticker_includeAllplayRecord_"+league_id,0);
							displayOptionsTracker["ticker_includeAllplayRecord_" + league_id] = 0;
							if (apply) jQuery("#includeAllplayRecord_checkbox").prop("checked", false);
						}
						break;
					case 'lastWeekResults':
						if (value) {
							includeLastWeekResults = true;
							//localStorage.setItem("ticker_includeLastWeekResults_"+league_id,1);
							displayOptionsTracker["ticker_includeLastWeekResults_" + league_id] = 1;
							if (apply) jQuery("#includeLastWeekResults_checkbox").prop("checked", true);
						} else {
							includeLastWeekResults = false;
							//localStorage.setItem("ticker_includeLastWeekResults_"+league_id,0);
							displayOptionsTracker["ticker_includeLastWeekResults_" + league_id] = 0;
							if (apply) jQuery("#includeLastWeekResults_checkbox").prop("checked", false);
						}
						break;
					case 'nextWeekMatchups':
						if (value) {
							includeNextWeekMatchups = true;
							//localStorage.setItem("ticker_includeNextWeekMatchups_"+league_id,1);
							displayOptionsTracker["ticker_includeNextWeekMatchups_" + league_id] = 1;
							if (apply) jQuery("#includeNextWeekMatchups_checkbox").prop("checked", true);
						} else {
							includeNextWeekMatchups = false;
							//localStorage.setItem("ticker_includeNextWeekMatchups_"+league_id,0);
							displayOptionsTracker["ticker_includeNextWeekMatchups_" + league_id] = 0;
							if (apply) jQuery("#includeNextWeekMatchups_checkbox").prop("checked", false);
						}
						break;
					case 'lastWeekNflResults':
						if (value) {
							includeLastWeekNflResults = true;
							//localStorage.setItem("ticker_includeLastWeekNflResults_"+league_id,1);
							displayOptionsTracker["ticker_includeLastWeekNflResults_" + league_id] = 1;
							if (apply) jQuery("#includeLastWeekNflResults_checkbox").prop("checked", true);
						} else {
							includeLastWeekNflResults = false;
							//localStorage.setItem("ticker_includeLastWeekNflResults_"+league_id,0);
							displayOptionsTracker["ticker_includeLastWeekNflResults_" + league_id] = 0;
							if (apply) jQuery("#includeLastWeekNflResults_checkbox").prop("checked", false);
						}
						break;
					case 'nextWeekNflMatchups':
						if (value) {
							includeNextWeekNflMatchups = true;
							//localStorage.setItem("ticker_includeNextWeekNflMatchups_"+league_id,1);
							displayOptionsTracker["ticker_includeNextWeekNflMatchups_" + league_id] = 1;
							if (apply) jQuery("#includeNextWeekNflMatchups_checkbox").prop("checked", true);
						} else {
							includeNextWeekNflMatchups = false;
							//localStorage.setItem("ticker_includeNextWeekNflMatchups_"+league_id,0);
							displayOptionsTracker["ticker_includeNextWeekNflMatchups_" + league_id] = 0;
							if (apply) jQuery("#includeNextWeekNflMatchups_checkbox").prop("checked", false);
						}
						break;
					case 'waiverOrder':
						if (value) {
							includeWaiverOrder = true;
							//localStorage.setItem("ticker_includeWaiverOrder_"+league_id,1);
							displayOptionsTracker["ticker_includeWaiverOrder_" + league_id] = 1;
							if (apply) jQuery("#includeWaiverOrder_checkbox").prop("checked", true);
						} else {
							includeWaiverOrder = false;
							//localStorage.setItem("ticker_includeWaiverOrder_"+league_id,0);
							displayOptionsTracker["ticker_includeWaiverOrder_" + league_id] = 0;
							if (apply) jQuery("#includeWaiverOrder_checkbox").prop("checked", false);
						}
						break;
					case 'draft':
						if (value) {
							includeDraft = true;
							//localStorage.setItem("ticker_includeDraft_"+league_id,1);
							displayOptionsTracker["ticker_includeDraft_" + league_id] = 1;
							if (apply) jQuery("#includeDraft_checkbox").prop("checked", true);
						} else {
							includeDraft = false;
							//localStorage.setItem("ticker_includeDraft_"+league_id,0);
							displayOptionsTracker["ticker_includeDraft_" + league_id] = 0;
							if (apply) jQuery("#includeDraft_checkbox").prop("checked", false);
						}
						if (includeDraft) {
							jQuery("#draftShowEntire_checkbox").removeAttr("disabled");
							jQuery("#draftShowEntire_checkbox").parent().removeClass("display-options-disabled");
						} else {
							jQuery("#draftShowEntire_checkbox").prop("disabled", "disabled");
							jQuery("#draftShowEntire_checkbox").parent().addClass("display-options-disabled");
						}
						if (draftShowEntire || !includeDraft) {
							jQuery("#draftTopPicksOnly_select").prop("disabled", "disabled");
							jQuery(".draftTopPicksOnly_text").addClass("display-options-disabled");
						} else {
							jQuery("#draftTopPicksOnly_select").removeAttr("disabled");
							jQuery(".draftTopPicksOnly_text").removeClass("display-options-disabled");
						}
						if (parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) {
							jQuery("#draftShowPicksMade_select").prop("disabled", "disabled");
							jQuery("#draftShowPicksPending_select").prop("disabled", "disabled");
							jQuery(".draftShowPicksMade_text").addClass("display-options-disabled");
							jQuery(".draftShowPicksPending_text").addClass("display-options-disabled");
						} else {
							jQuery("#draftShowPicksMade_select").removeAttr("disabled");
							jQuery("#draftShowPicksPending_select").removeAttr("disabled");
							jQuery(".draftShowPicksMade_text").removeClass("display-options-disabled");
							jQuery(".draftShowPicksPending_text").removeClass("display-options-disabled");
						}
						break;
					case 'draftShowEntire':
						if (value) {
							draftShowEntire = true;
							//localStorage.setItem("ticker_draftShowEntire_"+league_id,1);
							displayOptionsTracker["ticker_draftShowEntire_" + league_id] = 1;
							if (apply) jQuery("#draftShowEntire_checkbox").prop("checked", true);
						} else {
							draftShowEntire = false;
							//localStorage.setItem("ticker_draftShowEntire_"+league_id,0);
							displayOptionsTracker["ticker_draftShowEntire_" + league_id] = 0;
							if (apply) jQuery("#draftShowEntire_checkbox").prop("checked", false);
						}
						if (draftShowEntire || !includeDraft) {
							jQuery("#draftTopPicksOnly_select").prop("disabled", "disabled");
							jQuery(".draftTopPicksOnly_text").addClass("display-options-disabled");
						} else {
							jQuery("#draftTopPicksOnly_select").removeAttr("disabled");
							jQuery(".draftTopPicksOnly_text").removeClass("display-options-disabled");
						}
						if (parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) {
							jQuery("#draftShowPicksMade_select").prop("disabled", "disabled");
							jQuery("#draftShowPicksPending_select").prop("disabled", "disabled");
							jQuery(".draftShowPicksMade_text").addClass("display-options-disabled");
							jQuery(".draftShowPicksPending_text").addClass("display-options-disabled");
						} else {
							jQuery("#draftShowPicksMade_select").removeAttr("disabled");
							jQuery("#draftShowPicksPending_select").removeAttr("disabled");
							jQuery(".draftShowPicksMade_text").removeClass("display-options-disabled");
							jQuery(".draftShowPicksPending_text").removeClass("display-options-disabled");
						}
						break;
					case 'draftTopPicksOnly':
						draftTopPicksOnly = parseInt(value);
						//localStorage.setItem("ticker_draftTopPicksOnly_"+league_id,value);
						displayOptionsTracker["ticker_draftTopPicksOnly_" + league_id] = value;
						if (apply) jQuery("#draftTopPicksOnly_select").val(value);
						if (parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) {
							jQuery("#draftShowPicksMade_select").prop("disabled", "disabled");
							jQuery("#draftShowPicksPending_select").prop("disabled", "disabled");
							jQuery(".draftShowPicksMade_text").addClass("display-options-disabled");
							jQuery(".draftShowPicksPending_text").addClass("display-options-disabled");
						} else {
							jQuery("#draftShowPicksMade_select").removeAttr("disabled");
							jQuery("#draftShowPicksPending_select").removeAttr("disabled");
							jQuery(".draftShowPicksMade_text").removeClass("display-options-disabled");
							jQuery(".draftShowPicksPending_text").removeClass("display-options-disabled");
						}
						break;
					case 'draftShowPicksMade':
						draftShowPicksMade = parseInt(value);
						//localStorage.setItem("ticker_draftShowPicksMade_"+league_id,value);
						displayOptionsTracker["ticker_draftShowPicksMade_" + league_id] = value;
						if (apply) jQuery("#draftShowPicksMade_select").val(value);
						break;
					case 'draftShowPicksPending':
						draftShowPicksPending = parseInt(value);
						//localStorage.setItem("ticker_draftShowPicksPending_"+league_id,value);
						displayOptionsTracker["ticker_draftShowPicksPending_" + league_id] = value;
						if (apply) jQuery("#draftShowPicksPending_select").val(value);
						break;
					case 'fantasyMatchups':
						if (value) {
							includeFantasyMatchups = true;
							//localStorage.setItem("ticker_includeFantasyMatchups_"+league_id,1);
							displayOptionsTracker["ticker_includeFantasyMatchups_" + league_id] = 1;
							if (apply) jQuery("#includeFantasyMatchups_checkbox").prop("checked", true);
						} else {
							includeFantasyMatchups = false;
							//localStorage.setItem("ticker_includeFantasyMatchups_"+league_id,0);
							displayOptionsTracker["ticker_includeFantasyMatchups_" + league_id] = 0;
							if (apply) jQuery("#includeFantasyMatchups_checkbox").prop("checked", false);
						}
						break;
					case 'liveLeaders':
						includeLiveLeaders = parseInt(value);
						//localStorage.setItem("ticker_includeLiveLeaders_"+league_id,value);
						displayOptionsTracker["ticker_includeLiveLeaders_" + league_id] = value;
						if (apply) jQuery("#liveLeaders_select").val(value);
						if (includeLiveLeaders === 0) {
							jQuery("#liveLeadersIDP_checkbox").prop("disabled", "disabled");
							jQuery("#liveLeadersIDP_checkbox").parent().addClass("display-options-disabled");
						} else {
							jQuery("#liveLeadersIDP_checkbox").removeAttr("disabled");
							jQuery("#liveLeadersIDP_checkbox").parent().removeClass("display-options-disabled");
						}
						break;
					case 'liveLeadersIDP':
						if (value) {
							includeLiveLeadersIDP = true;
							//localStorage.setItem("ticker_includeLiveLeadersIDP_"+league_id,1);
							displayOptionsTracker["ticker_includeLiveLeadersIDP_" + league_id] = 1;
							if (apply) jQuery("#liveLeadersIDP_checkbox").prop("checked", true);
						} else {
							includeLiveLeadersIDP = false;
							//localStorage.setItem("ticker_includeLiveLeadersIDP_"+league_id,0);
							displayOptionsTracker["ticker_includeLiveLeadersIDP_" + league_id] = 0;
							if (apply) jQuery("#liveLeadersIDP_checkbox").prop("checked", false);
						}
						break;
					case 'nflMatchups':
						if (value) {
							includeNflMatchups = true;
							//localStorage.setItem("ticker_includeNflMatchups_"+league_id,1);
							displayOptionsTracker["ticker_includeNflMatchups_" + league_id] = 1;
							if (apply) jQuery("#includeNflMatchups_checkbox").prop("checked", true);
						} else {
							includeNflMatchups = false;
							//localStorage.setItem("ticker_includeNflMatchups_"+league_id,0);
							displayOptionsTracker["ticker_includeNflMatchups_" + league_id] = 0;
							if (apply) jQuery("#includeNflMatchups_checkbox").prop("checked", false);
						}
						if (!includeNflMatchups) {
							jQuery("#includeNflMatchupLeaders_checkbox").prop("disabled", "disabled");
							jQuery("#includeNflMatchupLeaders_checkbox").parent().addClass("display-options-disabled");
						} else {
							jQuery("#includeNflMatchupLeaders_checkbox").removeAttr("disabled");
							jQuery("#includeNflMatchupLeaders_checkbox").parent().removeClass("display-options-disabled");
						}
						break;
					case 'nflMatchupLeaders':
						if (value) {
							includeNflMatchupLeaders = true;
							//localStorage.setItem("ticker_includeNflMatchupLeaders_"+league_id,1);
							displayOptionsTracker["ticker_includeNflMatchupLeaders_" + league_id] = 1;
							if (apply) jQuery("#includeNflMatchupLeaders_checkbox").prop("checked", true);
						} else {
							includeNflMatchups = false;
							//localStorage.setItem("ticker_includeNflMatchupLeaders_"+league_id,0);
							displayOptionsTracker["ticker_includeNflMatchupLeaders_" + league_id] = 0;
							if (apply) jQuery("#includeNflMatchupLeaders_checkbox").prop("checked", false);
						}
						break;
				}
			}

			function userPanelDisplay(which, isShow) {
				jQuery(".about_row").hide();
				jQuery(".global_row").hide();
				jQuery(".standard_row").hide();
				jQuery(".live_row").hide();
				jQuery(".button_row").hide();
				jQuery(".about_hide").hide();
				jQuery(".global_hide").hide();
				jQuery(".standard_hide").hide();
				jQuery(".live_hide").hide();
				jQuery(".about_show").show();
				jQuery(".global_show").show();
				jQuery(".standard_show").show();
				jQuery(".live_show").show();
				if (isShow) {
					jQuery("." + which + "_row").show();
					jQuery("." + which + "_show").hide();
					jQuery("." + which + "_hide").show();
					if (which !== 'about') jQuery(".button_row").show();
				} else {
					jQuery("." + which + "_show").show();
					jQuery("." + which + "_hide").hide();
				}
			}

			function buildDisplayOptions() {
				if (localStorage.hasOwnProperty('ticker_includeFranchiseIcons_' + league_id))
					if (localStorage.getItem('ticker_includeFranchiseIcons_' + league_id) === '1') includeFranchiseIcons = true;
					else includeFranchiseIcons = false;
				if (localStorage.hasOwnProperty('ticker_tickerSize_' + league_id)) tickerSize = localStorage.getItem('ticker_tickerSize_' + league_id);
				if (localStorage.hasOwnProperty('ticker_tickerDelay_' + league_id)) tickerDelay = localStorage.getItem('ticker_tickerDelay_' + league_id);
				if (localStorage.hasOwnProperty('ticker_includeLatestArticles_' + league_id)) includeLatestArticles = parseInt(localStorage.getItem('ticker_includeLatestArticles_' + league_id));
				if (localStorage.hasOwnProperty('ticker_includeTopPlayerStats_' + league_id)) includeTopPlayerStats = parseInt(localStorage.getItem('ticker_includeTopPlayerStats_' + league_id));
				if (localStorage.hasOwnProperty('ticker_includeTopPlayerStatsIDP_' + league_id))
					if (localStorage.getItem('ticker_includeTopPlayerStatsIDP_' + league_id) === '1') includeTopPlayerStatsIDP = true;
					else includeTopPlayerStatsIDP = false;
				if (localStorage.hasOwnProperty('ticker_includeTopPlayerPts_' + league_id)) includeTopPlayerPts = parseInt(localStorage.getItem('ticker_includeTopPlayerPts_' + league_id));
				if (localStorage.hasOwnProperty('ticker_includePowerRank_' + league_id))
					if (localStorage.getItem('ticker_includePowerRank_' + league_id) === '1') includePowerRank = true;
					else includePowerRank = false;
				if (localStorage.hasOwnProperty('ticker_includeAltPowerRank_' + league_id))
					if (localStorage.getItem('ticker_includeAltPowerRank_' + league_id) === '1') includeAltPowerRank = true;
					else includeAltPowerRank = false;
				if (localStorage.hasOwnProperty('ticker_includePointScoredTeam_' + league_id))
					if (localStorage.getItem('ticker_includePointScoredTeam_' + league_id) === '1') includePointScoredTeam = true;
					else includePointScoredTeam = false;
				if (localStorage.hasOwnProperty('ticker_includeAllplayRecord_' + league_id))
					if (localStorage.getItem('ticker_includeAllplayRecord_' + league_id) === '1') includeAllplayRecord = true;
					else includeAllplayRecord = false;
				if (localStorage.hasOwnProperty('ticker_includeLastWeekResults_' + league_id))
					if (localStorage.getItem('ticker_includeLastWeekResults_' + league_id) === '1') includeLastWeekResults = true;
					else includeLastWeekResults = false;
				if (localStorage.hasOwnProperty('ticker_includeNextWeekMatchups_' + league_id))
					if (localStorage.getItem('ticker_includeNextWeekMatchups_' + league_id) === '1') includeNextWeekMatchups = true;
					else includeNextWeekMatchups = false;
				if (localStorage.hasOwnProperty('ticker_includeLastWeekNflResults_' + league_id))
					if (localStorage.getItem('ticker_includeLastWeekNflResults_' + league_id) === '1') includeLastWeekNflResults = true;
					else includeLastWeekNflResults = false;
				if (localStorage.hasOwnProperty('ticker_includeNextWeekNflMatchups_' + league_id))
					if (localStorage.getItem('ticker_includeNextWeekNflMatchups_' + league_id) === '1') includeNextWeekNflMatchups = true;
					else includeNextWeekNflMatchups = false;
				if (localStorage.hasOwnProperty('ticker_includeWaiverOrder_' + league_id))
					if (localStorage.getItem('ticker_includeWaiverOrder_' + league_id) === '1') includeWaiverOrder = true;
					else includeWaiverOrder = false;
				if (localStorage.hasOwnProperty('ticker_includeDraft_' + league_id))
					if (localStorage.getItem('ticker_includeDraft_' + league_id) === '1') includeDraft = true;
					else includeDraft = false;
				if (localStorage.hasOwnProperty('ticker_draftShowEntire_' + league_id))
					if (localStorage.getItem('ticker_draftShowEntire_' + league_id) === '1') draftShowEntire = true;
					else draftShowEntire = false;
				if (localStorage.hasOwnProperty('ticker_draftTopPicksOnly_' + league_id)) draftTopPicksOnly = parseInt(localStorage.getItem('ticker_draftTopPicksOnly_' + league_id));
				if (localStorage.hasOwnProperty('ticker_draftShowPicksMade_' + league_id)) draftShowPicksMade = parseInt(localStorage.getItem('ticker_draftShowPicksMade_' + league_id));
				if (localStorage.hasOwnProperty('ticker_draftShowPicksPending_' + league_id)) draftShowPicksPending = parseInt(localStorage.getItem('ticker_draftShowPicksPending_' + league_id));
				if (localStorage.hasOwnProperty('ticker_includeFantasyMatchups_' + league_id)) includeFantasyMatchups = parseInt(localStorage.getItem('ticker_includeFantasyMatchups_' + league_id));
				if (localStorage.hasOwnProperty('ticker_includeLiveLeaders_' + league_id)) includeLiveLeaders = parseInt(localStorage.getItem('ticker_includeLiveLeaders_' + league_id));
				if (localStorage.hasOwnProperty('ticker_includeLiveLeadersIDP_' + league_id))
					if (localStorage.getItem('ticker_includeLiveLeadersIDP_' + league_id) === '1') includeLiveLeadersIDP = true;
					else includeLiveLeadersIDP = false;
				if (localStorage.hasOwnProperty('ticker_includeNflMatchups_' + league_id)) includeNflMatchups = parseInt(localStorage.getItem('ticker_includeNflMatchups_' + league_id));
				if (localStorage.hasOwnProperty('ticker_includeNflMatchupLeaders_' + league_id)) includeNflMatchupLeaders = parseInt(localStorage.getItem('ticker_includeNflMatchupLeaders_' + league_id));

				displayOptionsInitialSettings['ticker_includeFranchiseIcons'] = includeFranchiseIcons;
				displayOptionsInitialSettings['ticker_tickerSize'] = tickerSize;
				displayOptionsInitialSettings['ticker_tickerDelay'] = tickerDelay;
				displayOptionsInitialSettings['ticker_includeLatestArticles'] = includeLatestArticles;
				displayOptionsInitialSettings['ticker_includeTopPlayerStats'] = includeTopPlayerStats;
				displayOptionsInitialSettings['ticker_includeTopPlayerStatsIDP'] = includeTopPlayerStatsIDP;
				displayOptionsInitialSettings['ticker_includeTopPlayerPts'] = includeTopPlayerPts;
				displayOptionsInitialSettings['ticker_includePowerRank'] = includePowerRank;
				displayOptionsInitialSettings['ticker_includeAltPowerRank'] = includeAltPowerRank;
				displayOptionsInitialSettings['ticker_includePointScoredTeam'] = includePointScoredTeam;
				displayOptionsInitialSettings['ticker_includeAllplayRecord'] = includeAllplayRecord;
				displayOptionsInitialSettings['ticker_includeLastWeekResults'] = includeLastWeekResults;
				displayOptionsInitialSettings['ticker_includeNextWeekMatchups'] = includeNextWeekMatchups;
				displayOptionsInitialSettings['ticker_includeLastWeekNflResults'] = includeLastWeekNflResults;
				displayOptionsInitialSettings['ticker_includeNextWeekNflMatchups'] = includeNextWeekNflMatchups;
				displayOptionsInitialSettings['ticker_includeWaiverOrder'] = includeWaiverOrder;
				displayOptionsInitialSettings['ticker_includeDraft'] = includeDraft;
				displayOptionsInitialSettings['ticker_draftShowEntire'] = draftShowEntire;
				displayOptionsInitialSettings['ticker_draftTopPicksOnly'] = draftTopPicksOnly;
				displayOptionsInitialSettings['ticker_draftShowPicksMade'] = draftShowPicksMade;
				displayOptionsInitialSettings['ticker_includeFantasyMatchups'] = includeFantasyMatchups;
				displayOptionsInitialSettings['ticker_draftShowPicksPending'] = draftShowPicksPending;
				displayOptionsInitialSettings['ticker_includeLiveLeaders'] = includeLiveLeaders;
				displayOptionsInitialSettings['ticker_includeLiveLeadersIDP'] = includeLiveLeadersIDP;
				displayOptionsInitialSettings['ticker_includeNflMatchups'] = includeNflMatchups;
				displayOptionsInitialSettings['ticker_includeNflMatchupLeaders'] = includeNflMatchupLeaders;

				var html = '';

				//ABOUT
				html += '<tbody>';
				html += '<tr><td colspan="3" style="width:24.625rem;text-align:center;position:relative;overflow:hidden" class="warning">ABOUT<span class="about_show displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'about\',true)"><i class="fa-regular fa-caret-down" aria-hidden="true"></i></span><span class="about_hide cp_hidden displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'about\',false)"><i class="fa-regular fa-caret-up" aria-hidden="true"></i></span></td></tr>';
				html += '</tbody>';

				//ABOUT CONTENT
				html += '<tbody class="about_row" style="display:none">';
				html += '<tr class="oddtablerow">';
				html += '<td colspan="3">';
				html += '<p>This marquee shows information about your fantasy league.</p>';
				html += '<p>There are two separate displays for the marquee, <b>STANDARD</b> and <b>LIVE</b>, that are automatically toggled depending on the time of the fantasy week.  In a given week <b>before the first NFL game kicks off is the standard display</b>.  This display will show items that are enabled in the standard section below.  <b>Once the first game kicks off the marquee will change to live mode</b> and will only show items enabled in the live section below.  <b>Global items will always be shown</b>.</p>';
				html += '<p>The commissioner has set up the default view for the marquee but you as a user can turn on or off any setting to your liking and the marquee will remember your selections the next time you visit the site. To customize open any of the three separate areas (Global, Standard and Live) set your preferences and hit apply. To revert back to commissioner view hit reset.</p>';
				html += '<p>The settings are per device so changes made on your PC will not be applied to your mobile device and vice versa.</p>';
				html += '</td>';
				html += '</tr>';

				//GLOBAL DISPLAY
				html += '<tbody>';
				html += '<tr><td colspan="3" style="width:24.625rem;text-align:center;position:relative;overflow:hidden" class="warning">GLOBAL DISPLAY<span class="global_show displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'global\',true)"><i class="fa-regular fa-caret-down" aria-hidden="true"></i></span><span class="global_hide cp_hidden displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'global\',false)"><i class="fa-regular fa-caret-up" aria-hidden="true"></i></span></td></tr>';
				html += '</tbody>';

				//COMMISSIONER MESSAGES
				html += '<tbody class="global_row" style="display:none">';
				html += '<tr class="oddtablerow">';
				html += '<td colspan="3"><div class="ticker_setting_ck display-options-disabled"><input name="commishMessages" type="checkbox" checked="checked" disabled="disabled" name="includeCommishMessages_checkbox" id="includeCommishMessages_checkbox" class="includeCommishMessages_checkbox"><label for="includeCommishMessages_checkbox">Commissioner Messages (if any)</label></div></td>';
				html += '</tr>';

				//FRANCHISE ICONS
				html += '<tr class="eventablerow">';
				html += '<td colspan="3"><div class="ticker_setting_ck"><input name="franchiseIcons" type="checkbox"' + ((includeFranchiseIcons) ? ' checked="checked"' : '') + ' name="includeFranchiseIcons_checkbox" id="includeFranchiseIcons_checkbox" class="includeFranchiseIcons_checkbox" onchange="userUpdateDisplayOptions(\'franchiseIcon\',this.checked)"><label for="includeFranchiseIcons_checkbox">Show Franchise Icons where applicable</label></div></td>';
				html += '</tr>';

				//TICKER SIZE & TICKER DELAY
				html += '<tr class="oddtablerow">';
				html += '<td>';
				html += '<select class="select-display-options" name="tickerSize_select" id="tickerSize_select" onchange="userUpdateDisplayOptions(\'tickerSize\',this.value)">';
				html += '<option value="small"' + ((tickerSize === 'small') ? ' selected="selected"' : '') + '>Small</option>';
				html += '<option value="medium"' + ((tickerSize === 'medium') ? ' selected="selected"' : '') + '>Medium</option>';
				html += '<option value="large"' + ((tickerSize === 'large') ? ' selected="selected"' : '') + '>Large</option>';
				html += '</select> Ticker Size';
				html += '</td>';
				html += '<td colspan="2">';
				html += '<select class="select-display-options" name="tickerDelay_select" id="tickerDelay_select" onchange="userUpdateDisplayOptions(\'tickerDelay\',this.value)">';
				html += '<option value="1"' + ((parseInt(tickerDelay) === 1) ? ' selected="selected"' : '') + '>1</option>';
				html += '<option value="2"' + ((parseInt(tickerDelay) === 2) ? ' selected="selected"' : '') + '>2</option>';
				html += '<option value="3"' + ((parseInt(tickerDelay) === 3) ? ' selected="selected"' : '') + '>3</option>';
				html += '<option value="4"' + ((parseInt(tickerDelay) === 4) ? ' selected="selected"' : '') + '>4</option>';
				html += '<option value="5"' + ((parseInt(tickerDelay) === 5) ? ' selected="selected"' : '') + '>5</option>';
				html += '<option value="6"' + ((parseInt(tickerDelay) === 6) ? ' selected="selected"' : '') + '>6</option>';
				html += '</select> Delay seconds before scroll';
				html += '</td>';
				html += '</tr>';

				//LEAGUE ARTICLES
				html += '<tr class="eventablerow">';
				html += '<td colspan="3">';
				html += '<select class="select-display-options" name="includeLatestArticles_select" id="includeLatestArticles_select" onchange="userUpdateDisplayOptions(\'articles\',this.value)">';
				for (var i = 0; i <= 20; i++) {
					if (i === includeLatestArticles)
						html += '<option value="' + i + '" selected="selected">' + i + '</option>';
					else
						html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select> # of Article Headlines';
				html += '</td>';
				html += '</tr>';
				html += '</tbody>';

				//STANDARD DISPLAY
				html += '<tbody>';
				html += '<tr><td colspan="3" style="width:24.625rem;text-align:center;position:relative;overflow:hidden" class="warning">STANDARD DISPLAY<span class="standard_show displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'standard\',true)"><i class="fa-regular fa-caret-down" aria-hidden="true"></i></span><span class="standard_hide cp_hidden displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'standard\',false)"><i class="fa-regular fa-caret-up" aria-hidden="true"></i></span></td></tr>';
				html += '</tbody>';

				//TOP PLAYERS BY STATS CATEGORY
				html += '<tbody class="standard_row" style="display:none">';
				html += '<tr class="oddtablerow">';
				html += '<td colspan="2">';
				html += '<select class="select-display-options" name="topPlayerStats_select" id="topPlayerStats_select" onchange="userUpdateDisplayOptions(\'topPlayerStats\',this.value)">';
				for (var i = 0; i <= 20; i++) {
					if (i === includeTopPlayerStats)
						html += '<option value="' + i + '" selected="selected">' + i + '</option>';
					else
						html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select> # Top Player by Cat';
				html += '</td>';
				if (isLeagueIDP)
					html += '<td><div class="ticker_setting_ck' + ((includeTopPlayerStats === 0) ? ' display-options-disabled' : '') + '"><input type="checkbox"' + ((includeTopPlayerStatsIDP) ? ' checked="checked"' : '') + ((includeTopPlayerStats === 0) ? ' disabled="disabled"' : '') + ' name="topPlayerStatsIDP_checkbox" id="topPlayerStatsIDP_checkbox" class="topPlayerStatsIDP_checkbox" onchange="userUpdateDisplayOptions(\'topPlayerStatsIDP\',this.checked)"><label for="topPlayerStatsIDP_checkbox">Include IDP</label></div></td>';
				else
					html += '<td> </td>';
				html += '</tr>';

				//TOP PLAYERS BY FANTASY POINTS
				html += '<tr class="eventablerow">';
				html += '<td colspan="3">';
				html += '<select class="select-display-options" name="topPlayerPts_select" id="topPlayerPts_select" onchange="userUpdateDisplayOptions(\'topPlayerPts\',this.value)">';
				for (var i = 0; i <= 20; i++) {
					if (i === includeTopPlayerPts)
						html += '<option value="' + i + '" selected="selected">' + i + '</option>';
					else
						html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select> # Top Player Pts';
				html += '</td>';
				html += '</tr>';

				//POWER RANK, ALT POWER RANK, POINT SCORED, ALL PLAY 
				html += '<tr class="oddtablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includePowerRank) ? ' checked="checked"' : '') + ' name="includePowerRank_checkbox" id="includePowerRank_checkbox" class="includePowerRank_checkbox" onchange="userUpdateDisplayOptions(\'powerRank\',this.checked)"><label for="includePowerRank_checkbox">Power Rank</label></div></td>';
				html += '<td colspan="2"><div class="ticker_setting_ck"><input type="checkbox"' + ((includePointScoredTeam) ? ' checked="checked"' : '') + ' name="includePointScoredTeam_checkbox" id="includePointScoredTeam_checkbox" class="includePointScoredTeam_checkbox" onchange="userUpdateDisplayOptions(\'pointScoredTeam\',this.checked)"><label for="includePointScoredTeam_checkbox">Points Scored Rank</label></div></td>';
				html += '</tr>';
				html += '<tr class="eventablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includeAltPowerRank) ? ' checked="checked"' : '') + ' name="includeAltPowerRank_checkbox" id="includeAltPowerRank_checkbox" class="includeAltPowerRank_checkbox" onchange="userUpdateDisplayOptions(\'altPowerRank\',this.checked)"><label for="includeAltPowerRank_checkbox">Alternate Power Rank</label></div></td>';
				html += '<td colspan="2"><div class="ticker_setting_ck"><input type="checkbox"' + ((includeAllplayRecord) ? ' checked="checked"' : '') + ' name="includeAllplayRecord_checkbox" id="includeAllplayRecord_checkbox" class="includeAllplayRecord_checkbox" onchange="userUpdateDisplayOptions(\'allplayRecord\',this.checked)"><label for="includeAllplayRecord_checkbox">All Play Rank</label></div></td>';
				html += '</tr>';

				//LAST WEEK RESULTS AND NEXT WEEK MATCHUPS
				html += '<tr class="oddtablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includeLastWeekResults) ? ' checked="checked"' : '') + ' name="includeLastWeekResults_checkbox" id="includeLastWeekResults_checkbox" class="includeLastWeekResults_checkbox" onchange="userUpdateDisplayOptions(\'lastWeekResults\',this.checked)"><label for="includeLastWeekResults_checkbox">Last Week Results</label></div></td>';
				if (!isLeagueHeadToHead)
					html += '<td colspan="2"> </td>'; //RESERVED FOR ALLPLAY PROJECTED SCORES
				else
					html += '<td colspan="2"><div class="ticker_setting_ck"><input type="checkbox"' + ((includeNextWeekMatchups) ? ' checked="checked"' : '') + ' name="includeNextWeekMatchups_checkbox" id="includeNextWeekMatchups_checkbox" class="includeNextWeekMatchups_checkbox" onchange="userUpdateDisplayOptions(\'nextWeekMatchups\',this.checked)"><label for="includeNextWeekMatchups_checkbox">Next Week Matchups</label></div></td>';
				html += '</tr>';

				//LAST WEEK NFL RESULTS AND NEXT WEEK NFL MATCHUPS
				html += '<tr class="oddtablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includeLastWeekNflResults) ? ' checked="checked"' : '') + ' name="includeLastWeekNflResults_checkbox" id="includeLastWeekNflResults_checkbox" class="includeLastWeekNflResults_checkbox" onchange="userUpdateDisplayOptions(\'lastWeekNflResults\',this.checked)"><label for="includeLastWeekNflResults_checkbox">Last Week NFL Results</label></div></td>';
				html += '<td colspan="2"><div class="ticker_setting_ck"><input type="checkbox"' + ((includeNextWeekNflMatchups) ? ' checked="checked"' : '') + ' name="includeNextWeekNflMatchups_checkbox" id="includeNextWeekNflMatchups_checkbox" class="includeNextWeekNflMatchups_checkbox" onchange="userUpdateDisplayOptions(\'nextWeekNflMatchups\',this.checked)"><label for="includeNextWeekNflMatchups_checkbox">Next Week NFL Matchups</label></div></td>';
				html += '</tr>';

				//WAIVER ORDER
				html += '<tr class="eventablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includeWaiverOrder) ? ' checked="checked"' : '') + ' name="includeWaiverOrder_checkbox" id="includeWaiverOrder_checkbox" class="includeWaiverOrder_checkbox" onchange="userUpdateDisplayOptions(\'waiverOrder\',this.checked)"><label for="includeWaiverOrder_checkbox">Waiver Order</label></div></td>';
				html += '<td colspan="2"> </td>';
				html += '</tr>';

				//DRAFT OPTIONS SPREAD OVER 2 EVEN TABLE ROWS
				html += '<tr class="oddtablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includeDraft) ? ' checked="checked"' : '') + ' name="includeDraft_checkbox" id="includeDraft_checkbox" class="includeDraft_checkbox" onchange="userUpdateDisplayOptions(\'draft\',this.checked)"><label for="includeDraft_checkbox">Fantasy Draft</label></div></td>';
				html += '<td colspan="2">';
				html += '<select class="select-display-options' + ((draftShowEntire || !includeDraft) ? ' display-options-disabled' : '') + '" name="draftTopPicksOnly_select" id="draftTopPicksOnly_select" onchange="userUpdateDisplayOptions(\'draftTopPicksOnly\',this.value)"' + ((draftShowEntire || !includeDraft) ? ' disabled="disabled"' : '') + '>';
				for (var i = 0; i <= 50; i++) {
					if (i === draftTopPicksOnly)
						html += '<option value="' + i + '" selected="selected">' + i + '</option>';
					else
						html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select> <span class="draftTopPicksOnly_text' + ((draftShowEntire || !includeDraft) ? ' display-options-disabled' : '') + '"># Top Picks Only</span>';
				html += '</td>';
				html += '</tr>';
				html += '<tr class="oddtablerow">';
				html += '<td><div class="ticker_setting_ck' + ((!includeDraft) ? ' display-options-disabled' : '') + '"><input type="checkbox"' + ((draftShowEntire) ? ' checked="checked"' : '') + ((!includeDraft) ? ' disabled="disabled"' : '') + ' name="draftShowEntire_checkbox" id="draftShowEntire_checkbox" class="draftShowEntire_checkbox" onchange="userUpdateDisplayOptions(\'draftShowEntire\',this.checked)"><label for="draftShowEntire_checkbox">Show all rounds/picks</label></div></td>';
				html += '<td colspan="2">';
				html += '<select class="select-display-options' + ((parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) ? ' display-options-disabled' : '') + '" name="draftShowPicksMade_select" id="draftShowPicksMade_select" onchange="userUpdateDisplayOptions(\'draftShowPicksMade\',this.value)"' + ((parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) ? ' disabled="disabled"' : '') + '>';
				for (var i = 0; i <= 20; i++) {
					if (i === draftShowPicksMade)
						html += '<option value="' + i + '" selected="selected">' + i + '</option>';
					else
						html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select> <span class="draftShowPicksMade_text' + ((parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) ? ' display-options-disabled' : '') + '"># Latest Picks Made</span>';
				html += '</td>';
				html += '</tr>';
				html += '<tr class="oddtablerow">';
				html += '<td> </td>';
				html += '<td colspan="2">';
				html += '<select class="select-display-options' + ((parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) ? ' display-options-disabled' : '') + '" name="draftShowPicksPending_select" id="draftShowPicksPending_select" onchange="userUpdateDisplayOptions(\'draftShowPicksPending\',this.value)"' + ((parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) ? ' disabled="disabled"' : '') + '>';
				for (var i = 0; i <= 20; i++) {
					if (i === draftShowPicksPending)
						html += '<option value="' + i + '" selected="selected">' + i + '</option>';
					else
						html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select> <span class="draftShowPicksPending_text' + ((parseInt(draftTopPicksOnly) > 0 || draftShowEntire || !includeDraft) ? ' display-options-disabled' : '') + '"># Picks Pending</span>';
				html += '</td>';
				html += '</tr>';

				html += '</tbody>';

				//LIVE DISPLAY
				html += '<tbody>';
				html += '<tr><td colspan="3" style="width:24.625rem;text-align:center;position:relative;overflow:hidden" class="warning">LIVE DISPLAY<span class="live_show displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'live\',true)"><i class="fa-regular fa-caret-down" aria-hidden="true"></i></span><span class="live_hide cp_hidden displayToggleSet" style="cursor:pointer;position:absolute;right:0.313rem" onclick="userPanelDisplay(\'live\',false)"><i class="fa-regular fa-caret-up" aria-hidden="true"></i></span></td></tr>';
				html += '</tbody>';

				//FANTASY MATCHUPS AND PACE SCORES
				html += '<tbody class="live_row" style="display:none">';
				html += '<tr class="oddtablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includeFantasyMatchups) ? ' checked="checked"' : '') + ' name="includeFantasyMatchups_checkbox" id="includeFantasyMatchups_checkbox" class="includeFantasyMatchups_checkbox" onchange="userUpdateDisplayOptions(\'fantasyMatchups\',this.checked)"><label for="includeFantasyMatchups_checkbox">Fantasy ' + ((!isLeagueHeadToHead) ? 'Scores' : 'Matchups') + '</label></div></td>';
				//html+='<td colspan="2"><div class="ticker_setting_ck' + ((!includeNflMatchups)?' display-options-disabled':'') + '"><input type="checkbox"'+ ((includeNflMatchupLeaders)?' checked="checked"':'') + ((!includeNflMatchups)?' disabled="disabled"':'') + ' name="includeNflMatchupLeaders_checkbox" id="includeNflMatchupLeaders_checkbox" class="includeNflMatchupLeaders_checkbox" onchange="userUpdateDisplayOptions(\'nflMatchupLeaders\',this.checked)"><label for="includeNflMatchupLeaders_checkbox">Include NFL Matchup Leaders</label></div></td>';
				html += '<td colspan="2"> </td>'; //RESERVED FOR INCLUDE PACE SCORES
				html += '</tr>';

				//TOP LIVE PLAYERS BY STATS CATEGORY
				html += '<tr class="eventablerow">';
				html += '<td colspan="2">';
				html += '<select class="select-display-options" name="liveLeaders_select" id="liveLeaders_select" onchange="userUpdateDisplayOptions(\'liveLeaders\',this.value)">';
				for (var i = 0; i <= 10; i++) {
					if (i === includeLiveLeaders)
						html += '<option value="' + i + '" selected="selected">' + i + '</option>';
					else
						html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select> # Top Live by Cat';
				html += '</td>';
				if (isLeagueIDP)
					html += '<td><div class="ticker_setting_ck' + ((includeLiveLeaders === 0) ? ' display-options-disabled' : '') + '"><input type="checkbox"' + ((includeLiveLeadersIDP) ? ' checked="checked"' : '') + ((includeLiveLeaders === 0) ? ' disabled="disabled"' : '') + ' name="liveLeadersIDP_checkbox" id="liveLeadersIDP_checkbox" class="liveLeadersIDP_checkbox" onchange="userUpdateDisplayOptions(\'liveLeadersIDP\',this.checked)"><label for="liveLeadersIDP_checkbox">Include IDP</label></div></td>';
				else
					html += '<td> </td>';
				html += '</tr>';

				//NFL MATCHUPS AND NFL MATCHUPS LEADERS
				html += '<tr class="oddtablerow">';
				html += '<td><div class="ticker_setting_ck"><input type="checkbox"' + ((includeNflMatchups) ? ' checked="checked"' : '') + ' name="includeNflMatchups_checkbox" id="includeNflMatchups_checkbox" class="includeNflMatchups_checkbox" onchange="userUpdateDisplayOptions(\'nflMatchups\',this.checked)"><label for="includeNflMatchups_checkbox">NFL Matchups</label></div></td>';
				html += '<td colspan="2"><div class="ticker_setting_ck' + ((!includeNflMatchups) ? ' display-options-disabled' : '') + '"><input type="checkbox"' + ((includeNflMatchupLeaders) ? ' checked="checked"' : '') + ((!includeNflMatchups) ? ' disabled="disabled"' : '') + ' name="includeNflMatchupLeaders_checkbox" id="includeNflMatchupLeaders_checkbox" class="includeNflMatchupLeaders_checkbox" onchange="userUpdateDisplayOptions(\'nflMatchupLeaders\',this.checked)"><label for="includeNflMatchupLeaders_checkbox">NFL Matchup Leaders</label></div></td>';
				html += '</tr>';
				html += '</tbody>';

				//BUTTONS
				html += '<tbody class="button_row" style="display:none">';
				html += '<tr class="button_row">';
				html += '<td colspan="3" style="text-align:center">';
				html += '<div><span class="form_buttons"><input type="button" value="apply" onclick="userSetDisplayOptions()" /></span><span class="form_buttons"><input type="button" value="reset" title="Reset to Commissioner View" onclick="userResetDisplayOptions()" /></span><span class="form_buttons"><input type="button" value="cancel" onclick="userCancelDisplayOptions()" /></span></div>';
				html += '<div class="form_buttons"></div>';
				html += '</td>';
				html += '</tr>';
				html += '</tbody>';

				jQuery('#tbody_display_settings').html(html);
			}

			updateSpeedControl();
			var displayOptionsTracker = [];
			var displayOptionsInitialSettings = [];

			var latestArticles_ar = [];
			var topPlayerStats_ar = [];
			topPlayerStats_ar.Passers = [];
			topPlayerStats_ar.Rushers = [];
			topPlayerStats_ar.Receivers = [];
			topPlayerStats_ar.Kickers = [];
			topPlayerStats_ar.Defenders = [];
			var topPlayerPts_ar = [];
			topPlayerPts_ar.regular = [];
			topPlayerPts_ar.playoff = [];
			topPlayerPts_ar.regular.QB = [];
			topPlayerPts_ar.regular.RB = [];
			topPlayerPts_ar.regular.WR = [];
			topPlayerPts_ar.regular.TE = [];
			topPlayerPts_ar.regular.PK = [];
			topPlayerPts_ar.regular.Def = [];
			topPlayerPts_ar.regular.DT = [];
			topPlayerPts_ar.regular.DE = [];
			topPlayerPts_ar.regular.LB = [];
			topPlayerPts_ar.regular.CB = [];
			topPlayerPts_ar.regular.S = [];
			topPlayerPts_ar.regular.Coach = [];
			topPlayerPts_ar.playoff.QB = [];
			topPlayerPts_ar.playoff.RB = [];
			topPlayerPts_ar.playoff.WR = [];
			topPlayerPts_ar.playoff.TE = [];
			topPlayerPts_ar.playoff.PK = [];
			topPlayerPts_ar.playoff.Def = [];
			topPlayerPts_ar.playoff.DT = [];
			topPlayerPts_ar.playoff.DE = [];
			topPlayerPts_ar.playoff.LB = [];
			topPlayerPts_ar.playoff.CB = [];
			topPlayerPts_ar.playoff.S = [];
			topPlayerPts_ar.playoff.Coach = [];
			var tickerLastWeekResults_ar = [];
			var tickerNextWeekMatchups_ar = [];
			var tickerLastWeekNflResults_ar = [];
			var tickerNextWeekNflMatchups_ar = [];
			var tickerWaiverOrder_ar = [];
			var tickerRankOrder_ar = [];
			tickerRankOrder_ar.power = [];
			tickerRankOrder_ar.alt_power = [];
			tickerRankOrder_ar.points_scored = [];
			tickerRankOrder_ar.all_play_record = [];
			var tickerDraftResults_ar = [];
			var liveLeadersFound = false;
			var tickerLiveLeaders_ar = [];
			tickerLiveLeaders_ar['Passing'] = [];
			tickerLiveLeaders_ar['Rushing'] = [];
			tickerLiveLeaders_ar['Receiving'] = [];
			tickerLiveLeaders_ar['Defenders'] = [];
			tickerLiveLeaders_ar['Matchups'] = [];
			var tickerFantasyMatchups_ar = [];

			async function triggerReportTicker() {
				if (!scrollingTriggered && tickerContent.length > 0) updateTicker(false);
				tickerStartWeek = startWeek;
				tickerEndWeek = endWeek;
				if (tickerCompletedWeek > tickerEndWeek) tickerCompletedWeek = tickerEndWeek;
				if (tickerLiveScoringWeek > tickerEndWeek) tickerLiveScoringWeek = tickerEndWeek;
				if (tickerLastPlayoffWeek > tickerEndWeek) tickerLastPlayoffWeek = tickerEndWeek;
				try {
					initTickerNflSchedule();

					await Promise.all([
						getLatestArticles(),
						getTopPlayerStats('Passers'),
						getTopPlayerStats('Passers'),
						getTopPlayerStats('Rushers'),
						getTopPlayerStats('Receivers'),
						getTopPlayerStats('Kickers'),
						getTopPlayerStats('Defenders'),
						getTopPlayerPts(true),
						getTopPlayerPts(false),
						getLastWeekResults(),
						getNextWeekMatchups(),
						getLastWeekNflResults(),
						getNextWeekNflMatchups(),
						getWaiverOrder(),
						getTickerDraftResults(false),
						getTickerLiveStats(false),
						getFantasyMatchups(false),
						getPowerRank(0),
						getPowerRank(1),
						getPowerRank(2),
						getPowerRank(3)
					]);
					//GLOBAL STUFF
					if (latestArticles_ar.length > 0)
						for (var i = 0; i < latestArticles_ar.length; i++) addTickerContent(latestArticles_ar[i].header, latestArticles_ar[i].message);
					if (liveLeadersFound) { //LIVE MODE ONLY
						if (tickerFantasyMatchups_ar.length > 0) addTickerContent(tickerFantasyMatchups_ar[0].header, tickerFantasyMatchups_ar[0].message, 'fantasyMatchups');
						if (tickerFantasyMatchups_ar.length > 0) fantasyMatchupsInterval = setInterval("getFantasyMatchups(true)", 45000);
						if (tickerLiveLeaders_ar['Passing'].length > 0) addTickerContent(tickerLiveLeaders_ar['Passing'][0].header, tickerLiveLeaders_ar['Passing'][0].message, 'livePassers');
						if (tickerLiveLeaders_ar['Rushing'].length > 0) addTickerContent(tickerLiveLeaders_ar['Rushing'][0].header, tickerLiveLeaders_ar['Rushing'][0].message, 'liveRushers');
						if (tickerLiveLeaders_ar['Receiving'].length > 0) addTickerContent(tickerLiveLeaders_ar['Receiving'][0].header, tickerLiveLeaders_ar['Receiving'][0].message, 'liveReceivers');
						if (tickerLiveLeaders_ar['Defenders'].length > 0) addTickerContent(tickerLiveLeaders_ar['Defenders'][0].header, tickerLiveLeaders_ar['Defenders'][0].message, 'liveDefenders');
						if (tickerLiveLeaders_ar['Matchups'].length > 0) addTickerContent(tickerLiveLeaders_ar['Matchups'][0].header, tickerLiveLeaders_ar['Matchups'][0].message, 'liveMatchups');
					}
					if (!liveLeadersFound) { //STANDARD MODE ONLY
						if (topPlayerStats_ar['Passers'].length > 0) addTickerContent(topPlayerStats_ar['Passers'][0].header, topPlayerStats_ar['Passers'][0].message);
						if (topPlayerStats_ar['Rushers'].length > 0) addTickerContent(topPlayerStats_ar['Rushers'][0].header, topPlayerStats_ar['Rushers'][0].message);
						if (topPlayerStats_ar['Receivers'].length > 0) addTickerContent(topPlayerStats_ar['Receivers'][0].header, topPlayerStats_ar['Receivers'][0].message);
						if (topPlayerStats_ar['Kickers'].length > 0) addTickerContent(topPlayerStats_ar['Kickers'][0].header, topPlayerStats_ar['Kickers'][0].message);
						if (topPlayerStats_ar['Defenders'].length > 0) addTickerContent(topPlayerStats_ar['Defenders'][0].header, topPlayerStats_ar['Defenders'][0].message);
						for (var key in topPlayerPts_ar.regular) {
							if (topPlayerPts_ar.regular.hasOwnProperty(key)) {
								if (topPlayerPts_ar.regular[key].length > 0) addTickerContent(topPlayerPts_ar.regular[key][0].header, topPlayerPts_ar.regular[key][0].message);
							}
						}
						for (var key in topPlayerPts_ar.playoff) {
							if (topPlayerPts_ar.playoff.hasOwnProperty(key)) {
								if (topPlayerPts_ar.playoff[key].length > 0) addTickerContent(topPlayerPts_ar.playoff[key][0].header, topPlayerPts_ar.playoff[key][0].message);
							}
						}
						if (tickerRankOrder_ar.power.length > 0) addTickerContent(tickerRankOrder_ar.power[0].header, tickerRankOrder_ar.power[0].message);
						if (tickerRankOrder_ar.alt_power.length > 0) addTickerContent(tickerRankOrder_ar.alt_power[0].header, tickerRankOrder_ar.alt_power[0].message);
						if (tickerRankOrder_ar.points_scored.length > 0) addTickerContent(tickerRankOrder_ar.points_scored[0].header, tickerRankOrder_ar.points_scored[0].message);
						if (tickerRankOrder_ar.all_play_record.length > 0) addTickerContent(tickerRankOrder_ar.all_play_record[0].header, tickerRankOrder_ar.all_play_record[0].message);
						if (tickerLastWeekResults_ar.length > 0) addTickerContent(tickerLastWeekResults_ar[0].header, tickerLastWeekResults_ar[0].message);
						if (tickerNextWeekMatchups_ar.length > 0) addTickerContent(tickerNextWeekMatchups_ar[0].header, tickerNextWeekMatchups_ar[0].message);
						if (tickerLastWeekNflResults_ar.length > 0) addTickerContent(tickerLastWeekNflResults_ar[0].header, tickerLastWeekNflResults_ar[0].message);
						if (tickerNextWeekNflMatchups_ar.length > 0) addTickerContent(tickerNextWeekNflMatchups_ar[0].header, tickerNextWeekNflMatchups_ar[0].message);
						if (tickerWaiverOrder_ar.length > 0) addTickerContent(tickerWaiverOrder_ar[0].header, tickerWaiverOrder_ar[0].message);
						if (tickerDraftResults_ar.length > 0) addTickerContent(tickerDraftResults_ar[0].header, tickerDraftResults_ar[0].message, 'draftResults');
						if (tickerDraftResults_ar.length > 0) draftResultsInterval = setInterval("getTickerDraftResults(true)", 45000);
					}
					if (!scrollingTriggered) updateTicker(false);
				} catch (error) {
					console.error(error);
				}
			}


			buildDisplayOptions();
			//PRE-LOAD CACHED MESSAGE ONLY IF IT EXISTS
			if (sessionStorage.hasOwnProperty("ticker_header_" + league_id) && sessionStorage.hasOwnProperty("ticker_message_" + league_id)) {
				if (document.getElementById('body_ajax_ls')) {
					setTimeout("updateTicker(true)", 1000); //LOAD CACHED SCROLL AFTER 1000 MILLISECONDS FOR LIVE SCORING PAGE
				} else {
					setTimeout("updateTicker(true)", 100); //LOAD CACHED SCROLL AFTER 100 MILLISECONDS FOR ALL OTHER PAGES
				}
			}

			window.MFLGlobalCache.onReady(() => {
				if(doTicker) triggerReportTicker();
			});

		}
	} //CLOSE IF doTicker
} //CLOSE MARQUEE IF WRAPPER
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END MARQUEE SCRIPT////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START LINEUP SCRIPT/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////
// MFL LINEUP https://www.mflscripts.com/mfl-apps/lineups/submit/script.js
/////////////////////////////////////////////////

if (typeof load_lineups_submit_scriptV3 !== "undefined" && load_lineups_submit_scriptV3 && thisProgram === "lineup" && typeof franchise_id !== "undefined") {
	const lu_hideFormTable = document.createElement("style");
	lu_hideFormTable.textContent = `#lineup form[action*="lineup"] { visibility: hidden; }`;
	document.head.appendChild(lu_hideFormTable);

	//console.log('LINEUP SCRIPT VERSION 2 LAST UPDATED 10-16-24');

	if (localStorage.getItem("luV3_useDefault_" + league_id + "_" + franchise_id) === null) localStorage.setItem("luV3_useDefault_" + league_id + "_" + franchise_id, "true");

	if (hideOptionalMsgV3 === undefined) var hideOptionalMsgV3 = false;
	if (lu_useDefaultAsPrimaryV3 === undefined) var lu_useDefaultAsPrimaryV3 = false;
	if (lu_validateLineUpV3 === undefined) var lu_validateLineUpV3 = true;
	let lu_useLineupIP = false;
	let RunupdateStarterCounts = true;
	let LeagueUsesTieBreakers = false;
	let tieBreakerNumber = 0;
	let multipleTieBreakers = false;
	let tieBreakHasPosition = false;
	let tieBreakPosition = "qb";
	let nonStarterTieBreak = false;
	let errorNonTiebreaker = false;
	let errorMessages = [];
	let errorMessagesTies = [];
	let errorMessagesNonStarter = [];
	let lu_allowPartial_lineup = false;
	let lu_allow_byePlayers = false;
	let lu_useCustomFormations = false;
	let lu_cus_formations = [];
	let lu_combo_maxStarters = false;
	let lu_combo_maxCount = 0;
	const lu_combo_positions = new Set(["qb", "rb", "wr", "te"]);

	const lu_lineup_constraint = {
		"total": {
			"min": 0,
			"max": 0
		}, // overall min and max players allowed in your league to be started - set min and max allowed
		"idptotal": {
			"min": 0,
			"max": 0,
			"useIDP": false
		}, // if your league uses IDP set "useIDP" to true - set min and max allowed
		"COACH": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a COACH position in lineup - set min and max allowed
		"QB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a QB position in lineup - set min and max allowed
		"TMQB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMQB position in lineup - set min and max allowed
		"RB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a RB position in lineup - set min and max allowed
		"TMRB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMRB position in lineup - set min and max allowed
		"FB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a FB position in lineup - set min and max allowed
		"WR": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a WR position in lineup - set min and max allowed
		"TMWR": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMWR position in lineup - set min and max allowed
		"TE": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TE position in lineup - set min and max allowed
		"TMTE": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMTE position in lineup - set min and max allowed
		"WR+TE": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a WR+TE position in lineup - set min and max allowed
		"RB+WR+TE": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a RB+WR+TE position in lineup - set min and max allowed
		"KR": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a KR position in lineup - set min and max allowed
		"PK": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a PK position in lineup - set min and max allowed
		"TMPK": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMPK position in lineup - set min and max allowed
		"PN": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a PN position in lineup - set min and max allowed
		"TMPN": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMPN position in lineup - set min and max allowed
		"OFF": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a OFF position in lineup - set min and max allowed
		"DEF": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a DEF position in lineup - set min and max allowed
		"ST": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a ST position in lineup - set min and max allowed
		"DT+DE": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a DT+DE position in lineup - set min and max allowed
		"DT": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a DT position in lineup - set min and max allowed
		"DE": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a DE position in lineup - set min and max allowed
		"TMDL": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMDL position in lineup - set min and max allowed
		"LB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a LB position in lineup - set min and max allowed
		"TMLB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a TMLB position in lineup - set min and max allowed
		"CB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a CB position in lineup - set min and max allowed
		"CB+S": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a CB+S position in lineup - set min and max allowed
		"S": {
			"min": 0,
			"max": 0,
			"usePosition": false
		}, // Set usePosition to true if your league uses a S position in lineup - set min and max allowed
		"TMDB": {
			"min": 0,
			"max": 0,
			"usePosition": false
		} // Set usePosition to true if your league uses a TMDB position in lineup - set min and max allowed
	}

	async function lu_fetchSettingsHTML() {
		try {
			const response = await fetch(`${baseURLDynamic}/${year}/options?L=${league_id}&O=26&PRINTER=1`, {
				method: 'GET',
				headers: {
					'Accept': 'text/html'
				}
			});
			if (!response.ok) {
				console.error(`HTTP error! Status: ${response.status}`);
				return false; // **Return false on failed fetch**
			}
			const htmlText = await response.text();
			if (!htmlText.trim()) {
				console.error("Error: Empty response received from settings URL");
				return false;
			}
			const doc = new DOMParser().parseFromString(htmlText, 'text/html');
			const tables = [...doc.querySelectorAll('table')];
			if (tables.length === 0) {
				console.error("Error: No tables found in settings HTML");
				return false;
			}
			// Process each table in parallel
			await Promise.all(tables.map(async (table) => {
				const thElements = [...table.querySelectorAll('th')];

				for (const th of thElements) {
					const thText = th.textContent.trim();

					if (thText.includes("Starting Lineup Setup")) {
						for (const row of table.querySelectorAll('tr')) {
							const cells = row.querySelectorAll('td');
							if (cells.length < 2) continue;
							let label = cells[0].textContent.trim();
							let value = cells[1].textContent.trim().replace(/[oO]/g, "0");
							if (label.startsWith("Number of Starting")) {
								let position = label.replace("Number of Starting ", "").replace(/s:$/, "").toUpperCase();
								let [min, max] = value.includes("-") ? value.split("-").map(num => parseInt(num, 10)) : [parseInt(value, 10), parseInt(value, 10)];
								lu_lineup_constraint[position].usePosition = true;
								lu_lineup_constraint[position].min = min;
								lu_lineup_constraint[position].max = max;
							}
							if (label === "Should owners be allowed to submit players on bye as starters?") {
								lu_allow_byePlayers = value.toUpperCase() === "YES";
							}

							if (label === "Are Partial Lineups Allowed?") {
								lu_allowPartial_lineup = value.toUpperCase() === "YES";
							}
							if (label.startsWith("Total Number of Starting Individual Defensive")) {
								const idpValue = Number(value); // Convert to a number
								lu_lineup_constraint["idptotal"].useIDP = true;
								lu_lineup_constraint["idptotal"].min = idpValue;
								lu_lineup_constraint["idptotal"].max = idpValue;
								lu_useLineupIP = true;
							}
							if (label.startsWith("Maximum Number of Starting")) {
								lu_combo_maxStarters = true;
								lu_combo_maxCount = value; // Get number of max starters QB - RB - WR - TE
							}
						}
					}
					if (thText.includes("Formations")) {
						lu_useCustomFormations = true;
						let formations = [];
						for (const row of table.querySelectorAll('tr')) {
							const cells = row.querySelectorAll('td');
							if (cells.length < 2) continue; // Skip rows without valid data
							let formationName = cells[0].textContent.trim(); // Formation name (e.g., "Pro Set")
							let formationValues = cells[1].innerHTML.trim(); // Position counts (e.g., "RB: 2 <br> WR: 2 <br> TE: 1")
							let positionCounts = {};
							formationValues.split("<br>").forEach(line => {
								let match = line.match(/(\w+): (\d+)/);
								if (match) {
									let position = match[1].trim().toUpperCase();
									let count = parseInt(match[2], 10);
									positionCounts[position] = count;
								}
							});
							if (Object.keys(positionCounts).length > 0) {
								formations.push(positionCounts);
							}
						}
						// Determine combined position group for `POSITIONS` key (first object in array)
						let allPositions = new Set();
						formations.forEach(formation => {
							Object.keys(formation).forEach(pos => allPositions.add(pos));
						});
						// Create the final `lu_cus_formations` array
						lu_cus_formations.push({
							POSITIONS: Array.from(allPositions).join("+")
						});
						lu_cus_formations = lu_cus_formations.concat(formations);
					}
				}
			}));
			if (leagueAttributes && leagueAttributes["MinStarters"] !== undefined && leagueAttributes["MaxStarters"] !== undefined) {
				lu_lineup_constraint["total"].min = leagueAttributes["MinStarters"];
				lu_lineup_constraint["total"].max = leagueAttributes["MaxStarters"];
			}
			return true; // Resolves the promise to indicate successful completion
		} catch (error) {
			console.error('Error fetching Settings HTML data:', error);
			return false; // Ensure false is returned on error
		}
	}

	// Fetch settings as soon as the script is loaded
	const lu_fetchSettings = lu_fetchSettingsHTML();

	// Wait for document ready, then execute another function
	document.addEventListener("DOMContentLoaded", async function () {
		const settingsLoaded = await lu_fetchSettings; // Ensure settings are loaded first

		if (settingsLoaded) {
			if ((lu_useDefaultAsPrimaryV3 && localStorage.getItem("luV3_useDefault_" + league_id + "_" + franchise_id) === "false") || (!lu_useDefaultAsPrimaryV3 && localStorage.getItem("luV3_useDefault_" + league_id + "_" + franchise_id) === "true")) {
				lu_load_script();
			} else {
				const lineupForm = document.querySelector('#lineup form[action*="lineup"]');
				if (lineupForm) {
					lineupForm.insertAdjacentHTML('beforeend', '<p class="form_buttons default-btn"><input type="button" value="Use Custom Submission Form" onclick="redirectSubmissionPage_v3(false)"></p>');
				}
				if (lu_hideFormTable.parentNode) {
					lu_hideFormTable.parentNode.removeChild(lu_hideFormTable);
				}
			}
		} else {
			redirectSubmissionPage_v3(true)
			console.error("Failed to load settings, skipping anotherFunction.");
			if (lu_hideFormTable.parentNode) {
				lu_hideFormTable.parentNode.removeChild(lu_hideFormTable);
			}
		}
	});

	// Helper to rebuild a clean anchor
	function rebuildPositionLink(oldA) {

		const href = oldA.getAttribute('href') || "";

		let pid = oldA.dataset?.playerId || "";

		const last = oldA.querySelector('.playerLastName')?.textContent || "";
		const firstHTML = oldA.querySelector('.playerFirstName')?.innerHTML || ""; // may contain spans + *
		const team = oldA.querySelector('.playerTeam')?.textContent || "";
		let pos = oldA.querySelector('.playerPosition')?.textContent || "";

		if (!pid || !firstHTML || !last || !team || !pos) return null;

		// Detect star in the plain text
		const firstPlain = firstHTML.replace(/<[^>]+>/g, ''); // strip tags to check text
		const hasStar = firstPlain.includes('*');

		// Clean the HTML that we'll actually render (remove literal * and common <span>*</span>)
		const firstHTMLClean = hasStar ?
			firstHTML
			.replace(/\*/g, '') // remove literal asterisk chars
			.replace(/<span[^>]*>\s*\*\s*<\/span>/gi, '') // remove spans that only contain *
			.trim() :
			firstHTML.trim();

		const posWithStar = hasStar ? `${pos} *` : pos;

		// Build anchor
		const a = document.createElement('a');
		a.href = href;
		a.title = `${firstPlain.replace('*','').trim()} ${last} (${team}) ${pos}`;
		a.className = `position_${pos.toLowerCase()} player-lineup-link`;

		// Use the CLEANED HTML here so the leading star doesn't show twice
		a.innerHTML = `${last}, ${firstHTMLClean} ${team} ${posWithStar}`;

		const td = oldA.closest('td');
		if (td && td.dataset.type === 'hasinput') {
			td.removeAttribute('data-type');
		}

		return a;
	}

	function lu_load_script() {

		const LineupreportTableSelect = document.querySelector('#lineup form[action="lineup"][name="SELECT_FRANCHISE"]');
		if (LineupreportTableSelect) {
			//console.log("Element found, stopping script execution.");
			if (lu_hideFormTable.parentNode) {
				lu_hideFormTable.parentNode.removeChild(lu_hideFormTable);
			}
			return; // Stop further execution
		}

		const normalizedLineupConstraints = Object.keys(lu_lineup_constraint).reduce((acc, key) => {
			if (lu_lineup_constraint[key].usePosition === true) {
				acc[key.toLowerCase()] = lu_lineup_constraint[key];
			}
			return acc;
		}, {});

		let styleElementThree = document.createElement('style');
		styleElementThree.id = 'starterCSS'; // Assign the ID
		styleElementThree.innerHTML = `.starter_count_sub,h3,.reportform,form[action*="lineup"],.mobile-wrap,.weekly-navbar-mobile,.weekly-navbar,.reportnavigation {visibility: hidden}`;
		document.head.appendChild(styleElementThree);

		setTimeout(function () {
			const element = document.getElementById('starterCSS');
			if (element) {
				//console.log("Element with ID 'starterCSS' exists!");
				redirectSubmissionPage_v3(true)
			} else {
				//console.log("Element with ID 'starterCSS' does not exist.");
			}
		}, 5000);

		function getPositionCodeFromAnchor(a) {
			if (!a) return null;
			const posClass = Array.from(a.classList).find(c => /^position_/i.test(c));
			return posClass ? posClass.replace(/^position_/i, '').toLowerCase() : null;
		}

		const LineupreportTable = document.querySelector('#lineup form[action*="lineup"] table.report');

		// Check if LineupreportTable exists before querying its rows
		if (LineupreportTable) {

			document.getElementById('body_lineup').classList.add('custom_lineup_body');

			document.querySelectorAll('#body_lineup .franchiselogo, #body_lineup form[action*="lineup"] table caption span a').forEach(function (element) {
				element.remove();
			});

			document.querySelectorAll('#lineup .reportnavigation').forEach((element) => {
				if (element.querySelector('b')) {
					element.remove();
				}
			});

			const LineuptableRows = Array.from(LineupreportTable.querySelectorAll('tr'));
			const Lineuptbodies = {};
			const LineupclassNames = [];
			const rowGroupsByPosition = {};
			const checkedPlayerCount = {};
			let LineupCurrentPosition = null;
			let totalCheckedPlayers = 0;
			let defensivePositions, defensiveCheckedPlayers;

			for (let position in normalizedLineupConstraints) {
				checkedPlayerCount[position] = 0;
			}

			if (lu_useLineupIP) {
				defensivePositions = ['dt+de', 'dt', 'de', 'lb', 'cb+s', 'cb', 's'];
				defensiveCheckedPlayers = 0;
			}

			// ADD PLAYER IMAGES
			var pos_team_img = {
				Coach: !0,
				Off: !0,
				Def: !0,
				ST: !0,
				TMQB: !0,
				TMRB: !0,
				TMWR: !0,
				TMTE: !0,
				TMPK: !0,
				TMPN: !0,
				TMDL: !0,
				TMLB: !0,
				TMDB: !0
			};

			// Loop over each table row
			LineuptableRows.forEach((row, rowIndex) => {

				const checkbox = row.querySelector('input[type="checkbox"]');
				let positionLink = row.querySelector('a[class*="position_"]');

				if (positionLink) {
					// Find the <td> containing the positionLink and add the "player" class
					const parentTd = positionLink.closest('td');
					if (parentTd) {
						parentTd.classList.add('player');
					}
					const hasImgTable = !!positionLink.querySelector('.playerImgTable');
					if (hasImgTable) {
						const existingPhotoSrc = positionLink.querySelector('img.playerPhoto')?.getAttribute('src') || "";
						if (existingPhotoSrc) row.dataset.playerPhoto = existingPhotoSrc;
						const cleanA = rebuildPositionLink(positionLink);
						if (cleanA) positionLink.replaceWith(cleanA);
						// If cleanA is null, we leave the original link untouched.
					}
					positionLink = row.querySelector('td.player a[class*="position_"]');
				}

				row.classList.remove('oddtablerow', 'eventablerow', 'newposition');

				// Handle header cells (th) in the first row
				if (rowIndex === 0) {
					const headerCells = row.querySelectorAll('th');
					headerCells.forEach((th, thIndex) => {
						let className = th.textContent.toLowerCase().replace(/ /g, "-");
						if (className === "rush" || className === "pass") {
							className += "-rank";
						} else if (className === "opp-avgvs-pos") {
							className = "pass-rank";
						} else if (className === "opp-rankvs-pos") {
							className = "rush-rank";
						} else if (className.indexOf("select-a") !== -1) {
							className = "select-total-starters";
						} else if (className.indexOf("week-") !== -1) {
							className = "weekly-opp";
						}
						th.classList.add(className);
						LineupclassNames.push(className);
					});
				}

				// Check if this row contains a td with the class 'player'
				if (row.querySelector("td.player")) {
					const cells = row.querySelectorAll(':scope > td');

					// Hide the checkbox input
					if (!checkbox) return; // sanity guard
					checkbox.style.display = 'none';

					// Extract the position code from the <a> element's class (e.g., "position_rb" -> "rb")
					const playerPositionCode = getPositionCodeFromAnchor(positionLink);
					if (!playerPositionCode) return;

					// Map the position from lu_lineup_constraint by checking multiple position groups
					let mappedPosition = null;
					for (let position in normalizedLineupConstraints) {
						const positionParts = position.split('+').map(part => part.toLowerCase());

						// Check if any part of the split position matches the player's position code
						if (positionParts.includes(playerPositionCode.toLowerCase())) {
							mappedPosition = position;
							break;
						}
					}

					// Group rows by mappedPosition and checkbox status
					if (mappedPosition) {
						if (!rowGroupsByPosition[mappedPosition]) {
							rowGroupsByPosition[mappedPosition] = {
								lockedStarters: [],
								currentStarters: [],
								currentBench: [],
								lockedBench: []
							};
						}

						// Add row to the corresponding group within the position
						if (checkbox.checked && checkbox.disabled) {
							row.classList.add('locked_starter', 'player_row', 'previous_starter');
							row.setAttribute("title", "Game Has Started - Player Locked");
							rowGroupsByPosition[mappedPosition].lockedStarters.push(row);
						} else if (checkbox.checked) {
							row.classList.add('current_starters_row', 'previous_starter', 'player_row');
							row.setAttribute("title", "Move To Bench");
							rowGroupsByPosition[mappedPosition].currentStarters.push(row);
						} else if (!checkbox.disabled && !checkbox.checked) {
							row.classList.add('current_bench_row', 'player_row');
							row.setAttribute("title", "Move To Starting Lineup");
							rowGroupsByPosition[mappedPosition].currentBench.push(row);
						} else if (checkbox.disabled && !checkbox.checked) {
							row.classList.add('locked_bench', 'player_row');
							row.setAttribute("title", "Game Has Started - Player Locked");
							rowGroupsByPosition[mappedPosition].lockedBench.push(row);
						}

						// Initial load: check if player is checked and update count
						if (checkbox.checked) {
							updateCheckedCount_v3(mappedPosition, true);
							totalCheckedPlayers++;

							// Check if this mappedPosition is one of the defensive positions
							if (lu_useLineupIP && defensivePositions.includes(mappedPosition)) {
								defensiveCheckedPlayers++;
							}
						}

						// Add click event listener to the row
						row.addEventListener('click', (event) => {
							// Ignore clicks if they originated from .weekly-opp or .player cells
							if ((event.target.closest('.weekly-opp') && event.target.tagName === 'A') || event.target.closest('.player')) {
								return;
							}
							if (!checkbox.disabled) {
								// Toggle the checkbox state
								checkbox.checked = !checkbox.checked;

								// Change the row title and class based on the current state
								// Determine the current group and target group based on the row class
								if (row.classList.contains('current_starters_row')) {
									moveRowBetweenGroups_v3(row, 'currentStarters', 'currentBench', mappedPosition);
									row.setAttribute('title', 'Move To Starting Lineup');
									row.classList.remove('current_starters_row');
									row.classList.add('current_bench_row');
								} else if (row.classList.contains('current_bench_row')) {
									moveRowBetweenGroups_v3(row, 'currentBench', 'currentStarters', mappedPosition);
									row.setAttribute('title', 'Move To Bench');
									row.classList.remove('current_bench_row');
									row.classList.add('current_starters_row');
								}

								// Trigger the checkbox change logic
								updateCheckedCount_v3(mappedPosition, checkbox.checked);
								totalCheckedPlayers += checkbox.checked ? 1 : -1;

								// Update defensiveCheckedPlayers count only once for relevant positions
								if (lu_useLineupIP && defensivePositions.includes(mappedPosition)) {
									defensiveCheckedPlayers += checkbox.checked ? 1 : -1;
								}

								// Re-sort the rows for this position
								resortRows_v3(mappedPosition);

								if (RunupdateStarterCounts) {
									if (nonStarterTieBreak) {
										checkForMatches_v3();
									}
									updateStarterCounts_v3();
								}
							}
						});
					}

					cells.forEach((td, tdIndex) => {
						// Skip the first header (index + 1 matches the header classes to the cells)
						if (LineupclassNames[tdIndex + 1]) {
							td.classList.add(LineupclassNames[tdIndex + 1]);
						}

						if ((td.classList.contains('inj') && (td.innerHTML.trim() === '' || td.innerHTML.trim() === '&nbsp;')) || td.classList.contains('nfl-news') || td.classList.contains('pass-rank')) {
							td.remove();
						}

						// Check for empty .pos-rank cells and replace with 'N/A'
						if (td.classList.contains('pos-rank') && !td.textContent.trim()) {
							td.textContent = 'N/A';
						}

						// Replace empty td content with a dash ('-')
						if (!td.textContent.trim()) {
							td.textContent = '-';
						}

						// Update weather links
						if (td.classList.contains('weekly-opp') && td.textContent.includes('Weather')) {
							let home_id;

							if (!td.textContent.includes("@")) {
								// Get the 'home_id' from the player name in the 'td.player a' element
								const playerLink = td.closest('tr').querySelector('td.player a');
								if (playerLink) {
									const playerNameParts = playerLink.textContent.split(' ');
									home_id = playerNameParts[playerNameParts.length - 2];
								}
							} else {
								// Get 'home_id' from the 'weekly-opp' text
								home_id = td.textContent.substr(1, 3);
							}

							// Find the anchor and set the attributes
							const link = td.querySelector("a");
							if (link) {
								const href = link.getAttribute("href");
								link.setAttribute('onclick', `lu_v3_weatherPopup("${home_id}","${href}")`);
								link.setAttribute('title', 'View Weather');
								link.removeAttribute("target");
								link.removeAttribute("href");
							}
						}
						if (td.classList.contains('player')) {

							// Check if an anchor link exists within the td
							const link = td.querySelector('a');
							if (!link) return; // Exit if no link is found

							const url = link.getAttribute('href') || '';
							let playerID_lu = '';
							if (url.includes('launch_player_modal')) {
								const qs = url.split(',');
								playerID_lu = (qs[1] || '').replace(/'/g, '').replace(');', '').trim();
							} else {
								const q = url.split('?')[1] || '';
								playerID_lu = new URLSearchParams(q).get('P') || '';
							}

							// Parse player name, position, and team
							const name = link.textContent.trim();
							const nameArray = name.split(" ");
							const position = nameArray[nameArray.length - 1] || '';
							const nflTeam = nameArray[nameArray.length - 2] || '';

							const capturedPhoto = row.dataset.playerPhoto || "";
							const profile_image = capturedPhoto ?
								capturedPhoto :
								(pos_team_img.hasOwnProperty(position) ?
									`https://www.mflscripts.com/playerImages_96x96/mfl_${nflTeam}.svg` :
									`https://www.mflscripts.com/playerImages_96x96/mfl_${playerID_lu}.png`);

							// Create a new td element for the image
							const imgTD = document.createElement('td');
							imgTD.classList.add('pphoto');

							// Create and configure the image element
							const img = document.createElement('img');
							img.classList.add('headshot');
							img.src = profile_image;

							// Add error handling for the image loading
							img.onerror = function () {
								img.src = 'https://www.mflscripts.com/playerImages_96x96/free_agent.png';
							};

							// Append the image to the imgTD
							imgTD.appendChild(img);
							const rowEl = td.parentNode;
							rowEl.insertBefore(imgTD, td);
							rowEl.setAttribute('data-value', playerID_lu);
						}

						// New additions
						// Unwrap contents of .ytd-pts a and .rush-rank a links
						if ((td.classList.contains('ytd-pts') || td.classList.contains('rush-rank')) && td.querySelector('a')) {
							const linkElement = td.querySelector('a');
							td.textContent = linkElement.textContent;
						}

						// Remove empty anchor tags in .player_row cells
						if (row.classList.contains('player_row') && td.querySelector('a') && !td.querySelector('a').textContent.trim()) {
							td.querySelector('a').remove();
							//console.log("Remove empty anchor tags in .player_row cells")
						}

						// Set empty .player_row cells to '0'
						if (row.classList.contains('player_row') && !td.textContent.trim()) {
							td.textContent = '0';
							//console.log("Set empty .player_row cells to '0'")
						}

						// Add class 'no_content' to .weekly-opp cells containing 'N/A'
						if (td.classList.contains('weekly-opp') && td.querySelector('b.warning') && td.querySelector('b.warning').textContent.includes('N/A')) {
							td.querySelector('b.warning').classList.add('no_content');
						}

						// Add class 'no_ranking' to .rush-rank cells containing '-'
						if (td.classList.contains('rush-rank') && td.textContent.includes('-')) {
							td.classList.add('no_ranking');
						}
					});

					// Ensure required columns are present; add them if missing
					if (!row.querySelector("td.ytd-pts")) {
						const ytdPtsCell = document.createElement("td");
						ytdPtsCell.classList.add("ytd-pts");
						ytdPtsCell.textContent = "0";
						row.appendChild(ytdPtsCell);
					}
					if (!row.querySelector("td.rush-rank")) {
						const rushRankCell = document.createElement("td");
						rushRankCell.classList.add("rush-rank");
						rushRankCell.textContent = "0";
						row.appendChild(rushRankCell);
					}
					if (!row.querySelector("td.avg-pts")) {
						const avgPtsCell = document.createElement("td");
						avgPtsCell.classList.add("avg-pts");
						avgPtsCell.textContent = "0";
						row.appendChild(avgPtsCell);
					}
					if (!row.querySelector("td.proj-pts")) {
						const projPtsCell = document.createElement("td");
						projPtsCell.classList.add("proj-pts");
						projPtsCell.textContent = "0";
						row.appendChild(projPtsCell);
					}

					// Check if 'points_row' already exists before adding it
					if (!row.querySelector(".points_row")) {
						const proj_html = row.querySelector("td.proj-pts")?.innerHTML || "0";
						const ytd_html = row.querySelector("td.ytd-pts")?.innerHTML || "0";
						const avg_html = row.querySelector("td.avg-pts")?.innerHTML || "0";

						// Append point rows with values
						const pointsRow = document.createElement("span");
						pointsRow.classList.add("points_row");

						const avgPtsSpan = document.createElement("span");
						avgPtsSpan.classList.add("avg-pts");
						avgPtsSpan.innerHTML = `Avg:<span>${avg_html}</span>`;

						const ytdPtsSpan = document.createElement("span");
						ytdPtsSpan.classList.add("ytd-pts");
						ytdPtsSpan.innerHTML = `YTD:<span>${ytd_html}</span>`;

						const projPtsSpan = document.createElement("span");
						projPtsSpan.classList.add("proj-pts");
						projPtsSpan.innerHTML = `Proj:<span>${proj_html}</span>`;

						pointsRow.appendChild(avgPtsSpan);
						pointsRow.appendChild(ytdPtsSpan);
						pointsRow.appendChild(projPtsSpan);
						row.appendChild(pointsRow); // Append the span without affecting other content
					}
				}

				// Handle all th elements across the table
				const thElements = row.querySelectorAll('th');
				thElements.forEach((th, thIndex) => {
					const text = th.textContent.trim();

					// If <th> does not contain either the word "Select" or "Optional", remove it
					if (!text.includes("Select") && !text.includes("Optional") && !text.includes("Tiebreaker") && !text.includes("Backup")) {
						th.remove(); // Remove the <th> element if the text doesn't contain "Select" or "Optional"
						return; // Continue to the next iteration
					}

					if (text.includes("Select") && text.includes("Non-Starter") && text.includes("Tie-Breaker") && text.includes("Player")) {
						LeagueUsesTieBreakers = true;
						nonStarterTieBreak = true;
						const numberMatch = text.match(/Select (\d+)/);
						const numberToSelect = numberMatch ? parseInt(numberMatch[1], 10) : null;
						tieBreakerNumber = numberToSelect;
						if (tieBreakerNumber > 1) multipleTieBreakers = true;
						//console.log(`select ${numberToSelect} non-starter tie breaker`);
					} else if (text.includes("Select") && text.includes("Non-Starter") && text.includes("Tie-Breaker")) {
						tieBreakHasPosition = true;
						LeagueUsesTieBreakers = true;
						nonStarterTieBreak = true;
						const numberMatch = text.match(/Select (\d+)/);
						const numberToSelect = numberMatch ? parseInt(numberMatch[1], 10) : null;
						const match = text.match(/Tie-Breaker (\w+)/);
						let position = match ? match[1].toLowerCase() : null;
						tieBreakerNumber = numberToSelect;
						if (tieBreakerNumber > 1) multipleTieBreakers = true;
						// Remove trailing "s" if multipleTieBreakers is true
						if (multipleTieBreakers && position && position.endsWith("s")) {
							position = position.slice(0, -1);
						}
						tieBreakPosition = position;
						//console.log(`select ${numberToSelect} non-starter tie breaker by specific position: ${position}`);
					} else if (text.includes("Select") && text.includes("Tie-Breaker") && text.includes("Player")) {
						LeagueUsesTieBreakers = true;
						const numberMatch = text.match(/Select (\d+)/);
						const numberToSelect = numberMatch ? parseInt(numberMatch[1], 10) : null;
						tieBreakerNumber = numberToSelect;
						if (tieBreakerNumber > 1) multipleTieBreakers = true;
						//console.log(`select ${numberToSelect} roster tie breaker`);
					} else if (text.includes("Select") && text.includes("Tie-Breaker")) {
						tieBreakHasPosition = true;
						LeagueUsesTieBreakers = true;
						const numberMatch = text.match(/Select (\d+)/);
						const numberToSelect = numberMatch ? parseInt(numberMatch[1], 10) : null;
						const match = text.match(/Tie-Breaker (\w+)/);
						let position = match ? match[1].toLowerCase() : null;
						tieBreakerNumber = numberToSelect;
						if (tieBreakerNumber > 1) multipleTieBreakers = true;
						// Remove trailing "s" if multipleTieBreakers is true
						if (multipleTieBreakers && position && position.endsWith("s")) {
							position = position.slice(0, -1);
						}
						tieBreakPosition = position;
						//console.log(`select ${numberToSelect} roster tie breaker by specific position: ${position}`);
					}

					// Look for total starter constraint (e.g., "Select A Total Of 9 Starters")
					if (text.includes("Select A Total Of")) {

						// Get the parent row (tr) that contains the <th>
						const parentRow = th.parentElement;

						// Create new <tbody> to wrap the starters table
						const newTBody = document.createElement('tbody');
						newTBody.setAttribute('data-type', "startersCount");

						// Create new starters table
						const startersTable = document.createElement('table');
						startersTable.classList.add('starters-table');
						startersTable.setAttribute('style', 'width: 100%;border-spacing: 0;');

						const thead = document.createElement('thead');
						const startersRow = document.createElement('tr');
						startersRow.classList.add('starters_count_row');

						// Move the existing <th> (first one) to the new starters row
						th.classList.add('select-total-starters', 'starters_count_th');
						th.setAttribute('colspan', '100');

						// Append only the first <th> to the new row
						startersRow.appendChild(th);
						thead.appendChild(startersRow);
						startersTable.appendChild(thead);

						// Append the starters table to the new <tbody>
						newTBody.appendChild(startersTable);

						// Append the new <tbody> to the LineupreportTable
						LineupreportTable.appendChild(newTBody);

						// Remove the old row entirely (since we already moved the first <th>)
						parentRow.remove();
					}

					if (text.includes("Tiebreaker") && LeagueUsesTieBreakers) {

						// Get the parent row of the <th> element (the row you're working on)
						const parentRow = th.parentElement;

						// Create new <tbody> to wrap the starters table
						const newTBody = document.createElement('tbody');
						newTBody.setAttribute('data-type', "PrevTiebreaker");

						// Create new starters table
						const startersTable = document.createElement('table');
						startersTable.classList.add('PrevTiebreaker-table');
						startersTable.setAttribute('style', 'width: 100%;border-spacing: 0;');

						// Create thead
						const thead = document.createElement('thead');
						const startersRow = document.createElement('tr');
						startersRow.classList.add('PrevTiebreaker_row');

						// Move the existing <th> (first one) to the new starters row
						th.classList.add('PrevTiebreaker_th');
						th.setAttribute('colspan', '100');

						// Append only the first <th> to the new row
						startersRow.appendChild(th);
						thead.appendChild(startersRow);
						startersTable.appendChild(thead);

						// Create an additional inner <tbody> for the current row (parentRow)
						const innerTBody = document.createElement('tbody');
						innerTBody.setAttribute('data-type', 'PrevTiebreaker');
						innerTBody.classList.add('PrevTiebreaker-tbody'); // Optional: Add a class for styling/identification

						// Create a new <tr> for the <td> elements
						const newRow = document.createElement('tr');
						newRow.classList.add('oddtablerow', 'PrevTiebreaker_row');

						// Move each <td> from the parentRow to the new <tr>
						const tdCells = parentRow.querySelectorAll('td');
						tdCells.forEach(td => {
							newRow.appendChild(td); // Move each <td> to the new row
						});

						// Append the new <tr> with <td> to the inner <tbody>
						innerTBody.appendChild(newRow);

						// Append the inner <tbody> to the starters table
						startersTable.appendChild(innerTBody);

						// Append the starters table to the outer <tbody>
						newTBody.appendChild(startersTable);

						// Append the new <tbody> to the LineupreportTable
						LineupreportTable.appendChild(newTBody);
					}

					if (text.includes("Tie-Breaker") && LeagueUsesTieBreakers) {

						// Get the parent row of the <th> element (the row you're working on)
						const parentRow = th.parentElement;

						// Create new <tbody> to wrap the starters table
						const newTBody = document.createElement('tbody');
						newTBody.setAttribute('data-type', "tiesBody");

						// Create new starters table
						const startersTable = document.createElement('table');
						startersTable.classList.add('tieBreak-table');
						startersTable.setAttribute('style', 'width: 100%;border-spacing: 0;');

						// Create thead
						const thead = document.createElement('thead');
						const startersRow = document.createElement('tr');
						startersRow.classList.add('tieBrea_row');

						// Move the existing <th> (first one) to the new starters row
						th.classList.add('tiebreaker_th');
						th.setAttribute('colspan', '100');

						// Append only the first <th> to the new row
						startersRow.appendChild(th);
						thead.appendChild(startersRow);
						startersTable.appendChild(thead);

						// Create an additional inner <tbody> for the current row (parentRow)
						const innerTBody = document.createElement('tbody');
						innerTBody.setAttribute('data-type', 'tiebreakers');
						innerTBody.classList.add('tiebreakers-tbody'); // Optional: Add a class for styling/identification

						// Create a new <tr> for the <td> elements
						const newRow = document.createElement('tr');
						newRow.classList.add('oddtablerow', 'tie_breakers_row');

						// Move each <td> from the parentRow to the new <tr>
						const tdCells = parentRow.querySelectorAll('td');
						tdCells.forEach(td => {
							newRow.appendChild(td); // Move each <td> to the new row
						});

						// Check for <select> elements within the newRow and apply the option selection logic
						const selectElements = newRow.querySelectorAll('select');
						selectElements.forEach(select => {
							const optionsArray = Array.from(select.options);
							optionsArray.forEach(option => {
								if (option.value && option.selected) {
									option.classList.add('selected-option');
								}
							});
						});

						// Append the new <tr> with <td> to the inner <tbody>
						innerTBody.appendChild(newRow);

						// Append the inner <tbody> to the starters table
						startersTable.appendChild(innerTBody);

						// Append the starters table to the outer <tbody>
						newTBody.appendChild(startersTable);

						// Append the new <tbody> to the LineupreportTable
						LineupreportTable.appendChild(newTBody);
					}

					if (text.includes("Select") && text.includes("Backup") && text.includes("Player")) {

						// Get the parent row of the <th> element (the row you're working on)
						const parentRow = th.parentElement;

						// Create new <tbody> to wrap the starters table
						const newTBody = document.createElement('tbody');
						newTBody.setAttribute('data-type', "PrevTiebreaker");

						// Create new starters table
						const startersTable = document.createElement('table');
						startersTable.classList.add('PrevTiebreaker-table');
						startersTable.setAttribute('style', 'width: 100%;border-spacing: 0;');

						// Create thead
						const thead = document.createElement('thead');
						const startersRow = document.createElement('tr');
						startersRow.classList.add('PrevTiebreaker_row');

						// Move the existing <th> (first one) to the new starters row
						th.classList.add('PrevTiebreaker_th');
						th.setAttribute('colspan', '100');

						// Append only the first <th> to the new row
						startersRow.appendChild(th);
						thead.appendChild(startersRow);
						startersTable.appendChild(thead);

						// Create an additional inner <tbody> for the current row (parentRow)
						const innerTBody = document.createElement('tbody');
						innerTBody.setAttribute('data-type', 'PrevTiebreaker');
						innerTBody.classList.add('PrevTiebreaker-tbody'); // Optional: Add a class for styling/identification

						// Create a new <tr> for the <td> elements
						const newRow = document.createElement('tr');
						newRow.classList.add('oddtablerow', 'PrevTiebreaker_row');

						// Move each <td> from the parentRow to the new <tr>
						const tdCells = parentRow.querySelectorAll('td');
						tdCells.forEach(td => {
							newRow.appendChild(td); // Move each <td> to the new row
						});

						// Append the new <tr> with <td> to the inner <tbody>
						innerTBody.appendChild(newRow);

						// Append the inner <tbody> to the starters table
						startersTable.appendChild(innerTBody);

						// Append the starters table to the outer <tbody>
						newTBody.appendChild(startersTable);

						// Append the new <tbody> to the LineupreportTable
						LineupreportTable.appendChild(newTBody);
					}

					// Look for position-specific lu_lineup_constraint (e.g., "Select 2-4 RB:")
					const positionMatch = text.match(/Select (\d+)-?(\d*) ([\w\+]+):/);
					if (positionMatch) {
						let position = positionMatch[3].toLowerCase();

						// Create a new <tbody> for this position group and store it in the Lineuptbodies object
						const newTBody = document.createElement('tbody');
						newTBody.setAttribute('data-type', position);

						// Create a new <table> inside this <tbody>
						const newTable = document.createElement('table');
						newTable.classList.add('position-table'); // Add a class for optional styling
						newTable.setAttribute('style', 'width: 100%;border-spacing: 0;'); // Set the table width to 100%

						// Create a <thead> using the <th> for this position
						const thead = document.createElement('thead');
						const headerRow = document.createElement('tr');
						headerRow.classList.add('starters_pos_row', 'player_head_row', 'player_' + position);
						th.setAttribute('colspan', '100%');
						th.classList.add('starters_pos_th');

						headerRow.appendChild(th); // Move the <th> to the <thead> row
						thead.appendChild(headerRow);
						newTable.appendChild(thead);

						// Create a <tbody> for the player rows inside the inner table
						const innerTBody = document.createElement('tbody');
						innerTBody.setAttribute('data-type', 'positions');
						newTable.appendChild(innerTBody);

						// Append the new table to the outer <tbody>
						newTBody.appendChild(newTable);

						// Store the inner <tbody> for later use
						Lineuptbodies[position] = innerTBody;

						// Append the outer <tbody> to the main report table
						LineupreportTable.appendChild(newTBody);

						// Update the current position
						LineupCurrentPosition = position;
					}

					if (!hideOptionalMsgV3) {
						if (text.includes("Optional")) {

							// Get the parent row of the <th> element (the row you're working on)
							const parentRow = th.parentElement;

							// Create new <tbody> to wrap the starters table
							const newTBody = document.createElement('tbody');
							newTBody.setAttribute('data-type', "optionalMsg");

							// Create new starters table
							const startersTable = document.createElement('table');
							startersTable.classList.add('optionMsg-table');
							startersTable.setAttribute('style', 'width: 100%;border-spacing: 0;');

							// Create thead
							const thead = document.createElement('thead');
							const startersRow = document.createElement('tr');
							startersRow.classList.add('message_row');

							// Move the existing <th> (first one) to the new starters row
							th.classList.add('message_th');
							th.setAttribute('colspan', '100');

							// Append only the first <th> to the new row
							startersRow.appendChild(th);
							thead.appendChild(startersRow);
							startersTable.appendChild(thead);

							// Create an additional inner <tbody> for the current row (parentRow)
							const innerTBody = document.createElement('tbody');
							innerTBody.setAttribute('data-type', 'messages');
							innerTBody.classList.add('MSGinner-tbody'); // Optional: Add a class for styling/identification

							// Create a new <tr> for the <td> elements
							const newRow = document.createElement('tr');
							newRow.classList.add('oddtablerow');

							// Move each <td> from the parentRow to the new <tr>
							const tdCells = parentRow.querySelectorAll('td');
							tdCells.forEach(td => {
								newRow.appendChild(td); // Move each <td> to the new row
							});

							// Append the new <tr> with <td> to the inner <tbody>
							innerTBody.appendChild(newRow);

							// Append the inner <tbody> to the starters table
							startersTable.appendChild(innerTBody);

							// Append the starters table to the outer <tbody>
							newTBody.appendChild(startersTable);

							// Append the new <tbody> to the LineupreportTable
							LineupreportTable.appendChild(newTBody);
						}
					} else {
						if (text.includes("Optional")) {
							const parentRow = th.parentElement;
							parentRow.remove();
						}
					}
					// Select all tbody elements without a data-type attribute
					const tbodyElements = LineupreportTable.querySelectorAll('tbody:not([data-type])');
					// Loop through the selected elements and remove each one
					tbodyElements.forEach(tbody => tbody.remove());
				});
			});

			// Append the rows back into the correct <tbody> for each position in the specified order
			for (const position in rowGroupsByPosition) {
				if (Lineuptbodies[position]) {
					const {
						lockedStarters,
						currentStarters,
						currentBench,
						lockedBench
					} = rowGroupsByPosition[position];

					// Initialize a counter to track row index for odd/even alternation
					let rowIndex = 0;

					// Append each group in the specified order and alternate row classes
					[...lockedStarters, ...currentStarters, ...currentBench, ...lockedBench].forEach(row => {
						// Add alternating classes based on the row index
						row.classList.add(rowIndex % 2 === 0 ? 'oddtablerow' : 'eventablerow');

						// Append row to the correct tbody
						Lineuptbodies[position].appendChild(row);

						// Increment the row index for the next row
						rowIndex++;
					});
				}
			}

			const lu_playerRows = document.querySelectorAll('.player_row');
			const lu_playerSelects = document.querySelectorAll('.tie_breakers_row select');
			const lu_submit_buttons = document.querySelectorAll("input[value='Submit Lineup'], input[value='Submit Partial Lineup']");
			const lu_select_element = document.querySelector('.tie_breakers_row select');
			const lu_select_elementInput = document.querySelectorAll('.tie_breakers_row input[type="hidden"]');
			const lu_select_elementTH = document.querySelector('.tiebreaker_th');
			let lu_opt_select_count = 0;
			let invalidPositionsSpan = "";

			if (LeagueUsesTieBreakers && lu_playerSelects) { // regardless if nonStarterTieBreak or not - disable all options if game is over for starter and bench players - remove any that are not selected
				lu_playerRows.forEach(playerRow => {
					const dataValue = playerRow.getAttribute('data-value');

					//console.log(dataValue + " datavalue")

					// regardless if nonStarterTieBreak or not - disable all options if game is over for starter and bench players - remove any that are not selected
					if (playerRow.classList.contains('locked_bench') || playerRow.classList.contains('locked_starter') || playerRow.classList.contains('locked_bench_game_over') || playerRow.classList.contains('locked_starter_game_over')) {
						//console.log("player rows class ran")
						lu_playerSelects.forEach(select => {
							const optionsArray = Array.from(select.options);
							optionsArray.forEach(option => {
								if (option.value === dataValue) {
									if (option.selected) {
										// If the option is selected, disable it
										//option.disabled = true;
										//option.remove();
									} else {
										// If the option is not selected, remove it from the select
										option.remove();
									}
								}
							});
						});
					}
				});
			}

			// Initial calculation on page load
			if ((lu_select_element || lu_select_elementInput.length > 0) && LeagueUsesTieBreakers) {
				//console.log("Running initial count calculation");
				calculateSelectedCount_v3();

				// Add event listener to track changes in the select element if it exists
				if (lu_select_element) {
					lu_select_element.addEventListener('change', () => {
						//console.log("option is selected")
						if (nonStarterTieBreak) {
							checkForMatches_v3();
						} else {
							calculateSelectedCount_v3();
						}
						updateStarterCounts_v3();
					});
				}
			}

			// REMOVE TEXT AND LEAVE LINKS ONLY FOR FANTASY SHARKS
			document.querySelectorAll(".reportnavigation a").forEach(link => {
				if (link.textContent.includes('Fantasy')) {
					const parent = link.parentElement;
					parent.classList.add('links_nav');
					const span = document.createElement('span');
					span.className = 'thisSpan';
					parent.appendChild(span);
					span.appendChild(link);
				}
			});

			document.querySelectorAll('#lineup table.report.nocaption').forEach(table => {
  				// Skip nested ones: if any ancestor (excluding itself) is a .report.nocaption table, bail.
  				if (table.parentElement && table.parentElement.closest('table.report.nocaption')) return;
  				const hasIR = table.querySelector('a[href*="O=18"]');

  				if (hasIR) {
    					// Add caption only if the outer table doesn't already have one
    					if (!table.querySelector(':scope > caption')) {
      						const caption = document.createElement('caption');
      						caption.innerHTML = '<span>Injured Reserve</span>';
      						table.prepend(caption);
      						// Optional: table.classList.remove('nocaption');
    					}
  				} else {
    					// Remove wrapper or table when no IR link is present
    					const wrap = table.closest('.mobile-wrap');
    					if (wrap) wrap.remove();
    					else table.remove();
  				}
			});

			// ADD FILTERS TO CAPTION
			const LineupCap = LineupreportTable.querySelector('caption');

			// Create the container div
			const lineupFilter = document.createElement('div');
			lineupFilter.className = 'lineup_filter';
			lineupFilter.style.cssText = 'float:right;font-size:1.375rem;';

			// Create the LineupReset div
			const lineupReset = document.createElement('div');
			lineupReset.id = 'LineupReset';
			lineupReset.style.cssText = 'padding:0;text-indent:0;display:inline;margin-right:0.625rem;cursor:pointer';
			lineupReset.title = 'Reset Starting Lineup';
			lineupReset.innerHTML = '<i class="fa-regular fa-arrows-rotate" aria-hidden="true"></i>';

			// Create the LineupClear div
			const lineupClear = document.createElement('div');
			lineupClear.id = 'LineupClear';
			lineupClear.style.cssText = 'padding:0;text-indent:0;display:inline;cursor:pointer';
			lineupClear.title = 'Clear Starting Lineup';
			lineupClear.innerHTML = '<i class="fa-regular fa-eraser" aria-hidden="true"></i>';

			// Append the reset and clear divs to the lineupFilter container
			lineupFilter.appendChild(lineupReset);
			lineupFilter.appendChild(lineupClear);

			// Append the lineupFilter container to the caption
			LineupCap.appendChild(lineupFilter);

			if (franchise_id !== "0000") {
				const LineupFormReport = document.querySelector('#lineup form[action*="lineup"]');
				const weekNumber = LineupFormReport.querySelector('input[name="WEEK"]').value;
				if (weekNumber) {
					if (completedWeek >= weekNumber) { // This is a past week
						document.getElementById('body_lineup').classList.add('week_over');
						// Add classes to rows inside the '.custom_lineup_body.week_over'
						document.querySelectorAll('.custom_lineup_body.week_over .current_starters_row').forEach(el => el.classList.add('locked_starter_game_over'));
						document.querySelectorAll('.custom_lineup_body.week_over .current_bench_row').forEach(el => el.classList.add('locked_bench_game_over'));
						document.querySelectorAll('.custom_lineup_body.week_over .player_row').forEach(el => el.setAttribute('title', 'Game Over'));
						const style = document.createElement("style");
						style.textContent = '.custom_lineup_body.week_over tr.locked_starter_game_over,.custom_lineup_body.week_over tr.locked_bench_game_over{pointer-events:none;}.custom_lineup_body.week_over tr.locked_starter_game_over:after,.custom_lineup_body.week_over tr.locked_bench_game_over::after {content: "\\f30d" !important;}.custom_lineup_body.week_over .lineup_filter,.custom_lineup_body.week_over input[type="submit"] {pointer-events:none;}.custom_lineup_body.week_over input[type="submit"],.custom_lineup_body.week_over .form_buttons:before {opacity:.5;}.custom_lineup_body.week_over .starter_count,.custom_lineup_body.week_over .starter_count_sub {display:none !important;}.custom_lineup_body.week_over tr.locked_starter_game_over td.player,.custom_lineup_body.week_over tr.locked_bench_game_over td.player {pointer-events:all;}';
						document.head.appendChild(style);
					}
				}
			}

			if (franchise_id === "0000") {
				if (endWeek === completedWeek || completedWeek > endWeek) {
					//const leagueIdInput = document.querySelector('#body_lineup form[action*="lineup"] input[name="LEAGUE_ID"]');
					//if (leagueIdInput) {
					//const hiddenInput = document.createElement('input');
					//hiddenInput.type = 'hidden';
					//hiddenInput.name = 'WEEK';
					//hiddenInput.value = endWeek;
					//leagueIdInput.insertAdjacentElement('afterend', hiddenInput);
					//}
				}
			}

			const LineupForm = document.querySelector('#lineup form[action*="lineup"]');
			LineupForm.insertAdjacentHTML('beforeend', '<p class="form_buttons default-btn"><input type="button" value="Use Default Submission Form" onclick="redirectSubmissionPage_v3(true)"></p>');

			const linksNav = document.querySelector(".reportnavigation.links_nav");

			if (linksNav) {
				// Combine the innerHTML of the spans
				linksNav.innerHTML =
					linksNav.querySelector(".thisSpan").innerHTML +
					'<br>' +
					linksNav.querySelectorAll(".thisSpan")[1].innerHTML;

				// Insert linksNav before LineupForm
				LineupForm.parentElement.insertAdjacentElement('beforebegin', linksNav);
			}


			// Create a new div with the desired structure
			const starterCountSub = document.createElement('div');
			starterCountSub.classList.add('starter_count_sub');
			starterCountSub.style.display = 'none';
			let starterCountSubContent = `<div class="lineup_filter" style="float:right;font-size:1.375rem;"><div style="padding:0;text-indent:0;display:inline;margin-right:0.625rem;cursor:pointer" id="LineupReset" title="Reset Starting Lineup"><i class="fa-regular fa-arrows-rotate" aria-hidden="true"></i></div><div style="padding:0;text-indent:0;display:inline;cursor:pointer" id="LineupClear" title="Clear Starting Lineup"><i class="fa-regular fa-eraser" aria-hidden="true"></i></div></div><span class="starter_count_total_sub"></span>`;

			if (lu_useLineupIP) {
				starterCountSubContent += `<span class="starter_count_total_idp_sub"></span>`;
			}

			starterCountSubContent += `<div class="starter_count_reason_sub"><div style="display:none" class="starter_count_reason_more" onclick="document.querySelector('.starter_count_reason_more').style.display='none';document.querySelector('.starter_count_reason_content').style.display='block';document.querySelector('.starter_count_reason_less').style.display='block';">more</div><div class="starter_count_reason_less" style="display:none;" onclick="document.querySelector('.starter_count_reason_more').style.display='block';document.querySelector('.starter_count_reason_content').style.display='none';document.querySelector('.starter_count_reason_less').style.display='none';">less</div><div class="starter_count_reason_content" style="display:none;"></div></div>`;

			starterCountSub.innerHTML = starterCountSubContent;


			// Insert the new div before LineupForm
			LineupForm.parentNode.insertBefore(starterCountSub, LineupForm);

			// Select all elements with the ID "LineupClear"
			document.querySelectorAll('#LineupClear').forEach((clearButton) => {
				clearButton.addEventListener('click', () => {
					RunupdateStarterCounts = false;

					LineuptableRows.forEach((row) => {
						if (row.classList.contains('current_starters_row') && !row.classList.contains('locked_starter')) {
							// Simulate a click event on the row
							row.click();
						}
					});

					// Initial checked players per position
					// console.log("Initial checked players per position:", checkedPlayerCount);
					// console.log("Initial total checked players:", totalCheckedPlayers);

					const lu_playerSelects = document.querySelectorAll('.tie_breakers_row select');

					if (lu_playerSelects && lu_playerSelects.length > 0) {
						let anyOptionSelected = false; // Flag to track if any option is selected
						let allOptionsUnselected = true; // Flag to check if no options are selected

						lu_playerSelects.forEach(select => {
							const optionsArray = Array.from(select.options);

							optionsArray.forEach(option => {
								if (option.value && option.selected) {
									option.selected = false;
									anyOptionSelected = true; // Set flag if any option was initially selected
									allOptionsUnselected = false; // Set this flag to false if an option was selected
								}
							});
						});

						// Trigger the change event only once on the first select element if any option was selected
						if (anyOptionSelected) {
							lu_playerSelects[0].dispatchEvent(new Event('change'));
						}

						// Run updateStarterCounts() only if no option was selected across all selects
						if (allOptionsUnselected) {
							updateStarterCounts_v3();
						}
					} else {
						// Run updateStarterCounts() if no .tie_breakers_row select elements exist
						updateStarterCounts_v3();
					}

					RunupdateStarterCounts = true;
				});
				if (lu_hideFormTable.parentNode) {
					lu_hideFormTable.parentNode.removeChild(lu_hideFormTable);
				}
			});

			// Select all elements with the ID "LineupReset"
			document.querySelectorAll('#LineupReset').forEach((resetButton) => {
				resetButton.addEventListener('click', () => {
					RunupdateStarterCounts = false;

					// Reset rows based on starter status
					LineuptableRows.forEach((row) => {
						if ((row.classList.contains('previous_starter') && !row.classList.contains('current_starters_row')) ||
							(!row.classList.contains('previous_starter') && row.classList.contains('current_starters_row'))) {
							row.click(); // Simulate a click event on the row
						}
					});

					// Select all select elements in tie breakers rows
					const tieBreakerSelects = document.querySelectorAll('.tie_breakers_row select');

					let anyOptionSelected = false;

					// Only proceed if tieBreakerSelects exist
					if (tieBreakerSelects.length > 0) {
						tieBreakerSelects.forEach(select => {
							// Deselect all options within each select
							select.querySelectorAll('option').forEach(option => option.selected = false);

							// Reselect all options that have the 'selected-option' class
							const selectedOptions = select.querySelectorAll('option.selected-option');
							selectedOptions.forEach(option => {
								option.selected = true;
								anyOptionSelected = true;
							});

							// Trigger the change event only if any selected-option was reselected
							if (selectedOptions.length > 0) {
								select.dispatchEvent(new Event('change'));
							}
						});
					}

					// Run updateStarterCounts_v3() only if no 'selected-option' was reselected
					if (!anyOptionSelected) {
						updateStarterCounts_v3();
					}

					RunupdateStarterCounts = true;
				});
			});


			/////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////
			////////////////////     START FUNCTIONS     ////////////////////////
			/////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////


			// Function to check and log matches
			function checkForMatches_v3() {
				// Clear the error messages for a fresh start each time
				errorMessagesNonStarter = [];
				errorNonTiebreaker = false;
				let matchFound = false; // Flag to check if a match was found

				// Get all `data-value` attributes from `tr.current_starters_row`
				const starterRows = document.querySelectorAll("tr.current_starters_row");
				const starterValues = Array.from(starterRows).map(row => row.getAttribute("data-value"));

				// Get all selected options dynamically using the `selected` property
				const selectedOptions = document.querySelectorAll("select option");
				const selectedValues = Array.from(selectedOptions)
					.filter(option => option.selected) // Check the `selected` property
					.map(option => option.value);

				// Check for matches between starter values and selected values
				starterValues.forEach(value => {
					if (selectedValues.includes(value) && !matchFound) {
						//console.log(`Match found: ${value}`);
						errorMessagesNonStarter.push(`You have a starter selected as tie-breaker. Not allowed!`);
						errorNonTiebreaker = true;
						matchFound = true; // Set flag to true after the first match to prevent further pushes
					}
				});
				calculateSelectedCount_v3();
			}

			function updateStarterCountAndWarning_v3(lu_opt_select_count) {
				// Clear error messages
				errorMessagesTies = [];

				// Get or create the main span for the starter count
				let starterCountSpan = lu_select_elementTH.querySelector('.starter_count_tieBreaker');
				if (!starterCountSpan) {
					starterCountSpan = document.createElement('span');
					starterCountSpan.classList.add('starter_count', 'starter_count_tieBreaker');
					lu_select_elementTH.appendChild(starterCountSpan);
				}

				// Update the starter count text
				starterCountSpan.innerHTML = ` (${lu_opt_select_count} Selected)`;

				// Remove existing warning, if any
				const existingWarning = starterCountSpan.querySelector('.warning');
				if (existingWarning) existingWarning.remove();

				// Add warning based on the selected count
				if (lu_opt_select_count > tieBreakerNumber) {
					addWarningMessage_v3(starterCountSpan, 'warning_maximum_error', errorNonTiebreaker ? ' !Starter Selected As Tie-Breaker' : ' !Too Many');
					errorMessagesTies.push(`Must Select ${tieBreakerNumber} Tiebreak Players. (${lu_opt_select_count} selected)`);
				} else if (lu_opt_select_count < tieBreakerNumber) {
					addWarningMessage_v3(starterCountSpan, 'warning_minimum_error', errorNonTiebreaker ? ' !Starter Selected As Tie-Breaker' : ' !Minimum Not Satisfied');
					errorMessagesTies.push(`Must Select ${tieBreakerNumber} Tiebreak Players. (${lu_opt_select_count} selected)`);
				} else if (lu_opt_select_count === tieBreakerNumber && errorNonTiebreaker) {
					addWarningMessage_v3(starterCountSpan, 'warning_minimum_error', ' !Starter Selected As Tie-Breaker');
					//errorMessagesTies.push(`Must Select ${tieBreakerNumber} Tiebreak Players. (${lu_opt_select_count} selected)`);
				}
			}

			function addWarningMessage_v3(parentElement, warningClass, warningText) {
				const warningSpan = document.createElement('span');
				warningSpan.classList.add('warning', warningClass);
				warningSpan.innerText = warningText;
				parentElement.appendChild(warningSpan);
			}

			function checkFormations_v3() {
				const combinedPositionsEntry = lu_cus_formations.find(entry => entry.POSITIONS);
				const combinedPositions = combinedPositionsEntry.POSITIONS.split("+").map(pos => pos.toLowerCase());

				const positionCounts = combinedPositions.reduce((acc, pos) => {
					acc[pos] = 0;
					return acc;
				}, {});

				const formationPositionRows = document.querySelectorAll(`#lineup form[action*="lineup"] table.report tbody[data-type="${combinedPositionsEntry.POSITIONS.toLowerCase()}"] tr`);

				formationPositionRows.forEach(row => {
					if (row.classList.contains("locked_starter") || row.classList.contains("current_starters_row")) {
						const positionElement = row.querySelector('a[class*="position_"]');
						const code = getPositionCodeFromAnchor(positionElement);
						if (code && positionCounts.hasOwnProperty(code)) {
							positionCounts[code]++;
						}
					}
				});

				// Check if positionCounts matches any formation in lu_cus_formations
				const formationMatch = lu_cus_formations.slice(1).some(formation => {
					return Object.keys(formation).every(position => {
						const normalizedPosition = position.toLowerCase();
						return formation[position] === positionCounts[normalizedPosition];
					});
				});

				if (!formationMatch) {
					// Log an error message with the valid formations
					const validFormations = lu_cus_formations.slice(1)
						.map(formation =>
							Object.entries(formation)
							.map(([position, count]) => `${count} ${position}`)
							.join(" + ")
						);
					const invalidPositions = Object.keys(positionCounts).map(pos => pos.toUpperCase()).join(" + ");
					if (lu_validateLineUpV3) {
						errorMessages.push(`Invalid Formation of ${invalidPositions}<br>Valid formations are:<br>${validFormations.join("<br>")}`);
						invalidPositionsSpan = Object.keys(positionCounts).map(pos => pos).join("+");
					} else {
						invalidPositionsSpan = "";
					}
				} else {
					invalidPositionsSpan = "";
				}
			}


			function updateStarterCounts_v3() {

				//console.log("updateStarterCounts_v3 ran");
				//console.log("LeagueUsesTieBreakers: " + LeagueUsesTieBreakers)
				//console.log("tieBreakerNumber: " + tieBreakerNumber)
				//console.log("multipleTieBreakers: " + multipleTieBreakers)
				//console.log("tieBreakHasPosition: " + tieBreakHasPosition)
				//console.log("tieBreakPosition: " + tieBreakPosition)

				// Array to collect error messages from all positions
				errorMessages = [];

				// Track positions found in the HTML
				let foundPositions = new Set();

				let comboStarterCount = 0; // Track QB, RB, WR, TE total

				if (lu_useCustomFormations) checkFormations_v3();

				document.querySelectorAll('.starters_pos_row').forEach(row => {

					// Extract position from the class name
					const positionClass = Array.from(row.classList).find(cls => cls.startsWith('player_') && cls !== 'player_head_row');
					if (!positionClass) return;

					const position = positionClass.replace('player_', '').toLowerCase();
					foundPositions.add(position); // Mark this position as found

					const selectedCount = checkedPlayerCount[position] !== undefined ? checkedPlayerCount[position] : 0;

					const constraints = normalizedLineupConstraints[position] || {
						min: 0,
						max: 0
					};

					// Count players for the lu_combo_positions (QB, RB, WR, TE)
					if (lu_combo_maxStarters && lu_combo_positions.has(position)) {
						comboStarterCount += selectedCount;
					}

					// Skip if constraints are not found for the position
					if (!constraints) {
						if (lu_validateLineUpV3) {
							errorMessages.push(`League Requires ${position.toUpperCase()} position on your team`);
						}
						return;
					}

					// Append the selected count span
					const thElement = row.querySelector('.starters_pos_th');
					thElement.querySelectorAll('.starter_count').forEach(el => el.remove());

					const countSpan = document.createElement('span');
					countSpan.classList.add('starter_count', `starter_count_${position.toLowerCase()}`);
					countSpan.textContent = `(${selectedCount} Selected)`;

					let warningMessage = null;
					let warningType = '';

					if (invalidPositionsSpan !== "" && position === invalidPositionsSpan && !lu_allowPartial_lineup && lu_validateLineUpV3) {
						warningMessage = ' !Invalid Formation';
						warningType = 'warning_minimum_error';
					} else if (selectedCount < constraints.min && !lu_allowPartial_lineup && lu_validateLineUpV3) {
						errorMessages.push(`Min ${constraints.min} ${position.toUpperCase()} Required (${selectedCount} selected)`);
						warningMessage = ' !Minimum Not Satisfied';
						warningType = 'warning_minimum_error';
					} else if (selectedCount > constraints.max && !lu_allowPartial_lineup && lu_validateLineUpV3) {
						errorMessages.push(`Max ${constraints.max} ${position.toUpperCase()} Required (${selectedCount} selected)`);
						warningMessage = ' !Too Many';
						warningType = 'warning_maximum_error';
					}

					if (warningMessage) {
						const warning = document.createElement('span');
						warning.classList.add('warning', warningType);
						warning.textContent = warningMessage;
						countSpan.appendChild(warning);
					}


					// Append countSpan (with any warnings) to the thElement
					thElement.appendChild(countSpan);
				});

				// **Combo Max Starters Check**
				if (lu_combo_maxStarters && lu_validateLineUpV3) {
					if (Number(comboStarterCount) !== Number(lu_combo_maxCount)) {
						errorMessages.push(`Total starters for QB, RB, WR, TE must be exactly ${lu_combo_maxCount}. Currently selected: ${comboStarterCount}`);
					}
				}

				// Check for any missing positions from lu_lineup_constraint
				for (const position in normalizedLineupConstraints) {
					if (!foundPositions.has(position)) {
						// Push an error message for each missing position
						const constraints = normalizedLineupConstraints[position] || {
							min: 0,
							max: 0
						};
						if (constraints.min > 0 && lu_validateLineUpV3) {
							errorMessages.push(`League Requires a ${position.toUpperCase()}. Min-${constraints.min}, Max-${constraints.max}`);
						}
					}
				}

				// Check total starters constraint
				const totalConstraints = lu_lineup_constraint["total"];
				const totalMax = totalConstraints.max;

				let totalConstraints2;
				let totalMax2;
				if (lu_useLineupIP) {
					totalConstraints2 = lu_lineup_constraint["idptotal"];
					totalMax2 = totalConstraints2.max;
				}

				const totalThElement = document.querySelector('.select-total-starters');

				if (totalThElement) {
					// Remove any existing total count wrapper
					totalThElement.querySelectorAll('.starter_count_total_wrapper').forEach(el => el.remove());

					const totalWrapper = document.createElement('span');
					totalWrapper.classList.add('starter_count_total_wrapper');

					const totalCountSpan = document.createElement('span');
					totalCountSpan.classList.add('starter_count_total');
					totalCountSpan.textContent = `${totalCheckedPlayers}/${totalMax}`;

					let totalCountSpan2;
					if (lu_useLineupIP) {
						totalCountSpan2 = document.createElement('span');
						totalCountSpan2.classList.add('starter_count_total_idp');
						totalCountSpan2.textContent = `${defensiveCheckedPlayers}/${totalMax2}`;
					}

					const totalDrop = document.querySelector('.starter_count_total_sub');
					totalDrop.textContent = `Starters: ${totalCheckedPlayers}/${totalMax}`;

					let totalDrop2;
					if (lu_useLineupIP) {
						totalDrop2 = document.querySelector('.starter_count_total_idp_sub');
						totalDrop2.textContent = `IDP: ${defensiveCheckedPlayers}/${totalMax2}`;
					}

					// Check total constraints and collect errors
					if (totalCheckedPlayers < totalConstraints.min && lu_validateLineUpV3) {
						errorMessages.push(`Min ${totalConstraints.min} Starters Required (${totalCheckedPlayers} selected)`);
					}
					if (totalCheckedPlayers > totalMax && lu_validateLineUpV3) {
						errorMessages.push(`Max ${totalMax} Starters Required (${totalCheckedPlayers} selected)`);
					}

					totalWrapper.appendChild(totalCountSpan);
					if (lu_useLineupIP) {
						totalWrapper.appendChild(totalCountSpan2);
					}
					totalThElement.appendChild(totalWrapper);
				}

				// Log all error messages at once
				//errorMessages.forEach(msg => console.log(msg));

				// Check if there are any error messages
				const failed = errorMessages.length > 0 || errorMessagesTies.length > 0 || errorMessagesNonStarter.length > 0;
				//console.log("failed is " + failed)
				//console.log("lu_allowPartial_lineup is " + lu_allowPartial_lineup)
				// Enable or disable the submit buttons based on overall lineup validity
				if (failed && !lu_allowPartial_lineup) {
					//console.log("add disabled button")
					lu_submit_buttons.forEach(button => {
						if (franchise_id !== "0000") {
							button.parentElement.classList.add("buttonDisabledContainer");
						}
					});
				} else if (!failed && !lu_allowPartial_lineup) {
					//console.log("remove disabled button")
					lu_submit_buttons.forEach(button => {
						if (franchise_id !== "0000") {
							button.parentElement.classList.remove("buttonDisabledContainer");
						}
					});
				} else if (failed && lu_allowPartial_lineup) {
					lu_submit_buttons.forEach(button => {
						button.value = "Submit Lineup";
					});
				} else if (!failed && lu_allowPartial_lineup) {
					lu_submit_buttons.forEach(button => {
						button.value = "Submit Partial Lineup";
					});
				}

				// Find the .starter_count_sub element
				const starterCountSub = document.querySelector('.starter_count_sub');

				// Add or remove the fail class based on the failure condition
				if (!lu_allowPartial_lineup) {
					if (failed && lu_validateLineUpV3) {
						starterCountSub.classList.add('starter_count_sub_fail');
					} else {
						starterCountSub.classList.remove('starter_count_sub_fail');
					}
				}

				// Find .starter_count_reason_sub, .starter_count_reason_content, .starter_count_reason_more, and .starter_count_reason_less elements
				const starterCountReasonSub = document.querySelector('.starter_count_reason_sub');
				const starterCountReasonContent = document.querySelector('.starter_count_reason_content');
				const starterCountReasonMore = document.querySelector('.starter_count_reason_more');
				const starterCountReasonLess = document.querySelector('.starter_count_reason_less');

				if (lu_allowPartial_lineup) {
					// Hide starterCountReasonSub
					starterCountReasonSub.style.display = 'none';
				}

				// Clear the existing content in .starter_count_reason_content
				if (starterCountReasonContent) {
					if (lu_validateLineUpV3) {
						// Combine all error messages into a single string with line breaks
						const combinedErrors = [
							...errorMessages,
							...errorMessagesTies,
							...errorMessagesNonStarter
						].join('<br>');

						starterCountReasonContent.innerHTML = combinedErrors;
					}
				} else {
					console.warn("Element .starter_count_reason_content not found");
				}


				// Show or hide "more" and "less" based on the presence of error messages and content visibility
				if (failed && lu_validateLineUpV3) {
					const isContentVisible = starterCountReasonContent.style.display === 'block';

					// Toggle visibility based on content display status
					starterCountReasonMore.style.display = isContentVisible ? 'none' : 'block';
					starterCountReasonLess.style.display = isContentVisible ? 'block' : 'none';
				} else {
					// Hide both "more" and "less" if no errors
					starterCountReasonMore.style.display = 'none';
					starterCountReasonLess.style.display = 'none';
				}
			}

			// Function to calculate lu_opt_select_count based on the three scenarios
			function calculateSelectedCount_v3() {
				let selectCount = 0;
				let hiddenInputCount = 0;

				// Count selected options in the select element, if it exists
				if (lu_select_element) {
					selectCount = Array.from(lu_select_element.options).filter(option => option.selected).length;
				}

				// Count hidden input elements
				hiddenInputCount = lu_select_elementInput ? lu_select_elementInput.length : 0;

				// Total selected count
				lu_opt_select_count = selectCount + hiddenInputCount;
				updateStarterCountAndWarning_v3(lu_opt_select_count);
			}

			// Helper function to move a row between groups within a mapped position
			function moveRowBetweenGroups_v3(row, fromGroup, toGroup, mappedPosition) {
				// Remove the row from its original group
				rowGroupsByPosition[mappedPosition][fromGroup] = rowGroupsByPosition[mappedPosition][fromGroup].filter(r => r !== row);

				// Add the row to the beginning of the new group if moving to 'currentBench'
				if (toGroup === 'currentBench') {
					rowGroupsByPosition[mappedPosition][toGroup].unshift(row);
				} else {
					// Otherwise, add it to the end of the group (default behavior)
					rowGroupsByPosition[mappedPosition][toGroup].push(row);
				}
			}

			// Function to sort and apply row classes based on the specified order
			function resortRows_v3(position) {
				const {
					lockedStarters,
					currentStarters,
					currentBench,
					lockedBench
				} = rowGroupsByPosition[position];

				// Initialize row index for alternating row classes
				let rowIndex = 0;

				// Clear the tbody before appending sorted rows
				Lineuptbodies[position].innerHTML = '';

				// Append each group in the specified order and alternate row classes
				[...lockedStarters, ...currentStarters, ...currentBench, ...lockedBench].forEach(row => {
					// Update the row class for alternating styles
					row.classList.remove('oddtablerow', 'eventablerow');
					row.classList.add(rowIndex % 2 === 0 ? 'oddtablerow' : 'eventablerow');

					// Append the row back to the tbody
					Lineuptbodies[position].appendChild(row);

					// Increment the row index
					rowIndex++;
				});
			}

			function updateCheckedCount_v3(position, isChecked) {
				position = position.toLowerCase(); // Ensure position is lowercase for consistent access
				if (isChecked) {
					checkedPlayerCount[position]++;
				} else {
					checkedPlayerCount[position]--;
				}
			}

			//WEATHER POPUP HTML
			window.lu_v3_weatherPopup = function (tid, href) {
				if (typeof weather === "undefined") {
					//alert('Weather for this game is not defined');
					return false;
				}
				if (weather.hasOwnProperty(tid) && weather[tid].location) {
					var styleElementFour = document.createElement('style');
					styleElementFour.innerHTML = `.current-conditions-wrapper{margin-bottom:0.625rem}.current-conditions-wrapper,.kickoff-conditions-wrapper{border:0.188rem solid #ccc;border-radius:0.313rem;padding:0.625rem}.current-conditions-text,.kickoff-conditions-text{font-size:1rem;font-weight:700}.current-conditions-localtime{display:block;font-size:0.688rem;font-style:italic}.current-conditions-temp,.kickoff-conditions-temp{font-size:2.25rem;display:inline-block;vertical-align:top;margin-top:0.25rem;font-weight:700}.current-conditions-extras-wrapper,.kickoff-conditions-extras-wrapper{display:inline-block;vertical-align:top;margin-top:0.625rem;margin-left:0.938rem}.current-conditions-wind-wrapper,.current-conditions-rain-wrapper,.current-conditions-snow-wrapper,.kickoff-conditions-wind-wrapper,.kickoff-conditions-rain-wrapper,.kickoff-conditions-snow-wrapper{display:block}.weather-more-link{text-align:center;margin-top:0.375rem;cursor:pointer}#popup-weather-wrapper.modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:111111111;background:rgba(0,0,0,.7);display:none}#popup-weather-container{background:#fff;z-index:99999;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);border:0 solid #000;box-shadow:#000 0 0 1.563rem;border-radius:0.188rem;padding:0.625rem;max-height:95%;overflow:auto}img.kickoff-conditions-icon,img.current-conditions-icon{height:3.125rem;width:auto}.weather_caption{line-height:1.875rem;height:1.875rem;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;padding-right:1.438rem}.current-conditions-place{font-size:1.25rem;font-weight:700;max-width:0}.as_close_btn{position:absolute;z-index:1;cursor:pointer;border-radius:0.188rem;text-align:center;border:0.125rem solid transparent;font-weight:700;background:red;color:#fff;right:0;height:1.375rem;width:1.375rem;line-height:1.4;top:50%;transform:translateY(-50%)}.as_close_btn:hover{background:#000;color:#fff}`;
					document.head.appendChild(styleElementFour);
					//ADD POPUP CONTAINER 
					// Create and append the popup elements to the body
					let body = document.querySelector('body');
					let popupWrapper = document.createElement('div');
					popupWrapper.id = 'popup-weather-wrapper';
					popupWrapper.className = 'modal';
					popupWrapper.style.display = 'none';
					let popupContainer = document.createElement('div');
					popupContainer.id = 'popup-weather-container';
					popupContainer.className = 'modal-content animate';
					popupContainer.style.display = 'none';
					popupWrapper.appendChild(popupContainer);
					body.appendChild(popupWrapper);
					let html = '';
					html += '<div id="weather-wrapper">';
					html += '<div class="weather_caption"><span class="current-conditions-place">' + weather[tid].location.name + ', ' + weather[tid].location.region + '</span><span class="as_close_btn">X</span></div>';
					html += '<div class="current-conditions-wrapper">';
					html += '<div class="current-conditions-header"><span class="current-conditions-text">Current Conditions</span><span class="current-conditions-localtime"> last updated ' + weather[tid].current.last_updated + ' local time</span></div>';
					html += '<div class="current-conditions-detail">';
					html += '<span class="current-conditions-temp">' + weather[tid].current.temp_f + '&degF</span><span class="current-conditions-icon-wrapper"><img class="current-conditions-icon" src="' + weather[tid].current.condition.icon + '" /></span>';

					html += '<span class="current-conditions-extras-wrapper">';
					html += '<span class="current-conditions-wind-wrapper">Wind: <span class="current-conditions-wind-speed">' + weather[tid].current.wind_mph + 'mph</span> <span class="current-conditions-wind-direction">' + weather[tid].current.wind_dir + '</span></span>';

					for (let i = 0; i < weather[tid].forecast.forecastday[0].hour.length; i++) {
						const current_hour = weather[tid].forecast.forecastday[0].hour[i];
						const prev_hour = i === 0 ? current_hour : weather[tid].forecast.forecastday[0].hour[i - 1];
						if (current_hour.time_epoch >= currentServerTime) {
							if (prev_hour.chance_of_rain > 0) html += '<span class="current-conditions-rain-wrapper">Rain: <span class="current-conditions-chance-of-rain">' + prev_hour.chance_of_rain + '%</span></span>';
							if (prev_hour.chance_of_snow > 0) html += '<span class="current-conditions-snow-wrapper">Snow: <span class="current-conditions-chance-of-snow">' + prev_hour.chance_of_snow + '%</span></span>';
							break;
						}
					}
					html += '</span>';
					html += '<div class="current-conditions-text">' + weather[tid].current.condition.text + '</div>';
					html += '</div>';
					html += '</div>';

					html += '<div class="kickoff-conditions-wrapper">';
					html += '<div class="kickoff-conditions-header"><span class="kickoff-conditions-text">Expected Conditions at Kickoff</span></div>';
					try {
						html += '<div class="kickoff-conditions-detail">';
						html += '<span class="kickoff-conditions-temp">' + weather[tid].kickoff_weather.temp_f + '&degF</span><span class="kickoff-conditions-icon-wrapper"><img class="kickoff-conditions-icon" src="' + weather[tid].kickoff_weather.condition.icon + '" /></span>';
						html += '<span class="kickoff-conditions-extras-wrapper">';
						html += '<span class="kickoff-conditions-wind-wrapper">Wind: <span class="kickoff-conditions-wind-speed">' + weather[tid].kickoff_weather.wind_mph + 'mph</span> <span class="kickoff-conditions-wind-direction">' + weather[tid].kickoff_weather.wind_dir + '</span></span>';
						if (weather[tid].kickoff_weather.chance_of_rain > 0) html += '<span class="kickoff-conditions-rain-wrapper">Rain: <span class="kickoff-conditions-chance-of-rain">' + weather[tid].kickoff_weather.chance_of_rain + '%</span></span>';
						if (weather[tid].kickoff_weather.chance_of_snow > 0) html += '<span class="kickoff-conditions-snow-wrapper">Snow: <span class="kickoff-conditions-chance-of-snow">' + weather[tid].kickoff_weather.chance_of_snow + '%</span></span>';
						html += '</span>';
						html += '<div class="current-conditions-text">' + weather[tid].kickoff_weather.condition.text + '</div>';
					} catch (er) {
						html += '<div class="kickoff-conditions-no-data-available" style="color:red">Future forecasts available 72 hours prior to kickoff</div>';
					}
					html += '</div>';
					html += '</div>';

					html += '<div class="weather-more-link"><a onclick="window.open(\'' + href + '\', \'_blank\')">More at Weather.com</a></div>';
					html += '</div>';
					popupContainer.innerHTML = html;
					popupWrapper.style.display = 'block';
					popupContainer.style.display = 'block';
					try {
						bodyScrollLock.disableBodyScroll(popupWrapper)
					} catch (er) {}

					// Add listener for #popup-weather-wrapper and .as_close_btn
					popupWrapper.addEventListener('click', function (e) {
						// Check if the click is on #popup-weather-wrapper or .as_close_btn
						if (e.target === e.currentTarget || e.target.classList.contains('as_close_btn')) {
							popupWrapper.remove();
							document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
							document.querySelectorAll('.modal-content').forEach(content => content.style.display = 'none');
							try {
								bodyScrollLock.enableBodyScroll(popupWrapper)
							} catch (er) {}
						}
					});
				} else {
					alert('Weather for this game is not defined');
				}
			}

			function isOffScreen_v3(element) {
				const rect = element.getBoundingClientRect();
				return (
					(rect.x + rect.width) < 0 ||
					(rect.y + rect.height) < 0 ||
					rect.x > window.innerWidth ||
					rect.y > window.innerHeight
				);
			}

			// Show or hide display element based on whether check element is offscreen
			function checkOffScreen_v3(checkSelector, displaySelector) {
				const checkElement = document.querySelector(checkSelector);
				const displayElement = document.querySelector(displaySelector);

				if (checkElement && displayElement) {
					if (isOffScreen_v3(checkElement)) {
						// Show display element (similar to jQuery's slideDown)
						displayElement.style.display = 'block';
						displayElement.style.opacity = '1';
						displayElement.style.transition = 'opacity 0.5s';
					} else {
						// Hide display element (similar to jQuery's slideUp)
						displayElement.style.opacity = '0';
						setTimeout(() => {
							displayElement.style.display = 'none';
						}, 500); // Wait for transition to complete before setting display to none
					}
				}
			}

			// Run checkOffScreen_v3 every second
			setInterval(() => checkOffScreen_v3('.starters_count_row', '.starter_count_sub'), 1000);

			updateStarterCounts_v3();

		} else {
			document.getElementById('body_lineup').classList.add('custom_lineup_submission_body');

			document.querySelectorAll('#body_lineup table caption span a').forEach(function (element) {
				element.remove();
			});

			// Add a new <th> to rows that contain <th> elements
			document.querySelectorAll('.custom_lineup_submission_body table.report tr').forEach(function (row) {
				if (row.querySelector('th')) {
					let newTh = document.createElement('th');
					row.prepend(newTh);
				}
			});

			// Remove salary cells
			document.querySelectorAll('.custom_lineup_submission_body table.report tr td.salary').forEach(function (td) {
				td.remove();
			});

			// Change colspan from 2 to 3 for td elements with colspan="2"
			document.querySelectorAll('.custom_lineup_submission_body table.report tr td[colspan="2"]').forEach(function (td) {
				td.setAttribute('colspan', '3');
			});

			// Add class 'playerRow' to rows that contain a 'td.player'
			document.querySelectorAll('.custom_lineup_submission_body table.report tr').forEach(function (row) {
				if (row.querySelector('td.player')) {
					row.classList.add('playerRow');
				}
			});

			document.querySelectorAll('.custom_lineup_submission_body table.report tr.playerRow').forEach(function (row) {
				const playerCell = row.querySelector('td.player');
				if (!playerCell) return;

				// Get next <td> after td.player
				let nextCell = playerCell.nextElementSibling;
				if (!nextCell) return;

				// If it's td.salary, skip to the next one
				if (nextCell.classList.contains('salary')) {
					nextCell = nextCell.nextElementSibling;
					if (!nextCell) return;
				}

				// Move its content into the player cell
				const opponentSpan = document.createElement('span');
				opponentSpan.classList.add('opponent');
				opponentSpan.innerHTML = nextCell.innerHTML;
				playerCell.appendChild(opponentSpan);

				// Remove the old opponent <td>
				nextCell.remove();
			});

			// Remove the 3rd <th> and <td> elements in each row
			document.querySelectorAll('.custom_lineup_submission_body table.report tr').forEach(function (row) {
				const cells = Array.from(row.children);
				const thirdCell = cells[2];
				if (!thirdCell) return;
				if (thirdCell.closest('.playerImgTable')) {
					return;
				}
				thirdCell.remove();
			});

			// Add class 'byeWeek' to any span with class 'opponent' containing the text 'Bye'
			document.querySelectorAll('.custom_lineup_submission_body table.report span.opponent').forEach(function (span) {
				if (span.textContent.includes('Bye')) {
					span.classList.add('byeWeek');
				}
			});

			// Add class 'starter_totalsRow' to rows containing 'players' text but not 'playerRow'
			document.querySelectorAll('.custom_lineup_submission_body tr').forEach(function (row) {
				if (row.querySelector('td') && row.textContent.includes('players') && !row.classList.contains('playerRow')) {
					row.classList.add('starter_totalsRow');
				}
			});

			// Remove 'starters' class and set colspan to 3 for 'td' in '.starter_totalsRow', then remove the last 'td'
			document.querySelectorAll('.custom_lineup_submission_body tr.starter_totalsRow td').forEach(function (td) {
				td.classList.remove('starters');
				td.setAttribute('colspan', '3');
			});

			document.querySelectorAll('.custom_lineup_submission_body tr.starter_totalsRow td:last-child').forEach(function (td) {
				td.remove();
			});

			// ADD PLAYER IMAGES
			var pos_team_img = {
				Coach: !0,
				Off: !0,
				Def: !0,
				ST: !0,
				TMQB: !0,
				TMRB: !0,
				TMWR: !0,
				TMTE: !0,
				TMPK: !0,
				TMPN: !0,
				TMDL: !0,
				TMLB: !0,
				TMDB: !0
			};

			document.querySelectorAll('.custom_lineup_submission_body table td.player').forEach(function (td) {
				let link = td.querySelector('a');
				if (!link) return;

				// --- NEW: if link has a playerImgTable, capture the photo src and move warning badge ---
				const hasImgTable = !!link.querySelector('.playerImgTable');
				// We'll stash a reference to the warning span (if present) and move it later
				let movedWarning = null;

				if (hasImgTable) {
					// 1) Capture current photo (if present) from the inner table
					const existingPhotoSrc = link.querySelector('img.playerPhoto')?.getAttribute('src') || "";
					if (existingPhotoSrc) td.closest('tr')?.setAttribute('data-player-photo', existingPhotoSrc);

					// 2) FIND & REMOVE the warning span from the first-name area so it won't duplicate
					const warningInName = link.querySelector('.playerFirstName span.warning');
					if (warningInName) {
						warningInName.textContent = warningInName.textContent.replace(/[()]/g, "").trim();
						movedWarning = warningInName; // keep the actual node so events/styles remain
						movedWarning.remove(); // detach from the anchor before rebuild
					}

					// 3) Rebuild the clean anchor (won't include the warning because we removed it)
					const cleanA = rebuildPositionLink(link);
					if (cleanA) link.replaceWith(cleanA);

					// 4) Re-query the link after replacement
					link = td.querySelector('a');
					if (!link) return;
				}

				// ---- derive pid, team & pos for fallback image logic ----
				const url = link.getAttribute('href') || "";
				let playerID_lu;
				if (url.indexOf("launch_player_modal") !== -1) {
					const qs = url.split(',');
					playerID_lu = (qs[1] || "").replace(/'/g, "").replace(");", "");
				} else {
					playerID_lu = url.substring(url.indexOf("P=") + 2);
				}

				const name = link.textContent.trim();
				const name_ar = name.split(/\s+/);
				const position = name_ar[name_ar.length - 1];
				const nfl_team = name_ar[name_ar.length - 2];

				const capturedPhoto = td.closest('tr')?.getAttribute('data-player-photo') || "";
				const profile_image = capturedPhoto ?
					capturedPhoto :
					(pos_team_img.hasOwnProperty(position) ?
						"https://www.mflscripts.com/playerImages_96x96/mfl_" + nfl_team + ".svg" :
						"https://www.mflscripts.com/playerImages_96x96/mfl_" + playerID_lu + ".png");

				// ---- Insert (or reuse) the photo cell before td.player ----
				const row = td.parentNode;
				let imgTD = row.querySelector('td.pphoto');
				if (!imgTD) {
					imgTD = document.createElement('td');
					imgTD.classList.add('pphoto');
					row.insertBefore(imgTD, td); // before the player cell
				} else {
					// clear any previous content so re-runs don't pile up
					imgTD.textContent = '';
				}

				const img = document.createElement('img');
				img.classList.add('headshot');
				img.src = profile_image;
				img.onerror = function () {
					img.src = 'https://www.mflscripts.com/playerImages_96x96/free_agent.png';
				};

				imgTD.appendChild(img);

				if (movedWarning) {
					movedWarning.classList.add('moved-warning');
					imgTD.appendChild(movedWarning);
				}
			});
		}

		var styleElement = document.createElement("style");
		styleElement.textContent = '#body_lineup.custom_lineup_submission_body .moved-warning{font-size:0.625rem;font-weight:400;border-radius:50%;width:1rem;height:1rem;line-height:1rem;display:block;position:absolute;z-index:2;color:#fff;background:red;text-align:center;bottom:0.5em;right:0.2em}#body_lineup.custom_lineup_submission_body td.pphoto{position:relative}.custom_lineup_body form table + div,.custom_lineup_body form table ~ .reportnavigation,.custom_lineup_body form table ~ .alert,.team_lineup_table form table ~ span.reportnavigation{display:none;}#body_lineup.custom_lineup_body form span.points_row .avg-pts,#body_lineup.custom_lineup_body form span.points_row .ytd-pts,#body_lineup.custom_lineup_body form span.points_row .proj-pts {display:none;}#body_lineup.custom_lineup_body .franchiselogo {display:none !important;}#body_lineup.custom_lineup_body form table caption span a {display:none;}#body_lineup.custom_lineup_body form textarea[name*="MESSAGE"] {width:100%;}#body_lineup.custom_lineup_body table td.pphoto {text-align:center !important;border-radius:50%;width:3.438rem;height:90%;position:absolute;left:0.188rem;top:50%;transform:translateY(-50%);}#body_lineup.custom_lineup_body tr.previous_starter td.pphoto:before {content:"\\f05d";font-family:"Font Awesome 6 Pro";position:absolute;top:0;z-index:1;font-size:1rem;left:0;cursor:default;height:0.75rem;width:0.75rem;background:none;}#body_lineup.custom_lineup_body table td.pphoto img[src*="svg"] {padding:0.25rem;}#body_lineup.custom_lineup_body tr.player_row {position:relative;display:block;height:3.75rem;}#body_lineup.custom_lineup_body .player_row.eventablerow td,#body_lineup.custom_lineup_body .player_row.oddtablerow td,#body_lineup.custom_lineup_body tr.player_row td {padding:0 !important;margin:0 !important;border:0 !important;box-shadow:none !important;background:none !important;}#body_lineup.custom_lineup_body form td.player {left:4.063rem;font-size:1.125rem;position:absolute;z-index:2;top:30%;transform:translateY(-50%);cursor:pointer;white-space:nowrap;font-weight:700;}#body_lineup.custom_lineup_body form tr td.player img {margin-top:-0.25rem;}#body_lineup.custom_lineup_body form td.player input {display:none;}#body_lineup.custom_lineup_body form td.weekly-opp {left:4.375rem;top:70%;transform:translateY(-50%);font-size:0.875rem;position:absolute;z-index:2;pointer-events:auto;text-decoration:none;white-space:nowrap;}#body_lineup.custom_lineup_body form td.weekly-opp .warning {font-weight:400;}#body_lineup.custom_lineup_body form td.inj b.warning {font-size:0.625rem;font-weight:400;border-radius:50%;width:1rem;height:1rem;line-height:1rem;display:block;top:2.125rem;left:3.125rem;position:absolute;z-index:2;}#body_lineup.custom_lineup_body form th {font-size:1rem;}#body_lineup.custom_lineup_body form table tr td a {text-decoration:none;}tr.player_row {cursor:pointer;}#body_lineup.custom_lineup_body form th.select-total-starters {position:relative;display:block;}#body_lineup.custom_lineup_body tr.player_row:after {font-family:"Font Awesome 6 Pro";position:absolute;z-index:1;font-size:1.6rem;text-align:center;right:0;top:50%;transform:translateY(-50%);width:2.125rem;}#body_lineup.custom_lineup_body tr.current_starters_row:after {content:"\\f046";}#body_lineup.custom_lineup_body tr.current_bench_row:after {content:"\\f0aa";}#body_lineup.custom_lineup_body tr.locked_starter:after,#body_lineup.custom_lineup_body tr.locked_bench::after {content:"\\f30d";width:2.063rem;font-size:1.6rem;}#body_lineup.custom_lineup_body form td.pos-rank {font-size:0.625rem;position:absolute;text-align:center;width:3.063rem;z-index:1;pointer-events:none;text-decoration:none;left:0.375rem;bottom:0.125rem;border-radius:0.313rem;}#body_lineup.custom_lineup_body form tr td.pos-rank:before {content:attr(data-content) "\\00a0#";display:inline;padding-bottom:0.313rem;margin-top:-1.25rem;text-transform:uppercase;}#body_lineup.custom_lineup_body form td.weekly-opp .warning:before {content:"Player\\00a0";}#body_lineup.custom_lineup_body form td.weekly-opp .warning:after {content:"\\00a0Week";}#body_lineup.custom_lineup_body form td.weekly-opp .warning.no_content {font-size:0;}#body_lineup.custom_lineup_body form td.weekly-opp .warning.no_content:before {content:"";}#body_lineup.custom_lineup_body form td.weekly-opp .warning.no_content:after {content:"No Matchup Found";font-size:0.875rem;}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.rush-rank:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td[class*="-start"]:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td.proj-pts:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td.avg-pts:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td.ytd-pts:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td.bye:before {display:block;font-weight:700;text-decoration:underline;padding-bottom:0.313rem;margin-top:-1.25rem;}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.bye:before {content:"Bye";}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.ytd-pts:before {content:"YTD";}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.avg-pts:before {content:"AVG";}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.proj-pts:before {content:"Proj.";font-style:normal;}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.rush-rank:before {content:"Opp Rk";}#body_lineup.custom_lineup_body form table.position-table tr:first-child td[class*="-start"]:before {content:"Started";}#body_lineup.custom_lineup_body form tr td[class*="-start"]:after {content:"%";}#body_lineup.custom_lineup_body form td.proj-pts,#body_lineup.custom_lineup_body form td.ytd-pts,#body_lineup.custom_lineup_body form td.avg-pts,#body_lineup.custom_lineup_body form td[class*="-start"],#body_lineup.custom_lineup_body form td.rush-rank,#body_lineup.custom_lineup_body form tr td.bye {top:50%;transform:translateY(-50%);font-size:0.875rem;position:absolute;text-align:center;width:5rem;z-index:1;pointer-events:none;text-decoration:none;}#body_lineup.custom_lineup_body form td.proj-pts {font-style:italic;right:3.75rem;}#body_lineup.custom_lineup_body form td.ytd-pts {right:9.375rem;}#body_lineup.custom_lineup_body form td.avg-pts {right:15rem;}#body_lineup.custom_lineup_body form td[class*="-start"] {right:20.625rem;}#body_lineup.custom_lineup_body form td.rush-rank {right:26.25rem;}#body_lineup.custom_lineup_body form tr td.bye {right:31.875rem;}#body_lineup.custom_lineup_body form table caption {font-size:1.375rem;padding:0.5rem 0.313rem;line-height:100%;}#body_lineup.custom_lineup_body .starter_count {position:relative;}#body_lineup.custom_lineup_body .starter_count .warning_minimum_error,#body_lineup.custom_lineup_body .starter_count .warning_maximum_error {border-radius:0.313rem;padding:0.188rem 0.188rem;position:absolute;top:50%;transform:translateY(-50%);white-space:nowrap;font-size:0.75rem;margin-left:0.25rem;font-weight:bold;font-family:monospace;}#body_lineup.custom_lineup_body .starter_count_total_wrapper {position:absolute;right:0.625rem;}#body_lineup.custom_lineup_body .starter_count_total_idp {margin-left:0.625rem;}.custom_lineup_submission_body td,.custom_lineup_submission_body th,.custom_lineup_submission_body td.player.opponent {text-align:left !important;}.custom_lineup_submission_body td.opponent:nth-child(1) {text-align:center !important;white-space:nowrap;width:0.188rem !important;max-width:0.188rem;float:left;}.custom_lineup_submission_body td.opponent[colspan="3"] {white-space:unset;float:none;width:auto !important;max-width:none !important;}.starter_count_sub .lineup_filter {float:none !important;position:absolute;right:0.313rem;}.starter_count_total_idp_sub {margin-left:0.625rem;}.starter_count_reason_content {cursor:default;font-size:0.75rem;}.starter_count_reason_more, .starter_count_reason_less {font-size: 0.85rem;cursor: pointer;border-radius: 0.188rem;text-transform: uppercase;width: 5rem;margin: .388rem auto;padding: .188rem;}.starter_count_sub {position:fixed;margin:auto;max-width:25rem;top:0;right:0;left:0;text-align:center;font-size:1.125rem;padding:0.625rem;border-bottom-left-radius:0.313rem;border-bottom-right-radius:0.313rem;z-index:10000000;border-top:0;}.starter_count_sub.starter_count_sub_fail:before {text-align:center;content:"!Invalid\\00a0Lineup";font-weight:700;position:absolute;left:0;top:0.313rem;margin:0 auto;right:0;width:9.375rem;border-radius:0.313rem;font-size:1rem;}.starter_count_sub.starter_count_sub_fail {padding-top:1.75rem;}#body_lineup.custom_lineup_body .reportnavigation br {display:none;}#body_lineup.custom_lineup_body .links_nav {padding-top:0.313rem;padding-bottom:0.5rem;}#body_lineup.custom_lineup_body .links_nav a {text-decoration:none;display:inline-block;margin:0.313rem;margin-top:0;border-radius:0.188rem;padding:0.313rem;}#body_lineup.custom_lineup_submission_body caption a {display:none;}#body_lineup.custom_lineup_submission_body caption {text-align:left !important;}.custom_lineup_submission_body .mobile-wrap,.custom_lineup_submission_body table.report {max-width:26.25rem;}.custom_lineup_submission_body td,.custom_lineup_submission_body th {text-align:left !important;}.custom_lineup_submission_body td.pphoto img[src*="svg"] {padding:0.313rem;}.custom_lineup_submission_body tr.starter_totalsRow td {text-align:center !important;font-weight:bold;font-size:1rem;text-align:center !important;text-transform:uppercase;}.custom_lineup_submission_body tr.starter_totalsRow td:after {content:"\\00a0Started";}#body_lineup table tr.playerRow td.pphoto img,#body_lineup table tr.player_row td.pphoto img {border-radius:50%;width:100%;height:100%;}#body_lineup table tr.playerRow td.pphoto img[src*="player_photos_"],#body_lineup table tr.player_row td.pphoto img[src*="player_photos_"] {object-fit:contain;}.custom_lineup_submission_body td.pphoto {width:3.438rem;min-width:3.438rem;height:3.438rem;min-height:3.438rem;}.custom_lineup_submission_body td.pphoto img {width:3.063rem !important;height:3.063rem !important;}#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"] {object-fit:cover;object-position:50% -0.188rem;}#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="PIT.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="JAC.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="DAL.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="NOS.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="GBP.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="NYJ.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="KCC.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="SFO.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="CHI.svg"],#body_lineup table tr.player_row td.pphoto img[src*="nflTeamsvg_lineup"][src*="CIN.svg"] {object-position:50% -0.313rem;}td.pphoto img {image-rendering:-webkit-optimize-contrast;image-rendering:optimize-contrast;}@media only screen and (max-width:61em) {#body_lineup.custom_lineup_body form td.proj-pts {right:3.75rem;}#body_lineup.custom_lineup_body form td.ytd-pts {right:7.5rem;}#body_lineup.custom_lineup_body form td.avg-pts {right:11.875rem;}#body_lineup.custom_lineup_body form td[class*="-start"] {right:16.875rem;}#body_lineup.custom_lineup_body form td.rush-rank {right:21.875rem;}#body_lineup.custom_lineup_body form tr td.bye {right:26.875rem;}}@media only screen and (max-width:56em) {#body_lineup.custom_lineup_body form tr td.bye {display:none;}}@media only screen and (max-width:51em) {#body_lineup.custom_lineup_body tr.player_row {height:4.625rem;}#body_lineup.custom_lineup_body form td.rush-rank {transform:none;font-size:0.813rem;width:5rem;left:5rem;right:auto;top:80%;transform:translateY(-50%);text-align:left;opacity:.9;}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.rush-rank:before {content:"Opp Rk #";display:inline-block;font-weight:400;text-decoration:none;padding:0;margin:0;}#body_lineup.custom_lineup_body form tr td.rush-rank:before {content:"Opp Rk #";}#body_lineup.custom_lineup_body form tr td.rush-rank.no_ranking {font-size:0;}#body_lineup.custom_lineup_body form tr td.rush-rank.no_ranking:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td.rush-rank.no_ranking:before {content:"No Ranking";font-size:0.813rem;font-style:italic;}#body_lineup.custom_lineup_body table td.pphoto {width:4.063rem;}#body_lineup.custom_lineup_body form td.player {top:20%;transform:translateY(-50%);left:4.375rem;}#body_lineup.custom_lineup_body form td.weekly-opp {top:50%;transform:translateY(-50%);left:4.688rem;}#body_lineup.custom_lineup_body form td.pos-rank {font-size:0.688rem;left:0.563rem;bottom:0.188rem;width:3.313rem;}#body_lineup.custom_lineup_body form td.inj b.warning {top:2.813rem;left:3.438rem;}#body_lineup.custom_lineup_body form table.position-table tr:first-child td.ytd-pts:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td.avg-pts:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td.proj-pts:before,#body_lineup.custom_lineup_body form table.position-table tr:first-child td[class*="-start"]:before {margin-top:-2rem;}}@media only screen and (max-width:46em) {#body_lineup.custom_lineup_body form tr td[class*="-start"] {transform:none;font-size:0.813rem;width:7.5rem;left:10rem;right:auto;top:80%;transform:translateY(-50%);text-align:left;opacity:.9;}#body_lineup.custom_lineup_body form table.position-table tr:first-child td[class*="-start"]:before {content:"Started By\\00a0";display:inline-block;font-weight:400;text-decoration:none;padding:0;margin:0;}#body_lineup.custom_lineup_body form tr td[class*="-start"]:before {content:"Started By\\00a0";}}@media only screen and (max-width:41em) {#body_lineup.custom_lineup_body form td.avg-pts {right:11.25rem;}#body_lineup.custom_lineup_body form td.ytd-pts {right:6.875rem;}#body_lineup.custom_lineup_body form td.proj-pts {right:2.5rem;}}@media only screen and (max-width:40em) {#body_lineup.custom_lineup_body form td.player {left:4.25rem;font-size:1rem;top:16%;transform:translateY(-50%);}#body_lineup.custom_lineup_body form td.weekly-opp {left:4.75rem;top:41%;transform:translateY(-50%);font-size:0.813rem;}#body_lineup.custom_lineup_body form td.rush-rank {font-size:0.75rem;left:5.25rem;}#body_lineup.custom_lineup_body form tr td[class*="-start"] {font-size:0.75rem;left:10rem;}#body_lineup.custom_lineup_body form td.rush-rank,#body_lineup.custom_lineup_body form tr td[class*="-start"] {top:65%;transform:translateY(-50%);}#body_lineup.custom_lineup_body form span.points_row {position:absolute;font-size:0.75rem;top:88%;transform:translateY(-50%);left:5.25rem;opacity:.9;}#body_lineup.custom_lineup_body form span.points_row span span {margin-left:0.313rem;}#body_lineup.custom_lineup_body form span.points_row .avg-pts {display:inline;}#body_lineup.custom_lineup_body td.avg-pts {display:none;}#body_lineup.custom_lineup_body form tr td.rush-rank.no_ranking:before {font-size:0.75rem;}}@media only screen and (max-width:34em) {#body_lineup.custom_lineup_body form span.points_row .ytd-pts {display:inline;margin-left:0.625rem;}#body_lineup.custom_lineup_body td.ytd-pts {display:none;}}@media only screen and (max-width:32em) {#body_lineup.custom_lineup_body .starter_count_total_wrapper {position:unset;right:auto;display:block;}#body_lineup.custom_lineup_body .starter_count .warning_minimum_error,#body_lineup.custom_lineup_body .starter_count .warning_maximum_error {position:relative;top:auto;transform:none;margin-left:0;display:table;margin:0 auto;margin-top:0.188rem;margin-bottom:0.125rem;}}@media only screen and (max-width:30em) {#body_lineup.custom_lineup_body form span.points_row .proj-pts {display:inline;margin-left:0.625rem;}#body_lineup.custom_lineup_body form td.proj-pts {display:none;}}@media only screen and (max-width:26em) {.starter_count_sub {margin:auto 0.313rem;}}@media only screen and (max-width:24em) {#body_lineup.custom_lineup_body form td.player {left:4.125rem;}#body_lineup.custom_lineup_body form td.weekly-opp {left:4.5rem;}#body_lineup.custom_lineup_body form td.rush-rank {left:4.5rem;}#body_lineup.custom_lineup_body form tr td[class*="-start"] {left:9.375rem;}#body_lineup.custom_lineup_body form span.points_row {position:absolute;font-size:0.75rem;left:4.5rem;}#body_lineup.custom_lineup_body form span.points_row .proj-pts,#body_lineup.custom_lineup_body form span.points_row .ytd-pts {margin-left:0.375rem;}#body_lineup.custom_lineup_body form span.points_row span span {margin-left:0.188rem;}}@media only screen and (max-width:23em) {#body_lineup.custom_lineup_body form td.player {font-size:0.875rem;}#body_lineup.custom_lineup_body form td.weekly-opp {font-size:0.75rem;}#body_lineup.custom_lineup_body form tr td[class*="-start"] {font-size:0.688rem;left:8.75rem;}#body_lineup.custom_lineup_body form td.rush-rank {font-size:0.688rem;left:4.5rem;}}@media only screen and (max-width:22em) {.starter_count_sub {text-align:left;}.starter_count_reason_sub {text-align:center;}}@media only screen and (max-width:21em) {#body_lineup.custom_lineup_body form tr td.rush-rank.no_ranking:before {font-size:0.688rem;}#body_lineup.custom_lineup_body form td.player {font-size:0.75rem;left:3.125rem;}#body_lineup.custom_lineup_body table td.pphoto {width:3.125rem;height:70%;left:0.188rem;}#body_lineup.custom_lineup_body table td.pphoto img {width:3.125rem;}#body_lineup.custom_lineup_body form td.pos-rank {left:0;bottom:0.313rem;}#body_lineup.custom_lineup_body form td.weekly-opp {font-size:0.688rem;left:3.438rem;}#body_lineup.custom_lineup_body form tr td[class*="-start"] {left:8.125rem;}#body_lineup.custom_lineup_body form td.rush-rank {left:3.625rem;}#body_lineup.custom_lineup_body form td.inj b.warning {top:2.5rem;left:2.5rem;}#body_lineup.custom_lineup_body form span.points_row {font-size:0.688rem;}#body_lineup.custom_lineup_body form span.points_row {left:3.625rem;}}', document.head.appendChild(styleElement);

		let styleToRemove = document.getElementById('starterCSS');
		if (styleToRemove) {
			styleToRemove.remove(); // Removes the style element if it exists
		}
	}

	var styleElementOne = document.createElement("style");
	styleElementOne.innerHTML = '#body_lineup input[type="submit"] + .form_buttons.default-btn{display:none;}#body_lineup p.form_buttons{margin-left:-0.813rem!important;}#body_lineup p.form_buttons input[type="submit"]{padding-left:1.625rem!important;}#body_lineup p.form_buttons.default-btn{margin-left:0.813rem!important;}#body_lineup p.form_buttons.default-btn input{padding-right:1.625rem!important;}#body_lineup .form_buttons:before{font-family:"Font Awesome 6 Pro";position:relative;left:1.438rem;content:"\\f00c";z-index:1;font-size:1rem;}#body_lineup .form_buttons.default-btn:after{font-family:"Font Awesome 6 Pro";position:relative;right:1.438rem;content:"\\f0a9";z-index:1;font-size:1rem;}#body_lineup p.form_buttons.buttonDisabledContainer input[type="submit"]{opacity:0.5;pointer-events:none;}#body_lineup .form_buttons.buttonDisabledContainer:before{content:"\\f057";}#body_lineup .form_buttons.default-btn::before{display:none;}.custom_lineup_submission_body table.report span.opponent {font-weight:400;font-size:0.813rem;position:absolute;left:0.625rem;margin-top:1.563rem;}.custom_lineup_submission_body table.report span.byeWeek {color:red;}.custom_lineup_submission_body .mobile-wrap,.custom_lineup_submission_body table.report{max-width:26.25rem;}.custom_lineup_submission_body table.report td.player{font-weight:700;font-size:1rem;position:relative;padding-bottom:1.563rem;white-space:nowrap;}.custom_lineup_submission_body table.report .playerPopupIcon:first-of-type{display:inline-block;}.custom_lineup_submission_body table.report .playerPopupIcon{display:none;}.custom_lineup_submission_body table.report tr th:nth-child(3),.custom_lineup_submission_body table.report tr td:nth-child(3){display:none!important;}', document.head.appendChild(styleElementOne);


	/////////////////////////////////////////////////
	// START ALL FUNCTIONS CODING
	/////////////////////////////////////////////////

	// Button for default or custom lineup
	function redirectSubmissionPage_v3(mflDefault) {
		var url = window.location.href;
		if (lu_useDefaultAsPrimaryV3) {
			localStorage.setItem("luV3_useDefault_" + league_id + "_" + franchise_id, mflDefault);
		} else {
			localStorage.setItem("luV3_useDefault_" + league_id + "_" + franchise_id, !mflDefault);
		}
		if (url.includes("?L=")) {
			window.location.href = url; // Redirect to the same URL
		} else {
			window.location.reload(); // Reload the current page
		}
	}


}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END LINEUP V3 SCRIPT//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////START GLOBAL HEADER PART 2////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// Deftect mobile devices and remove custom scrollbar
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	var style = document.createElement('style');
	document.head.appendChild(style);
	style.sheet.insertRule('::-webkit-scrollbar{display:none}');
}
//THIS NEEDS TO BE PLACED IN HEADER AND IS USED TO GO BACK IN HISTORY FOR MFL'S LIVE SCORING
if (document.getElementById("body_ajax_ls")) {
	var ls_liveScoringWeekCheck = parseInt(location.href.substr(location.href.indexOf("W2=") + 3, 2));
	if (ls_liveScoringWeekCheck > 0 && ls_liveScoringWeekCheck < liveScoringWeek) {
		liveScoringWeek = parseInt(location.href.substr(location.href.indexOf("W2=") + 3, 2));
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////END GLOBAL HEADER PART 2//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////