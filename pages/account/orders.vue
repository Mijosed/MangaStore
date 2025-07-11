<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Mes commandes hello</h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <p class="text-gray-500">Chargement des commandes...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <Icon name="lucide:alert-circle" class="mx-auto h-12 w-12 text-red-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Erreur de chargement</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <Button @click="fetchUserOrders()" variant="outline">
          <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-12">
      <Icon name="lucide:package" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Aucune commande</h3>
      <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore passé de commande.</p>
      <div class="mt-6">
        <NuxtLink to="/catalogue">
          <Button>
            <Icon name="lucide:shopping-bag" class="w-4 h-4 mr-2" />
            Parcourir le catalogue
          </Button>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="space-y-6">
      <Card v-for="order in orders" :key="order.id" class="overflow-hidden">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span>Commande #{{ order.id }}</span>
              <span 
                :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'processing',
                  'bg-green-100 text-green-800': order.status === 'completed',
                  'bg-red-100 text-red-800': order.status === 'cancelled'
                }"
                class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              >
                {{ 
                  order.status === 'pending' ? 'En attente' :
                  order.status === 'processing' ? 'En cours' :
                  order.status === 'completed' ? 'Terminée' :
                  order.status === 'cancelled' ? 'Annulée' : order.status
                }}
              </span>
            </div>
            <span class="text-sm font-normal text-gray-500">
              {{ new Date(order.created_at).toLocaleDateString('fr-FR') }}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img :src="item.manga.cover_url" :alt="item.manga.title" class="h-16 w-12 object-cover rounded-sm" />
                <div>
                  <p class="font-medium">{{ item.manga.title }}</p>
                  <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                </div>
              </div>
              <p class="font-medium">{{ (item.price * item.quantity).toFixed(2) }}€</p>
            </div>
          </div>
        </CardContent>
        <CardFooter class="bg-gray-50 dark:bg-gray-900">
          <div class="flex justify-between w-full">
            <span class="font-medium">Total</span>
            <span class="font-medium">{{ order.total.toFixed(2) }}€</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from '~/composables/useOrders'

definePageMeta({
  layout: 'account',
  middleware: 'auth'
})

const { orders, loading, error, fetchUserOrders } = useOrders()

// Charger les commandes de l'utilisateur connecté
onMounted(async () => {
  await fetchUserOrders()
})
</script>
