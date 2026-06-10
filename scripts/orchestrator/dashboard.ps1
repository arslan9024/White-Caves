# dashboard.ps1 -- Rich visual orchestration dashboard
# Upgraded Aegis views:
# - Pending/Completed tasks
# - Pending/Completed features
# - Module health & strength with world-class scoring
# - Smart Aegis decision recommendations
param(
  [string]$WorkspaceRoot = ".",
  [switch]$Watch,          # if set, refresh every $RefreshSeconds seconds
  [int]$RefreshSeconds = 15,
  [int]$PollSeconds = 1,
  [switch]$RenderOnChangeOnly = $true,
  [switch]$NoClear
)

$stateDir    = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile   = Join-Path $stateDir "task-queue.json"
$pidFile     = Join-Path $stateDir "worker-processes.json"
$wdLog       = Join-Path $stateDir "watchdog-scheduler.log"
$policyFile  = Join-Path $WorkspaceRoot "scripts\orchestrator\policy.json"
$devRuntimeStateFile = Join-Path $stateDir "aegis-dev-runtime-check-state.json"
$devRuntimeSummaryLog = Join-Path $stateDir "dev-runtime-check.log"
$progressIntelligenceFile = Join-Path $stateDir "progress-intelligence.json"
$progressTrendJson = Join-Path $stateDir "progress-intelligence-trend.json"
$progressTrendCsv = Join-Path $stateDir "progress-intelligence-trend.csv"
$script:LastGoodQueue = $null
$script:QueueLargeFallback = $false
$script:QueueFallbackStats = $null

function Read-FileShared {
  param(
    [string]$Path,
    [int]$MaxRetries = 4
  )

  if (-not (Test-Path $Path)) { return $null }

  $attempt = 0
  while ($attempt -lt $MaxRetries) {
    $attempt++
    try {
      $fs = [System.IO.File]::Open($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
      try {
        $sr = New-Object System.IO.StreamReader($fs)
        try {
          return $sr.ReadToEnd()
        } finally {
          $sr.Dispose()
        }
      } finally {
        $fs.Dispose()
      }
    } catch {
      if ($attempt -ge $MaxRetries) {
        return $null
      }
    }
  }

  return $null
}

function Read-Queue {
  $script:QueueLargeFallback = $false
  $script:QueueFallbackStats = $null

  if (-not (Test-Path $queueFile)) {
    return $script:LastGoodQueue
  }

  try {
    $item = Get-Item -Path $queueFile -ErrorAction Stop
    if ($item.Length -gt 2MB) {
      $script:QueueLargeFallback = $true

      $statusCounts = @{}
      $laneCounts = @{}
      $cycle = "N/A"
      $generatedAt = $null

      foreach ($line in [System.IO.File]::ReadLines($queueFile)) {
        if ($cycle -eq "N/A" -and $line -match '"cycle"\s*:\s*"([^"]+)"') {
          $cycle = $Matches[1]
        }
        if ($null -eq $generatedAt -and $line -match '"generatedAt"\s*:\s*"([^"]+)"') {
          $generatedAt = $Matches[1]
        }

        foreach ($m in [System.Text.RegularExpressions.Regex]::Matches($line, '"status"\s*:\s*"([^"]+)"')) {
          $s = [string]$m.Groups[1].Value
          if (-not $statusCounts.ContainsKey($s)) { $statusCounts[$s] = 0 }
          $statusCounts[$s] = [int]$statusCounts[$s] + 1
        }

        foreach ($m in [System.Text.RegularExpressions.Regex]::Matches($line, '"lane"\s*:\s*"([^"]+)"')) {
          $l = [string]$m.Groups[1].Value
          if (-not $laneCounts.ContainsKey($l)) { $laneCounts[$l] = 0 }
          $laneCounts[$l] = [int]$laneCounts[$l] + 1
        }
      }

      $script:QueueFallbackStats = [PSCustomObject]@{
        cycle = $cycle
        generatedAt = $generatedAt
        statusCounts = $statusCounts
        laneCounts = $laneCounts
      }

      return [PSCustomObject]@{
        cycle = $cycle
        generatedAt = $generatedAt
        tasks = @()
      }
    }
  } catch {
    # Fall back to normal read path below.
  }

  for ($attempt = 1; $attempt -le 4; $attempt++) {
    $raw = Read-FileShared -Path $queueFile
    if ([string]::IsNullOrWhiteSpace($raw)) { continue }
    try {
      $parsed = $raw | ConvertFrom-Json
      if ($null -ne $parsed) {
        $script:LastGoodQueue = $parsed
        return $parsed
      }
    } catch {
      # Queue may be mid-write; retry quickly.
      continue
    }
  }

  return $script:LastGoodQueue
}

function Read-Workers {
  if (-not (Test-Path $pidFile)) { return @() }
  $raw = Read-FileShared -Path $pidFile
  if ([string]::IsNullOrWhiteSpace($raw)) { return @() }
  try {
    $parsed = $raw | ConvertFrom-Json
  } catch {
    return @()
  }
  if ($parsed -isnot [array]) { return @($parsed) }
  return $parsed
}

function Get-FileSig {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return "missing"
  }

  try {
    $item = Get-Item -Path $Path -ErrorAction Stop
    return ("{0}:{1}" -f [int64]$item.Length, [int64]$item.LastWriteTimeUtc.Ticks)
  }
  catch {
    return "unreadable"
  }
}

function Get-StreamFingerprint {
  $queueSig = Get-FileSig -Path $queueFile
  $pidSig = Get-FileSig -Path $pidFile
  $wdSig = Get-FileSig -Path $wdLog
  return ("q={0}|p={1}|w={2}" -f $queueSig, $pidSig, $wdSig)
}

function Test-ProcessAlive {
  param([int]$ProcessId)
  try {
    $p = Get-Process -Id $ProcessId -ErrorAction Stop
    return ($null -ne $p)
  }
  catch { return $false }
}

function Write-Header {
  param([string]$Title, [ConsoleColor]$Color = "Cyan")
  $bar = "-" * 60
  Write-Host ""
  Write-Host $bar -ForegroundColor $Color
  Write-Host "  $Title" -ForegroundColor $Color
  Write-Host $bar -ForegroundColor $Color
}

function Get-ModuleNameByLane {
  param([string]$Lane)
  switch ($Lane) {
    "A" { return "Compliance/Legal/UX/AI" }
    "B" { return "Valuation/Market/Finance" }
    "C" { return "Scheduling/Off-plan/Analytics" }
    "D" { return "Offers/WhatsApp/AI Chat" }
    default { return "Unassigned" }
  }
}

function Get-FeatureName {
  param([string]$Title, [string]$Lane)

  $t = ([string]$Title).ToLower()

  if ($t -match "compliance|pdpl|regulator|rera") { return "Compliance & Regulatory" }
  if ($t -match "dld|legal|contract") { return "DLD & Legal" }
  if ($t -match "tenancy|ejari|landlord") { return "Tenancy & Landlord" }
  if ($t -match "tenant portal|document|email automation") { return "Tenant Experience & Document Ops" }
  if ($t -match "ux|community|luxury|design") { return "UX & Community Experience" }
  if ($t -match "seo|campaign|marketing|careers") { return "SEO & Growth" }
  if ($t -match "ai assistant|lead scoring|ai chat") { return "AI Assistants & Intelligence" }
  if ($t -match "valuation|market intelligence|market analytics") { return "Valuation & Market Intelligence" }
  if ($t -match "data pipeline|currency|secondary-sales|analytics dashboard") { return "Data Pipeline & Analytics" }
  if ($t -match "inventory|investment|prospecting") { return "Inventory & Investment" }
  if ($t -match "finance|financial|revenue|vat") { return "Finance & Reporting" }
  if ($t -match "viewing|calendar|scheduling") { return "Scheduling & Viewings" }
  if ($t -match "off-plan|handover|snagging") { return "Off-plan & Handover" }
  if ($t -match "audit|activity feed|follow-up") { return "Audit & Automation" }
  if ($t -match "agent performance|kpi") { return "Performance Analytics" }
  if ($t -match "offer|whatsapp") { return "Offers & Communications" }
  if ($t -match "maintenance|map|geospatial") { return "Maintenance & Map Intelligence" }

  return ("Core " + (Get-ModuleNameByLane -Lane $Lane))
}

function Get-StatusColor {
  param([string]$Status)
  switch ($Status) {
    "done" { return "Green" }
    "running" { return "Cyan" }
    "evidence_pending" { return "DarkYellow" }
    "waiting_ack" { return "Yellow" }
    "queued" { return "Gray" }
    "retrying" { return "Magenta" }
    "failed" { return "Red" }
    "escalated" { return "Red" }
    default { return "White" }
  }
}

function Test-TaskReady {
  param(
    [object]$Task,
    [array]$AllTasks
  )

  if ($null -eq $Task) { return $false }
  if ($Task.status -notin @("queued","retrying","evidence_pending")) { return $false }

  $deps = Get-NormalizedDeps -DependsOn $Task.dependsOn
  if ($null -eq $deps -or $deps.Count -eq 0) { return $true }

  foreach ($dep in $deps) {
    if ([string]::IsNullOrWhiteSpace([string]$dep)) { continue }
    $depTask = $AllTasks | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
    if ($null -eq $depTask -or $depTask.status -ne "done") { return $false }
  }

  return $true
}

function Get-NormalizedDeps {
  param($DependsOn)

  if ($null -eq $DependsOn) { return @() }

  if ($DependsOn -is [System.Collections.IDictionary]) {
    if ($DependsOn.Count -eq 0) { return @() }
    return @($DependsOn.Keys | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) })
  }

  if ($DependsOn -is [string]) {
    if ([string]::IsNullOrWhiteSpace($DependsOn)) { return @() }
    return @($DependsOn)
  }

  $normalized = @()
  foreach ($dep in @($DependsOn)) {
    if ($null -eq $dep) { continue }
    if ($dep -is [System.Collections.IDictionary]) {
      foreach ($k in $dep.Keys) {
        if (-not [string]::IsNullOrWhiteSpace([string]$k)) { $normalized += [string]$k }
      }
      continue
    }

    $s = [string]$dep
    if (-not [string]::IsNullOrWhiteSpace($s)) { $normalized += $s }
  }

  return @($normalized)
}

function Convert-ToDateSafe {
  param($Value)

  if ([string]::IsNullOrWhiteSpace([string]$Value)) { return $null }
  try {
    return [datetime]::Parse([string]$Value)
  }
  catch {
    return $null
  }
}

function Read-JsonShared {
  param([string]$Path)

  if (-not (Test-Path $Path)) { return $null }
  $raw = Read-FileShared -Path $Path
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  try {
    return ($raw | ConvertFrom-Json)
  } catch {
    return $null
  }
}

function Get-TimedDevCheckIntervalHours {
  $defaultHours = 2
  if (-not (Test-Path $policyFile)) { return $defaultHours }
  $policy = Read-JsonShared -Path $policyFile
  if ($null -eq $policy -or $null -eq $policy.aegis) { return $defaultHours }

  $value = $policy.aegis.devRuntimeCheckIntervalHours
  if ($null -eq $value) { return $defaultHours }

  $parsed = 0
  if ([int]::TryParse([string]$value, [ref]$parsed) -and $parsed -ge 1 -and $parsed -le 24) {
    return $parsed
  }

  return $defaultHours
}

function Get-TimedDevCheckState {
  $state = Read-JsonShared -Path $devRuntimeStateFile
  if ($null -ne $state) { return $state }

  if (-not (Test-Path $devRuntimeSummaryLog)) { return $null }
  try {
    $lines = @(Get-Content $devRuntimeSummaryLog -ErrorAction SilentlyContinue)
    if ($lines.Count -eq 0) { return $null }
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
      $line = [string]$lines[$i]
      if ([string]::IsNullOrWhiteSpace($line)) { continue }
      if ($line -notmatch '^[\[]\d{4}-\d{2}-\d{2}') { continue }

      $tail = @($lines[$i..($lines.Count - 1)])
      $joined = ($tail -join [Environment]::NewLine)
      $jsonStart = $joined.IndexOf('{')
      $jsonEnd = $joined.LastIndexOf('}')
      if ($jsonStart -lt 0 -or $jsonEnd -lt $jsonStart) { continue }

      $jsonText = $joined.Substring($jsonStart, ($jsonEnd - $jsonStart + 1))
      try {
        $parsed = $jsonText | ConvertFrom-Json
        if ($null -ne $parsed) { return $parsed }
      } catch {
        continue
      }
    }
  } catch {
    return $null
  }

  return $null
}

function Get-TimedDevCheckNextDue {
  param([object]$State)

  if ($null -eq $State) { return $null }
  $lastRun = Convert-ToDateSafe -Value $State.lastRunAt
  if ($null -eq $lastRun) { return $null }
  $hours = [double](Get-TimedDevCheckIntervalHours)
  return $lastRun.AddHours($hours)
}

function Get-ProgressIntelligenceState {
  return (Read-JsonShared -Path $progressIntelligenceFile)
}

function Get-TaskMovementCounts {
  param(
    [array]$DoneTasks,
    [datetime]$SinceDate
  )

  $developed = 0
  $fixed = 0
  $upgraded = 0

  foreach ($t in @($DoneTasks)) {
    $finished = Convert-ToDateSafe -Value $t.finishedAt
    if ($null -eq $finished -or $finished -lt $SinceDate) { continue }

    $title = ([string]$t.title).ToLower()
    $isFixed = ($title -match "fix|bug|error|resolve|patch|regression")
    $isUpgraded = ($title -match "upgrade|improve|enhance|optimiz|harden|refactor")
    $isDeveloped = ($title -match "implement|build|create|feature|add|develop")

    if ($isFixed) { $fixed++ }
    if ($isUpgraded) { $upgraded++ }
    if ($isDeveloped -or (-not $isFixed -and -not $isUpgraded)) { $developed++ }
  }

  return [PSCustomObject]@{
    developed = $developed
    fixed = $fixed
    upgraded = $upgraded
  }
}

function Get-CyclePassRate30d {
  $cycleFile = Join-Path $stateDir "cycle-log.json"
  $rows = Read-JsonShared -Path $cycleFile
  if ($null -eq $rows) { return 0 }

  $all = if ($rows -is [array]) { @($rows) } else { @($rows) }
  $since = (Get-Date).AddDays(-30)
  $window = @()
  foreach ($r in $all) {
    $d = Convert-ToDateSafe -Value $r.date
    if ($null -ne $d -and $d -ge $since) {
      $window += $r
    }
  }

  if ($window.Count -eq 0) { return 0 }
  $pass = @($window | Where-Object { [bool]$_.errorScanPassed }).Count
  return [math]::Round((100.0 * $pass / $window.Count), 1)
}

function Get-TaskAgeHours {
  param([object]$Task)

  $timestamps = @(
    (Convert-ToDateSafe -Value $Task.startedAt),
    (Convert-ToDateSafe -Value $Task.updatedAt),
    (Convert-ToDateSafe -Value $Task.createdAt)
  ) | Where-Object { $null -ne $_ }

  if (@($timestamps).Count -eq 0) { return $null }
  $anchor = @($timestamps | Sort-Object | Select-Object -First 1)[0]
  return [math]::Round(((Get-Date) - $anchor).TotalHours, 1)
}

function Get-BlockerAgingSummary {
  param([array]$Tasks)

  $candidates = @($Tasks | Where-Object { $_.status -in @("waiting_ack", "evidence_pending", "failed", "escalated") })
  $rows = @()
  foreach ($t in $candidates) {
    $ageH = Get-TaskAgeHours -Task $t
    if ($null -eq $ageH) { continue }
    $rows += [PSCustomObject]@{
      taskId = [string]$t.taskId
      lane = [string]$t.lane
      status = [string]$t.status
      ageHours = $ageH
    }
  }

  if ($rows.Count -eq 0) {
    return [PSCustomObject]@{
      oldestHours = 0
      avgHours = 0
      over4h = 0
      top = @()
    }
  }

  $oldest = @($rows | Sort-Object ageHours -Descending | Select-Object -First 1)[0]
  $avg = [math]::Round((($rows | Measure-Object -Property ageHours -Average).Average), 1)
  $over4 = @($rows | Where-Object { $_.ageHours -ge 4 }).Count
  $topRows = @($rows | Sort-Object ageHours -Descending | Select-Object -First 3)

  return [PSCustomObject]@{
    oldestHours = $oldest.ageHours
    avgHours = $avg
    over4h = $over4
    top = $topRows
  }
}

function Get-TrendSparkline {
  param([array]$TrendRows)

  if ($null -eq $TrendRows -or @($TrendRows).Count -eq 0) { return "n/a" }

  $points = @($TrendRows | Where-Object { $null -ne $_.completionPct } | Sort-Object generatedAt | Select-Object -Last 12)
  if ($points.Count -eq 0) { return "n/a" }

  $values = @($points | ForEach-Object { [double]$_.completionPct })
  $min = ($values | Measure-Object -Minimum).Minimum
  $max = ($values | Measure-Object -Maximum).Maximum
  $levels = @(".",":","-","=","+","*","#","@")

  if ($min -eq $max) {
    return (($levels[0] * $points.Count) -join "")
  }

  $spark = New-Object System.Text.StringBuilder
  foreach ($v in $values) {
    $ratio = ($v - $min) / ($max - $min)
    $idx = [int][math]::Floor($ratio * ($levels.Count - 1))
    if ($idx -lt 0) { $idx = 0 }
    if ($idx -gt ($levels.Count - 1)) { $idx = $levels.Count - 1 }
    [void]$spark.Append($levels[$idx])
  }

  return $spark.ToString()
}

function Get-Phase {
  param([object]$Task)

  $phase = [string]$Task.phase
  if (-not [string]::IsNullOrWhiteSpace($phase)) { return $phase.ToLower() }

  $team = [string]$Task.team
  if ($team -match "implementation|premium") { return "implementation" }

  return "planning"
}

function Get-ModuleStrengthScore {
  param([array]$Tasks)

  $total = @($Tasks).Count
  if ($total -le 0) {
    return [PSCustomObject]@{ Score = 0; Grade = "Unknown"; WorldClass = $false }
  }

  $done = @($Tasks | Where-Object { $_.status -eq "done" }).Count
  $waitingAck = @($Tasks | Where-Object { $_.status -eq "waiting_ack" }).Count
  $retrying = @($Tasks | Where-Object { $_.status -eq "retrying" }).Count
  $failedOrEsc = @($Tasks | Where-Object { $_.status -eq "failed" -or $_.status -eq "escalated" }).Count

  $completionScore = 100 * ($done / $total)
  $penalty = ($waitingAck * 6) + ($retrying * 8) + ($failedOrEsc * 18)
  $score = [int][math]::Round([math]::Max(0, [math]::Min(100, ($completionScore - $penalty))))

  $grade = if ($score -ge 90) {
    "World-Class"
  } elseif ($score -ge 75) {
    "Strong"
  } elseif ($score -ge 50) {
    "Stable"
  } else {
    "Needs Attention"
  }

  return [PSCustomObject]@{
    Score = $score
    Grade = $grade
    WorldClass = ($score -ge 90)
  }
}

function Format-HoursToETA {
  param([double]$Hours)

  if ($Hours -lt 1) {
    $mins = [int][math]::Round($Hours * 60)
    return ("~{0}m" -f [math]::Max(1, $mins))
  }

  $rounded = [math]::Round($Hours, 1)
  return ("~{0}h" -f $rounded)
}

function Show-Dashboard {
  if (-not $NoClear) {
    # Clear terminal first so each dashboard refresh starts from a clean slate.
    Clear-Host
  }
  $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

  Write-Host ""
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "  WHITE CAVES ORCHESTRATION DASHBOARD    $now" -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor Cyan

  # ── 1. Worker pool health ──────────────────────────────────────────────────
  Write-Header "WORKER POOL HEALTH"
  $workers = Read-Workers
  if ($workers.Count -eq 0) {
    Write-Host "  [OFFLINE] No workers registered. Run: npm run orchestrator:bg:start" -ForegroundColor Red
  }
  else {
    $aliveCount = 0
    foreach ($w in $workers) {
      $procId = [int]$w.Pid
      $alive  = Test-ProcessAlive -ProcessId $procId
      if ($alive) { $aliveCount++ }
      $statusStr = if ($alive) { "[ALIVE]" } else { "[DEAD] " }
      $color     = if ($alive) { "Green"  } else { "Red"    }
      $typeStr   = if ($w.Type) { $w.Type } else { "worker" }
      $labelStr  = if ($w.Lane) { "Lane=$($w.Lane)" }
                   elseif ($w.Agent) { $w.Agent }
                   elseif ($w.IntervalMinutes) { "watchdog every $($w.IntervalMinutes)m" }
                   else { "" }
      Write-Host ("  $statusStr  PID=$procId  type=$typeStr  $labelStr") -ForegroundColor $color
    }
    Write-Host ""
    $total = $workers.Count
    $deadCount = $total - $aliveCount
    $healthColor = if ($deadCount -eq 0) { "Green" } else { "Yellow" }
    Write-Host ("  Alive: $aliveCount / $total" + $(if ($deadCount -gt 0) { "  ($deadCount dead -- run: npm run orchestrator:bg:restart)" } else { "" })) -ForegroundColor $healthColor
  }

  # ── 1.5 Timed dev runtime checks ──────────────────────────────────────────
  Write-Header "TIMED DEV RUNTIME CHECK"
  $devState = Get-TimedDevCheckState
  if ($null -eq $devState) {
    Write-Host "  [NOT RUN] No timed dev runtime check state found yet." -ForegroundColor DarkYellow
    Write-Host "  Run now: npm run orchestrator:dev:runtime-check" -ForegroundColor DarkGray
    Write-Host "  Scheduler: every 2 hours inside autopilot" -ForegroundColor DarkGray
  } else {
    $lastRun = Convert-ToDateSafe -Value $devState.lastRunAt
    $nextDue = Get-TimedDevCheckNextDue -State $devState
    $status = [string]$devState.status
    $statusColor = if ($status -eq "ok") { "Green" } elseif ($status -eq "ok_with_warnings") { "Yellow" } else { "Red" }
    $intervalHours = Get-TimedDevCheckIntervalHours
    Write-Host ("  Last run  : {0}" -f $(if ($null -ne $lastRun) { $lastRun.ToString("yyyy-MM-dd HH:mm:ss") } else { "unknown" })) -ForegroundColor Cyan
    Write-Host ("  Next due  : {0}" -f $(if ($null -ne $nextDue) { $nextDue.ToString("yyyy-MM-dd HH:mm:ss") } else { "unknown" })) -ForegroundColor Cyan
    Write-Host ("  Interval  : every {0} hour(s)" -f $intervalHours) -ForegroundColor DarkGray
    Write-Host ("  Status    : {0}" -f $status) -ForegroundColor $statusColor
    if ($null -ne $devState.blockers -and @($devState.blockers).Count -gt 0) {
      Write-Host ("  Blockers  : {0}" -f (@($devState.blockers) -join "; ")) -ForegroundColor Red
    }
    if ($null -ne $devState.warnings -and @($devState.warnings).Count -gt 0) {
      Write-Host ("  Warnings  : {0}" -f (@($devState.warnings) -join "; ")) -ForegroundColor Yellow
    }
    Write-Host "  Action    : npm run orchestrator:dev:runtime-check" -ForegroundColor DarkGray
  }

  # ── 2. Queue summary ──────────────────────────────────────────────────────
  Write-Header "QUEUE SUMMARY"
  $queue = Read-Queue
  if ($null -eq $queue) {
    Write-Host "  [NO QUEUE] Run: npm run orchestrator:queue:init" -ForegroundColor Red
    return
  }

  if ($script:QueueLargeFallback) {
    $pendingStatuses = @("queued","running","evidence_pending","waiting_ack","retrying","failed","escalated")
    $statusCounts = if ($null -ne $script:QueueFallbackStats) { $script:QueueFallbackStats.statusCounts } else { @{} }
    $laneCounts = if ($null -ne $script:QueueFallbackStats) { $script:QueueFallbackStats.laneCounts } else { @{} }

    $total = 0
    $done = 0
    $running = 0
    $pending = 0
    foreach ($k in $statusCounts.Keys) {
      $count = [int]$statusCounts[$k]
      $total += $count
      if ($k -eq "done") { $done += $count }
      if ($k -eq "running") { $running += $count }
      if ($pendingStatuses -contains $k) { $pending += $count }
    }

    Write-Host "  [LARGE-FILE MODE] Queue is oversized; rendering compact dashboard safely." -ForegroundColor Yellow
    foreach ($s in ($statusCounts.Keys | Sort-Object)) {
      $color = Get-StatusColor -Status $s
      Write-Host ("  " + $s.PadRight(14) + " : " + [int]$statusCounts[$s]) -ForegroundColor $color
    }

    Write-Host ""
    Write-Host "  By Lane (count by lane marker):" -ForegroundColor DarkCyan
    foreach ($l in ($laneCounts.Keys | Sort-Object)) {
      Write-Host ("    Lane {0} : {1}" -f $l, [int]$laneCounts[$l]) -ForegroundColor DarkCyan
    }

    $completionPct = if ($total -gt 0) { [math]::Round((100.0 * $done / $total), 1) } else { 0 }
    $queueCycle = if ($null -ne $script:QueueFallbackStats -and -not [string]::IsNullOrWhiteSpace([string]$script:QueueFallbackStats.cycle)) { [string]$script:QueueFallbackStats.cycle } else { "N/A" }
    $queueGeneratedAt = Convert-ToDateSafe -Value $(if ($null -ne $script:QueueFallbackStats) { $script:QueueFallbackStats.generatedAt } else { $null })
    $queueGeneratedText = if ($null -ne $queueGeneratedAt) { $queueGeneratedAt.ToString("yyyy-MM-dd HH:mm") } else { "unknown" }

    Write-Header "PROJECT DEVELOPMENT INSIGHTS" "Blue"
    Write-Host ("  Cycle              : {0} (generated {1})" -f $queueCycle, $queueGeneratedText) -ForegroundColor Blue
    Write-Host ("  Progress           : {0}/{1} done ({2}%)" -f $done, $total, $completionPct) -ForegroundColor Blue
    Write-Host ("  Workload snapshot  : pending={0}, running={1}" -f $pending, $running) -ForegroundColor Blue
    Write-Host "  Detail mode        : compact (per-agent/task tables disabled to avoid OOM)" -ForegroundColor DarkYellow

    Write-Header "OVERALL PROGRESS"
    $barWidth = 40
    $filled = [math]::Round($barWidth * $completionPct / 100)
    $empty = $barWidth - $filled
    $bar = "[" + ("#" * $filled) + ("." * $empty) + "]"
    $pctColor = if ($completionPct -ge 80) { "Green" } elseif ($completionPct -ge 40) { "Yellow" } else { "Cyan" }
    Write-Host ("  $bar  $completionPct% ($done / $total tasks done)") -ForegroundColor $pctColor

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor DarkGray
    if ($Watch) {
      if ($RenderOnChangeOnly) {
        Write-Host ("  [WATCH mode] Streaming on change (poll ${PollSeconds}s, heartbeat ${RefreshSeconds}s)  --  Ctrl+C to stop") -ForegroundColor DarkGray
      } else {
        Write-Host "  [WATCH mode] Refreshing every ${RefreshSeconds}s  --  Ctrl+C to stop" -ForegroundColor DarkGray
      }
    }
    else {
      Write-Host "  Tip: use -Watch flag for live refresh." -ForegroundColor DarkGray
    }
    Write-Host "============================================================" -ForegroundColor DarkGray
    Write-Host ""
    return
  }

  $tasks = @($queue.tasks)
  $pendingStatuses = @("queued","running","evidence_pending","waiting_ack","retrying","failed","escalated")
  $pendingTasks = @($tasks | Where-Object { $pendingStatuses -contains $_.status })
  $completedTasks = @($tasks | Where-Object { $_.status -eq "done" })
  $priorityTasksPending = @($pendingTasks | Where-Object {
    $p = [string]$_.priority
    if ([string]::IsNullOrWhiteSpace($p)) { return $false }
    return ($p.ToLower() -in @("critical","high"))
  } | Sort-Object @{Expression='priorityScore';Descending=$true}, taskId)

  $planningTasks = @($tasks | Where-Object { (Get-Phase -Task $_) -eq "planning" })
  $implementationTasks = @($tasks | Where-Object { (Get-Phase -Task $_) -eq "implementation" })

  $planningPending = @($planningTasks | Where-Object { $_.status -ne "done" })
  $implementationPending = @($implementationTasks | Where-Object { $_.status -ne "done" })

  $readyPlanning = @($planningTasks | Where-Object { Test-TaskReady -Task $_ -AllTasks $tasks } | Sort-Object lane, taskId)
  $readyImplementation = @($implementationTasks | Where-Object { Test-TaskReady -Task $_ -AllTasks $tasks } | Sort-Object lane, taskId)

  $nextTurnPredictions = @()
  if ($readyPlanning.Count -gt 0) { $nextTurnPredictions += $readyPlanning[0] }
  if ($readyImplementation.Count -gt 0) { $nextTurnPredictions += $readyImplementation[0] }
  if ($nextTurnPredictions.Count -eq 0) {
    $nextTurnPredictions = @($pendingTasks | Where-Object { $_.status -in @("running","waiting_ack") } | Sort-Object lane, taskId | Select-Object -First 3)
  }

  $statuses = $tasks | Group-Object status | Sort-Object Name
  foreach ($g in $statuses) {
    $color = Get-StatusColor -Status $g.Name
    Write-Host ("  " + $g.Name.PadRight(14) + " : " + $g.Count) -ForegroundColor $color
  }
  Write-Host ""
  $lanes = $tasks | Group-Object lane | Sort-Object Name
  Write-Host "  By Lane:" -ForegroundColor DarkCyan
  foreach ($l in $lanes) {
    $lTasks = @($l.Group)
    $doneCount    = [int](($lTasks | Where-Object { $_.status -eq "done" }).Count)
    $runningCount = [int](($lTasks | Where-Object { $_.status -eq "running" }).Count)
    $queuedCount  = [int](($lTasks | Where-Object { $_.status -in @("queued","retrying","evidence_pending") }).Count)
    $blockedCount = [int](($lTasks | Where-Object { $_.status -in @("failed","escalated") }).Count)
    Write-Host ("    Lane {0} : done={1} running={2} queued={3} blocked={4}" -f $l.Name, $doneCount, $runningCount, $queuedCount, $blockedCount) -ForegroundColor DarkCyan
  }

  Write-Host "" 
  Write-Host "  By Phase:" -ForegroundColor DarkCyan
  Write-Host ("    Planning       : done={0} pending={1} ready_now={2}" -f @($planningTasks | Where-Object { $_.status -eq "done" }).Count, $planningPending.Count, $readyPlanning.Count) -ForegroundColor DarkCyan
  Write-Host ("    Implementation : done={0} pending={1} ready_now={2}" -f @($implementationTasks | Where-Object { $_.status -eq "done" }).Count, $implementationPending.Count, $readyImplementation.Count) -ForegroundColor DarkCyan

  $runningCount = @($tasks | Where-Object { $_.status -eq "running" }).Count
  $evidencePendingCount = @($tasks | Where-Object { $_.status -eq "evidence_pending" }).Count
  $waitingAckCount = @($tasks | Where-Object { $_.status -eq "waiting_ack" }).Count
  $failedEscalatedCount = @($tasks | Where-Object { $_.status -in @("failed","escalated") }).Count
  $retryingCount = @($tasks | Where-Object { $_.status -eq "retrying" }).Count
  $readyNowCount = $readyPlanning.Count + $readyImplementation.Count

  $blockedQueuedTasks = @($tasks | Where-Object {
    $_.status -eq "queued" -and -not (Test-TaskReady -Task $_ -AllTasks $tasks)
  })

  $topBlockers = @()
  if ($blockedQueuedTasks.Count -gt 0) {
    foreach ($t in $blockedQueuedTasks) {
      $deps = Get-NormalizedDeps -DependsOn $t.dependsOn
      foreach ($dep in $deps) {
        $depTask = $tasks | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
        if ($null -eq $depTask -or $depTask.status -ne "done") {
          $topBlockers += [PSCustomObject]@{
            TaskId = $t.taskId
            Agent = $t.agent
            BlockingDep = $dep
            BlockingStatus = if ($null -eq $depTask) { "missing" } else { [string]$depTask.status }
          }
          break
        }
      }
    }
  }

  Write-Header "UPDATED RESULTS SNAPSHOT" "Cyan"
  Write-Host ("  Live result        : done={0}, pending={1}, ready_now={2}, running={3}" -f $completedTasks.Count, $pendingTasks.Count, $readyNowCount, $runningCount) -ForegroundColor Cyan
  Write-Host ("  Gate queue         : evidence_pending={0}, waiting_ack={1}, retrying={2}" -f $evidencePendingCount, $waitingAckCount, $retryingCount) -ForegroundColor DarkYellow
  Write-Host ("  Risk surface       : failed_or_escalated={0}, blocked_queued={1}" -f $failedEscalatedCount, $blockedQueuedTasks.Count) -ForegroundColor $(if ($failedEscalatedCount -gt 0) { "Red" } else { "DarkCyan" })

  $aliveAutopilotDaemon = @($workers | Where-Object {
    ([string]$_.Type -eq "autopilot-daemon") -and (Test-ProcessAlive -ProcessId ([int]$_.Pid)
    )
  }).Count
  $autopilotPosture = if ($aliveAutopilotDaemon -gt 0) { "supervised" } else { "not supervised" }
  Write-Host ("  Autopilot posture  : {0}" -f $autopilotPosture) -ForegroundColor $(if ($aliveAutopilotDaemon -gt 0) { "Green" } else { "Yellow" })

  if ($topBlockers.Count -gt 0) {
    Write-Host "  Top blockers       :" -ForegroundColor DarkYellow
    foreach ($b in ($topBlockers | Select-Object -First 3)) {
      Write-Host ("    - {0} ({1}) waiting on {2} [{3}]" -f $b.TaskId, $b.Agent, $b.BlockingDep, $b.BlockingStatus) -ForegroundColor DarkYellow
    }
  }

  $featureRows = @($tasks | ForEach-Object {
    [PSCustomObject]@{
      Feature = Get-FeatureName -Title $_.title -Lane $_.lane
      Status = $_.status
      TaskId = $_.taskId
      Agent = $_.agent
      Lane = $_.lane
      Title = $_.title
    }
  })

  $featureGroups = @($featureRows | Group-Object Feature | Sort-Object Name)
  $pendingFeatures = @()
  $completedFeatures = @()
  foreach ($fg in $featureGroups) {
    $fTasks = @($fg.Group)
    $fDone = @($fTasks | Where-Object { $_.Status -eq "done" }).Count
    $fTotal = $fTasks.Count
    $fPending = $fTotal - $fDone
    $row = [PSCustomObject]@{
      Feature = $fg.Name
      Done = $fDone
      Pending = $fPending
      Total = $fTotal
    }
    if ($fPending -gt 0) {
      $pendingFeatures += $row
    } else {
      $completedFeatures += $row
    }
  }

  $moduleGroups = @($tasks | Group-Object lane | Sort-Object Name)
  $moduleHealthRows = @()
  foreach ($mg in $moduleGroups) {
    $mTasks = @($mg.Group)
    $totalM = $mTasks.Count
    $doneM = @($mTasks | Where-Object { $_.status -eq "done" }).Count
    $pendingM = $totalM - $doneM
    $waitingAckM = @($mTasks | Where-Object { $_.status -eq "waiting_ack" }).Count
    $blockedM = @($mTasks | Where-Object { $_.status -eq "failed" -or $_.status -eq "escalated" }).Count
    $retryingM = @($mTasks | Where-Object { $_.status -eq "retrying" }).Count
    $strength = Get-ModuleStrengthScore -Tasks $mTasks
    $attentionScore = [int]($pendingM * 10 + $blockedM * 25 + $waitingAckM * 8 + $retryingM * 10 + (100 - $strength.Score))

    $moduleHealthRows += [PSCustomObject]@{
      Lane = $mg.Name
      Module = Get-ModuleNameByLane -Lane $mg.Name
      Total = $totalM
      Done = $doneM
      Pending = $pendingM
      WaitingAck = $waitingAckM
      Blocked = $blockedM
      Retrying = $retryingM
      Strength = $strength.Score
      Grade = $strength.Grade
      WorldClass = if ($strength.WorldClass) { "YES" } else { "NO" }
      AttentionScore = $attentionScore
    }
  }
  $topAttention = @($moduleHealthRows | Sort-Object AttentionScore -Descending | Select-Object -First 3)

  # ── 2.5 Project development insights ─────────────────────────────────────
  $queueCycle = if ([string]::IsNullOrWhiteSpace([string]$queue.cycle)) { "N/A" } else { [string]$queue.cycle }
  $queueGeneratedAt = Convert-ToDateSafe -Value $queue.generatedAt
  $queueGeneratedText = if ($null -ne $queueGeneratedAt) { $queueGeneratedAt.ToString("yyyy-MM-dd HH:mm") } else { "unknown" }

  $pendingTotal = $pendingTasks.Count
  $doneTotal = $completedTasks.Count
  $completionPct = if ($tasks.Count -gt 0) { [math]::Round((100.0 * $doneTotal / $tasks.Count), 1) } else { 0 }

  $nowDt = Get-Date
  $completedLastHour = @($completedTasks | Where-Object {
    $d = Convert-ToDateSafe -Value $_.finishedAt
    $null -ne $d -and (($nowDt - $d).TotalMinutes -le 60)
  }).Count
  $completedLast24h = @($completedTasks | Where-Object {
    $d = Convert-ToDateSafe -Value $_.finishedAt
    $null -ne $d -and (($nowDt - $d).TotalHours -le 24)
  }).Count

  $durationMins = @()
  foreach ($t in $completedTasks) {
    $s = Convert-ToDateSafe -Value $t.startedAt
    $f = Convert-ToDateSafe -Value $t.finishedAt
    if ($null -ne $s -and $null -ne $f -and $f -ge $s) {
      $durationMins += ($f - $s).TotalMinutes
    }
  }
  $avgCompletionMins = if ($durationMins.Count -gt 0) { [math]::Round((($durationMins | Measure-Object -Average).Average), 1) } else { 0 }

  $blockedQueued = @($tasks | Where-Object {
    $_.status -eq "queued" -and -not (Test-TaskReady -Task $_ -AllTasks $tasks)
  }).Count

  $etaText = "insufficient completion trend"
  if ($completedLastHour -gt 0 -and $pendingTotal -gt 0) {
    $etaHours = [double]$pendingTotal / [double]$completedLastHour
    $etaText = (Format-HoursToETA -Hours $etaHours)
  } elseif ($pendingTotal -eq 0) {
    $etaText = "complete"
  }

  $deliverySignal = if ($completedLastHour -ge 6) {
    "high"
  } elseif ($completedLastHour -ge 2) {
    "steady"
  } elseif ($completedLastHour -ge 1) {
    "slow"
  } else {
    "idle"
  }

  $riskState = if ($failedEscalatedCount -gt 0) {
    "critical"
  } elseif ($waitingAckCount -ge 8 -or $evidencePendingCount -ge 8) {
    "elevated"
  } else {
    "normal"
  }

  $topFocusLane = if ($topAttention.Count -gt 0) { $topAttention[0] } else { $null }
  $highPriorityPendingCount = $priorityTasksPending.Count
  $blockerAging = Get-BlockerAgingSummary -Tasks $tasks

  Write-Header "PROJECT DEVELOPMENT INSIGHTS" "Blue"
  Write-Host ("  Cycle              : {0} (generated {1})" -f $queueCycle, $queueGeneratedText) -ForegroundColor Blue
  Write-Host ("  Progress           : {0}/{1} done ({2}%)" -f $doneTotal, $tasks.Count, $completionPct) -ForegroundColor Blue
  Write-Host ("  Delivery velocity  : {0} completed in last 60m | {1} in last 24h" -f $completedLastHour, $completedLast24h) -ForegroundColor Blue
  Write-Host ("  Delivery signal    : {0}" -f $deliverySignal) -ForegroundColor Blue
  Write-Host ("  Avg task duration  : {0} minutes (completed tasks with timing)" -f $avgCompletionMins) -ForegroundColor Blue
  Write-Host ("  Workload snapshot  : pending={0}, running={1}, blocked_queued={2}, high_priority_pending={3}" -f $pendingTotal, @($tasks | Where-Object { $_.status -eq "running" }).Count, $blockedQueued, $highPriorityPendingCount) -ForegroundColor Blue
  Write-Host ("  ETA to clear queue : {0}" -f $etaText) -ForegroundColor Blue
  Write-Host ("  Operational risk   : {0}" -f $riskState) -ForegroundColor $(if ($riskState -eq "critical") { "Red" } elseif ($riskState -eq "elevated") { "Yellow" } else { "Blue" })
  if ($null -ne $topFocusLane) {
    Write-Host ("  Focus recommendation: Lane {0} ({1}) -- attention score {2}" -f $topFocusLane.Lane, $topFocusLane.Module, $topFocusLane.AttentionScore) -ForegroundColor Magenta
  }

  # ── 2.6 Progress intelligence & forecast ─────────────────────────────────
  Write-Header "ORCHESTRATION PROGRESS INTELLIGENCE" "DarkCyan"
  $intel = Get-ProgressIntelligenceState
  if ($null -eq $intel) {
    $dailyFallback = Get-TaskMovementCounts -DoneTasks $completedTasks -SinceDate $nowDt.AddHours(-24)
    $monthlyFallback = Get-TaskMovementCounts -DoneTasks $completedTasks -SinceDate $nowDt.AddDays(-30)
    $fallbackBoost = 30
    $fallbackTarget = [math]::Min(100, ($completionPct + $fallbackBoost))
    $fallbackRemainingPct = [math]::Max(0, ($fallbackTarget - $completionPct))
    $fallbackTasksNeeded = if ($tasks.Count -gt 0) { [int][math]::Ceiling(($fallbackRemainingPct / 100.0) * $tasks.Count) } else { 0 }
    $fallbackVelocityPerDay = if ($completedLast24h -gt 0) { $completedLast24h } elseif ($completedLast24h -eq 0 -and $completedLastHour -gt 0) { [math]::Round($completedLastHour * 24.0, 2) } else { 0 }
    $fallbackEta = "unknown"
    if ($fallbackTasksNeeded -eq 0) {
      $fallbackEta = "already reached"
    } elseif ($fallbackVelocityPerDay -gt 0) {
      $fallbackEta = ("~{0}h" -f [math]::Round((24.0 * $fallbackTasksNeeded / $fallbackVelocityPerDay), 1))
    }

    $fallbackPassRate = Get-CyclePassRate30d
    Write-Host "  [FALLBACK MODE] Using live queue analytics (state file not generated yet)." -ForegroundColor Yellow
    Write-Host ("  Forecast (+{0}%)  : target={1}% | ETA={2} | confidence=low" -f $fallbackBoost, [math]::Round($fallbackTarget, 1), $fallbackEta) -ForegroundColor DarkCyan
    Write-Host ("  Velocity          : {0} tasks/day (24h={1})" -f $fallbackVelocityPerDay, $completedLast24h) -ForegroundColor DarkCyan
    Write-Host ("  Daily movement    : developed={0}, fixed={1}, upgraded={2}" -f $dailyFallback.developed, $dailyFallback.fixed, $dailyFallback.upgraded) -ForegroundColor Blue
    Write-Host ("  Monthly movement  : developed={0}, fixed={1}, upgraded={2}" -f $monthlyFallback.developed, $monthlyFallback.fixed, $monthlyFallback.upgraded) -ForegroundColor Blue
    Write-Host ("  Quality trend     : scan pass rate(30d)={0}%" -f $fallbackPassRate) -ForegroundColor $(if ($fallbackPassRate -ge 85) { "Green" } elseif ($fallbackPassRate -ge 70) { "Yellow" } else { "Red" })
    Write-Host "  Action            : npm run orchestrator:progress:intel" -ForegroundColor DarkGray
  } else {
    $boostPct = if ($null -ne $intel.targetBoostPct) { [int]$intel.targetBoostPct } else { 30 }
    $targetPct = if ($null -ne $intel.forecast -and $null -ne $intel.forecast.targetCompletionPct) { [double]$intel.forecast.targetCompletionPct } else { 0 }
    $etaHours = if ($null -ne $intel.forecast) { $intel.forecast.etaHours } else { $null }
    $etaText = if ($null -eq $etaHours) { "unknown" } elseif ([double]$etaHours -eq 0) { "already reached" } else { ("~{0}h" -f [math]::Round([double]$etaHours, 1)) }
    $confidence = if ($null -ne $intel.forecast -and -not [string]::IsNullOrWhiteSpace([string]$intel.forecast.confidence)) { [string]$intel.forecast.confidence } else { "unknown" }
    $velocityPerDay = if ($null -ne $intel.velocity -and $null -ne $intel.velocity.tasksPerDay) { [double]$intel.velocity.tasksPerDay } else { 0 }
    $qualityRate = if ($null -ne $intel.quality -and $null -ne $intel.quality.scanPassRate30dPct) { [double]$intel.quality.scanPassRate30dPct } else { 0 }
    $bands = if ($null -ne $intel.forecast) { $intel.forecast.confidenceBandsHours } else { $null }
    $lanesIntel = if ($null -ne $intel.lanes) { @($intel.lanes) } else { @() }
    $recommendation = if ($null -ne $intel.recommendation) { $intel.recommendation } else { $null }
    $rerouteHint = if ($null -ne $intel.rerouteHint) { [string]$intel.rerouteHint } else { "" }
    $blockersIntel = if ($null -ne $intel.blockers) { $intel.blockers } else { $null }

    $dailyDev = if ($null -ne $intel.categories -and $null -ne $intel.categories.daily) { [int]$intel.categories.daily.developed } else { 0 }
    $dailyFix = if ($null -ne $intel.categories -and $null -ne $intel.categories.daily) { [int]$intel.categories.daily.fixed } else { 0 }
    $dailyUpg = if ($null -ne $intel.categories -and $null -ne $intel.categories.daily) { [int]$intel.categories.daily.upgraded } else { 0 }

    $monthlyDev = if ($null -ne $intel.categories -and $null -ne $intel.categories.monthly) { [int]$intel.categories.monthly.developed } else { 0 }
    $monthlyFix = if ($null -ne $intel.categories -and $null -ne $intel.categories.monthly) { [int]$intel.categories.monthly.fixed } else { 0 }
    $monthlyUpg = if ($null -ne $intel.categories -and $null -ne $intel.categories.monthly) { [int]$intel.categories.monthly.upgraded } else { 0 }

    Write-Host ("  Forecast (+{0}%)  : target={1}% | ETA={2} | confidence={3}" -f $boostPct, $targetPct, $etaText, $confidence) -ForegroundColor DarkCyan
    Write-Host ("  Velocity          : {0} tasks/day (24h={1}, 7d={2}, 30d={3})" -f $velocityPerDay, $intel.velocity.completedLast24h, $intel.velocity.completedLast7d, $intel.velocity.completedLast30d) -ForegroundColor DarkCyan
    Write-Host ("  Daily movement    : developed={0}, fixed={1}, upgraded={2}" -f $dailyDev, $dailyFix, $dailyUpg) -ForegroundColor Blue
    Write-Host ("  Monthly movement  : developed={0}, fixed={1}, upgraded={2}" -f $monthlyDev, $monthlyFix, $monthlyUpg) -ForegroundColor Blue
    Write-Host ("  Quality trend     : scan pass rate(30d)={0}%" -f $qualityRate) -ForegroundColor $(if ($qualityRate -ge 85) { "Green" } elseif ($qualityRate -ge 70) { "Yellow" } else { "Red" })
    if ($null -ne $bands) {
      Write-Host ("  ETA bands (h)     : optimistic={0}, expected={1}, conservative={2}" -f $bands.optimistic, $bands.expected, $bands.conservative) -ForegroundColor DarkCyan
    }
    if ($lanesIntel.Count -gt 0) {
      Write-Host "  Lane ETA (+target):" -ForegroundColor DarkCyan
      foreach ($laneRow in ($lanesIntel | Sort-Object lane)) {
        $laneEtaText = if ($null -eq $laneRow.etaHours) { "unknown" } elseif ([double]$laneRow.etaHours -eq 0) { "reached" } else { ("~{0}h" -f [math]::Round([double]$laneRow.etaHours, 1)) }
        Write-Host ("    Lane {0}: completion={1}% | target={2}% | eta={3} | confidence={4}" -f $laneRow.lane, $laneRow.completionPct, $laneRow.targetCompletionPct, $laneEtaText, $laneRow.confidence) -ForegroundColor Blue
      }
    }

    $drift = if ($null -ne $intel.drift) { $intel.drift } else { $null }
    if ($null -ne $drift) {
      $driftColor = if ([bool]$drift.alert) { "Red" } elseif ([string]$drift.state -eq "improving") { "Green" } else { "Yellow" }
      Write-Host ("  Forecast drift    : state={0} | alert={1} | streak={2} | etaDeltaVsPrev={3}h" -f $drift.state, $drift.alert, $drift.worseningStreak, $drift.etaDeltaVsPrevHours) -ForegroundColor $driftColor
    }
    if ($null -ne $recommendation) {
      $recColor = if ([string]$recommendation.action -eq "stabilize") { "Red" } elseif ([string]$recommendation.action -eq "prioritize_blockers") { "Yellow" } else { "DarkCyan" }
      Write-Host ("  Recommendation   : action={0} | reason={1} | focusLane={2}" -f $recommendation.action, $recommendation.reason, $recommendation.focusLane) -ForegroundColor $recColor
    }
    if (-not [string]::IsNullOrWhiteSpace($rerouteHint)) {
      Write-Host ("  Reroute hint     : {0}" -f $rerouteHint) -ForegroundColor DarkCyan
    }
    if ($null -ne $blockersIntel) {
      Write-Host ("  Blocker aging     : oldest={0}h | avg={1}h | stale={2} | warning>{3}h" -f $blockerAging.oldestHours, $blockerAging.avgHours, $blockersIntel.staleCount, $blockersIntel.warningHours) -ForegroundColor $(if ([int]$blockersIntel.staleCount -gt 0) { "Yellow" } else { "DarkCyan" })
      if (@($blockersIntel.stale).Count -gt 0) {
        foreach ($b in @($blockersIntel.stale) | Select-Object -First 3) {
          Write-Host ("    stale blocker    : {0} (lane {1}, {2}) age={3}h" -f $b.taskId, $b.lane, $b.status, $b.ageHours) -ForegroundColor DarkYellow
        }
      }
    } else {
      Write-Host ("  Blocker aging     : oldest={0}h | avg={1}h | over4h={2}" -f $blockerAging.oldestHours, $blockerAging.avgHours, $blockerAging.over4h) -ForegroundColor $(if ($blockerAging.over4h -gt 0) { "Yellow" } else { "DarkCyan" })
      if ($blockerAging.top.Count -gt 0) {
        foreach ($b in $blockerAging.top) {
          Write-Host ("    stale blocker    : {0} (lane {1}, {2}) age={3}h" -f $b.taskId, $b.lane, $b.status, $b.ageHours) -ForegroundColor DarkYellow
        }
      }
    }
    if (Test-Path $progressTrendJson) {
      Write-Host ("  Trend export      : JSON -> {0}" -f $progressTrendJson) -ForegroundColor DarkGray
      $trendRows = Read-JsonShared -Path $progressTrendJson
      $sparkline = Get-TrendSparkline -TrendRows $trendRows
      Write-Host ("  Monthly sparkline : {0}" -f $sparkline) -ForegroundColor DarkCyan
      if ($null -ne $trendRows -and @($trendRows).Count -gt 0) {
        $latestTrend = @($trendRows | Sort-Object generatedAt | Select-Object -Last 1)[0]
        Write-Host ("  Latest trend      : {0}% complete | ETA {1}h | velocity {2} tasks/day" -f $latestTrend.completionPct, $latestTrend.etaHours, $latestTrend.velocityPerDay) -ForegroundColor DarkGray
      }
    }
    if (Test-Path $progressTrendCsv) {
      Write-Host ("  Trend export      : CSV  -> {0}" -f $progressTrendCsv) -ForegroundColor DarkGray
    }
  }

  # ── 3. Per-agent status table ──────────────────────────────────────────────
  Write-Header "PER-AGENT STATUS"
  $agents = $tasks | Group-Object agent | Sort-Object Name
  Write-Host ("  " + "Agent".PadRight(14) + "Lane  " + "Status".PadRight(14) + "Task") -ForegroundColor White
  Write-Host ("  " + ("-" * 70)) -ForegroundColor DarkGray
  foreach ($ag in $agents) {
    foreach ($t in $ag.Group) {
      $statusColor = Get-StatusColor -Status $t.status
      $agStr  = ($t.agent).PadRight(14)
      $lnStr  = ($t.lane).PadRight(6)
      $stStr  = ($t.status).PadRight(14)
      $ttStr  = if ($t.title.Length -gt 38) { $t.title.Substring(0,35) + "..." } else { $t.title }
      Write-Host ("  " + $agStr + $lnStr + $stStr + $ttStr) -ForegroundColor $statusColor
    }
  }

  # ── 4. Pending tasks ──────────────────────────────────────────────────────
  Write-Header "PENDING TASKS"
  if ($pendingTasks.Count -eq 0) {
    Write-Host "  [NONE] No pending tasks." -ForegroundColor Green
  } else {
    Write-Host ("  Pending total: {0}" -f $pendingTasks.Count) -ForegroundColor Yellow
    foreach ($t in ($pendingTasks | Sort-Object lane, taskId | Select-Object -First 20)) {
      $color = Get-StatusColor -Status $t.status
      Write-Host ("  [{0}] {1} {2} -- {3}" -f $t.status.ToUpper(), $t.taskId, $t.agent, $t.title) -ForegroundColor $color
    }
    if ($pendingTasks.Count -gt 20) {
      Write-Host ("  ... and {0} more pending task(s)." -f ($pendingTasks.Count - 20)) -ForegroundColor DarkGray
    }
  }

  # ── 4.0 Priority override tasks ───────────────────────────────────────────
  Write-Header "TOP PRIORITY OVERRIDES"
  if ($priorityTasksPending.Count -eq 0) {
    Write-Host "  [NONE] No active high/critical priority overrides pending." -ForegroundColor DarkGray
  } else {
    foreach ($t in $priorityTasksPending) {
      $ps = if ($null -ne $t.priorityScore) { [string]$t.priorityScore } else { "n/a" }
      Write-Host ("  [PRIORITY {0}] score={1} {2} {3} -- {4}" -f ([string]$t.priority).ToUpper(), $ps, $t.taskId, $t.agent, $t.title) -ForegroundColor Magenta
    }
  }

  # ── 4.1 Planning track view ───────────────────────────────────────────────
  Write-Header "PLANNING PHASE TASKS"
  if ($planningTasks.Count -eq 0) {
    Write-Host "  [NONE] No planning tasks in current queue." -ForegroundColor DarkGray
  } else {
    $planningDone = @($planningTasks | Where-Object { $_.status -eq "done" }).Count
    Write-Host ("  Planning progress: {0}/{1} done" -f $planningDone, $planningTasks.Count) -ForegroundColor Cyan
    foreach ($t in ($planningPending | Sort-Object lane, taskId | Select-Object -First 20)) {
      $isReady = Test-TaskReady -Task $t -AllTasks $tasks
      $tag = if ($isReady) { "READY" } else { "WAIT" }
      $tagColor = if ($isReady) { "Green" } else { "DarkYellow" }
      Write-Host ("  [{0}] [{1}] {2} {3} -- {4}" -f $t.status.ToUpper(), $tag, $t.taskId, $t.agent, $t.title) -ForegroundColor $tagColor
    }
  }

  # ── 4.2 Implementation track view ─────────────────────────────────────────
  Write-Header "IMPLEMENTATION PHASE TASKS"
  if ($implementationTasks.Count -eq 0) {
    Write-Host "  [NONE] No implementation tasks in current queue." -ForegroundColor DarkGray
  } else {
    $implDone = @($implementationTasks | Where-Object { $_.status -eq "done" }).Count
    Write-Host ("  Implementation progress: {0}/{1} done" -f $implDone, $implementationTasks.Count) -ForegroundColor Cyan
    foreach ($t in ($implementationPending | Sort-Object lane, taskId | Select-Object -First 20)) {
      $isReady = Test-TaskReady -Task $t -AllTasks $tasks
      $tag = if ($isReady) { "READY" } else { "WAIT" }
      $tagColor = if ($isReady) { "Green" } else { "DarkYellow" }
      Write-Host ("  [{0}] [{1}] {2} {3} -- {4}" -f $t.status.ToUpper(), $tag, $t.taskId, $t.agent, $t.title) -ForegroundColor $tagColor
    }
  }

  # ── 4.3 Next-loop completion forecast ─────────────────────────────────────
  Write-Header "NEXT LOOP FORECAST"
  if ($nextTurnPredictions.Count -eq 0) {
    Write-Host "  [NONE] No immediate candidates; loop likely waits on dependencies/ACK." -ForegroundColor DarkGray
  } else {
    foreach ($t in $nextTurnPredictions) {
      $phase = (Get-Phase -Task $t)
      Write-Host ("  [NEXT] [{0}] {1} {2} -- {3}" -f $phase.ToUpper(), $t.taskId, $t.agent, $t.title) -ForegroundColor Magenta
    }
  }

  # ── 5. Completed tasks ────────────────────────────────────────────────────
  Write-Header "COMPLETED TASKS"
  Write-Host ("  Completed total: {0}" -f $completedTasks.Count) -ForegroundColor Green
  if ($completedTasks.Count -gt 0) {
    foreach ($t in ($completedTasks | Sort-Object taskId -Descending | Select-Object -First 15)) {
      Write-Host ("  [DONE] {0} {1} -- {2}" -f $t.taskId, $t.agent, $t.title) -ForegroundColor Green
    }
    if ($completedTasks.Count -gt 15) {
      Write-Host ("  ... and {0} more completed task(s)." -f ($completedTasks.Count - 15)) -ForegroundColor DarkGray
    }
  }

  # ── 6. Pending features ───────────────────────────────────────────────────
  Write-Header "PENDING FEATURES"
  if ($pendingFeatures.Count -eq 0) {
    Write-Host "  [NONE] All tracked features are complete." -ForegroundColor Green
  } else {
    foreach ($f in ($pendingFeatures | Sort-Object -Property @{Expression='Pending';Descending=$true}, @{Expression='Feature';Descending=$false})) {
      Write-Host ("  [PENDING] {0}  (done={1}, pending={2}, total={3})" -f $f.Feature, $f.Done, $f.Pending, $f.Total) -ForegroundColor Yellow
    }
  }

  # ── 7. Completed features ─────────────────────────────────────────────────
  Write-Header "COMPLETED FEATURES"
  if ($completedFeatures.Count -eq 0) {
    Write-Host "  [NONE YET] No completed feature groups yet." -ForegroundColor DarkGray
  } else {
    foreach ($f in ($completedFeatures | Sort-Object Feature)) {
      Write-Host ("  [DONE] {0}  (total tasks={1})" -f $f.Feature, $f.Total) -ForegroundColor Green
    }
  }

  # ── 8. Module health & strength ──────────────────────────────────────────
  Write-Header "MODULE HEALTH & STRENGTH"
  foreach ($m in $moduleHealthRows) {
    $moduleColor = if ($m.Grade -eq "World-Class") { "Green" } elseif ($m.Grade -eq "Strong") { "Cyan" } elseif ($m.Grade -eq "Stable") { "Yellow" } else { "Red" }
    Write-Host ("  Lane {0} ({1})" -f $m.Lane, $m.Module) -ForegroundColor White
    Write-Host ("    Progress : {0}/{1} done | pending={2} waiting_ack={3} blocked={4} retrying={5}" -f $m.Done, $m.Total, $m.Pending, $m.WaitingAck, $m.Blocked, $m.Retrying) -ForegroundColor DarkGray
    Write-Host ("    Strength : {0}/100 | Grade: {1} | World-Class: {2}" -f $m.Strength, $m.Grade, $m.WorldClass) -ForegroundColor $moduleColor
  }

  # ── 9. Aegis smart decision engine ───────────────────────────────────────
  Write-Header "AEGIS SMART DECISION ENGINE" "Magenta"
  if ($topAttention.Count -eq 0) {
    Write-Host "  No modules found for decisioning." -ForegroundColor DarkGray
  } else {
    $topTarget = $topAttention | Select-Object -First 1
    foreach ($r in $topAttention) {
      $decisionColor = if ($r.Pending -gt 0 -or $r.Blocked -gt 0 -or $r.WaitingAck -gt 0) { "Yellow" } else { "Green" }
      Write-Host ("  [ATTN {0}] Lane {1} ({2}) -> score={3}, pending={4}, blocked={5}, waiting_ack={6}, strength={7}" -f $(if ($r.Lane -eq $topTarget.Lane) { "TOP" } else { "NEXT" }), $r.Lane, $r.Module, $r.AttentionScore, $r.Pending, $r.Blocked, $r.WaitingAck, $r.Strength) -ForegroundColor $decisionColor
    }

    $targetPendingTask = @($tasks | Where-Object { $_.lane -eq $topTarget.Lane -and $pendingStatuses -contains $_.status } | Sort-Object taskId | Select-Object -First 1)
    if ($targetPendingTask.Count -gt 0) {
      $tp = $targetPendingTask[0]
      Write-Host ""
      Write-Host ("  Aegis recommended focus: Lane {0} ({1})" -f $topTarget.Lane, $topTarget.Module) -ForegroundColor Magenta
      Write-Host ("  Next best task to research/upgrade: {0} {1} -- {2}" -f $tp.taskId, $tp.agent, $tp.title) -ForegroundColor Magenta
      Write-Host ("  Suggested run: npm run orchestrator:agent-loop -- -Agent {0} -NoBrowser -Once" -f $tp.agent) -ForegroundColor DarkGray
      Write-Host "  Continuous mode: npm run autopilot" -ForegroundColor DarkGray
    } else {
      Write-Host ""
      Write-Host "  All modules currently complete or no pending lane-specific tasks." -ForegroundColor Green
      Write-Host "  Aegis can trigger a fresh cycle automatically when queue completion is detected in autopilot." -ForegroundColor DarkGray
    }
  }

  # ── 10. Waiting ACK ────────────────────────────────────────────────────────
  $waitingAck = $tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "escalated" }
  if (@($waitingAck).Count -gt 0) {
    Write-Header "PENDING FEEDS_ACK (action required)" "Yellow"
    foreach ($t in $waitingAck) {
      $ackColor = if ($t.status -eq "escalated") { "Red" } else { "Yellow" }
      Write-Host ("  [" + $t.status.ToUpper() + "] " + $t.taskId + " -- " + $t.title) -ForegroundColor $ackColor
      Write-Host ("    Downstream ACK from: " + $t.feedsAckBy) -ForegroundColor DarkYellow
      Write-Host ("    Run: npm run orchestrator:queue:ack -- -TaskId $($t.taskId) -AgentName $($t.feedsAckBy)") -ForegroundColor Gray
    }
  }

  # ── 11. Watchdog last run ─────────────────────────────────────────────────
  if (Test-Path $wdLog) {
    $lastLines = Get-Content $wdLog -Tail 4
    Write-Header "WATCHDOG SCHEDULER (last 4 log lines)" "DarkGray"
    foreach ($l in $lastLines) {
      Write-Host "  $l" -ForegroundColor DarkGray
    }
  }

  # ── 12. Progress bar ──────────────────────────────────────────────────────
  Write-Header "OVERALL PROGRESS"
  $total     = $tasks.Count
  $doneCount = ($tasks | Where-Object { $_.status -eq "done" }).Count
  $pct       = if ($total -gt 0) { [math]::Round($doneCount / $total * 100) } else { 0 }
  $barWidth  = 40
  $filled    = [math]::Round($barWidth * $pct / 100)
  $empty     = $barWidth - $filled
  $bar       = "[" + ("#" * $filled) + ("." * $empty) + "]"
  $pctColor  = if ($pct -ge 80) { "Green" } elseif ($pct -ge 40) { "Yellow" } else { "Cyan" }
  Write-Host ("  $bar  $pct% ($doneCount / $total tasks done)") -ForegroundColor $pctColor

  Write-Host ""
  Write-Host "============================================================" -ForegroundColor DarkGray
  if ($Watch) {
    if ($RenderOnChangeOnly) {
      Write-Host ("  [WATCH mode] Streaming on change (poll ${PollSeconds}s, heartbeat ${RefreshSeconds}s)  --  Ctrl+C to stop") -ForegroundColor DarkGray
    } else {
      Write-Host "  [WATCH mode] Refreshing every ${RefreshSeconds}s  --  Ctrl+C to stop" -ForegroundColor DarkGray
    }
  }
  else {
    Write-Host "  Tip: use -Watch flag for live refresh." -ForegroundColor DarkGray
  }
  Write-Host "============================================================" -ForegroundColor DarkGray
  Write-Host ""
}

if ($Watch) {
  $lastFingerprint = ""
  $lastRenderedAt = [datetime]::MinValue

  Show-Dashboard
  $lastFingerprint = Get-StreamFingerprint
  $lastRenderedAt = Get-Date

  while ($true) {
    if ($RenderOnChangeOnly) {
      $fingerprint = Get-StreamFingerprint
      $now = Get-Date
      $heartbeatDue = (($now - $lastRenderedAt).TotalSeconds -ge $RefreshSeconds)

      if ($fingerprint -ne $lastFingerprint -or $heartbeatDue) {
        Show-Dashboard
        $lastFingerprint = $fingerprint
        $lastRenderedAt = $now
      }

      Start-Sleep -Seconds $PollSeconds
    }
    else {
      Show-Dashboard
      Start-Sleep -Seconds $RefreshSeconds
    }
  }
}
else {
  Show-Dashboard
}
