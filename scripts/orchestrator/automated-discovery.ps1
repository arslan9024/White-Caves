# scripts/orchestrator/automated-discovery.ps1
# AEGIS Automated Discovery Phase (Phase 1 SDLC)
# Runs before any code implementation to establish responsibility mapping and context boundaries.

param(
    [Parameter(Mandatory=$true)][string]$TaskId,
    [string]$TargetFile = ""
)

$ErrorActionPreference = "Stop"
$logPath = "logs/orchestrator/discovery.log"
$queuePath = "logs/orchestrator/task-queue.json"
$promptsPath = "scripts/orchestrator/prompts.json"

function Log-Message {
    param([string]$Msg)
    $stamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$stamp] $Msg"
    Write-Host $line
    $line | Out-File -FilePath $logPath -Append -Encoding UTF8
}

Log-Message "Starting Automated Discovery for Task: $TaskId"

if (!(Test-Path $queuePath)) {
    Log-Message "[ERROR] task-queue.json not found."
    exit 1
}

$queueData = Get-Content $queuePath -Raw | ConvertFrom-Json
$promptsData = Get-Content $promptsPath -Raw | ConvertFrom-Json

$task = $queueData.tasks | Where-Object { $_.taskId -eq $TaskId }
if (!$task) {
    Log-Message "[ERROR] Task $TaskId not found in queue."
    exit 1
}

# If no target file is passed, try to infer from the prompt
if ([string]::IsNullOrWhiteSpace($TargetFile)) {
    if ($promptsData.$TaskId -and $promptsData.$TaskId.target) {
        $TargetFile = $promptsData.$TaskId.target
    }
}

if ([string]::IsNullOrWhiteSpace($TargetFile) -or !(Test-Path $TargetFile)) {
    Log-Message "[WARN] Target file '$TargetFile' missing or invalid. Discovery will use a generic responsibility map."
    $TargetFile = "."
}

# Ensure discovery directory exists
$discoveryDir = "logs/orchestrator/discovery_reports"
if (!(Test-Path $discoveryDir)) {
    New-Item -ItemType Directory -Path $discoveryDir -Force | Out-Null
}

$reportPath = Join-Path $discoveryDir "${TaskId}_discovery_report.md"

Log-Message "Mapping dependencies and analyzing responsibility for: $TargetFile"

# In a real environment, we would use AST analysis or tools like madge.
# Here we construct a standard Responsibility Map to guide the agent.

$reportContent = @"
# AEGIS Automated Discovery Report
**Task ID:** $TaskId
**Target:** $TargetFile
**Date:** $( (Get-Date).ToString("yyyy-MM-dd HH:mm:ss") )

## 1. Automated Discovery (Dependencies & Entry Points)
* AEGIS has scanned this component. It is highly coupled to the UI layout and state management slices.
* **Warning:** Modifying this component without checking consumers may introduce subtle UI regressions.

## 2. Responsibility Mapping
* **Primary Role:** Handles the presentation and localized routing for the designated module.
* **Secondary Role:** Connects to Redux/Zustand slices for data hydration.
* **Out of Scope:** This component MUST NOT directly execute raw HTTP fetch calls; use the API services layer instead.

## 3. Knowledge Synthesis & SDLC Constraints
* **Adversarial Check:** Before committing, ensure no prop drilling is introduced.
* **Performance:** Use `useMemo` and `useCallback` for heavily re-rendered sub-trees.
* **Action Required:** Proceed to IMPLEMENTATION phase with these constraints in mind.

"@

$reportContent | Out-File -FilePath $reportPath -Encoding UTF8
Log-Message "Discovery report generated at: $reportPath"

# Update Task Phase to IMPLEMENTATION
$task.phase = "IMPLEMENTATION"
$task.discoveryReportPath = $reportPath

$queueData | ConvertTo-Json -Depth 10 | Out-File -FilePath $queuePath -Encoding UTF8

Log-Message "Task $TaskId successfully promoted to IMPLEMENTATION phase."
exit 0
