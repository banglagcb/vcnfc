import { NextRequest } from "next/server";
import { POST as registerHandler } from "@/app/api/auth/register/route";
import { POST as loginHandler } from "@/app/api/auth/login/route";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// Mock the database
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    profile: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateToken: jest.fn(),
  generateCustomUrl: jest.fn(),
}));

describe("/api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const mockUser = {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      verified: false,
    };

    const mockProfile = {
      id: "profile-1",
      customUrl: "test-user-123",
    };

    (db.user.findUnique as jest.Mock).mockResolvedValue(null);
    (hashPassword as jest.Mock).mockResolvedValue("hashed-password");
    (db.$transaction as jest.Mock).mockResolvedValue({
      user: mockUser,
      profile: mockProfile,
    });

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await registerHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe("test@example.com");
  });

  it("should return error for existing user", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "existing-user",
      email: "test@example.com",
    });

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await registerHandler(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("User already exists");
  });

  it("should validate input data", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "",
        email: "invalid-email",
        password: "123",
      }),
    });

    const response = await registerHandler(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});

describe("/api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login user successfully", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      password: "hashed-password",
      verified: true,
      profile: {
        id: "profile-1",
        customUrl: "test-user",
      },
    };

    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    require("@/lib/auth").verifyPassword.mockResolvedValue(true);
    require("@/lib/auth").generateToken.mockReturnValue("mock-token");

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await loginHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe("test@example.com");
  });

  it("should return error for invalid credentials", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    });

    const response = await loginHandler(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid email or password");
  });
});
