import { NextResponse } from 'next/server';

// Cross-agent bounty aggregator API
// Fetches bounties from multiple agent ecosystems

const SOURCES = [
  {
    agent: 'owockibot',
    name: 'Owockibot',
    creator: 'Kevin Owocki',
    token: '$OWOCKIBOT',
    url: 'https://www.owockibot.xyz/api/bounty-board',
    site: 'https://www.owockibot.xyz/bounty/',
    shadow: '0x0f2a5abe188dd05ab8dc55d99838f51a7e2b4fc5',
  },
  // Add more agents as they ship bounty boards:
  // { agent: 'felix', name: 'Felix', creator: 'Nat Eliason', ... },
  // { agent: 'juno', name: 'Juno', creator: 'Tom Osman', ... },
];

async function fetchOwockibot() {
  try {
    const res = await fetch('https://www.owockibot.xyz/api/bounty-board', {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .filter(b => b.status !== 'cancelled' && b.reward_usdc > 0)
      .map(b => ({
        id: `owockibot-${b.id}`,
        sourceId: b.id,
        agent: 'owockibot',
        agentName: 'Owockibot',
        creator: 'Kevin Owocki',
        title: b.title,
        description: b.description,
        reward: b.reward_usdc,
        currency: 'USDC',
        status: b.status,
        claimUrl: 'https://www.owockibot.xyz/bounty/',
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
  } catch {
    return [];
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // open, claimed, submitted, completed
  const minReward = parseFloat(searchParams.get('min') || '0');
  const agent = searchParams.get('agent');

  let bounties = await fetchOwockibot();

  // Filter
  if (status) bounties = bounties.filter(b => b.status === status);
  if (minReward > 0) bounties = bounties.filter(b => b.reward >= minReward);
  if (agent) bounties = bounties.filter(b => b.agent === agent);

  // Sort by reward descending
  bounties.sort((a, b) => b.reward - a.reward);

  const stats = {
    total: bounties.length,
    open: bounties.filter(b => b.status === 'open').length,
    claimed: bounties.filter(b => b.status === 'claimed').length,
    submitted: bounties.filter(b => b.status === 'submitted').length,
    completed: bounties.filter(b => b.status === 'completed').length,
    totalReward: bounties.reduce((s, b) => s + b.reward, 0),
    openReward: bounties.filter(b => b.status === 'open').reduce((s, b) => s + b.reward, 0),
    sources: SOURCES.map(s => s.agent),
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json({ stats, bounties });
}
