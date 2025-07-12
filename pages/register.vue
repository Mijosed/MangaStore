<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const email = ref('')
const password = ref('')
const displayName = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const displayNameAvailable = ref<boolean | null>(null)
const checkingDisplayName = ref(false)
const router = useRouter()

const client = useSupabaseClient()

// Fonction pour vérifier l'unicité du display_name
const checkDisplayNameUniqueness = async (name: string) => {
  if (!name || name.length < 3) {
    displayNameAvailable.value = null
    return
  }

  checkingDisplayName.value = true
  
  try {
    // Utiliser la fonction RPC pour vérifier l'unicité
    const { data, error } = await client.rpc('get_users')
    
    if (error) {
      console.error('Erreur lors de la vérification:', error)
      displayNameAvailable.value = null
    } else {
      const users = data as any[] || []
      // Vérifier si le display_name existe déjà
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

// Debounce pour la vérification du display_name
let timeoutId: NodeJS.Timeout
watch(displayName, (newValue) => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    checkDisplayNameUniqueness(newValue)
  }, 500)
})

const signup = async () => {
  // Validation du display_name
  if (!displayName.value || displayName.value.length < 3) {
    errorMsg.value = 'Le nom d\'affichage doit contenir au moins 3 caractères'
    return
  }

  if (!displayName.value.match(/^[a-zA-Z0-9_-]+$/)) {
    errorMsg.value = 'Le nom d\'affichage ne peut contenir que des lettres, chiffres, tirets et underscores'
    return
  }

  if (displayNameAvailable.value === false) {
    errorMsg.value = 'Ce nom d\'affichage est déjà utilisé'
    return
  }

  const { data, error } = await client.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        display_name: displayName.value,
        username: displayName.value
      }
    }
  })

  if (error) {
    errorMsg.value = error.message
    successMsg.value = ''
  } else {
    successMsg.value = 'Un e-mail de confirmation vous a été envoyé.'
    errorMsg.value = ''
  }
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center p-10">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations ci-dessous pour créer votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="signup" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="displayName">Nom d'affichage</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="john_doe"
              v-model="displayName"
              required
              minlength="3"
            />
            <div v-if="checkingDisplayName" class="text-xs text-gray-500">
              Vérification de la disponibilité...
            </div>
            <div v-else-if="displayName.length >= 3">
              <div v-if="displayNameAvailable === true" class="text-xs text-green-600">
                ✅ Nom d'affichage disponible
              </div>
              <div v-else-if="displayNameAvailable === false" class="text-xs text-red-500">
                ❌ Ce nom d'affichage est déjà utilisé
              </div>
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              v-model="email"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              v-model="password"
              required
            />
          </div>
          <Button type="submit" class="w-full bg-red-500 hover:bg-red-600 cursor-pointer">S'inscrire</Button>
          <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
          <p v-if="successMsg" class="text-sm text-green-600">{{ successMsg }}</p>
        </form>
        <div class="mt-4 text-center text-sm">
          Vous avez déjà un compte ?
          <RouterLink to="/login" class="underline">Connectez-vous</RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
