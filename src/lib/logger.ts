/**
 * Centralized logging utility with environment-based log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getLogLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (envLevel && ['debug', 'info', 'warn', 'error'].includes(envLevel)) {
    return envLevel as LogLevel;
  }
  // Default: errors only in production, all logs in development
  return process.env.NODE_ENV === 'production' ? 'error' : 'debug';
};

const shouldLog = (level: LogLevel): boolean => {
  const currentLevel = getLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const createLogger = (): Logger => {
  return {
    debug: (...args: unknown[]) => {
      if (shouldLog('debug')) {
        console.debug('[DEBUG]', ...args);
      }
    },
    info: (...args: unknown[]) => {
      if (shouldLog('info')) {
        console.info('[INFO]', ...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (shouldLog('warn')) {
        console.warn('[WARN]', ...args);
      }
    },
    error: (...args: unknown[]) => {
      if (shouldLog('error')) {
        console.error('[ERROR]', ...args);
      }
    },
  };
};

export const logger = createLogger();

