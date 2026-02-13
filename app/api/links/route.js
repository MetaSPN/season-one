// Link management API - create and list tracked links
// Links stored in Vercel KV if available, falls back to in-memory + JSON logging

const links = new Map();

// Predefined links can be loaded from a static config
const STATIC_LINKS = {};

export async function POST(request) {
  try {
    const { slug, url, source, campaign, notes } = await request.json();
    
    if (!slug || !url) {
      return Response.json({ error: "slug and url required" }, { status: 400 });
    }

    const link = {
      slug,
      url,
      source: source || "direct",
      campaign: campaign || "general", 
      notes: notes || "",
      created: new Date().toISOString(),
      clicks: 0,
    };

    links.set(slug, link);
    
    return Response.json({ 
      ok: true, 
      tracked_url: `https://metaspn.network/go/${slug}`,
      destination: url,
      slug,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ 
    links: Object.fromEntries(links),
    count: links.size,
  });
}
