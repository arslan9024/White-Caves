class RateLimiter {
  constructor() {
    this.defaultConfig = {
      minDelayMs: 120000,
      maxDelayMs: 300000,
      speed: 1,
      shiftStart: 8,
      shiftEnd: 19,
      lunchStart: 13,
      lunchEnd: 14,
      respectLunchBreak: false
    };
  }

  calculateDelay(config = {}) {
    const settings = { ...this.defaultConfig, ...config };
    const baseDelay = Math.floor(
      Math.random() * (settings.maxDelayMs - settings.minDelayMs) + settings.minDelayMs
    );
    return Math.floor(baseDelay / settings.speed);
  }

  isWithinWorkingHours(config = {}) {
    const settings = { ...this.defaultConfig, ...config };
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < settings.shiftStart || hour >= settings.shiftEnd) {
      return { allowed: false, reason: 'outside_shift', nextAllowedHour: settings.shiftStart };
    }
    
    if (settings.respectLunchBreak && hour >= settings.lunchStart && hour < settings.lunchEnd) {
      return { allowed: false, reason: 'lunch_break', nextAllowedHour: settings.lunchEnd };
    }
    
    return { allowed: true, reason: null };
  }

  getTimeUntilNextWindow(config = {}) {
    const status = this.isWithinWorkingHours(config);
    
    if (status.allowed) {
      return 0;
    }

    const now = new Date();
    const next = new Date(now);
    
    if (status.reason === 'outside_shift') {
      if (now.getHours() >= this.defaultConfig.shiftEnd) {
        next.setDate(next.getDate() + 1);
      }
      next.setHours(status.nextAllowedHour, 0, 0, 0);
    } else if (status.reason === 'lunch_break') {
      next.setHours(status.nextAllowedHour, 0, 0, 0);
    }
    
    return next.getTime() - now.getTime();
  }

  async waitForNextWindow(config = {}) {
    const waitMs = this.getTimeUntilNextWindow(config);
    if (waitMs > 0) {
      console.log(`RateLimiter: Waiting ${this.formatDuration(waitMs)} until next window`);
      await this.sleep(waitMs);
    }
    return true;
  }

  async delay(config = {}) {
    const status = this.isWithinWorkingHours(config);
    
    if (!status.allowed) {
      await this.waitForNextWindow(config);
    }
    
    const delayMs = this.calculateDelay(config);
    console.log(`RateLimiter: Delaying for ${this.formatDuration(delayMs)}`);
    await this.sleep(delayMs);
    return delayMs;
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getScheduleInfo(config = {}) {
    const settings = { ...this.defaultConfig, ...config };
    const status = this.isWithinWorkingHours(config);
    const now = new Date();
    
    return {
      currentTime: now.toLocaleTimeString(),
      currentHour: now.getHours(),
      isWorkingHours: status.allowed,
      reason: status.reason,
      shiftStart: settings.shiftStart,
      shiftEnd: settings.shiftEnd,
      lunchBreak: settings.respectLunchBreak ? {
        start: settings.lunchStart,
        end: settings.lunchEnd
      } : null,
      nextWindowIn: status.allowed ? null : this.formatDuration(this.getTimeUntilNextWindow(config)),
      speed: settings.speed,
      delayRange: {
        min: this.formatDuration(settings.minDelayMs / settings.speed),
        max: this.formatDuration(settings.maxDelayMs / settings.speed)
      }
    };
  }
}

export default new RateLimiter();
