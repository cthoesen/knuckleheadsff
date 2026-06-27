'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, Flame, XCircle, CheckCircle } from 'lucide-react';

interface BSBPlayer {
  Player: string;
  Team: string;
  Years: string;
  Acquired: string; // e.g. "21.15"
  IsTaxi: boolean;
}

function calculateBSBKeeperStatus(player: BSBPlayer) {
  if (!player || !player.Player) return { eligible: false, cost: '', reason: 'Invalid Data' };

  // 1. Parse Acquired Round
  if (!player.Acquired || player.Acquired.trim() === '') {
    return {
      eligible: false,
      cost: '—',
      reason: 'Undrafted / Free Agent',
      yearsRemaining: 0,
      nextRound: null
    };
  }

  let acquiredRound = 0;
  const roundMatch = player.Acquired.match(/^(\d+)\./);
  if (roundMatch) {
    acquiredRound = parseInt(roundMatch[1]);
  } else {
    return {
      eligible: false,
      cost: '—',
      reason: 'Invalid Draft Data',
      yearsRemaining: 0,
      nextRound: null
    };
  }

  // 2. Rule: Rounds 1-5 Ineligible
  if (acquiredRound > 0 && acquiredRound <= 5) {
    return {
      eligible: false,
      cost: '—',
      reason: 'Drafted Rd 1-5',
      yearsRemaining: 0,
      nextRound: null
    };
  }

  // 3. Calculate Years Remaining & Identifier
  let yearsRemaining;
  let currentYearsDisplay; // 'Fresh', '3', '2', or '1'

  if (!player.Years || player.Years.trim() === '') {
    yearsRemaining = 3;
    currentYearsDisplay = 'Fresh';
  } else {
    const y = parseInt(player.Years);
    yearsRemaining = y - 1;
    currentYearsDisplay = y.toString();
  }

  // If Years reaches 0 (Current Years was 1), they expire
  if (yearsRemaining <= 0) {
    return {
      eligible: false,
      cost: '—',
      reason: 'Contract Expired',
      yearsRemaining: 0,
      nextRound: null
    };
  }

  // 4. Calculate Next Round Cost (The Accelerator)
  let nextRound = acquiredRound;

  if (player.IsTaxi) {
    // Taxi Rule: Retain draft slot (No penalty)
    nextRound = acquiredRound;
  } else {
    // Accelerator Logic:
    if (currentYearsDisplay === 'Fresh') {
      nextRound = acquiredRound - 2;
    } else if (currentYearsDisplay === '3') {
      nextRound = acquiredRound - 3;
    } else if (currentYearsDisplay === '2') {
      nextRound = acquiredRound - 4;
    }
  }

  // Floor Rule: Cannot go below Round 1
  if (nextRound < 1) nextRound = 1;

  return {
    eligible: true,
    cost: `Rd ${nextRound}`,
    nextRound: nextRound,
    reason: null,
    yearsRemaining,
    isTaxi: player.IsTaxi
  };
}

export default function BSBKeeperApp() {
  const [players, setPlayers] = useState<BSBPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/bsb-league-data');
        if (!response.ok) throw new Error('Failed to fetch BSB data');
        const data = await response.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const teams = useMemo(() => {
    const teamMap = new Map();
    players.forEach(player => {
      if (!teamMap.has(player.Team)) {
        teamMap.set(player.Team, { name: player.Team, players: [] });
      }
      teamMap.get(player.Team).players.push({
        ...player,
        status: calculateBSBKeeperStatus(player)
      });
    });
    return Array.from(teamMap.values());
  }, [players]);

  const filteredTeams = useMemo(() => {
    let result = teams;
    if (selectedTeam !== 'all') result = result.filter(t => t.name === selectedTeam);
    if (searchTerm) {
      result = result.map(t => ({
        ...t,
        players: t.players.filter((p: any) => p.Player.toLowerCase().includes(searchTerm.toLowerCase()))
      })).filter(t => t.players.length > 0);
    }
    return result;
  }, [teams, selectedTeam, searchTerm]);

  if (isLoading) return (
    <div className="loading-screen">
      <div className="animate-pulse">Loading BSB Roster Data...</div>
      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--kn-bg);
          color: var(--kn-bsb);
          font-family: var(--font-mono);
          font-weight: bold;
        }
      `}</style>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      Error: {error}
      <style jsx>{`
        .error-screen {
          min-height: 100vh;
          background-color: var(--kn-bg);
          color: var(--kn-danger);
          padding: 2.5rem;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );

  return (
    <div className="app-container">
      <style jsx global>{`
        body { background-color: var(--kn-bg); color: var(--kn-text); font-family: var(--font-body); margin: 0; }

        /* Layout */
        .app-container { min-height: 100vh; padding-bottom: 4rem; }
        .max-w-7xl { max-width: 80rem; margin: 0 auto; padding: 0 1.5rem; }

        /* Header */
        header { border-bottom: 1px solid var(--kn-line); background: rgba(10, 10, 15, 0.82); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
        .header-content { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; }
        .league-title { font-family: var(--font-display); font-weight: 900; font-size: 2rem; color: var(--kn-bsb); letter-spacing: 0.05em; text-transform: uppercase; text-shadow: 0 0 14px rgba(var(--glow-pink), 0.5); }

        /* Inputs */
        .controls { display: flex; gap: 1rem; margin: 2rem 0; flex-wrap: wrap; }
        input, select { background: var(--kn-surface-3); border: 1px solid var(--kn-line); color: var(--kn-text); padding: 0.75rem 1rem; border-radius: var(--r-md); font-family: var(--font-mono); }
        input:focus, select:focus { border-color: var(--kn-bsb); outline: none; }
        input { flex: 1; min-width: 300px; }

        /* Cards */
        .team-card { background: var(--kn-surface); border: 1px solid var(--kn-line); border-radius: var(--r-lg); overflow: hidden; margin-bottom: 2rem; box-shadow: var(--shadow-md); }
        .card-header { padding: 1rem 1.5rem; background: var(--kn-bg); border-bottom: 1px solid var(--kn-line); border-left: 4px solid var(--kn-bsb); }

        /* Table */
        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 0.75rem 1.5rem; font-size: 0.75rem; color: var(--kn-text-mute); text-transform: uppercase; background: rgba(6, 6, 12, 0.5); font-family: var(--font-display); letter-spacing: 0.06em; }
        td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--kn-line); vertical-align: middle; }
        tr:last-child td { border-bottom: none; }

        /* Colors & Status */
        .text-rose { color: var(--kn-bsb); }
        .text-zinc { color: var(--kn-text-mute); }
        .text-blue { color: #0ea5e9; } /* functional accent, not brand — left as-is */
        .badge-taxi { background: rgba(var(--glow-pink), 0.1); color: var(--kn-bsb); padding: 2px 8px; border-radius: var(--r-sm); font-size: 0.75rem; border: 1px solid rgba(var(--glow-pink), 0.3); font-family: var(--font-mono); }

        .round-display { font-size: 1.25rem; font-weight: 700; color: #0ea5e9; font-family: var(--font-mono); } /* functional accent, not brand */
        .ineligible-row { opacity: 0.4; filter: grayscale(100%); }
      `}</style>

      <header>
        <div className="max-w-7xl">
          <div style={{ padding: '0.5rem 0' }}>
            <Link href="/" style={{ color: 'var(--kn-bsb)', fontSize: '0.75rem', textDecoration: 'none', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>← RETURN TO HUB</Link>
            <div className="header-content">
              <Flame size={32} color="var(--kn-bsb)" />
              <div className="league-title">BLOOD, SWEAT & BEERS</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl">
        <div className="controls">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search BSB roster..." style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="all">ALL FRANCHISES</option>
            {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>

        {filteredTeams.map((team: any) => (
          <div key={team.name} className="team-card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'white' }}>{team.name}</h2>
              </div>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Acquired</th>
                    <th>Current Years</th>
                    <th>2026 Cost</th>
                    <th>2026 Years</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((p: any, i: number) => (
                    <tr key={i} className={!p.status.eligible ? 'ineligible-row' : ''}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.Player}</div>
                        {p.status.isTaxi && <div style={{ marginTop: '4px' }}><span className="badge-taxi">TAXI SQUAD</span></div>}
                      </td>
                      <td className="text-zinc">{p.Acquired || 'Free Agent'}</td>
                      {/* UPDATED: Shows '-' instead of Blank */}
                      <td className="text-zinc">{p.Years || '-'}</td> 
                      <td>
                        {p.status.eligible ? (
                          <div className="round-display">{p.status.cost}</div>
                        ) : (
                          <span style={{ color: '#52525b' }}>—</span>
                        )}
                      </td>
                      <td>
                        {p.status.eligible ? (
                          <span style={{ color: 'white', fontWeight: 700 }}>
                            {p.status.yearsRemaining}
                          </span>
                        ) : (
                          <span style={{ color: '#52525b' }}>0</span>
                        )}
                      </td>
                      <td>
                        {p.status.eligible ? (
                          /* UPDATED: Green Checkmark for Eligible */
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e' }}>
                            <CheckCircle size={20} />
                          </div>
                        ) : (
                          /* Red X for Ineligible */
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                            <XCircle size={16} /> {p.status.reason}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}