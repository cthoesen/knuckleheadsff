'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, AlertCircle, TrendingUp, ChevronDown, X, Plus, Trophy } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: string;
  nflTeam: string;
  pointsYTD: number;
  pointsAVG: number;
}

interface DraftPick {
  year: string;
  round: string;
  originalOwner: string;
}

interface Franchise {
  id: string;
  name: string;
  players: Player[];
  futurePicks: DraftPick[];
}

interface TradeData {
  franchises: Franchise[];
}

const DRAFT_PICK_VALUES: Record<string, number> = {
  '1': 12, '2': 10, '3': 8, '4': 7, '5': 6, '6': 5,
  '7': 4, '8': 3.5, '9': 3, '10': 2.5, '11': 2, '12': 1.5,
  '13': 1, '14': 0.5, '15': 0.5,
};

const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE', 'PK', 'Def', 'DE', 'DT', 'LB', 'CB', 'S'];

function positionSort(a: Player, b: Player) {
  const ai = POSITION_ORDER.indexOf(a.position);
  const bi = POSITION_ORDER.indexOf(b.position);
  const av = ai === -1 ? 99 : ai;
  const bv = bi === -1 ? 99 : bi;
  if (av !== bv) return av - bv;
  return b.pointsAVG - a.pointsAVG;
}

function pickLabel(pick: DraftPick) {
  return `${pick.year} Round ${pick.round}${pick.originalOwner ? ` (${pick.originalOwner})` : ''}`;
}

function pickKey(pick: DraftPick) {
  return `${pick.year}-${pick.round}-${pick.originalOwner}`;
}

export default function BSBTradeAnalyzer() {
  const [tradeData, setTradeData] = useState<TradeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [teamAPlayerIds, setTeamAPlayerIds] = useState<Set<string>>(new Set());
  const [teamBPlayerIds, setTeamBPlayerIds] = useState<Set<string>>(new Set());
  const [teamAPickKeys, setTeamAPickKeys] = useState<Set<string>>(new Set());
  const [teamBPickKeys, setTeamBPickKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/bsb-trade-data');
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Server Error ${response.status}: ${errText}`);
        }
        const data = await response.json();
        setTradeData(data);
      } catch (err: any) {
        setError(`Error loading trade data: ${err.message}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const franchises = useMemo(() => {
    if (!tradeData) return [];
    return [...tradeData.franchises].sort((a, b) => a.name.localeCompare(b.name));
  }, [tradeData]);

  const teamA = useMemo(() => franchises.find(f => f.id === teamAId) || null, [franchises, teamAId]);
  const teamB = useMemo(() => franchises.find(f => f.id === teamBId) || null, [franchises, teamBId]);

  function handleTeamAChange(id: string) {
    setTeamAId(id);
    setTeamAPlayerIds(new Set());
    setTeamAPickKeys(new Set());
  }
  function handleTeamBChange(id: string) {
    setTeamBId(id);
    setTeamBPlayerIds(new Set());
    setTeamBPickKeys(new Set());
  }

  function togglePlayer(side: 'A' | 'B', playerId: string) {
    if (side === 'A') {
      setTeamAPlayerIds(prev => {
        const next = new Set(prev);
        next.has(playerId) ? next.delete(playerId) : next.add(playerId);
        return next;
      });
    } else {
      setTeamBPlayerIds(prev => {
        const next = new Set(prev);
        next.has(playerId) ? next.delete(playerId) : next.add(playerId);
        return next;
      });
    }
  }

  function togglePick(side: 'A' | 'B', key: string) {
    if (side === 'A') {
      setTeamAPickKeys(prev => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    } else {
      setTeamBPickKeys(prev => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    }
  }

  const analysis = useMemo(() => {
    if (!teamA || !teamB) return null;

    const aPlayers = teamA.players.filter(p => teamAPlayerIds.has(p.id));
    const bPlayers = teamB.players.filter(p => teamBPlayerIds.has(p.id));
    const aPicks = teamA.futurePicks.filter(p => teamAPickKeys.has(pickKey(p)));
    const bPicks = teamB.futurePicks.filter(p => teamBPickKeys.has(pickKey(p)));

    if (aPlayers.length + aPicks.length === 0 && bPlayers.length + bPicks.length === 0) return null;

    const aPlayerValue = aPlayers.reduce((sum, p) => sum + p.pointsAVG, 0);
    const bPlayerValue = bPlayers.reduce((sum, p) => sum + p.pointsAVG, 0);
    const aPickValue = aPicks.reduce((sum, p) => sum + (DRAFT_PICK_VALUES[p.round] || 1), 0);
    const bPickValue = bPicks.reduce((sum, p) => sum + (DRAFT_PICK_VALUES[p.round] || 1), 0);

    const aTotalValue = aPlayerValue + aPickValue;
    const bTotalValue = bPlayerValue + bPickValue;
    const totalValue = aTotalValue + bTotalValue;
    const aPercent = totalValue > 0 ? (aTotalValue / totalValue) * 100 : 50;

    const aYTD = aPlayers.reduce((sum, p) => sum + p.pointsYTD, 0);
    const bYTD = bPlayers.reduce((sum, p) => sum + p.pointsYTD, 0);

    let fairnessLabel: string;
    let fairnessColor: string;
    if (aPercent >= 40 && aPercent <= 60) {
      fairnessLabel = 'BALANCED';
      fairnessColor = '#f43f5e';
    } else if (aPercent >= 30 && aPercent <= 70) {
      fairnessLabel = 'SLIGHT EDGE';
      fairnessColor = '#ffaa00';
    } else {
      fairnessLabel = 'LOPSIDED';
      fairnessColor = '#ff0088';
    }

    return {
      aPlayers, bPlayers, aPicks, bPicks,
      aPlayerValue, bPlayerValue, aPickValue, bPickValue,
      aTotalValue, bTotalValue, aPercent,
      aYTD, bYTD,
      fairnessLabel, fairnessColor,
    };
  }, [teamA, teamB, teamAPlayerIds, teamBPlayerIds, teamAPickKeys, teamBPickKeys]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Rajdhani', sans-serif",
        background: 'linear-gradient(135deg, #1a0a0a 0%, #2e0a0a 50%, #4e1b1b 100%)',
        color: '#f43f5e'
      }}>
        <div style={{ textAlign: 'center' }}>
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading BSB trade data...</p>
        </div>
      </div>
    );
  }

  if (error || !tradeData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Rajdhani', sans-serif",
        background: 'linear-gradient(135deg, #1a0a0a 0%, #2e0a0a 50%, #4e1b1b 100%)',
        color: '#ff6b6b'
      }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'No trade data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: linear-gradient(135deg, #1a0a0a 0%, #2e0a0a 50%, #4e1b1b 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }
        body::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(244, 63, 94, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(225, 29, 72, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }
        .scan-line {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(244, 63, 94, 0.5), transparent);
          animation: scan 4s linear infinite;
          pointer-events: none;
          z-index: 1000;
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <div className="scan-line" />

      <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Rajdhani', sans-serif" }}>
        <header style={{
          borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
          background: 'rgba(26, 10, 10, 0.5)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <Link href="/bsb" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#f43f5e',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fb7185';
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#f43f5e';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              ← BACK TO BSB HUB
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <ArrowLeftRight style={{ width: '40px', height: '40px', color: '#f43f5e' }} />
              <h1 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #e11d48 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                BSB TRADE ANALYZER
              </h1>
            </div>
            <p style={{ color: '#fb7185', fontSize: '1.1rem', fontWeight: 600 }}>
              Blood, Sweat, and Beers • 2025 Season Scoring
            </p>
          </div>
        </header>

        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 1.5rem' }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '2rem',
          }}>
            <select
              value={teamAId}
              onChange={e => handleTeamAChange(e.target.value)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(26, 10, 10, 0.5)',
                border: '2px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '12px',
                color: '#fb7185',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <option value="">Select Team A</option>
              {franchises.filter(f => f.id !== teamBId).map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>

            <ArrowLeftRight style={{ width: '24px', height: '24px', color: '#f43f5e' }} />

            <select
              value={teamBId}
              onChange={e => handleTeamBChange(e.target.value)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(26, 10, 10, 0.5)',
                border: '2px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '12px',
                color: '#fb7185',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <option value="">Select Team B</option>
              {franchises.filter(f => f.id !== teamAId).map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {teamA && teamB && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}>
              <TeamPanel team={teamA} selectedPlayerIds={teamAPlayerIds} selectedPickKeys={teamAPickKeys} onTogglePlayer={id => togglePlayer('A', id)} onTogglePick={key => togglePick('A', key)} label="TEAM A" />
              <TeamPanel team={teamB} selectedPlayerIds={teamBPlayerIds} selectedPickKeys={teamBPickKeys} onTogglePlayer={id => togglePlayer('B', id)} onTogglePick={key => togglePick('B', key)} label="TEAM B" />
            </div>
          )}

          {analysis && teamA && teamB && (
            <div style={{
              background: 'rgba(26, 10, 10, 0.4)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '2px solid rgba(244, 63, 94, 0.2)',
              padding: '2rem',
              marginBottom: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <TrendingUp style={{ width: '24px', height: '24px', color: '#f43f5e' }} />
                <h2 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#fb7185',
                }}>
                  TRADE ANALYSIS
                </h2>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#fb7185',
                }}>
                  <span>{teamA.name}</span>
                  <span style={{ color: analysis.fairnessColor, fontWeight: 700, fontFamily: "'Orbitron', sans-serif" }}>
                    {analysis.fairnessLabel}
                  </span>
                  <span>{teamB.name}</span>
                </div>
                <div style={{
                  height: '12px',
                  borderRadius: '6px',
                  background: 'rgba(225, 29, 72, 0.3)',
                  overflow: 'hidden',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${analysis.aPercent}%`,
                    background: `linear-gradient(90deg, #f43f5e, ${analysis.fairnessColor})`,
                    borderRadius: '6px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: 'rgba(251, 113, 133, 0.6)',
                }}>
                  <span>{analysis.aPercent.toFixed(1)}%</span>
                  <span>{(100 - analysis.aPercent).toFixed(1)}%</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <TradeSummaryColumn teamName={teamA.name} players={analysis.aPlayers} picks={analysis.aPicks} totalValue={analysis.aTotalValue} ytd={analysis.aYTD} />
                <TradeSummaryColumn teamName={teamB.name} players={analysis.bPlayers} picks={analysis.bPicks} totalValue={analysis.bTotalValue} ytd={analysis.bYTD} />
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(255, 170, 0, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 170, 0, 0.2)',
                fontSize: '0.8rem',
                color: 'rgba(251, 113, 133, 0.7)',
                lineHeight: '1.5',
              }}>
                <strong style={{ color: '#ffaa00' }}>Note:</strong> Draft pick values are estimates based on
                historical averages. Player values use 2025 season weekly scoring averages. This tool is for
                reference only — actual trade value depends on many factors including keeper pick implications,
                roster needs, and league context.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TradeSummaryColumn({ teamName, players, picks, totalValue, ytd }: {
  teamName: string;
  players: Player[];
  picks: DraftPick[];
  totalValue: number;
  ytd: number;
}) {
  return (
    <div>
      <h3 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '1rem',
        fontWeight: 700,
        color: '#f43f5e',
        marginBottom: '1rem',
        textAlign: 'center',
      }}>
        {teamName} GIVES UP
      </h3>
      {players.map(p => (
        <div key={p.id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem 0',
          borderBottom: '1px solid rgba(244, 63, 94, 0.1)',
          color: '#fb7185',
          fontSize: '0.875rem',
        }}>
          <span>
            <span style={{ color: posColor(p.position), fontWeight: 700, marginRight: '0.5rem', fontSize: '0.75rem' }}>{p.position}</span>
            {p.name}
          </span>
          <span style={{ fontWeight: 700 }}>{p.pointsAVG.toFixed(1)}</span>
        </div>
      ))}
      {picks.map(p => (
        <div key={pickKey(p)} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem 0',
          borderBottom: '1px solid rgba(244, 63, 94, 0.1)',
          color: '#ffaa00',
          fontSize: '0.875rem',
        }}>
          <span>{pickLabel(p)}</span>
          <span style={{ fontWeight: 700 }}>~{DRAFT_PICK_VALUES[p.round] || 1}</span>
        </div>
      ))}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        color: '#f43f5e',
        fontWeight: 900,
        fontSize: '1rem',
        borderTop: '2px solid rgba(244, 63, 94, 0.3)',
        marginTop: '0.5rem',
      }}>
        <span>TOTAL AVG/WK</span>
        <span>{totalValue.toFixed(1)}</span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.25rem 0',
        color: 'rgba(251, 113, 133, 0.6)',
        fontSize: '0.875rem',
      }}>
        <span>Season YTD</span>
        <span>{ytd.toFixed(1)}</span>
      </div>
    </div>
  );
}

function posColor(pos: string) {
  switch (pos) {
    case 'QB': return '#ff6b6b';
    case 'RB': return '#f43f5e';
    case 'WR': return '#00ff88';
    case 'TE': return '#ffaa00';
    case 'PK': return '#fb7185';
    case 'Def': return '#00ffff';
    default: return '#888';
  }
}

function TeamPanel({
  team,
  selectedPlayerIds,
  selectedPickKeys,
  onTogglePlayer,
  onTogglePick,
  label,
}: {
  team: Franchise;
  selectedPlayerIds: Set<string>;
  selectedPickKeys: Set<string>;
  onTogglePlayer: (id: string) => void;
  onTogglePick: (key: string) => void;
  label: string;
}) {
  const [showPicks, setShowPicks] = useState(false);
  const sortedPlayers = useMemo(() => [...team.players].sort(positionSort), [team.players]);
  const selectedPlayers = sortedPlayers.filter(p => selectedPlayerIds.has(p.id));
  const selectedPicks = team.futurePicks.filter(p => selectedPickKeys.has(pickKey(p)));
  const hasSelections = selectedPlayers.length > 0 || selectedPicks.length > 0;

  return (
    <div style={{
      background: 'rgba(26, 10, 10, 0.4)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '2px solid rgba(244, 63, 94, 0.2)',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(90deg, rgba(225, 29, 72, 0.6), rgba(244, 63, 94, 0.6))',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
      }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(251, 113, 133, 0.6)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 900,
          color: '#fb7185',
        }}>
          {team.name}
        </h2>
      </div>

      {hasSelections && (
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(244, 63, 94, 0.05)',
          borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            TRADING AWAY
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {selectedPlayers.map(p => (
              <button key={p.id} onClick={() => onTogglePlayer(p.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem',
                background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '9999px', color: '#f43f5e', fontSize: '0.8rem', cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
              }}>
                <span style={{ color: posColor(p.position), fontSize: '0.7rem', fontWeight: 700 }}>{p.position}</span>
                {p.name}
                <X style={{ width: '12px', height: '12px' }} />
              </button>
            ))}
            {selectedPicks.map(p => (
              <button key={pickKey(p)} onClick={() => onTogglePick(pickKey(p))} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem',
                background: 'rgba(255, 170, 0, 0.15)', border: '1px solid rgba(255, 170, 0, 0.4)',
                borderRadius: '9999px', color: '#ffaa00', fontSize: '0.8rem', cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
              }}>
                {pickLabel(p)}
                <X style={{ width: '12px', height: '12px' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              background: 'rgba(26, 10, 10, 0.4)', color: 'rgba(251, 113, 133, 0.6)',
              fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em',
              position: 'sticky', top: 0, zIndex: 1,
            }}>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'left', fontWeight: 700 }}>Player</th>
              <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>Pos</th>
              <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>Team</th>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 700 }}>AVG</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map(player => {
              const selected = selectedPlayerIds.has(player.id);
              return (
                <tr key={player.id} onClick={() => onTogglePlayer(player.id)} style={{
                  borderTop: '1px solid rgba(244, 63, 94, 0.08)', cursor: 'pointer',
                  background: selected ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(225, 29, 72, 0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = selected ? 'rgba(244, 63, 94, 0.1)' : 'transparent'; }}
                >
                  <td style={{ padding: '0.6rem 1rem', color: selected ? '#f43f5e' : '#fb7185', fontWeight: selected ? 700 : 500, fontSize: '0.875rem' }}>
                    {selected && <span style={{ marginRight: '0.4rem' }}>✓</span>}
                    {player.name}
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: posColor(player.position), fontWeight: 700, fontSize: '0.75rem' }}>
                    {player.position}
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: 'rgba(251, 113, 133, 0.6)', fontSize: '0.75rem' }}>
                    {player.nflTeam}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', textAlign: 'right', color: selected ? '#f43f5e' : 'rgba(251, 113, 133, 0.8)', fontWeight: 700, fontSize: '0.875rem' }}>
                    {player.pointsAVG.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ borderTop: '1px solid rgba(244, 63, 94, 0.2)' }}>
        <button onClick={() => setShowPicks(!showPicks)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.5rem', background: 'rgba(255, 170, 0, 0.05)', border: 'none',
          color: '#ffaa00', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.875rem', fontWeight: 700,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus style={{ width: '14px', height: '14px' }} />
            DRAFT PICKS ({team.futurePicks.length})
          </span>
          <ChevronDown style={{ width: '16px', height: '16px', transform: showPicks ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {showPicks && (
          <div style={{ padding: '0 1.5rem 1rem' }}>
            {team.futurePicks.length === 0 ? (
              <p style={{ color: 'rgba(251, 113, 133, 0.5)', fontSize: '0.8rem', padding: '0.5rem 0' }}>No future draft picks available</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {team.futurePicks.map(pick => {
                  const key = pickKey(pick);
                  const selected = selectedPickKeys.has(key);
                  return (
                    <button key={key} onClick={() => onTogglePick(key)} style={{
                      padding: '0.3rem 0.7rem',
                      background: selected ? 'rgba(255, 170, 0, 0.2)' : 'rgba(26, 10, 10, 0.3)',
                      border: `1px solid ${selected ? 'rgba(255, 170, 0, 0.5)' : 'rgba(255, 170, 0, 0.15)'}`,
                      borderRadius: '6px', color: selected ? '#ffaa00' : 'rgba(251, 113, 133, 0.6)',
                      cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {selected && '✓ '}{pickLabel(pick)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
