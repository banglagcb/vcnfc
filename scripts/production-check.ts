#!/usr/bin/env node

import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import { validateEnvFile } from "./setup-env";
import * as fs from "fs";

const prisma = new PrismaClient();

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "warning";
  message: string;
  details?: string;
}

async function runProductionChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // 1. Environment Check
  console.log("🔍 Checking environment configuration...");
  try {
    const envValid = validateEnvFile();
    results.push({
      name: "Environment Configuration",
      status: envValid ? "pass" : "fail",
      message: envValid
        ? "All required environment variables are configured"
        : "Missing or invalid environment variables",
      details: envValid ? undefined : "Run `npm run setup-env` to fix",
    });
  } catch (error) {
    results.push({
      name: "Environment Configuration",
      status: "fail",
      message: "Failed to validate environment",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // 2. Database Connection Check
  console.log("🔍 Checking database connection...");
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    results.push({
      name: "Database Connection",
      status: "pass",
      message: `Connected successfully (${userCount} users in database)`,
    });
  } catch (error) {
    results.push({
      name: "Database Connection",
      status: "fail",
      message: "Cannot connect to database",
      details:
        error instanceof Error ? error.message : "Unknown database error",
    });
  }

  // 3. Build Check
  console.log("🔍 Checking build process...");
  try {
    execSync("npm run build", { stdio: "pipe" });
    results.push({
      name: "Build Process",
      status: "pass",
      message: "Application builds successfully",
    });
  } catch (error) {
    results.push({
      name: "Build Process",
      status: "fail",
      message: "Build failed",
      details: "Run `npm run build` to see detailed errors",
    });
  }

  // 4. Dependencies Check
  console.log("🔍 Checking dependencies...");
  try {
    execSync("npm audit --audit-level=high", { stdio: "pipe" });
    results.push({
      name: "Security Audit",
      status: "pass",
      message: "No high-severity vulnerabilities found",
    });
  } catch (error) {
    results.push({
      name: "Security Audit",
      status: "warning",
      message: "Security vulnerabilities detected",
      details: "Run `npm audit` for details and `npm audit fix` to resolve",
    });
  }

  // 5. Essential Files Check
  console.log("🔍 Checking essential files...");
  const essentialFiles = [
    ".env",
    "prisma/schema.prisma",
    "package.json",
    "next.config.js",
    "tailwind.config.ts",
    "components/auth-dialog.tsx",
    "app/api/auth/login/route.ts",
    "app/api/auth/register/route.ts",
    "lib/stores/auth-store.ts",
  ];

  let missingFiles = 0;
  for (const file of essentialFiles) {
    if (!fs.existsSync(file)) {
      missingFiles++;
    }
  }

  results.push({
    name: "Essential Files",
    status: missingFiles === 0 ? "pass" : "fail",
    message:
      missingFiles === 0
        ? "All essential files present"
        : `${missingFiles} essential files missing`,
    details:
      missingFiles > 0 ? "Some core application files are missing" : undefined,
  });

  // 6. API Routes Check
  console.log("🔍 Checking API routes...");
  const apiRoutes = [
    "app/api/auth/login/route.ts",
    "app/api/auth/register/route.ts",
    "app/api/auth/logout/route.ts",
    "app/api/auth/me/route.ts",
    "app/api/profile/route.ts",
    "app/api/upload/route.ts",
  ];

  let missingRoutes = 0;
  for (const route of apiRoutes) {
    if (!fs.existsSync(route)) {
      missingRoutes++;
    }
  }

  results.push({
    name: "API Routes",
    status: missingRoutes === 0 ? "pass" : "fail",
    message:
      missingRoutes === 0
        ? "All API routes present"
        : `${missingRoutes} API routes missing`,
  });

  return results;
}

function printResults(results: CheckResult[]) {
  console.log("\n📊 Production Readiness Report\n");
  console.log("=".repeat(50));

  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;

  for (const result of results) {
    const icon =
      result.status === "pass"
        ? "✅"
        : result.status === "warning"
          ? "⚠️"
          : "❌";
    console.log(`${icon} ${result.name}: ${result.message}`);

    if (result.details) {
      console.log(`   💡 ${result.details}`);
    }

    if (result.status === "pass") passCount++;
    else if (result.status === "warning") warningCount++;
    else failCount++;
  }

  console.log("\n" + "=".repeat(50));
  console.log(
    `📈 Summary: ${passCount} passed, ${warningCount} warnings, ${failCount} failed`,
  );

  if (failCount === 0) {
    console.log("\n🎉 Your ShareInfo application is PRODUCTION READY! 🚀");
    console.log("\n📋 Next steps:");
    console.log("   1. Deploy to your hosting platform");
    console.log("   2. Configure your domain and SSL");
    console.log("   3. Set up monitoring alerts");
    console.log("   4. Run final testing");
    console.log("   5. GO LIVE! 🎯");
  } else {
    console.log(
      "\n⚠️  Please fix the failed checks before deploying to production.",
    );
    console.log("\n🔧 Quick fixes:");
    console.log("   • Run `npm run setup-env` to fix environment issues");
    console.log("   • Run `npm run setup` to initialize database");
    console.log("   • Run `npm run build` to check for build errors");
    console.log("   • Run `npm audit fix` to resolve security issues");
  }

  return failCount === 0;
}

async function main() {
  console.log("🚀 ShareInfo Production Readiness Check\n");

  try {
    const results = await runProductionChecks();
    const isReady = printResults(results);

    process.exit(isReady ? 0 : 1);
  } catch (error) {
    console.error("❌ Production check failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { runProductionChecks, printResults };
