# Performance Optimization Guide

## Overview

This guide covers performance optimization strategies for the White Caves Web App, including frontend, backend, and database optimization.

## Frontend Performance

### 1. Code Splitting with Vite

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split common dependencies
          react: ['react', 'react-dom'],
          vendor: ['axios', 'lodash'],
          ui: ['@mui/material', '@mui/icons-material'],
          import: ['src/components/MaryImport'],
          admin: ['src/components/Admin'],
        },
      },
    },
  },
};
```

### 2. Lazy Loading Components

```javascript
// In your router/components
import { lazy, Suspense } from 'react';

const DataImportWizard = lazy(() => import('./components/MaryImport/DataImportWizard'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <DataImportWizard />
    </Suspense>
  );
}
```

### 3. Virtual Scrolling for Large Lists

```javascript
import { FixedSizeList as List } from 'react-window';

const ItemRow = ({ index, style, data }) => (
  <div style={style} className="table-row">
    {/* Render list item */}
  </div>
);

export default function VirtualizedTable({ items }) {
  return (
    <List height={600} itemCount={items.length} itemSize={35} width="100%" itemData={items}>
      {ItemRow}
    </List>
  );
}
```

### 4. Image Optimization

```javascript
// Use responsive images with srcset
export default function PropertyImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      srcSet={`${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`}
      sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
      loading="lazy"
      decoding="async"
    />
  );
}
```

### 5. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev vite-plugin-visualizer

# In vite.config.js
import { visualizer } from 'vite-plugin-visualizer';

export default {
  plugins: [visualizer()],
};

# Run build and open stats.html
npm run build
```

### 6. Caching Strategy

```javascript
// Service Worker caching (optional)
const CACHE_NAME = 'white-caves-v1';
const urlsToCache = ['/', '/index.html', '/styles/main.css', '/js/main.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

## Backend Performance

### 1. Database Indexing

```javascript
// In MongoDB models
const propertySchema = new Schema({
  location: { type: String, index: true },
  status: { type: String, index: true },
  owner: { type: Schema.Types.ObjectId, index: true, ref: 'Owner' },
  createdAt: { type: Date, index: true },
  price: { type: Number, index: true },
});

// Create compound indexes for common queries
propertySchema.index({ status: 1, createdAt: -1 });
propertySchema.index({ owner: 1, location: 1 });
```

### 2. API Response Pagination

```javascript
// routes/property-inventory.js
router.get('/properties', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Property.countDocuments();
    const properties = await Property.find().limit(limit).skip(skip).lean(); // Exclude mongoose overhead

    res.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### 3. Caching with Redis

```javascript
// Cache layer for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

async function getPropertiesWithCache(query) {
  const cacheKey = `properties:${JSON.stringify(query)}`;

  // Try to get from cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from database
  const properties = await Property.find(query);

  // Cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(properties));

  return properties;
}
```

### 4. Gzip Compression

```javascript
// server/index.js
const compression = require('compression');

app.use(
  compression({
    level: 6, // Balance between compression and speed
    threshold: 1024, // Only compress responses > 1KB
  })
);
```

### 5. Connection Pooling

```javascript
// MongoDB connection options
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10, // Max number of connections in pool
  minPoolSize: 5, // Min number of connections in pool
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### 6. Query Optimization

```javascript
// Use projection to select only needed fields
async function getPropertyList(query, limit) {
  return await Property.find(query)
    .select('location propertyType bedrooms price status') // Only these fields
    .limit(limit)
    .lean();
}

// Use aggregation for complex queries
async function getPropertyStats() {
  return await Property.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { count: -1 } },
  ]);
}
```

## Load Testing

### Run Load Tests with k6

```bash
# Install k6
npm install -g k6

# Run load test
k6 run test/performance/load-test.js

# With custom parameters
k6 run \
  --vus 50 \
  --duration 5m \
  -e API_URL=http://localhost:5000 \
  test/performance/load-test.js
```

### Analyze Results

```bash
# Export results to JSON
k6 run --out json=results.json test/performance/load-test.js

# Or to InfluxDB
k6 run -o influxdb=http://localhost:8086/k6 test/performance/load-test.js
```

## Monitoring & Profiling

### Node.js Profiling

```javascript
// Use Node.js built-in profiler
// Run with: node --prof app.js
// Generate profile: node --prof-process isolate-*.log > profile.txt
```

### APM Integration (Optional)

```javascript
// server/index.js
const apm = require('elastic-apm-node');

apm.start({
  serviceName: 'white-caves-api',
  serverUrl: 'http://localhost:8200',
});
```

### Database Monitoring

```javascript
// MongoDB performance monitoring
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');

  // Monitor slow queries
  db.setProfilingLevel(1, { slowms: 100 });
});
```

## Optimization Checklist

### Frontend

- [ ] Code splitting implemented
- [ ] Lazy loading for routes/components
- [ ] Virtual scrolling for large lists
- [ ] Images optimized with responsive srcset
- [ ] Bundle size analyzed and optimized
- [ ] Service worker for offline support
- [ ] CSS and JS minified
- [ ] CDN configured for static assets

### Backend

- [ ] Database indexes created for common queries
- [ ] API responses paginated
- [ ] Caching implemented (Redis)
- [ ] Gzip compression enabled
- [ ] Connection pooling configured
- [ ] Slow query logging enabled
- [ ] API rate limiting configured
- [ ] Response times monitored

### DevOps

- [ ] Docker multi-stage builds used
- [ ] Memory limits configured
- [ ] CPU limits configured
- [ ] Load balancer configured
- [ ] Auto-scaling policies defined
- [ ] Monitoring alerts configured
- [ ] Log aggregation setup

## Performance Targets

### Frontend Metrics

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s
- JavaScript bundle: < 150KB (gzipped)
- CSS bundle: < 50KB (gzipped)

### Backend Metrics

- API response time (p99): < 1s
- Database query time (p99): < 100ms
- Error rate: < 0.1%
- Uptime: 99.9%
- CPU usage: < 70%
- Memory usage: < 80%

## Resources

- Vite Performance Guide: https://vitejs.dev/guide/
- MongoDB Indexing: https://docs.mongodb.com/manual/indexes/
- k6 Load Testing: https://k6.io/docs/
- Web Vitals: https://web.dev/vitals/
- Node.js Performance: https://nodejs.org/en/docs/guides/nodejs-performance/
