import pino from 'pino';

// Backend logger – JSON output for aggregation services
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  base: { pid: process.pid },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
