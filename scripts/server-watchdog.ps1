param(
  [ValidateRange(1, 65535)]
  [int]$Port = 5001,
  [ValidateRange(1, 3600)]
  [int]$CheckIntervalSec = 30,
  [ValidateRange(5, 600)]
  [int]$BootGraceSec = 90
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$child = $null

function Test-BackendHealth {
  try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 5
    return ($health.status -eq 'OK' -and $health.service -eq 'white-caves-api' -and $health.authenticationRequired -eq $true)
  } catch {
    Write-Verbose "Health probe failed: $($_.Exception.Message)"
    return $false
  }
}

if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
  throw "Port $Port is already occupied. This supervisor will not adopt or stop another process."
}

$node = (Get-Command node -ErrorAction Stop).Source
$env:API_PORT = "$Port"
$env:NODE_ENV = 'production'
$env:DEV_AUTH_BYPASS = 'false'
$env:NODE_OPTIONS = '--max-old-space-size=4096'

try {
  while ($true) {
    # Run Node directly so the stored PID is the backend, not an npm/cmd wrapper.
    $child = Start-Process -FilePath $node -ArgumentList '--import', 'tsx', 'server/index.ts' `
      -WorkingDirectory $repoRoot -NoNewWindow -PassThru
    Write-Host "[watchdog] Started owned backend PID $($child.Id)"
    $deadline = (Get-Date).AddSeconds($BootGraceSec)
    $healthy = $false
    while ((Get-Date) -lt $deadline -and -not $child.HasExited) {
      if (Test-BackendHealth) { $healthy = $true; break }
      Start-Sleep -Seconds 2
      $child.Refresh()
    }
    if (-not $healthy) {
      throw "Owned backend did not become healthy within $BootGraceSec seconds. Inspect backend logs before restarting."
    }
    while (-not $child.HasExited) {
      Start-Sleep -Seconds $CheckIntervalSec
      $child.Refresh()
      if (-not $child.HasExited -and -not (Test-BackendHealth)) {
        Write-Warning "[watchdog] Owned backend is unhealthy. Not killing a live process on a transient probe failure."
      }
    }
    Write-Warning "[watchdog] Backend exited ($($child.ExitCode)); retrying in 5 seconds."
    $child.Dispose()
    $child = $null
    Start-Sleep -Seconds 5
    if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
      throw "Port $Port was acquired by another process; refusing to restart."
    }
  }
} finally {
  if ($null -ne $child) {
    $child.Refresh()
    if (-not $child.HasExited) {
      # Use the retained process handle, not a port lookup or a recycled PID.
      $child.Kill()
      $child.WaitForExit()
    }
    $child.Dispose()
  }
}
