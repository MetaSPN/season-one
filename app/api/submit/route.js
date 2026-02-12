import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

const DATA_PATH = join(process.cwd(), 'data', 'submissions.json');

function readSubmissions() {
  if (!existsSync(DATA_PATH)) {
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
    writeFileSync(DATA_PATH, '[]');
    return [];
  }
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function writeSubmissions(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tokenAddress, tokenChain, tokenSymbol } = body;

    if (!tokenAddress || !tokenChain || !tokenSymbol) {
      return NextResponse.json(
        { error: 'Missing required fields: tokenAddress, tokenChain, tokenSymbol' },
        { status: 400 }
      );
    }

    const validChains = ['base', 'solana', 'ethereum'];
    if (!validChains.includes(tokenChain)) {
      return NextResponse.json(
        { error: `Invalid chain. Must be one of: ${validChains.join(', ')}` },
        { status: 400 }
      );
    }

    const submissions = readSubmissions();
    const maxId = submissions.reduce((max, s) => Math.max(max, s.id || 0), 0);

    // Check for duplicate
    const existing = submissions.find(
      (s) => s.tokenAddress === body.tokenAddress && s.tokenChain === body.tokenChain
    );
    if (existing) {
      return NextResponse.json(
        { error: 'Token already submitted', existingId: existing.id, status: existing.tier },
        { status: 409 }
      );
    }

    const entry = {
      id: maxId + 1,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'pending',
      tier: 'pending',
      shippingVelocity: 0,
      svLastUpdated: null,
      tokenAddress: body.tokenAddress,
      tokenChain: body.tokenChain,
      tokenSymbol: body.tokenSymbol.toUpperCase(),
      creatorName: body.creatorName || null,
      creatorTwitter: body.creatorTwitter || null,
      agentName: body.agentName || null,
      agentTwitter: body.agentTwitter || null,
      description: body.description || null,
      website: body.website || null,
      submitterWallet: body.submitterWallet || null,
      updates: [],
    };

    submissions.push(entry);
    writeSubmissions(submissions);

    return NextResponse.json({ success: true, submission: entry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
