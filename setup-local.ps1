# Sets up this repo on your own Windows laptop, without Docker or Codespaces.
# Run from the repo folder:  powershell -ExecutionPolicy Bypass -File setup-local.ps1
# Safe to run again: anything already installed is left alone.
# Native tools print progress on stderr, so failures are caught by exit code, not by
# PowerShell's error stream.
$ErrorActionPreference = 'Continue'
function Check($what) { if ($LASTEXITCODE -ne 0) { Write-Host "Could not $what. Fix the message above, then run this again."; exit 1 } }

function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
              [Environment]::GetEnvironmentVariable('Path', 'User') + ';' +
              "$env:USERPROFILE\.local\bin"
}

$nodeMajor = 0
if (Get-Command node -ErrorAction SilentlyContinue) { $nodeMajor = [int](node -p "process.versions.node.split('.')[0]") }
if ($nodeMajor -lt 24) {
  Write-Host '-> Installing Node.js LTS'
  winget install --id OpenJS.NodeJS.LTS --exact --silent --accept-package-agreements --accept-source-agreements
  Refresh-Path
}

# Git for Windows also brings bash, which Spec Kit's scripts in .specify/scripts/bash need.
if (-not (Get-Command bash -ErrorAction SilentlyContinue)) {
  Write-Host '-> Installing Git for Windows (git and bash)'
  winget install --id Git.Git --exact --silent --accept-package-agreements --accept-source-agreements
  Refresh-Path
}

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
  Write-Host '-> Installing uv'
  winget install --id astral-sh.uv --exact --silent --accept-package-agreements --accept-source-agreements
  Refresh-Path
}

Write-Host '-> Installing Spec Kit (specify)'
uv tool install --upgrade --quiet specify-cli; Check 'install Spec Kit'
Refresh-Path

if (Test-Path package.json) {
  Write-Host "-> Installing the app's packages"
  npm install --no-fund --no-audit; Check 'install the packages'
}

Write-Host ''
Write-Host "Ready. Node $(node --version), $(specify --version)."
Write-Host 'Open a NEW terminal so the new commands are found, then follow STEPS.md.'
