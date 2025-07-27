import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminUser {
  id: string
  username: string
  email: string
  role: "super_admin" | "admin" | "moderator"
  permissions: string[]
  lastLogin: string
  isActive: boolean
}

interface AdminAuthState {
  admin: AdminUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkPermission: (permission: string) => boolean
}

// Mock admin users
const mockAdmins = [
  {
    id: "1",
    username: "admin",
    email: "admin@shareinfo.com",
    password: "admin123",
    role: "super_admin" as const,
    permissions: ["all"],
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "2",
    username: "moderator",
    email: "mod@shareinfo.com",
    password: "mod123",
    role: "moderator" as const,
    permissions: ["users.view", "orders.view", "products.view"],
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
]

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Mock authentication
        const admin = mockAdmins.find((a) => a.username === username && a.password === password)

        if (admin) {
          const { password: _, ...adminData } = admin
          set({
            admin: { ...adminData, lastLogin: new Date().toISOString() },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      logout: () => {
        set({ admin: null, isAuthenticated: false })
      },
      checkPermission: (permission: string) => {
        const admin = get().admin
        if (!admin) return false
        if (admin.permissions.includes("all")) return true
        return admin.permissions.includes(permission)
      },
    }),
    {
      name: "admin-auth",
    },
  ),
)
