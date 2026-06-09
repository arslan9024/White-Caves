param(
  [string]$WorkspaceRoot = ".",
  [switch]$AutoFix,
  [switch]$IncludeE2E,
  [switch]$IncludeAudit,
  [switch]$TargetedChecks,
  [int]$TargetedMaxChecks = 4,
  [string]$TaskId = "",
  [string]$TaskTitle = "",
  [string]$TaskPhase = "",
  [string]$TaskLane = "",
  [switch]$Brief
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
Set-Location $root

$stateDir = Join-Path $root "logs\orchestrator"
New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
$scanLog = Join-Path $stateDir "development-practice-sweep.log"
$problemScanScript = Join-Path $root "scripts\orchestrator\project-problem-scan.ps1"

function Test-NpmScript {
  param(
    [psobject]$Package,
    [string]$ScriptName
  )

  if ($null -eq $Package -or $null -eq $Package.scripts) { return $false }
  return ($null -ne $Package.scripts.PSObject.Properties[$ScriptName])
}

function Invoke-NpmScript {
  param(
    [string]$ScriptName,
    [string]$Purpose
  )

  $output = @()
  $ok = $false
  try {
    $output = & cmd.exe /c "npm run $ScriptName" 2>&1
    $ok = ($LASTEXITCODE -eq 0)
  } catch {
    $output = @($_.Exception.Message)
    $ok = $false
  }

  $text = (($output | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
  $first = ""
  if (-not [string]::IsNullOrWhiteSpace($text)) {
    $first = ($text -split "`r?`n" | Select-Object -First 1)
  }

  return [pscustomobject]@{
    step = $ScriptName
    purpose = $Purpose
    ok = $ok
    firstLine = $first
    output = $text
  }
}

function Get-TargetedChecks {
  param(
    [string]$TaskTitle,
    [string]$TaskPhase,
    [string]$TaskLane,
    [int]$MaxChecks
  )

  $context = (("{0} {1} {2}" -f $TaskTitle, $TaskPhase, $TaskLane).ToLower())
  if ([string]::IsNullOrWhiteSpace($context)) { return @() }

  $selected = New-Object System.Collections.Generic.List[object]

  function Add-Check {
    param([string]$Name, [string]$Purpose)

    foreach ($existing in $selected) {
      if ([string]$existing.Name -eq $Name) { return }
    }
    $selected.Add(@{ Name = $Name; Purpose = $Purpose; Required = $false }) | Out-Null
  }

  if ($context -match "ux|ui|frontend|homepage|dashboard|layout|design|accessibility|responsive") {
    Add-Check -Name "test:e2e:smoke" -Purpose "Targeted frontend UX smoke"
    Add-Check -Name "test:e2e:accessibility" -Purpose "Targeted accessibility regression"
    Add-Check -Name "test:run" -Purpose "Targeted frontend/component regression"
  }

  if ($context -match "backend|api|auth|login|rbac|server|middleware|database|prisma|security") {
    Add-Check -Name "verify:runtime:dry" -Purpose "Targeted backend/runtime route verification"
    Add-Check -Name "test:assistant-contract" -Purpose "Targeted service/contract verification"
    Add-Check -Name "test:run" -Purpose "Targeted backend regression"
  }

  if ($context -match "performance|seo|cache|pwa|core web vitals|lighthouse") {
    Add-Check -Name "test:e2e:performance" -Purpose "Targeted performance regression"
    Add-Check -Name "build" -Purpose "Targeted production build verification"
  }

  if ($context -match "ai|assistant|chat|automation|whatsapp") {
    Add-Check -Name "test:assistant-contract" -Purpose "Targeted assistant/chat contract validation"
    Add-Check -Name "test:run" -Purpose "Targeted AI workflow regression"
  }

  $cap = if ($MaxChecks -lt 1) { 1 } else { $MaxChecks }
  return @($selected | Select-Object -First $cap)
}

$result = [ordered]@{
  generatedAt = (Get-Date).ToString("o")
  workspaceRoot = [string]$root
  autoFixEnabled = [bool]$AutoFix
  includeE2E = [bool]$IncludeE2E
  includeAudit = [bool]$IncludeAudit
  targetedChecks = [bool]$TargetedChecks
  taskContext = @{
    taskId = [string]$TaskId
    title = [string]$TaskTitle
    phase = [string]$TaskPhase
    lane = [string]$TaskLane
  }
  status = "ok"
  blockers = @()
  warnings = @()
  actions = @()
}

$pkgPath = Join-Path $root "package.json"
if (-not (Test-Path $pkgPath)) {
  $result.status = "blocked"
  $result.blockers += "package.json not found"
  $payload = ($result | ConvertTo-Json -Depth 10)
  if ($Brief) { Write-Output $payload } else { Write-Host $payload }
  Add-Content -Path $scanLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)
  exit 1
}

$pkg = $null
try {
  $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
} catch {
  $result.status = "blocked"
  $result.blockers += "package.json is not valid JSON"
  $payload = ($result | ConvertTo-Json -Depth 10)
  if ($Brief) { Write-Output $payload } else { Write-Host $payload }
  Add-Content -Path $scanLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)
  exit 1
}

if (Test-Path $problemScanScript) {
  $scanArgs = @(
    "-ExecutionPolicy", "Bypass",
    "-File", "$problemScanScript",
    "-WorkspaceRoot", "$root",
    "-Brief"
  )
  if ($AutoFix) {
    $scanArgs += "-AutoFix"
  }

  $scanOut = & powershell @scanArgs 2>&1
  $scanText = (($scanOut | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
  $scanOk = ($LASTEXITCODE -eq 0)
  $result.actions += [pscustomobject]@{
    step = "project-problem-scan"
    purpose = "Type/lint/build sweep with optional autofix"
    ok = $scanOk
    firstLine = if ([string]::IsNullOrWhiteSpace($scanText)) { "" } else { ($scanText -split "`r?`n" | Select-Object -First 1) }
    output = $scanText
  }
  if (-not $scanOk) {
    $result.blockers += "project-problem-scan failed"
  }
} else {
  $result.warnings += "project-problem-scan.ps1 missing"
}

$checks = @(
  @{ Name = "test:run"; Purpose = "Unit/component regression"; Required = $true },
  @{ Name = "test:assistant-contract"; Purpose = "Assistant contract checks"; Required = $false },
  @{ Name = "verify:runtime:dry"; Purpose = "Backend/runtime dry verification"; Required = $false }
)

if ($IncludeE2E) {
  $checks += @{ Name = "test:e2e:smoke"; Purpose = "Playwright smoke (frontend UX flow)"; Required = $false }
  $checks += @{ Name = "test:e2e:accessibility"; Purpose = "Accessibility UX verification"; Required = $false }
}

if ($IncludeAudit) {
  $checks += @{ Name = "audit"; Purpose = "Dependency security audit"; Required = $false }
}

if ($TargetedChecks) {
  $targeted = Get-TargetedChecks -TaskTitle $TaskTitle -TaskPhase $TaskPhase -TaskLane $TaskLane -MaxChecks $TargetedMaxChecks
  if ($targeted.Count -gt 0) {
    $result.targetedSelection = @($targeted | ForEach-Object { $_.Name })
    foreach ($tc in $targeted) {
      $checks += @{ Name = [string]$tc.Name; Purpose = [string]$tc.Purpose; Required = $false }
    }
  } else {
    $result.targetedSelection = @()
  }
}

$executed = @{}

foreach ($check in $checks) {
  $scriptName = [string]$check.Name
  if ($executed.ContainsKey($scriptName)) { continue }

  if (-not (Test-NpmScript -Package $pkg -ScriptName $scriptName)) {
    if ([bool]$check.Required) {
      $result.warnings += "Missing npm script: $scriptName (required by sweep profile)"
    }
    $executed[$scriptName] = $true
    continue
  }

  $run = Invoke-NpmScript -ScriptName $scriptName -Purpose ([string]$check.Purpose)
  $result.actions += $run
  $executed[$scriptName] = $true

  if (-not $run.ok -and [bool]$check.Required) {
    $result.blockers += ("Required sweep check failed: {0}" -f $scriptName)
  }
}

if ($result.blockers.Count -gt 0) {
  $result.status = "issues_found"
} elseif ($result.warnings.Count -gt 0) {
  $result.status = "ok_with_warnings"
}

$payload = ($result | ConvertTo-Json -Depth 10)
if (-not $Brief) {
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "  AEGIS DEVELOPMENT PRACTICE SWEEP" -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host $payload
} else {
  Write-Output $payload
}

Add-Content -Path $scanLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)

if ($result.status -eq "issues_found" -or $result.status -eq "blocked") {
  exit 1
}

exit 0
