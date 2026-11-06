'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Copy, Check, Download } from 'lucide-react';
import { ToolHeader } from '../../components/kff/ToolHeader';

interface Row {
  rank: number;
  divisionRank: number | null;
  franchiseId: string;
  team: string;
  division: string;
  wins: number;
  losses: number;
  ties: number;
  pct: number;
  divWins: number;
  divLosses: number;
  divTies: number;
  pointsFor: number;
  pointsAgainst: number;
  avgPointsFor: number;
  avgPointsAgainst: number;
  streak: string;
}

interface StandingsData {
  league: string;
  leagueName: string;
  season: string;
  divisions: string[];
  fetchedAt: string;
  rows: Row[];
}

const LEAGUES = ['kkl', 'kdl', 'mmh', 'bsb'];

const pct = (n: number) => (n >= 1 ? n.toFixed(3) : n.toFixed(3).replace(/^0/, ''));
const record = (w: number, l: number, t: number) => `${w}-${l}${t ? `-${t}` : ''}`;

/**
 * Columns in the order they are copied. Excel splits pasted text on tabs, and
 * W / L / T go in separate columns so they arrive as numbers, not as a
 * "7-1-0" string Excel might read as a date.
 */
const COPY_COLUMNS: [string, (r: Row) => string | number][] = [
  ['Rank', (r) => r.rank],
  ['Team', (r) => r.team],
  ['Division', (r) => r.division],
  ['Div Rank', (r) => r.divisionRank ?? ''],
  ['W', (r) => r.wins],
  ['L', (r) => r.losses],
  ['T', (r) => r.ties],
  ['Pct', (r) => r.pct.toFixed(3)],
  ['Div W', (r) => r.divWins],
  ['Div L', (r) => r.divLosses],
  ['Div T', (r) => r.divTies],
  ['PF', (r) => r.pointsFor.toFixed(2)],
  ['PA', (r) => r.pointsAgainst.toFixed(2)],
  ['Avg PF', (r) => r.avgPointsFor.toFixed(1)],
  ['Avg PA', (r) => r.avgPointsAgainst.toFixed(1)],
  ['Streak', (r) => r.streak],
  ['Franchise ID', (r) => r.franchiseId],
];

function toTsv(rows: Row[]) {
  const clean = (v: string | number) => String(v).replace(/[\t\r\n]+/g, ' ');
  return [COPY_COLUMNS.map(([h]) => h), ...rows.map((r) => COPY_COLUMNS.map(([, f]) => clean(f(r))))]
    .map((cols) => cols.join('\t'))
    .join('\n');
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older Safari, or clipboard permission denied.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

function formatFetched(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function StandingsPage() {
  const code = String(useParams<{ league: string }>().league ?? '').toLowerCase();
  const known = LEAGUES.includes(code);
  const CODE = code.toUpperCase();

  const [data, setData] = useState<StandingsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'overall' | 'division'>('overall');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!known) {
      setError('Unknown league');
      setIsLoading(false);
      return;
    }
    async function load() {
      try {
        const res = await fetch(`/api/standings/${code}`);
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'Failed to load standings');
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [code, known]);

  const groups = useMemo(() => {
    if (!data) return [];
    if (view === 'overall' || data.divisions.length === 0) return [{ title: null as string | null, rows: data.rows }];
    return data.divisions.map((d) => ({ title: d, rows: data.rows.filter((r) => r.division === d) }));
  }, [data, view]);

  const handleCopy = async () => {
    if (!data) return;
    if (await copyText(toTsv(data.rows))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scope = `min-h-screen league-${known ? code : 'kkl'}`;

  if (isLoading)
    return (
      <div className={scope} style={{ background: 'var(--bg-base)' }}>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', fontFamily: 'var(--font-mono)', color: 'var(--league-color)' }}>
          <span className="kff-blink">LOADING STANDINGS…</span>
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className={scope} style={{ background: 'var(--bg-base)', padding: 'var(--space-8)' }}>
        <p style={{ color: 'var(--kff-red, #FF3B4E)', fontFamily: 'var(--font-mono)' }}>Error: {error}</p>
      </div>
    );

  const hasDivisions = data.divisions.length > 0;
  const showTies = data.rows.some((r) => r.ties > 0 || r.divTies > 0);

  return (
    <div className={scope} style={{ background: 'var(--bg-base)' }}>
      <ToolHeader
        code={CODE}
        kicker={`${CODE} · LEAGUE REFERENCE`}
        title={`${data.season} Standings`}
        backHref={`/${code}`}
        backLabel={`${CODE} Hub`}
      />

      <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 'var(--space-6)',
            padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-inset)', border: '2px solid var(--kff-line)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <Stat label="League" value={data.leagueName} />
            <Stat label="Teams" value={String(data.rows.length)} />
            <Stat label="Pulled from MFL" value={formatFetched(data.fetchedAt)} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            {hasDivisions && (
              <div style={{ display: 'flex', border: '2px solid var(--kff-line-2)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                {(['overall', 'division'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      padding: '7px 12px', border: 0, cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 600,
                      letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                      background: view === v ? 'color-mix(in srgb, var(--league-color) 22%, transparent)' : 'transparent',
                      color: view === v ? 'var(--kff-ink)' : 'var(--kff-ink-mute)',
                    }}
                  >
                    {v === 'overall' ? 'Overall' : 'Divisions'}
                  </button>
                ))}
              </div>
            )}
            <ActionButton onClick={handleCopy} primary>
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy for Excel'}
            </ActionButton>
            <ActionButton href={`/api/standings/${code}?format=csv`} download={`${code}-standings-${data.season}.csv`}>
              <Download size={15} /> CSV
            </ActionButton>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {groups.map((g) => (
            <section
              key={g.title ?? 'overall'}
              style={{ border: '2px solid var(--kff-line)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', overflow: 'hidden' }}
            >
              {g.title && (
                <header
                  className="kff-scanlines"
                  style={{
                    padding: 'var(--space-3) var(--space-5)',
                    borderBottom: '2px solid color-mix(in srgb, var(--league-color) 40%, transparent)',
                    background: 'radial-gradient(120% 120% at 85% 0%, color-mix(in srgb, var(--league-color) 20%, transparent) 0%, transparent 60%), var(--surface-inset)',
                  }}
                >
                  <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--kff-ink)' }}>
                    {g.title}
                  </h2>
                </header>
              )}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                  <thead>
                    <tr>
                      <Th align="center">{g.title ? 'Div' : 'Rk'}</Th>
                      <Th>Team</Th>
                      {!g.title && hasDivisions && <Th>Division</Th>}
                      <Th align="center">{showTies ? 'W-L-T' : 'W-L'}</Th>
                      <Th align="center">Pct</Th>
                      {hasDivisions && <Th align="center">Div</Th>}
                      <Th align="right">PF</Th>
                      <Th align="right">PA</Th>
                      <Th align="right">Avg PF</Th>
                      <Th align="right">Avg PA</Th>
                      <Th align="center">Strk</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r) => (
                      <tr key={r.franchiseId} style={{ borderTop: '1px solid var(--kff-line)' }}>
                        <Td align="center" mono strong>{g.title ? r.divisionRank : r.rank}</Td>
                        <Td strong>{r.team}</Td>
                        {!g.title && hasDivisions && <Td dim>{r.division}</Td>}
                        <Td align="center" mono>{showTies ? `${r.wins}-${r.losses}-${r.ties}` : record(r.wins, r.losses, 0)}</Td>
                        <Td align="center" mono>{pct(r.pct)}</Td>
                        {hasDivisions && <Td align="center" mono dim>{showTies ? `${r.divWins}-${r.divLosses}-${r.divTies}` : record(r.divWins, r.divLosses, 0)}</Td>}
                        <Td align="right" mono>{r.pointsFor.toFixed(2)}</Td>
                        <Td align="right" mono dim>{r.pointsAgainst.toFixed(2)}</Td>
                        <Td align="right" mono>{r.avgPointsFor.toFixed(1)}</Td>
                        <Td align="right" mono dim>{r.avgPointsAgainst.toFixed(1)}</Td>
                        <Td align="center" mono>
                          <span style={{ color: r.streak.startsWith('W') ? '#5FE08C' : r.streak.startsWith('L') ? '#FF8A7A' : 'var(--kff-ink-mute)' }}>
                            {r.streak || '—'}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <p style={{ marginTop: 'var(--space-5)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-mute)' }}>
          Copy for Excel puts the full standings on your clipboard with one value per cell, in overall order, including division and
          franchise ID columns for lookups.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xs, 10px)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--kff-ink-mute)' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--kff-ink)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

function ActionButton({
  children, onClick, href, download, primary,
}: { children: React.ReactNode; onClick?: () => void; href?: string; download?: string; primary?: boolean }) {
  const style: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', cursor: 'pointer',
    borderRadius: 'var(--radius-xs)', textDecoration: 'none',
    border: `2px solid ${primary ? 'var(--league-color)' : 'var(--kff-line-2)'}`,
    background: primary ? 'color-mix(in srgb, var(--league-color) 18%, transparent)' : 'transparent',
    color: 'var(--kff-ink)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 600,
    letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
  };
  return href ? (
    <a href={href} download={download} style={style}>{children}</a>
  ) : (
    <button onClick={onClick} style={style}>{children}</button>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  return (
    <th
      style={{
        textAlign: align, padding: '10px 14px', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xs, 10px)', fontWeight: 600,
        letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--kff-ink-mute)',
        background: 'var(--surface-inset)',
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children, align = 'left', mono, dim, strong,
}: { children: React.ReactNode; align?: 'left' | 'center' | 'right'; mono?: boolean; dim?: boolean; strong?: boolean }) {
  return (
    <td
      style={{
        textAlign: align, padding: '10px 14px', whiteSpace: 'nowrap',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 'var(--text-sm)',
        fontWeight: strong ? 600 : 400,
        color: dim ? 'var(--kff-ink-dim)' : 'var(--kff-ink)',
      }}
    >
      {children}
    </td>
  );
}
