import React, { useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NLPChat from './pages/NLPChat';
import Emotion from './pages/Emotion';
import OddHour from './pages/OddHour';
import BlurShield from './pages/BlurShield';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Mobile from './pages/Mobile';
import Alerts from './pages/Alerts';
import Dashboard from './pages/Dashboard';
import Safe from './pages/Safe';

export default function App() {
  useEffect(() => {
    // Initialize demo user on first load
    const users = JSON.parse(localStorage.getItem('edguard_users') || '[]');
    if (users.length === 0) {
      const demoUser = {
        id: 1,
        name: 'Demo User',
        email: 'test@example.com',
        password: 'password123'
      };
      localStorage.setItem('edguard_users', JSON.stringify([demoUser]));
    }
    // Set theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);
  return (
    <Routes>
      {/* Auth Pages - No Sidebar */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Dashboard Routes - With Sidebar */}
      <Route path="*" element={
        <div className="app-container">
          <header className="header">
            <div className="brand">
              <NavLink to="/dashboard" className="brand-link">
                <i className="fas fa-chart-pie"></i>
              </NavLink>
              EDGUARD
            </div>
            <h1>Parent Monitoring Dashboard</h1>
            <div className="header-right">
              <a 
                href="http://localhost:3001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="parent-alerts-btn"
                title="Open Parent Alerts Dashboard"
              >
                <i className="fas fa-bell"></i>
                Parent Alerts
              </a>
              <NavLink to="/" className="home-icon-btn" title="Go to Home">
                <i className="fas fa-home"></i>
              </NavLink>
              <div className="theme-toggle" onClick={() => {
                  const body = document.body;
                  body.classList.toggle('dark');
                  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
              }}>
                <i className="fas fa-lightbulb"></i>
              </div>
            </div>
          </header>

          <div className="body-wrapper">
            <aside className="sidebar">
              <nav>
                <NavLink to="/dashboard"><i className="fas fa-chart-pie"></i> Dashboard</NavLink>
                <NavLink to="/nlp"><i className="fas fa-comments"></i> NLP Chat</NavLink>
                <NavLink to="/emotion"><i className="fas fa-face-smile"></i> Emotion</NavLink>
                <NavLink to="/oddhour"><i className="fas fa-moon"></i> Odd-Hour</NavLink>
                <NavLink to="/blurshield"><i className="fas fa-eye-slash"></i> BlurShield</NavLink>
                <NavLink to="/alerts"><i className="fas fa-bell"></i> Alerts</NavLink>
                <NavLink to="/logs"><i className="fas fa-history"></i> Logs</NavLink>
                <NavLink to="/settings"><i className="fas fa-sliders"></i> Settings</NavLink>
                <NavLink to="/mobile"><i className="fas fa-mobile-screen"></i> Mobile</NavLink>
              </nav>
            </aside>

            <main className="main-content">
              <section className="content">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nlp" element={<NLPChat />} />
                  <Route path="/emotion" element={<Emotion />} />
                  <Route path="/oddhour" element={<OddHour />} />
                  <Route path="/blurshield" element={<BlurShield />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/mobile" element={<Mobile />} />
                  <Route path="/safe" element={<Safe />} />
                </Routes>
              </section>
            </main>
          </div>
        </div>
      } />
    </Routes>
  );
}