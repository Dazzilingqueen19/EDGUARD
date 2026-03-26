import './Statistics.css'

function Statistics({ stats }) {
  return (
    <div className="stats-container">
      <div className="stat-card emotion">
        <span className="stat-icon">😟</span>
        <div className="stat-content">
          <span className="stat-label">Emotion Alerts</span>
          <span className="stat-value">{stats.emotionAlerts || 0}</span>
        </div>
      </div>

      <div className="stat-card chat">
        <span className="stat-icon">⚠️</span>
        <div className="stat-content">
          <span className="stat-label">Chat Alerts</span>
          <span className="stat-value">{stats.chatAlerts || 0}</span>
        </div>
      </div>

      <div className="stat-card total">
        <span className="stat-icon">📊</span>
        <div className="stat-content">
          <span className="stat-label">Total Alerts</span>
          <span className="stat-value">{stats.totalAlerts || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default Statistics
