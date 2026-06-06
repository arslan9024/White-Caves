# autopilot-selfcheck.ps1
# One-command preflight for autopilot reliability:
#  1) Parse-check autopilot-unlimited.ps1
#  2) Print compact AEGIS runtime status
#  3) Execute one dry-run session of autopilot-unlimited

param(
  [string]$WorkspaceRoot = ".",
  [int]$DryRunMaxSessions = 1
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path $WorkspaceRoot
$scriptsDir = Join-Path $root "scripts\orchestrator"
$autopilotScript = Join-Path $scriptsDir "autopilot-unlimited.ps1"
$statusCompactScript = Join-Path $scriptsDir "status-compact.ps1"
$width = 72

function Banner([string]$Message, [string]$Color = "Cyan") {
  Write-Host ""
  Write-Host ("=" * $width) -ForegroundColor $Color
  Write-Host ("  {0}" -f $Message) -ForegroundColor $Color
  Write-Host ("=" * $width) -ForegroundColor $Color
}

function Step([string]$Message) {
  Write-Host ""
  Write-Host ("[SELF-CHECK] {0}" -f $Message) -ForegroundColor Yellow
}

Banner "AUTOPILOT SELFCHECK" "Magenta"
Write-Host ("  Workspace: {0}" -f $root)

if (-not (Test-Path $autopilotScript)) {
  Write-Host ("  Missing script: {0}" -f $autopilotScript) -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $statusCompactScript)) {
  Write-Host ("  Missing script: {0}" -f $statusCompactScript) -ForegroundColor Red
  exit 1
}

Step "PowerShell parser validation for autopilot-unlimited.ps1"
$tokens = $null
$parseErrors = $null
[void][System.Management.Automation.Language.Parser]::ParseFile($autopilotScript, [ref]$tokens, [ref]$parseErrors)

if ($null -ne $parseErrors -and $parseErrors.Count -gt 0) {
  Write-Host "  Parser validation FAILED:" -ForegroundColor Red
  foreach ($err in $parseErrors) {
    Write-Host ("  - {0}" -f $err.Message) -ForegroundColor Red
  }
  exit 2
}

Write-Host "  Parser validation passed" -ForegroundColor Green

Step "Compact runtime status"
& powershell -ExecutionPolicy Bypass -File $statusCompactScript
if ($LASTEXITCODE -ne 0) {
  Write-Host "  status-compact failed" -ForegroundColor Red
  exit 3
}

Step "One dry-run autopilot session"
& powershell -ExecutionPolicy Bypass -File $autopilotScript -MaxSessions $DryRunMaxSessions -DryRun -SkipBuild -NoCommit -CheckpointEverySessions 1
if ($LASTEXITCODE -ne 0) {
  Write-Host "  Dry-run autopilot validation failed" -ForegroundColor Red
  exit 4
}

Banner "SELFCHECK PASSED" "Green"
Write-Host "  Safe to run: npm run autopilot:ensure:checkpoint" -ForegroundColor Green

exit 0
