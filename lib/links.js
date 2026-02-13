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
