export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: 'admin' | 'user'
      }
    }
  }
}

// Types inférés pour useSupabaseClient
export type SupabaseClient = ReturnType<typeof useSupabaseClient>
