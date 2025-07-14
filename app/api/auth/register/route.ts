import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateToken, generateCustomUrl } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user and profile in a transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
        },
      });

      // Create default profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          firstName: validatedData.name.split(" ")[0],
          lastName: validatedData.name.split(" ").slice(1).join(" ") || "",
          name: validatedData.name,
          email: validatedData.email,
          customUrl: generateCustomUrl(validatedData.name),
        },
      });

      return { user, profile };
    });

    // Generate JWT token
    const token = generateToken({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      verified: result.user.verified,
    });

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        verified: result.user.verified,
      },
      profile: {
        id: result.profile.id,
        customUrl: result.profile.customUrl,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

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
