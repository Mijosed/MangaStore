<script setup>
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '~/composables/useAuth'
import { useProfile } from '~/composables/useProfile'
import { useCartStore } from '~/stores/cart'
import { useRouter } from 'vue-router'

const { user, signOut } = useAuth()
const { profile, fetchProfile } = useProfile()
const cartStore = useCartStore()
const router = useRouter()

// Watch user changes to update profile
watch(() => user.value?.id, async (newId) => {
  if (newId) {
    console.log('HeaderNav: User changed, fetching profile...')
    await fetchProfile()
  }
}, { immediate: true })

onMounted(() => {
  console.log('HeaderNav: Initialisation...')
  cartStore.loadFromLocalStorage()
})

watch(() => cartStore.totalItems, (newTotal) => {
  console.log('HeaderNav: Total d\'articles mis à jour:', newTotal)
})

const logout = async () => {
  await signOut()
  router.push('/')
}
</script>

<template>
    <NavigationMenu>
      <NavigationMenuList class="flex items-center gap-6 text-sm">
        <NavigationMenuItem>
          <NuxtLink to="/" class="text-gray-200 hover:text-white transition-colors">Accueil</NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink to="/catalogue" class="text-gray-200 hover:text-white transition-colors">Catalogue</NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink to="/contact" class="text-gray-200 hover:text-white transition-colors">Contact</NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink to="/cart" class="text-gray-200 hover:text-white transition-colors relative">
            <Icon name="lucide:shopping-cart" class="w-5 h-5" />
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
            >
              {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
            </span>
          </NuxtLink>
        </NavigationMenuItem>
        
        <!-- Menu utilisateur -->
        <template v-if="user">
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="user.avatar_url || ''" alt="Photo de profil" />
                    <AvatarFallback>{{ user.email?.[0]?.toUpperCase() || '?' }}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent class="w-56" align="end">
                <DropdownMenuLabel class="font-normal">
                  <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium text-gray-200">{{ user.email }}</p>
                    <p class="text-xs text-gray-400 capitalize">{{ profile?.role || 'utilisateur' }}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NuxtLink to="/account" class="cursor-pointer flex items-center text-gray-200 hover:text-white">
                    <Icon name="lucide:user" class="w-4 h-4 mr-2" />
                    Mon profil
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NuxtLink to="/account/orders" class="cursor-pointer flex items-center text-gray-200 hover:text-white">
                    <Icon name="lucide:package" class="w-4 h-4 mr-2" />
                    Mes commandes
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout" class="cursor-pointer text-red-400 hover:text-red-300">
                  <Icon name="lucide:log-out" class="w-4 h-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </template>
        
        <!-- Menu connexion/inscription pour les utilisateurs non connectés -->
        <template v-else>
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" class="text-gray-200 hover:text-white">
                  <Icon name="lucide:user" class="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="end">
                <DropdownMenuItem asChild>
                  <NuxtLink to="/login" class="cursor-pointer flex items-center text-gray-200 hover:text-white">
                    <Icon name="lucide:log-in" class="w-4 h-4 mr-2" />
                    Connexion
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NuxtLink to="/register" class="cursor-pointer flex items-center text-gray-200 hover:text-white">
                    <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
                    Inscription
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </template>
      </NavigationMenuList>
    </NavigationMenu>
</template>

<style scoped>
.navigation-menu {
  background: transparent;
}
</style>
