'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, DollarSign, XCircle } from 'lucide-react';

interface MMHPlayer {
  Player: string;
  Team: string;
  Position: string;
  Salary: string;
  Base: string;
  Years: string;
  Info: string;
  Acquired: string;
  IsTaxi: boolean;
  IsIR: boolean;
  Points: number | null;
}

// IR players are promoted to the active roster at season start, so they sort
// alongside their position group. Taxi squad always goes to the bottom.
const POSITION_ORDER: Record<string, number> = {
  QB: 0, RB: 1, WR: 2, TE: 3,
  PK: 4, K: 4,
  DE: 5, DT: 5, NT: 5,
  LB: 6,
  CB: 7, S: 7, DB: 7,
};

type KeepDecision = 'keep' | 'drop';

function calculateMMHKeeperStatus(player: MMHPlayer) {
  if (!player || !player.Player) return { eligible: false, cost: 0, reason: 'Invalid Data' };

  // Parse Money Values
  const currentSalary = parseFloat(player.Salary) || 0;
  const keeperBase = parseFloat(player.Base) || 0;

  // --- UPDATED YEARS LOGIC ---
  // If Years is blank/empty, they are on a fresh contract (3 years remaining)
  // Otherwise, it is Current Years - 1
  let yearsRemaining;
  let currentYears = 0;

  if (!player.Years || player.Years.trim() === '') {
    yearsRemaining = 3;
    currentYears = 4; // Arbitrary number > 0 to ensure eligibility check passes
  } else {
    currentYears = parseInt(player.Years);
    yearsRemaining = currentYears - 1;
  }

  // Determine Position for Minimums
  const isKicker = player.Position === 'K' || player.Position === 'PK';
  const minSalary = isKicker ? 3 : 5;

  // Determine Max Contract Length (Rookie Rule)
  const isDraftedRookie = /R\d{2}-\d/.test(player.Info) || /R\d{2}/.test(player.Info);
  const maxYears = isDraftedRookie ? 5 : 3;

  if (yearsRemaining <= 0 && currentYears > 0) {
    return {
      eligible: false, cost: 0, reason: 'Contract Expired', yearsRemaining: 0, isTaxi: player.IsTaxi, maxYears
    };
  }

  // Calculate New Salary
  let newCost = 0;
  if (player.IsTaxi) {
    newCost = currentSalary;
  } else {
    // (Higher of Base vs Salary) + 25%, rounded up
    const baseCalculation = Math.max(currentSalary, keeperBase);
    newCost = Math.ceil(baseCalculation * 1.25);
    if (newCost < minSalary) newCost = minSalary;
  }

  return {
    eligible: true,
    cost: newCost,
    reason: null,
    yearsRemaining: Math.max(0, yearsRemaining),
    isDraftedRookie,
    isTaxi: player.IsTaxi,
    maxYears
  };
}

// --- HELPER FOR ROOKIE TEXT ---
function getRookieLabel(info: string, acquired: string) {
  if (info.includes('R25')) {
    return `2025 Rookie Draft ${acquired}`;
  }
  if (info.includes('R24')) {
    return `2024 Rookie Draft`;
  }
  return 'Rookie Contract';
}

// --- STATS CALCULATION HELPER ---
function getTeamStats(teamPlayers: any[], decisions: Record<string, KeepDecision>) {
  const SALARY_CAP = 1200;

  // 1. Current Payroll (Sum of Salary, excluding Taxi)
  const currentPayroll = teamPlayers.reduce((sum: number, p: any) => {
    return p.status.isTaxi ? sum : sum + (parseFloat(p.Salary) || 0);
  }, 0);

  // 2. 2026 Projected (Sum of 2026 Cost for eligible players marked Keep)
  const projectedPayroll = teamPlayers.reduce((sum: number, p: any) => {
    if (p.status.isTaxi || !p.status.eligible) return sum;
    const key = `${p.Team}-${p.Player}`;
    const decision = decisions[key] ?? 'keep'; // default: keep all eligible players
    if (decision === 'drop') return sum;
    return sum + p.status.cost;
  }, 0);

  return {
    cap: SALARY_CAP,
    currentPayroll,
    currentSpace: SALARY_CAP - currentPayroll,
    projectedPayroll,
    projectedSpace: SALARY_CAP - projectedPayroll
  };
}

export default function MMHKeeperApp() {
  const [players, setPlayers] = useState<MMHPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [keepDecisions, setKeepDecisions] = useState<Record<string, KeepDecision>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/mmh-league-data');
        if (!response.ok) throw new Error('Failed to fetch MMH data');
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
        status: calculateMMHKeeperStatus(player)
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
    <div style={{ minHeight: '100vh', background: 'var(--kn-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--kn-mmh)', fontFamily: 'var(--font-mono)' }}>
      <div className="animate-pulse">Initializing MMH Salary Protocols...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--kn-bg)', color: 'var(--kn-danger)', padding: '2rem', fontFamily: 'var(--font-mono)' }}>Error: {error}</div>
  );

  return (
    <div className="app-container">
      <style jsx global>{`
        body { background-color: var(--kn-bg); color: var(--kn-text); font-family: var(--font-body); margin: 0; }
        .font-mono { font-family: var(--font-mono); }

        /* Layout */
        .app-container { min-height: 100vh; }
        .max-w-7xl { max-width: 80rem; margin: 0 auto; padding: 0 1.5rem; }

        /* Header */
        header { border-bottom: 1px solid var(--kn-line); background: rgba(10, 10, 15, 0.82); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
        .header-content { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 0; }

        /* Inputs */
        .controls { display: flex; gap: 1rem; margin: 2rem 0; flex-wrap: wrap; }
        input, select { background: var(--kn-surface-3); border: 1px solid var(--kn-line); color: var(--kn-text); padding: 0.75rem 1rem; border-radius: var(--r-md); font-family: var(--font-mono); }
        input:focus, select:focus { border-color: var(--kn-mmh); outline: none; }
        input { flex: 1; min-width: 300px; }

        /* Cards */
        .team-card { background: var(--kn-surface); border: 1px solid var(--kn-line); border-radius: var(--r-lg); overflow: hidden; margin-bottom: 2rem; box-shadow: var(--shadow-md); }
        .card-header { padding: 1.5rem; background: var(--kn-bg); border-bottom: 1px solid var(--kn-line); border-left: 4px solid var(--kn-mmh); }

        /* Financial Dashboard in Header */
        .financial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .stat-box { background: var(--kn-surface-3); border: 1px solid var(--kn-line); padding: 0.75rem; border-radius: var(--r-md); text-align: center; }
        .stat-label { font-size: 0.7rem; color: var(--kn-text-mute); text-transform: uppercase; margin-bottom: 0.25rem; font-weight: 700; }
        .stat-value { font-family: var(--font-mono); font-weight: 700; font-size: 1.1rem; }

        /* Table */
        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 0.75rem 1.5rem; font-size: 0.75rem; color: var(--kn-text-mute); text-transform: uppercase; background: rgba(6, 6, 12, 0.5); font-family: var(--font-display); letter-spacing: 0.06em; }
        td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--kn-line); vertical-align: middle; }
        tr:last-child td { border-bottom: none; }

        /* Colors & Status */
        .text-emerald { color: var(--kn-mmh); }
        .text-zinc { color: var(--kn-text-mute); }
        .text-red { color: var(--kn-danger); }
        .badge-taxi { background: rgba(255, 176, 32, 0.1); color: var(--kn-warning); padding: 2px 6px; border-radius: var(--r-sm); font-size: 0.75rem; margin-right: 8px; font-family: var(--font-mono); }
        .badge-rookie { color: var(--kn-cyan); font-size: 0.75rem; font-family: var(--font-mono); }

        .cost-display { font-size: 1.125rem; font-weight: 700; font-family: var(--font-mono); color: var(--kn-mmh); }
        .ineligible-row { opacity: 0.4; filter: grayscale(100%); }
        .dropped-row { opacity: 0.55; }
        .dropped-row .cost-display { color: var(--kn-text-mute); text-decoration: line-through; }

        /* Decision dropdown */
        .decision-select { padding: 4px 8px; border-radius: var(--r-sm); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: background 0.15s, color 0.15s; }
        .decision-keep { background: rgba(45, 227, 138, 0.1); color: var(--kn-mmh); border: 1px solid rgba(45, 227, 138, 0.25); }
        .decision-drop { background: rgba(255, 77, 77, 0.1); color: var(--kn-danger); border: 1px solid rgba(255, 77, 77, 0.25); }
      `}</style>

      <header>
        <div className="max-w-7xl">
          <div style={{ padding: '1rem 0' }}>
            <Link href="/" style={{ color: 'var(--kn-mmh)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>← RETURN TO HUB</Link>
            <div className="header-content">
              <DollarSign size={32} color="var(--kn-mmh)" />
              <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--kn-text)', fontFamily: 'var(--font-display)' }}>MMH <span className="text-emerald">SALARY CAP</span></h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl" style={{ paddingBottom: '4rem' }}>
        <div className="controls">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--kn-text-mute)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search player database..." style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="all">ALL FRANCHISES</option>
            {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>

        {filteredTeams.map((team: any) => {
          const stats = getTeamStats(team.players, keepDecisions);

          // IR players are treated as active roster — sort all non-taxi players
          // by position, then append taxi squad at the bottom.
          const sortedPlayers = [...team.players].sort((a: any, b: any) => {
            if (a.IsTaxi !== b.IsTaxi) return a.IsTaxi ? 1 : -1;
            const posA = POSITION_ORDER[a.Position] ?? 99;
            const posB = POSITION_ORDER[b.Position] ?? 99;
            return posA - posB;
          });

          return (
            <div key={team.name} className="team-card">
              <div className="card-header">
                <div style={{ marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{team.name}</h2>
                </div>

                {/* Financial Dashboard */}
                <div className="financial-grid">
                   <div className="stat-box">
                      <div className="stat-label">Salary Cap</div>
                      <div className="stat-value text-emerald">${stats.cap}</div>
                   </div>

                   <div className="stat-box">
                      <div className="stat-label">Current Payroll</div>
                      <div className="stat-value text-zinc">${stats.currentPayroll}</div>
                   </div>

                   <div className="stat-box">
                      <div className="stat-label">Current Space</div>
                      <div className={`stat-value ${stats.currentSpace < 0 ? 'text-red' : 'text-emerald'}`}>
                        ${stats.currentSpace}
                      </div>
                   </div>

                   <div className="stat-box">
                      <div className="stat-label">2026 Keeper Cost</div>
                      <div className="stat-value" style={{ color: 'var(--kn-violet)' }}>${stats.projectedPayroll}</div>
                   </div>

                   <div className="stat-box">
                      <div className="stat-label">2026 Space</div>
                      <div className={`stat-value ${stats.projectedSpace < 0 ? 'text-red' : 'text-emerald'}`}>
                        ${stats.projectedSpace}
                      </div>
                   </div>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>2025 Pts</th>
                      <th>Current Sal</th>
                      <th>Base</th>
                      <th>2026 Cost</th>
                      <th>Contract</th>
                      <th>Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((p: any, i: number) => {
                      const decisionKey = `${p.Team}-${p.Player}`;
                      const decision = keepDecisions[decisionKey] ?? 'keep';
                      const isDropped = p.status.eligible && decision === 'drop';

                      return (
                        <tr
                          key={i}
                          className={
                            !p.status.eligible
                              ? 'ineligible-row'
                              : isDropped
                              ? 'dropped-row'
                              : ''
                          }
                        >
                          <td>
                            <div style={{ fontWeight: 500 }}>{p.Player}</div>
                            <div style={{ marginTop: '4px' }}>
                              {p.status.isTaxi && <span className="badge-taxi">TAXI</span>}
                              {p.status.isDraftedRookie && (
                                <span className="badge-rookie">
                                  {getRookieLabel(p.Info, p.Acquired)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="font-mono" style={{ fontWeight: 700, color: 'var(--kn-warning)' }}>
                            {p.Points != null
                              ? p.Points.toFixed(1)
                              : <span style={{ color: 'var(--kn-text-faint)' }}>—</span>
                            }
                          </td>
                          <td className="font-mono text-zinc">${p.Salary}</td>
                          <td className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--kn-text-mute)' }}>
                            {p.Base && parseFloat(p.Base) > 0 ? `$${p.Base}` : <span style={{ color: 'var(--kn-text-faint)' }}>—</span>}
                          </td>
                          <td>
                            {p.status.eligible ? (
                              <div className="cost-display">${p.status.cost}</div>
                            ) : (
                              <span style={{ color: 'var(--kn-text-faint)' }}>—</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="font-mono" style={{ color: p.status.yearsRemaining === 1 ? 'var(--kn-danger)' : 'var(--kn-text-dim)', fontWeight: 700 }}>
                                {p.status.yearsRemaining} Yrs
                              </span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--kn-text-faint)', textTransform: 'uppercase' }}>Max: {p.status.maxYears}</span>
                            </div>
                          </td>
                          <td>
                            {p.status.eligible ? (
                              <select
                                className={`decision-select ${decision === 'drop' ? 'decision-drop' : 'decision-keep'}`}
                                value={decision}
                                onChange={(e) => {
                                  const val = e.target.value as KeepDecision;
                                  setKeepDecisions(prev => ({ ...prev, [decisionKey]: val }));
                                }}
                              >
                                <option value="keep">Keep</option>
                                <option value="drop">Drop</option>
                              </select>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--kn-danger)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                <XCircle size={16} /> {p.status.reason}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
