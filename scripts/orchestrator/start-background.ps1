# Starts background worker pool for free-agent orchestration (MVP)
param(
  [int]$WorkerCount = 4,
  [int]$PollSeconds = 30
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$stateDir = Join-Path $root "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$pidFile = Join-Path $stateDir "worker-processes.json"

$agents = @("@Victoria", "@Invoice", "@Sofia", "@Cassie", "@Joelle", "@Annie", "@Rachel", "@Marissa", "@Timnit", "@Hedy", "@Maya", "@Booking", "@Jaime", "@Fei-Fei", "@Anima", "@Mary", "@Corinne")

$processes = @()
for ($i = 0; $i -lt $WorkerCount; $i++) {
  $agent = $agents[$i % $agents.Count]
  $script = Join-Path $PSScriptRoot "worker.ps1"

  $proc = Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", "`"$script`"",
    "-AgentName", "`"$agent`"",
    "-PollSeconds", "$PollSeconds",
    "-WorkspaceRoot", "`"$root`""
  ) -WindowStyle Hidden -PassThru

  $processes += [PSCustomObject]@{
    WorkerIndex = $i
    Agent = $agent
    Pid = $proc.Id
    StartedAt = (Get-Date).ToString("o")
  }
}

$processes | ConvertTo-Json -Depth 4 | Set-Content -Path $pidFile -Encoding UTF8

Write-Host "Started $($processes.Count) orchestration workers." -ForegroundColor Green
Write-Host "State file: $pidFile"
Write-Host "Use scripts/orchestrator/stop-background.ps1 to stop all workers."
