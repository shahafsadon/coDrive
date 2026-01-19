/**
 * Logger Service
 * Centralized logging for debugging
 */

const isDevelopment = __DEV__; // Expo built-in for dev environment

const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

class Logger {
  constructor() {
    this.isDevelopment = isDevelopment;
  }

  log(level, tag, message, data = null) {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [${level}] [${tag}]`;

    if (data) {
      console.log(`${prefix}`, message, data);
    } else {
      console.log(`${prefix}`, message);
    }
  }

  debug(tag, message, data) {
    this.log(LogLevel.DEBUG, tag, message, data);
  }

  info(tag, message, data) {
    this.log(LogLevel.INFO, tag, message, data);
  }

  warn(tag, message, data) {
    console.warn(`[${tag}]`, message, data);
  }

  error(tag, message, data) {
    console.error(`[${tag}]`, message, data);
  }
}

export const logger = new Logger();

// Usage examples:
// logger.debug('Auth', 'User logged in', { userId: 123 });
// logger.info('API', 'Fetch user request');
// logger.warn('Navigation', 'Deep link not found');
// logger.error('Upload', 'Image upload failed', error);
