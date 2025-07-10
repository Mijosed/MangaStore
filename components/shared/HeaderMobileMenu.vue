<script setup>
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '~/composables/useAuth'
import { useProfile } from '~/composables/useProfile'
import { useCartStore } from '~/stores/cart'
import { useRouter } from 'vue-router'
import HeaderLogo from './HeaderLogo.vue'

const { user, signOut } = useAuth()
const { profile } = useProfile()
const cartStore = useCartStore()
const router = useRouter()

const logout = async () => {
  await signOut()
  router.push('/')
}
</script>

<template>
  <div class="md:hidden">
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="ghost" size="icon" class="text-gray-200">
          <Icon name="lucide:menu" class="w-6 h-6" size="20" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" class="w-80 bg-black/90 border-none">
        <SheetHeader class="text-left">
          <HeaderLogo class="flex-shrink-0"/>
        </SheetHeader>
        
        <div class="flex flex-col gap-6 mt-8">
          <div v-if="user" class="p-4 ">
            <div class="flex items-center gap-3 mb-3">
              <Avatar class="h-10 w-10">
                <AvatarImage :src="user.avatar_url || ''" alt="Photo de profil" />
                <AvatarFallback class="bg-red-600 text-white">{{ user.email?.[0]?.toUpperCase() || '?' }}</AvatarFallback>
              </Avatar>
              <div>
                <p class="text-white font-medium text-sm">{{ user.email }}</p>
                <p class="text-gray-400 text-xs capitalize">{{ profile?.role || 'utilisateur' }}</p>
              </div>
            </div>
          </div>

          <!-- Navigation principale -->
          <nav class="space-y-1">
            <NuxtLink 
              to="/" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="lucide:home" class="w-5 h-5" />
              <span class="font-medium">Accueil</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/catalogue" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="lucide:book-open" class="w-5 h-5" />
              <span class="font-medium">Catalogue</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/contact" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="lucide:mail" class="w-5 h-5" />
              <span class="font-medium">Contact</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/cart" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div class="relative">
                <Icon name="lucide:shopping-cart" class="w-5 h-5" />
                <span 
                  v-if="cartStore.totalItems > 0"
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                >
                  {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
                </span>
              </div>
              <span class="font-medium">Mon panier</span>
              <span v-if="cartStore.totalItems > 0" class="text-xs text-gray-400">
                ({{ cartStore.totalItems }} {{ cartStore.totalItems > 1 ? 'articles' : 'article' }})
              </span>
            </NuxtLink>
          </nav>

          <hr class="border-white">

          <div v-if="user" class="space-y-1">
            <NuxtLink 
              to="/account" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="lucide:user" class="w-5 h-5" />
              <span class="font-medium">Mon profil</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/account/orders" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="lucide:package" class="w-5 h-5" />
              <span class="font-medium">Mes commandes</span>
            </NuxtLink>
            
            <button 
              @click="logout" 
              class="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <Icon name="lucide:log-out" class="w-5 h-5" />
              <span class="font-medium">Se déconnecter</span>
            </button>
          </div>

          <div v-else class="space-y-1">
            <NuxtLink 
              to="/login" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="lucide:log-in" class="w-5 h-5" />
              <span class="font-medium">Connexion</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/register" 
              class="flex items-center gap-3 px-3 py-3 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="lucide:user-plus" class="w-5 h-5" />
              <span class="font-medium">Inscription</span>
            </NuxtLink>
          </div>

         
          <div class="pt-4 mt-auto">
            <div class="text-center text-xs text-gray-500">
              <p>MangaStore</p>
              <p>© 2024 Tous droits réservés</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
  