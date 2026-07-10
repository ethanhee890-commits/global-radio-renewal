# 지구라디오 리뉴얼

현재 지구라디오 안정판을 기준으로 분리한 리뉴얼 전용 모바일 PWA/하이브리드 앱입니다. 원본 `global-radio-pwa`는 그대로 유지하고, 이 저장소에서는 별도 UI/UX/브랜딩 실험과 리뉴얼 배포를 진행합니다.

## 공유 주소

- 웹페이지: https://ethanhee890-commits.github.io/global-radio-renewal/
- GitHub: https://github.com/ethanhee890-commits/global-radio-renewal
- Android APK: 준비 중

## 주요 기능

- Radio Browser API 기반 전세계 공개 인터넷 라디오 검색
- 국가, 언어, 장르 필터와 검색어 기반 국가 추론
- codec, bitrate, HLS, lastcheckok, ssl_error, HTTPS 기준 품질 점수 계산
- 고음질 방송 우선 정렬
- direct radio stream은 HTML audio 또는 네이티브 라디오 서비스로 재생
- 직접 스트림 품질이 낮거나 실패했고 검증된 공식 YouTube 대체 소스가 있을 때만 visible YouTube IFrame Player 표시
- YouTube 오디오 추출, hidden iframe, background player, yt-dlp/youtube-dl 미사용
- 즐겨찾기와 최근 들은 방송 localStorage 저장
- Android/iOS 패키징 자산, 스플래시, 앱 아이콘 반영
- Android 네이티브 백그라운드 재생과 라디오 알람 기반 구조
- 360px/390px 모바일 폭 대응

## 디자인 가이드

- YouTube Music 참고형 UI/UX/GUI 가이드: [docs/design/youtube-music-inspired-ui-guide.md](docs/design/youtube-music-inspired-ui-guide.md)

## 실행

```bash
npm install
npm run dev
```

로컬 확인 주소:

```text
http://127.0.0.1:5173/
```

## 검증

```bash
npm run verify
npm audit --audit-level=moderate
```

Android debug APK 빌드:

```powershell
npm run android:debug
```

## 참고

브라우저와 iOS Safari는 사용자 동작 없이 오디오 자동 재생을 막을 수 있습니다. Android 앱은 네이티브 재생과 알림 권한을 통해 더 안정적인 알람/백그라운드 제어를 제공합니다. iOS는 시스템 제한상 알림을 탭한 뒤 앱에서 재생해야 하는 흐름을 유지합니다.
