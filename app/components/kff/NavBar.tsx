'use client';

import React from 'react';
import { Button } from './Button';

interface NavLink { label: string; href: string; }
interface NavLeague { code: string; name: string; href: string; }
interface NavCta { label: string; href: string; }

interface NavBarProps {
  logoSrc?: string;
  brandTop?: string;
  brandBottom?: string;
  links?: NavLink[];
  leagues?: NavLeague[];
  cta?: NavCta;
  activeHref?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * NavBar — the knuckleheadsff.com top navigation. Tilted pixel-crown logo +
 * two-line wordmark, links, a Leagues dropdown, and a primary CTA.
 */
export function NavBar({
  logoSrc,
  brandTop = 'Knuckleheads',
  brandBottom = 'Fantasy Football',
  links = [],
  leagues = [],
  cta,
  activeHref,
  className = '',
  style = {},
}: NavBarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className={className}
      style={{
        position: 'sticky', top: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--space-5)',
        padding: '0 var(--space-6)', height: 72,
        background: 'color-mix(in srgb, var(--kff-void) 82%, transparent)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '2px solid var(--kff-line)',
        ...style,
      }}
    >
      {/* Brand lockup */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Knuckleheads logo"
            className="kff-pixelated"
            style={{
              width: 'clamp(42px, 12vw, 65px)', height: 'clamp(42px, 12vw, 65px)',
              filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--kff-yellow) 60%, transparent))',
            }}
          />
        )}
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(var(--pixel-sm), 3.4vw, var(--pixel-md))', color: 'var(--kff-yellow)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {brandTop}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(var(--text-2xs), 2.8vw, var(--text-sm))', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--kff-ink-dim)', marginTop: 7, whiteSpace: 'nowrap' }}>
            {brandBottom}
          </span>
        </span>
      </a>

      {/* Right cluster */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        {leagues.length > 0 && (
          <div className="hidden md:block" style={{ position: 'relative' }} onMouseLeave={() => setOpen(false)}>
            <button
              onMouseEnter={() => setOpen(true)}
              onClick={() => setOpen((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase', color: open ? 'var(--kff-yellow)' : 'var(--kff-ink-dim)', padding: '6px 0',
                transition: 'color var(--dur-base)',
              }}
            >
              Leagues <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base)' }}>▾</span>
            </button>
            {open && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0, minWidth: 220,
                  background: 'var(--surface-card)', border: '2px solid var(--kff-line-2)', borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-3)', padding: '8px', display: 'flex', flexDirection: 'column', gap: 2,
                }}
              >
                {leagues.map((lg) => (
                  <a
                    key={lg.code}
                    href={lg.href}
                    className={`league-${lg.code.toLowerCase()}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none', color: 'var(--kff-ink)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)',
                      transition: 'background var(--dur-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'color-mix(in srgb, var(--league-color) 14%, transparent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: 'var(--league-color)', boxShadow: '0 0 7px var(--league-color)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--league-color)', fontSize: 'var(--text-xs)' }}>{lg.code}</span>
                    <span style={{ color: 'var(--kff-ink-dim)' }}>{lg.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="hidden md:inline"
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase', textDecoration: 'none', padding: '6px 0',
              color: activeHref === l.href ? 'var(--kff-yellow)' : 'var(--kff-ink-dim)',
              transition: 'color var(--dur-base)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--kff-yellow)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = activeHref === l.href ? 'var(--kff-yellow)' : 'var(--kff-ink-dim)')}
          >
            {l.label}
          </a>
        ))}

        {cta && (
          <span className="hidden md:inline-flex">
            <Button as="a" href={cta.href} variant="primary" size="sm">
              {cta.label}
            </Button>
          </span>
        )}
      </nav>
    </header>
  );
}
