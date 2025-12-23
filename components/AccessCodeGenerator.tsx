'use client'

import { Shield, Lock } from 'lucide-react'

export function AccessCodeGenerator() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex gap-4">
      <div className="text-amber-500 shrink-0">
        <Lock size={24} />
      </div>
      <div>
        <h3 className="font-bold text-amber-500 mb-1 flex items-center gap-2">
          Secure Access <Shield size={14} />
        </h3>
        <p className="text-sm text-amber-500/80 leading-relaxed italic">
          Your access code is generated locally and stored securely. Never share your inbox URL with anyone.
        </p>
      </div>
    </div>
  )
}
