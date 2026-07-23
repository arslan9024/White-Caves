param(
  [string]$SourceBranch,
  [string]$TargetBranch = "develop",
  [switch]$RunChecks,
  [switch]$Brief
)

$ErrorActionPreference = "Stop"

function Write-Section {
  param([string]$Title)
  if (-not $Brief) {
    Write-Host ""
    Write-Host ("=" * 72) -ForegroundColor Cyan
    Write-Host ("  {0}" -f $Title) -ForegroundColor Cyan
    Write-Host ("=" * 72) -ForegroundColor Cyan
  }
}

function Run-Git {
  param([string[]]$Args)
  $out = & git @Args 2>&1
  $code = $LASTEXITCODE
  [pscustomobject]@{
    ExitCode = $code
    Output = ($out -join "`n").Trim()
  }
}

Write-Section "Aegis PR/MR Handoff"

$fetch = Run-Git @("fetch", "--all", "--prune")
if ($fetch.ExitCode -ne 0) {
  throw "git fetch failed: $($fetch.Output)"
}

$currentBranchResult = Run-Git @("branch", "--show-current")
if ($currentBranchResult.ExitCode -ne 0 -or [string]::IsNullOrWhiteSpace($currentBranchResult.Output)) {
  throw "Unable to determine current branch."
}

$currentBranch = $currentBranchResult.Output.Trim()
if ([string]::IsNullOrWhiteSpace($SourceBranch)) {
  $SourceBranch = $currentBranch
}

if ($SourceBranch -eq $TargetBranch) {
  throw "Source and target branch are the same ('$SourceBranch'). Choose different branches for PR/MR."
}

$statusResult = Run-Git @("status", "--porcelain=v1")
if ($statusResult.ExitCode -ne 0) {
  throw "git status failed: $($statusResult.Output)"
}

$isDirty = -not [string]::IsNullOrWhiteSpace($statusResult.Output)

$targetRefCheck = Run-Git @("show-ref", "--verify", "--quiet", ("refs/remotes/origin/{0}" -f $TargetBranch))
$targetExists = ($targetRefCheck.ExitCode -eq 0)

$sourceRefCheck = Run-Git @("show-ref", "--verify", "--quiet", ("refs/heads/{0}" -f $SourceBranch))
$sourceExistsLocal = ($sourceRefCheck.ExitCode -eq 0)

$aheadBehind = "unknown"
$canComputeAheadBehind = $false
if ($targetExists -and $sourceExistsLocal) {
  $aheadBehindResult = Run-Git @("rev-list", "--left-right", "--count", ("origin/{0}...{1}" -f $TargetBranch, $SourceBranch))
  if ($aheadBehindResult.ExitCode -eq 0 -and -not [string]::IsNullOrWhiteSpace($aheadBehindResult.Output)) {
    $aheadBehind = $aheadBehindResult.Output.Trim()
    $canComputeAheadBehind = $true
  }
}

$checkSummary = @()
$checkSummary += [pscustomobject]@{ Item = "Refs synced (fetch --all --prune)"; Status = "OK"; Detail = "Completed" }
$checkSummary += [pscustomobject]@{ Item = "Source branch resolved"; Status = (if ($sourceExistsLocal) { "OK" } else { "WARN" }); Detail = $SourceBranch }
$checkSummary += [pscustomobject]@{ Item = "Target branch exists on origin"; Status = (if ($targetExists) { "OK" } else { "WARN" }); Detail = ("origin/{0}" -f $TargetBranch) }
$checkSummary += [pscustomobject]@{ Item = "Working tree clean"; Status = (if (-not $isDirty) { "OK" } else { "WARN" }); Detail = (if ($isDirty) { "Uncommitted changes detected" } else { "Clean" }) }
$checkSummary += [pscustomobject]@{ Item = "Ahead/behind vs target"; Status = (if ($canComputeAheadBehind) { "OK" } else { "INFO" }); Detail = $aheadBehind }

if ($Brief) {
  foreach ($row in $checkSummary) {
    Write-Host ("- [{0}] {1}: {2}" -f $row.Status, $row.Item, $row.Detail)
  }
} else {
  foreach ($row in $checkSummary) {
    $color = switch ($row.Status) {
      "OK" { "Green" }
      "WARN" { "Yellow" }
      "INFO" { "DarkGray" }
      default { "White" }
    }
    Write-Host ("[{0}] {1}" -f $row.Status, $row.Item) -ForegroundColor $color
    Write-Host ("      {0}" -f $row.Detail) -ForegroundColor DarkGray
  }
}

Write-Section "Recommended PR/MR Flow"

$flowSteps = @(
  "1) Sync local refs (already done by this command)",
  "2) Confirm source branch: $SourceBranch",
  "3) Open PR/MR: $SourceBranch -> $TargetBranch",
  "4) Add clear title, summary, and checklist",
  "5) Run required checks (typecheck/lint/build/tests)",
  "6) Merge using team strategy (squash/rebase/merge commit)",
  "7) Delete source branch after merge (optional, recommended)"
)

foreach ($step in $flowSteps) {
  Write-Host $step
}

Write-Section "Copyable Commands"

$commands = @(
  "git fetch --all --prune",
  ("git checkout {0}" -f $SourceBranch),
  "git status -sb",
  "npm.cmd run quality:quick",
  "npm.cmd run test:run",
  ("git push -u origin {0}" -f $SourceBranch),
  ("gh pr create --base {0} --head {1} --fill" -f $TargetBranch, $SourceBranch),
  ("gh pr merge --auto --squash --delete-branch"),
  ("git checkout {0}" -f $TargetBranch),
  ("git pull origin {0}" -f $TargetBranch)
)

foreach ($cmd in $commands) {
  Write-Host $cmd -ForegroundColor DarkCyan
}

if ($RunChecks) {
  Write-Section "Running Required Checks"

  $checks = @(
    @{ Name = "typecheck"; Args = @("cmd", "/c", "npm.cmd run typecheck") },
    @{ Name = "lint"; Args = @("cmd", "/c", "npm.cmd run lint") },
    @{ Name = "build"; Args = @("cmd", "/c", "npm.cmd run build") }
  )

  foreach ($check in $checks) {
    Write-Host ("Running {0}..." -f $check.Name) -ForegroundColor Cyan
    & $check.Args[0] $check.Args[1] $check.Args[2]
    if ($LASTEXITCODE -ne 0) {
      throw ("Check failed: {0}" -f $check.Name)
    }
    Write-Host ("{0} passed." -f $check.Name) -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "Aegis PR/MR handoff checklist complete." -ForegroundColor Green
