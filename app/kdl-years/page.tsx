'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardList, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface UnassignedPlayer {
  Player: string;
  Team: string;
  Position: string;
  Salary: string;
  Years: string;
  IsTaxi: boolean;
}

export default function KDLYearsApp() {
  const [players, setPlayers] = useState<UnassignedPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/kdl-years-data');
        if (!response.ok) throw new Error('Failed to fetch KDL data');
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
      teamMap.get(player.Team).players.push(player);
    });
    return Array.from(teamMap.values());
  }, [players]);

  if (isLoading) return (
    <div className="min-h-screen cyber-bg flex items-center justify-center">
      <div className="text-violet-400 font-mono animate-pulse text-xl">SCANNING ROSTERS...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen cyber-bg p-8 text-rose-500">Error: {error}</div>
  );

  return (
    <div className="min-h-screen cyber-bg">
      <div className="scan-line" />

      {/* Header */}
      <div className="relative z-10 border-b border-violet-900/30 bg-black/40 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/kdl" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs font-mono mb-2">
            <ArrowLeft size={12} /> RETURN TO DASHBOARD
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ClipboardList size={32} className="text-violet-400" />
              <div>
                <h1 className="text-2xl font-black gradient-text-violet glow-violet tracking-wide">
                  UNASSIGNED YEARS
                </h1>
                <p className="text-xs text-zinc-500 font-mono uppercase">
                  Commissioner Tool — Waiver Pickup Year Tracking
                </p>
              </div>
            </div>

            {/* Summary Badge */}
            {players.length > 0 ? (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-lg">
                <AlertTriangle size={16} className="text-amber-500" />
                <span className="text-amber-400 font-mono font-bold text-sm">
                  {players.length} PLAYER{players.length !== 1 ? 'S' : ''} NEED YEARS
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  ALL CLEAR
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Empty State */}
        {players.length === 0 && (
          <div className="cyber-card border-emerald-500/20 text-center py-16">
            <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">ALL PLAYERS HAVE YEARS ASSIGNED</h2>
            <p className="text-zinc-500 font-mono">No action needed — every rostered player has contract years.</p>
          </div>
        )}

        {/* Teams List */}
        <div className="space-y-8">
          {teams.map((team: any) => (
            <div key={team.name} className="cyber-card border-violet-500/20">
              <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span className="text-amber-400 font-mono font-bold text-sm">
                    {team.players.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/50 text-xs text-zinc-500 uppercase font-bold tracking-wider">
                      <th className="px-6 py-3">Player</th>
                      <th className="px-6 py-3">Position</th>
                      <th className="px-6 py-3">Salary</th>
                      <th className="px-6 py-3 text-center">Years</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {team.players.map((p: UnassignedPlayer, i: number) => (
                      <tr key={i} className={`hover:bg-violet-500/5 transition-colors ${p.IsTaxi ? 'opacity-70 bg-amber-500/5' : ''}`}>
                        <td className="px-6 py-3">
                          <div className="font-bold text-zinc-200">{p.Player}</div>
                          {p.IsTaxi && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono mt-1 inline-block">TAXI</span>
                          )}
                        </td>
                        <td className="px-6 py-3 font-mono text-zinc-400">{p.Position}</td>
                        <td className="px-6 py-3 font-mono text-violet-300">${p.Salary}</td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-rose-500 font-mono font-bold animate-pulse">
                            {p.Years === '' ? '—' : p.Years}
                          </span>
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
    </div>
  );
}
