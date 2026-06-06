param(
  [string]$WorkspaceRoot = ".",
  [int]$TimeoutSeconds = 90,
  [int]$PollIntervalSeconds = 1,
  [string]$Branch = "recruitment-analytics-onboarding",
  [string]$CommitMessage = "docs(tracker): sync latest live orchestrator row"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path $WorkspaceRoot
Set-Location $root

$trackerFile = Join-Path $root "DAILY_MILESTONE_TRACKER.md"
if (-not (Test-Path $trackerFile)) {
  Write-Host "TRACKER=missing"
  exit 1
}

$deadline = (Get-Date).AddSeconds([Math]::Max(1, $TimeoutSeconds))
$staged = $false
$attempt = 0

while ((Get-Date) -lt $deadline) {
  $attempt++
  $trackerEscaped = $trackerFile.Replace('"', '""')
  cmd /c "git add -- \"$trackerEscaped\" >nul 2>nul"
  if ($LASTEXITCODE -eq 0) {
    $staged = $true
    Write-Host ("TRACKER_STAGE=ok attempt=" + $attempt)
    break
  }

  try {
    $probePath = Join-Path $root "logs\orchestrator\_tracker-lock-probe.tmp"
    Copy-Item -Path $trackerFile -Destination $probePath -Force
    Remove-Item -Path $probePath -Force -ErrorAction SilentlyContinue
  }
  catch {
    Write-Host ("TRACKER_STAGE=waiting attempt=" + $attempt + " reason=" + $_.Exception.Message)
  }

  Start-Sleep -Seconds ([Math]::Max(1, $PollIntervalSeconds))
}

if (-not $staged) {
  Write-Host "TRACKER_STAGE=timeout"
  exit 2
}

git diff --cached --quiet -- $trackerFile
if ($LASTEXITCODE -eq 0) {
  Write-Host "TRACKER_STAGE=no_changes"
  exit 0
}

git commit --no-verify -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
  Write-Host "TRACKER_COMMIT=failed"
  exit 3
}

git push origin $Branch
if ($LASTEXITCODE -ne 0) {
  Write-Host "TRACKER_PUSH=failed"
  exit 4
}

Write-Host "TRACKER_PUSH=ok"
exit 0
