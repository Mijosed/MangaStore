
import { useCartStore } from '~/stores/cart'

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const signOut = async () => {
    // Vider le panier avant la déconnexion
    const { clearCartAndStorage } = useCartStore();
    clearCartAndStorage();
    
    await supabase.auth.signOut();
  };

  // Fonction pour nettoyer les tokens invalides
  const clearAuth = async () => {
    try {
      // Vider le panier avant le nettoyage
      const { clearCartAndStorage } = useCartStore();
      clearCartAndStorage();
      
      // Supprimer la session Supabase
      await supabase.auth.signOut();
      
      // Nettoyer le localStorage des clés Supabase
      if (process.client) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Rafraîchir la page pour réinitialiser l'état
      if (process.client) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage de l\'authentification:', error);
    }
  };

  return {
    user,
    signOut,
    clearAuth,
  };
};
  