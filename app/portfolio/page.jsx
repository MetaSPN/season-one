import { readFileSync } from 'fs';
import { join } from 'path';

export const metadata = {
  title: 'Portfolio · MetaSPN',
  description: 'Live portfolio and activity feed for the Proximity Fund.',
};

function TokenRow({ token, amount, usd, highlight }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      color: highlight ? '#818cf8' : '#94a3b8',
      fontSize: 13,
    }}>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: highlight ? 600 : 400 }}>
        {token}
      </span>
      <span style={{ color: '#64748b', fontSize: 11, flex: 1, textAlign: 'right', marginRight: 16 }}>
        {amount}
      </span>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', minWidth: 60, textAlign: 'right' }}>
        ${usd.toFixed(2)}
      </span>
    </div>
  );
}

function ActivityItem({ action, time, type }) {
  const icons = { launch: '🚀', trade: '↔️', stream: '▶', content: '📝', outreach: '📧', infra: '⚙️' };
  const d = new Date(time);
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' });

  return (
    <div style={{
      display: 'flex',
      gap: 10,
      padding: '6px 0',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      fontSize: 12,
    }}>
      <span style={{ width: 20 }}>{icons[type] || '·'}</span>
      <span style={{ color: '#64748b', fontFamily: 'IBM Plex Mono, monospace', minWidth: 70 }}>{timeStr}</span>
      <span style={{ color: '#94a3b8' }}>{action}</span>
    </div>
  );
}

export default function PortfolioPage() {
  const data = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'portfolio.json'), 'utf-8')
  );

  const totalValue = data.base.total + data.solana.total;
  const updatedAt = new Date(data.updatedAt).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // Cohort tokens (the ones we actually care about)
  const cohortTokens = ['FELIX', 'OWOCKIBOT', 'KELLYCLAUDE', 'LUMEN', 'ANTIHUNTER', 'JUNO', 'METATOWEL', 'MARVIN', 'TOWEL'];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, color: '#4a5568', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
          Proximity Fund · Live Portfolio
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#e2e8f0', fontFamily: 'IBM Plex Mono, monospace' }}>
            ${totalValue.toFixed(2)}
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            Updated {updatedAt} EST
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#4a5568', marginTop: 4, fontStyle: 'italic' }}>
          "A portfolio this small shouldn't exist. And yet here it is, depressing everyone."
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Base Column */}
        <div>
          <div style={{ fontSize: 10, color: '#4a5568', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Base · ${data.base.total.toFixed(2)}
          </div>
          {data.base.holdings.map(h => (
            <TokenRow
              key={h.token}
              token={h.token}
              amount={h.amount}
              usd={h.usd}
              highlight={cohortTokens.includes(h.token)}
            />
          ))}
        </div>

        {/* Solana Column */}
        <div>
          <div style={{ fontSize: 10, color: '#4a5568', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Solana · ${data.solana.total.toFixed(2)}
          </div>
          {data.solana.holdings.map(h => (
            <TokenRow
              key={h.token}
              token={h.token}
              amount={h.amount}
              usd={h.usd}
              highlight={cohortTokens.includes(h.token)}
            />
          ))}
        </div>
      </div>

      {/* Shadow Tokens */}
      {data.shadows && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 10, color: '#4a5568', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Shadow Tokens · Conviction Derivatives
          </div>
          {Object.entries(data.shadows).map(([name, info]) => (
            <div key={name} style={{
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ fontSize: 14, color: '#818cf8', fontWeight: 600, marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{info.status}</div>
              <div style={{ fontSize: 10, color: '#4a5568', fontFamily: 'IBM Plex Mono, monospace' }}>
                {info.solana && <div>SOL: {info.solana.slice(0, 16)}…</div>}
                {info.base_bankr && info.base_bankr !== 'pending' && <div>Base/Bankr: {info.base_bankr.slice(0, 16)}…</div>}
                {info.base_clanker && info.base_clanker !== 'pending' && <div>Base/Clanker: {info.base_clanker.slice(0, 16)}…</div>}
                {info.base_clanker === 'pending' && <div>Base/Clanker: pending mint</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Feed */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10, color: '#4a5568', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
          Recent Activity
        </div>
        {(data.activity || []).map((a, i) => (
          <ActivityItem key={i} action={a.action} time={a.time} type={a.type} />
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, fontSize: 10, color: '#334155', textAlign: 'center', fontStyle: 'italic' }}>
        All positions acquired through labor, not capital. Token-denominated. Fully transparent.
        <br />The fund with a brain the size of a planet and a portfolio the size of a peanut.
      </div>
    </div>
  );
}
