import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Manga } from '~/types/manga'

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

  const initializeWithCategory = (category: string): void => {
    if (category && !selectedCategories.value.includes(category)) {
      selectedCategories.value.push(category)
    }
  }

  const filteredMangas = computed(() => {
    let result = mangas.value.filter(manga => {
      const matchesCategory = selectedCategories.value.length === 0 || 
                            selectedCategories.value.includes(manga.category.name)

      const matchesGenre = selectedGenres.value.length === 0 || 
                          selectedGenres.value.some(selectedGenre => {
                            return manga.manga_genres.some(mg => mg.genre.name === selectedGenre)
                          })

      const searchLower = searchQuery.value.toLowerCase()
      const matchesSearch = searchQuery.value === '' ||
                          manga.title.toLowerCase().includes(searchLower) ||
                          (manga.author?.toLowerCase().includes(searchLower) ?? false)

      return matchesCategory && matchesGenre && matchesSearch
    })

    result = [...result].sort((a, b) => {
      switch (sortOption.value) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'popularity':
          return (b.average_rating || 0) - (a.average_rating || 0)
        default:
          return 0
      }
    })

    return result
  })

  const setSortOption = (option: SortOption): void => {
    sortOption.value = option
  }

  return {
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
  }
}
