<script setup>
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const props = defineProps({
  manga: {
    type: Object,
    required: true
  }
})

const isAdding = ref(false)

const addToCart = async () => {
  isAdding.value = true
  
  cartStore.addItem({
    id: props.manga.id,
    title: props.manga.title,
    author: props.manga.author,
    price: props.manga.price,
    cover: props.manga.cover,
    slug: props.manga.slug
  })
  
  // Feedback visuel
  await new Promise(resolve => setTimeout(resolve, 300))
  isAdding.value = false
}
</script>

<template>
  <Card class="overflow-hidden group">
    <CardContent class="p-0 relative">
      <NuxtLink :to="`/manga/${manga.slug}`">
        <img :src="manga.cover" :alt="manga.title" class="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p class="text-white text-sm line-clamp-2">{{ manga.description }}</p>
        </div>
      </NuxtLink>
    </CardContent>
    <CardFooter class="p-4 flex flex-col gap-2">
      <div>
        <h3 class="font-semibold truncate">{{ manga.title }}</h3>
        <p class="text-sm text-gray-500">{{ manga.author }}</p>
      </div>
      <div class="flex items-center gap-4 justify-between">
        <span class="font-bold text-lg">{{ manga.price }}€</span>
        <Button 
          size="sm" 
          variant="secondary" 
          class="cursor-pointer transition-all duration-200" 
          :class="{ 'bg-green-500 text-white': isAdding }"
          @click="addToCart"
          :disabled="isAdding"
        >
          <Icon 
            :name="isAdding ? 'lucide:check' : 'lucide:shopping-cart'" 
            class="w-4 h-4 mr-2" 
          />
          {{ isAdding ? 'Ajouté !' : 'Ajouter' }}
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
