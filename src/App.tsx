import { useState, useCallback } from 'react'
import PomodoroTimer from './components/PomodoroTimer'
import Stats from './components/Stats'
import DownloadButton from './components/DownloadButton'
import './App.css'

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface StatsData {
  totalSessions: number
  totalWorkSessions: number // Track work sessions separately
  totalWorkTime: number // in minutes
  todaySessions: number
  todayWorkSessions: number
  todayWorkTime: number
}

function App() {
  const [sessionType, setSessionType] = useState<SessionType>('work')
  const [stats, setStats] = useState<StatsData>(() => {
    const saved = localStorage.getItem('pomodoro-stats')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Reset today's stats if it's a new day
      const lastDate = localStorage.getItem('pomodoro-last-date')
      const today = new Date().toDateString()
      if (lastDate !== today) {
        return {
          ...parsed,
          todaySessions: 0,
          todayWorkSessions: 0,
          todayWorkTime: 0
        }
      }
      return parsed
    }
    return {
      totalSessions: 0,
      totalWorkSessions: 0,
      totalWorkTime: 0,
      todaySessions: 0,
      todayWorkSessions: 0,
      todayWorkTime: 0
    }
  })


  const handleSessionComplete = useCallback((type: SessionType, minutes: number) => {
    setStats(prev => {
      const isWork = type === 'work'
      const newStats = {
        totalSessions: prev.totalSessions + 1,
        totalWorkSessions: prev.totalWorkSessions + (isWork ? 1 : 0),
        totalWorkTime: prev.totalWorkTime + (isWork ? minutes : 0),
        todaySessions: prev.todaySessions + 1,
        todayWorkSessions: prev.todayWorkSessions + (isWork ? 1 : 0),
        todayWorkTime: prev.todayWorkTime + (isWork ? minutes : 0)
      }
      
      // Save to localStorage
      localStorage.setItem('pomodoro-stats', JSON.stringify(newStats))
      localStorage.setItem('pomodoro-last-date', new Date().toDateString())
      
      // Auto-advance to next session
      if (type === 'work') {
        // After work, check if it's time for long break (every 4 work sessions)
        const newWorkSessionCount = prev.totalWorkSessions + 1
        if (newWorkSessionCount > 0 && newWorkSessionCount % 4 === 0) {
          setSessionType('longBreak')
        } else {
          setSessionType('shortBreak')
        }
      } else {
        // After break, go to work
        setSessionType('work')
      }
      
      return newStats
    })
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍅 Pomodoro Timer</h1>
      </header>
      
      <div className="session-selector">
        <button
          className={`session-btn ${sessionType === 'work' ? 'active' : ''}`}
          onClick={() => setSessionType('work')}
        >
          Çalışma
        </button>
        <button
          className={`session-btn ${sessionType === 'shortBreak' ? 'active' : ''}`}
          onClick={() => setSessionType('shortBreak')}
        >
          Kısa Mola
        </button>
        <button
          className={`session-btn ${sessionType === 'longBreak' ? 'active' : ''}`}
          onClick={() => setSessionType('longBreak')}
        >
          Uzun Mola
        </button>
      </div>

      <PomodoroTimer
        sessionType={sessionType}
        onSessionComplete={handleSessionComplete}
      />

      <Stats stats={stats} />

      <DownloadButton />
    </div>
  )
}

export default App
