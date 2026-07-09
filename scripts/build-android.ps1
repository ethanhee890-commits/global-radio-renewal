param(
  [ValidateSet('assembleDebug', 'bundleRelease')]
  [string]$Task = 'assembleDebug'
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$defaultJavaHome = 'D:\Program Files\Android\Android Studio\jbr'
$defaultAndroidHome = 'D:\Projects\CodexProjects\_global-sdk\Android\Sdk'

if (-not $env:JAVA_HOME -and (Test-Path (Join-Path $defaultJavaHome 'bin\java.exe'))) {
  $env:JAVA_HOME = $defaultJavaHome
}

if (-not $env:ANDROID_HOME -and (Test-Path $defaultAndroidHome)) {
  $env:ANDROID_HOME = $defaultAndroidHome
}

if (-not $env:ANDROID_SDK_ROOT -and $env:ANDROID_HOME) {
  $env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
}

if ($env:JAVA_HOME) {
  $javaBin = Join-Path $env:JAVA_HOME 'bin'
  $env:Path = "$javaBin;$env:Path"
}

Push-Location $root
try {
  npm.cmd run android:sync
  & (Join-Path $root 'android\gradlew.bat') -p (Join-Path $root 'android') $Task
} finally {
  Pop-Location
}
