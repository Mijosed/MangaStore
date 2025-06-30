<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-600 min-h-[400px] flex items-center justify-center">
      <div>
        <Icon name="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Content with Sidebar -->
    <div v-else-if="profile" class="flex gap-8">
      <!-- Sidebar -->
      <aside class="w-64 shrink-0">
        <nav class="space-y-1">
          <NuxtLink 
            to="/account"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md',
              route.path === '/account' 
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <Icon name="lucide:user" class="w-5 h-5 mr-3" />
            Informations personnelles
          </NuxtLink>

          <NuxtLink 
            to="/account/orders"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md',
              route.path === '/account/orders'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <Icon name="lucide:package" class="w-5 h-5 mr-3" />
            Mes commandes
          </NuxtLink>

          <NuxtLink 
            v-if="isAdmin"
            to="/account/users"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md',
              route.path === '/account/users'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <Icon name="lucide:users" class="w-5 h-5 mr-3" />
            Gestion utilisateurs
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 max-w-3xl">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Informations du compte</h3>
            
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">{{ profile?.email }}</dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-gray-500">Rôle</dt>
                  <dd class="mt-1 capitalize text-gray-900 sm:col-span-2 sm:mt-0">{{ profile?.role || 'utilisateur' }}</dd>
                </div>
              </dl>
            </div>

            <div class="mt-8 space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Changer le mot de passe</h4>
                <Button class="mt-2" variant="outline" @click="handlePasswordChange">
                  Modifier le mot de passe
                </Button>
              </div>

              <div>
                <h4 class="text-sm font-medium text-red-600">Zone de danger</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                </p>
                <Button 
                  class="mt-2" 
                  variant="destructive"
                  @click="handleDeleteAccount"
                >
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { useProfile } from '~/composables/useProfile'
import { useAuth } from '~/composables/useAuth'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import DialogContent from '~/components/ui/dialog/DialogContent.vue'
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue'
import { useSupabaseClient } from '#imports'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { profile, loading, error, fetchProfile } = useProfile()
const { user } = useAuth()
const showDeleteConfirm = ref(false)
const confirmEmail = ref('')

const isAdmin = computed(() => profile.value?.role === 'admin')

// Format date to local string
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Handle password change request
const handleChangePassword = async () => {
  try {
    const { error } = await useSupabaseClient().auth.updateUser({
      password: 'new-password' // À implémenter avec un dialog pour saisir le nouveau mot de passe
    })
    if (error) throw error
    // TODO: Afficher une notification de succès
  } catch (err) {
    console.error('Erreur lors du changement de mot de passe:', err)
    // TODO: Afficher une notification d'erreur
  }
}

// Handle account deletion
const handleDeleteAccount = async () => {
  // TODO: Ajouter une confirmation avant suppression
  try {
    const { error } = await useSupabaseClient().auth.admin.deleteUser(
      profile.value?.id as string
    )
    if (error) throw error
    // TODO: Rediriger vers la page d'accueil
  } catch (err) {
    console.error('Erreur lors de la suppression du compte:', err)
    // TODO: Afficher une notification d'erreur
  }
}

// Load profile data
onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  
  await fetchProfile()
})
</script>
