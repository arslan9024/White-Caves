param(
  [string]$WorkspaceRoot = "."
)

$stateDir = Join-Path $WorkspaceRoot "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$queueFile = Join-Path $stateDir "task-queue.json"

$now = (Get-Date).ToString("o")

$tasks = @(
  @{ taskId = "T001"; agent = "@Sofia"; lane = "A"; title = "Compliance baseline expansion"; status = "queued"; dependsOn = @(); requiresFeedsAck = $true; feedsAckBy = "@Timnit"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T002"; agent = "@Timnit"; lane = "A"; title = "DLD/legal integration expansion"; status = "queued"; dependsOn = @("T001"); requiresFeedsAck = $true; feedsAckBy = "@Victoria"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T003"; agent = "@Victoria"; lane = "A"; title = "Tenancy legal workflow completion"; status = "queued"; dependsOn = @("T002"); requiresFeedsAck = $true; feedsAckBy = "@Annie"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T004"; agent = "@Annie"; lane = "A"; title = "Tenant portal and doc-gen expansion"; status = "queued"; dependsOn = @("T003"); requiresFeedsAck = $true; feedsAckBy = "@Marissa"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T005"; agent = "@Marissa"; lane = "A"; title = "UX and luxury journey synthesis"; status = "queued"; dependsOn = @("T004"); requiresFeedsAck = $true; feedsAckBy = "@Rachel"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T006"; agent = "@Rachel"; lane = "A"; title = "SEO/marketing strategy enrichment"; status = "queued"; dependsOn = @("T005"); requiresFeedsAck = $true; feedsAckBy = "@Joelle"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T007"; agent = "@Joelle"; lane = "A"; title = "AI persona and fallback matrix handoff"; status = "queued"; dependsOn = @("T006"); requiresFeedsAck = $false; feedsAckBy = $null; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },

  @{ taskId = "T008"; agent = "@Fei-Fei"; lane = "B"; title = "Valuation and market inputs"; status = "queued"; dependsOn = @(); requiresFeedsAck = $true; feedsAckBy = "@Anima"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T009"; agent = "@Anima"; lane = "B"; title = "Data pipeline and secondary-sales bridge"; status = "queued"; dependsOn = @("T008"); requiresFeedsAck = $true; feedsAckBy = "@Mary"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T010"; agent = "@Mary"; lane = "B"; title = "Inventory-investment synthesis"; status = "queued"; dependsOn = @("T009"); requiresFeedsAck = $true; feedsAckBy = "@Invoice"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T011"; agent = "@Invoice"; lane = "B"; title = "Financial modeling and KPI bridge"; status = "queued"; dependsOn = @("T010"); requiresFeedsAck = $false; feedsAckBy = $null; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },

  @{ taskId = "T012"; agent = "@Booking"; lane = "C"; title = "Viewing and scheduling contracts"; status = "queued"; dependsOn = @(); requiresFeedsAck = $true; feedsAckBy = "@Maya"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T013"; agent = "@Maya"; lane = "C"; title = "Off-plan handover flow"; status = "queued"; dependsOn = @("T012"); requiresFeedsAck = $true; feedsAckBy = "@Hedy"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T014"; agent = "@Hedy"; lane = "C"; title = "Audit and follow-up controls"; status = "queued"; dependsOn = @("T013"); requiresFeedsAck = $true; feedsAckBy = "@Cassie"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T015"; agent = "@Cassie"; lane = "C"; title = "Analytics synthesis and KPI evidence"; status = "queued"; dependsOn = @("T014"); requiresFeedsAck = $false; feedsAckBy = $null; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },

  @{ taskId = "T016"; agent = "@Jaime"; lane = "D"; title = "Offers and WhatsApp routing"; status = "queued"; dependsOn = @(); requiresFeedsAck = $true; feedsAckBy = "@Corinne"; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} },
  @{ taskId = "T017"; agent = "@Corinne"; lane = "D"; title = "AI chat and maintenance mapping"; status = "queued"; dependsOn = @("T016"); requiresFeedsAck = $false; feedsAckBy = $null; attempts = 0; createdAt = $now; startedAt = $null; finishedAt = $null; evidence = @{} }
)

$payload = @{
  version = "1.0"
  generatedAt = $now
  tasks = $tasks
}

$payload | ConvertTo-Json -Depth 8 | Set-Content -Path $queueFile -Encoding UTF8
Write-Host "Initialized orchestrator queue at $queueFile" -ForegroundColor Green
