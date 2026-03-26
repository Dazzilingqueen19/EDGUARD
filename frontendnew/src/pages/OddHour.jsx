import React, { useState, useEffect } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function OddHour() {
  const [manualTrigger, setManualTrigger] = useState(false);
  const [isOddHour, setIsOddHour] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString(),
      severity: 'high',
      message: 'Unusual activity detected during odd hours'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(),
      severity: 'medium',
      message: 'Multiple login attempts during late night'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toLocaleTimeString(),
      severity: 'low',
      message: 'Minor activity detected at 3:15 AM'
    }
  ]);
  const [activityCount, setActivityCount] = useState(0);
  const [monitoring, setMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Check if current time is odd hour (10 PM - 6 AM)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      const oddHour = hour >= 22 || hour < 6;
      setIsOddHour(oddHour);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Real-time monitoring - poll for activity
  useEffect(() => {
    if (!monitoring) return;

    const monitoringInterval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/oddhour_status', {
          headers: {
            'X-API-KEY': 'devkey'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.activity_detected) {
            setActivityCount(prev => prev + 1);
            
            // Add new alert
            const newAlert = {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              severity: data.severity || 'medium',
              message: data.message || 'Unusual activity detected during odd hours'
            };
            
            setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
          }
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error('Monitoring error:', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(monitoringInterval);
  }, [monitoring]);

  async function triggerOddHour() {
    try {
      setManualTrigger(true);
      const response = await fetch('http://localhost:5000/api/oddhour_trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'devkey'
        },
        body: JSON.stringify({ timestamp: new Date().toISOString() })
      });
      
      if (response.ok) {
        const newAlert = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          severity: 'high',
          message: 'Manual odd-hour trigger activated'
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
        setActivityCount(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setManualTrigger(false);
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon oddhour-header-icon">
            <i className="fas fa-moon"></i>
          </div>
          <div>
            <h1>Odd-Hour Detection</h1>
            <p className="header-subtitle">Real-time monitoring of unusual late-night activity patterns</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Live Status Card */}
        <div className="card modern-card" style={{marginBottom: '24px', border: isOddHour ? '2px solid #ef4444' : '2px solid #10b981'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3 className="card-title">
              <i className={`fas fa-${isOddHour ? 'moon' : 'sun'}`}></i> Live Status
            </h3>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
              <span style={{fontSize: '14px', color: '#64748b'}}>Last Update: {lastUpdate || 'Initializing...'}</span>
              <div style={{width: '12px', height: '12px', borderRadius: '50%', background: monitoring ? '#10b981' : '#ef4444', animation: monitoring ? 'pulse 2s infinite' : 'none'}}></div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
            <div style={{padding: '16px', background: isOddHour ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: `2px solid ${isOddHour ? '#ef4444' : '#10b981'}`}}>
              <p style={{fontSize: '12px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600'}}>Current Status</p>
              <p style={{fontSize: '20px', fontWeight: 'bold', color: isOddHour ? '#ef4444' : '#10b981'}}>
                {isOddHour ? '🚨 ODD HOUR' : '✓ Safe Hours'}
              </p>
              <p style={{fontSize: '14px', color: '#64748b', marginTop: '8px'}}>
                {formatTime(currentTime)}
              </p>
            </div>

            <div style={{padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '2px solid #3b82f6'}}>
              <p style={{fontSize: '12px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600'}}>Alerts This Session</p>
              <p style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>{activityCount}</p>
              <p style={{fontSize: '14px', color: '#64748b', marginTop: '8px'}}>Real-time detections</p>
            </div>

            <div style={{padding: '16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', border: '2px solid #a855f7'}}>
              <p style={{fontSize: '12px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600'}}>Monitoring</p>
              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#a855f7'}}>{monitoring ? 'Active' : 'Paused'}</p>
              <button 
                onClick={() => setMonitoring(!monitoring)}
                style={{marginTop: '8px', padding: '4px 12px', fontSize: '12px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
              >
                {monitoring ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Alerts Feed */}
        <div className="card modern-card" style={{marginBottom: '24px'}}>
          <h3 className="card-title">
            <i className="fas fa-bell"></i> Live Alert Feed
          </h3>
          
          {alerts.length === 0 ? (
            <div style={{padding: '24px', textAlign: 'center', color: '#64748b'}}>
              <i className="fas fa-inbox" style={{fontSize: '32px', marginBottom: '12px', opacity: 0.5}}></i>
              <p>No alerts yet. Monitoring for odd-hour activity...</p>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto'}}>
              {alerts.map((alert) => (
                <div key={alert.id} style={{
                  padding: '12px',
                  background: alert.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : alert.severity === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  borderLeft: `4px solid ${alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px'}}>{alert.message}</p>
                    <p style={{fontSize: '12px', color: '#64748b'}}>{alert.timestamp}</p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    background: alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works Card */}
        <div className="card modern-card">
          <h3 className="card-title">
            <i className="fas fa-clock"></i> Late-Night Activity Monitoring
          </h3>

          <div className="info-box highlight">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>How It Works:</strong>
              <p>
                Real-time system automatically detects unusual activity during late hours (10 PM - 6 AM). 
                Analyzes patterns continuously and sends instant alerts when suspicious behavior is detected during these times.
                Monitoring polls every 5 seconds for maximum real-time accuracy.
              </p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-moon"></i>
              </div>
              <h4>Night Hours</h4>
              <p className="stat-value">10 PM - 6 AM</p>
              <p className="stat-desc">Monitored time window</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-area"></i>
              </div>
              <h4>Pattern Detection</h4>
              <p className="stat-value">AI-Powered</p>
              <p className="stat-desc">Real-time analysis</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h4>Instant Alerts</h4>
              <p className="stat-value">5s Poll</p>
              <p className="stat-desc">Immediate notification</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h4>Privacy</h4>
              <p className="stat-value">Protected</p>
              <p className="stat-desc">Encrypted monitoring</p>
            </div>
          </div>

          <div className="alert-levels">
            <h4>Alert Severity Levels</h4>
            <div className="level-item low">
              <span className="level-badge">LOW</span>
              <p>Minor activity during unusual hours</p>
            </div>
            <div className="level-item medium">
              <span className="level-badge">MEDIUM</span>
              <p>Moderate activity with some risk indicators</p>
            </div>
            <div className="level-item high">
              <span className="level-badge">HIGH</span>
              <p>Significant anomalies requiring attention</p>
            </div>
          </div>

          <button 
            onClick={triggerOddHour}
            disabled={manualTrigger}
            className="btn-trigger-odd"
          >
            {manualTrigger ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Triggering...
              </>
            ) : (
              <>
                <i className="fas fa-exclamation-triangle"></i>
                Manual Trigger Test
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}