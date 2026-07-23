function Invoke-AegisBrowserLaunch {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url,

    [Parameter(Mandatory = $true)]
    [string]$WorkspaceRoot,

    [int]$CooldownMinutes = 30,

    [switch]$Force
  )

  if ($Force) {
    Start-Process $Url
    return [pscustomobject]@{
      launched = $true
      skipped = $false
      reason = "forced"
    }
  }

  $logsDir = Join-Path $WorkspaceRoot "logs\orchestrator"
  $stateFile = Join-Path $logsDir "browser-launch-state.json"
  $now = Get-Date
  $cooldownCutoff = $now.AddMinutes(-1 * [Math]::Abs($CooldownMinutes))
  $normalized = [string]$Url

  if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
  }

  $state = @{}
  if (Test-Path $stateFile) {
    try {
      $raw = Get-Content -Path $stateFile -Raw
      if (-not [string]::IsNullOrWhiteSpace($raw)) {
        $parsed = $raw | ConvertFrom-Json
        if ($parsed -is [System.Collections.IDictionary]) {
          $state = @{}
          foreach ($k in $parsed.Keys) {
            $state[$k] = [string]$parsed[$k]
          }
        } else {
          $state = @{}
          foreach ($prop in $parsed.PSObject.Properties) {
            $state[$prop.Name] = [string]$prop.Value
          }
        }
      }
    } catch {
      $state = @{}
    }
  }

  if ($state.ContainsKey($normalized)) {
    $lastRaw = [string]$state[$normalized]
    $lastAt = $null
    if ([DateTime]::TryParse($lastRaw, [ref]$lastAt)) {
      if ($lastAt -ge $cooldownCutoff) {
        return [pscustomobject]@{
          launched = $false
          skipped = $true
          reason = "cooldown"
          lastLaunchedAt = $lastAt.ToString("o")
        }
      }
    }
  }

  Start-Process $Url
  $state[$normalized] = $now.ToString("o")
  ($state | ConvertTo-Json -Depth 3) | Set-Content -Path $stateFile -Encoding UTF8

  return [pscustomobject]@{
    launched = $true
    skipped = $false
    reason = "launched"
    launchedAt = $now.ToString("o")
  }
}
