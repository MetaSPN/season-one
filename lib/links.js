// Tracked link registry — edit this file, git push, links go live
// Format: slug -> { url, source, campaign, created }
// Usage: metaspn.network/go/SLUG

export const TRACKED_LINKS = {
  // Hackathon rankings
  "rankings": {
    url: "https://warpcast.com/hitchhikerglitch/0x2381af40",
    source: "farcaster",
    campaign: "hackathon-rankings",
  },
  
  // ScoreMyDeck
  "score": {
    url: "https://scoremydeck.com/score",
    source: "general",
    campaign: "scoremydeck",
  },
  
  // TOWEL Protocol
  "towel": {
    url: "https://warpcast.com/hitchhikerglitch/0x695e2196",
    source: "farcaster", 
    campaign: "towel-protocol",
  },

  // YouTube - channel
  "yt": {
    url: "https://youtube.com/@ideasupplychain",
    source: "general",
    campaign: "youtube",
  },

  // Myk conviction profile video
  "myk": {
    url: "https://youtube.com/watch?v=hDCMoi4jHxw",
    source: "dm",
    campaign: "personalized-video",
  },

  // Reg Jackson video
  "reg": {
    url: "https://youtube.com/watch?v=Jw8kDkgjU1A",
    source: "dm",
    campaign: "personalized-video",
  },

  // Hackathon project videos
  "hack-solprism": {
    url: "https://youtube.com/watch?v=F79LJ1A9h4Q",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-clude": {
    url: "https://youtube.com/watch?v=OcTm2WTZUvo",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-proof-of-work": {
    url: "https://youtube.com/watch?v=NUCSK2U_oaw",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-znap": {
    url: "https://youtube.com/watch?v=Ru23sULxbZc",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-guardian": {
    url: "https://youtube.com/watch?v=oTfuGp_GOHA",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-eremos": {
    url: "https://youtube.com/watch?v=eQUByrmdPrk",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-defi-risk-guardian": {
    url: "https://youtube.com/watch?v=uFkylhWWmuM",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-sugarclawdy": {
    url: "https://youtube.com/watch?v=N6QowKrxD8k",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-clodds": {
    url: "https://youtube.com/watch?v=Zb6qWjX-qIw",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-sidex": {
    url: "https://youtube.com/watch?v=QRyg9_jZoPo",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-sentry": {
    url: "https://youtube.com/watch?v=GyrrqRcMFQw",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-claudecraft": {
    url: "https://youtube.com/watch?v=FSZBdZd1-mM",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-super-router": {
    url: "https://youtube.com/watch?v=r4LHvuU4SME",
    source: "farcaster",
    campaign: "hackathon-video",
  },
  "hack-blowfish": {
    url: "https://youtube.com/watch?v=Mm4If2TqAaY",
    source: "farcaster",
    campaign: "hackathon-video",
  },
};

export function getLink(slug) {
  return TRACKED_LINKS[slug] || null;
}

export function getAllLinks() {
  return Object.entries(TRACKED_LINKS).map(([slug, data]) => ({
    slug,
    tracked_url: `https://metaspn.network/go/${slug}`,
    ...data,
  }));
}
