import { useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { ChatWindow } from './components/ChatWindow'
import { SettingsModal } from './components/SettingsModal'
import { useChatStore } from './stores/chatStore'
import './index.css'

export default function App() {
  const { isDarkMode, toggleDarkMode } = useChatStore()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <header className="flex items-center justify-end px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>

        {/* Chat */}
        <ChatWindow />
      </main>

      {/* Settings modal */}
      <SettingsModal />
    </div>
  )
}
