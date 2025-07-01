<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Mes commandes</h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <p class="text-gray-500">Chargement des commandes...</p>
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
          <CardTitle class="flex justify-between">
            <span>Commande #{{ order.id }}</span>
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
definePageMeta({
  layout: 'account',
  middleware: 'auth'
})

const orders = ref([])
const loading = ref(true)

// Simuler le chargement des commandes
// À remplacer par un vrai appel API
onMounted(async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total,
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

    if (error) throw error
    orders.value = data || []
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    loading.value = false
  }
})
</script>
