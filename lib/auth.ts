import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export const verifyToken = (token: string): AuthUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getAuthUser = async (
  request: NextRequest,
): Promise<AuthUser | null> => {
  try {
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    // Verify user still exists and is active
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, verified: true },
    });

    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
};

export const requireAuth = async (request: NextRequest): Promise<AuthUser> => {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
};

export const generateCustomUrl = (name: string): string => {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() +
    "-" +
    Math.random().toString(36).substring(2, 8)
  );
};
