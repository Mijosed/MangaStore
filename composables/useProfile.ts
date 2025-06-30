import { ref } from 'vue'
import { useAuth } from './useAuth'
import type { Database } from '~/types/supabase'

export interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

export const useProfile = () => {
  const { user } = useAuth()
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async () => {
    if (!user.value) return null

    loading.value = true
    error.value = null

    try {
      // Initialiser le profil avec les données de base de l'utilisateur
      profile.value = {
        id: user.value.id,
        email: user.value.email || '',
        role: 'user', // Rôle par défaut
        created_at: user.value.created_at || new Date().toISOString()
      }

      // Vérifier si l'utilisateur est admin
      const supabase = useSupabaseClient<Database>()
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin', { user_id: user.value.id })

      if (!adminError && isAdmin) {
        if (profile.value) {
          profile.value.role = 'admin'
        }
      }
    } catch (err) {
      error.value = "Erreur lors du chargement du profil"
      console.error('Error fetching profile:', err)
    } finally {
      loading.value = false
    }

    return profile.value
  }

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

// Update profile function
const updateProfile = async (userId: string, data: ProfileUpdateData) => {
  const { error } = await useSupabaseClient()
    .from('profiles')
    .update(data)
    .eq('id', userId)

  if (error) throw error
}

// Export the function
export { updateProfile, type ProfileUpdateData }
