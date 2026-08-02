param(
  [string]$WorkspaceRoot = ".",
  [int]$Count = 10
)

$agentsFile = Join-Path $WorkspaceRoot "AGENTS.md"
$queueFile  = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"

if (-not (Test-Path $agentsFile)) { Write-Host "[WARN] AGENTS.md not found."; exit 1 }
if (-not (Test-Path $queueFile))  { Write-Host "[WARN] task-queue.json not found."; exit 1 }

$q = Get-Content $queueFile -Raw | ConvertFrom-Json
$existingTasks = @($q.tasks)
$existingTitles = @($existingTasks | Select-Object -ExpandProperty title | ForEach-Object { $_.Trim().ToLower() })

# Find the max taskId to continue incrementing
$maxId = 0
foreach ($t in $existingTasks) {
  if ($t.taskId -match "T(\d+)") {
    $num = [int]$matches[1]
    if ($num -gt $maxId) { $maxId = $num }
  }
}

# Parse AGENTS.md
$lines = Get-Content $agentsFile
$availableTasks = @()
$currentAgent = ""

foreach ($line in $lines) {
  if ($line -match "### \d+\.\s+\*\*(@[a-zA-Z0-9_-]+).*\*\*") {
    $currentAgent = $matches[1]
  }
  elseif ($line -match "\*\*Queue:\*\*\s*(.*)") {
    if ($currentAgent -ne "") {
      $queueStr = $matches[1]
      $tasks = $queueStr -split ","
      foreach ($taskTitle in $tasks) {
        $cleanTitle = $taskTitle.Trim()
        if ([string]::IsNullOrWhiteSpace($cleanTitle)) { continue }
        
        if ($existingTitles -notcontains $cleanTitle.ToLower()) {
          $availableTasks += @{ Agent = $currentAgent; Title = $cleanTitle }
        }
      }
    }
  }
}

if ($availableTasks.Count -eq 0) {
  Write-Host "  [REFILL] No new tasks available in AGENTS.md queues." -ForegroundColor DarkGray
  exit 0
}

# Pick up to $Count tasks
$toAdd = $availableTasks | Select-Object -First $Count
$now = (Get-Date).ToString("o")

# Create task objects
foreach ($t in $toAdd) {
  $maxId++
  $newId = "T" + "$maxId".PadLeft(3, "0")
  
  # For lane assignment, default to 'A' or infer from Agent. Just using 'A' for dynamic tasks.
  $lane = "A" 
  
  $newTask = @{
    taskId = $newId
    agent = $t.Agent
    lane = $lane
    title = $t.Title
    status = "queued"
    dependsOn = @()
    requiresFeedsAck = $false
    feedsAckBy = $null
    attempts = 0
    createdAt = $now
    startedAt = $null
    finishedAt = $null
    evidence = @{}
  }
  
  $existingTasks += $newTask
  Write-Host "  [REFILL] Added $newId for $($t.Agent): $($t.Title)" -ForegroundColor Cyan
}

$q.tasks = $existingTasks
$q | ConvertTo-Json -Depth 8 | Set-Content -Path $queueFile -Encoding UTF8

Write-Host "  [REFILL] Successfully appended $($toAdd.Count) tasks to the queue." -ForegroundColor Green
