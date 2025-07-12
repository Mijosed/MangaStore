<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border mb-6">
    <h4 class="text-lg font-semibold mb-4">Ajouter un avis</h4>
    
    <form @submit.prevent="submitReview" class="space-y-4">
      <!-- Note -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Note <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-1">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="p-1 transition-colors duration-200"
            :class="[
              'hover:scale-110 transform transition-transform',
              star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
            ]"
          >
            <Icon
              name="lucide:star"
              :class="[
                'w-6 h-6',
                star <= (hoverRating || rating) ? 'fill-current' : ''
              ]"
            />
          </button>
        </div>
        <p class="text-sm text-gray-500 mt-1">
          {{ rating > 0 ? `${rating}/5 étoiles` : 'Cliquez pour noter' }}
        </p>
      </div>

      <!-- Commentaire -->
      <div>
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          Commentaire <span class="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          placeholder="Partagez votre avis sur ce manga..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          :class="{ 'border-red-500': showErrors && !comment.trim() }"
        ></textarea>
        <p v-if="showErrors && !comment.trim()" class="text-red-500 text-sm mt-1">
          Le commentaire est obligatoire
        </p>
        <p class="text-sm text-gray-500 mt-1">
          {{ comment.length }}/500 caractères
        </p>
      </div>

      <!-- Messages d'erreur -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>

      <!-- Messages de succès -->
      <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-3">
        <p class="text-green-600 text-sm">{{ success }}</p>
      </div>

      <!-- Boutons -->
      <div class="flex gap-3 pt-2">
        <Button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="flex-1 sm:flex-none"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
          {{ isSubmitting ? 'Publication...' : 'Publier l\'avis' }}
        </Button>
        <Button
          type="button"
          variant="outline"
          @click="resetForm"
          :disabled="isSubmitting"
        >
          Annuler
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/rating'

const props = defineProps({
  mangaId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['reviewAdded'])

// État du formulaire
const rating = ref(0)
const hoverRating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')
const showErrors = ref(false)

// Validation
const isFormValid = computed(() => {
  return rating.value > 0 && comment.value.trim().length > 0 && comment.value.length <= 500
})

// Méthodes
const setRating = (value) => {
  rating.value = value
  showErrors.value = false
}

const submitReview = async () => {
  showErrors.value = true
  
  if (!isFormValid.value) {
    error.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  isSubmitting.value = true
  error.value = ''
  success.value = ''

  try {
    const supabase = useSupabaseClient()
    const { user } = useAuth()

    if (!user.value) {
      throw new Error('Vous devez être connecté pour laisser un avis')
    }

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce manga
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('id')
      .eq('manga_id', props.mangaId)
      .eq('user_id', user.value.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingReview) {
      throw new Error('Vous avez déjà laissé un avis pour ce manga')
    }

    // Insérer le nouvel avis
    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert({
        manga_id: parseInt(props.mangaId),
        user_id: user.value.id,
        rating: rating.value,
        comment: comment.value.trim()
      })
      .select()

    if (insertError) {
      throw insertError
    }

    success.value = 'Votre avis a été publié avec succès !'
    resetForm()
    
    // Notifier le parent que l'avis a été ajouté
    emit('reviewAdded', data[0])

  } catch (err) {
    console.error('Erreur lors de la soumission de l\'avis:', err)
    error.value = err.message || 'Une erreur est survenue lors de la publication de votre avis'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  rating.value = 0
  hoverRating.value = 0
  comment.value = ''
  showErrors.value = false
  error.value = ''
  success.value = ''
}

// Effacer les messages après un délai
watch([error, success], () => {
  if (error.value || success.value) {
    setTimeout(() => {
      error.value = ''
      success.value = ''
    }, 5000)
  }
})
</script>
