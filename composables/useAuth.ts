
import { useCartStore } from '~/stores/cart'

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const signOut = async () => {
    const { clearCartAndStorage } = useCartStore();
    clearCartAndStorage();
    
    await supabase.auth.signOut();
  };

  const clearAuth = async () => {
    try {
      const { clearCartAndStorage } = useCartStore();
      clearCartAndStorage();
      
      await supabase.auth.signOut();
      
      if (process.client) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      
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
  