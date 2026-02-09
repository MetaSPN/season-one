import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const feed = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'feed.json'), 'utf-8')
  );
  return NextResponse.json(feed);
}
