<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Votre panier</h1>

    <div v-if="cart.length === 0">
      <p>Votre panier est vide.</p>
    </div>

    <ul v-else class="space-y-4">
      <li v-for="item in cart" :key="item.id" class="border p-4 rounded">
        <div class="flex justify-between">
          <span>{{ item.title }}</span>
          <span>{{ item.price }} €</span>
        </div>
      </li>
    </ul>

    <div class="mt-6 text-right font-bold">
      Total : {{ total }} €
    </div>

    <div class="mt-4 text-right">
      <NuxtLink to="/checkout" class="bg-red-500 hover:bg-red-600 cursor-pointer text-white py-2 px-4 rounded">
        Passer au paiement
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// A remplacer par Pinia 
const cart = ref([
  { id: 1, title: 'One Piece T.1', price: 6.9 },
  { id: 2, title: 'Naruto T.3', price: 6.5 }
])

const total = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0).toFixed(2))
</script>
