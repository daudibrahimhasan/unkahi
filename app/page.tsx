'use client'

import { useState } from 'react'
import { parseInstagramUrl, isValidInstagramUsername } from '@/lib/instagram'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Search, Mail, User } from 'lucide-react'

export default function HomePage() {
  const [instagramUrl, setInstagramUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleInboxClick = () => {
    const code = localStorage.getItem('unkahi_code')
    if (code) {
      router.push(`/inbox/${code}`)
    } else {
      router.push('/')
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const username = parseInstagramUrl(instagramUrl)
    
    if (!username || !isValidInstagramUsername(username)) {
      setError('Please enter a valid Instagram URL or username')
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagram_username: username,
          instagram_url: `https://instagram.com/${username}`
        })
      })
      
      if (res.ok) {
        const accessRes = await fetch('/api/access/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instagram_username: username })
        })
        
        const { code } = await accessRes.json()
        router.push(`/success?username=${username}&code=${code}`)
      } else {
        setError('Failed to create account. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#dbdbdb] fixed w-full top-0 z-10">
        <div className="max-w-[975px] mx-auto px-5 h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#262626] no-underline">
            <Image src="/logo.png" alt="unkahi" width={28} height={28} className="object-contain" />
            <span className="text-[22px] font-extrabold tracking-tight">unkahi</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-[#262626]">
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
        <div className="bg-white border border-[#dbdbdb] rounded-lg py-10 px-8 w-full max-w-[500px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-[#262626] mb-2">Get Your Link</h2>
          <p className="text-[#8e8e8e] text-sm mb-6">Enter your Instagram username to start receiving anonymous messages</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="instagram.com/username or @username"
              className="w-full px-4 py-3 bg-[#fafafa] border border-[#dbdbdb] rounded-lg text-[#262626] placeholder:text-[#8e8e8e] focus:outline-none focus:border-[#a8a8a8] mb-4"
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#9565e7] text-white font-semibold rounded-lg hover:bg-[#a996c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Get My Link'}
            </button>
          </form>
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
