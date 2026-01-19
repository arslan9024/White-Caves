#!/usr/bin/env node

/**
 * Standalone Test for Relational Sidebar API
 * Tests the relational-sidebar routes without the full server
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Import relational sidebar routes
import relationalSidebarRoutes from './server/routes/relational-sidebar.js';

// Register routes
app.use('/api/relational-sidebar', relationalSidebarRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Relational Sidebar API Server Running`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`\n📍 Available Endpoints:`);
  console.log(`   GET  /api/relational-sidebar/health`);
  console.log(`   GET  /api/relational-sidebar/departments`);
  console.log(`   GET  /api/relational-sidebar/departments/:id`);
  console.log(`   GET  /api/relational-sidebar/assistants`);
  console.log(`   GET  /api/relational-sidebar/assistants/:id`);
  console.log(`   GET  /api/relational-sidebar/assistants/:id/contexts/:context`);
  console.log(`   POST /api/relational-sidebar/assistants/:id/notifications\n`);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Server shutting down gracefully...');
  process.exit(0);
});
