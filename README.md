# QR Pro Offline

A modern QR code generator and scanner built with React, TypeScript, and Vite. **Works 100% offline as a PWA!**

## Features

- Generate QR codes for URLs, WiFi, vCards, and more
- Scan QR codes using camera or file upload
- Customizable QR code settings (size, colors, error correction)
- History of generated and scanned codes
- **Progressive Web App (PWA)** - Install and use offline
- Modern UI with glassmorphism design

## PWA Features

- **Offline Support**: App works without internet connection
- **Installable**: Add to home screen on mobile devices
- **Service Worker**: Automatic caching and updates
- **Offline Fallback**: Graceful offline experience
- **Fast Loading**: Cached resources for instant startup

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin, Workbox
- **QR Generation**: qrcode library
- **QR Scanning**: html5-qrcode
- **Icons**: Lucide React

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## PWA Installation

After building the app (`npm run build`), you can install it as a PWA:

### On Mobile (iOS/Android):

1. Open the app in your browser
2. Tap the "Share" button
3. Select "Add to Home Screen" or "Install App"

### On Desktop (Chrome/Edge):

1. Click the install icon in the address bar
2. Or use the app menu → "Install QR Pro"

The app will work completely offline after installation!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook

## Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** with strict settings
- **Jest** + **React Testing Library** for testing
- **Storybook** for component development
- **GitHub Actions** for CI/CD

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # Business logic services
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # Application constants
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Format code: `npm run format`
7. Commit your changes
8. Push to your branch
9. Create a Pull Request

## License

MIT License
