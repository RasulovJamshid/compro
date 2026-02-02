@echo off
echo 🚀 Starting Commercial Real Estate Platform...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Build and start all services
echo 📦 Building and starting services...
docker-compose up -d --build

REM Wait for services to be ready
echo.
echo ⏳ Waiting for services to start...
timeout /t 5 /nobreak >nul

REM Check service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo ✅ Platform is ready!
echo.
echo 🌐 Access URLs:
echo    Frontend:  http://localhost:3000
echo    Dashboard: http://localhost:3002
echo    Backend:   http://localhost:3001
echo    API Docs:  http://localhost:3001/api
echo.
echo 📝 View logs: docker-compose logs -f
echo 🛑 Stop all:  docker-compose down
echo.
pause
