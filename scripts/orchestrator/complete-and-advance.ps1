# complete-and-advance.ps1 — One command to complete a task and show the next one.
# 1. Marks the task done (or waiting_ack if FEEDS_ACK required)
# 2. Finds and displays the agent's next queued task + prompt
# 3. Optionally claims the next task immediately
param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [string]$WorkspaceRoot  = ".",
  [string]$OutputSummary  = "Task completed via complete-and-advance",
  [switch]$ClaimNext       # auto-claim next task so it moves to "running"
)

$completeScript  = Join-Path $PSScriptRoot "complete-task.ps1"
$nextTaskScript  = Join-Path $PSScriptRoot "next-task.ps1"

# ── Step 1: Complete the current task ─────────────────────────────────────────
Write-Host ""
Write-Host "[ 1/2 ] Completing task $TaskId ..." -ForegroundColor Cyan

$completeResult = & $completeScript `
  -TaskId $TaskId `
  -OutputSummary $OutputSummary `
  -WorkspaceRoot $WorkspaceRoot 2>&1

$resultStr = ($completeResult | Out-String).Trim()
Write-Host $resultStr -ForegroundColor DarkGray

try {
  $parsed = $resultStr | ConvertFrom-Json
  if (-not $parsed.ok) {
    Write-Host "[ERROR] Could not complete task: $($parsed.reason)" -ForegroundColor Red
    exit 1
  }
  $newStatus = $parsed.newStatus
  Write-Host "  Task $TaskId is now: $newStatus" -ForegroundColor Green

  if ($newStatus -eq "waiting_ack") {
    Write-Host ""
    Write-Host "  [FEEDS_ACK REQUIRED] Downstream agent must acknowledge before queue advances." -ForegroundColor Yellow
    Write-Host "  Run: npm run orchestrator:queue:ack -- -TaskId $TaskId -AgentName $($parsed.feedsAckBy)" -ForegroundColor Gray
  }
}
catch {
  Write-Host "[WARN] Could not parse complete-task result. Continuing to next task." -ForegroundColor Yellow
}

# ── Step 2: Show next task ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ 2/2 ] Looking up next task for $AgentName ..." -ForegroundColor Cyan
Write-Host ""

$claimFlag = if ($ClaimNext) { @("-Claim") } else { @() }
& $nextTaskScript `
  -AgentName $AgentName `
  -WorkspaceRoot $WorkspaceRoot `
  @claimFlag
