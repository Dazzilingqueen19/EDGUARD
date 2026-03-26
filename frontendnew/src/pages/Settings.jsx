import React, { useState, useEffect } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function Settings() {
  const [safeStart, setSafeStart] = useState(6);
  const [safeEnd, setSafeEnd] = useState(22);
  const [sensitivity, setSensitivity] = useState(0.3);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('safeStart');
    if (s) setSafeStart(Number(s));
    
    const e = localStorage.getItem('safeEnd');
    if (e) setSafeEnd(Number(e));
    
    const sen = localStorage.getItem('sensitivity');
    if (sen) setSensitivity(Number(sen));
  }, []);

  function save() {
    localStorage.setItem('safeStart', safeStart);
    localStorage.setItem('safeEnd', safeEnd);
    localStorage.setItem('sensitivity', sensitivity);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon icon-teal">
            <i className="fas fa-sliders"></i>
          </div>
          <div>
            <h1>Dashboard Settings</h1>
            <p className="header-subtitle">Configure core monitoring parameters and defense mechanisms</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card">
          <div className="info-box">
            <p>
              <strong>Configuration Management:</strong> Adjust monitoring hours, detection sensitivity, and other EDGUARD defense parameters to fit your needs.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="form-group">
              <label>Safe Monitoring Start Hour</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type='number' 
                  min='0'
                  max='23'
                  value={safeStart} 
                  onChange={e => setSafeStart(Number(e.target.value))} 
                  placeholder="e.g. 6"
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  {String(safeStart).padStart(2, '0')}:00
                </span>
              </div>
              <p className="form-hint">Begin monitoring from this hour (24-hour format)</p>
            </div>

            <div className="form-group">
              <label>Safe Monitoring End Hour</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type='number' 
                  min='0'
                  max='23'
                  value={safeEnd} 
                  onChange={e => setSafeEnd(Number(e.target.value))} 
                  placeholder="e.g. 22"
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  {String(safeEnd).padStart(2, '0')}:00
                </span>
              </div>
              <p className="form-hint">End monitoring at this hour (24-hour format)</p>
            </div>

            <div className="form-group">
              <label>
                Risk Detection Sensitivity
                <span style={{ marginLeft: '8px', color: 'var(--blue)', fontWeight: '700', fontSize: '16px' }}>
                  {(sensitivity * 100).toFixed(0)}%
                </span>
              </label>
              <input 
                type='range' 
                min='0.1' 
                max='1' 
                step='0.05' 
                value={sensitivity} 
                onChange={e => setSensitivity(parseFloat(e.target.value))}
              />
              <p className="form-hint">
                Lower values increase strictness. {sensitivity < 0.3 ? '🔴 Strict' : sensitivity < 0.6 ? '🟡 Moderate' : sensitivity < 0.8 ? '🟠 Lenient' : '🟢 Very Lenient'}
              </p>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
              <button 
                type='submit'
                style={{ 
                  padding: '12px 40px',
                  backgroundColor: 'var(--blue)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1d4ed8';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--blue)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-floppy-disk"></i>
                Save Configuration
              </button>
              {saved && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--green)',
                  fontWeight: '600',
                  animation: 'slideInLeft 0.3s ease'
                }}>
                  <i className="fas fa-check-circle"></i>
                  Settings saved!
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="features-row">
          <div className="feature-item">
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>
              <i className="fas fa-clock" style={{ color: 'var(--blue)' }}></i>
            </div>
            <h4>Smart Hours</h4>
            <p>Set specific monitoring windows that align with safe online times</p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>
              <i className="fas fa-gauge-high" style={{ color: 'var(--green)' }}></i>
            </div>
            <h4>Sensitivity Control</h4>
            <p>Fine-tune detection sensitivity for optimal protection balance</p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>
              <i className="fas fa-check" style={{ color: '#f59e0b' }}></i>
            </div>
            <h4>Instant Sync</h4>
            <p>All settings are instantly saved and synchronized locally</p>
          </div>
        </div>
      </div>
    </div>
  );
}