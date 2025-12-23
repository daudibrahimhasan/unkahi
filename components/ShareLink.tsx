'use client'

import { useState } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'

interface ShareLinkProps {
  label: string
  link: string
  variant?: 'purple' | 'pink'
}

export function ShareLink({ label, link, variant = 'purple' }: ShareLinkProps) {
  const [copied, setCopied] = useState(false)
  
  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colorClasses = variant === 'purple' 
    ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
    : 'bg-pink-500/10 border-pink-500/20 text-pink-400'

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${colorClasses}`}>
          <Share2 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold italic">{label}</h2>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-4 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap text-slate-300">
          {link}
        </div>
        <button
          onClick={copy}
          className={`px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${
            variant === 'purple' ? 'bg-white text-black hover:bg-slate-200' : 'bg-pink-600 text-white hover:bg-pink-700'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  )
}
