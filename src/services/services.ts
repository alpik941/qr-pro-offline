import QRCode from 'qrcode';
import { Html5Qrcode } from 'html5-qrcode';
import { GeneratedQr, QrGeneratorSettings, ScannedQr } from '../types/types';
import { generateId, detectDataType } from '../utils/utils';

export class QrGeneratorService {
  static async generate(data: string, settings: QrGeneratorSettings): Promise<GeneratedQr> {
    try {
      const dataUrl = await QRCode.toDataURL(data, {
        width: settings.size,
        margin: 1,
        color: {
          dark: settings.fgColor,
          light: settings.transparentBg ? '#00000000' : settings.bgColor,
        },
        errorCorrectionLevel: settings.errorCorrectionLevel,
      });

      return {
        id: generateId(),
        data,
        settings,
        dataUrl,
        timestamp: Date.now(),
        type: detectDataType(data),
      };
    } catch (error) {
      console.error('QR Generation failed', error);
      throw new Error('Failed to generate QR code', { cause: error });
    }
  }

  static async generateSvg(data: string, settings: QrGeneratorSettings): Promise<string> {
    try {
      const svg = await QRCode.toString(data, {
        type: 'svg',
        width: settings.size,
        margin: 1,
        color: {
          dark: settings.fgColor,
          light: settings.transparentBg ? '#00000000' : settings.bgColor,
        },
        errorCorrectionLevel: settings.errorCorrectionLevel,
      });
      return svg;
    } catch (error) {
      console.error('QR SVG Generation failed', error);
      throw new Error('Failed to generate SVG QR code', { cause: error });
    }
  }

  static async copyImageToClipboard(dataUrl: string): Promise<void> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  }
}

export class QrScannerService {
  private scanner: Html5Qrcode | null = null;
  private isTorchOn: boolean = false;

  async startCamera(
    elementId: string,
    onSuccess: (text: string) => void,
    onError: (err: string) => void
  ): Promise<void> {
    this.scanner = new Html5Qrcode(elementId);
    try {
      await this.scanner.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 250, height: 250 } },
        onSuccess,
        (msg) => {
          if (!msg.includes('No QR code found')) {
            onError(msg);
          }
        }
      );
      this.isTorchOn = false;
    } catch (err) {
      throw new Error('Camera access denied or error: ' + err, { cause: err });
    }
  }

  async stopCamera(): Promise<void> {
    if (this.scanner && this.scanner.isScanning) {
      this.isTorchOn = false;
      await this.scanner.stop();
      this.scanner.clear();
      this.scanner = null;
    }
  }

  async setTorch(on: boolean): Promise<void> {
    if (!this.scanner || !this.scanner.isScanning) return;
    try {
      const track = this.scanner.getRunningTrackCapabilities();
      if (track && 'torch' in track) {
        await this.scanner.applyVideoConstraints({
          advanced: [{ torch: on } as unknown as Record<string, unknown>],
        });
        this.isTorchOn = on;
      }
    } catch (err) {
      console.error('Torch error:', err);
    }
  }

  getTorchCapability(): boolean {
    if (!this.scanner || !this.scanner.isScanning) return false;
    try {
      const capabilities = this.scanner.getRunningTrackCapabilities();
      return !!(capabilities && 'torch' in capabilities);
    } catch {
      return false;
    }
  }

  static async scanFile(file: File): Promise<ScannedQr> {
    const scanner = new Html5Qrcode('file-scanner-temp');
    try {
      const result = await scanner.scanFile(file, true);
      scanner.clear();
      return {
        id: generateId(),
        data: result,
        timestamp: Date.now(),
        source: 'file',
        type: detectDataType(result),
      };
    } catch (err) {
      scanner.clear();
      throw new Error('Could not read QR from file', { cause: err });
    }
  }
}
