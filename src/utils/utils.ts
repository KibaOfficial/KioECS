// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    // Set global flag for debug mode
    window.__KIOECS_DEBUG__ = (level === 'debug');
    this.log('info', `Log level set to: ${level.toUpperCase()}`);
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  log(type: LogLevel, message: string): void {
    if (this.levels[type] >= this.levels[this.logLevel]) {
      const time = new Date().toISOString();
      const style = this.getStyle(type);
      console.log(`%c[KioECS] [${time}] [${type.toUpperCase()}] ${message}`, style);
    }
  }

  private getStyle(type: LogLevel): string {
    switch (type) {
      case 'debug':
        return 'color: #6b7280';
      case 'info':
        return 'color: #3b82f6';
      case 'warn':
        return 'color: #f59e0b';
      case 'error':
        return 'color: #ef4444; font-weight: bold';
      default:
        return '';
    }
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function logger(type: LogLevel, message: string): void {
  Logger.getInstance().log(type, message);
}

export function setLogLevel(level: LogLevel): void {
  Logger.getInstance().setLogLevel(level);
}