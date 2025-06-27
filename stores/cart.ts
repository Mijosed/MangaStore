import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  title: string
  author: string
  price: number
  cover: string
  slug: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    
    formattedTotalPrice: (state) => {
      const total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      return total.toFixed(2)
    },

    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    addItem(manga: Omit<CartItem, 'quantity'>) {
      const existingItem = this.items.find(item => item.id === manga.id)
      
      if (existingItem) {
        existingItem.quantity++
        console.log('Quantité incrémentée pour:', manga.title, 'Nouvelle quantité:', existingItem.quantity)
      } else {
        this.items.push({ ...manga, quantity: 1 })
        console.log('Nouvel article ajouté:', manga.title)
      }
      
      console.log('Total d\'articles dans le panier:', this.totalItems)
      
      // Sauvegarder dans localStorage
      this.saveToLocalStorage()
    },

    removeItem(itemId: number) {
      const index = this.items.findIndex(item => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    updateQuantity(itemId: number, quantity: number) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else {
          item.quantity = quantity
          this.saveToLocalStorage()
        }
      }
    },

    incrementQuantity(itemId: number) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        item.quantity++
        this.saveToLocalStorage()
      }
    },

    decrementQuantity(itemId: number) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
          this.saveToLocalStorage()
        } else {
          this.removeItem(itemId)
        }
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    },

    // Méthodes pour la persistance
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('mangastore-cart', JSON.stringify({
          items: this.items,
          isOpen: this.isOpen
        }))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const saved = localStorage.getItem('mangastore-cart')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            this.items = data.items || []
            this.isOpen = data.isOpen || false
          } catch (error) {
            console.error('Erreur lors du chargement du panier:', error)
          }
        }
      }
    }
  }
}) 