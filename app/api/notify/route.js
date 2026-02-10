import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

const SUBS_PATH = join(process.cwd(), 'data', 'subscribers.json');
const NOTIFY_SECRET = process.env.NOTIFY_SECRET || 'marvin-notify-key';

function loadSubs() {
  if (!existsSync(SUBS_PATH)) return [];
  try { return JSON.parse(readFileSync(SUBS_PATH, 'utf-8')); } catch { return []; }
}

function saveSubs(subs) {
  writeFileSync(SUBS_PATH, JSON.stringify(subs, null, 2));
}

// POST — trigger notifications (internal, requires secret)
export async function POST(req) {
  try {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${NOTIFY_SECRET}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { event, data } = body;

    if (!event) {
      return NextResponse.json({ error: 'event required' }, { status: 400 });
    }

    const subs = loadSubs();
    const targets = subs.filter(s => s.events.includes(event) || s.events.includes('all'));

    const payload = {
      event,
      timestamp: new Date().toISOString(),
      source: 'metaspn.network',
      data: data || {},
    };

    let delivered = 0;
    let failed = 0;

    const results = await Promise.allSettled(
      targets.map(async (sub) => {
        try {
          const res = await fetch(sub.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-MetaSPN-Event': event },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000),
          });
          if (res.ok) {
            sub.deliveries++;
            sub.lastDelivery = new Date().toISOString();
            delivered++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      })
    );

    saveSubs(subs);

    return NextResponse.json({
      event,
      subscribers: targets.length,
      delivered,
      failed,
      timestamp: payload.timestamp,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
