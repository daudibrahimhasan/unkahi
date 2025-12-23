'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import { 
  Trash2, 
  RefreshCcw, 
  Share2, 
  Inbox, 
  AlertCircle, 
  Clock, 
  Globe, 
  Smartphone, 
  ChevronLeft,
  Check,
  Copy
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  message_text: string
  sender_browser: string
  sender_device: string
  sender_ip: string
  sender_country: string
  created_at: string
  is_read: boolean
}

export default function InboxPage() {
  const params = useParams()
  const code = params.code as string
  
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [validCode, setValidCode] = useState(true)
  const [copied, setCopied] = useState(false)
  
  const supabase = createClient()
  
  useEffect(() => {
    verifyAndLoadMessages()
  }, [])
  
  const verifyAndLoadMessages = async () => {
    setLoading(true)
    try {
      const { data: accessData } = await supabase
        .from('access_codes')
        .select('instagram_username, expires_at')
        .eq('code', code)
        .maybeSingle()
      
      if (!accessData || new Date(accessData.expires_at) < new Date()) {
        setValidCode(false)
        setLoading(false)
        return
      }
      
      setUsername(accessData.instagram_username)
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      setShareLink(`${baseUrl}/${accessData.instagram_username}`)
      
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_instagram', accessData.instagram_username)
        .order('created_at', { ascending: false })
      
      if (messagesData) {
        setMessages(messagesData)
      }
    } catch (error) {
      console.error('Error:', error)
      setValidCode(false)
    } finally {
      setLoading(false)
    }
  }
  
  const markAsRead = async (id: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
    
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, is_read: true } : msg
      )
    )
  }
  
  const deleteMessage = async (id: string) => {
    if (confirm('Permanently delete this secret?')) {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
      
      if (!error) {
        setMessages(prev => prev.filter(msg => msg.id !== id))
      }
    }
  }
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium italic">Unlocking your inbox...</p>
        </div>
      </div>
    )
  }
  
  if (!validCode) {
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
          <h1 className="text-3xl font-bold mb-4 italic">Invalid Access</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This inbox link is invalid or has expired. You'll need to create a new one to receive messages.
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold transition-all"
          >
            Create New Link
          </Link>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#060b18] text-white selection:bg-purple-500/30 pb-20">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-[#060b18]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-xl font-black italic tracking-tight">INBOX</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">@{username}</p>
            </div>
          </div>
          <button 
            onClick={verifyAndLoadMessages}
            className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-400 hover:text-white"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Share Section */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-white/10 rounded-[2rem] p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 italic">Ready for more?</h2>
            <p className="text-slate-400">Share your link and wait for the secrets to roll in.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-mono text-purple-300 flex-1 md:w-64 overflow-hidden text-ellipsis whitespace-nowrap flex items-center">
              {shareLink}
            </div>
            <button
              onClick={copyShareLink}
              className="p-3 bg-white text-black rounded-2xl hover:bg-slate-200 transition-all"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Message Listing */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold italic text-slate-400">
              {messages.length} {messages.length === 1 ? 'Secret' : 'Secrets'} Received
            </h3>
          </div>

          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] py-24 text-center"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600">
                  <Inbox size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2 italic">Silence is golden.</h3>
                <p className="text-slate-500 max-w-xs mx-auto">But receiving messages is better. Share your link to start!</p>
              </motion.div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 transition-all hover:bg-white/10 ${
                    !msg.is_read ? 'ring-2 ring-purple-500/20' : ''
                  }`}
                  onClick={() => !msg.is_read && markAsRead(msg.id)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      {!msg.is_read && (
                        <span className="px-3 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-full">
                          NEW
                        </span>
                      )}
                      <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1.5">
                        <Clock size={10} /> {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMessage(msg.id)
                      }}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <p className="text-xl leading-relaxed mb-8 whitespace-pre-wrap font-medium">
                    {msg.message_text}
                  </p>
                  
                  <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Smartphone size={12} /> {msg.sender_device}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe size={12} /> {msg.sender_browser}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe size={12} /> {msg.sender_country}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
