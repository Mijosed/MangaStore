<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Formulaire de contact',
  description: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.'
})

const form = ref({
  nom: '',
  email: '',
  sujet: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const messageType = ref<'success' | 'error'>('success')

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        nom: form.value.nom,
        email: form.value.email,
        sujet: form.value.sujet,
        message: form.value.message
      }
    })
    
    if (response.success) {
      submitMessage.value = 'Votre message a été envoyé avec succès !'
      messageType.value = 'success'
      
      form.value = {
        nom: '',
        email: '',
        sujet: '',
        message: ''
      }
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi:', error)
    submitMessage.value = error.data?.message || 'Une erreur est survenue lors de l\'envoi.'
    messageType.value = 'error'
  } finally {
    isSubmitting.value = false
    
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)
  }
}

defineExpose({
  form,
  isSubmitting,
  submitMessage,
  messageType,
  submitForm
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="submitForm" class="space-y-6" data-testid="contact-form">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="nom">Nom complet *</Label>
            <Input
              id="nom"
              v-model="form.nom"
              type="text"
              placeholder="Votre nom"
              required
              data-testid="input-nom"
            />
          </div>
          <div class="space-y-2">
            <Label for="email">Email *</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="votre@email.com"
              required
              data-testid="input-email"
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <Label for="sujet">Sujet *</Label>
          <Input
            id="sujet"
            v-model="form.sujet"
            type="text"
            placeholder="Objet de votre message"
            required
            data-testid="input-sujet"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="message">Message *</Label>
          <textarea
            id="message"
            v-model="form.message"
            class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Écrivez votre message ici..."
            rows="5"
            required
            data-testid="textarea-message"
          ></textarea>
        </div>
        
        <div class="flex flex-col space-y-4">
          <Button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full cursor-pointer bg-red-500 hover:bg-red-600"
            data-testid="submit-button"
          >
            <span v-if="isSubmitting">Envoi en cours...</span>
            <span v-else>Envoyer le message</span>
          </Button>
          
          <div 
            v-if="submitMessage" 
            class="text-center p-3 rounded-md"
            :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            data-testid="submit-message"
          >
            {{ submitMessage }}
          </div>
        </div>
      </form>
    </CardContent>
  </Card>
</template> 