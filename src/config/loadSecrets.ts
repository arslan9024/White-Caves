import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

/**
 * Load environment variables from the `secrets/.env` file.
 * This is used by server‑side code (Node) and by Vite's client bundle
 * (via `import.meta.env`). The loader is intentionally tiny – it only
 * reads the file once at module import time, then leaves the variables
 * in `process.env` for the rest of the application.
 */
export function loadSecrets(): void {
  const envPath = fileURLToPath(new URL('../../secrets/.env', import.meta.url));
  dotenv.config({ path: envPath });
}

// Immediately load when this module is imported.
loadSecrets();
