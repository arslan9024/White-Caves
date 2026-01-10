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
    
    const job = cron.schedule(cronExpression, async () => {
      console.log('[Scheduler] Running Olivia featured properties selection...');
      const startTime = Date.now();
      
      try {
        const result = await OliviaService.selectDailyFeaturedProperties();
        
        if (result.success) {
          console.log(`[Scheduler] Olivia selected ${result.count} featured properties in ${Date.now() - startTime}ms`);
        } else {
          console.error('[Scheduler] Olivia selection failed:', result.message);
        }
      } catch (error) {
        console.error('[Scheduler] Error in Olivia scheduled task:', error.message);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Dubai'
    });

    this.jobs.set('olivia-featured-properties', {
      job,
      name: 'Olivia Featured Properties Selection',
      schedule: '3:00 AM Dubai Time (daily)',
      cronExpression,
      lastRun: null,
      nextRun: this.getNextRunTime(cronExpression, 'Asia/Dubai')
    });

    console.log('[Scheduler] Olivia featured properties job scheduled for 3:00 AM Dubai time');
  }

  getNextRunTime(cronExpression, timezone) {
    const now = new Date();
    const dubaiOffset = 4 * 60;
    const localOffset = now.getTimezoneOffset();
    const dubaiTime = new Date(now.getTime() + (dubaiOffset + localOffset) * 60000);
    
    const nextRun = new Date(dubaiTime);
    nextRun.setHours(3, 0, 0, 0);
    
    if (dubaiTime.getHours() >= 3) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun.toISOString();
  }

  getJobStatus() {
    const status = [];
    
    for (const [id, jobInfo] of this.jobs) {
      status.push({
        id,
        name: jobInfo.name,
        schedule: jobInfo.schedule,
        cronExpression: jobInfo.cronExpression,
        nextRun: jobInfo.nextRun,
        lastRun: jobInfo.lastRun
      });
    }
    
    return status;
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
