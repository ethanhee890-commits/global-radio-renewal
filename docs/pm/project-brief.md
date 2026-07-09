---
type: project-doc
project: "GlobalRadioPWA"
status: draft
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - pm
  - product-brief
  - codex
---

# Project Brief — 지구라디오

## 1. Product Summary

`지구라디오`는 모바일 웹/PWA에서 전세계 공개 인터넷 라디오 방송국을 검색하고, 가능한 한 좋은 음질로 재생하는 글로벌 라디오 플레이어입니다.

핵심 변경 요구사항은 다음입니다.

1. 라디오 스트림은 **음질이 좋은 소스부터 우선 재생**합니다.
2. 라디오 스트림 음질이 낮거나 불안정하고, 해당 방송국이 공식 YouTube 라이브/영상도 제공하는 경우에는 **YouTube를 대체 소스로 선택할 수 있게** 합니다.
3. YouTube 대체 소스는 **오디오 추출이 아니라, 보이는 YouTube IFrame Player를 사용자가 직접 선택해 재생하는 방식**으로만 구현합니다.

## 2. Target Users

| 사용자 | 설명 | 주요 니즈 |
|---|---|---|
| 글로벌 라디오 탐색 사용자 | 국가·언어·장르별 라디오를 찾는 사용자 | 낯선 국가의 방송을 빠르게 찾고 안정적으로 듣기 |
| 작업/이동 중 청취 사용자 | 음악·뉴스·토크를 배경으로 듣는 사용자 | 끊김이 적고 음질이 좋은 방송 우선 재생 |
| 특정 방송국 팬 | 특정 방송국의 라디오/YouTube 라이브를 찾는 사용자 | 라디오 스트림이 낮은 품질이면 공식 YouTube 대체 소스 이용 |

## 3. User Problems

| 문제 | 설명 |
|---|---|
| 낮은 음질 | 인터넷 라디오 디렉터리에는 낮은 bitrate, 오래된 MP3, 끊기는 스트림이 섞여 있음 |
| 실패 스트림 | HTTPS가 아니거나, dead stream이거나, 모바일 Safari에서 재생 실패하는 방송이 있음 |
| 대체 소스 부재 | 방송국이 YouTube 라이브를 함께 운영해도 라디오 앱에서 연결하지 못하는 경우가 있음 |
| 혼동되는 표현 | “모든 주파수”라는 표현은 실제 RF 수신처럼 오해될 수 있음 |

## 4. Core Value Proposition

> 전세계 인터넷 라디오를 찾되, 단순히 많은 방송국을 나열하지 않고 **고음질·재생 가능성·공식 대체 소스** 기준으로 가장 듣기 좋은 경로를 제안합니다.

## 5. Product Scope

### P0 — MVP 필수 범위

| 기능 | 설명 | 완료 기준 |
|---|---|---|
| Radio Browser 연동 | 공개 인터넷 라디오 방송국 검색 | 국가, 언어, 태그, 이름 검색 동작 |
| 품질 점수 계산 | codec, bitrate, hls, lastcheckok, ssl_error, HTTPS 기준 | 각 방송국 카드에 품질 배지 표시 |
| 고음질 우선 정렬 | 재생 가능성과 음질이 좋은 방송을 상위 노출 | 동일 조건 검색 시 high quality 우선 |
| 직접 스트림 플레이어 | HTML audio 기반 재생 | 사용자 탭 이후 재생, 실패 시 오류 표시 |
| YouTube 대체 소스 | 공식/검증된 YouTube live/video가 있을 때 대체 재생 CTA | 추출 없이 visible iframe player로 재생 |
| 즐겨찾기 | 방송국 저장 | localStorage 유지 |
| 최근 들은 방송 | 최근 재생 이력 | localStorage 유지 |
| 모바일 최적화 | iOS Safari, Chrome 우선 | 360px 폭에서 가로 스크롤 없음 |

### P1 — 후속 범위

- YouTube Data API 기반 공식 채널/라이브 후보 검색
- 방송국별 대체 소스 제보/검수 플로우
- HLS.js 또는 browser-native HLS 지원 여부에 따른 고도화
- Media Session API 적용
- 수면 타이머

### P2 — 장기 범위

- 서버 기반 station health check
- 방송국별 stream mirror 금지 원칙을 지키는 metadata cache
- 계정 기반 동기화
- 네이티브 앱 전환

## 6. Out of Scope

| 제외 항목 | 이유 |
|---|---|
| 실제 FM/AM RF 주파수 수신 | 모바일 웹/PWA에서 구현 불가에 가까우며 제품 범위와 다름 |
| YouTube 오디오 추출 | YouTube 정책/저작권 리스크. 금지 |
| YouTube 숨김 iframe/background player | YouTube 정책 리스크. 금지 |
| yt-dlp, youtube-dl, 비공식 extractor | 약관/저작권/운영 리스크. 금지 |
| 서버 프록시로 라디오 음원 재송출 | 저작권 및 운영 책임 증가. MVP 제외 |
| 녹음/다운로드 | 저작권 리스크. MVP 제외 |
| 자동재생 | 모바일 브라우저 정책상 불안정. 사용자 탭 후 재생만 허용 |

## 7. Primary User Flows

### 7.1 고음질 라디오 직접 재생

```text
홈 진입
→ 국가/언어/장르/검색어 선택
→ 방송국 리스트 표시
→ 품질 배지 확인
→ 방송국 카드에서 재생 버튼 탭
→ HTML audio play()
→ 재생 성공 시 미니 플레이어 표시
```

### 7.2 낮은 품질 라디오에서 YouTube 대체 소스 선택

```text
방송국 상세 진입
→ 시스템이 direct stream 품질을 낮음으로 표시
→ 검증된 YouTube 대체 소스 존재
→ “YouTube 대체 소스로 듣기” CTA 표시
→ 사용자가 CTA 탭
→ visible YouTube iframe player 표시
→ 사용자가 YouTube player에서 재생
```

### 7.3 재생 실패 처리

```text
재생 버튼 탭
→ audio.play() 실패 또는 canplay timeout
→ 오류 상태 표시
→ 다른 직접 스트림 후보 또는 YouTube 대체 CTA 표시
→ 사용자가 재시도/대체 소스 선택
```

## 8. Success Criteria

| 지표 | MVP 목표 |
|---|---:|
| 검색 결과 중 High/Good 품질 비율 | 60% 이상 |
| direct stream 첫 재생 성공률 | 70% 이상 |
| High/Good 품질 direct stream 첫 재생 성공률 | 80% 이상 |
| audio.play() 사용자 탭 기반 호출률 | 100% |
| YouTube 대체 소스가 있는 low quality station의 CTA 노출 | 100% |
| YouTube 추출/숨김 플레이어 사용 | 0건 |
| iOS Safari, Chrome 주요 흐름 QA | pass |

## 9. Assumptions

| ID | 가정 | 영향 |
|---|---|---|
| A-001 | “전세계 모든 라디오 주파수”는 실제 RF 수신이 아니라 전세계 인터넷 라디오 청취 니즈로 해석한다. | 제품 문구와 구현 범위 |
| A-002 | 초기 데이터 소스는 Radio Browser API를 사용한다. | station model, 검색 기능 |
| A-003 | YouTube 대체 소스는 방송국 공식 채널/공식 라이브로 확인 가능한 경우만 제공한다. | 법무/정책 리스크 감소 |
| A-004 | YouTube Data API 키가 없으면 P0에서는 수동 seed mapping으로 대체한다. | 구현 가능성 확보 |
| A-005 | 출시 전 법무 검토는 별도 필요하다. | 글로벌 배포 리스크 |

## 10. Risks

| 리스크 | 영향 | 대응 |
|---|---|---|
| YouTube 정책 위반 | API 제한, 서비스 중단 | visible iframe, 사용자 선택, 추출 금지 |
| 잘못된 YouTube 매핑 | 방송국/권리자 혼동 | verified status와 검수 UI 필요 |
| 라디오 스트림 품질 편차 | 사용자 불만 | 품질 점수와 fallback CTA |
| Mixed content | HTTPS 웹앱에서 HTTP stream 차단 | HTTPS stream 우선, HTTP 경고/제외 |
| 모바일 autoplay 차단 | 재생 실패 | 모든 재생은 사용자 탭 이후 수행 |

## 11. Obsidian 기록 권장 위치

```text
10_Projects/GlobalRadioPWA/
├─ docs/pm/project-brief.md
├─ docs/research/research-summary.md
├─ docs/design/design-brief.md
├─ docs/design/asset-manifest.md
├─ docs/design/screen-spec.md
├─ docs/design/copydeck.md
├─ docs/design/quality-gates.md
├─ docs/codex/goal.md
└─ docs/codex/codex-task.md
```
