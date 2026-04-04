import './Stats.css'

interface StatsProps {
  stats: {
    totalSessions: number
    totalWorkTime: number
    todaySessions: number
    todayWorkTime: number
  }
}

function Stats({ stats }: StatsProps) {
  return (
    <div className="stats-container">
      <div className="stats-card">
        <h3>Bugün</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.todaySessions}</div>
            <div className="stat-label">Oturum</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.todayWorkTime}</div>
            <div className="stat-label">Dakika</div>
          </div>
        </div>
      </div>

      <div className="stats-card">
        <h3>Toplam</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Oturum</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{Math.round(stats.totalWorkTime)}</div>
            <div className="stat-label">Dakika</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
