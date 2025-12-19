# PowerShell script to start the server
Write-Host "========================================"
Write-Host "Starting Full-Stack Website Server"
Write-Host "========================================"
Write-Host ""

Set-Location backend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host ""
node server.js

