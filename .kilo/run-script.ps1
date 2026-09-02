# Quistant UI dev-server

$ErrorActionPreference = "Stop"
$root = $env:REPO_PATH
if (-not $root) { $root = (Get-Location).Path }
Set-Location -LiteralPath $root

Write-Host "[run] Quistant UI starting on http://localhost:8080/UI/index.html" -ForegroundColor Cyan

try {
    python serve.py
}
finally {
    Write-Host "`n[run] stopped" -ForegroundColor Yellow
}
