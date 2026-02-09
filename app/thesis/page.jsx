import { readFileSync } from 'fs';
import { join } from 'path';

export const metadata = {
  title: 'Proximity Fund Thesis · MetaSPN',
};

export default function ThesisPage() {
  const html = readFileSync(
    join(process.cwd(), 'thesis', 'proximity_fund_thesis.html'),
    'utf-8'
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 11, fontWeight: 500, color: '#818cf8', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>MetaSPN</div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.1, margin: 0 }}>Proximity Fund Thesis</h1>
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 4,
          padding: '32px',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
