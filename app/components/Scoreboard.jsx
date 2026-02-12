'use client';

import { useState, useEffect } from 'react';

const GITHUB_REPO = 'MetaSPN/season-one';
const SEASON_START = new Date('2026-02-08');
const AUDIT_DATES = [
  { date: '2026-02-15', label: '7-Day Check', major: false },
  { date: '2026-03-10', label: '30-Day Audit', major: true },
  { date: '2026-04-09', label: '60-Day Audit', major: false },
  { date: '2026-05-09', label: '90-Day Audit', major: true },
];

function getDayNumber() {
  return Math.max(0, Math.floor((new Date() - SEASON_START) / 86400000));
}

function getSeasonProgress() {
  return Math.min(100, (getDayNumber() / 90) * 100);
}

function reportUrl(reportPath) {
  return `https://github.com/${GITHUB_REPO}/blob/main/players/${reportPath}`;
}

const CS_COLORS = { GREEN: '#22c55e', YELLOW: '#eab308', AMBER: '#f59e0b', RED: '#ef4444' };
const VD_COLORS = { Low: '#22c55e', Medium: '#eab308', Elevated: '#ef4444', Unknown: '#6b7280' };

function TowelBar({ level, max = 5, color }) {
  if (level === null) return <span style={{ color: '#4a5568', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1 }}>SELF</span>;
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 18, background: i < level ? color : 'rgba(255,255,255,0.06)', borderRadius: 1, transition: 'background 0.3s' }} />
      ))}
      <span style={{ marginLeft: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: level > 0 ? color : '#4a5568', opacity: 0.9 }}>{level}</span>
    </div>
  );
}

function ScoreRing({ value, label, size = 44, color = '#22c55e' }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#8a9bb5', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function PairCard({ pair, index, expanded, onToggle }) {
  const isOpen = expanded === pair.id;
  return (
    <div
      style={{
        background: isOpen ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${isOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
        borderLeft: `3px solid ${pair.isSelf ? '#f59e0b' : pair.towel >= 3 ? '#22c55e' : pair.controlState === 'YELLOW' ? '#eab308' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 4,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        animation: `fadeSlideIn 0.4s ease ${index * 0.07}s both`,
      }}
      onClick={() => onToggle(pair.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#4a5568', letterSpacing: 1 }}>CLR-{pair.id}</span>
            {pair.highlight && (
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 2,
                color: pair.highlight === 'Highest Conviction' ? '#22c55e' : pair.highlight === 'Highest Risk' ? '#f59e0b' : pair.highlight === 'Most Verifiable' ? '#60a5fa' : '#8a9bb5',
              }}>{pair.highlight}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: "'Newsreader', serif", fontSize: 18, fontWeight: 600, color: '#e2e8f0' }}>{pair.creator.name}</span>
            <span style={{ color: '#4a5568', fontSize: 14 }}>→</span>
            <span style={{ fontFamily: "'Newsreader', serif", fontSize: 18, fontWeight: 600, color: '#93c5fd' }}>{pair.agent.name}</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#6b7280', letterSpacing: 0.5, marginTop: 2 }}>{pair.archetype}</div>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#6b7280', letterSpacing: 1.5, marginBottom: 4, textTransform: 'uppercase' }}>$Towel</div>
            <TowelBar level={pair.towel} color="#22c55e" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#6b7280', letterSpacing: 1.5, marginBottom: 4, textTransform: 'uppercase' }}>$Meta</div>
            <TowelBar level={pair.metaTowel} color="#818cf8" />
          </div>
          <div style={{ textAlign: 'center', minWidth: 48 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#6b7280', letterSpacing: 1.5, marginBottom: 4, textTransform: 'uppercase' }}>Control</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, color: CS_COLORS[pair.controlState], letterSpacing: 1 }}>{pair.controlState}</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 48 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#6b7280', letterSpacing: 1.5, marginBottom: 4, textTransform: 'uppercase' }}>Val. Dist.</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, color: VD_COLORS[pair.vdPrior], letterSpacing: 1 }}>{pair.vdPrior}</div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.3s ease' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
            <ScoreRing value={pair.trackRecord} label="Track Record" color={pair.trackRecord > 0.7 ? '#22c55e' : pair.trackRecord > 0.5 ? '#eab308' : '#ef4444'} />
            <ScoreRing value={pair.absorption} label="Absorption" color={pair.absorption > 0.65 ? '#22c55e' : '#eab308'} />
            <ScoreRing value={pair.distribution} label="Distribution" color={pair.distribution > 0.7 ? '#22c55e' : pair.distribution > 0.4 ? '#eab308' : '#ef4444'} />
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8a9bb5', lineHeight: 1.6 }}>
            <span style={{ color: '#6b7280' }}>VD BASIS:</span> {pair.vdBasis}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#4a5568', marginTop: 6 }}>
            @{pair.creator.twitterHandle} → @{pair.agent.twitterHandle}
          </div>
          <a href={reportUrl(pair.reportPath)} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', marginTop: 12, padding: '8px 16px', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 3, fontSize: 10, color: '#818cf8', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none',
          }}>View Report</a>
        </div>
      )}
    </div>
  );
}

export default function Scoreboard({ pairs: initialPairs }) {
  const [expanded, setExpanded] = useState(null);
  const [now, setNow] = useState(new Date());
  const pairs = initialPairs || [];

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const dayNum = getDayNumber();
  const progress = getSeasonProgress();
  const nextAudit = AUDIT_DATES.find((a) => new Date(a.date) > now);

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 11, fontWeight: 500, color: '#818cf8', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>MetaSPN</div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.1, margin: 0 }}>Season 1 Scoreboard</h1>
        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, color: '#6b7280', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
          Tracking the validation distance between creators and their AI agents.<br />Seven pairs. Measured publicly. Audited honestly.
        </p>
      </div>

      {/* Season timeline */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: '14px 18px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 9, color: '#6b7280', letterSpacing: 2, textTransform: 'uppercase' }}>Season Progress</span>
            <span style={{ fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 700, color: '#e2e8f0' }}>Day {dayNum}</span>
            <span style={{ fontSize: 10, color: '#4a5568' }}>/ 90</span>
          </div>
          {nextAudit && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1 }}>NEXT AUDIT: </span>
              <span style={{ fontSize: 10, color: nextAudit.major ? '#818cf8' : '#6b7280', fontWeight: nextAudit.major ? 600 : 400 }}>{nextAudit.label}</span>
            </div>
          )}
        </div>
        <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #818cf8, #22c55e)', borderRadius: 3, transition: 'width 1s ease' }} />
          {AUDIT_DATES.map((a) => {
            const pct = (Math.floor((new Date(a.date) - SEASON_START) / 86400000) / 90) * 100;
            return <div key={a.date} style={{ position: 'absolute', left: `${pct}%`, top: -3, width: a.major ? 3 : 1, height: 12, background: a.major ? '#818cf8' : 'rgba(255,255,255,0.2)', borderRadius: 1 }} />;
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {AUDIT_DATES.map((a) => (
            <span key={a.date} style={{ fontSize: 8, color: a.major ? '#818cf8' : '#4a5568', letterSpacing: 0.5, fontWeight: a.major ? 600 : 400 }}>{a.label}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1 }}>$TOWEL (Current State)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, background: '#818cf8', borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1 }}>$METATOWEL (Future Thesis)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: '#4a5568', letterSpacing: 1 }}>Control: </span>
          {Object.entries(CS_COLORS).map(([k, v]) => <span key={k} style={{ fontSize: 9, color: v, marginRight: 4 }}>{k}</span>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: '#4a5568', letterSpacing: 1 }}>Val. Dist.: </span>
          {Object.entries(VD_COLORS).map(([k, v]) => <span key={k} style={{ fontSize: 9, color: v, marginRight: 4 }}>{k}</span>)}
        </div>
      </div>

      {/* Pair cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {pairs.map((pair, i) => (
          <PairCard key={pair.id} pair={pair} index={i} expanded={expanded} onToggle={(id) => setExpanded(prev => prev === id ? null : id)} />
        ))}
      </div>

      {/* Submit CTA */}
      <a href="/submit" style={{ display: 'block', textDecoration: 'none', marginTop: 24, padding: '20px 28px', background: 'rgba(34,197,94,0.04)', border: '1px dashed rgba(34,197,94,0.25)', borderRadius: 4, textAlign: 'center', transition: 'all 0.2s ease' }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Every token on this scoreboard registered itself.</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#22c55e', letterSpacing: 1.5, textTransform: 'uppercase' }}>Submit yours →</div>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 12, color: '#4a5568', fontStyle: 'italic', marginTop: 6 }}>If you ship, we&apos;ll see it.</div>
      </a>

      {/* CTA */}
      <div style={{ marginTop: 32, padding: '24px 28px', background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(34,197,94,0.05))', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 4, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 24, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>#StakeYourTowel</div>
        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: '#8a9bb5', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 16px' }}>
          Every pair is a thesis. Every $TOWEL stake is a commitment.<br />What do you believe? Who&apos;s aligned? Who&apos;s drifting?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a href={`https://github.com/${GITHUB_REPO}/tree/main/players`} target="_blank" rel="noopener noreferrer" style={{
            padding: '8px 20px', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 3, fontSize: 10, color: '#818cf8', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none',
          }}>View Reports on GitHub</a>
          <div style={{ padding: '8px 20px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 3, fontSize: 10, color: '#22c55e', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Stake $TOWEL</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 9, color: '#4a5568', letterSpacing: 1 }}>Marvin · MBH Conviction Signal Engine v0.1 · MetaSPN Season 1</div>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 11, color: '#4a5568', fontStyle: 'italic' }}>&quot;Don&apos;t Panic.&quot;</div>
      </div>
    </div>
  );
}
