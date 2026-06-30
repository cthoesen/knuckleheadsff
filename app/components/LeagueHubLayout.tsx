'use client';

import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from './kff/Badge';

export interface HubTool {
  name: string;
  desc: string;
  icon: ReactNode;
  href?: string;          // internal route — renders as an anchor
  externalHref?: string;  // external link (e.g. a bylaws PDF)
  status: 'live' | 'soon';
}

export interface HubQuickLink {
  label: string;
  href: string;
}

interface LeagueHubLayoutProps {
  code: string;     // 'KKL' | 'KDL' | 'MMH' | 'BSB' — drives the .league-* scope
  name: string;
  meta: string;
  tools: HubTool[];
  quickLinks: HubQuickLink[];
}

export default function LeagueHubLayout({ code, name, meta, tools, quickLinks }: LeagueHubLayoutProps) {
  const scope = `league-${code.toLowerCase()}`;

  return (
    <div className={scope} style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Header band */}
      <header
        className="kff-grid-bg kff-scanlines"
        style={{ position: 'relative', borderBottom: '2px solid var(--kff-line)', overflow: 'hidden' }}
      >
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(90% 100% at 12% 20%, color-mix(in srgb, var(--league-color) 16%, transparent) 0%, transparent 60%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 4, maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-6) var(--space-6) var(--space-7)' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px', marginBottom: 'var(--space-6)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', textDecoration: 'none',
              color: 'var(--league-color)', transition: 'text-shadow var(--dur-base)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textShadow = 'var(--glow-md)')}
            onMouseLeave={(e) => (e.currentTarget.style.textShadow = 'none')}
          >
            <ArrowLeft size={14} /> Return to Hub
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            {/* Pixel crest */}
            <div
              style={{
                flexShrink: 0, width: 84, height: 84, display: 'grid', placeItems: 'center',
                background: 'color-mix(in srgb, var(--league-color) 12%, var(--surface-inset))',
                border: '2px solid var(--league-color)',
                boxShadow: 'var(--glow-md)',
                fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-md)', color: 'var(--league-color)',
              }}
            >
              {code}
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--league-color)', letterSpacing: '0.06em' }}>
                LEAGUE COMMAND CENTER
              </span>
              <h1 style={{ margin: '12px 0 0', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.05, letterSpacing: 'var(--tracking-tight)', textTransform: 'uppercase', color: 'var(--kff-ink)' }}>
                {name}
              </h1>
              <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--kff-ink-mute)', letterSpacing: '0.04em' }}>
                {meta}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tools */}
      <section style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-8) var(--space-6) 0' }}>
        <header style={{ marginBottom: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--league-color)', letterSpacing: '0.06em' }}>COMMISSIONER KIT</span>
          <h2 style={{ margin: '12px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--kff-ink)' }}>
            Tools &amp; Rituals
          </h2>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
          {tools.map((tool) => {
            const isLive = tool.status === 'live';
            const content = (
              <div
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', height: '100%',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--kff-line)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-5)',
                  opacity: isLive ? 1 : 0.55,
                  cursor: isLive ? 'pointer' : 'not-allowed',
                  transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  if (!isLive) return;
                  e.currentTarget.style.borderColor = 'var(--league-color)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px var(--league-color), 0 0 22px color-mix(in srgb, var(--league-color) 30%, transparent), var(--shadow-3)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--kff-line)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span
                  style={{
                    flexShrink: 0, width: 46, height: 46, display: 'grid', placeItems: 'center',
                    borderRadius: 'var(--radius-sm)',
                    background: isLive ? 'color-mix(in srgb, var(--league-color) 14%, transparent)' : 'color-mix(in srgb, var(--kff-ink-mute) 12%, transparent)',
                    border: `2px solid ${isLive ? 'var(--league-color)' : 'var(--kff-line-2)'}`,
                    color: isLive ? 'var(--league-color)' : 'var(--kff-ink-mute)',
                  }}
                >
                  {tool.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: isLive ? 'var(--kff-ink)' : 'var(--kff-ink-dim)' }}>
                    {tool.name}
                  </h3>
                  <p style={{ margin: '6px 0 12px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--kff-ink-dim)', lineHeight: 1.4 }}>
                    {tool.desc}
                  </p>
                  {isLive
                    ? <Badge tone="green" variant="outline" dot>Live</Badge>
                    : <Badge tone="yellow" variant="outline">Soon</Badge>}
                </div>
              </div>
            );

            if (tool.href) {
              return <a key={tool.name} href={tool.href} style={{ textDecoration: 'none' }}>{content}</a>;
            }
            if (tool.externalHref) {
              return <a key={tool.name} href={tool.externalHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a>;
            }
            return <div key={tool.name}>{content}</div>;
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section id="quick-links" style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-8) var(--space-6) var(--space-9)' }}>
        <div
          style={{
            position: 'relative', overflow: 'hidden',
            background: 'var(--surface-card)',
            border: '1px solid color-mix(in srgb, var(--league-color) 35%, transparent)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-5)',
            boxShadow: 'var(--shadow-2)',
          }}
        >
          <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--league-color)', boxShadow: 'var(--glow-md)', pointerEvents: 'none' }} />
          <h2 style={{ margin: '0 0 var(--space-4)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--league-color)' }}>
            Quick Links
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-inset)', textDecoration: 'none',
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--kff-ink-dim)',
                  transition: 'background var(--dur-fast), color var(--dur-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--league-color) 14%, var(--surface-inset))'; e.currentTarget.style.color = 'var(--kff-ink)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-inset)'; e.currentTarget.style.color = 'var(--kff-ink-dim)'; }}
              >
                <span style={{ color: 'var(--league-color)', fontFamily: 'var(--font-mono)' }}>▸</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
