import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function migrate() {
  try {
    console.log("🔄 Running database migration...");

    // Generate Prisma client
    console.log("📦 Generating Prisma client...");
    await execAsync("npx prisma generate");

    // Run migrations
    console.log("🏗️  Pushing database schema...");
    await execAsync("npx prisma db push");

    console.log("✅ Database migration completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Set up your DATABASE_URL in .env");
    console.log("2. Configure Cloudinary credentials");
    console.log("3. Set JWT_SECRET for authentication");
    console.log("4. Run: npm run dev");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
