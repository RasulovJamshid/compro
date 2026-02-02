# Docker Setup Guide

This project uses Docker Compose to run all services in containers.

## Services

The application consists of 4 services:

1. **PostgreSQL Database** (port 5432)
2. **Backend API** (port 3001) - NestJS
3. **Frontend** (port 3000) - Next.js
4. **Dashboard** (port 3002) - React + Vite

## Quick Start

### Start all services

```bash
docker-compose up -d
```

### Stop all services

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f dashboard
docker-compose logs -f postgres
```

### Rebuild services

```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build dashboard
```

## Service Details

### Database (PostgreSQL)
- **Container**: `realestate-db`
- **Port**: 5432
- **Database**: realestate
- **User**: postgres
- **Password**: postgres
- **Volume**: `postgres_data` (persistent storage)

### Backend (NestJS)
- **Container**: `realestate-backend`
- **Port**: 3001
- **Build**: `./backend/Dockerfile`
- **Depends on**: postgres
- **Uploads**: Mounted to `./uploads`

### Frontend (Next.js)
- **Container**: `realestate-frontend`
- **Port**: 3000
- **Build**: `./frontend/Dockerfile`
- **Depends on**: backend
- **Access**: http://localhost:3000

### Dashboard (React + Vite)
- **Container**: `realestate-dashboard`
- **Port**: 3002
- **Build**: `./dashboard/Dockerfile`
- **Depends on**: backend
- **Access**: http://localhost:3002
- **Server**: Nginx (production-ready)

## Environment Variables

### Backend
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/realestate?schema=public
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
DEV_MODE=true
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://notify.eskiz.uz/api
PAYME_MERCHANT_ID=your-payme-merchant-id
CLICK_MERCHANT_ID=your-click-merchant-id
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### Dashboard
```env
VITE_API_URL=http://localhost:3001
```

## Development Workflow

### 1. Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd Commercial-realestate

# Start all services
docker-compose up -d

# Wait for services to be ready
docker-compose logs -f backend
```

### 2. Database Migrations

```bash
# Run migrations
docker-compose exec backend npm run prisma:migrate

# Seed database
docker-compose exec backend npm run seed
```

### 3. Access Services

- Frontend: http://localhost:3000
- Dashboard: http://localhost:3002
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api

### 4. Development Changes

When you make code changes:

```bash
# Backend changes - restart service
docker-compose restart backend

# Frontend changes - rebuild
docker-compose up -d --build frontend

# Dashboard changes - rebuild
docker-compose up -d --build dashboard
```

## Production Deployment

### 1. Update Environment Variables

Edit `docker-compose.yml` and change:
- `JWT_SECRET` to a strong secret
- `DEV_MODE` to `false`
- Add real API keys for SMS, Payme, Click
- Update `NEXT_PUBLIC_MAPBOX_TOKEN`

### 2. Build and Deploy

```bash
# Build all services
docker-compose build

# Start in production mode
docker-compose up -d

# Check status
docker-compose ps
```

### 3. SSL/HTTPS Setup

For production, add an Nginx reverse proxy with SSL:

```yaml
# Add to docker-compose.yml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
  depends_on:
    - frontend
    - dashboard
    - backend
```

## Troubleshooting

### Service won't start

```bash
# Check logs
docker-compose logs <service-name>

# Restart service
docker-compose restart <service-name>

# Rebuild service
docker-compose up -d --build <service-name>
```

### Database connection issues

```bash
# Check if postgres is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Port conflicts

If ports are already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "3003:3000"  # Change external port
```

### Clean restart

```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Useful Commands

```bash
# Execute command in container
docker-compose exec backend npm run prisma:studio
docker-compose exec backend sh

# View container stats
docker stats

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

## Network

All services are connected via the `realestate-network` bridge network, allowing them to communicate using service names:

- Backend can access database at `postgres:5432`
- Frontend can access backend at `backend:3001`
- Dashboard can access backend at `backend:3001`

## Volumes

- `postgres_data`: Persistent PostgreSQL data
- `./uploads`: Backend uploads directory (mounted)

## Health Checks

Add health checks to services:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```
