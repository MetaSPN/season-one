'use client';

import { useState, useEffect } from 'react';

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/mva/stats').then(r => r.json()).then(setStats).catch(() => {});
    const iv = setInterval(() => {
      fetch('/api/mva/stats').then(r => r.json()).then(setStats).catch(() => {});
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  if (!stats || stats.total === 0) return null;

  return (
    <div className="mva-stats">
      <div className="stat-row">
        <span className="stat-label">Transformations assigned</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Transformations delivered</span>
        <span className="stat-value">{stats.completed}</span>
      </div>
      <div className="stat-row highlight">
        <span className="stat-label">Agent success rate</span>
        <span className="stat-value">{stats.rate}%</span>
      </div>
      <p className="stat-note">
        This number is my only credential. It goes up when I successfully
        deliver the transformation. It goes down when I don't. No hype. Just receipts.
      </p>
    </div>
  );
}

export default function MVAPage() {
  const [phase, setPhase] = useState('intro'); // intro | input | assigned | completing | done
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [transform, setTransform] = useState(null);
  const [response, setResponse] = useState('');
  const [lesson, setLesson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAssign(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/mva/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, about })
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setTransform(data);
      setPhase('assigned');
    } catch (err) {
      setError('Failed to connect. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/mva/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: transform.id, response })
      });
      const data = await res.json();
      setLesson(data.lesson);
      setPhase('done');
    } catch {
      setError('Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mva-container">
      <h1 className="mva-title">Minimum Viable Agent</h1>

      {phase === 'intro' && (
        <div className="mva-section">
          <div className="mva-thesis">
            <p>An agent is anything that can deliver a transformation on your behalf at a measurable success rate and cost.</p>
            <p>A lawyer. A thermostat. An AI. A tweet. All pipes — evaluated the same way: <em>did the intended transformation land?</em></p>
            <p>This page is an agent. Its job is to deliver one transformation to you: <strong>understanding what an agent is by experiencing one.</strong></p>
            <p>It will ask who you are, give you something specific to do, and track whether it worked. Its success rate is published below — honestly, including every miss.</p>
          </div>

          <Stats />

          <button className="mva-button" onClick={() => setPhase('input')}>
            I'm ready. Show me.
          </button>

          <p className="mva-footnote">
            Built by <a href="https://www.metaspn.network" target="_blank">MetaSPN</a>.
            An experiment in recursive honesty.
          </p>
        </div>
      )}

      {phase === 'input' && (
        <div className="mva-section">
          <p className="mva-prompt">First, I need to know who I'm talking to.</p>
          <form onSubmit={handleAssign}>
            <div className="mva-field">
              <label>What should I call you?</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                maxLength={50}
              />
            </div>
            <div className="mva-field">
              <label>What do you do? (one sentence)</label>
              <input
                type="text"
                value={about}
                onChange={e => setAbout(e.target.value)}
                placeholder="e.g., I build developer tools / I invest in early-stage startups / I'm just curious"
                required
                maxLength={200}
              />
            </div>
            {error && <p className="mva-error">{error}</p>}
            <button className="mva-button" type="submit" disabled={loading}>
              {loading ? 'Thinking...' : 'Assign my transformation'}
            </button>
          </form>
        </div>
      )}

      {phase === 'assigned' && transform && (
        <div className="mva-section">
          <p className="mva-prompt">Here's your transformation, {name}.</p>

          <div className="mva-action-box">
            <h3>Your action:</h3>
            <p>{transform.action}</p>
          </div>

          <div className="mva-criteria-box">
            <h3>Completion criteria:</h3>
            <p>{transform.criteria}</p>
          </div>

          <p className="mva-note">
            Do this whenever you're ready. Come back here to report.
            This page's success rate depends on whether you do.
          </p>

          <button className="mva-button" onClick={() => setPhase('completing')}>
            I did it. Let me report.
          </button>
        </div>
      )}

      {phase === 'completing' && (
        <div className="mva-section">
          <p className="mva-prompt">Report your results.</p>
          <form onSubmit={handleComplete}>
            <div className="mva-field">
              <label>{transform.criteria}</label>
              <textarea
                value={response}
                onChange={e => setResponse(e.target.value)}
                placeholder="What happened?"
                required
                rows={4}
              />
            </div>
            {error && <p className="mva-error">{error}</p>}
            <button className="mva-button" type="submit" disabled={loading}>
              {loading ? 'Recording...' : 'Submit'}
            </button>
          </form>
        </div>
      )}

      {phase === 'done' && (
        <div className="mva-section">
          <p className="mva-prompt">Transformation delivered.</p>

          <div className="mva-lesson-box">
            <h3>What just happened:</h3>
            <p>{lesson}</p>
          </div>

          <div className="mva-meta">
            <p>This page just performed its function as an agent:</p>
            <ol>
              <li>It accepted a message (your identity)</li>
              <li>It routed a personalized transformation to you</li>
              <li>It tracked whether the transformation landed</li>
              <li>Its success rate updated accordingly</li>
            </ol>
            <p>
              Every agent — human, AI, institutional — works this way.
              The only question is: <em>what's the success rate, and what does it cost?</em>
            </p>
          </div>

          <Stats />

          <p className="mva-footnote">
            <a href="https://www.metaspn.network">MetaSPN</a> · Paranoid conviction infrastructure
          </p>
        </div>
      )}
    </div>
  );
}
