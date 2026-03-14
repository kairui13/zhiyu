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
      profiles: {
        Row: {
          id: string
          email: string | null
          nickname: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      emotion_records: {
        Row: {
          id: string
          user_id: string
          date: string
          emotion: string
          intensity: number
          content: string | null
          ai_response: string | null
          micro_action: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          emotion: string
          intensity: number
          content?: string | null
          ai_response?: string | null
          micro_action?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          emotion?: string
          intensity?: number
          content?: string | null
          ai_response?: string | null
          micro_action?: string | null
          created_at?: string
        }
      }
    }
  }
}