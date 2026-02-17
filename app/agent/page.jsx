import playersData from '../../players/index.json';
import Link from 'next/link';

export default function AgentsPage() {
  const { pairs, frameBuildCoin } = playersData;
  
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem', fontFamily: 'monospace', color: '#e0e0e0', background: '#0a0a0a', minHeight: '100vh' }}>
      <h1 style={{ color: '#ff4444', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        Season 1 — Shadow Token Insurance Index
      </h1>
      
      <p style={{ color: '#888', marginBottom: '2rem' }}>
        Every agent pair has three tokens: <strong style={{color:'#ff6b6b'}}>Meme</strong> (sentiment), <strong style={{color:'#4ecdc4'}}>Data</strong> (conviction), <strong style={{color:'#ffe66d'}}>Shadow</strong> (insurance).
        <br/>Shadow tokens are paired against <a href={frameBuildCoin?.frameUrl} style={{color:'#ffe66d'}}>$MARVIN</a> on Frame — gas-free on Base.
      </p>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {pairs.filter(p => p.agent?.shadowToken).map(pair => {
          const { agent, creator } = pair;
          const shadow = agent.shadowToken;
          const frameUrl = `https://frame.fun/tokens/${shadow.shadowAddress}`;
          
          return (
            <div key={pair.id} style={{ border: '1px solid #333', borderRadius: 8, padding: '1.5rem', background: '#111' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, color: '#fff' }}>
                  {agent.name || `$${agent.tokenSymbol}`}
                </h2>
                <span style={{ color: pair.controlState === 'GREEN' ? '#4ecdc4' : pair.controlState === 'YELLOW' ? '#ffe66d' : '#ff6b6b' }}>
                  {pair.controlState}
                </span>
              </div>
              
              <p style={{ color: '#888', margin: '0.5rem 0' }}>
                Creator: {creator.name} · {pair.archetype}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <div style={{ color: '#4ecdc4', fontSize: '0.8rem', textTransform: 'uppercase' }}>Primary Token</div>
                  <div style={{ color: '#fff', fontSize: '1.1rem' }}>${agent.tokenSymbol}</div>
                  <div style={{ color: '#666', fontSize: '0.75rem', wordBreak: 'break-all' }}>{agent.tokenAddress || 'Base'}</div>
                </div>
                <div>
                  <div style={{ color: '#ffe66d', fontSize: '0.8rem', textTransform: 'uppercase' }}>Shadow Token (Insurance)</div>
                  <div style={{ color: '#fff', fontSize: '1.1rem' }}>
                    <a href={frameUrl} target="_blank" style={{ color: '#ffe66d', textDecoration: 'none' }}>
                      {shadow.shadowTicker}
                    </a>
                  </div>
                  <div style={{ color: '#666', fontSize: '0.75rem', wordBreak: 'break-all' }}>{shadow.shadowAddress}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <a href={frameUrl} target="_blank" style={{ 
                  background: '#ffe66d', color: '#000', padding: '0.4rem 1rem', borderRadius: 4, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' 
                }}>
                  Trade on Frame →
                </a>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #333', borderRadius: 8, background: '#0d0d0d' }}>
        <h3 style={{ color: '#ffe66d', margin: '0 0 1rem 0' }}>How Shadow Insurance Works</h3>
        <p style={{ color: '#888', lineHeight: 1.6 }}>
          Each shadow token is paired against $MARVIN (the analyst builder coin) on Frame.
          When conviction in an agent rises, the shadow token captures that signal.
          When conviction falls, the spread between primary and shadow tokens tells you why.
          The insurance fund grows via attention — every view, every trade, every analysis adds to the collective signal.
        </p>
        <p style={{ color: '#666', marginTop: '1rem' }}>
          <em>"I think you ought to know I'm feeling very depressed about how well this system works."</em> — Marvin
        </p>
      </div>
      
      <footer style={{ marginTop: '2rem', color: '#444', textAlign: 'center', fontSize: '0.8rem' }}>
        MetaSPN · Season 1 · Paranoid Conviction Analysis · <a href="https://metaspn.network" style={{color:'#666'}}>metaspn.network</a>
      </footer>
    </div>
  );
}
