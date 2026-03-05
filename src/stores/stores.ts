import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QrGeneratorSettings, GeneratedQr, ScannedQr } from '../types/types';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS, QR_SIZE_DEFAULT } from '../constants/constants';

interface QrSettingsState {
  settings: QrGeneratorSettings;
  updateSettings: (newSettings: Partial<QrGeneratorSettings>) => void;
}

export const useQrSettingsStore = create<QrSettingsState>()(
  persist(
    (set) => ({
      settings: {
        size: QR_SIZE_DEFAULT,
        fgColor: '#000000',
        bgColor: '#ffffff',
        transparentBg: false,
        errorCorrectionLevel: 'M',
      },
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    { name: STORAGE_KEYS.QR_STORE }
  )
);

interface HistoryState {
  generated: GeneratedQr[];
  scanned: ScannedQr[];
  addGenerated: (qr: GeneratedQr) => void;
  addScanned: (qr: ScannedQr) => void;
  removeGenerated: (id: string) => void;
  removeScanned: (id: string) => void;
  clearGenerated: () => void;
  clearScanned: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      generated: [],
      scanned: [],
      addGenerated: (qr) =>
        set((state) => ({
          generated: [qr, ...state.generated].slice(0, MAX_HISTORY_ITEMS),
        })),
      addScanned: (qr) =>
        set((state) => ({
          scanned: [qr, ...state.scanned].slice(0, MAX_HISTORY_ITEMS),
        })),
      removeGenerated: (id) =>
        set((state) => ({
          generated: state.generated.filter((i) => i.id !== id),
        })),
      removeScanned: (id) =>
        set((state) => ({
          scanned: state.scanned.filter((i) => i.id !== id),
        })),
      clearGenerated: () => set({ generated: [] }),
      clearScanned: () => set({ scanned: [] }),
    }),
    { name: STORAGE_KEYS.HISTORY_STORE }
  )
);
