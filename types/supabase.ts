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
      reviews: {
        Row: {
          id: number
          manga_id: number
          user_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: number
          manga_id: number
          user_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: number
          manga_id?: number
          user_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
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
          id: string
          email: string
          raw_user_meta_data: Json
          created_at: string
        }[]
      }
      get_users_display_info: {
        Args: {
          user_uuids: string[]
        }
        Returns: {
          id: string
          display_name: string
          avatar_url: string | null
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
