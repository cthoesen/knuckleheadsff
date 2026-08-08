import { NextResponse } from 'next/server';
import sharp from 'sharp';

// sharp needs the Node runtime (not edge).
export const runtime = 'nodejs';

// The upstream photos live on mflscripts.com (theeohiostate's server), which
// is Cloudflare-fronted with hotlink protection: bare requests get a 406.
// Sending a browser-like Referer + User-Agent gets a normal 200. We fetch
// server-side, re-encode to webp (falling back to png for older clients),
// and serve from our own domain so Vercel's edge can cache it hard.
const UPSTREAM_BASE = 'https://www.mflscripts.com/playerImages_96x96';
const UPSTREAM_HEADERS = {
  Referer: 'https://www.myfantasyleague.com/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  Accept: 'image/png,image/*,*/*;q=0.8',
};

// Cache successful photos for a day at the browser, a month at the edge, and
// keep serving stale while revalidating — headshots almost never change.
const CACHE_OK = 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800';
// Cache misses/fallbacks briefly so a newly-added player recovers quickly.
const CACHE_FALLBACK = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';

async function fetchUpstream(file: string): Promise<Buffer | null> {
  try {
    const res = await fetch(`${UPSTREAM_BASE}/${file}`, {
      headers: UPSTREAM_HEADERS,
      // Let Next/Vercel cache the upstream fetch too.
      next: { revalidate: 2592000 },
    });
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    if (ab.byteLength === 0) return null;
    return Buffer.from(ab);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Strict allow-list: numeric MFL player id only. This is what prevents the
  // route from being turned into an open proxy — no arbitrary URLs accepted.
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  // Prefer webp when the client advertises support (all modern browsers do).
  const accept = request.headers.get('accept') || '';
  const wantsWebp = accept.includes('image/webp');
  const format: 'webp' | 'png' = wantsWebp ? 'webp' : 'png';
  const contentType = wantsWebp ? 'image/webp' : 'image/png';

  // Try the player's photo, then the free-agent silhouette as a fallback.
  let source = await fetchUpstream(`mfl_${id}.png`);
  let cacheControl = CACHE_OK;
  if (!source) {
    source = await fetchUpstream('free_agent.png');
    cacheControl = CACHE_FALLBACK;
  }
  if (!source) {
    return NextResponse.json({ error: 'upstream unavailable' }, { status: 502 });
  }

  try {
    const pipeline = sharp(source).resize(96, 96, { fit: 'cover' });
    const output =
      format === 'webp'
        ? await pipeline.webp({ quality: 80 }).toBuffer()
        : await pipeline.png({ compressionLevel: 9 }).toBuffer();

    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        // Vary so the edge caches webp and png variants separately.
        Vary: 'Accept',
        'X-Photo-Source': cacheControl === CACHE_OK ? 'player' : 'fallback',
      },
    });
  } catch {
    return NextResponse.json({ error: 'encode failed' }, { status: 500 });
  }
}
