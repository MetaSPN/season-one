import { getLink } from "../../../lib/links";

export const runtime = "edge";

export async function GET(request, { params }) {
  const { slug } = await params;
  const link = getLink(slug);

  if (!link) {
    return new Response("Link not found", { status: 404 });
  }

  // Extract tracking data from request
  const url = new URL(request.url);
  const ref = url.searchParams.get("ref") || "direct";
  const ua = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const ts = new Date().toISOString();

  // Log click via console (captured by Vercel runtime logs)
  console.log(JSON.stringify({
    event: "link_click",
    slug,
    destination: link.url,
    source: link.source,
    campaign: link.campaign,
    ref,
    ua: ua.substring(0, 100),
    geo: request.headers.get("x-vercel-ip-country") || "??",
    city: request.headers.get("x-vercel-ip-city") || "??",
    ts,
  }));

  // Also fire-and-forget to our own API endpoint for persistence
  // (non-blocking — don't delay the redirect)
  const trackPayload = {
    slug, ref, ts,
    geo: request.headers.get("x-vercel-ip-country") || "??",
    campaign: link.campaign,
  };

  // Use waitUntil if available (edge runtime)
  const ctx = request;
  try {
    // Log to metaspn.network/api/track for aggregation
    fetch(`${url.origin}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackPayload),
    }).catch(() => {}); // fire and forget
  } catch {
    // Don't block redirect
  }

  // 302 redirect to destination
  return Response.redirect(link.url, 302);
}
