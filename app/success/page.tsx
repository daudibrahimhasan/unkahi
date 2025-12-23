'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, ExternalLink, Inbox, Share2, AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username')
  const code = searchParams.get('code')
  const [copiedType, setCopiedType] = useState<string | null>(null)
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareLink = `${baseUrl}/${username}`
  const inboxLink = `${baseUrl}/inbox/${code}`
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }
  
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-purple-500/30 py-20 px-4">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20 rotate-12">
            <Check size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight italic">YOU'RE LIVE!</h1>
          <p className="text-slate-400 text-lg">Your anonymous bridge is ready for @{username}</p>
        </motion.div>
        
        <div className="space-y-6">
          {/* Share Link Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                  <Share2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold italic">Shareable Link</h2>
                  <p className="text-sm text-slate-500">Put this in your IG bio or stories</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-4 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap text-purple-300">
                {shareLink}
              </div>
              <button
                onClick={() => copyToClipboard(shareLink, 'share')}
                className="px-6 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                {copiedType === 'share' ? <Check size={18} /> : <Copy size={18} />}
                <span>{copiedType === 'share' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </motion.div>
          
          {/* Inbox Link Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400">
                  <Inbox size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold italic">Your Private Inbox</h2>
                  <p className="text-sm text-slate-500 italic">Do not share this link with anyone!</p>
                </div>
              </div>
              <Link 
                href={inboxLink}
                className="text-pink-400 hover:text-pink-300 transition-colors p-2"
              >
                <ExternalLink size={20} />
              </Link>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-4 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap text-pink-300/60">
                {inboxLink}
              </div>
              <button
                onClick={() => copyToClipboard(inboxLink, 'inbox')}
                className="px-6 py-4 bg-pink-600 text-white font-bold rounded-2xl hover:bg-pink-700 transition-all flex items-center gap-2"
              >
                {copiedType === 'inbox' ? <Check size={18} /> : <Copy size={18} />}
                <span>{copiedType === 'inbox' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </motion.div>
          
          {/* Warning Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex gap-4"
          >
            <div className="text-amber-500 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-500 mb-1">Bookmark This Page!</h3>
              <p className="text-sm text-amber-500/80 leading-relaxed italic">
                Because there's no login, your inbox link is the ONLY way to see your messages. If you lose it, you'll need to create a new link.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 mt-12"
        >
          <Link
            href={inboxLink}
            className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
          >
            Go to Inbox <ExternalLink size={18} />
          </Link>
          <Link
            href="/"
            className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} /> Create Another
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
