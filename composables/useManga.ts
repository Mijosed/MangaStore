import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Manga } from '~/types/manga'

export const useManga = () => {
  const manga = ref<Manga | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const supabase = useSupabaseClient()

  const fetchManga = async (slug: string) => {
    try {
      loading.value = true
      error.value = null
      
      const { data: mangaData, error: mangaError } = await supabase
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
          ),
          reviews(
            id,
            rating,
            comment,
            created_at,
            user_id
          )
        `)
        .eq('slug', slug)
        .single()

      if (mangaError) throw mangaError

      if (!mangaData) {
        return null
      }

      manga.value = transformMangaData(mangaData)
      return manga.value
    } catch (err) {
      console.error('Error fetching manga:', err)
      error.value = 'Une erreur est survenue lors du chargement du manga'
      return null
    } finally {
      loading.value = false
    }
  }

  const transformMangaData = (mangaData: any): Manga => ({
    id: mangaData.id,
    title: mangaData.title,
    slug: mangaData.slug || `${mangaData.id}-${mangaData.title.toLowerCase().replace(/\s+/g, '-')}`,
    description: mangaData.description || 'Aucune description disponible',
    author: mangaData.author,
    cover_url: mangaData.cover_url || mangaData.image_url,
    image_url: mangaData.image_url,
    price: mangaData.price,
    rating: mangaData.average_rating || 0,
    stock: mangaData.stock || 0,
    release_date: mangaData.release_date,
    releaseDate: mangaData.release_date, // Alias pour compatibility
    publisher: mangaData.publisher || 'Éditeur non spécifié',
    average_rating: mangaData.average_rating || 0,
    created_at: mangaData.created_at,
    updated_at: mangaData.updated_at,
    category: {
      id: mangaData.category?.id || '0',
      name: mangaData.category?.name || 'Non catégorisé'
    },
    manga_genres: (mangaData.manga_genres || []).map((mg: any) => ({
      genre: {
        id: mg.genre?.id,
        name: mg.genre?.name
      }
    })),
    reviews: (mangaData.reviews || []).map((review: any) => ({
      id: review.id,
      user_id: review.user_id,
      rating: review.rating || 0,
      comment: review.comment || '',
      created_at: review.created_at,
      author: `Utilisateur ${review.user_id.substring(0, 8)}`, // Nom générique
      avatar: null, // Pas d'avatar pour l'instant
      date: review.created_at
    })),
    specifications: {
      format: mangaData.format || 'Format standard',
      pages: mangaData.pages || 200,
      language: mangaData.language || 'Français',
      isbn: mangaData.isbn || 'ISBN non disponible'
    }
  })

  return {
    manga,
    loading,
    error,
    fetchManga
  }
}
