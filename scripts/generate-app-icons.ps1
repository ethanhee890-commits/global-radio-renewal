param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

Push-Location $Root
try {
  node (Join-Path $Root 'scripts/generate-jiguradio-final-assets.cjs')
}
finally {
  Pop-Location
}
