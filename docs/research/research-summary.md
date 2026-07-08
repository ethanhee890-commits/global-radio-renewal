---
type: project-doc
project: "GlobalRadioPWA"
status: draft
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - research
  - source-backed
  - codex
---

# Research Summary — 지구라디오

## 1. Sources Reviewed

| Source | 확인 내용 | 제품 영향 |
|---|---|---|
| Radio Browser API Docs | station fields: codec, bitrate, hls, lastcheckok, ssl_error 등 | 품질 점수 계산 기준 |
| YouTube API Services Terms of Service | API 사용 시 약관 준수 필요 | YouTube 연동 방식 제한 |
| YouTube Developer Policies | audiovisual content 다운로드/캐싱/오디오 분리/숨김 player 금지 | YouTube 대체 소스 정책 |
| YouTube IFrame Player API | 웹사이트 내 YouTube player 임베드와 JS 제어 가능 | visible YouTube player 구현 |
| MDN Autoplay Guide | audible media autoplay blocking | 사용자 탭 기반 재생 |
| Chrome Autoplay Policy | 브라우저 autoplay 정책 강화 | autoplay 금지 |

## 2. Facts

### 2.1 Radio Browser facts

- Radio Browser station 데이터에는 stream의 `codec`, `bitrate`, `hls`, `lastcheckok`, `ssl_error` 같은 필드가 있습니다.
- `lastcheckok`는 여러 측정 지점 기반의 온라인/오프라인 상태 판단값으로 볼 수 있습니다.
- 따라서 MVP에서 품질 점수는 임의 체감이 아니라 station metadata + 브라우저 재생 테스트 결과를 함께 사용해야 합니다.

### 2.2 YouTube facts

- YouTube IFrame Player API는 웹사이트에 YouTube video player를 embed하고 JavaScript로 재생/정지/볼륨/상태 이벤트를 제어할 수 있습니다.
- YouTube embedded player는 표시되는 player로 취급해야 하며, 문서상 player viewport 최소 크기 조건이 있습니다.
- YouTube Developer Policies는 YouTube audiovisual content의 audio/video component를 separate, isolate, modify 하는 행위와 background player 사용을 금지합니다.
- 따라서 “YouTube 음질로 제공”은 **YouTube 오디오 추출**이 아니라 **YouTube 플레이어로 대체 재생 경로 제공**으로 해석해야 합니다.

### 2.3 Browser playback facts

- 소리가 있는 media는 autoplay blocking 대상입니다.
- iOS Safari/Chrome 모두 신뢰 가능한 UX를 위해 첫 재생은 사용자 탭 이후에만 실행해야 합니다.

## 3. Signals

| 신호 | 해석 |
|---|---|
| 사용자가 음질을 강하게 요구 | 단순 방송국 수보다 “잘 들리는 방송”을 우선해야 함 |
| YouTube 대체 요청 | 방송국 공식 YouTube 라이브를 fallback source로 연결할 가치가 있음 |
| 모바일 웹 중심 | autoplay, background playback, PWA 제약을 설계에 반영해야 함 |

## 4. Patterns to Adopt

1. **Quality-first list**: 검색 결과를 품질 점수순으로 정렬합니다.
2. **Quality badge**: `Excellent`, `Good`, `Low`, `Unknown`, `Failed` 배지를 표시합니다.
3. **Direct stream first**: 기본은 라디오 스트림 직접 재생입니다.
4. **YouTube as alternate**: direct stream 품질이 낮거나 실패했고 검증된 공식 YouTube 대체 소스가 있을 때만 대체 CTA를 표시합니다.
5. **Explicit user choice**: 대체 소스 전환은 자동이 아니라 사용자가 직접 선택합니다.
6. **Source transparency**: `라디오 스트림`, `YouTube 공식 라이브`, `검수 필요` 라벨을 분리합니다.

## 5. Patterns to Avoid

| 금지 패턴 | 이유 |
|---|---|
| YouTube 오디오 URL 추출 | 정책/저작권 리스크 |
| hidden iframe에서 YouTube만 소리 재생 | background player 리스크 |
| YouTube player를 1px 또는 display:none 처리 | 정책 리스크 |
| YouTube 결과와 라디오 결과를 동일 소스처럼 섞기 | 출처 혼동 |
| 사용자가 누르지 않았는데 YouTube 자동 재생 | autoplay/정책/UX 리스크 |
| 공식 여부 확인 없는 YouTube 후보 자동 연결 | 방송국 오인 및 권리 리스크 |

## 6. Product Decisions

| 결정 ID | 결정 | 이유 |
|---|---|---|
| D-001 | 제품 표현은 “전세계 인터넷 라디오”로 정의한다. | 실제 RF 수신 오해 방지 |
| D-002 | 음질 기준을 P0 핵심 기능으로 승격한다. | 사용자 명시 요구사항 |
| D-003 | YouTube는 대체 소스이며 audio extraction은 금지한다. | 정책 리스크 방지 |
| D-004 | YouTube 대체 소스는 공식/검증 상태를 가진 별도 모델로 관리한다. | 오매칭 방지 |
| D-005 | 자동 전환 대신 사용자 선택 CTA를 둔다. | autoplay, 정책, UX 안정성 |

## 7. Design Decisions

| 영역 | 결정 |
|---|---|
| 정보 위계 | 방송국명보다 품질 배지와 재생 가능성을 눈에 띄게 표시 |
| 대체 소스 UX | “음질이 낮아요 → YouTube 공식 라이브로 듣기” 흐름 |
| 경고 문구 | YouTube는 별도 소스이며 플레이어가 표시된다는 점을 안내 |
| 모바일 | 하단 미니 플레이어 + 상세 화면 확장 구조 |

## 8. Implementation Implications for Dex

- `qualityScoreStation(station)` 순수 함수 작성
- `getPreferredSource(station, alternates)` 함수 작성
- direct stream과 YouTube source를 다른 player component로 분리
- YouTube source에는 `youtubeVideoId` 또는 `youtubeChannelId`만 저장하고 audio URL은 절대 저장하지 않음
- YouTube player는 visible container에만 mount
- `play()`는 사용자 이벤트 핸들러 안에서만 호출
- YouTube Data API 키가 없으면 P0에서는 seed mapping만 사용

## 9. Japan Broadcast Findings

- NHK WORLD-JAPAN은 일본 공영방송 NHK의 국제 서비스이며 TV/radio live streaming을 제공한다.
- radiko 공식 앱 설명은 일본 내 이용만 허용된다고 명시하므로, radiko 전용 주요 민방 스트림은 MVP에서 우회하지 않는다.
- Shonan Beach FM 공식 LISTEN NOW 페이지는 라디오 audio source와 YouTube Live Cam embed를 함께 제공한다. 앱에는 HTTPS Icecast stream과 visible YouTube iframe 대체 소스만 seed로 넣는다.
- FM Kahoku 공식 페이지는 78.7MHz, 인터넷 라디오, 재난/지역 방송 정보를 제공한다. 현재 확인한 직접 스트림은 HTTP MP3 96kbps라 품질 점수상 낮게 표시한다.

## 10. Risks and Unknowns

| ID | 항목 | 상태 | 처리 |
|---|---|---|---|
| R-001 | 특정 방송국의 YouTube 공식성 확인 | not checked | 수동 검수 필요 |
| R-002 | YouTube API quota | not checked | P1에서만 API 연동 |
| R-003 | 방송국별 라디오 스트림 라이선스 | not checked | 출시 전 법무 검토 |
| R-004 | iOS Safari YouTube iframe background behavior | browser-dependent | background 재생 보장하지 않음 |
| R-005 | 일본 커뮤니티 FM 일부 HTTP stream의 HTTPS 배포 호환성 | checked-partial | HTTPS 후보 우선, HTTP 후보는 품질 점수와 안내로 노출 |

## Sources

- Radio Browser API Docs: https://docs.radio-browser.info/
- NHK WORLD-JAPAN app listing: https://play.google.com/store/apps/details?id=jp.or.nhk.nhkworld.tv&hl=en_US
- radiko app listing: https://play.google.com/store/apps/details?id=jp.radiko.Player&hl=en_US
- Shonan BeachFM LISTEN NOW: https://www.beachfm.co.jp/radio/
- FM Kahoku official site: https://fm.kahoku.net/
- YouTube API Services Terms of Service: https://developers.google.com/youtube/terms/api-services-terms-of-service
- YouTube API Services Developer Policies: https://developers.google.com/youtube/terms/developer-policies
- YouTube IFrame Player API: https://developers.google.com/youtube/iframe_api_reference
- MDN Autoplay Guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- Chrome Autoplay Policy: https://developer.chrome.com/blog/autoplay
