param(
  [string]$WorkspaceRoot = ".",
  [int]$MaxRunMinutes = 2,
  [switch]$RunProblemScan,
  [switch]$Brief
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
Set-Location $root

$stateDir = Join-Path $root "logs\orchestrator"
New-Item -ItemType Directory -Path $stateDir -Force | Out-Null

$timestamp = (Get-Date).ToString("yyyyMMdd-HHmmss")
$stdoutLog = Join-Path $stateDir ("dev-runtime-check-{0}.out.log" -f $timestamp)
$stderrLog = Join-Path $stateDir ("dev-runtime-check-{0}.err.log" -f $timestamp)
$summaryLog = Join-Path $stateDir "dev-runtime-check.log"
$problemScanScript = Join-Path $root "scripts\orchestrator\project-problem-scan.ps1"

$maxMinutes = if ($MaxRunMinutes -lt 1) { 1 } elseif ($MaxRunMinutes -gt 15) { 15 } else { $MaxRunMinutes }

$result = [ordered]@{
  generatedAt = (Get-Date).ToString("o")
  workspaceRoot = [string]$root
  maxRunMinutes = $maxMinutes
  runProblemScan = [bool]$RunProblemScan
  status = "ok"
  blockers = @()
  warnings = @()
  actions = @()
}

$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if ($null -eq $npmCmd) {
  $result.status = "blocked"
  $result.blockers += "npm command not found"
  $payload = ($result | ConvertTo-Json -Depth 10)
  if ($Brief) { Write-Output $payload } else { Write-Host $payload }
  Add-Content -Path $summaryLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)
  exit 1
}

$devProc = $null
$devRunning = $false
$devExitCode = $null

try {
  $devProc = Start-Process -FilePath "cmd.exe" -ArgumentList @("/c", "npm run dev") -PassThru -RedirectStandardOutput $stdoutLog -RedirectStandardError $stderrLog -WindowStyle Hidden
  $waitSeconds = [Math]::Max(60, ($maxMinutes * 60))

  try {
    Wait-Process -Id $devProc.Id -Timeout $waitSeconds -ErrorAction Stop
    $devRunning = $false
    $devExitCode = $devProc.ExitCode
  } catch {
    $devRunning = $true
  }

  if ($devRunning) {
    $result.actions += [pscustomobject]@{
      step = "npm run dev"
      purpose = "Timed runtime startup check"
      ok = $true
      detail = ("Process stayed alive for {0} minute(s); startup considered healthy." -f $maxMinutes)
      pid = $devProc.Id
    }
  } else {
    $stdOutPreview = ""
    $stdErrPreview = ""
    if (Test-Path $stdoutLog) {
      $stdOutPreview = ((Get-Content $stdoutLog -ErrorAction SilentlyContinue | Select-Object -Last 20) -join [Environment]::NewLine).Trim()
    }
    if (Test-Path $stderrLog) {
      $stdErrPreview = ((Get-Content $stderrLog -ErrorAction SilentlyContinue | Select-Object -Last 20) -join [Environment]::NewLine).Trim()
    }

    $result.actions += [pscustomobject]@{
      step = "npm run dev"
      purpose = "Timed runtime startup check"
      ok = ($devExitCode -eq 0)
      detail = ("Process exited before timeout with code {0}." -f $devExitCode)
      stdoutPreview = $stdOutPreview
      stderrPreview = $stdErrPreview
    }

    if ($devExitCode -ne 0) {
      $result.blockers += ("npm run dev exited early with code {0}" -f $devExitCode)
    }
  }
}
catch {
  $result.status = "issues_found"
  $result.blockers += ("Failed to execute npm run dev: {0}" -f $_.Exception.Message)
}
finally {
  if ($null -ne $devProc) {
    try {
      if (-not $devProc.HasExited) {
        & cmd.exe /c "taskkill /PID $($devProc.Id) /T /F >nul 2>nul"
      }
    } catch {}
  }
}

if ($RunProblemScan -and (Test-Path $problemScanScript)) {
  $scanOut = & powershell -ExecutionPolicy Bypass -File "$problemScanScript" -WorkspaceRoot "$root" -AutoFix -Brief 2>&1
  $scanText = (($scanOut | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
  $scanOk = ($LASTEXITCODE -eq 0)

  $result.actions += [pscustomobject]@{
    step = "project-problem-scan"
    purpose = "Auto-fix scan after timed npm run dev"
    ok = $scanOk
    firstLine = if ([string]::IsNullOrWhiteSpace($scanText)) { "" } else { ($scanText -split "`r?`n" | Select-Object -First 1) }
    output = $scanText
  }

  if (-not $scanOk) {
    $result.warnings += "project-problem-scan detected issues after timed dev check"
  }
}

if ($result.blockers.Count -gt 0) {
  $result.status = "issues_found"
} elseif ($result.warnings.Count -gt 0) {
  $result.status = "ok_with_warnings"
}

$payload = ($result | ConvertTo-Json -Depth 12)
if ($Brief) {
  Write-Output $payload
} else {
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "  AEGIS TIMED DEV RUNTIME CHECK" -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host $payload
}

Add-Content -Path $summaryLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)

if ($result.status -eq "issues_found" -or $result.status -eq "blocked") {
  exit 1
}

exit 0
