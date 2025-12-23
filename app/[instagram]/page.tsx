'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getDeviceInfo } from '@/lib/fingerprint'
import { Send, Instagram, AlertCircle, Heart } from 'lucide-react'
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
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-500 mb-8">
            @{instagram} hasn't created their Unkahi link yet
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Create Your Own Link
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">U</span>
            </div>
            <span className="text-xl font-bold text-gray-900">unkahi</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600 fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500 mb-8">Your anonymous message has been delivered</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setSuccess(false)}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Send Another
                  </button>
                  <Link
                    href="/"
                    className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Get My Own Link
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Send Anonymous Message
                  </h1>
                  <a 
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 text-sm"
                  >
                    to @{instagram} <Instagram size={14} />
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your anonymous message here...

Be kind and respectful 💜"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      required
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Your message is 100% anonymous</span>
                      <span className={message.length > 450 ? 'text-red-500' : ''}>
                        {message.length}/500
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Anonymously</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500 mb-4">Want your own anonymous messages?</p>
                  <Link
                    href="/"
                    className="inline-block text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    Get Your Unkahi Link →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
