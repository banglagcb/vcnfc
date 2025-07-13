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

  private async makeRequest(
    url: string,
    options: RequestInit,
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
      });

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get("content-type");
      let data: any = {};

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.warn("Failed to parse JSON response:", jsonError);
          data = { error: "Invalid response format" };
        }
      } else {
        // If not JSON, try to read as text
        try {
          const text = await response.text();
          data = { message: text || "No response data" };
        } catch (textError) {
          console.warn("Failed to read response:", textError);
          data = { error: "Failed to read response" };
        }
      }

      if (!response.ok) {
        const errorMessage =
          data.error ||
          data.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return {
        success: true,
        message: data.message || "Operation successful",
        user: data.user,
        profile: data.profile,
        ...data,
      };
    } catch (error) {
      console.error("Request error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest(`${this.baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest(`${this.baseUrl}/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<AuthResponse> {
    return this.makeRequest(`${this.baseUrl}/logout`, {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.makeRequest(`${this.baseUrl}/me`, {
      method: "GET",
    });
  }

  async checkAuth(): Promise<boolean> {
    const result = await this.getCurrentUser();
    return result.success && !!result.user;
  }
}

export const authService = new AuthService();
