---
type: project-doc
project: "GlobalRadioPWA"
status: draft
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - design
  - codex
---

# Design Brief — 지구라디오

## 1. Product Context

전세계 인터넷 라디오를 탐색하고 듣는 모바일 웹/PWA입니다. 사용자는 품질이 낮은 방송국 목록을 헤매기보다 “잘 들리는 방송”을 빠르게 찾고 싶어합니다.

## 2. Design Direction

> 어두운 밤의 튜너 감성은 살리되, 정보 구조는 실용적인 모바일 오디오 앱처럼 명확하게 만든다.

## 3. Tone and Manner

| 항목 | 기준 |
|---|---|
| 시각 톤 | 깊은 네이비/차콜 배경, 명확한 카드, 품질 배지는 높은 대비 |
| 문구 톤 | 한국어 존댓말/해요체, 기술 오류는 짧고 다음 행동 중심 |
| 밀도 | 홈은 탐색 밀도 높게, 플레이어는 정보 최소화 |
| 정서 | “전세계 탐험” + “좋은 음질로 바로 듣기” |

## 4. Typography

| 용도 | 기준 |
|---|---|
| 기본 폰트 | Pretendard 또는 system-ui |
| H1 | 28~32px / 700 |
| H2 | 20~24px / 700 |
| Body | 15~16px / 400~500 |
| Caption | 12~13px / 400 |

## 5. Color Tokens

```css
:root {
  --color-bg: #09111f;
  --color-surface: #111827;
  --color-surface-strong: #172033;
  --color-text: #f8fafc;
  --color-muted: #94a3b8;
  --color-border: rgba(148, 163, 184, 0.22);
  --color-primary: #38bdf8;
  --color-accent: #f59e0b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}
```

## 6. Component Style

| 컴포넌트 | 기준 |
|---|---|
| Station Card | 방송국명, 국가, 언어, 태그, codec/bitrate, 품질 배지, 재생 버튼 |
| Quality Badge | Excellent/Good/Low/Unknown/Failed 색상과 텍스트 동시 표시 |
| Player | direct audio player와 YouTube player를 분리 |
| YouTube Alternate CTA | “YouTube 공식 라이브로 듣기” 버튼, YouTube 출처 라벨 필수 |
| Toast | 재생 실패, autoplay 차단, network error 표시 |
| Skeleton | station list loading 상태 |

## 7. Layout Rules

### Mobile

```text
Header
Search / filters
Quality-first recommended stations
Station list
Sticky mini player
```

### Desktop

```text
Left: filters and countries
Center: station list
Right: now playing / source details
```

## 8. UX Writing Direction

- CTA는 행동 중심: `재생하기`, `YouTube 공식 라이브로 듣기`, `다시 시도하기`.
- 오류는 원인 + 다음 행동: `이 라디오 스트림은 지금 재생할 수 없어요. 다른 소스를 시도해 주세요.`
- YouTube 안내는 투명하게: `YouTube는 별도 플레이어로 재생돼요. 오디오만 추출하지 않습니다.`

## 9. Anti-AI Design Rules

- 의미 없는 3D 지구, AI 스파클, 추상 blob 사용 금지
- 가짜 주파수 수신처럼 보이는 과장 표현 금지
- 품질 점수가 실제 근거 없이 “HD”처럼 보이는 표기 금지
- YouTube를 라디오 스트림처럼 위장 금지

## 10. Accessibility Direction

- 모든 player control에 `aria-label` 지정
- 품질 상태는 색상만으로 구분하지 않고 텍스트 병기
- `button`은 실제 button element 사용
- iframe title 지정: `title="YouTube alternate player for station name"`
- 포커스 outline 제거 금지
