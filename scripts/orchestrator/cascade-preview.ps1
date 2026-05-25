# cascade-preview.ps1 -- Simulate the ripple effect of completing a READY task.
# For any task you are about to run, shows in advance:
#   - Which downstream tasks will AUTO-COMPLETE (target file already PASS)
#   - Which tasks become newly READY (need human paste next)
#   - Net queue delta (+done, +ready) before you ever execute a thing
#   - -ShowAll mode: ranks ALL ready tasks by cascade score so you pick the highest impact
#
# Usage:
#   npm run orchestrator:cascade -- -TaskId T002      # tree for one task
#   npm run orchestrator:cascade:all                  # rank ALL ready tasks
#   npm run orchestrator:cascade -- -TaskId T002 -Brief
#   (no args) = auto-pick first READY task in lane priority A->B->C->D

param(
  [string]$TaskId        = "",
  [switch]$ShowAll,
  [string]$WorkspaceRoot = ".",
  [int]$MaxDepth         = 8,
  [switch]$Brief
)

$ErrorActionPreference = "Continue"
$SECS_PER_SESSION = 3
$w = 72
$root        = Resolve-Path $WorkspaceRoot
$queueFile   = Join-Path $root "logs\orchestrator\task-queue.json"
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"

if (-not (Test-Path $queueFile))   { Write-Host "[ERROR] queue not found"   -ForegroundColor Red; exit 1 }
if (-not (Test-Path $promptsFile)) { Write-Host "[ERROR] prompts not found" -ForegroundColor Red; exit 1 }

$q       = Get-Content $queueFile   -Raw | ConvertFrom-Json
$prompts = Get-Content $promptsFile -Raw | ConvertFrom-Json
$tasks   = @($q.tasks)

# -- gate targets -------------------------------------------------------------
$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md"     = 12
  "business_docs/05_requirements/risk-register.md"               = 5
  "business_docs/05_requirements/non-functional-requirements.md" = 8
  "business_docs/07_business_model/revenue-model.md"             = 13
  "business_docs/03_ai_assistants/README.md"                     = 40
  "business_docs/06_design_architecture/system-architecture.md"  = 12
  "business_docs/06_design_architecture/ui-ux-specification.md"  = 20
  "business_docs/09_crm_features/tenancy-ejari.md"               = 14
  "business_docs/09_crm_features/landlord-portal.md"             = 13
  "business_docs/09_crm_features/financial-reporting.md"         = 11
  "business_docs/09_crm_features/analytics-dashboard.md"         = 22
  "business_docs/09_crm_features/agent-performance.md"           = 14
  "business_docs/09_crm_features/lead-tracking.md"               = 12
  "business_docs/09_crm_features/tenant-portal.md"               = 14
  "business_docs/09_crm_features/dld-integration.md"             = 12
  "business_docs/09_crm_features/legal-management.md"            = 12
  "business_docs/09_crm_features/audit-trail.md"                 = 10
  "business_docs/09_crm_features/activity-feed.md"               = 8
  "business_docs/09_crm_features/follow-up-automation.md"        = 10
  "business_docs/09_crm_features/off-plan-projects.md"           = 14
  "business_docs/09_crm_features/handover-management.md"         = 10
  "business_docs/09_crm_features/scheduling-calendar.md"         = 12
  "business_docs/09_crm_features/viewings.md"                    = 10
  "business_docs/09_crm_features/offers.md"                      = 12
  "business_docs/09_crm_features/whatsapp-integration.md"        = 14
  "business_docs/09_crm_features/property-valuation.md"          = 10
  "business_docs/09_crm_features/market-intelligence.md"         = 10
  "business_docs/09_crm_features/market-analytics.md"            = 10
  "business_docs/09_crm_features/currency-management.md"         = 8
  "business_docs/09_crm_features/secondary-sales.md"             = 10
  "business_docs/09_crm_features/sentinel-property.md"           = 12
  "business_docs/09_crm_features/investment-management.md"       = 10
  "business_docs/09_crm_features/prospecting-outbound.md"        = 10
  "business_docs/09_crm_features/ai-chat.md"                     = 12
  "business_docs/09_crm_features/maintenance.md"                 = 10
  "business_docs/09_crm_features/document-generation.md"         = 10
  "business_docs/09_crm_features/email-automation.md"            = 8
  "business_docs/09_crm_features/seo-strategy.md"                = 16
  "business_docs/09_crm_features/marketing-campaigns.md"         = 12
  "business_docs/09_crm_features/luxury-segment.md"              = 10
  "business_docs/09_crm_features/community-management.md"        = 8
  "business_docs/09_crm_features/careers.md"                     = 8
}

$tools = @{
  "@Sofia"    = "https://aistudio.google.com/"
  "@Victoria" = "https://aistudio.google.com/"
  "@Annie"    = "https://aistudio.google.com/"
  "@Marissa"  = "https://aistudio.google.com/"
  "@Rachel"   = "https://aistudio.google.com/"
  "@Timnit"   = "https://aistudio.google.com/"
  "@Invoice"  = "https://console.groq.com/"
  "@Joelle"   = "https://console.groq.com/"
  "@Hedy"     = "https://console.groq.com/"
  "@Maya"     = "https://console.groq.com/"
  "@Booking"  = "https://console.groq.com/"
  "@Jaime"    = "https://console.groq.com/"
  "@Fei-Fei"  = "https://chat.deepseek.com/"
  "@Anima"    = "https://chat.deepseek.com/"
  "@Mary"     = "https://chat.deepseek.com/"
  "@Cassie"   = "https://chat.deepseek.com/"
  "@Corinne"  = "https://chat.deepseek.com/"
}

# -- section count cache ------------------------------------------------------
$sectionCache = @{}

function Get-FileSectionsCached([string]$rel) {
  if ($rel -eq "") { return 0 }
  if ($sectionCache.ContainsKey($rel)) { return $sectionCache[$rel] }
  $abs   = Join-Path $root $rel.Replace("/", "\")
  $count = if (Test-Path $abs) { @(Get-Content $abs | Where-Object { $_ -match "^##\s|^###\s" }).Count } else { 0 }
  $sectionCache[$rel] = $count
  return $count
}

function Get-Prompt([string]$id) {
  try { $val = $prompts.$id } catch { $val = $null }
  if ($null -ne $val -and $val -ne "") {
    if ($val -is [string]) { return [string]$val }
    if ($val.PSObject.Properties.Name -contains "prompt") { return [string]$val.prompt }
    return [string]$val
  }
  $t = @($tasks | Where-Object { $_.taskId -eq $id })[0]
  if ($null -ne $t) { return [string]$t.title }
  return ""
}

function Get-TargetFile([string]$prompt) {
  if ($prompt -match "(business_docs/[\w/_.-]+\.md)") { return $Matches[1] }
  if ($prompt -match "\b([\w-]+\.md)\b") {
    $name = $Matches[1]
    foreach ($k in $gateTargets.Keys) {
      if ($k -like "*/$name") { return $k }
    }
    return "business_docs/09_crm_features/$name"
  }
  return ""
}

function Test-FilePass([string]$rel) {
  if ($rel -eq "" -or -not $gateTargets.ContainsKey($rel)) { return $false }
  return (Get-FileSectionsCached $rel) -ge $gateTargets[$rel]
}

function Test-AllDepsDone([array]$deps, [array]$cloned) {
  if ($null -eq $deps -or $deps.Count -eq 0) { return $true }
  foreach ($d in $deps) {
    $dep = @($cloned | Where-Object { $_.taskId -eq $d })[0]
    if ($null -eq $dep -or $dep.status -ne "done") { return $false }
  }
  return $true
}

function Test-AllDepsDoneReal([array]$deps) {
  return (Test-AllDepsDone $deps $tasks)
}

# Deep-clone the tasks array (mutable PSCustomObjects)
function Get-ClonedTasks {
  $arr  = $tasks | ForEach-Object { $_ | ConvertTo-Json -Depth 4 }
  $json = "[" + ($arr -join ",") + "]"
  return @($json | ConvertFrom-Json)
}

function Get-PromptSnippet([string]$prompt) {
  if ($prompt.Length -le 72) { return $prompt }
  return $prompt.Substring(0, 69) + "..."
}

function Get-Bar([int]$cur, [int]$max) {
  if ($max -le 0) { return "[----------]" }
  $f = [math]::Min(10, [math]::Round($cur / $max * 10))
  return "[" + ("#" * $f) + ("." * (10 - $f)) + "]"
}

# cascade score = auto-completes + 0.5 x newly-ready (reflects real effort saved)
function Get-CascadeScore([int]$autoCount, [int]$readyCount) {
  return $autoCount + [math]::Round($readyCount * 0.5, 1)
}

# ============================================================================
# CORE: Invoke-Cascade
# Mutates $cloned in-place (marks completed tasks as "done").
# Returns @{ Cascaded=List; NewReady=List }
#   Cascaded items: {TaskId, Agent, Lane, Level, TargetFile, CurSecs, Needed}
#   NewReady items: same schema + Gap, EtaSess
# ============================================================================
function Invoke-Cascade([string]$rootId, [array]$cloned, [int]$maxDepth) {
  $cascaded = [System.Collections.Generic.List[hashtable]]::new()
  $newReady = [System.Collections.Generic.List[hashtable]]::new()
  $visited  = [System.Collections.Generic.HashSet[string]]::new()

  # Use ArrayList so .Add() keeps items as separate hashtables (no key-merge quirk)
  $workQ = [System.Collections.ArrayList]::new()

  $rootTask = @($cloned | Where-Object { $_.taskId -eq $rootId })[0]
  if ($null -eq $rootTask) { return @{ Cascaded = $cascaded; NewReady = $newReady } }
  $rootTask.status = "done"
  $visited.Add($rootId) | Out-Null
  $workQ.Add(@{ TaskId = $rootId; Level = 0 }) | Out-Null

  while ($workQ.Count -gt 0) {
    $cur      = $workQ[0]
    $workQ.RemoveAt(0)
    $curLevel = $cur.Level
    if ($curLevel -ge $maxDepth) { continue }

    foreach ($t in $cloned) {
      $tid = $t.taskId
      if ($visited.Contains($tid)) { continue }
      if ($t.status -ne "queued")  { continue }

      $tDeps = @($t.dependsOn)
      if (-not (Test-AllDepsDone $tDeps $cloned)) { continue }

      # Task just became READY
      $visited.Add($tid) | Out-Null
      $tAgent = $t.agent
      $tLane  = $t.lane
      $prompt = Get-Prompt $tid
      $tf     = Get-TargetFile $prompt
      $curS   = Get-FileSectionsCached $tf
      $needed = if ($gateTargets.ContainsKey($tf)) { $gateTargets[$tf] } else { 0 }
      $gap    = [math]::Max(0, $needed - $curS)
      $eta    = [math]::Ceiling($gap / $SECS_PER_SESSION)

      if (Test-FilePass $tf) {
        $t.status = "done"
        $cascaded.Add(@{
          TaskId     = $tid
          Agent      = $tAgent
          Lane       = $tLane
          Level      = ($curLevel + 1)
          TargetFile = $tf
          CurSecs    = $curS
          Needed     = $needed
          Gap        = 0
          EtaSess    = 0
        })
        $workQ.Add(@{ TaskId = $tid; Level = ($curLevel + 1) }) | Out-Null
      } else {
        $newReady.Add(@{
          TaskId     = $tid
          Agent      = $tAgent
          Lane       = $tLane
          Level      = ($curLevel + 1)
          TargetFile = $tf
          CurSecs    = $curS
          Needed     = $needed
          Gap        = $gap
          EtaSess    = $eta
        })
        # Do NOT recurse -- needs human paste before it can cascade further
      }
    }
  }

  return @{ Cascaded = $cascaded; NewReady = $newReady }
}

# ============================================================================
# DISPLAY: full cascade tree for a single TaskId
# ============================================================================
$laneColors = @{ "A" = "Cyan"; "B" = "Yellow"; "C" = "Green"; "D" = "Magenta" }

function Show-CascadeTree([string]$targetId) {
  $tinfo = @($tasks | Where-Object { $_.taskId -eq $targetId })[0]
  if ($null -eq $tinfo) {
    Write-Host ("  [ERROR] Task {0} not found in queue." -f $targetId) -ForegroundColor Red
    return
  }
  if ($tinfo.status -eq "done") {
    Write-Host ("  Task {0} is already done -- nothing to preview." -f $targetId) -ForegroundColor DarkGray
    return
  }

  $cloned = Get-ClonedTasks
  $deps   = @($tinfo.dependsOn)

  $isReady = Test-AllDepsDoneReal $deps
  if (-not $isReady) {
    Write-Host ("  [!!] Task {0} is BLOCKED in real queue -- simulating as if deps were done." -f $targetId) -ForegroundColor Yellow
    Write-Host "  (Cascade is hypothetical; complete upstream tasks first)" -ForegroundColor DarkGray
    Write-Host ""
    # Pre-mark all deps as done in clone so simulation works
    foreach ($d in $deps) {
      $depT = @($cloned | Where-Object { $_.taskId -eq $d })[0]
      if ($null -ne $depT) { $depT.status = "done" }
    }
  }

  $result    = Invoke-Cascade $targetId $cloned $MaxDepth
  $cascaded  = $result.Cascaded
  $newReady  = $result.NewReady
  $score     = Get-CascadeScore $cascaded.Count $newReady.Count
  $doneBefore = @($tasks | Where-Object { $_.status -eq "done" }).Count
  $doneAfter  = $doneBefore + $cascaded.Count + 1   # +1 for the root task itself
  $tool       = if ($tools.ContainsKey($tinfo.agent)) { $tools[$tinfo.agent] } else { "https://aistudio.google.com/" }
  $prompt     = Get-Prompt $targetId
  $lc         = if ($laneColors.ContainsKey($tinfo.lane)) { $laneColors[$tinfo.lane] } else { "White" }

  # Header
  Write-Host ("=" * $w) -ForegroundColor $lc
  Write-Host ("  CASCADE PREVIEW  |  {0}  ({1})  Lane {2}" -f $targetId, $tinfo.agent, $tinfo.lane) -ForegroundColor $lc
  Write-Host ("  Score: {0}  |  Auto-completes: {1}  |  Newly READY: {2}  |  Queue: {3}->{4}/{5}" -f `
    $score, $cascaded.Count, $newReady.Count, $doneBefore, $doneAfter, $tasks.Count) -ForegroundColor White
  Write-Host ("=" * $w) -ForegroundColor $lc
  Write-Host ""

  # Level 0: root task
  Write-Host ("  L0  [PASTE THIS]  {0}  {1}  Lane {2}" -f $targetId, $tinfo.agent, $tinfo.lane) -ForegroundColor $lc
  Write-Host ("      Tool: {0}" -f $tool) -ForegroundColor DarkGray
  if (-not $Brief -and $prompt -ne "") {
    Write-Host ("      Prompt: {0}" -f (Get-PromptSnippet $prompt)) -ForegroundColor DarkGray
  }
  Write-Host ""

  if ($cascaded.Count -eq 0 -and $newReady.Count -eq 0) {
    Write-Host "  No downstream tasks are affected (all dependents still have other unresolved deps)." -ForegroundColor DarkGray
  } else {
    # Find max level across both lists
    $maxLvl = 0
    foreach ($item in $cascaded) { if ($item.Level -gt $maxLvl) { $maxLvl = $item.Level } }
    foreach ($item in $newReady)  { if ($item.Level -gt $maxLvl) { $maxLvl = $item.Level } }

    for ($lvl = 1; $lvl -le $maxLvl; $lvl++) {
      $lvlC = @($cascaded | Where-Object { $_.Level -eq $lvl })
      $lvlR = @($newReady  | Where-Object { $_.Level -eq $lvl })
      if ($lvlC.Count -eq 0 -and $lvlR.Count -eq 0) { continue }

      Write-Host ("  -- Level {0} --------------------------------------------------" -f $lvl) -ForegroundColor DarkGray

      foreach ($item in $lvlC) {
        $ilc   = if ($laneColors.ContainsKey($item.Lane)) { $laneColors[$item.Lane] } else { "White" }
        $fname = $item.TargetFile.Split("/")[-1]
        $bar   = Get-Bar $item.CurSecs $item.Needed
        Write-Host ("  L{0}  [AUTO-COMPLETE]  {1,-6} {2,-10}  Lane {3}" -f $lvl, $item.TaskId, $item.Agent, $item.Lane) -ForegroundColor Green
        if (-not $Brief) {
          Write-Host ("       {0} {1}/{2} secs  {3}  (PASS -> auto-done)" -f $bar, $item.CurSecs, $item.Needed, $fname) -ForegroundColor DarkGray
        }
      }

      foreach ($item in $lvlR) {
        $ilc   = if ($laneColors.ContainsKey($item.Lane)) { $laneColors[$item.Lane] } else { "White" }
        $fname = $item.TargetFile.Split("/")[-1]
        $bar   = Get-Bar $item.CurSecs $item.Needed
        $etaStr = if ($item.EtaSess -le 1) { "~1 paste" } else { "~{0} pastes" -f $item.EtaSess }
        Write-Host ("  L{0}  [NEWLY READY]   {1,-6} {2,-10}  Lane {3}" -f $lvl, $item.TaskId, $item.Agent, $item.Lane) -ForegroundColor $ilc
        if (-not $Brief) {
          Write-Host ("       {0} {1}/{2} secs  {3}  gap={4} ({5})" -f $bar, $item.CurSecs, $item.Needed, $fname, $item.Gap, $etaStr) -ForegroundColor DarkGray
        }
      }
      Write-Host ""
    }
  }

  # Summary
  Write-Host ("=" * $w) -ForegroundColor $lc
  Write-Host ("  RESULT: Completing {0} auto-finishes +{1} tasks, unblocks +{2} more" -f $targetId, $cascaded.Count, $newReady.Count) -ForegroundColor White
  Write-Host ("  Queue progress: {0}/{1} done  ->  {2}/{1} done  (cascade score: {3})" -f $doneBefore, $tasks.Count, $doneAfter, $score) -ForegroundColor DarkGray
  Write-Host ("  When done: npm run orchestrator:complete-advance -- -TaskId {0} -AgentName `"{1}`"" -f $targetId, $tinfo.agent) -ForegroundColor Cyan
  Write-Host ("=" * $w) -ForegroundColor $lc
  Write-Host ""
}

# ============================================================================
# DISPLAY: rank ALL ready tasks by cascade score
# ============================================================================
function Show-AllRanked {
  $readyTasks = @($tasks | Where-Object {
    $t = $_
    $t.status -eq "queued" -and (Test-AllDepsDoneReal @($t.dependsOn))
  })

  if ($readyTasks.Count -eq 0) {
    Write-Host "  No READY tasks found." -ForegroundColor DarkGray
    return
  }

  Write-Host ("=" * $w) -ForegroundColor Yellow
  Write-Host "  CASCADE SCORE RANKING -- ALL READY TASKS" -ForegroundColor Yellow
  Write-Host ("  Simulating each task completion and measuring downstream ripple...") -ForegroundColor DarkGray
  Write-Host ("=" * $w) -ForegroundColor Yellow
  Write-Host ""

  $rankings = [System.Collections.Generic.List[hashtable]]::new()
  foreach ($rt in $readyTasks) {
    $cloned  = Get-ClonedTasks
    $result  = Invoke-Cascade $rt.taskId $cloned $MaxDepth
    $cascaded = $result.Cascaded
    $newReady = $result.NewReady
    $score    = Get-CascadeScore $cascaded.Count $newReady.Count
    $rankings.Add(@{
      TaskId     = $rt.taskId
      Agent      = $rt.agent
      Lane       = $rt.lane
      Title      = $rt.title
      Score      = $score
      AutoCount  = $cascaded.Count
      ReadyCount = $newReady.Count
    })
  }

  $ranked = @($rankings | Sort-Object { $_.Score } -Descending)

  $rank = 1
  foreach ($r in $ranked) {
    $lc  = if ($laneColors.ContainsKey($r.Lane)) { $laneColors[$r.Lane] } else { "White" }
    $tag = if ($rank -eq 1) { "  <-- HIGHEST IMPACT -- run this first" } else { "" }
    Write-Host ("  Rank {0}: {1,-6} {2,-10}  Lane {3}  score={4,-5}  (auto={5}, ready={6}){7}" -f `
      $rank, $r.TaskId, $r.Agent, $r.Lane, $r.Score, $r.AutoCount, $r.ReadyCount, $tag) -ForegroundColor $lc
    if (-not $Brief) {
      Write-Host ("         {0}" -f $r.Title) -ForegroundColor DarkGray
    }
    $rank++
  }

  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Yellow
  $best = $ranked[0]
  $bestLc = if ($laneColors.ContainsKey($best.Lane)) { $laneColors[$best.Lane] } else { "White" }
  Write-Host ("  RECOMMENDATION: {0} ({1}) -- completing this unlocks the most work" -f $best.TaskId, $best.Agent) -ForegroundColor Green
  Write-Host ("  Full tree: npm run orchestrator:cascade -- -TaskId {0}" -f $best.TaskId) -ForegroundColor Cyan
  Write-Host ("  Run now : npm run orchestrator:next-agent -- -TaskId {0}" -f $best.TaskId) -ForegroundColor White
  Write-Host ("=" * $w) -ForegroundColor Yellow
  Write-Host ""
}

# ============================================================================
# MAIN
# ============================================================================
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- CASCADE PREVIEW" -ForegroundColor Cyan
$doneCnt = @($tasks | Where-Object { $_.status -eq "done" }).Count
$rdyCnt  = @($tasks | Where-Object {
  $t = $_
  $t.status -eq "queued" -and (Test-AllDepsDoneReal @($t.dependsOn))
}).Count
Write-Host ("  Queue: {0}/{1} done  |  {2} READY  |  {3} blocked" -f $doneCnt, $tasks.Count, $rdyCnt, ($tasks.Count - $doneCnt - $rdyCnt)) -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

if ($ShowAll) {
  Show-AllRanked
} elseif ($TaskId -ne "") {
  Show-CascadeTree $TaskId
} else {
  # Auto-pick: highest-priority READY task (Lane A first, within lane: lowest taskId)
  $autoTask = $null
  foreach ($lane in @("A", "B", "C", "D")) {
    $candidates = @($tasks | Where-Object {
      $t = $_
      $t.status -eq "queued" -and $t.lane -eq $lane -and (Test-AllDepsDoneReal @($t.dependsOn))
    } | Sort-Object { $_.taskId })
    if ($candidates.Count -gt 0) { $autoTask = $candidates[0]; break }
  }

  if ($null -ne $autoTask) {
    Write-Host ("  No -TaskId specified. Auto-selected: {0} ({1})  Lane {2}" -f $autoTask.taskId, $autoTask.agent, $autoTask.lane) -ForegroundColor DarkGray
    Write-Host "  Tip: -ShowAll to rank ALL ready tasks by cascade score" -ForegroundColor DarkGray
    Write-Host ""
    Show-CascadeTree $autoTask.taskId
  } else {
    Write-Host "  Usage:" -ForegroundColor White
    Write-Host "    npm run orchestrator:cascade -- -TaskId T002     # tree for specific task" -ForegroundColor DarkGray
    Write-Host "    npm run orchestrator:cascade:all                 # rank all READY tasks" -ForegroundColor DarkGray
    Write-Host "    npm run orchestrator:cascade -- -TaskId T002 -Brief" -ForegroundColor DarkGray
  }
}

exit 0
