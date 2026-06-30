'use client';

import React from 'react';
import { Badge } from './Badge';
import { Button } from './Button';

interface LeagueCardProps {
  code: string;
  name: string;
  tagline?: string;
  playerSrc?: string;
  tools?: string[];
  hubHref?: string;
  mflHref?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * LeagueCard — a League Command Center tile. League-colored pixel bezel,
 * full name + tagline + active-tool count badge in the header, a featured
 * pixel-art player portrait below, and two links (Hub + MFL). The
 * `.league-<code>` scope themes it via --league-color.
 */
export function LeagueCard({
  code,
  name,
  tagline,
  playerSrc,
  tools = [],
  hubHref = '#',
  mflHref = '#',
  className = '',
  style = {},
}: LeagueCardProps) {
  const scope = `league-${(code || '').toLowerCase()}`;
  const corner = 8;
  const clip = `polygon(0 ${corner}px,${corner}px ${corner}px,${corner}px 0,calc(100% - ${corner}px) 0,calc(100% - ${corner}px) ${corner}px,100% ${corner}px,100% calc(100% - ${corner}px),calc(100% - ${corner}px) calc(100% - ${corner}px),calc(100% - ${corner}px) 100%,${corner}px 100%,${corner}px calc(100% - ${corner}px),0 calc(100% - ${corner}px))`;

  return (
    <div
      className={`${scope} ${className}`}
      style={{
        background: 'var(--league-color)',
        clipPath: clip,
        padding: 2,
        filter: 'drop-shadow(0 0 9px color-mix(in srgb, var(--league-color) 55%, transparent))',
        transition: 'filter var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = 'drop-shadow(0 0 18px var(--league-color))';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'drop-shadow(0 0 9px color-mix(in srgb, var(--league-color) 55%, transparent))';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ clipPath: clip, background: 'var(--surface-card)', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header: identity */}
        <div
          className="kff-scanlines"
          style={{
            position: 'relative',
            padding: 'var(--space-5)',
            background:
              'radial-gradient(120% 120% at 80% 0%, color-mix(in srgb, var(--league-color) 26%, transparent) 0%, transparent 60%), var(--surface-inset)',
            borderBottom: '2px solid color-mix(in srgb, var(--league-color) 40%, transparent)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-md)', color: 'var(--league-color)', letterSpacing: '0.02em' }}>{code}</span>
            <Badge tone="league" variant="outline" dot>
              {tools.length} {tools.length === 1 ? 'Tool' : 'Tools'}
            </Badge>
          </div>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--kff-ink)', lineHeight: 1.15, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>
            {name}
          </h3>
          {tagline && <p style={{ margin: '7px 0 0', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--kff-ink-dim)', lineHeight: 1.35 }}>{tagline}</p>}
        </div>

        {/* Body: portrait + actions */}
        <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1 }}>
          {playerSrc && (
            <div
              style={{
                position: 'relative', width: '100%', height: 168, overflow: 'hidden',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid color-mix(in srgb, var(--league-color) 45%, transparent)',
                background: 'radial-gradient(80% 80% at 50% 20%, color-mix(in srgb, var(--league-color) 22%, transparent) 0%, var(--surface-inset) 70%)',
              }}
            >
              <img
                src={playerSrc}
                alt={`${name} mascot`}
                className="kff-pixelated"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, color-mix(in srgb, var(--surface-card) 85%, transparent) 100%)' }} />
              <span style={{ position: 'absolute', left: 10, bottom: 9, fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: '#fff', textShadow: '0 0 5px var(--league-color), 0 1px 2px #000', letterSpacing: '0.04em' }}>PLAYER SELECT</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 4 }}>
            <Button as="a" href={hubHref} variant="league" size="sm" style={{ flex: 1 }}>Enter Hub ▸</Button>
            <Button as="a" href={mflHref} target="_blank" rel="noopener noreferrer" variant="ghost" size="sm" rightIcon={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>↗</span>}>MFL</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
