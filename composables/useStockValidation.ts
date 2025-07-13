import { useSupabaseClient } from '#imports'
import type { CartItem } from '~/stores/cart'

export const useStockValidation = () => {
  const supabase = useSupabaseClient()

  /**
   * Valide que tous les articles du panier ont un stock suffisant
   */
  const validateCartStock = async (cartItems: CartItem[]) => {
    const stockErrors: string[] = []

    for (const item of cartItems) {
      const { data: manga, error } = await supabase
        .from('mangas')
        .select('stock, title')
        .eq('id', item.id)
        .single()

      if (error || !manga) {
        stockErrors.push(`Impossible de vérifier le stock pour "${item.title}"`)
        continue
      }

      if ((manga as any).stock < item.quantity) {
        stockErrors.push(
          `Stock insuffisant pour "${(manga as any).title}". ` +
          `Demandé: ${item.quantity}, Disponible: ${(manga as any).stock}`
        )
      }
    }

    return {
      isValid: stockErrors.length === 0,
      errors: stockErrors
    }
  }

  /**
   * Met à jour le stock après une commande réussie
   */
  const updateStockAfterOrder = async (cartItems: CartItem[]) => {
    for (const item of cartItems) {
      try {
        // Récupérer le stock actuel
        const { data: manga, error: fetchError } = await supabase
          .from('mangas')
          .select('stock')
          .eq('id', item.id)
          .single()

        if (fetchError || !manga) {
          console.error(`Erreur lors de la récupération du stock pour ${item.title}:`, fetchError)
          continue
        }

        // Calculer le nouveau stock
        const newStock = Math.max(0, (manga as any).stock - item.quantity)

        // Mettre à jour le stock
        const { error: updateError } = await (supabase as any)
          .from('mangas')
          .update({ stock: newStock })
          .eq('id', item.id)
        
        if (updateError) {
          console.error(`Erreur lors de la mise à jour du stock pour ${item.title}:`, updateError)
          throw new Error(`Erreur lors de la mise à jour du stock pour ${item.title}`)
        }
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du stock pour ${item.title}:`, error)
        throw error
      }
    }

    return { success: true }
  }

  /**
   * Restaure le stock en cas d'erreur lors de la commande
   */
  const restoreStockAfterError = async (cartItems: CartItem[]) => {
    for (const item of cartItems) {
      try {
        // Récupérer le stock actuel
        const { data: manga, error: fetchError } = await supabase
          .from('mangas')
          .select('stock')
          .eq('id', item.id)
          .single()

        if (fetchError || !manga) {
          console.error(`Erreur lors de la récupération du stock pour ${item.title}:`, fetchError)
          continue
        }

        // Restaurer le stock
        const restoredStock = (manga as any).stock + item.quantity

        // Mettre à jour le stock
        await (supabase as any)
          .from('mangas')
          .update({ stock: restoredStock })
          .eq('id', item.id)
      } catch (error) {
        console.error(`Erreur lors de la restauration du stock pour ${item.title}:`, error)
      }
    }
  }

  return {
    validateCartStock,
    updateStockAfterOrder,
    restoreStockAfterError
  }
}
