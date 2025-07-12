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

watch(() => user.value?.id, async (newId) => {
  if (newId) {
    await fetchProfile()
  }
}, { immediate: true })

onMounted(() => {
  cartStore.loadFromLocalStorage()
})

watch(() => cartStore.totalItems, (newTotal) => {
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
        <NuxtLink 
          to="/" 
          class="text-gray-200 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/10"
        >
          Accueil
        </NuxtLink>
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <NuxtLink 
          to="/catalogue" 
          class="text-gray-200 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/10"
        >
          Catalogue
        </NuxtLink>
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <NuxtLink 
          to="/contact" 
          class="text-gray-200 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/10"
        >
          Contact
        </NuxtLink>
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <NuxtLink 
          to="/cart" 
          class="text-gray-200 hover:text-white transition-colors duration-200 relative p-2 rounded-md hover:bg-white/10"
        >
          <Icon name="lucide:shopping-cart" class="w-5 h-5" />
          <span 
            v-if="cartStore.totalItems > 0"
            class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
          </span>
        </NuxtLink>
      </NavigationMenuItem>
      
      <template v-if="user">
        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" class="relative h-9 w-9 rounded-full hover:bg-white/10">
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="user.avatar_url || ''" alt="Photo de profil" />
                  <AvatarFallback class="bg-red-600 text-white text-sm font-medium">
                    {{ user.email?.[0]?.toUpperCase() || '?' }}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-56" align="end">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">{{ user.email }}</p>
                  <p class="text-xs leading-none text-muted-foreground capitalize">
                    {{ profile?.role || 'utilisateur' }}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NuxtLink to="/account" class="cursor-pointer flex items-center">
                  <Icon name="lucide:user" class="w-4 h-4 mr-2" />
                  Mon profil
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NuxtLink to="/account/orders" class="cursor-pointer flex items-center">
                  <Icon name="lucide:package" class="w-4 h-4 mr-2" />
                  Mes commandes
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="logout" class="cursor-pointer text-red-600 focus:text-red-600">
                <Icon name="lucide:log-out" class="w-4 h-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
      </template>
      
      <template v-else>
        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" class="text-gray-200 hover:text-white hover:bg-white/10 px-3 py-2">
                <Icon name="lucide:user" class="w-4 h-4 mr-2" />
                <span class="hidden lg:inline">Mon compte</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48" align="end">
              <DropdownMenuItem asChild>
                <NuxtLink to="/login" class="cursor-pointer flex items-center">
                  <Icon name="lucide:log-in" class="w-4 h-4 mr-2" />
                  Connexion
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NuxtLink to="/register" class="cursor-pointer flex items-center">
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
