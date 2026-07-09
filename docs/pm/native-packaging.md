---
type: packaging-note
project: "GlobalRadioPWA"
status: active
last_updated: "2026-07-09"
tags:
  - capacitor
  - android
  - ios
  - packaging
---

# Native Packaging - 지구라디오

## Stack

- Capacitor 8
- Android application id: `com.dexcompany.globalradio`
- iOS bundle id: `com.dexcompany.globalradio`
- Web assets: `dist/`
- App name: `지구라디오`

## Commands

```powershell
npm.cmd run verify
npm.cmd run android:sync
npm.cmd run android:debug
npm.cmd run android:bundle
npm.cmd run ios:sync
```

## Android

- Android Studio and Android SDK are required.
- `server.cleartext: true` is intentionally enabled for public `http://` radio streams.
- Store review may ask why cleartext traffic is enabled. The explanation is that only public audio streams use HTTP; app code, API calls, and YouTube frames remain HTTPS/CSP-gated.
- Android now includes a native `NativeRadioService` foreground media playback service.
- Android radio playback is kept outside the React tab tree, so changing app tabs does not stop playback.
- Android alarm playback uses an exact alarm receiver and starts the selected radio stream through the foreground service when exact alarm permission is allowed.
- Android reboot recovery reschedules the saved radio alarm through `BOOT_COMPLETED`.

## iOS

- iOS archive/IPA builds require macOS, Xcode, and CocoaPods/Xcode project tooling.
- Windows can prepare web assets and Capacitor config, but final iOS signing and archive must be done on a Mac or trusted cloud build runner.
- If HTTP radio streams fail in WKWebView, review `ios/App/App/Info.plist` and add narrowly documented ATS exceptions for media/web content.
- iOS declares `UIBackgroundModes` with `audio` and configures `AVAudioSession` as playback.
- iOS can schedule a local notification for the radio alarm, but it cannot reliably auto-start arbitrary internet radio from a killed/background state without user interaction. The user should tap the notification and start playback in the app.

## Release Packaging Rule

Package generated native projects from synchronized Capacitor output. Do not package `.env.local`, `node_modules`, or the full workspace as an app payload.

## Generated Outputs

- Android debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Android release AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- iOS project: `ios/App/App.xcodeproj` and `ios/App/App.xcworkspace`

## Verification - 2026-07-08

- `npm.cmd run verify`: PASS
- `npm.cmd audit --audit-level=moderate`: PASS, 0 vulnerabilities
- `npm.cmd audit --omit=dev --audit-level=moderate`: PASS, 0 vulnerabilities
- `npm.cmd audit signatures`: PASS, 346 registry signatures, 85 attestations
- `npm.cmd run android:debug`: PASS
- `npm.cmd run android:bundle`: PASS
- Native web asset scan: PASS, no local dev URL, secret keyword, source map, or stale prototype copy found

## Verification - 2026-07-09

- `npm.cmd run verify`: PASS
- `npm.cmd audit --audit-level=moderate`: PASS, 0 vulnerabilities
- `npm.cmd audit signatures`: PASS, 347 registry signatures, 86 attestations
- `npm.cmd run android:sync`: PASS, found `@capacitor/app` and `@capacitor/local-notifications`
- `npm.cmd run ios:sync`: PASS, found `@capacitor/app` and `@capacitor/local-notifications`
- `npm.cmd run android:debug`: PASS
- `npm.cmd run android:bundle`: PASS
- Android debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Android release AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- Playwright viewport QA: PASS at `1366x900` and `360x800`, no horizontal overflow, one persistent audio element retained after settings tab navigation

## Verification - 2026-07-09 r2

- Native/mobile player panel changed to bottom-sheet access from the mini player.
- Native playback status is now polled from `NativeRadioService` so the UI separates `connecting` from `playing`.
- App icon resources regenerated from `scripts/generate-app-icons.ps1`.
- `npm.cmd run verify`: PASS
- `npm.cmd run android:debug`: PASS
- `npm.cmd run android:bundle`: PASS
- Playwright `360x800` bottom-sheet QA: PASS, no horizontal overflow
- Shared ZIP: `release/global-radio-android-2026-07-09-r2.zip`

## Verification - 2026-07-09 r3

- Top tab menu replaced with a fixed bottom navigation surface.
- Bottom sheet now closes by close button, dimmed backdrop tap, Escape, and downward drag.
- UI renewed toward a Toss-style light product surface: white cards, soft gray borders, restrained blue actions.
- App icon resources regenerated as a flat friendly radio character illustration.
- `npm.cmd run verify`: PASS
- `node .\artifacts\qa\playwright-bottom-nav-r3.mjs`: PASS
  - Mobile `360x780`: no horizontal overflow, bottom nav fixed, dim close PASS, drag close PASS
  - Desktop `1024x900`: no horizontal overflow
- `npm.cmd run android:debug`: PASS
- `npm.cmd run android:bundle`: PASS
- `npm.cmd run ios:sync`: PASS
- Android debug APK: `release/global-radio-android-2026-07-09-r3/jigu-radio-debug-install-r3.apk`
- Android release AAB: `release/global-radio-android-2026-07-09-r3/jigu-radio-playstore-unsigned-r3.aab`
- Shared ZIP: `release/global-radio-android-2026-07-09-r3.zip`
- ZIP SHA-256: `B5B704510806BBA670078D6326D3FBD5CB8E3AB64CB5A2DBCE048CBAB7C1DB71`

## Verification - 2026-07-09 r4

- Bottom-sheet content area now scrolls vertically while the handle/header keep downward close-drag behavior.
- Search input default query changed from `jazz` to an empty value; initial station load also uses an empty query.
- Startup splash added with the Jigu Radio character in HTML boot splash, React in-app splash, PWA assets, and Android native splash PNGs.
- `npm.cmd run verify`: PASS
- `node .\artifacts\qa\playwright-splash-bottom-sheet-r4.mjs`: PASS
  - Startup splash appears
  - Search query default is empty
  - Mobile `360x780`: no horizontal overflow, bottom nav fixed
  - Bottom-sheet body scroll verified: `clientHeight 574`, `scrollHeight 973`
  - Drag down closes bottom sheet
- `npm.cmd run android:debug`: PASS
- `npm.cmd run android:bundle`: PASS
- `npm.cmd run ios:sync`: PASS
- Android debug APK: `release/global-radio-android-2026-07-09-r4/jigu-radio-debug-install-r4.apk`
- Android release AAB: `release/global-radio-android-2026-07-09-r4/jigu-radio-playstore-unsigned-r4.aab`
- Shared ZIP: `release/global-radio-android-2026-07-09-r4.zip`
- ZIP SHA-256: `3AE078078CE2A94994E887F928BC60520B88CB4EA271C1462201EFD322D882EA`

## Verification - 2026-07-09 r5

- Language selector fixed: removed the invalid `음악 중심` option from language choices.
- Direct radio player controls now use one state-based action button: `재생하기`, `일시정지`, or failed-state `다시 시도하기`.
- Alarm hour/minute inputs now use numeric text entry with focus selection, preventing leading `0` input errors.
- Header icon now uses the Jigu Radio character icon; the decorative icon above `품질 기준` was removed.
- System-centered alarm copy changed from `정확한 알람 권한 열기` to `알람 권한`.
- Playback continuation and alarm permission prompts were added with user-centered copy.
- Bottom-sheet station detail now matches the current broadcast, even while search results update.
- `npm.cmd run verify`: PASS
- `node .\artifacts\qa\playwright-ui-polish-r5.mjs`: PASS
  - Startup splash appears
  - Search query default is empty
  - Character icon is used in the header
  - Language options are `전체`, `한국어`, `영어`, `일본어`
  - Mobile `360x780`: no horizontal overflow
  - Alarm hour/minute input replacement verified: `23`, `56`
  - Bottom-sheet detail and current broadcast matched
  - Bottom-sheet body scroll verified: `clientHeight 574`, `scrollHeight 921`
- `npm.cmd run android:debug`: PASS
- `npm.cmd run android:bundle`: PASS
- `npm.cmd run ios:sync`: PASS
- Android debug APK: `release/global-radio-android-2026-07-09-r5/jigu-radio-debug-install-r5.apk`
- Android release AAB: `release/global-radio-android-2026-07-09-r5/jigu-radio-playstore-unsigned-r5.aab`
- Shared ZIP: `release/global-radio-android-2026-07-09-r5.zip`
- ZIP SHA-256: `50ACFCCF7B903C548BB68D0A958D6C0A3F51CDFCB95E5AF2AF8CA88FE934D3E0`

## Verification - 2026-07-09 r6

- Hero copy simplified for listeners: removed internal `source`, `quality criteria`, codec/bitrate/HLS explanation, and the Japan shortcut.
- Recent station shortcut now appears in the hero when a recently played station exists.
- Mobile inline current-player/detail panels are hidden from tab pages to avoid duplicating the bottom sheet.
- Recent list now supports all-delete and per-station delete.
- Favorites list now supports all-delete.
- Direct stream failure now updates runtime station quality state and shows official YouTube fallback when a verified source is available.
- MBC FM4U is mapped to the official MBC Radio YouTube fallback.
- `npm.cmd run verify`: PASS
- `node .\artifacts\qa\playwright-ux-cleanup-r6.mjs`: PASS
  - Hero copy avoids `소스`
  - Hero quality explainer removed
  - Japan shortcut removed
  - Recent shortcut appears in hero
  - Mobile inline player column hidden
  - Recent all-delete button appears and works
  - Recent per-station delete button appears and works
  - Favorites all-delete button appears and works
- `npm.cmd run android:debug`: PASS
- `npm.cmd run android:bundle`: PASS
- `npm.cmd run ios:sync`: PASS
- Android debug APK: `release/global-radio-android-2026-07-09-r6/jigu-radio-debug-install-r6.apk`
- Android release AAB: `release/global-radio-android-2026-07-09-r6/jigu-radio-playstore-unsigned-r6.aab`
- Shared ZIP: `release/global-radio-android-2026-07-09-r6.zip`
- ZIP SHA-256: `612FBD884E0C5B82F963C910C235C1129EC5419892DEA3DE29F7417FCC75E905`

## Not Done On This Windows Machine

- iOS `.ipa` archive and App Store signing. This requires macOS with Xcode 26+ for Capacitor 8.
- Android Play signing key configuration. The generated AAB still needs the real release signing setup before store upload.
