import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user with profile data
    const userWithProfile = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            title: true,
            company: true,
            profileImageUrl: true,
            customUrl: true,
            isVerified: true,
            isPremium: true,
          },
        },
      },
    });

    if (!userWithProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: userWithProfile,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
