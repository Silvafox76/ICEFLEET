# ICE FLEET - Docker Deployment Guide

**Date:** 2025-10-13
**Version:** 1.0.0
**Status:** Ready for Deployment

---

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- 10GB disk space

---

## 🚀 Quick Start

### 1. Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd ICEFLEET

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Start Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Check status
docker-compose ps
```

### 3. Initialize Database

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database (optional - for testing)
docker-compose exec app npx tsx scripts/seed.ts
```

### 4. Access Application

- **Application:** http://localhost:3000
- **API Health:** http://localhost:3000/api/health
- **Database:** localhost:5432

---

## 🔧 Configuration

### Environment Variables

#### Required
```env
# Database
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://postgres:your_password@postgres:5432/icefleet

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=ICE FLEET
```

#### Optional
```env
# ICEHUB Integration
ICE_CRM_API_URL=http://ice-crm:3001/api
ICE_CRM_API_KEY=your_api_key

# Third-party Services
MAPBOX_API_KEY=your_mapbox_key
SENTRY_DSN=your_sentry_dsn
```

### Port Configuration

Change the application port by setting `PORT` in `.env`:
```env
PORT=8080
```

Then update `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"
```

---

## 🏗️ Architecture

### Services

#### 1. PostgreSQL Database
- **Image:** postgres:16-alpine
- **Port:** 5432
- **Volume:** `postgres_data`
- **Health Check:** Enabled

#### 2. ICE FLEET Application
- **Build:** Multi-stage Dockerfile
- **Port:** 3000
- **Dependencies:** PostgreSQL
- **Health Check:** Enabled

### Volumes
- `postgres_data`: Database persistence
- `app_uploads`: File uploads storage

### Network
- **Name:** icefleet-network
- **Driver:** bridge

---

## 📦 Docker Commands

### Start/Stop
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Database Operations
```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Reset database
docker-compose exec app npx prisma migrate reset

# Seed database
docker-compose exec app npx tsx scripts/seed.ts

# Access database
docker-compose exec postgres psql -U postgres -d icefleet
```

### Application Management
```bash
# Restart application
docker-compose restart app

# Rebuild application
docker-compose up -d --build app

# Execute commands in container
docker-compose exec app sh

# View environment variables
docker-compose exec app env
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
```bash
# Generate secure password
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

### 2. Database Security
- Change default PostgreSQL password
- Use strong passwords (min 16 characters)
- Restrict database access to application only
- Enable SSL for production

### 3. Application Security
- Set `NODE_ENV=production`
- Use environment variables for secrets
- Enable HTTPS in production
- Configure CORS appropriately

---

## 📊 Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Database health
docker-compose exec postgres pg_isready -U postgres
```

### Resource Usage

```bash
# View resource usage
docker stats

# View container details
docker-compose top
```

---

## 🐛 Troubleshooting

### Application Won't Start

1. Check logs:
```bash
docker-compose logs app
```

2. Verify database connection:
```bash
docker-compose exec app npx prisma db pull
```

3. Check environment variables:
```bash
docker-compose exec app env | grep DATABASE
```

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
docker-compose ps postgres
```

2. Check database logs:
```bash
docker-compose logs postgres
```

3. Test connection:
```bash
docker-compose exec postgres psql -U postgres -d icefleet -c "SELECT 1;"
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Change port in docker-compose.yml
ports:
  - "3001:3000"
```

---

## 🚀 Production Deployment

### 1. Cloud Hosting Options

#### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option B: DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### Option C: AWS ECS/Fargate
1. Push image to ECR
2. Create ECS task definition
3. Configure load balancer
4. Deploy service

### 2. Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database (RDS, Neon, Supabase)
- [ ] Set strong passwords and secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CDN (CloudFlare, AWS CloudFront)
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure backups
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and DNS
- [ ] Enable logging

---

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build app
```

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres icefleet > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres icefleet < backup.sql
```

### Scale Services

```bash
# Scale application (load balancing)
docker-compose up -d --scale app=3
```

---

## 📞 Support

### Logs Location
- Application: `docker-compose logs app`
- Database: `docker-compose logs postgres`

### Common Issues
1. **Port conflicts:** Change port in docker-compose.yml
2. **Database migration errors:** Run `npx prisma migrate reset`
3. **Build failures:** Clear Docker cache: `docker system prune -a`

---

## 📚 Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** 2025-10-13
**Status:** Production Ready
