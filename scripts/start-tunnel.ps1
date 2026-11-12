param(
  [ValidateSet('quick', 'named')]
  [string]$Mode = 'quick',
  [ValidateRange(1, 65535)]
  [int]$Port = 5001,
  [ValidateRange(5, 600)]
  [int]$StartupTimeoutSec = 120,
  [ValidatePattern('^[a-zA-Z0-9-]+$')]
  [string]$TunnelName = 'white-caves-api'
)

$ErrorActionPreference = 'Stop'
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflared) {
  throw 'Install cloudflared explicitly with winget install --id Cloudflare.cloudflared -e, then reopen the terminal. Nothing was installed automatically.'
}

function Test-BackendHealth {
  try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 3
    return ($health.status -eq 'OK' -and $health.service -eq 'white-caves-api' -and $health.authenticationRequired -eq $true)
  } catch {
    Write-Verbose "Backend not ready: $($_.Exception.Message)"
    return $false
  }
}

$deadline = (Get-Date).AddSeconds($StartupTimeoutSec)
while (-not (Test-BackendHealth)) {
  if ((Get-Date) -ge $deadline) {
    throw "White Caves backend did not become ready with authentication required on explicit port $Port. No other ports were exposed."
  }
  Start-Sleep -Seconds 2
}

if ($Mode -eq 'quick') {
  Write-Warning 'Quick tunnel URLs change after restart. Use a named tunnel for Vercel production.'
} else {
  Write-Host "Named tunnel '$TunnelName' requires preconfigured ingress and credentials outside the repository."
}

$restartDelaySec = 5
while ($true) {
  if (-not (Test-BackendHealth)) {
    Write-Warning "Backend unavailable on port $Port; waiting without selecting another service."
    Start-Sleep -Seconds 5
    continue
  }
  $startedAt = Get-Date
  if ($Mode -eq 'quick') {
    & $cloudflared.Source tunnel --url "http://127.0.0.1:$Port"
  } else {
    # Named-tunnel ingress is defined in the operator's external config.yml.
    & $cloudflared.Source tunnel run $TunnelName
  }
  $code = $LASTEXITCODE
  if ($code -ne 0) {
    throw "cloudflared exited with code $code. Correct credentials/configuration before retrying."
  }
  if (((Get-Date) - $startedAt).TotalSeconds -ge 60) { $restartDelaySec = 5 }
  Write-Warning "Tunnel exited; restarting in $restartDelaySec seconds."
  Start-Sleep -Seconds $restartDelaySec
  $restartDelaySec = [Math]::Min($restartDelaySec * 2, 60)
}
