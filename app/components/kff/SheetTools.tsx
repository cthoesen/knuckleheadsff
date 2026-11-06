'use client';

import React from 'react';

/**
 * Small pieces shared by the spreadsheet-style league pages (standings,
 * rosters): a stat label, action buttons, table cells and clipboard copy.
 */

export async function copyText(text: string) {
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

/** Excel splits pasted text on tabs; strip any that would shift a cell. */
export function toTsv(headers: string[], rows: (string | number)[][]) {
  const clean = (v: string | number) => String(v).replace(/[\t\r\n]+/g, ' ');
  return [headers, ...rows].map((cols) => cols.map(clean).join('\t')).join('\n');
}

export function formatFetched(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xs, 10px)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--kff-ink-mute)' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--kff-ink)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

export function ActionButton({
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

export function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
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

export function Td({
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
