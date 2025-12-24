'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { 
  Trash2, 
  RefreshCcw, 
  Inbox, 
  AlertCircle, 
  Home,
  Search,
  Mail,
  User,
  Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
  const router = useRouter()
  const code = params.code as string
  
  const handleInboxClick = () => {
    const storedCode = localStorage.getItem('unkahi_code')
    if (storedCode) {
      router.push(`/inbox/${storedCode}`)
    } else if (code) {
      router.push(`/inbox/${code}`)
    } else {
      router.push('/')
    }
  }
  
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [validCode, setValidCode] = useState(true)
  const [copied, setCopied] = useState(false)
  
  const supabase = createClient()
  
  const verifyAndLoadMessages = useCallback(async () => {
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
  }, [code, supabase])

  useEffect(() => {
    verifyAndLoadMessages()
  }, [verifyAndLoadMessages])
  
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
    if (confirm('Delete this message?')) {
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
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#BDA9DF] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  if (!validCode) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
        <header className="bg-white border-b border-[#dbdbdb] fixed w-full top-0 z-10">
          <div className="max-w-[975px] mx-auto px-5 h-[60px] flex items-center">
            <Link href="/" className="flex items-center gap-2 text-[#262626] no-underline">
              <Image src="/logo.png" alt="unkahi" width={28} height={28} className="object-contain" />
              <span className="text-[22px] font-extrabold tracking-tight">unkahi</span>
            </Link>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center pt-[60px] px-4">
          <div className="bg-white border border-[#dbdbdb] rounded-lg p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-[#262626] mb-2">Invalid Access</h1>
            <p className="text-[#8e8e8e] mb-6">
              This inbox link is invalid or has expired
            </p>
            <Link
              href="/"
              className="inline-block w-full py-3 bg-[#BDA9DF] text-white font-semibold rounded-lg hover:bg-[#a996c7] transition-colors"
            >
              Create New Link
            </Link>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#dbdbdb] fixed w-full top-0 z-10">
        <div className="max-w-[975px] mx-auto px-5 h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#262626] no-underline">
            <Image src="/logo.png" alt="unkahii" width={28} height={28} className="object-contain" />
            <span className="text-[22px] font-extrabold tracking-tight">unkahii</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-[#8e8e8e]">
              <Home size={24} />
            </Link>
            <button className="text-[#8e8e8e]">
              <Search size={24} />
            </button>
            <button onClick={handleInboxClick} className="text-[#262626] hover:text-[#9565e7]">
              <Mail size={24} />
            </button>
            <button className="text-[#8e8e8e]">
              <User size={24} />
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto pt-[80px] pb-10 px-4">
        {/* Share Card */}
        <div className="bg-white border border-[#dbdbdb] rounded-lg py-6 px-5 mb-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg font-semibold text-[#262626] mb-3">Share Your Link</h2>
          <div 
            onClick={copyShareLink}
            className="cursor-pointer relative group inline-block mb-4"
          >
            <span className="text-[#BDA9DF] font-semibold text-lg break-all hover:underline">
              {shareLink.replace('http://', '').replace('https://', '')}
            </span>
            {copied && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#262626] text-white text-xs py-1.5 px-3 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200">
                Copied!
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#262626] rotate-45"></div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3">
            <button 
              onClick={copyShareLink}
              className="px-4 py-2 bg-[#8e8e8e] text-white text-sm font-semibold rounded-full hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <LinkIcon size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={verifyAndLoadMessages}
              className="px-4 py-2 bg-white border border-[#dbdbdb] text-[#262626] text-sm font-semibold rounded-full hover:bg-[#fafafa] transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Messages Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-semibold text-[#262626]">
            {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
          </h3>
          <span className="text-xs text-[#8e8e8e]">@{username}</span>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="bg-white border border-[#dbdbdb] rounded-lg py-16 text-center">
            <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox size={32} className="text-[#8e8e8e]" />
            </div>
            <h3 className="text-lg font-semibold text-[#262626] mb-2">No messages yet</h3>
            <p className="text-[#8e8e8e] text-sm">
              Share your link to start receiving anonymous messages
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white border border-[#dbdbdb] rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
                  !msg.is_read ? 'border-l-4 border-l-[#BDA9DF]' : ''
                }`}
                onClick={() => !msg.is_read && markAsRead(msg.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-2">
                    {!msg.is_read && (
                      <span className="px-2 py-1 bg-[#BDA9DF] text-white text-[10px] font-bold uppercase rounded">
                        NEW
                      </span>
                    )}
                    <span className="px-2 py-1 bg-[#fafafa] text-[#8e8e8e] text-xs rounded">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMessage(msg.id)
                    }}
                    className="p-2 text-[#8e8e8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-[#262626] text-base leading-relaxed whitespace-pre-wrap">
                  {msg.message_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-5 text-center text-[#8e8e8e] text-xs">
        <a href="#" className="text-[#8e8e8e] no-underline mx-3 hover:text-[#262626]">Imprint</a>
        <a href="#" className="text-[#8e8e8e] no-underline mx-3 hover:text-[#262626]">Privacy Settings</a>
      </footer>
    </div>
  )
}
