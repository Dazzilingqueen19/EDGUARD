import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SectionPlaceholder from "./pages/SectionPlaceholder";
import NLPChat from "./pages/NLPChat";
import Logs from "./pages/Logs";
import "./styles.css";

const sections = [
  { id: "nlp", name: "NLP Chat", desc: "Grooming detection and conversational analysis.", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800" },
  { id: "emotion", name: "Emotion", desc: "Detect emotional tone and wellbeing cues.", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800" },
  { id: "odd", name: "Odd-Hour", desc: "Monitor unusual activity times.", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800" },
  { id: "blur", name: "BlurShield", desc: "Blur sensitive images in real-time.", img: "https://images.unsplash.com/photo-1526318472351-c75fcf0701d8?w=800" },
  { id: "alerts", name: "Alerts", desc: "Instant alerts and suggested actions.", img: "https://images.unsplash.com/photo-1508385082359-fb3e6f1704b2?w=800" },
  { id: "logs", name: "Logs", desc: "Filtered logs with export and search.", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800" },
  { id: "settings", name: "Settings", desc: "Customize thresholds, privacy and notifications.", img: "https://images.unsplash.com/photo-1526378729003-1b97f2d6d6a2?w=800" },
  { id: "mobile", name: "Mobile", desc: "Guides for mobile configuration and child-friendly tips.", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">EDGUARD</div>
      <nav>
        {sections.map(s => <Link key={s.id} to={`/${s.id}`}>{s.name}</Link>)}
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Header />
          <div className="content content-grid">
            <div>
              <Routes>
                <Route path="/" element={<SectionPlaceholder title={sections[0].name} desc={sections[0].desc} image={sections[0].img} />} />
                {sections.map(s => {
                  if (s.id === "nlp") {
                    return <Route key={s.id} path={`/${s.id}`} element={<NLPChat />} />;
                  }
                  if (s.id === "logs") {
                    return <Route key={s.id} path={`/${s.id}`} element={<Logs />} />;
                  }
                  return (
                    <Route
                      key={s.id}
                      path={`/${s.id}`}
                      element={<SectionPlaceholder title={s.name} desc={s.desc} image={s.img} />}
                    />
                  );
                })}
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
              </Routes>
            </div>

            <aside style={{paddingLeft:10}}>
              <div className="card">
                <h4>Quick tips</h4>
                <ul>
                  <li>Enable real-time alerts for unknown contacts</li>
                  <li>Review separated logs weekly</li>
                  <li>Enable BlurShield for unknown images</li>
                </ul>
              </div>

              <div className="card" style={{marginTop:12}}>
                <h4>Recent logs</h4>
                <div className="logs-panel">
                  <div className="log-item">[2025-11-04] NLP: sample flagged message</div>
                  <div className="log-item">[2025-11-03] Image blurred · Mobile</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
