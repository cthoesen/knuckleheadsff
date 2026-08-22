'use client';

import React, { useEffect, useRef, useState } from 'react';

interface HexScrollHeroProps {
  src: string;
  alt: string;
  /** Display cap in CSS px (matches the old <img> maxHeight). */
  maxHeight?: number;
  /** Hex cell radius in CSS px. Smaller = more, finer shards. */
  hexRadius?: number;
  /** How far shards fly, as a fraction of the frame's long edge. Higher = more dramatic. */
  spread?: number;
  /**
   * CSS selector of a scroll-pin container. When present and taller than the
   * viewport, progress is driven by scrolling *through* the pin — the hero holds
   * in place while the shatter plays, then releases. Falls back to plain window
   * scroll when absent (or on mobile, where the pin container isn't tall).
   */
  pinSelector?: number;
  /** Max progress the pin drives to (0–1). 1 = fully shatter in place; lower leaves the image partly intact as it scrolls away. */
  pinPeak?: number;
  /**
   * Fraction of the dispersion arc completed at the moment the pin releases
   * and the page resumes scrolling (0–1, pin mode only). 1 (default) keeps the
   * old behavior: dispersion finishes exactly as the pin lets go. 0.75 starts
   * the page scrolling once the shatter is three-quarters done, and the
   * remaining quarter plays out as the hero scrolls away.
   */
  releaseAt?: number;
  /** Px of page scroll needed to reach full dispersion, in fallback (non-pin) mode. Defaults to 80% of viewport height. */
  scrollRange?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Deterministic per-cell pseudo-random in [0,1) so redraws/resizes stay stable. */
function rand(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface Cell {
  cx: number;
  cy: number;
  dx: number; // unit direction x (outward from image center)
  dy: number; // unit direction y
  dist: number; // per-cell spread multiplier
  rot: number; // per-cell target rotation (rad)
}

/**
 * HexScrollHero — the hero art, shattered into hexagons that spread outward as
 * you scroll and reassemble as you scroll back up. Renders to a <canvas> from
 * the source image (pixel-crisp, no smoothing). Honors prefers-reduced-motion
 * by falling back to a plain <img>.
 */
export function HexScrollHero({
  src,
  alt,
  maxHeight = 560,
  hexRadius = 22,
  spread = 0.5,
  pinSelector = 0.75,
  pinPeak = 0.5,
  releaseAt = 0.5,
  scrollRange,
  className = '',
  style = {},
}: HexScrollHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const cellsRef = useRef<Cell[]>([]);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [reduced, setReduced] = useState(false);

  // Detect reduced-motion preference (and react to changes).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    const img = new Image();
    imgElRef.current = img;

    const hexPath = (px: number, py: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i);
        const x = px + r * Math.cos(a);
        const y = py + r * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const build = () => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const h = Math.min(maxHeight, ih);
      const scale = h / ih;
      const w = iw * scale;
      dimsRef.current = { w, h, dpr };

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Flat-top hex grid covering the frame (+1 cell margin all around).
      const r = hexRadius;
      const colStep = 1.5 * r;
      const rowStep = Math.sqrt(3) * r;
      const cols = Math.ceil(w / colStep) + 2;
      const rows = Math.ceil(h / rowStep) + 2;
      const centerX = w / 2;
      const centerY = h / 2;
      const cells: Cell[] = [];
      let idx = 0;
      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const cx = col * colStep;
          const cy = row * rowStep + ((col & 1) ? rowStep / 2 : 0);
          let vx = cx - centerX;
          let vy = cy - centerY;
          let len = Math.hypot(vx, vy) || 1;
          // Nudge dead-center cells outward in a random direction.
          if (len < 1) {
            const a = rand(idx) * Math.PI * 2;
            vx = Math.cos(a);
            vy = Math.sin(a);
            len = 1;
          }
          cells.push({
            cx,
            cy,
            dx: vx / len,
            dy: vy / len,
            dist: 0.45 + rand(idx * 3 + 1) * 0.7,
            rot: (rand(idx * 7 + 2) - 0.5) * 0.6,
          });
          idx++;
        }
      }
      cellsRef.current = cells;
    };

    const draw = () => {
      rafRef.current = null;
      const { w, h, dpr } = dimsRef.current;
      if (!w || !h) return;
      const p = progressRef.current;
      const eased = easeInOutCubic(p);
      const reach = Math.max(w, h) * spread;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;

      for (const c of cellsRef.current) {
        const move = eased * reach * c.dist;
        const ox = c.dx * move;
        const oy = c.dy * move;
        ctx.save();
        ctx.globalAlpha = 1 - eased * 0.4;
        ctx.translate(c.cx + ox, c.cy + oy);
        ctx.rotate(eased * c.rot);
        ctx.translate(-c.cx, -c.cy);
        hexPath(c.cx, c.cy, hexRadius + 0.75); // slight overlap hides seams
        ctx.clip();
        ctx.drawImage(img, 0, 0, w, h);
        ctx.restore();
      }
    };

    const schedule = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(draw);
    };

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;

      // Pin mode: drive progress off scroll *through* the pin container.
      const pin = pinSelector
        ? (document.querySelector(pinSelector) as HTMLElement | null)
        : null;
      const sticky = pin
        ? ((pin.querySelector('[data-hex-sticky]') as HTMLElement | null) ??
           (pin.firstElementChild as HTMLElement | null))
        : null;
      if (pin && sticky) {
        const travel = pin.offsetHeight - sticky.offsetHeight; // px the hero stays pinned
        if (travel > 4) {
          const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
          const absTop = pin.getBoundingClientRect().top + y; // document-absolute top of pin
          const start = absTop - stickyTop;
          // Stretch the arc over more scroll than the pin lasts, so only
          // `releaseAt` of it has played when the pin lets go — the rest
          // finishes as the hero scrolls out of view. releaseAt=1 maps the
          // arc exactly onto the pin (dispersion ends as it releases).
          const arc = travel / Math.min(1, Math.max(0.05, releaseAt));
          progressRef.current = clamp01((y - start) / arc) * pinPeak;
          schedule();
          return;
        }
      }

      // Fallback: progress from window scroll relative to the canvas.
      const range = scrollRange ?? window.innerHeight * 0.8;
      const start = canvas.getBoundingClientRect().top + y - window.innerHeight * 0.1;
      progressRef.current = clamp01((y - Math.max(0, start)) / range);
      schedule();
    };

    const onResize = () => {
      build();
      onScroll();
    };

    img.onload = () => {
      if (disposed) return;
      build();
      onScroll();
    };
    img.src = src;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced, src, maxHeight, hexRadius, spread, pinSelector, pinPeak, releaseAt, scrollRange]);

  if (reduced) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ maxHeight, maxWidth: '100%', width: 'auto', height: 'auto', ...style }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{ maxWidth: '100%', ...style }}
    />
  );
}
