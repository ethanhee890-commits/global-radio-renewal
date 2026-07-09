---
type: qa-report
project: "GlobalRadioPWA"
status: active
last_updated: "2026-07-08"
tags:
  - qa
  - global-radio
  - japan-radio
---

# QA Report — 지구라디오 일본 방송 보강

## Scope

- 일본 우선 seed: NHK WORLD-JAPAN Radio, Shonan Beach FM 78.9, FM Kahoku 78.7
- 일본 빠른 진입 CTA, 일본 검증 안내, NHK/공개 FM quick filter
- Shonan Beach FM 공식 YouTube Live Cam visible iframe 대체 소스
- radiko 우회/비공식 NHK 미러 제외

## Automated Checks

- `npm.cmd run verify`: PASS
  - lint: PASS
  - typecheck: PASS
  - vitest: 10 files / 38 tests PASS
  - build: PASS
  - security scan: PASS
- `npm.cmd audit --omit=dev`: PASS, production vulnerabilities 0

## Browser Checks

- URL: `http://127.0.0.1:5179/`
- Desktop Browser check: PASS
  - Japan CTA visible and clickable
  - Result order: NHK WORLD-JAPAN Radio, Shonan Beach FM 78.9, FM Kahoku 78.7
  - Detail panel selects NHK WORLD-JAPAN Radio after Japan CTA
  - radiko limitation notice visible
  - Console warn/error: none
  - Horizontal overflow: none
- Mobile 360px Browser check: PASS
  - Japan panel and NHK result visible
  - Horizontal overflow: none
  - Out-of-viewport control rects: none
- Shonan YouTube alternate: PASS
  - Detail panel shows verified YouTube alternate source
  - Button mounts visible iframe
  - iframe src: `https://www.youtube.com/embed/qGCPvnk8Unc?rel=0`
  - MiniPlayer hidden while YouTube source is active

## Stream Checks

- NHK WORLD-JAPAN HLS playlist: HTTP 200, `application/vnd.apple.mpegurl`, 244 bytes
- Shonan Beach FM HTTPS MP3 stream: HTTP 200, `audio/mpeg`, data received for 8 seconds
- FM Kahoku HTTP MP3 stream: HTTP 200, `audio/mpeg`, data received for 8 seconds

## Playback Automation Note

- Browser automation click reached the app autoplay-blocked state for Shonan direct audio and showed the expected "tap again" warning.
- Because automated browser clicks may not grant the same audible media permission as a real user tap, direct audio canplay was verified by stream data receipt, not by audible playback in the automation session.

## Not Checked

- iOS Safari 실기기 direct audio playback
- 일본 내 radiko 앱/웹 권역 재생
- 장시간 스트림 안정성
