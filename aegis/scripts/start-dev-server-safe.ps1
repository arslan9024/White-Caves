param(
  [int]$Port = 5001
)

$portsToCheck = $Port..($Port + 5)
foreach ($p in $portsToCheck) {
  $listeners = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  if ($listeners) {
    $procIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $procIds) {
      try {
        Stop-Process -Id $procId -Force -ErrorAction Stop
        Write-Host ('[dev-server] Freed port {0} by stopping PID {1}' -f $p, $procId)
      } catch {
        Write-Warning ('[dev-server] Could not stop PID {0} on port {1}' -f $procId, $p)
      }
    }
  }
}

# Sentinel: clean up any orphaned background tsx workers for server/index.ts
Get-CimInstance Win32_Process -Filter "name = 'node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match "server[/\\]index\.ts" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

$env:NODE_OPTIONS = "--max-old-space-size=4096"
npx --yes nodemon --watch server --watch prisma --ext ts,js,json --exec "npx --yes tsx" server/index.ts