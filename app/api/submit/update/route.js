import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

const DATA_PATH = join(process.cwd(), 'data', 'submissions.json');

function readSubmissions() {
  if (!existsSync(DATA_PATH)) return [];
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function writeSubmissions(data) {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

const UPDATABLE = ['creatorName', 'creatorTwitter', 'agentName', 'agentTwitter', 'description', 'website'];

export async function POST(request) {
  try {
    const body = await request.json();
    const { tokenAddress, tokenChain } = body;

    if (!tokenAddress || !tokenChain) {
      return NextResponse.json(
        { error: 'Missing required fields: tokenAddress, tokenChain' },
        { status: 400 }
      );
    }

    const submissions = readSubmissions();
    const idx = submissions.findIndex(
      s => s.tokenAddress.toLowerCase() === tokenAddress.toLowerCase() && s.tokenChain === tokenChain
    );

    if (idx === -1) {
      return NextResponse.json(
        { error: 'Token not found. Submit it first via POST /api/submit' },
        { status: 404 }
      );
    }

    const updatedFields = [];
    const changeRecord = { timestamp: new Date().toISOString(), changes: {} };

    for (const field of UPDATABLE) {
      if (body[field] !== undefined && body[field] !== submissions[idx][field]) {
        changeRecord.changes[field] = { from: submissions[idx][field], to: body[field] };
        submissions[idx][field] = body[field];
        updatedFields.push(field);
      }
    }

    if (updatedFields.length === 0) {
      return NextResponse.json(
        { success: true, message: 'No changes detected', submission: submissions[idx] },
        { status: 200 }
      );
    }

    if (!submissions[idx].updates) submissions[idx].updates = [];
    submissions[idx].updates.push(changeRecord);
    submissions[idx].lastUpdated = changeRecord.timestamp;

    writeSubmissions(submissions);

    return NextResponse.json(
      { success: true, submission: submissions[idx], updatedFields },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
