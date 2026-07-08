import { describe, expect, it } from 'vitest';
import { scoreStationQuality } from '../lib/qualityScore';

describe('scoreStationQuality', () => {
  it('grades high bitrate AAC HTTPS streams as excellent', () => {
    const quality = scoreStationQuality({
      codec: 'AAC',
      bitrate: 128,
      hls: 1,
      lastcheckok: 1,
      ssl_error: 0,
      url_resolved: 'https://example.com/live.aac'
    });

    expect(quality.grade).toBe('excellent');
    expect(quality.score).toBeGreaterThanOrEqual(80);
  });

  it('marks failed recent checks as failed regardless of bitrate', () => {
    const quality = scoreStationQuality({
      codec: 'MP3',
      bitrate: 320,
      hls: 0,
      lastcheckok: 0,
      ssl_error: 0,
      url_resolved: 'https://example.com/live.mp3'
    });

    expect(quality.grade).toBe('failed');
    expect(quality.isLikelyPlayable).toBe(false);
  });

  it('keeps missing codec and bitrate in the unknown range', () => {
    const quality = scoreStationQuality({
      hls: 0,
      lastcheckok: 1,
      ssl_error: 0,
      url_resolved: 'https://example.com/live'
    });

    expect(['unknown', 'fair']).toContain(quality.grade);
    expect(quality.reasons.join(' ')).toContain('비트레이트 확인 필요');
  });

  it('penalizes HLS streams when native browser HLS playback is not available', () => {
    const quality = scoreStationQuality(
      {
        codec: 'AAC',
        bitrate: 322,
        hls: 1,
        lastcheckok: 1,
        ssl_error: 0,
        url_resolved: 'https://example.com/playlist.m3u8'
      },
      { nativeHlsSupported: false }
    );

    expect(quality.score).toBeLessThan(64);
    expect(quality.isLikelyPlayable).toBe(false);
    expect(quality.reasons.join(' ')).toContain('HLS 직접 재생 제한');
  });

  it('marks a stream failed after a local playback failure', () => {
    const quality = scoreStationQuality(
      {
        codec: 'AAC',
        bitrate: 192,
        hls: 0,
        lastcheckok: 1,
        ssl_error: 0,
        url_resolved: 'https://example.com/live.aac'
      },
      { hasRecentPlaybackFailure: true }
    );

    expect(quality.grade).toBe('failed');
    expect(quality.score).toBe(0);
    expect(quality.isLikelyPlayable).toBe(false);
  });
});
