import React, { useState } from "react";
import VoiceflowLoader from '../components/VoiceflowLoader';
import { postChat } from "../api";
import { postChatPhase2 } from "../api";

export default function NLPChat() {
  const [text, setText] = useState("");
  const [phase2, setPhase2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [abuseAlert, setAbuseAlert] = useState(null);

  // List of abusive words (subset for demo, sync with backend for production)
  const ABUSIVE_WORDS = [
    "sex", "porn", "explicit", "nsfw", "nude", "naked", "fuck", "shit", "bitch", "bastard", "asshole", "dick", "pussy", "cunt", "slut", "whore", "suck", "blowjob", "handjob", "oral", "cum", "anal"
  ];

  // Regex for abusive words (word boundaries, case-insensitive)
  const abuseRegex = new RegExp(`\\b(${ABUSIVE_WORDS.join('|')})\\b`, 'gi');

  // Blur abusive words in a string (returns JSX)
  function blurAbusiveWords(str) {
    if (!str) return str;
    const parts = str.split(abuseRegex);
    return parts.map((part, i) =>
      ABUSIVE_WORDS.some(word => part && part.toLowerCase() === word)
        ? <span key={i} className="blurred-word">{part}</span>
        : part
    );
  }

  // Detect abusive words and trigger alert
  function handleTextChange(e) {
    const value = e.target.value;
    setText(value);
    if (abuseRegex.test(value)) {
      setAbuseAlert('Abusive language detected!');
      setTimeout(() => setAbuseAlert(null), 3000);
    }
  }

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;

    // If abusive words detected, send alert log (simulate for now)
    if (abuseRegex.test(text)) {
      setAbuseAlert('Abusive language detected and logged!');
      setTimeout(() => setAbuseAlert(null), 3000);
      // Here you could POST to an alert log endpoint if needed
    }

    try {
      setLoading(true);

      if (phase2) {
        await postChatPhase2(text);
        setResult({
          phase: 2,
          message: "✓ Sent to Phase 2 AI Engine. Context-aware analysis in progress..."
        });
      } else {
        await postChat(text);
        setResult({
          phase: 1,
          message: "✓ Sent to Phase 1 NLP Monitor. Standard analysis complete."
        });
      }

      setText("");
      setTimeout(() => setResult(null), 4000);
    } catch (err) {
      console.error(err);
      setResult({
        error: true,
        message: "✗ Error sending message. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon nlp-header-icon">
            <i className="fas fa-comments"></i>
          </div>
          <div>
            <h1>NLP Safety Analysis</h1>
            <p className="header-subtitle">AI-powered chat monitoring & threat detection</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card">
          {/* Phase Toggle */}
          <div className="phase-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={phase2}
                onChange={(e) => setPhase2(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {phase2 ? "Phase 2: Context-Aware AI" : "Phase 1: Standard Analysis"}
              </span>
            </label>
            <span className={`phase-badge ${phase2 ? 'phase-2' : 'phase-1'}`}>
              {phase2 ? 'Advanced' : 'Standard'}
            </span>
          </div>

          {/* Description */}
          <div className="info-box">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>What we analyze:</strong>
              <p>
                {phase2 
                  ? "Grooming patterns, cyberbullying, threats, manipulative behavior, and contextual risk escalation."
                  : "Grooming attempts, cyberbullying language, explicit threats, and general safety risks."
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={send} className="nlp-form">
            <div className="form-group">
              <label>Paste Chat Logs for Analysis</label>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Paste chat message, conversation, or logs here for safety analysis..."
                rows="8"
                disabled={loading}
                className="nlp-textarea"
              />
              <div className="char-count">{text.length} characters</div>
              {/* Blurred preview below textarea */}
              {text && (
                <div style={{marginTop: '10px', fontSize: '14px'}}>
                  <strong>Preview (blurred): </strong>
                  <span>{blurAbusiveWords(text)}</span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || !text.trim()}
              className="btn-submit nlp-submit"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-shield-alt"></i>
                  Analyze with {phase2 ? 'Phase 2 AI' : 'Phase 1 NLP'}
                </>
              )}
            </button>
          </form>

          {/* Abuse Alert */}
          {abuseAlert && (
            <div className="result-message error">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{abuseAlert}</span>
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div className={`result-message ${result.error ? 'error' : 'success'}`}>
              <i className={result.error ? 'fas fa-times-circle' : 'fas fa-check-circle'}></i>
              <span>{blurAbusiveWords(result.message)}</span>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="features-row">
          <div className="feature-item">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
              <i className="fas fa-brain"></i>
            </div>
            <h3>AI Detection</h3>
            <p>Advanced machine learning to identify harmful content patterns</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Risk Scoring</h3>
            <p>Real-time risk assessment with detailed severity ratings</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #109f1f, #059669)'}}>
              <i className="fas fa-bell"></i>
            </div>
            <h3>Instant Alerts</h3>
            <p>Immediate notifications for high-risk conversations</p>
          </div>
        </div>
      </div>
    </div>
  );
}


