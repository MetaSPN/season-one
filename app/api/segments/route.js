import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const feed = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'feed.json'), 'utf-8')
  );

  if (id) {
    const segment = feed.segments.find((s) => s.id === id);
    if (!segment) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }
    return NextResponse.json(segment);
  }

  return NextResponse.json(feed.segments);
}
