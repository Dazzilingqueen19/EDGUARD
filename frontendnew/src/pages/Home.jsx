import React, { useEffect, useState } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';
import { useNavigate } from 'react-router-dom';
import '../styles-home.css';

export default function Home() {
  const navigate = useNavigate();
  const [showParentModal, setShowParentModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('edguard_isLoggedIn') === 'true';
    const user = localStorage.getItem('edguard_user');
    setIsLoggedIn(loggedIn);
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleOpenParentDashboard = () => {
    setShowParentModal(true);
    setIframeLoaded(false);
    setIframeError(false);
  };

  const handleCloseParentModal = () => {
    setShowParentModal(false);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeLoaded(false);
    setIframeError(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('edguard_isLoggedIn');
    localStorage.removeItem('edguard_user');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.querySelector('.features');
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          featuresSection.classList.add('scroll-active');
        } else {
          featuresSection.classList.remove('scroll-active');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      <VoiceflowLoader />
      {/* Header */}
      <header className="home-header">
        <div className="container-fluid">
          <div className="navbar-brand">
            <div className="logo">
              <i className="fas fa-shield-alt"></i>
              <span>EDGUARD</span>
            </div>
            <p className="tagline">Parental Control & Safety</p>
            
            <div className="header-actions" style={{marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center'}}>
              <button 
                onClick={handleOpenParentDashboard}
                className="parent-dashboard-link"
                title="Open Parent Alerts Dashboard"
                style={{border: 'none', background: 'none', cursor: 'pointer', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px', fontWeight: '500'}}
              >
                <i className="fas fa-bell"></i>
                <span>Parent Alerts</span>
              </button>

              {isLoggedIn ? (
                <div className="user-menu" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div className="user-profile" style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
                    <i className="fas fa-user-circle" style={{fontSize: '20px'}}></i>
                    <span style={{fontSize: '14px', color: 'white'}}>{userInfo?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="logout-btn"
                    title="Logout"
                    style={{border: 'none', background: 'none', cursor: 'pointer', padding: '8px 12px', color: 'white', fontSize: '14px', transition: 'all 0.3s ease'}}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              ) : (
                <div className="auth-links" style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                  <button
                    onClick={() => navigate('/login')}
                    className="login-link"
                    style={{border: '1px solid white', background: 'transparent', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="signup-link"
                    style={{background: 'white', color: '#2563eb', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px'}}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 15px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-user-plus"></i>
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="hero-prefix">Welcome to</span>
                <span className="hero-main">EDGUARD</span>
              </h1>
              
              <p className="hero-subtitle">
                Advanced Parent Monitoring & Child Safety Platform
              </p>
              
              <p className="hero-description">
                EDGUARD combines cutting-edge artificial intelligence with intelligent behavioral 
                analysis to provide parents with real-time insights into their family's digital activities. 
                Our advanced emotion detection algorithms monitor emotional well-being, sophisticated NLP 
                technology analyzes conversations for safety concerns, and intelligent alert systems ensure 
                you're immediately notified of critical events. All while maintaining privacy and building 
                trust within your family unit.
              </p>

              <button 
                className="btn btn-primary btn-lg btn-get-started"
                onClick={handleGetStarted}
              >
                <i className="fas fa-rocket"></i>
                Get Started
              </button>
            </div>

            <div className="hero-visual">
              <div className="animation-circle circle-1"></div>
              <div className="animation-circle circle-2"></div>
              <div className="hero-icon">
                <i className="fas fa-user-shield"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Core Features</h2>
          
          <div className="features-grid">
            {/* Feature 1: NLP Chat */}
            <div className="feature-card">
              <div className="feature-icon nlp-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>NLP Chat Analysis</h3>
              <p>AI-powered detection of grooming attempts, cyberbullying, threats, and manipulative behavior in conversations.</p>
              <div className="feature-badge">Phase : Context-Aware</div>
            </div>

            {/* Feature 2: Emotion Detection */}
            <div className="feature-card">
              <div className="feature-icon emotion-icon">
                <i className="fas fa-face-smile"></i>
              </div>
              <h3>Emotion Recognition</h3>
              <p>Real-time webcam-based emotion detection to identify stress, sadness, anger, and other emotional states.</p>
              <div className="feature-badge">Live Streaming</div>
            </div>

            {/* Feature 3: Odd-Hour Detection */}
            <div className="feature-card">
              <div className="feature-icon oddhour-icon">
                <i className="fas fa-moon"></i>
              </div>
              <h3>Odd-Hour Alerts</h3>
              <p>Automatic detection of unusual activity patterns during late hours with intelligent alerting.</p>
              <div className="feature-badge">24/7 Monitoring</div>
            </div>

            {/* Feature 4: BlurShield */}
            <div className="feature-card">
              <div className="feature-icon blur-icon">
                <i className="fas fa-eye-slash"></i>
              </div>
              <h3>BlurShield</h3>
              <p>Automatically blur and block inappropriate content with instant visual notifications.</p>
              <div className="feature-badge">Real-time Filter</div>
            </div>

            {/* Feature 5: Alerts */}
            <div className="feature-card">
              <div className="feature-icon alerts-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Smart Alerts</h3>
              <p>Customizable risk-based alerts delivered in real-time to keep parents informed instantly.</p>
              <div className="feature-badge">Smart Filtering</div>
            </div>

            {/* Feature 6: Comprehensive Logs */}
            <div className="feature-card">
              <div className="feature-icon logs-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Activity Logs</h3>
              <p>Detailed analytics and historical logs of all monitored activities with risk scoring.</p>
              <div className="feature-badge">Data Analytics</div>
            </div>

            {/* Feature 7: Live Dashboard Charts */}
            <div className="feature-card">
              <div className="feature-icon dashboard-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h3>Live Charts</h3>
              <p>Visualize real‑time trends and spikes in child activity using interactive line graphs.</p>
              <div className="feature-badge">Real-Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">24/7</h3>
              <p>Continuous Monitoring</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">AI Powered</h3>
              <p>Advanced Detection</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">Real-Time</h3>
              <p>Instant Alerts</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">100%</h3>
              <p>Privacy Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Protect Your Family?</h2>
            <p>Start using EDGUARD today and monitor your child's digital activities safely and ethically.  Access <strong>Live Charts</strong> from the Dashboard for an immediate graphical overview.</p>
            <button 
              className="btn btn-light btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              <i className="fas fa-arrow-right"></i>
              Launch Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Parent Dashboard Modal */}
      {showParentModal && (
        <div className="modal-overlay" onClick={handleCloseParentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Parent Alerts Dashboard</h2>
              <button 
                className="modal-close-btn"
                onClick={handleCloseParentModal}
                title="Close modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {!iframeLoaded && !iframeError && (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px', flexDirection: 'column', gap: '20px'}}>
                  <div style={{fontSize: '48px', animation: 'spin 2s linear infinite'}}>
                    <i className="fas fa-spinner"></i>
                  </div>
                  <p style={{color: '#666', fontSize: '16px'}}>Connecting to Parent Alerts Dashboard...</p>
                </div>
              )}
              {iframeError && (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px', flexDirection: 'column', gap: '15px', textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '48px', color: '#ef4444'}}>
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <h3 style={{color: '#333', margin: '0'}}>Dashboard Unavailable</h3>
                  <p style={{color: '#666', margin: '0', maxWidth: '400px'}}>The Parent Alerts Dashboard is not currently available. Please make sure the parent-web-app is running on port 3001.</p>
                  <button
                    onClick={() => {
                      setIframeError(false);
                      setIframeLoaded(false);
                    }}
                    style={{marginTop: '15px', padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'}}
                  >
                    <i className="fas fa-redo"></i> Retry Connection
                  </button>
                </div>
              )}
              <iframe 
                src="http://localhost:3001"
                title="Parent Alerts Dashboard"
                className="dashboard-iframe"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{display: iframeLoaded ? 'block' : 'none'}}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h5>EDGUARD</h5>
              <p>Advanced parental control and child safety platform.</p>
            </div>
            <div className="footer-section">
              <h5>Features</h5>
              <ul>
                <li>NLP Chat Analysis</li>
                <li>Emotion Detection</li>
                <li>Odd-Hour Alerts</li>
                <li>BlurShield</li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Resources</h5>
              <ul>
                <li>Documentation</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Support</li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Connect</h5>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 EDGUARD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
