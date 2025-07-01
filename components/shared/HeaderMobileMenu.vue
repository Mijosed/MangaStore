<template>
    <div>
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon">
            <Icon name="lucide:menu" class="w-6 h-6" />
          </Button>
        </SheetTrigger>
  
        <SheetContent side="right" class="w-64">
          <div class="flex flex-col gap-3 mt-4">
            <NuxtLink to="/" class="text-lg font-bold">Accueil</NuxtLink>
            <NuxtLink to="/catalogue">Catalogue</NuxtLink>
            <NuxtLink to="/contact">Contact</NuxtLink>
            <NuxtLink to="/cart">Mon panier</NuxtLink>
            <hr />
            <template v-if="user">
              <NuxtLink to="/#">Mon profil</NuxtLink>
              <button @click="logout" class="text-red-600 text-left">Se déconnecter</button>
            </template>
            <template v-else>
              <NuxtLink to="/login">Connexion</NuxtLink>
              <NuxtLink to="/register">Inscription</NuxtLink>
            </template>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </template>
  
  <script setup>
  import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
  import { Button } from '@/components/ui/button'
  import { useAuth } from '~/composables/useAuth'
  import { useRouter } from 'vue-router'
  
  const props = defineProps({
    user: {
      type: Object,
      default: null
    }
  })
  const { signOut } = useAuth()
  const router = useRouter()
  
  const logout = async () => {
    await signOut()
    router.push('/')
  }
  </script>
  