# Render Deployment Guide - ICE FLEET

## Setup Instructions for Render PostgreSQL Database

### Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +" button** → Select **"PostgreSQL"**
3. **Configure Database**:
   - Name: `icefleet-db` (or your preferred name)
   - Database: `icefleet`
   - User: `icefleet_user` (or leave default)
   - Region: **Same region as your web service** (e.g., Oregon - US West)
   - Instance Type: Free or Starter (based on your needs)
4. **Click "Create Database"**
5. **Wait for database to provision** (takes 1-2 minutes)

### Step 2: Get Database Connection String

After the database is created:

1. **Click on your database** in the Render dashboard
2. **Scroll down to "Connections"**
3. **Copy the "Internal Database URL"** (looks like):
   ```
   postgresql://icefleet_user:XXXXX@dpg-xxxxx-a/icefleet
   ```

   ⚠️ **Use Internal URL** for better performance (services on same Render account can use internal networking)

### Step 3: Configure Web Service Environment Variable

1. **Go to your Web Service** in Render dashboard
2. **Click "Environment"** in the left sidebar
3. **Add Environment Variable**:
   - Key: `DATABASE_URL`
   - Value: Paste the database connection string from Step 2
4. **Click "Save Changes"**

### Step 4: Deploy

The service will automatically redeploy with the new environment variable.

**What happens during deployment:**

1. ✅ Docker builds your app
2. ✅ Container starts and runs `start.sh`
3. ✅ `npx prisma migrate deploy` runs → creates all database tables
4. ✅ Next.js server starts
5. ✅ App connects to PostgreSQL database
6. ✅ Health check passes
7. ✅ Deployment successful!

### Step 5: Verify Deployment

1. **Check deployment logs** for:
   ```
   Running database migrations...
   Prisma schema loaded from prisma/schema.prisma
   Datasource "db": PostgreSQL database "icefleet"

   X migrations found in prisma/migrations
   X migrations have been applied

   Starting application...
   ```

2. **Test the health endpoint**:
   ```
   curl https://your-app.onrender.com/api/health
   ```

   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-10-13T...",
     "version": "1.0.0",
     "database": "connected"
   }
   ```

3. **Test a data endpoint**:
   ```
   curl https://your-app.onrender.com/api/dashboard/stats
   ```

---

## Alternative: Using External PostgreSQL (Railway)

If you prefer to keep using Railway PostgreSQL from Render, you can set:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

**Example format:** `postgresql://postgres:YOUR_PASSWORD@hopper.proxy.rlwy.net:PORT/railway`

**Note:** This will work but will have higher latency since data travels between Railway and Render.

**Security Warning:** ⚠️ Never commit actual database credentials to git. Always use environment variables.

---

## Troubleshooting

### Health Check Fails
- Check that `DATABASE_URL` is set in environment variables
- Verify database connection string is correct
- Check deployment logs for migration errors

### Database Connection Errors
- Ensure database is running (check Render database status)
- Verify connection string format is correct
- Check that database user has proper permissions

### Migration Errors
- Check prisma/migrations directory exists
- Verify Prisma schema matches migration files
- Look for SQL errors in logs

### App Won't Start
- Check for port binding errors (app should use PORT env var)
- Verify all required environment variables are set
- Review full deployment logs for stack traces

---

## Environment Variables Checklist

Required for production:
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ⚠️ `NEXTAUTH_SECRET` - Random secret for NextAuth (generate with: `openssl rand -base64 32`)
- ⚠️ `NEXTAUTH_URL` - Your app URL (e.g., `https://your-app.onrender.com`)
- ✅ `NODE_ENV=production` - Should be set automatically by Render

Optional:
- `PORT` - Auto-set by Render (defaults to 3000)
- `NEXT_TELEMETRY_DISABLED=1` - Already set in Dockerfile

---

## Current Deployment Status

✅ Build configuration fixed
✅ TypeScript errors resolved
✅ Prisma schema migrated to PostgreSQL
✅ Database migrations automated on startup
✅ Health check configured
✅ Dockerfile optimized

**Ready to deploy!** Follow steps above to complete setup.
