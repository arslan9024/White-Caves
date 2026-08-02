#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const files = {
  'server/constants/ScoreLevels.js': `/**
 * Scoring Constants - Priority 5
 * Centralized score thresholds and status enums
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  STRONG: 75,
  GOOD: 65,
  FAIR: 50,
  POOR: 0
};

export const SCREENING_STATUS = {
  PENDING: 'pending',
  STRONG_MATCH: 'strong_match',
  MODERATE_MATCH: 'moderate_match',
  WEAK_MATCH: 'weak_match',
  REJECTED: 'rejected',
  DECLINED_INTERVIEW: 'declined_interview'
};

export const INTERVIEW_STATUS = {
  PENDING: 'pending_scheduling',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
  DECLINED: 'declined',
  CANCELLED: 'cancelled'
};

export const DEGREE_HIERARCHY = {
  'PHD': 5,
  'MASTER': 4,
  'BACHELOR': 3,
  'DIPLOMA': 2,
  'HIGHSCHOOL': 1,
  'OTHER': 0
};

export const INTERVIEW_DURATION_MINUTES = 45;
export const DEFAULT_EDUCATION_SCORE = 40;
export const RESUME_CACHE_TTL_MS = 3600000;
export const WHATSAPP_NUMBER = '+971505110636';

export default {
  SCORE_THRESHOLDS,
  SCREENING_STATUS,
  INTERVIEW_STATUS,
  DEGREE_HIERARCHY,
  INTERVIEW_DURATION_MINUTES,
  DEFAULT_EDUCATION_SCORE,
  RESUME_CACHE_TTL_MS,
  WHATSAPP_NUMBER
};
`,
  'server/utils/Logger.js': `/**
 * Structured Logger - Priority 5
 * Provides JSON-formatted logging with levels
 */
class Logger {
  static INFO = 'INFO';
  static WARN = 'WARN';
  static ERROR = 'ERROR';
  static DEBUG = 'DEBUG';

  static log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, ...data };
    const output = JSON.stringify(logEntry, null, 2);
    
    if (level === this.ERROR) console.error(output);
    else if (level === this.WARN) console.warn(output);
    else console.log(output);
  }

  static info(message, data = {}) {
    this.log(this.INFO, message, data);
  }

  static warn(message, data = {}) {
    this.log(this.WARN, message, data);
  }

  static error(message, error = null, data = {}) {
    this.log(this.ERROR, message, {
      error: error?.message,
      stack: error?.stack,
      ...data
    });
  }

  static debug(message, data = {}) {
    if (process.env.DEBUG) {
      this.log(this.DEBUG, message, data);
    }
  }
}

export default Logger;
`
};

console.log('\n' + '='.repeat(60));
console.log('🚀 PRIORITY 5: Creating Constants & Logger');
console.log('='.repeat(60) + '\n');

let created = 0;
const errors = [];

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(projectRoot, filePath);
  const dir = path.dirname(fullPath);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${filePath} (exists)`);
      return;
    }
    fs.writeFileSync(fullPath, content, 'utf-8');
    created++;
    console.log(`✅ Created: ${filePath}`);
  } catch (error) {
    errors.push({ file: filePath });
    console.log(`❌ Failed: ${filePath}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Created: ${created}/${Object.keys(files).length}`);
console.log('='.repeat(60) + '\n');
process.exit(errors.length > 0 ? 1 : 0);
