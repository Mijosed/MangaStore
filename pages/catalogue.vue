<script setup lang="ts">
import { onMounted, computed } from 'vue'
import MangaCard from '~/components/catalogue/MangaCard.vue'
import MangaListItem from '~/components/catalogue/MangaListItem.vue'
import CatalogueFilters from '~/components/catalogue/CatalogueFilters.vue'
import CatalogueHeader from '~/components/catalogue/CatalogueHeader.vue'
import CataloguePagination from '~/components/catalogue/CataloguePagination.vue'
import { useCatalogue } from '~/composables/useCatalogue'
import { useFilters } from '~/composables/useFilters'
import { usePagination } from '~/composables/usePagination'

// Initialisation des composables
const { categories, genres, mangas, isLoading, fetchCategories, fetchGenres, fetchMangas } = useCatalogue()
const { 
  viewMode, 
  selectedCategories, 
  selectedGenres, 
  sortOption, 
  searchQuery, 
  toggleCategory, 
  toggleGenre,
  filteredMangas 
} = useFilters(mangas)

const { 
  currentPage, 
  paginatedItems: paginatedMangas, 
  totalPages,
  getVisiblePages 
} = usePagination(filteredMangas)

// Handlers
const handleSearch = async (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handleSort = async (value: string) => {
  sortOption.value = value as any // TODO: Corriger le type
  await fetchMangas(value)
}

const handleToggleCategory = (category: string) => {
  console.log('2. handleToggleCategory appelé avec:', category)
  toggleCategory(category)
  console.log('3. selectedCategories après toggle:', selectedCategories.value)
  currentPage.value = 1
}

const handleToggleGenre = (genre: string) => {
  console.log('2. handleToggleGenre appelé avec:', genre)
  toggleGenre(genre)
  console.log('3. selectedGenres après toggle:', selectedGenres.value)
  currentPage.value = 1
}

// Chargement initial des données
onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchGenres(),
    fetchMangas()
  ])
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
    
    <div v-else class="flex gap-8">
      <!-- Filtres -->
      <CatalogueFilters
        :categories="categories"
        :genres="genres"
        :selected-categories="selectedCategories"
        :selected-genres="selectedGenres"
        @toggle-category="handleToggleCategory"
        @toggle-genre="handleToggleGenre"
      />

      <!-- Contenu principal -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold mb-6">Catalogue</h1>
        
        <!-- En-tête avec recherche et options -->
        <CatalogueHeader
          v-model:view-mode="viewMode"
          :search-query="searchQuery"
          :sort-option="sortOption"
          :total-results="filteredMangas.length"
          @search="handleSearch"
          @clear="handleClearSearch"
          @sort="handleSort"
        />

        <!-- Grille ou liste de mangas -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          <MangaCard
            v-for="manga in paginatedMangas"
            :key="manga.id"
            :manga="manga"
          />
        </div>
        <div v-else class="space-y-4 mt-6">
          <MangaListItem
            v-for="manga in paginatedMangas"
            :key="manga.id"
            :manga="manga"
          />
        </div>

        <!-- Pagination -->
        <CataloguePagination
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :visible-pages="getVisiblePages()"
        />
      </div>
    </div>
  </div>
</template>

