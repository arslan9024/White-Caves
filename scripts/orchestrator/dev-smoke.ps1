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

function Invoke-LocalToolVersion {
  param(
    [string]$ToolName
  )

  function Format-CommandOutput {
    param([object[]]$Lines)
    if ($null -eq $Lines) { return "" }
    return (($Lines | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
  }

  $candidates = @(
    ".\\node_modules\\.bin\\$ToolName.cmd",
    ".\\node_modules\\.bin\\$ToolName"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      $rawOutput = & $candidate --version 2>&1
      $output = Format-CommandOutput -Lines $rawOutput
      return @{
        Ok = ($LASTEXITCODE -eq 0)
        Output = $output
        Source = "local-bin"
      }
    }
  }

  $fallbackRawOutput = & cmd /c "npm exec -- $ToolName --version" 2>&1
  $fallbackOutput = Format-CommandOutput -Lines $fallbackRawOutput
  return @{
    Ok = ($LASTEXITCODE -eq 0)
    Output = $fallbackOutput
    Source = "npm-exec"
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
$tools = @("concurrently", "nodemon", "tsx")

foreach ($name in $tools) {
  $probe = Invoke-LocalToolVersion -ToolName $name
  if ($probe.Ok) {
    $line = ($probe.Output -split "`r?`n" | Select-Object -First 1)
    Write-Result -Label "$name available" -Ok $true -Detail $line
  } else {
    $detail = if ($probe.Source -eq "local-bin") {
      "local node_modules binary failed"
    } else {
      "not available (npm exec fallback failed)"
    }
    if (-not [string]::IsNullOrWhiteSpace($probe.Output)) {
      $firstLine = ($probe.Output -split "`r?`n" | Select-Object -First 1)
      $detail = "${detail}: $firstLine"
    }
    Write-Result -Label "$name available" -Ok $false -Detail $detail
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
