export function logInfo(message, data = {}) {
  const entry = {
    level: 'info',
    timestamp: new Date().toISOString(),
    message,
    ...data
  };
  console.info(JSON.stringify(entry));
}

export function logWarn(message, data = {}) {
  const entry = {
    level: 'warn',
    timestamp: new Date().toISOString(),
    message,
    ...data
  };
  console.warn(JSON.stringify(entry));
}
