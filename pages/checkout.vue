<script setup>
import { useCartStore } from '~/stores/cart'
import { loadStripe } from '@stripe/stripe-js'

const cartStore = useCartStore()
const config = useRuntimeConfig()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  postalCode: '',
  city: '',
  country: 'FR',
  phone: ''
})

const stripeLoaded = ref(false)
const stripe = ref(null)
const elements = ref(null)
const cardElement = ref(null)
const isProcessing = ref(false)

// Fonction pour créer la commande dans Supabase
const createOrder = async (paymentIntentId) => {
  try {
    const supabase = useSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const totalWithTax = cartStore.totalPrice * 1.2 // Prix avec TVA

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total: totalWithTax,
        payment_intent_id: paymentIntentId,
        shipping_address: {
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email,
          address: form.value.address,
          postalCode: form.value.postalCode,
          city: form.value.city,
          country: form.value.country,
          phone: form.value.phone
        }
      })
      .select()
      .single()
      
    if (orderError) {
      console.error('Erreur lors de la création de la commande:', orderError)
      throw new Error('Erreur lors de la création de la commande')
    }

    // Créer les articles de la commande
    const orderItems = cartStore.items.map(item => ({
      order_id: order.id,
      manga_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Erreur lors de la création des articles:', itemsError)
      // Supprimer la commande si les articles n'ont pas pu être créés
      await supabase.from('orders').delete().eq('id', order.id)
      throw new Error('Erreur lors de la création des articles de la commande')
    }

    return order

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    throw error
  }
}

useHead({
  title: 'Finaliser la commande - MangaStore'
})

onMounted(async () => {
  try {
    stripe.value = await loadStripe(config.public.stripe.publishableKey)
    
    if (stripe.value) {
      elements.value = stripe.value.elements()
      cardElement.value = elements.value.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      })
      
      await nextTick()
      
      cardElement.value.mount('#card-element')
      stripeLoaded.value = true
    }
  } catch (error) {
    console.error('Erreur lors du chargement de Stripe:', error)
  }
})

const handleSubmit = async () => {
  if (!stripe.value || !cardElement.value) {
    alert('Erreur: Système de paiement non disponible')
    return
  }

  isProcessing.value = true

  try {

    const paymentIntentResponse = await $fetch('/api/create-payment-intent', {
      method: 'POST',
      body: {
        amount: cartStore.totalPrice * 1.2, // Avec TVA
        currency: 'eur',
        metadata: {
          customer_email: form.value.email,
          customer_name: `${form.value.firstName} ${form.value.lastName}`,
          items_count: cartStore.totalItems.toString(),
          items: JSON.stringify(cartStore.items.map(item => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price
          })))
        }
      }
    })


    if (!paymentIntentResponse || !paymentIntentResponse.clientSecret) {
      throw new Error('Réponse invalide de l\'API de création de paiement')
    }

    const { error, paymentIntent } = await stripe.value.confirmCardPayment(
      paymentIntentResponse.clientSecret,
      {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: `${form.value.firstName} ${form.value.lastName}`,
            email: form.value.email,
            address: {
              line1: form.value.address,
              postal_code: form.value.postalCode,
              city: form.value.city,
              country: form.value.country,
            },
          },
        }
      }
    )

    if (error) {
      const errorElement = document.getElementById('card-errors')
      errorElement.textContent = error.message
      isProcessing.value = false
      return
    }


    if (paymentIntent.status === 'succeeded') {
      // Insérer la commande dans Supabase
      await createOrder(paymentIntent.id)
      
      cartStore.clearCart()
      await navigateTo('/checkout/success')
    } else {
      throw new Error(`Statut de paiement inattendu: ${paymentIntent.status}`)
    }
    
  } catch (error) {
    const errorElement = document.getElementById('card-errors')
    errorElement.textContent = error.message || 'Une erreur est survenue lors du paiement. Veuillez réessayer.'
  } finally {
    isProcessing.value = false
  }
}

watch(() => cartStore.isEmpty, (isEmpty) => {
  if (isEmpty) {
    navigateTo('/cart')
  }
}, { immediate: true })
</script>
<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Finaliser votre commande</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-12">
      <Icon name="lucide:shopping-cart" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p class="text-lg text-gray-600 mb-4">Votre panier est vide.</p>
      <NuxtLink to="/catalogue" class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
        Continuer mes achats
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold mb-4">Informations de livraison</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="firstName">Prénom *</Label>
                <Input 
                  id="firstName" 
                  v-model="form.firstName" 
                  required 
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <Label for="lastName">Nom *</Label>
                <Input 
                  id="lastName" 
                  v-model="form.lastName" 
                  required 
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <Label for="email">Email *</Label>
              <Input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <Label for="address">Adresse *</Label>
              <Input 
                id="address" 
                v-model="form.address" 
                required 
                placeholder="123 Rue de la Paix"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label for="postalCode">Code postal *</Label>
                <Input 
                  id="postalCode" 
                  v-model="form.postalCode" 
                  required 
                  placeholder="75001"
                />
              </div>
              <div>
                <Label for="city">Ville *</Label>
                <Input 
                  id="city" 
                  v-model="form.city" 
                  required 
                  placeholder="Paris"
                />
              </div>
              <div>
                <Label for="country">Pays *</Label>
                <Select v-model="form.country" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="BE">Belgique</SelectItem>
                    <SelectItem value="CH">Suisse</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label for="phone">Téléphone</Label>
              <Input 
                id="phone" 
                v-model="form.phone" 
                type="tel" 
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold mb-4">Informations de paiement</h2>
          
          <!-- Élément Stripe - toujours rendu -->
          <div id="card-element" class="p-4 border border-gray-300 rounded-md mb-4"></div>
          <div id="card-errors" class="text-red-600 text-sm mb-4" role="alert"></div>
          
          <div v-if="!stripeLoaded" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
            <p class="text-sm text-gray-600">Chargement du système de paiement...</p>
          </div>
          
          <Button 
            type="submit" 
            @click="handleSubmit"
            :disabled="isProcessing || !stripeLoaded"
            class="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <div v-if="isProcessing" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Traitement en cours...
            </div>
            <div v-else-if="!stripeLoaded" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Chargement...
            </div>
            <div v-else class="flex items-center">
              <Icon name="lucide:credit-card" class="w-4 h-4 mr-2" />
              Payer {{ (cartStore.totalPrice * 1.2).toFixed(2) }}€
            </div>
          </Button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold mb-4">Résumé de la commande</h2>
          
          <div class="space-y-3 mb-4">
            <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-3">
              <img :src="item.cover" :alt="item.title" class="w-12 h-16 object-cover rounded" />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-sm truncate">{{ item.title }}</h4>
                <p class="text-gray-600 text-xs">{{ item.author }}</p>
                <p class="text-gray-500 text-xs">Quantité: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold text-sm">{{ (item.price * item.quantity).toFixed(2) }}€</p>
            </div>
          </div>

          <Separator class="my-4" />

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{{ cartStore.formattedTotalPrice }}€</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Frais de livraison</span>
              <span>Gratuit</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>TVA (20%)</span>
              <span>{{ (cartStore.totalPrice * 0.2).toFixed(2) }}€</span>
            </div>
            <Separator class="my-2" />
            <div class="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{{ (cartStore.totalPrice * 1.2).toFixed(2) }}€</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <Icon name="lucide:shield-check" class="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 class="font-medium text-sm mb-1">Paiement sécurisé</h3>
              <p class="text-xs text-gray-600">
                Vos informations de paiement sont protégées par un chiffrement SSL de niveau bancaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

