"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Admin {
  id: string
  username: string
  email: string
  role: "super_admin" | "admin" | "moderator"
  permissions: string[]
  lastLogin: Date
}

interface AdminAuthContextType {
  admin: Admin | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Mock admin data - in real app, this would come from your backend
const mockAdmins = [
  {
    id: "1",
    username: "admin",
    password: "admin123", // In real app, this would be hashed
    email: "admin@shareinfo.com",
    role: "super_admin" as const,
    permissions: ["*"], // Super admin has all permissions
    lastLogin: new Date(),
  },
  {
    id: "2",
    username: "moderator",
    password: "mod123",
    email: "mod@shareinfo.com",
    role: "moderator" as const,
    permissions: ["users.read", "orders.read", "products.read", "support.manage"],
    lastLogin: new Date(),
  },
]

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const savedAdmin = localStorage.getItem("admin")
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin)
        setAdmin(adminData)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem("admin")
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // In real app, this would be an API call
    const foundAdmin = mockAdmins.find((a) => a.username === username && a.password === password)

    if (foundAdmin) {
      const adminData: Admin = {
        id: foundAdmin.id,
        username: foundAdmin.username,
        email: foundAdmin.email,
        role: foundAdmin.role,
        permissions: foundAdmin.permissions,
        lastLogin: new Date(),
      }

      setAdmin(adminData)
      setIsAuthenticated(true)
      localStorage.setItem("admin", JSON.stringify(adminData))
      return true
    }

    return false
  }

  const logout = () => {
    setAdmin(null)
    setIsAuthenticated(false)
    localStorage.removeItem("admin")
  }

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false
    if (admin.permissions.includes("*")) return true // Super admin
    return admin.permissions.includes(permission)
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
