<template>
  <div class="flex-1 flex items-center justify-center p-10">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Mot de passe oublié</CardTitle>
        <CardDescription>
          Entrez votre email ci-dessous pour recevoir un lien de réinitialisation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handlePasswordReset" class="grid gap-4">
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
          <Button type="submit" class="w-full bg-red-500 hover:bg-red-600 cursor-pointer">Envoyer le lien</Button>
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

<script setup lang="ts">
import { ref } from 'vue'
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
const errorMsg = ref('')
const successMsg = ref('')

const client = useSupabaseClient()

const handlePasswordReset = async () => {
  const { error } = await client.auth.resetPasswordForEmail(email.value, {
    redirectTo: 'http://localhost:3000/resetpassword'
  })
  
  if (error) {
    errorMsg.value = error.message
    successMsg.value = ''
  } else {
    successMsg.value = 'E-mail de réinitialisation envoyé.'
    errorMsg.value = ''
  }
}
</script>
