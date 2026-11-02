# Auto‑Analyze & Generate Improvement Tasks
# ---------------------------------------------------------------
# This script performs a lightweight static analysis of the JavaScript/TypeScript source tree using ESLint,
# extracts the most frequent warning types, and creates up to 20 new tasks (AUTO‑xxx) in the orchestrator queue.
# It is intended to be run automatically (e.g., via a daily cron) so the autopilot loop can pick up fresh work.

param(
    [string]$Root = "C:/Users/HP/WCAG/White-Caves",
    [string]$QueueFile = "C:/Users/HP/WCAG/White-Caves/logs/orchestrator/task-queue.json"
)

function Ensure-ESLint {
    $eslintPath = "$(npm bin)/eslint"
    if (-not (Test-Path $eslintPath)) {
        Write-Host "[INFO] ESLint not found – installing…" -ForegroundColor Yellow
        npm install eslint --no-save | Out-Null
        $eslintPath = "$(npm bin)/eslint"
    }
    return $eslintPath
}

function Invoke-ESLint {
    $eslintPath = Ensure-ESLint
    $srcPattern = "${Root}/**/*.js"
    $json = & $eslintPath $srcPattern --format json 2>$null
    return $json | ConvertFrom-Json
}

# Load existing task queue (or create an empty array)
if (Test-Path $QueueFile) {
    $taskQueue = Get-Content $QueueFile -Raw | ConvertFrom-Json
} else {
    $taskQueue = @()
}

# Run analysis and collect rule frequencies
$eslintResults = Invoke-ESLint
$ruleCounts = @{}
foreach ($fileResult in $eslintResults) {
    foreach ($msg in $fileResult.messages) {
        $ruleId = $msg.ruleId
        if ($null -ne $ruleId) {
            if (-not $ruleCounts.ContainsKey($ruleId)) { $ruleCounts[$ruleId] = 0 }
            $ruleCounts[$ruleId] += 1
        }
    }
}

# Pick the top 20 most frequent warnings
$topRules = $ruleCounts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 20

foreach ($entry in $topRules) {
    $ruleId = $entry.Key
    $count  = $entry.Value
    $taskId = "AUTO-$(New-Guid)"
    $title  = "Fix $ruleId warnings ($count occurrences)"
    $task   = @{ taskId = $taskId; title = $title; status = "open"; created = (Get-Date).ToString("o") }
    $taskQueue += $task
    Write-Host "[TASK] Created $taskId: $title" -ForegroundColor Cyan
}

# Write updated queue back to file (compact JSON)
$taskQueue | ConvertTo-Json -Depth 10 -Compress | Set-Content -Path $QueueFile -Encoding UTF8

Write-Host "[INFO] Task generation complete. Total tasks in queue: $($taskQueue.Count)" -ForegroundColor Green
