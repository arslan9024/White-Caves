function Get-OrchestratorPolicy {
  param(
    [Parameter(Mandatory = $true)]
    [string]$WorkspaceRoot
  )

  $policyPath = Join-Path $WorkspaceRoot "scripts\orchestrator\policy.json"
  if (-not (Test-Path $policyPath)) {
    throw "Missing orchestrator policy file: $policyPath"
  }

  $raw = Get-Content -Path $policyPath -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) {
    throw "Orchestrator policy file is empty: $policyPath"
  }

  try {
    $policy = $raw | ConvertFrom-Json
  }
  catch {
    throw "Orchestrator policy is invalid JSON at ${policyPath}: $($_.Exception.Message)"
  }

  $requiredTopLevel = @(
    'version',
    'readinessThresholdPct',
    'approvalPhrase',
    'modelRouting',
    'executionMode',
    'hardStops'
  )

  foreach ($field in $requiredTopLevel) {
    if ($null -eq $policy.$field) {
      throw "Orchestrator policy missing required field '$field' in $policyPath"
    }
  }

  if ($null -eq $policy.modelRouting.freeModelOnlyMode) {
    throw "Orchestrator policy missing required field 'modelRouting.freeModelOnlyMode'"
  }

  if ($null -eq $policy.modelRouting.freePlanningAgents -or @($policy.modelRouting.freePlanningAgents).Count -eq 0) {
    throw "Orchestrator policy missing required non-empty list 'modelRouting.freePlanningAgents'"
  }

  return $policy
}

function Test-IsFreePlanningAgent {
  param(
    [Parameter(Mandatory = $true)]
    [object]$Policy,

    [Parameter(Mandatory = $true)]
    [string]$AgentName
  )

  $allowed = @($Policy.modelRouting.freePlanningAgents)
  return $allowed -contains $AgentName
}
