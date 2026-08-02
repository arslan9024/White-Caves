param(
  [string]$WorkspaceRoot = ".",
  [switch]$AutoFix,
  [switch]$Brief
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
Set-Location $root

function Resolve-NodeNpmTooling {
  param()

  $resolvedNode = $null
  $resolvedNpm = $null
  $localAppData = if (-not [string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
    $env:LOCALAPPDATA
  } else {
    [Environment]::GetFolderPath('LocalApplicationData')
  }

  function Test-Executable {
    param(
      [string]$CommandPath,
      [string[]]$Args = @("--version")
    )

    if ([string]::IsNullOrWhiteSpace($CommandPath)) { return $false }
    try {
      $null = & $CommandPath @Args 2>$null
      return ($LASTEXITCODE -eq 0)
    } catch {
      return $false
    }
  }

  function Add-Candidate {
    param(
      [System.Collections.Generic.List[string]]$List,
      [string]$Path,
      [switch]$SkipPathCheck
    )

    if ([string]::IsNullOrWhiteSpace($Path)) { return }
    $candidate = [string]$Path
    $candidate = $candidate.Trim().Trim('"')
    if ([string]::IsNullOrWhiteSpace($candidate)) { return }

    if ($SkipPathCheck -or (Test-Path $candidate)) {
      if (-not $List.Contains($candidate)) {
        [void]$List.Add($candidate)
      }
    }
  }

  $nodeCandidates = [System.Collections.Generic.List[string]]::new()
  $npmCandidates = [System.Collections.Generic.List[string]]::new()

  $nodeOnPath = Get-Command node -ErrorAction SilentlyContinue
  if ($null -ne $nodeOnPath) {
    Add-Candidate -List $nodeCandidates -Path ([string]$nodeOnPath.Source) -SkipPathCheck
  }

  $npmCmdOnPath = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if ($null -ne $npmCmdOnPath) {
    Add-Candidate -List $npmCandidates -Path ([string]$npmCmdOnPath.Source) -SkipPathCheck
  }

  $npmOnPath = Get-Command npm -ErrorAction SilentlyContinue
  if ($null -ne $npmOnPath) {
    Add-Candidate -List $npmCandidates -Path ([string]$npmOnPath.Source) -SkipPathCheck
  }

  Add-Candidate -List $nodeCandidates -Path "node" -SkipPathCheck
  Add-Candidate -List $npmCandidates -Path "npm.cmd" -SkipPathCheck

  # cmd.exe fallback (helps when PowerShell command resolution differs by policy/profile)
  try {
    $whereNode = @(& cmd.exe /c "where node" 2>$null)
    foreach ($line in $whereNode) {
      $candidate = [string]$line
      if (-not [string]::IsNullOrWhiteSpace($candidate)) {
        Add-Candidate -List $nodeCandidates -Path $candidate -SkipPathCheck
      }
    }

    $whereNpm = @(& cmd.exe /c "where npm" 2>$null)
    foreach ($line in $whereNpm) {
      $candidate = [string]$line
      if (-not [string]::IsNullOrWhiteSpace($candidate)) {
        if ($candidate -like "*.cmd") {
          Add-Candidate -List $npmCandidates -Path $candidate -SkipPathCheck
        } elseif ($candidate -like "*.ps1") {
          $candidateCmd = [System.IO.Path]::ChangeExtension($candidate, ".cmd")
          Add-Candidate -List $npmCandidates -Path $candidateCmd -SkipPathCheck
        } else {
          Add-Candidate -List $npmCandidates -Path $candidate -SkipPathCheck
        }
      }
    }
  } catch {}

  # Common install locations
  Add-Candidate -List $nodeCandidates -Path (Join-Path $env:ProgramFiles "nodejs\node.exe")
  Add-Candidate -List $npmCandidates -Path (Join-Path $env:ProgramFiles "nodejs\npm.cmd")
  Add-Candidate -List $nodeCandidates -Path (Join-Path $localAppData "Programs\nodejs\node.exe")
  Add-Candidate -List $npmCandidates -Path (Join-Path $localAppData "Programs\nodejs\npm.cmd")
  Add-Candidate -List $nodeCandidates -Path (Join-Path $localAppData "Microsoft\WindowsApps\node.exe") -SkipPathCheck
  Add-Candidate -List $npmCandidates -Path (Join-Path $localAppData "Microsoft\WindowsApps\npm.cmd") -SkipPathCheck
  Add-Candidate -List $nodeCandidates -Path (Join-Path $localAppData "Microsoft\WinGet\Links\node.exe") -SkipPathCheck
  Add-Candidate -List $npmCandidates -Path (Join-Path $localAppData "Microsoft\WinGet\Links\npm.cmd") -SkipPathCheck

  # Registry install locations
  $regPaths = @(
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
  )

  foreach ($regPath in $regPaths) {
    try {
      $installs = Get-ItemProperty -Path $regPath -ErrorAction SilentlyContinue |
        Where-Object { $_.DisplayName -match "Node\.js|OpenJS\.NodeJS" }

      foreach ($install in @($installs)) {
        $loc = [string]$install.InstallLocation
        if (-not [string]::IsNullOrWhiteSpace($loc)) {
          Add-Candidate -List $nodeCandidates -Path (Join-Path $loc "node.exe")
          Add-Candidate -List $npmCandidates -Path (Join-Path $loc "npm.cmd")
        }

        $icon = [string]$install.DisplayIcon
        if (-not [string]::IsNullOrWhiteSpace($icon)) {
          $iconPath = $icon.Split(',')[0].Trim('"')
          if ($iconPath -match "node\.exe$") {
            Add-Candidate -List $nodeCandidates -Path $iconPath
            Add-Candidate -List $npmCandidates -Path (Join-Path (Split-Path $iconPath -Parent) "npm.cmd")
          }
        }
      }
    } catch {}
  }

  # WinGet package folders (portable installs)
  $wingetRoot = Join-Path $localAppData "Microsoft\WinGet\Packages"
  if (Test-Path $wingetRoot) {
    try {
      $wingetNodeBins = @(
        Get-ChildItem -Path $wingetRoot -Recurse -Filter node.exe -ErrorAction SilentlyContinue |
          Where-Object { $_.FullName -match "OpenJS\.NodeJS" }
      )
      foreach ($bin in $wingetNodeBins) {
        Add-Candidate -List $nodeCandidates -Path $bin.FullName
        Add-Candidate -List $npmCandidates -Path (Join-Path $bin.Directory.FullName "npm.cmd")
      }
    } catch {}

    try {
      $explicitRoots = @(Get-ChildItem -Path $wingetRoot -Directory -Filter "OpenJS.NodeJS*" -ErrorAction SilentlyContinue)
      foreach ($explicitRoot in $explicitRoots) {
        $nodeBins = @(Get-ChildItem -Path $explicitRoot.FullName -Recurse -Filter "node.exe" -ErrorAction SilentlyContinue)
        foreach ($bin in $nodeBins) {
          Add-Candidate -List $nodeCandidates -Path $bin.FullName
          Add-Candidate -List $npmCandidates -Path (Join-Path $bin.Directory.FullName "npm.cmd")
        }
      }
    } catch {}
  }

  foreach ($nodeCandidate in $nodeCandidates) {
    if (Test-Executable -CommandPath $nodeCandidate -Args @("--version")) {
      $resolvedNode = $nodeCandidate
      break
    }
  }

  foreach ($npmCandidate in $npmCandidates) {
    if (Test-Executable -CommandPath $npmCandidate -Args @("--version")) {
      $resolvedNpm = $npmCandidate
      break
    }
  }

  if ($null -ne $resolvedNode -and [string]::IsNullOrWhiteSpace($resolvedNpm)) {
    $siblingNpm = Join-Path (Split-Path $resolvedNode -Parent) "npm.cmd"
    if (Test-Path $siblingNpm) {
      $resolvedNpm = $siblingNpm
    }
  }

  if ($null -ne $resolvedNpm -and [string]::IsNullOrWhiteSpace($resolvedNode)) {
    $siblingNode = Join-Path (Split-Path $resolvedNpm -Parent) "node.exe"
    if (Test-Path $siblingNode) {
      $resolvedNode = $siblingNode
    }
  }

  if ($null -ne $resolvedNode) {
    $nodeDir = Split-Path $resolvedNode -Parent
    if (-not [string]::IsNullOrWhiteSpace($nodeDir) -and -not ($env:Path -like "*$nodeDir*")) {
      $env:Path = "$nodeDir;$($env:Path)"
    }
  }

  return [pscustomobject]@{
    Node = $resolvedNode
    NpmCmd = $resolvedNpm
  }
}

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
    [string]$NpmCommand,
    [string]$ScriptName,
    [string]$Purpose
  )

  $cmdOut = @()
  $ok = $false
  $previousNodeOptions = $env:NODE_OPTIONS
  try {
    if ([string]::IsNullOrWhiteSpace($previousNodeOptions)) {
      $env:NODE_OPTIONS = "--max-old-space-size=4096"
    } elseif ($previousNodeOptions -notmatch "max-old-space-size") {
      $env:NODE_OPTIONS = "$previousNodeOptions --max-old-space-size=4096"
    }

    $cmdOut = & $NpmCommand run $ScriptName 2>&1
    $ok = ($LASTEXITCODE -eq 0)
  } catch {
    $cmdOut = @($_.Exception.Message)
    $ok = $false
  } finally {
    $env:NODE_OPTIONS = $previousNodeOptions
  }

  $text = (($cmdOut | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
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

$stateDir = Join-Path $root "logs\orchestrator"
New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
$scanLog = Join-Path $stateDir "project-problem-scan.log"

$result = [ordered]@{
  generatedAt = (Get-Date).ToString("o")
  workspaceRoot = [string]$root
  autoFixEnabled = [bool]$AutoFix
  status = "ok"
  blockers = @()
  warnings = @()
  actions = @()
}

$pkgPath = Join-Path $root "package.json"
if (-not (Test-Path $pkgPath)) {
  $result.status = "blocked"
  $result.blockers += "package.json not found"
  $payload = ($result | ConvertTo-Json -Depth 8)
  if (-not $Brief) { Write-Host $payload }
  else { Write-Output $payload }
  Add-Content -Path $scanLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)
  exit 1
}

$pkg = $null
try {
  $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
} catch {
  $result.status = "blocked"
  $result.blockers += "package.json is not valid JSON"
  $payload = ($result | ConvertTo-Json -Depth 8)
  if (-not $Brief) { Write-Host $payload }
  else { Write-Output $payload }
  Add-Content -Path $scanLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)
  exit 1
}

$tooling = Resolve-NodeNpmTooling
if ([string]::IsNullOrWhiteSpace([string]$tooling.Node) -or [string]::IsNullOrWhiteSpace([string]$tooling.NpmCmd)) {
  $result.status = "blocked"
  if ([string]::IsNullOrWhiteSpace([string]$tooling.Node)) { $result.blockers += "node runtime not found" }
  if ([string]::IsNullOrWhiteSpace([string]$tooling.NpmCmd)) { $result.blockers += "npm.cmd not found" }
  $result.warnings += "Install Node.js >=20.x and ensure npm.cmd is discoverable (PATH or Winget package directory)."
  $payload = ($result | ConvertTo-Json -Depth 8)
  if (-not $Brief) { Write-Host $payload }
  else { Write-Output $payload }
  Add-Content -Path $scanLog -Value ("[{0}] {1}" -f (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"), $payload)
  exit 1
}

$result.nodePath = [string]$tooling.Node
$result.npmCmdPath = [string]$tooling.NpmCmd

$checks = @(
  @{ Name = "typecheck"; Purpose = "Static type safety" },
  @{ Name = "lint"; Purpose = "Code quality and style" },
  @{ Name = "build"; Purpose = "Production build integrity" }
)

$hasFailures = $false
foreach ($check in $checks) {
  $scriptName = [string]$check.Name
  if (-not (Test-NpmScript -Package $pkg -ScriptName $scriptName)) {
    $result.warnings += "Missing npm script: $scriptName"
    continue
  }

  $run = Invoke-NpmScript -NpmCommand ([string]$tooling.NpmCmd) -ScriptName $scriptName -Purpose ([string]$check.Purpose)
  $result.actions += $run
  if (-not $run.ok) {
    $hasFailures = $true

    if ($scriptName -eq "lint" -and $AutoFix -and (Test-NpmScript -Package $pkg -ScriptName "lint:fix")) {
      $fixRun = Invoke-NpmScript -NpmCommand ([string]$tooling.NpmCmd) -ScriptName "lint:fix" -Purpose "Automatic lint remediation"
      $result.actions += $fixRun

      $rerun = Invoke-NpmScript -NpmCommand ([string]$tooling.NpmCmd) -ScriptName "lint" -Purpose "Lint re-check after lint:fix"
      $result.actions += $rerun

      if ($rerun.ok) {
        $hasFailures = $false
        foreach ($a in $result.actions) {
          if ($a.step -ne "lint" -and -not $a.ok) {
            $hasFailures = $true
            break
          }
        }
      }
    }
  }
}

if ($hasFailures) {
  $result.status = "issues_found"
  $failedSteps = @($result.actions | Where-Object { -not $_.ok } | ForEach-Object { $_.step })
  if ($failedSteps.Count -gt 0) {
    $result.blockers += ("Failed checks: " + ($failedSteps -join ", "))
  }
} elseif ($result.warnings.Count -gt 0) {
  $result.status = "ok_with_warnings"
}

$payload = ($result | ConvertTo-Json -Depth 10)
if (-not $Brief) {
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "  AEGIS PROJECT PROBLEM SCAN" -ForegroundColor Cyan
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