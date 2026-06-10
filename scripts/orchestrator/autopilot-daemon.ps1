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
$queueFile = Join-Path $stateDir "task-queue.json"
$agentLoopScript = Join-Path $PSScriptRoot "agent-loop.ps1"
$aegisRegenerateScript = Join-Path $PSScriptRoot "aegis-regenerate.ps1"
$policyFile = Join-Path $PSScriptRoot "policy.json"
$powershellExe = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$minLoopImprovementPct = 2.0

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

function Get-QueueProgress {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return [PSCustomObject]@{ Total = 0; Done = 0; Pct = 0.0 }
  }

  try {
    $item = Get-Item -Path $Path -ErrorAction Stop
    if ($item.Length -le 2MB) {
      $q = Get-Content -Path $Path -Raw | ConvertFrom-Json
      $tasks = @($q.tasks)
      $total = $tasks.Count
      $done = @($tasks | Where-Object { $_.status -eq "done" }).Count
      $pct = if ($total -gt 0) { [math]::Round(($done * 100.0) / $total, 1) } else { 0.0 }
      return [PSCustomObject]@{ Total = $total; Done = $done; Pct = $pct }
    }

    $totalLarge = 0
    $doneLarge = 0
    foreach ($line in [System.IO.File]::ReadLines($Path)) {
      if ($line -match '"taskId"\s*:') { $totalLarge++ }
      if ($line -match '"status"\s*:\s*"done"') { $doneLarge++ }
    }
    $pctLarge = if ($totalLarge -gt 0) { [math]::Round(($doneLarge * 100.0) / $totalLarge, 1) } else { 0.0 }
    return [PSCustomObject]@{ Total = $totalLarge; Done = $doneLarge; Pct = $pctLarge }
  }
  catch {
    return [PSCustomObject]@{ Total = 0; Done = 0; Pct = 0.0 }
  }
}

if (Test-Path $policyFile) {
  try {
    $policy = Get-Content -Path $policyFile -Raw | ConvertFrom-Json
    if ($null -ne $policy.aegis -and $null -ne $policy.aegis.minLoopImprovementPct) {
      $parsedMin = [double]$policy.aegis.minLoopImprovementPct
      if ($parsedMin -ge 0) { $minLoopImprovementPct = $parsedMin }
    }
  }
  catch {
    # keep default
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
  $before = Get-QueueProgress -Path $queueFile
  Write-DaemonLog "Launching agent-loop run #$runCount"
  Write-DaemonLog ("run #$runCount baseline: done={0}/{1} ({2}%)" -f $before.Done, $before.Total, $before.Pct)

  try {
    if ($NoBrowser) {
      & "$powershellExe" -NoProfile -ExecutionPolicy Bypass -File "$agentLoopScript" -WorkspaceRoot "$root" -Autopilot -NoBrowser 2>&1 |
        ForEach-Object { Write-DaemonLog "agent-loop: $_" }
    }
    else {
      & "$powershellExe" -NoProfile -ExecutionPolicy Bypass -File "$agentLoopScript" -WorkspaceRoot "$root" -Autopilot 2>&1 |
        ForEach-Object { Write-DaemonLog "agent-loop: $_" }
    }
    $after = Get-QueueProgress -Path $queueFile
    $deltaPct = [math]::Round(($after.Pct - $before.Pct), 1)
    Write-DaemonLog ("run #$runCount result: done={0}/{1} ({2}%), improvement={3}%" -f $after.Done, $after.Total, $after.Pct, $deltaPct)

    if ($after.Total -gt 0 -and $after.Done -lt $after.Total -and $deltaPct -lt $minLoopImprovementPct -and (Test-Path $aegisRegenerateScript)) {
      Write-DaemonLog ("run #$runCount below target improvement (<{0}%); triggering queue rebalance" -f $minLoopImprovementPct)
      & "$powershellExe" -NoProfile -ExecutionPolicy Bypass -File "$aegisRegenerateScript" -WorkspaceRoot "$root" -Reason "Autopilot low-improvement rebalance (run #$runCount, delta=${deltaPct}%)" -Force 2>&1 |
        ForEach-Object { Write-DaemonLog "rebalance: $_" }
    }

    Write-DaemonLog "agent-loop run #$runCount ended; restarting after ${RestartDelaySeconds}s"
  }
  catch {
    Write-DaemonLog "agent-loop run #$runCount crashed: $($_.Exception.Message); restarting after ${RestartDelaySeconds}s"
  }

  Start-Sleep -Seconds $RestartDelaySeconds
}
