# Railway Deployment Guide

## Quick Setup (5 minutes)

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

### 3. Add PostgreSQL Database
- Click "New Service" → "Database" → "PostgreSQL"
- Railway will auto-generate the DATABASE_URL

### 4. Set Environment Variables
- Go to your app service
- Add environment variable: `DATABASE_URL`
- Copy the value from your PostgreSQL service

### 5. Deploy
- Railway will automatically deploy when you push to GitHub
- Your app will be available at the provided URL

## What Happens on Deploy
- Railway runs: `npm install --legacy-peer-deps && npx prisma generate && npx prisma migrate deploy && npm run build`
- Starts with: `npm start`
- Health check at: `/`

## Database Migration
- Prisma will automatically create all tables on first deploy
- Your existing seed data can be run after deployment

## Cost
- Free tier available
- $5/month after free tier
- Database included
