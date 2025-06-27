<template>
  <div class="max-w-2xl mx-auto p-4 text-center">
    <div class="bg-white rounded-lg shadow-sm border p-8">
      <!-- Icône de succès -->
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="lucide:check" class="w-8 h-8 text-green-600" />
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
      
      <p class="text-lg text-gray-600 mb-6">
        Merci pour votre commande. Nous avons reçu votre paiement et nous préparons votre envoi.
      </p>

      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 class="font-semibold text-gray-900 mb-2">Prochaines étapes :</h2>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• Vous recevrez un email de confirmation dans les prochaines minutes</li>
          <li>• Votre commande sera expédiée sous 1-2 jours ouvrés</li>
          <li>• Vous recevrez un email avec le numéro de suivi</li>
        </ul>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink 
          to="/catalogue" 
          class="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Icon name="lucide:shopping-bag" class="w-4 h-4 mr-2" />
          Continuer mes achats
        </NuxtLink>
        
        <NuxtLink 
          to="/" 
          class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Icon name="lucide:home" class="w-4 h-4 mr-2" />
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Commande confirmée - MangaStore'
})
</script> 