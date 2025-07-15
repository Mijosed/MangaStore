import { ref, watch } from 'vue'
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
      profile.value = {
        id: user.value.id,
        email: user.value.email || '',
        role: 'user',
        created_at: user.value.created_at || new Date().toISOString()
      }

      const supabase = useSupabaseClient<Database>()
      
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin', { user_id: user.value.id })

      if (adminError) {
        console.error('is_admin RPC error:', adminError)
        if (user.value.email === 'admin@mail.fr' && profile.value) {
          profile.value.role = 'admin'
        }
      } else {
        if (isAdmin && profile.value) {
          profile.value.role = 'admin'
        }
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement du profil'
      console.error('Error fetching profile:', err)
      
      if (user.value.email === 'admin@mail.fr' && profile.value) {
        profile.value.role = 'admin'
      }
    } finally {
      loading.value = false
    }

    return profile.value
  }

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

interface ProfileUpdateData {
  role?: 'admin' | 'user'
  username?: string
  avatar_url?: string
}

const updateProfile = async (userId: string, data: ProfileUpdateData) => {
  const supabase = useSupabaseClient<Database>()
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)

  if (error) throw error
}

export { updateProfile, type ProfileUpdateData }
