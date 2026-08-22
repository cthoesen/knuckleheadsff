'use client';

import { NavBar } from './components/kff/NavBar';
import { Button } from './components/kff/Button';
import { LeagueCard } from './components/kff/LeagueCard';
import { HexScrollHero } from './components/kff/HexScrollHero';

const LEAGUES = [
  {
    code: 'KKL',
    name: 'Knuckleheads Keeper League',
    tagline: 'Lock your keepers, win the offseason.',
    playerSrc: '/images/shared/player-1.png',
    tools: ['Keeper Analyzer', 'Trade Analyzer', 'Constitution'],
    hubHref: '/kkl',
    mflHref: 'https://www47.myfantasyleague.com/2025/home/45267#0',
  },
  {
    code: 'KDL',
    name: 'Knuckleheads Dynasty League',
    tagline: 'Contracts, caps, and crowns.',
    playerSrc: '/images/shared/player-4.png',
    tools: ['Contract Manager', 'Unassigned Years', 'Tag Calculator', 'Trade Analyzer', 'Dead Money Tracker', 'Constitution'],
    hubHref: '/kdl',
    mflHref: 'https://www47.myfantasyleague.com/2025/home/68756#0',
  },
  {
    code: 'MMH',
    name: 'Monday Morning Hangover',
    tagline: 'Salary-cap warfare with a hangover.',
    playerSrc: '/images/shared/player-3.png',
    tools: ['Salary Cap Manager', 'Trade Analyzer', 'Constitution'],
    hubHref: '/mmh',
    mflHref: 'https://www47.myfantasyleague.com/2025/home/72966#0',
  },
  {
    code: 'BSB',
    name: 'Blood, Sweat, and Beers',
    tagline: 'Keepers, trades, and zero mercy.',
    playerSrc: '/images/shared/player-2.png',
    tools: ['Keeper Analyzer', 'Trade Analyzer', 'Constitution'],
    hubHref: '/bsb',
    mflHref: 'https://www47.myfantasyleague.com/2025/home/62908#0',
  },
];

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--kff-ink-mute)', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', lineHeight: 1, color: 'var(--kff-ink)' }}>{value}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <NavBar
        logoSrc="/images/shared/icons/knuckleheads-logo.svg"
        links={[{ label: 'Gallery', href: '/gallery' }]}
        leagues={[
          { code: 'KKL', name: 'Keeper League', href: '/kkl' },
          { code: 'KDL', name: 'Dynasty League', href: '/kdl' },
          { code: 'MMH', name: 'Monday Morning Hangover', href: '/mmh' },
          { code: 'BSB', name: 'Blood, Sweat & Beers', href: '/bsb' },
        ]}
        cta={{ label: 'Insert Coin ▸', href: '#leagues' }}
      />

      <main>
        {/* Hero */}
        <div className="hex-pin">
        <section
          className="kff-grid-bg kff-scanlines hex-pin-sticky"
          data-hex-sticky
          style={{ borderBottom: '2px solid var(--kff-line)', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 80% at 78% 30%, color-mix(in srgb, var(--kff-yellow) 12%, transparent) 0%, transparent 55%)', pointerEvents: 'none' }} />
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{
              position: 'relative', zIndex: 4,
              maxWidth: 'var(--container-xl)', margin: '0 auto',
              gap: 'var(--space-6)', alignItems: 'center', padding: 'var(--space-8) var(--space-6)',
            }}
          >
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--kff-yellow)', letterSpacing: '0.06em', marginBottom: 'var(--space-5)' }}>
                <span className="kff-blink">▮</span> PLAYER 1 · COMMISSIONER MODE
              </span>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(38px, 6vw, var(--text-5xl))', lineHeight: 1.02, letterSpacing: 'var(--tracking-tight)', textTransform: 'uppercase', color: 'var(--kff-ink)' }}>
                Dynasties are Built.<br />
                <span style={{ color: 'var(--kff-yellow)', textShadow: 'var(--glow-yellow)' }}>Keepers are Crowned.</span>
              </h1>
              <p style={{ margin: 'var(--space-5) 0 0', maxWidth: 560, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 'var(--text-lg)', lineHeight: 1.5, color: 'var(--kff-ink-dim)' }}>
                Built by the commissioner. Feared by the league.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
                <Button as="a" href="#leagues" variant="primary" size="lg">Select Your League ▸</Button>
                <Button as="a" href="/gallery" variant="ghost" size="lg">Browse Gallery</Button>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
                <Readout label="Leagues" value="4" />
                <Readout label="Live Tools" value="15" />
                <Readout label="Season" value="2026" />
              </div>
            </div>

            <div className="hidden md:flex" style={{ position: 'relative', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, color-mix(in srgb, var(--kff-yellow) 22%, transparent) 0%, transparent 70%)', filter: 'blur(8px)' }} />
              <HexScrollHero
                src="/images/shared/hero-pixels.webp"
                alt="Pixel-art receiver making a high-point catch over a defender"
                maxHeight={560}
                pinSelector=".hex-pin"
                pinPeak={0.5}
                releaseAt={0.5}
                className="kff-pixelated"
                style={{ position: 'relative', zIndex: 2, filter: 'drop-shadow(0 0 26px color-mix(in srgb, var(--kff-yellow) 32%, transparent))' }}
              />
            </div>
          </div>
        </section>
        </div>

        {/* League Command Centers */}
        <section id="leagues" style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-9) var(--space-6)' }}>
          <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-5)', marginBottom: 'var(--space-7)', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-2xs)', color: 'var(--kff-yellow)', letterSpacing: '0.06em' }}>SELECT YOUR LEAGUE</span>
              <h2 style={{ margin: '14px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-3xl)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--kff-ink)' }}>
                League Command Centers
              </h2>
            </div>
            <p style={{ margin: 0, maxWidth: 380, fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--kff-ink-dim)', lineHeight: 1.5 }}>
              Four leagues, each with its own hub of tools. Pick a cabinet and drop in.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
            {LEAGUES.map((lg) => (
              <LeagueCard key={lg.code} {...lg} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '2px solid var(--kff-line)', background: 'var(--kff-void)', textAlign: 'center', padding: 'var(--space-8) var(--space-6)' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-md)', color: 'var(--kff-yellow)', textShadow: 'var(--glow-yellow)' }}>
            <span className="kff-blink">★</span> READY PLAYER ONE
          </div>
          <p style={{ margin: 'var(--space-4) auto var(--space-5)', maxWidth: 460, color: 'var(--kff-ink-dim)', fontSize: 'var(--text-base)' }}>
            One hub for all four leagues. Run by the commissioner, powered by spite.
          </p>
          <Button as="a" href="/gallery" variant="primary">Browse the Gallery</Button>
          <div style={{ marginTop: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--kff-ink-mute)', letterSpacing: '0.04em' }}>
            KNUCKLEHEADSFF.COM · © 2026 · KKL · KDL · MMH · BSB
          </div>
        </footer>
      </main>
    </div>
  );
}
