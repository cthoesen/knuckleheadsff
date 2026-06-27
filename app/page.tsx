'use client';

import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

interface LeagueHubCardProps {
  href: string;
  abbr: string;
  name: string;
  meta: string;
  themeColor: string;
  glowRgb: string;
  toolCount: number;
  mflHref: string;
}

// League hub card — themed crest, top neon keyline, scanlines, tool count
// badge, and a footer with an internal hub link plus an external MFL link.
// The MFL link uses a click-handler span (not a nested <a>) since Link
// already renders the card as an anchor.
function LeagueHubCard({ href, abbr, name, meta, themeColor, glowRgb, toolCount, mflHref }: LeagueHubCardProps) {
  return (
    <Link href={href} className="block">
      <div
        className="relative overflow-hidden rounded-lg p-6 transition-all duration-200"
        style={{
          background: 'linear-gradient(180deg, var(--kn-surface-2), var(--kn-surface))',
          border: `1px solid rgba(${glowRgb}, 0.4)`,
          boxShadow: 'var(--shadow-md)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = themeColor;
          e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 32px rgba(${glowRgb}, 0.28)`;
          e.currentTarget.style.transform = 'translateY(-5px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `rgba(${glowRgb}, 0.4)`;
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '3px', background: themeColor, boxShadow: `0 0 14px rgba(${glowRgb}, 0.85)` }}
        />
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'var(--scanlines)', opacity: 0.5 }}
        />

        <div className="relative flex items-start gap-4">
          <div
            className="flex-shrink-0 grid place-items-center"
            style={{
              width: '58px',
              height: '58px',
              background: `rgba(${glowRgb}, 0.12)`,
              border: `2px solid ${themeColor}`,
              boxShadow: `0 0 14px rgba(${glowRgb}, 0.4)`,
              fontFamily: 'var(--font-arcade)',
              fontSize: '14px',
              color: themeColor,
            }}
          >
            {abbr}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: themeColor }}>
                {abbr}
              </span>
              {toolCount > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--kn-text-on-neon)',
                    background: themeColor,
                    padding: '1px 7px',
                    borderRadius: 'var(--r-pill)',
                  }}
                >
                  {toolCount} tools
                </span>
              )}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '19px', color: 'var(--kn-text)' }}>
              {name}
            </h3>
            <p className="mt-1" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--kn-text-mute)' }}>
              {meta}
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-between mt-5">
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: themeColor }}>
            Open Hub <span aria-hidden="true">▸</span>
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(mflHref, '_blank', 'noopener,noreferrer');
            }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--kn-text-mute)', cursor: 'pointer', borderBottom: '1px dashed var(--kn-line-bright)' }}
          >
            MFL ↗
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--kn-bg)' }}>
      <div className="scan-line" />

      {/* Top Nav — Arcade After Dark */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,10,15,0.82)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--kn-line)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8" style={{ height: '72px' }}>
          <a href="/" className="flex items-center gap-3">
            <img
              src="/images/shared/icons/icon-knuckleheads.svg"
              alt="Knuckleheads crown"
              style={{
                width: '44px',
                height: '44px',
                transform: 'rotate(-30deg)',
                filter: 'drop-shadow(0 0 8px rgba(255,230,0,0.4))',
              }}
            />
            <span className="flex flex-col leading-none">
              <span
                style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'var(--kn-text)', letterSpacing: '0.02em' }}
              >
                KNUCKLEHEADS
              </span>
              <span
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--kn-yellow)', letterSpacing: '0.1em', marginTop: '2px' }}
              >
                FANTASY FOOTBALL
              </span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 ml-4">
            <a
              href="/"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--kn-yellow)', textShadow: 'var(--text-glow-yellow)' }}
            >
              Hub
            </a>
            <a
              href="#league-hub"
              className="inline-flex items-center gap-1"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--kn-text-dim)' }}
            >
              Leagues <span style={{ fontSize: '9px', opacity: 0.7 }}>▾</span>
            </a>
            <a
              href="#tools"
              className="inline-flex items-center gap-1"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--kn-text-dim)' }}
            >
              Tools <span style={{ fontSize: '9px', opacity: 0.7 }}>▾</span>
            </a>
            <a
              href="#"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--kn-text-dim)' }}
            >
              Updates
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Banner — Arcade After Dark */}
        <div
          className="relative mb-20 slide-in-up overflow-hidden rounded-2xl border"
          style={{
            borderColor: 'var(--kn-line)',
            background:
              'radial-gradient(1100px 520px at 78% -10%, rgba(0,240,255,0.10), transparent 60%),' +
              'radial-gradient(900px 460px at 10% 120%, rgba(255,45,120,0.10), transparent 60%),' +
              'var(--kn-bg)',
          }}
        >
          {/* Arcade grid floor */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'var(--grid-overlay)',
              backgroundSize: '46px 46px',
              maskImage: 'linear-gradient(to bottom, transparent, #000 35%, #000 70%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 35%, #000 70%, transparent)',
              opacity: 0.6,
            }}
          />
          {/* CRT scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'var(--scanlines)', opacity: 0.5 }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 items-center px-8 py-14 md:py-20">
            <div>
              <h1
                className="font-black"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(20px, 4.2vw, 40px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: 'var(--kn-text)',
                }}
              >
                Dynasties Are Built<br />
                <span style={{ color: 'var(--kn-yellow)', textShadow: 'var(--glow-lg-yellow)' }}>KEEPERS ARE CROWNED</span>
              </h1>

              <p
                className="mt-6 mb-8 max-w-[520px]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: 1.5,
                  color: 'var(--kn-text-dim)',
                }}
              >
                Built by the commissioner. Feared by the league.<br />
                Four leagues. One hub. Zero excuses.
              </p>

              <div className="flex gap-4 flex-wrap">
                <a
                  href="#league-hub"
                  className="inline-flex items-center justify-center gap-2 uppercase rounded-md px-8 py-4 transition"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '16px',
                    letterSpacing: '0.12em',
                    background: 'var(--kn-yellow)',
                    color: 'var(--kn-text-on-neon)',
                    border: '2px solid var(--kn-yellow)',
                    boxShadow: 'var(--glow-md-yellow)',
                  }}
                >
                  <span aria-hidden="true">▸</span> Enter the Hub
                </a>
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden md:grid place-items-center relative">
              <div
                className="absolute rounded-full"
                style={{
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(255,230,0,0.12), transparent 65%)',
                  filter: 'blur(6px)',
                }}
              />
              <img
                src="/images/shared/hero-pixels.webp"
                alt="Pixel-art receiver making a leaping catch"
                className="relative"
                style={{
                  width: 'min(320px, 28vw)',
                  filter: 'drop-shadow(0 0 24px rgba(255,230,0,0.25))',
                  animation: 'kn-float 5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* Player Image Grid - Links to League Sites */}
        <div id="quick-links" className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            {
              id: 1,
              image: '/images/shared/player-1.png',
              league: 'Knuckleheads Keeper League',
              code: 'KKL',
              url: 'https://www47.myfantasyleague.com/2025/home/45267#0',
              themeColor: 'var(--kn-kkl)',
              glowRgb: 'var(--glow-cyan)',
            },
            {
              id: 2,
              image: '/images/shared/player-2.png',
              league: 'Knuckleheads Dynasty League',
              code: 'KDL',
              url: 'https://www47.myfantasyleague.com/2025/home/68756#0',
              themeColor: 'var(--kn-kdl)',
              glowRgb: 'var(--glow-violet)',
            },
            {
              id: 3,
              image: '/images/shared/player-3.png',
              league: 'Monday Morning Hangover',
              code: 'MMH',
              url: 'https://www47.myfantasyleague.com/2025/home/72966#0',
              themeColor: 'var(--kn-mmh)',
              glowRgb: 'var(--glow-green)',
            },
            {
              id: 4,
              image: '/images/shared/player-4.png',
              league: 'Blood, Sweat, and Beers',
              code: 'BSB',
              url: 'https://www47.myfantasyleague.com/2025/home/62908#0',
              themeColor: 'var(--kn-bsb)',
              glowRgb: 'var(--glow-pink)',
            },
          ].map((slot, i) => (
            <a
              key={slot.id}
              href={slot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="float rounded-lg p-4 transition-all duration-200"
              style={{
                animationDelay: `${i * 0.2}s`,
                background: 'var(--kn-surface)',
                border: `1px solid rgba(${slot.glowRgb}, 0.35)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = slot.themeColor;
                e.currentTarget.style.boxShadow = `0 0 28px rgba(${slot.glowRgb}, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `rgba(${slot.glowRgb}, 0.35)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="aspect-square bg-linear-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-zinc-700/50">
                <img
                  src={slot.image}
                  alt={slot.league}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const placeholder = document.createElement('span');
                      placeholder.style.color = slot.themeColor;
                      placeholder.style.fontSize = '1.5rem';
                      placeholder.style.fontWeight = '700';
                      placeholder.textContent = slot.code;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <div
                className="font-bold text-lg mb-1"
                style={{ fontFamily: 'var(--font-display)', color: slot.themeColor, textShadow: `0 0 12px rgba(${slot.glowRgb}, 0.5)` }}
              >
                {slot.code}
              </div>
              <p className="text-sm leading-tight" style={{ color: 'var(--kn-text-mute)' }}>
                {slot.league}
              </p>
            </a>
          ))}
        </div>

        {/* League Hub Navigation */}
        <div id="league-hub" className="mb-20">
          <h2
            className="text-center mb-10"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '30px', color: 'var(--kn-text)', letterSpacing: '0.01em' }}
          >
            League Command Centers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <LeagueHubCard
              href="/kkl"
              abbr="KKL"
              name="Knuckleheads Keeper League"
              meta="Keeper analyzer, draft tools, and league management"
              themeColor="var(--kn-kkl)"
              glowRgb="var(--glow-cyan)"
              toolCount={3}
              mflHref="https://www47.myfantasyleague.com/2025/home/45267#0"
            />
            <LeagueHubCard
              href="/kdl"
              abbr="KDL"
              name="Knuckleheads Dynasty League"
              meta="Contract manager, salary cap tracker, and tag calculator"
              themeColor="var(--kn-kdl)"
              glowRgb="var(--glow-violet)"
              toolCount={6}
              mflHref="https://www47.myfantasyleague.com/2025/home/68756#0"
            />
            <LeagueHubCard
              href="/mmh"
              abbr="MMH"
              name="Monday Morning Hangover"
              meta="Salary cap manager, contract optimizer, and auction tools"
              themeColor="var(--kn-mmh)"
              glowRgb="var(--glow-green)"
              toolCount={3}
              mflHref="https://www47.myfantasyleague.com/2025/home/72966#0"
            />
            <LeagueHubCard
              href="/bsb"
              abbr="BSB"
              name="Blood, Sweat, and Beers"
              meta="Keeper analyzer, draft strategy, and matchup predictions"
              themeColor="var(--kn-bsb)"
              glowRgb="var(--glow-pink)"
              toolCount={3}
              mflHref="https://www47.myfantasyleague.com/2025/home/62908#0"
            />
          </div>
        </div>

        {/* Utilities */}
        <div id="tools" className="mb-12">
          <h2
            className="text-center mb-10"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '30px', color: 'var(--kn-text)', letterSpacing: '0.01em' }}
          >
            Utilities
          </h2>
          <div className="max-w-2xl mx-auto">
            <Link href="/gallery">
              <div
                className="flex items-center gap-4 rounded-lg p-4 transition-all duration-200"
                style={{ background: 'var(--kn-surface)', border: '1px solid var(--kn-line)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--kn-violet)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(168, 85, 247, 0.22)';
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
                  style={{ width: '46px', height: '46px', background: 'rgba(168, 85, 247, 0.12)', border: '2px solid var(--kn-violet)', borderRadius: 'var(--r-sm)', color: 'var(--kn-violet)' }}
                >
                  <ImageIcon size={20} />
                </span>
                <span className="flex-1 min-w-0">
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--kn-text)', marginBottom: '3px' }}>
                    Image Gallery
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--kn-text-mute)' }}>
                    Browse league assets with lightbox viewer
                  </span>
                </span>
                <span
                  className="flex-shrink-0 inline-flex items-center gap-1"
                  style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'var(--kn-success)', background: 'rgba(45, 227, 138, 0.14)', border: '1px solid rgba(45, 227, 138, 0.4)',
                    borderRadius: 'var(--r-sm)', padding: '4px 7px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--kn-success)', boxShadow: '0 0 6px var(--kn-success)' }} />
                  Live
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-12" style={{ borderTop: '1px solid var(--kn-line)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.08em', color: 'var(--kn-text-mute)' }}>
            POWERED BY NEXT.JS // DEPLOYED ON VERCEL // ARCADE AFTER DARK
          </p>
        </div>
      </main>
    </div>
  );
}
