export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'user'

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          user_id: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          role: UserRole
        }
        Update: {
          role?: UserRole
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          total: number
          created_at: string
          payment_intent_id?: string
          shipping_address?: Json
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          total: number
          created_at?: string
          payment_intent_id?: string
          shipping_address?: Json
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          total?: number
          created_at?: string
          payment_intent_id?: string
          shipping_address?: Json
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          manga_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          manga_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          manga_id?: string
          quantity?: number
          price?: number
        }
      }
    }
    Functions: {
      get_users: {
        Args: Record<string, never>
        Returns: {
          id: string        // uuid est représenté comme string en TypeScript
          email: string     // varchar est représenté comme string en TypeScript
          role: UserRole
          created_at: string // timestamptz est représenté comme string en TypeScript
          avatar_url: string | null
          username: string | null
          last_sign_in_at: string | null
        }[]
      }
      delete_user: {
        Args: {
          target_user_id: string
        }
        Returns: void
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
  }
}

// Types inférés pour useSupabaseClient
export type SupabaseClient = ReturnType<typeof useSupabaseClient>
