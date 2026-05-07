# fast-complete.ps1 -- Cascade auto-completer for tasks whose target doc already passes gate-check.
param(
  [string]$WorkspaceRoot = ".",
  [switch]$DryRun,
  [switch]$Verbose
)

$queueFile   = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
$promptsFile = Join-Path $WorkspaceRoot "scripts\orchestrator\prompts.json"
$mutex       = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")

if (-not (Test-Path $queueFile))   { Write-Host "[ERROR] Queue not found."   -ForegroundColor Red; exit 1 }
if (-not (Test-Path $promptsFile)) { Write-Host "[ERROR] Prompts not found." -ForegroundColor Red; exit 1 }

$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md"    = 12
  "business_docs/05_requirements/non-functional-requirements.md"= 8
  "business_docs/09_crm_features/tenancy-ejari.md"              = 14
  "business_docs/09_crm_features/landlord-portal.md"            = 13
  "business_docs/09_crm_features/financial-reporting.md"        = 11
  "business_docs/07_business_model/revenue-model.md"            = 13
  "business_docs/09_crm_features/analytics-dashboard.md"        = 22
  "business_docs/09_crm_features/agent-performance.md"          = 14
  "business_docs/03_ai_assistants/README.md"                    = 40
  "business_docs/09_crm_features/dld-integration.md"            = 12
  "business_docs/09_crm_features/legal-management.md"           = 12
  "business_docs/09_crm_features/audit-trail.md"                = 10
  "business_docs/09_crm_features/activity-feed.md"              = 8
  "business_docs/09_crm_features/follow-up-automation.md"       = 10
  "business_docs/09_crm_features/off-plan-projects.md"          = 14
  "business_docs/09_crm_features/handover-management.md"        = 10
  "business_docs/09_crm_features/scheduling-calendar.md"        = 12
  "business_docs/09_crm_features/viewings.md"                   = 10
  "business_docs/09_crm_features/offers.md"                     = 12
  "business_docs/09_crm_features/whatsapp-integration.md"       = 14
  "business_docs/09_crm_features/property-valuation.md"        = 10
  "business_docs/09_crm_features/market-intelligence.md"        = 10
  "business_docs/09_crm_features/market-analytics.md"           = 10
  "business_docs/09_crm_features/currency-management.md"        = 8
  "business_docs/09_crm_features/secondary-sales.md"            = 10
  "business_docs/09_crm_features/sentinel-property.md"          = 12
  "business_docs/09_crm_features/investment-management.md"      = 10
  "business_docs/09_crm_features/prospecting-outbound.md"       = 10
  "business_docs/09_crm_features/ai-chat.md"                    = 12
  "business_docs/09_crm_features/maintenance.md"                = 10
  "business_docs/09_crm_features/tenant-portal.md"              = 14
  "business_docs/09_crm_features/document-generation.md"        = 10
  "business_docs/09_crm_features/email-automation.md"           = 8
  "business_docs/09_crm_features/seo-strategy.md"               = 16
  "business_docs/09_crm_features/marketing-campaigns.md"        = 12
  "business_docs/09_crm_features/luxury-segment.md"             = 10
  "business_docs/09_crm_features/community-management.md"       = 8
}

$FALLBACK_MIN = 5

function Get-SecCount([string]$rel,[string]$root){
  $abs=Join-Path $root $rel.Replace("/","\")
  if(-not(Test-Path $abs)){return 0}
  @((Get-Content $abs)|Where-Object{$_ -match "^##\s|^###\s"}).Count
}

function Test-Pass([string]$rel,[string]$root){
  $c=Get-SecCount $rel $root
  if($gateTargets.ContainsKey($rel)){return($c-ge$gateTargets[$rel])}
  return($c-ge$FALLBACK_MIN)
}

function Get-TargetFile([string]$pr){
  if($pr -match "(business_docs/[\w/_-]+\.md)"){return $Matches[1]}
  if($pr -match "\b([\w-]+\.md)\b"){
    $n=$Matches[1]
    foreach($k in $gateTargets.Keys){if($k.EndsWith("/$n")){return $k}}
    return "business_docs/09_crm_features/$n"
  }
  return ""
}

function Test-DepsDone([array]$deps,$all,$vDone){
  if($null-eq$deps-or$deps.Count-eq 0){return $true}
  $vd = if($null-ne $vDone -and $vDone -is [hashtable]){ $vDone } else { @{} }
  foreach($d in $deps){
    if($vd.Count -gt 0 -and $vd.ContainsKey($d)){continue}   # virtually done in dry-run
    $dep=$all|Where-Object{$_.taskId-eq$d}|Select-Object -First 1
    if($null-eq$dep-or$dep.status-ne"done"){return $false}
  }
  return $true
}

function Read-Q{return(Get-Content $queueFile -Raw|ConvertFrom-Json)}
function Save-Q($q){
  $ok=$mutex.WaitOne(5000)
  try{$j=$q|ConvertTo-Json -Depth 12;[System.IO.File]::WriteAllText($queueFile,$j,(New-Object System.Text.UTF8Encoding($false)))}
  finally{if($ok){$mutex.ReleaseMutex()}}
}

$prompts    = Get-Content $promptsFile -Raw|ConvertFrom-Json
$round      = 0
$total      = 0
$chain      = @()
$virtualDone = @{}   # taskId->$true for dry-run virtual completions

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- FAST-COMPLETE CASCADE" -ForegroundColor Cyan
if($DryRun){Write-Host "  MODE: DRY RUN (preview only -- no queue writes)" -ForegroundColor Yellow}
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

do {
  $round++; $doneThisRound=0; $q=Read-Q; $all=@($q.tasks); $changed=$false

  $ready=@($all|Where-Object{
    ($_.status-eq"queued") -and
    (-not $virtualDone.ContainsKey($_.taskId)) -and
    (Test-DepsDone -deps @($_.dependsOn) -all $all -vDone $virtualDone)
  })
  if($Verbose){Write-Host "  Round $round READY: $($ready.Count)" -ForegroundColor DarkGray}
  if($ready.Count -eq 0){ break }

  foreach($t in $ready){
    $pr=$prompts.($t.taskId); if(-not $pr){continue}
    $file=Get-TargetFile $pr; if($file-eq""){continue}
    $passes=Test-Pass $file $WorkspaceRoot
    $count=Get-SecCount $file $WorkspaceRoot
    $tgt=if($gateTargets.ContainsKey($file)){$gateTargets[$file]}else{$FALLBACK_MIN}
    $leaf=Split-Path $file -Leaf

    if($passes){
      Write-Host ("  DONE  {0,-8} [{1,-10}]  {2}  ({3}/{4})" -f $t.taskId,$t.agent,$leaf,$count,$tgt) -ForegroundColor Green
      if(-not $DryRun){
        $now=(Get-Date).ToString("o")
        $tgt2=$q.tasks|Where-Object{$_.taskId-eq$t.taskId}|Select-Object -First 1
        if($null-ne $tgt2){
          $tgt2|Add-Member NoteProperty "status"       "done"          -Force
          $tgt2|Add-Member NoteProperty "startedAt"    $now            -Force
          $tgt2|Add-Member NoteProperty "completedAt"  $now            -Force
          $tgt2|Add-Member NoteProperty "evidenceNote" "Auto-completed by fast-complete.ps1: $count/$tgt sections (gate-check PASS)" -Force
          $tgt2|Add-Member NoteProperty "autoComplete" $true           -Force
          $changed=$true
        }
      } else {
        $virtualDone[$t.taskId] = $true   # track for dry-run dep resolution
        $chain += "$($t.taskId)*"
      }
      $doneThisRound++; $total++
      if(-not $DryRun){ $chain += $t.taskId }
    } elseif($Verbose){
      Write-Host ("  SKIP  {0,-8} [{1,-10}]  {2}  ({3}/{4} -- needs {5} more)" -f $t.taskId,$t.agent,$leaf,$count,$tgt,($tgt-$count)) -ForegroundColor DarkGray
    }
  }
  if($changed){Save-Q $q}
} while($doneThisRound-gt 0)

Write-Host ""
if($total-eq 0){
  Write-Host "  No auto-completable tasks found." -ForegroundColor Yellow
  Write-Host "  All READY tasks target files that still need more sections." -ForegroundColor Yellow
  Write-Host "  Run: npm run orchestrator:today-sprint" -ForegroundColor DarkGray
} else {
  Write-Host ("  Cascade: {0} task(s) auto-completed in {1} round(s)" -f $total,$round) -ForegroundColor Cyan
  Write-Host ("  Chain: {0}" -f ($chain -join " -> ")) -ForegroundColor White
  Write-Host ""
  if(-not $DryRun){
    $q2=Read-Q; $all2=@($q2.tasks)
    $nr=@($all2|Where-Object{$_.status-eq"queued"-and(Test-DepsDone -deps @($_.dependsOn) -all $all2)})
    if($nr.Count-gt 0){
      Write-Host "  Newly READY:" -ForegroundColor Cyan
      $nr|ForEach-Object{Write-Host ("    {0,-8} {1}" -f $_.taskId,$_.agent) -ForegroundColor Green}
    }
  }
}
Write-Host ""
Write-Host "  Run: npm run orchestrator:morning  |  orchestrator:today-sprint  |  orchestrator:gate-check" -ForegroundColor DarkGray
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
exit $(if($total-gt 0){0}else{1})