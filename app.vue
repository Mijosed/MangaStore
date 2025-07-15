<script setup>
import { Toaster } from '@/components/ui/sonner'
useCartInit()

// Gestionnaire d'erreur pour les tokens Supabase invalides
onMounted(() => {
  const supabase = useSupabaseClient();
  
  // Écouter les changements d'état d'authentification
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED' && !session) {
      console.warn('Token refresh failed - clearing invalid session');
      // Nettoyer silencieusement les tokens invalides
      if (process.client) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
    }
  });
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-right" />
  </div>
</template>

