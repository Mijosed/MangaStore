import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()

  // Allow public pages
  const publicPages = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/catalogue']
  if (publicPages.includes(to.path)) {
    return
  }

  // Check auth for protected pages
  if (!user.value) {
    return navigateTo('/login')
  } 
})
