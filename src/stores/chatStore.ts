import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Conversation, Message, ModelId } from '../types'

function generateId() {
  return Math.random().toString(36).slice(2, 11)
}

function generateTitle(firstMessage: string): string {
  const words = firstMessage.trim().split(/\s+/).slice(0, 6)
  return words.join(' ') + (firstMessage.split(/\s+/).length > 6 ? '...' : '')
}

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  apiKey: string
  isSettingsOpen: boolean
  isDarkMode: boolean
  isLoading: boolean

  // Actions
  setApiKey: (key: string) => void
  setSettingsOpen: (open: boolean) => void
  toggleDarkMode: () => void
  setLoading: (loading: boolean) => void

  createConversation: (model?: ModelId) => string
  deleteConversation: (id: string) => void
  selectConversation: (id: string) => void
  clearConversations: () => void

  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => string
  updateMessage: (conversationId: string, messageId: string, content: string, isStreaming?: boolean) => void
  setConversationModel: (conversationId: string, model: ModelId) => void

  activeConversation: () => Conversation | null
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      apiKey: '',
      isSettingsOpen: false,
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      isLoading: false,

      setApiKey: (key) => set({ apiKey: key }),
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      setLoading: (loading) => set({ isLoading: loading }),

      createConversation: (model = 'gpt-4o') => {
        const id = generateId()
        const conv: Conversation = {
          id,
          title: 'New conversation',
          messages: [],
          model,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeConversationId: id,
        }))
        return id
      },

      deleteConversation: (id) => {
        set((s) => {
          const filtered = s.conversations.filter((c) => c.id !== id)
          const nextId = s.activeConversationId === id
            ? (filtered[0]?.id ?? null)
            : s.activeConversationId
          return { conversations: filtered, activeConversationId: nextId }
        })
      },

      selectConversation: (id) => set({ activeConversationId: id }),

      clearConversations: () => set({ conversations: [], activeConversationId: null }),

      addMessage: (conversationId, msg) => {
        const id = generateId()
        const message: Message = { ...msg, id, createdAt: new Date() }
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const messages = [...c.messages, message]
            const title =
              c.messages.length === 0 && msg.role === 'user'
                ? generateTitle(msg.content)
                : c.title
            return { ...c, messages, title, updatedAt: new Date() }
          }),
        }))
        return id
      },

      updateMessage: (conversationId, messageId, content, isStreaming) => {
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content, isStreaming: isStreaming ?? false } : m
              ),
              updatedAt: new Date(),
            }
          }),
        }))
      },

      setConversationModel: (conversationId, model) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, model } : c
          ),
        }))
      },

      activeConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find((c) => c.id === activeConversationId) ?? null
      },
    }),
    {
      name: 'ai-chat-storage',
      partialize: (s) => ({
        conversations: s.conversations,
        activeConversationId: s.activeConversationId,
        apiKey: s.apiKey,
        isDarkMode: s.isDarkMode,
      }),
    }
  )
)
