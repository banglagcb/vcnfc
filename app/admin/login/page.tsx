"use client"

import { AdminLogin } from "@/components/admin-login"
import { AdminAuthProvider } from "@/lib/admin-auth"

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <AdminLogin />
    </AdminAuthProvider>
  )
}
