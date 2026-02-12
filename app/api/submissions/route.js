import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const dataPath = join(process.cwd(), 'data', 'submissions.json');
  if (!existsSync(dataPath)) {
    return NextResponse.json({ submissions: [] });
  }
  const submissions = JSON.parse(readFileSync(dataPath, 'utf-8'));
  return NextResponse.json({ submissions });
}
