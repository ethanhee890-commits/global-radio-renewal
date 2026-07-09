# 틈숨

브랜딩 결과물의 추천안인 `틈숨`을 실제 브라우저에서 실행 가능한 온라인 휴식 채팅 커뮤니티 MVP로 구현한 프로젝트입니다.

## 실행 방법

일반 Node/npm 환경에서는 아래 명령을 사용합니다.

```bash
npm install
npm run dev
```

브라우저 확인 주소는 다음과 같습니다.

```text
http://127.0.0.1:5173/
```

현재 Codex Desktop 환경처럼 `npm`이 PATH에 없는 경우, 번들 Node로 Vite를 직접 실행할 수 있습니다.

```powershell
& "C:\Users\rooki\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173
```

## 주요 구현 범위

- 실시간 휴식방 UX: 옥상바람, 야간정류장, 우주창가, 캠퍼스계단, 무음실
- 호흡 코어 인터랙션: press 들숨, press out 날숨, 한숨 소리, 진행률, 타이머, 초기화
- 익명 채팅: 50자 제한, 빠른 문장, 로컬 닉네임, 감정 배지
- 안전 장치: 금칙어 흐림, 개인정보 유도 차단, 도배 제한, 무음실 채팅 잠금
- 신고 흐름: 모달, 입력 검증, localStorage 운영 큐, 접수 토스트
- 메뉴: 닉네임 저장/재생성, 이용 가이드, 운영 원칙
- 반응형 화면: 데스크톱 3열, 태블릿 2열, 모바일 단일 열

## 파일 구조

```text
src/main.tsx                 앱 진입점
src/TeumSoomApp.tsx          틈숨 React 화면과 상호작용
src/teumsoom.css             틈숨 전용 디자인/반응형 스타일
src/teumsoom/data.ts         방, 무드, 빠른 문장, 안내 데이터
src/teumsoom/moderation.ts   메시지/신고 검증 로직
src/teumsoom/storage.ts      localStorage 기반 닉네임/방/상태 저장
src/teumsoom/types.ts        틈숨 도메인 타입
src/test/teumsoom.test.ts    검열/신고 검증 테스트
branding-package/            브랜딩 산출물
docs/damta-service-analysis.md 기존 담타 분석 문서
docs/teumsoom-risk-register.md 리스크와 다음 개선 과제
```

## 검증

이 환경에서는 `npm` 대신 번들 Node로 아래 검증을 수행했습니다.

```powershell
& "C:\Users\rooki\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules/eslint/bin/eslint.js . --max-warnings=0
& "C:\Users\rooki\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules/typescript/bin/tsc --noEmit
& "C:\Users\rooki\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules/vitest/vitest.mjs run
& "C:\Users\rooki\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules/vite/bin/vite.js build
```

브라우저 검증 산출물:

```text
output/teumsoom-desktop-v2.png
output/teumsoom-mobile-v3.png
```

## 현재 한계

- 실제 WebSocket, DB, 인증, 운영자 신고 큐는 아직 연결하지 않은 로컬 MVP입니다.
- 접속자 수와 초기 메시지는 검토용 Mock 데이터입니다.
- 한숨 소리는 Web Audio 기반 임시 효과음입니다.
- 운영 리스크 상세는 `docs/teumsoom-risk-register.md`에 정리했습니다.
