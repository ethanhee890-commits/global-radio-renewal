# Renewal Project Setup

## Purpose

`global-radio-renewal` is the separate renewal track for 지구라디오.

The existing stable project remains:

- Local path: `D:\CodexProjects\global-radio-pwa`
- GitHub: `https://github.com/ethanhee890-commits/global-radio-pwa`
- Web: `https://ethanhee890-commits.github.io/global-radio-pwa/`

The renewal project starts from the stable project commit `2abe377` and must be developed, packaged, and deployed independently.

## Renewal Identity

- Local path: `D:\CodexProjects\global-radio-renewal`
- GitHub: `https://github.com/ethanhee890-commits/global-radio-renewal`
- Web: `https://ethanhee890-commits.github.io/global-radio-renewal/`
- npm package: `global-radio-renewal`
- Android application id: `com.dexcompany.globalradiorenewal`
- iOS bundle id: `com.dexcompany.globalradiorenewal`
- Install display name: `지구라디오 리뉴얼`
- localStorage namespace: `global-radio-renewal:*:v1`

## Operating Rule

- Do not use the renewal project for hotfixes to the stable app.
- Do not use the stable project for renewal UI/UX experiments.
- If a renewal fix is useful for the stable app, cherry-pick or re-implement it intentionally after QA.
- Keep GitHub releases, APK files, and Pages URLs separate.

## Initial Verification

Run these before starting the first renewal feature:

```bash
npm run verify
```

```powershell
npm run android:debug
```

The first public Pages deployment should happen from the `main` branch of `global-radio-renewal`.
