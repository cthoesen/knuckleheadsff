'use client';

import Link from 'next/link';
import { Trophy, Crown, DollarSign, Flame, Image as ImageIcon } from 'lucide-react';

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
              <span
                className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded"
                style={{
                  fontFamily: 'var(--font-arcade)',
                  fontSize: '10px',
                  color: 'var(--kn-cyan)',
                  letterSpacing: '0.06em',
                  border: '1.5px solid rgba(0,240,255,0.4)',
                  background: 'rgba(0,240,255,0.08)',
                }}
              >
                <span aria-hidden="true">●</span> COMMISSIONER HQ · EST. 2019
              </span>

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
                <a
                  href="#quick-links"
                  className="inline-flex items-center justify-center gap-2 uppercase rounded-md px-8 py-4 transition"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '16px',
                    letterSpacing: '0.12em',
                    background: 'transparent',
                    color: 'var(--kn-cyan)',
                    border: '2px solid var(--kn-line-bright)',
                  }}
                >
                  View Standings
                </a>
              </div>
            </div>

            {/* Crown mark */}
            <div className="hidden md:grid place-items-center relative">
              <div
                className="absolute rounded-full"
                style={{
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(255,230,0,0.16), transparent 65%)',
                  filter: 'blur(6px)',
                }}
              />
              <img
                src="/images/shared/icons/icon-knuckleheads.svg"
                alt="Knuckleheads crown"
                className="relative"
                style={{
                  width: 'min(340px, 30vw)',
                  filter: 'drop-shadow(0 0 28px rgba(255,230,0,0.4))',
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
              color: 'cyan'
            },
            { 
              id: 2, 
              image: '/images/shared/player-2.png', 
              league: 'Knuckleheads Dynasty League',
              code: 'KDL',
              url: 'https://www47.myfantasyleague.com/2025/home/68756#0',
              color: 'violet'
            },
            { 
              id: 3, 
              image: '/images/shared/player-3.png', 
              league: 'Monday Morning Hangover',
              code: 'MMH',
              url: 'https://www47.myfantasyleague.com/2025/home/72966#0',
              color: 'emerald'
            },
            { 
              id: 4, 
              image: '/images/shared/player-4.png', 
              league: 'Blood, Sweat, and Beers',
              code: 'BSB',
              url: 'https://www47.myfantasyleague.com/2025/home/62908#0',
              color: 'rose'
            },
          ].map((slot, i) => (
            <a 
              key={slot.id}
              href={slot.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`cyber-card card-${slot.code.toLowerCase()} group cursor-pointer float`}
              style={{ animationDelay: `${i * 0.2}s` }}
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
                      placeholder.className = `text-${slot.color}-400 text-2xl font-bold`;
                      placeholder.textContent = slot.code;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <div className={`text-${slot.color}-400 font-bold text-lg mb-1 font-['Orbitron'] glow-${slot.color}`}>
                {slot.code}
              </div>
              <p className="text-zinc-400 text-sm leading-tight">
                {slot.league}
              </p>
            </a>
          ))}
        </div>

        {/* League Hub Navigation */}
        <div id="league-hub" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-300">
            LEAGUE COMMAND CENTERS
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* KKL Hub */}
            <Link href="/kkl">
              <div className="cyber-card card-kkl group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                    <Trophy size={32} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-400 glow-cyan">KKL</h3>
                    <p className="text-zinc-400 text-sm">Knuckleheads Keeper</p>
                  </div>
                </div>
                <p className="text-zinc-300 mb-3">
                  Keeper analyzer, draft tools, and league management
                </p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-mono">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  3 TOOLS ACTIVE
                </div>
              </div>
            </Link>

            {/* KDL Hub */}
            <Link href="/kdl">
              <div className="cyber-card card-kdl group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors">
                    <Crown size={32} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-violet-400 glow-violet">KDL</h3>
                    <p className="text-zinc-400 text-sm">Knuckleheads Dynasty</p>
                  </div>
                </div>
                <p className="text-zinc-300 mb-3">
                  Contract manager, salary cap tracker, and tag calculator
                </p>
                <div className="flex items-center gap-2 text-violet-400 text-sm font-mono">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                  6 TOOLS ACTIVE
                </div>
              </div>
            </Link>

            {/* MMH Hub */}
            <Link href="/mmh">
              <div className="cyber-card card-mmh group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                    <DollarSign size={32} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-400 glow-emerald">MMH</h3>
                    <p className="text-zinc-400 text-sm">Monday Morning Hangover</p>
                  </div>
                </div>
                <p className="text-zinc-300 mb-3">
                  Salary cap manager, contract optimizer, and auction tools
                </p>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  3 TOOLS ACTIVE
                </div>
              </div>
            </Link>

            {/* BSB Hub */}
            <Link href="/bsb">
              <div className="cyber-card card-bsb group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-rose-500/10 rounded-xl group-hover:bg-rose-500/20 transition-colors">
                    <Flame size={32} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-rose-500 glow-rose">BSB</h3>
                    <p className="text-zinc-400 text-sm">Blood, Sweat, and Beers</p>
                  </div>
                </div>
                <p className="text-zinc-300 mb-3">
                  Keeper analyzer, draft strategy, and matchup predictions
                </p>
                <div className="flex items-center gap-2 text-rose-500 text-sm font-mono">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                  3 TOOLS ACTIVE
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Utilities */}
        <div id="tools" className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-300">
            UTILITIES
          </h2>
          <div className="max-w-2xl mx-auto">
            <Link href="/gallery">
              <div className="cyber-card border-violet-500/30 hover:border-violet-500 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors">
                    <ImageIcon size={32} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-violet-400">Image Gallery</h3>
                    <p className="text-zinc-400">Browse league assets with lightbox viewer</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm font-mono tracking-wider">
            POWERED BY NEXT.JS // DEPLOYED ON VERCEL // CYBERPUNK AESTHETICS
          </p>
        </div>
      </main>
    </div>
  );
}
