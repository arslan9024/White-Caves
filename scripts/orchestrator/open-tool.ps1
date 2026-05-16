# open-tool.ps1 -- Open the correct free AI tool in the browser for an agent
# Reads queue, finds next task, opens the right URL, prints the prompt
param(
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [string]$WorkspaceRoot = ".",
  [switch]$NoBrowser  # print URL only, do not open browser
)

$toolUrls = @{
  "@Sofia"    = "https://aistudio.google.com/"
  "@Timnit"   = "https://aistudio.google.com/"
  "@Victoria" = "https://aistudio.google.com/"
  "@Annie"    = "https://aistudio.google.com/"
  "@Marissa"  = "https://aistudio.google.com/"
  "@Rachel"   = "https://aistudio.google.com/"
  "@Joelle"   = "https://console.groq.com/"
  "@Fei-Fei"  = "https://chat.deepseek.com/"
  "@Anima"    = "https://chat.deepseek.com/"
  "@Mary"     = "https://chat.deepseek.com/"
  "@Invoice"  = "https://console.groq.com/"
  "@Booking"  = "https://console.groq.com/"
  "@Maya"     = "https://console.groq.com/"
  "@Hedy"     = "https://console.groq.com/"
  "@Cassie"   = "https://chat.deepseek.com/"
  "@Jaime"    = "https://console.groq.com/"
  "@Corinne"  = "https://chat.deepseek.com/"
}

$toolNames = @{
  "@Sofia"    = "Google AI Studio (Gemini 2.0 Flash)"
  "@Timnit"   = "Google AI Studio (Gemini 2.0 Flash)"
  "@Victoria" = "Google AI Studio (Gemini 2.0 Flash)"
  "@Annie"    = "Google AI Studio (Gemini 2.0 Flash)"
  "@Marissa"  = "Google AI Studio (Gemini 2.0 Flash)"
  "@Rachel"   = "Google AI Studio (Gemini 2.0 Flash)"
  "@Joelle"   = "Groq Console (Llama 3.1 70B)"
  "@Fei-Fei"  = "DeepSeek Chat (DeepSeek V3)"
  "@Anima"    = "DeepSeek Chat (DeepSeek V3)"
  "@Mary"     = "DeepSeek Chat (DeepSeek V3)"
  "@Invoice"  = "Groq Console (Llama 3.1 70B)"
  "@Booking"  = "Groq Console (Llama 3.1 70B)"
  "@Maya"     = "Groq Console (Llama 3.1 70B)"
  "@Hedy"     = "Groq Console (Llama 3.1 70B)"
  "@Cassie"   = "DeepSeek Chat (DeepSeek V3)"
  "@Jaime"    = "Groq Console (Llama 3.1 70B)"
  "@Corinne"  = "DeepSeek Chat (DeepSeek V3)"
}

if (-not $toolUrls.ContainsKey($AgentName)) {
  Write-Host "[ERROR] Unknown agent: $AgentName" -ForegroundColor Red
  Write-Host "  Known agents: $($toolUrls.Keys -join ', ')"
  exit 1
}

$url  = $toolUrls[$AgentName]
$tool = $toolNames[$AgentName]

# Show next-task first
$nextTaskScript = Join-Path $PSScriptRoot "next-task.ps1"
if (Test-Path $nextTaskScript) {
  & $nextTaskScript -AgentName $AgentName -WorkspaceRoot $WorkspaceRoot
}

Write-Host "  Opening: $tool" -ForegroundColor Green
Write-Host "  URL    : $url" -ForegroundColor DarkGray
Write-Host ""

if (-not $NoBrowser) {
  try {
    Start-Process $url
    Write-Host "  [OPENED] Browser launched. Paste the prompt above into the tool." -ForegroundColor Cyan
  } catch {
    Write-Host "  [WARN] Could not open browser automatically. Navigate to: $url" -ForegroundColor Yellow
  }
} else {
  Write-Host "  [NO-BROWSER] Navigate manually to: $url" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  When done pasting the AI output into business_docs/, run:" -ForegroundColor White
$queueFile = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
if (Test-Path $queueFile) {
  $queue = Get-Content $queueFile -Raw | ConvertFrom-Json
  $nextT = @($queue.tasks) | Where-Object { $_.agent -eq $AgentName -and ($_.status -eq "queued" -or $_.status -eq "retrying") } | Sort-Object createdAt | Select-Object -First 1
  if ($null -ne $nextT) {
    Write-Host "  npm run orchestrator:complete-advance -- -TaskId $($nextT.taskId) -AgentName `"$AgentName`"" -ForegroundColor Gray
  }
}
Write-Host ""