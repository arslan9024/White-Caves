/**
 * Manual mock for winston (not installed)
 * Prevents Vite from failing when winston is imported in legacy files
 */
const mockLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  verbose: () => {},
  silly: () => {},
  log: () => {},
  add: () => {},
  remove: () => {},
};

export const createLogger = () => mockLogger;
export const transports = {
  Console: class Console {},
  File: class File {},
  Http: class Http {},
};
export const format = {
  combine: (...args) => args[0],
  timestamp: () => ({}),
  json: () => ({}),
  colorize: () => ({}),
  printf: fn => fn,
  simple: () => ({}),
  errors: () => ({}),
  splat: () => ({}),
  label: () => ({}),
};
export const config = {
  npm: { levels: {} },
  syslog: { levels: {} },
};

export default {
  createLogger,
  transports,
  format,
  config,
};
