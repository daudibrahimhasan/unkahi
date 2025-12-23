'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { 
  Trash2, 
  RefreshCcw, 
  Copy,
  Inbox, 
  AlertCircle, 
  Check,
  ChevronLeft,
  Globe,
  Smartphone
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
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  if (!validCode) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Access</h1>
          <p className="text-gray-500 mb-8">
            This inbox link is invalid or has expired
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Create New Link
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Inbox</h1>
              <p className="text-xs text-gray-500">@{username}</p>
            </div>
          </div>
          <button 
            onClick={verifyAndLoadMessages}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCcw size={20} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Share Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Share Your Link</h2>
              <p className="text-sm text-gray-600">Get more anonymous messages</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 md:w-64 px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm font-mono text-purple-700 focus:outline-none"
              />
              <button
                onClick={copyShareLink}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
          </h3>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Share your link to start receiving anonymous messages
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-all ${
                  !msg.is_read ? 'ring-2 ring-purple-200' : ''
                }`}
                onClick={() => !msg.is_read && markAsRead(msg.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-wrap gap-2">
                    {!msg.is_read && (
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold uppercase rounded-full">
                        NEW
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMessage(msg.id)
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-gray-900 text-lg leading-relaxed mb-4 whitespace-pre-wrap">
                  {msg.message_text}
                </p>
                
                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Smartphone size={12} /> {msg.sender_device}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe size={12} /> {msg.sender_browser}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe size={12} /> {msg.sender_country}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
