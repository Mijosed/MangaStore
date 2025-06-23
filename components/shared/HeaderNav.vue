<script setup>
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from '@/components/ui/navigation-menu'
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, signOut } = useAuth()
const router = useRouter()

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
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </NuxtLink>
        </NavigationMenuItem>
        
        <!-- Menu utilisateur -->
        <template v-if="user">
          <NavigationMenuItem>
            <NavigationMenuTrigger class="text-gray-200 hover:text-white">
              <Avatar>
                <AvatarImage :src="user.avatar_url || ''" />
                <AvatarFallback>{{ user.email?.[0]?.toUpperCase() || '?' }}</AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div class="p-4 w-48 bg-neutral-900">
                <div class="text-xs text-gray-400 mb-2">{{ user.email }}</div>
                <div class="flex flex-col gap-2">
                  <NuxtLink to="/account" class="text-gray-200 hover:text-white transition-colors">Mon profil</NuxtLink>
                  <button @click="logout" class="text-red-400 text-left hover:text-red-300 transition-colors">
                    Se déconnecter
                  </button>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </template>
        
        <!-- Menu connexion/inscription pour les utilisateurs non connectés -->
        <template v-else>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div class="text-gray-200 hover:text-white transition-colors">
                <Icon name="lucide:user" class="w-5 h-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48 bg-neutral-900 border-neutral-800">
              <DropdownMenuItem>
                <NuxtLink to="/login" class="w-full text-gray-200 hover:text-white">
                  Connexion
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NuxtLink to="/register" class="w-full text-gray-200 hover:text-white">
                  Inscription
                </NuxtLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
      </NavigationMenuList>
    </NavigationMenu>
</template>

<style scoped>
.navigation-menu {
  background: transparent;
}
</style>
