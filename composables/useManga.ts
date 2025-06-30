import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

export const useManga = () => {
  const manga = ref(null)
  const loading = ref(true)
  const error = ref(null)
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

  const transformMangaData = (mangaData) => ({
    id: mangaData.id,
    title: mangaData.title,
    author: mangaData.author,
    cover: mangaData.cover_url || mangaData.image_url,
    price: mangaData.price,
    rating: mangaData.average_rating || 0,
    stock: mangaData.stock || 0,
    releaseDate: mangaData.release_date,
    publisher: mangaData.publisher,
    category: mangaData.category?.name || 'Non catégorisé',
    genres: (mangaData.manga_genres || [])
      .map(mg => mg.genre?.name)
      .filter(Boolean),
    description: mangaData.description || 'Aucune description disponible',
    specifications: {
      format: mangaData.format || 'Non spécifié',
      pages: mangaData.pages || 0,
      language: mangaData.language || 'Non spécifié',
      isbn: mangaData.isbn || 'Non spécifié'
    },
    reviews: (mangaData.reviews || []).map(review => ({
      id: review.id,
      author: 'Utilisateur #' + review.user_id.substring(0, 8),
      rating: review.rating || 0,
      comment: review.comment || '',
      date: review.created_at,
      avatar: '/default-avatar.png'
    }))
  })

  return {
    manga,
    loading,
    error,
    fetchManga
  }
}
