# Docker with Nginx Guide

## 🐳 Nginx Inside Docker

Your application now runs **completely inside Docker**, including Nginx for SSL termination and reverse proxy.

---

## 🏗️ Architecture

```
Internet
    ↓
[Port 80/443] → Nginx Container (compro-nginx-prod)
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
Frontend        Backend         Dashboard
Container       Container       Container
(port 3000)     (port 3001)     (port 80)
    ↓               ↓
              PostgreSQL
              Container
```

---

## 📦 Docker Services

### 1. **nginx** (NEW!)
- **Image:** `nginx:alpine`
- **Ports:** 80, 443 (exposed to host)
- **Purpose:** SSL termination, reverse proxy, static file serving
- **Config:** `nginx/nginx.conf` + `nginx/conf.d/compro.conf`

### 2. **backend**
- **Port:** 3001 (internal only)
- **Accessible via:** Nginx → `http://compro-backend-prod:3001`

### 3. **frontend**
- **Port:** 3000 (internal only)
- **Accessible via:** Nginx → `http://compro-frontend-prod:3000`

### 4. **dashboard**
- **Port:** 80 (internal only)
- **Accessible via:** Nginx → `http://compro-dashboard-prod:80`

### 5. **postgres**
- **Port:** 5432 (internal only)

---

## 🚀 Deployment Steps

### 1. Setup SSL Certificates (One-Time)

SSL certificates are still managed on the host system and mounted into the Nginx container.

```bash
# Install certbot on host
sudo apt install -y certbot

# Get SSL certificates
sudo certbot certonly --standalone -d compro.uz -d www.compro.uz -d api.compro.uz -d dashboard.compro.uz --email admin@compro.uz --agree-tos

# Certificates will be at:
# /etc/letsencrypt/live/compro.uz/fullchain.pem
# /etc/letsencrypt/live/compro.uz/privkey.pem

# Create symlinks for easier access
sudo ln -s /etc/letsencrypt/live/compro.uz/fullchain.pem /etc/ssl/certs/compro.uz.crt
sudo ln -s /etc/letsencrypt/live/compro.uz/privkey.pem /etc/ssl/private/compro.uz.key
sudo ln -s /etc/letsencrypt/live/compro.uz/chain.pem /etc/ssl/certs/ca-bundle.crt
```

### 2. Deploy with Docker

```bash
cd /opt/compro

# Configure environment
cp .env.production .env
nano .env  # Edit with your values

# Deploy all services (including Nginx)
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔧 Configuration Files

### Docker Compose (`docker-compose.prod.yml`)
```yaml
nginx:
  image: nginx:alpine
  container_name: compro-nginx-prod
  restart: always
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/conf.d:/etc/nginx/conf.d:ro
    - /etc/ssl/certs:/etc/ssl/certs:ro
    - /etc/ssl/private:/etc/ssl/private:ro
    - ./uploads:/var/www/uploads:ro
```

### Nginx Main Config (`nginx/nginx.conf`)
- Worker processes
- Gzip compression
- MIME types
- Includes site configs

### Site Config (`nginx/conf.d/compro.conf`)
- HTTP to HTTPS redirect
- SSL configuration
- Reverse proxy to containers
- Rate limiting
- Security headers

---

## 📝 Key Differences from Host Nginx

| Aspect | Host Nginx | Docker Nginx |
|--------|-----------|--------------|
| **Installation** | `apt install nginx` | Docker image |
| **Config Location** | `/etc/nginx/` | `./nginx/` (mounted) |
| **SSL Certs** | `/etc/ssl/` | Mounted from host |
| **Upstream** | `localhost:3001` | `compro-backend-prod:3001` |
| **Management** | `systemctl` | `docker-compose` |
| **Logs** | `/var/log/nginx/` | Container logs |

---

## 🎯 Advantages of Dockerized Nginx

### ✅ Benefits:
1. **Complete Isolation** - Everything in Docker
2. **Easy Deployment** - Single `docker-compose up`
3. **Portability** - Works anywhere Docker runs
4. **Version Control** - Nginx config in Git
5. **Easy Rollback** - Just redeploy previous version
6. **No Host Dependencies** - No need to install Nginx on host
7. **Consistent Environment** - Same setup everywhere

### ⚠️ Considerations:
1. **SSL Renewal** - Still done on host (certbot)
2. **Port 80/443** - Must be available on host
3. **SSL Certs** - Mounted from host filesystem

---

## 🔄 Common Commands

### View Nginx Logs
```bash
# All Nginx logs
docker-compose -f docker-compose.prod.yml logs -f nginx

# Access logs only
docker logs compro-nginx-prod 2>&1 | grep "GET\|POST"

# Error logs only
docker logs compro-nginx-prod 2>&1 | grep "error"
```

### Reload Nginx Configuration
```bash
# Test configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Reload Nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Or restart container
docker-compose -f docker-compose.prod.yml restart nginx
```

### Update Nginx Configuration
```bash
# Edit config files
nano nginx/conf.d/compro.conf

# Test configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Reload
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Access Nginx Container
```bash
# Shell access
docker-compose -f docker-compose.prod.yml exec nginx sh

# Check running processes
docker-compose -f docker-compose.prod.yml exec nginx ps aux

# Check listening ports
docker-compose -f docker-compose.prod.yml exec nginx netstat -tulpn
```

---

## 🔐 SSL Certificate Renewal

SSL certificates are still managed on the host and mounted into the container.

### Manual Renewal
```bash
# Stop Nginx container (to free port 80)
docker-compose -f docker-compose.prod.yml stop nginx

# Renew certificates
sudo certbot renew

# Start Nginx container
docker-compose -f docker-compose.prod.yml start nginx
```

### Automatic Renewal (Recommended)
```bash
# Create renewal script
sudo nano /opt/scripts/renew-ssl.sh
```

```bash
#!/bin/bash
cd /opt/compro
docker-compose -f docker-compose.prod.yml stop nginx
certbot renew --quiet
docker-compose -f docker-compose.prod.yml start nginx
```

```bash
# Make executable
sudo chmod +x /opt/scripts/renew-ssl.sh

# Add to crontab
sudo crontab -e

# Add this line (runs monthly)
0 3 1 * * /opt/scripts/renew-ssl.sh
```

---

## 🆘 Troubleshooting

### Nginx Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs nginx

# Common issues:
# 1. Port 80/443 already in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# 2. SSL certificate files not found
ls -la /etc/ssl/certs/compro.uz.crt
ls -la /etc/ssl/private/compro.uz.key

# 3. Configuration syntax error
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### 502 Bad Gateway

```bash
# Check if backend services are running
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Check Nginx can reach backend
docker-compose -f docker-compose.prod.yml exec nginx ping compro-backend-prod
```

### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /etc/ssl/certs/compro.uz.crt -noout -dates

# Check certificate inside container
docker-compose -f docker-compose.prod.yml exec nginx ls -la /etc/ssl/certs/
docker-compose -f docker-compose.prod.yml exec nginx ls -la /etc/ssl/private/
```

### Configuration Not Updating

```bash
# Ensure you're editing the right file
ls -la nginx/conf.d/compro.conf

# Test configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Reload (not restart)
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# If reload doesn't work, restart
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 📊 Monitoring

### Check Nginx Status
```bash
# Container status
docker-compose -f docker-compose.prod.yml ps nginx

# Health check
docker inspect compro-nginx-prod | grep -A 10 Health

# Resource usage
docker stats compro-nginx-prod
```

### View Access Logs
```bash
# Real-time access logs
docker-compose -f docker-compose.prod.yml logs -f nginx | grep "GET\|POST"

# Last 100 requests
docker-compose -f docker-compose.prod.yml logs --tail=100 nginx
```

### Check Upstream Health
```bash
# Test backend
docker-compose -f docker-compose.prod.yml exec nginx wget -qO- http://compro-backend-prod:3001/api

# Test frontend
docker-compose -f docker-compose.prod.yml exec nginx wget -qO- http://compro-frontend-prod:3000

# Test dashboard
docker-compose -f docker-compose.prod.yml exec nginx wget -qO- http://compro-dashboard-prod:80
```

---

## 🔄 Updating Deployment

### Update Application Code
```bash
cd /opt/compro

# Pull latest code
git pull origin main

# Rebuild and restart all services
docker-compose -f docker-compose.prod.yml up -d --build

# Nginx will automatically reload
```

### Update Only Nginx Config
```bash
# Edit config
nano nginx/conf.d/compro.conf

# Test
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Reload
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## 🌐 URLs

All URLs work the same as before:

- **Frontend:** https://compro.uz
- **API:** https://api.compro.uz
- **API Docs:** https://api.compro.uz/api/docs
- **Dashboard:** https://dashboard.compro.uz

---

## ✅ Deployment Checklist

- [ ] SSL certificates obtained and symlinked
- [ ] Docker and Docker Compose installed
- [ ] Project cloned to `/opt/compro`
- [ ] `.env` file configured
- [ ] Nginx config files in place (`nginx/nginx.conf`, `nginx/conf.d/compro.conf`)
- [ ] All containers running (`docker-compose ps`)
- [ ] Nginx health check passing
- [ ] All URLs accessible via HTTPS
- [ ] SSL certificates valid
- [ ] Auto-renewal configured

---

## 📋 Quick Reference

```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d --build

# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View Nginx logs only
docker-compose -f docker-compose.prod.yml logs -f nginx

# Reload Nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Restart Nginx
docker-compose -f docker-compose.prod.yml restart nginx

# Check status
docker-compose -f docker-compose.prod.yml ps

# Stop all
docker-compose -f docker-compose.prod.yml down

# Renew SSL (manual)
docker-compose -f docker-compose.prod.yml stop nginx
sudo certbot renew
docker-compose -f docker-compose.prod.yml start nginx
```

---

**Nginx now runs inside Docker! Complete containerization achieved! 🐳**
