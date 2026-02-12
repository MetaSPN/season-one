import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import Link from 'next/link';

const STATUS_COLORS = {
  pending: '#eab308',
  approved: '#22c55e',
  rejected: '#ef4444',
};

export default function PendingPage() {
  const dataPath = join(process.cwd(), 'data', 'submissions.json');
  const submissions = existsSync(dataPath)
    ? JSON.parse(readFileSync(dataPath, 'utf-8'))
    : [];

  return (
    <div style={{ animation: 'fadeSlideIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#818cf8', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>MetaSPN</div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 32, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>Submission Queue</h1>
        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: '#6b7280', fontStyle: 'italic', margin: 0 }}>
          Everyone who raised their hand. Sorted by when they showed up.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#4a5568' }}>No submissions yet. The queue is empty.</p>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: '#4a5568', fontStyle: 'italic', marginTop: 8 }}>Somehow that&apos;s both disappointing and expected.</p>
          <Link href="/submit" style={{
            display: 'inline-block', marginTop: 20, padding: '10px 24px', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 3, fontSize: 10, color: '#818cf8', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
          }}>Be the First</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...submissions].reverse().map((s, i) => (
            <div
              key={s.id}
              style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: `3px solid ${STATUS_COLORS[s.status] || '#6b7280'}`,
                borderRadius: 4,
                padding: '14px 16px',
                animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#4a5568', letterSpacing: 1 }}>SUB-{String(s.id).padStart(3, '0')}</span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase',
                      padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 2,
                      color: STATUS_COLORS[s.status] || '#6b7280',
                    }}>{s.status}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#4a5568', letterSpacing: 0.5 }}>
                      {s.tokenChain}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Newsreader', serif", fontSize: 18, fontWeight: 600, color: '#e2e8f0' }}>
                    ${s.tokenSymbol}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#4a5568', marginTop: 2, wordBreak: 'break-all' }}>
                    {s.tokenAddress}
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#4a5568', letterSpacing: 0.5 }}>
                    {new Date(s.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#4a5568' }}>
                    {new Date(s.submittedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              {(s.creatorName || s.agentName) && (
                <div style={{ marginTop: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#6b7280' }}>
                  {s.creatorName && <span>{s.creatorName}{s.creatorTwitter ? ` (${s.creatorTwitter})` : ''}</span>}
                  {s.creatorName && s.agentName && <span style={{ color: '#4a5568' }}> → </span>}
                  {s.agentName && <span style={{ color: '#93c5fd' }}>{s.agentName}{s.agentTwitter ? ` (${s.agentTwitter})` : ''}</span>}
                </div>
              )}
              {s.description && (
                <div style={{ marginTop: 6, fontFamily: "'Newsreader', serif", fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
                  {s.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Link href="/" style={{
          padding: '8px 20px', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)',
          borderRadius: 3, fontSize: 10, color: '#818cf8', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
        }}>Scoreboard</Link>
        <Link href="/submit" style={{
          padding: '8px 20px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 3, fontSize: 10, color: '#22c55e', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
        }}>Submit Token</Link>
      </div>
    </div>
  );
}
