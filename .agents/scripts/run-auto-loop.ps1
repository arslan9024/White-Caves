param(
    [string]$WorkspaceRoot = "C:/Users/HP/WCAG/White-Caves"
)

# Paths
$analyzer   = Join-Path $WorkspaceRoot "scripts/auto-analyze-and-generate-tasks.ps1"
$queueFile  = Join-Path $WorkspaceRoot "logs/orchestrator/task-queue.json"
$planFile   = Join-Path $WorkspaceRoot "logs/implementation_plan.md"
$promptSrc  = Join-Path $WorkspaceRoot "logs/prompts/latest_prompt.txt"
$backupDir  = Join-Path $WorkspaceRoot "logs/prompts/backup"

while ($true) {
    # -------------------------------------------------------------
    # 1️⃣  Static analysis & task generation
    Write-Host "=== Running code‑analysis & task generation ===" -ForegroundColor Cyan
    & powershell -ExecutionPolicy Bypass -File $analyzer -ErrorAction Stop

    # -------------------------------------------------------------
    # 2️⃣  Load pending tasks & pick the first one
    $task = $null
    if (Test-Path $queueFile) {
        $queue = Get-Content $queueFile -Raw | ConvertFrom-Json
        $task = $queue | Where-Object { $_.status -eq "pending" } | Select-Object -First 1
    }

    if ($null -eq $task) {
        Write-Host "No pending tasks – waiting for next cycle…" -ForegroundColor DarkGray
    } else {
        # ---------------------------------------------------------
        # 3️⃣  Build implementation plan
        $plan = @"
# Implementation Plan – Task $($task.id)

**Title**: $($task.title)

## Overview
Automatically selected by the autopilot loop as the highest‑priority improvement.

## Proposed Steps
1. Locate the source file(s) referenced in the warning.
2. Apply the required fix (e.g., add missing semicolon, insert JSDoc, rename variable).
3. Run ESLint again to confirm the warning is cleared.
4. Update `task-queue.json` – set status to **done**.

## Verification
- Re‑run `auto-analyze-and-generate-tasks.ps1` – the warning should disappear.
- Ensure the repository builds without lint errors.
"@
        Set-Content -Path $planFile -Value $plan -Encoding UTF8
        Write-Host "\n=== Implementation Plan ===\n" -ForegroundColor Yellow
        Write-Host $plan

        # ---------------------------------------------------------
        # 4️⃣  Execute implementation (placeholder helper)
        Write-Host "=== Executing implementation for $($task.id) ===" -ForegroundColor Green
        & powershell -ExecutionPolicy Bypass -File (Join-Path $WorkspaceRoot "scripts/implement-task.ps1") -TaskId $task.id -ErrorAction Stop

        # ---------------------------------------------------------
        # 5️⃣  Mark task as done
        $queue | Where-Object { $_.id -eq $task.id } | ForEach-Object { $_.status = "done" }
        $queue | ConvertTo-Json -Depth 5 | Set-Content -Path $queueFile -Encoding UTF8
        Write-Host "[DONE] $($task.id) – $($task.title)" -ForegroundColor Cyan
    }

    # -------------------------------------------------------------
    # 6️⃣  Prompt backup (unchanged)
    if (Test-Path $promptSrc) {
        if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $dest = Join-Path $backupDir ("prompt_$timestamp.txt")
        Copy-Item -Path $promptSrc -Destination $dest
        Write-Host "Saved best prompt to $dest" -ForegroundColor Yellow
    }

    # -------------------------------------------------------------
    # 7️⃣  Autopilot loop (unchanged)
    Write-Host "=== Running autopilot loop (non‑interactive) ===" -ForegroundColor Cyan
    $autoResult = & npm run orchestrator:agent-loop:autopilot -- -NonInteractive -Autopilot 2>&1
    Write-Host "=== Autopilot Output ===" -ForegroundColor Green
    Write-Host $autoResult

    # -------------------------------------------------------------
    # 8️⃣  Sleep before next cycle
    Write-Host "=== Cycle complete – sleeping 5 seconds before next run ===" -ForegroundColor DarkGray
    Start-Sleep -Seconds 5
}
