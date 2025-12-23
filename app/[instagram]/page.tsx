'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getDeviceInfo } from '@/lib/fingerprint'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Instagram, ShieldCheck, Heart, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SendMessagePage() {
  const params = useParams()
  const instagram = params.instagram as string
  
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userExists, setUserExists] = useState<boolean | null>(null)
  const [instagramUrl, setInstagramUrl] = useState('')
  
  useEffect(() => {
    checkUser()
  }, [])
  
  const checkUser = async () => {
    try {
      const res = await fetch(`/api/user/check?username=${instagram}`)
      const data = await res.json()
      setUserExists(data.exists)
      if (data.exists) {
        setInstagramUrl(data.instagram_url)
      }
    } catch (err) {
      setUserExists(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return
    
    setLoading(true)
    
    try {
      const deviceInfo = getDeviceInfo()
      
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_instagram: instagram,
          message,
          deviceInfo
        })
      })
      
      if (res.ok) {
        setSuccess(true)
        setMessage('')
        // No auto-hide success, let user enjoy the "Sent" state
      } else {
        alert('Failed to send message. User may not exist.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  if (userExists === false) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4 italic">User Not Found</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            @{instagram} hasn't joined Unkahi yet. Want to receive anonymous messages too?
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)] transition-all"
          >
            Create Your Own Link
          </Link>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-purple-500/30 py-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-6 inline-block p-1 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl">
              <div className="px-4 py-2 bg-[#0f172a] rounded-[calc(1rem-1px)] flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Anonymous Message
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Send to @{instagram}</h1>
            <a 
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-purple-400 transition-colors inline-flex items-center gap-1.5 text-sm"
            >
              View profile <Instagram size={14} />
            </a>
          </div>
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-10 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Heart size={40} className="fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4 italic">Message Sent!</h2>
                <p className="text-slate-400 mb-8">Your secret is safe with us. Want your own link?</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setSuccess(false)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
                  >
                    Send another
                  </button>
                  <Link
                    href="/"
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold shadow-lg"
                  >
                    Get My Own Link 🎭
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
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
                  className="w-full group py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-[1.25rem] hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl flex items-center justify-center gap-3 italic"
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
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Footer Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
            Create your own Unkahi anonymous link →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
