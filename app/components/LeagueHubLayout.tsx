'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

export interface HubTool {
  name: string;
  desc: string;
  icon: ReactNode;
  href?: string;          // internal route — renders as a Next Link
  externalHref?: string;  // external link (e.g. a bylaws PDF) — renders as <a target="_blank">
  status: 'live' | 'soon';
}

export interface HubQuickLink {
  label: string;
  href: string;
}

interface LeagueHubLayoutProps {
  abbr: string;
  name: string;
  meta: string;
  themeColor: string; // e.g. 'var(--kn-kdl)'
  glowRgb: string;     // e.g. 'var(--glow-violet)' — must resolve to "r, g, b"
  tools: HubTool[];
  quickLinks: HubQuickLink[];
}

export default function LeagueHubLayout({ abbr, name, meta, themeColor, glowRgb, tools, quickLinks }: LeagueHubLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--kn-bg)' }}>
      <div className="scan-line" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors"
          style={{ fontFamily: 'var(--font-mono)', color: themeColor }}
        >
          <ArrowLeft size={16} />
          RETURN TO HUB
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-4">
            <div
              className="grid place-items-center"
              style={{
                width: '64px',
                height: '64px',
                background: `rgba(${glowRgb}, 0.12)`,
                border: `2px solid ${themeColor}`,
                boxShadow: `0 0 18px rgba(${glowRgb}, 0.4)`,
                fontFamily: 'var(--font-arcade)',
                fontSize: '18px',
                color: themeColor,
              }}
            >
              {abbr}
            </div>
            <h1
              className="font-black"
              style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: themeColor, textShadow: `0 0 24px rgba(${glowRgb}, 0.5)` }}
            >
              {abbr}
            </h1>
          </div>
          <div className="h-px w-48 mx-auto mb-4" style={{ background: `linear-gradient(90deg, transparent, rgba(${glowRgb}, 0.8), transparent)` }} />
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', letterSpacing: '0.02em', color: 'var(--kn-text)' }}>
            {name}
          </p>
          <p className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--kn-text-mute)' }}>
            {meta}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => {
            const isLive = tool.status === 'live';
            const content = (
              <div
                className="flex items-start gap-4 rounded-lg p-5 h-full transition-all duration-200"
                style={{
                  background: 'var(--kn-surface)',
                  border: '1px solid var(--kn-line)',
                  opacity: isLive ? 1 : 0.55,
                  cursor: isLive ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={(e) => {
                  if (!isLive) return;
                  e.currentTarget.style.borderColor = themeColor;
                  e.currentTarget.style.boxShadow = `0 0 24px rgba(${glowRgb}, 0.22)`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--kn-line)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span
                  className="flex-shrink-0 grid place-items-center"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--r-sm)',
                    background: isLive ? `rgba(${glowRgb}, 0.12)` : 'rgba(111,111,147,0.12)',
                    border: `2px solid ${isLive ? themeColor : 'var(--kn-text-faint)'}`,
                    color: isLive ? themeColor : 'var(--kn-text-faint)',
                  }}
                >
                  {tool.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: isLive ? 'var(--kn-text)' : 'var(--kn-text-mute)', marginBottom: '4px' }}>
                    {tool.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--kn-text-mute)', lineHeight: 1.4, marginBottom: '10px' }}>
                    {tool.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '9px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: isLive ? 'var(--kn-success)' : 'var(--kn-warning)',
                      background: isLive ? 'rgba(45,227,138,0.14)' : 'rgba(255,176,32,0.14)',
                      border: `1px solid ${isLive ? 'rgba(45,227,138,0.4)' : 'rgba(255,176,32,0.4)'}`,
                      borderRadius: 'var(--r-sm)',
                      padding: '4px 7px',
                    }}
                  >
                    {isLive && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--kn-success)', boxShadow: '0 0 6px var(--kn-success)' }} />
                    )}
                    {isLive ? 'Live' : 'Soon'}
                  </span>
                </div>
              </div>
            );

            if (tool.href) {
              return <Link key={tool.name} href={tool.href}>{content}</Link>;
            }
            if (tool.externalHref) {
              return (
                <a key={tool.name} href={tool.externalHref} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              );
            }
            return <div key={tool.name}>{content}</div>;
          })}
        </div>

        {/* Quick Links */}
        <div
          className="relative overflow-hidden rounded-lg p-6"
          style={{ background: 'var(--kn-surface)', border: `1px solid rgba(${glowRgb}, 0.35)`, boxShadow: 'var(--shadow-md)' }}
        >
          <span
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{ height: '3px', background: themeColor, boxShadow: `0 0 14px rgba(${glowRgb}, 0.85)` }}
          />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: themeColor, marginBottom: '16px' }}>
            Quick Links
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm"
                style={{ background: 'var(--kn-surface-3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--kn-line)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--kn-surface-3)'; }}
              >
                <span style={{ color: themeColor }}>→</span>
                <span style={{ color: 'var(--kn-text-dim)' }}>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
