param(
  [string]$Port = $(if ($env:API_PORT) { $env:API_PORT } else { 5001 })
)

$ErrorActionPreference = 'Stop'
[int]$parsedPort = 0
if ($Port -notmatch '^[0-9]+$' -or -not [int]::TryParse($Port, [ref]$parsedPort) -or $parsedPort -lt 1 -or $parsedPort -gt 65535) {
  throw 'API_PORT must be an integer between 1 and 65535.'
}
$Port = "$parsedPort"
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repoRoot

# Probe the bind directly: CIM connection inventories can miss live listeners.
$probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $parsedPort)
$probe.ExclusiveAddressUse = $true
try {
  $probe.Start()
} catch {
  throw "Cannot bind API port ${Port}. Select another API_PORT or inspect its owner: $($_.Exception.Message) No processes were stopped."
} finally {
  $probe.Stop()
}

$env:API_PORT = "$Port"
$env:NODE_ENV = 'development'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
& npx nodemon --watch server --watch prisma --ext ts,js,json --exec "tsx server/index.ts"
exit $LASTEXITCODE
