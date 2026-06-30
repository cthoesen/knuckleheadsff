'use client';

import React from 'react';

type Tone = 'league' | 'yellow' | 'azure' | 'red' | 'green' | 'violet' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  variant?: 'solid' | 'outline';
  pulse?: boolean;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Badge — small pixel-label status/count chip. Pixel font, uppercase.
 * Tones map onto the cartridge palette; `league` follows --league-color.
 */
export function Badge({
  children,
  tone = 'league',
  variant = 'solid',
  pulse = false,
  dot = false,
  className = '',
  style = {},
}: BadgeProps) {
  const toneColor: Record<Tone, string> = {
    league: 'var(--league-color)',
    yellow: 'var(--kff-yellow)',
    azure: 'var(--kff-azure)',
    red: 'var(--kff-red)',
    green: 'var(--kff-green)',
    violet: 'var(--kff-violet)',
    neutral: 'var(--kff-ink-dim)',
  };
  const c = toneColor[tone] || 'var(--league-color)';

  const isSolid = variant === 'solid';
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-pixel)',
    fontSize: 'var(--pixel-2xs)',
    lineHeight: 1,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: '5px 8px 4px',
    borderRadius: 'var(--radius-xs)',
    border: '2px solid',
    whiteSpace: 'nowrap',
    background: isSolid ? c : 'transparent',
    color: isSolid ? 'var(--kff-ink-inv)' : c,
    borderColor: c,
    boxShadow: isSolid ? `0 0 8px color-mix(in srgb, ${c} 50%, transparent)` : 'none',
    ...style,
  };

  return (
    <span className={`${pulse ? 'kff-pulse ' : ''}${className}`} style={base}>
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isSolid ? 'var(--kff-ink-inv)' : c,
            boxShadow: isSolid ? 'none' : `0 0 6px ${c}`,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
