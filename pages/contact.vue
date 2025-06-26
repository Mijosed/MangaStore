<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// État du formulaire
const form = ref({
  nom: '',
  email: '',
  sujet: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')

// Fonction de soumission du formulaire
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Simulation d'envoi (ici tu peux ajouter la logique d'envoi réelle)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    submitMessage.value = 'Votre message a été envoyé avec succès !'
    
    // Réinitialiser le formulaire
    form.value = {
      nom: '',
      email: '',
      sujet: '',
      message: ''
    }
  } catch (error) {
    submitMessage.value = 'Une erreur est survenue lors de l\'envoi.'
  } finally {
    isSubmitting.value = false
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-16 max-w-2xl">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">Contactez-nous</h1>
      <p class="text-lg text-muted-foreground">
        Une question ? Une suggestion ? N'hésitez pas à nous écrire !
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Formulaire de contact</CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="nom">Nom complet *</Label>
              <Input
                id="nom"
                v-model="form.nom"
                type="text"
                placeholder="Votre nom"
                required
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
            ></textarea>
          </div>
          
          <div class="flex flex-col space-y-4">
            <Button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full cursor-pointer bg-red-500 hover:bg-red-600"
            >
              <span v-if="isSubmitting">Envoi en cours...</span>
              <span v-else>Envoyer le message</span>
            </Button>
            
            <div v-if="submitMessage" 
                 class="text-center p-3 rounded-md"
                 :class="submitMessage.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ submitMessage }}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>