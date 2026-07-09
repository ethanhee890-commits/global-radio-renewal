# 지구라디오 최종 앱 아이콘 / 스플래쉬

이 패키지는 제니가 만든 확정 이미지 원본을 그대로 기준으로 사용합니다. 새 콘셉트 재창작, 벡터 재해석, AI 재생성은 하지 않습니다.

## 원본 소스

- 앱 아이콘 원본: `source/jenny-app-icon.png`
- 앱 아이콘 투명 배경 처리본: `source/jenny-app-icon-clean-transparent.png`
- 앱 아이콘 차콜 배경 처리본: `source/jenny-app-icon-clean-solid.png`
- 기존 정사각형 스플래쉬 원본: `source/jenny-splash.png`
- Android 스플래쉬 원본: `source/jenny-splash-aos.png`
- iOS 스플래쉬 원본: `source/jenny-splash-ios.png`

## 생성 원칙

- 원본 이미지를 다시 그리지 않습니다.
- 색상, 질감, 비율, 모티프를 수정하지 않습니다.
- 필요한 플랫폼 크기만 PNG로 리사이즈합니다.
- SVG 파일은 새 그림이 아니라 원본 PNG를 참조하는 래퍼입니다.
- 헤더/웹 아이콘은 원본의 바깥 흰 캔버스만 제거한 투명 PNG를 사용합니다.

## 주요 파일

- `app-icon/jiguradio-icon-1024.png`
- `app-icon/jiguradio-icon-512.png`
- `app-icon/jiguradio-icon-192.png`
- `ios/AppIcon-1024.png`
- `android/png/mipmap-*/ic_launcher.png`
- `splash/jiguradio-splash-2732.png`
- `splash/jiguradio-splash-aos.png`
- `splash/jiguradio-splash-ios.png`
- `splash/jiguradio-splash-aos-preview.png`
- `splash/jiguradio-splash-ios-preview.png`
- `splash/jiguradio-splash-preview-1024.png`
- `preview/jiguradio-final-preview.png`

## 앱 적용 위치

생성 스크립트는 아래 실제 앱 경로까지 동기화합니다.

- PWA: `public-radio/icons/app-icon.png`, `public-radio/icons/app-icon-192.png`, `public-radio/icons/app-icon-512.png`
- legacy public: `public/icons/*`
- Android: `android/app/src/main/res/mipmap-*`, `android/app/src/main/res/drawable*/splash.png`
- iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset`, `ios/App/App/Assets.xcassets/Splash.imageset`
- 공용: `assets/icon-only.png`, `assets/splash.png`, `assets/splash-dark.png`, `assets/splash-preview.png`

## 재생성

```bash
npm run assets:brand
```

또는 기존 패키징 흐름에서 쓰던 명령도 같은 생성기로 연결됩니다.

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/generate-app-icons.ps1
```

## 주의

- `source/jenny-app-icon.png`와 `source/jenny-splash.png`를 교체하지 않으면 디자인은 바뀌지 않습니다.
- Android/iOS 스플래쉬를 교체하려면 각각 `source/jenny-splash-aos.png`, `source/jenny-splash-ios.png`를 교체합니다.
- 아이콘을 더 좋게 만들기 위해 임의로 선, 색, 글로우, 지도, 문구를 추가하지 않습니다.
- 스플래쉬에 별도 텍스트를 얹지 않습니다. 현재는 제니 스플래쉬 이미지 원본 그대로 사용합니다.
