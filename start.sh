#!/bin/sh

echo "==> ICE FLEET Starting..."
echo "==> Working directory: $(pwd)"
echo "==> Listing files:"
ls -la

echo ""
echo "==> Running database migrations..."
# First, reset failed migrations (safe for alpha - no production data)
echo "==> Resetting migration history to fix P3009 error..."
npx prisma migrate reset --force --skip-seed --schema=./prisma/schema.prisma || echo "Reset not needed or already clean"

echo "==> Deploying fresh migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma || echo "Warning: Migrations failed or no migrations to apply"

echo ""
echo "==> Starting Next.js application..."
echo "==> Node version: $(node --version)"
echo "==> Looking for server at: app/server.js"

# Check if server file exists
if [ -f "app/server.js" ]; then
    echo "==> Server file found, starting..."
    exec node app/server.js
else
    echo "ERROR: app/server.js not found!"
    echo "==> Files in current directory:"
    ls -la
    echo "==> Files in app directory:"
    ls -la app/ || echo "app directory not found"
    exit 1
fi
