import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  return (
    <div className="card" style={{maxWidth:520,margin:'20px auto'}}>
      <h2>Create an account</h2>
      <input placeholder="Full name" />
      <input placeholder="Email" style={{marginTop:8}} />
      <input placeholder="Password" style={{marginTop:8}} type="password" />
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button onClick={() => nav("/")}>Sign up</button>
        <button className="btn ghost" onClick={() => nav("/login")}>Have an account?</button>
      </div>
    </div>
  );
}