import { useEffect, useRef, useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { useChatStore } from '../stores/chatStore'
import { streamChat } from '../lib/openai'
import type { ModelId } from '../types'
import { MODELS } from '../types'

export function ChatWindow() {
  const {
    activeConversation,
    addMessage,
    updateMessage,
    createConversation,
    apiKey,
    isLoading,
    setLoading,
    setSettingsOpen,
    setConversationModel,
  } = useChatStore()

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<boolean>(false)
  const conversation = activeConversation()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  const handleSend = useCallback(
    async (text: string) => {
      if (!apiKey) {
        setSettingsOpen(true)
        return
      }

      let convId = conversation?.id
      if (!convId) {
        convId = createConversation()
      }

      const model: ModelId = conversation?.model ?? 'gpt-4o'

      // Add user message
      addMessage(convId, { role: 'user', content: text })

      // Add streaming assistant placeholder
      const assistantId = addMessage(convId, {
        role: 'assistant',
        content: '',
        isStreaming: true,
      })

      setLoading(true)
      abortRef.current = false

      const conv = useChatStore.getState().conversations.find((c) => c.id === convId)
      const messages = conv?.messages.filter((m) => !m.isStreaming) ?? []

      let accumulated = ''

      await streamChat(
        apiKey,
        model,
        messages,
        (chunk) => {
          if (abortRef.current) return
          accumulated += chunk
          updateMessage(convId!, assistantId, accumulated, true)
        },
        () => {
          updateMessage(convId!, assistantId, accumulated, false)
          setLoading(false)
        },
        (err) => {
          const errMsg = err.message.includes('API key')
            ? '⚠️ Invalid API key. Please check your settings.'
            : `⚠️ Error: ${err.message}`
          updateMessage(convId!, assistantId, errMsg, false)
          setLoading(false)
        }
      )
    },
    [conversation, apiKey, addMessage, updateMessage, createConversation, setLoading, setSettingsOpen]
  )

  const handleStop = () => {
    abortRef.current = true
    setLoading(false)
  }

  const messages = conversation?.messages ?? []
  const isEmpty = messages.length === 0

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Model selector bar */}
      {conversation && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <span className="text-xs text-gray-500 dark:text-gray-400">Model:</span>
          <select
            value={conversation.model}
            onChange={(e) => setConversationModel(conversation.id, e.target.value as ModelId)}
            className="text-xs text-gray-700 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:border-indigo-400 cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} {m.badge ? `(${m.badge})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
              <Sparkles size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What can I help with?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                Ask me anything — code, writing, analysis, or just a conversation.
              </p>
            </div>
            {!apiKey && (
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl font-medium transition-colors"
              >
                Add OpenAI API Key to start
              </button>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full py-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto w-full">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          onStop={handleStop}
          disabled={!apiKey && isEmpty}
        />
      </div>
    </div>
  )
}
