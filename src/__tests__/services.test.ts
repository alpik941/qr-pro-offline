import { QrGeneratorService } from '../services/services';
import { QrGeneratorSettings } from '../types/types';

// Mock QRCode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
  toString: jest.fn(),
}));

import QRCode from 'qrcode';

interface MockedQRCode {
  toDataURL: jest.MockedFunction<any>;
  toString: jest.MockedFunction<any>;
}

const mockedQRCode = QRCode as MockedQRCode;

describe('QrGeneratorService', () => {
  const mockSettings: QrGeneratorSettings = {
    size: 300,
    fgColor: '#000000',
    bgColor: '#ffffff',
    transparentBg: false,
    errorCorrectionLevel: 'M',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate QR code successfully', async () => {
      const mockDataUrl = 'data:image/png;base64,mockData';
      mockedQRCode.toDataURL.mockResolvedValue(mockDataUrl);

      const result = await QrGeneratorService.generate('test data', mockSettings);

      expect(mockedQRCode.toDataURL).toHaveBeenCalledWith('test data', {
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });

      expect(result.data).toBe('test data');
      expect(result.settings).toBe(mockSettings);
      expect(result.dataUrl).toBe(mockDataUrl);
      expect(result.type).toBe('text');
      expect(typeof result.id).toBe('string');
      expect(typeof result.timestamp).toBe('number');
    });

    it('should handle transparent background', async () => {
      const transparentSettings = { ...mockSettings, transparentBg: true };
      const mockDataUrl = 'data:image/png;base64,mockData';
      mockedQRCode.toDataURL.mockResolvedValue(mockDataUrl);

      await QrGeneratorService.generate('test data', transparentSettings);

      expect(mockedQRCode.toDataURL).toHaveBeenCalledWith('test data', {
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#00000000',
        },
        errorCorrectionLevel: 'M',
      });
    });

    it('should throw error on QR generation failure', async () => {
      mockedQRCode.toDataURL.mockRejectedValue(new Error('QR generation failed'));

      await expect(QrGeneratorService.generate('test data', mockSettings)).rejects.toThrow(
        'Failed to generate QR code'
      );
    });
  });

  describe('generateSvg', () => {
    it('should generate SVG QR code', async () => {
      const mockSvg = '<svg>mock svg</svg>';
      mockedQRCode.toString.mockResolvedValue(mockSvg);

      const result = await QrGeneratorService.generateSvg('test data', mockSettings);

      expect(mockedQRCode.toString).toHaveBeenCalledWith('test data', {
        type: 'svg',
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });

      expect(result).toBe(mockSvg);
    });
  });
});
