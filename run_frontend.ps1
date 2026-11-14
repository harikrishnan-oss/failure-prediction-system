# Start Failure Prediction AI Frontend
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "frontend")
npm run dev

