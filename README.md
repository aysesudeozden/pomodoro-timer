[English](README.md) | [Türkçe](README.tr.md)

# Pomodoro Timer 🍅

A multi-platform Pomodoro Timer application designed for Web, Desktop (Electron), and Mobile (PWA). Stay focused and boost your productivity with this clean, efficient, and user-friendly timer.

## 🚀 Features

- **Multi-platform Support:** Works seamlessly across web browsers, as a desktop application, and on mobile devices.
- **Focus Sessions:** Classic Pomodoro technique implementation to help you work in intervals.
- **Modern UI:** Built with React for a fast and responsive user experience.
- **Offline Capable:** Works offline with PWA features.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) (v18)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Desktop Packaging:** [Electron](https://www.electronjs.org/) & [electron-builder](https://www.electron.build/)
- **Mobile/Web:** PWA via `vite-plugin-pwa`

## 📦 Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed a recent version of [Node.js](https://nodejs.org/en/) and npm (or yarn/pnpm).

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd pomodoro-timer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 💻 Usage & Scripts

This project comes with several handy commands to help you develop and build.

**Web Development**
- `npm run dev`: Starts the Vite development server for the web application.
- `npm run build`: Compiles TypeScript and builds the web application for production.
- `npm run preview`: Locally previews the production web build.

**Desktop (Electron) Development**
- `npm run electron:dev`: Starts the Vite server and the Electron application concurrently for development.
- `npm run electron:build`: Builds both the web app and the Electron app into executables.

## 🤝 Contribution

Contributions are always welcome! Feel free to open a pull request or add an issue to suggest improvements.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
