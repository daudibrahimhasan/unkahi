'use client'

import { motion } from 'framer-motion'
import { Trash2, Clock, Smartphone, Globe } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface MessageCardProps {
  id: string
  text: string
  device: string
  browser: string
  country: string
  createdAt: string
  isRead: boolean
  onDelete: (id: string) => void
  onMarkRead: (id: string) => void
}

export function MessageCard({ 
  id, text, device, browser, country, createdAt, isRead, onDelete, onMarkRead 
}: MessageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 transition-all hover:bg-white/10 ${
        !isRead ? 'ring-2 ring-purple-500/20' : ''
      }`}
      onClick={() => !isRead && onMarkRead(id)}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-wrap gap-2">
          {!isRead && (
            <span className="px-3 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-full">
              NEW
            </span>
          )}
          <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1.5">
            <Clock size={10} /> {formatDate(createdAt)}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(id)
          }}
          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <p className="text-xl leading-relaxed mb-8 whitespace-pre-wrap font-medium text-slate-200">
        {text}
      </p>
      
      <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
        <div className="flex items-center gap-1.5">
          <Smartphone size={12} /> {device}
        </div>
        <div className="flex items-center gap-1.5">
          <Globe size={12} /> {browser}
        </div>
        <div className="flex items-center gap-1.5 text-purple-400/60">
          <Globe size={12} /> {country}
        </div>
      </div>
    </motion.div>
  )
}
