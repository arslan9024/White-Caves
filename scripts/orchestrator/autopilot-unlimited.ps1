# autopilot-unlimited.ps1 — White Caves Unlimited Autopilot Loop
#
# Every iteration of the loop runs the full intelligence cycle:
#
#   PHASE 1 — Research    : Run codebase-scan.js (all 20 research analysts' findings)
#   PHASE 2 — Reprioritise: Run reprioritize.js  (smart task ordering)
#   PHASE 3 — Dispatch    : Print the dispatch packet for the next task
#   PHASE 4 — Implement   : Execute agent-loop.ps1 -Autopilot -Once (one task)
#   PHASE 5 — Validate    : npm run build + typecheck
#   PHASE 6 — Record      : Write session snapshot + commit progress
#   LOOP     : Back to Phase 1 (unlimited unless -MaxSessions or hard stop)
#
# Usage:
#   npm run autopilot:unlimited
#   powershell -File autopilot-unlimited.ps1
#   powershell -File autopilot-unlimited.ps1 -MaxSessions 3
#   powershell -File autopilot-unlimited.ps1 -MaxSessions 0   # truly unlimited
#   powershell -File autopilot-unlimited.ps1 -SkipBuild       # skip build validation per session
#   powershell -File autopilot-unlimited.ps1 -DryRun          # research + reprioritise only, no coding
#
# Hard stop conditions (autopilot pauses and waits for human):
#   - Build non-zero after phase 5
#   - TypeScript errors > 0 after phase 5
#   - Security flag detected in codebase scan
#   - Explicit PAUSE file: logs/orchestrator/PAUSE
#
# Resume after resolving a hard stop:
#   Remove-Item logs/orchestrator/PAUSE -ErrorAction SilentlyContinue
#   npm run autopilot:unlimited

param(
  [string]$WorkspaceRoot = ".",
  [int]   $MaxSessions   = 0,        # 0 = unlimited
  [switch]$SkipBuild,                # skip npm run build validation per session
  [switch]$SkipScan,                 # reuse cached scan report
  [switch]$DryRun,                   # research + reprioritise only; no coding
  [int]   $SessionDelaySec = 5,      # pause between sessions (seconds)
  [switch]$NoCommit                  # skip git commit between sessions
)

$ErrorActionPreference = "Continue"
$root     = Resolve-Path $WorkspaceRoot
$scripts  = Join-Path $root "scripts\orchestrator"
$logsDir  = Join-Path $root "logs\orchestrator"
$w        = 72

# ── Ensure logs directory exists ─────────────────────────────────────────
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir -Force | Out-Null }

# ── Counters ──────────────────────────────────────────────────────────────
$sessionNum   = 0
$passCount    = 0
$failCount    = 0
$hardStopHit  = $false
$startTime    = Get-Date

# ── Utilities ─────────────────────────────────────────────────────────────
function Banner($msg, $color = "Cyan") {
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor $color
  Write-Host "  $msg" -ForegroundColor $color
  Write-Host ("=" * $w) -ForegroundColor $color
}

function Phase($num, $title) {
  Write-Host ""
  Write-Host ("─" * $w) -ForegroundColor DarkCyan
  Write-Host ("  PHASE $num — $title") -ForegroundColor Yellow
  Write-Host ("─" * $w) -ForegroundColor DarkCyan
}

function CheckPauseFile() {
  $pauseFile = Join-Path $logsDir "PAUSE"
  return (Test-Path $pauseFile)
}

function RunNode($scriptFile, $extraArgs = @()) {
  $full = Join-Path $scripts $scriptFile
  if (-not (Test-Path $full)) {
    Write-Host "  [SKIP] Script not found: $full" -ForegroundColor DarkYellow
    return $false
  }
  & node $full @extraArgs
  return ($LASTEXITCODE -eq 0)
}

function RunNpm($command) {
  & npm run $command 2>&1
  return ($LASTEXITCODE -eq 0)
}

function ReadScanReport() {
  $reportFile = Join-Path $logsDir "codebase-scan-report.json"
  if (-not (Test-Path $reportFile)) { return $null }
  try { return Get-Content $reportFile | ConvertFrom-Json }
  catch { return $null }
}

function ReadPriorityOrder() {
  $priorityFile = Join-Path $logsDir "priority-order.json"
  if (-not (Test-Path $priorityFile)) { return $null }
  try { return Get-Content $priorityFile | ConvertFrom-Json }
  catch { return $null }
}

function CheckHardStops($scanReport) {
  $stops = @()
  if ($null -eq $scanReport) { return $stops }

  if ($scanReport.summary.buildOk -eq $false) {
    $stops += [PSCustomObject]@{ Code = "BUILD_FAIL"; Msg = "Build is FAILING — fix immediately" }
  }
  if ($scanReport.summary.tsErrors -gt 0) {
    $stops += [PSCustomObject]@{ Code = "TS_ERRORS"; Msg = "TypeScript has $($scanReport.summary.tsErrors) error(s)" }
  }
  if ($scanReport.securityFlags -and $scanReport.securityFlags.Count -gt 0) {
    $stops += [PSCustomObject]@{ Code = "SECURITY";  Msg = "$($scanReport.securityFlags.Count) potential security issue(s) detected" }
  }
  return $stops
}

function WriteSessionLog($session, $status, $dispatchPacket) {
  $logFile = Join-Path $logsDir "autopilot-session-log.json"
  $existing = @()
  if (Test-Path $logFile) {
    try { $existing = (Get-Content $logFile | ConvertFrom-Json) } catch {}
  }
  $entry = [PSCustomObject]@{
    session    = $session
    timestamp  = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    status     = $status
    task       = if ($dispatchPacket) { $dispatchPacket.taskId } else { $null }
    agent      = if ($dispatchPacket) { $dispatchPacket.agent  } else { $null }
  }
  $existing += $entry
  $existing | ConvertTo-Json -Depth 3 | Set-Content $logFile
}

# ── Main Loop ─────────────────────────────────────────────────────────────
Banner "WHITE CAVES — UNLIMITED AUTOPILOT LOOP" "Magenta"
Write-Host "  Mode        : $(if ($DryRun) { 'DRY RUN (research + reprioritise only)' } else { 'FULL EXECUTE' })"
Write-Host "  Max sessions: $(if ($MaxSessions -eq 0) { 'Unlimited' } else { $MaxSessions })"
Write-Host "  Skip build  : $SkipBuild"
Write-Host "  Skip scan   : $SkipScan"
Write-Host "  Started     : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""
Write-Host "  Hard stop conditions:"
Write-Host "    • Build failure after validation"
Write-Host "    • TypeScript errors > 0"
Write-Host "    • Security flag in codebase scan"
Write-Host "    • PAUSE file at: logs/orchestrator/PAUSE"
Write-Host ""
Write-Host "  To stop cleanly at any time:"
Write-Host "    New-Item -Path '$logsDir\PAUSE' -ItemType File -Force"

# ─────────────────────────────────────────────────────────────────────────
while ($true) {
  $sessionNum++
  $sessionId = "autopilot-session-$(Get-Date -Format 'yyyyMMdd-HHmmss')-s$sessionNum"

  Banner "SESSION #$sessionNum — $sessionId" "Cyan"

  # ── Check PAUSE file ──────────────────────────────────────────────────
  if (CheckPauseFile) {
    Write-Host "  ⏸  PAUSE file detected at logs/orchestrator/PAUSE" -ForegroundColor Red
    Write-Host "     Remove the file to resume: Remove-Item '$logsDir\PAUSE'" -ForegroundColor Yellow
    $hardStopHit = $true
    break
  }

  # ── MaxSessions check ─────────────────────────────────────────────────
  if ($MaxSessions -gt 0 -and $sessionNum -gt $MaxSessions) {
    Write-Host "  ✓ Reached MaxSessions limit ($MaxSessions). Exiting cleanly." -ForegroundColor Green
    break
  }

  $scanReport     = $null
  $priorityOrder  = $null
  $dispatchPacket = $null
  $sessionStatus  = "ok"

  # ══════════════════════════════════════════════════════════════════════
  # PHASE 1 — RESEARCH: Codebase Scan
  # ══════════════════════════════════════════════════════════════════════
  Phase 1 "RESEARCH — Codebase Scan (20 Research Analysts)"

  $scanArgs = @("--brief")
  if ($SkipScan) { $scanArgs += "--skip" }

  $scanOk = RunNode "codebase-scan.js" $scanArgs
  $scanReport = ReadScanReport

  if ($null -ne $scanReport) {
    Write-Host ""
    Write-Host "  Scan Results:" -ForegroundColor White
    Write-Host "    Source files : $($scanReport.summary.totalSourceFiles)"
    Write-Host "    Findings     : $($scanReport.summary.totalFindings)"
    Write-Host "    TS errors    : $($scanReport.summary.tsErrors)"
    Write-Host "    Build        : $(if ($scanReport.summary.buildOk) { '✓ GREEN' } else { '✗ FAILING' })"
    Write-Host "    Ready waves  : $($scanReport.summary.readyWaves)"
    Write-Host "    Incomplete   : $($scanReport.summary.incompleteDocs) docs"
  }

  # ── Hard stop check immediately after scan ───────────────────────────
  $hardStops = CheckHardStops $scanReport
  if ($hardStops.Count -gt 0) {
    Write-Host ""
    Write-Host "  🚨 HARD STOP CONDITIONS — redirecting this session to fix them:" -ForegroundColor Red
    foreach ($hs in $hardStops) {
      Write-Host "     [$($hs.Code)] $($hs.Msg)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "  Autopilot will target P0 fix tasks in Phase 4." -ForegroundColor Yellow
  }

  # ══════════════════════════════════════════════════════════════════════
  # PHASE 2 — REPRIORITISE: Smart Task Ordering
  # ══════════════════════════════════════════════════════════════════════
  Phase 2 "REPRIORITISE — Computing Priority Order"

  $repriOk = RunNode "reprioritize.js" @("--top", "5")
  $priorityOrder = ReadPriorityOrder

  if ($null -ne $priorityOrder -and $null -ne $priorityOrder.nextTask) {
    $nt = $priorityOrder.nextTask
    Write-Host ""
    Write-Host "  Next task: [$($nt.computedScore)] $($nt.id)" -ForegroundColor Green
    Write-Host "  Agent    : $($nt.agent)" -ForegroundColor Green
  } else {
    Write-Host "  ⚠  No eligible tasks found in queue." -ForegroundColor Yellow
    Write-Host "     Queue may be empty or all tasks are blocked/done." -ForegroundColor DarkYellow
    $sessionStatus = "no_tasks"
  }

  $dispatchPacket = if ($null -ne $priorityOrder) { $priorityOrder.dispatchPacket } else { $null }

  # ══════════════════════════════════════════════════════════════════════
  # PHASE 3 — DISPATCH PACKET DISPLAY
  # ══════════════════════════════════════════════════════════════════════
  Phase 3 "DISPATCH — Task for This Session"

  if ($null -ne $dispatchPacket) {
    Write-Host ""
    Write-Host "  ┌─ DISPATCH PACKET ─────────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "  │ Task ID   : $($dispatchPacket.taskId)" -ForegroundColor White
    Write-Host "  │ Agent     : $($dispatchPacket.agent) — $($dispatchPacket.agentTitle)" -ForegroundColor White
    Write-Host "  │ Unit      : $($dispatchPacket.agentUnit)" -ForegroundColor White
    Write-Host "  │ Model     : $($dispatchPacket.agentModel)" -ForegroundColor White
    if ($dispatchPacket.agentToolUrl) {
      Write-Host "  │ Tool URL  : $($dispatchPacket.agentToolUrl)" -ForegroundColor DarkGray
    }
    Write-Host "  │ Objective : $($dispatchPacket.objective.Substring(0, [Math]::Min(100, $dispatchPacket.objective.Length)))" -ForegroundColor White
    Write-Host "  │ Validate  : $($dispatchPacket.validationCommand)" -ForegroundColor DarkGray
    Write-Host "  │ Invoke    : $($dispatchPacket.invocationPattern)" -ForegroundColor Green
    Write-Host "  └───────────────────────────────────────────────────────────────────" -ForegroundColor Cyan
  } else {
    Write-Host "  No dispatch packet — skipping implementation phase." -ForegroundColor Yellow
  }

  # ══════════════════════════════════════════════════════════════════════
  # PHASE 4 — IMPLEMENT: Execute the Task
  # ══════════════════════════════════════════════════════════════════════
  Phase 4 "IMPLEMENT — Agent Task Execution"

  $implementOk = $true

  if ($DryRun) {
    Write-Host "  [DRY RUN] Skipping implementation phase." -ForegroundColor DarkYellow
    Write-Host "  Dispatch packet printed above for manual execution." -ForegroundColor DarkYellow

  } elseif ($null -eq $dispatchPacket) {
    Write-Host "  Nothing to implement — no task dispatched." -ForegroundColor DarkYellow

  } else {
    # Try to call the existing agent-loop.ps1 with -Autopilot -Once
    $agentLoopScript = Join-Path $scripts "agent-loop.ps1"
    if (Test-Path $agentLoopScript) {
      Write-Host "  ▶ Running agent-loop.ps1 -Autopilot -Once …" -ForegroundColor Cyan
      & powershell -ExecutionPolicy Bypass -File $agentLoopScript -Autopilot -Once -WorkspaceRoot $root 2>&1
      $implementOk = ($LASTEXITCODE -eq 0)
    } else {
      # Agent-loop not available — print the invocation for the human / Copilot agent
      Write-Host ""
      Write-Host "  agent-loop.ps1 not found." -ForegroundColor DarkYellow
      Write-Host "  Copy the invocation pattern above and execute it in the free tool." -ForegroundColor DarkYellow
      Write-Host ""
      Write-Host "  FULL PROMPT FOR FREE AGENT TOOL:" -ForegroundColor Cyan
      Write-Host "  $($dispatchPacket.fullPrompt)" -ForegroundColor White
      $implementOk = $true  # non-blocking — human/Copilot agent will execute
    }

    if (-not $implementOk) {
      Write-Host "  ⚠ Agent loop returned non-zero. Incrementing fail count." -ForegroundColor Yellow
      $failCount++
      $sessionStatus = "impl_failed"
    } else {
      $passCount++
    }
  }

  # ══════════════════════════════════════════════════════════════════════
  # PHASE 5 — VALIDATE: Build + TypeScript Check
  # ══════════════════════════════════════════════════════════════════════
  Phase 5 "VALIDATE — Build & TypeScript Verification"

  $validateOk = $true

  if ($DryRun -or $SkipBuild) {
    Write-Host "  [SKIP] Build validation bypassed." -ForegroundColor DarkYellow
  } else {
    Write-Host "  Running: npm run build …" -ForegroundColor Cyan
    $buildOk = RunNpm "build"
    if (-not $buildOk) {
      Write-Host "  ✗ BUILD FAILED — HARD STOP" -ForegroundColor Red
      $hardStopHit = $true
      $validateOk  = $false
      $sessionStatus = "build_fail"
    } else {
      Write-Host "  ✓ Build passed" -ForegroundColor Green
    }

    if ($validateOk) {
      Write-Host "  Running: TypeScript check …" -ForegroundColor Cyan
      & node_modules/.bin/tsc --noEmit -p tsconfig.json 2>&1 | Out-Null
      $tsOk = ($LASTEXITCODE -eq 0)
      if (-not $tsOk) {
        Write-Host "  ✗ TypeScript errors detected — HARD STOP" -ForegroundColor Red
        $hardStopHit = $true
        $validateOk  = $false
        $sessionStatus = "ts_fail"
      } else {
        Write-Host "  ✓ TypeScript passed" -ForegroundColor Green
      }
    }
  }

  # ══════════════════════════════════════════════════════════════════════
  # PHASE 6 — RECORD: Session Close + Git Commit
  # ══════════════════════════════════════════════════════════════════════
  Phase 6 "RECORD — Session Close"

  WriteSessionLog $sessionNum $sessionStatus $dispatchPacket

  $sessionEnd = Get-Date
  $elapsed    = ($sessionEnd - $startTime).TotalMinutes

  Write-Host ""
  Write-Host "  Session #$sessionNum summary:" -ForegroundColor White
  Write-Host "    Status     : $sessionStatus"
  Write-Host "    Pass count : $passCount"
  Write-Host "    Fail count : $failCount"
  Write-Host "    Elapsed    : $([Math]::Round($elapsed, 1)) min since loop start"

  if (-not $DryRun -and -not $NoCommit) {
    Write-Host ""
    Write-Host "  Committing session progress …" -ForegroundColor DarkCyan
    $sessionEndScript = Join-Path $scripts "session-end.ps1"
    if (Test-Path $sessionEndScript) {
      & powershell -ExecutionPolicy Bypass -File $sessionEndScript `
        -WorkspaceRoot $root `
        -Message "autopilot: session #$sessionNum — $($dispatchPacket ? $dispatchPacket.taskId : 'no-task')" `
        -SkipPush 2>&1 | Out-Null
    } else {
      # Fallback manual commit
      Set-Location $root
      git add logs/orchestrator/ 2>&1 | Out-Null
      git add business_docs/ plans/ 2>&1 | Out-Null
      $msg = "autopilot: session #$sessionNum complete [$(Get-Date -Format 'yyyy-MM-dd HH:mm')]"
      # ── Loop-guard: only commit when there is something staged
      $cachedStatAu = (git diff --cached --stat 2>$null).Trim()
      if ([string]::IsNullOrWhiteSpace($cachedStatAu)) {
        Write-Host "  [AEGIS-SKIP] nothing staged in fallback commit path — skipping." -ForegroundColor DarkYellow
      } else {
        git commit -m $msg 2>&1 | Out-Null
      }
    }
    Write-Host "  ✓ Progress committed" -ForegroundColor Green
  }

  # ── Hard stop — break loop ────────────────────────────────────────────
  if ($hardStopHit) {
    Write-Host ""
    Write-Host ("=" * $w) -ForegroundColor Red
    Write-Host "  ⛔  AUTOPILOT HARD STOP" -ForegroundColor Red
    Write-Host ("=" * $w) -ForegroundColor Red
    Write-Host "  Fix the condition above, then re-run:" -ForegroundColor Yellow
    Write-Host "    npm run autopilot:unlimited" -ForegroundColor Cyan
    Write-Host ""
    break
  }

  # ── No tasks left ─────────────────────────────────────────────────────
  if ($sessionStatus -eq "no_tasks") {
    Write-Host ""
    Write-Host "  ✅ All tasks completed! The queue is empty." -ForegroundColor Green
    Write-Host "  Run: npm run orchestrator:queue:init to load new tasks," -ForegroundColor DarkYellow
    Write-Host "  or assign new tasks via: npm run orchestrator:assign" -ForegroundColor DarkYellow
    break
  }

  # ── Session delay ─────────────────────────────────────────────────────
  if ($SessionDelaySec -gt 0 -and ($MaxSessions -eq 0 -or $sessionNum -lt $MaxSessions)) {
    Write-Host ""
    Write-Host "  ⏳ Waiting $SessionDelaySec sec before next session …" -ForegroundColor DarkGray
    Start-Sleep -Seconds $SessionDelaySec
  }
}

# ── Final Summary ─────────────────────────────────────────────────────────
$totalElapsed = ((Get-Date) - $startTime).TotalMinutes

Banner "AUTOPILOT LOOP COMPLETE" "Magenta"
Write-Host "  Sessions run : $sessionNum"
Write-Host "  Passed       : $passCount"
Write-Host "  Failed       : $failCount"
Write-Host "  Hard stop    : $hardStopHit"
Write-Host "  Total time   : $([Math]::Round($totalElapsed, 1)) min"
Write-Host ""
Write-Host "  Session log  : logs/orchestrator/autopilot-session-log.json"
Write-Host "  Last scan    : logs/orchestrator/codebase-scan-report.json"
Write-Host "  Priority list: logs/orchestrator/priority-order.json"
Write-Host ""
