param(
  [int]$Turns = 1,
  [switch]$Loop
)

Set-Location "C:\Users\HP\Downloads\White Caves\White Caves Web App\White-Caves"

if ($Loop) {
  .\scripts\orchestrator\ten-task-loop.ps1 -AutoLoop -AutoImplement -UseSubagentFlow -EnableParallelInSubagentFlow 1 -ParallelTaskSlots 2 -ParallelConflictStrictness 2 -EnableHierarchy150Mode 1 -EnableBestAIMode 1 -EnableAdaptiveTaskScoring 1 -EnableSmartTaskRouting 1 -DisablePerTurnPlanningOps -ImplementCommand "npm run typecheck" -ValidationEveryNTurns 999 -RegressionDeltaStopPct -100 -LiveCommandOutput 1
}
else {
  .\scripts\orchestrator\ten-task-loop.ps1 -Turns $Turns -AutoImplement -UseSubagentFlow -EnableParallelInSubagentFlow 1 -ParallelTaskSlots 2 -ParallelConflictStrictness 2 -EnableHierarchy150Mode 1 -EnableBestAIMode 1 -EnableAdaptiveTaskScoring 1 -EnableSmartTaskRouting 1 -DisablePerTurnPlanningOps -ImplementCommand "npm run typecheck" -ValidationEveryNTurns 999 -RegressionDeltaStopPct -100 -LiveCommandOutput 1
}
