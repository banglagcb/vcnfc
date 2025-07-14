import { NextRequest, NextResponse } from "next/server";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { headers } from "next/headers";

// Rate limiting store for serverless
const rateLimitStore = new Map();

export interface SecurityConfig {
  rateLimiting: {
    windowMs: number;
    max: number;
    message: string;
  };
  slowDown: {
    windowMs: number;
    delayAfter: number;
    delayMs: number;
  };
  cors: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
  };
}

export const securityConfig: SecurityConfig = {
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "Too many requests from this IP, please try again later.",
  },
  slowDown: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Start slowing down after 50 requests
    delayMs: 500, // Add 500ms delay per request
  },
  cors: {
    origin: [
      "http://localhost:3000",
      "https://shareinfo.com",
      "https://www.shareinfo.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

// SQL injection prevention
export const validateSqlInput = (input: string): boolean => {
  const sqlInjectionPattern =
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i;
  return !sqlInjectionPattern.test(input);
};

// XSS prevention
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

// Rate limiting for API routes
export const createRateLimit = (
  options?: Partial<SecurityConfig["rateLimiting"]>,
) => {
  const config = { ...securityConfig.rateLimiting, ...options };

  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();

    // Clean old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (now - (v as any).resetTime > config.windowMs) {
        rateLimitStore.delete(k);
      }
    }

    const current = (rateLimitStore.get(key) as any) || {
      count: 0,
      resetTime: now + config.windowMs,
    };

    if (now > current.resetTime) {
      current.count = 1;
      current.resetTime = now + config.windowMs;
    } else {
      current.count += 1;
    }

    rateLimitStore.set(key, current);

    if (current.count > config.max) {
      return NextResponse.json({ error: config.message }, { status: 429 });
    }

    return null; // Allow request
  };
};

// Security headers
export const securityHeaders = {
  "X-DNS-Prefetch-Control": "off",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.cloudinary.com;
    media-src 'self' https:;
    object-src 'none';
    child-src 'none';
    worker-src 'none';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    manifest-src 'self';
  `
    .replace(/\s+/g, " ")
    .trim(),
};

// File upload security
export const validateFileUpload = (
  file: File,
): { valid: boolean; error?: string } => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxDimensions = { width: 4096, height: 4096 };

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
    };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File too large. Maximum size is 5MB." };
  }

  // Additional validation for malicious files
  if (
    file.name.includes("..") ||
    file.name.includes("/") ||
    file.name.includes("\\")
  ) {
    return { valid: false, error: "Invalid file name." };
  }

  return { valid: true };
};

// Password security validation
export const validatePassword = (
  password: string,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return { valid: errors.length === 0, errors };
};

// Environment validation
export const validateEnvironment = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  for (const env of required) {
    if (!process.env[env]) {
      errors.push(`Missing required environment variable: ${env}`);
    }
  }

  if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXTAUTH_URL?.startsWith("https://")) {
      errors.push("NEXTAUTH_URL must use HTTPS in production");
    }
  }

  return { valid: errors.length === 0, errors };
};
