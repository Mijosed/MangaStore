import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

interface CartItem {
  user_id: string
  manga_id: string
  quantity: number
}

export const useCart = () => {
  const quantity = ref(1)
  const supabase = useSupabaseClient()

  const incrementQuantity = (currentStock: number) => {
    if (quantity.value < currentStock) {
      quantity.value++
    }
  }

  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--
    }
  }

  const addToCart = async (mangaId: string, currentQuantity: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { success: false, error: 'not_authenticated' }
      }

      const { error: cartError } = await supabase
        .from('cart_items')
        .upsert({
          user_id: session.user.id,
          manga_id: mangaId,
          quantity: currentQuantity
        })

      if (cartError) throw cartError

      return { success: true }
    } catch (err) {
      console.error('Error adding to cart:', err)
      return { success: false, error: 'database_error' }
    }
  }

  return {
    quantity,
    incrementQuantity,
    decrementQuantity,
    addToCart
  }
}
