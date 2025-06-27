<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex gap-8">
      <!-- Sidebar avec filtres -->
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

      <!-- Contenu principal -->
      <div class="flex-1">
        <!-- Titre -->
        <h1 class="text-3xl font-bold mb-6">Catalogue</h1>
        
        <!-- Barre de recherche -->
        <div class="mb-6">
          <SearchBar
            v-model="searchQuery"
            placeholder="Rechercher un manga, un auteur..."
            @search="handleSearch"
            @clear="clearSearch"
            class="w-full"
          />
        </div>

        <!-- En-tête avec options d'affichage -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <p v-if="searchQuery" class="text-sm text-muted-foreground mt-1">
              Résultats pour "{{ searchQuery }}" : {{ filteredMangas.length }} manga(s) trouvé(s)
            </p>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Sélecteur de tri -->
            <Select :value="sortOption" @change="handleSort">
              <SelectTrigger class="w-48">
                <SelectValue placeholder="Trier par...">
                  {{ {
                    'popularity': 'Les plus populaires',
                    'price-asc': 'Prix croissant',
                    'price-desc': 'Prix décroissant',
                    'title': 'Ordre alphabétique'
                  }[sortOption] }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Les plus populaires</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="title">Ordre alphabétique</SelectItem>
              </SelectContent>
            </Select>

            <!-- Boutons de vue -->
            <div class="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                :class="{ 'bg-gray-100': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <Icon name="lucide:grid" class="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                :class="{ 'bg-gray-100': viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <Icon name="lucide:list" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Grille ou liste de mangas -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
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

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2" aria-label="Pagination">
            <!-- Bouton Précédent -->
            <button
              @click="currentPage > 1 ? currentPage-- : null"
              :disabled="currentPage === 1"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Précédent
            </button>

            <!-- Pages simples (≤ 7 pages) -->
            <template v-if="totalPages <= 7">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPage === page
                    ? 'bg-red-600 text-white border border-red-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </template>

            <!-- Pagination avec ellipses (> 7 pages) -->
            <template v-else>
              <!-- Page 1 -->
              <button
                @click="currentPage = 1"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPage === 1
                    ? 'bg-red-600 text-white border border-red-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                ]"
              >
                1
              </button>

              <!-- Ellipse début -->
              <span v-if="currentPage > 3" class="px-2 py-2 text-gray-500">...</span>

              <!-- Pages autour de la page actuelle -->
              <button
                v-for="page in getVisiblePages()"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPage === page
                    ? 'bg-red-600 text-white border border-red-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>

              <!-- Ellipse fin -->
              <span v-if="currentPage < totalPages - 2" class="px-2 py-2 text-gray-500">...</span>

              <!-- Dernière page -->
              <button
                v-if="totalPages > 1"
                @click="currentPage = totalPages"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPage === totalPages
                    ? 'bg-red-600 text-white border border-red-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ totalPages }}
              </button>
            </template>

            <!-- Bouton Suivant -->
            <button
              @click="currentPage < totalPages ? currentPage++ : null"
              :disabled="currentPage === totalPages"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
            >
              Suivant
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import MangaCard from '~/components/catalogue/MangaCard.vue'
import MangaListItem from '~/components/catalogue/MangaListItem.vue'
import SearchBar from '~/components/catalogue/SearchBar.vue'

// Données fictives
const categories = [
  { id: 1, name: 'Shonen' },
  { id: 2, name: 'Seinen' },
  { id: 3, name: 'Shojo' },
  { id: 4, name: 'Josei' }
]

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Aventure' },
  { id: 3, name: 'Romance' },
  { id: 4, name: 'Fantasy' },
  { id: 5, name: 'Science-fiction' },
  { id: 6, name: 'Slice of life' }
]

// État des filtres et de l'affichage
const viewMode = ref('grid') // 'grid' ou 'list'
const selectedCategories = ref([])
const selectedGenres = ref([])
const priceRange = ref([0, 100])
const sortOption = ref('popularity')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const searchQuery = ref('')

// Gestion du tri
const handleSort = (value) => {
  sortOption.value = value
}

// Génération de plus de données fictives
const mangas = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Manga ${i + 1}`,
  author: `Auteur ${i + 1}`,
  cover: '/images/images.jpg',
  price: 6.99 + (i % 5),
  category: categories[i % categories.length].name,
  genre: genres[i % genres.length].name,
  description: 'Une description passionnante du manga qui donne envie de le lire...',
  slug: `manga-${i + 1}`
})))

// Filtres et pagination
const filteredMangas = computed(() => {
  return mangas.value.filter(manga => {
    const matchesCategory = selectedCategories.value.length === 0 || 
                          selectedCategories.value.includes(manga.category)
    const matchesGenre = selectedGenres.value.length === 0 || 
                        selectedGenres.value.includes(manga.genre)
    const matchesSearch = searchQuery.value === '' ||
                         manga.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         manga.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesGenre && matchesSearch
  })
})

const sortedMangas = computed(() => {
  const sorted = [...filteredMangas.value]
  switch (sortOption.value) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
})

const paginatedMangas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedMangas.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredMangas.value.length / itemsPerPage.value)
)

// Méthodes
const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index === -1) {
    selectedCategories.value.push(category)
  } else {
    selectedCategories.value.splice(index, 1)
  }
  currentPage.value = 1 // Réinitialiser la pagination
}

const toggleGenre = (genre) => {
  const index = selectedGenres.value.indexOf(genre)
  if (index === -1) {
    selectedGenres.value.push(genre)
  } else {
    selectedGenres.value.splice(index, 1)
  }
  currentPage.value = 1 // Réinitialiser la pagination
}

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1 // Réinitialiser la pagination
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1 // Réinitialiser la pagination
}

const getVisiblePages = () => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value
  
  // Afficher les pages autour de la page actuelle
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)
  
  // Ajuster pour toujours afficher au moins 3 pages
  if (end - start < 2) {
    if (start === 2) {
      end = Math.min(total - 1, start + 2)
    } else if (end === total - 1) {
      start = Math.max(2, end - 2)
    }
  }
  
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) {
      pages.push(i)
    }
  }
  
  return pages
}
</script>