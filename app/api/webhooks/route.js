import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

const SUBS_PATH = join(process.cwd(), 'data', 'subscribers.json');

function loadSubs() {
  if (!existsSync(SUBS_PATH)) return [];
  try { return JSON.parse(readFileSync(SUBS_PATH, 'utf-8')); } catch { return []; }
}

function saveSubs(subs) {
  writeFileSync(SUBS_PATH, JSON.stringify(subs, null, 2));
}

// GET — list subscriber count (no PII)
export async function GET() {
  const subs = loadSubs();
  return NextResponse.json({
    count: subs.length,
    events: ['stream_live', 'new_episode', 'conviction_change', 'shadow_launch', 'wire_update'],
    subscribe: 'POST /api/webhooks with { "url": "https://...", "events": ["stream_live"], "name": "optional" }',
  });
}

// POST — subscribe
export async function POST(req) {
  try {
    const body = await req.json();
    const { url, events, name, wallet } = body;

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'url required (https://...)' }, { status: 400 });
    }

    const validEvents = ['stream_live', 'new_episode', 'conviction_change', 'shadow_launch', 'wire_update', 'all'];
    const selectedEvents = events?.filter(e => validEvents.includes(e)) || ['all'];

    const subs = loadSubs();

    // Check for duplicate URL
    const existing = subs.findIndex(s => s.url === url);
    if (existing >= 0) {
      subs[existing] = { ...subs[existing], events: selectedEvents, name, wallet, updatedAt: new Date().toISOString() };
      saveSubs(subs);
      return NextResponse.json({ status: 'updated', events: selectedEvents });
    }

    const sub = {
      id: crypto.randomUUID(),
      url,
      events: selectedEvents,
      name: name || null,
      wallet: wallet || null,
      createdAt: new Date().toISOString(),
      deliveries: 0,
      lastDelivery: null,
    };

    subs.push(sub);
    saveSubs(subs);

    return NextResponse.json({
      status: 'subscribed',
      id: sub.id,
      events: selectedEvents,
      message: 'You will be notified when MetaSPN goes live. Welcome to the attention layer.',
    });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE — unsubscribe
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const id = searchParams.get('id');

    if (!url && !id) {
      return NextResponse.json({ error: 'url or id required' }, { status: 400 });
    }

    const subs = loadSubs();
    const filtered = subs.filter(s => s.url !== url && s.id !== id);
    saveSubs(filtered);

    return NextResponse.json({ status: 'unsubscribed', removed: subs.length - filtered.length });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
