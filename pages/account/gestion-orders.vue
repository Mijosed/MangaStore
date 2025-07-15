<script setup>
import { useOrders } from '~/composables/useOrders'

definePageMeta({
  layout: 'account',
  middleware: ['auth', 'admin']
})

const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders()
const updatingOrderId = ref(null)

onMounted(async () => {
    await fetchOrders()
})

const validateOrder = async (orderId) => {
  try {
    updatingOrderId.value = orderId
    await updateOrderStatus(orderId, 'processing')
    

  } catch (err) {
    console.error('Erreur lors de la validation:', err)
  } finally {
    updatingOrderId.value = null
  }
}

const completeOrder = async (orderId) => {
  try {
    updatingOrderId.value = orderId
    
    await updateOrderStatus(orderId, 'completed')
    
  } catch (err) {
    console.error('Erreur lors de la finalisation:', err)
  } finally {
    updatingOrderId.value = null
  }
}

const cancelOrder = async (orderId) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    try {
      updatingOrderId.value = orderId

      await updateOrderStatus(orderId, 'cancelled')

    } catch (err) {
        console.error('Erreur lors de l\'annulation:', err)
    } finally {
      updatingOrderId.value = null
    }
  }
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Gestion des commandes</h1>
        
        <div v-if="loading" class="flex justify-center items-center h-64">
            <p class="text-gray-500">Chargement des commandes...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-12">
            <Icon name="lucide:alert-circle" class="mx-auto h-12 w-12 text-red-400" />
            <h3 class="mt-2 text-sm font-semibold text-gray-900">Erreur de chargement</h3>
            <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
            <div class="mt-6">
                <Button @click="fetchOrders()" variant="outline">
                    <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
                    Réessayer
                </Button>
            </div>
        </div>
        
        <div v-else-if="orders.length === 0" class="text-center py-12">
            <Icon name="lucide:package" class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-semibold text-gray-900">Aucune commande</h3>
            <p class="mt-1 text-sm text-gray-500">Aucune commande n'a été passée sur le site.</p>
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
                        <div class="flex flex-col items-end gap-1">
                            <span class="text-sm font-normal text-gray-500">
                                {{ new Date(order.created_at).toLocaleDateString('fr-FR') }}
                            </span>
                            <span class="text-xs text-gray-400">
                                Utilisateur: {{ order.user_id }}
                            </span>
                        </div>
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
                
                <div class="p-4 border-t bg-gray-50 dark:bg-gray-900">
                  <div v-if="order.status === 'pending'" class="flex gap-2">
                    <Button 
                      @click="validateOrder(order.id)" 
                      :disabled="updatingOrderId === order.id"
                      class="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Icon 
                        :name="updatingOrderId === order.id ? 'lucide:loader-2' : 'lucide:check'" 
                        :class="['w-4 h-4 mr-2', { 'animate-spin': updatingOrderId === order.id }]" 
                      />
                      {{ updatingOrderId === order.id ? 'Validation...' : 'Valider la commande' }}
                    </Button>
                    <Button 
                      @click="cancelOrder(order.id)" 
                      :disabled="updatingOrderId === order.id"
                      variant="outline"
                      class="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Icon name="lucide:x" class="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                  
                  <div v-else-if="order.status === 'processing'" class="flex gap-2">
                    <Button 
                      @click="completeOrder(order.id)" 
                      :disabled="updatingOrderId === order.id"
                      class="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Icon 
                        :name="updatingOrderId === order.id ? 'lucide:loader-2' : 'lucide:package-check'" 
                        :class="['w-4 h-4 mr-2', { 'animate-spin': updatingOrderId === order.id }]" 
                      />
                      {{ updatingOrderId === order.id ? 'Finalisation...' : 'Marquer comme terminée' }}
                    </Button>
                    <Button 
                      @click="cancelOrder(order.id)" 
                      :disabled="updatingOrderId === order.id"
                      variant="outline"
                      class="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Icon name="lucide:x" class="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                  
                  <div v-else-if="order.status === 'completed'" class="text-center">
                    <div class="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                      <Icon name="lucide:check-circle" class="w-4 h-4" />
                      <span class="text-sm font-medium">Commande terminée</span>
                    </div>
                  </div>
                  
                  <div v-else-if="order.status === 'cancelled'" class="text-center">
                    <div class="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
                      <Icon name="lucide:x-circle" class="w-4 h-4" />
                      <span class="text-sm font-medium">Commande annulée</span>
                    </div>
                  </div>
                </div>
            </Card>
        </div>
    </div>
</template>