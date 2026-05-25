param(
  [int]$Port = 3001
)

$listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

if ($listeners) {
  $procIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($procId in $procIds) {
    try {
      Stop-Process -Id $procId -Force -ErrorAction Stop
      Write-Host ('[dev-server] Freed port {0} by stopping PID {1}' -f $Port, $procId)
    } catch {
      Write-Warning ('[dev-server] Could not stop PID {0} on port {1}' -f $procId, $Port)
    }
  }
} else {
  Write-Host ('[dev-server] Port {0} is already free' -f $Port)
}

nodemon