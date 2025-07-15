import { useProfile } from '~/composables/useProfile'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useAuth()
  const { profile, fetchProfile } = useProfile()

  // Ensure we have the user profile
  if (!profile.value && user.value) {
    await fetchProfile()
  }

  // Fallback check pour admin@mail.fr si le profil n'a pas le bon rôle
  if (user.value?.email === 'admin@mail.fr' && profile.value && profile.value.role !== 'admin') {
    profile.value.role = 'admin'
  }

  // Check admin role
  if (!profile.value?.role || profile.value.role !== 'admin') {
    return navigateTo('/')
  }
})
