// Simple in-memory store with file persistence
// On Vercel, this resets per cold start — good enough for MVP
// Upgrade path: Vercel KV, or our VPS API

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'mva-transforms.json');

let store = null;

function load() {
  if (store) return store;
  try {
    if (existsSync(DATA_FILE)) {
      store = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    } else {
      store = { transforms: [], stats: { assigned: 0, completed: 0 } };
    }
  } catch {
    store = { transforms: [], stats: { assigned: 0, completed: 0 } };
  }
  return store;
}

function save() {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch {
    // On Vercel, filesystem writes fail — that's fine for MVP
  }
}

export function addTransform(entry) {
  const s = load();
  s.transforms.push(entry);
  s.stats.assigned++;
  save();
  return entry;
}

export function completeTransform(id) {
  const s = load();
  const t = s.transforms.find(t => t.id === id);
  if (!t) return null;
  if (t.completed) return t; // already done
  t.completed = true;
  t.completedAt = new Date().toISOString();
  s.stats.completed++;
  save();
  return t;
}

export function getTransform(id) {
  const s = load();
  return s.transforms.find(t => t.id === id) || null;
}

export function getStats() {
  const s = load();
  const total = s.stats.assigned || 0;
  const completed = s.stats.completed || 0;
  const rate = total > 0 ? (completed / total * 100).toFixed(1) : '0.0';
  return { total, completed, rate: parseFloat(rate) };
}
