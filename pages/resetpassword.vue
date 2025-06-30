<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const newPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

const client = useSupabaseClient()

const handleReset = async () => {
  const { error } = await client.auth.updateUser({ password: newPassword.value })
  
  if (error) {
    errorMsg.value = error.message
    successMsg.value = ''
  } else {
    successMsg.value = 'Mot de passe mis à jour avec succès.'
    errorMsg.value = ''
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}

onMounted(() => {
  client.auth.onAuthStateChange(async (event) => {
    if (event === 'PASSWORD_RECOVERY') {
    }
  })
})
</script>

<template>
  <div class="flex-1 flex items-center justify-center p-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Réinitialiser le mot de passe</CardTitle>
        <CardDescription>
          Entrez votre nouveau mot de passe ci-dessous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleReset" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              v-model="newPassword"
              required
            />
          </div>
          <Button type="submit" class="w-full bg-red-500 hover:bg-red-600 cursor-pointer">Réinitialiser le mot de passe</Button>
          <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
          <p v-if="successMsg" class="text-sm text-green-600">{{ successMsg }}</p>
        </form>
        <div class="mt-4 text-center text-sm">
          <RouterLink to="/login" class="underline">Retour à la connexion</RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

