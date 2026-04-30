type LogLevel = 'debug' | 'error' | 'info' | 'warn';

function buildLogPrefix(scope: string) {
  return `[Kronos][${scope}]`;
}

function writeLog(level: LogLevel, scope: string, message: string, error?: unknown) {
  const prefix = buildLogPrefix(scope);

  if (error === undefined) {
    console[level](`${prefix} ${message}`);
    return;
  }

  console[level](`${prefix} ${message}`, error);
}

export const logger = {
  debug(scope: string, message: string, payload?: unknown) {
    if (!__DEV__) {
      return;
    }

    writeLog('debug', scope, message, payload);
  },
  error(scope: string, message: string, error?: unknown) {
    writeLog('error', scope, message, error);
  },
  info(scope: string, message: string, payload?: unknown) {
    if (!__DEV__) {
      return;
    }

    writeLog('info', scope, message, payload);
  },
  warn(scope: string, message: string, payload?: unknown) {
    writeLog('warn', scope, message, payload);
  },
};
