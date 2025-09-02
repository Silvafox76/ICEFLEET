# ICE Fleet Platform - Deployment Guide

## 🚀 Quick Start (Local Development)

```bash
# 1. Navigate to app directory
cd app

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Generate Prisma client
npx prisma generate

# 4. Start development server
npm run dev
```

Access at: **http://localhost:3000**

## 🌐 Production Deployment

### Option 1: Deploy to Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project in app directory
   cd app
   railway init
   ```

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "+ New"
   - Select "PostgreSQL"
   - Copy the DATABASE_URL

4. **Configure Environment**
   ```bash
   # Set environment variables
   railway variables set DATABASE_URL="your-postgres-url"
   railway variables set NODE_ENV="production"
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create Database (Vercel Postgres or Supabase)**
   - Go to Vercel Dashboard
   - Add Vercel Postgres OR
   - Use [Supabase](https://supabase.com) for free PostgreSQL

3. **Deploy**
   ```bash
   cd app
   vercel
   
   # Follow prompts and set environment variables:
   # DATABASE_URL = your-postgres-connection-string
   ```

### Option 3: Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)

2. **Create PostgreSQL Database**
   - New > PostgreSQL
   - Copy Internal Database URL

3. **Create Web Service**
   - New > Web Service
   - Connect GitHub repo
   - Build Command: `npm install --legacy-peer-deps && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Start Command: `npm start`

## 📦 Environment Variables

Create `.env.production` file:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

## 🗄️ Database Setup

### Initial Migration
```bash
# Create migration
npx prisma migrate dev --name init

# Deploy migration (production)
npx prisma migrate deploy

# Seed database with sample data
npx prisma db seed
```

### Database Providers

#### Railway PostgreSQL (Recommended)
- Automatic backups
- Easy scaling
- $5/month for starter

#### Supabase (Free Tier)
- 500MB storage
- Perfect for testing
- Free forever tier

#### Neon (Serverless PostgreSQL)
- Pay per use
- Auto-scaling
- Free tier available

## 🔧 Configuration Files

### `railway.json` (Already configured)
- Build and deploy settings for Railway
- Health checks configured
- Auto-restart on failure

### `vercel.json` (Already configured)
- Build settings for Vercel
- Environment variable mapping
- Next.js optimizations

### `package.json` Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:migrate": "prisma migrate deploy"
  }
}
```

## 🎯 Post-Deployment Checklist

- [ ] Database connected and migrated
- [ ] Environment variables set
- [ ] SSL certificate active
- [ ] Health check passing
- [ ] Mock data working (fallback)
- [ ] All pages loading
- [ ] API endpoints responding

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

### Build Failures
```bash
# Clear cache
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

### Missing Prisma Client
```bash
npx prisma generate
```

## 📱 Features Working Without Database

The app includes mock data fallback, so these features work even without a database:
- Vehicle/Trailer listings
- Compatibility Explorer
- Dashboard statistics
- Compliance alerts
- Basic navigation

## 🔗 Quick Deploy Links

- **Railway**: [Deploy on Railway](https://railway.app/new/template)
- **Vercel**: [Deploy with Vercel](https://vercel.com/new)
- **Render**: [Deploy to Render](https://render.com)

## 📧 Support

For deployment issues:
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Database: Check Prisma logs with `npx prisma studio`

---

**Note**: The application is configured to work with mock data if no database is available, ensuring functionality during setup and testing.