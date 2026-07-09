---
type: project-doc
project: "GlobalRadioPWA"
status: draft
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - quality-gates
  - qa
  - codex
---

# Quality Gates — 지구라디오

## 1. Functional Gates

- [ ] 국가/언어/장르/이름 검색이 동작한다.
- [ ] 방송국 리스트가 품질 점수순으로 정렬된다.
- [ ] 각 station card에 codec, bitrate, hls 여부, 품질 배지가 표시된다.
- [ ] direct radio stream은 사용자가 `재생하기`를 탭한 뒤에만 재생된다.
- [ ] 재생 실패 시 오류 문구와 retry가 표시된다.
- [ ] 검증된 YouTube 대체 소스가 있는 station은 CTA를 표시한다.
- [ ] YouTube 대체 소스는 visible iframe player로만 재생된다.
- [ ] 즐겨찾기와 최근 들은 방송은 localStorage에 저장된다.

## 2. Engineering Gates

- [ ] TypeScript 사용 시 `npm run typecheck` 통과
- [ ] lint 설정이 있으면 `npm run lint` 통과
- [ ] test 설정이 있으면 `npm test` 통과
- [ ] build 설정이 있으면 `npm run build` 통과
- [ ] 브라우저 콘솔에 치명적 오류 없음
- [ ] API key가 없어도 P0 기능은 seed/mock으로 동작

## 3. UI State Gates

| 상태 | 검증 |
|---|---|
| loading | skeleton 또는 명확한 loading message 표시 |
| empty | 빈 상태 문구와 다음 행동 표시 |
| error | 문제와 다음 행동 표시 |
| success | 즐겨찾기/설정 저장 feedback 표시 |
| disabled | 재생 준비 중 중복 클릭 방지 |
| permission/autoplay blocked | 사용자 탭 필요 안내 |

## 4. Design Gates

- [ ] 모바일 360px에서 가로 스크롤 없음
- [ ] station card 내 정보 위계 명확
- [ ] 품질 배지는 색상 + 텍스트 병기
- [ ] direct player와 YouTube player가 시각적으로 구분됨
- [ ] AI식 추상 장식/과장 문구 없음

## 5. Asset Gates

- [ ] asset-manifest.md에 없는 이미지/아이콘 사용 금지
- [ ] 아이콘 라이브러리는 Lucide 하나만 사용
- [ ] station logo 실패 시 텍스트 fallback 사용
- [ ] YouTube 로고/브랜딩 임의 변형 금지

## 6. Accessibility Gates

- [ ] 모든 input에 label 또는 aria-label 존재
- [ ] player control button에 aria-label 존재
- [ ] iframe title 존재
- [ ] 키보드로 검색, 필터, 재생, 즐겨찾기 조작 가능
- [ ] focus state 확인 가능
- [ ] 색상만으로 상태 구분하지 않음

## 7. Responsive Gates

| Width | 기준 |
|---|---|
| 360px | 단일 컬럼, 버튼 터치 영역 44px 이상 |
| 768px | 리스트/필터가 깨지지 않음 |
| 1280px | 과도하게 늘어나지 않고 player 패널 유지 |

## 8. Copy Gates

- [ ] “모든 주파수 수신” 같은 오해 문구 없음
- [ ] “YouTube 음원 추출” 같은 문구 없음
- [ ] YouTube 대체 소스는 별도 플레이어임을 안내
- [ ] 오류 문구는 다음 행동을 포함

## 9. Done Criteria

Dex가 Done으로 보고하려면 아래를 모두 포함합니다.

- 구현 요약
- 변경 파일 목록
- 실행한 검증 명령과 결과
- 실패 후 수정한 내역
- 자체 리뷰 결과
- direct stream 재생 QA 결과
- YouTube 대체 player QA 결과
- 정책 금지 항목 미사용 확인
- 남은 리스크

## 10. Blocked Criteria

Blocked는 아래 상황에서만 허용합니다.

- Radio Browser API 접근 불가
- YouTube API key가 필수인 구현을 해야 하는데 key가 없음
- 필수 의존성 설치 실패
- 기존 repo 구조가 문서와 충돌
- YouTube 공식성 검수 데이터가 없어 대체 소스 표시 불가
- 보안/정책상 진행 불가한 요구가 발견됨

Blocked 보고에는 반드시 `정확한 blocker`, `시도한 내용`, `대체 검증 결과`, `에던에게 필요한 입력`을 포함합니다.
