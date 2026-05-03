import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Bot, User } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../types'
import { useChatStore } from '../stores/chatStore'

interface Props {
  message: Message
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      title="Copy code"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

export function ChatMessage({ message }: Props) {
  const isDark = useChatStore((s) => s.isDarkMode)
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 py-4 px-4 animate-[slideUp_0.2s_ease-out] ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
        ${isUser
          ? 'bg-indigo-500'
          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
        }`}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <span className="text-xs text-gray-400 dark:text-gray-500 px-1">
          {isUser ? 'You' : 'Assistant'}
        </span>

        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : message.isStreaming && message.content === '' ? (
            <div className="flex items-center gap-1 py-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeText = String(children).replace(/\n$/, '')
                    if (match) {
                      return (
                        <div className="relative group my-3">
                          <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 text-gray-400 text-xs px-4 py-2 rounded-t-lg border-b border-gray-700">
                            <span>{match[1]}</span>
                          </div>
                          <CopyButton text={codeText} />
                          <SyntaxHighlighter
                            language={match[1]}
                            style={isDark ? oneDark : oneLight}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: '0 0 8px 8px',
                              fontSize: '13px',
                            }}
                          >
                            {codeText}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
