# session-start.ps1 -- One-command session initializer for White Caves Orchestrator
# Chains: gate-check -> fast-complete -> morning-kickoff -> progress-report -> today-sprint
# Each step is printed with a phase header. Steps that fail print a warning but do NOT abort.
#
# Usage:
#   npm run orchestrator:session             -- full chain
#   npm run orchestrator:session:compact     -- chain with -NoPrompt on today-sprint
#   powershell -File session-start.ps1 -WorkspaceRoot . [-NoPrompt] [-SkipAutoComplete] [-Lane A]

param(
  [string]$WorkspaceRoot    = ".",
  [switch]$NoPrompt,          # pass -NoPrompt to today-sprint (compact output)
  [switch]$SkipAutoComplete,  # skip fast-complete step
  [string]$Lane = ""          # filter today-sprint by lane: A/B/C/D
)

$ErrorActionPreference = "Continue"
$root     = Resolve-Path $WorkspaceRoot
$scripts  = Join-Path $root "scripts\orchestrator"
$w        = 72
$stepNum  = 0
$t0       = Get-Date

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
$today = Get-Date -Format "dddd, MMMM d, yyyy"
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  WHITE CAVES ORCHESTRATOR -- SESSION START" -ForegroundColor Magenta
Write-Host "  $today" -ForegroundColor Magenta
Write-Host ("=" * $w) -ForegroundColor Magenta

# ------------------------------------------------------------------
# STEP 1: Gate-check -- recount all business_docs sections
# ------------------------------------------------------------------
Write-Step "GATE-CHECK -- recount all doc sections"
Invoke-Script (Join-Path $scripts "gate-check.ps1") @("-WorkspaceRoot", $root)

# ------------------------------------------------------------------
# STEP 2: Fast-complete -- auto-mark PASS-target tasks done
# ------------------------------------------------------------------
if (-not $SkipAutoComplete) {
  Write-Step "FAST-COMPLETE -- auto-complete tasks targeting PASS docs"
  Invoke-Script (Join-Path $scripts "fast-complete.ps1") @("-WorkspaceRoot", $root)
} else {
  Write-Host ""
  Write-Host "  [SKIP] fast-complete (SkipAutoComplete flag set)" -ForegroundColor DarkGray
}

# ------------------------------------------------------------------
# STEP 3: Morning kickoff -- lane status overview
# ------------------------------------------------------------------
Write-Step "MORNING KICKOFF -- agent status overview"
Invoke-Script (Join-Path $scripts "morning-kickoff.ps1") @("-WorkspaceRoot", $root)

# ------------------------------------------------------------------
# STEP 4: Progress report -- @Margaret briefing + tracker append
# ------------------------------------------------------------------
Write-Step "PROGRESS REPORT -- @Margaret briefing + tracker row"
Invoke-Script (Join-Path $scripts "progress-report.ps1") @("-WorkspaceRoot", $root)

# ------------------------------------------------------------------
# STEP 5: Today sprint -- READY tasks with prompts
# ------------------------------------------------------------------
Write-Step "TODAY SPRINT -- READY free-agent tasks"
$sprintArgs = @("-WorkspaceRoot", $root)
if ($NoPrompt)        { $sprintArgs += "-NoPrompt" }
if ($Lane -ne "")     { $sprintArgs += @("-Lane", $Lane) }
Invoke-Script (Join-Path $scripts "today-sprint.ps1") $sprintArgs

# ------------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------------
$elapsed = [math]::Round(((Get-Date) - $t0).TotalSeconds, 1)
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  SESSION START COMPLETE  ($elapsed s)" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Quick actions:" -ForegroundColor White
Write-Host "    npm run orchestrator:session:compact   -- re-run this (compact)" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:fast-complete     -- re-run auto-complete" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:report:print      -- re-print @Margaret brief" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Free-agent workflow:" -ForegroundColor White
Write-Host "    1. Copy the prompt from TODAY SPRINT above" -ForegroundColor DarkGray
Write-Host "    2. Paste into the free tool (Gemini/Groq/DeepSeek)" -ForegroundColor DarkGray
Write-Host "    3. Paste AI output into the target .md file" -ForegroundColor DarkGray
Write-Host "    4. Run: npm run orchestrator:complete-advance -- -TaskId T001b -AgentName @Sofia -EvidenceNote ""expanded risk-register""" -ForegroundColor DarkGray
Write-Host "    5. Run: npm run orchestrator:session:compact  -- to see what unlocked" -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ""
