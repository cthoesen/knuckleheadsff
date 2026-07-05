import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache at the edge for 5 minutes; revalidates in the background after expiry
export const revalidate = 300;

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VALID_LEAGUES = ['kkl', 'kdl', 'mmh', 'bsb'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league')?.toLowerCase();

    // Determine directory and URL base path
    let cardsDir: string;
    let urlBase: string;

    if (league && VALID_LEAGUES.includes(league)) {
      const leagueDir = path.join(process.cwd(), 'public', 'images', 'league', league, 'cards');
      // Use league-specific dir if it exists and has files, otherwise fall back to shared
      if (fs.existsSync(leagueDir) && fs.readdirSync(leagueDir).some(f => ALLOWED_EXTENSIONS.includes(path.extname(f).toLowerCase()))) {
        cardsDir = leagueDir;
        urlBase = `https://knuckleheadsff.com/images/league/${league}/cards`;
      } else {
        cardsDir = path.join(process.cwd(), 'public', 'images', 'shared', 'cards');
        urlBase = 'https://knuckleheadsff.com/images/shared/cards';
      }
    } else {
      cardsDir = path.join(process.cwd(), 'public', 'images', 'shared', 'cards');
      urlBase = 'https://knuckleheadsff.com/images/shared/cards';
    }

    const files = fs.readdirSync(cardsDir);

    // Serve resized/re-encoded variants via Vercel's image optimizer instead
    // of the raw source files — the originals are ~1300px wide and ~215 KB
    // each, but the MFL slider module renders them at a fraction of that.
    // w=750 keeps them crisp at 2x DPR; browsers get webp automatically.
    // The optimizer path needs the site-relative source path, not a full URL.
    const urlPrefix = urlBase.replace('https://knuckleheadsff.com', '');

    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext) && !file.startsWith('.');
      })
      .sort()
      .map(file => `https://knuckleheadsff.com/_next/image?url=${encodeURIComponent(`${urlPrefix}/${file}`)}&w=750&q=75`);

    return NextResponse.json(images, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        // s-maxage lets Vercel's edge cache serve this without invoking the
        // function (the old max-age-only header was browser-cache only, so
        // every visitor paid a serverless invocation — 1.2s TTFB when cold).
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Slider Images API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
