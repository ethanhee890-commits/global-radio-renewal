import { Youtube } from 'lucide-react';
import type { RadioStation, YouTubeAlternateSource } from '../types/station';

function getEmbedOrigin(): string {
  const origin = globalThis.location?.origin;
  return origin?.startsWith('http') ? origin : '';
}

function buildEmbedUrl(path: string, params: Record<string, string>): string {
  const query = new URLSearchParams(params);
  const origin = getEmbedOrigin();

  if (origin) {
    query.set('origin', origin);
  }

  return `https://www.youtube.com/embed/${path}?${query.toString()}`;
}

function getEmbedUrl(source: YouTubeAlternateSource): string {
  if (source.youtubeVideoId) {
    return buildEmbedUrl(encodeURIComponent(source.youtubeVideoId), { rel: '0' });
  }

  if (source.youtubeChannelId) {
    return buildEmbedUrl('live_stream', { channel: source.youtubeChannelId });
  }

  return '';
}

export function YouTubeAlternatePlayer({
  station,
  source,
  mounted,
  onMount
}: {
  station: RadioStation;
  source: YouTubeAlternateSource;
  mounted: boolean;
  onMount: () => void;
}) {
  const embedUrl = getEmbedUrl(source);

  return (
    <section className="youtube-player-panel" aria-label="공식 YouTube 방송">
      <div className="youtube-source-label">
        <Youtube aria-hidden="true" size={20} />
        <div>
          <strong>공식 YouTube 방송</strong>
          <span>{source.label}</span>
        </div>
      </div>
      <p>YouTube는 별도 플레이어로 재생돼요. 오디오만 추출하지 않습니다.</p>
      {!mounted ? (
        <button className="radio-button youtube" type="button" onClick={onMount}>
          <Youtube aria-hidden="true" size={17} />
          YouTube 공식 라이브로 듣기
        </button>
      ) : null}
      {mounted && embedUrl ? (
        <iframe
          className="youtube-frame"
          src={embedUrl}
          title={`${station.name} YouTube 대체 플레이어`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
      <a className="source-link" href={source.sourceUrl} target="_blank" rel="noreferrer">
        공식 페이지 열기
      </a>
    </section>
  );
}
