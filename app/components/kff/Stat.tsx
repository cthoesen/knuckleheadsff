'use client';

import React from 'react';

type Tone = 'league' | 'yellow' | 'azure' | 'red' | 'green' | 'violet' | 'ink';
type Size = 'sm' | 'md' | 'lg';

interface StatProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  tone?: Tone;
  align?: 'left' | 'center' | 'right';
  glow?: boolean;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Stat — monospace readout of a number with a pixel-font label. The brand's
 * way of showing records, counts, caps, and any figure.
 */
export function Stat({
  label,
  value,
  unit,
  tone = 'league',
  align = 'left',
  glow = false,
  size = 'md',
  className = '',
  style = {},
}: StatProps) {
  const toneColor: Record<Tone, string> = {
    league: 'var(--league-color)',
    yellow: 'var(--kff-yellow)',
    azure: 'var(--kff-azure)',
    red: 'var(--kff-red)',
    green: 'var(--kff-green)',
    violet: 'var(--kff-violet)',
    ink: 'var(--kff-ink)',
  };
  const c = toneColor[tone] || 'var(--league-color)';
  const valueSize: Record<Size, string> = { sm: 'var(--text-xl)', md: 'var(--text-2xl)', lg: 'var(--text-3xl)' };

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: align, alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', ...style }}
    >
      <span
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'var(--pixel-2xs)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--kff-ink-mute)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: valueSize[size] || 'var(--text-2xl)',
          lineHeight: 1,
          color: c,
          textShadow: glow ? `0 0 8px color-mix(in srgb, ${c} 65%, transparent)` : 'none',
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '4px',
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: '0.5em', color: 'var(--kff-ink-dim)', letterSpacing: '0.05em' }}>
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}
