import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import type { PlaybackStatus, RadioStation } from '../types/station';

const STATUS_LABELS: Record<PlaybackStatus, string> = {
  idle: '대기',
  loading: '연결 중',
  playing: '재생 중',
  paused: '일시정지',
  error: '연결 실패',
  autoplay_blocked: '재생 확인 필요'
};

export function DirectAudioPlayer({
  station,
  status,
  error,
  onPlay,
  onPause,
  onRetry
}: {
  station: RadioStation | null;
  status: PlaybackStatus;
  error: string;
  onPlay: () => void;
  onPause: () => void;
  onRetry: () => void;
}) {
  return (
    <section className="direct-player" aria-label="라디오 스트림 플레이어">
      <div className="player-heading">
        <Volume2 aria-hidden="true" size={20} />
        <div>
          <strong>바로 듣기</strong>
          <span>{station ? station.name : '방송국을 선택해 주세요.'}</span>
        </div>
      </div>

      <div className="player-controls">
        {status === 'playing' ? (
          <button className="radio-button secondary" type="button" onClick={onPause} aria-label="라디오 일시정지">
            <Pause aria-hidden="true" size={17} />
            일시정지
          </button>
        ) : (
          <button className="radio-button primary" type="button" onClick={onPlay} disabled={!station || status === 'loading'} aria-label="라디오 재생하기">
            <Play aria-hidden="true" size={17} />
            {status === 'loading' ? '재생 준비 중' : '재생'}
          </button>
        )}
        <button className="radio-button secondary" type="button" onClick={onRetry} disabled={!station || status === 'loading'} aria-label="라디오 다시 시도">
          <RotateCcw aria-hidden="true" size={16} />
          다시 시도
        </button>
      </div>

      <div className={`stream-status-panel stream-status-${status}`} aria-live="polite">
        <span>{STATUS_LABELS[status]}</span>
        <strong>{station ? station.name : '방송국 미선택'}</strong>
      </div>

      {status === 'autoplay_blocked' ? <p className="player-warning">브라우저가 자동 재생을 막았습니다. 재생 버튼을 한 번 더 눌러 주세요.</p> : null}
      {status === 'error' && error ? <p className="player-error">{error}</p> : null}
    </section>
  );
}
