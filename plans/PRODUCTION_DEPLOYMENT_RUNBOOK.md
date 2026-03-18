# White Caves CRM Platform - Production Deployment Runbook

**Status**: PRODUCTION READY  
**Last Updated**: March 22, 2026  
**Version**: 1.0.0  
**Owner**: DevOps Team

---

## 📋 Table of Contents

The complete production deployment guide for the White Caves CRM platform.

- [Prerequisites](#prerequisites)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Procedures](#deployment-procedures)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring & Alerts](#monitoring--alerts)
- [Backup & Recovery](#backup--recovery)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

---

## Prerequisites

### System Requirements

- **Operating System**: Linux (Ubuntu 20.04 LTS or later recommended)
- **CPU**: 4 cores minimum (8 cores recommended)
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 50GB SSD minimum
- **Docker**: 20.10+ (or Podman 4.0+)
- **Docker Compose**: 2.0+ (or Podman Compose)
- **Nginx**: 1.18+ (or reverse proxy)

### Software Dependencies

```bash
# Install Docker and Docker Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Verify installation
docker --version
docker-compose --version

# Add user to docker group (optional, for sudo-less execution)
sudo usermod -aG docker $USER
newgrp docker
```

### Network & Security

- Domain name registered and DNS configured
- SSL/TLS certificate obtained (Let's Encrypt recommended)
- Firewall rules configured (ports 80, 443)
- SSH key pair generated for deployment
- Secrets manager integration configured

---

## Pre-Deployment Checklist

### Code & Build

- [ ] All tests passing (unit, integration, E2E)
  ```bash
  npm run test
  npm run test:integration
  npm run test:e2e
  ```

- [ ] TypeScript compilation successful
  ```bash
  npm run build
  ```

- [ ] No security vulnerabilities
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] All Git changes committed and pushed
  ```bash
  git status
  git push origin main
  ```

- [ ] Version bumped in package.json
  ```json
  {
    "version": "1.0.0"
  }
  ```

### Configuration

- [ ] `.env.production` file created from `.env.production.example`
- [ ] All environment variables set:
  - JWT_SECRET: Cryptographically secure value
  - DATABASE_URL: Production MongoDB connection
  - REDIS_URL: Production Redis connection
  - FIREBASE_CREDENTIALS: Production credentials
  - Other sensitive values secured

- [ ] nginx.prod.conf reviewed and customized:
  - Domain name updated
  - SSL certificate paths verified
  - Rate limiting policies reviewed
  - Security headers appropriate

- [ ] docker-compose.prod.yml reviewed:
  - Image versions pinned
  - Resource limits set
  - Volume mounts correct
  - Dependencies in correct order

### Infrastructure

- [ ] Production server provisioned and accessible via SSH
- [ ] Domain DNS records pointing to server IP
- [ ] SSL/TLS certificate obtained and verified
- [ ] Firewall rules allowing traffic on ports 80, 443
- [ ] MongoDB backup system configured
- [ ] Redis persistence enabled

### Documentation

- [ ] Deployment runbook reviewed
- [ ] Monitoring dashboard configured
- [ ] Alert thresholds defined
- [ ] Incident response plan documented

---

## Deployment Procedures

### Step 1: Prepare Deployment Environment

```bash
# SSH into production server
ssh -i /path/to/key user@prod-server.com

# Create application directory
sudo mkdir -p /opt/white-caves
cd /opt/white-caves

# Initialize Git repository and pull latest code
git clone https://github.com/your-org/white-caves.git .
git checkout main
```

### Step 2: Configure Environment

```bash
# Copy production environment file
cp .env.production.example .env.production

# Edit with actual production values
nano .env.production

# Secure the file
chmod 600 .env.production
```

### Step 3: Prepare SSL Certificates

```bash
# Option A: Let's Encrypt with Certbot
sudo apt-get install -y certbot python3-certbot-nginx

sudo certbot certonly \
  --standalone \
  -d white-caves.com \
  -d www.white-caves.com \
  --email admin@white-caves.com

# Certificates saved to /etc/letsencrypt/live/white-caves.com/

# Copy to application directory
sudo mkdir -p /opt/white-caves/ssl
sudo cp /etc/letsencrypt/live/white-caves.com/fullchain.pem /opt/white-caves/ssl/cert.pem
sudo cp /etc/letsencrypt/live/white-caves.com/privkey.pem /opt/white-caves/ssl/key.pem
sudo chown -R $USER:$USER /opt/white-caves/ssl

# Option B: Self-signed certificate (for testing only)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/white-caves/ssl/key.pem \
  -out /opt/white-caves/ssl/cert.pem
```

### Step 4: Configure Nginx

```bash
# Copy production Nginx configuration
sudo cp nginx.prod.conf /etc/nginx/sites-available/white-caves

# Update domain in configuration
sudo sed -i 's/white-caves.local/white-caves.com/g' /etc/nginx/sites-available/white-caves

# Enable site
sudo ln -s /etc/nginx/sites-available/white-caves /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5: Build Application

```bash
cd /opt/white-caves

# Install dependencies
npm install --production

# Build React frontend
npm run build

# Build TypeScript backend
npm run build:server
```

### Step 6: Build & Push Docker Images

```bash
# Build frontend image
docker build -f Dockerfile.frontend -t white-caves-frontend:1.0.0 .

# Build backend image
docker build -f Dockerfile.prod -t white-caves-backend:1.0.0 .

# Optional: Push to registry
docker tag white-caves-frontend:1.0.0 registry.example.com/white-caves-frontend:1.0.0
docker tag white-caves-backend:1.0.0 registry.example.com/white-caves-backend:1.0.0
docker push registry.example.com/white-caves-frontend:1.0.0
docker push registry.example.com/white-caves-backend:1.0.0
```

### Step 7: Deploy with Docker Compose

```bash
cd /opt/white-caves

# Pull latest images (if using registry)
docker-compose -f docker-compose.prod.yml pull

# Create volumes
docker volume create white-caves-mongodb
docker volume create white-caves-redis

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Step 8: Initialize Database

```bash
# Run Prisma migrations
docker-compose -f docker-compose.prod.yml exec app npm run prisma:migrate:deploy

# Seed initial data (if applicable)
docker-compose -f docker-compose.prod.yml exec app npm run seed
```

---

## Post-Deployment Verification

### Service Health Checks

```bash
# Check all containers running
docker-compose -f docker-compose.prod.yml ps

# Verify health check endpoint
curl https://white-caves.com/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2026-03-22T10:30:45Z",
#   "uptime": 125.5,
#   "checks": {
#     "database": "connected",
#     "redis": "connected",
#     "filesystem": "ok"
#   }
# }
```

### Application Verification

```bash
# Test API endpoint
curl -H "Authorization: Bearer <token>" \
  https://white-caves.com/api/departments

# Check frontend loads
curl -I https://white-caves.com/

# Verify SSL certificate
openssl s_client -connect white-caves.com:443
```

### Database Verification

```bash
# Connect to MongoDB
docker-compose -f docker-compose.prod.yml exec mongo mongosh

# Check collections
use white_caves
show collections

# Count documents
db.users.countDocuments()
db.transactions.countDocuments()
```

### Performance Baseline

```bash
# Record baseline metrics
docker stats --no-stream

# Monitor for 5 minutes
docker stats

# Check system resources
free -h
df -h
```

---

## Monitoring & Alerts

### Enable Monitoring

```bash
# Option 1: Using Prometheus & Grafana
docker-compose -f docker-compose.monitoring.yml up -d

# Option 2: Using hosted services (DataDog, New Relic)
# Configure agents in .env.production

# View dashboards
# Grafana: http://white-caves.com:3000
# Prometheus: http://white-caves.com:9090
```

### Key Metrics to Monitor

- **Application**:
  - Request latency (p50, p95, p99)
  - Error rate
  - Request throughput
  - Active connections

- **Database**:
  - Connection count
  - Query latency
  - Replication lag
  - Disk usage

- **System**:
  - CPU usage
  - Memory usage
  - Disk I/O
  - Network throughput

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| CPU Usage | > 70% | > 90% |
| Memory Usage | > 80% | > 95% |
| Disk Usage | > 80% | > 95% |
| Response Time | > 500ms | > 2000ms |
| Error Rate | > 1% | > 5% |
| DB Connections | > 80 | > 100 |

---

## Backup & Recovery

### Automated Backups

```bash
# Configure daily MongoDB backup
docker-compose -f docker-compose.prod.yml exec mongo mongobackup --schedule daily

# Configure Redis persistence
# Already enabled in docker-compose.prod.yml

# Verify backup location
ls -la /opt/white-caves/backups/
```

### Manual Backup

```bash
# Backup MongoDB
docker-compose -f docker-compose.prod.yml exec mongo mongodump \
  --out /backup/mongodb-$(date +%Y%m%d)

# Backup Redis
docker-compose -f docker-compose.prod.yml exec redis \
  redis-cli BGSAVE

# Backup application data
tar -czf /backup/app-data-$(date +%Y%m%d).tar.gz \
  /opt/white-caves/data
```

### Restore from Backup

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore MongoDB
docker-compose -f docker-compose.prod.yml exec mongo mongorestore \
  /backup/mongodb-20260322

# Restore Redis
docker-compose -f docker-compose.prod.yml exec redis \
  redis-cli < /backup/redis-dump.rdb

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

---

## Rollback Procedures

### Quick Rollback (Same Host)

```bash
# Stop current version
docker-compose -f docker-compose.prod.yml down

# Switch to previous image tag
# Edit docker-compose.prod.yml to point to previous version
nano docker-compose.prod.yml

# Restart with previous version
docker-compose -f docker-compose.prod.yml up -d

# Verify
curl https://white-caves.com/health
```

### Full Rollback (Database)

```bash
# If database schema changed, restore backup first:
docker-compose -f docker-compose.prod.yml down -v
docker volume rm white-caves-mongodb

# Restore database
docker volume create white-caves-mongodb
docker-compose -f docker-compose.prod.yml up -d mongo
docker-compose -f docker-compose.prod.yml exec mongo mongorestore /backup/mongodb-previous

# Restart application
docker-compose -f docker-compose.prod.yml up -d
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Common issues:
# 1. Port already in use
lsof -i :5000
kill <PID>

# 2. Environment variable missing
grep "undefined" docker-compose.prod.yml logs

# 3. Disk space exhausted
df -h

# Solutions:
# - Add missing environment variable to .env.production
# - Free up disk space
# - Increase resource limits
```

### Database Connection Errors

```bash
# Test MongoDB connection
docker-compose -f docker-compose.prod.yml exec app \
  node -e "console.log(process.env.DATABASE_URL)"

# Test from MongoDB container
docker-compose -f docker-compose.prod.yml exec mongo \
  mongosh $MONGO_URI

# Verify network
docker network ls
docker network inspect white-caves_default
```

### High Memory Usage

```bash
# Identify memory leak
docker stats --no-stream | grep app

# Restart container
docker-compose -f docker-compose.prod.yml restart app

# Check logs for memory issues
docker-compose -f docker-compose.prod.yml logs app | grep -i memory

# Increase container limits
# Edit docker-compose.prod.yml:
# deploy:
#   resources:
#     limits:
#       memory: 2G
```

### SSL Certificate Issues

```bash
# Check certificate expiration
echo | openssl s_client -servername white-caves.com -connect white-caves.com:443 | \
  openssl x509 -noout -dates

# Renew certificate
sudo certbot renew

# Force renewal if needed
sudo certbot renew --force-renewal

# Verify new certificate
sudo systemctl reload nginx
```

### Performance Degradation

```bash
# Profile slow requests
docker-compose -f docker-compose.prod.yml logs app | grep "duration"

# Check database indexes
docker-compose -f docker-compose.prod.yml exec mongo mongosh \
  white_caves --eval "db.users.getIndexes()"

# Analyze query performance
docker-compose -f docker-compose.prod.yml exec mongo mongosh \
  white_caves --eval "db.users.find({}).explain('executionStats')"
```

---

## Maintenance

### Weekly Tasks

- [ ] Review error logs: `docker-compose logs app | grep ERROR`
- [ ] Check disk usage: `df -h`
- [ ] Verify backups: `ls -la /opt/white-caves/backups/`
- [ ] Monitor resource usage: `docker stats`

### Monthly Tasks

- [ ] Review security advisories
- [ ] Update dependencies: `npm update`
- [ ] Rebuild images with latest base images
- [ ] Test backup restoration
- [ ] Review and update monitoring thresholds

### Quarterly Tasks

- [ ] Capacity planning review
- [ ] Disaster recovery drill
- [ ] Performance baseline comparison
- [ ] Security audit
- [ ] Document lessons learned

### Deployment Log Template

```
## Deployment: Version X.X.X
Date: YYYY-MM-DD
Deployed by: Name
Time to Deploy: X minutes

### Changes
- Feature 1
- Bug fix 1
- Performance improvement 1

### Verification Results
- Health check: ✓
- API endpoints: ✓
- Database: ✓
- Performance: ✓

### Issues Encountered
- None / List issues

### Rollback Plan
- Previous version: vX.X.X
- Rollback time: ~5 minutes
```

---

## Emergency Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| DevOps Lead | TBD | devops@example.com | +1-XXX-XXX-XXXX |
| On-Call | Rotation | oncall@example.com | +1-XXX-XXX-XXXX |
| Security Lead | TBD | security@example.com | +1-XXX-XXX-XXXX |

---

## Appendix

### A. Docker Compose Commands

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Execute command in container
docker-compose -f docker-compose.prod.yml exec app npm run seed

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Remove volumes
docker-compose -f docker-compose.prod.yml down -v
```

### B. Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart server
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### C. Useful Monitoring Commands

```bash
# Real-time stats
watch -n 1 'docker stats --no-stream'

# Check open ports
sudo netstat -tlnp | grep LISTEN

# Monitor system resources
top
htop

# View application metrics
curl https://white-caves.com/metrics
```

---

**✅ Version 1.0.0 - Production Ready**
