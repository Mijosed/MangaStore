<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
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
  // Vérifier si l'utilisateur est connecté
  if (!user.value) {
    // Rediriger vers la page de connexion si non connecté
    router.push('/login')
    return
  }

  isAdding.value = true
  
  cartStore.addItem({
    id: props.manga.id,
    title: props.manga.title,
    author: props.manga.author || '',
    price: props.manga.price,
    cover: props.manga.cover_url,
    slug: props.manga.slug
  })
  
  // Feedback visuel
  await new Promise(resolve => setTimeout(resolve, 300))
  isAdding.value = false
}
</script>

<template>
  <Card class="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
    <CardContent class="p-0 relative">
      <div class="relative overflow-hidden">
        <NuxtLink :to="`/manga/${manga.slug}`" class="block">
          <img 
            :src="manga.cover_url" 
            :alt="manga.title" 
            class="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110" 
          />
         
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-end p-4">
            <div class="text-white w-full">
              <p class="text-sm line-clamp-3 leading-relaxed">{{ manga.description || 'Découvrez ce manga passionnant...' }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </CardContent>
    <CardFooter class="p-4 flex flex-col gap-2">
      <div class="w-full">
        <h3 class="font-semibold truncate text-base">{{ manga.title }}</h3>
        <p class="text-sm text-gray-500 truncate">{{ manga.author }}</p>
      </div>
      <div class="flex items-center gap-4 justify-between w-full">
        <span class="font-bold text-lg">{{ manga.price }}€</span>
        <Button 
          size="sm" 
          variant="secondary" 
          class="cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg" 
          :class="{ 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600': isAdding }"
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
    </CardFooter>
  </Card>
</template>
