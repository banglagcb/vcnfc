import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'profile' | 'cover' | 'portfolio'
    const profileId = formData.get("profileId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        },
        { status: 400 },
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadOptions = {
      width: type === "profile" ? 400 : type === "cover" ? 1200 : 800,
      height: type === "profile" ? 400 : type === "cover" ? 400 : 600,
      crop: "limit" as const,
      quality: "auto:good" as const,
    };

    const result = await uploadImage(
      base64,
      `shareinfo/${type}`,
      uploadOptions,
    );

    // Update profile with new image URL
    if (type === "profile" || type === "cover") {
      const profile = await db.profile.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          profileImageId: true,
          coverImageId: true,
        },
      });

      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 },
        );
      }

      // Delete old image if exists
      const oldImageId =
        type === "profile" ? profile.profileImageId : profile.coverImageId;
      if (oldImageId) {
        try {
          await deleteImage(oldImageId);
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }

      // Update profile with new image
      const updateData =
        type === "profile"
          ? {
              profileImageUrl: result.secure_url,
              profileImageId: result.public_id,
            }
          : {
              coverImageUrl: result.secure_url,
              coverImageId: result.public_id,
            };

      await db.profile.update({
        where: { userId: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");
    const type = searchParams.get("type"); // 'profile' | 'cover'

    if (!imageId || !type) {
      return NextResponse.json(
        { error: "Missing imageId or type parameter" },
        { status: 400 },
      );
    }

    // Delete from Cloudinary
    await deleteImage(imageId);

    // Update profile to remove image reference
    if (type === "profile" || type === "cover") {
      const updateData =
        type === "profile"
          ? {
              profileImageUrl: null,
              profileImageId: null,
            }
          : {
              coverImageUrl: null,
              coverImageId: null,
            };

      await db.profile.update({
        where: { userId: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Image delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
