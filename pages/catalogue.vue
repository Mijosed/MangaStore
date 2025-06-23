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
        <!-- En-tête avec options d'affichage -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">Catalogue</h1>
          
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
        <div class="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  @click="currentPage > 1 ? currentPage-- : null"
                  :class="{ 'pointer-events-none opacity-50': currentPage === 1 }"
                />
              </PaginationItem>
              
              <PaginationItem v-for="page in totalPages" :key="page">
                <PaginationLink
                  :is-active="currentPage === page"
                  @click="currentPage = page"
                >
                  {{ page }}
                </PaginationLink>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext
                  @click="currentPage < totalPages ? currentPage++ : null"
                  :class="{ 'pointer-events-none opacity-50': currentPage === totalPages }"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import MangaCard from '~/components/catalogue/MangaCard.vue'
import MangaListItem from '~/components/catalogue/MangaListItem.vue'

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
    return matchesCategory && matchesGenre
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
}

const toggleGenre = (genre) => {
  const index = selectedGenres.value.indexOf(genre)
  if (index === -1) {
    selectedGenres.value.push(genre)
  } else {
    selectedGenres.value.splice(index, 1)
  }
}
</script>