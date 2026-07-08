import { describe, expect, it } from 'vitest';
import { getYouTubeAlternate } from '../data/youtubeAlternates.seed';
import { getPreferredSource } from '../lib/playbackSource';
import type { RadioStation } from '../types/station';

const lowQualityStation: RadioStation = {
  stationuuid: 'seed-lofi-girl-low',
  name: 'Lofi Girl Radio Demo',
  url: 'http://example.invalid/low.mp3',
  url_resolved: 'http://example.invalid/low.mp3',
  codec: 'MP3',
  bitrate: 48,
  hls: 0,
  lastcheckok: 1,
  ssl_error: 0
};

describe('getPreferredSource', () => {
  it('keeps a verified YouTube alternate separate for low quality stations', () => {
    const alternate = getYouTubeAlternate(lowQualityStation.stationuuid);
    const recommendation = getPreferredSource(lowQualityStation, alternate);

    expect(recommendation.preferred).toBe('youtube_alternate');
    expect(recommendation.direct?.type).toBe('radio_stream');
    expect(recommendation.youtubeAlternate?.youtubeVideoId).toBe('jfKfPfyJRdk');
  });

  it('prefers direct playback for good stations without alternates', () => {
    const recommendation = getPreferredSource({
      stationuuid: 'good-direct',
      name: 'Good Direct',
      url: 'https://example.com/live.mp3',
      url_resolved: 'https://example.com/live.mp3',
      codec: 'MP3',
      bitrate: 192,
      hls: 0,
      lastcheckok: 1,
      ssl_error: 0
    });

    expect(recommendation.preferred).toBe('direct');
    expect(recommendation.youtubeAlternate).toBeNull();
  });
});
