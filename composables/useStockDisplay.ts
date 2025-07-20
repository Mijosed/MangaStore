import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'

export const useStockDisplay = () => {
  const supabase = useSupabaseClient()
  const stockInfo = ref<Record<string, number>>({})
  const loading = ref(false)

  const fetchStockInfo = async (mangaIds: string[]) => {
    if (mangaIds.length === 0) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('mangas')
        .select('id, stock')
        .in('id', mangaIds)

      if (error) {
        console.error('Erreur lors de la récupération du stock:', error)
        return
      }

      const stockMap: Record<string, number> = {}
      data?.forEach((manga: any) => {
        stockMap[manga.id] = manga.stock
      })
      stockInfo.value = { ...stockInfo.value, ...stockMap }
    } catch (error) {
      console.error('Erreur lors de la récupération du stock:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchSingleStock = async (mangaId: string) => {
    try {
      const { data, error } = await supabase
        .from('mangas')
        .select('stock')
        .eq('id', mangaId)
        .single()

      if (error) {
        console.error('Erreur lors de la récupération du stock:', error)
        return null
      }

      const stock = (data as any)?.stock || 0
      stockInfo.value[mangaId] = stock
      return stock
    } catch (error) {
      console.error('Erreur lors de la récupération du stock:', error)
      return null
    }
  }

  const getStock = (mangaId: string) => {
    return stockInfo.value[mangaId] ?? null
  }

  const isInStock = (mangaId: string, quantity: number = 1) => {
    const stock = getStock(mangaId)
    return stock !== null && stock >= quantity
  }

  const getStockMessage = (mangaId: string, quantity: number = 1) => {
    const stock = getStock(mangaId)
    
    if (stock === null) return 'Vérification du stock...'
    if (stock === 0) return 'Rupture de stock'
    if (stock < quantity) return `Stock insuffisant (${stock} disponible${stock > 1 ? 's' : ''})`
    if (stock <= 5) return `Stock limité (${stock} restant${stock > 1 ? 's' : ''})`
    return `En stock (${stock} disponible${stock > 1 ? 's' : ''})`
  }

  const getStockClass = (mangaId: string, quantity: number = 1) => {
    const stock = getStock(mangaId)
    
    if (stock === null) return 'text-gray-500'
    if (stock === 0) return 'text-red-600'
    if (stock < quantity) return 'text-orange-600'
    if (stock <= 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  return {
    stockInfo: readonly(stockInfo),
    loading: readonly(loading),
    fetchStockInfo,
    fetchSingleStock,
    getStock,
    isInStock,
    getStockMessage,
    getStockClass
  }
}
