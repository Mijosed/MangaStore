<script setup>
import { Button } from '@/components/ui/button'

defineProps({
  manga: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex gap-4 p-4 bg-white rounded-lg border">
    <NuxtLink :to="`/manga/${manga.slug}`" class="flex-shrink-0">
      <img :src="manga.cover_url" :alt="manga.title" class="w-24 h-32 object-cover rounded" />
    </NuxtLink>
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <h3 class="font-semibold">{{ manga.title }}</h3>
        <p class="text-sm text-gray-500">{{ manga.author }}</p>
        <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ manga.description }}</p>
      </div>
      <div class="flex items-center justify-between mt-2">
        <span class="font-bold text-lg">{{ manga.price }}€</span>
        <Button size="sm" variant="secondary">
          <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  </div>
</template>
