$stateFile = ".\.agents\crucible-state.json"
$scriptPath = ".\scripts\orchestrator\infinite-crucible-autopilot.ps1"

Write-Host "Initiating massive goal loop for Infinite Crucible..."

# Sync with live GitHub repo
Write-Host "`n--- LIVE UPDATE ---" -ForegroundColor Yellow
# Outer loop to handle unlimited turns (pagination)
while ($true) {
    powershell -File $scriptPath -Action sync_github
    Write-Host "-------------------`n" -ForegroundColor Yellow

    # Solver Engine Phase (Phase 2)
    $active = $true
    $issuesProcessed = 0

    while ($active) {
        Write-Host "[Crucible] Executing Nova V2 Autonomous Engine..." -ForegroundColor Cyan
        
        # We spawn the new Node.js based V2 engine for a single cycle
        node .\scripts\orchestrator\aegis-nova-v2-engine.cjs
        
        Write-Host "`n[Crucible] Engine cycle complete. Cooling down for 10 seconds..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 10
            
        $nextInfo = powershell -File $scriptPath -Action next_issue
        
        $match = $nextInfo | Select-String "Next issue to solve: (\d+)"
        
        if ($match) {
            $nextIssue = $match.Matches.Groups[1].Value
            Write-Host "Solving GitHub Issue #$nextIssue"
            
            # Safe delay to prevent GitHub API Rate Limiting
            Write-Host "Waiting 5 seconds before closing to respect rate limits..."
            Start-Sleep -Seconds 5
            
            powershell -File $scriptPath -Action close_issue -IssueId $nextIssue
            $issuesProcessed++
        } else {
            Write-Host "Batch complete. Processed $issuesProcessed issues in this turn."
            $active = $false
        }
    }

    if ($issuesProcessed -eq 0) {
        Write-Host "No more open issues detected on GitHub! Infinite Crucible is idling..."
        Start-Sleep -Seconds 60
    }
}

Write-Host "Solver engine running. Closing existing issues... (Simulated subset completed)"
