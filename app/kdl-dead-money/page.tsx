'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Search, Skull, ChevronDown, ChevronUp } from 'lucide-react';

interface CutRow {
  franchise: string;
  playerCut: string;
  salaryWhenCut: number;
  yearsWhenCut: number;
  salarCapPenalty: number;
  deadMoney: number;
  dateCut: string;
  timeCut: string;
}

interface FranchiseData {
  name: string;
  cuts: CutRow[];
  totalDeadMoney: number;
  totalInSeasonPenalty: number;
}

interface DeadMoneyData {
  targetYear: string;
  newYear: string;
  franchises: FranchiseData[];
  allCuts: CutRow[];
}

// Dead money minimum thresholds from bylaws (years when cut -> minimum dead money)
const DEAD_MONEY_MINIMUMS: Record<number, number> = { 2: 2, 3: 5, 4: 10, 5: 20 };

function yearsLabel(y: number) {
  if (y <= 1) return '1 yr';
  return `${y} yrs`;
}

function deadMoneyColor(amount: number) {
  if (amount === 0) return 'text-zinc-600';
  if (amount >= 20) return 'text-rose-400';
  if (amount >= 10) return 'text-orange-400';
  if (amount >= 5) return 'text-amber-400';
  return 'text-yellow-400';
}

export default function KDLDeadMoney() {
  const [data, setData] = useState<DeadMoneyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFranchise, setSelectedFranchise] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'deadMoney' | 'penalty'>('deadMoney');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedFranchises, setExpandedFranchises] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/kdl-dead-money');
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Server Error ${res.status}: ${errText}`);
        }
        const json = await res.json();
        setData(json);
        // Auto-expand franchises that have dead money
        const withDeadMoney = new Set<string>(
          json.franchises.filter((f: FranchiseData) => f.totalDeadMoney > 0).map((f: FranchiseData) => f.name)
        );
        setExpandedFranchises(withDeadMoney);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const franchises = useMemo(() => {
    if (!data) return [];
    let result = [...data.franchises];

    // Filter by search
    if (searchTerm) {
      result = result
        .map(f => ({
          ...f,
          cuts: f.cuts.filter(c =>
            c.playerCut.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter(f => f.cuts.length > 0);
    }

    // Filter by selected franchise
    if (selectedFranchise !== 'all') {
      result = result.filter(f => f.name === selectedFranchise);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'deadMoney') cmp = a.totalDeadMoney - b.totalDeadMoney;
      else if (sortField === 'penalty') cmp = a.totalInSeasonPenalty - b.totalInSeasonPenalty;
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [data, searchTerm, selectedFranchise, sortField, sortDir]);

  const leagueTotals = useMemo(() => {
    if (!data) return { totalDeadMoney: 0, totalPenalty: 0, totalCuts: 0, franchisesAffected: 0 };
    return {
      totalDeadMoney: data.franchises.reduce((s, f) => s + f.totalDeadMoney, 0),
      totalPenalty: data.franchises.reduce((s, f) => s + f.totalInSeasonPenalty, 0),
      totalCuts: data.allCuts.length,
      franchisesAffected: data.franchises.filter(f => f.totalDeadMoney > 0).length,
    };
  }, [data]);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function toggleExpand(name: string) {
    setExpandedFranchises(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <div className="text-center">
          <Skull size={48} className="text-violet-400 mx-auto mb-4 animate-pulse" />
          <div className="text-violet-400 font-mono animate-pulse text-xl">LOADING DEAD MONEY DATA...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <div className="text-center text-rose-500">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p className="font-mono">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-zinc-600 inline ml-1" />;
    return sortDir === 'desc'
      ? <ChevronDown size={12} className="text-violet-400 inline ml-1" />
      : <ChevronUp size={12} className="text-violet-400 inline ml-1" />;
  };

  return (
    <div className="min-h-screen cyber-bg">
      <div className="scan-line" />

      {/* Header */}
      <div className="relative z-10 border-b border-violet-900/30 bg-black/40 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/kdl" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs font-mono mb-2">
            <ArrowLeft size={12} /> RETURN TO DASHBOARD
          </Link>
          <div className="flex items-center gap-3">
            <Skull size={32} className="text-violet-400" />
            <div>
              <h1 className="text-2xl font-black gradient-text-violet glow-violet tracking-wide">
                {data.newYear} DEAD MONEY TRACKER
              </h1>
              <p className="text-xs text-zinc-500 font-mono uppercase">
                KDL · Players Cut During {data.targetYear} Season · Cap Penalties Charged in {data.newYear}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* League Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="cyber-card border-violet-500/20 p-4 text-center">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Total {data.newYear} Dead Money</div>
            <div className="text-2xl font-mono font-black text-rose-400">${leagueTotals.totalDeadMoney}</div>
          </div>
          <div className="cyber-card border-violet-500/20 p-4 text-center">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">{data.targetYear} In-Season Penalties</div>
            <div className="text-2xl font-mono font-black text-violet-400">${leagueTotals.totalPenalty}</div>
          </div>
          <div className="cyber-card border-violet-500/20 p-4 text-center">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Total Players Cut</div>
            <div className="text-2xl font-mono font-black text-zinc-300">{leagueTotals.totalCuts}</div>
          </div>
          <div className="cyber-card border-violet-500/20 p-4 text-center">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Franchises w/ Dead Money</div>
            <div className="text-2xl font-mono font-black text-amber-400">{leagueTotals.franchisesAffected}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search player or franchise..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-zinc-100 focus:border-violet-500 outline-none font-mono text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:border-violet-500 outline-none font-mono text-sm"
            value={selectedFranchise}
            onChange={e => setSelectedFranchise(e.target.value)}
          >
            <option value="all">ALL FRANCHISES</option>
            {data.franchises.map(f => (
              <option key={f.name} value={f.name}>{f.name}</option>
            ))}
          </select>
          {/* Sort buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort('deadMoney')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                sortField === 'deadMoney'
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              DEAD MONEY <SortIcon field="deadMoney" />
            </button>
            <button
              onClick={() => toggleSort('penalty')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                sortField === 'penalty'
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              IN-SEASON <SortIcon field="penalty" />
            </button>
            <button
              onClick={() => toggleSort('name')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                sortField === 'name'
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              A–Z <SortIcon field="name" />
            </button>
          </div>
        </div>

        {/* No results */}
        {franchises.length === 0 && (
          <div className="text-center text-zinc-500 font-mono py-16">
            {data.allCuts.length === 0
              ? `No players have been cut with dead money implications yet in ${data.targetYear}.`
              : 'No results match your search.'}
          </div>
        )}

        {/* Franchise Cards */}
        <div className="space-y-4">
          {franchises.map(franchise => {
            const isExpanded = expandedFranchises.has(franchise.name);
            const hasDeadMoney = franchise.totalDeadMoney > 0;
            // Recalculate totals from filtered cuts if search is active
            const filteredDeadMoney = franchise.cuts.reduce((s, c) => s + c.deadMoney, 0);
            const filteredPenalty = franchise.cuts.reduce((s, c) => s + c.salarCapPenalty, 0);

            return (
              <div
                key={franchise.name}
                className={`cyber-card border-violet-500/20 overflow-hidden ${!hasDeadMoney ? 'opacity-60' : ''}`}
              >
                {/* Franchise header row — clickable to expand */}
                <button
                  onClick={() => toggleExpand(franchise.name)}
                  className="w-full text-left p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-violet-500/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded
                      ? <ChevronUp size={16} className="text-violet-400 shrink-0" />
                      : <ChevronDown size={16} className="text-zinc-500 shrink-0" />}
                    <div>
                      <h2 className="text-lg font-bold text-white">{franchise.name}</h2>
                      <p className="text-xs text-zinc-500 font-mono">
                        {franchise.cuts.length} cut{franchise.cuts.length !== 1 ? 's' : ''} · {data.targetYear} season
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6 flex-wrap">
                    <div className="text-center">
                      <div className="text-[10px] uppercase text-zinc-500 font-bold mb-0.5">{data.targetYear} Penalty</div>
                      <div className="font-mono font-bold text-violet-400 text-lg">${filteredPenalty}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase text-zinc-500 font-bold mb-0.5">{data.newYear} Dead Money</div>
                      <div className={`font-mono font-black text-xl ${hasDeadMoney ? 'text-rose-400' : 'text-zinc-600'}`}>
                        ${filteredDeadMoney}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded cut detail table */}
                {isExpanded && franchise.cuts.length > 0 && (
                  <div className="border-t border-zinc-800/60 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-950/60 text-xs text-zinc-500 uppercase font-bold tracking-wider">
                          <th className="px-5 py-3">Player Cut</th>
                          <th className="px-5 py-3 text-center">Salary</th>
                          <th className="px-5 py-3 text-center">Yrs Remaining</th>
                          <th className="px-5 py-3 text-center">{data.targetYear} Penalty</th>
                          <th className="px-5 py-3 text-center">{data.newYear} Dead Money</th>
                          <th className="px-5 py-3 text-right">Date Cut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/40">
                        {franchise.cuts.map((cut, i) => (
                          <tr key={i} className="hover:bg-violet-500/5 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-bold text-zinc-200">{cut.playerCut}</div>
                            </td>
                            <td className="px-5 py-3 text-center font-mono text-violet-300">
                              ${cut.salaryWhenCut}
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                                cut.yearsWhenCut >= 4 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : cut.yearsWhenCut === 3 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : cut.yearsWhenCut === 2 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}>
                                {yearsLabel(cut.yearsWhenCut)}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-center font-mono text-violet-300">
                              ${cut.salarCapPenalty}
                            </td>
                            <td className="px-5 py-3 text-center">
                              {cut.deadMoney > 0 ? (
                                <div className="inline-flex flex-col items-center">
                                  <span className={`font-mono font-black text-lg ${deadMoneyColor(cut.deadMoney)}`}>
                                    ${cut.deadMoney}
                                  </span>
                                  {/* Show if minimum was applied */}
                                  {DEAD_MONEY_MINIMUMS[cut.yearsWhenCut] !== undefined &&
                                    cut.deadMoney === DEAD_MONEY_MINIMUMS[cut.yearsWhenCut] && (
                                    <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wide">
                                      min applied
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-zinc-600 font-mono">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right text-zinc-500 font-mono text-xs">
                              <div>{cut.dateCut}</div>
                              <div className="text-zinc-600">{cut.timeCut}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Totals footer row */}
                      <tfoot>
                        <tr className="bg-zinc-950/40 border-t border-zinc-700/40">
                          <td className="px-5 py-3 text-xs text-zinc-500 font-mono uppercase font-bold">
                            Franchise Total
                          </td>
                          <td />
                          <td />
                          <td className="px-5 py-3 text-center font-mono font-bold text-violet-400">
                            ${filteredPenalty}
                          </td>
                          <td className="px-5 py-3 text-center font-mono font-black text-rose-400 text-lg">
                            ${filteredDeadMoney}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bylaw reference card */}
        <div className="mt-8 cyber-card border-violet-500/10 p-5">
          <h3 className="text-xs font-bold text-zinc-500 uppercase font-mono mb-3">Dead Money Formula (KDL Bylaws)</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-400">
            <div>
              <p className="mb-2">
                <span className="text-violet-400 font-mono font-bold">Formula: </span>
                ceil( (YearsWhenCut − 1) × 20% × Salary )
              </p>
              <p className="text-xs text-zinc-600">
                Charged at the start of the {data.newYear} season. In-season penalties are separate and charged immediately when the player is cut.
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase font-bold mb-1">Minimums</p>
              <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                {Object.entries(DEAD_MONEY_MINIMUMS).map(([yrs, min]) => (
                  <div key={yrs} className="flex justify-between bg-zinc-900/50 px-2 py-1 rounded">
                    <span className="text-zinc-400">{yrs} yrs remaining</span>
                    <span className="text-amber-400 font-bold">${min} min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
