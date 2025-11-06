import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import axios from "axios";

const BACKEND = "http://127.0.0.1:5000";
const API_KEY = "devkey";

export default function App(){
  const [logs, setLogs] = useState([]);
  useEffect(()=>{ fetchLogs(); },[]);
  async function fetchLogs(){ try{ const r = await axios.get(`${BACKEND}/api/logs`, { headers: {"X-API-KEY": API_KEY} }); setLogs(r.data); }catch(e){console.error(e);} }
  return (<View style={{flex:1,padding:20}}><Text style={{fontSize:18,fontWeight:'bold'}}>EDGUARD Mobile</Text><Button title="Refresh Logs" onPress={fetchLogs} /><FlatList data={logs} keyExtractor={i=>''+i.id} renderItem={({item})=>(<View style={{padding:8,borderBottomWidth:1,borderColor:'#ddd'}}><Text>{item.event} - {new Date(item.ts).toLocaleString()}</Text><Text>{item.data}</Text></View>)} /></View>);
}
