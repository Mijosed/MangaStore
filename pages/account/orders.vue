<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-3xl font-bold mb-8">Mes commandes</h1>
    
    <!-- Liste des commandes -->
    <div v-if="orders.length > 0">
      <div class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-sm text-gray-500">Commande #{{ order.id }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold">{{ formatPrice(order.total) }} €</p>
              <p :class="[
                'text-sm font-medium capitalize px-2 py-1 rounded-full inline-block',
                {
                  'bg-green-100 text-green-800': order.status === 'completed',
                  'bg-blue-100 text-blue-800': order.status === 'processing',
                  'bg-yellow-100 text-yellow-800': order.status === 'pending'
                }
              ]">
                {{ formatStatus(order.status) }}
              </p>
            </div>
          </div>
          
          <div class="space-y-2">
            <div v-for="item in order.items" :key="item.id" class="flex gap-4 py-2 border-t">
              <img :src="item.manga.cover_url" :alt="item.manga.title" class="w-16 h-20 object-cover rounded">
              <div>
                <h3 class="font-medium">{{ item.manga.title }}</h3>
                <p class="text-sm text-gray-600">Quantité : {{ item.quantity }}</p>
                <p class="text-sm font-medium">{{ formatPrice(item.price) }} €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucune commande -->
    <div v-else class="text-center py-12">
      <Icon name="lucide:package" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">Aucune commande</h3>
      <p class="text-gray-500">Vous n'avez pas encore passé de commande.</p>
      <NuxtLink 
        to="/catalogue"
        class="mt-4 inline-block text-bleu hover:underline"
      >
        Parcourir le catalogue
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const orders = ref([])
const loading = ref(false)
const error = ref<string | null>(null)

// Format price
const formatPrice = (price: number) => {
  return price.toFixed(2)
}

// Format status
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'En attente',
    'processing': 'En cours',
    'completed': 'Terminée',
    'cancelled': 'Annulée'
  }
  return statusMap[status] || status
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Fetch orders
const fetchOrders = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: err } = await useSupabaseClient()
      .from('orders')
      .select(`
        *,
        items:order_items (
          id,
          quantity,
          price,
          manga:manga_id (
            id,
            title,
            cover_url
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (err) throw err

    orders.value = data || []
  } catch (err) {
    console.error('Error fetching orders:', err)
    error.value = "Erreur lors du chargement des commandes"
  } finally {
    loading.value = false
  }
}

// Auth middleware
definePageMeta({
  middleware: 'auth'
})

// Load orders on mount
onMounted(() => {
  fetchOrders()
})
</script>
