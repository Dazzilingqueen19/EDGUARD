import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="brand-row">
        <div className="logo">ED</div>
        <div>
          <h1 style={{ margin: 0 }}>EDGUARD Parent Dashboard</h1>
          <div className="hint">NLP Chat · Emotion · Odd-Hour · BlurShield · Alerts · Logs · Settings · Mobile</div>
        </div>
      </div>

      <div className="auth">
        <Link to="/login" className="btn ghost">Login</Link>
        <Link to="/signup" className="btn primary">Sign Up</Link>
      </div>
    </header>
  );
}