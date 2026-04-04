const fs = require('fs');
const path = require('path');

// Build dosyalarını public/downloads klasörüne kopyala
const releaseDir = path.join(__dirname, '../release');
const publicDownloadsDir = path.join(__dirname, '../public/downloads');

// public/downloads klasörünü oluştur
if (!fs.existsSync(publicDownloadsDir)) {
  fs.mkdirSync(publicDownloadsDir, { recursive: true });
}

// Release klasöründeki dosyaları kopyala
if (fs.existsSync(releaseDir)) {
  const files = fs.readdirSync(releaseDir);
  
  files.forEach(file => {
    // Sadece .exe, .dmg, .AppImage dosyalarını kopyala
    if (file.endsWith('.exe') || file.endsWith('.dmg') || file.endsWith('.AppImage')) {
      const sourcePath = path.join(releaseDir, file);
      const destPath = path.join(publicDownloadsDir, file);
      
      // Dosyayı kopyala
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Kopyalandı: ${file}`);
    }
  });
  
  console.log('\n✅ Build dosyaları public/downloads klasörüne kopyalandı!');
  console.log('Web sitesinden indirilebilir:');
  files
    .filter(f => f.endsWith('.exe') || f.endsWith('.dmg') || f.endsWith('.AppImage'))
    .forEach(f => console.log(`   - /downloads/${f}`));
} else {
  console.log('⚠️  Release klasörü bulunamadı. Önce electron:build çalıştırın.');
}
