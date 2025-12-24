'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDeviceInfo } from '@/lib/fingerprint'
import { Send, Heart, AlertCircle, Home, Search, Mail, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function SendMessagePage() {
  const params = useParams()
  const router = useRouter()
  const instagram = params.instagram as string
  
  const handleInboxClick = () => {
    const code = localStorage.getItem('unkahi_code')
    if (code) {
      router.push(`/inbox/${code}`)
    } else {
      router.push('/')
    }
  }
  
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userExists, setUserExists] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(`/api/user/check?username=${instagram}`)
        const data = await res.json()
        setUserExists(data.exists)
      } catch {
        setUserExists(false)
      }
    }
    checkUser()
  }, [instagram])
  
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
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
        <header className="bg-white border-b border-[#dbdbdb] fixed w-full top-0 z-10">
          <div className="max-w-[975px] mx-auto px-5 h-[60px] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#262626] no-underline">
              <Image src="/logo.png" alt="unkahii" width={28} height={28} className="object-contain" />
              <span className="text-[22px] font-extrabold tracking-tight">unkahii</span>
            </Link>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center pt-[60px] px-4">
          <div className="bg-white border border-[#dbdbdb] rounded-lg p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-[#262626] mb-2">User Not Found</h1>
            <p className="text-[#8e8e8e] mb-6">
              @{instagram} hasn&apos;t created their unkahi link yet
            </p>
            <Link
              href="/"
              className="inline-block w-full py-3 bg-[#BDA9DF] text-white font-semibold rounded-lg hover:bg-[#a996c7] transition-colors"
            >
              Create Your Own Link
            </Link>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
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
            <button onClick={handleInboxClick} className="text-[#8e8e8e] hover:text-[#262626]">
              <Mail size={24} />
            </button>
            <button className="text-[#8e8e8e]">
              <User size={24} />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-[100px] pb-10 px-4">
        <div className="bg-white border border-[#dbdbdb] rounded-lg py-8 px-6 w-full max-w-[500px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-500 fill-current" />
              </div>
              <h2 className="text-xl font-bold text-[#262626] mb-2">Message Sent!</h2>
              <p className="text-[#8e8e8e] mb-6">Your anonymous message has been delivered</p>
              <div className="space-y-3">
                <button 
                  onClick={() => setSuccess(false)}
                  className="w-full py-3 bg-[#fafafa] border border-[#dbdbdb] text-[#262626] font-semibold rounded-lg hover:bg-[#f0f0f0] transition-colors"
                >
                  Send Another
                </button>
                <Link
                  href="/"
                  className="block w-full py-3 bg-[#BDA9DF] text-white font-semibold rounded-lg hover:bg-[#a996c7] transition-colors text-center"
                >
                  Get My Own Link
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-[#262626] mb-1">
                  Send Anonymous Message
                </h1>
                <p className="text-[#8e8e8e] text-sm">
                  to <span className="text-[#BDA9DF] font-medium">@{instagram}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your anonymous message here...

Be kind and respectful 💜"
                  className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-lg p-4 h-40 resize-none focus:outline-none focus:border-[#a8a8a8] text-[#262626] placeholder:text-[#8e8e8e]"
                  required
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-[#8e8e8e] mt-2 mb-4">
                  <span>Your message is 100% anonymous</span>
                  <span className={message.length > 450 ? 'text-red-500' : ''}>
                    {message.length}/500
                  </span>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="w-full py-3 bg-[#BDA9DF] text-white font-semibold rounded-lg hover:bg-[#a996c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Send Anonymously
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#dbdbdb] text-center">
                <p className="text-sm text-[#8e8e8e] mb-3">Want your own anonymous messages?</p>
                <Link
                  href="/"
                  className="text-[#BDA9DF] font-semibold text-sm hover:underline"
                >
                  Get Your unkahi Link →
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-[#8e8e8e] text-xs">
        <a href="#" className="text-[#8e8e8e] no-underline mx-3 hover:text-[#262626]">Imprint</a>
        <a href="#" className="text-[#8e8e8e] no-underline mx-3 hover:text-[#262626]">Privacy Settings</a>
      </footer>
    </div>
  )
}
