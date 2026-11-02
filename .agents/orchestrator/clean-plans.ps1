param(
  [string]$WorkspaceRoot = ".",
  [switch]$Apply,
  [int]$RetentionDays = 30
)

$root = Resolve-Path $WorkspaceRoot
$plansRoot = Join-Path $root "plans"
$archiveRoots = @(
  (Join-Path $plansRoot "archives"),
  (Join-Path $root "archives\plans")
)

if (-not (Test-Path $plansRoot)) {
  Write-Host "[ERROR] plans directory not found: $plansRoot" -ForegroundColor Red
  exit 1
}

function Test-CompletedMarker {
  param(
    [string]$Text
  )

  if ([string]::IsNullOrWhiteSpace($Text)) {
    return $false
  }

  return (
    $Text -match '(?im)^\s*status\s*:\s*(✅\s*)?(complete|completed|done|implemented|green)\b' -or
    $Text -match '(?im)\b(✅\s*complete|fully implemented|implementation complete)\b'
  )
}

function Is-UnderArchiveRoot {
  param(
    [string]$FilePath,
    [string[]]$AllowedRoots
  )

  $fullPath = [IO.Path]::GetFullPath($FilePath)
  foreach ($allowedRoot in $AllowedRoots) {
    if (-not (Test-Path $allowedRoot)) { continue }
    $fullRoot = [IO.Path]::GetFullPath($allowedRoot.TrimEnd('\', '/'))
    if ($fullPath.StartsWith($fullRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      return $true
    }
  }
  return $false
}

$minAge = (Get-Date).AddDays(-1 * [Math]::Abs($RetentionDays))
$deleted = 0
$skipped = 0
$eligible = @()

foreach ($archiveRoot in $archiveRoots) {
  if (-not (Test-Path $archiveRoot)) { continue }

  $files = Get-ChildItem -Path $archiveRoot -Recurse -File -Filter "*.md" -ErrorAction SilentlyContinue
  foreach ($file in $files) {
    if (-not (Is-UnderArchiveRoot -FilePath $file.FullName -AllowedRoots $archiveRoots)) {
      $skipped++
      continue
    }

    if ($file.LastWriteTime -gt $minAge) {
      $skipped++
      continue
    }

    $text = ""
    try {
      $text = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
    } catch {
      $skipped++
      continue
    }

    if (-not (Test-CompletedMarker -Text $text)) {
      $skipped++
      continue
    }

    $eligible += $file
  }
}

Write-Host ""
Write-Host "Aegis plan cleanup scan" -ForegroundColor Cyan
Write-Host "  Plans root    : $plansRoot" -ForegroundColor DarkGray
Write-Host "  Retention days: $RetentionDays" -ForegroundColor DarkGray
Write-Host "  Mode          : $(if ($Apply) { "APPLY (deleting)" } else { "DRY RUN" })" -ForegroundColor DarkGray
Write-Host ""

if ($eligible.Count -eq 0) {
  Write-Host "No archived+completed plan files eligible for deletion." -ForegroundColor Green
  exit 0
}

Write-Host "Eligible files ($($eligible.Count)):" -ForegroundColor Yellow
foreach ($candidate in $eligible) {
  Write-Host "  - $($candidate.FullName)" -ForegroundColor DarkYellow
}

if (-not $Apply) {
  Write-Host ""
  Write-Host "Dry run complete. Re-run with -Apply to delete eligible files." -ForegroundColor Green
  exit 0
}

foreach ($candidate in $eligible) {
  try {
    Remove-Item -Path $candidate.FullName -Force -ErrorAction Stop
    $deleted++
  } catch {
    $skipped++
    Write-Host "  [WARN] Could not delete: $($candidate.FullName)" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "Cleanup complete. Deleted: $deleted, Skipped: $skipped" -ForegroundColor Green
