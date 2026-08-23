'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, XCircle } from 'lucide-react';
import { ToolHeader } from '../components/kff/ToolHeader';
import { Stat } from '../components/kff/Stat';
import { Input } from '../components/kff/Input';
import { Badge } from '../components/kff/Badge';

interface MMHPlayer {
  name: string;
  nflTeam: string;
  franchise: string;
  position: string;
  salary: number;
  /** MFL contractStatus, e.g. "$24" — the league's "Base" column. */
  contractStatus: string;
  contractYear: number;
  contractInfo: string;
  acquired: string;
  isTaxi: boolean;
  isIR: boolean;
  points: number | null;
}

/** MFL returns contractStatus as a display string ("$24"); pull the number out. */
function baseOf(player: { contractStatus?: string }): number {
  return parseFloat(String(player.contractStatus ?? '').replace(/[^0-9.]/g, '')) || 0;
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
  if (!player || !player.name) return { eligible: false, cost: 0, reason: 'Invalid Data' };

  const currentSalary = player.salary || 0;
  const keeperBase = baseOf(player);

  let yearsRemaining;
  let currentYears = 0;

  if (!player.contractYear) {
    yearsRemaining = 3;
    currentYears = 4;
  } else {
    currentYears = player.contractYear;
    yearsRemaining = currentYears - 1;
  }

  const isKicker = player.position === 'K' || player.position === 'PK';
  const minSalary = isKicker ? 3 : 5;

  const isDraftedRookie = /R\d{2}-\d/.test(player.contractInfo) || /R\d{2}/.test(player.contractInfo);
  const maxYears = isDraftedRookie ? 5 : 3;

  if (yearsRemaining <= 0 && currentYears > 0) {
    return { eligible: false, cost: 0, reason: 'Contract Expired', yearsRemaining: 0, isTaxi: player.isTaxi, maxYears };
  }

  let newCost = 0;
  if (player.isTaxi) {
    newCost = currentSalary;
  } else {
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
    isTaxi: player.isTaxi,
    maxYears,
  };
}

function getRookieLabel(info: string, acquired: string) {
  if (info.includes('R25')) return `2025 Rookie Draft ${acquired}`;
  if (info.includes('R24')) return `2024 Rookie Draft`;
  return 'Rookie Contract';
}

function getTeamStats(teamPlayers: any[], decisions: Record<string, KeepDecision>) {
  const SALARY_CAP = 1200;

  const currentPayroll = teamPlayers.reduce((sum: number, p: any) => {
    return p.status.isTaxi ? sum : sum + (p.salary || 0);
  }, 0);

  const projectedPayroll = teamPlayers.reduce((sum: number, p: any) => {
    if (p.status.isTaxi || !p.status.eligible) return sum;
    const key = `${p.franchise}-${p.name}`;
    const decision = decisions[key] ?? 'keep';
    if (decision === 'drop') return sum;
    return sum + p.status.cost;
  }, 0);

  return {
    cap: SALARY_CAP,
    currentPayroll,
    currentSpace: SALARY_CAP - currentPayroll,
    projectedPayroll,
    projectedSpace: SALARY_CAP - projectedPayroll,
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
        if (data.error) throw new Error(data.error);
        setPlayers(data.players ?? []);
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
    players.forEach((player) => {
      if (!teamMap.has(player.franchise)) {
        teamMap.set(player.franchise, { name: player.franchise, players: [] });
      }
      teamMap.get(player.franchise).players.push({ ...player, status: calculateMMHKeeperStatus(player) });
    });
    return Array.from(teamMap.values());
  }, [players]);

  const filteredTeams = useMemo(() => {
    let result = teams;
    if (selectedTeam !== 'all') result = result.filter((t) => t.name === selectedTeam);
    if (searchTerm) {
      result = result
        .map((t) => ({ ...t, players: t.players.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase())) }))
        .filter((t) => t.players.length > 0);
    }
    return result;
  }, [teams, selectedTeam, searchTerm]);

  if (isLoading) return (
    <div className="league-mmh" style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--league-color)', fontFamily: 'var(--font-mono)' }}>
      <div className="animate-pulse">Initializing MMH salary protocols...</div>
    </div>
  );

  if (error) return (
    <div className="league-mmh" style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--kff-red)', padding: '2rem', fontFamily: 'var(--font-mono)' }}>Error: {error}</div>
  );

  return (
    <div className="league-mmh" style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 'var(--space-9)' }}>
      <style jsx>{`
        .kff-table { width: 100%; border-collapse: collapse; text-align: left; }
        .kff-table th { padding: 0.7rem 1.25rem; font-family: var(--font-pixel); font-size: var(--pixel-2xs); color: var(--kff-ink-mute); text-transform: uppercase; letter-spacing: 0.04em; background: color-mix(in srgb, var(--kff-void) 50%, transparent); white-space: nowrap; }
        .kff-table td { padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--kff-line); vertical-align: middle; font-family: var(--font-body); }
        .kff-table tr:last-child td { border-bottom: none; }
        .mono { font-family: var(--font-mono); }
        .ineligible-row { opacity: 0.4; filter: grayscale(100%); }
        .dropped-row { opacity: 0.55; }
        .dropped-row .cost-display { color: var(--kff-ink-mute); text-decoration: line-through; }
        .cost-display { font-family: var(--font-mono); font-weight: 700; font-size: var(--text-lg); color: var(--league-color); }
        .decision-select { padding: 5px 9px; border-radius: var(--radius-sm); font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer; }
        .decision-keep { background: color-mix(in srgb, var(--league-color) 12%, transparent); color: var(--league-color); border: 1px solid color-mix(in srgb, var(--league-color) 40%, transparent); }
        .decision-drop { background: color-mix(in srgb, var(--kff-red) 12%, transparent); color: var(--kff-red); border: 1px solid color-mix(in srgb, var(--kff-red) 40%, transparent); }
        .team-select { background: var(--surface-inset); border: 1px solid var(--kff-line-2); color: var(--kff-ink); padding: 11px 13px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: var(--text-sm); cursor: pointer; min-width: 220px; }
        .team-select:focus { outline: none; border-color: var(--league-color); }
      `}</style>

      <ToolHeader code="MMH" kicker="MMH · COMMISSIONER TOOL" title="Salary Cap Manager" backHref="/mmh" backLabel="MMH Hub" />

      <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: '0 var(--space-6)' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', margin: 'var(--space-6) 0' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <Input
              prefix={<Search size={16} />}
              placeholder="Search player database..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="team-select" onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="all">ALL FRANCHISES</option>
            {teams.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>

        {filteredTeams.map((team: any) => {
          const stats = getTeamStats(team.players, keepDecisions);
          const sortedPlayers = [...team.players].sort((a: any, b: any) => {
            if (a.isTaxi !== b.isTaxi) return a.isTaxi ? 1 : -1;
            const posA = POSITION_ORDER[a.position] ?? 99;
            const posB = POSITION_ORDER[b.position] ?? 99;
            return posA - posB;
          });

          return (
            <div
              key={team.name}
              style={{ background: 'var(--surface-card)', border: '1px solid var(--kff-line)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-6)', boxShadow: 'var(--shadow-2)' }}
            >
              {/* Team header + financial dashboard */}
              <div style={{ padding: 'var(--space-5)', background: 'var(--surface-inset)', borderBottom: '1px solid var(--kff-line)', borderLeft: '4px solid var(--league-color)' }}>
                <h2 style={{ margin: '0 0 var(--space-4)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--kff-ink)' }}>
                  {team.name}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-5)' }}>
                  <Stat label="Salary Cap" value={`$${stats.cap}`} tone="league" />
                  <Stat label="Current Payroll" value={`$${stats.currentPayroll}`} tone="ink" />
                  <Stat label="Current Space" value={`$${stats.currentSpace}`} tone={stats.currentSpace < 0 ? 'red' : 'green'} />
                  <Stat label="2026 Keeper Cost" value={`$${stats.projectedPayroll}`} tone="violet" />
                  <Stat label="2026 Space" value={`$${stats.projectedSpace}`} tone={stats.projectedSpace < 0 ? 'red' : 'green'} />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="kff-table">
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
                      const decisionKey = `${p.franchise}-${p.name}`;
                      const decision = keepDecisions[decisionKey] ?? 'keep';
                      const isDropped = p.status.eligible && decision === 'drop';

                      return (
                        <tr key={i} className={!p.status.eligible ? 'ineligible-row' : isDropped ? 'dropped-row' : ''}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--kff-ink)' }}>{p.name} <span style={{ color: 'var(--kff-ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{p.position} {p.nflTeam}</span></div>
                            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              {p.status.isTaxi && <Badge tone="yellow" variant="outline">Taxi</Badge>}
                              {p.status.isDraftedRookie && (
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--kff-azure)' }}>
                                  {getRookieLabel(p.contractInfo, p.acquired)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="mono" style={{ fontWeight: 700, color: 'var(--kff-yellow)' }}>
                            {p.points != null ? p.points.toFixed(1) : <span style={{ color: 'var(--kff-ink-mute)' }}>—</span>}
                          </td>
                          <td className="mono" style={{ color: 'var(--kff-ink-dim)' }}>${p.salary}</td>
                          <td className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--kff-ink-mute)' }}>
                            {baseOf(p) > 0 ? `$${baseOf(p)}` : <span style={{ color: 'var(--kff-ink-mute)' }}>—</span>}
                          </td>
                          <td>
                            {p.status.eligible ? <div className="cost-display">${p.status.cost}</div> : <span style={{ color: 'var(--kff-ink-mute)' }}>—</span>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="mono" style={{ color: p.status.yearsRemaining === 1 ? 'var(--kff-red)' : 'var(--kff-ink-dim)', fontWeight: 700 }}>
                                {p.status.yearsRemaining} Yrs
                              </span>
                              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--kff-ink-mute)' }}>Max {p.status.maxYears}</span>
                            </div>
                          </td>
                          <td>
                            {p.status.eligible ? (
                              <select
                                className={`decision-select ${decision === 'drop' ? 'decision-drop' : 'decision-keep'}`}
                                value={decision}
                                onChange={(e) => {
                                  const val = e.target.value as KeepDecision;
                                  setKeepDecisions((prev) => ({ ...prev, [decisionKey]: val }));
                                }}
                              >
                                <option value="keep">Keep</option>
                                <option value="drop">Drop</option>
                              </select>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--kff-red)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase' }}>
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
