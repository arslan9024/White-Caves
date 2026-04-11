# Production Deployment - Quick Reference Card

**Version**: 1.0.0 | **Updated**: March 22, 2026 | **Status**: PRODUCTION READY

---

## 🚀 Quick Start Commands

### Start Services (5 minutes)
```bash
cp .env.production.example .env.production
nano .env.production                              # Edit values
docker-compose -f docker-compose.prod.yml up -d
curl https://white-caves.com/health
```

### Full Deployment Script (automated, 45 minutes)
```bash
# Linux/Mac
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh production v1.0.0

# Windows
.\scripts\deploy-prod.ps1 -Environment production -Version v1.0.0
```

---

## 📋 Pre-Deployment Checklist

```bash
# ✅ Tests
npm run test
npm run test:integration
npm run test:e2e

# ✅ Build
npm run build
npm run build:server

# ✅ Security
npm audit

# ✅ Git
git status
git push origin main

# ✅ Environment
cp .env.production.example .env.production
nano .env.production  # Fill in actual values
chmod 600 .env.production

# ✅ SSL Certificates
# Option A: Let's Encrypt
sudo certbot certonly --standalone -d white-caves.com

# Option B: Self-signed (testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem
```

---

## 🐳 Docker Compose Commands

| Command | Purpose |
|---------|---------|
| `docker-compose -f docker-compose.prod.yml up -d` | Start all services |
| `docker-compose -f docker-compose.prod.yml down` | Stop all services |
| `docker-compose -f docker-compose.prod.yml ps` | View service status |
| `docker-compose -f docker-compose.prod.yml logs -f app` | Stream app logs |
| `docker-compose -f docker-compose.prod.yml logs mongo` | View database logs |
| `docker-compose -f docker-compose.prod.yml restart app` | Restart app service |
| `docker-compose -f docker-compose.prod.yml exec app bash` | Shell into app |

---

## 🏥 Health & Monitoring

### Health Check
```bash
# Expected response
curl https://white-caves.com/health
# {
#   "status": "healthy",
#   "timestamp": "2026-03-22T10:30:45Z",
#   "checks": {
#     "database": "connected",
#     "redis": "connected"
#   }
# }
```

### View Metrics
```bash
# CPU & Memory
docker stats --no-stream

# Application logs
docker-compose -f docker-compose.prod.yml logs app

# Database logs
docker-compose -f docker-compose.prod.yml logs mongo

# Redis logs
docker-compose -f docker-compose.prod.yml logs redis
```

---

## 🔄 Common Operations

### Database Operations

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec app \
  npm run prisma:migrate:deploy

# Seed data
docker-compose -f docker-compose.prod.yml exec app \
  npm run seed

# Connect to MongoDB
docker-compose -f docker-compose.prod.yml exec mongo mongosh

# Backup MongoDB
docker-compose -f docker-compose.prod.yml exec mongo \
  mongodump --out /backup/mongodb-$(date +%Y%m%d)
```

### Redis Operations

```bash
# Connect to Redis
docker-compose -f docker-compose.prod.yml exec redis redis-cli

# Clear cache
docker-compose -f docker-compose.prod.yml exec redis redis-cli FLUSHALL

# View keys
docker-compose -f docker-compose.prod.yml exec redis redis-cli KEYS "*"

# Backup Redis
docker-compose -f docker-compose.prod.yml exec redis \
  redis-cli --rdb /backup/redis-dump.rdb
```

### Application Operations

```bash
# Run tests
docker-compose -f docker-compose.prod.yml exec app npm test

# View dependencies
docker-compose -f docker-compose.prod.yml exec app npm ls

# Check security vulnerabilities
docker-compose -f docker-compose.prod.yml exec app npm audit

# Update dependencies
docker-compose -f docker-compose.prod.yml exec app npm update
```

---

## 🚨 Emergency Procedures

### Services Won't Start

```bash
# Check configuration
docker-compose -f docker-compose.prod.yml config

# View full logs
docker-compose -f docker-compose.prod.yml logs

# Restart everything
docker-compose -f docker-compose.prod.yml restart

# Hard reset
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

### Database Connection Lost

```bash
# Check MongoDB
docker-compose -f docker-compose.prod.yml logs mongo

# Restart MongoDB
docker-compose -f docker-compose.prod.yml restart mongo

# Restore from backup
docker-compose -f docker-compose.prod.yml down
docker volume rm white-caves-mongodb
docker volume create white-caves-mongodb
docker-compose -f docker-compose.prod.yml up -d mongo
mongorestore /backup/mongodb-previous
```

### High Memory Usage

```bash
# Check memory
docker stats --no-stream | grep app

# Restart app
docker-compose -f docker-compose.prod.yml restart app

# Check for memory leaks in logs
docker-compose -f docker-compose.prod.yml logs app | grep -i memory
```

### SSL Certificate Expired

```bash
# Check expiration
echo | openssl s_client -servername white-caves.com \
  -connect white-caves.com:443 | openssl x509 -noout -dates

# Renew certificate
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

### Quick Rollback

```bash
# Stop current version
docker-compose -f docker-compose.prod.yml down

# Edit docker-compose.prod.yml to use previous image tag
nano docker-compose.prod.yml

# Restart with previous version
docker-compose -f docker-compose.prod.yml up -d

# Verify
curl https://white-caves.com/health
```

---

## 📊 Monitoring Dashboards

| Service | URL | Purpose |
|---------|-----|---------|
| Application Health | `https://white-caves.com/health` | Real-time status |
| Nginx Metrics | `https://white-caves.com/metrics` | Request metrics |
| Prometheus | `http://localhost:9090` | Time-series metrics |
| Grafana | `http://localhost:3000` | Visualization |
| Redis Commander | `http://localhost:8081` | Cache inspection |

---

## 📝 Logging Locations

| Component | Log Path | How to View |
|-----------|----------|-------------|
| Application | Container logs | `docker logs <container-id>` |
| Nginx | `/var/log/nginx/access.log` | `tail -f` |
| MongoDB | Container logs | `docker logs mongo` |
| Redis | Container logs | `docker logs redis` |
| Docker | System logs | `journalctl -u docker` |

---

## 🔑 Environment Variables - Essential

```bash
# Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=mongodb://mongo:27017/white_caves

# Cache
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=<secure-random-string-min-32-chars>

# WhatsApp
WHATSAPP_SESSION_PATH=/app/data/whatsapp_sessions

# Security
CORS_ORIGIN=https://white-caves.com
```

---

## 📈 Performance Targets

| Metric | Target | Alert |
|--------|--------|-------|
| Response Time (p95) | <500ms | >1000ms |
| Error Rate | <0.1% | >1% |
| CPU Usage | <70% | >80% |
| Memory Usage | <80% | >85% |
| Disk Usage | <80% | >90% |
| Database Connections | <80 | >100 |

---

## 🔗 Important Links

- **Documentation**: `PRODUCTION_DEPLOYMENT_RUNBOOK.md`
- **Summary**: `PHASE_A4_PRODUCTION_DEPLOYMENT_SUMMARY.md`
- **Config Example**: `.env.production.example`
- **Nginx Config**: `nginx.prod.conf`
- **Docker Compose**: `docker-compose.prod.yml`
- **Backend Dockerfile**: `Dockerfile.prod`

---

## 👥 Support & Escalation

| Issue | Owner | Time |
|-------|-------|------|
| Application Down | DevOps Team | Immediate |
| Database Issue | DB Team | Immediate |
| Performance | Platform Team | 1 hour |
| Security | Security Team | 30 minutes |
| General Questions | Engineering Team | Next business day |

---

## 📞 Emergency Contacts

- **On-Call**: `+1-XXX-XXX-XXXX`
- **Slack**: `#white-caves-ops`
- **Email**: `ops@white-caves.com`

---

## ✅ Daily Checklist

```
☐ Check health endpoint
☐ Review error logs
☐ Check disk usage (df -h)
☐ Monitor CPU/Memory (docker stats)
☐ Verify backups exist
☐ Check certificate expiration
```

---

## 📚 Quick Tips

1. **Always backup before major changes**: `./scripts/backup.sh`
2. **Test in staging first**: Use `docker-compose.staging.yml`
3. **Monitor during deployment**: `watch -n 1 docker stats`
4. **Keep DNS TTL low**: Set to 300s for faster failover
5. **Have recovery plan**: Test rollback procedure weekly

---

**🎯 Status**: Production Ready | **Rev**: 1.0.0 | **Next Review**: April 1, 2026
