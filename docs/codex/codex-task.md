---
type: project-doc
project: "GlobalRadioPWA"
status: ready
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - codex-task
  - implementation
---

# Codex Task — 지구라디오

## Start

Use `/goal` with `docs/codex/goal.md`.

Before writing code, inspect the repository structure and identify the stack. If `AGENTS.md` exists, read it first.

## Read First

- `docs/pm/project-brief.md`
- `docs/research/research-summary.md`
- `docs/design/design-brief.md`
- `docs/design/asset-manifest.md`
- `docs/design/screen-spec.md`
- `docs/design/copydeck.md`
- `docs/design/quality-gates.md`
- `docs/codex/goal.md`

## Execute

### 1. Repository inspection

- Check package manager.
- Check framework.
- Check available scripts.
- Check existing file structure.
- If empty repo, scaffold Vite + React + TypeScript.

### 2. Define task-specific Definition of Done

Create a short local checklist before implementation:

- Radio Browser search works.
- Quality score utility works.
- Direct audio playback works after user tap.
- YouTube alternate visible player works from seed data.
- No forbidden YouTube extraction/background behavior exists.
- Favorites/recent persist.
- Responsive UI passes.

### 3. Implement data layer

Create or adapt these modules:

```text
src/lib/radioBrowser.ts
src/lib/qualityScore.ts
src/lib/playbackSource.ts
src/data/youtubeAlternates.seed.ts
src/types/station.ts
```

Required functions:

```ts
searchStations(params): Promise<Station[]>
scoreStationQuality(station): StationQuality
getPreferredSource(station, alternates): PlaybackSourceRecommendation
getYouTubeAlternate(stationuuid): YouTubeAlternateSource | null
```

### 4. Implement UI

Required views/components:

```text
src/App.tsx
src/components/SearchBar.tsx
src/components/FilterBar.tsx
src/components/StationCard.tsx
src/components/QualityBadge.tsx
src/components/DirectAudioPlayer.tsx
src/components/YouTubeAlternatePlayer.tsx
src/components/MiniPlayer.tsx
src/components/StationDetail.tsx
src/components/Toast.tsx
```

If the repo uses another structure, adapt names but preserve responsibilities.

### 5. Implement direct radio playback

- Use HTMLAudioElement.
- Only call `audio.play()` inside user event handler.
- Handle promise rejection.
- Track states: `idle`, `loading`, `playing`, `paused`, `error`, `autoplay_blocked`.
- Record recent station only after a play attempt starts successfully.

### 6. Implement YouTube alternate playback

- Use official YouTube IFrame Player API or standard embed iframe.
- Player must be visible.
- Do not use `display:none`, 1px hidden player, offscreen player, or muted autoplay trick.
- Do not extract audio.
- Do not proxy YouTube media.
- Do not use yt-dlp/youtube-dl.
- Show source label: `YouTube 공식 대체 소스`.

### 7. Implement persistence

localStorage keys:

```text
global-radio-pwa:favorites:v1
global-radio-pwa:recent:v1
global-radio-pwa:settings:v1
```

### 8. Implement PWA basics

- `manifest.webmanifest`
- app name: `지구라디오`
- theme color: `#09111f`
- mobile meta tags
- icon fallback using simple local SVG only

## Validation

Run all available commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

If a command is missing, state `not configured` and continue with available validation.

Manual checks:

1. Search `jazz`, `news`, `korea`, `japan` or available test filters.
2. Confirm quality badges show.
3. Play a high-quality direct stream.
4. Force/test a low-quality station with a seeded YouTube alternate.
5. Confirm YouTube player is visible.
6. Confirm no hidden YouTube player exists in DOM.
7. Reload and confirm favorites/recent remain.
8. Check 360px responsive viewport.

## Self Review

After implementation:

- Review code for forbidden YouTube patterns.
- Review UX copy against `copydeck.md`.
- Review assets against `asset-manifest.md`.
- Review accessibility labels.
- Fix issues.
- Re-run validation.

## Final Report

Report only `Done` or `Blocked`.

Use this format:

```md
# Codex Final Report

## Status

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
