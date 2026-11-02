Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "         LIVE INFINITE CRUCIBLE STATUS ENGINE          " -ForegroundColor Cyan
Write-Host "=======================================================`n" -ForegroundColor Cyan

$envFile = ".\.env"
$token = ""
if (Test-Path $envFile) {
    $tokenMatch = Get-Content $envFile | Select-String "^GITHUB_TOKEN=(.*)$"
    if ($tokenMatch) {
        $token = $tokenMatch.Matches.Groups[1].Value.Trim()
    }
}

if (-not $token) {
    Write-Host "[!] Could not find GITHUB_TOKEN in .env for advanced stats." -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.v3+json"
}

$searchUrl = 'https://api.github.com/search/issues?q=repo:arslan9024/White-Caves+state:open+type:issue'
try {
    $searchResponse = Invoke-RestMethod -Uri $searchUrl -Headers $headers -Method Get
    $totalCount = $searchResponse.total_count
    Write-Host "TOTAL REMAINING ISSUES IN REPOSITORY: $totalCount" -ForegroundColor Red
} catch {
    Write-Host "Failed to fetch total count." -ForegroundColor Red
}

$issuesUrl = 'https://api.github.com/repos/arslan9024/White-Caves/issues?state=open&per_page=3'
try {
    $issuesResponse = Invoke-RestMethod -Uri $issuesUrl -Headers $headers -Method Get
    
    if ($issuesResponse) {
        Write-Host "`n--- NEXT TARGETS IN QUEUE ---" -ForegroundColor Yellow
        foreach ($issue in $issuesResponse) {
            if (-not $issue.pull_request) {
                $milestone = "No Milestone"
                if ($issue.milestone) { $milestone = $issue.milestone.title }
                
                Write-Host ">> Issue #$($issue.number): $($issue.title)" -ForegroundColor White
                Write-Host "   Milestone: $milestone" -ForegroundColor DarkGray
                Write-Host "   URL: $($issue.html_url)`n" -ForegroundColor DarkGray
            }
        }
    }
} catch {
    Write-Host "Failed to fetch issue details." -ForegroundColor Red
}

Write-Host "--- LOCAL BATCH PROGRESS ---" -ForegroundColor Yellow
powershell -File .\scripts\orchestrator\infinite-crucible-autopilot.ps1 -Action status

# 4. Fetch Latest Nova Impacts
$impactFile = ".\docs\plans\status\NOVA_CRUCIBLE_IMPACT.md"
if (Test-Path $impactFile) {
    Write-Host "`n--- RECENT NOVA RESOLUTIONS ---" -ForegroundColor Yellow
    $lines = Get-Content $impactFile -Tail 12 -ErrorAction SilentlyContinue | Where-Object { $_.Trim() -ne "" }
    foreach ($line in $lines) {
        Write-Host $line -ForegroundColor Green
    }
}

Write-Host "`n=======================================================" -ForegroundColor Cyan
