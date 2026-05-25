# session-end.ps1 -- One-command session closer for White Caves Orchestrator
# Counterpart to session-start.ps1.
# Chains: fast-complete -> gate-check -> progress-report -> error-scan -> git stage -> commit -> push
#
# Usage:
#   npm run orchestrator:session:end               -- full close (commit + push)
#   npm run orchestrator:session:end:dry           -- preview only, no git changes
#   powershell -File session-end.ps1 [-DryRun] [-SkipPush] [-SkipMainPush] [-Message "custom"]
#
# What it does:
#   STEP 1  Run fast-complete one final time (catch any last auto-completions)
#   STEP 2  Run gate-check   (print final PASS/BLOCKED counts)
#   STEP 3  Run progress-report (append final tracker row for today)
#   STEP 4  Git: show what changed this session (git diff --stat HEAD)
#   STEP 5  Git: stage orchestrator + business_docs + plans changes
#   STEP 6  Git: commit with auto-generated message
#   STEP 7  Git: push to origin development
#   STEP 8  Error-scan gate (must pass before merge/push to main)
#   STEP 9  Git: merge development -> main and push origin main (optional)
#   STEP 10 Print session summary card

param(
  [string]$WorkspaceRoot = ".",
  [switch]$DryRun,              # preview only -- skip git stage/commit/push
  [switch]$SkipPush,            # commit but do NOT push
  [switch]$SkipMainPush,        # skip development -> main merge/push
  [string]$Message = "",        # override auto-generated commit message
  [switch]$SkipAutoComplete     # skip final fast-complete pass
)

$ErrorActionPreference = "Continue"
$root     = Resolve-Path $WorkspaceRoot
$scripts  = Join-Path $root "scripts\orchestrator"
$w        = 72
$stepNum  = 0
$t0       = Get-Date
$errors   = [System.Collections.Generic.List[string]]::new()
$qPct     = 0

function Write-Step($title) {
  $script:stepNum++
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ("  STEP $($script:stepNum) -- $title") -ForegroundColor Yellow
  Write-Host ("=" * $w) -ForegroundColor Cyan
}

function Invoke-Script($path, $argList) {
  if (-not (Test-Path $path)) {
    Write-Host "  [SKIP] Script not found: $path" -ForegroundColor DarkYellow
    return
  }
  & powershell -ExecutionPolicy Bypass -File $path @argList
}

# ------------------------------------------------------------------
# BANNER
# ------------------------------------------------------------------
$today = Get-Date -Format "dddd, MMMM d, yyyy -- HH:mm"
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  WHITE CAVES ORCHESTRATOR -- SESSION END" -ForegroundColor Magenta
Write-Host "  $today" -ForegroundColor Magenta
if ($DryRun) { Write-Host "  [DRY RUN -- no git changes will be made]" -ForegroundColor Yellow }
Write-Host ("=" * $w) -ForegroundColor Magenta

# ------------------------------------------------------------------
# STEP 1: Final fast-complete pass
# ------------------------------------------------------------------
if (-not $SkipAutoComplete) {
  Write-Step "FAST-COMPLETE -- final cascade pass"
  Invoke-Script (Join-Path $scripts "fast-complete.ps1") @("-WorkspaceRoot", $root)
} else {
  Write-Host "  [SKIP] fast-complete (SkipAutoComplete)" -ForegroundColor DarkGray
}

# ------------------------------------------------------------------
# STEP 2: Gate-check -- final section counts
# ------------------------------------------------------------------
Write-Step "GATE-CHECK -- final doc section counts"
Invoke-Script (Join-Path $scripts "gate-check.ps1") @("-WorkspaceRoot", $root)

# Read final queue stats for commit message
$queueFile = Join-Path $root "logs\orchestrator\task-queue.json"
$qDone = 0; $qTotal = 0; $qReady = ""
if (Test-Path $queueFile) {
  try {
    $q      = Get-Content $queueFile -Raw | ConvertFrom-Json
    $tasks  = @($q.tasks)
    $qTotal = $tasks.Count
    $qDone  = @($tasks | Where-Object { $_.status -eq "done" }).Count
    $qPct   = if ($qTotal -gt 0) { [math]::Round(($qDone / $qTotal) * 100) } else { 0 }
    $readyList = @($tasks | Where-Object { $_.status -eq "queued" -and ($null -eq $_.dependsOn -or $_.dependsOn.Count -eq 0) })
    if ($readyList.Count -gt 0) { $qReady = " -- READY: " + ($readyList | ForEach-Object { $_.agent }) -join "," }
    else {
      $doneTasks = @($tasks | Where-Object { $_.status -eq "done" } | ForEach-Object { $_.taskId })
      $unblocked = @($tasks | Where-Object {
        $t = $_
        if ($t.status -ne "queued") { return $false }
        if ($null -eq $t.dependsOn -or $t.dependsOn.Count -eq 0) { return $false }
        $allDone = $true
        foreach ($d in $t.dependsOn) { if ($doneTasks -notcontains $d) { $allDone = $false; break } }
        return $allDone
      })
      if ($unblocked.Count -gt 0) { $qReady = " -- READY: " + ($unblocked | ForEach-Object { $_.agent }) -join "," }
    }
  } catch { $errors.Add("Could not read queue: $_") }
}

# ------------------------------------------------------------------
# STEP 3: Progress report -- append end-of-day tracker row
# ------------------------------------------------------------------
Write-Step "PROGRESS REPORT -- append end-of-day tracker row"
Invoke-Script (Join-Path $scripts "progress-report.ps1") @("-WorkspaceRoot", $root)

# ------------------------------------------------------------------
# STEP 4: Error-scan gate (mandatory before push)
# ------------------------------------------------------------------
Write-Step "ERROR SCAN -- typecheck/lint/build/tests/security"
$scanScript = Join-Path $scripts "error-scan.ps1"
if (Test-Path $scanScript) {
  Push-Location $root
  & powershell -ExecutionPolicy Bypass -File "$scanScript" -WorkspaceRoot $root
  $scanExit = $LASTEXITCODE
  Pop-Location
  if ($scanExit -ne 0) {
    $errors.Add("error-scan gate failed")
  }
} else {
  Write-Host "  [SKIP] error-scan.ps1 not found" -ForegroundColor DarkYellow
  $errors.Add("error-scan.ps1 missing")
}

# ------------------------------------------------------------------
# STEP 5: Show what changed this session
# ------------------------------------------------------------------
Write-Step "GIT DIFF -- changes this session"
Push-Location $root
$diffStat = (git diff --stat HEAD 2>&1) | Where-Object { $_ -is [string] }
if ($diffStat -and ($diffStat | Where-Object { $_.Trim() -ne "" }).Count -gt 0) {
  Write-Host ($diffStat -join "`n") -ForegroundColor Gray
} else {
  Write-Host "  (no unstaged changes -- checking staged)" -ForegroundColor DarkGray
  $stagedStat = (git diff --stat --cached 2>&1) | Where-Object { $_ -is [string] }
  if ($stagedStat -and ($stagedStat | Where-Object { $_.Trim() -ne "" }).Count -gt 0) {
    Write-Host ($stagedStat -join "`n") -ForegroundColor Gray
  } else {
    Write-Host "  No changes to commit." -ForegroundColor DarkGray
  }
}

# Count changed files for commit message
$changedFiles = @(git status --porcelain 2>&1 | Where-Object { $_ -match "^\s*[MAD?]" })
$changedCount = $changedFiles.Count
Pop-Location

if ($DryRun) {
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Yellow
  Write-Host "  DRY RUN COMPLETE -- no git changes made" -ForegroundColor Yellow
  Write-Host "  Would commit: $changedCount file(s) changed" -ForegroundColor Yellow
  Write-Host ("=" * $w) -ForegroundColor Yellow
  exit 0
}

if ($errors -contains "error-scan gate failed" -or $errors -contains "error-scan.ps1 missing") {
  Write-Host ""
  Write-Host "  [BLOCKED] Push blocked by error-scan gate." -ForegroundColor Red
  Write-Host "  Fix scan failures and re-run session-end." -ForegroundColor Red
  exit 1
}

if ($changedCount -eq 0) {
  Write-Host ""
  Write-Host "  Nothing to commit. Session close complete (no git needed)." -ForegroundColor Green
  exit 0
}

# ------------------------------------------------------------------
# STEP 6: Stage orchestrator + business_docs + plans + tracker
# ------------------------------------------------------------------
Write-Step "GIT STAGE -- orchestrator + docs + tracker"
Push-Location $root
git add scripts/orchestrator/       2>&1 | Out-Null
git add business_docs/              2>&1 | Out-Null
git add plans/                      2>&1 | Out-Null
git add DAILY_MILESTONE_TRACKER.md  2>&1 | Out-Null
git add package.json                2>&1 | Out-Null
$staged = @(git diff --cached --name-only 2>&1)
Write-Host "  Staged $($staged.Count) file(s):" -ForegroundColor Green
foreach ($f in ($staged | Select-Object -First 20)) { Write-Host "    + $f" -ForegroundColor DarkGreen }
if ($staged.Count -gt 20) { Write-Host "    ... and $($staged.Count - 20) more" -ForegroundColor DarkGray }
Pop-Location

# ------------------------------------------------------------------
# STEP 7: Git commit
# ------------------------------------------------------------------
Write-Step "GIT COMMIT"

$dateTag = Get-Date -Format "yyyy-MM-dd"
if ($Message -eq "") {
  $Message = "chore(orchestrator): session-end $dateTag -- queue $qDone/$qTotal ($qPct%)$qReady"
}

Push-Location $root
$commitOut = git commit --no-verify -m $Message 2>&1
Write-Host $commitOut -ForegroundColor $(if ($commitOut -match "nothing to commit") { "DarkGray" } else { "Green" })
$commitHash = (git rev-parse --short HEAD 2>&1).Trim()
Pop-Location

# ------------------------------------------------------------------
# STEP 8: Git push
# ------------------------------------------------------------------
if (-not $SkipPush) {
  Write-Step "GIT PUSH -- origin development"
  Push-Location $root
  $pushOut = git push origin development 2>&1
  Write-Host $pushOut -ForegroundColor $(if ($LASTEXITCODE -ne 0) { "Red" } else { "Green" })
  if ($LASTEXITCODE -ne 0) { $errors.Add("git push failed") }
  Pop-Location
} else {
  Write-Host ""
  Write-Host "  [SKIP] git push (SkipPush flag set)" -ForegroundColor DarkGray
  Write-Host "  Run: git push origin development" -ForegroundColor DarkGray
}

# ------------------------------------------------------------------
# STEP 9: Merge development -> main and push origin main
# ------------------------------------------------------------------
if ($SkipMainPush) {
  Write-Host ""
  Write-Host "  [SKIP] main push (SkipMainPush flag set)" -ForegroundColor DarkGray
} elseif ($errors.Count -eq 0) {
  Write-Step "MAIN PUSH -- merge development into main and push"
  Push-Location $root
  try {
    git checkout main 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "checkout main failed" }

    git merge development --no-edit 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "merge development->main failed" }

    git push origin main 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "push main failed" }
  } catch {
    $errors.Add("main push failed: $_")
    Write-Host "  [ERROR] main merge/push failed -- restoring development branch." -ForegroundColor Red
  } finally {
    git checkout development 2>&1 | Out-Host
    Pop-Location
  }
} else {
  Write-Host ""
  Write-Host "  [SKIP] main push due to prior errors." -ForegroundColor DarkGray
}

# ------------------------------------------------------------------
# STEP 10: Session summary card
# ------------------------------------------------------------------
$elapsed = [math]::Round(((Get-Date) - $t0).TotalSeconds)

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  SESSION END COMPLETE" -ForegroundColor Magenta
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ("  Commit : $commitHash") -ForegroundColor White
Write-Host ("  Files  : $changedCount staged and committed") -ForegroundColor White
Write-Host ("  Queue  : $qDone / $qTotal done ($qPct%)$qReady") -ForegroundColor White
Write-Host ("  Elapsed: $($elapsed)s") -ForegroundColor White
if ($errors.Count -gt 0) {
  Write-Host ("  Errors : $($errors.Count)") -ForegroundColor Red
  foreach ($e in $errors) { Write-Host "    - $e" -ForegroundColor Red }
} else {
  Write-Host ("  Status : All steps OK") -ForegroundColor Green
}
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ""

if ($errors.Count -gt 0) {
  exit 1
}
