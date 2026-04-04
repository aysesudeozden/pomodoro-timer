import { useState, useEffect, useRef, useCallback } from 'react'
import './PomodoroTimer.css'

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface PomodoroTimerProps {
  sessionType: SessionType
  onSessionComplete: (type: SessionType, minutes: number) => void
}

const DEFAULT_DURATIONS: Record<SessionType, number> = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60 // 15 minutes in seconds
}

const DEFAULT_LABELS: Record<SessionType, string> = {
  work: 'Çalışma Zamanı',
  shortBreak: 'Kısa Mola',
  longBreak: 'Uzun Mola'
}

const SESSION_COLORS: Record<SessionType, string> = {
  work: 'var(--primary)',
  shortBreak: 'var(--break)',
  longBreak: 'var(--secondary)'
}

function PomodoroTimer({ sessionType, onSessionComplete }: PomodoroTimerProps) {
  // Custom durations ve labels için localStorage
  const getStoredDuration = (type: SessionType): number => {
    const stored = localStorage.getItem(`pomodoro-duration-${type}`)
    return stored ? parseInt(stored, 10) : DEFAULT_DURATIONS[type]
  }

  const getStoredLabel = (type: SessionType): string => {
    const stored = localStorage.getItem(`pomodoro-label-${type}`)
    return stored || DEFAULT_LABELS[type]
  }

  const [duration, setDuration] = useState(() => getStoredDuration(sessionType))
  const [label, setLabel] = useState(() => getStoredLabel(sessionType))
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isEditingDuration, setIsEditingDuration] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editingMinutes, setEditingMinutes] = useState(Math.floor(duration / 60))
  const [editingLabel, setEditingLabel] = useState(label)

  const intervalRef = useRef<number | null>(null)
  const minutesInputRef = useRef<HTMLInputElement>(null)
  const labelInputRef = useRef<HTMLInputElement>(null)

  // Session type değiştiğinde duration ve label'ı güncelle
  useEffect(() => {
    const newDuration = getStoredDuration(sessionType)
    const newLabel = getStoredLabel(sessionType)
    setDuration(newDuration)
    setLabel(newLabel)
    setTimeLeft(newDuration)
    setIsRunning(false)
    setIsPaused(false)
    setIsEditingDuration(false)
    setIsEditingLabel(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [sessionType])

  // Duration değiştiğinde timeLeft'i güncelle
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(duration)
    }
  }, [duration, isRunning, isPaused])

  // Notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            const minutes = duration / 60
            onSessionComplete(sessionType, minutes)
            playNotification()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, duration, sessionType, onSessionComplete])

  const playNotification = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Tamamlandı!', {
        body: `${label} süreniz bitti.`,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png'
      })
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      console.log('Audio notification failed:', e)
    }
  }, [label])

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsRunning(false)
    setIsPaused(true)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(duration)
  }

  const handleDurationClick = () => {
    if (!isRunning && !isPaused) {
      setIsEditingDuration(true)
      setEditingMinutes(Math.floor(timeLeft / 60))
      setTimeout(() => minutesInputRef.current?.focus(), 0)
    }
  }

  const handleDurationSave = () => {
    const newMinutes = Math.max(1, Math.min(999, editingMinutes))
    const newDuration = newMinutes * 60
    setDuration(newDuration)
    setTimeLeft(newDuration)
    localStorage.setItem(`pomodoro-duration-${sessionType}`, newDuration.toString())
    setIsEditingDuration(false)
  }

  const handleDurationCancel = () => {
    setIsEditingDuration(false)
    setEditingMinutes(Math.floor(timeLeft / 60))
  }

  const handleLabelClick = () => {
    if (!isRunning && !isPaused) {
      setIsEditingLabel(true)
      setEditingLabel(label)
      setTimeout(() => labelInputRef.current?.focus(), 0)
    }
  }

  const handleLabelSave = () => {
    const newLabel = editingLabel.trim() || DEFAULT_LABELS[sessionType]
    setLabel(newLabel)
    localStorage.setItem(`pomodoro-label-${sessionType}`, newLabel)
    setIsEditingLabel(false)
  }

  const handleLabelCancel = () => {
    setIsEditingLabel(false)
    setEditingLabel(label)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const percentage = ((duration - timeLeft) / duration) * 100
  const color = SESSION_COLORS[sessionType]

  return (
    <div className="pomodoro-timer">
      <div className="timer-circle" style={{ '--progress': `${percentage}%`, '--color': color } as React.CSSProperties}>
        <svg className="timer-svg" viewBox="0 0 200 200">
          <circle
            className="timer-background"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
          />
          <circle
            className="timer-progress"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="timer-content">
          {isEditingDuration ? (
            <div className="timer-edit">
              <input
                ref={minutesInputRef}
                type="number"
                min="1"
                max="999"
                value={editingMinutes}
                onChange={(e) => setEditingMinutes(parseInt(e.target.value) || 1)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDurationSave()
                  if (e.key === 'Escape') handleDurationCancel()
                }}
                onBlur={handleDurationSave}
                className="timer-edit-input"
                autoFocus
              />
              <span className="timer-edit-unit">dakika</span>
              <div className="timer-edit-actions">
                <button onClick={handleDurationSave} className="timer-edit-btn save">✓</button>
                <button onClick={handleDurationCancel} className="timer-edit-btn cancel">✕</button>
              </div>
            </div>
          ) : (
            <div
              className="timer-time clickable"
              onClick={handleDurationClick}
              title="Dakikayı değiştirmek için tıklayın"
            >
              {formatTime(timeLeft)}
            </div>
          )}

          {isEditingLabel ? (
            <div className="timer-label-edit">
              <input
                ref={labelInputRef}
                type="text"
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLabelSave()
                  if (e.key === 'Escape') handleLabelCancel()
                }}
                onBlur={handleLabelSave}
                className="timer-label-input"
                maxLength={30}
                autoFocus
              />
              <div className="timer-edit-actions">
                <button onClick={handleLabelSave} className="timer-edit-btn save">✓</button>
                <button onClick={handleLabelCancel} className="timer-edit-btn cancel">✕</button>
              </div>
            </div>
          ) : (
            <div
              className="timer-label clickable"
              onClick={handleLabelClick}
              title="Başlığı değiştirmek için tıklayın"
            >
              {label}
            </div>
          )}
        </div>
      </div>

      <div className="timer-controls">
        {!isRunning && !isPaused && (
          <button className="control-btn start-btn" onClick={handleStart}>
            ▶ Başlat
          </button>
        )}
        {isRunning && (
          <button className="control-btn pause-btn" onClick={handlePause}>
            ⏸ Durdur
          </button>
        )}
        {isPaused && (
          <>
            <button className="control-btn start-btn" onClick={handleStart}>
              ▶ Devam Et
            </button>
            <button className="control-btn reset-btn" onClick={handleReset}>
              ⏹ Sıfırla
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PomodoroTimer
