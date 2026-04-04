[English](README.md) | [Türkçe](README.tr.md)

# Pomodoro Zamanlayıcı 🍅

Web, Masaüstü (Electron) ve Mobil (PWA) için tasarlanmış çoklu platform destekli bir Pomodoro Zamanlayıcı uygulaması. Temiz, verimli ve kullanıcı dostu bu zamanlayıcı ile odaklanın ve üretkenliğinizi artırın.

## 🚀 Özellikler

- **Çoklu Platform Desteği:** Web tarayıcılarında, masaüstü uygulaması olarak ve mobil cihazlarda sorunsuz çalışır.
- **Odaklanma Seansları:** Aralıklarla çalışmanıza yardımcı olacak klasik Pomodoro tekniği uygulaması.
- **Modern Arayüz:** Hızlı ve duyarlı bir kullanıcı deneyimi için React ile geliştirilmiştir.
- **Çevrimdışı Kullanım:** PWA özellikleriyle internet bağlantısı olmadan da çalışabilir.

## 🛠️ Kullanılan Teknolojiler

- **Frontend (Önyüz):** [React](https://reactjs.org/) (v18)
- **Paketleyici (Build):** [Vite](https://vitejs.dev/)
- **Dil:** TypeScript
- **Masaüstü (Desktop):** [Electron](https://www.electronjs.org/) & [electron-builder](https://www.electron.build/)
- **Mobil/Web:** `vite-plugin-pwa` aracılığıyla PWA

## 📦 Gereksinimler

Başlamadan önce, aşağıdaki gereksinimleri karşıladığınızdan emin olun:
* Sisteminizde [Node.js](https://nodejs.org/en/)'in güncel bir sürümü ve npm (veya yarn/pnpm) yüklü olmalıdır.

## 🔧 Kurulum

1. Repoyu bilgisayarınıza klonlayın:
   ```bash
   git clone <repo-adresiniz>
   cd pomodoro-timer
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

## 💻 Kullanım & Komutlar

Bu proje, geliştirme ve build (derleme) süreçlerinde size yardımcı olacak birkaç kullanışlı komut içerir.

**Web Geliştirme**
- `npm run dev`: Web uygulaması için Vite geliştirme sunucusunu başlatır.
- `npm run build`: TypeScript kodlarını derler ve web uygulamasını production (canlı ortam) için hazırlar.
- `npm run preview`: Canlıya hazır web build'ini yerel bilgisayarınızda test amaçlı çalıştırır.

**Masaüstü (Electron) Geliştirme**
- `npm run electron:dev`: Geliştirme kolaylığı için Vite sunucusunu ve Electron uygulamasını aynı anda başlatır.
- `npm run electron:build`: Hem web uygulamasını hem de Electron uygulamasını çalıştırılabilir dosya (exe, dmg vb.) olarak derler.

## 🤝 Katkıda Bulunma

Katkıda bulunmak isterseniz her zaman bekleriz! Geliştirme önerileri için bir *pull request (çekme isteği)* oluşturmaktan veya *issue (hata/öneri kaydı)* açmaktan çekinmeyin.

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.
