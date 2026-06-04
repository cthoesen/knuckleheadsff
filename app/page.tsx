'use client';

import Link from 'next/link';
import { Trophy, Crown, DollarSign, Flame, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen cyber-bg">
      <div className="scan-line" />
      
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Banner */}
        <div className="relative mb-20 slide-in-up overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60">

          {/* Radial glows */}
          <div className="absolute -top-16 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle cyber grid */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(0,200,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
          />

          {/* Corner accent brackets */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-violet-500/40 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-violet-500/40 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 rounded-br-2xl pointer-events-none" />

          {/* Logo — desktop: large watermark, left side, behind text */}
          <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-[30deg] z-10 opacity-[0.22] pointer-events-none">
            <img
              src="/images/shared/icons/icon-knuckleheads.svg"
              alt=""
              className="w-[30rem] h-auto"
            />
          </div>

          {/* Logo — mobile: large watermark, centered, fills banner behind text */}
          <div className="md:hidden absolute inset-0 flex items-center justify-center z-10 opacity-[0.18] pointer-events-none">
            <img
              src="/images/shared/icons/icon-knuckleheads.svg"
              alt=""
              className="w-[92%] h-auto"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 px-8 py-14 md:py-20 text-center">

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 glitch-text leading-tight">
              <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                <span className="md:hidden">KNUCKLE<br/>HEADS<br/>FANTASY FOOTBALL</span>
                <span className="hidden md:inline">KNUCKLEHEADS FANTASY FOOTBALL</span>
              </span>
            </h1>

            <div className="h-px w-64 mx-auto bg-linear-to-r from-transparent via-cyan-400 to-transparent mt-7 mb-6" />

            <p className="text-2xl md:text-3xl text-purple-300 font-semibold tracking-wide">
              ASSET REPOSITORY // CYBERPUNK EDITION
            </p>
            <p className="text-zinc-500 mt-3 text-sm font-mono tracking-widest uppercase">
              Powered by Next.js • Deployed on Vercel
            </p>
          </div>
        </div>

        {/* Player Image Grid - Links to League Sites */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
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
        <div className="mb-20">
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
        <div className="mb-12">
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
