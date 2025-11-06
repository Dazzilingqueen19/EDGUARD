import React, { useState, useEffect } from "react";
import { postChat } from '../api';

const LOG_KEY = "edguard_logs";

function addLog(entry) {
  const logs = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  logs.unshift(entry);
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

export default function NLPChat() {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // load recent messages from session (not required) - optional
    const saved = JSON.parse(sessionStorage.getItem("nlp_messages") || "[]");
    setMessages(saved);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("nlp_messages", JSON.stringify(messages));
  }, [messages]);

  function onImageChange(e) {
    const files = Array.from(e.target.files).slice(0, 3); // limit images
    const imgs = files.map(f => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
    setImages(prev => [...prev, ...imgs]);
    addLog({ ts: Date.now(), type: "IMAGE_ADDED", text: `Image(s) added: ${files.map(f=>f.name).join(", ")}` });
  }

  function send() {
    if (!text && images.length === 0) return;
    const msg = { id: Date.now(), text, images: images.map(i => ({ name: i.name, url: i.url })), ts: Date.now() };
    setMessages(prev => [msg, ...prev]);
    addLog({ ts: Date.now(), type: "NLP", text: text ? text : "(image only)", meta: { images: msg.images.map(i => i.name) } });
    setText("");
    setImages([]);
  }

  function removeImage(idx) {
    setImages(prev => {
      const copy = [...prev];
      const removed = copy.splice(idx, 1);
      if (removed[0]) addLog({ ts: Date.now(), type: "IMAGE_REMOVED", text: removed[0].name });
      return copy;
    });
  }

  return (
    <div>
      <div className="card">
        <h2>NLP Chat / Grooming Detection</h2>
        <p className="hint">Type messages, attach images (jpg/png) and click Send. Messages add to the Logs history.</p>

        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <textarea
              placeholder="Type chat text..."
              value={text}
              onChange={e=>setText(e.target.value)}
              rows={4}
              style={{width:"100%",borderRadius:10,padding:12}}
            />
            <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
              <label className="btn ghost" style={{cursor:"pointer"}}>
                Attach images
                <input type="file" accept="image/*" multiple onChange={onImageChange} style={{display:"none"}} />
              </label>
              <button className="btn primary" onClick={send}>Send</button>
            </div>

            {images.length > 0 && (
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {images.map((im, i) => (
                  <div key={i} style={{position:"relative"}}>
                    <img src={im.url} alt={im.name} style={{width:120,height:80,objectFit:"cover",borderRadius:8}} />
                    <button onClick={()=>removeImage(i)} style={{position:"absolute",right:6,top:6}} className="btn ghost">x</button>
                    <div style={{fontSize:12,marginTop:6}}>{im.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside style={{width:300}}>
            <div className="card">
              <h4>Helpful games & resources</h4>
              <div className="games-list">
                <a href="https://www.commonsense.org/education/digital-citizenship" target="_blank" rel="noreferrer">Common Sense: Digital Citizenship</a>
                <a href="https://www.netsmartz.org/" target="_blank" rel="noreferrer">NetSmartz (safety lessons)</a>
                <a href="https://www.stopbullying.gov/" target="_blank" rel="noreferrer">StopBullying.gov (prevention)</a>
                <a href="https://staysafeonline.org/" target="_blank" rel="noreferrer">National Cybersecurity Alliance</a>
                <a href="https://example.com/emotion-game" target="_blank" rel="noreferrer">Emotion Match (game)</a>
                <a href="https://example.com/safechat-quiz" target="_blank" rel="noreferrer">SafeChat Quiz</a>
              </div>
            </div>
            <div className="card" style={{marginTop:12}}>
              <h4>Realtime tips</h4>
              <ul>
                <li>Enable real-time alerts for unknown contacts</li>
                <li>Use image blur for untrusted photos</li>
                <li>Review logs regularly and export if needed</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h4>Recent messages</h4>
        <div className="logs-panel" style={{background:"#0b1220"}}>
          {messages.length === 0 && <div className="hint">No messages yet — send a test message.</div>}
          {messages.map(m => (
            <div key={m.id} style={{marginBottom:10,padding:10,background:"#071024",borderRadius:8}}>
              <div style={{fontSize:14}}>{m.text || <em>(image only)</em>}</div>
              {m.images && m.images.length > 0 && (
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  {m.images.map((im, idx) => <img key={idx} src={im.url} alt={im.name} style={{width:90,height:60,objectFit:"cover",borderRadius:6}} />)}
                </div>
              )}
              <div style={{fontSize:12,opacity:0.7,marginTop:6}}>{new Date(m.ts).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
