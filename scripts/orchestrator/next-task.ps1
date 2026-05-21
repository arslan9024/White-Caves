# next-task.ps1 -- Show agent next queued task and AI prompt to paste
# Loads prompts from scripts/orchestrator/prompts.json (ASCII-safe)
param(
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [string]$WorkspaceRoot = ".",
  [switch]$Claim
)

$stateDir   = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile  = Join-Path $stateDir "task-queue.json"
$promptFile = Join-Path $WorkspaceRoot "scripts\orchestrator\prompts.json"

if (-not (Test-Path $promptFile)) {
  Write-Host "[ERROR] prompts.json not found: $promptFile" -ForegroundColor Red
  exit 1
}
$prompts = [System.IO.File]::ReadAllText($promptFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$toolMap = @{
  "@Sofia"    = "Google AI Studio (Gemini 2.0 Flash)  https://aistudio.google.com/"
  "@Timnit"   = "Google AI Studio (Gemini 2.0 Flash)  https://aistudio.google.com/"
  "@Victoria" = "Google AI Studio (Gemini 2.0 Flash)  https://aistudio.google.com/"
  "@Annie"    = "Google AI Studio (Gemini 2.0 Flash)  https://aistudio.google.com/"
  "@Marissa"  = "Google AI Studio (Gemini 2.0 Flash)  https://aistudio.google.com/"
  "@Rachel"   = "Google AI Studio (Gemini 2.0 Flash)  https://aistudio.google.com/"
  "@Joelle"   = "Groq Console (Llama 3.1 70B)         https://console.groq.com/"
  "@Fei-Fei"  = "DeepSeek Chat (DeepSeek V3)          https://chat.deepseek.com/"
  "@Anima"    = "DeepSeek Chat (DeepSeek V3)          https://chat.deepseek.com/"
  "@Mary"     = "DeepSeek Chat (DeepSeek V3)          https://chat.deepseek.com/"
  "@Invoice"  = "Groq Console (Llama 3.1 70B)         https://console.groq.com/"
  "@Booking"  = "Groq Console (Llama 3.1 70B)         https://console.groq.com/"
  "@Maya"     = "Groq Console (Llama 3.1 70B)         https://console.groq.com/"
  "@Hedy"     = "Groq Console (Llama 3.1 70B)         https://console.groq.com/"
  "@Cassie"   = "DeepSeek Chat (DeepSeek V3)          https://chat.deepseek.com/"
  "@Jaime"    = "Groq Console (Llama 3.1 70B)         https://console.groq.com/"
  "@Corinne"  = "DeepSeek Chat (DeepSeek V3)          https://chat.deepseek.com/"
}

if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue not found. Run: npm run orchestrator:queue:init" -ForegroundColor Red
  exit 1
}
$queue = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks = @($queue.tasks)

function Test-DepsDone {
  param([array]$deps, $allTasks)
  foreach ($d in $deps) {
    $dep = $allTasks | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
    if ($null -eq $dep -or $dep.status -ne "done") { return $false }
  }
  return $true
}

$agentTasks = $tasks | Where-Object { $_.agent -eq $AgentName }
if ($agentTasks.Count -eq 0) {
  Write-Host "[ERROR] No tasks for agent: $AgentName" -ForegroundColor Red
  exit 1
}

$nextTask = $agentTasks |
  Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" } |
  Sort-Object createdAt |
  Where-Object { Test-DepsDone -deps @($_.dependsOn) -allTasks $tasks } |
  Select-Object -First 1

if ($null -eq $nextTask) {
  $running = @($agentTasks | Where-Object { $_.status -eq "running" })
  $waiting = @($agentTasks | Where-Object { $_.status -eq "waiting_ack" })
  $done    = @($agentTasks | Where-Object { $_.status -eq "done" })
  $blocked = @($agentTasks | Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" })
  if ($running.Count -gt 0) {
    Write-Host "[RUNNING] Task $($running[0].taskId) is in progress." -ForegroundColor Cyan
  } elseif ($waiting.Count -gt 0) {
    Write-Host "[WAITING ACK] Task $($waiting[0].taskId) needs FEEDS_ACK from $($waiting[0].feedsAckBy)." -ForegroundColor Yellow
  } elseif ($blocked.Count -gt 0) {
    Write-Host "[BLOCKED] Tasks waiting on upstream deps:" -ForegroundColor Magenta
    foreach ($b in $blocked) {
      Write-Host "  $($b.taskId) blocked on: $($b.dependsOn -join ', ')" -ForegroundColor DarkGray
    }
  } else {
    Write-Host "[ALL DONE] All $($done.Count) tasks done for $AgentName." -ForegroundColor Green
  }
  exit 0
}

$taskId  = $nextTask.taskId
$propVal = $prompts.PSObject.Properties | Where-Object { $_.Name -eq $taskId } | Select-Object -ExpandProperty Value
if ($null -eq $propVal) { $propVal = "(no prompt for $taskId -- add to prompts.json)" }
$tool = if ($toolMap.ContainsKey($AgentName)) { $toolMap[$AgentName] } else { "See AGENTS.md" }

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  NEXT TASK FOR $AgentName" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Task ID : $taskId" -ForegroundColor White
Write-Host "  Title   : $($nextTask.title)" -ForegroundColor White
Write-Host "  Lane    : $($nextTask.lane)   Status: $($nextTask.status)" -ForegroundColor DarkGray
Write-Host "  Tool    : $tool" -ForegroundColor Green
Write-Host ""
Write-Host "  +--- PASTE THIS PROMPT ---+" -ForegroundColor Yellow
Write-Host ""

$words = $propVal -split " "
$line  = "  | "
foreach ($word in $words) {
  if (($line + $word).Length -gt 88) {
    Write-Host $line -ForegroundColor White
    $line = "  | "
  }
  $line = $line + $word + " "
}
if ($line.Trim().Length -gt 2) { Write-Host $line -ForegroundColor White }

Write-Host ""
Write-Host "  +-------------------------+" -ForegroundColor Yellow
Write-Host ""

$doneCount = @($tasks | Where-Object { $_.agent -eq $AgentName -and $_.status -eq "done" }).Count
Write-Host "  Progress : $doneCount / $($agentTasks.Count) tasks done for $AgentName" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  After saving the AI output to the target file, run:" -ForegroundColor White
Write-Host "  npm run orchestrator:complete-advance -- -TaskId $taskId -AgentName `"$AgentName`"" -ForegroundColor Gray
Write-Host ""

if ($Claim) {
  $dp = Join-Path $PSScriptRoot "dispatch.ps1"
  if (Test-Path $dp) {
    & $dp -AgentName $AgentName -WorkspaceRoot $WorkspaceRoot | Out-Null
    Write-Host "  [CLAIMED] Task $taskId marked as running." -ForegroundColor Cyan
  }
}