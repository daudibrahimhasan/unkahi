'use client'

import { useState } from 'react'
import { parseInstagramUrl, isValidInstagramUsername } from '@/lib/instagram'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Instagram, Send, Shield, Zap, MessageCircle } from 'lucide-react'

export default function HomePage() {
  const [instagramUrl, setInstagramUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Parse Instagram username
    const username = parseInstagramUrl(instagramUrl)
    
    if (!username || !isValidInstagramUsername(username)) {
      setError('Please enter a valid Instagram URL or username')
      setLoading(false)
      return
    }
    
    try {
      // Create/update user
      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagram_username: username,
          instagram_url: `https://instagram.com/${username}`
        })
      })
      
      const { data } = await res.json()
      
      if (res.ok) {
        // Generate access code
        const accessRes = await fetch('/api/access/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instagram_username: username })
        })
        
        const { code } = await accessRes.json()
        
        // Show success page with shareable link and access code
        router.push(`/success?username=${username}&code=${code}`)
      } else {
        setError('Failed to create account. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-sm font-medium mb-6 backdrop-blur-sm">
            <Zap size={14} className="fill-current" />
            <span>Join 10,000+ users sharing anonymously</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic">
            UNKAHI
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The most beautiful way to receive <span className="text-white font-medium italic underline decoration-purple-500 decoration-2 underline-offset-4">anonymous messages</span> on Instagram.
          </p>
        </motion.div>
        
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              Get Your Link <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Instagram size={20} /></div>
            </h2>
            <p className="text-slate-400 mb-10 text-lg">
              Enter your Instagram handle to start. No password required.
            </p>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group/input">
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="instagram.com/username or @username"
                  className="w-full px-6 py-5 bg-black/40 border-2 border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none text-xl transition-all placeholder:text-slate-600"
                  required
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-purple-500 transition-colors">
                  <Instagram size={24} />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full group px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Generate My Link
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
        
        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mt-24 w-full"
        >
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 italic">Zero Friction</h3>
            <p className="text-slate-400">No passwords, no signups. Just enter your username and go.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 italic">Pure Privacy</h3>
            <p className="text-slate-400">Advanced encryption ensures senders stay 100% anonymous.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 italic">Instant Inbox</h3>
            <p className="text-slate-400">Real-time notifications and a beautiful dashboard for your messages.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
