import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/profile/[identifier] - Get public profile by ID or custom URL
export async function GET(
  request: NextRequest,
  { params }: { params: { identifier: string } },
) {
  try {
    const { identifier } = params;

    // Try to find profile by ID first, then by custom URL
    const profile = await db.profile.findFirst({
      where: {
        OR: [{ id: identifier }, { customUrl: identifier }],
        isPublic: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        title: true,
        company: true,
        department: true,
        bio: true,
        location: true,
        profileImageUrl: true,
        customUrl: true,
        theme: true,
        isVerified: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
        contactFields: {
          where: { isPublic: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            label: true,
            value: true,
            type: true,
            icon: true,
            order: true,
          },
        },
        socialLinks: {
          where: { isPublic: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            platform: true,
            url: true,
            icon: true,
            displayName: true,
            order: true,
          },
        },
        skills: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            level: true,
            category: true,
            yearsOfExperience: true,
            isEndorsed: true,
            endorsements: true,
          },
        },
        workExperience: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            company: true,
            position: true,
            startDate: true,
            endDate: true,
            isCurrent: true,
            description: true,
            skills: true,
            achievements: true,
          },
        },
        achievements: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            issuer: true,
            dateEarned: true,
            credentialId: true,
            credentialUrl: true,
          },
        },
        portfolioItems: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            projectUrl: true,
            repositoryUrl: true,
            technologies: true,
            category: true,
            featured: true,
            completedDate: true,
          },
        },
        testimonials: {
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            clientName: true,
            clientTitle: true,
            clientCompany: true,
            clientAvatar: true,
            content: true,
            rating: true,
            dateReceived: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Log analytics for profile view
    try {
      await db.profileAnalytic.create({
        data: {
          profileId: profile.id,
          event: "view",
          metadata: {
            userAgent: request.headers.get("user-agent"),
            referer: request.headers.get("referer"),
          },
          userAgent: request.headers.get("user-agent"),
          ipAddress: request.ip || request.headers.get("x-forwarded-for"),
        },
      });
    } catch (analyticsError) {
      console.warn("Failed to log analytics:", analyticsError);
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
