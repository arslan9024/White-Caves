# cycle-summary.ps1 -- Record/query per-loop cycle summary data

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Record,
  [int]$Cycle = 0,
  [string]$Agent = "",
  [string]$TaskId = "",
  [bool]$ErrorScanPassed = $true,
  [bool]$SyncedFromMain = $false,
  [bool]$PushedToMain = $false,
  [int]$PromptVersion = 1,
  [int]$Last = 10,
  [switch]$Json
)

$root = Resolve-Path $WorkspaceRoot
$logPath = Join-Path $root "logs\orchestrator\cycle-log.json"

$rows = @()
if (Test-Path $logPath) {
  try {
    $existing = Get-Content $logPath -Raw | ConvertFrom-Json
    if ($existing -is [System.Collections.IEnumerable]) { $rows = @($existing) }
    elseif ($null -ne $existing) { $rows = @($existing) }
  } catch {
    $rows = @()
  }
}

if ($Record) {
  $entry = [pscustomobject]@{
    cycle = $Cycle
    date = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
    agent = $Agent
    taskId = $TaskId
    errorScanPassed = $ErrorScanPassed
    syncedFromMain = $SyncedFromMain
    pushedToMain = $PushedToMain
    promptVersion = $PromptVersion
  }
  $rows += $entry
  $jsonOut = $rows | ConvertTo-Json -Depth 6
  $dir = Split-Path $logPath -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($logPath, $jsonOut, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host ("Recorded cycle summary: #{0} {1}" -f $Cycle, $TaskId) -ForegroundColor Green
  exit 0
}

$viewRows = $rows | Select-Object -Last $Last
if ($Json) {
  Write-Output ($viewRows | ConvertTo-Json -Depth 6)
  exit 0
}

Write-Host ""
Write-Host "Recent cycle summaries:" -ForegroundColor Cyan
foreach ($r in $viewRows) {
  Write-Host ("  cycle={0} task={1} agent={2} scan={3} sync={4} promptV={5}" -f $r.cycle, $r.taskId, $r.agent, $r.errorScanPassed, $r.syncedFromMain, $r.promptVersion) -ForegroundColor White
}
Write-Host ""
Write-Host ("File: {0}" -f $logPath) -ForegroundColor DarkGray
exit 0
