import { useRef, useState, useEffect } from 'react'
import { Send, Square, Paperclip } from 'lucide-react'

interface Props {
  onSend: (text: string) => void
  isLoading: boolean
  onStop?: () => void
  disabled?: boolean
}

const SUGGESTIONS = [
  'Explain how React Server Components work',
  'Write a Python script to scrape a website',
  'Compare REST vs GraphQL APIs',
  'Help me design a database schema',
]

export function ChatInput({ onSend, isLoading, onStop, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = () => {
    const text = value.trim()
    if (!text || isLoading) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isEmpty = value.trim().length === 0

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4">
      {/* Suggestions (shown when empty + no loading) */}
      {isEmpty && !isLoading && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setValue(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-gray-900"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-colors">
        <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors mb-0.5">
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none py-0.5 leading-relaxed max-h-[200px] disabled:opacity-50"
        />

        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors mb-0.5"
          >
            <Square size={14} fill="white" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isEmpty || disabled}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors mb-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
        Press <kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">Enter</kbd> to send, <kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">Shift+Enter</kbd> for new line
      </p>
    </div>
  )
}
