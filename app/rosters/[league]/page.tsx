'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Copy, Check, Download, Search } from 'lucide-react';
import { ToolHeader } from '../../components/kff/ToolHeader';
import { ActionButton, Stat, Td, Th, copyText, formatFetched, toTsv } from '../../components/kff/SheetTools';

type Cell = string | number;

interface Column {
  key: string;
  label: string;
  numeric?: boolean;
}

interface RostersData {
  league: string;
  season: string;
  pointsSeason: string | null;
  fetchedAt: string;
  teams: { id: string; name: string; players: number }[];
  columns: Column[];
  rows: Record<string, Cell>[];
}

const LEAGUES = ['kkl', 'kdl', 'mmh', 'bsb'];
const ALL = 'all';

export default function RostersPage() {
  const code = String(useParams<{ league: string }>().league ?? '').toLowerCase();
  const known = LEAGUES.includes(code);
  const CODE = code.toUpperCase();

  const [data, setData] = useState<RostersData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(ALL);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!known) {
      setError('Unknown league');
      setIsLoading(false);
      return;
    }
    async function load() {
      try {
        const res = await fetch(`/api/rosters/${code}`);
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'Failed to load rosters');
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [code, known]);

  /** What gets copied and downloaded: the chosen team, never the search. */
  const exportRows = useMemo(
    () => (!data ? [] : team === ALL ? data.rows : data.rows.filter((r) => r.franchiseId === team)),
    [data, team]
  );

  const shownRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return exportRows;
    return exportRows.filter((r) => [r.player, r.team, r.pos, r.nfl].some((v) => String(v).toLowerCase().includes(q)));
  }, [exportRows, search]);

  // Group on screen by team; the export stays one flat table.
  const groups = useMemo(() => {
    const map = new Map<string, Record<string, Cell>[]>();
    for (const r of shownRows) {
      const k = String(r.team);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    return [...map.entries()];
  }, [shownRows]);

  const teamName = team === ALL ? 'All Teams' : data?.teams.find((t) => t.id === team)?.name ?? '';

  const handleCopy = async () => {
    if (!data) return;
    const tsv = toTsv(data.columns.map((c) => c.label), exportRows.map((r) => data.columns.map((c) => r[c.key])));
    if (await copyText(tsv)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scope = `min-h-screen league-${known ? code : 'kkl'}`;

  if (isLoading)
    return (
      <div className={scope} style={{ background: 'var(--bg-base)' }}>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', fontFamily: 'var(--font-mono)', color: 'var(--league-color)' }}>
          <span className="kff-blink">LOADING ROSTERS…</span>
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className={scope} style={{ background: 'var(--bg-base)', padding: 'var(--space-8)' }}>
        <p style={{ color: 'var(--kff-red, #FF3B4E)', fontFamily: 'var(--font-mono)' }}>Error: {error}</p>
      </div>
    );

  // The team name is the section heading on screen, and the IDs are only there
  // for spreadsheet lookups.
  const screenColumns = data.columns.filter((c) => !['team', 'playerId', 'franchiseId'].includes(c.key));
  const csvHref = `/api/rosters/${code}?format=csv${team === ALL ? '' : `&team=${team}`}`;
  const controlStyle: React.CSSProperties = {
    padding: '8px 12px', borderRadius: 'var(--radius-xs)',
    background: 'var(--bg-base)', border: '2px solid var(--kff-line-2)',
    color: 'var(--kff-ink)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
  };

  return (
    <div className={scope} style={{ background: 'var(--bg-base)' }}>
      <ToolHeader
        code={CODE}
        kicker={`${CODE} · LEAGUE REFERENCE`}
        title={`${data.season} Rosters`}
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
            <Stat label="Teams" value={String(data.teams.length)} />
            <Stat label="Players" value={String(exportRows.length)} />
            <Stat label="Pulled from MFL" value={formatFetched(data.fetchedAt)} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={team} onChange={(e) => setTeam(e.target.value)} style={{ ...controlStyle, maxWidth: '100%' }} aria-label="Team">
              <option value={ALL}>All teams</option>
              {data.teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ActionButton onClick={handleCopy} primary>
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy for Excel'}
            </ActionButton>
            <ActionButton href={csvHref}>
              <Download size={15} /> CSV
            </ActionButton>
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: 320, marginBottom: 'var(--space-5)' }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--kff-ink-mute)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a player…"
            style={{ ...controlStyle, width: '100%', paddingLeft: 34 }}
          />
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {groups.map(([name, rows]) => (
            <section
              key={name}
              style={{ border: '2px solid var(--kff-line)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', overflow: 'hidden' }}
            >
              <header
                className="kff-scanlines"
                style={{
                  padding: 'var(--space-3) var(--space-5)',
                  borderBottom: '2px solid color-mix(in srgb, var(--league-color) 40%, transparent)',
                  background: 'radial-gradient(120% 120% at 85% 0%, color-mix(in srgb, var(--league-color) 20%, transparent) 0%, transparent 60%), var(--surface-inset)',
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10,
                }}
              >
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--kff-ink)' }}>
                  {name}
                </h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-mute)', whiteSpace: 'nowrap' }}>
                  {rows.length} players
                </span>
              </header>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                  <thead>
                    <tr>
                      {screenColumns.map((c) => (
                        <Th key={c.key} align={c.numeric ? 'right' : c.key === 'player' ? 'left' : 'center'}>{c.label}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={String(r.playerId)} style={{ borderTop: '1px solid var(--kff-line)' }}>
                        {screenColumns.map((c) => (
                          <Td
                            key={c.key}
                            align={c.numeric ? 'right' : c.key === 'player' ? 'left' : 'center'}
                            mono={c.numeric}
                            strong={c.key === 'player'}
                            dim={c.key !== 'player' && !c.numeric}
                          >
                            {c.key === 'injury' && r.injury ? (
                              <span style={{ color: '#FF8A7A' }}>{r.injury}</span>
                            ) : r[c.key] === '' ? (
                              <span style={{ color: 'var(--kff-ink-mute)' }}>—</span>
                            ) : (
                              r[c.key]
                            )}
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
          {groups.length === 0 && (
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-mute)' }}>
              No players match “{search}”.
            </p>
          )}
        </div>

        <p style={{ marginTop: 'var(--space-5)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-mute)' }}>
          Copy for Excel and CSV export {teamName === 'All Teams' ? 'every team' : teamName} as one table with one value per cell,
          including team, player ID and franchise ID columns for lookups. The search box only filters what is shown here.
        </p>
      </div>
    </div>
  );
}
