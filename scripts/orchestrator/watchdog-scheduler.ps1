# Watchdog Scheduler — runs continuously, firing watchdog + ACK escalation every N minutes
# Spawned by start-background.ps1 alongside worker pool.
# Writes heartbeat + results to logs/orchestrator/watchdog-scheduler.log
param(
  [string]$WorkspaceRoot = ".",
  [int]$IntervalMinutes = 5,
  [int]$StaleMinutes = 10,
  [int]$MaxAttempts = 3,
  [int]$AckStaleMinutes = 20
)

$logDir = Join-Path $WorkspaceRoot "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir "watchdog-scheduler.log"

$watchdogScript  = Join-Path $PSScriptRoot "watchdog.ps1"
$escalateScript  = Join-Path $PSScriptRoot "escalate.ps1"
$syncScript      = Join-Path $PSScriptRoot "sync-daily-tracker.ps1"

function Write-Log {
  param([string]$Msg)
  $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  $line = "[$ts] $Msg"
  Add-Content -Path $logFile -Value $line -Encoding UTF8
}

Write-Log "Watchdog scheduler started. IntervalMinutes=$IntervalMinutes StaleMinutes=$StaleMinutes AckStaleMinutes=$AckStaleMinutes"

while ($true) {
  Write-Log "--- Cycle start ---"

  # 1. Run watchdog (stale task detection)
  try {
    $result = & $watchdogScript `
      -WorkspaceRoot $WorkspaceRoot `
      -StaleMinutes $StaleMinutes `
      -MaxAttempts $MaxAttempts 2>&1

    $resultStr = ($result | Out-String).Trim()
    Write-Log "Watchdog result: $resultStr"
  }
  catch {
    Write-Log "Watchdog ERROR: $($_.Exception.Message)"
  }

  # 2. Run ACK escalation
  try {
    $result = & $escalateScript `
      -WorkspaceRoot $WorkspaceRoot `
      -AckStaleMinutes $AckStaleMinutes 2>&1

    $resultStr = ($result | Out-String).Trim()
    Write-Log "Escalation result: $resultStr"
  }
  catch {
    Write-Log "Escalation ERROR: $($_.Exception.Message)"
  }

  # 3. Sync daily tracker
  try {
    $result = & $syncScript -WorkspaceRoot $WorkspaceRoot 2>&1
    $resultStr = ($result | Out-String).Trim()
    Write-Log "Tracker sync result: $resultStr"
  }
  catch {
    Write-Log "Tracker sync ERROR: $($_.Exception.Message)"
  }

  Write-Log "--- Cycle done. Sleeping ${IntervalMinutes}m ---"
  Start-Sleep -Seconds ($IntervalMinutes * 60)
}
