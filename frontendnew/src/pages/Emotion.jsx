import React, { useState, useRef, useEffect } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function Emotion() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [monitoring, setMonitoring] = useState(false);
  const [events, setEvents] = useState([]);
  const sseRef = useRef(null);
  const captureIntervalRef = useRef(null);

  useEffect(() => {
    // clean up when component unmounts
    return () => {
      if (monitoring) stopMonitoring();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startMonitoring = async () => {
    // prefer browser capture and POST frames to server for detection
    try {
      const constraints = { video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15 } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // ensure video plays
        await videoRef.current.play();
      }
    } catch (err) {
      alert('Unable to access camera: ' + err.message);
      return;
    }

    // setup a hidden canvas for frame capture
    if (!canvasRef.current) {
      const c = document.createElement('canvas');
      canvasRef.current = c;
    }

    // open SSE to receive broadcasted alerts (server will echo detection results)
    const key = localStorage.getItem('EDGUARD_API_KEY') || 'devkey';
    const sse = new EventSource(`http://localhost:5000/api/emotion_stream?key=${encodeURIComponent(key)}`, { withCredentials: false });
    sse.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        setEvents((old) => [d, ...old].slice(0, 20));
        if (d.type === 'alert') {
          document.body.classList.add('blurred');
          setTimeout(() => document.body.classList.remove('blurred'), 3000);
          window.location.href = '/safe';
        }
      } catch (ex) {
        console.error('SSE parse', ex);
      }
    };
    sseRef.current = sse;

    // controlled capture loop: send a resized JPEG every 200ms (~5 FPS)
    const sendFrame = async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        const w = 320, h = 240;
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        // POST to server for detection
        fetch('http://localhost:5000/api/emotion_frame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': localStorage.getItem('EDGUARD_API_KEY') || 'devkey'
          },
          body: JSON.stringify({ image: dataUrl })
        }).then(async (res) => {
          if (res.ok) {
            const j = await res.json();
            if (j && j.emotion) {
              setEvents((old) => [{ type: j.emotion === 'unknown' ? 'update' : (j.score > 0.5 && ['sad','fear','angry'].includes(j.emotion) ? 'alert' : 'update'), info: { emotion: j.emotion, score: j.score } }, ...old].slice(0,20));
            }
          }
        }).catch((e) => console.warn('frame send failed', e));
      } catch (e) {
        console.error('capture error', e);
      }
    };

    captureIntervalRef.current = setInterval(sendFrame, 200);
    setMonitoring(true);
  };

  const stopMonitoring = async () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
    // stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setMonitoring(false);
  };

  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon emotion-header-icon">
            <i className="fas fa-face-smile"></i>
          </div>
          <div>
            <h1>Emotion Recognition</h1>
            <p className="header-subtitle">Real-time webcam-based emotion detection & monitoring</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card">
          <h3 className="card-title">
            <i className="fas fa-video"></i> Live Emotion Detection
          </h3>

          <div className="monitoring-controls">
            <button
              className={`btn ${monitoring ? 'btn-danger' : 'btn-primary'}`}
              onClick={monitoring ? stopMonitoring : startMonitoring}
            >
              {monitoring ? 'Stop Camera' : 'Start Monitoring'}
            </button>
          </div>

          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ width: '320px', height: '240px', border: '1px solid #444' }}
            />
          </div>

          <div className="event-log">
            <h4>Latest events</h4>
            <ul>
              {events.map((e, idx) => (
                <li key={idx} className={e.type === 'alert' ? 'alert-event' : ''}>
                  {e.type === 'alert' ? (
                    <strong>⚠️ ALERT:</strong>
                  ) : (
                    '•'
                  )}{' '}
                  {e.info.emotion} ({e.info.score.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="features-row">
          <div className="feature-item">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #ec4899, #db2777)'}}>
              <i className="fas fa-video"></i>
            </div>
            <h3>Live Streaming</h3>
            <p>Real-time webcam processing and emotion detection</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
              <i className="fas fa-gauge-high"></i>
            </div>
            <h3>Confidence Scores</h3>
            <p>Detailed accuracy metrics for each detected emotion</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #06b6d4, #0891b2)'}}>
              <i className="fas fa-history"></i>
            </div>
            <h3>Historical Data</h3>
            <p>Track emotional patterns and trends over time</p>
          </div>
        </div>
      </div>
    </div>
  );
}