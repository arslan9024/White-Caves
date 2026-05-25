# loop-start-sync.ps1 -- Sync working branch with origin/main at loop start
# Creates stash snapshot metadata and supports optional wave feature branch creation.

param(
  [string]$WorkspaceRoot = ".",
  [string]$WaveBranch = "",
  [string]$Wave = ""
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
$logsDir = Join-Path $root "logs\orchestrator"
$snapshotFile = Join-Path $logsDir "loop-snapshots.json"
$w = 72

if (-not (Test-Path $logsDir)) {
  New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

Push-Location $root

function Write-Card([string]$title, [string]$color = "Cyan") {
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor $color
  Write-Host ("  {0}" -f $title) -ForegroundColor $color
  Write-Host ("=" * $w) -ForegroundColor $color
}

function Append-Snapshot([hashtable]$entry) {
  $all = @()
  if (Test-Path $snapshotFile) {
    try {
      $existing = Get-Content $snapshotFile -Raw | ConvertFrom-Json
      if ($existing -is [System.Collections.IEnumerable]) { $all = @($existing) }
      elseif ($null -ne $existing) { $all = @($existing) }
    } catch {
      $all = @()
    }
  }
  $all += [pscustomobject]$entry
  $json = $all | ConvertTo-Json -Depth 8
  [System.IO.File]::WriteAllText($snapshotFile, $json, (New-Object System.Text.UTF8Encoding($false)))
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$snapshotTag = "aegis-loop-$timestamp"
$currentBranch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()

Write-Card "LOOP START SYNC -- FETCH/MAIN MERGE" "Magenta"
Write-Host ("  Current branch: {0}" -f $currentBranch) -ForegroundColor White

# Snapshot stash for rollback support
$hasChanges = $false
$porcelain = @(git status --porcelain 2>$null)
if ($porcelain.Count -gt 0) {
  $hasChanges = $true
  Write-Host "  Creating stash snapshot..." -ForegroundColor Cyan
  git stash push -u -m $snapshotTag 2>&1 | Out-Host
}

$stashRef = ""
if ($hasChanges) {
  $firstStash = (git stash list 2>$null | Select-Object -First 1)
  if ($firstStash -match "^(stash@\{\d+\})") { $stashRef = $Matches[1] }
}

Append-Snapshot @{ 
  timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
  snapshotTag = $snapshotTag
  stashRef = $stashRef
  branchBeforeSync = $currentBranch
  hadUncommittedChanges = $hasChanges
}

Write-Host "  Fetching origin/main..." -ForegroundColor Cyan
git fetch origin main 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
  Write-Host "  [BLOCKED] Could not fetch origin/main" -ForegroundColor Red
  Pop-Location
  exit 1
}

$targetWave = if (-not [string]::IsNullOrWhiteSpace($WaveBranch)) { $WaveBranch } else { $Wave }
$createdFeatureBranch = ""

if (-not [string]::IsNullOrWhiteSpace($targetWave)) {
  $normalized = $targetWave.Trim()
  if ($normalized -notmatch "^feature/") { $normalized = "feature/$normalized" }
  $createdFeatureBranch = $normalized

  Write-Host ("  Creating/updating wave branch: {0}" -f $createdFeatureBranch) -ForegroundColor Cyan
  git checkout -B main origin/main 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) {
    Write-Host "  [BLOCKED] Could not reset local main to origin/main" -ForegroundColor Red
    Pop-Location
    exit 1
  }

  git checkout -B $createdFeatureBranch main 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) {
    Write-Host ("  [BLOCKED] Could not create branch {0}" -f $createdFeatureBranch) -ForegroundColor Red
    Pop-Location
    exit 1
  }
} else {
  Write-Host "  Merging origin/main into current branch..." -ForegroundColor Cyan
  git merge origin/main --no-edit 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) {
    $conflicts = @(git diff --name-only --diff-filter=U 2>$null)
    if ($conflicts.Count -gt 0) {
      Write-Host "  [BLOCKED] Merge conflicts detected:" -ForegroundColor Red
      foreach ($c in $conflicts) { Write-Host ("    - {0}" -f $c) -ForegroundColor Red }
      Write-Host "  Resolve conflicts before continuing loop." -ForegroundColor Red
      Pop-Location
      exit 1
    }
    Write-Host "  [BLOCKED] Merge failed for unknown reason." -ForegroundColor Red
    Pop-Location
    exit 1
  }
}

if ($hasChanges -and -not [string]::IsNullOrWhiteSpace($stashRef)) {
  Write-Host ("  Restoring stashed changes from {0}..." -f $stashRef) -ForegroundColor Cyan
  git stash pop $stashRef 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) {
    $conflicts = @(git diff --name-only --diff-filter=U 2>$null)
    if ($conflicts.Count -gt 0) {
      Write-Host "  [BLOCKED] Stash pop conflicts detected:" -ForegroundColor Red
      foreach ($c in $conflicts) { Write-Host ("    - {0}" -f $c) -ForegroundColor Red }
      Pop-Location
      exit 1
    }
  }
}

$currentAfter = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
$ahead = (git rev-list --count HEAD..origin/main 2>$null).Trim()
$behind = (git rev-list --count origin/main..HEAD 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($ahead)) { $ahead = "0" }
if ([string]::IsNullOrWhiteSpace($behind)) { $behind = "0" }

Write-Card "SYNC COMPLETE" "Green"
Write-Host ("  Branch      : {0}" -f $currentAfter) -ForegroundColor White
Write-Host ("  Main delta  : +{0} behind / +{1} ahead" -f $ahead, $behind) -ForegroundColor White
if (-not [string]::IsNullOrWhiteSpace($createdFeatureBranch)) {
  Write-Host ("  Wave branch : {0}" -f $createdFeatureBranch) -ForegroundColor Green
}

Pop-Location
exit 0
