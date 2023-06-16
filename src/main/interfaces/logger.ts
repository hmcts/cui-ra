export interface Logger {
  silly(arg: string): void;
  debug(arg: string): void;
  verbose(arg: string): void;
  info(arg: string): void;
  warn(arg: string): void;
  error(arg: string): void;
  log(arg: { level: 'silly' | 'debug' | 'verbose' | 'info' | 'warn' | 'error'; message: string }): void;
}
