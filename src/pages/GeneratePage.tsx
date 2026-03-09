import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Download,
  Copy,
  Type,
  Link2,
  Mail,
  Phone,
  Palette,
  Wifi,
  Contact,
  MessageSquare,
  MapPin,
  Bitcoin,
  ChevronDown,
  QrCode,
  FileImage,
  History,
  ScanLine,
} from 'lucide-react';
import { useQrGenerator } from '../hooks/hooks';
import { useQrSettingsStore } from '../stores/stores';
import {
  QR_SIZE_MIN,
  QR_SIZE_MAX,
  ERROR_CORRECTION_LEVELS,
  PRESET_COLORS,
} from '../constants/constants';
import { QrGeneratorService } from '../services/services';
import { downloadFile, formatWifiQR, formatVCardQR, isValidUrl } from '../utils/utils';
import { GeneratedQr, DataType, WifiConfig, VCardConfig } from '../types/types';
import { InputWithIcon } from '../components/InputWithIcon';
import { useNavigate } from 'react-router-dom';

const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<DataType>('url');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // States for different types
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [wifi, setWifi] = useState<WifiConfig>({ ssid: '', password: '', security: 'WPA' });
  const [vcard, setVcard] = useState<VCardConfig>({
    name: '',
    phone: '',
    email: '',
    company: '',
    url: '',
  });
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [sms, setSms] = useState({ phone: '', message: '' });
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [bitcoin, setBitcoin] = useState({ address: '', amount: '' });
  const [lastQr, setLastQr] = useState<GeneratedQr | null>(null);
  const { settings, updateSettings } = useQrSettingsStore();
  const { generate, isGenerating } = useQrGenerator();

  const currentContent = useMemo(() => {
    switch (activeType) {
      case 'url':
        return url;
      case 'text':
        return text;
      case 'wifi':
        return formatWifiQR(wifi);
      case 'vcard':
        return formatVCardQR(vcard);
      case 'email':
        return `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      case 'sms':
        return `SMSTO:${sms.phone}:${sms.message}`;
      case 'location':
        return `geo:${location.lat},${location.lng}`;
      case 'bitcoin':
        return `bitcoin:${bitcoin.address}${bitcoin.amount ? `?amount=${bitcoin.amount}` : ''}`;
      case 'phone':
        return `tel:${text}`;
      default:
        return '';
    }
  }, [activeType, url, text, wifi, vcard, email, sms, location, bitcoin]);

  const handleGenerate = async () => {
    if (!currentContent) return;
    const qr = await generate(currentContent);
    if (qr) setLastQr(qr);
  };

  const handleDownloadSvg = async () => {
    if (!lastQr) return;
    const svg = await QrGeneratorService.generateSvg(lastQr.data, settings);
    downloadFile(svg, `qr-code-${Date.now()}.svg`, 'image/svg+xml');
  };

  const handleCopy = async () => {
    if (!lastQr) return;
    try {
      await QrGeneratorService.copyImageToClipboard(lastQr.dataUrl);
      alert('QR Image copied to clipboard!');
    } catch {
      alert('Failed to copy. Try downloading the file.');
    }
  };

  const typeTabs = [
    { id: 'url', label: 'URL', icon: <Link2 className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'vcard', label: 'vCard', icon: <Contact className="w-4 h-4" /> },
  ];

  const moreTypes = [
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
    { id: 'bitcoin', label: 'Bitcoin', icon: <Bitcoin className="w-4 h-4" /> },
    { id: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Settings & Input Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {typeTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id as DataType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeType === t.id
                    ? 'bg-[#1C2B3A] text-[#F4F7FA] accent-shadow'
                    : 'text-[#6b8299] hover:text-[#1C2B3A] hover:bg-[rgba(28,43,58,0.08)]'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <div className="relative group" ref={moreRef}>
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[#6b8299] hover:text-[#1C2B3A] hover:bg-[rgba(28,43,58,0.08)] transition-all"
              >
                More <ChevronDown className="w-4 h-4" />
              </button>
              <div
                className={`absolute top-full left-0 mt-2 w-48 glass-card p-2 z-20 shadow-lg ${showMore ? 'block' : 'hidden'} group-hover:block`}
              >
                {moreTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveType(t.id as DataType);
                      setShowMore(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-[#6b8299] hover:text-[#1C2B3A] hover:bg-[rgba(28,43,58,0.08)] rounded-lg transition-colors"
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Inputs */}
          <div className="space-y-4">
            {activeType === 'url' && (
              <InputWithIcon
                icon={Link2}
                value={url}
                onChange={setUrl}
                placeholder="https://example.com"
                error={url ? !isValidUrl(url) : false}
              />
            )}

            {activeType === 'text' && (
              <div className="relative">
                <Type className="absolute left-4 top-5 w-5 h-5 text-[#1C2B3A]" />
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your message here..."
                  className="w-full min-h-[120px] pl-12 pr-4 py-4 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)] transition-all resize-none"
                />
              </div>
            )}

            {activeType === 'wifi' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="SSID (Network Name)"
                  value={wifi.ssid}
                  onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={wifi.password}
                  onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <select
                  value={wifi.security}
                  onChange={(e) =>
                    setWifi({ ...wifi, security: e.target.value as WifiConfig['security'] })
                  }
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Encryption</option>
                </select>
              </div>
            )}

            {activeType === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={vcard.name}
                  onChange={(e) => setVcard({ ...vcard, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={vcard.phone}
                  onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={vcard.email}
                  onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)] sm:col-span-2"
                />
              </div>
            )}

            {activeType === 'email' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Recipient Email"
                  value={email.to}
                  onChange={(e) => setEmail({ ...email, to: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={email.subject}
                  onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <textarea
                  placeholder="Message Body"
                  value={email.body}
                  onChange={(e) => setEmail({ ...email, body: e.target.value })}
                  className="w-full min-h-[80px] px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)] sm:col-span-2 resize-none"
                />
              </div>
            )}

            {activeType === 'sms' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={sms.phone}
                  onChange={(e) => setSms({ ...sms, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <textarea
                  placeholder="Message"
                  value={sms.message}
                  onChange={(e) => setSms({ ...sms, message: e.target.value })}
                  className="w-full min-h-[80px] px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)] resize-none"
                />
              </div>
            )}

            {activeType === 'location' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Latitude (e.g., 40.7128)"
                  value={location.lat}
                  onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <input
                  type="text"
                  placeholder="Longitude (e.g., -74.0060)"
                  value={location.lng}
                  onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
              </div>
            )}

            {activeType === 'bitcoin' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Bitcoin Address"
                  value={bitcoin.address}
                  onChange={(e) => setBitcoin({ ...bitcoin, address: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
                <input
                  type="number"
                  step="0.00000001"
                  placeholder="Amount (optional)"
                  value={bitcoin.amount}
                  onChange={(e) => setBitcoin({ ...bitcoin, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)]"
                />
              </div>
            )}

            {activeType === 'phone' && (
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C2B3A]" />
                <input
                  type="tel"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-12 pr-4 py-4 bg-[#eaf0f6] border border-[#dde5ed] rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)] transition-all"
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !currentContent}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isGenerating || !currentContent
                  ? 'bg-[#eaf0f6] text-[#6b8299] cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              <QrCode className="w-5 h-5" />
              {isGenerating ? 'GENERATING...' : 'GENERATE QR CODE'}
            </button>
          </div>
        </div>

        {/* Customization */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#0d1e2e] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#1C2B3A]" /> Customize Design
            </h3>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[#1C2B3A] text-sm font-bold hover:underline"
            >
              {showAdvanced ? 'Hide Options' : 'Show Options'}
            </button>
          </div>

          <div className="space-y-8">
            {/* Size Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#6b8299]">QR CODE SIZE</label>
                <span className="text-sm font-mono font-extrabold text-[#1C2B3A]">
                  {settings.size}px
                </span>
              </div>
              <input
                type="range"
                min={QR_SIZE_MIN}
                max={QR_SIZE_MAX}
                value={settings.size}
                onChange={(e) => updateSettings({ size: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#eaf0f6] rounded-lg appearance-none cursor-pointer accent-[#1C2B3A]"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-[#6b8299] mb-4 uppercase tracking-wider">
                  QR Color
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ fgColor: color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${settings.fgColor === color ? 'border-[#1C2B3A] scale-110 shadow-lg' : 'border-[#dde5ed]'}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#dde5ed]">
                    <input
                      type="color"
                      value={settings.fgColor}
                      onChange={(e) => updateSettings({ fgColor: e.target.value })}
                      className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
                    />
                  </div>
                  <span className="text-xs font-mono text-[#6b8299]">
                    {settings.fgColor.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-[#6b8299] uppercase tracking-wider">
                    Background
                  </label>
                  <button
                    onClick={() => updateSettings({ transparentBg: !settings.transparentBg })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.transparentBg ? 'bg-[#1C2B3A]' : 'bg-[#dde5ed]'}`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.transparentBg ? 'translate-x-6' : ''}`}
                    />
                  </button>
                </div>
                {!settings.transparentBg && (
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#dde5ed]">
                      <input
                        type="color"
                        value={settings.bgColor}
                        onChange={(e) => updateSettings({ bgColor: e.target.value })}
                        className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
                      />
                    </div>
                    <span className="text-xs font-mono text-[#6b8299]">
                      BG: {settings.bgColor.toUpperCase()}
                    </span>
                  </div>
                )}
                {settings.transparentBg && (
                  <span className="text-xs text-[#1C2B3A] font-bold">Transparent Enabled</span>
                )}
              </div>
            </div>

            {/* Error Correction */}
            {showAdvanced && (
              <div className="pt-4 border-t border-[#dde5ed]">
                <label className="block text-sm font-bold text-[#6b8299] mb-3">
                  ERROR CORRECTION
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ERROR_CORRECTION_LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => updateSettings({ errorCorrectionLevel: level })}
                      className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                        settings.errorCorrectionLevel === level
                          ? 'bg-[#1C2B3A] border-[#1C2B3A] text-[#F4F7FA]'
                          : 'bg-[#eaf0f6] border-[#dde5ed] text-[#6b8299] hover:text-[#1C2B3A]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Column */}
      <div className="space-y-6">
        <div className="glass-card p-6 sticky top-24">
          <div className="aspect-square bg-[#eaf0f6] rounded-2xl flex items-center justify-center p-8 mb-6 border border-[#dde5ed] shadow-inner">
            {lastQr ? (
              <div className="relative group overflow-hidden rounded-xl">
                <img src={lastQr.dataUrl} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-[#1C2B3A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-all"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <QrCode className="w-16 h-16 text-[#dde5ed] mx-auto mb-4" />
                <p className="text-[#6b8299] text-sm font-medium px-8">
                  Fill the form to generate preview
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => lastQr && downloadFile(lastQr.dataUrl, `qr-${Date.now()}.png`)}
              disabled={!lastQr}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                !lastQr
                  ? 'bg-[#eaf0f6] text-[#6b8299] cursor-not-allowed'
                  : 'bg-[#1C2B3A] text-[#F4F7FA] hover:bg-[#0d1e2e]'
              }`}
            >
              <Download className="w-4 h-4" /> PNG
            </button>
            <button
              onClick={handleDownloadSvg}
              disabled={!lastQr}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                !lastQr
                  ? 'bg-[#eaf0f6] text-[#6b8299] cursor-not-allowed'
                  : 'bg-[#1C2B3A] text-[#F4F7FA] hover:bg-[#0d1e2e]'
              }`}
            >
              <FileImage className="w-4 h-4" /> SVG
            </button>
            <button
              onClick={handleCopy}
              disabled={!lastQr}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                !lastQr
                  ? 'bg-[#eaf0f6] text-[#6b8299] cursor-not-allowed'
                  : 'bg-[#eaf0f6] text-[#1C2B3A] border border-[#dde5ed] hover:bg-[#dde5ed]'
              }`}
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-[#eaf0f6] text-[#1C2B3A] border border-[#dde5ed] hover:bg-[#dde5ed] transition-all"
            >
              <History className="w-4 h-4" /> History
            </button>
          </div>

          {lastQr && (
            <div className="mt-6 pt-6 border-t border-[#dde5ed] flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#6b8299] uppercase tracking-widest">
                Type: {lastQr.type}
              </span>
              <button
                onClick={() => navigate('/scan')}
                className="flex items-center gap-1 text-[10px] font-bold text-[#1C2B3A] uppercase tracking-widest hover:underline"
              >
                Scan Image <ScanLine className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
