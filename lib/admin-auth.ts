export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "moderator" | "user"
  permissions: string[]
  avatar?: string
  lastLogin?: Date
  isActive: boolean
}

export interface AdminSession {
  user: User
  token: string
  expiresAt: Date
}

// Mock admin users for demo
const mockAdmins: User[] = [
  {
    id: "1",
    email: "admin@shareinfo.com",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
    avatar: "/placeholder.svg?height=40&width=40",
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "2",
    email: "moderator@shareinfo.com",
    name: "Moderator User",
    role: "moderator",
    permissions: ["users", "orders", "products"],
    avatar: "/placeholder.svg?height=40&width=40",
    lastLogin: new Date(),
    isActive: true,
  },
]

export class AdminAuth {
  private static instance: AdminAuth
  private session: AdminSession | null = null

  static getInstance(): AdminAuth {
    if (!AdminAuth.instance) {
      AdminAuth.instance = new AdminAuth()
    }
    return AdminAuth.instance
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication
    if (password !== "admin123") {
      return { success: false, error: "Invalid credentials" }
    }

    const user = mockAdmins.find((admin) => admin.email === email)
    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!user.isActive) {
      return { success: false, error: "Account is deactivated" }
    }

    const session: AdminSession = {
      user,
      token: `token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }

    this.session = session

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_session", JSON.stringify(session))
    }

    return { success: true, session }
  }

  logout(): void {
    this.session = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_session")
    }
  }

  getSession(): AdminSession | null {
    if (this.session) {
      return this.session
    }

    // Try to restore from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_session")
      if (stored) {
        try {
          const session = JSON.parse(stored)
          if (new Date(session.expiresAt) > new Date()) {
            this.session = session
            return session
          } else {
            localStorage.removeItem("admin_session")
          }
        } catch (error) {
          localStorage.removeItem("admin_session")
        }
      }
    }

    return null
  }

  isAuthenticated(): boolean {
    const session = this.getSession()
    return session !== null && new Date(session.expiresAt) > new Date()
  }

  hasPermission(permission: string): boolean {
    const session = this.getSession()
    if (!session) return false

    return session.user.permissions.includes("all") || session.user.permissions.includes(permission)
  }

  getCurrentUser(): User | null {
    const session = this.getSession()
    return session?.user || null
  }
}

export const adminAuth = AdminAuth.getInstance()
