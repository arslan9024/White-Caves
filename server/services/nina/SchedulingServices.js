import { EventEmitter } from 'events';

class ISOCountryMapper extends EventEmitter {
  constructor() {
    super();
    this.countryData = {
      '971': { alpha2: 'AE', countryName: 'United Arab Emirates', nationality: 'Emirati', primaryTimezone: 'Asia/Dubai', businessHours: { start: 9, end: 18 }, weekend: [5, 6] },
      '966': { alpha2: 'SA', countryName: 'Saudi Arabia', nationality: 'Saudi', primaryTimezone: 'Asia/Riyadh', businessHours: { start: 8, end: 17 }, weekend: [5, 6] },
      '965': { alpha2: 'KW', countryName: 'Kuwait', nationality: 'Kuwaiti', primaryTimezone: 'Asia/Kuwait', businessHours: { start: 8, end: 17 }, weekend: [5, 6] },
      '974': { alpha2: 'QA', countryName: 'Qatar', nationality: 'Qatari', primaryTimezone: 'Asia/Qatar', businessHours: { start: 8, end: 17 }, weekend: [5, 6] },
      '973': { alpha2: 'BH', countryName: 'Bahrain', nationality: 'Bahraini', primaryTimezone: 'Asia/Bahrain', businessHours: { start: 8, end: 17 }, weekend: [5, 6] },
      '968': { alpha2: 'OM', countryName: 'Oman', nationality: 'Omani', primaryTimezone: 'Asia/Muscat', businessHours: { start: 8, end: 17 }, weekend: [5, 6] },
      '91': { alpha2: 'IN', countryName: 'India', nationality: 'Indian', primaryTimezone: 'Asia/Kolkata', businessHours: { start: 9, end: 18 }, weekend: [0, 6] },
      '92': { alpha2: 'PK', countryName: 'Pakistan', nationality: 'Pakistani', primaryTimezone: 'Asia/Karachi', businessHours: { start: 9, end: 18 }, weekend: [5, 6] },
      '44': { alpha2: 'GB', countryName: 'United Kingdom', nationality: 'British', primaryTimezone: 'Europe/London', businessHours: { start: 9, end: 17 }, weekend: [0, 6] },
      '1': { alpha2: 'US', countryName: 'United States', nationality: 'American', primaryTimezone: 'America/New_York', businessHours: { start: 9, end: 17 }, weekend: [0, 6] },
      '86': { alpha2: 'CN', countryName: 'China', nationality: 'Chinese', primaryTimezone: 'Asia/Shanghai', businessHours: { start: 9, end: 18 }, weekend: [0, 6] },
      '63': { alpha2: 'PH', countryName: 'Philippines', nationality: 'Filipino', primaryTimezone: 'Asia/Manila', businessHours: { start: 8, end: 17 }, weekend: [0, 6] },
      '20': { alpha2: 'EG', countryName: 'Egypt', nationality: 'Egyptian', primaryTimezone: 'Africa/Cairo', businessHours: { start: 9, end: 17 }, weekend: [5, 6] },
      '962': { alpha2: 'JO', countryName: 'Jordan', nationality: 'Jordanian', primaryTimezone: 'Asia/Amman', businessHours: { start: 8, end: 17 }, weekend: [5, 6] },
      '961': { alpha2: 'LB', countryName: 'Lebanon', nationality: 'Lebanese', primaryTimezone: 'Asia/Beirut', businessHours: { start: 8, end: 17 }, weekend: [0, 6] },
      '33': { alpha2: 'FR', countryName: 'France', nationality: 'French', primaryTimezone: 'Europe/Paris', businessHours: { start: 9, end: 18 }, weekend: [0, 6] },
      '49': { alpha2: 'DE', countryName: 'Germany', nationality: 'German', primaryTimezone: 'Europe/Berlin', businessHours: { start: 9, end: 17 }, weekend: [0, 6] },
      '7': { alpha2: 'RU', countryName: 'Russia', nationality: 'Russian', primaryTimezone: 'Europe/Moscow', businessHours: { start: 9, end: 18 }, weekend: [0, 6] }
    };
  }

  analyzeNumber(fullNumber) {
    const cleanNumber = fullNumber.replace(/\D/g, '');
    const sortedCodes = Object.keys(this.countryData).sort((a, b) => b.length - a.length);
    
    for (const code of sortedCodes) {
      if (cleanNumber.startsWith(code)) {
        const data = this.countryData[code];
        return {
          countryCode: code,
          ...data,
          localNumber: cleanNumber.substring(code.length)
        };
      }
    }
    
    return {
      countryCode: 'Unknown',
      countryName: 'Unknown',
      nationality: 'Unknown',
      primaryTimezone: 'UTC',
      localNumber: cleanNumber
    };
  }
}

class LocalTimeScheduler extends EventEmitter {
  constructor() {
    super();
    this.countryMapper = new ISOCountryMapper();
  }

  getLocalTime(timezone) {
    const now = new Date();
    try {
      return new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    } catch {
      return now;
    }
  }

  isGoodTimeToSend(phoneNumber) {
    const info = this.countryMapper.analyzeNumber(phoneNumber);
    const localTime = this.getLocalTime(info.primaryTimezone || 'UTC');
    const hour = localTime.getHours();
    const day = localTime.getDay();

    const weekend = info.weekend || [0, 6];
    if (weekend.includes(day)) {
      return { allowed: false, reason: 'Weekend in target locale', nextWindow: this.getNextWorkingDay(localTime, weekend) };
    }

    const businessHours = info.businessHours || { start: 9, end: 17 };
    if (hour < businessHours.start) {
      return { allowed: false, reason: 'Before business hours', delayMinutes: (businessHours.start - hour) * 60 };
    }
    if (hour >= businessHours.end) {
      return { allowed: false, reason: 'After business hours', delayMinutes: (24 - hour + businessHours.start) * 60 };
    }

    if (hour >= 12 && hour < 13) {
      return { allowed: false, reason: 'Lunch break', delayMinutes: (13 - hour) * 60 };
    }

    return { allowed: true, localTime: localTime.toISOString(), timezone: info.primaryTimezone };
  }

  getNextWorkingDay(date, weekend) {
    const nextDay = new Date(date);
    do {
      nextDay.setDate(nextDay.getDate() + 1);
    } while (weekend.includes(nextDay.getDay()));
    nextDay.setHours(9, 0, 0, 0);
    return nextDay.toISOString();
  }
}

class StrictScheduleManager extends EventEmitter {
  constructor() {
    super();
    this.schedules = {
      offHours: [
        { start: '22:00', end: '08:00', label: 'Night Off' },
        { start: '12:00', end: '13:00', label: 'Lunch Break' }
      ],
      weekends: {
        friday: { enabled: false, label: 'Friday Off' },
        saturday: { enabled: false, label: 'Saturday Off' }
      },
      timeBasedLimits: [
        { time: '08:00-12:00', maxPerHour: 20, label: 'Morning' },
        { time: '13:00-15:00', maxPerHour: 15, label: 'Early Afternoon' },
        { time: '15:00-19:00', maxPerHour: 25, label: 'Afternoon Peak' }
      ]
    };
    
    this.hourlyCounts = {};
    this.dailyCounts = {};
  }

  isWithinSchedule(start, end) {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(start.replace(':', ''));
    const endTime = parseInt(end.replace(':', ''));
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  isOffHour() {
    const now = new Date();
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 5 && !this.schedules.weekends.friday.enabled) {
      return { isOff: true, reason: 'Friday Off' };
    }
    if (dayOfWeek === 6 && !this.schedules.weekends.saturday.enabled) {
      return { isOff: true, reason: 'Saturday Off' };
    }

    for (const period of this.schedules.offHours) {
      if (this.isWithinSchedule(period.start, period.end)) {
        return { isOff: true, reason: period.label };
      }
    }

    return { isOff: false };
  }

  canSendMessage() {
    const offCheck = this.isOffHour();
    if (offCheck.isOff) {
      return { allowed: false, reason: `Schedule restriction: ${offCheck.reason}` };
    }

    const hour = new Date().getHours();
    const limit = this.getCurrentTimeLimit();
    
    if (!this.hourlyCounts[hour]) this.hourlyCounts[hour] = 0;
    if (this.hourlyCounts[hour] >= limit.maxPerHour) {
      return { allowed: false, reason: `Hourly limit reached (${limit.maxPerHour}/hour)` };
    }

    return { allowed: true };
  }

  recordMessageSent() {
    const hour = new Date().getHours();
    const today = new Date().toDateString();
    
    this.hourlyCounts[hour] = (this.hourlyCounts[hour] || 0) + 1;
    this.dailyCounts[today] = (this.dailyCounts[today] || 0) + 1;
  }

  getCurrentTimeLimit() {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    for (const limit of this.schedules.timeBasedLimits) {
      const [start, end] = limit.time.split('-');
      const startTime = parseInt(start.replace(':', ''));
      const endTime = parseInt(end.replace(':', ''));
      
      if (currentTime >= startTime && currentTime <= endTime) {
        return limit;
      }
    }
    
    return { maxPerHour: 15, label: 'Default' };
  }

  getStats() {
    const today = new Date().toDateString();
    return {
      todaySent: this.dailyCounts[today] || 0,
      currentHourSent: this.hourlyCounts[new Date().getHours()] || 0,
      currentLimit: this.getCurrentTimeLimit(),
      isWorkingHours: !this.isOffHour().isOff
    };
  }
}

class BehavioralSimulator extends EventEmitter {
  constructor() {
    super();
    this.humanPatterns = {
      typingSpeed: { slow: { min: 50, max: 150 }, medium: { min: 30, max: 80 }, fast: { min: 20, max: 50 } },
      responseTime: { immediate: { min: 1000, max: 3000 }, normal: { min: 5000, max: 30000 }, slow: { min: 30000, max: 120000 } }
    };
  }

  simulateTypingDelay(message) {
    const length = message.length;
    const charsPerMinute = 200 + Math.random() * 100;
    const baseTime = (length / charsPerMinute) * 60000;
    
    const pauseCount = Math.floor(length / 50);
    const pauseTime = pauseCount * (500 + Math.random() * 1500);
    
    return Math.min(30000, Math.max(1000, baseTime + pauseTime));
  }

  getNaturalDelay() {
    const hour = new Date().getHours();
    let pattern;
    
    if (hour >= 9 && hour < 12) pattern = this.humanPatterns.responseTime.normal;
    else if (hour >= 14 && hour < 18) pattern = this.humanPatterns.responseTime.immediate;
    else pattern = this.humanPatterns.responseTime.slow;
    
    return pattern.min + Math.random() * (pattern.max - pattern.min);
  }

  getRandomizedInterval(baseMs) {
    const variance = 0.3;
    const minFactor = 1 - variance;
    const maxFactor = 1 + variance;
    
    return baseMs * (minFactor + Math.random() * (maxFactor - minFactor));
  }
}

class OptOutDetector extends EventEmitter {
  constructor() {
    super();
    this.optOutKeywords = {
      en: ['stop', 'unsubscribe', 'remove', 'do not send', 'opt-out', 'no more', 'cancel', 'quit'],
      ar: ['توقف', 'إلغاء الاشتراك', 'إزالة', 'لا ترسل']
    };
  }

  async checkOptOutStatus(messages) {
    for (const msg of messages) {
      if (msg.fromMe) continue;
      
      const bodyLower = msg.body?.toLowerCase() || '';
      
      for (const keyword of this.optOutKeywords.en) {
        if (bodyLower.includes(keyword)) {
          return {
            optedOut: true,
            reason: `User requested removal via keyword: "${keyword}"`,
            message: msg.body.substring(0, 100),
            timestamp: msg.timestamp || new Date().toISOString()
          };
        }
      }

      for (const keyword of this.optOutKeywords.ar) {
        if (msg.body?.includes(keyword)) {
          return {
            optedOut: true,
            reason: `User requested removal via Arabic keyword`,
            message: msg.body.substring(0, 100),
            timestamp: msg.timestamp || new Date().toISOString()
          };
        }
      }
    }
    
    return { optedOut: false, lastChecked: new Date().toISOString() };
  }
}

export const countryMapper = new ISOCountryMapper();
export const localTimeScheduler = new LocalTimeScheduler();
export const strictScheduleManager = new StrictScheduleManager();
export const behavioralSimulator = new BehavioralSimulator();
export const optOutDetector = new OptOutDetector();

export default {
  countryMapper,
  localTimeScheduler,
  strictScheduleManager,
  behavioralSimulator,
  optOutDetector
};
