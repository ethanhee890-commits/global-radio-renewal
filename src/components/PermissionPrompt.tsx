import { Bell, Clock3, Volume2 } from 'lucide-react';

export type PermissionPromptKind = 'playback' | 'alarm' | 'alarmSettings';

const PROMPT_COPY = {
  playback: {
    icon: Volume2,
    title: '앱을 내려도 라디오가 이어지게 할까요?',
    body: '알림을 허용하면 잠금화면과 알림창에서 지금 듣는 방송을 바로 멈추거나 다시 켤 수 있어요.',
    primary: '알림 허용하고 재생',
    secondary: '지금은 안 할게요'
  },
  alarm: {
    icon: Bell,
    title: '정한 시간에 이 방송을 켜드릴게요',
    body: '아침에 앱을 직접 열지 않아도 선택한 라디오를 들을 수 있도록, 알림과 알람 권한을 확인할게요.',
    primary: '알람 설정 계속하기',
    secondary: '나중에 할게요'
  },
  alarmSettings: {
    icon: Clock3,
    title: '알람이 제시간에 울리려면 한 번 더 허용이 필요해요',
    body: 'Android 설정에서 지구라디오의 알람 권한을 켜면 선택한 방송이 약속한 시간에 시작됩니다.',
    primary: '알람 권한',
    secondary: '닫기'
  }
} satisfies Record<PermissionPromptKind, { icon: typeof Bell; title: string; body: string; primary: string; secondary: string }>;

export function PermissionPrompt({
  kind,
  onConfirm,
  onCancel
}: {
  kind: PermissionPromptKind;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const copy = PROMPT_COPY[kind];
  const Icon = copy.icon;

  return (
    <div className="permission-prompt-backdrop" role="presentation" onClick={onCancel}>
      <section
        className="permission-prompt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="permission-prompt-title"
        aria-describedby="permission-prompt-body"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="permission-prompt-icon" aria-hidden="true">
          <Icon size={22} />
        </div>
        <div>
          <h2 id="permission-prompt-title">{copy.title}</h2>
          <p id="permission-prompt-body">{copy.body}</p>
        </div>
        <div className="permission-prompt-actions">
          <button className="radio-button primary" type="button" onClick={onConfirm}>
            {copy.primary}
          </button>
          <button className="radio-button secondary" type="button" onClick={onCancel}>
            {copy.secondary}
          </button>
        </div>
      </section>
    </div>
  );
}
