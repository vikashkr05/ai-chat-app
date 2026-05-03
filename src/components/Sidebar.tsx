import { Plus, Trash2, MessageSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useChatStore } from '../stores/chatStore'

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    createConversation,
    deleteConversation,
    selectConversation,
    clearConversations,
    setSettingsOpen,
  } = useChatStore()

  const [collapsed, setCollapsed] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (collapsed) {
    return (
      <div className="w-12 flex flex-col items-center py-4 gap-3 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => createConversation()}
          className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          title="New chat"
        >
          <Plus size={16} />
        </button>
      </div>
    )
  }

  return (
    <aside className="w-64 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 h-full flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <MessageSquare size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">AI Chat</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
      </div>

      {/* New chat button */}
      <div className="px-3 py-2">
        <button
          onClick={() => createConversation()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
        >
          <Plus size={15} />
          New conversation
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {conversations.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-8 px-3">
            No conversations yet. Start chatting!
          </p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onMouseEnter={() => setHoveredId(conv.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
              conv.id === activeConversationId
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => selectConversation(conv.id)}
          >
            <MessageSquare size={14} className="flex-shrink-0 opacity-60" />
            <span className="flex-1 truncate text-xs leading-tight">{conv.title}</span>
            {hoveredId === conv.id && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                className="flex-shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-2 py-2 space-y-0.5">
        {conversations.length > 0 && (
          <button
            onClick={() => { if (confirm('Clear all conversations?')) clearConversations() }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Trash2 size={13} />
            Clear all
          </button>
        )}
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings size={13} />
          Settings & API Key
        </button>
      </div>
    </aside>
  )
}
