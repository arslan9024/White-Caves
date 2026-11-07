## moveFolders.ps1
# -------------------------------------------------
# Move legacy top‑level folders (docs, plans, scripts) into .agents
# -------------------------------------------------
$sourceRoot = "C:\Users\Dell\Documents\White-Caves"
$targetRoot = Join-Path $sourceRoot ".agents"

$folders = @("docs","plans","scripts")
foreach ($folder in $folders) {
  $src = Join-Path $sourceRoot $folder
  $dst = Join-Path $targetRoot $folder
  if (Test-Path $src) {
    # Ensure destination exists
    if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst -Force | Out-Null }
    # Move all contents (including hidden files) preserving structure
    Get-ChildItem -Path $src -Force | Move-Item -Destination $dst -Force
    Write-Host "Moved $folder to .agents/$folder"
  } else {
    Write-Host "Source folder $folder does not exist, skipping."
  }
}
# Optional cleanup: remove now‑empty source directories
foreach ($folder in $folders) {
  $src = Join-Path $sourceRoot $folder
  if (Test-Path $src) {
    Remove-Item -Path $src -Recurse -Force
    Write-Host "Removed empty source folder $folder"
  }
}

