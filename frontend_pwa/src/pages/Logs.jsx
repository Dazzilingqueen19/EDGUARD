import React, { useEffect, useState } from "react";
const LOG_KEY = "edguard_logs";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {
    const raw = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    setLogs(raw);
  }

  function clearAll() {
    localStorage.removeItem(LOG_KEY);
    setLogs([]);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edguard-logs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = logs.filter(l => JSON.stringify(l).toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="card">
        <h2>Logs</h2>
        <p className="hint">Filtered logs with export and search.</p>

        <div style={{display:"flex",gap:8,marginTop:8}}>
          <input placeholder="Search logs..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn ghost" onClick={load}>Refresh</button>
          <button className="btn" onClick={exportJson}>Export</button>
          <button className="btn ghost" onClick={clearAll}>Clear</button>
        </div>

        <div style={{marginTop:12}}>
          {filtered.length === 0 && <div className="hint">No logs found.</div>}
          {filtered.map((l, i) => (
            <div key={i} className="log-item" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <strong>[{new Date(l.ts).toLocaleString()}]</strong> <span style={{opacity:0.9}}>{l.type}</span>
                <div style={{fontSize:13,opacity:0.9}}>{l.text}</div>
                {l.meta && <div style={{fontSize:12,opacity:0.7}}>meta: {JSON.stringify(l.meta)}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
