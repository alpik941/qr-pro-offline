import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { QrCode, ScanLine, History as HistoryIcon, CheckCircle2 } from 'lucide-react';

const GeneratePage = lazy(() => import('./pages/GeneratePage'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="relative min-h-screen flex flex-col">
        <div className="stars-bg" />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0f1b4c]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="bg-[#22c55e] p-2 rounded-xl accent-shadow">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight hidden sm:block">
                QR Pro
              </span>
            </NavLink>
            <nav className="flex items-center gap-1 sm:gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-[#22c55e] text-white font-bold accent-shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                }
              >
                <QrCode className="w-4 h-4" />
                <span className="text-sm">Generate</span>
              </NavLink>
              <NavLink
                to="/scan"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-[#22c55e] text-white font-bold accent-shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                }
              >
                <ScanLine className="w-4 h-4" />
                <span className="text-sm">Scan</span>
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-[#22c55e] text-white font-bold accent-shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                }
              >
                <HistoryIcon className="w-4 h-4" />
                <span className="text-sm">History</span>
              </NavLink>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-5xl mx-auto w-full px-4 pt-10 pb-2 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            QR Code Generator & Scanner
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-slate-400 text-sm font-medium mb-8">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> URL, Wi-Fi, vCard
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> Custom PNG/SVG
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> Works 100% Offline
            </span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 relative z-10">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22c55e]"></div>
                <p className="text-[#22c55e] font-bold animate-pulse">Initializing app...</p>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<GeneratePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-10 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-10 text-slate-500 text-sm font-medium">
            <p>© 2026 QR Pro Offline.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <span className="px-3 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-xs font-bold border border-[#22c55e]/20">
                v2.0.0
              </span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
