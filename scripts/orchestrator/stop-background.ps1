# Stops all background orchestrator workers started by start-background.ps1
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$stateFile = Join-Path $root "logs\orchestrator\worker-processes.json"

if (-not (Test-Path $stateFile)) {
  Write-Host "No worker state file found. Nothing to stop." -ForegroundColor Yellow
  exit 0
}

$raw = Get-Content -Path $stateFile -Raw
if ([string]::IsNullOrWhiteSpace($raw)) {
  Write-Host "Worker state file empty. Nothing to stop." -ForegroundColor Yellow
  exit 0
}

$workers = $raw | ConvertFrom-Json
if ($workers -isnot [System.Array]) {
  $workers = @($workers)
}

$stopped = 0
foreach ($worker in $workers) {
  try {
    $proc = Get-Process -Id $worker.Pid -ErrorAction Stop
    Stop-Process -Id $proc.Id -Force
    $stopped++
  } catch {
    # Already stopped or missing
  }
}

Remove-Item -Path $stateFile -Force -ErrorAction SilentlyContinue
Write-Host "Stopped $stopped orchestration worker processes." -ForegroundColor Green
