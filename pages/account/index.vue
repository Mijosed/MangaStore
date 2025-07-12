<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Informations générales</h1>
    
    <div v-if="user" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updateDisplayName" class="space-y-4">
            <div class="space-y-2">
              <Label for="displayName">Nom d'affichage</Label>
              <Input 
                id="displayName" 
                v-model="displayName" 
                placeholder="Votre nom d'affichage"
                :disabled="updating"
              />
              <div v-if="checkingDisplayName" class="text-xs text-gray-500">
                Vérification de la disponibilité...
              </div>
              <div v-else-if="displayName && displayName.length >= 3 && displayName !== currentDisplayName">
                <div v-if="displayNameAvailable === true" class="text-xs text-green-600">
                  ✅ Nom d'affichage disponible
                </div>
                <div v-else-if="displayNameAvailable === false" class="text-xs text-red-500">
                  ❌ Ce nom d'affichage est déjà utilisé
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" :value="user.email" disabled />
            </div>
            
            <div class="space-y-2">
              <Label for="created">Membre depuis</Label>
              <Input 
                id="created" 
                :value="new Date(user.created_at).toLocaleDateString('fr-FR')" 
                disabled 
              />
            </div>

            <div class="space-y-2">
              <Label for="role">Rôle</Label>
              <Input 
                id="role" 
                :value="profile?.role || 'utilisateur'" 
                class="capitalize"
                disabled 
              />
            </div>

            <Button 
              type="submit" 
              :disabled="updating || !canUpdateDisplayName"
              class="w-full"
            >
              <Icon v-if="updating" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
              {{ updating ? 'Mise à jour...' : 'Mettre à jour le profil' }}
            </Button>

            <p v-if="updateMessage" :class="['text-sm', updateSuccess ? 'text-green-600' : 'text-red-500']">
              {{ updateMessage }}
            </p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>Gérez vos paramètres de sécurité</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <NuxtLink 
              to="/resetpassword" 
              class="inline-flex"
            >
              <Button>
                <Icon name="lucide:key" class="w-4 h-4 mr-2" />
                Changer mon mot de passe
              </Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="flex justify-center items-center h-64">
      <p class="text-gray-500">Chargement...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({
  layout: 'account',
  middleware: 'auth'
})

const { profile } = useProfile()
const { user } = useAuth()
const client = useSupabaseClient()

// État pour la gestion du display_name
const displayName = ref('')
const currentDisplayName = ref('')
const displayNameAvailable = ref<boolean | null>(null)
const checkingDisplayName = ref(false)
const updating = ref(false)
const updateMessage = ref('')
const updateSuccess = ref(false)

// Initialiser le display_name actuel
watch(() => user.value, (newUser) => {
  if (newUser) {
    const currentName = newUser.user_metadata?.display_name || 
                       newUser.user_metadata?.username || 
                       newUser.email?.split('@')[0] || ''
    displayName.value = currentName
    currentDisplayName.value = currentName
  }
}, { immediate: true })

// Vérification d'unicité du display_name
const checkDisplayNameUniqueness = async (name: string) => {
  if (!name || name.length < 3 || name === currentDisplayName.value) {
    displayNameAvailable.value = null
    return
  }

  checkingDisplayName.value = true
  
  try {
    const { data, error } = await client.rpc('get_users')
    
    if (error) {
      console.error('Erreur lors de la vérification:', error)
      displayNameAvailable.value = null
    } else {
      const users = data as any[] || []
      const nameExists = users.some((user: any) => {
        const userDisplayName = user.raw_user_meta_data?.display_name || 
                               user.raw_user_meta_data?.username ||
                               user.email?.split('@')[0]
        return userDisplayName?.toLowerCase() === name.toLowerCase()
      })
      
      displayNameAvailable.value = !nameExists
    }
  } catch (err) {
    console.error('Erreur lors de la vérification du display_name:', err)
    displayNameAvailable.value = null
  } finally {
    checkingDisplayName.value = false
  }
}

// Debounce pour la vérification
let timeoutId: NodeJS.Timeout
watch(displayName, (newValue) => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    checkDisplayNameUniqueness(newValue)
  }, 500)
})

// Validation pour pouvoir mettre à jour
const canUpdateDisplayName = computed(() => {
  return displayName.value && 
         displayName.value.length >= 3 && 
         displayName.value !== currentDisplayName.value &&
         (displayNameAvailable.value === true || displayName.value === currentDisplayName.value) &&
         displayName.value.match(/^[a-zA-Z0-9_-]+$/)
})

// Fonction de mise à jour du display_name
const updateDisplayName = async () => {
  if (!canUpdateDisplayName.value || !user.value) {
    return
  }

  updating.value = true
  updateMessage.value = ''

  try {
    const { error } = await client.auth.updateUser({
      data: {
        display_name: displayName.value,
        username: displayName.value
      }
    })

    if (error) {
      throw error
    }

    currentDisplayName.value = displayName.value
    updateMessage.value = 'Display name mis à jour avec succès !'
    updateSuccess.value = true

    // Actualiser l'utilisateur
    await navigateTo('/account', { replace: true })
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour:', err)
    updateMessage.value = err.message || 'Erreur lors de la mise à jour'
    updateSuccess.value = false
  } finally {
    updating.value = false
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      updateMessage.value = ''
    }, 3000)
  }
}
</script>
