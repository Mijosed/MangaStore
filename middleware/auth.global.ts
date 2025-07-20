import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()

  const publicPages = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/catalogue', '/contact']
  
  if (publicPages.includes(to.path) || to.path.startsWith('/manga/') || to.path.startsWith('/checkout/success')) {
    return
  }

  if (!user.value) {
    return navigateTo('/login')
  } 
})
