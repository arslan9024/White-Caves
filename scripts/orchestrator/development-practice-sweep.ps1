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
$policyFile = Join-Path $root "scripts\orchestrator\policy.json"

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

function Get-RiskDomain {
  param(
    [string]$TaskTitle,
    [string]$TaskPhase,
    [string]$TaskLane
  )

  $context = (("{0} {1} {2}" -f $TaskTitle, $TaskPhase, $TaskLane).ToLower())
  if ([string]::IsNullOrWhiteSpace($context)) { return "general" }

  if ($context -match "payment|stripe|checkout|billing|invoice|refund") { return "payment" }
  if ($context -match "auth|login|jwt|token|rbac|permission|session|oauth|mfa") { return "auth" }
  if ($context -match "database|prisma|migration|schema|mongo|mongodb|sql|query") { return "database" }
  if ($context -match "security|xss|csrf|injection|owasp|vuln|hardening|encryption|cors|rate limit") { return "security" }

  return "general"
}

function Get-SweepRiskConfig {
  param($Policy)

  $defaultProfiles = @{
    security = @{ requiredChecks = @("test:run", "verify:runtime:dry", "audit"); optionalChecks = @("test:e2e:accessibility") }
    auth = @{ requiredChecks = @("test:run", "verify:runtime:dry", "test:assistant-contract"); optionalChecks = @("test:e2e:smoke") }
    database = @{ requiredChecks = @("test:run", "verify:runtime:dry", "build"); optionalChecks = @() }
    payment = @{ requiredChecks = @("test:run", "verify:runtime:dry", "build"); optionalChecks = @("audit") }
    general = @{ requiredChecks = @("test:run"); optionalChecks = @() }
  }

  $cfg = @{
    enabled = $true
    blockOnMissingRequired = $false
    profiles = $defaultProfiles
  }

  if ($null -eq $Policy -or $null -eq $Policy.aegis) {
    return $cfg
  }

  if ($null -ne $Policy.aegis.developmentSweepRiskTierEnabled) {
    $cfg.enabled = [bool]$Policy.aegis.developmentSweepRiskTierEnabled
  }
  if ($null -ne $Policy.aegis.developmentSweepRiskTierBlockOnMissingRequired) {
    $cfg.blockOnMissingRequired = [bool]$Policy.aegis.developmentSweepRiskTierBlockOnMissingRequired
  }

  if ($null -ne $Policy.aegis.developmentSweepRiskProfiles) {
    $profiles = @{}
    foreach ($domain in @("security", "auth", "database", "payment", "general")) {
      $defaults = $defaultProfiles[$domain]
      $src = $Policy.aegis.developmentSweepRiskProfiles.$domain
      if ($null -eq $src) {
        $profiles[$domain] = $defaults
        continue
      }

      $requiredChecks = @()
      foreach ($item in @($src.requiredChecks)) {
        $s = [string]$item
        if (-not [string]::IsNullOrWhiteSpace($s)) { $requiredChecks += $s }
      }
      if ($requiredChecks.Count -eq 0) { $requiredChecks = @($defaults.requiredChecks) }

      $optionalChecks = @()
      foreach ($item in @($src.optionalChecks)) {
        $s = [string]$item
        if (-not [string]::IsNullOrWhiteSpace($s)) { $optionalChecks += $s }
      }

      $profiles[$domain] = @{
        requiredChecks = $requiredChecks
        optionalChecks = $optionalChecks
      }
    }

    $cfg.profiles = $profiles
  }

  return $cfg
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

$policy = $null
if (Test-Path $policyFile) {
  try {
    $policy = Get-Content $policyFile -Raw | ConvertFrom-Json
  } catch {
    $result.warnings += "policy.json parse failed in development sweep; using default risk config"
  }
}
$riskCfg = Get-SweepRiskConfig -Policy $policy

$checks = @(
  @{ Name = "test:run"; Purpose = "Unit/component regression"; Required = $true },
  @{ Name = "test:assistant-contract"; Purpose = "Assistant contract checks"; Required = $false },
  @{ Name = "verify:runtime:dry"; Purpose = "Backend/runtime dry verification"; Required = $false }
)

$riskDomain = Get-RiskDomain -TaskTitle $TaskTitle -TaskPhase $TaskPhase -TaskLane $TaskLane
$result.riskTier = @{
  domain = $riskDomain
  enabled = [bool]$riskCfg.enabled
  blockOnMissingRequired = [bool]$riskCfg.blockOnMissingRequired
}

if ([bool]$riskCfg.enabled) {
  $profile = $riskCfg.profiles[$riskDomain]
  if ($null -eq $profile) {
    $profile = $riskCfg.profiles["general"]
  }

  $riskRequired = @($profile.requiredChecks)
  $riskOptional = @($profile.optionalChecks)
  $result.riskTier.requiredSelection = $riskRequired

  foreach ($name in $riskRequired) {
    $checks += @{ Name = [string]$name; Purpose = ("Risk-tier required ({0})" -f $riskDomain); Required = $true }
  }
  foreach ($name in $riskOptional) {
    $checks += @{ Name = [string]$name; Purpose = ("Risk-tier optional ({0})" -f $riskDomain); Required = $false }
  }
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
      $msg = "Missing npm script: $scriptName (required by sweep profile)"
      if ([bool]$riskCfg.blockOnMissingRequired) {
        $result.blockers += $msg
      } else {
        $result.warnings += $msg
      }
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
