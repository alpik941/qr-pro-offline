import { DataType, WifiConfig, VCardConfig } from '../types/types';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const isValidUrl = (str: string): boolean => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const formatWifiQR = (config: WifiConfig): string => {
  const { ssid, password, security } = config;
  return `WIFI:S:${ssid};T:${security};P:${password || ''};;`;
};

export const formatVCardQR = (config: VCardConfig): string => {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${config.name}`,
    config.phone ? `TEL:${config.phone}` : '',
    config.email ? `EMAIL:${config.email}` : '',
    config.company ? `ORG:${config.company}` : '',
    config.url ? `URL:${config.url}` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');
};

export const detectDataType = (data: string): DataType => {
  if (isValidUrl(data)) return 'url';
  if (data.startsWith('WIFI:')) return 'wifi';
  if (data.startsWith('BEGIN:VCARD')) return 'vcard';
  if (data.includes('@') && !data.includes(' ')) return 'email';
  return 'text';
};

export const formatTimestamp = (timestamp: number): string => {
  return formatTimestampWithOptions(timestamp);
};

export const formatTimestampWithOptions = (
  timestamp: number,
  options?: {
    locale?: string;
    timeZone?: string;
  }
): string => {
  const locale = options?.locale ?? 'en-US';
  const timeZone = options?.timeZone;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date(timestamp));
};

export const downloadFile = (data: string, filename: string, type: string = 'image/png'): void => {
  const link = document.createElement('a');
  if (data.startsWith('data:')) {
    link.href = data;
  } else {
    const blob = new Blob([data], { type });
    link.href = URL.createObjectURL(blob);
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
