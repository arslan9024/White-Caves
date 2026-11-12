<#
.SYNOPSIS
  Health-check watchdog for the local White Caves backend.

.DESCRIPTION
  Probes /api/health every CheckIntervalSec seconds. If the backend stops
  answering, kills whatever holds the port and relaunches `npm run dev:server`
  in a new PowerShell window, then waits a boot grace period.

  Pair with scripts/start-tunnel.ps1 (see npm run serve:bridge) so the
  tunnel + backend combo self-heals after crashes, reboots, or ISP hiccups.
#>
param(
  [int]$Port = 5001,
  [int]$CheckIntervalSec = 30,
  [int]$BootGraceSec = 20
)

$ErrorActionPreference = 'Continue'
$repoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "[watchdog] Monitoring http://localhost:$Port/api/health every $CheckIntervalSec s" -ForegroundColor Cyan

while ($true) {
  $healthy = $false
  try {
    $null = Invoke-RestMethod -Uri "http://localhost:$Port/api/health" -TimeoutSec 5
    $healthy = $true
  } catch {
    $healthy = $false
  }

  if (-not $healthy) {
    Write-Host "[watchdog $(Get-Date -Format 'HH:mm:ss')] Backend unhealthy - restarting..." -ForegroundColor Red

    $listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($listeners) {
      $listeners | Select-Object -ExpandProperty OwningProcess -Unique |
        Where-Object { $_ -gt 0 } |
        ForEach-Object {
          try {
            Stop-Process -Id $_ -Force -ErrorAction Stop
            Write-Host "[watchdog] Stopped stale PID $_" -ForegroundColor Yellow
          } catch {
            Write-Warning "[watchdog] Could not stop PID $_"
          }
        }
    }

    Start-Process powershell -ArgumentList '-NoExit', '-Command', 'npm run dev:server' -WorkingDirectory $repoRoot
    Write-Host "[watchdog] Relaunched dev:server - waiting $BootGraceSec s boot grace" -ForegroundColor Cyan
    Start-Sleep -Seconds $BootGraceSec
  }

  Start-Sleep -Seconds $CheckIntervalSec
}
