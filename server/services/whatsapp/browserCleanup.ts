/**
 * Browser Cleanup Utility
 * Handles browser process lock issues and ensures clean shutdown.
 * Strictly kills ONLY Chrome/Chromium binaries; NEVER touches node.exe.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Kill any hanging browser processes safely.
 * Never kills node.exe to avoid bringing down the backend server.
 */
export async function killBrowserProcesses(): Promise<void> {
  try {
    if (process.platform === 'win32') {
      // Windows — kill only Chrome/Chromium
      await execAsync('taskkill /F /IM chrome.exe 2>nul', { windowsHide: true }).catch(() => {});
      await execAsync('taskkill /F /IM chromium.exe 2>nul', { windowsHide: true }).catch(() => {});
    } else {
      // Linux/Mac — kill only Chrome/Chromium
      await execAsync('pkill -9 chrome').catch(() => {});
      await execAsync('pkill -9 chromium').catch(() => {});
    }
  } catch (error) {
    // Non-fatal warning
  }
}

/**
 * Clean up hanging Chromium lock files in session directory.
 */
export async function cleanupSessionLocks(sessionDir: string): Promise<void> {
  try {
    if (!fs.existsSync(sessionDir)) return;
    const lockFiles = ['SingletonLock', 'SingletonSocket', 'SingletonCookie'];
    for (const lock of lockFiles) {
      const lockPath = path.join(sessionDir, lock);
      if (fs.existsSync(lockPath)) {
        try {
          fs.unlinkSync(lockPath);
        } catch {
          // Ignore if locked
        }
      }
    }
  } catch {
    // Non-fatal
  }
}
