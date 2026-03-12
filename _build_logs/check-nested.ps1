$cssFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.css"
foreach ($file in $cssFiles) {
    $content = Get-Content $file.FullName
    $inMultiLineComment = $false
    $openLine = 0
    for ($i = 0; $i -lt $content.Count; $i++) {
        $ln = $content[$i]
        $hasOpen = $ln.Contains("/*")
        $hasClose = $ln.Contains("*/")
        if (-not $inMultiLineComment) {
            if ($hasOpen -and -not $hasClose) {
                $inMultiLineComment = $true
                $openLine = $i + 1
            }
        } else {
            if ($hasOpen) {
                Write-Output "NESTED: $($file.Name):$($i+1) (opened at L$openLine)"
            }
            if ($hasClose) {
                $inMultiLineComment = $false
            }
        }
    }
}
