import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderType: "user" | "admin"
  content: string
  type: "text" | "image" | "file"
  timestamp: Date
  status: "sent" | "delivered" | "read"
  fileUrl?: string
  fileName?: string
}

export interface Chat {
  id: string
  userId: string
  userName: string
  userEmail: string
  status: "active" | "waiting" | "closed"
  priority: "low" | "medium" | "high"
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

interface ChatState {
  chats: Chat[]
  messages: Message[]
  currentChatId: string | null
  isTyping: { [chatId: string]: boolean }
  onlineUsers: string[]

  // Actions
  addChat: (chat: Omit<Chat, "id" | "createdAt" | "updatedAt">) => string
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  deleteChat: (chatId: string) => void

  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  updateMessageStatus: (messageId: string, status: Message["status"]) => void

  setCurrentChat: (chatId: string | null) => void
  setTyping: (chatId: string, isTyping: boolean) => void
  setUserOnline: (userId: string, online: boolean) => void

  getChatMessages: (chatId: string) => Message[]
  getUnreadChats: () => Chat[]
  markChatAsRead: (chatId: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      messages: [],
      currentChatId: null,
      isTyping: {},
      onlineUsers: [],

      addChat: (chatData) => {
        const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newChat: Chat = {
          ...chatData,
          id: chatId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          chats: [newChat, ...state.chats],
        }))

        return chatId
      },

      updateChat: (chatId, updates) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, ...updates, updatedAt: new Date() } : chat,
          ),
        }))
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          messages: state.messages.filter((message) => message.chatId !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
        }))
      },

      addMessage: (messageData) => {
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newMessage: Message = {
          ...messageData,
          id: messageId,
          timestamp: new Date(),
        }

        set((state) => {
          const updatedChats = state.chats.map((chat) => {
            if (chat.id === messageData.chatId) {
              return {
                ...chat,
                lastMessage: newMessage,
                unreadCount: messageData.senderType === "user" ? chat.unreadCount + 1 : chat.unreadCount,
                updatedAt: new Date(),
              }
            }
            return chat
          })

          return {
            messages: [...state.messages, newMessage],
            chats: updatedChats,
          }
        })
      },

      updateMessageStatus: (messageId, status) => {
        set((state) => ({
          messages: state.messages.map((message) => (message.id === messageId ? { ...message, status } : message)),
        }))
      },

      setCurrentChat: (chatId) => {
        set({ currentChatId: chatId })
      },

      setTyping: (chatId, isTyping) => {
        set((state) => ({
          isTyping: {
            ...state.isTyping,
            [chatId]: isTyping,
          },
        }))
      },

      setUserOnline: (userId, online) => {
        set((state) => ({
          onlineUsers: online
            ? [...state.onlineUsers.filter((id) => id !== userId), userId]
            : state.onlineUsers.filter((id) => id !== userId),
        }))
      },

      getChatMessages: (chatId) => {
        return get().messages.filter((message) => message.chatId === chatId)
      },

      getUnreadChats: () => {
        return get().chats.filter((chat) => chat.unreadCount > 0)
      },

      markChatAsRead: (chatId) => {
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)),
        }))
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
      }),
    },
  ),
)
