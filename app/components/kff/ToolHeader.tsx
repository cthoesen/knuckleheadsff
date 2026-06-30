'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ToolHeaderProps {
  code: string;        // league abbreviation for the pixel crest
  kicker: string;      // pixel-font eyebrow label
  title: string;       // Orbitron page title
  backHref?: string;
  backLabel?: string;
}

/**
 * ToolHeader — the arcade header band shared by every league tool page.
 * Renders inside a .league-{code} scope so it themes via --league-color.
 */
export function ToolHeader({ code, kicker, title, backHref = '/', backLabel = 'Return to Hub' }: ToolHeaderProps) {
  return (
    <header
      className="kff-grid-bg kff-scanlines"
      style={{ position: 'relative', borderBottom: '2px solid var(--kff-line)', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(90% 100% at 12% 20%, color-mix(in srgb, var(--league-color) 15%, transparent) 0%, transparent 60%)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 4, maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-5) var(--space-6) var(--space-6)' }}>
        <a
          href={backHref}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px', marginBottom: 'var(--space-5)',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', textDecoration: 'none',
            color: 'var(--league-color)', transition: 'text-shadow var(--dur-base)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textShadow = 'var(--glow-md)')}
          onMouseLeave={(e) => (e.currentTarget.style.textShadow = 'none')}
        >
          <ArrowLeft size={14} /> {backLabel}
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div
            style={{
              flexShrink: 0, width: 60, height: 60, display: 'grid', placeItems: 'center',
              background: 'color-mix(in srgb, var(--league-color) 12%, var(--surface-inset))',
              border: '2px solid var(--league-color)',
              boxShadow: 'var(--glow-md)',
              fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-sm)', color: 'var(--league-color)',
            }}
          >
            {code}
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--league-color)', letterSpacing: '0.06em' }}>
              {kicker}
            </span>
            <h1 style={{ margin: '10px 0 0', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3.4vw, 36px)', lineHeight: 1.05, letterSpacing: 'var(--tracking-tight)', textTransform: 'uppercase', color: 'var(--kff-ink)' }}>
              {title}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
