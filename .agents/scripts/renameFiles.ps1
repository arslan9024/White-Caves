## renameFiles.ps1
# -------------------------------------------------
# Rename all files under .agents to kebab-case (lowercase, hyphens)
# -------------------------------------------------
$root = "C:/Users/Dell/Documents/White-Caves/.agents"

function Convert-ToKebab($name) {
  $new = $name -replace '\\s+', '-'   # spaces to hyphens
  $new = $new -replace '_' , '-'      # underscores to hyphens
  $new = $new.ToLower()
  return $new
}

Get-ChildItem -Path $root -Recurse -File | ForEach-Object {
  $dir = $_.DirectoryName
  $oldName = $_.Name
  $newName = Convert-ToKebab $oldName
  if ($oldName -ne $newName) {
    $newPath = Join-Path $dir $newName
    if (-not (Test-Path $newPath)) {
      Move-Item -Path $_.FullName -Destination $newPath -Force
      Write-Host "Renamed $oldName -> $newName"
    } else {
      Write-Host "Skipping $oldName (target exists)"
    }
  }
}

