import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

interface RosterRow {
  Player: string;
  Years?: string;
  Acquired?: string;
  [key: string]: string | undefined;
}

interface ProcessedPlayer {
  Team: string;
  Owner: string;
  Player: string;
  Years: string;
  Acquired: string;
  IsTaxi: boolean;
}

// Parse HTML table into structured data
function parseHTMLTable(html: string): { teamName: string; rows: RosterRow[] }[] {
  const $ = cheerio.load(html);
  const teams: { teamName: string; rows: RosterRow[] }[] = [];
  
  $('table').each((tableIndex, table) => {
    const caption = $(table).find('caption');
    if (caption.length === 0) return;
    
    // Extract team name from caption
    const teamLink = caption.find('a').first();
    const teamName = teamLink.text().trim() || 'Unknown Team';
    
    // Extract table headers
    const headers: string[] = [];
    $(table).find('thead th, tr:first th').each((i, th) => {
      headers.push($(th).text().trim());
    });
    
    if (headers.length === 0) {
      $(table).find('tr').first().find('th, td').each((i, cell) => {
        headers.push($(cell).text().trim());
      });
    }
    
    // Extract rows
    const rows: RosterRow[] = [];
    let isTaxiSection = false;
    
    $(table).find('tr').each((i, tr) => {
      // Check for Taxi Squad header
      const headerCell = $(tr).find('th');
      if (headerCell.length > 0 && headerCell.text().includes('Taxi Squad')) {
        isTaxiSection = true;
        return;
      }
      
      // Skip header rows
      if ($(tr).find('th').length > 0) return;
      
      const cells = $(tr).find('td');
      if (cells.length === 0) return;
      
      const row: any = { IsTaxi: isTaxiSection };
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

// Process BSB roster data
function processTeamRoster(teamData: RosterRow[], teamName: string): ProcessedPlayer[] {
  const results: ProcessedPlayer[] = [];
  
  for (const row of teamData) {
    if (!row.Player || row.Player.includes('Player')) continue;
    
    results.push({
      Team: teamName,
      Owner: teamName, // Team name is the owner for display purposes
      Player: row.Player.trim(),
      Years: row.Years?.trim() || '',
      Acquired: row.Acquired?.trim() || '',
      IsTaxi: (row as any).IsTaxi || false
    });
  }
  
  return results;
}

export async function GET() {
  const MFL_URL = "https://www47.myfantasyleague.com/2025/options?L=62908&O=07&PRINTER=1";
  
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
    const allTeams = parseHTMLTable(htmlText);
    const bsbTeams = allTeams.slice(0, 12);
    
    const allPlayers: ProcessedPlayer[] = [];
    for (const team of bsbTeams) {
      const processedRoster = processTeamRoster(team.rows, team.teamName);
      allPlayers.push(...processedRoster);
    }
    
    return NextResponse.json(allPlayers);
    
  } catch (error: any) {
    console.error("BSB API Route Error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
