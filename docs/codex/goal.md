---
type: project-doc
project: "GlobalRadioPWA"
status: ready
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - codex-goal
  - implementation
---

# Codex Goal — 지구라디오

## Goal

전세계 공개 인터넷 라디오를 모바일 웹/PWA에서 검색하고, direct radio stream을 품질 우선으로 재생하며, direct stream 음질이 낮거나 실패한 경우 검증된 공식 YouTube 대체 소스를 visible YouTube player로 제공하는 MVP를 구현한다.

## Context

Read first:

1. `docs/pm/project-brief.md`
2. `docs/research/research-summary.md`
3. `docs/design/design-brief.md`
4. `docs/design/asset-manifest.md`
5. `docs/design/screen-spec.md`
6. `docs/design/copydeck.md`
7. `docs/design/quality-gates.md`
8. `docs/codex/goal.md`

## Product Scope

### P0

1. Radio Browser API station search
2. station quality scoring
3. quality-first station list
4. direct HTML audio playback
5. playback failure handling
6. verified YouTube alternate source display
7. visible YouTube IFrame Player integration
8. favorites and recent stations via localStorage
9. responsive mobile-first UI
10. PWA basics: manifest, app icon fallback, meta tags

## Out of Scope

- FM/AM RF receiving
- YouTube audio extraction
- hidden/background YouTube player
- yt-dlp/youtube-dl or unofficial extractor
- stream recording/download
- server-side audio proxy/rebroadcast
- automatic YouTube source matching without verification
- audio ad insertion over broadcasts

## Constraints

### Architecture

- If an existing stack exists, preserve it unless impossible.
- If the repo is empty, use Vite + React + TypeScript.
- Keep player source models separate: `RadioStreamSource` and `YouTubeAlternateSource`.
- Store P0 user state in localStorage.

### Audio Quality

Implement a quality scoring utility with at least these inputs:

```ts
type StationQualityInput = {
  codec?: string;
  bitrate?: number;
  hls?: 0 | 1;
  lastcheckok?: 0 | 1;
  ssl_error?: 0 | 1;
  url?: string;
  url_resolved?: string;
};

type QualityGrade = 'excellent' | 'good' | 'fair' | 'low' | 'unknown' | 'failed';
```

Minimum scoring rules:

| Rule | Effect |
|---|---|
| `lastcheckok !== 1` | `failed` 또는 목록 후순위 |
| `ssl_error === 1` | 후순위 또는 제외 |
| HTTPS stream | 가산 |
| HLS stream | 가산 |
| AAC/OPUS >= 96kbps | good 이상 후보 |
| AAC/OPUS >= 128kbps | excellent 후보 |
| MP3 >= 128kbps | fair/good 후보 |
| MP3 >= 192kbps | good/excellent 후보 |
| bitrate missing | unknown, 단 재생 가능하면 fair 가능 |

### YouTube Policy Constraints

- Do not extract audio from YouTube.
- Do not store or expose YouTube audio URLs.
- Do not use hidden iframe or background player.
- Do not obscure YouTube player attribution or controls.
- Do not mix YouTube search results with radio results as if they were the same source.
- The user must explicitly choose the YouTube alternate source.

### YouTube Alternate Source Model

```ts
type YouTubeAlternateSource = {
  id: string;
  stationuuid: string;
  type: 'youtube_live' | 'youtube_video' | 'youtube_channel';
  youtubeVideoId?: string;
  youtubeChannelId?: string;
  label: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verificationMethod: 'manual_seed' | 'official_homepage' | 'operator_review';
  sourceUrl: string;
  note?: string;
};
```

### Browser Playback

- All direct audio playback must be triggered by user gesture.
- Catch `audio.play()` rejection.
- Show autoplay-blocked copy when applicable.
- Do not promise background playback on mobile Safari.

## Quality Gates

Run available commands:

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

If a command does not exist, record it as `not configured` and use the closest available validation.

Manual QA:

- iOS Safari equivalent viewport 390px
- Chrome mobile viewport 360px
- Direct station play success path
- Direct station failure path
- Low-quality station with YouTube alternate path
- Favorites persistence after reload
- Recent persistence after reload
- No hidden YouTube player in DOM

## Done when

- P0 scope implemented.
- Radio station list sorts by quality.
- Direct player works after user tap.
- YouTube alternate source appears only when verified/pending data exists.
- YouTube player is visible and user-controlled.
- No audio extraction or hidden background player code exists.
- QA results are documented in final report.

## Blocked when

- External API is unreachable and no mock fallback can be used.
- Required API credentials are missing for a task that cannot be mocked.
- Existing repo architecture prevents implementation without major rewrite.
- Requirements conflict with YouTube policy constraints.

## Final Report Format

```md
# Codex Final Report

## Status
Done | Blocked

## Summary

## Changed Files

## Implemented Scope

## Validation Results

## Audio Quality Logic

## YouTube Policy Compliance

## Manual QA

## Remaining Risks

## Next Recommendations
```
