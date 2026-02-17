'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CompleteInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [transform, setTransform] = useState(null);
  const [response, setResponse] = useState('');
  const [lesson, setLesson] = useState('');
  const [phase, setPhase] = useState('loading'); // loading | action | form | done | error
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) { setPhase('error'); return; }
    fetch(`/api/mva/complete?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setPhase('error'); return; }
        setTransform(data);
        if (data.completed) {
          setLesson(data.lesson);
          setPhase('done');
        } else {
          setPhase('action');
        }
      })
      .catch(() => setPhase('error'));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/mva/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, response })
      });
      const data = await res.json();
      setLesson(data.lesson);
      setPhase('done');
    } catch {
      setPhase('error');
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'loading') return <div className="mva-container"><p className="mva-prompt">Loading your transformation...</p></div>;
  if (phase === 'error') return <div className="mva-container"><p className="mva-prompt">Transformation not found. <a href="/mva" style={{textDecoration:'underline'}}>Start fresh.</a></p></div>;

  return (
    <div className="mva-container">
      <h1 className="mva-title">Complete Your Transformation</h1>

      {phase === 'action' && transform && (
        <div className="mva-section">
          <div className="mva-action-box">
            <h3>Your action:</h3>
            <p>{transform.action}</p>
          </div>
          <div className="mva-criteria-box">
            <h3>Completion criteria:</h3>
            <p>{transform.criteria}</p>
          </div>
          <button className="mva-button" onClick={() => setPhase('form')}>
            I did it. Let me report.
          </button>
        </div>
      )}

      {phase === 'form' && (
        <div className="mva-section">
          <form onSubmit={handleSubmit}>
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
          <p className="mva-footnote">
            <a href="/mva" style={{textDecoration:'underline'}}>Back to the agent →</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="mva-container"><p className="mva-prompt">Loading...</p></div>}>
      <CompleteInner />
    </Suspense>
  );
}
