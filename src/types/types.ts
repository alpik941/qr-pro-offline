export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type DataType =
  | 'text'
  | 'url'
  | 'email'
  | 'phone'
  | 'wifi'
  | 'vcard'
  | 'sms'
  | 'location'
  | 'bitcoin';

export interface WifiConfig {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'nopass';
}

export interface VCardConfig {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  url?: string;
}

export interface QrGeneratorSettings {
  size: number;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface GeneratedQr {
  id: string;
  data: string;
  settings: QrGeneratorSettings;
  dataUrl: string;
  timestamp: number;
  type: DataType;
}

export interface ScannedQr {
  id: string;
  data: string;
  timestamp: number;
  source: 'camera' | 'file';
  type: DataType;
}
