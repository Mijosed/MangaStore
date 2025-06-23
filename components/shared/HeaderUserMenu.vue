<template>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Avatar class="cursor-pointer">
          <AvatarImage :src="user.avatar_url || ''" />
          <AvatarFallback>{{ fallback }}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-48">
        <div class="px-4 py-2 text-xs text-gray-500">Connecté : {{ user.email }}</div>
        <DropdownMenuItem><NuxtLink to="/account">Mon profil</NuxtLink></DropdownMenuItem>
        <DropdownMenuItem><button @click="logout" class="text-red-500 w-full text-left">Déconnexion</button></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>
  
  <script setup lang="ts">
  import {
    Avatar,
    AvatarImage,
    AvatarFallback
  } from '@/components/ui/avatar'
  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
  } from '@/components/ui/dropdown-menu'
  import { useAuth } from '~/composables/useAuth'
  import { useRouter } from 'vue-router'
  
  const props = defineProps<{ user: { email: string, avatar_url?: string } }>()
  const fallback = props.user.email?.[0]?.toUpperCase() || '?'
  const router = useRouter()
  const { signOut } = useAuth()
  
  const logout = async () => {
    await signOut()
    router.push('/')
  }
  </script>
  