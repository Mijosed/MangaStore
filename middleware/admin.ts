import { useProfile } from '~/composables/useProfile'

export default defineNuxtRouteMiddleware(async () => {
  const { profile } = useProfile()

  if (!profile.value?.role || profile.value.role !== 'admin') {
    return navigateTo('/')
  }
})
