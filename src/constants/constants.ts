import { ErrorCorrectionLevel } from '../types/types';

export const QR_SIZES = [128, 192, 256, 320, 384, 448, 512];
export const QR_SIZE_MIN = 100;
export const QR_SIZE_MAX = 600;
export const QR_SIZE_DEFAULT = 300;

export const ERROR_CORRECTION_LEVELS: ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];

export const ERROR_CORRECTION_DESCRIPTIONS = {
  L: 'Low (7% recovery)',
  M: 'Medium (15% recovery)',
  Q: 'Quartile (25% recovery)',
  H: 'High (30% recovery)',
};

export const MAX_HISTORY_ITEMS = 50;

export const DATA_TYPES = [
  'text',
  'url',
  'wifi',
  'vcard',
  'email',
  'phone',
  'sms',
  'location',
  'bitcoin',
] as const;

export const PRESET_COLORS = [
  '#000000',
  '#ffffff',
  '#22c55e',
  '#3b82f6',
  '#ef4444',
  '#a855f7',
  '#f97316',
  '#eab308',
];

export const STORAGE_KEYS = {
  QR_STORE: 'qr-pro-settings-v2',
  HISTORY_STORE: 'qr-pro-history-v2',
};
