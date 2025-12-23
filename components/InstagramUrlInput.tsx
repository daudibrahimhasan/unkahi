'use client'

import { Instagram } from 'lucide-react'

interface InstagramUrlInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function InstagramUrlInput({ value, onChange, error }: InstagramUrlInputProps) {
  return (
    <div className="space-y-2">
      <div className="relative group/input">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="instagram.com/username or @username"
          className="w-full px-6 py-5 bg-black/40 border-2 border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none text-xl transition-all placeholder:text-slate-600"
          required
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-purple-500 transition-colors">
          <Instagram size={24} />
        </div>
      </div>
      {error && <p className="text-red-400 text-sm italic ml-2">{error}</p>}
    </div>
  )
}
