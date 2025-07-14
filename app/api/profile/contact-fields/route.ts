import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const contactFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(["email", "phone", "website", "text"]),
  icon: z.string().optional(),
  isPublic: z.boolean().default(true),
  order: z.number().default(0),
});

// POST /api/profile/contact-fields - Add new contact field
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validatedData = contactFieldSchema.parse(body);

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const contactField = await db.contactField.create({
      data: {
        profileId: profile.id,
        ...validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Contact field added successfully",
      contactField,
    });
  } catch (error) {
    console.error("Add contact field error:", error);

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

// PUT /api/profile/contact-fields - Update multiple contact fields
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { contactFields } = body;

    if (!Array.isArray(contactFields)) {
      return NextResponse.json(
        { error: "contactFields must be an array" },
        { status: 400 },
      );
    }

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Delete existing contact fields and create new ones
    await db.$transaction(async (tx) => {
      await tx.contactField.deleteMany({
        where: { profileId: profile.id },
      });

      for (const field of contactFields) {
        const validatedField = contactFieldSchema.parse(field);
        await tx.contactField.create({
          data: {
            profileId: profile.id,
            ...validatedField,
          },
        });
      }
    });

    const updatedContactFields = await db.contactField.findMany({
      where: { profileId: profile.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Contact fields updated successfully",
      contactFields: updatedContactFields,
    });
  } catch (error) {
    console.error("Update contact fields error:", error);

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
