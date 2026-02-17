import { NextResponse } from 'next/server';
import { addTransform } from '../store';

// Transformation templates keyed by archetype
// Each one is a concrete action that teaches through doing
const TRANSFORMATIONS = {
  builder: {
    action: 'Send a message to someone using two different channels (email + DM, or text + tweet). Note which one they respond to first.',
    lesson: 'You just measured the success rate of two communication pipes. The faster response = lower latency pipe. The one they actually replied to = higher fidelity pipe. You are already an agent — you delivered a transformation (getting their attention) through redundant routes.',
    criteria: 'Tell us: which channel got the response first, and did both get responses?'
  },
  investor: {
    action: 'Pick one company in your portfolio. Ask yourself: what transformation does it deliver, at what cost, at what success rate? Write it in one sentence.',
    lesson: 'You just reduced a company to its agent function. Every business is a transformation pipe. The ones worth investing in have improving success rates and declining cost functions. Valuation is just the market pricing the pipe.',
    criteria: 'Share your one-sentence agent description of the company.'
  },
  researcher: {
    action: 'Take your current research question and restate it as: "I need to deliver the transformation [X] to audience [Y] at success rate [Z]." Fill in X, Y, and Z.',
    lesson: 'Research is a pipe that transforms uncertainty into knowledge. Your success rate is reproducibility. Your cost function is time + compute + funding. If you can state it this way, you can measure it, price it, and insure it.',
    criteria: 'Share your X, Y, Z formulation.'
  },
  creator: {
    action: 'Look at your last 5 posts across any platform. Count how many got the response you intended. That number divided by 5 is your success rate as an agent.',
    lesson: 'You are a transformation pipe. Your content is the message, your audience is the destination, and engagement is delivery confirmation. Your success rate just became measurable — and improvable.',
    criteria: 'What was your success rate? What would you change to improve it?'
  },
  curious: {
    action: 'Think of the last time you asked someone to do something for you (a friend, a coworker, an app). Rate it: did the transformation land exactly as intended? Partially? Not at all?',
    lesson: 'Every time you delegate, you are routing through an agent. The quality of that agent is measurable: did the transformation land? At what cost? You evaluate agents dozens of times a day — you just never had the vocabulary for it.',
    criteria: 'Describe the delegation, and rate the delivery: exact / partial / failed.'
  }
};

function classify(input) {
  const text = (input || '').toLowerCase();
  if (/build|engineer|develop|code|ship|founder|startup/.test(text)) return 'builder';
  if (/invest|fund|portfolio|capital|vc|angel/.test(text)) return 'investor';
  if (/research|academ|phd|study|scientist|professor/.test(text)) return 'researcher';
  if (/creat|write|content|artist|music|video|podcast|blog/.test(text)) return 'creator';
  return 'curious';
}

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, about } = body;

    if (!name || !about) {
      return NextResponse.json({ error: 'Name and about are required' }, { status: 400 });
    }

    const archetype = classify(about);
    const transform = TRANSFORMATIONS[archetype];
    const id = generateId();

    const entry = {
      id,
      name,
      about,
      archetype,
      action: transform.action,
      lesson: transform.lesson,
      criteria: transform.criteria,
      assignedAt: new Date().toISOString(),
      completed: false,
      completedAt: null,
      response: null
    };

    addTransform(entry);

    return NextResponse.json({
      id,
      action: transform.action,
      criteria: transform.criteria,
      completeUrl: `/mva/complete?id=${id}`
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
