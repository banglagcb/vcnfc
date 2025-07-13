export interface AuthUser {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  profile?: {
    id: string;
    customUrl: string;
  };
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  private baseUrl = "/api/auth";

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Logout failed");
      }

      return data;
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Logout failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get user data");
      }

      return data;
    } catch (error) {
      console.error("Get current user error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get user data",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async checkAuth(): Promise<boolean> {
    const result = await this.getCurrentUser();
    return result.success && !!result.user;
  }
}

export const authService = new AuthService();
