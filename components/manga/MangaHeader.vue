<template>
  <div class="grid md:grid-cols-2 gap-8">
    <!-- Image Column -->
    <div>
      <img
        :src="manga.cover"
        :alt="manga.title"
        class="w-full rounded-lg shadow-lg object-cover"
      />
    </div>

    <!-- Details Column -->
    <div>
      <h1 class="text-4xl font-bold mb-2">{{ manga.title }}</h1>
      <p class="text-lg text-gray-600 mb-4">par {{ manga.author }}</p>

      <div class="flex items-center gap-4 mb-6">
        <span class="text-3xl font-bold">{{ manga.price }}€</span>
        <span v-if="manga.stock > 0" class="text-green-600">En stock</span>
        <span v-else class="text-red-600">Rupture de stock</span>
      </div>

      <div class="flex gap-4 items-center mb-6">
        <div class="flex border rounded-lg">
          <Button
            variant="outline"
            size="icon"
            @click="$emit('decrementQuantity')"
            :disabled="quantity <= 1"
            class="rounded-r-none"
          >
            <i class="fas fa-minus"></i>
          </Button>
          <div class="px-4 py-2 border-x flex items-center">
            {{ quantity }}
          </div>
          <Button
            variant="outline"
            size="icon"
            @click="$emit('incrementQuantity')"
            :disabled="quantity >= manga.stock"
            class="rounded-l-none"
          >
            <i class="fas fa-plus"></i>
          </Button>
        </div>
        <Button
          @click="$emit('addToCart')"
          :disabled="manga.stock === 0"
          class="flex-1"
        >
          Ajouter au panier
        </Button>
      </div>

      <div class="mb-8">
        <div class="flex gap-2 flex-wrap mb-4">
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
            {{ manga.category }}
          </span>
          <span
            v-for="genre in manga.genres"
            :key="genre"
            class="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
          >
            {{ genre }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface Props {
  manga: {
    title: string
    author: string
    cover: string
    price: number
    stock: number
    category: string
    genres: string[]
  }
  quantity: number
}

defineProps<Props>()
defineEmits<{
  (e: 'incrementQuantity'): void
  (e: 'decrementQuantity'): void
  (e: 'addToCart'): void
}>()
</script>
