# White Caves Real Estate - Deployment Guide

## Vercel Deployment (Frontend)

### Prerequisites
- GitHub repository connected to Vercel
- Vercel account

### Steps

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework

2. **Configure Environment Variables**
   In Vercel Project Settings > Environment Variables, add:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
   VITE_WHATSAPP_NUMBER=971563616136
   ```

3. **Deploy**
   - Push to main branch or click "Deploy"
   - Vercel will build and deploy automatically

### Build Configuration
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Custom Domain
1. Go to Project Settings > Domains
2. Add your domain (e.g., whitecaves.com)
3. Configure DNS records as instructed by Vercel

## Backend Deployment

The backend Express server needs separate deployment. Options:

### Option 1: Vercel Serverless Functions
Convert Express routes to `/api` serverless functions in the `api/` directory.

### Option 2: Railway or Render
Deploy the Express backend separately:
1. Set environment variables:
   - `MONGODB_URI`
   - `STRIPE_SECRET_KEY`
   - `NODE_ENV=production`
2. Build command: none (Node.js runtime)
3. Start command: `node server/index.js`

### Option 3: Replit Deployment
Use Replit's built-in deployment for full-stack hosting.

## Replit Deployment (Full Stack)

For full-stack deployment with both frontend and backend:

1. Click "Deploy" in Replit
2. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Set environment secrets in Replit Secrets tab
4. Deploy!

## Testing Locally

```bash
# Development (both frontend and backend)
npm run dev:all

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm start
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | Yes |
| `VITE_WHATSAPP_NUMBER` | WhatsApp support number | No |
| `MONGODB_URI` | MongoDB connection string | Yes (backend) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes (backend) |

## Troubleshooting

### White Screen on Deploy
- Check browser console for errors
- Verify all environment variables are set
- Ensure build completed successfully

### API Calls Failing
- Verify backend is deployed and accessible
- Check CORS configuration
- Verify API URL environment variable

### Routing Issues
- The `vercel.json` contains rewrites for SPA routing
- API routes are preserved with `/api/*` pattern
