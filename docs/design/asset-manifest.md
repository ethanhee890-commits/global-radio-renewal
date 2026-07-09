---
type: project-doc
project: "GlobalRadioPWA"
status: draft
owner: Jenny
source: chatgpt
last_updated: "2026-07-08"
tags:
  - llm-wiki
  - asset-manifest
  - design
  - codex
---

# Asset Manifest — 지구라디오

## 1. Asset Policy

Dex는 이 문서에 명시된 자산만 사용합니다. 명시되지 않은 이미지, 아이콘, 로고, 장식 SVG를 임의로 만들거나 고르지 않습니다.

## 2. Fonts

| Asset type | Name | Source URL | License URL | Usage location | Implementation method | Local path | Alt text | Fallback | Forbidden usage |
|---|---|---|---|---|---|---|---|---|---|
| font | Pretendard | https://github.com/orioncactus/pretendard | https://github.com/orioncactus/pretendard/blob/main/LICENSE | 전체 UI | npm 또는 CDN, 기존 repo 기준 우선 | none | N/A | system-ui | 폰트 파일 임의 포함 금지 |

## 3. Icons

| Asset type | Name | Source URL | License URL | Usage location | Implementation method | Local path | Alt text | Fallback | Forbidden usage |
|---|---|---|---|---|---|---|---|---|---|
| icon | Lucide | https://lucide.dev/ | https://lucide.dev/license | 검색, 재생, 정지, 즐겨찾기, 품질 배지 보조 | lucide-react 또는 inline package | none | aria-label로 제공 | 텍스트 라벨 | 다른 아이콘 라이브러리 혼용 금지 |

### Icon Rules

- 아이콘 라이브러리는 Lucide 하나만 사용합니다.
- 아이콘만으로 의미를 전달하지 않습니다.
- 버튼에는 텍스트 라벨을 함께 둡니다.
- 이모지를 아이콘으로 쓰지 않습니다.

## 4. Illustrations

P0에서는 일러스트를 사용하지 않습니다. Empty state는 Lucide 아이콘 + 텍스트로 처리합니다.

## 5. Photos

P0에서는 사진을 사용하지 않습니다. 국가/방송국 로고는 Radio Browser station favicon이 있을 때만 표시하고, 실패 시 텍스트 fallback을 사용합니다.

## 6. Local Asset Paths

```text
public/icons/app-icon.svg       # Dex가 직접 새로 그리지 말고 단순 텍스트/기하 형태만 사용
public/icons/maskable-icon.svg  # PWA manifest용 단색 기반
```

## 7. Alt Text

| 대상 | Alt text |
|---|---|
| station favicon 있음 | `{station.name} 방송국 로고` |
| station favicon 없음 | 이미지 미표시, 텍스트 fallback |
| YouTube iframe | `{station.name} YouTube 대체 플레이어` |

## 8. Fallback Rules

1. station favicon 실패 → 이니셜 원형 avatar
2. 아이콘 로딩 실패 → 텍스트 버튼 유지
3. YouTube thumbnail 실패 → player 영역에 텍스트 안내
4. 필요한 자산이 없으면 Blocked가 아니라 텍스트 전용 UI로 대체

## 9. Forbidden Asset Usage

- 방송국 로고를 임의 제작 금지
- YouTube 로고를 임의 변형 금지
- 브랜드 로고가 포함된 stock photo 사용 금지
- 실제 방송국 제휴처럼 보이는 badge 사용 금지
- “HD 인증” 같은 근거 없는 그래픽 사용 금지
