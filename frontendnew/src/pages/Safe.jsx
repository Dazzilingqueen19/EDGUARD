import React from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function Safe() {
  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon alert-header-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div>
            <h1>Safe Mode Activated</h1>
            <p className="header-subtitle">Redirected away from risky content</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card">
          <h3 className="card-title">
            <i className="fas fa-gamepad"></i> Recommended Safe Games
          </h3>
          <ul className="safe-list">
            <li>Solitaire</li>
            <li>Minesweeper</li>
            <li>Freecell</li>
            <li>Tetris</li>
            <li>Pac-Man</li>
          </ul>
          <p>Go ahead and enjoy a break while things cool down.</p>
        </div>
      </div>
    </div>
  );
}