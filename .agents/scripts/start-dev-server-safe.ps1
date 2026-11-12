param(
  [ValidateRange(1, 65535)]
  [int]$Port = 5001
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repoRoot

if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
  throw "Port $Port is already in use. Stop its owner explicitly or select another API_PORT. No processes were stopped."
}

$env:API_PORT = "$Port"
$env:NODE_ENV = 'development'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
& npx nodemon --watch server --watch prisma --ext ts,js,json --exec "tsx server/index.ts"
exit $LASTEXITCODE
