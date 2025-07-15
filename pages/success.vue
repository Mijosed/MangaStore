<script setup>
const cartStore = useCartStore();

onMounted(() => {
  cartStore.clearCart();
});

useHead({
  title: 'Commande confirmée - MangaStore'
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
      <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="lucide:check" class="w-10 h-10 text-white" />
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mb-3">
        🎉 Commande confirmée !
      </h1>
      
      <p class="text-gray-600 mb-6">
        Merci pour votre commande ! Nous préparons déjà votre envoi.
      </p>

      <div class="space-y-3">
        <NuxtLink 
          to="/account/orders"
          class="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Voir mes commandes
        </NuxtLink>
        
        <NuxtLink 
          to="/catalogue"
          class="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Continuer mes achats
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
