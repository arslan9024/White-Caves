# output-log.ps1 -- Persist AI output text against a task ID.
# Saves to logs/orchestrator/outputs/TASKID.md  and attaches a reference
# to the task's evidence block in the queue.
param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [string]$WorkspaceRoot = ".",
  [string]$OutputFile    = "",   # path to a file containing AI output (optional)
  [string]$OutputText    = "",   # inline AI output text (optional)
  [string]$TargetFile    = ""    # business_docs/ path where output was saved
)

if ($OutputFile -eq "" -and $OutputText -eq "") {
  Write-Host "[ERROR] Provide either -OutputFile or -OutputText." -ForegroundColor Red
  exit 1
}

$stateDir   = Join-Path $WorkspaceRoot "logs\orchestrator"
$outputsDir = Join-Path $stateDir "outputs"
$queueFile  = Join-Path $stateDir "task-queue.json"
New-Item -ItemType Directory -Force -Path $outputsDir | Out-Null

# ── Determine content ─────────────────────────────────────────────────────────
if ($OutputFile -ne "" -and (Test-Path $OutputFile)) {
  $content = Get-Content $OutputFile -Raw
}
elseif ($OutputText -ne "") {
  $content = $OutputText
}
else {
  Write-Host "[ERROR] Output file not found: $OutputFile" -ForegroundColor Red
  exit 1
}

# ── Write output log ──────────────────────────────────────────────────────────
$logPath  = Join-Path $outputsDir "$TaskId.md"
$header   = @(
  "# AI Output Log -- $TaskId"
  ""
  "**Agent**     : $AgentName"
  "**Task ID**   : $TaskId"
  "**Logged At** : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  if ($TargetFile -ne "") { "**Target File**: $TargetFile" }
  ""
  "---"
  ""
)
$fullContent = ($header -join "`n") + $content
$fullContent | Set-Content -Path $logPath -Encoding UTF8

Write-Host "[LOGGED] Output saved to: $logPath" -ForegroundColor Green

# ── Update task evidence in queue ─────────────────────────────────────────────
$mutex = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")
try {
  $null = $mutex.WaitOne()

  if (Test-Path $queueFile) {
    $raw   = Get-Content $queueFile -Raw
    $queue = $raw | ConvertFrom-Json
    $task  = @($queue.tasks) | Where-Object { $_.taskId -eq $TaskId } | Select-Object -First 1

    if ($null -ne $task) {
      $outputRef = "logs/orchestrator/outputs/$TaskId.md"
      if ($TargetFile -ne "") {
        $task | Add-Member -NotePropertyName "outputRef"   -NotePropertyValue $outputRef  -Force
        $task | Add-Member -NotePropertyName "targetFile"  -NotePropertyValue $TargetFile -Force
      }
      else {
        $task | Add-Member -NotePropertyName "outputRef"   -NotePropertyValue $outputRef  -Force
      }
      $task | Add-Member -NotePropertyName "outputLoggedAt" -NotePropertyValue (Get-Date).ToString("o") -Force

      $queue | ConvertTo-Json -Depth 12 | Set-Content -Path $queueFile -Encoding UTF8
      Write-Host "[QUEUE]  Task $TaskId evidence updated with output reference." -ForegroundColor Cyan
    }
  }
}
finally {
  $mutex.ReleaseMutex()
}

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Output log stored. Next step:" -ForegroundColor White
if ($TargetFile -ne "") {
  Write-Host "  git add $TargetFile" -ForegroundColor Gray
  Write-Host ("  git commit -m " + '"' + "docs($AgentName): $TaskId expansion" + '"') -ForegroundColor Gray
}
Write-Host "  npm run orchestrator:complete-advance -- -TaskId $TaskId -AgentName '$AgentName'" -ForegroundColor Gray
Write-Host ""
