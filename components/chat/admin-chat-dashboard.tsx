"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, Search, Clock, CheckCircle, AlertCircle, Paperclip, File } from "lucide-react"
import { useChatStore, type Chat } from "@/lib/chat-store"
import { cn } from "@/lib/utils"

export function AdminChatDashboard() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    chats,
    messages,
    isTyping,
    onlineUsers,
    addMessage,
    updateChat,
    setTyping,
    getChatMessages,
    markChatAsRead,
    setUserOnline,
  } = useChatStore()

  const selectedChat = chats.find((chat) => chat.id === selectedChatId)
  const chatMessages = selectedChatId ? getChatMessages(selectedChatId) : []

  // Filter chats based on search and filters
  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || chat.status === statusFilter
    const matchesPriority = priorityFilter === "all" || chat.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Statistics
  const stats = {
    total: chats.length,
    active: chats.filter((chat) => chat.status === "active").length,
    waiting: chats.filter((chat) => chat.status === "waiting").length,
    unread: chats.reduce((sum, chat) => sum + chat.unreadCount, 0),
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

  useEffect(() => {
    // Simulate admin being online
    setUserOnline("admin_1", true)

    return () => {
      setUserOnline("admin_1", false)
    }
  }, [setUserOnline])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChatId) return

    addMessage({
      chatId: selectedChatId,
      senderId: "admin_1",
      senderName: "Support Admin",
      senderType: "admin",
      content: message.trim(),
      type: "text",
      status: "sent",
    })

    // Update chat status to active
    updateChat(selectedChatId, { status: "active" })

    setMessage("")
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
    markChatAsRead(chatId)
  }

  const handleStatusChange = (chatId: string, status: Chat["status"]) => {
    updateChat(chatId, { status })
  }

  const handlePriorityChange = (chatId: string, priority: Chat["priority"]) => {
    updateChat(chatId, { priority })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedChatId) return

    const fileUrl = URL.createObjectURL(file)
    const fileType = file.type.startsWith("image/") ? "image" : "file"

    addMessage({
      chatId: selectedChatId,
      senderId: "admin_1",
      senderName: "Support Admin",
      senderType: "admin",
      content: `Sent a ${fileType}: ${file.name}`,
      type: fileType,
      status: "sent",
      fileUrl,
      fileName: file.name,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold mb-4">Chat Dashboard</h1>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="font-semibold">{stats.total}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Active</p>
                  <p className="font-semibold">{stats.active}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-600">Waiting</p>
                  <p className="font-semibold">{stats.waiting}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Unread</p>
                  <p className="font-semibold">{stats.unread}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className={cn(
                  "mb-2 cursor-pointer transition-colors hover:bg-gray-50",
                  selectedChatId === chat.id && "bg-blue-50 border-blue-200",
                )}
                onClick={() => handleChatSelect(chat.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{chat.userName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{chat.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{chat.userEmail}</p>
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">{chat.unreadCount}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <Badge className={cn("text-xs", getStatusColor(chat.status))}>{chat.status}</Badge>
                    <Badge className={cn("text-xs", getPriorityColor(chat.priority))}>{chat.priority}</Badge>
                  </div>

                  {chat.lastMessage && <p className="text-xs text-gray-600 truncate">{chat.lastMessage.content}</p>}

                  <p className="text-xs text-gray-400 mt-1">{chat.updatedAt.toLocaleString("bn-BD")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{selectedChat.userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedChat.userName}</h2>
                  <p className="text-sm text-gray-600">{selectedChat.userEmail}</p>
                </div>
                {onlineUsers.includes(selectedChat.userId) && (
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Select
                  value={selectedChat.status}
                  onValueChange={(value) => handleStatusChange(selectedChat.id, value as Chat["status"])}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedChat.priority}
                  onValueChange={(value) => handlePriorityChange(selectedChat.id, value as Chat["priority"])}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.senderType === "admin" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        msg.senderType === "admin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900",
                      )}
                    >
                      {msg.type === "image" && msg.fileUrl && (
                        <img
                          src={msg.fileUrl || "/placeholder.svg"}
                          alt={msg.fileName}
                          className="max-w-full h-auto rounded mb-2"
                        />
                      )}
                      {msg.type === "file" && msg.fileUrl && (
                        <div className="flex items-center space-x-2 mb-2">
                          <File className="h-4 w-4" />
                          <span className="text-sm">{msg.fileName}</span>
                        </div>
                      )}
                      <p>{msg.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">{msg.senderName}</p>
                        <p className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString("bn-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedChatId && isTyping[selectedChatId] && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
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

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat to start messaging</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
