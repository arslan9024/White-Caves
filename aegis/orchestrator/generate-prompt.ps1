# generate-prompt.ps1 -- Generate prompts from templates and optionally save to prompts.json

param(
  [string]$WorkspaceRoot = ".",
  [Parameter(Mandatory=$true)][string]$Action,
  [Parameter(Mandatory=$true)][string]$File,
  [Parameter(Mandatory=$true)][string]$Agent,
  [string]$Section = "",
  [string]$TargetSections = "",
  [string]$AcceptanceCriteria = "",
  [string]$TaskId = ""
)

$root = Resolve-Path $WorkspaceRoot
$templateDir = Join-Path $root "scripts\orchestrator\prompt-templates"
$templatePath = Join-Path $templateDir (([string]$Action).ToUpper() + ".tpl")

if (-not (Test-Path $templatePath)) {
  Write-Host ("[ERROR] Template not found: {0}" -f $templatePath) -ForegroundColor Red
  exit 1
}

$template = Get-Content $templatePath -Raw
$out = $template
$out = $out.Replace("{agent}", $Agent)
$out = $out.Replace("{file}", $File)
$out = $out.Replace("{section}", $Section)
$out = $out.Replace("{target_sections}", $TargetSections)
$out = $out.Replace("{acceptance_criteria}", $AcceptanceCriteria)

Write-Host ""
Write-Host "Generated prompt:" -ForegroundColor Cyan
Write-Host $out -ForegroundColor White

if (-not [string]::IsNullOrWhiteSpace($TaskId)) {
  $pm = Join-Path $root "scripts\orchestrator\prompt-manager.ps1"
  if (Test-Path $pm) {
    & powershell -ExecutionPolicy Bypass -File $pm -WorkspaceRoot $root -Save -TaskId $TaskId -Text $out -Agent $Agent -Action $Action -Target $File
  }
}

exit 0
