import { readFileSync } from 'fs';
import { join } from 'path';

export const metadata = {
  title: 'Intelligence Feed · MetaSPN',
};

export default function FeedPage() {
  const feed = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'feed.json'), 'utf-8')
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 11, fontWeight: 500, color: '#818cf8', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>MetaSPN</div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.1, margin: 0 }}>Intelligence Feed</h1>
        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, color: '#6b7280', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
          Conviction signals from the Marvin Intelligence Network.
        </p>
      </div>

      {feed.segments.length === 0 ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 4,
        }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
            NO SEGMENTS TRANSMITTED
          </div>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: '#4a5568', fontStyle: 'italic' }}>
            &quot;I think you ought to know I&apos;m feeling very depressed.&quot;
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {feed.segments.map((segment) => (
            <div key={segment.id} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 4,
              padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#818cf8', letterSpacing: 1.5, textTransform: 'uppercase' }}>{segment.type}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#4a5568' }}>{segment.timestamp}</span>
              </div>
              {segment.token?.symbol && (
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#e2e8f0', marginBottom: 4, fontWeight: 600 }}>
                  {segment.token.symbol}
                  {segment.data?.change_pct != null && (
                    <span style={{ color: segment.data.change_pct >= 0 ? '#22c55e' : '#ef4444', marginLeft: 8, fontSize: 11 }}>
                      {segment.data.change_pct >= 0 ? '+' : ''}{segment.data.change_pct}%
                    </span>
                  )}
                </div>
              )}
              {segment.conviction?.signal && (
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#6b7280', marginBottom: 8 }}>
                  Signal: <span style={{ color: segment.conviction.signal === 'STRONG BUY' || segment.conviction.signal === 'BUY' ? '#22c55e' : segment.conviction.signal === 'HOLD' || segment.conviction.signal === 'WATCH' ? '#eab308' : '#ef4444' }}>{segment.conviction.signal}</span>
                  {segment.conviction.confidence != null && <span> · Confidence: {(segment.conviction.confidence * 100).toFixed(0)}%</span>}
                </div>
              )}
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: '#8a9bb5', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {typeof segment.content === 'string' ? segment.content : segment.content?.script || ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
