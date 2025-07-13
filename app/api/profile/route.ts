import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  customUrl: z.string().optional(),
  isPublic: z.boolean().optional(),
  showAnalytics: z.boolean().optional(),
  allowContact: z.boolean().optional(),
  allowDownload: z.boolean().optional(),
  theme: z.string().optional(),
});

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      include: {
        contactFields: {
          orderBy: { order: "asc" },
        },
        socialLinks: {
          orderBy: { order: "asc" },
        },
        skills: {
          orderBy: { createdAt: "desc" },
        },
        workExperience: {
          orderBy: { createdAt: "desc" },
        },
        achievements: {
          orderBy: { createdAt: "desc" },
        },
        portfolioItems: {
          orderBy: { createdAt: "desc" },
        },
        testimonials: {
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validatedData = profileUpdateSchema.parse(body);

    // Check if customUrl is unique (if provided)
    if (validatedData.customUrl) {
      const existingProfile = await db.profile.findFirst({
        where: {
          customUrl: validatedData.customUrl,
          userId: { not: user.id },
        },
      });

      if (existingProfile) {
        return NextResponse.json(
          { error: "Custom URL already taken" },
          { status: 400 },
        );
      }
    }

    const updatedProfile = await db.profile.update({
      where: { userId: user.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        contactFields: {
          orderBy: { order: "asc" },
        },
        socialLinks: {
          orderBy: { order: "asc" },
        },
        skills: {
          orderBy: { createdAt: "desc" },
        },
        workExperience: {
          orderBy: { createdAt: "desc" },
        },
        achievements: {
          orderBy: { createdAt: "desc" },
        },
        portfolioItems: {
          orderBy: { createdAt: "desc" },
        },
        testimonials: {
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
