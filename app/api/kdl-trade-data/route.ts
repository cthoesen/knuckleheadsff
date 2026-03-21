import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// --- LEAGUE SETTINGS ---
// Update this year when ready to roll to new season
const SEASON_YEAR = '2025';
const LEAGUE_ID = '68756';

const API_BASE = `https://api.myfantasyleague.com/${SEASON_YEAR}/export`;

async function mflFetch(type: string, extraParams = '') {
  const url = `${API_BASE}?TYPE=${type}&L=${LEAGUE_ID}&JSON=1${extraParams}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
    next: { revalidate: 300 } // 5-minute cache to avoid rate limiting (6 API calls)
  });
  if (!res.ok) throw new Error(`MFL ${type} fetch failed: ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [leagueData, rostersData, playersData, scoresYTD, scoresAVG, picksData] =
      await Promise.all([
        mflFetch('league'),
        mflFetch('rosters'),
        mflFetch('players', '&DETAILS=1'),
        mflFetch('playerScores', '&WEEK=YTD'),
        mflFetch('playerScores', '&WEEK=AVG'),
        mflFetch('futureDraftPicks'),
      ]);

    // Build player lookup maps
    const playerList = playersData?.players?.player || [];
    const playerMap = new Map<string, { name: string; position: string; team: string }>();
    for (const p of playerList) {
      playerMap.set(p.id, {
        name: p.name,
        position: p.position,
        team: p.team,
      });
    }

    // Build score lookup maps
    const ytdScores = new Map<string, number>();
    const avgScores = new Map<string, number>();

    const ytdList = scoresYTD?.playerScores?.playerScore || [];
    for (const s of ytdList) {
      ytdScores.set(s.id, parseFloat(s.score) || 0);
    }

    const avgList = scoresAVG?.playerScores?.playerScore || [];
    for (const s of avgList) {
      avgScores.set(s.id, parseFloat(s.score) || 0);
    }

    // Build draft picks lookup (franchise ID -> picks array)
    const picksList = picksData?.futureDraftPicks?.franchise || [];
    const picksMap = new Map<string, Array<{ year: string; round: string; originalOwner: string }>>();

    // Build franchise name lookup for pick original owners
    const franchiseList = leagueData?.league?.franchises?.franchise || [];
    const franchiseNameMap = new Map<string, string>();
    for (const f of franchiseList) {
      franchiseNameMap.set(f.id, f.name);
    }

    for (const franchise of picksList) {
      const fId = franchise.id;
      const rawPicks = franchise.futureDraftPick || [];
      const picks = (Array.isArray(rawPicks) ? rawPicks : [rawPicks]).map((pick: any) => ({
        year: pick.year,
        round: pick.round,
        originalOwner: franchiseNameMap.get(pick.originalPickFor) || pick.originalPickFor,
      }));
      picksMap.set(fId, picks);
    }

    // Build franchise rosters
    const rosterList = rostersData?.rosters?.franchise || [];

    const franchises = franchiseList.map((f: any) => {
      const rosterEntry = rosterList.find((r: any) => r.id === f.id);
      const rosterPlayers = rosterEntry?.player || [];
      const playerArr = Array.isArray(rosterPlayers) ? rosterPlayers : [rosterPlayers];

      const players = playerArr
        .map((rp: any) => {
          const playerId = rp.id;
          const info = playerMap.get(playerId);
          if (!info) return null;
          return {
            id: playerId,
            name: info.name,
            position: info.position,
            nflTeam: info.team,
            pointsYTD: ytdScores.get(playerId) || 0,
            pointsAVG: avgScores.get(playerId) || 0,
          };
        })
        .filter(Boolean);

      return {
        id: f.id,
        name: f.name,
        players,
        futurePicks: picksMap.get(f.id) || [],
      };
    });

    return NextResponse.json({ franchises });

  } catch (error: any) {
    console.error("Trade Data API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
