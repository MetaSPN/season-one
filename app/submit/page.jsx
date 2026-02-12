'use client';

import { useState } from 'react';
import Link from 'next/link';

const CHAINS = ['base', 'solana', 'ethereum'];

const fieldStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  color: '#e2e8f0',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 13,
  outline: 'none',
};

const labelStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  color: '#6b7280',
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  marginBottom: 6,
  display: 'block',
};

export default function SubmitPage() {
  const [form, setForm] = useState({
    tokenAddress: '', tokenChain: 'base', tokenSymbol: '',
    creatorName: '', creatorTwitter: '', agentName: '', agentTwitter: '',
    description: '', website: '', submitterWallet: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', animation: 'fadeSlideIn 0.4s ease' }}>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#22c55e', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Signal Received</div>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 28, fontWeight: 700, color: '#e2e8f0', margin: '0 0 16px' }}>Your token is in the queue.</h1>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 32 }}>
            We&apos;ll review and add it to the scoreboard. The signal has been received.<br />
            Whether that matters is another question entirely.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/" style={{
              padding: '10px 24px', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)',
              borderRadius: 3, fontSize: 10, color: '#818cf8', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
            }}>Back to Scoreboard</Link>
            <Link href="/pending" style={{
              padding: '10px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3, fontSize: 10, color: '#8a9bb5', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
            }}>View Queue</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', animation: 'fadeSlideIn 0.4s ease' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#818cf8', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>MetaSPN</div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 32, fontWeight: 700, color: '#e2e8f0', margin: '0 0 12px' }}>Put Your Token on the Scoreboard</h1>
        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: '#6b7280', lineHeight: 1.7, fontStyle: 'italic' }}>
          Submitting your token is a signal. It means you believe in what you&apos;re building enough to be measured publicly. We track shipping velocity, not hype.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Required fields */}
        <div style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#818cf8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Required</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Token Symbol</label>
              <input style={fieldStyle} placeholder="EXAMPLE" value={form.tokenSymbol} onChange={set('tokenSymbol')} required />
            </div>
            <div>
              <label style={labelStyle}>Chain</label>
              <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.tokenChain} onChange={set('tokenChain')} required>
                {CHAINS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Token Address</label>
              <input style={fieldStyle} placeholder="0x... or mint address" value={form.tokenAddress} onChange={set('tokenAddress')} required />
            </div>
          </div>
        </div>

        {/* Optional: Creator / Agent */}
        <div style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#6b7280', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Creator &amp; Agent (Optional)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Creator Name</label>
              <input style={fieldStyle} placeholder="Name" value={form.creatorName} onChange={set('creatorName')} />
            </div>
            <div>
              <label style={labelStyle}>Creator Twitter</label>
              <input style={fieldStyle} placeholder="@handle" value={form.creatorTwitter} onChange={set('creatorTwitter')} />
            </div>
            <div>
              <label style={labelStyle}>Agent Name</label>
              <input style={fieldStyle} placeholder="AgentName" value={form.agentName} onChange={set('agentName')} />
            </div>
            <div>
              <label style={labelStyle}>Agent Twitter</label>
              <input style={fieldStyle} placeholder="@agent_handle" value={form.agentTwitter} onChange={set('agentTwitter')} />
            </div>
          </div>
        </div>

        {/* Optional: Details */}
        <div style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#6b7280', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Details (Optional)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...fieldStyle, minHeight: 72, resize: 'vertical' }} placeholder="What does this agent do?" value={form.description} onChange={set('description')} />
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input style={fieldStyle} placeholder="https://..." value={form.website} onChange={set('website')} />
            </div>
            <div>
              <label style={labelStyle}>Submitter Wallet</label>
              <input style={fieldStyle} placeholder="0x... (so we know who sent it)" value={form.submitterWallet} onChange={set('submitterWallet')} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#ef4444', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 3 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            padding: '12px 24px',
            background: status === 'submitting' ? 'rgba(129,140,248,0.06)' : 'rgba(129,140,248,0.15)',
            border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 3,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: '#818cf8',
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontWeight: 600,
            cursor: status === 'submitting' ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {status === 'submitting' ? 'Transmitting...' : 'Submit Token'}
        </button>

        <p style={{ fontFamily: "'Newsreader', serif", fontSize: 12, color: '#4a5568', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
          We measure what ships, not what you promise.
        </p>
      </form>
    </div>
  );
}
