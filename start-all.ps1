# EDGUARD Realtime - Start All Services
# Activates venv and starts all three servers

$venvPath = ".\venv\Scripts\Activate.ps1"

# Activate venv
Write-Host "Activating Python virtual environment..." -ForegroundColor Green
& $venvPath

# Start backend (Python Flask on port 5000)
Write-Host "Starting backend (Flask on port 5000)..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "app.py" -WorkingDirectory "backend"
Start-Sleep -Seconds 2

# Start parent-web-app (React on port 3001)
Write-Host "Starting parent-web-app (port 3001)..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "parent-web-app"
Start-Sleep -Seconds 2

# Start frontend (React on port 5173)
Write-Host "Starting frontend (port 5173)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Frontend:      http://192.168.0.9:5173" -ForegroundColor Yellow
Write-Host "Parent Alerts: http://192.168.0.9:3001" -ForegroundColor Cyan
Write-Host "Backend:       http://192.168.0.9:5000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

cd frontendnew
npm run dev -- --host 0.0.0.0
