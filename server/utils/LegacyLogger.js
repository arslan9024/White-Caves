/**
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
      ...data,
    });
  }

  static debug(message, data = {}) {
    if (process.env.DEBUG) {
      this.log(this.DEBUG, message, data);
    }
  }
}

export default Logger;
