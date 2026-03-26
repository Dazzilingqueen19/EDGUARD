import React from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function BlurShield() {
  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon icon-pink">
            <i className="fas fa-eye-slash"></i>
          </div>
          <div>
            <h1>BlurShield</h1>
            <p className="header-subtitle">Intelligent content filtering and blur overlay protection</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card">
          <div className="info-box">
            <p>
              <strong>Real-time Content Filtering:</strong> BlurShield automatically detects and blurs inappropriate content in video streams, images, and web content. When triggered, a visual notification is displayed to alert parents.
            </p>
          </div>

          <div className="features-row" style={{ marginTop: '24px', marginBottom: '32px' }}>
            <div className="feature-item">
              <div style={{ fontSize: '32px', marginBottom: '16px', color: '#ec4899' }}>
                <i className="fas fa-video"></i>
              </div>
              <h4>Video Stream Filtering</h4>
              <p>Automatically blur inappropriate scenes in video content with minimal latency</p>
            </div>
            <div className="feature-item">
              <div style={{ fontSize: '32px', marginBottom: '16px', color: '#f59e0b' }}>
                <i className="fas fa-image"></i>
              </div>
              <h4>Image Content Detection</h4>
              <p>Identify and blur inappropriate images before display</p>
            </div>
            <div className="feature-item">
              <div style={{ fontSize: '32px', marginBottom: '16px', color: '#8b5cf6' }}>
                <i className="fas fa-bell"></i>
              </div>
              <h4>Visual Notifications</h4>
              <p>Flash alert overlay when harmful content is detected</p>
            </div>
            <div className="feature-item">
              <div style={{ fontSize: '32px', marginBottom: '16px', color: '#2563eb' }}>
                <i className="fas fa-sliders-h"></i>
              </div>
              <h4>Customizable Sensitivity</h4>
              <p>Adjust detection thresholds based on family preferences</p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '24px'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-info-circle" style={{ color: 'var(--blue)' }}></i>
              System Status
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span style={{ color: 'var(--text-muted)' }}>Active & Running</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-shield-alt" style={{ color: '#2563eb', fontSize: '18px' }}></i>
                <span style={{ color: 'var(--text-muted)' }}>Protection: Enabled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-zap" style={{ color: '#f59e0b', fontSize: '18px' }}></i>
                <span style={{ color: 'var(--text-muted)' }}>Performance: Optimal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="features-row">
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#109f1f' }}>
              <i className="fas fa-network-wired"></i>
            </div>
            <h4>Network-Wide</h4>
            <p>Protection across all connected devices and networks seamlessly</p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#ec4899' }}>
              <i className="fas fa-lock"></i>
            </div>
            <h4>Secure Processing</h4>
            <p>All processing done locally with no cloud data transfers</p>
          </div>
          <div className="feature-item">
            <div style={{ fontSize: '32px', marginBottom: '16px', color: '#8b5cf6' }}>
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <h4>Low Latency</h4>
            <p>Minimal performance impact with optimized processing speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}