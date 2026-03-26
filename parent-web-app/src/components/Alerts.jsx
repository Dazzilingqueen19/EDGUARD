import './Alerts.css'

function Alerts({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div className="alerts-container">
        <div className="empty-state">
          <span className="emoji">✨</span>
          <h3>No Alerts Yet</h3>
          <p>Your child is safe! Alerts will appear here in real-time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="alerts-container">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert-card alert-${alert.type}`}>
          <div className="alert-header">
            <span className="alert-badge">{alert.type === 'emotion' ? '😟' : '⚠️'}</span>
            <div className="alert-title-section">
              <h4>{alert.message}</h4>
              <span className="alert-time">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
          {alert.score && (
            <div className="alert-score">
              <span>Risk Score: {(alert.score * 100).toFixed(1)}%</span>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ width: `${alert.score * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Alerts
