import { ref, readonly } from 'vue'
import type { Database } from '~/types/supabase'

export interface OrderItem {
  id: string
  quantity: number
  price: number
  manga: {
    id: string
    title: string
    cover_url: string
  }
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  address: string
  postalCode: string
  city: string
  country: string
  phone?: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total: number
  created_at: string
  payment_intent_id?: string
  shipping_address?: ShippingAddress
  items: OrderItem[]
}

export const useOrders = () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserOrders = async (userId?: string) => {
    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient<Database>()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Utiliser l'ID utilisateur fourni ou celui de l'utilisateur connecté
      const targetUserId = userId || user?.id
      
      if (!targetUserId) {
        throw new Error('Aucun utilisateur identifié')
      }

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          status,
          total,
          created_at,
          payment_intent_id,
          shipping_address,
          items:order_items (
            id,
            quantity,
            price,
            manga:manga_id (
              id,
              title,
              cover_url
            )
          )
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      orders.value = data || []
      return data
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err)
      error.value = "Erreur lors du chargement des commandes"
      return null
    } finally {
      loading.value = false
    }
  }

  const getOrderById = async (orderId: string) => {
    try {
      const supabase = useSupabaseClient<Database>()
      
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          status,
          total,
          created_at,
          payment_intent_id,
          shipping_address,
          items:order_items (
            id,
            quantity,
            price,
            manga:manga_id (
              id,
              title,
              cover_url
            )
          )
        `)
        .eq('id', orderId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      console.error('Erreur lors de la récupération de la commande:', err)
      error.value = "Erreur lors de la récupération de la commande"
      return null
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const supabase = useSupabaseClient<Database>()
      
      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()

      if (updateError) throw updateError

      // Mettre à jour la commande dans la liste locale
      const orderIndex = orders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex] = data
      }

      return data
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err)
      error.value = "Erreur lors de la mise à jour du statut"
      return null
    }
  }

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.value.filter(order => order.status === status)
  }

  const getTotalOrders = () => {
    return orders.value.length
  }

  const getTotalSpent = () => {
    return orders.value.reduce((total, order) => total + order.total, 0)
  }

  const getOrdersStats = () => {
    const stats = {
      total: orders.value.length,
      pending: orders.value.filter(o => o.status === 'pending').length,
      processing: orders.value.filter(o => o.status === 'processing').length,
      completed: orders.value.filter(o => o.status === 'completed').length,
      cancelled: orders.value.filter(o => o.status === 'cancelled').length,
      revenue: orders.value
        .filter(o => o.status === 'completed')
        .reduce((total, order) => total + order.total, 0)
    }
    return stats
  }

  const fetchOrders = async () => {
    try {
      const supabase = useSupabaseClient<Database>()
      
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          status,
          total,
          created_at,
          payment_intent_id,
          shipping_address,
          items:order_items (
            id,
            quantity,
            price,
            manga:manga_id (
              id,
              title,
              cover_url
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      orders.value = data || []
      return data
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err)
      error.value = "Erreur lors du chargement des commandes"
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    orders: readonly(orders),
    loading: readonly(loading),
    error: readonly(error),
    fetchUserOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByStatus,
    getTotalOrders,
    getTotalSpent,
    getOrdersStats,
    fetchOrders
  }
} 