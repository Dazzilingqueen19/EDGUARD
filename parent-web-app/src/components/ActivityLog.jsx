import './ActivityLog.css'

function ActivityLog({ logs, onRefresh }) {
  const getEventIcon = (event) => {
    const icons = {
      'chat': '💬',
      'emotion': '😊',
      'oddhour_alert': '⏰',
      'parent_token': '📱',
      'heartbeat': '💓',
      'mobile_alert': '📲'
    }
    return icons[event] || '📝'
  }

  const formatData = (data) => {
    if (typeof data === 'string') {
      return data.length > 100 ? data.substring(0, 100) + '...' : data
    }
    return JSON.stringify(data).substring(0, 100)
  }

  return (
    <div className="activity-container">
      <div className="activity-header">
        <h3>Activity Log</h3>
        <button className="refresh-btn" onClick={onRefresh}>🔄 Refresh</button>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>No activity logged yet.</p>
        </div>
      ) : (
        <div className="log-list">
          {logs.map((log, idx) => (
            <div key={idx} className="log-entry">
              <span className="log-icon">{getEventIcon(log.event)}</span>
              <div className="log-content">
                <div className="log-event">{log.event}</div>
                <div className="log-data">{formatData(log.data)}</div>
              </div>
              <div className="log-time">
                {new Date(log.ts).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityLog
