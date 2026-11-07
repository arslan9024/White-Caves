param(
  [int]$Port = 5001
)

$portsToCheck = $Port..($Port + 5)
$listeners = Get-NetTCPConnection -LocalPort $portsToCheck -State Listen -ErrorAction SilentlyContinue
if ($listeners) {
  $procIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -gt 0 }
  foreach ($procId in $procIds) {
    try {
      Stop-Process -Id $procId -Force -ErrorAction Stop
      Write-Host ('[dev-server] Freed port by stopping PID {0}' -f $procId)
    } catch {
      Write-Warning ('[dev-server] Could not stop PID {0}' -f $procId)
    }
  }
}

# Sentinel: clean up any orphaned background tsx workers for server/index.ts
Get-CimInstance Win32_Process -Filter "name = 'node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match "server[/\\]index\.ts" -and $_.ProcessId -ne $PID } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

$env:NODE_OPTIONS = "--max-old-space-size=4096"
npx nodemon --watch server --watch prisma --ext ts,js,json --exec "tsx server/index.ts"
