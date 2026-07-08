import { Heart, Pause, Play, Radio, Youtube } from 'lucide-react';
import { scoreStationQuality } from '../lib/qualityScore';
import type { PlaybackStatus, RadioStation } from '../types/station';
import { QualityBadge } from './QualityBadge';

export function MiniPlayer({
  station,
  sourceType,
  status,
  isFavorite,
  onPlay,
  onPause,
  onToggleFavorite
}: {
  station: RadioStation | null;
  sourceType: 'radio' | 'youtube';
  status: PlaybackStatus;
  isFavorite: boolean;
  onPlay: () => void;
  onPause: () => void;
  onToggleFavorite: () => void;
}) {
  if (!station) {
    return null;
  }

  const quality = scoreStationQuality(station);
  const SourceIcon = sourceType === 'youtube' ? Youtube : Radio;

  return (
    <aside className="mini-player" aria-label="현재 재생">
      <div>
        <SourceIcon aria-hidden="true" size={18} />
        <span>{sourceType === 'youtube' ? 'YouTube' : 'Radio Stream'}</span>
      </div>
      <strong>{station.name}</strong>
      <QualityBadge quality={quality} />
      <div className="mini-player-actions">
        {status === 'playing' ? (
          <button type="button" onClick={onPause} aria-label="일시정지">
            <Pause aria-hidden="true" size={17} />
          </button>
        ) : (
          <button type="button" onClick={onPlay} aria-label="재생하기">
            <Play aria-hidden="true" size={17} />
          </button>
        )}
        <button type="button" onClick={onToggleFavorite} aria-pressed={isFavorite} aria-label="즐겨찾기 전환">
          <Heart aria-hidden="true" size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </aside>
  );
}
