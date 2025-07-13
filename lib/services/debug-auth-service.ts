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

class DebugAuthService {
  private baseUrl = "/api/auth";

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        credentials: "include",
      });

      return {
        success: response.ok,
        message: `Status: ${response.status} ${response.statusText}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log("🔍 Debug: Starting login request...");

    try {
      // Test if API endpoint exists
      console.log("🔍 Debug: Testing API connection...");
      const testResult = await this.testConnection();
      console.log("🔍 Debug: Connection test result:", testResult);

      console.log(
        "🔍 Debug: Making login request to:",
        `${this.baseUrl}/login`,
      );
      console.log("🔍 Debug: Request body:", credentials);

      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      console.log("🔍 Debug: Response status:", response.status);
      console.log(
        "🔍 Debug: Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      // Check if response body can be read
      const responseText = await response.text();
      console.log("🔍 Debug: Raw response text:", responseText);

      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("🔍 Debug: JSON parse error:", parseError);
        return {
          success: false,
          message: "Invalid response format from server",
          error: "JSON_PARSE_ERROR",
        };
      }

      console.log("🔍 Debug: Parsed response data:", data);

      if (!response.ok) {
        const errorMessage =
          data.error || data.message || `HTTP ${response.status}`;
        console.error("🔍 Debug: Login failed:", errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      }

      console.log("🔍 Debug: Login successful!");
      return {
        success: true,
        message: data.message || "Login successful",
        user: data.user,
        profile: data.profile,
      };
    } catch (error) {
      console.error("🔍 Debug: Login exception:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      };
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log("🔍 Debug: Starting registration request...");

    try {
      console.log(
        "🔍 Debug: Making registration request to:",
        `${this.baseUrl}/register`,
      );
      console.log("🔍 Debug: Request body:", {
        ...userData,
        password: "[HIDDEN]",
      });

      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      console.log("🔍 Debug: Response status:", response.status);

      const responseText = await response.text();
      console.log("🔍 Debug: Raw response text:", responseText);

      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("🔍 Debug: JSON parse error:", parseError);
        return {
          success: false,
          message: "Invalid response format from server",
          error: "JSON_PARSE_ERROR",
        };
      }

      if (!response.ok) {
        const errorMessage =
          data.error || data.message || `HTTP ${response.status}`;
        console.error("🔍 Debug: Registration failed:", errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      }

      console.log("🔍 Debug: Registration successful!");
      return {
        success: true,
        message: data.message || "Registration successful",
        user: data.user,
        profile: data.profile,
      };
    } catch (error) {
      console.error("🔍 Debug: Registration exception:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      };
    }
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      return {
        success: response.ok,
        message: data.message || "Logout completed",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Logout failed",
      };
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        credentials: "include",
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        return {
          success: false,
          message: data.error || "Not authenticated",
        };
      }

      return {
        success: true,
        message: "User retrieved successfully",
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get user",
      };
    }
  }

  async checkAuth(): Promise<boolean> {
    const result = await this.getCurrentUser();
    return result.success && !!result.user;
  }
}

export const debugAuthService = new DebugAuthService();
