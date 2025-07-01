import { defineNuxtRouteMiddleware, useRouter } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth()
  const router = useRouter()

  if (!user.value) {
    return navigateTo('/login')
  }
})
