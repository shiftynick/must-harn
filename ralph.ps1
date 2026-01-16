<#
.SYNOPSIS
    Ralph - Iterative AI agent runner for task completion.

.DESCRIPTION
    Runs an iterative loop that pipes prompt.md to the 'amp' CLI tool.
    Each iteration checks if the agent signals completion via <promise>COMPLETE</promise>.
    Designed for autonomous task execution with progress tracking.

.PARAMETER WorkingDir
    Path to the directory containing prompt.md, tasks.json, and progress.txt.
    Defaults to the script's directory ($PSScriptRoot).

.PARAMETER MaxIterations
    Maximum number of iterations before stopping. Default: 10.

.EXAMPLE
    .\ralph.ps1
    Runs with default settings (10 iterations, current script directory).

.EXAMPLE
    .\ralph.ps1 -WorkingDir ".\my-task" -MaxIterations 5
    Runs 5 iterations using the my-task folder.

.EXAMPLE
    .\ralph.ps1 -WorkingDir "N:\projects\feature-x"
    Runs against a specific project directory.

.NOTES
    Required files in WorkingDir:
      - prompt.md    : Instructions for the amp agent
      - tasks.json   : Task definitions with subtasks
      - progress.txt : Progress log (appended by agent)

    Exit codes:
      0 - Agent signaled COMPLETE
      1 - Max iterations reached without completion
#>

#Requires -Version 5.1
param(
    [string]$WorkingDir = $PSScriptRoot,
    [int]$MaxIterations = 10
)

$ErrorActionPreference = "Stop"

# Resolve to absolute path
$WorkingDir = Resolve-Path $WorkingDir

Write-Host "Starting Ralph in: $WorkingDir" -ForegroundColor Cyan

for ($i = 1; $i -le $MaxIterations; $i++) {
    Write-Host "=== Iteration $i ===" -ForegroundColor Yellow

    try {
        $PromptContent = Get-Content -Path "$WorkingDir\prompt.md" -Raw
        $Output = docker sandbox run claude -p $PromptContent 2>&1 | Tee-Object -Variable CapturedOutput
        Write-Host $Output
    }
    catch {
        Write-Host $_.Exception.Message -ForegroundColor Red
        $Output = $CapturedOutput
    }

    if ($Output -match "<promise>COMPLETE</promise>") {
        Write-Host "Done!" -ForegroundColor Green
        exit 0
    }

    Start-Sleep -Seconds 2
}

Write-Host "Max iterations reached" -ForegroundColor Yellow
exit 1
