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
    expect(quality.reasons.join(' ')).toContain('비트레이트');
  });

  it('penalizes protected HLS hosts even when Radio Browser metadata looks healthy', () => {
    const quality = scoreStationQuality({
      codec: 'AAC',
      bitrate: 179,
      hls: 1,
      lastcheckok: 1,
      ssl_error: 0,
      url_resolved: 'https://mtist.as.smartstream.ne.jp/30078/livestream/playlist.m3u8'
    });

    expect(quality.grade).toBe('low');
    expect(quality.score).toBeLessThan(64);
    expect(quality.isLikelyPlayable).toBe(false);
    expect(quality.reasons.join(' ')).toContain('접속 제한');
  });

  it('penalizes expiring HLS token URLs so they do not rank as excellent', () => {
    const quality = scoreStationQuality({
      codec: 'AAC',
      bitrate: 145,
      hls: 1,
      lastcheckok: 1,
      ssl_error: 0,
      url_resolved: 'https://radiolive.sbs.co.kr/powerpc/powerfm.stream/playlist.m3u8?token=expired'
    });

    expect(quality.grade).toBe('low');
    expect(quality.isLikelyPlayable).toBe(false);
    expect(quality.reasons.join(' ')).toContain('토큰');
  });
});
