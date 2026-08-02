# complete-and-advance.ps1 - One command to complete a task and show the next one.
# 1. Auto-starts the task if still queued (manual free-agent mode)
# 2. Marks the task done (or waiting_ack if FEEDS_ACK required)
# 3. Finds and displays the agent's next queued task + prompt
#
# Usage:
#   npm run orchestrator:complete-advance -- -TaskId T001 -AgentName "@Sofia"
#   npm run orchestrator:complete-advance -- -TaskId T001 -AgentName "@Sofia" -EvidenceNote "Expanded compliance-requirements.md to 18 sections" -ProducedRef "business_docs/05_requirements/compliance-requirements.md"
param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [string]$WorkspaceRoot  = ".",
  [string]$EvidenceNote   = "Task completed via complete-and-advance",
  [string]$ProducedRef    = "",
  [switch]$ClaimNext       # auto-claim next task so it moves to "running"
)

$completeScript  = Join-Path $PSScriptRoot "complete-task.ps1"
$nextTaskScript  = Join-Path $PSScriptRoot "next-task.ps1"
$promptManagerScript = Join-Path $PSScriptRoot "prompt-manager.ps1"

# -- Step 1: Complete the current task ------------------------------------
Write-Host ""
Write-Host "[ 1/2 ] Completing task $TaskId ..." -ForegroundColor Cyan

# -AllowQueued enables manual free-agent workflow: task doesn't need a
# background worker to set it to "running" first.
$completeResult = & $completeScript `
  -TaskId       $TaskId `
  -EvidenceNote $EvidenceNote `
  -ProducedRef  $ProducedRef `
  -AllowQueued `
  -WorkspaceRoot $WorkspaceRoot 2>&1

$resultStr = ($completeResult | Out-String).Trim()
Write-Host $resultStr -ForegroundColor DarkGray

$newStatus  = $null
$ackAgent   = $null
try {
  $parsed = $resultStr | ConvertFrom-Json
  if (-not $parsed.ok) {
    Write-Host "[ERROR] Could not complete task: $($parsed.reason)" -ForegroundColor Red
    if ($parsed.hint) { Write-Host "  Hint: $($parsed.hint)" -ForegroundColor DarkYellow }
    exit 1
  }
  $newStatus = $parsed.newStatus   # "done" or "waiting_ack"
  $ackAgent  = $parsed.feedsAckBy  # null or agent name
  Write-Host ""
  Write-Host "  Task $TaskId is now: $newStatus" -ForegroundColor Green

  if ($newStatus -eq "waiting_ack") {
    Write-Host ""
    Write-Host "  [FEEDS_ACK REQUIRED] Downstream agent must acknowledge before queue advances." -ForegroundColor Yellow
    Write-Host "  Run: npm run orchestrator:queue:ack -- -TaskId $TaskId -AckBy `"$ackAgent`"" -ForegroundColor Gray
  }

  if ($newStatus -eq "done" -and (Test-Path $promptManagerScript)) {
    $markSuccessOk = $false
    for ($attempt = 1; $attempt -le 3; $attempt++) {
      $pmOut = & powershell -ExecutionPolicy Bypass -File "$promptManagerScript" `
        -WorkspaceRoot $WorkspaceRoot `
        -MarkSuccess `
        -TaskId $TaskId 2>&1 | Out-String

      if ($LASTEXITCODE -eq 0) {
        $markSuccessOk = $true
        $pmOut | Write-Host
        break
      }

      if ($attempt -lt 3) {
        Write-Host ("  [WARN] prompt-manager MarkSuccess contention (attempt {0}/3). Retrying..." -f $attempt) -ForegroundColor DarkYellow
        Start-Sleep -Milliseconds (200 * $attempt)
      } else {
        Write-Host "  [WARN] prompt-manager MarkSuccess failed after retries; task completion remains valid." -ForegroundColor DarkYellow
        $pmOut | Write-Host
      }
    }

    $evidenceLc = [string]$EvidenceNote
    $evidenceLc = $evidenceLc.ToLower()
    $saveText = ""
    if ($evidenceLc -like "*refined prompt:*") {
      $parts = $EvidenceNote.Split(":", 2)
      if ($parts.Count -eq 2) { $saveText = $parts[1].Trim() }
    } elseif ($evidenceLc -like "*updated prompt:*") {
      $parts = $EvidenceNote.Split(":", 2)
      if ($parts.Count -eq 2) { $saveText = $parts[1].Trim() }
    }

    if (-not [string]::IsNullOrWhiteSpace($saveText)) {
      Write-Host ""
      Write-Host "  [PROMPT SAVE] Auto-saving refined prompt text..." -ForegroundColor Cyan
      $saveOk = $false
      for ($attempt = 1; $attempt -le 3; $attempt++) {
        $saveOut = & powershell -ExecutionPolicy Bypass -File "$promptManagerScript" `
          -WorkspaceRoot $WorkspaceRoot `
          -Save `
          -TaskId $TaskId `
          -Text $saveText 2>&1 | Out-String

        if ($LASTEXITCODE -eq 0) {
          $saveOk = $true
          $saveOut | Write-Host
          break
        }

        if ($attempt -lt 3) {
          Write-Host ("  [WARN] prompt-manager Save contention (attempt {0}/3). Retrying..." -f $attempt) -ForegroundColor DarkYellow
          Start-Sleep -Milliseconds (200 * $attempt)
        } else {
          Write-Host "  [WARN] prompt-manager Save failed after retries; continuing without blocking task flow." -ForegroundColor DarkYellow
          $saveOut | Write-Host
        }
      }
    } elseif ($evidenceLc -like "*refined prompt*" -or $evidenceLc -like "*updated prompt*") {
      Write-Host "  [PROMPT SAVE] Mention detected but no '...prompt: <text>' payload found." -ForegroundColor Yellow
    }
  }
}
catch {
  Write-Host "[WARN] Could not parse complete-task result. Continuing to next task." -ForegroundColor Yellow
}

# -- Step 2: Show next task -----------------------------------------------
Write-Host ""
Write-Host "[ 2/2 ] Looking up next task for $AgentName ..." -ForegroundColor Cyan
Write-Host ""

$nextArgs = @{ AgentName = $AgentName; WorkspaceRoot = $WorkspaceRoot }
if ($ClaimNext) { $nextArgs['Claim'] = $true }
& $nextTaskScript @nextArgs