# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the frontend (if using Vite or similar)
RUN npm run build 2>/dev/null || true

# Expose port 5000 for the backend API
EXPOSE 5000

# Expose port 3000 for the frontend dev server (if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
