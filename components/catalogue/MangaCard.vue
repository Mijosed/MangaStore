<script setup>
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

defineProps({
  manga: {
    type: Object,
    required: true
  }
})
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
      <div class="flex items-center justify-between">
        <span class="font-bold text-lg">{{ manga.price }}€</span>
        <Button size="sm" variant="secondary">
          <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
