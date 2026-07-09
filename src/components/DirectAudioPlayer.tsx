import { AlertCircle, CheckCircle2, Loader2, Pause, Play, RotateCcw, Volume2, Youtube } from 'lucide-react';
import type { PlaybackStatus, RadioStation } from '../types/station';

function getStatusMeta(status: PlaybackStatus, nativePlayback: boolean): { tone: string; label: string; detail: string; icon: typeof Loader2 } {
  if (status === 'loading') {
    return {
      tone: 'is-loading',
      label: '연결 중',
      detail: '방송국 서버 응답을 기다리고 있습니다. 이 단계에서는 아직 소리가 나지 않는 것이 정상입니다.',
      icon: Loader2
    };
  }

  if (status === 'playing') {
    return {
      tone: 'is-playing',
      label: '재생 중',
      detail: nativePlayback
        ? '재생 중입니다. 소리가 없으면 기기 볼륨이나 블루투스 연결을 확인해 주세요.'
        : '재생 중입니다. 소리가 없으면 기기 볼륨이나 출력 장치를 확인해 주세요.',
      icon: CheckCircle2
    };
  }

  if (status === 'error') {
    return {
      tone: 'is-error',
      label: '연결 실패',
      detail: '이 방송은 지금 재생할 수 없습니다. 다시 시도하거나 다른 방송을 선택해 주세요.',
      icon: AlertCircle
    };
  }

  if (status === 'paused') {
    return {
      tone: 'is-paused',
      label: '일시정지',
      detail: '재생이 멈춘 상태입니다. 재생 버튼을 누르면 다시 연결합니다.',
      icon: Pause
    };
  }

  return {
    tone: 'is-idle',
    label: '대기 중',
    detail: '방송을 선택하고 재생 버튼을 눌러 주세요.',
    icon: Volume2
  };
}

export function DirectAudioPlayer({
  station,
  status,
  error,
  onPlay,
  onPause,
  onRetry,
  onUseYouTube,
  showYouTubeFallback = false,
  nativePlayback = false
}: {
  station: RadioStation | null;
  status: PlaybackStatus;
  error: string;
  onPlay: () => void;
  onPause: () => void;
  onRetry: () => void;
  onUseYouTube?: () => void;
  showYouTubeFallback?: boolean;
  nativePlayback?: boolean;
}) {
  const statusMeta = getStatusMeta(status, nativePlayback);
  const StatusIcon = statusMeta.icon;
  const shouldRetry = status === 'error' || status === 'autoplay_blocked';
  const ActionIcon = shouldRetry ? RotateCcw : Play;
  const actionLabel = status === 'loading' ? '재생 준비 중' : shouldRetry ? '다시 시도하기' : '재생하기';

  return (
    <section className="direct-player" aria-label="라디오 플레이어">
      <div className="player-heading">
        <Volume2 aria-hidden="true" size={20} />
        <div>
          <strong>라디오 재생</strong>
          <span>{station ? station.name : '방송국을 선택해 주세요.'}</span>
        </div>
      </div>

      <div className={`player-status-strip ${statusMeta.tone}`} role="status">
        <StatusIcon aria-hidden="true" size={17} className={status === 'loading' ? 'spin' : undefined} />
        <div>
          <strong>{statusMeta.label}</strong>
          <span>{statusMeta.detail}</span>
        </div>
      </div>

      <div className="player-controls">
        {status === 'playing' ? (
          <button className="radio-button secondary" type="button" onClick={onPause} aria-label="라디오 일시정지">
            <Pause aria-hidden="true" size={17} />
            일시정지
          </button>
        ) : (
          <button
            className="radio-button primary"
            type="button"
            onClick={shouldRetry ? onRetry : onPlay}
            disabled={!station || status === 'loading'}
            aria-label={`라디오 ${actionLabel}`}
          >
            <ActionIcon aria-hidden="true" size={17} />
            {actionLabel}
          </button>
        )}
      </div>

      {status === 'autoplay_blocked' ? <p className="player-warning">브라우저 정책상 재생 버튼을 한 번 더 눌러주세요.</p> : null}
      {status === 'error' && showYouTubeFallback && onUseYouTube ? (
        <button className="radio-button youtube" type="button" onClick={onUseYouTube}>
          <Youtube aria-hidden="true" size={17} />
          YouTube로 듣기
        </button>
      ) : null}
      {status === 'error' && error ? <p className="player-error">{error}</p> : null}
    </section>
  );
}
