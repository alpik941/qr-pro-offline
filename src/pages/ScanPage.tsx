import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Scan,
  Zap,
  ZapOff,
  AlertCircle,
} from 'lucide-react';
import { useQrScanner } from '../hooks/hooks';
import { isValidUrl } from '../utils/utils';

const ScanPage: React.FC = () => {
  const { start, stop, scanFile, toggleTorch, isScanning, error, hasTorch, isTorchOn } =
    useQrScanner();
  const [result, setResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartCamera = () => {
    setResult(null);
    start('qr-scanner-view', (data) => {
      setResult(data);
      stop();
    });
  };

  const handleStopCamera = () => {
    stop();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResult(null);
      const res = await scanFile(file);
      if (res) setResult(res.data);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    }
  };

  const resultType = result
    ? isValidUrl(result)
      ? 'URL'
      : result.startsWith('WIFI:')
        ? 'WI-FI'
        : 'TEXT'
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="glass-card border-white/10 overflow-hidden shadow-2xl">
        {/* Tabs */}
        <div className="flex bg-white/5 p-1 border-b border-white/5">
          <button
            onClick={() => {
              setActiveTab('camera');
              handleStopCamera();
              setResult(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all rounded-t-lg ${activeTab === 'camera' ? 'bg-[#22c55e] text-white accent-shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <Camera className="w-4 h-4" /> CAMERA
          </button>
          <button
            onClick={() => {
              setActiveTab('upload');
              handleStopCamera();
              setResult(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all rounded-t-lg ${activeTab === 'upload' ? 'bg-[#22c55e] text-white accent-shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <Upload className="w-4 h-4" /> UPLOAD
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'camera' ? (
            <div className="space-y-6">
              <div className="relative aspect-square bg-[#1e2d5e] rounded-2xl overflow-hidden flex items-center justify-center border-2 border-white/10">
                <div
                  id="qr-scanner-view"
                  className="absolute inset-0 w-full h-full scale-[1.01]"
                ></div>

                {/* Scanner Overlay UI */}
                {isScanning && (
                  <>
                    {/* Corners */}
                    <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-[#22c55e] rounded-tl-lg z-20"></div>
                    <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-[#22c55e] rounded-tr-lg z-20"></div>
                    <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-[#22c55e] rounded-bl-lg z-20"></div>
                    <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-[#22c55e] rounded-br-lg z-20"></div>

                    {/* Static Scanning Line (Animation removed) */}
                    <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-[#22c55e] z-20 shadow-[0_0_15px_#22c55e]"></div>

                    {/* Darkened Overlay */}
                    <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>
                  </>
                )}

                {!isScanning && !result && (
                  <div className="text-center z-10 px-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Scan className="w-10 h-10 text-white/20" />
                    </div>
                    <h4 className="text-white font-bold mb-2">Camera is currently inactive</h4>
                    <p className="text-slate-500 text-sm mb-8 max-w-[240px] mx-auto">
                      Click the button below to start real-time scanning
                    </p>
                    <button
                      onClick={handleStartCamera}
                      className="btn-primary px-8 py-3 rounded-xl flex items-center justify-center gap-2 mx-auto"
                    >
                      <Camera className="w-5 h-5" /> ENABLE CAMERA
                    </button>
                  </div>
                )}

                {isScanning && (
                  <div className="absolute top-6 right-6 z-30 flex gap-2">
                    {hasTorch && (
                      <button
                        onClick={toggleTorch}
                        className={`p-3 rounded-full transition-all shadow-xl backdrop-blur-md ${isTorchOn ? 'bg-[#22c55e] text-white' : 'bg-black/60 text-white hover:bg-black/80'}`}
                      >
                        {isTorchOn ? (
                          <Zap className="w-5 h-5 fill-current" />
                        ) : (
                          <ZapOff className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={handleStopCamera}
                      className="p-3 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors shadow-xl backdrop-blur-md"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative aspect-square border-2 border-dashed border-[#22c55e]/30 hover:border-[#22c55e] hover:bg-[#22c55e]/5 rounded-3xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center bg-white/5"
              >
                <div className="w-24 h-24 bg-[#22c55e]/10 group-hover:bg-[#22c55e]/20 rounded-full flex items-center justify-center mb-6 transition-colors accent-shadow">
                  <Upload className="w-10 h-10 text-[#22c55e]" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Drop image here</h3>
                <p className="text-slate-400 text-sm">or click to browse your local files</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          )}

          {error && activeTab === 'camera' && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-500 font-bold">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#22c55e]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-extrabold text-sm uppercase tracking-widest">
                    QR CODE DETECTED
                  </span>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/10 uppercase">
                  {resultType}
                </span>
              </div>

              <div className="bg-[#1e2d5e] border-l-4 border-[#22c55e] rounded-xl p-6 relative group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white font-mono text-sm leading-relaxed break-words pr-8">
                  {result}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  <Copy className="w-4 h-4" /> COPY DATA
                </button>
                {isValidUrl(result) && (
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 btn-primary rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" /> OPEN LINK
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="file-scanner-temp" className="hidden"></div>
    </div>
  );
};

export default ScanPage;
