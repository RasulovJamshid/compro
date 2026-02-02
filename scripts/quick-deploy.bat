@echo off
REM Quick deployment script for Windows
REM This helps you push changes to Git and deploy to server

echo ======================================
echo   Quick Deploy to procom.uz
echo ======================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Error: Git repository not initialized
    echo Run: git init
    pause
    exit /b 1
)

REM Show current status
echo Current changes:
git status --short
echo.

REM Ask for commit message
set /p commit_msg="Enter commit message: "

if "%commit_msg%"=="" (
    echo Error: Commit message cannot be empty
    pause
    exit /b 1
)

REM Add all changes
echo.
echo Adding changes...
git add .

REM Commit
echo Committing changes...
git commit -m "%commit_msg%"

REM Push to remote
echo Pushing to remote repository...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: Failed to push to remote repository
    echo Make sure you have set up the remote repository
    pause
    exit /b 1
)

echo.
echo ======================================
echo   Changes pushed successfully!
echo ======================================
echo.
echo Next steps on your server:
echo   1. SSH into your server
echo   2. cd /var/www/procom.uz
echo   3. git pull origin main
echo   4. bash scripts/deploy.sh
echo.
echo Or if you have CI/CD setup, deployment will happen automatically!
echo.
pause
