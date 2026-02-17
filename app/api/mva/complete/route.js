import { NextResponse } from 'next/server';
import { completeTransform, getTransform } from '../store';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, response } = body;

    if (!id) {
      return NextResponse.json({ error: 'Transform ID required' }, { status: 400 });
    }

    const existing = getTransform(id);
    if (!existing) {
      return NextResponse.json({ error: 'Transform not found' }, { status: 404 });
    }

    if (existing.completed) {
      return NextResponse.json({
        message: 'Already completed',
        lesson: existing.lesson
      });
    }

    // Store their response
    existing.response = response || '';
    const result = completeTransform(id);

    return NextResponse.json({
      message: 'Transformation delivered.',
      lesson: result.lesson
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }
  const t = getTransform(id);
  if (!t) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({
    id: t.id,
    action: t.action,
    criteria: t.criteria,
    completed: t.completed,
    lesson: t.completed ? t.lesson : null
  });
}
