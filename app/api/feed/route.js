import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const feedPath = join(process.cwd(), 'data', 'feed.json');
  const feed = JSON.parse(readFileSync(feedPath, 'utf-8'));
  return NextResponse.json(feed, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
