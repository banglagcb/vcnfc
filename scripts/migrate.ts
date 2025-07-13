import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database migration and seeding...");

  try {
    // Test database connection
    console.log("📡 Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Check if users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log("ℹ️  Database already has users. Skipping seed data.");
      return;
    }

    console.log("📝 Creating seed data...");

    // Create sample users with profiles
    console.log("👤 Creating sample users...");

    // Admin user
    const adminPassword = await hashPassword("admin123");
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@shareinfobd.com",
        password: adminPassword,
        name: "ShareInfo Admin",
        verified: true,
      },
    });

    console.log("✅ Admin user created");

    // Create admin profile
    const adminProfile = await prisma.profile.create({
      data: {
        userId: adminUser.id,
        firstName: "ShareInfo",
        lastName: "Admin",
        name: "ShareInfo Admin",
        email: "admin@shareinfobd.com",
        title: "Managing Director & CEO",
        company: "SHAREINFO",
        bio: "Working with new technology NFC smart business card to revolutionize networking.",
        location: "Box Culvert Road, Panthopath, Dhaka",
        customUrl: "shareinfo-admin",
        isVerified: true,
        isPremium: true,
      },
    });

    console.log("✅ Admin profile created");

    // Create sample contact fields for admin
    await prisma.contactField.createMany({
      data: [
        {
          profileId: adminProfile.id,
          type: "phone",
          label: "Primary Phone",
          value: "+8801723128440",
        },
        {
          profileId: adminProfile.id,
          type: "email",
          label: "Business Email",
          value: "admin@shareinfobd.com",
        },
        {
          profileId: adminProfile.id,
          type: "website",
          label: "Company Website",
          value: "https://shareinfobd.com",
        },
      ],
    });

    console.log("✅ Admin contact fields created");

    // Create sample social links for admin
    await prisma.socialLink.createMany({
      data: [
        {
          profileId: adminProfile.id,
          platform: "LinkedIn",
          url: "https://linkedin.com/company/shareinfo-bd",
        },
        {
          profileId: adminProfile.id,
          platform: "Facebook",
          url: "https://facebook.com/shareinfobd",
        },
        {
          profileId: adminProfile.id,
          platform: "Instagram",
          url: "https://instagram.com/shareinfobd",
        },
      ],
    });

    console.log("✅ Admin social links created");

    // Create sample skills
    await prisma.skill.createMany({
      data: [
        {
          profileId: adminProfile.id,
          name: "NFC Technology",
          level: "expert",
          category: "Technology",
          yearsOfExperience: 5,
          isEndorsed: true,
          endorsements: 12,
        },
        {
          profileId: adminProfile.id,
          name: "Digital Marketing",
          level: "advanced",
          category: "Marketing",
          yearsOfExperience: 3,
          isEndorsed: true,
          endorsements: 8,
        },
        {
          profileId: adminProfile.id,
          name: "Business Development",
          level: "expert",
          category: "Business",
          yearsOfExperience: 7,
          isEndorsed: true,
          endorsements: 15,
        },
        {
          profileId: adminProfile.id,
          name: "Product Design",
          level: "advanced",
          category: "Design",
          yearsOfExperience: 4,
          isEndorsed: false,
          endorsements: 5,
        },
      ],
    });

    console.log("✅ Admin skills created");

    // Create sample demo user
    const demoPassword = await hashPassword("demo123");
    const demoUser = await prisma.user.create({
      data: {
        email: "demo@shareinfobd.com",
        password: demoPassword,
        name: "Demo User",
        verified: false,
      },
    });

    const demoProfile = await prisma.profile.create({
      data: {
        userId: demoUser.id,
        firstName: "Demo",
        lastName: "User",
        name: "Demo User",
        email: "demo@shareinfobd.com",
        title: "Sales Executive",
        company: "SHAREINFO",
        bio: "Passionate about innovative networking solutions and helping businesses grow.",
        location: "Dhaka, Bangladesh",
        customUrl: "demo-user",
        isVerified: false,
        isPremium: false,
      },
    });

    console.log("✅ Demo user and profile created");

    // Create sample testimonials
    await prisma.testimonial.createMany({
      data: [
        {
          profileId: adminProfile.id,
          clientName: "Ahmed Hassan",
          clientTitle: "Business Owner",
          content:
            "ShareInfo NFC cards have revolutionized my networking. Highly recommend!",
          rating: 5,
        },
        {
          profileId: adminProfile.id,
          clientName: "Sarah Khan",
          clientTitle: "Marketing Manager",
          content:
            "Professional, innovative, and incredibly easy to use. Great investment!",
          rating: 5,
        },
        {
          profileId: adminProfile.id,
          clientName: "Mohammed Ali",
          clientTitle: "Tech Entrepreneur",
          content:
            "The future of business cards. ShareInfo delivers excellence.",
          rating: 5,
        },
      ],
    });

    console.log("✅ Sample testimonials created");

    // Initialize analytics for profiles
    await prisma.profileAnalytic.createMany({
      data: [
        {
          profileId: adminProfile.id,
          views: 150,
          cardTaps: 89,
          contacts: 67,
          shares: 23,
        },
        {
          profileId: demoProfile.id,
          views: 25,
          cardTaps: 12,
          contacts: 8,
          shares: 3,
        },
      ],
    });

    console.log("✅ Sample analytics created");

    console.log("🎉 Database seeding completed successfully!");
    console.log("");
    console.log("📋 Test Accounts Created:");
    console.log("   Admin: admin@shareinfobd.com / admin123");
    console.log("   Demo:  demo@shareinfobd.com / demo123");
    console.log("");
  } catch (error) {
    console.error("❌ Error during migration/seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("❌ Migration failed:", e);
  process.exit(1);
});
