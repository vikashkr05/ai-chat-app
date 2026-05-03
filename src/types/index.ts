export type Role = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: Role
  content: string
  createdAt: Date
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: ModelId
  createdAt: Date
  updatedAt: Date
}

export type ModelId =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'

export interface ModelOption {
  id: ModelId
  name: string
  description: string
  contextWindow: string
  badge?: string
}

export const MODELS: ModelOption[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable, multimodal',
    contextWindow: '128K',
    badge: 'Best',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    description: 'Fast and affordable',
    contextWindow: '128K',
    badge: 'Fast',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Powerful with vision',
    contextWindow: '128K',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Classic, cost-effective',
    contextWindow: '16K',
  },
]
