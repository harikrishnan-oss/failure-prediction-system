# Start Failure Prediction AI Backend
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "backend")
& (Join-Path $scriptDir ".venv\Scripts\python.exe") -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

