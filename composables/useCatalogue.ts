import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Manga, Category, Genre } from '~/types/manga'

interface MangaResponse {
  id: string
  title: string
  description: string
  price: number
  stock: number
  cover_url: string
  image_url?: string
  category: {
    id: string
    name: string
  }
  manga_genres: Array<{
    genre: {
      id: string
      name: string
    }
  }>
  author?: string
  publisher?: string
  release_date?: string
  rating?: number
  average_rating?: number
  slug: string
  format?: string
  pages?: number
  language?: string
  isbn?: string
}

export const useCatalogue = () => {
  const supabase = useSupabaseClient()
  const isLoading = ref(true)
  const categories = ref<Category[]>([])
  const genres = ref<Genre[]>([])
  const mangas = ref<Manga[]>([])

  const fetchCategories = async (): Promise<void> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      return
    }
    
    categories.value = data
  }

  const fetchGenres = async () => {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Erreur lors du chargement des genres:', error)
      return
    }
    
    genres.value = data
  }

  interface MangaResponse {
    id: string
    title: string
    author: string
    price: number
    rating: number
    cover_url: string
    image_url?: string
    stock: number
    average_rating: number
    description?: string
    publisher?: string
    release_date?: string
    format?: string
    pages?: number
    language?: string
    isbn?: string
    slug: string
    categories: {
      id: string
      name: string
    }
    manga_genres: Array<{
      genre: {
        id: string
        name: string
      }
    }>
  }

  const fetchMangas = async (sortOption = 'popularity'): Promise<void> => {
    isLoading.value = true
    
    let query = supabase
      .from('mangas')
      .select(`
        *,
        categories!inner(
          id,
          name
        ),
        manga_genres!inner(
          genre:genres!inner(
            id,
            name
          )
        )
      `) as any // Type assertion nécessaire à cause des limitations de Supabase
    
    // Tri
    switch (sortOption) {
      case 'price-asc':
        query = query.order('price', { ascending: true })
        break
      case 'price-desc':
        query = query.order('price', { ascending: false })
        break
      case 'title':
        query = query.order('title', { ascending: true })
        break
      default:
        query = query.order('rating', { ascending: false })
    }

    const { data, error } = await query
    
    if (error) {
      console.error('Erreur lors du chargement des mangas:', error)
      return
    }
    
    mangas.value = data.map((manga: any) => {
      const { categories, ...rest } = manga
      return {
        ...rest,
        category: {
          id: categories?.id || '0',
          name: categories?.name || 'Non catégorisé'
        },
        manga_genres: manga.manga_genres.map((mg: { genre: Genre }) => ({
          genre: mg.genre
        })),
        slug: manga.slug || `${manga.id}-${manga.title.toLowerCase().replace(/\s+/g, '-')}`
      } as Manga
    })
    
    isLoading.value = false
  }

  return {
    categories,
    genres,
    mangas,
    isLoading,
    fetchCategories,
    fetchGenres,
    fetchMangas
  }
}
