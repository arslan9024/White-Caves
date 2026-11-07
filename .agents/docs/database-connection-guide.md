# Database Connection Configuration Guide

## Overview

The Week 2 test infrastructure now supports **multiple database connection methods** with automatic fallback. This allows you to:

- Use an existing Atlas staging cluster
- Use an existing Atlas production cluster
- Use local MongoDB for development
- Automatically fallback if no configuration is found

---

## Connection Strategy (Priority Order)

The scripts will try connections in this order:

### 1️⃣ **MONGODB_URI** (Atlas Staging) - RECOMMENDED
```env
MONGODB_URI=mongodb+srv://username:password@white-caves-staging.mongodb.net/white_caves_staging
```
**Best for:** Week 2 testing with isolated staging data
**Where to get:** MongoDB Atlas → white-caves-staging cluster → Connect

### 2️⃣ **MONGODB_ATLAS_URI** (Production or Other Cluster)
```env
MONGODB_ATLAS_URI=mongodb+srv://username:password@white-caves.mongodb.net/white_caves
```
**Best for:** Testing against production data (with caution)
**Where to get:** MongoDB Atlas → your-cluster → Connect

### 3️⃣ **MONGODB_LOCAL** (Local Development)
```env
MONGODB_LOCAL=mongodb://localhost:27017/white_caves_test
```
**Best for:** Development on your machine without internet
**Prerequisites:** MongoDB running locally on port 27017

### 4️⃣ **Fallback** (Auto-detected)
```
mongodb://localhost:27017/white_caves_test
```
**When used:** All three above are missing/empty
**Result:** Will use local MongoDB if available, or throw error

---

## How to Configure

### Option A: Use Existing Atlas Staging Cluster

1. **Get Connection String from MongoDB Atlas:**
   ```
   MongoDB Atlas → Clusters → white-caves-staging → Connect → Connect your application
   ```

2. **Copy the connection string** (looks like: `mongodb+srv://...`)

3. **Update .env.staging:**
   ```env
   # Replace username and password
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@white-caves-staging.mongodb.net/white_caves_staging
   ```

4. **Verify connection:**
   ```bash
   node scripts/db-connection-check.js
   # Should show: ✅ Connection Method: environment (.env.staging)
   ```

### Option B: Use Local MongoDB

1. **Start MongoDB locally** (or ensure it's running):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Windows
   mongod
   
   # Docker
   docker run -d -p 27017:27017 --name mongodb mongo
   ```

2. **Update .env.staging:**
   ```env
   # Leave MONGODB_URI empty or commented out
   # MONGODB_URI=mongodb+srv://...
   
   # Use local instead
   MONGODB_LOCAL=mongodb://localhost:27017/white_caves_test
   ```

3. **Verify connection:**
   ```bash
   node scripts/db-connection-check.js
   # Should show: ✅ Connection Method: environment (local development)
   ```

### Option C: Use Existing Production Cluster

⚠️ **Use with caution!** This will modify production data.

1. **Get Production Connection String:**
   ```
   MongoDB Atlas → Clusters → white-caves (production) → Connect
   ```

2. **Update .env.staging:**
   ```env
   # Leave MONGODB_URI empty
   # MONGODB_URI=...
   
   # Use production instead
   MONGODB_ATLAS_URI=mongodb+srv://USERNAME:PASSWORD@white-caves.mongodb.net/white_caves
   ```

3. **Verify connection:**
   ```bash
   node scripts/db-connection-check.js
   # Should show: ✅ Connection Method: environment (.env - MongoDB Atlas)
   ```

---

## Current Configuration Status

**File:** `.env.staging`

**Current Setting:**
```env
MONGODB_URI=mongodb+srv://admin:your_password@white-caves-staging.mongodb.net/white_caves_staging
```

**Status:** ⏳ **PLACEHOLDER** - Needs real credentials

**To Activate:**
1. Replace `admin` and `your_password` with real credentials
2. Run: `node scripts/db-connection-check.js` to verify
3. You're ready for testing!

---

## Testing Your Connection

### Quick Test
```bash
node scripts/db-connection-check.js
```

**Expected Output if successful:**
```
🔍 Checking MongoDB connection...
📍 Connection Method: environment (.env.staging)
📍 Connection URI: mongodb+srv://admin:***@white-caves-staging...
✅ MongoDB connection successful
✅ All required collections accessible (5 collections found)
✓ Create: Inserted test document
✓ Read: Retrieved test document successfully
✓ Update: Modified test document successfully
✓ Delete: Removed test document successfully

📊 Connection Statistics:
   └─ Status: Connected
   └─ Database: white_caves_staging
   └─ Host: white-caves-staging.mongodb.net
   └─ Method: environment (.env.staging)
```

### Backup Verification
```bash
node scripts/backup-staging-db.js
```

### Collections Check
Once connected, check what data is available:
```bash
# View count of collections
mongosh [your-connection-string]
use white_caves_staging
db.inventoryproperties.countDocuments()
db.owners.countDocuments()
db.leads.countDocuments()
```

---

## What Data is Available?

After seeding test data, you'll have:

| Collection | Auto-seeded | Purpose |
|-----------|-----------|---------|
| **inventoryproperties** | 50+ | Properties for sourcing |
| **owners** | 20+ | Property owners |
| **leads** | 100+ | Real estate leads |
| **whatsappcontacts** | 30+ | WhatsApp conversation contacts |
| **contracts** | 15+ | Rental contracts |

**To seed data:**
```bash
npm run seed:small        # Seed ~20-50 records
npm run seed:large        # Seed ~200 records
MONGODB_URI=... npm run seed:small  # With explicit URI
```

---

## Troubleshooting

### "MONGODB_URI not configured"
**Solution:** Edit `.env.staging` and add your connection string

### "Connection refused"
**Possible causes:**
1. MongoDB Atlas cluster not accessible (check IP whitelist)
2. Wrong credentials (user/password mismatch)
3. Local MongoDB not running (if using MONGODB_LOCAL)

**Solution:**
```bash
# Test connection manually
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"

# If error, check:
# 1. Credentials in MongoDB Atlas
# 2. IP whitelist in MongoDB Atlas security
# 3. Network connectivity
```

### "Database not found"
**Solution:** The database will be created automatically on first write

### "Collections don't exist"
**Solution:** Run seed command:
```bash
npm run seed:small
```

---

## For Week 2 Testing

### Recommended Setup
1. Use **Option A** (Atlas staging cluster)
2. Configure `MONGODB_URI` with real credentials
3. Run `node scripts/db-connection-check.js` to verify
4. Run `npm run seed:small` to populate test data
5. You're ready for Monday morning tests!

### Connection Method will be Logged
When tests run, each script will log which connection method is being used:
```
✅ Connection Method: environment (.env.staging)
```

This helps you understand which database you're testing against.

---

## Multiple Database Support

Want to test against different databases on different days?

**Example workflow:**

```bash
# Monday: Use staging
export MONGODB_URI=mongodb+srv://...staging...
npm run test:run -- ...ConversationAnalyzer...

# Thursday: Switch to local for isolated testing
export MONGODB_LOCAL=mongodb://localhost:27017/white_caves_test
npm run test:run -- ...PropertySourcingService...

# Friday: Use production for final validation (caution!)
export MONGODB_ATLAS_URI=mongodb+srv://...production...
npm run test:coverage
```

---

## Summary

✅ **Scripts Updated:** db-connection-check, backup, restore
✅ **Multiple Sources:** MONGODB_URI, MONGODB_ATLAS_URI, MONGODB_LOCAL, fallback
✅ **Auto-Detection:** Tries sources in priority order
✅ **Logging:** Shows which connection method is used
✅ **Fallback:** Uses localhost if no URI configured

**Next Step:** Configure your database URI in `.env.staging` and test with `node scripts/db-connection-check.js`
