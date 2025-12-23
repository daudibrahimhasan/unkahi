export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          instagram_username: string
          instagram_url: string
          message_count: number
          created_at: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          instagram_username: string
          instagram_url: string
          message_count?: number
          created_at?: string
          last_message_at?: string | null
        }
        Update: {
          id?: string
          instagram_username?: string
          instagram_url?: string
          message_count?: number
          created_at?: string
          last_message_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          recipient_instagram: string
          message_text: string
          sender_ip: string | null
          sender_browser: string | null
          sender_device: string | null
          sender_fingerprint: string | null
          sender_country: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipient_instagram: string
          message_text: string
          sender_ip?: string | null
          sender_browser?: string | null
          sender_device?: string | null
          sender_fingerprint?: string | null
          sender_country?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          recipient_instagram?: string
          message_text?: string
          sender_ip?: string | null
          sender_browser?: string | null
          sender_device?: string | null
          sender_fingerprint?: string | null
          sender_country?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      access_codes: {
        Row: {
          id: string
          instagram_username: string
          code: string
          expires_at: string
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          instagram_username: string
          code: string
          expires_at: string
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          instagram_username?: string
          code?: string
          expires_at?: string
          used?: boolean
          created_at?: string
        }
      }
    }
  }
}
