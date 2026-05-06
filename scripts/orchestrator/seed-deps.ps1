# seed-deps.ps1 -- Patches task-queue.json with correct dependency chains
# Run once after init-queue.ps1 to wire lane ordering and within-agent subtask deps.
#
# Dependency rules applied:
#   Within-agent : Txb depends on Tx  ;  Txc depends on Txb
#   Lane A (cross-agent): T002->T001  T003->T002  T004->T003  T005->T004  T006->T005  T007->T006
#   Lane B (cross-agent): T009->T008  T010->T009  T011->T010
#   Lane C (cross-agent): T013->T012  T014->T013  T015->T014
#   Lane D (cross-agent): T017->T016
param(
  [string]$WorkspaceRoot = ".",
  [switch]$DryRun
)

$queueFile = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"

if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue not found: $queueFile" -ForegroundColor Red; exit 1
}

$raw   = Get-Content $queueFile -Raw
$q     = $raw | ConvertFrom-Json
$tasks = @($q.tasks)

# Build lookup: taskId -> index
$idx = @{}
for ($i = 0; $i -lt $tasks.Count; $i++) { $idx[$tasks[$i].taskId] = $i }

# Cross-agent dep chains per lane
$crossDeps = @(
  # Lane A
  @("T002","T001"), @("T003","T002"), @("T004","T003"),
  @("T005","T004"), @("T006","T005"), @("T007","T006"),
  # Lane B
  @("T009","T008"), @("T010","T009"), @("T011","T010"),
  # Lane C
  @("T013","T012"), @("T014","T013"), @("T015","T014"),
  # Lane D
  @("T017","T016")
)

# Within-agent subtask deps (b depends on root, c depends on b)
# Roots: T001-T017 (no trailing b/c)
$withinDeps = @()
1..17 | ForEach-Object {
  $n = '{0:D3}' -f $_
  $withinDeps += ,@("T${n}b", "T${n}")
  $withinDeps += ,@("T${n}c", "T${n}b")
}

$allDeps = $crossDeps + $withinDeps

$changes = 0
foreach ($pair in $allDeps) {
  $child  = $pair[0]
  $parent = $pair[1]

  if (-not $idx.ContainsKey($child)) {
    Write-Host "  [SKIP] $child not in queue" -ForegroundColor DarkGray; continue
  }
  if (-not $idx.ContainsKey($parent)) {
    Write-Host "  [SKIP] parent $parent not in queue" -ForegroundColor DarkGray; continue
  }

  $t = $tasks[$idx[$child]]

  # Ensure deps is an array
  if ($null -eq $t.deps) {
    $t | Add-Member -NotePropertyName deps -NotePropertyValue @($parent) -Force
    if (-not $DryRun) { Write-Host ("  [SET] {0} -> deps=[{1}]" -f $child, $parent) -ForegroundColor Green }
    else              { Write-Host ("  [DRY] {0} -> deps=[{1}]" -f $child, $parent) -ForegroundColor Cyan }
    $changes++
  } else {
    $existing = @($t.deps)
    if ($existing -notcontains $parent) {
      $existing += $parent
      $t.deps = $existing
      if (-not $DryRun) { Write-Host ("  [ADD] {0} -> added dep {1}" -f $child, $parent) -ForegroundColor Green }
      else              { Write-Host ("  [DRY] {0} -> would add dep {1}" -f $child, $parent) -ForegroundColor Cyan }
      $changes++
    } else {
      Write-Host ("  [OK]  {0} already has dep {1}" -f $child, $parent) -ForegroundColor DarkGray
    }
  }
}

Write-Host ""
Write-Host "$changes dep entries processed." -ForegroundColor Yellow

if ($DryRun) {
  Write-Host "[DRY RUN] No changes written. Remove -DryRun to apply." -ForegroundColor Cyan
} else {
  $q.tasks = $tasks
  $json = $q | ConvertTo-Json -Depth 10
  [System.IO.File]::WriteAllText($queueFile, $json, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "[SAVED] $queueFile" -ForegroundColor Green
  Write-Host ""
  Write-Host "Lane chains wired. Run 'npm run orchestrator:morning' to see updated READY/BLOCKED status." -ForegroundColor White
}
