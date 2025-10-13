# ICE FLEET - Alpha Deployment Guide (Railway)

**Target:** Production-ready alpha testing environment
**Platform:** Railway.app (Recommended)
**Time to Deploy:** ~15 minutes
**Cost:** $5-10/month during alpha

---

## 🎯 Why Railway?

✅ **Zero configuration** - Detects Next.js automatically
✅ **Free PostgreSQL** - Included with deployment
✅ **Automatic HTTPS** - SSL certificates managed
✅ **GitHub integration** - Deploy on every push
✅ **Environment variables** - Easy management
✅ **Logs & monitoring** - Built-in dashboard
✅ **No credit card** - $5 free trial credit

---

## 📋 Prerequisites

- GitHub account (free)
- Railway account (free - sign up with GitHub)
- 15 minutes

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Repository (5 minutes)

#### 1.1 Initialize Git (if not already done)
```bash
cd C:\Users\rdear\ICEFLEET
git init
git add .
git commit -m "Initial commit - ICE FLEET v1.0"
```

#### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `icefleet`
3. Description: `ICE FLEET Management System - Alpha`
4. Visibility: Private (recommended for alpha)
5. Click "Create repository"

#### 1.3 Push to GitHub
```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/icefleet.git

# Push code
git branch -M main
git push -u origin main
```

---

### Step 2: Set Up Railway (3 minutes)

#### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

#### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `icefleet` repository
4. Railway will detect Next.js automatically ✅

---

### Step 3: Add PostgreSQL Database (2 minutes)

#### 3.1 Add Database Service
1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will provision a PostgreSQL instance
4. Database URL will be automatically set as `DATABASE_URL`

#### 3.2 Verify Database Connection
Railway automatically sets the `DATABASE_URL` environment variable for your app.

---

### Step 4: Configure Environment Variables (3 minutes)

#### 4.1 Set Required Variables
In Railway dashboard → Your App → "Variables" tab:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=ICE FLEET

# NextAuth (optional for now)
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_HERE
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# The DATABASE_URL is automatically set by Railway
```

#### 4.2 Generate NextAuth Secret
```bash
openssl rand -base64 32
```
Copy the output and paste as `NEXTAUTH_SECRET` value.

---

### Step 5: Deploy Application (2 minutes)

#### 5.1 Trigger Deployment
Railway automatically deploys when you:
- Push to GitHub (automatic)
- Click "Deploy" in Railway dashboard (manual)

#### 5.2 Monitor Deployment
1. Go to "Deployments" tab
2. Watch build logs in real-time
3. Deployment takes ~3-5 minutes

#### 5.3 Build Process
Railway will automatically:
1. ✅ Install dependencies (`npm install`)
2. ✅ Generate Prisma Client (`npx prisma generate`)
3. ✅ Build Next.js (`npm run build`)
4. ✅ Start production server (`npm start`)

---

### Step 6: Run Database Migrations (2 minutes)

#### 6.1 Access Railway CLI
Install Railway CLI:
```bash
npm install -g @railway/cli
```

#### 6.2 Login to Railway
```bash
railway login
```

#### 6.3 Link to Your Project
```bash
railway link
```
Select your `icefleet` project.

#### 6.4 Run Migrations
```bash
railway run npx prisma migrate deploy
```

#### 6.5 Seed Database (Optional - for alpha testing)
```bash
railway run npx tsx app/scripts/seed.ts
```

---

### Step 7: Access Your Application (1 minute)

#### 7.1 Get Your URL
1. In Railway dashboard → Your app
2. Click "Settings" → "Generate Domain"
3. Your app will be available at: `https://icefleet-production.up.railway.app`

#### 7.2 Verify Deployment
Visit your URL and check:
- ✅ Homepage loads
- ✅ API endpoints work: `/api/fleet/vehicles`
- ✅ Dashboard displays data: `/dashboard`

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

#### Add Your Domain
1. Railway → Settings → Domains
2. Click "Custom Domain"
3. Enter: `fleet.icehub.ca` (or your domain)
4. Add DNS records as shown:
   ```
   Type: CNAME
   Name: fleet
   Value: your-app.up.railway.app
   ```

### Environment-Specific Settings

```env
# For alpha testing, add these:
NEXT_PUBLIC_ENVIRONMENT=alpha
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app

# For ICEHUB integration (when ready):
ICE_CRM_API_URL=https://crm.icehub.ca/api
ICE_CRM_API_KEY=your_api_key_here
```

---

## 📊 Monitoring & Maintenance

### View Logs
```bash
# Real-time logs
railway logs

# Or in Railway dashboard → Logs tab
```

### Restart Application
```bash
railway restart
```

### Redeploy
```bash
# Just push to GitHub:
git add .
git commit -m "Update feature X"
git push origin main
# Railway auto-deploys
```

### Database Backup
```bash
# Export database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore database
railway run psql $DATABASE_URL < backup.sql
```

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
1. Railway logs for error messages
2. Ensure all dependencies are in `package.json`
3. Verify build command in Railway settings

**Fix:**
```bash
# Test build locally first:
cd app
npm run build
```

### Database Connection Errors

**Check:**
1. `DATABASE_URL` is set automatically by Railway
2. Migrations were run: `railway run npx prisma migrate deploy`

**Fix:**
```bash
# Verify database connection
railway run npx prisma db pull
```

### Application Won't Start

**Check:**
1. `PORT` environment variable (Railway sets this automatically)
2. Build completed successfully
3. Dependencies installed correctly

**Fix:**
```bash
# Check deployment logs
railway logs
```

### Prisma Client Generation Issues

**Fix - Add to package.json:**
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 💰 Cost Breakdown

### Railway Pricing (Alpha Phase)
- **Starter Plan:** $5/month
  - 500 hours of usage
  - 8GB RAM
  - 100GB bandwidth
  - PostgreSQL included

### Expected Monthly Cost
- **Development:** Free (trial credits)
- **Alpha Testing:** $5-10/month
- **Production:** $20-50/month (scales with usage)

---

## 🔐 Security Checklist

### Pre-Launch
- [x] Environment variables configured
- [x] Database password secured (Railway auto-generates)
- [x] HTTPS enabled (automatic)
- [ ] CORS configured (if needed for ICEHUB)
- [ ] Rate limiting (add if needed)
- [ ] Security headers (add if needed)

### Post-Launch
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure backups
- [ ] Review access logs

---

## 📈 Scaling for Production

When moving from alpha to production:

### 1. Upgrade Railway Plan
- **Pro Plan:** $20/month base + usage
- Vertical scaling: More RAM/CPU
- Horizontal scaling: Multiple instances

### 2. Add Monitoring
```bash
# Add Sentry for error tracking
npm install @sentry/nextjs
```

### 3. Add Caching
- Redis for session storage
- CDN for static assets (Cloudflare)

### 4. Optimize Database
- Connection pooling
- Query optimization
- Indexes on frequently queried fields

---

## 🎯 Success Metrics

### Alpha Testing Goals
- ✅ Application accessible 24/7
- ✅ Response times < 500ms
- ✅ Zero critical errors
- ✅ Database backups automated
- ✅ 99% uptime

### Monitor These
- API response times
- Error rates
- Database query performance
- User feedback

---

## 🚀 Alternative Deployment Options

If Railway doesn't work for you:

### Option 2: Vercel (Next.js Optimized)
```bash
npm install -g vercel
vercel login
vercel
```
**Pros:** Best for Next.js, free tier generous
**Cons:** Need separate database (Neon, Supabase)

### Option 3: Render.com
Similar to Railway, slightly more configuration
**Cost:** $7/month minimum

### Option 4: DigitalOcean App Platform
More control, Docker-based
**Cost:** $12/month minimum

---

## 📞 Support Resources

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### ICE FLEET
- GitHub Issues: Track bugs and features
- Documentation: `/docs` folder
- Logs: Railway dashboard

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Environment variables prepared

### Deployment
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] Migrations run
- [ ] Seed data loaded (optional)

### Post-Deployment
- [ ] Application accessible at public URL
- [ ] API endpoints tested
- [ ] Dashboard functioning
- [ ] Logs monitored
- [ ] Backups configured

### Alpha Testing
- [ ] Test users invited
- [ ] Feedback mechanism set up
- [ ] Error monitoring active
- [ ] Performance baselines established

---

## 🎉 You're Live!

Once deployed, your alpha testers can access:
- **Application:** https://your-app.up.railway.app
- **Dashboard:** https://your-app.up.railway.app/dashboard
- **Fleet Management:** https://your-app.up.railway.app/fleet

Share this URL with your alpha testers and start collecting feedback!

---

**Deployment Guide Version:** 1.0.0
**Platform:** Railway.app
**Estimated Time:** 15 minutes
**Status:** Ready to Deploy
