<template>
  <div class="min-h-screen bg-red-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-red-600 mb-8">🔥 PAGE DE PAIEMENT - TEST</h1>
      
      <div class="bg-white rounded-lg p-6 shadow-lg">
        <p class="text-xl mb-4">✅ Vous êtes bien sur la page de paiement !</p>
        <p class="text-lg mb-4">Route: {{ $route.path }}</p>
        <p class="text-lg mb-4">URL complète: {{ $route.fullPath }}</p>
        
        <div class="space-y-4">
          <Button @click="goBack" class="mr-4">← Retour</Button>
          <Button @click="goToSuccess" class="bg-green-600 hover:bg-green-700">Aller au succès →</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const goBack = () => {
  navigateTo('/checkout');
};

const goToSuccess = () => {
  navigateTo('/checkout/success');
};
</script>
