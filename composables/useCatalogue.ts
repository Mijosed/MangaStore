import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'


export interface Category {
  id: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export interface Manga {
  id: string
  title: string
  author: string
  price: number
  rating: number
  cover_url: string
  image_url?: string
  category: string
  genres: string[]
  slug: string
  stock: number
  average_rating: number
  description?: string
  publisher?: string
  release_date?: string
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
  }

  const fetchMangas = async (sortOption = 'popularity'): Promise<void> => {
    isLoading.value = true
    
    let query = supabase
      .from('mangas')
      .select(`
        *,
        category:categories!inner(
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
    
    mangas.value = data.map((manga: MangaResponse) => {
      const { manga_genres, ...rest } = manga
      return {
        ...rest,
        category: manga.category?.name || 'Non catégorisé',
        genres: manga.manga_genres.map((mg: { genre: { name: string } }) => mg.genre.name),
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
