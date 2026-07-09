$node = (Get-Command node -ErrorAction SilentlyContinue).Source

if (-not $node) {
  $node = Join-Path $env:LOCALAPPDATA 'OpenAI\Codex\bin\node.exe'
}

if (-not (Test-Path -LiteralPath $node)) {
  Write-Error 'Node.js executable was not found. Install Node.js or run this inside Codex Desktop.'
  exit 1
}

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location -LiteralPath $root

function Invoke-NodeTool {
  param(
    [string]$Name,
    [string[]]$Arguments
  )

  Write-Host "==> $Name"
  & $node @Arguments

  if ($LASTEXITCODE -ne 0) {
    Write-Error "$Name failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
  }
}

Invoke-NodeTool -Name 'lint' -Arguments @('.\node_modules\eslint\bin\eslint.js', '.', '--max-warnings=0')
Invoke-NodeTool -Name 'typecheck' -Arguments @('.\node_modules\typescript\bin\tsc', '--noEmit')
Invoke-NodeTool -Name 'test' -Arguments @('.\node_modules\vitest\vitest.mjs', 'run')
Invoke-NodeTool -Name 'build:typecheck' -Arguments @('.\node_modules\typescript\bin\tsc', '--noEmit')
Invoke-NodeTool -Name 'build' -Arguments @('.\node_modules\vite\bin\vite.js', 'build')
Invoke-NodeTool -Name 'security:scan' -Arguments @('.\scripts\security-scan.cjs')

Write-Host 'All verification checks passed.'
