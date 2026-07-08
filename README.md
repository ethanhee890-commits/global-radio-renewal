# 지구라디오

전세계 공개 인터넷 라디오를 검색하고, 품질 좋은 직접 스트림을 우선 재생하는 모바일 PWA입니다. 일본 공중파/공개 FM을 빠르게 찾을 수 있도록 NHK WORLD-JAPAN Radio, Shonan Beach FM, FM Kahoku seed를 포함했습니다.

## 주요 기능

- Radio Browser API 기반 전세계 공개 인터넷 라디오 검색
- codec, bitrate, HLS, lastcheckok, ssl_error, HTTPS 기준 품질 점수 계산
- 고음질 방송 우선 정렬
- 직접 라디오 스트림은 HTML audio로 재생
- 직접 스트림 품질이 낮거나 실패했고 검증된 공식 YouTube 대체 소스가 있을 때만 visible YouTube IFrame Player로 대체
- YouTube 오디오 추출, hidden iframe, background player, yt-dlp/youtube-dl 미사용
- 즐겨찾기와 최근 들은 방송 localStorage 저장
- 360px 모바일 폭 대응

## 실행

```bash
npm install
npm run dev
```

로컬에서 열린 주소를 브라우저로 접속하면 됩니다.

## 검증

```bash
npm run verify
npm audit --omit=dev
```

## 참고

일본 민영/공중파의 상당수는 radiko 권역 정책을 따르므로, 공개 웹 스트림으로 합법 확인 가능한 소스만 seed에 포함했습니다. direct stream이 브라우저에서 실패할 때도 YouTube 대체 재생은 공식 채널/공식 페이지로 검증된 경우에만 표시합니다.
