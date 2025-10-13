#!/bin/sh

echo "Running database migrations..."
# Try to run migrations, but don't fail if they error
# (app can still start and health check will show DB status)
npx prisma migrate deploy || echo "Warning: Migrations failed or no migrations to apply"

echo "Starting application..."
exec node server.js
