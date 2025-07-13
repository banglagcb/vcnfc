import { db } from "@/lib/db";

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  profileId?: string;
  metadata?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
  country?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count";
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  metadata?: Record<string, any>;
}

class Analytics {
  private static instance: Analytics;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startFlushInterval();
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Track user events
  public async track(event: AnalyticsEvent): Promise<void> {
    try {
      // Add to queue for batch processing
      this.eventQueue.push({
        ...event,
        timestamp: new Date(),
      });

      // Also store in database for real-time analytics
      if (event.profileId) {
        await db.profileAnalytic.create({
          data: {
            profileId: event.profileId,
            event: event.event,
            metadata: event.metadata || {},
            userAgent: event.userAgent,
            ipAddress: event.ipAddress,
          },
        });
      }
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  }

  // Track page views
  public async trackPageView(
    path: string,
    userId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.track({
      event: "page_view",
      userId,
      metadata: {
        path,
        ...metadata,
      },
    });
  }

  // Track profile interactions
  public async trackProfileView(
    profileId: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.track({
      event: "profile_view",
      profileId,
      metadata,
    });
  }

  public async trackProfileShare(
    profileId: string,
    method: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.track({
      event: "profile_share",
      profileId,
      metadata: {
        method,
        ...metadata,
      },
    });
  }

  public async trackVCardDownload(
    profileId: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.track({
      event: "vcard_download",
      profileId,
      metadata,
    });
  }

  // Track performance metrics
  public async trackPerformance(metric: PerformanceMetric): Promise<void> {
    try {
      // Store performance metrics
      console.log("Performance metric:", metric);

      // Could send to external monitoring service
      if (process.env.NODE_ENV === "production") {
        // Send to monitoring service (Datadog, New Relic, etc.)
        await this.sendToMonitoringService("performance", metric);
      }
    } catch (error) {
      console.error("Performance tracking error:", error);
    }
  }

  // Track errors
  public async trackError(error: ErrorReport): Promise<void> {
    try {
      console.error("Application error:", error);

      // Store error in database
      // You might want to create an errors table in your schema

      // Send to error tracking service (Sentry, Bugsnag, etc.)
      if (process.env.NODE_ENV === "production") {
        await this.sendToMonitoringService("error", error);
      }
    } catch (trackingError) {
      console.error("Error tracking failed:", trackingError);
    }
  }

  // Get analytics data
  public async getProfileAnalytics(
    profileId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    try {
      const whereClause: any = { profileId };

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      const analytics = await db.profileAnalytic.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });

      // Aggregate data
      const summary = {
        totalViews: analytics.filter((a) => a.event === "view").length,
        totalDownloads: analytics.filter((a) => a.event === "download").length,
        totalShares: analytics.filter((a) => a.event === "share").length,
        uniqueVisitors: new Set(analytics.map((a) => a.ipAddress)).size,
        topCountries: this.aggregateByField(analytics, "country"),
        dailyViews: this.aggregateByDate(analytics),
        recentEvents: analytics.slice(0, 10),
      };

      return summary;
    } catch (error) {
      console.error("Get analytics error:", error);
      return null;
    }
  }

  // Flush events to external service
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send batch to external analytics service
      if (process.env.NODE_ENV === "production") {
        await this.sendToMonitoringService("events", events);
      }
    } catch (error) {
      console.error("Event flush error:", error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...events);
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000); // Flush every 30 seconds
  }

  private async sendToMonitoringService(
    type: string,
    data: any,
  ): Promise<void> {
    // Implementation depends on your monitoring service
    // Examples: Datadog, New Relic, custom service

    if (process.env.MONITORING_ENDPOINT) {
      try {
        await fetch(process.env.MONITORING_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MONITORING_API_KEY}`,
          },
          body: JSON.stringify({
            type,
            data,
            timestamp: new Date(),
            service: "shareinfo",
          }),
        });
      } catch (error) {
        console.error("Monitoring service error:", error);
      }
    }
  }

  private aggregateByField(
    analytics: any[],
    field: string,
  ): Record<string, number> {
    const aggregated: Record<string, number> = {};
    analytics.forEach((item) => {
      const value = item.metadata?.[field] || "unknown";
      aggregated[value] = (aggregated[value] || 0) + 1;
    });
    return aggregated;
  }

  private aggregateByDate(analytics: any[]): Record<string, number> {
    const aggregated: Record<string, number> = {};
    analytics.forEach((item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      aggregated[date] = (aggregated[date] || 0) + 1;
    });
    return aggregated;
  }
}

export const analytics = Analytics.getInstance();

// Client-side performance monitoring
export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];

  public static trackPageLoad(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      const metrics = [
        {
          name: "page_load_time",
          value: navigation.loadEventEnd - navigation.fetchStart,
          unit: "ms" as const,
          timestamp: new Date(),
        },
        {
          name: "dom_content_loaded",
          value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          unit: "ms" as const,
          timestamp: new Date(),
        },
        {
          name: "first_byte",
          value: navigation.responseStart - navigation.fetchStart,
          unit: "ms" as const,
          timestamp: new Date(),
        },
      ];

      metrics.forEach((metric) => {
        analytics.trackPerformance(metric);
      });
    });
  }

  public static trackCoreWebVitals(): void {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      analytics.trackPerformance({
        name: "largest_contentful_paint",
        value: lastEntry.startTime,
        unit: "ms",
        timestamp: new Date(),
      });
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        analytics.trackPerformance({
          name: "first_input_delay",
          value: (entry as any).processingStart - entry.startTime,
          unit: "ms",
          timestamp: new Date(),
        });
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });

      analytics.trackPerformance({
        name: "cumulative_layout_shift",
        value: clsValue,
        unit: "count",
        timestamp: new Date(),
      });
    }).observe({ entryTypes: ["layout-shift"] });
  }
}

// Error boundary for React
export class ErrorBoundary {
  public static captureError(
    error: Error,
    errorInfo: any,
    userId?: string,
  ): void {
    analytics.trackError({
      message: error.message,
      stack: error.stack,
      severity: "high",
      timestamp: new Date(),
      userId,
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
    });
  }
}
