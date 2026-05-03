import { useState } from 'react'
import { X, Key, Eye, EyeOff, ExternalLink, Check } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'

export function SettingsModal() {
  const { apiKey, setApiKey, isSettingsOpen, setSettingsOpen } = useChatStore()
  const [inputKey, setInputKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!isSettingsOpen) return null

  const handleSave = () => {
    setApiKey(inputKey.trim())
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setSettingsOpen(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={() => setSettingsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Close */}
        <button
          onClick={() => setSettingsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Configure your OpenAI API key to start chatting.</p>

        {/* API Key field */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Key size={14} className="inline mr-1.5 opacity-70" />
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2.5 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Your key is stored locally in your browser and never sent to any server except OpenAI.
            </p>
          </div>

          {/* Get API key link */}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <ExternalLink size={12} />
            Get an API key from OpenAI
          </a>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!inputKey.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? (
              <>
                <Check size={15} />
                Saved!
              </>
            ) : (
              'Save API Key'
            )}
          </button>
        </div>

        {/* Info box */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Note:</strong> This app calls the OpenAI API directly from your browser. Make sure your API key has sufficient credits.
          </p>
        </div>
      </div>
    </div>
  )
}
