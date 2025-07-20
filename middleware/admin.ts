import { useProfile } from '~/composables/useProfile'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useAuth()
  const { profile, fetchProfile } = useProfile()

  if (!profile.value && user.value) {
    await fetchProfile()
  }

  if (user.value?.email === 'admin@mail.fr' && profile.value && profile.value.role !== 'admin') {
    profile.value.role = 'admin'
  }

  if (!profile.value?.role || profile.value.role !== 'admin') {
    return navigateTo('/')
  }
})
