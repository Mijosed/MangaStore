export const useCartInit = () => {
  const cartStore = useCartStore()
  const user = useSupabaseUser()
  
  onMounted(() => {
    cartStore.loadFromLocalStorage()
    
    // Vider le panier si l'utilisateur n'est pas connecté
    // Cela gère le cas où l'utilisateur ferme l'onglet et revient plus tard déconnecté
    if (!user.value && !cartStore.isEmpty) {
      cartStore.clearCartAndStorage()
    }
  })
  
  return {
    cartStore
  }
} 