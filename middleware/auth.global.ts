import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()

  // Allow public pages
  const publicPages = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/catalogue', '/contact']
  
  // Allow manga detail pages, checkout success and other public routes
  if (publicPages.includes(to.path) || to.path.startsWith('/manga/') || to.path.startsWith('/checkout/success')) {
    return
  }

  // Check auth for protected pages
  if (!user.value) {
    return navigateTo('/login')
  } 
})
