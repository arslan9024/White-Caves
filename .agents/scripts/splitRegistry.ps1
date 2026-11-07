## splitRegistry.ps1
# -------------------------------------------------
# Split subagent-registry-108.json into per-department files
# -------------------------------------------------
$source = "C:/Users/Dell/Documents/White-Caves/.agents/subagent-registry-108.json"
$destDir = "C:/Users/Dell/Documents/White-Caves/.agents/subagent-registry-parts"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
# Read full JSON (may be large, but PowerShell can handle it)
$json = Get-Content -Raw -Path $source | ConvertFrom-Json
# Preserve top-level metadata (framework, version, etc.)
$meta = @{ framework = $json.framework; version = $json.version; totalDepartments = $json.totalDepartments; nodesPerDepartment = $json.nodesPerDepartment; totalNodes = $json.totalNodes; generatedAt = $json.generatedAt }
$departments = $json.departments
$deptIndex = 1
foreach ($dept in $departments) {
  $out = [ordered]@{
    framework = $meta.framework
    version = $meta.version
    totalDepartments = $meta.totalDepartments
    nodesPerDepartment = $meta.nodesPerDepartment
    totalNodes = $meta.totalNodes
    generatedAt = $meta.generatedAt
    departments = @($dept)
  }
  $jsonText = $out | ConvertTo-Json -Depth 10
  $outPath = Join-Path $destDir "subagent-registry-108-dept-$($dept.id).json"
  $jsonText | Set-Content -Path $outPath -Encoding UTF8
  Write-Host "Wrote $outPath"
  $deptIndex++
}
# Optionally, write remaining top-level arrays if any (e.g., nodes) – omitted for brevity
Write-Host "Split complete."

