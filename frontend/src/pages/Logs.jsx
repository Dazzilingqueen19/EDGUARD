import React, { useEffect, useState } from 'react';
import { fetchLogs } from '../api';

export default function Logs(){
  const [logs,setLogs] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){ try{ setLogs(await fetchLogs()); }catch(e){ alert('Failed to fetch logs'); } }
  return (<div><h2>Encrypted Logs</h2><div className='card'><button onClick={load}>Refresh</button><div style={{marginTop:12}}>{logs.map(l=> (<div key={l.id} style={{padding:10,borderBottom:'1px solid #eee'}}><strong>{l.event}</strong><div>{l.data}</div><div style={{color:'#666'}}>Risk: {l.risk_score}</div><div style={{fontSize:12,color:'#999'}}>{new Date(l.ts).toLocaleString()}</div></div>))}</div></div></div>);
}
