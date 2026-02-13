// Click tracking aggregator
// Receives fire-and-forget pings from /go/[slug] redirects
// Logs to console (Vercel runtime logs) for now
// TODO: add Vercel KV or external DB when we need persistence

const clickLog = [];

export async function POST(request) {
  try {
    const data = await request.json();
    
    const entry = {
      ...data,
      received: new Date().toISOString(),
    };

    // Log for Vercel runtime
    console.log(`[TRACK] ${JSON.stringify(entry)}`);
    
    // In-memory (resets per cold start, but gives us /api/track GET within a session)
    clickLog.push(entry);
    
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    clicks: clickLog,
    total: clickLog.length,
    note: "In-memory only — resets on cold start. Check Vercel runtime logs for full history.",
  });
}
