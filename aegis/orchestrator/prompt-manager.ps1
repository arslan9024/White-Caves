# prompt-manager.ps1 -- Manage versioned prompts in prompts.json

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Save,
  [switch]$Search,
  [switch]$Clone,
  [switch]$History,
  [switch]$Export,
  [switch]$Stats,
  [switch]$MarkSuccess,
  [string]$TaskId = "",
  [string]$Text = "",
  [string]$NewId = "",
  [string]$Query = "",
  [string]$Agent = "",
  [string]$Action = "",
  [string]$Target = "",
  [string[]]$Tags = @()
)

$root = Resolve-Path $WorkspaceRoot
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"
$promptsMutex = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Prompts")
if (-not (Test-Path $promptsFile)) {
  Write-Host "[ERROR] prompts.json not found" -ForegroundColor Red
  exit 1
}

function Parse-PromptMeta([string]$promptText) {
  $meta = @{ agent = ""; action = ""; target = ""; tags = @() }
  if ($promptText -match "(@[A-Za-z0-9\-]+)") { $meta.agent = $Matches[1] }
  if ($promptText -match "--\s*([A-Z_]+):") { $meta.action = $Matches[1] }
  if ($promptText -match "([\w\-./]+\.md)") { $meta.target = $Matches[1] }

  $tagList = [System.Collections.Generic.List[string]]::new()
  if ($promptText -match "(?i)RERA") { $tagList.Add("RERA") | Out-Null }
  if ($promptText -match "(?i)DLD") { $tagList.Add("DLD") | Out-Null }
  if ($promptText -match "(?i)VAT") { $tagList.Add("VAT") | Out-Null }
  if ($promptText -match "(?i)wave[-\s_]?\d+") {
    $m = [regex]::Match($promptText, "(?i)wave[-\s_]?\d+")
    if ($m.Success) { $tagList.Add($m.Value.ToLower().Replace(" ", "-")) | Out-Null }
  }
  $meta.tags = @($tagList)
  return $meta
}

function Get-PromptText($entry) {
  if ($entry -is [string]) { return $entry }
  if ($null -ne $entry -and $entry.PSObject.Properties.Name -contains "prompt") { return [string]$entry.prompt }
  return ""
}

function To-StructuredEntry([string]$taskId, $entryValue) {
  if ($entryValue -isnot [string]) {
    $obj = [pscustomobject]$entryValue
    if ($obj.PSObject.Properties.Name -contains "v") { return $obj }
  }

  $prompt = [string]$entryValue
  $meta = Parse-PromptMeta $prompt
  return [pscustomobject]@{
    v = 1
    agent = $meta.agent
    action = $meta.action
    target = $meta.target
    prompt = $prompt
    tags = @($meta.tags)
    lastUsed = (Get-Date -Format "yyyy-MM-dd")
    successCount = 0
    history = @()
  }
}

$prompts = Get-Content $promptsFile -Raw | ConvertFrom-Json

function Save-Prompts($obj) {
  $json = $obj | ConvertTo-Json -Depth 20
  $encoding = New-Object System.Text.UTF8Encoding($false)
  $dir = Split-Path -Parent $promptsFile
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }

  $acquired = $false
  try {
    $acquired = $promptsMutex.WaitOne(5000)

    $lastError = $null
    for ($attempt = 1; $attempt -le 5; $attempt++) {
      $tmp = Join-Path $dir ("prompts.json.tmp.{0}" -f [guid]::NewGuid().ToString("N"))
      try {
        [System.IO.File]::WriteAllText($tmp, $json, $encoding)
        [System.IO.File]::Copy($tmp, $promptsFile, $true)
        Remove-Item -Path $tmp -Force -ErrorAction SilentlyContinue
        return
      } catch {
        $lastError = $_
        Remove-Item -Path $tmp -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds ([Math]::Min(1000, 150 * $attempt))
      }
    }

    throw $lastError
  } finally {
    if ($acquired) {
      $promptsMutex.ReleaseMutex() | Out-Null
    }
  }
}

if ($Save) {
  if ([string]::IsNullOrWhiteSpace($TaskId) -or [string]::IsNullOrWhiteSpace($Text)) {
    Write-Host "[ERROR] -Save requires -TaskId and -Text" -ForegroundColor Red
    exit 1
  }

  $existingProp = $prompts.PSObject.Properties | Where-Object { $_.Name -eq $TaskId } | Select-Object -First 1
  $entry = if ($null -ne $existingProp) { To-StructuredEntry $TaskId $existingProp.Value } else { To-StructuredEntry $TaskId "" }

  $currentPrompt = [string]$entry.prompt
  if (-not [string]::IsNullOrWhiteSpace($currentPrompt)) {
    $h = @($entry.history)
    $h += [pscustomobject]@{ v = [int]$entry.v; prompt = $currentPrompt; date = (Get-Date -Format "yyyy-MM-dd") }
    $entry.history = $h
  }

  $entry.v = [int]$entry.v + 1
  $entry.prompt = $Text
  $entry.lastUsed = (Get-Date -Format "yyyy-MM-dd")

  $meta = Parse-PromptMeta $Text
  if (-not [string]::IsNullOrWhiteSpace($Agent)) { $entry.agent = $Agent }
  elseif (-not [string]::IsNullOrWhiteSpace($meta.agent)) { $entry.agent = $meta.agent }

  if (-not [string]::IsNullOrWhiteSpace($Action)) { $entry.action = $Action }
  elseif (-not [string]::IsNullOrWhiteSpace($meta.action)) { $entry.action = $meta.action }

  if (-not [string]::IsNullOrWhiteSpace($Target)) { $entry.target = $Target }
  elseif (-not [string]::IsNullOrWhiteSpace($meta.target)) { $entry.target = $meta.target }

  if ($Tags.Count -gt 0) { $entry.tags = @($Tags) }
  elseif (@($entry.tags).Count -eq 0 -and @($meta.tags).Count -gt 0) { $entry.tags = @($meta.tags) }

  $prompts | Add-Member -NotePropertyName $TaskId -NotePropertyValue $entry -Force
  Save-Prompts $prompts
  Write-Host ("Saved prompt {0} as version v{1}" -f $TaskId, $entry.v) -ForegroundColor Green
  exit 0
}

if ($MarkSuccess) {
  if ([string]::IsNullOrWhiteSpace($TaskId)) {
    Write-Host "[ERROR] -MarkSuccess requires -TaskId" -ForegroundColor Red
    exit 1
  }
  $p = $prompts.PSObject.Properties | Where-Object { $_.Name -eq $TaskId } | Select-Object -First 1
  if ($null -eq $p) { exit 0 }
  $entry = To-StructuredEntry $TaskId $p.Value
  $entry.successCount = [int]$entry.successCount + 1
  $entry.lastUsed = (Get-Date -Format "yyyy-MM-dd")
  $prompts | Add-Member -NotePropertyName $TaskId -NotePropertyValue $entry -Force
  Save-Prompts $prompts
  Write-Host ("Marked success for {0}; successCount={1}" -f $TaskId, $entry.successCount) -ForegroundColor Green
  exit 0
}

if ($Search) {
  $q = if (-not [string]::IsNullOrWhiteSpace($Query)) { $Query } else { $TaskId }
  if ([string]::IsNullOrWhiteSpace($q)) {
    Write-Host "[ERROR] -Search requires -Query" -ForegroundColor Red
    exit 1
  }
  $needle = $q.ToLower()
  foreach ($prop in $prompts.PSObject.Properties) {
    $entry = To-StructuredEntry $prop.Name $prop.Value
    $text = ("{0} {1} {2} {3} {4}" -f $prop.Name, $entry.agent, $entry.action, $entry.target, $entry.prompt).ToLower()
    $tagsText = (@($entry.tags) -join " ").ToLower()
    if ($text.Contains($needle) -or $tagsText.Contains($needle)) {
      Write-Host ("{0} | {1} | {2} | {3}" -f $prop.Name, $entry.agent, $entry.action, $entry.target) -ForegroundColor White
    }
  }
  exit 0
}

if ($Clone) {
  if ([string]::IsNullOrWhiteSpace($TaskId) -or [string]::IsNullOrWhiteSpace($NewId)) {
    Write-Host "[ERROR] -Clone requires -TaskId and -NewId" -ForegroundColor Red
    exit 1
  }
  $p = $prompts.PSObject.Properties | Where-Object { $_.Name -eq $TaskId } | Select-Object -First 1
  if ($null -eq $p) {
    Write-Host "[ERROR] source task not found" -ForegroundColor Red
    exit 1
  }
  $entry = To-StructuredEntry $TaskId $p.Value
  $cloned = [pscustomobject]@{
    v = 1
    agent = $entry.agent
    action = $entry.action
    target = $entry.target
    prompt = $entry.prompt
    tags = @($entry.tags)
    lastUsed = (Get-Date -Format "yyyy-MM-dd")
    successCount = 0
    history = @([pscustomobject]@{ v = $entry.v; prompt = $entry.prompt; date = (Get-Date -Format "yyyy-MM-dd") })
  }
  $prompts | Add-Member -NotePropertyName $NewId -NotePropertyValue $cloned -Force
  Save-Prompts $prompts
  Write-Host ("Cloned {0} -> {1}" -f $TaskId, $NewId) -ForegroundColor Green
  exit 0
}

if ($History) {
  if ([string]::IsNullOrWhiteSpace($TaskId)) {
    Write-Host "[ERROR] -History requires -TaskId" -ForegroundColor Red
    exit 1
  }
  $p = $prompts.PSObject.Properties | Where-Object { $_.Name -eq $TaskId } | Select-Object -First 1
  if ($null -eq $p) {
    Write-Host "[ERROR] task not found" -ForegroundColor Red
    exit 1
  }
  $entry = To-StructuredEntry $TaskId $p.Value
  Write-Host ("{0} current v{1}" -f $TaskId, $entry.v) -ForegroundColor Cyan
  foreach ($h in @($entry.history)) {
    Write-Host ("  v{0} ({1}): {2}" -f $h.v, $h.date, $h.prompt) -ForegroundColor DarkGray
  }
  Write-Host ("  v{0} ({1}): {2}" -f $entry.v, $entry.lastUsed, $entry.prompt) -ForegroundColor White
  exit 0
}

if ($Export) {
  if ([string]::IsNullOrWhiteSpace($Agent) -and $TaskId -match '^agent=(.+)$') {
    $Agent = $Matches[1]
  }
  if ([string]::IsNullOrWhiteSpace($Agent)) {
    Write-Host "[ERROR] -Export requires -Agent" -ForegroundColor Red
    exit 1
  }
  foreach ($prop in $prompts.PSObject.Properties) {
    $entry = To-StructuredEntry $prop.Name $prop.Value
    if ($entry.agent -eq $Agent) {
      Write-Host ("[{0}] {1}" -f $prop.Name, $entry.prompt) -ForegroundColor White
    }
  }
  exit 0
}

if ($Stats) {
  $rows = @()
  foreach ($prop in $prompts.PSObject.Properties) {
    $entry = To-StructuredEntry $prop.Name $prop.Value
    $rows += [pscustomobject]@{
      taskId = $prop.Name
      version = $entry.v
      successCount = [int]$entry.successCount
      lastUsed = $entry.lastUsed
      agent = $entry.agent
    }
  }
  $top = $rows | Sort-Object -Property @(
    @{ Expression = 'successCount'; Descending = $true },
    @{ Expression = 'version'; Descending = $true }
  ) | Select-Object -First 15
  foreach ($r in $top) {
    Write-Host ("{0} | v{1} | success={2} | lastUsed={3} | {4}" -f $r.taskId, $r.version, $r.successCount, $r.lastUsed, $r.agent) -ForegroundColor White
  }
  exit 0
}

Write-Host "No mode selected. Use -Save/-Search/-Clone/-History/-Export/-Stats/-MarkSuccess." -ForegroundColor Yellow
$promptsMutex.Dispose()
exit 1
