"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Minimize2, Maximize2, X, Paperclip, File } from "lucide-react"
import { useChatStore } from "@/lib/chat-store"
import { cn } from "@/lib/utils"

interface ChatWidgetProps {
  userId?: string
  userName?: string
  userEmail?: string
}

export function ChatWidget({
  userId = "user_123",
  userName = "Guest User",
  userEmail = "guest@example.com",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { chats, messages, isTyping, onlineUsers, addChat, addMessage, setTyping, getChatMessages, getUnreadChats } =
    useChatStore()

  const userChats = chats.filter((chat) => chat.userId === userId)
  const activeChat = userChats.find((chat) => chat.id === currentChatId)
  const chatMessages = currentChatId ? getChatMessages(currentChatId) : []
  const unreadChats = getUnreadChats()
  const totalUnread = unreadChats.reduce((sum, chat) => sum + chat.unreadCount, 0)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

  useEffect(() => {
    if (isOpen && userChats.length === 0) {
      // Create initial chat when widget opens
      const chatId = addChat({
        userId,
        userName,
        userEmail,
        status: "waiting",
        priority: "medium",
        unreadCount: 0,
        tags: ["new"],
      })
      setCurrentChatId(chatId)
    } else if (userChats.length > 0 && !currentChatId) {
      setCurrentChatId(userChats[0].id)
    }
  }, [isOpen, userChats.length, userId, userName, userEmail, addChat, currentChatId])

  const handleSendMessage = () => {
    if (!message.trim() || !currentChatId) return

    addMessage({
      chatId: currentChatId,
      senderId: userId,
      senderName: userName,
      senderType: "user",
      content: message.trim(),
      type: "text",
      status: "sent",
    })

    setMessage("")

    // Simulate admin response after 2 seconds
    setTimeout(() => {
      addMessage({
        chatId: currentChatId,
        senderId: "admin_1",
        senderName: "Support Team",
        senderType: "admin",
        content: "ধন্যবাদ আপনার মেসেজের জন্য। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
        type: "text",
        status: "sent",
      })
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentChatId) return

    const fileUrl = URL.createObjectURL(file)
    const fileType = file.type.startsWith("image/") ? "image" : "file"

    addMessage({
      chatId: currentChatId,
      senderId: userId,
      senderName: userName,
      senderType: "user",
      content: `Sent a ${fileType}: ${file.name}`,
      type: fileType,
      status: "sent",
      fileUrl,
      fileName: file.name,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500">
              {totalUnread > 99 ? "99+" : totalUnread}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={cn("w-80 shadow-xl transition-all duration-300", isMinimized ? "h-14" : "h-96")}>
        <CardHeader className="flex flex-row items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/support-avatar.png" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">Support Team</CardTitle>
              <p className="text-xs opacity-90">{onlineUsers.includes("admin_1") ? "Online" : "Offline"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-blue-700"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>আপনার প্রশ্ন লিখুন...</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn("flex", msg.senderType === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-2 text-sm",
                          msg.senderType === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900",
                        )}
                      >
                        {msg.type === "image" && msg.fileUrl && (
                          <img
                            src={msg.fileUrl || "/placeholder.svg"}
                            alt={msg.fileName}
                            className="max-w-full h-auto rounded mb-1"
                          />
                        )}
                        {msg.type === "file" && msg.fileUrl && (
                          <div className="flex items-center space-x-2 mb-1">
                            <File className="h-4 w-4" />
                            <span className="text-xs">{msg.fileName}</span>
                          </div>
                        )}
                        <p>{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString("bn-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {currentChatId && isTyping[currentChatId] && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-2 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="আপনার মেসেজ লিখুন..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()} size="icon" className="h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
