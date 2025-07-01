import { createClient } from '@supabase/supabase-js'

// Environment variables (with fallbacks for development)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Create client-side Supabase client (for use in client components)
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Database types (we'll expand this as we add more tables)
export interface Database {
  public: {
    Tables: {
      podcasts: {
        Row: {
          id: string
          title: string
          description: string
          host: string
          department: string
          duration: string
          listeners: number
          rating: number
          release_date: string
          likes: number
          comments: number
          episode_number: number
          is_new: boolean
          audio_url?: string
          video_url?: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['podcasts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['podcasts']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          department: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          created_at: string
          metadata?: Record<string, unknown>
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      live_streams: {
        Row: {
          id: string
          title: string
          host: string
          department: string
          description: string
          start_time: string
          is_active: boolean
          viewer_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['live_streams']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['live_streams']['Insert']>
      }
      chat_messages: {
        Row: {
          id: string
          stream_id: string
          user_id: string
          message: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Real-time subscriptions
export const subscribeToTable = <T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: { new?: unknown; old?: unknown; eventType: string }) => void,
  filter?: string
) => {
  return supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter,
      },
      callback
    )
    .subscribe()
}

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string, metadata?: Record<string, unknown>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  return { data, error }
}
