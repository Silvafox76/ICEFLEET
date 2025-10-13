#!/bin/bash

# ICE FLEET - Production Deployment Script
# This script helps deploy ICE FLEET to Railway

set -e

echo "🚀 ICE FLEET - Deployment Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "railway.json" ]; then
    echo "❌ Error: railway.json not found. Please run this script from the ICEFLEET root directory."
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in to Railway
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please log in to Railway..."
    railway login
fi

# Link to project if not already linked
if [ ! -f ".railway" ]; then
    echo "🔗 Linking to Railway project..."
    railway link
fi

# Run database migrations
echo "📊 Running database migrations..."
railway run npx prisma migrate deploy

# Optional: Seed database
read -p "Do you want to seed the database with test data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    railway run npx tsx app/scripts/seed.ts
fi

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Your application is now deployed to Railway"
echo "🔍 Check status: railway status"
echo "📋 View logs: railway logs"
echo "🌐 Open app: railway open"
