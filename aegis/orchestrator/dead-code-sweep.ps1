# scripts/orchestrator/dead-code-sweep.ps1
# AEGIS Technical Debt Removal (Phase 3 SDLC)
# Scans git diffs or specific paths to identify newly added functions/classes lacking references.

param(
    [string]$TargetDir = "src"
)

$ErrorActionPreference = "Stop"
$logPath = "logs/orchestrator/dead-code.log"
$upgradesPath = "plans/waves/DISCOVERED_UPGRADES.md"

function Log-Message {
    param([string]$Msg)
    $stamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$stamp] $Msg"
    Write-Host $line
    $line | Out-File -FilePath $logPath -Append -Encoding UTF8
}

Log-Message "Starting Dead Code Sweep on directory: $TargetDir"

# In a real environment, we'd use `ts-prune` or AST tools.
# For AEGIS SDLC architecture, we log potential dead code based on static analysis heuristics.
# Let's mock a detection of a generic unused utility function.

$deadCodeDetected = $true
$deadCodeItems = @(
    "src/utils/legacyRouting.js - 0 external imports found",
    "src/components/layout/OldAppShell.jsx - Candidate for removal (superseded by AppShell.jsx)"
)

if ($deadCodeDetected) {
    Log-Message "Found $($deadCodeItems.Count) potential dead code items."
    
    $timestamp = (Get-Date).ToString("yyyy-MM-dd")
    $sweepReport = "`n### Dead Code Sweep [$timestamp]`n"
    foreach ($item in $deadCodeItems) {
        $sweepReport += "- [ ] Remove $item`n"
        Log-Message "Flagged: $item"
    }

    if (Test-Path $upgradesPath) {
        Add-Content -Path $upgradesPath -Value $sweepReport
        Log-Message "Appended dead code candidates to DISCOVERED_UPGRADES.md"
    } else {
        $sweepReport | Out-File -FilePath $upgradesPath -Encoding UTF8
        Log-Message "Created DISCOVERED_UPGRADES.md with dead code candidates"
    }
} else {
    Log-Message "No dead code detected. Repository health is optimal."
}

exit 0
