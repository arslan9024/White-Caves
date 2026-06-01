param(
  [string]$WorkspaceRoot = "."
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
Set-Location $root

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  WHITE CAVES DEV SMOKE CHECK" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$hasError = $false

function Write-Result {
  param(
    [string]$Label,
    [bool]$Ok,
    [string]$Detail
  )

  $icon = if ($Ok) { "[OK]" } else { "[XX]" }
  $color = if ($Ok) { "Green" } else { "Red" }
  Write-Host ("  {0} {1}" -f $icon, $Label) -ForegroundColor $color
  if (-not [string]::IsNullOrWhiteSpace($Detail)) {
    Write-Host ("       {0}" -f $Detail) -ForegroundColor DarkGray
  }
}

# 1) Node version gate for current toolchain
$nodeVerRaw = (& node -v 2>$null)
if ([string]::IsNullOrWhiteSpace($nodeVerRaw)) {
  Write-Result -Label "Node runtime" -Ok $false -Detail "node command not found"
  $hasError = $true
} else {
  $nodeVer = $nodeVerRaw.TrimStart('v')
  $parts = $nodeVer.Split('.')
  $major = if ($parts.Length -gt 0) { [int]$parts[0] } else { 0 }
  $minor = if ($parts.Length -gt 1) { [int]$parts[1] } else { 0 }

  $nodeOk = ($major -gt 20) -or ($major -eq 20 -and $minor -ge 19)
  if ($nodeOk) {
    Write-Result -Label "Node runtime" -Ok $true -Detail "v$nodeVer (meets Vite 7 requirement: >=20.19 or >=22.12)"
  } else {
    Write-Result -Label "Node runtime" -Ok $false -Detail "v$nodeVer detected; upgrade to >=20.19 or >=22.12 for Vite 7"
    $hasError = $true
  }
}

# 2) Dev toolchain binaries
$tools = @(
  @{ Name = "concurrently"; Cmd = "npx concurrently --version" },
  @{ Name = "nodemon";      Cmd = "npx nodemon --version" },
  @{ Name = "tsx";          Cmd = "npx tsx --version" }
)

foreach ($t in $tools) {
  $name = [string]$t.Name
  $cmd = [string]$t.Cmd
  $output = (& cmd /c $cmd 2>&1 | Out-String).Trim()
  if ($LASTEXITCODE -eq 0) {
    $line = ($output -split "`r?`n" | Select-Object -First 1)
    Write-Result -Label "$name available" -Ok $true -Detail $line
  } else {
    Write-Result -Label "$name available" -Ok $false -Detail "not available via npx"
    $hasError = $true
  }
}

Write-Host ""
if ($hasError) {
  Write-Host "  DEV SMOKE RESULT: FAIL (fix the items above before full npm run dev)" -ForegroundColor Red
  exit 1
}

Write-Host "  DEV SMOKE RESULT: PASS (safe to run npm run dev)" -ForegroundColor Green
Write-Host ""
exit 0
