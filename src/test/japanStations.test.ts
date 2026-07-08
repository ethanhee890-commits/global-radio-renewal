import { describe, expect, it } from 'vitest';
import { FALLBACK_STATIONS, getYouTubeAlternate } from '../data/youtubeAlternates.seed';
import { getFallbackStations } from '../lib/radioBrowser';
import { scoreStationQuality } from '../lib/qualityScore';

describe('Japan priority radio seeds', () => {
  it('returns verified Japan priority stations first by quality', () => {
    const stations = getFallbackStations({
      country: 'Japan',
      language: 'japanese',
      tag: 'japan-priority'
    });

    expect(stations.map((station) => station.stationuuid)).toEqual([
      'seed-jp-nhk-world-radio',
      'seed-jp-shonan-beach-fm',
      'seed-jp-fm-kahoku'
    ]);
    expect(stations.every((station) => station.countrycode === 'JP')).toBe(true);
    expect(scoreStationQuality(stations[0]).grade).toBe('excellent');
    expect(stations[0].url_resolved).toContain('nhkworld.jp');
  });

  it('keeps radiko-only and unofficial NHK mirror URLs out of curated seeds', () => {
    const japanSeedText = FALLBACK_STATIONS.filter((station) => station.countrycode === 'JP')
      .flatMap((station) => [station.name, station.url, station.url_resolved, station.homepage, station.tags])
      .join(' ')
      .toLowerCase();

    expect(japanSeedText).not.toContain('radiko');
    expect(japanSeedText).not.toContain('mnet.x10.mx');
  });

  it('stores the Shonan Beach FM official YouTube alternate as an embeddable video', () => {
    const alternate = getYouTubeAlternate('seed-jp-shonan-beach-fm');

    expect(alternate?.verificationStatus).toBe('verified');
    expect(alternate?.verificationMethod).toBe('official_homepage');
    expect(alternate?.youtubeVideoId).toBe('qGCPvnk8Unc');
    expect(alternate?.sourceUrl).toBe('https://www.beachfm.co.jp/radio/');
  });

  it('does not leak unrelated global fallback stations for scoped misses', () => {
    expect(getFallbackStations({ country: 'Japan', tag: 'not-a-real-japan-tag' })).toEqual([]);
  });
});
