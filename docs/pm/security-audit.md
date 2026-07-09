---
type: security-audit
project: "GlobalRadioPWA"
status: active
last_updated: "2026-07-09"
tags:
  - security
  - packaging
  - global-radio
---

# Security Audit - 지구라디오 패키징 전 점검

## Scope

- Vite/React PWA production build and `dist/` packaging surface
- Radio Browser API request path and returned station URL ingestion
- HTML audio direct stream playback
- Visible YouTube IFrame Player alternate playback
- localStorage favorites, recents, and settings persistence
- dependency audit, lockfile, CSP, public assets, and accidental secret exposure risk

## Fixed

- Dev dependency vulnerabilities were remediated by updating the lockfile and upgrading Vitest to the current safe major.
- Release CSP no longer allows `localhost`, `127.0.0.1`, or `ws://` in `connect-src`.
- CSP now includes `form-action 'none'`, explicit YouTube `frame-src`, `manifest-src`, and `worker-src`.
- Vite production build now uses `public-radio/`, preventing unrelated legacy public assets from being copied into the packaged app.
- Package identity was changed to `global-radio-pwa` and `private: true` remains enabled to prevent accidental npm publish.
- Radio Browser station URLs, homepage URLs, and localStorage-restored station URLs now pass through `getSafeNetworkUrl`.
- Favicon display URLs are HTTPS-only to avoid CSP-blocked mixed-content icon loads.
- Direct playback now refuses non-`http/https` stream URLs before assigning `audio.src`.
- Android native playback validates stream URLs before starting the foreground service.
- Android native alarm scheduling stores only the selected station stream metadata and validates hour/minute and `http/https` URLs before scheduling.
- Browser HTML audio is now mounted once at the app root, preventing tab navigation from destroying the active media element.
- YouTube iframe permissions were reduced and now include `referrerPolicy="strict-origin-when-cross-origin"`.
- `security:scan` now gates CSP, release public directory, package identity, YouTube iframe permissions, and URL-safety wiring.

## Verified

- Production dependency audit: `npm.cmd audit --omit=dev --audit-level=moderate`
- Full dependency audit after remediation: `npm.cmd audit --audit-level=moderate`
- Registry signature audit: `npm.cmd audit signatures`
- Static source scan for dangerous browser execution patterns, localStorage usage, iframe usage, secret keywords, and insecure dev endpoints
- Build-output scan for source maps, secrets, local dev URLs, legacy public assets, and stale product names
- Git history secret scan: no committed history exists in this repository yet

## Residual Risks

- `media-src` intentionally allows `http:` because many public radio streams still do not provide HTTPS. This is limited to media playback, not script, frame, or API requests.
- `.env.local` exists locally and must not be included if a source ZIP is ever shared. It is ignored by `.gitignore` and is not copied to `dist/`.
- The source tree still contains legacy prototype modules and local proxy scripts that are not imported by the radio PWA entrypoint. Package `dist/` for release; do not package the full workspace folder unless those legacy files are removed first.
- GitHub Pages cannot add all server-side security headers directly. The app carries a meta CSP, but a custom production host should also set HTTP headers such as CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `frame-ancestors 'none'`.
- Capacitor Android sets cleartext WebView support explicitly because public radio HTTP streams are a product requirement. This may require a store-review explanation and can be removed only if the product switches to HTTPS-only streams.
- Capacitor iOS may require ATS media/web-content exceptions for HTTP radio streams after the native iOS project is generated and reviewed in Xcode.
- iOS Safari real-device playback is still a functional release validation item, not a security finding.
- Android exact alarm permission is user-controlled on Android 12+. If the user denies exact alarms, the app can still save the alarm setting, but automatic playback at the exact time is not guaranteed.
- iOS local notifications do not grant background auto-play rights. iOS alarm behavior is notification-first, then user tap and playback.

## Packaging Gate

The app is acceptable for app packaging when all of these pass:

```powershell
npm.cmd run verify
npm.cmd audit --audit-level=moderate
npm.cmd audit --omit=dev --audit-level=moderate
npm.cmd audit signatures
```

Package from `dist/`, not from the full workspace folder.
