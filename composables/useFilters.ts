import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface Manga {
  id: string
  title: string
  author: string
  category: string
  genres: string[]
  price: number
  rating: number
  stock: number
  slug: string
}

export type ViewMode = 'grid' | 'list'
export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'title'

export const useFilters = (mangas: Ref<Manga[]>) => {
  const viewMode = ref<ViewMode>('grid')
  const selectedCategories = ref<string[]>([])
  const selectedGenres = ref<string[]>([])
  const sortOption = ref<SortOption>('popularity')
  const searchQuery = ref('')

  const toggleCategory = (category: string): void => {
    const index = selectedCategories.value.indexOf(category)
    if (index === -1) {
      selectedCategories.value.push(category)
    } else {
      selectedCategories.value.splice(index, 1)
    }
  }

  const toggleGenre = (genre: string): void => {
    const index = selectedGenres.value.indexOf(genre)
    if (index === -1) {
      selectedGenres.value.push(genre)
    } else {
      selectedGenres.value.splice(index, 1)
    }
  }

  const filteredMangas = computed(() => {
    return mangas.value.filter(manga => {
      const matchesCategory = selectedCategories.value.length === 0 || 
                            selectedCategories.value.includes(manga.category)
      const matchesGenre = selectedGenres.value.length === 0 || 
                          manga.genres.some(genre => selectedGenres.value.includes(genre))
      const matchesSearch = searchQuery.value === '' ||
                          manga.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          manga.author.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchesCategory && matchesGenre && matchesSearch
    })
  })

  return {
    viewMode,
    selectedCategories,
    selectedGenres,
    sortOption,
    searchQuery,
    toggleCategory,
    toggleGenre,
    filteredMangas
  }
}
