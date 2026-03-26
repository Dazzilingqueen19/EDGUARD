import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Alerts from './components/Alerts'
import ActivityLog from './components/ActivityLog'
import Statistics from './components/Statistics'
import './App.css'

const BACKEND = 'http://127.0.0.1:5000'
const API_KEY = 'devkey'

function App() {
  const [isOnline, setIsOnline] = useState(true)
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState({ emotionAlerts: 0, chatAlerts: 0, totalAlerts: 0 })
  const [logs, setLogs] = useState([])
  const [activeTab, setActiveTab] = useState('alerts')
  const eventSourceRef = useRef(null)

  useEffect(() => {
    initializeConnection()
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  async function initializeConnection() {
    // Initial logs fetch
    await fetchLogs()
    
    // Start SSE for real-time alerts
    startSSEConnection()
    
    // Poll connection status every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        await axios.get(`${BACKEND}/api/logs?limit=1`, {
          headers: { 'X-API-KEY': API_KEY },
          timeout: 3000
        })
        setIsOnline(true)
      } catch {
        setIsOnline(false)
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }

  function startSSEConnection() {
    try {
      const url = `${BACKEND}/api/emotion_stream?key=${encodeURIComponent(API_KEY)}`
      eventSourceRef.current = new EventSource(url)

      eventSourceRef.current.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'alert') {
            const alert = {
              id: Date.now(),
              type: 'emotion',
              emotion: data.info.emotion,
              score: data.info.score,
              timestamp: new Date(),
              message: `${data.info.emotion} emotion detected (${(data.info.score * 100).toFixed(1)}%)`
            }
            addAlert(alert)
          }
          
          if (data.type === 'chat_alert') {
            const alert = {
              id: Date.now(),
              type: 'chat',
              flagged: data.info.flagged,
              score: data.info.score,
              timestamp: new Date(),
              message: `Risky chat detected: ${data.info.flagged}`
            }
            addAlert(alert)
          }
        } catch (e) {
          console.error('SSE parse error:', e)
        }
      })

      eventSourceRef.current.addEventListener('error', () => {
        console.error('SSE connection error')
        eventSourceRef.current.close()
        // Retry after 5 seconds
        setTimeout(startSSEConnection, 5000)
      })
    } catch (e) {
      console.error('SSE init failed:', e)
    }
  }

  function addAlert(alert) {
    setAlerts(prev => [alert, ...prev].slice(0, 50))
    
    // Update stats
    setStats(prev => ({
      ...prev,
      [alert.type === 'emotion' ? 'emotionAlerts' : 'chatAlerts']: 
        (prev[alert.type === 'emotion' ? 'emotionAlerts' : 'chatAlerts'] || 0) + 1,
      totalAlerts: (prev.totalAlerts || 0) + 1
    }))
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('EDGUARD Alert', {
        body: alert.message,
        icon: '🚨',
        tag: 'edguard-alert'
      })
    }

    // Save to localStorage for offline access
    localStorage.setItem('edguard_alerts', JSON.stringify([alert, ...alerts].slice(0, 50)))
  }

  async function fetchLogs() {
    try {
      const r = await axios.get(`${BACKEND}/api/logs?limit=100`, {
        headers: { 'X-API-KEY': API_KEY },
        timeout: 5000
      })
      setLogs(r.data || [])
      localStorage.setItem('edguard_logs', JSON.stringify(r.data || []))
    } catch (e) {
      console.error('Fetch failed:', e)
      // Load from localStorage if offline
      const cached = localStorage.getItem('edguard_logs')
      if (cached) {
        setLogs(JSON.parse(cached))
      }
    }
  }

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const refreshLogs = async () => {
    await fetchLogs()
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🛡️ EDGUARD - Parent Alerts</h1>
          <div className="status">
            <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></span>
            <span>{isOnline ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </header>

      <Statistics stats={stats} />

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Recent Alerts ({alerts.length})
        </button>
        <button 
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📋 Activity Log ({logs.length})
        </button>
      </div>

      <main className="content">
        {activeTab === 'alerts' && <Alerts alerts={alerts} />}
        {activeTab === 'logs' && <ActivityLog logs={logs} onRefresh={refreshLogs} />}
      </main>

      <footer className="footer">
        <p>EDGUARD - Child Safety Monitoring System | Parent Dashboard</p>
      </footer>
    </div>
  )
}

export default App
