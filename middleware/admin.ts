import { useProfile } from '~/composables/useProfile'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useAuth()
  const { profile, fetchProfile } = useProfile()

  // Ensure we have the user profile
  if (!profile.value) {
    await fetchProfile()
  }

  // Check admin role
  if (!profile.value?.role || profile.value.role !== 'admin') {
    console.log('Access denied: User is not admin')
    return navigateTo('/')
  }
})
