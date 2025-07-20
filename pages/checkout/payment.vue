<script setup>
import { useCartStore } from "~/stores/cart";
import { useStockValidation } from "~/composables/useStockValidation";

definePageMeta({
  middleware: ['auth']
});

const cartStore = useCartStore();
const { validateCartStock, updateStockAfterOrder, restoreStockAfterError } = useStockValidation();
const { clearFormData } = useCheckoutForm();
const {
  stripe,
  stripeLoaded,
  stripeRetrying,
  cardElementWrapper,
  loadStripeElements,
  createPaymentIntent,
  confirmCardPayment,
  setupCardElementWatcher
} = useStripePayment();

const shippingData = ref(null);
const isProcessing = ref(false);
const isRedirecting = ref(false);

onMounted(() => {
  if (process.client) {
    const stored = sessionStorage.getItem('checkout-shipping');
    if (!stored) {
      console.log('⚠️ Pas de données de livraison trouvées, redirection...');
      navigateTo('/checkout');
      return;
    }
    try {
      shippingData.value = JSON.parse(stored);
      console.log('✅ Données de livraison chargées:', shippingData.value);
    } catch (error) {
      console.error('❌ Erreur parsing des données de livraison:', error);
      navigateTo('/checkout');
    }
  }
});

useHead({
  title: "Paiement - MangaStore",
});

const createOrder = async (paymentIntentId) => {
  try {
    const supabase = useSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Utilisateur non connecté");
    }

    const totalWithTax = cartStore.totalPrice * 1.2;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total: totalWithTax,
        payment_intent_id: paymentIntentId,
        shipping_address: shippingData.value,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Erreur lors de la création de la commande:", orderError);
      throw new Error("Erreur lors de la création de la commande");
    }

    const orderItems = cartStore.items.map((item) => ({
      order_id: order.id,
      manga_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Erreur lors de la création des articles:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error("Erreur lors de la création des articles de la commande");
    }

    return order;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
};


onMounted(async () => {
  if (cartStore.isEmpty) {
    navigateTo('/cart');
    return;
  }

  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 500));
  await loadStripeElements();
  setupCardElementWatcher();
});

const handleSubmit = async () => {
  if (!stripe.value) {
    alert("Erreur: Système de paiement non disponible");
    return;
  }

  isProcessing.value = true;

  try {
    const stockValidation = await validateCartStock(cartStore.items);
    if (!stockValidation.isValid) {
      alert("Erreurs de stock:\n" + stockValidation.errors.join("\n"));
      isProcessing.value = false;
      return;
    }

    const paymentIntentResponse = await createPaymentIntent(
      cartStore.totalPrice * 1.2,
      'eur',
      {
        customer_email: shippingData.value.email,
        customer_name: `${shippingData.value.firstName} ${shippingData.value.lastName}`,
        items_count: cartStore.totalItems.toString(),
        items: JSON.stringify(
          cartStore.items.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      }
    );

    const paymentIntent = await confirmCardPayment(
      paymentIntentResponse.clientSecret,
      {
        name: `${shippingData.value.firstName} ${shippingData.value.lastName}`,
        email: shippingData.value.email,
        address: {
          line1: shippingData.value.address,
          postal_code: shippingData.value.postalCode,
          city: shippingData.value.city,
          country: shippingData.value.country,
        },
      }
    );

    if (paymentIntent.status === "succeeded") {
      console.log("✅ Paiement réussi");

      await updateStockAfterOrder(cartStore.items);
      console.log("✅ Stock mis à jour");

      await createOrder(paymentIntent.id);
      console.log("✅ Commande créée");

      cartStore.clearCart();
      clearFormData();
      
      isRedirecting.value = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (process.client) {
        window.location.href = '/checkout/success';
      } else {
        await navigateTo('/checkout/success', { replace: true });
      }
    }
  } catch (error) {
    console.error("❌ Erreur paiement:", error);
    const errorElement = document.getElementById("card-errors");
    if (errorElement) {
      errorElement.textContent = error instanceof Error ? error.message : "Erreur lors du paiement";
    }
    await restoreStockAfterError(cartStore.items);
  } finally {
    isProcessing.value = false;
  }
};

const goBack = () => {
  navigateTo('/checkout');
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 lg:p-6">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 class="font-bold text-blue-900">🔍 Page de Paiement - Debug Info</h3>
      <p class="text-blue-800 text-sm">
        Route actuelle: {{ $route.path }} | Données shipping: {{ shippingData ? '✅ Présentes' : '❌ Manquantes' }}
      </p>
    </div>

    <div v-if="isRedirecting" class="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Icon name="lucide:check" class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Paiement réussi !</h2>
        <p class="text-gray-600 mb-4">Finalisation de votre commande...</p>
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      </div>
    </div>

    <CheckoutSteps :current-step="2" />

    <h1 class="text-3xl font-bold mb-8 text-center">Paiement sécurisé</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <Icon name="lucide:credit-card" class="w-5 h-5 mr-3 text-red-600" />
                Carte bancaire
              </h2>
            </div>
            
            <div class="p-6 space-y-6">
              <div class="space-y-3">
                <Label class="text-sm font-medium text-gray-700">Informations de carte *</Label>
                <div 
                  id="card-element" 
                  ref="cardElementWrapper" 
                  class="p-4 border border-gray-300 rounded-lg bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all"
                ></div>
                <div id="card-errors" class="text-red-600 text-sm" role="alert"></div>
              </div>


              <div v-if="!stripeLoaded" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3"></div>
                <p class="text-sm text-gray-600 mb-2">
                  {{ stripeRetrying ? 'Connexion en cours...' : 'Chargement du système de paiement...' }}
                </p>
                <div id="stripe-load-error" class="text-red-600 text-sm"></div>
              </div>

              <div class="flex gap-4">
                <Button 
                  type="button"
                  @click="goBack"
                  variant="outline" 
                  class="flex-1 h-12"
                  :disabled="isProcessing"
                >
                  <Icon name="lucide:arrow-left" class="w-5 h-5 mr-2" />
                  Retour
                </Button>
                
                <Button 
                  type="submit" 
                  :disabled="isProcessing || !stripeLoaded"
                  class="flex-1 h-12 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  <div v-if="isProcessing" class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Traitement...
                  </div>
                  <div v-else-if="!stripeLoaded" class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Chargement...
                  </div>
                  <div v-else class="flex items-center justify-center">
                    <Icon name="lucide:lock" class="w-5 h-5 mr-3" />
                    Payer {{ (cartStore.totalPrice * 1.2).toFixed(2) }}€
                  </div>
                </Button>
              </div>
              
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start">
                  <Icon name="lucide:shield-check" class="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 class="font-medium text-sm text-green-900 mb-1">Paiement 100% sécurisé</h3>
                    <p class="text-xs text-green-700">
                      Vos données bancaires sont protégées par un chiffrement SSL 256-bit et traitées par Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Résumé</h2>
          </div>

          <div class="p-6 space-y-6">
            <div v-if="shippingData">
              <h3 class="font-medium text-gray-900 mb-3">Livraison</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <p class="font-medium">{{ shippingData.firstName }} {{ shippingData.lastName }}</p>
                <p>{{ shippingData.address }}</p>
                <p>{{ shippingData.postalCode }} {{ shippingData.city }}</p>
                <p>{{ shippingData.email }}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 class="font-medium text-gray-900 mb-3">Articles ({{ cartStore.totalItems }})</h3>
              <div class="space-y-3">
                <div
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="flex items-center gap-3"
                >
                  <img
                    :src="item.cover"
                    :alt="item.title"
                    class="w-12 h-16 object-cover rounded"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-gray-900 line-clamp-2">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">Qté: {{ item.quantity }}</p>
                  </div>
                  <p class="font-semibold text-sm">{{ (item.price * item.quantity).toFixed(2) }}€</p>
                </div>
              </div>
            </div>

            <Separator />

            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Sous-total</span>
                <span class="font-medium">{{ cartStore.formattedTotalPrice }}€</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Livraison</span>
                <span class="font-medium text-green-600">Gratuit</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">TVA</span>
                <span class="font-medium">{{ (cartStore.totalPrice * 0.2).toFixed(2) }}€</span>
              </div>
              
              <Separator />
              
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-red-600">{{ (cartStore.totalPrice * 1.2).toFixed(2) }}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
