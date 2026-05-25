# error-scan.ps1 -- Mandatory pre-push health/security scan

param(
  [string]$WorkspaceRoot = ".",
  [switch]$AutoFix
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
$logsDir = Join-Path $root "logs\orchestrator"
if (-not (Test-Path $logsDir)) {
  New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$checks = [System.Collections.Generic.List[object]]::new()

function Run-Check([string]$name, [scriptblock]$cmd, [bool]$hardFail = $true) {
  Write-Host ""
  Write-Host ("[SCAN] {0}" -f $name) -ForegroundColor Cyan
  $output = & $cmd 2>&1 | Out-String
  $ok = ($LASTEXITCODE -eq 0)
  if ($ok) {
    Write-Host ("  PASS: {0}" -f $name) -ForegroundColor Green
  } else {
    Write-Host ("  FAIL: {0}" -f $name) -ForegroundColor Red
    if (-not [string]::IsNullOrWhiteSpace($output)) {
      Write-Host $output -ForegroundColor DarkGray
    }
    if ($hardFail) {
      $errors.Add("$name failed")
    } else {
      $warnings.Add("$name failed")
    }
  }
  $checks.Add([pscustomobject]@{
    name = $name
    passed = $ok
    hardFail = $hardFail
    output = $output.Trim()
  })
  return $ok
}

Push-Location $root

$typecheckOk = Run-Check "Typecheck" { npm run typecheck }

$lintOk = Run-Check "Lint" { npm run lint }
if (-not $lintOk -and $AutoFix) {
  Write-Host ""
  Write-Host "[AUTOFIX] Running eslint --fix..." -ForegroundColor Yellow
  & npm run lint -- --fix 2>&1 | Out-Host
  $lintOk = Run-Check "Lint (post-autofix)" { npm run lint }
}

$buildOk = Run-Check "Build" { npm run build }
$testsOk = Run-Check "Unit Tests (src/__tests__)" { npm run test:run -- src/__tests__ }
$plansOk = Run-Check "Plans Validate" { npm run plans:validate } $false

Write-Host ""
Write-Host "[SCAN] Security checks on staged files" -ForegroundColor Cyan
$stagedFiles = @(git diff --cached --name-only 2>$null)
if ($stagedFiles.Count -eq 0) {
  Write-Host "  No staged files for security scan." -ForegroundColor DarkGray
  $checks.Add([pscustomobject]@{ name = "Security (staged)"; passed = $true; hardFail = $true; output = "No staged files" })
} else {
  $secretPattern = '(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*["'"'][^"'"'\n]{8,}["'"']'
  $consoleSensitivePattern = '(?i)console\.log\(.*(token|secret|password|authorization)'
  $securityFail = $false

  foreach ($file in $stagedFiles) {
    if ($file -match '(^|/)\.env(\.|$)') {
      $errors.Add("Security: staged env file detected ($file)")
      $securityFail = $true
      continue
    }

    $abs = Join-Path $root ($file -replace '/', '\\')
    if (-not (Test-Path $abs)) { continue }

    try {
      $content = Get-Content $abs -Raw
      if ($content -match $secretPattern) {
        $errors.Add("Security: possible hardcoded secret in $file")
        $securityFail = $true
      }
      if ($content -match $consoleSensitivePattern) {
        $errors.Add("Security: sensitive console.log pattern in $file")
        $securityFail = $true
      }
    } catch {
      $warnings.Add("Security: could not read staged file $file")
    }
  }

  if ($securityFail) {
    Write-Host "  FAIL: security checks" -ForegroundColor Red
  } else {
    Write-Host "  PASS: security checks" -ForegroundColor Green
  }

  $checks.Add([pscustomobject]@{
    name = "Security (staged)"
    passed = (-not $securityFail)
    hardFail = $true
    output = if ($securityFail) { "Security findings detected" } else { "OK" }
  })
}

$passed = ($errors.Count -eq 0)
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportPath = Join-Path $logsDir ("error-scan-{0}.json" -f $stamp)
$report = [pscustomobject]@{
  timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
  passed = $passed
  errors = @($errors)
  warnings = @($warnings)
  checks = @($checks)
}

$reportJson = $report | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($reportPath, $reportJson, (New-Object System.Text.UTF8Encoding($false)))

Write-Host ""
if ($passed) {
  Write-Host "✅ ERROR SCAN PASSED -- safe to push." -ForegroundColor Green
} else {
  Write-Host "❌ ERROR SCAN FAILED -- push blocked." -ForegroundColor Red
  foreach ($e in $errors) { Write-Host ("  - {0}" -f $e) -ForegroundColor Red }
  Write-Host "  Suggested fixes:" -ForegroundColor Yellow
  Write-Host "    npm run typecheck" -ForegroundColor DarkGray
  Write-Host "    npm run lint" -ForegroundColor DarkGray
  Write-Host "    npm run build" -ForegroundColor DarkGray
  Write-Host "    npm run test:run -- src/__tests__" -ForegroundColor DarkGray
}
if ($warnings.Count -gt 0) {
  Write-Host ""
  Write-Host "Warnings:" -ForegroundColor Yellow
  foreach ($w in $warnings) { Write-Host ("  - {0}" -f $w) -ForegroundColor Yellow }
}
Write-Host ("Report: {0}" -f $reportPath) -ForegroundColor DarkGray

Pop-Location
if (-not $passed) { exit 1 }
exit 0
