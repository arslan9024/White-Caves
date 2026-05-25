# blocker-auto-escalate.ps1 -- Auto-escalate retrying/waiting_ack tasks stuck for multiple cycles

param(
  [string]$WorkspaceRoot = ".",
  [int]$MaxCycles = 2
)

$root = Resolve-Path $WorkspaceRoot
$queueFile = Join-Path $root "logs\orchestrator\task-queue.json"
$cycleFile = Join-Path $root "logs\orchestrator\cycle-log.json"
$escalationFile = Join-Path $root "logs\orchestrator\escalations.json"

if (-not (Test-Path $queueFile)) {
  Write-Host "[SKIP] queue not found for escalation." -ForegroundColor DarkGray
  exit 0
}

$tasks = @((Get-Content $queueFile -Raw | ConvertFrom-Json).tasks)
$cycleData = @()
if (Test-Path $cycleFile) {
  try {
    $cd = Get-Content $cycleFile -Raw | ConvertFrom-Json
    if ($cd -is [System.Collections.IEnumerable]) { $cycleData = @($cd) }
    elseif ($null -ne $cd) { $cycleData = @($cd) }
  } catch { $cycleData = @() }
}

$escalations = @()
if (Test-Path $escalationFile) {
  try {
    $ed = Get-Content $escalationFile -Raw | ConvertFrom-Json
    if ($ed -is [System.Collections.IEnumerable]) { $escalations = @($ed) }
    elseif ($null -ne $ed) { $escalations = @($ed) }
  } catch { $escalations = @() }
}

$stuckStatuses = @("retrying", "waiting_ack")
$newEscalations = [System.Collections.Generic.List[object]]::new()

foreach ($t in $tasks) {
  if ($stuckStatuses -notcontains $t.status) { continue }

  $taskCycles = @($cycleData | Where-Object { $_.taskId -eq $t.taskId }).Count
  if ($taskCycles -le $MaxCycles) { continue }

  $already = @($escalations | Where-Object { $_.taskId -eq $t.taskId -and $_.status -eq $t.status }) | Select-Object -First 1
  if ($null -ne $already) { continue }

  $blockingDep = ""
  foreach ($dep in @($t.dependsOn)) {
    $depTask = @($tasks | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1)
    if ($null -eq $depTask -or $depTask.status -ne "done") {
      $blockingDep = $dep
      break
    }
  }

  $owner = if ($t.status -eq "waiting_ack") { "@Katherine" } else { "@Ada" }
  $payload = [pscustomobject]@{
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
    taskId = $t.taskId
    agent = $t.agent
    status = $t.status
    cyclesObserved = $taskCycles
    blockingDependency = $blockingDep
    suggestedResolution = if ($t.status -eq "waiting_ack") { "Collect FEEDS_ACK for task and rerun ack step" } else { "Inspect retry root cause, reset task or fix upstream dependency" }
    owner = $owner
  }

  $newEscalations.Add($payload) | Out-Null
  Write-Host ""
  Write-Host "[ESCALATION] Task appears stuck" -ForegroundColor Yellow
  Write-Host ("  Task  : {0} ({1})" -f $t.taskId, $t.agent) -ForegroundColor White
  Write-Host ("  State : {0} for {1} cycles" -f $t.status, $taskCycles) -ForegroundColor White
  if (-not [string]::IsNullOrWhiteSpace($blockingDep)) {
    Write-Host ("  Block : dependency {0}" -f $blockingDep) -ForegroundColor DarkGray
  }
  Write-Host ("  Owner : {0}" -f $owner) -ForegroundColor Cyan
}

if ($newEscalations.Count -gt 0) {
  $escalations += @($newEscalations)
  $json = $escalations | ConvertTo-Json -Depth 6
  [System.IO.File]::WriteAllText($escalationFile, $json, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host ""
  Write-Host ("Escalations appended: {0}" -f $newEscalations.Count) -ForegroundColor Yellow
  Write-Host ("File: {0}" -f $escalationFile) -ForegroundColor DarkGray
} else {
  Write-Host "[OK] No auto-escalations required." -ForegroundColor Green
}

exit 0
