// src/server/config/serviceConfig.js

import path from 'path';
import fs from 'fs';

/**
 * Load service configuration from JSON file.
 * Essential services are always enabled on startup.
 * Optional services can be toggled at runtime via the status API.
 */
const configPath = path.resolve(__dirname, 'servicesConfig.json');
let essential = [];
if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const cfg = JSON.parse(raw);
    essential = cfg.essential || [];
  } catch (e) {
    console.warn('Failed to parse servicesConfig.json, falling back to defaults');
  }
}
export const enabledServices = new Set(essential);
