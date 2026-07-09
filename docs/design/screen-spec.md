---
type: project-doc
project: "GlobalRadioPWA"
status: draft
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - screen-spec
  - ux
  - codex
---

# Screen Spec — 지구라디오

## Screen: Home

### Purpose

전세계 라디오 탐색 진입과 고음질 추천 방송 노출.

### User Goal

좋은 음질의 라디오를 빠르게 찾고 재생한다.

### Layout

```text
Header: 서비스명, 검색 진입, 설정
Hero: “좋은 음질로 듣는 전세계 라디오”
Quick Filters: 국가, 언어, 장르
Recommended: 고음질 추천 방송국
Recent/Favorites: 최근 들은 방송, 즐겨찾기
Sticky Mini Player
```

### Components

- Search input
- Country chips
- Language chips
- Genre chips
- Station card
- Quality badge
- Mini player

### States

| 상태 | UI |
|---|---|
| default | 추천 방송국 표시 |
| loading | station card skeleton 5개 |
| empty | `조건에 맞는 방송국이 없어요. 필터를 줄여보세요.` |
| error | `방송국 목록을 불러오지 못했어요.` + retry |
| offline | `인터넷 연결을 확인해 주세요.` |
| playing | 하단 mini player 표시 |

### Responsive Behavior

- 360px: 단일 컬럼, station card full width
- 768px: 2컬럼 가능
- 1280px: 필터/리스트/player 3영역

### Accessibility Notes

- 검색 input label 필수
- chips는 button 또는 checkbox role 명확화
- station card 전체 클릭 대신 재생 버튼을 명확히 둠

### Copy Source

- `copydeck.md > Hero / Main Headings`
- `copydeck.md > Empty States`

---

## Screen: Search Results

### Purpose

방송국 검색 결과를 품질 우선으로 보여줍니다.

### User Goal

검색 결과 중 잘 들리는 방송국을 선택한다.

### Layout

```text
Search bar
Filter row
Sort: 품질순 / 인기순 / 이름순
Result count
Station list
```

### Components

- Search input
- Filter drawer
- Sort select
- Station card with quality metadata

### States

| 상태 | UI |
|---|---|
| loading | 결과 skeleton |
| empty | `검색 결과가 없어요.` |
| error | API 오류 안내 + retry |
| disabled | 검색어/필터 변경 중 sort disabled |

### Station Card Required Fields

- `name`
- `country`
- `language`
- `tags`
- `codec`
- `bitrate`
- `hls`
- `qualityGrade`
- `lastcheckok`
- `directPlayableStatus`
- `hasYouTubeAlternate`

---

## Screen: Station Detail

### Purpose

선택한 방송국의 직접 스트림과 YouTube 대체 소스를 비교해 보여줍니다.

### User Goal

가장 좋은 경로로 방송을 듣는다.

### Layout

```text
Station header
Quality panel
Direct stream player CTA
YouTube alternate panel, if available
Station metadata
Report issue button
```

### Components

- Station header
- Quality score breakdown
- Direct audio CTA
- YouTube alternate CTA
- Source transparency notice
- Report broken stream button

### States

| 상태 | UI |
|---|---|
| direct-good | direct player를 primary CTA로 표시 |
| direct-low-youtube-available | YouTube alternate CTA를 secondary 강조 |
| direct-failed-youtube-available | YouTube alternate CTA를 primary recovery로 표시 |
| direct-failed-no-alternate | 재시도/비슷한 방송 찾기 |
| youtube-loading | visible player skeleton |
| youtube-error | `YouTube 플레이어를 불러오지 못했어요.` |

### YouTube Alternate Panel Rules

- CTA 문구: `YouTube 공식 라이브로 듣기`
- CTA 하단 안내: `YouTube는 별도 플레이어로 재생돼요. 오디오만 추출하지 않습니다.`
- player container는 숨기지 않습니다.
- player title 필수.

---

## Screen: Player

### Purpose

현재 재생 중인 소스 상태를 표시하고 제어합니다.

### User Goal

재생/정지, 소스 확인, 즐겨찾기, 대체 소스 전환.

### Components

- Now playing card
- Play/Pause button
- Source label: `Radio Stream` 또는 `YouTube`
- Quality label
- Favorite button
- Sleep timer P1

### States

| 상태 | UI |
|---|---|
| idle | `방송국을 선택해 주세요.` |
| loading | spinner + `재생 준비 중이에요.` |
| playing | station info + pause |
| paused | station info + play |
| error | 오류 문구 + retry |
| autoplay-blocked | `브라우저 정책상 재생 버튼을 한 번 더 눌러주세요.` |

---

## Screen: Settings

### Purpose

품질 우선 조건과 데이터 저장 정책을 사용자가 조정합니다.

### Components

- `HTTPS 스트림 우선` toggle
- `낮은 음질 숨기기` toggle
- `YouTube 대체 소스 표시` toggle
- `최근 들은 방송 삭제`
- `즐겨찾기 삭제`

### States

- default
- saved
- error
- disabled
