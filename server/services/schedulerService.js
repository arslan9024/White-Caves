import cron from 'node-cron';
import OliviaService from './oliviaService.js';

class SchedulerService {
  constructor() {
    this.jobs = new Map();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) {
      console.log('[Scheduler] Already initialized');
      return;
    }

    console.log('[Scheduler] Initializing scheduled tasks...');
    
    this.scheduleOliviaFeaturedProperties();
    
    this.isInitialized = true;
    console.log('[Scheduler] All scheduled tasks registered');
  }

  scheduleOliviaFeaturedProperties() {
    const cronExpression = '0 3 * * *';
    const jobId = 'olivia-featured-properties';
    
    const jobInfo = {
      job: null,
      name: 'Olivia Featured Properties Selection',
      schedule: '3:00 AM Dubai Time (daily)',
      cronExpression,
      timezone: 'Asia/Dubai',
      lastRun: null,
      nextRun: this.calculateNextRun3AM()
    };
    
    jobInfo.job = cron.schedule(cronExpression, async () => {
      console.log('[Scheduler] Running Olivia featured properties selection...');
      const startTime = Date.now();
      
      try {
        const result = await OliviaService.selectDailyFeaturedProperties();
        
        jobInfo.lastRun = new Date().toISOString();
        jobInfo.nextRun = this.calculateNextRun3AM();
        
        if (result.success) {
          console.log(`[Scheduler] Olivia selected ${result.count} featured properties in ${Date.now() - startTime}ms`);
        } else {
          console.error('[Scheduler] Olivia selection failed:', result.message);
        }
      } catch (error) {
        console.error('[Scheduler] Error in Olivia scheduled task:', error.message);
        jobInfo.lastRun = new Date().toISOString();
        jobInfo.nextRun = this.calculateNextRun3AM();
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Dubai'
    });

    this.jobs.set(jobId, jobInfo);
    console.log('[Scheduler] Olivia featured properties job scheduled for 3:00 AM Dubai time');
  }

  calculateNextRun3AM() {
    const now = new Date();
    
    const dubaiFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dubai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const parts = dubaiFormatter.formatToParts(now);
    const dubaiParts = {};
    for (const part of parts) {
      dubaiParts[part.type] = part.value;
    }
    
    const dubaiHour = parseInt(dubaiParts.hour);
    
    const nextRun = new Date(now);
    
    if (dubaiHour >= 3) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const dubaiDate = new Date(nextRun.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
    dubaiDate.setHours(3, 0, 0, 0);
    
    const utcHour = 3 - 4;
    const utcDate = new Date(nextRun);
    utcDate.setUTCHours(utcHour < 0 ? 24 + utcHour : utcHour, 0, 0, 0);
    
    if (dubaiHour >= 3) {
      utcDate.setUTCDate(utcDate.getUTCDate() + 1);
    }
    
    return utcDate.toISOString();
  }

  getJobStatus() {
    const status = [];
    
    for (const [id, jobInfo] of this.jobs) {
      status.push({
        id,
        name: jobInfo.name,
        schedule: jobInfo.schedule,
        cronExpression: jobInfo.cronExpression,
        timezone: jobInfo.timezone,
        nextRun: jobInfo.nextRun,
        nextRunLocal: this.formatDubaiTime(jobInfo.nextRun),
        lastRun: jobInfo.lastRun,
        lastRunLocal: jobInfo.lastRun ? this.formatDubaiTime(jobInfo.lastRun) : null
      });
    }
    
    return status;
  }

  formatDubaiTime(isoString) {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleString('en-AE', { 
      timeZone: 'Asia/Dubai',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  async runJobNow(jobId) {
    const jobInfo = this.jobs.get(jobId);
    if (!jobInfo) {
      return { success: false, message: `Job ${jobId} not found` };
    }

    console.log(`[Scheduler] Manually triggering job: ${jobInfo.name}`);
    
    if (jobId === 'olivia-featured-properties') {
      try {
        const result = await OliviaService.selectDailyFeaturedProperties();
        jobInfo.lastRun = new Date().toISOString();
        jobInfo.nextRun = this.calculateNextRun3AM();
        return result;
      } catch (error) {
        return { success: false, message: error.message };
      }
    }

    return { success: false, message: 'Unknown job type' };
  }

  stopAll() {
    console.log('[Scheduler] Stopping all scheduled jobs...');
    
    for (const [id, jobInfo] of this.jobs) {
      if (jobInfo.job) {
        jobInfo.job.stop();
        console.log(`[Scheduler] Stopped job: ${id}`);
      }
    }
    
    this.jobs.clear();
    this.isInitialized = false;
  }
}

const schedulerService = new SchedulerService();
export default schedulerService;
