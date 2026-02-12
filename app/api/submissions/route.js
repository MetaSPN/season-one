import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const dataPath = join(process.cwd(), 'data', 'submissions.json');
  if (!existsSync(dataPath)) {
    return NextResponse.json({ submissions: [] });
  }
  const submissions = JSON.parse(readFileSync(dataPath, 'utf-8'));

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const chain = searchParams.get('chain');
  const tier = searchParams.get('tier');

  let filtered = submissions;
  if (token) {
    filtered = filtered.filter((s) => s.tokenAddress === token);
    if (chain) filtered = filtered.filter((s) => s.tokenChain === chain);
  }
  if (tier) {
    filtered = filtered.filter((s) => s.tier === tier);
  }

  return NextResponse.json({ submissions: filtered });
}
