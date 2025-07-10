<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import MangaCard from '~/components/catalogue/MangaCard.vue'
import MangaListItem from '~/components/catalogue/MangaListItem.vue'
import CatalogueFilters from '~/components/catalogue/CatalogueFilters.vue'
import CatalogueHeader from '~/components/catalogue/CatalogueHeader.vue'
import CataloguePagination from '~/components/catalogue/CataloguePagination.vue'
import { useCatalogue } from '~/composables/useCatalogue'
import { useFilters } from '~/composables/useFilters'
import type { SortOption } from '~/composables/useFilters'
import { usePagination } from '~/composables/usePagination'

// Récupération des paramètres de l'URL
const route = useRoute()

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
  initializeWithCategory,
  setSortOption,
  filteredMangas 
} = useFilters(mangas)

const { 
  currentPage, 
  paginatedItems: paginatedMangas, 
  totalPages,
  getVisiblePages 
} = usePagination(filteredMangas)

// État pour le panneau mobile des filtres
const isMobileFiltersOpen = ref(false)

// Computed pour le nombre de filtres actifs
const activeFiltersCount = computed(() => {
  return selectedCategories.value.length + selectedGenres.value.length
})

// Handlers
const handleSearch = async (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handleSort = (value: SortOption) => {
  setSortOption(value);
  currentPage.value = 1;
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
  
  // Appliquer le filtre de catégorie depuis l'URL si présent
  const categoryFromRoute = route.query.category as string
  if (categoryFromRoute) {
    initializeWithCategory(categoryFromRoute)
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-4 md:py-8">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
    
    <div v-else>
      <!-- Titre et bouton filtres mobile -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl font-bold">Catalogue</h1>
        
        <!-- Bouton filtres pour mobile -->
        <div class="lg:hidden">
          <Sheet v-model:open="isMobileFiltersOpen">
            <SheetTrigger asChild>
              <Button variant="outline" class="relative">
                <Icon name="lucide:filter" class="w-4 h-4 mr-2" />
                Filtres
                <span v-if="activeFiltersCount > 0" 
                      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ activeFiltersCount }}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" class="w-80">
              <SheetHeader>
                <SheetTitle>Filtrer les mangas</SheetTitle>
              </SheetHeader>
              <div class="mt-6">
                <CatalogueFilters
                  :categories="categories"
                  :genres="genres"
                  :selected-categories="selectedCategories"
                  :selected-genres="selectedGenres"
                  @toggle-category="handleToggleCategory"
                  @toggle-genre="handleToggleGenre"
                  class="w-full"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <!-- Filtres Desktop -->
        <div class="hidden lg:block">
          <CatalogueFilters
            :categories="categories"
            :genres="genres"
            :selected-categories="selectedCategories"
            :selected-genres="selectedGenres"
            @toggle-category="handleToggleCategory"
            @toggle-genre="handleToggleGenre"
          />
        </div>

        <!-- Contenu principal -->
        <div class="flex-1 min-w-0">
          <!-- En-tête avec recherche et options -->
          <CatalogueHeader
            v-model:view-mode="viewMode"
            v-model:sort-option="sortOption"
            :search-query="searchQuery"
            :total-results="filteredMangas.length"
            @search="handleSearch"
            @clear="handleClearSearch"
            @sort="handleSort"
            class="mb-6"
          />

          <!-- Grille ou liste de mangas responsive -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            <MangaCard
              v-for="manga in paginatedMangas"
              :key="manga.id"
              :manga="manga"
            />
          </div>
          <div v-else class="space-y-4">
            <MangaListItem
              v-for="manga in paginatedMangas"
              :key="manga.id"
              :manga="manga"
            />
          </div>

          <!-- Message si aucun résultat -->
          <div v-if="filteredMangas.length === 0" class="text-center py-12">
            <Icon name="lucide:search-x" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun manga trouvé</h3>
            <p class="text-gray-500 mb-6">Essayez de modifier vos critères de recherche ou de filtrage</p>
            <Button @click="handleClearSearch" variant="outline">
              Effacer les filtres
            </Button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredMangas.length > 0" class="mt-8">
            <CataloguePagination
              v-model:current-page="currentPage"
              :total-pages="totalPages"
              :visible-pages="getVisiblePages()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

