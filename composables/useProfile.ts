import { ref, watch } from 'vue'
import { useAuth } from './useAuth'
import type { Database, UserRole } from '~/types/supabase'

export interface UserProfile {
  id: string
  email: string
  role?: UserRole
  created_at: string
}

// Type pour la réponse de la fonction RPC get_users
interface GetUsersResponse {
  id: string
  email: string
  created_at: string
  role: UserRole
}

export const useProfile = () => {
  const { user } = useAuth()
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async () => {
    console.log('Fetching profile for user:', user.value?.id)
    if (!user.value) {
      profile.value = null
      return null
    }

    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient<Database>()
      
      // Récupérer les informations de l'utilisateur via la fonction RPC get_users
      // qui inclut déjà le rôle correctement joint avec la table roles
      const { data: users, error: userError } = await supabase
        .rpc('get_users')

      if (userError) throw userError

      const currentUser = users?.find((u: GetUsersResponse) => u.id === user.value?.id)
      if (currentUser) {
        profile.value = {
          id: currentUser.id,
          email: currentUser.email,
          role: currentUser.role, // Utilise directement le rôle retourné par get_users
          created_at: currentUser.created_at
        }
        console.log('Updated profile:', profile.value)
      }

      return profile.value
    } catch (err) {
      console.error('Error fetching profile:', err)
      error.value = "Erreur lors du chargement du profil"
      return null
    } finally {
      loading.value = false
    }
  }

  // Watch user changes to reload profile - moved after fetchProfile declaration
  watch(() => user.value?.id, (newId) => {
    if (newId) {
      fetchProfile()
    } else {
      profile.value = null
    }
  }, { immediate: true })

  return {
    profile,
    loading,
    error,
    fetchProfile
  }
}

// Types for profile updates
interface ProfileUpdateData {
  role?: 'admin' | 'user'
  username?: string
  avatar_url?: string
}

// Update role function
const updateRole = async (userId: string, role: UserRole) => {
  const supabase = useSupabaseClient()
  const { error } = await supabase
    .from('roles')
    .upsert(
      { user_id: userId, role },
      { onConflict: 'user_id' }
    )

  if (error) throw error
}

// Export the function
export { updateRole }
