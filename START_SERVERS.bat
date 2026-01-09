@echo off
echo.
echo ========================================
echo   Women Safety - Full Stack Startup
echo ========================================
echo.
echo Starting Backend and Frontend servers...
echo.
echo NOTE: This will open two terminal windows
echo - Backend will run on http://localhost:5000
echo - Frontend will run on http://localhost:5173 (or next available port)
echo.
pause

cd /d "%~dp0"

REM Start Backend
echo.
echo [1/2] Starting Backend Server...
start cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 3

REM Start Frontend
echo [2/2] Starting Frontend Dev Server...
start cmd /k "cd frontend/Astra && npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Check the terminal windows for server status.
echo.
pause
