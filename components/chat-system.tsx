"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Phone,
  Video,
  Search,
  Paperclip,
  Smile,
  Users,
  Circle,
  CheckCheck,
  Clock,
} from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
  type: "text" | "image" | "file"
}

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  isGroup: boolean
  participants?: string[]
}

interface User {
  id: string
  name: string
  avatar: string
  role: "admin" | "user" | "support"
  isOnline: boolean
}

export function ChatSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUser] = useState<User>({
    id: "user-1",
    name: "আপনি",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    isOnline: true,
  })

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "admin-support",
      name: "অ্যাডমিন সাপোর্ট",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "আপনার সমস্যার সমাধান করতে আমরা এখানে আছি",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      isGroup: false,
    },
    {
      id: "user-2",
      name: "রহিম উদ্দিন",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "আপনার কার্ডের ডিজাইন খুবই সুন্দর!",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      isGroup: false,
    },
    {
      id: "user-3",
      name: "ফাতেমা খাতুন",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "ধন্যবাদ আপনার সাহায্যের জন্য",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true,
      isGroup: false,
    },
    {
      id: "group-1",
      name: "NFC কার্ড ইউজার গ্রুপ",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "নতুন ফিচার সম্পর্কে আলোচনা",
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 3,
      isOnline: true,
      isGroup: true,
      participants: ["user-1", "user-2", "user-3", "admin-1"],
    },
  ])

  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({
    "admin-support": [
      {
        id: "msg-1",
        senderId: "admin-1",
        senderName: "সাপোর্ট টিম",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content: "আসসালামু আলাইকুম! আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: "read",
        type: "text",
      },
      {
        id: "msg-2",
        senderId: "admin-1",
        senderName: "সাপোর্ট টিম",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content: "আপনার সমস্যার সমাধান করতে আমরা এখানে আছি",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: "delivered",
        type: "text",
      },
    ],
    "user-2": [
      {
        id: "msg-3",
        senderId: "user-2",
        senderName: "রহিম উদ্দিন",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content: "আপনার কার্ডের ডিজাইন খুবই সুন্দর!",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: "read",
        type: "text",
      },
    ],
    "user-3": [
      {
        id: "msg-4",
        senderId: "user-3",
        senderName: "ফাতেমা খাতুন",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content: "ধন্যবাদ আপনার সাহায্যের জন্য",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "read",
        type: "text",
      },
    ],
    "group-1": [
      {
        id: "msg-5",
        senderId: "user-2",
        senderName: "রহিম উদ্দিন",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content: "নতুন ফিচার সম্পর্কে আলোচনা",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: "read",
        type: "text",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeChat])

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: message.trim(),
      timestamp: new Date(),
      status: "sent",
      type: "text",
    }

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }))

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat ? { ...chat, lastMessage: message.trim(), lastMessageTime: new Date() } : chat,
      ),
    )

    setMessage("")

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now()}-response`,
        senderId: activeChat === "admin-support" ? "admin-1" : activeChat,
        senderName:
          activeChat === "admin-support" ? "সাপোর্ট টিম" : chats.find((c) => c.id === activeChat)?.name || "Unknown",
        senderAvatar: chats.find((c) => c.id === activeChat)?.avatar || "/placeholder.svg?height=32&width=32",
        content:
          activeChat === "admin-support"
            ? "আপনার বার্তার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
            : "ধন্যবাদ আপনার বার্তার জন্য!",
        timestamp: new Date(),
        status: "delivered",
        type: "text",
      }

      setMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), responseMessage],
      }))
    }, 2000)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "এখনই"
    if (minutes < 60) return `${minutes} মিনিট আগে`
    if (hours < 24) return `${hours} ঘন্টা আগে`
    if (days < 7) return `${days} দিন আগে`
    return date.toLocaleDateString("bn-BD")
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        {chats.reduce((total, chat) => total + chat.unreadCount, 0) > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500">
            {chats.reduce((total, chat) => total + chat.unreadCount, 0)}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`transition-all duration-300 ${isMinimized ? "h-14" : "h-[600px]"} w-80 shadow-2xl`}>
        {/* Header */}
        <CardHeader className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              <div>
                <CardTitle className="text-lg">
                  {activeChat ? chats.find((c) => c.id === activeChat)?.name : "চ্যাট সিস্টেম"}
                </CardTitle>
                {activeChat && (
                  <p className="text-xs opacity-90">
                    {chats.find((c) => c.id === activeChat)?.isOnline ? "অনলাইন" : "অফলাইন"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeChat && (
                <>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    <Video className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {!activeChat ? (
              // Chat List View
              <div className="flex flex-col h-full">
                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="চ্যাট খুঁজুন..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Chat List */}
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setActiveChat(chat.id)}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {chat.isOnline && (
                            <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                          )}
                          {chat.isGroup && (
                            <Users className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white rounded-full p-0.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                            <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              // Chat View
              <div className="flex flex-col h-full">
                {/* Back Button */}
                <div className="p-3 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveChat(null)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ← চ্যাট তালিকায় ফিরুন
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {(messages[activeChat] || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[80%] ${msg.senderId === currentUser.id ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {msg.senderId !== currentUser.id && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.senderAvatar || "/placeholder.svg"} />
                              <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              msg.senderId === currentUser.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {msg.senderId !== currentUser.id && (
                              <p className="text-xs font-semibold mb-1 opacity-70">{msg.senderName}</p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <div
                              className={`flex items-center gap-1 mt-1 ${
                                msg.senderId === currentUser.id ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                              {msg.senderId === currentUser.id && getStatusIcon(msg.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="একটি বার্তা লিখুন..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="pr-10"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-6 w-6 p-0">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={sendMessage} size="sm" disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
