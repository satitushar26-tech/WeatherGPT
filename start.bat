@echo off
echo ========================================================
echo         WeatherGPT - Starting Local Dev Servers
echo ========================================================
echo.

echo [1/3] Starting Backend API Server on http://localhost:5000...
start "WeatherGPT API Server" node "%~dp0artifacts\api-server\dist\index.mjs"

echo [2/3] Starting Frontend Web App on http://localhost:3000...
start "WeatherGPT Web App" /d "%~dp0artifacts\weather-gpt" node "node_modules\vite\bin\vite.js" --host 0.0.0.0 --port 3000

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser to http://localhost:3000 ...
start http://localhost:3000

echo.
echo ========================================================
echo WeatherGPT is running!
echo Frontend: http://localhost:3000
echo API:      http://localhost:5000
echo ========================================================
