'use client'

import { Send, ShieldCheck } from 'lucide-react'

interface MessageFormProps {
  message: string
  setMessage: (val: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function MessageForm({ message, setMessage, loading, onSubmit }: MessageFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="relative group">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here... be kind! 💜"
          className="w-full bg-black/40 border-2 border-white/10 rounded-3xl p-6 h-52 resize-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none text-lg transition-all placeholder:text-slate-600"
          required
          maxLength={500}
        />
        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className={message.length > 450 ? 'text-pink-500' : ''}>
            {message.length}
          </span>
          <span className="opacity-30">/</span>
          <span>500</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 px-6 py-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl text-purple-400/80 text-sm italic">
        <ShieldCheck size={18} />
        <span>Encrypted & 100% Anonymous</span>
      </div>
      
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="w-full group py-5 bg-linear-to-r from-purple-600 to-pink-600 text-white font-black rounded-[1.25rem] hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl flex items-center justify-center gap-3 italic"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Send Anonymously
            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  )
}
