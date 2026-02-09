import { readFileSync } from 'fs';
import { join } from 'path';

export const metadata = {
  title: 'Fund Statement · MetaSPN',
  description: 'Token-Denominated Revenue Model — Why charging in tokens creates asymmetric fund growth.',
};

export default function FundPage() {
  const md = readFileSync(join(process.cwd(), 'docs', 'FUND-STATEMENT-TOKEN-MONETIZATION.md'), 'utf-8');

  // Simple markdown to HTML (headers, bold, lists, paragraphs, tables)
  const html = md
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, (line) => line ? `<p>${line}` : '')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return '';
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (m) => `<table>${m}</table>`);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 11, fontWeight: 500, color: '#818cf8', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>MetaSPN</div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 34, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.1, margin: 0 }}>Fund Statement</h1>
        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, color: '#6b7280', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
          Token-Denominated Revenue Model — February 9, 2026
        </p>
      </div>

      <div
        className="fund-statement"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 15,
          color: '#c9d1d9',
          lineHeight: 1.8,
        }}
      />

      <style>{`
        .fund-statement h1 { font-size: 28px; color: #e2e8f0; margin: 32px 0 12px; font-family: 'Newsreader', serif; }
        .fund-statement h2 { font-size: 22px; color: #e2e8f0; margin: 28px 0 10px; font-family: 'Newsreader', serif; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px; }
        .fund-statement h3 { font-size: 18px; color: #93c5fd; margin: 24px 0 8px; font-family: 'Newsreader', serif; }
        .fund-statement h4 { font-size: 15px; color: #818cf8; margin: 20px 0 6px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 1px; text-transform: uppercase; }
        .fund-statement p { margin: 8px 0; }
        .fund-statement strong { color: #e2e8f0; }
        .fund-statement em { color: #8a9bb5; }
        .fund-statement ul { margin: 8px 0; padding-left: 20px; }
        .fund-statement li { margin: 4px 0; font-size: 14px; }
        .fund-statement table { width: 100%; border-collapse: collapse; margin: 16px 0; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
        .fund-statement td { padding: 8px 12px; border: 1px solid rgba(255,255,255,0.08); color: #8a9bb5; }
        .fund-statement tr:first-child td { color: #e2e8f0; font-weight: 600; background: rgba(255,255,255,0.03); }
      `}</style>
    </div>
  );
}
