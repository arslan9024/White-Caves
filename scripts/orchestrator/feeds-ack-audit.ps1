# feeds-ack-audit.ps1 -- Validate FEEDS_ACK compliance in orchestrator queue
# Usage:
#   npm run orchestrator:feeds-ack:audit
#   npm run orchestrator:feeds-ack:audit:brief
#   npm run orchestrator:feeds-ack:audit:strict

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Brief,
  [switch]$Strict
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
$queueFile = Join-Path $root "logs\orchestrator\task-queue.json"
$w = 72

if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] queue file not found" -ForegroundColor Red
  exit 1
}

$q = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks = @($q.tasks)

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- FEEDS_ACK AUDIT" -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

$required = @($tasks | Where-Object { $_.requiresFeedsAck -eq $true })
$missingAck = [System.Collections.Generic.List[string]]::new()
$invalidAck = [System.Collections.Generic.List[string]]::new()

foreach ($t in $required) {
  $isDone = $t.status -eq "done"
  $ack = $null
  if ($null -ne $t.evidence) { $ack = $t.evidence.feedsAck }

  if ($isDone) {
    if ($null -eq $ack) {
      $missingAck.Add("$($t.taskId) [$($t.agent)] done but missing evidence.feedsAck")
      continue
    }

    $by = ""
    $note = ""
    try { $by = [string]$ack.by } catch {}
    try { $note = [string]$ack.note } catch {}

    if ([string]::IsNullOrWhiteSpace($by) -or [string]::IsNullOrWhiteSpace($note)) {
      $invalidAck.Add("$($t.taskId) [$($t.agent)] feedsAck incomplete (by/note required)")
    }
  }
}

$doneWithRequired = @($required | Where-Object { $_.status -eq 'done' }).Count
$ok = $doneWithRequired - $missingAck.Count - $invalidAck.Count

Write-Host ("  Required FEEDS_ACK tasks: {0}" -f $required.Count) -ForegroundColor White
Write-Host ("  Done with FEEDS_ACK required: {0}" -f $doneWithRequired) -ForegroundColor White
Write-Host ("  Valid ACK: {0}" -f $ok) -ForegroundColor Green
Write-Host ("  Missing ACK: {0}" -f $missingAck.Count) -ForegroundColor Yellow
Write-Host ("  Invalid ACK: {0}" -f $invalidAck.Count) -ForegroundColor Yellow

if (-not $Brief) {
  if ($missingAck.Count -gt 0) {
    Write-Host ""
    Write-Host "  MISSING ACK DETAILS:" -ForegroundColor Yellow
    foreach ($m in $missingAck) { Write-Host ("  - {0}" -f $m) -ForegroundColor Yellow }
  }

  if ($invalidAck.Count -gt 0) {
    Write-Host ""
    Write-Host "  INVALID ACK DETAILS:" -ForegroundColor Yellow
    foreach ($i in $invalidAck) { Write-Host ("  - {0}" -f $i) -ForegroundColor Yellow }
  }
}

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan

if ($Strict -and ($missingAck.Count -gt 0 -or $invalidAck.Count -gt 0)) { exit 1 }
exit 0
