<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useCartStore } from '~/stores/cart'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const { user } = useAuth()
const router = useRouter()

const props = defineProps({
  manga: {
    type: Object,
    required: true
  }
})

const isAdding = ref(false)

const addToCart = async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  isAdding.value = true
  
  try {
    await cartStore.addItem({
      id: props.manga.id,
      title: props.manga.title,
      author: props.manga.author || '',
      price: props.manga.price,
      cover: props.manga.cover_url,
      slug: props.manga.slug
    })
    
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (error) {
    alert(error.message || 'Erreur lors de l\'ajout au panier')
  } finally {
    isAdding.value = false
  }
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Image du manga -->
    <div class="flex-shrink-0 mx-auto sm:mx-0">
      <NuxtLink :to="`/manga/${manga.slug}`" class="block">
        <img 
          :src="manga.cover_url" 
          :alt="manga.title" 
          class="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded shadow-sm hover:shadow-md transition-shadow duration-200" 
        />
      </NuxtLink>
    </div>

    <div class="flex-1 flex flex-col justify-between min-w-0">
      <div class="text-center sm:text-left">
        <NuxtLink :to="`/manga/${manga.slug}`" class="block hover:text-red-600 transition-colors">
          <h3 class="font-semibold text-lg sm:text-base mb-1 line-clamp-1">{{ manga.title }}</h3>
        </NuxtLink>
        <p class="text-sm text-gray-500 mb-2">par {{ manga.author || 'Auteur inconnu' }}</p>
        <p class="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 hidden sm:block">
          {{ manga.description || 'Aucune description disponible.' }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-2">
        <span class="font-bold text-xl sm:text-lg text-red-600">{{ manga.price }}€</span>
        <Button 
          size="sm" 
          variant="secondary"
          class="w-full sm:w-auto cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md" 
          :class="{ 'bg-gradient-to-r from-red-500 to-orange-500  text-white hover:from-red-600 hover:to-orange-600': isAdding }"
          @click="addToCart"
          :disabled="isAdding"
        >
          <Icon 
            :name="isAdding ? 'lucide:check' : user ? 'lucide:shopping-cart' : 'lucide:shopping-cart'" 
            class="w-4 h-4 mr-2" 
          />
          {{ isAdding ? 'Ajouté !' : user ? 'Ajouter' : 'Ajouter' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
