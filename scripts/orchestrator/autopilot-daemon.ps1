# autopilot-daemon.ps1 -- Supervises agent-loop autopilot and restarts it forever.
# Ensures continuous project development even if a loop exits due to transient conditions.
param(
  [string]$WorkspaceRoot = ".",
  [int]$RestartDelaySeconds = 5,
  [switch]$NoBrowser
)

$root = Resolve-Path $WorkspaceRoot
$stateDir = Join-Path $root "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$logFile = Join-Path $stateDir "autopilot-daemon.log"
$agentLoopScript = Join-Path $PSScriptRoot "agent-loop.ps1"
$powershellExe = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"

function Write-DaemonLog {
  param([string]$Message)
  $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  $line = "[$ts] $Message"

  for ($attempt = 1; $attempt -le 3; $attempt++) {
    try {
      [System.IO.File]::AppendAllText($logFile, "$line`r`n", [System.Text.Encoding]::UTF8)
      return
    }
    catch {
      if ($attempt -ge 3) {
        Write-Host "[AUTOPILOT-DAEMON][WARN] $line" -ForegroundColor DarkYellow
        return
      }

      Start-Sleep -Milliseconds 150
    }
  }
}

if (-not (Test-Path $agentLoopScript)) {
  throw "Missing agent-loop script: $agentLoopScript"
}

if (-not (Test-Path $powershellExe)) {
  throw "Missing PowerShell executable: $powershellExe"
}

$runCount = 0
Write-DaemonLog "Autopilot daemon started. WorkspaceRoot=$root RestartDelaySeconds=$RestartDelaySeconds"

while ($true) {
  $runCount++
  Write-DaemonLog "Launching agent-loop run #$runCount"

  try {
    if ($NoBrowser) {
      & "$powershellExe" -NoProfile -ExecutionPolicy Bypass -File "$agentLoopScript" -WorkspaceRoot "$root" -Autopilot -NoBrowser 2>&1 |
        ForEach-Object { Write-DaemonLog "agent-loop: $_" }
    }
    else {
      & "$powershellExe" -NoProfile -ExecutionPolicy Bypass -File "$agentLoopScript" -WorkspaceRoot "$root" -Autopilot 2>&1 |
        ForEach-Object { Write-DaemonLog "agent-loop: $_" }
    }
    Write-DaemonLog "agent-loop run #$runCount ended; restarting after ${RestartDelaySeconds}s"
  }
  catch {
    Write-DaemonLog "agent-loop run #$runCount crashed: $($_.Exception.Message); restarting after ${RestartDelaySeconds}s"
  }

  Start-Sleep -Seconds $RestartDelaySeconds
}
