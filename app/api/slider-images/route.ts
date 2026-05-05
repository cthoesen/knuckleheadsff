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
        urlBase = `https://mfl-leagues.com/images/league/${league}/cards`;
      } else {
        cardsDir = path.join(process.cwd(), 'public', 'images', 'shared', 'cards');
        urlBase = 'https://mfl-leagues.com/images/shared/cards';
      }
    } else {
      cardsDir = path.join(process.cwd(), 'public', 'images', 'shared', 'cards');
      urlBase = 'https://mfl-leagues.com/images/shared/cards';
    }

    const files = fs.readdirSync(cardsDir);

    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext) && !file.startsWith('.');
      })
      .sort()
      .map(file => `${urlBase}/${file}`);

    return NextResponse.json(images, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error: any) {
    console.error('Slider Images API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
