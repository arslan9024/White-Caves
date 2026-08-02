param(
    [string]$QueueFile = "C:/Users/HP/WCAG/White-Caves/logs/orchestrator/task-queue.json",
    [int]$StartId = 1000,
    [int]$Count = 100
)

# Load existing queue
$queueJson = Get-Content $QueueFile -Raw | ConvertFrom-Json
$agents = @("@Victoria","@Invoice","@Sofia","@Cassie","@Joelle","@Annie","@Marissa","@Timnit","@Fei-Fei","@Anima","@Mary","@Basma","@Dina","@Layla","@Maha")
$lanes = @("A","B","C","D")

$now = Get-Date -Format o

for ($i = 0; $i -lt $Count; $i++) {
    $taskIdNum = $StartId + $i
    $taskIdStr = "T$taskIdNum"
    $agent = $agents[$i % $agents.Length]
    $lane = $lanes[$i % $lanes.Length]
    $newTask = [pscustomobject]@{
        dependsOn = @()
        createdAt = $now
        agent = $agent
        title = "Placeholder task $taskIdNum"
        feedsAckBy = ""
        lane = $lane
        taskId = $taskIdStr
        requiresFeedsAck = $false
        evidence = @{}
        attempts = 0
        finishedAt = $null
        status = "pending"
        startedAt = $null
        completedAt = $null
        evidenceNote = ""
        autoComplete = $false
    }
    $queueJson.tasks += $newTask
}

# Write back to file with indentation
$queueJson | ConvertTo-Json -Depth 10 | Set-Content -Path $QueueFile -Encoding UTF8
Write-Host "[INFO] Added $Count placeholder tasks to $QueueFile"
