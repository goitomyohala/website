@echo off
echo ========================================
echo Starting Full-Stack Website Server
echo ========================================
echo.

cd backend

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting server...
echo.
node server.js

pause

