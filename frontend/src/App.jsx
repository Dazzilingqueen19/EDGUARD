import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

// Import your page components
const NLPChat = React.lazy(() => import("./pages/NLPChat"));
const Emotion = React.lazy(() => import("./pages/Emotion"));
const OddHour = React.lazy(() => import("./pages/OddHour"));
const BlurShield = React.lazy(() => import("./pages/BlurShield"));
const Alerts = React.lazy(() => import("./pages/Alerts"));
const Logs = React.lazy(() => import("./pages/Logs"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Mobile = React.lazy(() => import("./pages/Mobile"));

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">EDGUARD</div>
        <nav>
          <NavLink to="/nlp">NLP Chat</NavLink>
          <NavLink to="/emotion">Emotion</NavLink>
          <NavLink to="/odd-hour">Odd-Hour</NavLink>
          <NavLink to="/blur">BlurShield</NavLink>
          <NavLink to="/alerts">Alerts</NavLink>
          <NavLink to="/logs">Logs</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/mobile">Mobile</NavLink>
        </nav>
      </aside>

      <main className="main">
        <section className="content">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<NLPChat />} />
              <Route path="/nlp" element={<NLPChat />} />
              <Route path="/emotion" element={<Emotion />} />
              <Route path="/odd-hour" element={<OddHour />} />
              <Route path="/blur" element={<BlurShield />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/mobile" element={<Mobile />} />
            </Routes>
          </React.Suspense>
        </section>
      </main>
    </div>
  );
}
