param(
  [string]$WorkspaceRoot = ".",
  [switch]$CI,
  [switch]$Strict,
  [switch]$Brief
)

$script = Join-Path $PSScriptRoot "../../aegis/scripts/orchestrator/queue-health.ps1"
& $script @PSBoundParameters
