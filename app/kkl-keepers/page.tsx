'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { ToolHeader } from '../components/kff/ToolHeader';

interface Keeper {
  playerId: string;
  player: string;
  keeperRound: string;
  keeperDraftPick: string | null;
  yearsRemaining: number | null;
  pyRoundDrafted: number | null;
  pyPoints: number | null;
}

interface Team {
  team: string;
  franchiseId: string | null;
  draftPicks: string[];
  keepers: Keeper[];
}

interface BoardData {
  season: string;
  generatedAt: string;
  teamsInLeague: number;
  teamsReported: number;
  totalKeepers: number;
  teams: Team[];
}

const MAX_KEEPERS = 6;

/** "5.08" -> 508, so picks order by round then slot rather than as decimals. */
function pickValue(pick?: string | null) {
  if (!pick) return Number.MAX_SAFE_INTEGER;
  const [r, s] = pick.split('.');
  return parseInt(r, 10) * 100 + (parseInt(s, 10) || 0);
}

function formatUpdated(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function KKLKeeperBoard() {
  const [data, setData] = useState<BoardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/kkl-keepers');
        if (!res.ok) throw new Error('Failed to load keeper board');
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const teams = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.teams;
    return data.teams
      .map((t) => ({ ...t, keepers: t.keepers.filter((k) => k.player.toLowerCase().includes(q)) }))
      .filter((t) => t.keepers.length > 0 || t.team.toLowerCase().includes(q));
  }, [data, search]);

  /** Picks a team no longer owns because a keeper consumes them. */
  const consumedPicks = (t: Team) => new Set(t.keepers.map((k) => k.keeperDraftPick ?? ''));

  if (isLoading)
    return (
      <div className="min-h-screen league-kkl" style={{ background: 'var(--bg-base)' }}>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', fontFamily: 'var(--font-mono)', color: 'var(--league-color)' }}>
          <span className="kff-blink">LOADING KEEPER BOARD…</span>
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className="min-h-screen league-kkl" style={{ background: 'var(--bg-base)', padding: 'var(--space-8)' }}>
        <p style={{ color: 'var(--kff-red, #FF3B4E)', fontFamily: 'var(--font-mono)' }}>Error: {error}</p>
      </div>
    );

  const notReported = data.teamsInLeague - data.teamsReported;
  const priorSeason = String(Number(data.season) - 1);

  return (
    <div className="min-h-screen league-kkl" style={{ background: 'var(--bg-base)' }}>
      <ToolHeader
        code="KKL"
        kicker="KKL · LEAGUE REFERENCE"
        title="Keeper Board"
        backHref="/kkl"
        backLabel="KKL Hub"
      />

      <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-6)' }}>
        {/* Provenance — the board is only as current as the last export, so say so up front. */}
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 'var(--space-6)',
            padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-inset)', border: '2px solid var(--kff-line)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <Stat label="Keepers Declared" value={String(data.totalKeepers)} />
            <Stat label="Teams Reported" value={`${data.teamsReported} / ${data.teamsInLeague}`} />
            <Stat label="Updated" value={formatUpdated(data.generatedAt)} />
          </div>
          <div style={{ position: 'relative', minWidth: 220, flex: '0 1 300px' }}>
            <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--kff-ink-mute)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a player or team…"
              style={{
                width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-base)', border: '2px solid var(--kff-line-2)',
                color: 'var(--kff-ink)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
              }}
            />
          </div>
        </div>

        {notReported > 0 && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-6)',
              padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-sm)',
              background: 'color-mix(in srgb, #FFC94D 10%, transparent)',
              border: '2px solid color-mix(in srgb, #FFC94D 35%, transparent)',
            }}
          >
            <AlertTriangle size={16} style={{ color: '#FFC94D', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--kff-ink-dim)' }}>
              {notReported} {notReported === 1 ? 'team has' : 'teams have'} not reported keepers yet — an empty team here
              means no selections received, not a team keeping nobody.
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gap: 'var(--space-5)', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          {teams.map((t) => {
            const consumed = consumedPicks(t);
            const remaining = t.draftPicks.filter((p) => !consumed.has(p));
            return (
              <section
                key={t.team}
                style={{
                  border: '2px solid var(--kff-line)', borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-card)', overflow: 'hidden',
                }}
              >
                <header
                  className="kff-scanlines"
                  style={{
                    padding: 'var(--space-4) var(--space-5)',
                    borderBottom: '2px solid color-mix(in srgb, var(--league-color) 40%, transparent)',
                    background: 'radial-gradient(120% 120% at 85% 0%, color-mix(in srgb, var(--league-color) 20%, transparent) 0%, transparent 60%), var(--surface-inset)',
                    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10,
                  }}
                >
                  <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--kff-ink)' }}>
                    {t.team}
                  </h2>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: t.keepers.length >= MAX_KEEPERS ? 'var(--league-color)' : 'var(--kff-ink-mute)', whiteSpace: 'nowrap' }}>
                    {t.keepers.length} / {MAX_KEEPERS}
                  </span>
                </header>

                {t.keepers.length === 0 ? (
                  <p style={{ margin: 0, padding: 'var(--space-6) var(--space-5)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-mute)' }}>
                    No keepers reported
                  </p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <Th>Player</Th>
                        <Th align="center">Yrs</Th>
                        <Th align="center">Cost</Th>
                        <Th align="right">Pick</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.keepers.map((k) => (
                        <tr key={k.playerId} style={{ borderTop: '1px solid var(--kff-line)' }}>
                          <td style={{ padding: '9px var(--space-4)', width: '99%' }}>
                            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--kff-ink)' }}>
                              {k.player}
                            </div>
                            {k.pyRoundDrafted ? (
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--kff-ink-mute)', whiteSpace: 'nowrap' }}>
                                {priorSeason} rd {k.pyRoundDrafted}
                              </div>
                            ) : null}
                          </td>
                          <td style={{ padding: '9px 8px', textAlign: 'center', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-dim)' }}>
                            {k.yearsRemaining ?? '—'}
                          </td>
                          <td style={{ padding: '9px 8px', textAlign: 'center', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-dim)' }}>
                            {k.keeperRound ?? '—'}
                          </td>
                          <td style={{ padding: '9px var(--space-4)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--league-color)' }}>
                              {k.keeperDraftPick ?? '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <footer style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '2px solid var(--kff-line)', background: 'var(--surface-inset)' }}>
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--kff-ink-mute)', letterSpacing: '0.05em', marginBottom: 7 }}>
                    DRAFT PICKS — {remaining.length} REMAINING
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {t.draftPicks.map((p) => {
                      const used = consumed.has(p);
                      return (
                        <span
                          key={p}
                          title={used ? 'Used by a keeper' : 'Available'}
                          style={{
                            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
                            padding: '3px 6px', borderRadius: 3,
                            border: '1px solid ' + (used ? 'transparent' : 'var(--kff-line-2)'),
                            background: used ? 'color-mix(in srgb, var(--league-color) 18%, transparent)' : 'transparent',
                            color: used ? 'var(--league-color)' : 'var(--kff-ink-dim)',
                            textDecoration: used ? 'line-through' : 'none',
                          }}
                        >
                          {p}
                        </span>
                      );
                    })}
                  </div>
                </footer>
              </section>
            );
          })}
        </div>

        {teams.length === 0 && (
          <p style={{ textAlign: 'center', padding: 'var(--space-8)', fontFamily: 'var(--font-mono)', color: 'var(--kff-ink-mute)' }}>
            Nothing matches “{search}”.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--kff-ink-mute)', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', lineHeight: 1, color: 'var(--kff-ink)' }}>
        {value}
      </span>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  return (
    <th
      style={{
        padding: '7px var(--space-4)', textAlign: align, whiteSpace: 'nowrap',
        fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', fontWeight: 400,
        letterSpacing: '0.05em', color: 'var(--kff-ink-mute)',
        background: 'var(--surface-inset)',
      }}
    >
      {children}
    </th>
  );
}
