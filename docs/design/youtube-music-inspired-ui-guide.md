---
type: design-guide
project: "GlobalRadioPWA"
status: ready
owner: Dex
created: "2026-07-09"
updated: "2026-07-09"
source: public-web + local-repo
verificationStatus: partial
tags:
  - design
  - ui
  - ux
  - gui
  - youtube-music
  - global-radio
---

# 지구라디오 MVP UI/UX/GUI 가이드

YouTube Music을 참고하되, 지구라디오는 YouTube Music의 브랜드나 화면을 복제하지 않습니다. 이 문서는 "음악 앱처럼 편하게 찾고, 라디오 앱답게 출처와 재생 신뢰도를 분명히 보여주는" MVP 기준입니다.

## 사용 목적

- 지구라디오 MVP의 다음 UI 개선 작업에서 화면 구조, 컴포넌트 우선순위, 카피, QA 기준으로 사용합니다.
- YouTube Music은 탐색, 하단 접근성, Now Playing 구조, 미디어 컨트롤 밀도만 참고합니다.
- YouTube 브랜드, 로고, 색, 앱 이름, 화면 외형은 공식 가이드 범위 안에서만 제한적으로 사용합니다.

## 현재 프로젝트에 맞는 결론

지구라디오에는 이미 좋은 기반이 있습니다.

- `SearchBar`, `FilterBar`, `StationCard`, `DirectAudioPlayer`, `NowPlayingPanel`, `StationDetail`, `MiniPlayer`, `YouTubeAlternatePlayer`로 기능이 분리되어 있습니다.
- 라디오 직접 스트림과 YouTube 대체 소스를 섞지 않고 별도 모델로 관리합니다.
- YouTube는 visible iframe/player로만 제공하고, 오디오 추출이나 숨김 재생을 하지 않는다는 정책이 이미 문서화되어 있습니다.

따라서 다음 개선 방향은 "새 기능 추가"보다 "미디어 앱다운 정보 구조와 재생 상태 표현 정리"입니다.

## Source-Backed

공개 출처로 확인한 내용입니다.

1. YouTube API Branding Guidelines
   - 앱 이름에 `YouTube`, `YT`, `You-Tube` 같은 이름이나 파생 표현을 결합하면 안 됩니다.
   - YouTube 로고나 아이콘은 YouTube 콘텐츠 또는 앱 내부 YouTube 컴포넌트로 연결되어야 합니다.
   - YouTube 로고를 바꾸거나 가리거나 왜곡하면 안 됩니다.
   - YouTube 로고를 페이지에서 가장 prominent한 요소로 보여주면 안 됩니다.
   - YouTube의 look and feel을 혼동될 정도로 모방하면 안 됩니다.

2. YouTube Brand Resources
   - YouTube 로고와 브랜드 에셋은 공식 브랜드 사이트의 에셋과 가이드에 따라 사용해야 합니다.

3. Google Design: YouTube's New Hue
   - YouTube의 red는 강한 브랜드 색이므로 모든 곳에 쓰는 색이 아니라 특정 브랜드 순간과 핵심 UI 순간에 제한적으로 쓰는 방향으로 설명됩니다.
   - red-to-magenta gradient는 YouTube 고유 브랜드 표현에 가깝기 때문에 지구라디오의 메인 시각 언어로 가져오면 브랜드 혼동 위험이 있습니다.

4. YouTube Music Help
   - YouTube Music의 공식 도움말 구조는 탐색, 음악/팟캐스트 찾기, 라이브러리 관리, 기기/외부 앱 사용, 댓글, Recap, Samples 등을 주요 사용 영역으로 나눕니다.
   - 지구라디오는 이 중 `탐색`, `찾기`, `저장/최근`, `다른 재생 경로`만 MVP에 맞게 참고합니다.

5. 9to5Google의 YouTube Music UI 변경 관찰
   - 2026년 6월 보도 기준 YouTube Music은 Search를 bottom bar로 이동시키고 Explore와 결합한 흐름을 넓게 배포한 것으로 관찰됐습니다.
   - 2026년 4월 보도 기준 YouTube Music Now Playing은 재생 컨트롤과 Up Next를 함께 보는 split-view 구조로 관찰됐습니다.
   - 이는 공식 디자인 시스템 문서는 아니므로 "업계 UI 관찰"로만 참고합니다.

## Dex Inference

위 출처와 현재 코드 구조를 바탕으로 지구라디오에 맞춰 해석한 적용안입니다.

1. 지구라디오는 YouTube Music처럼 보이면 안 됩니다.
   - 앱 이름, 로고, 대표 색, 첫 화면의 분위기는 지구라디오 고유 스타일을 유지합니다.
   - YouTube는 "공식 대체 소스" 버튼과 visible player 영역에서만 명확히 표시합니다.

2. 모바일에서는 검색 접근성이 가장 중요합니다.
   - 라디오는 사용자가 "지금 들을 것"을 빨리 찾는 앱입니다.
   - 검색, 국가/언어 필터, 현재 재생 상태는 손가락이 닿기 쉬운 곳에 있어야 합니다.

3. Now Playing은 지구라디오의 중심 화면입니다.
   - 음악 앱의 Now Playing처럼 현재 방송국, 재생 상태, 품질, 현재 곡/프로그램, 대체 소스가 한눈에 보여야 합니다.
   - YouTube Music의 Up Next queue는 지구라디오에서는 `최근 들은 방송`, `같은 국가/장르 추천`, `대체 소스`로 번역하는 것이 맞습니다.

4. 품질 점수는 보조 정보가 아니라 선택 기준입니다.
   - 사용자는 방송국 이름보다 "바로 잘 나오는지"가 더 중요합니다.
   - `Excellent`, `Good`, `Fair`, `Low`, `Failed` 배지는 카드와 상세 화면 모두에서 보여야 합니다.

## Not Checked

- YouTube Music 내부 공식 디자인 시스템 문서는 공개 자료로 확인하지 못했습니다.
- YouTube Music 앱의 모든 최신 서버 사이드 UI 변형은 사용자별로 다를 수 있습니다.
- 지구라디오가 YouTube 로고 에셋을 실제로 다운로드해 사용할 경우, 최종 에셋 크기와 배치 검토가 별도로 필요합니다.

## MVP 화면 구조

### Desktop

```text
Header
- Brand
- Discover / Favorites / Recent / Settings

Main
- Hero: 현재 앱 가치와 빠른 시작 CTA
- Left: Search + Filters + Station list
- Right: Direct player + Now playing + Station detail + YouTube alternate

Fixed
- Mini player when radio stream is active
```

### Mobile

```text
Top
- Brand compact
- Current playback summary

Primary
- Search field
- Quick filters
- Station list

When station selected
- Player block rises above list
- Now playing and quality summary shown before deep details

Bottom
- Mini player
- Future option: bottom navigation for Discover / Search / Playing / Saved
```

## Navigation Rule

현재 MVP에서는 top navigation을 유지해도 됩니다. 다만 다음 UI 개선에서는 모바일 전용 bottom navigation을 검토할 가치가 큽니다.

권장 mobile nav:

```text
Discover | Search | Playing | Saved
```

- `Discover`: 추천/국가/장르 탐색
- `Search`: 검색창과 최근 검색
- `Playing`: 현재 재생, 품질, Now Playing, 대체 소스
- `Saved`: 즐겨찾기와 최근 들은 방송

주의:

- Settings는 bottom nav의 주 메뉴로 올리지 말고, 상단 또는 Saved 내부에 둡니다.
- nav label은 4개 이하로 유지합니다.
- 아이콘만 쓰지 말고 텍스트를 함께 둡니다.

## Component Rules

### SearchBar

목표:

- 사용자가 방송국명, 국가, 장르를 빠르게 찾게 합니다.

규칙:

- placeholder는 검색 예시를 줍니다.
- 검색 버튼은 항상 명확해야 합니다.
- 모바일에서는 검색창이 접히거나 헤더에 묻히면 안 됩니다.
- 최근 검색을 추가할 경우 localStorage에만 저장하고, 삭제 버튼을 함께 둡니다.

카피 예시:

```text
방송국, 국가, 장르 검색
일본 재즈, Korea news, KEXP
```

### FilterBar

목표:

- 검색 결과를 줄이는 보조 도구입니다.

규칙:

- 국가, 언어, 태그, 정렬은 한 줄에 과하게 몰아넣지 않습니다.
- 모바일에서는 2열 또는 1열로 내려갑니다.
- "품질순"을 기본으로 유지합니다.

카피 예시:

```text
국가
언어
장르
정렬: 품질순 / 이름순 / 인기순
```

### StationCard

목표:

- 방송국을 "누르기 전"에 판단할 수 있게 합니다.

필수 정보:

- 방송국명
- 국가/언어/태그
- 품질 배지
- codec/bitrate 또는 unknown 표시
- 직접 재생 버튼
- 즐겨찾기 버튼
- 조건부 YouTube 공식 대체 CTA

규칙:

- 기본 CTA는 `라디오 스트림으로 듣기`입니다.
- YouTube CTA는 low/failed 또는 직접 스트림 실패 이후에만 노출합니다.
- YouTube CTA는 `공식 대체 소스`라는 출처를 분명히 표시합니다.

카피 예시:

```text
라디오 스트림으로 듣기
YouTube 공식 라이브 보기
검증된 대체 소스
```

### DirectAudioPlayer

목표:

- 재생 상태를 불안하지 않게 보여줍니다.

상태:

```text
idle
loading
playing
paused
error
autoplay_blocked
```

규칙:

- `loading`은 12초 이상 길어지면 timeout 안내가 필요합니다.
- `autoplay_blocked`는 사용자 잘못처럼 말하지 않습니다.
- `error`는 다음 행동을 제시합니다.

카피 예시:

```text
브라우저 정책 때문에 자동 재생이 막혔습니다. 재생 버튼을 한 번 더 눌러 주세요.
지금 이 스트림은 재생할 수 없습니다. 다른 방송을 선택하거나 검증된 대체 소스를 확인해 주세요.
```

### NowPlayingPanel

목표:

- 지금 듣는 방송이 무엇인지 확신을 줍니다.

필수 정보:

- 방송국명
- 현재 곡/프로그램명
- artist 또는 host가 있을 경우 표시
- 업데이트 시간 또는 확인 상태
- 새로고침 버튼

규칙:

- 데이터가 없을 때도 빈 화면으로 두지 않습니다.
- `확인 중`, `정보 없음`, `공식 API 없음`, `오류`를 분리합니다.

### StationDetail

목표:

- 사용자가 왜 이 방송을 추천받았는지 이해하게 합니다.

필수 정보:

- 품질 점수 breakdown
- stream URL domain
- source type: Radio Browser / seed / verified official page
- YouTube alternate verification status

주의:

- URL을 너무 크게 보여주지 않습니다.
- 권리/정책 위험이 있는 출처는 `검수 필요`로 둡니다.

### YouTubeAlternatePlayer

목표:

- YouTube를 안전한 대체 경로로만 제공합니다.

필수 규칙:

- visible iframe/player만 사용합니다.
- `display:none`, 1px iframe, offscreen player를 금지합니다.
- YouTube audio URL을 저장하지 않습니다.
- yt-dlp/youtube-dl을 사용하지 않습니다.
- 사용자가 직접 버튼을 누른 뒤 표시합니다.
- YouTube 버튼은 YouTube 콘텐츠 또는 해당 플레이어로 연결되어야 합니다.

카피 예시:

```text
YouTube 공식 대체 소스
YouTube는 보이는 플레이어에서만 재생합니다. 오디오 추출이나 백그라운드 재생은 사용하지 않습니다.
```

## Visual System

현재 지구라디오 팔레트는 유지합니다.

```css
--radio-bg: #0b0f0e;
--radio-surface: #151c18;
--radio-text: #f4f0e8;
--radio-muted: #a4ada4;
--radio-primary: #9fd7bf;
--radio-accent: #f0b76c;
--radio-danger: #e66a5f;
--radio-radius: 8px;
```

권장:

- `--radio-primary`는 라디오 앱의 주 행동에 사용합니다.
- `--radio-accent`는 품질, 알람, 현재 방송 같은 보조 강조에 사용합니다.
- `--radio-danger`는 오류와 YouTube 외부 소스 CTA에 제한적으로 사용합니다.
- YouTube의 red/magenta gradient를 지구라디오의 배경이나 메인 CTA로 사용하지 않습니다.

Shape:

- 카드, 패널, 버튼은 기존 `8px` radius를 유지합니다.
- mini player와 badge는 더 둥글게 써도 되지만, 전체 화면이 pill UI로 뒤덮이지 않게 합니다.

Typography:

- 방송국명은 1줄 ellipsis 허용
- 설명문은 2줄 이하
- 버튼 텍스트는 모바일 360px에서 줄바꿈 가능
- letter-spacing은 0 유지

## Interaction Rules

### Listen-first

사용자는 먼저 듣고 싶어 합니다.

우선순위:

1. 재생
2. 현재 상태
3. 품질
4. 출처
5. 즐겨찾기/알람
6. 상세 기술 정보

### Source clarity

모든 재생 경로는 출처가 보여야 합니다.

```text
라디오 스트림
Radio Browser
공식 seed
YouTube 공식 대체 소스
검수 필요
```

### One-handed mobile

모바일에서는 다음 요소가 쉽게 닿아야 합니다.

- 검색
- 재생/일시정지
- 현재 재생으로 이동
- 즐겨찾기
- 최근 들은 방송

### Reduced anxiety

재생 실패는 흔한 상황입니다. 사용자에게 "앱이 망가졌다"는 느낌을 주면 안 됩니다.

좋은 문구:

```text
이 스트림은 지금 응답하지 않습니다.
다른 고품질 방송을 먼저 추천해 드릴게요.
검증된 대체 소스가 있으면 아래에 표시됩니다.
```

피할 문구:

```text
오류
실패
잘못됨
지원하지 않음
```

단독으로 쓰지 말고 이유와 다음 행동을 붙입니다.

## Reflect / Defer / Reject

### 이미 반영된 것

- 라디오 직접 스트림과 YouTube 대체 소스 분리
- visible YouTube iframe
- YouTube audio extraction 금지
- 품질 기반 정렬
- 즐겨찾기/최근/localStorage
- mini player
- Now Playing panel
- 모바일 360px 대응

### 바로 반영해도 좋은 것

- 모바일에서 현재 재생 패널을 더 빨리 보이게 하는 layout 조정
- 검색 placeholder와 빈 상태 카피 개선
- quality badge 설명을 더 쉬운 문장으로 바꾸기
- YouTube 대체 CTA에 `외부 소스` 또는 `공식 대체` 라벨 추가
- StationDetail의 URL/codec/bitrate 정보를 더 읽기 쉬운 summary로 정리

### 조건부로 반영할 것

- bottom navigation
  - 장점: 모바일 한 손 사용성이 좋아집니다.
  - 조건: 현재 top nav와 중복되지 않게 mobile-only로 설계해야 합니다.

- YouTube 로고 에셋
  - 장점: 출처 인지가 빨라집니다.
  - 조건: 공식 에셋, 크기, 링크, 비 prominent 조건을 지켜야 합니다.

- YouTube Music식 split Now Playing
  - 장점: 현재 재생과 다음 행동을 한 화면에 묶을 수 있습니다.
  - 조건: 라디오에는 queue가 없으므로 `최근/추천/대체 소스`로 재해석해야 합니다.

### 반영하면 안 되는 것

- 지구라디오 앱 이름이나 로고에 YouTube를 결합
- YouTube red/magenta gradient를 지구라디오 메인 브랜드로 사용
- YouTube 화면을 혼동될 정도로 모방
- YouTube player를 숨기거나 작게 만들어 오디오만 재생
- YouTube 검색 결과를 라디오 방송국처럼 섞어 표시
- 검증되지 않은 YouTube 후보를 자동 연결

## UI QA Checklist

디자인 또는 프론트엔드 변경 후 확인합니다.

- 360px viewport에서 가로 스크롤이 없습니다.
- primary CTA는 한 화면에서 찾을 수 있습니다.
- 방송국 카드의 방송국명, 품질 배지, 재생 버튼이 겹치지 않습니다.
- 재생 상태 `idle/loading/playing/paused/error/autoplay_blocked`가 모두 보입니다.
- YouTube 대체 소스는 direct radio stream과 시각적으로 분리됩니다.
- YouTube player는 visible iframe입니다.
- 숨김 YouTube iframe, 1px iframe, offscreen player가 없습니다.
- 품질 배지는 색만으로 의미를 전달하지 않습니다.
- 모든 icon-only 버튼에는 accessible label이 있습니다.
- mini player가 모바일에서 본문 버튼을 가리지 않습니다.
- reduced motion 환경에서 애니메이션이 줄어듭니다.
- 빈 상태와 오류 상태가 다음 행동을 제안합니다.

## 다음 UI 개선 Prompt

Codex에서 바로 사용할 수 있는 작업 지시입니다.

```text
지구라디오 MVP에서 docs/design/youtube-music-inspired-ui-guide.md를 기준으로 UI를 개선해 주세요.

목표:
1. YouTube Music을 복제하지 않고, 검색 접근성/Now Playing/미디어 컨트롤 구조만 지구라디오에 맞게 반영합니다.
2. 라디오 스트림과 YouTube 공식 대체 소스의 출처를 더 분명히 구분합니다.
3. 360px 모바일에서 검색, 재생, 현재 재생 상태, 즐겨찾기가 쉽게 닿게 만듭니다.
4. hidden YouTube player, audio extraction, yt-dlp/youtube-dl, 자동 YouTube 전환은 금지합니다.

검증:
- npm run verify
- 360px/390px 모바일 화면 수동 QA
- YouTube iframe visible 여부 확인
- 가로 overflow 확인
```

## Sources

- YouTube API Services Branding Guidelines: https://developers.google.com/youtube/terms/branding-guidelines
- YouTube Brand Resources: https://brand.youtube/
- Google Design, YouTube's New Hue: https://design.google/library/youtube-new-red-color
- YouTube Music Help: https://support.google.com/youtubemusic/?hl=en
- Material Design 3 Navigation Bar: https://m3.material.io/components/navigation-bar/overview
- Material Design 3 Search: https://m3.material.io/components/search/overview
- 9to5Google, YouTube Music Search bottom bar: https://9to5google.com/2026/06/10/youtube-music-search-bottom-bar-wide/
- 9to5Google, YouTube Music split Now Playing redesign: https://9to5google.com/2026/04/23/youtube-music-split-now-playing-redesign/
