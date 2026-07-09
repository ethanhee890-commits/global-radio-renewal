import { describe, expect, it } from 'vitest';
import { getSafeHttpsUrl, getSafeNetworkUrl, isSafeNetworkUrl } from '../lib/urlSafety';

describe('url safety helpers', () => {
  it('allows only absolute http and https URLs', () => {
    expect(getSafeNetworkUrl('https://example.com/live.mp3')).toBe('https://example.com/live.mp3');
    expect(getSafeNetworkUrl('http://example.com/live.mp3')).toBe('http://example.com/live.mp3');
    expect(isSafeNetworkUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeNetworkUrl('data:text/html,hello')).toBe(false);
    expect(isSafeNetworkUrl('/relative/path')).toBe(false);
  });

  it('can enforce https-only URLs for display assets', () => {
    expect(getSafeHttpsUrl('https://example.com/favicon.ico')).toBe('https://example.com/favicon.ico');
    expect(getSafeHttpsUrl('http://example.com/favicon.ico')).toBe('');
  });
});
