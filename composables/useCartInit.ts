export const useCartInit = () => {
  const cartStore = useCartStore()
  const user = useSupabaseUser()
  
  onMounted(() => {
    cartStore.loadFromLocalStorage()
    
    
    if (!user.value && !cartStore.isEmpty) {
      cartStore.clearCartAndStorage()
    }
  })
  
  return {
    cartStore
  }
} 