import * as fs from "fs";
import * as path from "path";
import { generateRandomString } from "../lib/auth";

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const optionalEnvVars = [
  "EMAIL_FROM",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
];

function generateSecureSecret(length: number = 32): string {
  return generateRandomString(length);
}

function validateEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  const envExamplePath = path.join(process.cwd(), ".env.example");

  console.log("🔍 Checking environment configuration...");

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    console.log("📄 .env file not found. Creating from .env.example...");

    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log("✅ .env file created from .env.example");
    } else {
      console.log("❌ .env.example not found. Please create .env manually.");
      return false;
    }
  }

  // Read .env file
  const envContent = fs.readFileSync(envPath, "utf8");
  const envLines = envContent.split("\n");
  const envVars: Record<string, string> = {};

  // Parse env variables
  envLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        envVars[key] = valueParts.join("=").replace(/^"(.*)"$/, "$1");
      }
    }
  });

  const missingVars: string[] = [];
  const insecureVars: string[] = [];

  // Check required variables
  requiredEnvVars.forEach((varName) => {
    if (
      !envVars[varName] ||
      envVars[varName].includes("your-") ||
      envVars[varName].includes("change-this")
    ) {
      missingVars.push(varName);
    }
  });

  // Check for insecure default values
  if (envVars.NEXTAUTH_SECRET && envVars.NEXTAUTH_SECRET.includes("your-")) {
    insecureVars.push("NEXTAUTH_SECRET");
  }
  if (envVars.JWT_SECRET && envVars.JWT_SECRET.includes("your-")) {
    insecureVars.push("JWT_SECRET");
  }

  // Report status
  if (missingVars.length === 0 && insecureVars.length === 0) {
    console.log(
      "✅ All required environment variables are properly configured",
    );
    return true;
  }

  console.log("\n⚠️  Environment configuration issues found:");

  if (missingVars.length > 0) {
    console.log("\n❌ Missing or invalid required variables:");
    missingVars.forEach((varName) => {
      console.log(`   - ${varName}`);
    });
  }

  if (insecureVars.length > 0) {
    console.log("\n🔐 Insecure default values detected:");
    insecureVars.forEach((varName) => {
      console.log(`   - ${varName} (contains default placeholder)`);
    });
  }

  console.log("\n📋 Required environment variables:");
  requiredEnvVars.forEach((varName) => {
    const status =
      envVars[varName] && !envVars[varName].includes("your-") ? "✅" : "❌";
    console.log(`   ${status} ${varName}`);
  });

  console.log("\n📋 Optional environment variables:");
  optionalEnvVars.forEach((varName) => {
    const status =
      envVars[varName] && !envVars[varName].includes("your-") ? "✅" : "⚪";
    console.log(`   ${status} ${varName}`);
  });

  console.log("\n🔧 Quick fixes:");
  if (insecureVars.includes("NEXTAUTH_SECRET")) {
    console.log(`   NEXTAUTH_SECRET="${generateSecureSecret()}"`);
  }
  if (insecureVars.includes("JWT_SECRET")) {
    console.log(`   JWT_SECRET="${generateSecureSecret()}"`);
  }

  console.log("\n💡 For production, make sure to:");
  console.log("   1. Set a real PostgreSQL DATABASE_URL");
  console.log("   2. Configure Cloudinary credentials");
  console.log(
    "   3. Generate secure secrets for NEXTAUTH_SECRET and JWT_SECRET",
  );
  console.log("   4. Set proper NEXTAUTH_URL for your domain");

  return false;
}

function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Auto-fix common issues
function autoFixEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env file not found");
    return;
  }

  let envContent = fs.readFileSync(envPath, "utf8");
  let changed = false;

  // Auto-generate secure secrets
  if (
    envContent.includes(
      'NEXTAUTH_SECRET="your-super-secret-32-character-nextauth-key-here-change-this"',
    )
  ) {
    const newSecret = generateSecureSecret(32);
    envContent = envContent.replace(
      'NEXTAUTH_SECRET="your-super-secret-32-character-nextauth-key-here-change-this"',
      `NEXTAUTH_SECRET="${newSecret}"`,
    );
    changed = true;
    console.log("🔐 Generated secure NEXTAUTH_SECRET");
  }

  if (
    envContent.includes(
      'JWT_SECRET="your-jwt-secret-key-256-bits-minimum-length-required"',
    )
  ) {
    const newSecret = generateSecureSecret(32);
    envContent = envContent.replace(
      'JWT_SECRET="your-jwt-secret-key-256-bits-minimum-length-required"',
      `JWT_SECRET="${newSecret}"`,
    );
    changed = true;
    console.log("🔐 Generated secure JWT_SECRET");
  }

  if (changed) {
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Environment file updated with secure secrets");
  }
}

if (require.main === module) {
  console.log("🚀 ShareInfo Environment Setup\n");

  // Auto-fix common issues first
  autoFixEnv();

  // Then validate
  const isValid = validateEnvFile();

  if (isValid) {
    console.log("\n🎉 Environment is ready for production!");
    process.exit(0);
  } else {
    console.log(
      "\n❌ Environment setup incomplete. Please fix the issues above.",
    );
    process.exit(1);
  }
}

export { validateEnvFile, autoFixEnv };
