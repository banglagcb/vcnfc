interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
  FATAL: 4;
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
  stack?: string;
}

class Logger {
  private static instance: Logger;
  private logLevel: number;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {
    this.logLevel =
      process.env.NODE_ENV === "production"
        ? LOG_LEVELS.WARN
        : LOG_LEVELS.DEBUG;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: keyof LogLevel): boolean {
    return LOG_LEVELS[level] >= this.logLevel;
  }

  private formatMessage(
    level: keyof LogLevel,
    message: string,
    metadata?: Record<string, any>,
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // Add request context if available
    if (typeof window === "undefined") {
      // Server-side: try to get request context
      const requestId = process.env.REQUEST_ID || this.generateRequestId();
      entry.requestId = requestId;
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    // Store in memory (for debugging)
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with colors
    const color = this.getLogColor(entry.level);
    const prefix = `[${entry.timestamp}] [${entry.level}]`;

    if (entry.level === "ERROR" || entry.level === "FATAL") {
      console.error(color, prefix, entry.message, entry.metadata || "");
      if (entry.stack) {
        console.error(entry.stack);
      }
    } else if (entry.level === "WARN") {
      console.warn(color, prefix, entry.message, entry.metadata || "");
    } else {
      console.log(color, prefix, entry.message, entry.metadata || "");
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToLoggingService(entry);
    }
  }

  private getLogColor(level: keyof LogLevel): string {
    const colors = {
      DEBUG: "\x1b[36m", // Cyan
      INFO: "\x1b[32m", // Green
      WARN: "\x1b[33m", // Yellow
      ERROR: "\x1b[31m", // Red
      FATAL: "\x1b[35m", // Magenta
    };
    return colors[level] || "\x1b[0m";
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    try {
      if (process.env.LOGGING_ENDPOINT) {
        await fetch(process.env.LOGGING_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LOGGING_API_KEY}`,
          },
          body: JSON.stringify({
            ...entry,
            service: "shareinfo",
            environment: process.env.NODE_ENV,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to send log to external service:", error);
    }
  }

  // Public logging methods
  public debug(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog("DEBUG")) {
      this.output(this.formatMessage("DEBUG", message, metadata));
    }
  }

  public info(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog("INFO")) {
      this.output(this.formatMessage("INFO", message, metadata));
    }
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog("WARN")) {
      this.output(this.formatMessage("WARN", message, metadata));
    }
  }

  public error(
    message: string,
    error?: Error,
    metadata?: Record<string, any>,
  ): void {
    if (this.shouldLog("ERROR")) {
      const entry = this.formatMessage("ERROR", message, metadata);
      if (error) {
        entry.stack = error.stack;
      }
      this.output(entry);
    }
  }

  public fatal(
    message: string,
    error?: Error,
    metadata?: Record<string, any>,
  ): void {
    if (this.shouldLog("FATAL")) {
      const entry = this.formatMessage("FATAL", message, metadata);
      if (error) {
        entry.stack = error.stack;
      }
      this.output(entry);
    }
  }

  // Utility methods
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public setLogLevel(level: keyof LogLevel): void {
    this.logLevel = LOG_LEVELS[level];
  }
}

export const logger = Logger.getInstance();

// Express-style request logging middleware
export function requestLogger(req: any, res: any, next: any): void {
  const start = Date.now();
  const requestId = logger["generateRequestId"]();

  // Set request ID in environment
  process.env.REQUEST_ID = requestId;

  logger.info("Request started", {
    method: req.method,
    url: req.url,
    userAgent: req.headers["user-agent"],
    ip: req.ip || req.connection.remoteAddress,
    requestId,
  });

  // Log response
  const originalSend = res.send;
  res.send = function (body: any) {
    const duration = Date.now() - start;

    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId,
    });

    return originalSend.call(this, body);
  };

  next();
}

// Database query logging
export function logDatabaseQuery(
  query: string,
  params?: any[],
  duration?: number,
): void {
  logger.debug("Database query", {
    query: query.replace(/\s+/g, " ").trim(),
    params,
    duration: duration ? `${duration}ms` : undefined,
  });
}

// API endpoint logging
export function logApiCall(
  method: string,
  endpoint: string,
  statusCode: number,
  duration: number,
  userId?: string,
): void {
  const level = statusCode >= 400 ? "ERROR" : "INFO";

  logger[level.toLowerCase() as "info" | "error"]("API call", {
    method,
    endpoint,
    statusCode,
    duration: `${duration}ms`,
    userId,
  });
}

// Authentication logging
export function logAuthEvent(
  event: "login" | "logout" | "register" | "failed_login",
  userId?: string,
  metadata?: Record<string, any>,
): void {
  logger.info(`Auth: ${event}`, {
    event,
    userId,
    ...metadata,
  });
}

// Security event logging
export function logSecurityEvent(
  event: string,
  severity: "low" | "medium" | "high" | "critical",
  metadata?: Record<string, any>,
): void {
  const level =
    severity === "critical" || severity === "high" ? "ERROR" : "WARN";

  logger[level.toLowerCase() as "warn" | "error"](`Security: ${event}`, {
    event,
    severity,
    ...metadata,
  });
}
