# Complete Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Deployment](#local-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Cloud Platforms](#cloud-platforms)
6. [Monitoring & Logging](#monitoring--logging)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

```bash
# Node.js and npm
node --version  # Should be >= 20.x
npm --version   # Should be >= 10.0.0

# Docker and Docker Compose
docker --version
docker-compose --version

# Git
git --version

# Optional: AWS CLI, gcloud, or Azure CLI (for cloud deployment)
aws --version
# or
gcloud --version
```

### Environment Setup

Create environment files:

**Development (.env.development)**

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENVIRONMENT=development

NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/white-caves-dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key
WHATSAPP_SESSION_FOLDER=./sessions
LOG_LEVEL=debug
```

**Production (.env.production)**

```env
VITE_API_URL=https://api.whitecaves.com
VITE_WS_URL=wss://api.whitecaves.com
VITE_ENVIRONMENT=production

NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/white-caves-prod
REDIS_URL=redis://redis.example.com:6379
JWT_SECRET=your-secure-secret-key
WHATSAPP_SESSION_FOLDER=/data/sessions
LOG_LEVEL=info
```

---

## Local Deployment

### Single Machine Deployment

```bash
# 1. Clone repository
git clone <repository-url>
cd White-Caves

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Setup database
npm run seed:small

# 5. Build application
npm run build

# 6. Run application
npm start

# Application will be available at http://localhost:3000
```

### Development Environment

```bash
# Terminal 1: Backend server
npm run server

# Terminal 2: Frontend development server
npm run client

# Or run both together
npm run dev:all

# Access:
# - Frontend: http://localhost:5173
# - API: http://localhost:3000/api
```

---

## Docker Deployment

### Development Environment

**Quick Start**

```bash
# Build and start all services
npm run docker:dev:build

# Check running containers
docker ps

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

**Services Included**:

- Frontend (Vite) - http://localhost:5173
- Backend API (Express) - http://localhost:3000
- MongoDB - mongodb://localhost:27017
- Redis - redis://localhost:6379

### Production Environment

**Build Docker Image**

```bash
# Build multi-stage Docker image
docker build -t white-caves:latest .
docker tag white-caves:latest white-caves:v1.0.0

# For production (smaller image)
docker build --target production -t white-caves:latest .
```

**Run Production Services**

```bash
# Start with docker-compose
npm run docker:prod:build

# Or manually
docker-compose -f docker-compose.prod.yml up -d

# Monitor services
docker-compose logs -f app

# Stop services
npm run docker:down
```

**Scale Services**

```bash
# Scale API service to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Load balance with nginx (configured in docker-compose.prod.yml)
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing: `npm test`
- [ ] Coverage acceptable (80%+): `npm run test:coverage`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors/warnings in build
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificate installed
- [ ] Backup created
- [ ] Deployment plan documented
- [ ] Team notified

### Database Migration

```bash
# Test migration locally
npm run db:migrate:dev

# Backup production database
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/white-caves-prod" \
  --out=./backup/$(date +%Y%m%d_%H%M%S)

# Run migration
npm run db:migrate:prod

# Verify migration
mongo <connection-string> --eval "db.getCollectionNames()"
```

### Deployment Steps

#### Option 1: Manual SSH Deployment

```bash
# 1. Connect to server
ssh user@production.example.com

# 2. Navigate to application directory
cd /var/www/white-caves

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm ci --only=production

# 5. Build application
npm run build

# 6. Restart service
sudo systemctl restart white-caves

# 7. Check status
sudo systemctl status white-caves
```

#### Option 2: Docker Deployment to Server

```bash
# 1. Build and push Docker image
docker build -t registry.example.com/white-caves:v1.0.0 .
docker push registry.example.com/white-caves:v1.0.0

# 2. SSH to server
ssh user@production.example.com

# 3. Pull latest image
docker pull registry.example.com/white-caves:v1.0.0

# 4. Update docker-compose
# Edit docker-compose.prod.yml to use new image version

# 5. Restart services
docker-compose -f docker-compose.prod.yml up -d

# 6. Verify
docker ps
docker logs -f white-caves_app_1
```

#### Option 3: GitHub Actions (Recommended)

The `.github/workflows/ci-cd.yml` automatically handles deployment on push to main branch:

1. Code pushed to main
2. Tests run automatically
3. Build succeeds
4. Docker image pushed to registry
5. Automatic deployment to production (with optional manual approval)

```bash
# View deployment status
# Go to: https://github.com/your-org/White-Caves/actions
```

### Post-Deployment Verification

```bash
# 1. Health check
curl https://api.whitecaves.com/health

# 2. Check logs
docker logs white-caves_app_1

# 3. Verify database connection
npm run verify:db

# 4. Run smoke tests
npm run test:smoke

# 5. Check monitoring
# Access Grafana: https://monitoring.whitecaves.com:3000
```

---

## Cloud Platforms

### AWS Deployment (EC2 + RDS + ElastiCache)

#### Setup

```bash
# 1. Create EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name white-caves-key \
  --security-group-ids sg-0123456789abcdef0

# 2. Create RDS MongoDB Atlas cluster (or)
# Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas

# 3. Create ElastiCache Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id white-caves-redis \
  --engine redis \
  --cache-node-type cache.t3.micro

# 4. Connect to EC2 and deploy
ssh -i white-caves-key.pem ec2-user@instance-ip
npm run docker:prod:build
```

#### Environment Variables (AWS Secrets Manager)

```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name white-caves/prod \
  --secret-string '{"JWT_SECRET":"...","DATABASE_URL":"..."}'

# Reference in application
const secret = await secretsManager.getSecretValue({
  SecretId: 'white-caves/prod'
})
```

### Google Cloud Platform (Cloud Run + Firestore)

```bash
# 1. Build and push Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/white-caves

# 2. Deploy to Cloud Run
gcloud run deploy white-caves \
  --image gcr.io/PROJECT_ID/white-caves \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars NODE_ENV=production

# 3. Setup Cloud SQL (PostgreSQL) or Firestore
gcloud firestore databases create \
  --region us-central1

# 4. Setup Cloud Memorystore (Redis)
gcloud redis instances create white-caves-redis \
  --size=2 \
  --region=us-central1
```

### Azure Deployment (App Service + Cosmos DB)

```bash
# 1. Create resource group
az group create \
  --name white-caves-rg \
  --location eastus

# 2. Create App Service Plan
az appservice plan create \
  --name white-caves-plan \
  --resource-group white-caves-rg \
  --sku B2

# 3. Create Web App
az webapp create \
  --resource-group white-caves-rg \
  --plan white-caves-plan \
  --name white-caves-app

# 4. Deploy from GitHub
az webapp deployment github-actions add \
  --repo-url https://github.com/your-org/White-Caves \
  --resource-group white-caves-rg \
  --name white-caves-app

# 5. Create Cosmos DB (MongoDB compatible)
az cosmosdb create \
  --resource-group white-caves-rg \
  --name white-caves-db \
  --kind MongoDB
```

---

## Monitoring & Logging

### Application Monitoring

**Prometheus Metrics**

```bash
# Access at http://localhost:9090
# Metrics available at http://localhost:3000/metrics
```

**Key Metrics**:

- Request latency (95th, 99th percentile)
- Error rate (5xx, 4xx)
- Database connection pool usage
- Redis memory usage
- WebSocket connections
- Message queue size

### Logging

**Log Files**:

```bash
# Application logs
tail -f logs/application.log

# Access logs
tail -f logs/access.log

# Error logs
tail -f logs/error.log

# Docker logs
docker logs -f white-caves_app_1
docker logs --tail 100 white-caves_app_1
```

**Log Aggregation (ELK Stack)**

```bash
# Forward logs to Elasticsearch
# Configured in server/config/logging.js

# View in Kibana: http://localhost:5601
```

### Alerting

**Configure Alerts in Prometheus/Grafana**:

1. High error rate (>1%)
2. High latency (>500ms p99)
3. Database connection pool exhausted
4. Redis memory critical
5. Disk space running low

---

## Rollback Procedures

### Rollback from Docker

```bash
# 1. Stop current service
docker-compose -f docker-compose.prod.yml down

# 2. Pull previous version
docker pull registry.example.com/white-caves:v0.9.0

# 3. Update docker-compose.prod.yml
# Change image: white-caves:v1.0.0 -> white-caves:v0.9.0

# 4. Start previous version
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify
docker logs -f white-caves_app_1
```

### Rollback Database

```bash
# 1. Restore from backup
mongorestore --uri="mongodb+srv://..." backup/20240115_143022/

# 2. Verify data
mongo <connection-string> --eval "db.conversations.count()"

# 3. Run migration rollback (if applicable)
npm run db:migrate:rollback
```

### Rollback Code (GitHub)

```bash
# 1. Revert last commit
git revert HEAD

# Push to main
git push origin main

# GitHub Actions will automatically redeploy

# Or reset to previous version
git reset --hard v0.9.0
git push origin main --force
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker logs white-caves_app_1

# Check environment variables
docker exec white-caves_app_1 printenv | grep VITE_

# Check port availability
lsof -i :3000
netstat -tulpn | grep 3000

# Check file permissions
chmod -R 755 /var/www/white-caves
```

### Database Connection Issues

```bash
# Test connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/"

# Check firewall
sudo ufw status
sudo ufw allow 27017

# Check connection string
# Verify username, password, cluster name
```

### High Memory Usage

```bash
# Check container memory
docker stats

# Check Node process
ps aux | grep node

# Check for memory leaks
node --inspect server/index.js
# Open chrome://inspect in Chrome
```

### Slow Performance

```bash
# Check database query performance
db.setProfilingLevel(1)
db.system.profile.find().limit(5).sort({ts: -1}).pretty()

# Check Redis memory
redis-cli info memory

# Check network latency
curl -w "%{time_total}\n" https://api.whitecaves.com
```

### SSL Certificate Issues

```bash
# Check certificate validity
openssl s_client -connect api.whitecaves.com:443

# Renew Let's Encrypt certificate
sudo certbot renew --dry-run
sudo certbot renew

# Verify in nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## Scaling

### Horizontal Scaling

```bash
# Scale with Docker Compose
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Configure load balancer (nginx)
# Already configured in docker-compose.prod.yml
```

### Vertical Scaling

```bash
# Increase container resources
# Edit docker-compose.prod.yml:
services:
  app:
    mem_limit: 4g
    cpus: 2.0
```

### Database Scaling

```bash
# MongoDB Atlas cluster tier upgrade
# https://cloud.mongodb.com/

# Or setup replica set
rs.initiate()
rs.add("mongo2:27017")
rs.add("mongo3:27017")
```

---

## Backup & Recovery

### Automated Backups

```bash
# MongoDB Atlas automatic backups (enabled by default)
# Or setup local backups

# Daily backup script
0 2 * * * mongodump --uri="..." --out=/backups/$(date +\%Y\%m\%d) >> /var/log/backup.log

# Store in cloud
aws s3 sync /backups/ s3://white-caves-backups/
```

### Restore from Backup

```bash
# Restore database
mongorestore --uri="mongodb+srv://..." /backups/20240115

# Restore uploaded files
aws s3 sync s3://white-caves-backups/uploads/ /var/www/white-caves/uploads/

# Verify integrity
npm run verify:db
```

---

## Security

### HTTPS/TLS

```bash
# Generate certificate with Let's Encrypt
sudo certbot certonly --standalone -d api.whitecaves.com

# Configure in nginx
ssl_certificate /etc/letsencrypt/live/api.whitecaves.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/api.whitecaves.com/privkey.pem;
```

### Environment Variables Security

```bash
# Never commit .env files
echo ".env" >> .gitignore
echo ".env.production" >> .gitignore

# Use secrets management
# AWS Secrets Manager, Azure Key Vault, or similar

# Rotate secrets regularly
npm run rotate:secrets
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw enable
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # Internal only
```

---

## Performance Optimization

### Caching

```bash
# Browser caching
# Configured in nginx

# Application caching
REDIS_URL=redis://redis:6379
# Used for session storage, API responses

# CDN integration
# Configure in Cloudflare or similar
```

### Database Optimization

```bash
# Add indexes
db.conversations.createIndex({accountId: 1})
db.messages.createIndex({conversationId: 1, timestamp: -1})

# Monitor slow queries
db.setProfilingLevel(1, {slowms: 100})
```

### Code Optimization

```bash
# Build optimization
npm run build -- --minify

# Code splitting
# Already configured in vite.config.js

# Tree shaking
# Enabled by default in production build
```

---

## References

- [Docker Documentation](https://docs.docker.com/)
- [AWS Deployment Guide](https://aws.amazon.com/getting-started/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Let's Encrypt](https://letsencrypt.org/)
