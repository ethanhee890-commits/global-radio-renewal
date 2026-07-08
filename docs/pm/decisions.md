---
type: project-doc
project: "GlobalRadioPWA"
status: active
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - decisions
  - pm
---

# Project Decision Log — 지구라디오

## Decision 001

### Date
2026-07-08

### Area
Product

### Decision
제품은 실제 RF 주파수 수신 앱이 아니라 전세계 공개 인터넷 라디오 스트림 청취 PWA로 정의한다.

### Reason
모바일 웹에서 실제 FM/AM 주파수 직접 수신은 MVP 범위에 맞지 않고 사용자 오해를 만들 수 있다.

### Alternatives Considered
- 실제 주파수 튜너 앱
- SDR 연동 앱

### Impact on Dex
Radio Browser API와 HTML audio 기반 구현에 집중한다.

### Risk
마케팅 문구에서 “모든 주파수” 표현을 쓰면 오해가 생길 수 있다.

### Status
Accepted

---

## Decision 004

### Date
2026-07-08

### Area
Japan Radio / Source Policy

### Decision
일본 방송은 공식/공개 인터넷 스트림만 seed로 승격하고, radiko 전용 주요 민방은 권역 제한 우회 없이 제외한다.

### Reason
radiko 공식 앱 설명은 일본 내 이용만 허용된다고 명시한다. 지구라디오는 공개 인터넷 라디오 PWA이므로 우회성 스트림, 비공식 NHK 미러, hidden YouTube 재생을 섞지 않는다.

### Alternatives Considered
- radiko 스트림 우회
- 제3자 NHK-FM 미러 등록
- 공식성 확인 전 YouTube 채널/영상 등록

### Impact on Dex
일본 우선 seed는 NHK WORLD-JAPAN Radio, Shonan Beach FM 78.9, FM Kahoku 78.7처럼 공식 홈페이지와 스트림 응답을 확인한 후보만 사용한다.

### Risk
일본 주요 민방/국내 NHK 라디오는 공개 웹 스트림 제약 때문에 MVP에서 빠질 수 있다. 출시 전 iOS Safari 실기기 재생률 샘플링이 필요하다.

### Status
Accepted

---

## Decision 002

### Date
2026-07-08

### Area
Implementation / Policy

### Decision
YouTube는 direct radio stream의 대체 소스로만 제공하고, 오디오 추출/숨김 재생/백그라운드 player는 금지한다.

### Reason
YouTube 정책상 audiovisual content의 audio/video component 분리, hidden/background player, player 기능 변경은 리스크가 크다.

### Alternatives Considered
- YouTube 오디오 URL 추출
- YouTube 영상을 숨기고 audio처럼 재생
- 서버에서 YouTube audio stream 변환

### Impact on Dex
YouTube IFrame Player를 visible component로 구현하고, 사용자가 직접 선택해 재생하게 한다.

### Risk
일부 사용자는 “YouTube 음질”을 기대하지만 embedded player UX가 direct audio와 다를 수 있다.

### Status
Accepted

---

## Decision 003

### Date
2026-07-08

### Area
Quality Gate

### Decision
음질은 P0 핵심 기능으로 승격하고, codec/bitrate/hls/HTTPS/lastcheckok/ssl_error를 기준으로 품질 점수를 계산한다.

### Reason
에던의 명시 요구사항이 “음질이 좋아야 한다”이므로 단순 재생 앱보다 품질 우선 탐색 앱이 맞다.

### Alternatives Considered
- 클릭수/인기순 우선
- 국가순/이름순 우선

### Impact on Dex
`qualityScore.ts`와 품질 배지를 반드시 구현한다.

### Risk
Radio Browser metadata가 부정확할 수 있으므로 실제 canplay 테스트와 사용자 신고가 후속 필요하다.

### Status
Accepted
