<#
.SYNOPSIS
    Rapid Sprint Protocol (Pull -> Implement -> Push -> Dev)

.DESCRIPTION
    This script automates the fast-forward rapid development workflow requested by the user:
    1. Git Pull (Sync branch)
    2. Batch Implementation (AI Agent edits)
    3. Git Add, Commit, Push (Deploy changes)
    4. Run Dev Server (npm run dev)
    
    This protocol is optimized for high-velocity prototyping and continuous delivery to the main branch.
#>

Write-Host "🚀 Starting AEGIS Rapid Sprint Protocol" -ForegroundColor Cyan

Write-Host "[1/4] Syncing Repository..." -ForegroundColor Yellow
git status
git pull origin main

Write-Host "[2/4] Awaiting Agent Implementation Phase..." -ForegroundColor Yellow
# In a real AEGIS flow, the orchestrator invokes the premium agent here to apply fixes and improvements.
# E.g., npm run aegis:dispatch -- --task "improve 5 and fix 5"

Write-Host "[3/4] Committing and Pushing Changes..." -ForegroundColor Yellow
git add .
$commitMessage = "AEGIS Rapid Sprint: Applied automated fixes and improvements"
git commit -m $commitMessage
git push origin main

Write-Host "[4/4] Starting Development Server..." -ForegroundColor Yellow
Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -NoNewWindow
Write-Host "✅ Rapid Sprint Protocol Complete. Dev server is running in the background." -ForegroundColor Green
