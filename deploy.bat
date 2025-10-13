@echo off
REM ICE FLEET - Production Deployment Script (Windows)
REM This script helps deploy ICE FLEET to Railway

echo.
echo 🚀 ICE FLEET - Deployment Script
echo ==================================
echo.

REM Check if we're in the right directory
if not exist "railway.json" (
    echo ❌ Error: railway.json not found. Please run this script from the ICEFLEET root directory.
    exit /b 1
)

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Railway CLI not found. Installing...
    npm install -g @railway/cli
)

REM Check if logged in to Railway
echo 🔐 Checking Railway authentication...
railway whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo Please log in to Railway...
    railway login
)

REM Link to project if not already linked
if not exist ".railway" (
    echo 🔗 Linking to Railway project...
    railway link
)

REM Run database migrations
echo 📊 Running database migrations...
railway run npx prisma migrate deploy

REM Optional: Seed database
set /p SEED="Do you want to seed the database with test data? (y/N): "
if /i "%SEED%"=="y" (
    echo 🌱 Seeding database...
    railway run npx tsx app/scripts/seed.ts
)

REM Deploy
echo 🚀 Deploying to Railway...
railway up

echo.
echo ✅ Deployment complete!
echo.
echo 📍 Your application is now deployed to Railway
echo 🔍 Check status: railway status
echo 📋 View logs: railway logs
echo 🌐 Open app: railway open
