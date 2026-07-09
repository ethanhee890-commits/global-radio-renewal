import { describe, expect, it } from 'vitest';
import { getYouTubeAlternate, getYouTubeAlternateForStation } from '../data/youtubeAlternates.seed';
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

  it('matches verified YouTube alternates by station name when Radio Browser uuid changes', () => {
    const alternate = getYouTubeAlternateForStation({
      stationuuid: 'radio-browser-dynamic-mbc-id',
      name: 'MBC FM4U',
      url: 'https://minimw.imbc.com/dmfm/_definst_/mfm.stream/playlist.m3u8',
      url_resolved: 'https://minimw.imbc.com/dmfm/_definst_/mfm.stream/playlist.m3u8',
      country: 'The Republic Of Korea',
      countrycode: 'KR',
      language: 'korean',
      codec: 'AAC+',
      bitrate: 107,
      hls: 1,
      lastcheckok: 1,
      ssl_error: 0
    });

    expect(alternate?.id).toBe('yt-mbc-radio-official');
    expect(alternate?.youtubeChannelId).toBe('UCKNZsAeQXpvI-Mpoc0ZKhsA');
  });
});
