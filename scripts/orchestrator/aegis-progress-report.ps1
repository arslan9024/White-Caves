param(
  [string]$WorkspaceRoot = ".",
  [switch]$Daily,
  [switch]$Weekly,
  [switch]$NoClear,
  [switch]$Brief
)

$ErrorActionPreference = "Stop"

if (-not $NoClear) {
  Clear-Host
}

$root = Resolve-Path $WorkspaceRoot
$trackerFile = Join-Path $root "DAILY_MILESTONE_TRACKER.md"
$queueFile = Join-Path $root "logs\orchestrator\task-queue.json"

function Convert-ToDateSafe {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) { return $null }

  $formats = @(
    'MMM d, yyyy',
    'MMM d yyyy',
    'MMMM d, yyyy',
    'M/d/yyyy',
    'yyyy-MM-dd'
  )

  foreach ($fmt in $formats) {
    try {
      return [datetime]::ParseExact($Value.Trim(), $fmt, [System.Globalization.CultureInfo]::InvariantCulture)
    } catch {
    }
  }

  try {
    return [datetime]::Parse($Value, [System.Globalization.CultureInfo]::InvariantCulture)
  } catch {
    return $null
  }
}

function Get-CurrentQueueSnapshot {
  param([string]$Path)

  if (-not (Test-Path $Path)) { return $null }

  $queue = Get-Content $Path -Raw | ConvertFrom-Json
  $tasks = @($queue.tasks)
  $total = $tasks.Count
  $done = @($tasks | Where-Object { $_.status -eq 'done' }).Count
  $running = @($tasks | Where-Object { $_.status -eq 'running' }).Count
  $pendingStatuses = @('queued','running','evidence_pending','waiting_ack','retrying','failed','escalated')
  $pending = @($tasks | Where-Object { $pendingStatuses -contains $_.status }).Count
  $pct = if ($total -gt 0) { [math]::Round((100.0 * $done / $total), 1) } else { 0 }

  return [PSCustomObject]@{
    Cycle = if ([string]::IsNullOrWhiteSpace([string]$queue.cycle)) { 'N/A' } else { [string]$queue.cycle }
    Done = $done
    Total = $total
    Pending = $pending
    Running = $running
    Percent = $pct
  }
}

function Parse-TrackerEntries {
  param([string]$Path)

  if (-not (Test-Path $Path)) { return @() }

  $lines = Get-Content $Path
  $entries = @()

  foreach ($line in $lines) {
    if ($line -notmatch '^\|') { continue }
    if ($line -match '^\|\s*-') { continue }
    if ($line -match '^\|\s*Date\s*\|') { continue }
    if ($line -notmatch 'Orchestrator Sync') { continue }
    if ($line -notmatch 'done=') { continue }

    $parts = $line.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
    if ($parts.Count -lt 5) { continue }

    $rawDate = $parts[0]
    $notes = $parts[$parts.Count - 1]
    $parsedDate = Convert-ToDateSafe -Value $rawDate
    if ($null -eq $parsedDate) { continue }

    $done = 0
    $running = 0
    $waitingAck = 0
    $queued = 0
    $retrying = 0
    $failed = 0

    if ($notes -match 'done=(\d+)') { $done = [int]$Matches[1] }
    if ($notes -match 'running=(\d+)') { $running = [int]$Matches[1] }
    if ($notes -match 'waitAck=(\d+)') { $waitingAck = [int]$Matches[1] }
    elseif ($notes -match 'waiting_ack=(\d+)') { $waitingAck = [int]$Matches[1] }
    if ($notes -match 'queued=(\d+)') { $queued = [int]$Matches[1] }
    if ($notes -match 'retrying=(\d+)') { $retrying = [int]$Matches[1] }
    if ($notes -match 'failed=(\d+)') { $failed = [int]$Matches[1] }

    $total = $done + $running + $waitingAck + $queued + $retrying + $failed
    $pct = if ($total -gt 0) { [math]::Round((100.0 * $done / $total), 1) } else { 0 }

    $entries += [PSCustomObject]@{
      Date = $parsedDate.Date
      RawDate = $rawDate
      Done = $done
      Running = $running
      WaitingAck = $waitingAck
      Queued = $queued
      Retrying = $retrying
      Failed = $failed
      Total = $total
      Percent = $pct
      Notes = $notes
    }
  }

  return @($entries)
}

function Get-WindowSummary {
  param(
    [array]$Entries,
    [datetime]$Since,
    [string]$Label
  )

  $window = @($Entries | Where-Object { $_.Date -ge $Since.Date } | Sort-Object Date)
  $daysCovered = @($window | Select-Object -ExpandProperty Date -Unique).Count

  if ($window.Count -eq 0) {
    return [PSCustomObject]@{
      Label = $Label
      EntryCount = 0
      DaysCovered = 0
      AvgPercent = 0
      BestPercent = 0
      AvgDone = 0
      BestDone = 0
      LatestDate = $null
      LatestDone = 0
      LatestTotal = 0
      LatestPercent = 0
      ImprovementSignal = 'no data yet'
    }
  }

  $avgPercent = [math]::Round((($window | Measure-Object -Property Percent -Average).Average), 1)
  $bestPercent = [math]::Round((($window | Measure-Object -Property Percent -Maximum).Maximum), 1)
  $avgDone = [math]::Round((($window | Measure-Object -Property Done -Average).Average), 1)
  $bestDone = [int](($window | Measure-Object -Property Done -Maximum).Maximum)
  $latest = $window[-1]
  $first = $window[0]
  $delta = [math]::Round(($latest.Percent - $first.Percent), 1)

  $signal = if ($delta -ge 10) {
    'strong improvement'
  } elseif ($delta -ge 3) {
    'positive improvement'
  } elseif ($delta -gt -3) {
    'mostly flat'
  } else {
    'regression / reset-heavy'
  }

  return [PSCustomObject]@{
    Label = $Label
    EntryCount = $window.Count
    DaysCovered = $daysCovered
    AvgPercent = $avgPercent
    BestPercent = $bestPercent
    AvgDone = $avgDone
    BestDone = $bestDone
    LatestDate = $latest.Date
    LatestDone = $latest.Done
    LatestTotal = $latest.Total
    LatestPercent = $latest.Percent
    ImprovementSignal = $signal
  }
}

$entries = Parse-TrackerEntries -Path $trackerFile
$current = Get-CurrentQueueSnapshot -Path $queueFile
$today = (Get-Date).Date
$weekStart = $today.AddDays(-6)

if (-not $Daily -and -not $Weekly) {
  $Daily = $true
  $Weekly = $true
}

$dailySummary = if ($Daily) { Get-WindowSummary -Entries $entries -Since $today -Label 'Daily' } else { $null }
$weeklySummary = if ($Weekly) { Get-WindowSummary -Entries $entries -Since $weekStart -Label 'Weekly' } else { $null }

if ($Brief) {
  $briefLines = @()
  $briefLines += 'Aegis Progress Check'
  if ($null -ne $dailySummary) {
    $briefLines += ("  Daily  -> entries={0}, avg={1}%, best={2}%, signal={3}" -f $dailySummary.EntryCount, $dailySummary.AvgPercent, $dailySummary.BestPercent, $dailySummary.ImprovementSignal)
  }
  if ($null -ne $weeklySummary) {
    $briefLines += ("  Weekly -> entries={0}, avg={1}%, best={2}%, signal={3}" -f $weeklySummary.EntryCount, $weeklySummary.AvgPercent, $weeklySummary.BestPercent, $weeklySummary.ImprovementSignal)
  }
  if ($null -ne $current) {
    $briefLines += ("  Live   -> cycle={0}, progress={1}/{2} ({3}%), pending={4}, running={5}" -f $current.Cycle, $current.Done, $current.Total, $current.Percent, $current.Pending, $current.Running)
  }
  $briefLines -join "`r`n" | Write-Output
  exit 0
}

$w = 76
$reportLines = @()

function Add-ReportLine {
  param([string]$Text = '')
  $script:reportLines += $Text
}

Add-ReportLine ('=' * $w)
Add-ReportLine '  AEGIS DAILY / WEEKLY PROGRESS REPORT'
Add-ReportLine ("  {0}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm'))
Add-ReportLine ('=' * $w)
Add-ReportLine ''

if ($null -ne $current) {
  Add-ReportLine '  LIVE AEGIS SNAPSHOT'
  Add-ReportLine ("    Cycle     : {0}" -f $current.Cycle)
  Add-ReportLine ("    Progress  : {0}/{1} done ({2}%)" -f $current.Done, $current.Total, $current.Percent)
  Add-ReportLine ("    In flight : pending={0}, running={1}" -f $current.Pending, $current.Running)
  Add-ReportLine ''
}

function Write-SummaryBlock {
  param([object]$Summary)

  Add-ReportLine ("  {0} WINDOW" -f $Summary.Label.ToUpper())
  if ($Summary.EntryCount -eq 0) {
    Add-ReportLine '    No historical Aegis sync data found for this window yet.'
    Add-ReportLine ''
    return
  }

  Add-ReportLine ("    Tracker entries     : {0}" -f $Summary.EntryCount)
  Add-ReportLine ("    Days represented    : {0}" -f $Summary.DaysCovered)
  Add-ReportLine ("    Average completion  : {0}%" -f $Summary.AvgPercent)
  Add-ReportLine ("    Best completion     : {0}%" -f $Summary.BestPercent)
  Add-ReportLine ("    Average done count  : {0}" -f $Summary.AvgDone)
  Add-ReportLine ("    Best done count     : {0}" -f $Summary.BestDone)
  Add-ReportLine ("    Latest tracker snap : {0} -> {1}/{2} ({3}%)" -f $Summary.LatestDate.ToString('yyyy-MM-dd'), $Summary.LatestDone, $Summary.LatestTotal, $Summary.LatestPercent)
  Add-ReportLine ("    Improvement signal  : {0}" -f $Summary.ImprovementSignal)
  Add-ReportLine ''
}

if ($null -ne $dailySummary) { Write-SummaryBlock -Summary $dailySummary }
if ($null -ne $weeklySummary) { Write-SummaryBlock -Summary $weeklySummary }

Add-ReportLine '  CAN AEGIS IMPROVE THE PROJECT?'
if (($null -ne $weeklySummary -and $weeklySummary.EntryCount -gt 0 -and $weeklySummary.BestPercent -gt 0) -or ($null -ne $current -and $current.Done -gt 0)) {
  $verdict = if (($null -ne $weeklySummary -and $weeklySummary.ImprovementSignal -match 'strong|positive') -or ($null -ne $current -and $current.Percent -ge 50)) {
    'Yes — Aegis is showing measurable progress.'
  } else {
    'Partially — Aegis is active, but progress is still uneven or early-stage.'
  }
  Add-ReportLine ("    {0}" -f $verdict)
} else {
  Add-ReportLine '    Not enough tracker history yet to prove sustained improvement.'
}
Add-ReportLine '    Tip: run this report every day to build a stronger weekly trend line.'
Add-ReportLine ''
Add-ReportLine '  COMMANDS'
Add-ReportLine '    npm run orchestrator:aegis:progress'
Add-ReportLine '    npm run orchestrator:aegis:progress:daily'
Add-ReportLine '    npm run orchestrator:aegis:progress:weekly'
Add-ReportLine '    npm run orchestrator:aegis:progress:brief'
Add-ReportLine ('=' * $w)
Add-ReportLine ''

$reportLines -join "`r`n" | Write-Output
