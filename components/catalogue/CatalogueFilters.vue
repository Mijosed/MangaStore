<script setup lang="ts">
import { Separator } from "@/components/ui/separator";

const props = defineProps<{
  categories: Array<{ id: string; name: string }>;
  genres: Array<{ id: string; name: string }>;
  selectedCategories: string[];
  selectedGenres: string[];
}>();

const emit = defineEmits<{
  (e: "toggle-category", category: string): void;
  (e: "toggle-genre", genre: string): void;
}>();

const handleCategoryChange = (category: string, checked: boolean) => {
  if (checked !== props.selectedCategories.includes(category)) {
    emit('toggle-category', category)
  }
}

const handleGenreChange = (genre: string, checked: boolean) => {
  if (checked !== props.selectedGenres.includes(genre)) {
    emit('toggle-genre', genre)
  }
}
</script>

<template>
  <aside class="w-full lg:w-64 lg:flex-shrink-0">
    <div class="lg:sticky lg:top-24 space-y-6">
      <div>
        <h3 class="font-semibold mb-3 text-gray-900">Catégories</h3>
        <div class="space-y-3">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center gap-3"
          >
            <input 
              type="checkbox"
              :id="`category-${category.id}`"
              :checked="selectedCategories.includes(category.name)"
              @change="(e) => handleCategoryChange(category.name, (e.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-2"
            />
            <label :for="`category-${category.id}`" class="text-sm font-medium text-gray-700 cursor-pointer">
              {{ category.name }}
            </label>
          </div>
        </div>
      </div>

      <Separator class="bg-gray-200" />

      <div>
        <h3 class="font-semibold mb-3 text-gray-900">Genres</h3>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div
            v-for="genre in genres"
            :key="genre.id"
            class="flex items-center gap-3"
          >
            <input 
              type="checkbox"
              :id="`genre-${genre.id}`"
              :checked="selectedGenres.includes(genre.name)"
              @change="(e) => handleGenreChange(genre.name, (e.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-2"
            />
            <label :for="`genre-${genre.id}`" class="text-sm font-medium text-gray-700 cursor-pointer">
              {{ genre.name }}
            </label>
          </div>
        </div>
      </div>

      
      <div v-if="selectedCategories.length > 0 || selectedGenres.length > 0" class="bg-gray-50 rounded-lg p-4 border">
        <h4 class="font-medium text-gray-900 mb-2">Filtres actifs</h4>
        <div class="space-y-2">
          <div v-if="selectedCategories.length > 0" class="text-sm">
            <span class="font-medium text-gray-700">Catégories:</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <span 
                v-for="category in selectedCategories" 
                :key="category"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"
              >
                {{ category }}
              </span>
            </div>
          </div>
          <div v-if="selectedGenres.length > 0" class="text-sm">
            <span class="font-medium text-gray-700">Genres:</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <span 
                v-for="genre in selectedGenres" 
                :key="genre"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {{ genre }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
