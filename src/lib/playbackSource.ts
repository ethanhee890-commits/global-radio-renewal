import { getYouTubeAlternateForStation } from '../data/youtubeAlternates.seed';
import type { PlaybackSourceRecommendation, RadioStation, YouTubeAlternateSource } from '../types/station';
import { scoreStationQuality } from './qualityScore';

export function shouldOfferYouTubeAlternate(station: RadioStation, alternate?: YouTubeAlternateSource | null): boolean {
  const youtubeAlternate = alternate ?? getYouTubeAlternateForStation(station);
  if (!youtubeAlternate) {
    return false;
  }

  const quality = scoreStationQuality(station);
  return quality.grade === 'low' || quality.grade === 'failed';
}

export function getPreferredSource(station: RadioStation, alternate?: YouTubeAlternateSource | null): PlaybackSourceRecommendation {
  const quality = scoreStationQuality(station);
  const youtubeAlternate = alternate ?? getYouTubeAlternateForStation(station);
  const directUrl = station.url_resolved || station.url;
  const direct = directUrl
    ? {
        type: 'radio_stream' as const,
        stationuuid: station.stationuuid,
        url: directUrl,
        label: 'Radio Stream' as const,
        quality
      }
    : null;

  if (!direct && youtubeAlternate) {
    return {
      preferred: 'youtube_alternate',
      direct,
      youtubeAlternate,
      reason: '라디오 주소가 없어 공식 YouTube 방송을 먼저 보여드립니다.'
    };
  }

  if (shouldOfferYouTubeAlternate(station, youtubeAlternate)) {
    return {
      preferred: 'youtube_alternate',
      direct,
      youtubeAlternate,
      reason: '라디오 재생이 불안정할 수 있어 공식 YouTube 방송도 함께 보여드립니다.'
    };
  }

  if (direct) {
    return {
      preferred: 'direct',
      direct,
      youtubeAlternate,
      reason: '라디오 방송을 바로 재생합니다.'
    };
  }

  return {
    preferred: 'none',
    direct,
    youtubeAlternate,
    reason: '지금 재생할 수 있는 방송 정보가 없습니다.'
  };
}
