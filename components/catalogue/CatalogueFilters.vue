<template>
  <aside class="w-64 flex-shrink-0">
    <div class="sticky top-24 space-y-6">
      <div>
        <h3 class="font-semibold mb-3">Catégories</h3>
        <div class="space-y-2">
          <div v-for="category in categories" :key="category.id" class="flex items-center gap-2">
            <Checkbox 
              :id="category.name"
              :checked="selectedCategories.includes(category.name)"
              @change="toggleCategory(category.name)"
            />
            <label :for="category.name" class="text-sm">{{ category.name }}</label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 class="font-semibold mb-3">Genres</h3>
        <div class="space-y-2">
          <div v-for="genre in genres" :key="genre.id" class="flex items-center gap-2">
            <Checkbox 
              :id="genre.name"
              :checked="selectedGenres.includes(genre.name)"
              @change="toggleGenre(genre.name)"
            />
            <label :for="genre.name" class="text-sm">{{ genre.name }}</label>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

defineProps<{
  categories: Array<{ id: string; name: string }>
  genres: Array<{ id: string; name: string }>
  selectedCategories: string[]
  selectedGenres: string[]
}>()

defineEmits<{
  (e: 'toggle-category', category: string): void
  (e: 'toggle-genre', genre: string): void
}>()</script>
