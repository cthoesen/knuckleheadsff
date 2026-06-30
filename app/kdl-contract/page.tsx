'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, TrendingUp } from 'lucide-react';
import { ToolHeader } from '../components/kff/ToolHeader';
import { FRANCHISE_ALIASES } from './franchise-aliases';

interface TagPlayer {
  Player: string;
  Position: string;
  Salary: string;
}

interface KDLPlayer {
  Player: string;
  Position: string;
  Team: string;
  Salary: string;
  Years: string;
  Status: string;
  Info: string;
  IsTaxi: boolean;
}

interface TagValues {
  [position: string]: {
    franchise: number;
    restricted: number;
  }
}

type TagDecision = 'franchise' | 'restricted' | 'drop' | '';

function getPositionGroup(pos: string) {
  if (pos === 'DT' || pos === 'DE') return 'DL';
  if (pos === 'CB' || pos === 'S') return 'DB';
  return pos;
}

function calculateTagBaselines(tagPlayers: TagPlayer[]): TagValues {
  const groups = ['QB', 'RB', 'WR', 'TE', 'PK', 'LB', 'DL', 'DB'];
  const baselines: TagValues = {};
  const salaryMap: Record<string, number[]> = {};
  groups.forEach(g => salaryMap[g] = []);

  tagPlayers.forEach(p => {
    const group = getPositionGroup(p.Position || 'UNK');
    if (salaryMap[group]) salaryMap[group].push(parseFloat(p.Salary) || 0);
  });

  groups.forEach(group => {
    const salaries = salaryMap[group].sort((a, b) => b - a);
    const top5  = salaries.slice(0, 5);
    const top10 = salaries.slice(0, 10);
    baselines[group] = {
      franchise:  top5.length  ? top5.reduce((a, b)  => a + b, 0) / top5.length  : 0,
      restricted: top10.length ? top10.reduce((a, b) => a + b, 0) / top10.length : 0,
    };
  });

  return baselines;
}

function calculatePlayerStatus(player: KDLPlayer, tagBaselines: TagValues) {
  const salary        = parseFloat(player.Salary) || 0;
  const currentYears  = parseInt(player.Years) || 0;
  const projectedYears = Math.max(0, currentYears - 1);

  let rawPos = player.Position;
  if (!rawPos || rawPos === 'UNK') {
    const parts = player.Player.split(' ');
    rawPos = parts[parts.length - 1].replace(/[^a-zA-Z]/g, '');
  }
  const group    = getPositionGroup(rawPos);
  const baseline = tagBaselines[group] || { franchise: 0, restricted: 0 };

  return {
    salary,
    currentYears,
    projectedYears,
    positionGroup:   group,
    franchiseCost:   Math.round(Math.max(baseline.franchise,  salary * 1.2)),
    restrictedCost:  Math.round(Math.max(baseline.restricted, salary * 1.1)),
    isExpiring:      projectedYears === 0,
    isTaxi:          player.IsTaxi,
  };
}

export default function KDLContractApp() {
  const [players,         setPlayers]         = useState<KDLPlayer[]>([]);
  const [tagBaselines,    setTagBaselines]    = useState<TagValues>({});
  const [deadMoneyByTeam, setDeadMoneyByTeam] = useState<Record<string, number>>({});
  const [isLoading,       setIsLoading]       = useState(true);
  const [error,           setError]           = useState<string | null>(null);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [selectedTeam,    setSelectedTeam]    = useState('all');
  const [tagDecisions,    setTagDecisions]    = useState<Record<string, TagDecision>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [leagueRes, tagRes, deadMoneyRes] = await Promise.all([
          fetch('/api/kdl-league-data'),
          fetch('/api/kdl-tag-data'),
          fetch('/api/kdl-dead-money'),
        ]);
        if (!leagueRes.ok) throw new Error('Failed to fetch KDL data');
        if (!tagRes.ok)    throw new Error('Failed to fetch tag baseline data');

        const data:    KDLPlayer[]  = await leagueRes.json();
        const tagData: TagPlayer[]  = await tagRes.json();
        setTagBaselines(calculateTagBaselines(tagData));
        setPlayers(data);

        // Build a case-insensitive map of franchise name → total dead money.
        // FRANCHISE_ALIASES remaps prior-season names to current-season names
        // for teams that changed ownership or renamed between seasons.
        if (deadMoneyRes.ok) {
          const dmData = await deadMoneyRes.json();
          const aliasMap: Record<string, string> = {};
          Object.entries(FRANCHISE_ALIASES).forEach(([oldName, newName]) => {
            aliasMap[oldName.toLowerCase()] = newName.toLowerCase();
          });

          const map: Record<string, number> = {};
          (dmData.franchises ?? []).forEach((f: any) => {
            const key = aliasMap[f.name.toLowerCase()] ?? f.name.toLowerCase();
            map[key] = f.totalDeadMoney;
          });
          setDeadMoneyByTeam(map);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const setDecision = (playerKey: string, value: TagDecision) =>
    setTagDecisions(prev => ({ ...prev, [playerKey]: value }));

  const teams = useMemo(() => {
    const teamMap = new Map();
    players.forEach(player => {
      if (!teamMap.has(player.Team))
        teamMap.set(player.Team, { name: player.Team, players: [] });
      teamMap.get(player.Team).players.push({
        ...player,
        status: calculatePlayerStatus(player, tagBaselines),
      });
    });
    return Array.from(teamMap.values());
  }, [players, tagBaselines]);

  const filteredTeams = useMemo(() => {
    let result = teams;
    if (selectedTeam !== 'all') result = result.filter(t => t.name === selectedTeam);
    if (searchTerm) {
      result = result
        .map(t => ({ ...t, players: t.players.filter((p: any) => p.Player.toLowerCase().includes(searchTerm.toLowerCase())) }))
        .filter(t => t.players.length > 0);
    }
    return result;
  }, [teams, selectedTeam, searchTerm]);

  const getTeamStats = (players: any[], deadMoney: number = 0) => {
    const SALARY_CAP = 1000;
    const YEARS_CAP  = 65;
    const active = players.filter(p => !p.status.isTaxi);

    const totalSalary = active.reduce((sum, p) => sum + p.status.salary, 0) + deadMoney;
    const totalYears  = active.reduce((sum, p) => sum + p.status.projectedYears, 0);

    // Projected salary: replace expiring players' salary with their tag cost (or 0 if dropped)
    let projectedSalary = totalSalary;
    let hasDecisions    = false;
    active.forEach(p => {
      if (p.status.projectedYears === 0) {
        const key      = `${p.Team}-${p.Player}`;
        const decision = tagDecisions[key];
        if (decision) {
          hasDecisions     = true;
          projectedSalary -= p.status.salary;
          if      (decision === 'franchise')  projectedSalary += p.status.franchiseCost;
          else if (decision === 'restricted') projectedSalary += p.status.restrictedCost;
          // 'drop' adds 0
        }
      }
    });

    return {
      salaryCap:       SALARY_CAP,
      salaryUsed:      totalSalary,
      salarySpace:     SALARY_CAP - totalSalary,
      yearsCap:        YEARS_CAP,
      yearsUsed:       totalYears,
      yearsSpace:      YEARS_CAP - totalYears,
      projectedSalary,
      projectedSpace:  SALARY_CAP - projectedSalary,
      hasDecisions,
    };
  };

  if (isLoading) return (
    <div className="min-h-screen cyber-bg flex items-center justify-center">
      <div className="text-[#a95ef5] font-mono animate-pulse text-xl">INITIALIZING 2026 PLANNER...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen cyber-bg p-8 text-rose-500">Error: {error}</div>
  );

  return (
    <div className="min-h-screen league-kdl" style={{ background: 'var(--bg-base)' }}>
      <ToolHeader code="KDL" kicker="KDL · COMMISSIONER TOOL" title="2026 Season Planner" backHref="/kdl" backLabel="KDL Hub" />

      <div className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs font-mono uppercase" style={{ color: 'var(--kff-ink-mute)' }}>
          Projecting contract expirations &amp; tag values
        </p>
        <Link href="/kdl-tags" className="flex items-center gap-2 bg-[#8a2be2]/20 hover:bg-[#8a2be2]/30 border border-[#8a2be2]/50 px-4 py-2 rounded-lg transition-all group">
          <TrendingUp size={16} className="text-[#a95ef5] group-hover:text-white transition-colors" />
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 uppercase font-bold">Need to check prices?</div>
            <div className="text-sm text-[#a95ef5] font-mono font-bold group-hover:text-white">View Official Tag Baselines</div>
          </div>
        </Link>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Controls */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search player, status (R25), or rookie pick (4.04)..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-zinc-100 focus:border-[#8a2be2] outline-none font-mono"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:border-[#8a2be2] outline-none font-mono"
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="all">ALL FRANCHISES</option>
            {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>

        {/* Teams */}
        <div className="space-y-8">
          {filteredTeams.map((team: any) => {
            const teamDeadMoney = deadMoneyByTeam[team.name.toLowerCase()] || 0;
            const stats = getTeamStats(team.players, teamDeadMoney);
            return (
              <div key={team.name} className="cyber-card border-[#8a2be2]/20">

                {/* Team Header */}
                <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30">
                  <h2 className="text-2xl font-bold text-white mb-4">{team.name}</h2>

                  {/* Current stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-center">
                      <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Cap Space ($1000)</div>
                      <div className={`text-xl font-mono font-bold ${stats.salarySpace < 0 ? 'text-rose-500' : 'text-[#a95ef5]'}`}>${stats.salarySpace}</div>
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800 text-center opacity-60">
                      <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Active Salary</div>
                      <div className="text-lg font-mono text-zinc-400">${stats.salaryUsed}</div>
                    </div>
                    <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-center">
                      <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Years Space (65)</div>
                      <div className={`text-xl font-mono font-bold ${stats.yearsSpace < 0 ? 'text-rose-500' : 'text-[#a95ef5]'}`}>{stats.yearsSpace}</div>
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800 text-center opacity-60">
                      <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Active Years</div>
                      <div className="text-lg font-mono text-zinc-400">{stats.yearsUsed}</div>
                    </div>
                  </div>

                  {/* Projected stats — only shown once any tag decision is made for this team */}
                  {stats.hasDecisions && (
                    <div className="mt-4 pt-4 border-t border-[#4e158f]/30">
                      <div className="text-[10px] uppercase text-[#a95ef5] font-bold font-mono mb-3 tracking-wider">
                        ↳ Projected After Tag Decisions
                      </div>
                      <div className="grid grid-cols-2 gap-4 max-w-xs">
                        <div className="bg-zinc-950 p-3 rounded border border-[#8a2be2]/30 text-center">
                          <div className="text-[10px] uppercase text-[#8a2be2] font-bold mb-1">Proj. Cap Space</div>
                          <div className={`text-xl font-mono font-bold ${stats.projectedSpace < 0 ? 'text-rose-500' : 'text-cyan-400'}`}>${stats.projectedSpace}</div>
                        </div>
                        <div className="bg-zinc-900/50 p-3 rounded border border-[#8a2be2]/20 text-center opacity-80">
                          <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Proj. Salary</div>
                          <div className="text-lg font-mono text-zinc-300">${stats.projectedSalary}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Player Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/50 text-xs text-zinc-500 uppercase font-bold tracking-wider">
                        <th className="px-6 py-3">Player</th>
                        <th className="px-6 py-3">Salary</th>
                        <th className="px-6 py-3 text-center">2026 Years</th>
                        <th className="px-6 py-3 text-center">Franchise Tag</th>
                        <th className="px-6 py-3 text-center">Restricted Tag</th>
                        <th className="px-6 py-3 text-right">Tag Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {team.players.map((p: any, i: number) => {
                        const playerKey = `${p.Team}-${p.Player}`;
                        const decision  = tagDecisions[playerKey] || '';
                        return (
                          <tr
                            key={i}
                            className={`hover:bg-[#8a2be2]/5 transition-colors ${p.status.isTaxi ? 'opacity-70 bg-amber-500/5' : ''}`}
                          >
                            {/* Player name + badges */}
                            <td className="px-6 py-3">
                              <div className="font-bold text-zinc-200">{p.Player}</div>
                              <div className="flex gap-2 mt-1">
                                {p.status.isTaxi && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono">TAXI</span>
                                )}
                                {p.Status && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">{p.Status}</span>
                                )}
                                {p.status.isExpiring && !p.status.isTaxi && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/30 font-mono animate-pulse">EXPIRING</span>
                                )}
                              </div>
                            </td>

                            {/* Salary */}
                            <td className="px-6 py-3 font-mono text-[#a95ef5]">${p.status.salary}</td>

                            {/* 2026 Years */}
                            <td className="px-6 py-3 text-center">
                              <span className={`font-mono font-bold ${p.status.projectedYears === 0 ? 'text-rose-500' : 'text-zinc-400'}`}>
                                {p.status.projectedYears}
                              </span>
                            </td>

                            {/* Franchise Tag cost */}
                            <td className="px-6 py-3 text-center">
                              {p.status.projectedYears === 0 ? (
                                <div className="inline-block bg-zinc-950 border border-[#8a2be2]/30 rounded px-3 py-1">
                                  <span className="block text-[10px] text-zinc-500 uppercase">Tag Cost</span>
                                  <span className="font-mono text-[#a95ef5] font-bold">${p.status.franchiseCost}</span>
                                </div>
                              ) : (
                                <span className="text-zinc-700 font-mono">—</span>
                              )}
                            </td>

                            {/* Restricted Tag cost */}
                            <td className="px-6 py-3 text-center">
                              {p.status.projectedYears === 0 ? (
                                <div className="inline-block bg-zinc-950 border border-cyan-500/30 rounded px-3 py-1">
                                  <span className="block text-[10px] text-zinc-500 uppercase">Tag Cost</span>
                                  <span className="font-mono text-cyan-400 font-bold">${p.status.restrictedCost}</span>
                                </div>
                              ) : (
                                <span className="text-zinc-700 font-mono">—</span>
                              )}
                            </td>

                            {/* Tag Decision column */}
                            <td className="px-6 py-3 text-right">
                              {p.status.projectedYears === 0 && !p.status.isTaxi ? (
                                <select
                                  value={decision}
                                  onChange={(e) => setDecision(playerKey, e.target.value as TagDecision)}
                                  className={`bg-zinc-900 border rounded px-2 py-1 text-xs font-mono outline-none transition-colors
                                    ${decision === 'franchise'  ? 'border-[#8a2be2] text-[#a95ef5]' :
                                      decision === 'restricted' ? 'border-cyan-500 text-cyan-300'    :
                                      decision === 'drop'       ? 'border-rose-500 text-rose-400'    :
                                      'border-zinc-700 text-zinc-400'}`}
                                >
                                  <option value="">— Undecided —</option>
                                  <option value="franchise">Franchise</option>
                                  <option value="restricted">Restricted</option>
                                  <option value="drop">Drop</option>
                                </select>
                              ) : p.status.projectedYears > 0 ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-600 border border-zinc-800 font-mono">
                                  Under Contract
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Dead Money row */}
                      {teamDeadMoney > 0 && (
                        <tr className="bg-rose-500/5 border-t border-rose-500/20">
                          <td className="px-6 py-3">
                            <div className="font-bold text-rose-400 text-sm">Dead Money</div>
                            <div className="text-[10px] text-rose-500/70 font-mono mt-0.5">2026 carry-over penalties</div>
                          </td>
                          <td className="px-6 py-3 font-mono text-rose-400">${teamDeadMoney}</td>
                          <td className="px-6 py-3 text-center"><span className="text-zinc-700 font-mono">—</span></td>
                          <td className="px-6 py-3 text-center"><span className="text-zinc-700 font-mono">—</span></td>
                          <td className="px-6 py-3 text-center"><span className="text-zinc-700 font-mono">—</span></td>
                          <td className="px-6 py-3 text-right"><span className="text-zinc-700 font-mono">—</span></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
