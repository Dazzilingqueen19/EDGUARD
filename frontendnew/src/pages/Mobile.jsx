import React from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function Mobile() {
  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon icon-green">
            <i className="fas fa-mobile-screen"></i>
          </div>
          <div>
            <h1>Mobile Integration</h1>
            <p className="header-subtitle">Extend your protection to mobile devices</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card">
          <div className="info-box">
            <p>
              <strong>On-The-Go Protection:</strong> Deploy EDGUARD on mobile devices to monitor activities, receive push notifications, and view logs anywhere, anytime. Seamlessly sync across all connected devices.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text)' }}>
              Getting Started with Mobile
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              The EDGUARD mobile app provides real-time monitoring, instant alerts, and comprehensive device management from your smartphone.
            </p>
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '13px',
              color: 'var(--text-muted)',
              overflow: 'auto'
            }}>
              <div>$ cd /mobile</div>
              <div>$ npm install && npm start</div>
              <div style={{ marginTop: '12px', color: 'var(--green)' }}>✓ Expo app running</div>
            </div>
          </div>
        </div>

        <div className="features-row">
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#3b82f6' }}>
              <i className="fas fa-bell"></i>
            </div>
            <h4>Push Notifications</h4>
            <p>
              Receive instant alerts on your mobile device whenever suspicious activities are detected
            </p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#109f1f' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h4>Real-Time Monitoring</h4>
            <p>
              View live activity streams and detailed analytics from anywhere with mobile-optimized dashboards
            </p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#f59e0b' }}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <h4>Device Management</h4>
            <p>
              Manage multiple devices, configure settings, and control monitoring from a single unified interface
            </p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#8b5cf6' }}>
              <i className="fas fa-clock"></i>
            </div>
            <h4>Offline Storage</h4>
            <p>
              All events are encrypted and stored locally, ensuring data privacy and availability without connectivity
            </p>
          </div>
        </div>

        <div className="card modern-card" style={{ marginTop: '32px', backgroundColor: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)', borderLeft: '4px solid var(--blue)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            <i className="fas fa-info-circle" style={{ marginRight: '8px', color: 'var(--blue)' }}></i>
            Mobile Setup Instructions
          </h3>
          <ol style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginLeft: '24px' }}>
            <li>Navigate to the <code style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '3px' }}>/mobile</code> folder in your workspace</li>
            <li>Install dependencies with <code style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '3px' }}>npm install</code></li>
            <li>Start the development server with <code style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '3px' }}>npm start</code> (Expo)</li>
            <li>Scan the QR code with Expo Go app on your mobile device</li>
            <li>Configure device registration and enable push notifications in the app settings</li>
            <li>Start receiving real-time alerts and monitoring data on your mobile device</li>
          </ol>
        </div>

        <div className="card modern-card" style={{ marginTop: '32px', backgroundColor: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)', borderLeft: '4px solid var(--green)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-check-double" style={{ color: 'var(--green)' }}></i>
            Supported Platforms
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <i className="fab fa-android" style={{ color: '#3ddc84', fontSize: '20px' }}></i>
              <span>Android 8.0+</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <i className="fab fa-apple" style={{ fontSize: '20px' }}></i>
              <span>iOS 12.0+</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <i className="fas fa-wifi" style={{ color: '#f59e0b', fontSize: '20px' }}></i>
              <span>Requires Active Connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}