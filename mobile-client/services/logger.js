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
    // Disabled for production
    return;
  }

  debug(tag, message, data) {
    // Disabled for production
    return;
  }

  info(tag, message, data) {
    // Disabled for production
    return;
  }

  warn(tag, message, data) {
    // Disabled for production
    return;
  }

  error(tag, message, data) {
    // Keep errors in production
    if (this.isDevelopment) {
      console.error(`[${tag}]`, message, data);
    }
  }
}

export const logger = new Logger();

// Usage examples:
// logger.debug('Auth', 'User logged in', { userId: 123 });
// logger.info('API', 'Fetch user request');
// logger.warn('Navigation', 'Deep link not found');
// logger.error('Upload', 'Image upload failed', error);
