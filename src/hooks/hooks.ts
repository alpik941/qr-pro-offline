import { useState, useCallback, useRef, useEffect } from 'react';
import { QrGeneratorService, QrScannerService } from '../services/services';
import { useQrSettingsStore, useHistoryStore } from '../stores/stores';
import { GeneratedQr } from '../types/types';

export const useQrGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useQrSettingsStore();
  const { addGenerated } = useHistoryStore();

  const generate = useCallback(
    async (data: string): Promise<GeneratedQr | null> => {
      if (!data.trim()) return null;
      setIsGenerating(true);
      setError(null);
      try {
        const qr = await QrGeneratorService.generate(data, settings);
        addGenerated(qr);
        return qr;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [settings, addGenerated]
  );

  return { generate, isGenerating, error };
};

export const useQrScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const scannerService = useRef<QrScannerService | null>(null);
  const isStartingRef = useRef(false);
  const { addScanned } = useHistoryStore();

  useEffect(() => {
    scannerService.current = new QrScannerService();
    return () => {
      scannerService.current?.stopCamera();
      scannerService.current = null;
    };
  }, []);

  const start = useCallback(
    async (elementId: string, onResult: (data: string) => void) => {
      if (isStartingRef.current || isScanning) return;

      isStartingRef.current = true;
      setIsStarting(true);
      setError(null);
      try {
        await scannerService.current?.startCamera(
          elementId,
          (data) => {
            onResult(data);
            addScanned({
              id: Date.now().toString(),
              data,
              timestamp: Date.now(),
              source: 'camera',
              type: 'text',
            });
          },
          (err) => setError(err)
        );
        setIsScanning(true);
        // Check torch capability after start
        setHasTorch(scannerService.current?.getTorchCapability() || false);
      } catch (err) {
        setIsScanning(false);
        setError(err instanceof Error ? err.message : 'Camera failed');
      } finally {
        isStartingRef.current = false;
        setIsStarting(false);
      }
    },
    [addScanned, isScanning]
  );

  const stop = useCallback(async () => {
    isStartingRef.current = false;
    await scannerService.current?.stopCamera();
    setIsScanning(false);
    setIsStarting(false);
    setHasTorch(false);
    setIsTorchOn(false);
  }, []);

  const toggleTorch = useCallback(async () => {
    if (!scannerService.current || !hasTorch) return;
    const newState = !isTorchOn;
    await scannerService.current.setTorch(newState);
    setIsTorchOn(newState);
  }, [hasTorch, isTorchOn]);

  const scanFile = useCallback(
    async (file: File) => {
      try {
        const result = await QrScannerService.scanFile(file);
        addScanned(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'File scan failed');
        return null;
      }
    },
    [addScanned]
  );

  return { start, stop, scanFile, toggleTorch, isScanning, isStarting, error, hasTorch, isTorchOn };
};
