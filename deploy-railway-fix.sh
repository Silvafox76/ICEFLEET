#!/bin/bash

echo "🚀 ICE FLEET - Railway Deployment Fix"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: Dockerfile not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Building and deploying to Railway..."

# Commit the fixes
echo "📝 Committing CSS fixes..."
git add .
git commit -m "Fix CSS loading issues in production - Dockerfile, Next.js config, and static asset handling" || echo "No changes to commit"

# Push to trigger Railway deployment
echo "🚀 Pushing to Railway..."
git push origin main

echo "✅ Deployment initiated!"
echo ""
echo "🔍 Monitor your deployment at:"
echo "   https://dashboard.railway.app"
echo ""
echo "🌐 Your app will be available at:"
echo "   https://icefleet-production.up.railway.app/"
echo ""
echo "⏱️  Deployment typically takes 2-3 minutes"
echo "📊 Check Railway logs for build progress"
