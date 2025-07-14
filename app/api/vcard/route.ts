import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function generateVCardFromProfile(profile: any): string {
  const vcard = [];

  // vCard version
  vcard.push("BEGIN:VCARD");
  vcard.push("VERSION:3.0");

  // Name
  const fullName =
    profile.name ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  if (fullName) {
    const firstName = profile.firstName || "";
    const lastName = profile.lastName || "";

    vcard.push(`N:${lastName};${firstName};;;`);
    vcard.push(`FN:${fullName}`);
  }

  // Title and Organization
  if (profile.title) {
    vcard.push(`TITLE:${profile.title}`);
  }

  if (profile.company) {
    vcard.push(`ORG:${profile.company}`);
  }

  // Contact Information
  const phoneField = profile.contactFields?.find(
    (field: any) => field.type === "phone",
  );
  if (phoneField?.value) {
    vcard.push(`TEL;TYPE=CELL:${phoneField.value}`);
  }

  const emailField = profile.contactFields?.find(
    (field: any) => field.type === "email",
  );
  if (emailField?.value) {
    vcard.push(`EMAIL;TYPE=INTERNET:${emailField.value}`);
  }

  const websiteField = profile.contactFields?.find(
    (field: any) => field.type === "website",
  );
  if (websiteField?.value) {
    vcard.push(`URL:${websiteField.value}`);
  }

  // Address
  if (profile.location) {
    vcard.push(`ADR;TYPE=WORK:;;${profile.location};;;;`);
  }

  // Note/Bio
  if (profile.bio) {
    vcard.push(`NOTE:${profile.bio}`);
  }

  // Photo
  if (profile.profileImageUrl) {
    vcard.push(`PHOTO;VALUE=URL:${profile.profileImageUrl}`);
  }

  // Social Links as URLs
  profile.socialLinks?.forEach((link: any) => {
    if (link.url) {
      vcard.push(`URL;TYPE=${link.platform.toUpperCase()}:${link.url}`);
    }
  });

  // End vCard
  vcard.push("END:VCARD");

  return vcard.join("\r\n");
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      include: {
        contactFields: {
          where: { isPublic: true },
          orderBy: { order: "asc" },
        },
        socialLinks: {
          where: { isPublic: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const vcardContent = generateVCardFromProfile(profile);
    const fileName = `${profile.name?.replace(/\s+/g, "_") || "contact"}.vcf`;

    // Log analytics for vCard download
    try {
      await db.profileAnalytic.create({
        data: {
          profileId: profile.id,
          event: "download",
          metadata: {
            type: "vcard",
            userAgent: request.headers.get("user-agent"),
          },
          userAgent: request.headers.get("user-agent"),
          ipAddress: request.ip || request.headers.get("x-forwarded-for"),
        },
      });
    } catch (analyticsError) {
      console.warn("Failed to log analytics:", analyticsError);
    }

    return new NextResponse(vcardContent, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("vCard generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate vCard" },
      { status: 500 },
    );
  }
}

// POST /api/vcard - Generate vCard for public profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId } = body;

    if (!profileId) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 },
      );
    }

    const profile = await db.profile.findFirst({
      where: {
        OR: [{ id: profileId }, { customUrl: profileId }],
        isPublic: true,
        allowDownload: true,
      },
      include: {
        contactFields: {
          where: { isPublic: true },
          orderBy: { order: "asc" },
        },
        socialLinks: {
          where: { isPublic: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found or download not allowed" },
        { status: 404 },
      );
    }

    const vcardContent = generateVCardFromProfile(profile);

    // Log analytics for public vCard download
    try {
      await db.profileAnalytic.create({
        data: {
          profileId: profile.id,
          event: "download",
          metadata: {
            type: "vcard",
            public: true,
            userAgent: request.headers.get("user-agent"),
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
      vcard: vcardContent,
      filename: `${profile.name?.replace(/\s+/g, "_") || "contact"}.vcf`,
    });
  } catch (error) {
    console.error("Public vCard generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate vCard" },
      { status: 500 },
    );
  }
}
