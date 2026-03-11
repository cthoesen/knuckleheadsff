import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

interface RosterRow {
  Player: string;
  Position?: string;
  Status?: string;
  Bye?: string;
  '2024 Pts'?: string; // Dynamic column - year changes
  Years?: string;
  Keeper?: string;
  Acquired?: string;
}

interface ProcessedPlayer {
  Team: string;
  Player: string;
  'PY Status': string | null;
  'PY Points': number;
  'PY Years': string;
  'PY Keeper Status': string;
  'PY Acquired': string;
  'New Keeper Years': string | number;
  'New Keeper Round': string;
}

// Mimics fxGetRosterData function from Power Query
function processTeamRoster(teamData: RosterRow[], teamName: string): ProcessedPlayer[] {
  try {
    const results: ProcessedPlayer[] = [];
    
    for (const row of teamData) {
      // Skip header rows or empty rows
      if (!row.Player || row.Player.includes('Player')) continue;
      
      // 1. Find dynamic points column (any column with "Pts")
      const pointsKey = Object.keys(row).find(k => k.includes('Pts'));
      let pyPoints = pointsKey ? row[pointsKey as keyof RosterRow] : '0';
      
      // Replace dashes with 0
      pyPoints = pyPoints === '‐' || pyPoints === '-' || !pyPoints ? '0' : pyPoints;
      
      // 2. Split player name by parentheses to extract rookie status
      const playerMatch = row.Player.match(/^(.+?)\s*\(([^)]*)\)?/);
      const playerName = playerMatch ? playerMatch[1].trim() : row.Player.trim();
      const statusCode = playerMatch ? playerMatch[2] : null;
      const isRookie = statusCode === 'R';
      
      // 3. Parse Acquired and Years
      const acquired = row.Acquired?.trim();
      const years = row.Years?.trim();
      
      // Acquired Step 1: If null, default to 12
      const acquiredStep1 = acquired ? Math.floor(parseFloat(acquired)) : 12;
      
      // Years Step 1: If null, default to 3, else subtract 1
      const yearsStep1 = years ? parseFloat(years) - 1 : 3;
      
      // 4. Calculate New Keeper Years
      let newKeeperYears: string | number;
      if (yearsStep1 === 0) {
        newKeeperYears = 'NA';
      } else if (acquiredStep1 <= 3) {
        newKeeperYears = 'NA'; // Rounds 1-3 ineligible
      } else {
        newKeeperYears = yearsStep1;
      }
      
      // 5. Calculate Acquired Step 2 (New Keeper Round number)
      let acquiredStep2: number | string;
      if (newKeeperYears === 'NA') {
        acquiredStep2 = 'NA';
      } else if (isRookie) {
        acquiredStep2 = acquiredStep1; // Rookies stay in same round
      } else if (!acquired) {
        acquiredStep2 = acquiredStep1; // Undrafted/FA = 12
      } else {
        acquiredStep2 = acquiredStep1 - 2; // Regular players move up 2 rounds
      }
      
      // 6. Calculate New Keeper Round (formatted)
      const newKeeperRound = acquiredStep2 === 'NA' ? 'NA' : `K${acquiredStep2}`;
      
      // 7. Determine PY Status
      const pyStatus = isRookie ? 'Rookie' : null;
      
      results.push({
        Team: teamName,
        Player: playerName,
        'PY Status': pyStatus,
        'PY Points': parseFloat(pyPoints) || 0,
        'PY Years': years || '',
        'PY Keeper Status': row.Keeper || '',
        'PY Acquired': acquired || '',
        'New Keeper Years': newKeeperYears,
        'New Keeper Round': newKeeperRound
      });
    }
    
    // Sort by Acquired (keeper round) ascending
    return results.sort((a, b) => {
      const aRound = a['New Keeper Round'] === 'NA' ? 999 : parseInt(a['New Keeper Round'].substring(1));
      const bRound = b['New Keeper Round'] === 'NA' ? 999 : parseInt(b['New Keeper Round'].substring(1));
      return aRound - bRound;
    });
    
  } catch (error) {
    console.error(`Error processing team ${teamName}:`, error);
    return [{
      Team: teamName,
      Player: '** ERROR OR EMPTY ROSTER **',
      'PY Status': null,
      'PY Points': 0,
      'PY Years': '',
      'PY Keeper Status': '',
      'PY Acquired': '',
      'New Keeper Years': 'NA',
      'New Keeper Round': 'NA'
    }];
  }
}

// Parse HTML table into structured data (mimics Web.Page)
function parseHTMLTable(html: string): { teamName: string; rows: RosterRow[] }[] {
  const $ = cheerio.load(html);
  const teams: { teamName: string; rows: RosterRow[] }[] = [];
  
  // Find all tables with captions (team tables)
  $('table').each((tableIndex, table) => {
    const caption = $(table).find('caption');
    if (caption.length === 0) return; // Skip tables without captions
    
    // Extract team name from caption
    const teamLink = caption.find('a').first();
    const teamName = teamLink.text().trim() || 'Unknown Team';
    
    // Extract table headers
    const headers: string[] = [];
    $(table).find('thead th, tr:first th').each((i, th) => {
      headers.push($(th).text().trim());
    });
    
    // If no headers in thead, try first row
    if (headers.length === 0) {
      $(table).find('tr').first().find('th, td').each((i, cell) => {
        headers.push($(cell).text().trim());
      });
    }
    
    // Extract rows
    const rows: RosterRow[] = [];
    $(table).find('tbody tr, tr').each((i, tr) => {
      // Skip if it's the header row
      if ($(tr).find('th').length > 0) return;
      
      const cells = $(tr).find('td');
      if (cells.length === 0) return;
      
      const row: any = {};
      cells.each((cellIndex, td) => {
        const headerName = headers[cellIndex] || `Column${cellIndex}`;
        row[headerName] = $(td).text().trim();
      });
      
      if (row.Player) {
        rows.push(row as RosterRow);
      }
    });
    
    if (rows.length > 0) {
      teams.push({ teamName, rows });
    }
  });
  
  return teams;
}

export async function GET() {
  const MFL_URL = "https://www47.myfantasyleague.com/2025/options?L=45267&O=07&PRINTER=1";
  
  try {
    const response = await fetch(MFL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch MFL data" }, { status: 500 });
    }
    
    const htmlText = await response.text();
    
    // Parse HTML into structured tables (mimics Web.Page)
    const allTeams = parseHTMLTable(htmlText);
    
    // Keep only tables 1-12 (the 12 KKL franchises)
    const kklTeams = allTeams.slice(0, 12);
    
    // Process each team's roster (mimics fxGetRosterData invocation)
    const allPlayers: ProcessedPlayer[] = [];
    for (const team of kklTeams) {
      const processedRoster = processTeamRoster(team.rows, team.teamName);
      allPlayers.push(...processedRoster);
    }
    
    return NextResponse.json(allPlayers);
    
  } catch (error: any) {
    console.error("KKL API Route Error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
