import winston from 'winston';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const logDir = path.join(__dirname, 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'white-caves-api' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Console in development
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(
                ({ level, message, timestamp, ...meta }) => {
                  let metaStr = '';
                  if (Object.keys(meta).length > 0 && meta.service) {
                    const { service, ...rest } = meta;
                    metaStr = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
                  }
                  return `${timestamp} [${level}]: ${message}${metaStr}`;
                }
              )
            ),
          }),
        ]
      : []),
  ],
});

export default logger;
