# Quick Commands Reference

## Development

### Start Development Server

```bash
npm run dev
```

- Runs Vite development server
- Hot module reloading enabled
- Default: `http://localhost:5173`

### Start Both Client & Server

```bash
npm run dev:all
```

- Runs both Node.js server and Vite client simultaneously
- Uses `concurrently` package
- Perfect for full-stack development

### Start Production Server

```bash
npm start
```

- Runs `NODE_ENV=production node server/index.js`
- For production environment testing

---

## Building

### Build for Production

```bash
npm run build
```

- Runs Vite build
- Outputs to `dist/` folder
- Optimized JavaScript and CSS bundles

### Build for Vercel

```bash
npm run build:vercel
```

- Runs Vite build + API preparation
- Same as `npm run build`
- Used by Vercel during deployment

### Vercel Build Command (in vercel.json)

```
npm run build
```

- Output directory: `dist`
- Framework: Vite
- Node version: 22.x

---

## Testing

### Run Tests

```bash
npm test
```

- Runs Vitest in watch mode
- Watches for file changes

### Run Tests Once

```bash
npm run test:run
```

- Single test run (no watch)
- Good for CI/CD

### Generate Coverage Report

```bash
npm run test:coverage
```

- Generates code coverage report
- HTML coverage report with c8

### Interactive Test UI

```bash
npm run test:ui
```

- Opens Vitest UI dashboard
- Visual test result explorer

---

## Verification & Deployment

### Verify Deployment

```bash
npm run verify-deploy
```

- Checks deployment readiness
- Runs pre-deployment validation

### Validate Code

```bash
npm run validate
```

- Validates code structure
- Checks configuration files

---

## Database & Seeding

### Seed Database (Full)

```bash
npm run seed
```

- Seeds database with default dataset
- Clears existing data first

### Seed Database (Small)

```bash
npm run seed:small
```

- Seeds with 20 records
- For testing with limited data

### Seed Database (Large)

```bash
npm run seed:large
```

- Seeds with 200 records
- For load testing

---

## Vercel Configuration Details

### Build Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "env": {
    "NODE_VERSION": "22.x"
  }
}
```

### API Functions

- Runtime: Node.js v3.2.0
- Memory: 1024 MB per function
- Max Duration: 30 seconds
- Route: `/api/**/*.js`

### Rewrites

- `/api/(.*)` → `/api/index.js`
- `/((?!api/).*)` → `/index.html` (SPA routing)

### Security Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Asset Caching

- `/assets/(.*)` → Cache for 1 year (immutable)

---

## Server Scripts

### API Server

```bash
npm run server
```

- Runs Node.js server only
- File: `server/index.js`
- For backend development

### Client (Vite)

```bash
npm run client
```

- Runs Vite development server
- File: Frontend build tool
- Port: 5173

### Preview Production Build

```bash
npm run preview
```

- Previews Vite production build locally
- Serves from `dist/` folder

---

## Complete Development Workflow

### 1. Initial Setup

```bash
npm install
npm run seed:small        # Small dataset for testing
npm run dev:all           # Start both server and client
```

### 2. During Development

```bash
npm run dev:all           # Client + Server watch mode
npm run test              # Tests in watch mode (separate terminal)
```

### 3. Before Commit

```bash
npm run test:run          # Run all tests
npm run build             # Test production build
npm run validate          # Validate code
```

### 4. Before Vercel Deploy

```bash
npm run test:run          # All tests passing
npm run build:vercel      # Build for Vercel
npm run verify-deploy     # Final deployment check
```

### 5. Production Monitoring

```bash
npm start                 # Run production server
npm run verify-deploy     # Check deployment status
```

---

## Environment Requirements

| Tool    | Version  | Purpose             |
| ------- | -------- | ------------------- |
| Node.js | ≥ 20.x   | Runtime             |
| npm     | ≥ 10.0.0 | Package manager     |
| Vite    | ^7.3.1   | Frontend build tool |
| Vitest  | Latest   | Test framework      |
| React   | ^18.2.0  | UI library          |

---

## Port Mappings

| Service         | Port        | Command           |
| --------------- | ----------- | ----------------- |
| Frontend (Vite) | 5173        | `npm run dev`     |
| Backend Server  | 3000        | `npm run server`  |
| Both Together   | 5173 + 3000 | `npm run dev:all` |

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Kill process on port 3000
npx kill-port 3000
```

### Clear Node Modules & Reinstall

```bash
rm -r node_modules
npm install
```

### Clear Vite Cache

```bash
rm -r .vite
npm run dev
```

### Build Issues

```bash
npm run build
# If errors: check dist/ folder was created
ls dist/
```

---

**Last Updated:** January 17, 2026  
**Status:** Ready for Week 2 Testing
