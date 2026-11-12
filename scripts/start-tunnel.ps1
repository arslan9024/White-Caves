<#
.SYNOPSIS
  Exposes the local White Caves backend to the internet via Cloudflare Tunnel.

.DESCRIPTION
  Bridges the live Vercel frontend to the full backend (server/index.ts) running
  on this machine. Supports:
    -Mode quick  (default) : throwaway https://*.trycloudflare.com URL
    -Mode named            : permanent tunnel "white-caves-api" -> api.whitecaves.com
                             (one-time setup: see .agents/docs/CLOUDFLARE_TUNNEL_SETUP.md)

  Resilience: auto-installs cloudflared via winget, auto-detects the actual
  backend port by probing /api/health (handles port fallback drift), and
  supervises the tunnel with an exponential-backoff restart loop so ISP
  hiccups or router reboots self-heal.

.EXAMPLE
  npm run tunnel:quick
  npm run tunnel:named
#>
param(
  [ValidateSet('quick', 'named')]
  [string]$Mode = 'quick',
  [int]$BasePort = 5001,
  [int]$PortScanRange = 20
)

$ErrorActionPreference = 'Stop'

function Find-BackendPort {
  param([int]$Base, [int]$Range)
  foreach ($p in $Base..($Base + $Range)) {
    try {
      $null = Invoke-RestMethod -Uri "http://localhost:$p/api/health" -TimeoutSec 2
      return $p
    } catch {
      continue
    }
  }
  return $null
}

# 1. Ensure cloudflared is installed
if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
  Write-Host 'cloudflared not found - installing via winget...' -ForegroundColor Yellow
  winget install --id Cloudflare.cloudflared -e --accept-source-agreements --accept-package-agreements
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
              [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    Write-Error 'cloudflared installed but not on PATH yet. Open a NEW terminal and retry.'
    exit 1
  }
}

# 2. Auto-detect the live backend port (health probe, not just an open socket)
$Port = Find-BackendPort -Base $BasePort -Range $PortScanRange
if (-not $Port) {
  Write-Host "ERROR: no backend answering /api/health on ports $BasePort-$($BasePort + $PortScanRange)." -ForegroundColor Red
  Write-Host 'Start the backend first:  npm run dev   (API defaults to http://localhost:5001)' -ForegroundColor Red
  exit 1
}
Write-Host "Backend detected on port $Port" -ForegroundColor Green

if ($Mode -eq 'quick') {
  Write-Host 'QUICK tunnel mode - copy the https://*.trycloudflare.com URL below' -ForegroundColor Cyan
  Write-Host 'into Vercel env var VITE_API_URL, then redeploy the frontend.' -ForegroundColor Green
  Write-Host 'NOTE: the URL changes on every restart; use -Mode named for a stable domain.' -ForegroundColor Yellow
} else {
  Write-Host "NAMED tunnel mode - serving tunnel 'white-caves-api' (api.whitecaves.com)" -ForegroundColor Cyan
  Write-Host 'Requires one-time setup: .agents/docs/CLOUDFLARE_TUNNEL_SETUP.md' -ForegroundColor Yellow
}

# 3. Supervised run: restart on any exit with exponential backoff (cap 60s)
$restartDelaySec = 5
while ($true) {
  Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting tunnel ($Mode) -> http://localhost:$Port" -ForegroundColor Cyan
  if ($Mode -eq 'quick') {
    cloudflared tunnel --url "http://localhost:$Port"
  } else {
    cloudflared tunnel run --url "http://localhost:$Port" white-caves-api
  }
  Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Tunnel exited - restarting in $restartDelaySec s (Ctrl+C to stop)" -ForegroundColor Yellow
  Start-Sleep -Seconds $restartDelaySec
  $restartDelaySec = [Math]::Min($restartDelaySec * 2, 60)
}
