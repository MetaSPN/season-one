import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'portfolio.json'), 'utf-8')
    );
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Portfolio data unavailable' }, { status: 500 });
  }
}
