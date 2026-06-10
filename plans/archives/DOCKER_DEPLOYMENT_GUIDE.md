# Docker Deployment Guide

## Overview

This guide covers deploying the White Caves Web App using Docker and Docker Compose.

## Prerequisites

- Docker Desktop or Docker Engine 20.10+
- Docker Compose 1.29+
- Git
- A `.env` file with your configuration (copy from `.env.example`)

## Quick Start

### 1. Prepare Environment Variables

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 2. Build and Start Services

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Verify Services

```bash
# Check service status
docker-compose ps

# Health check
curl http://localhost:5000/health
curl http://localhost:3000/health.html
```

## Service Descriptions

### MongoDB

- **Port**: 27017
- **Container**: white-caves-mongodb
- **Features**:
  - Persistent storage with named volumes
  - Authentication enabled
  - Health checks configured
  - Automatic startup on boot

### API Server

- **Port**: 5000
- **Container**: white-caves-api
- **Features**:
  - Node.js/Express backend
  - Connected to MongoDB
  - Health checks
  - Environment variables from .env
  - Auto-restart policy

### Frontend

- **Port**: 3000
- **Container**: white-caves-frontend
- **Features**:
  - React/Vite application
  - Served via Nginx
  - Production build
  - API proxy configured

### Nginx Reverse Proxy

- **Ports**: 80, 443
- **Container**: white-caves-nginx
- **Features**:
  - SSL/TLS termination
  - Rate limiting
  - Gzip compression
  - Security headers
  - API rate limiting (10 req/s)
  - General rate limiting (30 req/s)

## Managing Services

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f mongodb
```

### Execute Commands

```bash
# In API container
docker-compose exec api npm run seed
docker-compose exec api npm test

# In MongoDB container
docker-compose exec mongodb mongosh
```

### Stop Services

```bash
# Graceful shutdown
docker-compose down

# With volume cleanup
docker-compose down -v

# Remove images too
docker-compose down --rmi all
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart api
```

## Database Management

### Backup Database

```bash
docker-compose exec mongodb mongodump \
  --uri="mongodb://admin:password@mongodb:27017/white-caves?authSource=admin" \
  --out=/backup
```

### Restore Database

```bash
docker-compose exec mongodb mongorestore \
  --uri="mongodb://admin:password@mongodb:27017/white-caves?authSource=admin" \
  /backup
```

### Initialize Database

```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# Inside mongosh
use white-caves
db.createCollection("properties")
db.createCollection("owners")
db.createCollection("importSessions")
```

## Production Deployment

### SSL/TLS Setup

1. **Generate Self-Signed Certificate** (Development)

   ```bash
   mkdir -p ssl
   openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
   ```

2. **Use Let's Encrypt Certificate** (Production)

   ```bash
   # Install certbot
   sudo apt-get install certbot python3-certbot-nginx

   # Generate certificate
   sudo certbot certonly --standalone -d yourdomain.com

   # Copy to ssl directory
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
   ```

### Environment Configuration

```env
NODE_ENV=production
JWT_SECRET=your_very_secure_random_string_here_min_32_chars
MONGODB_URI=mongodb://user:password@mongodb:27017/white-caves
```

### Resource Limits

Update `docker-compose.yml` with resource limits:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Monitoring & Maintenance

### Health Checks

Services have built-in health checks. Monitor with:

```bash
docker-compose ps

# Should show "healthy" or "starting" status
```

### Disk Usage

```bash
docker system df
```

### Clean Up Unused Images/Volumes

```bash
# Remove dangling images
docker image prune

# Remove unused volumes
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

## Troubleshooting

### API Container Won't Start

```bash
# Check logs
docker-compose logs api

# Rebuild
docker-compose build --no-cache api
docker-compose up api
```

### MongoDB Connection Issues

```bash
# Verify MongoDB is running and healthy
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec api npm run test:db-connection
```

### Ports Already in Use

```bash
# Find what's using port
lsof -i :5000
lsof -i :3000
lsof -i :27017

# Change ports in docker-compose.yml
# Format: "HOST_PORT:CONTAINER_PORT"
```

### Memory/CPU Issues

```bash
# Check resource usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
# Or update deploy.resources in docker-compose.yml
```

## Performance Optimization

### Database Optimization

- Enable MongoDB indexes for frequently queried fields
- Regular backup and cleanup
- Monitor query performance with MongoDB Profiler

### API Server Optimization

- Enable caching with Redis (optional)
- Implement API rate limiting (configured in nginx.conf)
- Use compression (gzip enabled in nginx)

### Frontend Optimization

- Bundle size analysis
- Code splitting configured in Vite
- Assets caching (30 days for static files)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy with Docker

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push
        run: |
          docker-compose build
          docker-compose up -d
      - name: Run tests
        run: docker-compose exec -T api npm test
```

## Security Best Practices

1. **Environment Variables**: Store sensitive data in `.env` (never commit)
2. **SSL/TLS**: Always use HTTPS in production
3. **Network**: Use Docker networks instead of exposing all ports
4. **Database**: Change default MongoDB credentials
5. **Rate Limiting**: Adjust limits in nginx.conf based on needs
6. **Updates**: Regularly update base images and dependencies

## Common Commands

```bash
# Quick start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Run migrations
docker-compose exec api npm run migrate

# Run tests
docker-compose exec api npm test

# Stop all
docker-compose down

# Full reset
docker-compose down -v && docker-compose up -d
```

## Support & Resources

- Docker Documentation: https://docs.docker.com
- Docker Compose Reference: https://docs.docker.com/compose/compose-file/
- MongoDB Docker Hub: https://hub.docker.com/_/mongo
- Nginx Documentation: https://nginx.org/en/docs/
