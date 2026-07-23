# loop-start-sync.ps1 -- Sync working branch with integration branch at loop start
# Creates stash snapshot metadata and supports optional wave feature branch creation.

param(
  [string]$WorkspaceRoot = ".",
  [switch]$WaveBranch,
  [string]$Wave = ""
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
$logsDir = Join-Path $root "logs\orchestrator"
$snapshotFile = Join-Path $logsDir "loop-snapshots.json"
$policyUtils = Join-Path $root "scripts\orchestrator\policy-utils.ps1"
$w = 72

if (-not (Test-Path $logsDir)) {
  New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

Push-Location $root

if (Test-Path $policyUtils) {
  . $policyUtils
}

function Resolve-IntegrationBranch {
  param(
    [string]$Remote,
    [string]$PreferredBranch,
    [string[]]$FallbackBranches
  )

  $candidates = @($PreferredBranch) + @($FallbackBranches)
  foreach ($candidate in $candidates) {
    if ([string]::IsNullOrWhiteSpace($candidate)) { continue }
    git ls-remote --exit-code --heads $Remote $candidate *> $null
    if ($LASTEXITCODE -eq 0) {
      return $candidate
    }
  }

  return $PreferredBranch
}

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
$beforeSha = (git rev-parse HEAD 2>$null).Trim()

$policy = $null
$gitPolicy = $null
if (Get-Command Get-OrchestratorPolicy -ErrorAction SilentlyContinue) {
  try {
    $policy = Get-OrchestratorPolicy -WorkspaceRoot $root
    $gitPolicy = Get-OrchestratorGitPolicy -Policy $policy
  } catch {}
}

$remoteName = if ($null -ne $gitPolicy) { [string]$gitPolicy.defaultRemote } else { "origin" }
$preferredIntegrationBranch = if ($null -ne $gitPolicy) { [string]$gitPolicy.integrationBranch } else { "develop" }
$fallbackIntegrationBranches = if ($null -ne $gitPolicy) { @($gitPolicy.integrationFallbackBranches) } else { @("development", "main") }
$integrationBranch = Resolve-IntegrationBranch -Remote $remoteName -PreferredBranch $preferredIntegrationBranch -FallbackBranches $fallbackIntegrationBranches

Write-Card ("LOOP START SYNC -- FETCH/{0} MERGE" -f $integrationBranch) "Magenta"
Write-Host ("  Current branch: {0}" -f $currentBranch) -ForegroundColor White

# SDLC Branch-Awareness Enforcement
if ($currentBranch -notin @("main", "develop", "master")) {
    Write-Host "[SDLC] FEATURE BRANCH DETECTED. AEGIS agents are constrained to feature-scope boundaries." -ForegroundColor Cyan
    Write-Host "[SDLC] Strict isolation enabled. Ensure no generic main-branch code is generated." -ForegroundColor Cyan
}

if ($integrationBranch -ne $preferredIntegrationBranch) {
  Write-Host ("  Integration fallback selected: {0} (preferred: {1})" -f $integrationBranch, $preferredIntegrationBranch) -ForegroundColor Yellow
}

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

Write-Host ("  Fetching {0}/{1}..." -f $remoteName, $integrationBranch) -ForegroundColor Cyan
git fetch $remoteName $integrationBranch 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
  Write-Host ("  [BLOCKED] Could not fetch {0}/{1}" -f $remoteName, $integrationBranch) -ForegroundColor Red
  Pop-Location
  exit 1
}

$targetWave = if ($WaveBranch) { $Wave } else { "" }
$createdFeatureBranch = ""

if (-not [string]::IsNullOrWhiteSpace($targetWave)) {
  $normalized = $targetWave.Trim()
  if ($normalized -notmatch "^feature/") { $normalized = "feature/$normalized" }
  $createdFeatureBranch = $normalized

  Write-Host ("  Creating/updating wave branch: {0}" -f $createdFeatureBranch) -ForegroundColor Cyan
  git checkout -B $integrationBranch "$remoteName/$integrationBranch" 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) {
    Write-Host ("  [BLOCKED] Could not reset local {0} to {1}/{0}" -f $integrationBranch, $remoteName) -ForegroundColor Red
    Pop-Location
    exit 1
  }

  git checkout -B $createdFeatureBranch $integrationBranch 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) {
    Write-Host ("  [BLOCKED] Could not create branch {0}" -f $createdFeatureBranch) -ForegroundColor Red
    Pop-Location
    exit 1
  }
} else {
  if ($WaveBranch -and [string]::IsNullOrWhiteSpace($Wave)) {
    Write-Host "  [BLOCKED] -WaveBranch provided but -Wave value is missing (example: -Wave 12)." -ForegroundColor Red
    Pop-Location
    exit 1
  }
  Write-Host ("  Merging {0}/{1} into current branch..." -f $remoteName, $integrationBranch) -ForegroundColor Cyan
  git merge "$remoteName/$integrationBranch" --no-edit 2>&1 | Out-Host
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
$ahead = (git rev-list --count "HEAD..$remoteName/$integrationBranch" 2>$null).Trim()
$behind = (git rev-list --count "$remoteName/$integrationBranch..HEAD" 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($ahead)) { $ahead = "0" }
if ([string]::IsNullOrWhiteSpace($behind)) { $behind = "0" }

Write-Card "SYNC COMPLETE" "Green"
Write-Host ("  Branch      : {0}" -f $currentAfter) -ForegroundColor White
Write-Host ("  {0} delta : +{1} behind / +{2} ahead" -f $integrationBranch, $ahead, $behind) -ForegroundColor White
if (-not [string]::IsNullOrWhiteSpace($beforeSha)) {
  $changedFromMain = @(git diff --name-only $beforeSha..HEAD 2>$null)
  if ($changedFromMain.Count -gt 0) {
    Write-Host "  Changed from main sync:" -ForegroundColor White
    foreach ($f in ($changedFromMain | Select-Object -First 20)) {
      Write-Host ("    - {0}" -f $f) -ForegroundColor DarkGray
    }
    if ($changedFromMain.Count -gt 20) {
      Write-Host ("    ... and {0} more" -f ($changedFromMain.Count - 20)) -ForegroundColor DarkGray
    }
  } else {
    Write-Host "  Changed from main sync: none" -ForegroundColor DarkGray
  }
}
if (-not [string]::IsNullOrWhiteSpace($createdFeatureBranch)) {
  Write-Host ("  Wave branch : {0}" -f $createdFeatureBranch) -ForegroundColor Green
}

Pop-Location
exit 0
