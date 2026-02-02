# Docker Deployment Guide for compro.uz

Complete guide for deploying the Commercial Real Estate Platform using Docker instead of PM2.

---

## 🐳 Why Docker?

**Advantages over PM2:**
- ✅ Isolated environments
- ✅ Easier dependency management
- ✅ Consistent across dev/staging/production
- ✅ Built-in health checks
- ✅ Simpler scaling
- ✅ Better resource management
- ✅ Industry standard

---

## 📋 Prerequisites

- Ubuntu 20.04+ server
- Root or sudo access
- Domain: compro.uz (DNS configured)
- 2GB+ RAM, 2+ CPU cores
- 20GB+ disk space

---

## 🚀 Quick Start

### On Server:

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clone project
sudo mkdir -p /opt/compro
sudo chown -R $USER:$USER /opt/compro
cd /opt/compro
git clone YOUR-REPO .

# 4. Configure environment
cp .env.production .env
nano .env  # Edit with your values

# 5. Setup SSL
sudo bash scripts/setup-ssl.sh

# 6. Configure Nginx
sudo cp nginx/compro.uz.conf /etc/nginx/sites-available/compro.uz
sudo ln -s /etc/nginx/sites-available/compro.uz /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 7. Deploy with Docker
chmod +x scripts/deploy-docker.sh
bash scripts/deploy-docker.sh
```

---

## 📖 Detailed Setup

### Step 1: Install Docker

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
exit
# SSH back in

# Verify installation
docker --version
docker run hello-world
```

### Step 2: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

**Alternative (Docker Compose V2):**
```bash
# Docker Compose V2 comes with Docker Desktop
# Check if available
docker compose version

# If available, use 'docker compose' instead of 'docker-compose'
```

### Step 3: Install Nginx (for SSL termination)

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 4: Clone Project

```bash
# Create directory
sudo mkdir -p /opt/compro
sudo chown -R $USER:$USER /opt/compro

# Clone repository
cd /opt/compro
git clone YOUR-REPO-URL .

# Verify files
ls -la
```

### Step 5: Configure Environment

```bash
# Copy production template
cp .env.production .env

# Edit environment file
nano .env
```

**Update these values:**
```bash
# Database
DATABASE_URL="postgresql://prod_user:YOUR_PASSWORD@postgres:5432/realestate_prod?schema=public"
DATABASE_NAME=realestate_prod
DATABASE_USER=prod_user
DATABASE_PASSWORD=YOUR_STRONG_PASSWORD

# JWT
JWT_SECRET=YOUR_SUPER_SECRET_KEY_MIN_32_CHARS

# Domain
DOMAIN=compro.uz
NEXT_PUBLIC_API_URL=https://api.compro.uz
FRONTEND_URL=https://compro.uz
DASHBOARD_URL=https://dashboard.compro.uz

# API Keys (add when available)
SMS_API_KEY=your-sms-api-key
PAYME_MERCHANT_ID=your-payme-id
CLICK_MERCHANT_ID=your-click-id
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### Step 6: Setup SSL Certificates

```bash
# Make script executable
chmod +x scripts/setup-ssl.sh

# Run SSL setup
sudo bash scripts/setup-ssl.sh
```

### Step 7: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx/compro.uz.conf /etc/nginx/sites-available/compro.uz

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/compro.uz /etc/nginx/sites-enabled/compro.uz

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Deploy with Docker

```bash
# Make deployment script executable
chmod +x scripts/deploy-docker.sh

# Run deployment
bash scripts/deploy-docker.sh
```

---

## 🔧 Docker Commands

### View Running Containers
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All containers
docker-compose -f docker-compose.prod.yml logs -f

# Specific container
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f dashboard
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Restart Containers
```bash
# All containers
docker-compose -f docker-compose.prod.yml restart

# Specific container
docker-compose -f docker-compose.prod.yml restart backend
```

### Stop Containers
```bash
docker-compose -f docker-compose.prod.yml down
```

### Start Containers
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Rebuild and Restart
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Execute Commands in Container
```bash
# Access backend container shell
docker-compose -f docker-compose.prod.yml exec backend sh

# Run Prisma migrations
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:migrate

# Access database
docker-compose -f docker-compose.prod.yml exec postgres psql -U prod_user -d realestate_prod
```

### View Container Stats
```bash
docker stats
```

### Clean Up
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a
```

---

## 🔄 Updating Your Application

### Method 1: Using Deployment Script (Recommended)
```bash
cd /opt/compro
bash scripts/deploy-docker.sh
```

### Method 2: Manual Update
```bash
cd /opt/compro

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
```

---

## 🗄️ Database Management

### Backup Database
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U prod_user realestate_prod > backup_$(date +%Y%m%d).sql

# Or with docker exec
docker exec compro-db-prod pg_dump -U prod_user realestate_prod > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
# Restore from backup
cat backup_20260202.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U prod_user realestate_prod
```

### Access Database
```bash
# Using docker-compose
docker-compose -f docker-compose.prod.yml exec postgres psql -U prod_user -d realestate_prod

# Using docker directly
docker exec -it compro-db-prod psql -U prod_user -d realestate_prod
```

---

## 📊 Monitoring

### Check Container Health
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Resource Usage
```bash
docker stats
```

### Check Logs for Errors
```bash
# Backend errors
docker-compose -f docker-compose.prod.yml logs backend | grep -i error

# All errors
docker-compose -f docker-compose.prod.yml logs | grep -i error
```

---

## 🆘 Troubleshooting

### Containers Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check specific container
docker-compose -f docker-compose.prod.yml logs backend

# Rebuild from scratch
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database Connection Issues

```bash
# Check if postgres is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check postgres logs
docker-compose -f docker-compose.prod.yml logs postgres

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### Port Already in Use

```bash
# Check what's using the port
sudo netstat -tulpn | grep :3001

# Stop the conflicting service
sudo systemctl stop pm2-$USER  # If PM2 is still running
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove old images
docker image prune -a
```

### Container Keeps Restarting

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs --tail=100 backend

# Check health status
docker inspect compro-backend-prod | grep -A 10 Health
```

---

## 🔐 Security Best Practices

### 1. Use Strong Passwords
```bash
# Generate strong password
openssl rand -base64 32
```

### 2. Limit Container Resources
Add to docker-compose.prod.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 3. Run as Non-Root User
Already configured in Dockerfiles.

### 4. Keep Images Updated
```bash
# Pull latest base images
docker-compose -f docker-compose.prod.yml pull

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

### 5. Use Docker Secrets (Advanced)
For sensitive data, consider using Docker secrets or external secret management.

---

## 📈 Scaling

### Scale Backend Service
```bash
# Scale to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Note: You'll need to configure load balancing in Nginx
```

---

## 🔄 CI/CD with Docker

Update `.github/workflows/deploy.yml`:

```yaml
name: Deploy to compro.uz

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/compro
            git pull origin main
            bash scripts/deploy-docker.sh
      
      - name: Notify on success
        if: success()
        run: |
          echo "✅ Docker deployment to compro.uz completed!"
          echo "🌐 Site: https://compro.uz"
```

---

## 📊 Comparison: Docker vs PM2

| Feature | Docker | PM2 |
|---------|--------|-----|
| **Isolation** | ✅ Full isolation | ❌ Shared environment |
| **Dependencies** | ✅ Containerized | ❌ System-wide |
| **Scaling** | ✅ Easy | ⚠️ Manual |
| **Health Checks** | ✅ Built-in | ⚠️ Basic |
| **Resource Limits** | ✅ Configurable | ⚠️ Limited |
| **Rollback** | ✅ Easy | ⚠️ Manual |
| **Learning Curve** | ⚠️ Moderate | ✅ Easy |
| **Memory Usage** | ⚠️ Higher | ✅ Lower |

---

## ✅ Deployment Checklist

- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Nginx installed
- [ ] DNS configured
- [ ] Project cloned to `/opt/compro`
- [ ] `.env` file configured
- [ ] SSL certificates obtained
- [ ] Nginx configured
- [ ] Containers built and running
- [ ] All URLs accessible via HTTPS
- [ ] Database migrations completed
- [ ] Health checks passing

---

## 🎯 Quick Commands Reference

```bash
# Deploy
bash scripts/deploy-docker.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart all
docker-compose -f docker-compose.prod.yml restart

# Stop all
docker-compose -f docker-compose.prod.yml down

# Rebuild all
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# Access backend shell
docker-compose -f docker-compose.prod.yml exec backend sh

# Database backup
docker exec compro-db-prod pg_dump -U prod_user realestate_prod > backup.sql
```

---

## 🌐 Your Application URLs

- **Frontend:** https://compro.uz
- **API:** https://api.compro.uz
- **API Docs:** https://api.compro.uz/api/docs
- **Dashboard:** https://dashboard.compro.uz

---

**Docker deployment configured! 🐳**
