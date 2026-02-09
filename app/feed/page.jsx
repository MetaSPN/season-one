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
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: 16, color: '#e2e8f0', marginBottom: 6 }}>{segment.title}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8a9bb5', lineHeight: 1.6 }}>{segment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
