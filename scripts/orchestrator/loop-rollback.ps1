# loop-rollback.ps1 -- Restore latest or named loop snapshot stash

param(
  [string]$WorkspaceRoot = ".",
  [string]$SnapshotTag = "",
  [switch]$List
)

$root = Resolve-Path $WorkspaceRoot
$snapshotFile = Join-Path $root "logs\orchestrator\loop-snapshots.json"

if (-not (Test-Path $snapshotFile)) {
  Write-Host "[ERROR] No loop snapshots found." -ForegroundColor Red
  exit 1
}

$entries = @()
try {
  $data = Get-Content $snapshotFile -Raw | ConvertFrom-Json
  if ($data -is [System.Collections.IEnumerable]) { $entries = @($data) }
  elseif ($null -ne $data) { $entries = @($data) }
} catch {
  Write-Host "[ERROR] Could not parse loop snapshots." -ForegroundColor Red
  exit 1
}

if ($List) {
  Write-Host ""
  Write-Host "Available loop snapshots:" -ForegroundColor Cyan
  foreach ($e in ($entries | Sort-Object timestamp -Descending)) {
    Write-Host ("  - {0} (stash: {1}, branch: {2})" -f $e.snapshotTag, $e.stashRef, $e.branchBeforeSync) -ForegroundColor White
  }
  Write-Host ""
  exit 0
}

$target = $null
if ([string]::IsNullOrWhiteSpace($SnapshotTag)) {
  $target = ($entries | Sort-Object timestamp -Descending | Select-Object -First 1)
} else {
  $target = ($entries | Where-Object { $_.snapshotTag -eq $SnapshotTag } | Select-Object -First 1)
}

if ($null -eq $target) {
  Write-Host "[ERROR] Snapshot not found." -ForegroundColor Red
  exit 1
}

if ([string]::IsNullOrWhiteSpace([string]$target.stashRef)) {
  Write-Host "[ERROR] Snapshot has no stash reference." -ForegroundColor Red
  exit 1
}

Push-Location $root
Write-Host ("Restoring snapshot {0} ({1})..." -f $target.snapshotTag, $target.stashRef) -ForegroundColor Cyan

git stash pop $target.stashRef 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
  $conflicts = @(git diff --name-only --diff-filter=U 2>$null)
  if ($conflicts.Count -gt 0) {
    Write-Host "[BLOCKED] Conflicts during rollback:" -ForegroundColor Red
    foreach ($c in $conflicts) { Write-Host ("  - {0}" -f $c) -ForegroundColor Red }
  } else {
    Write-Host "[ERROR] Rollback failed." -ForegroundColor Red
  }
  Pop-Location
  exit 1
}

Write-Host "Rollback complete." -ForegroundColor Green
Pop-Location
exit 0
