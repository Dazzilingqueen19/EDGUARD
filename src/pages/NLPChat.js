import React, { useState } from "react";
import { postChat } from "../api";
export default function NLPChat(){ const [text,setText]=useState(''); async function send(e){ e.preventDefault(); if(!text.trim()) return; await postChat(text); alert('Sent'); setText(''); } return (<div><h2>NLP Chat / Grooming Detection</h2><form onSubmit={send} style={{display:'flex',gap:10}}><input value={text} onChange={e=>setText(e.target.value)} placeholder='Type chat text...' /><button type='submit'>Send</button></form></div>); }
