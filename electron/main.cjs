const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV !== 'production' || !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 380,
    height: 600,
    minWidth: 350,
    minHeight: 500,
    maxWidth: 450,
    maxHeight: 750,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    resizable: true,
    frame: true,
    titleBarStyle: 'default',
    backgroundColor: '#f3efe0',
    alwaysOnTop: false, // Pop-up olarak her zaman üstte (kullanıcı isterse açabilir)
    skipTaskbar: false, // Taskbar'da görünsün
    show: true, // Hemen göster
  });

  // Pencere hazır olduğunda göster ve focus et
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
    // Dev modda DevTools'u aç
    if (isDev) {
      win.webContents.openDevTools();
    }
  });

  // Hata yakalama
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    if (!isDev) {
      win.loadURL('data:text/html,<h1>Yükleme Hatası</h1><p>Uygulama yüklenemedi. Hata: ' + errorDescription + '</p>');
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    // Production modda dist klasöründen yükle
    let indexPath;

    if (app.isPackaged) {
      // Build edilmiş uygulamada dosyalar app.asar içinde
      // Electron-builder dosyaları resources/app.asar içine paketler
      indexPath = path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html');
    } else {
      // Development build'de normal path
      indexPath = path.join(__dirname, '../dist/index.html');
    }

    // Dosya yükleme - app.asar içindeki dosyalar için özel işlem
    if (app.isPackaged) {
      // app.asar içindeki dosyalar için loadFile kullan
      win.loadFile(indexPath).catch((err) => {
        console.error('Load error:', err);
        // Alternatif: app.asar içindeki dosyalara doğrudan erişim
        const asarPath = path.join(process.resourcesPath, 'app.asar');
        if (fs.existsSync(asarPath)) {
          // app.asar içindeki dist/index.html'e erişim
          win.loadURL(`file://${asarPath}/dist/index.html`);
        } else {
          win.loadURL('data:text/html,<h1>Yükleme Hatası</h1><p>Uygulama dosyaları bulunamadı.</p>');
        }
      });
    } else {
      // Development build
      if (fs.existsSync(indexPath)) {
        win.loadFile(indexPath);
      } else {
        win.loadURL('data:text/html,<h1>Build edilmemiş!</h1><p>Lütfen önce "npm run build" çalıştırın.</p>');
      }
    }
  }

  // Pencere kapatıldığında
  win.on('close', (event) => {
    // Windows'ta normal kapatma
    // macOS'ta dock'ta gizle
    if (process.platform === 'darwin' && !isDev) {
      event.preventDefault();
      app.hide();
    }
  });

  return win;
}

app.whenReady().then(() => {
  let mainWindow = createWindow();

  app.on('activate', () => {
    // macOS'ta dock'a tıklandığında pencereyi göster
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    } else {
      // Eğer pencere varsa öne getir
      const windows = BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        windows[0].show();
        windows[0].focus();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
