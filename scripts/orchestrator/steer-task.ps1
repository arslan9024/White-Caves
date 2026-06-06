param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [string]$Reason = "manual steering"
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$logsDir = Join-Path $root "logs\orchestrator"
$steeringFile = Join-Path $logsDir "task-steering.json"

if (-not (Test-Path $logsDir)) {
  New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

$queueFile = Join-Path $logsDir "task-queue.json"
$priorityFile = Join-Path $logsDir "priority-order.json"
if (-not (Test-Path $queueFile)) {
  Write-Host "Queue file not found. Initialize the queue first." -ForegroundColor Red
  exit 1
}

$queue = Get-Content -Path $queueFile -Raw | ConvertFrom-Json
$priorityOrder = $null
if (Test-Path $priorityFile) {
  try {
    $priorityOrder = Get-Content -Path $priorityFile -Raw | ConvertFrom-Json
  }
  catch {
    $priorityOrder = $null
  }
}

$match = $null
if ($null -ne $queue -and $null -ne $queue.tasks) {
  $match = @($queue.tasks | Where-Object { [string]$_.taskId -eq $TaskId -or [string]$_.id -eq $TaskId } | Select-Object -First 1)
}

if (($null -eq $match -or $match.Count -eq 0) -and $null -ne $priorityOrder -and $null -ne $priorityOrder.orderedTasks) {
  $match = @($priorityOrder.orderedTasks | Where-Object { [string]$_.taskId -eq $TaskId -or [string]$_.id -eq $TaskId } | Select-Object -First 1)
}

if ($null -eq $match -or $match.Count -eq 0) {
  Write-Host "Task '$TaskId' not found in the current queue." -ForegroundColor Red
  exit 1
}

$task = $match | Select-Object -First 1
$taskIdValue = $task.taskId
if ([string]::IsNullOrWhiteSpace([string]$taskIdValue)) {
  $taskIdValue = $task.id
}

$payload = [PSCustomObject]@{
  timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
  taskId    = [string]$taskIdValue
  agent     = [string]$task.agent
  title     = [string]$task.title
  reason    = $Reason
}

$payload | ConvertTo-Json -Depth 4 | Set-Content -Path $steeringFile
Write-Host ("Steering saved: " + $payload.taskId + " - " + $payload.title) -ForegroundColor Green