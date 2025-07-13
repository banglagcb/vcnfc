#!/usr/bin/env node

/**
 * Development Health Check Script
 * Checks common development issues that can cause fetch errors and hot reload problems
 */

import * as fs from "fs";
import * as path from "path";

interface HealthCheck {
  name: string;
  status: "pass" | "warning" | "fail";
  message: string;
}

async function runHealthChecks(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = [];

  // Check 1: Environment file exists and has required variables
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const hasNodeEnv = envContent.includes("NODE_ENV");
      const hasNextPublicUrl = envContent.includes("NEXT_PUBLIC_APP_URL");

      checks.push({
        name: "Environment Configuration",
        status: hasNodeEnv && hasNextPublicUrl ? "pass" : "warning",
        message:
          hasNodeEnv && hasNextPublicUrl
            ? "Environment variables properly configured"
            : "Missing some development environment variables",
      });
    } else {
      checks.push({
        name: "Environment Configuration",
        status: "fail",
        message: ".env file not found",
      });
    }
  } catch (error) {
    checks.push({
      name: "Environment Configuration",
      status: "fail",
      message: "Error reading environment file",
    });
  }

  // Check 2: Next.js config exists
  const nextConfigPaths = [
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
  ];
  const hasNextConfig = nextConfigPaths.some((configPath) =>
    fs.existsSync(path.join(process.cwd(), configPath)),
  );

  checks.push({
    name: "Next.js Configuration",
    status: hasNextConfig ? "pass" : "warning",
    message: hasNextConfig
      ? "Next.js configuration file found"
      : "No Next.js configuration file found (using defaults)",
  });

  // Check 3: Node modules exist
  const nodeModulesExists = fs.existsSync(
    path.join(process.cwd(), "node_modules"),
  );
  checks.push({
    name: "Dependencies",
    status: nodeModulesExists ? "pass" : "fail",
    message: nodeModulesExists
      ? "Node modules installed"
      : "Node modules not found - run npm install",
  });

  // Check 4: Database file exists (if using SQLite)
  try {
    const envContent = fs.readFileSync(
      path.join(process.cwd(), ".env"),
      "utf8",
    );
    if (envContent.includes("file:")) {
      const dbExists = fs.existsSync(path.join(process.cwd(), "dev.db"));
      checks.push({
        name: "Database",
        status: dbExists ? "pass" : "warning",
        message: dbExists
          ? "SQLite database file exists"
          : "SQLite database file not found - run npm run setup",
      });
    }
  } catch (error) {
    // Skip database check if can't read env
  }

  // Check 5: Essential directories exist
  const essentialDirs = ["app", "components", "lib"];
  const missingDirs = essentialDirs.filter(
    (dir) => !fs.existsSync(path.join(process.cwd(), dir)),
  );

  checks.push({
    name: "Project Structure",
    status: missingDirs.length === 0 ? "pass" : "fail",
    message:
      missingDirs.length === 0
        ? "All essential directories present"
        : `Missing directories: ${missingDirs.join(", ")}`,
  });

  return checks;
}

function printHealthReport(checks: HealthCheck[]) {
  console.log("\n🏥 Development Health Check Report\n");
  console.log("=".repeat(50));

  let passCount = 0;
  let warningCount = 0;
  let failCount = 0;

  for (const check of checks) {
    const icon =
      check.status === "pass" ? "✅" : check.status === "warning" ? "⚠️" : "❌";
    console.log(`${icon} ${check.name}: ${check.message}`);

    if (check.status === "pass") passCount++;
    else if (check.status === "warning") warningCount++;
    else failCount++;
  }

  console.log("\n" + "=".repeat(50));
  console.log(
    `📊 Summary: ${passCount} passed, ${warningCount} warnings, ${failCount} failed`,
  );

  if (failCount === 0 && warningCount === 0) {
    console.log("\n🎉 Development environment is healthy!");
  } else if (failCount === 0) {
    console.log(
      "\n✅ Development environment is mostly healthy (some warnings)",
    );
  } else {
    console.log("\n⚠️ Development environment has issues that need attention");
  }

  console.log("\n💡 Tips to prevent fetch errors:");
  console.log("   • Keep dev server running with `npm run dev`");
  console.log("   • Avoid hard refreshes when possible");
  console.log("   • Clear browser cache if you see stale content");
  console.log("   • Check network connectivity");
  console.log("   • Disable browser extensions that might interfere");

  return failCount === 0;
}

async function main() {
  console.log("🔍 Running development health checks...");

  try {
    const checks = await runHealthChecks();
    const isHealthy = printHealthReport(checks);

    process.exit(isHealthy ? 0 : 1);
  } catch (error) {
    console.error("❌ Health check failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { runHealthChecks, printHealthReport };
