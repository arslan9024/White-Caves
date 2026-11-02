# Auto‑Task Generator for White‑Caves
# ---------------------------------------------------------------
# Generates 20 generic high‑impact tasks and adds them to the orchestrator
# queue (task‑queue.json) if they do not already exist. Each task gets a
# unique ID AUTO001‑AUTO020, is assigned to a rotating set of agents, and
# placed in lane A for simplicity.

param(
    [string]$QueueFile = "C:/Users/HP/WCAG/White-Caves/logs/orchestrator/task-queue.json"
)

# Load existing queue (or initialise empty structure)
if (Test-Path $QueueFile) {
    $queue = Get-Content $QueueFile -Raw | ConvertFrom-Json
} else {
    $queue = [pscustomobject]@{ tasks = @() }
}

# Define 20 task titles (feel free to customise)
$titles = @(
    "Add unit tests for tenancy‑ejari workflow",
    "Upgrade UI to dark‑mode with glassmorphism",
    "Implement lazy‑load for property images",
    "Add accessibility aria‑labels to navigation",
    "Migrate CSS to design‑token system",
    "Add SEO meta‑tags for property pages",
    "Integrate OpenAI‑based property recommendation API",
    "Add automated security audit script",
    "Implement CI/CD pipeline for frontend assets",
    "Add client‑side input validation for forms",
    "Create interactive map component with clustering",
    "Add analytics event tracking for user actions",
    "Refactor data‑export service to use streaming JSON",
    "Add error‑boundary component for React UI",
    "Implement feature flag system for beta releases",
    "Add automated end‑to‑end tests with Playwright",
    "Upgrade Node.js runtime to LTS version",
    "Add GDPR‑compliant data‑retention policy",
    "Implement server‑side rendering for SEO",
    "Add multilingual support for Arabic/English UI"
)

$agents = @("@Victoria","@Invoice","@Sofia","@Cassie","@Joelle","@Annie","@Rachel","@Marissa","@Timnit","@Hedy")

for ($i = 0; $i -lt $titles.Count; $i++) {
    $taskId = "AUTO{0:D3}" -f ($i + 1)
    # Skip if task already exists
    if ($queue.tasks | Where-Object { $_.taskId -eq $taskId }) { continue }

    $task = [pscustomobject]@{
        taskId            = $taskId
        title             = $titles[$i]
        agent             = $agents[$i % $agents.Count]
        lane              = "A"
        status            = "queued"
        createdAt         = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffffffK")
        requiresFeedsAck  = $false
        evidence          = @{}
        dependsOn         = @()
        attempts          = 0
        finishedAt        = $null
        startedAt         = $null
        completedAt       = $null
        evidenceNote      = ""
        autoComplete      = $false
    }
    $queue.tasks += $task
}

# Write back JSON (pretty‑printed)
$queue | ConvertTo-Json -Depth 10 | Set-Content -Path $QueueFile -Encoding utf8

Write-Host "[Auto‑Task Generator] Added $($titles.Count) tasks to queue (if not already present)."
