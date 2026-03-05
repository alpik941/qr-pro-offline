import {
  generateId,
  isValidUrl,
  formatWifiQR,
  formatVCardQR,
  detectDataType,
  formatTimestamp,
} from '../utils/utils';

describe('Utils', () => {
  describe('generateId', () => {
    it('should generate unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs correctly', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
    });
  });

  describe('formatWifiQR', () => {
    it('should format WiFi QR code string', () => {
      const config = { ssid: 'MyWiFi', password: 'password123', security: 'WPA' as const };
      const result = formatWifiQR(config);
      expect(result).toBe('WIFI:S:MyWiFi;T:WPA;P:password123;;');
    });

    it('should handle empty password', () => {
      const config = { ssid: 'MyWiFi', password: '', security: 'nopass' as const };
      const result = formatWifiQR(config);
      expect(result).toBe('WIFI:S:MyWiFi;T:nopass;P:;;');
    });
  });

  describe('formatVCardQR', () => {
    it('should format vCard QR code string', () => {
      const config = {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        company: 'ACME Corp',
        url: 'https://example.com',
      };
      const result = formatVCardQR(config);
      expect(result).toContain('BEGIN:VCARD');
      expect(result).toContain('FN:John Doe');
      expect(result).toContain('TEL:+1234567890');
      expect(result).toContain('EMAIL:john@example.com');
      expect(result).toContain('ORG:ACME Corp');
      expect(result).toContain('URL:https://example.com');
      expect(result).toContain('END:VCARD');
    });
  });

  describe('detectDataType', () => {
    it('should detect URL', () => {
      expect(detectDataType('https://example.com')).toBe('url');
    });

    it('should detect WiFi', () => {
      expect(detectDataType('WIFI:S:MyWiFi;T:WPA;P:password;;')).toBe('wifi');
    });

    it('should detect vCard', () => {
      expect(detectDataType('BEGIN:VCARD\nFN:John Doe\nEND:VCARD')).toBe('vcard');
    });

    it('should detect email', () => {
      expect(detectDataType('user@example.com')).toBe('email');
    });

    it('should default to text', () => {
      expect(detectDataType('some random text')).toBe('text');
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const timestamp = new Date('2023-01-01T12:00:00Z').getTime();
      const result = formatTimestamp(timestamp);
      expect(result).toContain('Jan 1, 2023');
      expect(result).toContain('3:00 PM');
    });
  });
});
