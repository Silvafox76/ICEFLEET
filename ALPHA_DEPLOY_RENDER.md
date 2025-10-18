# ICE FLEET - Alpha Deployment Guide for Render
## Production-Ready Deployment with Security Best Practices

**Last Updated:** 2025-10-18
**Status:** ✅ Ready for Deployment
**Target Environment:** Render (Alpha Production)

---

## Prerequisites

Before you begin, ensure you have:
- ✅ GitHub account with access to this repository
- ✅ Render account (sign up at https://render.com)
- ✅ Git repository pushed to GitHub
- ✅ All code committed and pushed to `master` branch

---

## Deployment Method: Choose One

### Method A: Automatic (Recommended) - Using render.yaml ⭐

**Fastest and easiest deployment method**

1. **Upload render.yaml to your repository**
   ```bash
   git add render.yaml
   git commit -m "Add Render blueprint for automated deployment"
   git push origin master
   ```

2. **Deploy from Render Dashboard**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select branch: `master`
   - Render will detect `render.yaml` automatically
   - Click "Apply"

3. **Render will automatically:**
   - Create PostgreSQL database
   - Create web service
   - Link database to web service
   - Set DATABASE_URL automatically
   - Generate NEXTAUTH_SECRET
   - Deploy your application

4. **Verify deployment**
   - Wait 5-10 minutes for first deployment
   - Check health: `https://your-app.onrender.com/api/health`

**That's it! Skip to "Post-Deployment Verification" below.**

---

### Method B: Manual Setup (Step-by-Step)

**Use this if you prefer manual control or want to understand each step**

#### Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" button
   - Select "PostgreSQL"

2. **Configure Database**
   ```
   Name: icefleet-db
   Database: icefleet
   User: icefleet_user (or leave default)
   Region: Oregon (US West) - Choose closest to your users
   Instance Type: Starter ($7/month, includes backups)
                  or Free (for testing only, no backups)
   ```

3. **Create Database**
   - Click "Create Database"
   - Wait 2-3 minutes for provisioning

4. **Copy Connection String**
   - Once created, scroll to "Connections"
   - Copy "Internal Database URL" (looks like):
     ```
     postgresql://icefleet_user:xxxxx@dpg-xxxxx-a/icefleet
     ```
   - ⚠️ **Use Internal URL** for better performance and security

---

#### Step 2: Create Web Service

1. **Return to Dashboard**
   - Click "New +" button
   - Select "Web Service"

2. **Connect Repository**
   - Select "Build and deploy from a Git repository"
   - Click "Connect" next to your GitHub account
   - Choose repository: `ICEFLEET`
   - Branch: `master`

3. **Configure Service**
   ```
   Name: icefleet-app
   Region: Oregon (same as database!)
   Branch: master

   Runtime: Docker

   Instance Type: Starter ($7/month)
                  or Free (for testing, sleeps after inactivity)
   ```

4. **Advanced Settings (Click to expand)**

   **Build Command:** (Leave empty - Docker handles this)

   **Start Command:** (Leave empty - Dockerfile CMD handles this)

   **Dockerfile Path:** `./Dockerfile`

   **Docker Context:** `.` (root directory)

   **Health Check Path:** `/api/health`

---

#### Step 3: Configure Environment Variables

**In the web service configuration, scroll to "Environment Variables"**

Add these variables one by one:

##### Required Variables:

1. **DATABASE_URL**
   - Click "Add from Database"
   - Select: `icefleet-db`
   - Property: `Connection String (Internal)`
   - Click "Add"

2. **NEXTAUTH_SECRET**
   - Click "Add Environment Variable"
   - Key: `NEXTAUTH_SECRET`
   - Value: Generate using one of these methods:

   **Option 1 - Let Render Generate:**
   - Click "Generate Value"

   **Option 2 - Generate Yourself:**
   ```bash
   # Linux/Mac:
   openssl rand -base64 32

   # Or Node.js:
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # Or PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```
   - Paste the generated value

3. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://icefleet-app.onrender.com` (replace with your service name)
   - Or leave blank and Render will auto-detect

4. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

##### Optional Variables (for future use):

```
# Only add these if you need them:

ICE_CRM_API_URL=https://crm.icehub.ca/api
ICE_CRM_API_KEY=<your-key>

ICE_CERT_API_URL=https://cert.icehub.ca/api
ICE_CERT_API_KEY=<your-key>

MAPBOX_API_KEY=<your-key>
```

---

#### Step 4: Deploy

1. **Review Configuration**
   - Scroll to bottom of page
   - Review all settings

2. **Create Web Service**
   - Click "Create Web Service"
   - Deployment will start automatically

3. **Monitor Deployment**
   - You'll be redirected to the deployment logs
   - Watch for these stages:
     ```
     ✓ Building Docker image
     ✓ Running migrations
     ✓ Starting application
     ✓ Health check passed
     ```

4. **Wait for Completion**
   - First deployment: 5-10 minutes
   - Subsequent deployments: 3-5 minutes

---

## Post-Deployment Verification

### Step 1: Check Health Endpoint

```bash
# Replace with your actual service URL
curl https://icefleet-app.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T...",
  "version": "1.0.0",
  "database": "connected"
}
```

✅ If you see this, your deployment is successful!

### Step 2: Test API Endpoints

```bash
# Dashboard Stats
curl https://icefleet-app.onrender.com/api/dashboard/stats

# Vehicles
curl https://icefleet-app.onrender.com/api/fleet/vehicles

# Drivers
curl https://icefleet-app.onrender.com/api/drivers
```

**Expected:** JSON responses (may be empty arrays if no data yet)

### Step 3: Access Web Interface

1. Open browser to: `https://icefleet-app.onrender.com`
2. You should see the ICE FLEET homepage
3. Navigate through pages:
   - Dashboard
   - Fleet Management
   - Drivers
   - Compliance
   - Maintenance

---

## Troubleshooting Common Issues

### Issue 1: Health Check Fails ❌

**Symptoms:**
- Service shows "Unhealthy"
- 503 Service Unavailable

**Solutions:**

1. **Check Deployment Logs:**
   - Go to service → "Logs" tab
   - Look for errors during startup

2. **Common Causes:**
   - DATABASE_URL not set → Add from database
   - Migrations failed → Check database connectivity
   - Port binding error → Verify Dockerfile exposes port 3000

3. **Fix:**
   ```bash
   # In Render dashboard → Environment → Verify:
   DATABASE_URL=postgresql://...  (should be set)
   NODE_ENV=production
   ```

### Issue 2: Database Connection Errors

**Symptoms:**
```json
{
  "status": "healthy",
  "database": "disconnected",
  "databaseError": "Connection refused"
}
```

**Solutions:**

1. **Verify DATABASE_URL Format:**
   - Should be "Internal Database URL" from Render
   - Format: `postgresql://user:pass@host/database`

2. **Check Database Status:**
   - Go to database service
   - Ensure status is "Available"

3. **Verify Region Match:**
   - Database and web service should be in same region

### Issue 3: Migrations Fail

**Symptoms:**
```
Error: Migration failed
P3009: migrate found failed migrations
```

**Solution:**
```bash
# In Render dashboard → Shell → Run:
npx prisma migrate deploy
```

Or redeploy the service (automatic migrations will retry).

### Issue 4: Build Fails

**Symptoms:**
- Deployment stuck at "Building"
- Error in build logs

**Common Causes & Solutions:**

1. **Dockerfile not found:**
   - Verify Dockerfile is in root directory
   - Check Docker Context is set to `.`

2. **npm install fails:**
   - Check package.json syntax
   - Verify node_modules not committed to git

3. **TypeScript errors:**
   - Run `npm run build` locally first
   - Fix any type errors

### Issue 5: Application Won't Start

**Symptoms:**
- Build succeeds
- Container starts then immediately crashes

**Check:**

1. **start.sh permissions:**
   ```bash
   # Locally:
   chmod +x start.sh
   git add start.sh
   git commit -m "Fix start.sh permissions"
   git push
   ```

2. **start.sh line endings:**
   - Should be LF (Unix), not CRLF (Windows)
   - Fix with: `dos2unix start.sh` or editor setting

3. **Server path:**
   - In start.sh, ensure: `node app/server.js`
   - Not: `node server.js`

---

## Monitoring Your Deployment

### Render Dashboard

1. **Logs Tab:**
   - Real-time application logs
   - Filter by level (info, warn, error)
   - Download logs for analysis

2. **Metrics Tab:**
   - CPU usage
   - Memory usage
   - Response times
   - Error rates

3. **Events Tab:**
   - Deployment history
   - Configuration changes
   - Scaling events

### Health Monitoring

**Set up monitoring alerts:**

1. Go to service → "Settings" → "Health Checks"
2. Configure:
   ```
   Path: /api/health
   Interval: 30 seconds
   Timeout: 10 seconds
   Unhealthy threshold: 3 failures
   ```

3. Add notification webhook (optional)

### Database Monitoring

1. **Database Metrics:**
   - Go to database service → "Metrics"
   - Monitor: Connections, Query performance, Storage

2. **Backups (Starter plan+):**
   - Automatic daily backups
   - 7-day retention
   - One-click restore

---

## Updating Your Deployment

### Automatic Deployments (Recommended)

**Render auto-deploys when you push to GitHub:**

```bash
# Make code changes locally
git add .
git commit -m "Your changes"
git push origin master

# Render automatically detects push and deploys
```

**Watch deployment:**
- Go to Render dashboard
- Select your service
- Click "Events" to see deployment progress

### Manual Deployments

**Trigger manual deploy:**

1. Go to service in Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Or select specific commit from dropdown

### Rolling Back

**If deployment breaks:**

1. Go to service → "Events"
2. Find last working deployment
3. Click "Redeploy" on that specific deployment

---

## Security Best Practices

### ✅ Completed During Deployment

- SSL/HTTPS automatically enabled by Render
- Database connections encrypted (SSL/TLS)
- Secrets stored securely in Render (not in code)
- Non-root user in Docker container
- Internal database URL (private network)

### 📋 Recommended for Production

1. **Enable Dependency Scanning:**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Add Error Tracking:**
   - Sign up for Sentry: https://sentry.io
   - Add SENTRY_DSN to environment variables

3. **Implement Rate Limiting:**
   - Before beta release
   - Protect API endpoints

4. **Add Authentication:**
   - NextAuth.js already configured
   - Implement before beta release

---

## Environment Variables Reference

**Copy this checklist when configuring:**

```
Critical (Required):
✅ DATABASE_URL (auto-set from database)
✅ NEXTAUTH_SECRET (generate 32+ bytes)
✅ NEXTAUTH_URL (your service URL)
✅ NODE_ENV (production)

Optional (Future):
⬜ ICE_CRM_API_URL
⬜ ICE_CRM_API_KEY
⬜ ICE_CERT_API_URL
⬜ ICE_CERT_API_KEY
⬜ MAPBOX_API_KEY
⬜ SENTRY_DSN
⬜ GOOGLE_CLIENT_ID
⬜ GOOGLE_CLIENT_SECRET
```

---

## Costs & Billing

### Alpha Deployment Costs (Starter Plan)

```
PostgreSQL Database:   $7/month
- 256 MB RAM
- 1 GB SSD storage
- Daily automatic backups

Web Service:           $7/month
- 512 MB RAM
- Always-on (no sleep)
- Automatic SSL
- Unlimited bandwidth

Total:                 $14/month
```

### Free Tier (Testing Only)

```
PostgreSQL Database:   Free
- 256 MB RAM
- 1 GB SSD storage
- No automatic backups

Web Service:           Free
- 512 MB RAM
- Sleeps after 15 min inactivity
- 750 hours/month free

Total:                 $0/month
```

**Recommendation:** Use Free tier for testing, Starter for alpha deployment.

---

## Next Steps After Deployment

### Immediate (This Week)

1. ✅ Verify all endpoints working
2. ✅ Test database operations (create, read, update)
3. ✅ Monitor logs for errors
4. 📋 Share app URL with stakeholders
5. 📋 Gather initial feedback

### Short-term (Next 2 Weeks)

1. 📋 Implement authentication (NextAuth.js)
2. 📋 Add rate limiting
3. 📋 Set up error tracking (Sentry)
4. 📋 Create user documentation
5. 📋 Plan beta feature additions

### Medium-term (Next Month)

1. 📋 Add ICEHUB integrations
2. 📋 Implement audit logging
3. 📋 Add automated tests
4. 📋 Set up CI/CD pipeline
5. 📋 Prepare for beta release

---

## Support & Resources

### Render Resources
- **Documentation:** https://render.com/docs
- **Status Page:** https://status.render.com
- **Support:** https://render.com/support
- **Community:** https://community.render.com

### Project Resources
- **Security Audit:** See `SECURITY_AUDIT.md`
- **Environment Template:** See `PRODUCTION.env.template`
- **Deployment Checklist:** See `DEPLOYMENT_CHECKLIST.md`

### Emergency Contacts
- **Render Support:** support@render.com
- **Security Issues:** security@render.com

---

## Deployment Completion Checklist

Use this to verify your deployment is complete:

```
Pre-Deployment:
✅ Code committed and pushed to GitHub
✅ render.yaml created (if using Method A)
✅ Secrets generated (NEXTAUTH_SECRET)
✅ Documentation reviewed

Deployment:
✅ PostgreSQL database created
✅ Web service created
✅ DATABASE_URL configured
✅ NEXTAUTH_SECRET set
✅ NODE_ENV=production
✅ First deployment successful

Verification:
✅ Health check passes
✅ Database connected
✅ API endpoints respond
✅ Web interface loads
✅ No errors in logs

Post-Deployment:
✅ Monitoring configured
✅ Stakeholders notified
✅ Documentation updated
✅ Backup plan verified

Security:
✅ HTTPS enabled (auto)
✅ No secrets in code
✅ Database encrypted
✅ Non-root container
✅ Security audit completed
```

---

## Success Criteria

**Your deployment is successful when:**

✅ Health endpoint returns `{"status":"healthy","database":"connected"}`
✅ All API endpoints return valid JSON (even if empty)
✅ Web interface loads without errors
✅ Database migrations completed successfully
✅ No critical errors in Render logs
✅ Application responds in < 2 seconds
✅ SSL certificate active (https://)

---

**Congratulations! Your ICE FLEET application is now live on Render! 🚀**

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** 2025-10-18
**Next Review:** Before Beta Release
