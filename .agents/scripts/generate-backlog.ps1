## Generate Backlog Script
# This script scans all markdown files under business_docs/ for headings and creates a JSON task queue.
# It also adds one task per top‑level feature folder.
# Output is written to logs/orchestrator/task-queue.json (overwrites any existing file).

$docsRoot = Join-Path $PSScriptRoot "..\business_docs"
$taskList = @()
$agentMap = @{
    "09_crm_features" = "@Jaime"
    "05_requirements" = "@Sofia"
    "04_workflows"    = "@Victoria"
    "07_business_model" = "@Invoice"
    "03_ai_assistants" = "@Joelle"
    "08_integrations"   = "@Joelle"
    "06_testing"        = "@Salma"
    "02_infrastructure" = "@Gwynne"
}
# Helper to choose agent based on folder name
function Get-Agent($folder) {
    foreach($key in $agentMap.Keys){
        if($folder -like "*$key*") { return $agentMap[$key] }
    }
    return "@Nova" # default free‑model agent
}
# 1. Scan markdown headings
Get-ChildItem -Path $docsRoot -Recurse -Filter "*.md" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $lines = $content -split "`n"
    foreach($line in $lines){
        if($line -match "^(#{1,3})\s+(.*)"){
            $title = $Matches[2].Trim()
            $agent = Get-Agent $_.DirectoryName
            $lane = "A" # default lane; could be inferred from top folder if needed
            $task = @{ title=$title; agent=$agent; lane=$lane; dependsOn=@(); status="queued"; taskId="" }
            $taskList += $task
        }
    }
}
# 2. Add one task per top‑level feature folder (first level under business_docs)
Get-ChildItem -Path $docsRoot -Directory | ForEach-Object {
    $folderName = $_.Name
    $agent = Get-Agent $_.FullName
    $title = "Feature: $folderName"
    $task = @{ title=$title; agent=$agent; lane="A"; dependsOn=@(); status="queued"; taskId="" }
    $taskList += $task
}
# Trim to 100 tasks
if($taskList.Count -gt 100){ $taskList = $taskList[0..99] }
# Assign incremental taskIds (T001, T002, ...)
for($i=0; $i -lt $taskList.Count; $i++){
    $taskList[$i].taskId = "T" + ($i+1).ToString("D3")
}
# Write JSON
$queuePath = Join-Path $PSScriptRoot "..\logs\orchestrator\task-queue.json"
$taskList | ConvertTo-Json -Depth 5 | Set-Content -Path $queuePath -Encoding UTF8
Write-Host "Generated $($taskList.Count) tasks to $queuePath"
