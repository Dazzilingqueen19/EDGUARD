import React, { useState, useEffect } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/logs', {
          headers: { 'X-API-KEY': 'devkey' }
        });
        const data = await response.json();
        setAlerts(data.filter(item => item.risk_score > 0.3).slice(0, 20));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getRiskLevel = (score) => {
    if (score >= 0.7) return { level: 'CRITICAL', color: 'critical', icon: 'exclamation-triangle' };
    if (score >= 0.5) return { level: 'HIGH', color: 'high', icon: 'exclamation-circle' };
    if (score >= 0.3) return { level: 'MEDIUM', color: 'medium', icon: 'info-circle' };
    return { level: 'LOW', color: 'low', icon: 'check-circle' };
  };

  const filteredAlerts = alerts.filter(alert => {
    const risk = getRiskLevel(alert.risk_score);
    if (filter === 'all') return true;
    return risk.level === filter.toUpperCase();
  });

  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon icon-red">
            <i className="fas fa-bell"></i>
          </div>
          <div>
            <h1>Alerts & Notifications</h1>
            <p className="header-subtitle">Real-time security alerts and risk notifications</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card">
          <div className="info-box">
            <p>
              <strong>Alert Management:</strong> Monitor all detected threats and incidents in real-time. Filter by severity to focus on critical issues.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['all', 'critical', 'high', 'medium'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`filter-btn ${filter === level ? 'active' : ''}`}
                >
                  <i className={`fas fa-${level === 'critical' ? 'circle-exclamation' : level === 'high' ? 'triangle-exclamation' : level === 'medium' ? 'circle-minus' : 'check-circle'}`}></i>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
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
              <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading alerts...</p>
            </div>
          )}

          {!loading && filteredAlerts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>
                No Alerts
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                Everything is looking safe and secure!
              </p>
            </div>
          )}

          {!loading && filteredAlerts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredAlerts.map((alert, idx) => {
                const risk = getRiskLevel(alert.risk_score);
                let levelColor = '#10b981';
                if (risk.level === 'CRITICAL') levelColor = '#ef4444';
                else if (risk.level === 'HIGH') levelColor = '#f97316';
                else if (risk.level === 'MEDIUM') levelColor = '#f59e0b';

                return (
                  <div
                    key={idx}
                    className="alert-item"
                    style={{
                      borderLeftColor: levelColor,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>
                            {alert.event}
                          </h4>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 8px 0' }}>
                          {alert.data}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
                          <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                          {new Date(alert.timestamp).toLocaleString()}
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
                        <i className={`fas fa-${risk.icon}`}></i>
                        {risk.level}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="features-row">
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#ef4444' }}>
              <i className="fas fa-exclamation"></i>
            </div>
            <h4>Critical Alerts</h4>
            <p>Immediate notifications for high-risk harmful activity</p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#3b82f6' }}>
              <i className="fas fa-filter"></i>
            </div>
            <h4>Smart Filtering</h4>
            <p>Categorize and filter alerts by severity levels</p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#f59e0b' }}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <h4>Analytics</h4>
            <p>Track trends and patterns over time for insights</p>
          </div>
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