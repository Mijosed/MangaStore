<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Votre panier</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-12">
      <Icon name="lucide:shopping-cart" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p class="text-lg text-gray-600 mb-4">Votre panier est vide.</p>
      <NuxtLink to="/catalogue" class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
        Continuer mes achats
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <!-- Liste des articles -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div v-for="item in cartStore.items" :key="item.id" class="flex items-center p-4 border-b last:border-b-0">
          <img :src="item.cover" :alt="item.title" class="w-16 h-20 object-cover rounded-md mr-4" />
          
          <div class="flex-1">
            <h3 class="font-semibold text-lg">{{ item.title }}</h3>
            <p class="text-gray-600">{{ item.author }}</p>
            <p class="text-red-600 font-bold">{{ item.price }}€</p>
          </div>

          <div class="flex items-center gap-2 mr-4">
            <Button 
              size="sm" 
              variant="outline" 
              @click="cartStore.decrementQuantity(item.id)"
              class="w-8 h-8 p-0"
            >
              <Icon name="lucide:minus" class="w-4 h-4" />
            </Button>
            
            <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
            
            <Button 
              size="sm" 
              variant="outline" 
              @click="cartStore.incrementQuantity(item.id)"
              class="w-8 h-8 p-0"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
            </Button>
          </div>

          <div class="text-right">
            <p class="font-bold text-lg">{{ (item.price * item.quantity).toFixed(2) }}€</p>
            <Button 
              size="sm" 
              variant="ghost" 
              @click="cartStore.removeItem(item.id)"
              class="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Résumé de la commande -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold mb-4">Résumé de la commande</h2>
        
        <div class="space-y-2 mb-4">
          <div class="flex justify-between">
            <span>Sous-total ({{ cartStore.totalItems }} article{{ cartStore.totalItems > 1 ? 's' : '' }})</span>
            <span>{{ cartStore.formattedTotalPrice }}€</span>
          </div>
          <div class="flex justify-between">
            <span>Frais de livraison</span>
            <span>Gratuit</span>
          </div>
          <div class="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{{ cartStore.formattedTotalPrice }}€</span>
          </div>
        </div>

        <div class="flex gap-4">
          <Button 
            @click="cartStore.clearCart()"
            variant="outline"
            class="flex-1"
          >
            <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
            Vider le panier
          </Button>
          
          <NuxtLink to="/checkout" class="flex-1">
            <Button class="w-full bg-red-600 hover:bg-red-700">
              <Icon name="lucide:credit-card" class="w-4 h-4 mr-2" />
              Passer au paiement
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

useHead({
  title: 'Panier - MangaStore'
})
</script>
