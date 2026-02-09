'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import content from './content';

export default function FundPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 11, fontWeight: 500, color: '#818cf8', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>MetaSPN</div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 34, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.1, margin: 0 }}>Fund Statement</h1>
        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, color: '#6b7280', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
          Token-Denominated Revenue Model — February 9, 2026
        </p>
      </div>

      <div className="fund-statement">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      <style>{`
        .fund-statement { font-family: 'Newsreader', serif; font-size: 15px; color: #c9d1d9; line-height: 1.8; }
        .fund-statement h1 { font-size: 28px; color: #e2e8f0; margin: 32px 0 12px; font-family: 'Newsreader', serif; }
        .fund-statement h2 { font-size: 22px; color: #e2e8f0; margin: 28px 0 10px; font-family: 'Newsreader', serif; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px; }
        .fund-statement h3 { font-size: 18px; color: #93c5fd; margin: 24px 0 8px; font-family: 'Newsreader', serif; }
        .fund-statement h4 { font-size: 15px; color: #818cf8; margin: 20px 0 6px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 1px; text-transform: uppercase; }
        .fund-statement p { margin: 10px 0; }
        .fund-statement strong { color: #e2e8f0; }
        .fund-statement em { color: #8a9bb5; }
        .fund-statement ul, .fund-statement ol { margin: 8px 0; padding-left: 24px; }
        .fund-statement li { margin: 4px 0; font-size: 14px; }
        .fund-statement hr { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 24px 0; }
        .fund-statement table { width: 100%; border-collapse: collapse; margin: 16px 0; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
        .fund-statement th { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; font-weight: 600; background: rgba(129,140,248,0.08); text-align: left; }
        .fund-statement td { padding: 8px 12px; border: 1px solid rgba(255,255,255,0.06); color: #8a9bb5; }
        .fund-statement tr:hover td { background: rgba(255,255,255,0.02); }
        .fund-statement blockquote { border-left: 3px solid #818cf8; margin: 16px 0; padding: 8px 16px; color: #8a9bb5; font-style: italic; }
      `}</style>
    </div>
  );
}
