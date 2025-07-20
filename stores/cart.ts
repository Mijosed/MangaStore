import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSupabaseClient } from '#imports'

export interface CartItem {
  id: string
  title: string
  author: string
  price: number
  cover: string
  slug: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  
  const totalItems = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  )

  const formattedTotalPrice = computed(() =>
    totalPrice.value.toFixed(2)
  )

  const isEmpty = computed(() => items.value.length === 0)

  async function addItem(manga: Omit<CartItem, 'quantity'>) {
    try {
      const supabase = useSupabaseClient()
      const { data: mangaData, error } = await supabase
        .from('mangas')
        .select('stock')
        .eq('id', manga.id)
        .single()

      if (error || !mangaData) {
        console.error('Erreur lors de la vérification du stock:', error)
        throw new Error('Impossible de vérifier le stock disponible')
      }

      const existingItem = items.value.find(item => item.id === manga.id)
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0
      
      if (currentQuantityInCart >= (mangaData as any).stock) {
        throw new Error(`Stock insuffisant. Seulement ${(mangaData as any).stock} exemplaire(s) disponible(s)`)
      }

      if (existingItem) {
        existingItem.quantity++
      } else {
        items.value.push({ ...manga, quantity: 1 })
      }

      saveToLocalStorage()
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
      throw error
    }
  }

  function removeItem(itemId: string) {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function updateQuantity(itemId: string, quantity: number) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }

  function incrementQuantity(itemId: string) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.quantity++
      saveToLocalStorage()
    }
  }

  function decrementQuantity(itemId: string) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
        saveToLocalStorage()
      } else {
        removeItem(itemId)
      }
    }
  }

  function clearCart() {
    items.value = []
    saveToLocalStorage()
  }
  
  function clearCartAndStorage() {
    items.value = []
    isOpen.value = false
    if (process.client) {
      localStorage.removeItem('mangastore-cart')
    }
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  function openCart() {
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
  }

  
  function saveToLocalStorage() {
    if (process.client) {
      localStorage.setItem('mangastore-cart', JSON.stringify({
        items: items.value,
        isOpen: isOpen.value
      }))
    }
  }

  function loadFromLocalStorage() {
    if (process.client) {
      const saved = localStorage.getItem('mangastore-cart')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          items.value = data.items || []
          isOpen.value = data.isOpen || false
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error)
        }
      }
    }
  }

  
  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    clearCartAndStorage,
    toggleCart,
    openCart,
    closeCart,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
