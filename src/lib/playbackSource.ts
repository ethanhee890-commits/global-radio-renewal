import { getYouTubeAlternate } from '../data/youtubeAlternates.seed';
import type { PlaybackSourceRecommendation, RadioStation, YouTubeAlternateSource } from '../types/station';
import { scoreStationQuality } from './qualityScore';

export function getPreferredSource(station: RadioStation, alternate?: YouTubeAlternateSource | null): PlaybackSourceRecommendation {
  const quality = scoreStationQuality(station);
  const youtubeAlternate = alternate ?? getYouTubeAlternate(station.stationuuid);
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
      reason: '직접 스트림 URL이 없어 검증된 YouTube 대체 소스를 먼저 제안합니다.'
    };
  }

  if ((quality.grade === 'low' || quality.grade === 'failed') && youtubeAlternate) {
    return {
      preferred: 'youtube_alternate',
      direct,
      youtubeAlternate,
      reason: '직접 스트림 품질이 낮거나 실패 신호가 있어 YouTube 대체 소스를 함께 제안합니다.'
    };
  }

  if (direct) {
    return {
      preferred: 'direct',
      direct,
      youtubeAlternate,
      reason: '직접 라디오 스트림을 우선 재생합니다.'
    };
  }

  return {
    preferred: 'none',
    direct,
    youtubeAlternate,
    reason: '사용 가능한 재생 소스가 없습니다.'
  };
}
