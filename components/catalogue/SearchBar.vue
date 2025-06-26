<script setup>
import { ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Props et émissions
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Rechercher un manga, un auteur...'
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

// État local
const searchQuery = ref(props.modelValue)

// Watcher pour synchroniser avec le parent
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// Méthodes
const handleInput = () => {
  emit('update:modelValue', searchQuery.value)
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    emit('search', searchQuery.value)
  }
}
</script>

<template>
  <div class="relative w-full max-w-md">
    <div class="relative flex items-center">
      <!-- Icône de recherche -->
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <svg 
          class="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <!-- Champ de recherche -->
      <Input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="pl-10 pr-10"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      
      <!-- Bouton de suppression (visible seulement si il y a du texte) -->
      <button
        v-if="searchQuery"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        @click="clearSearch"
      >
        <svg 
          class="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    
    <!-- Suggestions/Résultats rapides (optionnel) -->
    <div 
      v-if="searchQuery && $slots.suggestions" 
      class="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50"
    >
      <slot name="suggestions" :query="searchQuery" />
    </div>
  </div>
</template>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style> 