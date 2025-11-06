import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  return (
    <div className="card" style={{maxWidth:480,margin:'20px auto'}}>
      <h2>Login</h2>
      <input placeholder="Email" />
      <input placeholder="Password" style={{marginTop:8}} type="password" />
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button onClick={() => nav("/")}>Sign in</button>
        <button className="btn ghost" onClick={() => nav("/signup")}>Create account</button>
      </div>
    </div>
  );
}