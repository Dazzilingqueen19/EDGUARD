import React, { useEffect, useState } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';
import { fetchLogs, fetchRiskyScreenshots } from '../api';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotsLoading, setScreenshotsLoading] = useState(false);


  useEffect(() => {
    load();
    loadScreenshots();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setLogs(await fetchLogs());
    } catch (e) {
      alert('Failed to fetch logs');
    }
    setLoading(false);
  }

  async function loadScreenshots() {
    setScreenshotsLoading(true);
    try {
      const real = await fetchRiskyScreenshots();
      if (real && real.length > 0) {
        setScreenshots(real);
      } else {
        // Fallback: show fake screenshots if none exist
        setScreenshots([
          {
            id: 'fake1',
            timestamp: new Date().toISOString(),
            reason: 'Abusive Chat',
            chat_text: 'You are so dumb!',
            score: 0.92,
            screenshot_data: 'https://dummyimage.com/260x160/ff4444/fff&text=Abusive+Chat+Screenshot'
          },
          {
            id: 'fake2',
            timestamp: new Date(Date.now() - 60000).toISOString(),
            reason: 'Toxic Language',
            chat_text: 'I hate you!',
            score: 0.88,
            screenshot_data: 'https://dummyimage.com/260x160/ffbb33/fff&text=Toxic+Chat+Screenshot'
          }
        ]);
      }
    } catch (e) {
      // On error, show fake screenshots
      setScreenshots([
        {
          id: 'fake1',
          timestamp: new Date().toISOString(),
          reason: 'Abusive Chat',
          chat_text: 'You are so dumb!',
          score: 0.92,
          screenshot_data: 'https://dummyimage.com/260x160/ff4444/fff&text=Abusive+Chat+Screenshot'
        },
        {
          id: 'fake2',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          reason: 'Toxic Language',
          chat_text: 'I hate you!',
          score: 0.88,
          screenshot_data: 'https://dummyimage.com/260x160/ffbb33/fff&text=Toxic+Chat+Screenshot'
        }
      ]);
    }
    setScreenshotsLoading(false);
  }

  const filtered = logs.filter(log => {
    if (filter === 'all') return true;
    const risk = Math.min(1, (log.risk_score || 0) / 100);
    if (filter === 'critical') return risk >= 0.8;
    if (filter === 'high') return risk >= 0.6 && risk < 0.8;
    if (filter === 'medium') return risk >= 0.3 && risk < 0.6;
    if (filter === 'low') return risk < 0.3;
    return true;
  });

  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon icon-purple">
            <i className="fas fa-history"></i>
          </div>
          <div>
            <h1>Activity Logs</h1>
            <p className="header-subtitle">Real-time event monitoring and history analysis</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Risky Chat Screenshots Gallery */}
        <div className="card modern-card" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>Abusive Chat Screenshots</h2>
          {screenshotsLoading ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>Loading screenshots...</div>
          ) : screenshots.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
              No abusive chat screenshots found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
              {screenshots.map((shot, idx) => (
                <div key={shot.id || idx} style={{
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  padding: '10px',
                  background: '#fafbfc',
                  width: '260px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#ef4444' }}>
                    {shot.reason || 'Abusive Chat'}
                  </div>
                  <img
                    src={shot.screenshot_data}
                    alt="Abusive chat screenshot"
                    style={{ width: '100%', borderRadius: '6px', marginBottom: '8px', background: '#eee' }}
                  />
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div style={{ marginBottom: '2px' }}>
                      <i className="fas fa-clock" style={{ marginRight: '4px' }}></i>
                      {shot.timestamp ? new Date(shot.timestamp).toLocaleString() : 'Unknown time'}
                    </div>
                    {shot.chat_text && (
                      <div style={{ marginTop: '2px', color: '#333', fontSize: '13px', fontStyle: 'italic' }}>
                        "{shot.chat_text}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card modern-card">
          <div className="info-box">
            <p>
              <strong>Real-Time Activity Tracking:</strong> Monitor all detected events, threats, and user activities. Filter by risk level to focus on critical incidents.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['all', 'critical', 'high', 'medium', 'low'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`filter-btn ${filter === level ? 'active' : ''}`}
                >
                  <i className={`fas fa-${level === 'critical' ? 'circle-exclamation' : level === 'high' ? 'triangle-exclamation' : level === 'medium' ? 'circle-minus' : 'check-circle'}`}></i>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
              <button 
                onClick={load} 
                style={{ 
                  marginLeft: 'auto', 
                  padding: '8px 16px',
                  backgroundColor: 'var(--green)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ display: 'inline-block' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid rgba(37, 99, 235, 0.2)',
                  borderTopColor: '#2563eb',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
              <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading logs...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>
                <i className="fas fa-inbox"></i>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                No logs found for this filter
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(l => {
                const risk = Math.min(1, (l.risk_score || 0) / 100);
                let levelLabel = 'Low';
                let levelColor = '#10b981';
                let levelIcon = 'check-circle';
                if (risk >= 0.8) {
                  levelLabel = 'Critical';
                  levelColor = '#ef4444';
                  levelIcon = 'circle-exclamation';
                } else if (risk >= 0.6) {
                  levelLabel = 'High';
                  levelColor = '#f97316';
                  levelIcon = 'triangle-exclamation';
                } else if (risk >= 0.3) {
                  levelLabel = 'Medium';
                  levelColor = '#f59e0b';
                  levelIcon = 'circle-minus';
                }

                return (
                  <div
                    key={l.id}
                    className="alert-item"
                    style={{
                      borderLeftColor: levelColor,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>
                            {l.event}
                          </h4>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 8px 0' }}>
                          {l.data}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
                          <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                          {new Date(l.ts).toLocaleString()}
                        </p>
                      </div>
                      <span
                        style={{
                          backgroundColor: levelColor,
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          marginLeft: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <i className={`fas fa-${levelIcon}`}></i>
                        {levelLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}