import * as functionsLogger from "firebase-functions/logger";

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  timestamp: string;
  level: LogLevel;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
}

class Logger {
  private formatPayload(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error | unknown
  ): LogPayload {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    };

    if (error) {
      if (error instanceof Error) {
        payload.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else {
        payload.error = {
          message: String(error),
        };
      }
    }

    return payload;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== "production") {
      const payload = this.formatPayload("debug", message, context);
      functionsLogger.debug(payload);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const payload = this.formatPayload("info", message, context);
    functionsLogger.info(payload);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error | unknown): void {
    const payload = this.formatPayload("warn", message, context, error);
    functionsLogger.warn(payload);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const payload = this.formatPayload("error", message, context, error);
    functionsLogger.error(payload);
  }
}

export const logger = new Logger();
