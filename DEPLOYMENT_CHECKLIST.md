# ICE FLEET - Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment Checks

### 1. Code Quality
- [ ] All TypeScript errors resolved (`cd app && npx tsc --noEmit`)
- [ ] Linting passes (`cd app && npm run lint`)
- [ ] Production build successful (`cd app && npm run build`)

### 2. Environment Configuration
- [ ] `.env` file configured with production values
- [ ] `DATABASE_URL` points to production PostgreSQL
- [ ] `NEXTAUTH_SECRET` generated (32+ character random string)
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `NODE_ENV=production`

### 3. Database
- [ ] PostgreSQL database provisioned
- [ ] Database credentials secured
- [ ] Migrations ready (`npx prisma migrate deploy`)
- [ ] Seed data prepared (optional)

### 4. Git & GitHub
- [ ] All changes committed
- [ ] Pushed to GitHub (`git push origin main`)
- [ ] No uncommitted sensitive data (.env ignored)

### 5. Railway Configuration
- [ ] Railway account created
- [ ] Project linked to GitHub repository
- [ ] PostgreSQL service added
- [ ] Environment variables configured
- [ ] Health check endpoint verified (`/api/health`)

### 6. Testing
- [ ] Local testing complete
- [ ] API endpoints validated
- [ ] Database connection verified
- [ ] Health check working

## Deployment Steps

### Option A: Using Deployment Script (Recommended)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B: Manual Deployment

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Link Project:**
   ```bash
   railway link
   ```

4. **Run Migrations:**
   ```bash
   railway run npx prisma migrate deploy
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

### Option C: GitHub Auto-Deploy

Railway automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

## Post-Deployment Verification

### 1. Application Health
- [ ] Application accessible at production URL
- [ ] Health check passes: `https://your-app.railway.app/api/health`
- [ ] Response shows: `{"status":"healthy","database":"connected"}`

### 2. Database Verification
- [ ] Database migrations applied successfully
- [ ] Seed data loaded (if applicable)
- [ ] Tables created correctly

### 3. API Endpoints
Test each endpoint:
- [ ] `GET /api/fleet/vehicles` - Returns vehicle list
- [ ] `GET /api/fleet/trailers` - Returns trailer list
- [ ] `GET /api/dashboard/stats` - Returns dashboard stats
- [ ] `GET /api/compliance/alerts` - Returns compliance alerts
- [ ] `GET /api/compliance/renewals` - Returns renewal timeline
- [ ] `GET /api/compliance/status` - Returns compliance status
- [ ] `GET /api/compatibility` - Returns compatibility check

### 4. Frontend Pages
- [ ] Homepage loads (`/`)
- [ ] Fleet page works (`/fleet`)
- [ ] Drivers page works (`/drivers`)
- [ ] Compliance page works (`/compliance`)
- [ ] Maintenance page works (`/maintenance`)
- [ ] Compatibility checker works (`/compatibility`)

### 5. Monitoring
- [ ] Railway logs accessible
- [ ] No error logs in Railway dashboard
- [ ] Application metrics normal
- [ ] Response times acceptable (< 500ms)

## Rollback Plan

If deployment fails:

### 1. Quick Rollback (Railway)
```bash
# View deployments
railway status

# Rollback to previous deployment
railway rollback
```

### 2. Database Rollback
```bash
# If migrations fail, restore from backup
railway run psql $DATABASE_URL < backup.sql
```

### 3. Code Rollback (GitHub)
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Production Configuration

### Required Environment Variables
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=ICE FLEET

# Database (automatically set by Railway)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-app.railway.app

# Optional: ICEHUB Integration (when ready)
ICE_CRM_API_URL=https://crm.icehub.ca/api
ICE_CRM_API_KEY=your_api_key_here
```

### Generate NextAuth Secret
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Monitoring & Maintenance

### View Logs
```bash
railway logs
```

### Check Status
```bash
railway status
```

### Restart Application
```bash
railway restart
```

### Database Backup
```bash
# Export database
railway run pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore database
railway run psql $DATABASE_URL < backup_YYYYMMDD.sql
```

## Troubleshooting

### Build Fails
1. Check Railway logs for specific error
2. Verify all dependencies in package.json
3. Test build locally: `cd app && npm run build`
4. Check Node.js version compatibility

### Database Connection Issues
1. Verify DATABASE_URL is set in Railway
2. Check PostgreSQL service is running
3. Verify migrations ran successfully
4. Test connection: `railway run npx prisma db pull`

### Application Won't Start
1. Check Railway logs for startup errors
2. Verify PORT environment variable (Railway sets automatically)
3. Check health endpoint: `/api/health`
4. Verify standalone mode in next.config.js

### Slow Performance
1. Check Railway metrics dashboard
2. Review database query performance
3. Consider upgrading Railway plan
4. Implement caching if needed

## Success Criteria

Deployment is successful when:
- ✅ Application is accessible at production URL
- ✅ Health check endpoint returns healthy status
- ✅ All API endpoints respond correctly
- ✅ Database is connected and operational
- ✅ No critical errors in logs
- ✅ Response times are acceptable (< 500ms)
- ✅ All features work as expected

## Support

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Railway Status:** https://status.railway.app
- **Project Documentation:** `/docs/ALPHA_DEPLOYMENT_GUIDE.md`

---

**Last Updated:** 2025-10-13
**Version:** 1.0.0
