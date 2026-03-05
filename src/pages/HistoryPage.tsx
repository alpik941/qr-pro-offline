import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Search,
  Download,
  ExternalLink,
  Copy,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  X,
} from 'lucide-react';
import { useHistoryStore } from '../stores/stores';
import { formatTimestamp, isValidUrl, downloadFile } from '../utils/utils';
import { GeneratedQr } from '../types/types';

const HistoryPage: React.FC = () => {
  const { generated, scanned, removeGenerated, removeScanned, clearGenerated, clearScanned } =
    useHistoryStore();
  const [activeTab, setActiveTab] = useState<'generated' | 'scanned'>('generated');
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    const list = activeTab === 'generated' ? generated : scanned;
    if (!search) return list;
    return list.filter((item) => item.data.toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, generated, scanned, search]);

  const handleExport = () => {
    const data = JSON.stringify(
      { generated, scanned, exportedAt: new Date().toISOString() },
      null,
      2
    );
    downloadFile(data, `qr-pro-history-${Date.now()}.json`, 'application/json');
  };

  const handleClear = () => {
    if (confirm(`Clear all ${activeTab} items? This cannot be undone.`)) {
      if (activeTab === 'generated') {
        clearGenerated();
      } else {
        clearScanned();
      }
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Text copied!');
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex glass-card p-1 border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('generated')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 justify-center ${activeTab === 'generated' ? 'bg-[#22c55e] text-white accent-shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <ArrowUpRight className="w-4 h-4" /> GENERATED
          </button>
          <button
            onClick={() => setActiveTab('scanned')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 justify-center ${activeTab === 'scanned' ? 'bg-[#22c55e] text-white accent-shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <ArrowDownLeft className="w-4 h-4" /> SCANNED
          </button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4" /> EXPORT JSON
          </button>
          <button
            onClick={handleClear}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" /> CLEAR ALL
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by data or content..."
          className="w-full pl-11 pr-4 py-4 glass-card border-white/10 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-white placeholder:text-slate-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="glass-card p-4 border-white/5 hover:border-[#22c55e]/30 transition-all group flex flex-col sm:flex-row gap-5 sm:items-center"
            >
              {activeTab === 'generated' && (item as GeneratedQr).dataUrl && (
                <div className="w-20 h-20 bg-white rounded-xl p-1.5 flex-shrink-0 accent-shadow group-hover:scale-105 transition-transform">
                  <img
                    src={(item as GeneratedQr).dataUrl}
                    alt="QR"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {activeTab === 'scanned' && (
                <div className="w-20 h-20 bg-[#1e2d5e] rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 accent-shadow">
                  <ArrowDownLeft className="w-8 h-8 text-[#22c55e]" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.type === 'url'
                        ? 'bg-blue-500/20 text-blue-400'
                        : item.type === 'vcard'
                          ? 'bg-purple-500/20 text-purple-400'
                          : item.type === 'wifi'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(item.timestamp)}
                  </div>
                </div>
                <p className="text-white font-medium text-sm truncate pr-4">{item.data}</p>
              </div>

              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => handleCopy(item.data)}
                  className="p-3 bg-white/5 text-slate-400 hover:text-[#22c55e] hover:bg-[#22c55e]/10 rounded-xl transition-all"
                  title="Copy content"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {isValidUrl(item.data) && (
                  <a
                    href={item.data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 text-slate-400 hover:text-[#22c55e] hover:bg-[#22c55e]/10 rounded-xl transition-all"
                    title="Visit link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {activeTab === 'generated' && (
                  <button
                    onClick={() => downloadFile((item as GeneratedQr).dataUrl, `qr-${item.id}.png`)}
                    className="p-3 bg-white/5 text-slate-400 hover:text-[#22c55e] hover:bg-[#22c55e]/10 rounded-xl transition-all"
                    title="Download PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() =>
                    activeTab === 'generated' ? removeGenerated(item.id) : removeScanned(item.id)
                  }
                  className="p-3 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 glass-card border-white/5 border-dashed">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-white font-extrabold mb-1 uppercase tracking-wider">
              No Items Found
            </h3>
            <p className="text-slate-500 text-xs">
              Your history is currently empty for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
