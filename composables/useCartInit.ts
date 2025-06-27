export const useCartInit = () => {
  const cartStore = useCartStore()
  
  onMounted(() => {
    cartStore.loadFromLocalStorage()
  })
  
  return {
    cartStore
  }
} 