'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Search, Mail, User, Link as LinkIcon } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const username = searchParams.get('username')
  const code = searchParams.get('code')
  const [copied, setCopied] = useState(false)
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareLink = `${baseUrl}/${username}`
  const inboxLink = `${baseUrl}/inbox/${code}`
  
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
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=Send me anonymous messages!&url=${encodeURIComponent(shareLink)}`, '_blank')
  }
  
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank')
  }
  
  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=Send me anonymous messages! ${encodeURIComponent(shareLink)}`, '_blank')
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
        <div className="bg-white border border-[#dbdbdb] rounded-lg py-10 px-5 w-full max-w-[600px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg font-semibold text-[#262626] mb-4">Share Your Link</h2>
          <div 
            onClick={copyToClipboard}
            className="cursor-pointer relative group inline-block mb-8"
          >
            <span className="text-[22px] font-semibold text-[#BDA9DF] break-all hover:underline">
              {shareLink.replace('http://', '').replace('https://', '')}
            </span>
            {copied && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#262626] text-white text-xs py-1.5 px-3 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200">
                Copied!
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#262626] rotate-45"></div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-3 flex-wrap">
            {/* Copy Button */}
            <button 
              onClick={copyToClipboard}
              className="w-[42px] h-[42px] rounded-full bg-[#8e8e8e] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <LinkIcon size={18} />
              )}
            </button>
            
            {/* Facebook */}
            <button 
              onClick={shareFacebook}
              className="w-[42px] h-[42px] rounded-full bg-[#4267B2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            
            {/* Twitter */}
            <button 
              onClick={shareTwitter}
              className="w-[42px] h-[42px] rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.56v.01c-.88.39-1.83.65-2.82.77a4.92 4.92 0 0 0 2.16-2.72 9.86 9.86 0 0 1-3.13 1.2 4.92 4.92 0 0 0-8.38 4.48A13.93 13.93 0 0 1 1.67 3.15 4.92 4.92 0 0 0 3.18 9.72c-.78-.02-1.51-.24-2.15-.6v.06a4.92 4.92 0 0 0 3.95 4.83 4.92 4.92 0 0 1-2.22.08 4.92 4.92 0 0 0 4.59 3.42A9.87 9.87 0 0 1 0 19.54a13.9 13.9 0 0 0 7.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.43-.02-.63A10.02 10.02 0 0 0 24 4.56z"/>
              </svg>
            </button>
            
            {/* WhatsApp */}
            <button 
              onClick={shareWhatsApp}
              className="w-[42px] h-[42px] rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </button>
            
            {/* Live Stream Pill Button */}
            <button className="h-[42px] px-6 rounded-full bg-white border-2 border-[#262626] text-[#262626] font-semibold text-sm flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              Live Stream
            </button>
          </div>
        </div>
        
        {/* Inbox Link Card */}
        <div className="bg-white border border-[#dbdbdb] rounded-lg py-6 px-5 w-full max-w-[600px] text-center mt-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <p className="text-sm text-[#8e8e8e] mb-3">Your private inbox (bookmark this!)</p>
          <Link 
            href={inboxLink}
            className="text-[#BDA9DF] font-medium hover:underline"
          >
            View Messages →
          </Link>
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#BDA9DF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
