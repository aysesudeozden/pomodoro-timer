import { useState, useEffect } from 'react'
import './DownloadButton.css'

// Electron içinde çalışıp çalışmadığını kontrol et
const isElectron = (): boolean => {
  // userAgent kontrolü
  if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')) {
    return true
  }
  // window.process kontrolü (Electron'a özgü)
  if (typeof window !== 'undefined' && (window as any).process?.type) {
    return true
  }
  // require kontrolü
  if (typeof window !== 'undefined' && typeof (window as any).require === 'function') {
    try {
      const electron = (window as any).require('electron')
      return !!electron
    } catch {
      return false
    }
  }
  return false
}

// PWA standalone modda çalışıp çalışmadığını kontrol et
const isStandalonePWA = (): boolean => {
  // display-mode: standalone kontrolü
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }
  // iOS Safari'de Ana Ekrana Ekle kontrolü
  if ((navigator as any).standalone === true) {
    return true
  }
  return false
}

function DownloadButton() {
  const [platform, setPlatform] = useState<string>('unknown')
  const [isInstalling, setIsInstalling] = useState(false)
  const [shouldHide, setShouldHide] = useState(false)

  useEffect(() => {
    // Electron veya PWA standalone ise butonu gizle
    if (isElectron() || isStandalonePWA()) {
      setShouldHide(true)
      return
    }

    // Platform algılama
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.includes('win')) {
      setPlatform('windows')
    } else if (userAgent.includes('mac') || userAgent.includes('darwin')) {
      setPlatform('mac')
    } else if (userAgent.includes('linux')) {
      setPlatform('linux')
    } else {
      setPlatform('unknown')
    }
  }, [])

  const handleDownload = () => {
    setIsInstalling(true)

    // Build dosyalarının bulunduğu URL
    const downloadLinks: Record<string, string> = {
      windows: '/release/Pomodoro Timer-Setup.exe',
      mac: '/downloads/Pomodoro Timer.dmg',
      linux: '/downloads/Pomodoro Timer.AppImage'
    }

    const link = downloadLinks[platform]

    if (link) {
      // Yeni sekmede aç veya indir
      const downloadLink = document.createElement('a')
      downloadLink.href = link
      downloadLink.download = link.split('/').pop() || ''
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      setTimeout(() => {
        setIsInstalling(false)
      }, 2000)
    } else {
      alert('Bu platform için henüz build edilmiş sürüm bulunmuyor. Lütfen GitHub releases sayfasını kontrol edin.')
      setIsInstalling(false)
    }
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case 'windows':
        return '🪟'
      case 'mac':
        return '🍎'
      case 'linux':
        return '🐧'
      default:
        return '💻'
    }
  }

  const getPlatformName = () => {
    switch (platform) {
      case 'windows':
        return 'Windows'
      case 'mac':
        return 'macOS'
      case 'linux':
        return 'Linux'
      default:
        return 'Masaüstü'
    }
  }

  // PWA yükleme desteği
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPWAButton, setShowPWAButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPWAButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Eğer zaten yüklüyse butonu gösterme
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPWAButton(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handlePWAInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowPWAButton(false)
    }

    setDeferredPrompt(null)
  }

  // Electron veya PWA standalone ise bileşeni tamamen gizle
  if (shouldHide) {
    return null
  }

  return (
    <div className="download-section">
      <button
        className="download-btn"
        onClick={handleDownload}
        disabled={isInstalling || platform === 'unknown'}
      >
        {isInstalling ? (
          <>⏳ İndiriliyor...</>
        ) : (
          <>
            {getPlatformIcon()} {getPlatformName()} için İndir
          </>
        )}
      </button>

      {showPWAButton && (
        <button
          className="download-btn pwa-btn"
          onClick={handlePWAInstall}
        >
          📱 Uygulama Olarak Yükle (PWA)
        </button>
      )}

      <p className="download-info">
        Pop-up masaüstü uygulamasını indirin veya tarayıcınızdan "Ana ekrana ekle" ile PWA olarak yükleyin.
      </p>
    </div>
  )
}

export default DownloadButton
