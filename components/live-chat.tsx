"use client"

import { ChatWidget } from "@/components/chat/chat-widget"
import { useEffect, useState } from "react"

export function LiveChat() {
  const [userId, setUserId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    // Generate or get user ID from localStorage
    let storedUserId = localStorage.getItem("chat-user-id")
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("chat-user-id", storedUserId)
    }
    setUserId(storedUserId)

    // Get user info from localStorage or set defaults
    const storedUserName = localStorage.getItem("chat-user-name") || "Guest User"
    const storedUserEmail = localStorage.getItem("chat-user-email") || "guest@example.com"

    setUserName(storedUserName)
    setUserEmail(storedUserEmail)
  }, [])

  if (!userId) return null

  return <ChatWidget userId={userId} userName={userName} userEmail={userEmail} />
}
