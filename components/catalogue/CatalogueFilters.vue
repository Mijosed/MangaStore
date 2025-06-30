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
  <aside class="w-64 flex-shrink-0">
    <div class="sticky top-24 space-y-6">
      <div>
        <h3 class="font-semibold mb-3">Catégories</h3>
        <div class="space-y-2">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center gap-2"
          >
            <input 
              type="checkbox"
              :id="category.name"
              :checked="selectedCategories.includes(category.name)"
              @change="(e) => handleCategoryChange(category.name, (e.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label :for="category.name" class="text-sm">{{
              category.name
            }}</label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 class="font-semibold mb-3">Genres</h3>
        <div class="space-y-2">
          <div
            v-for="genre in genres"
            :key="genre.id"
            class="flex items-center gap-2"
          >
            <input 
              type="checkbox"
              :id="genre.name"
              :checked="selectedGenres.includes(genre.name)"
              @change="(e) => handleGenreChange(genre.name, (e.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label :for="genre.name" class="text-sm">{{ genre.name }}</label>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
