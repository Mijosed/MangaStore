<script setup>
import { useCartStore } from "~/stores/cart";
import { useStockValidation } from "~/composables/useStockValidation";

definePageMeta({
  middleware: ['auth']
});

const cartStore = useCartStore();
const { validateCartStock, updateStockAfterOrder } = useStockValidation();

// État du formulaire
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  country: "FR",
  phone: "",
});

// États du paiement
const isSubmitting = ref(false);
const showPayment = ref(false);
const stripe = ref(null);
const stripeLoaded = ref(false);
const cardElement = ref(null);
const isRedirecting = ref(false);

useHead({
  title: "Commande - MangaStore",
});

// Redirection si panier vide
watch(() => cartStore.isEmpty, (isEmpty) => {
  if (isEmpty) {
    navigateTo('/cart');
  }
}, { immediate: true });

// Validation du formulaire
const validateForm = () => {
  const errors = [];
  if (!form.value.firstName.trim()) errors.push('Le prénom est requis');
  if (!form.value.lastName.trim()) errors.push('Le nom est requis');
  if (!form.value.email.trim()) errors.push('L\'email est requis');
  if (!form.value.address.trim()) errors.push('L\'adresse est requise');
  if (!form.value.postalCode.trim()) errors.push('Le code postal est requis');
  if (!form.value.city.trim()) errors.push('La ville est requise');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Chargement de Stripe
const loadStripe = async () => {
  if (process.client && !stripe.value) {
    try {
      const stripeKey = useRuntimeConfig().public.stripePublishableKey;
      console.log('🔑 Clé Stripe:', stripeKey ? 'Définie' : 'NON DÉFINIE');
      
      if (!stripeKey) {
        throw new Error("Clé Stripe non configurée");
      }

      const { loadStripe } = await import('@stripe/stripe-js');
      stripe.value = await loadStripe(stripeKey);
      
      if (stripe.value) {
        const elements = stripe.value.elements();
        cardElement.value = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
          },
        });
        
        await nextTick();
        
        const cardElementDiv = document.getElementById('card-element');
        if (cardElementDiv) {
          cardElement.value.mount('#card-element');
          stripeLoaded.value = true;
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de Stripe:", error);
      const errorDiv = document.getElementById('stripe-load-error');
      if (errorDiv) {
        errorDiv.textContent = "Erreur de chargement du système de paiement: " + error.message;
      }
    }
  }
};

// Passer à l'étape paiement
const handleFormSubmit = async () => {
  const validation = validateForm();
  
  if (!validation.isValid) {
    alert('Veuillez corriger les erreurs:\n' + validation.errors.join('\n'));
    return;
  }

  showPayment.value = true;
  await nextTick();
  await loadStripe();
};

// Traitement du paiement
const handlePayment = async () => {
  if (!stripe.value || !cardElement.value) {
    alert("Erreur de chargement du système de paiement");
    return;
  }

  isSubmitting.value = true;

  try {
    // Validation du stock
    const stockValidation = await validateCartStock(cartStore.items);
    if (!stockValidation.isValid) {
      alert("Erreurs de stock:\n" + stockValidation.errors.join("\n"));
      return;
    }

    // Création du payment intent
    const response = await $fetch('/api/create-payment-intent', {
      method: 'POST',
      body: {
        amount: Math.round(cartStore.totalPrice * 1.2 * 100),
        currency: 'eur',
      }
    });

    // Confirmation du paiement
    const { error, paymentIntent } = await stripe.value.confirmCardPayment(response.clientSecret, {
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
    });

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      console.log("✅ Paiement réussi, création de la commande...");
      
      // Création de la commande
      const supabase = useSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "completed",
          total: cartStore.totalPrice * 1.2,
          payment_intent_id: paymentIntent.id,
          shipping_address: form.value,
        })
        .select()
        .single();

      if (orderError) {
        console.error("❌ Erreur création commande:", orderError);
        throw new Error("Erreur lors de la création de la commande");
      }

      console.log("✅ Commande créée:", order.id);

      const orderItems = cartStore.items.map((item) => ({
        order_id: order.id,
        manga_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) {
        console.error("❌ Erreur articles:", itemsError);
        throw new Error("Erreur lors de l'ajout des articles");
      }

      console.log("✅ Articles ajoutés");
      
      // Mise à jour du stock
      await updateStockAfterOrder(cartStore.items);
      console.log("✅ Stock mis à jour");
      
      // Nettoyage
      cartStore.clearCart();
      console.log("✅ Panier vidé");
      
      // Redirection vers succès
      console.log("🔄 Redirection vers /success...");
      isRedirecting.value = true;
      
      // Petit délai pour s'assurer que tout est bien traité
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Forcer la redirection côté client
      if (process.client) {
        window.location.href = '/success';
      } else {
        await navigateTo('/success', { replace: true });
      }
    }
  } catch (error) {
    console.error("Erreur paiement:", error);
    alert("Erreur lors du paiement: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  showPayment.value = false;
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 lg:p-6">
    <!-- Écran de redirection -->
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

    <h1 class="text-3xl font-bold mb-8 text-center">
      {{ showPayment ? 'Paiement sécurisé' : 'Informations de livraison' }}
    </h1>

    <!-- Panier vide -->
    <div v-if="cartStore.isEmpty" class="text-center py-16">
      <Icon name="lucide:shopping-cart" class="w-20 h-20 mx-auto text-gray-400 mb-6" />
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Votre panier est vide</h2>
      <p class="text-gray-600 mb-6">Découvrez notre catalogue de mangas</p>
      <NuxtLink to="/catalogue" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
        Continuer mes achats
      </NuxtLink>
    </div>

    <!-- Contenu principal -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulaire ou Paiement -->
      <div class="lg:col-span-2">
        
        <!-- ÉTAPE 1: Formulaire -->
        <form v-if="!showPayment" @submit.prevent="handleFormSubmit" class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold mb-4">Informations personnelles</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="firstName">Prénom *</Label>
                <Input id="firstName" v-model="form.firstName" required />
              </div>
              <div>
                <Label for="lastName">Nom *</Label>
                <Input id="lastName" v-model="form.lastName" required />
              </div>
            </div>

            <div class="mt-4">
              <Label for="email">Email *</Label>
              <Input id="email" v-model="form.email" type="email" required />
            </div>

            <div class="mt-4">
              <Label for="address">Adresse *</Label>
              <Input id="address" v-model="form.address" required />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label for="postalCode">Code postal *</Label>
                <Input id="postalCode" v-model="form.postalCode" required />
              </div>
              <div>
                <Label for="city">Ville *</Label>
                <Input id="city" v-model="form.city" required />
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <NuxtLink to="/cart" class="flex-1 text-center border px-6 py-3 rounded-lg">
              Retour au panier
            </NuxtLink>
            <Button type="submit" :disabled="isSubmitting" class="flex-1 bg-red-600 hover:bg-red-700">
              {{ isSubmitting ? 'Validation...' : 'Continuer vers le paiement' }}
            </Button>
          </div>
        </form>

        <!-- ÉTAPE 2: Paiement -->
        <div v-else>
          <form @submit.prevent="handlePayment" class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border p-6">
              <h2 class="text-xl font-semibold mb-4">Carte bancaire</h2>
              
              <div class="space-y-4">
                <Label>Informations de carte *</Label>
                <div id="card-element" class="p-4 border rounded-lg"></div>
                <div id="card-errors" class="text-red-600 text-sm"></div>
              </div>

              <div v-if="!stripeLoaded" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3"></div>
                <p class="text-sm text-gray-600">Chargement du système de paiement...</p>
                <div id="stripe-load-error" class="text-red-600 text-sm"></div>
              </div>
            </div>

            <div class="flex gap-4">
              <Button type="button" @click="goBack" variant="outline" class="flex-1">
                Retour
              </Button>
              <Button type="submit" :disabled="isSubmitting || !stripeLoaded" class="flex-1 bg-red-600 hover:bg-red-700">
                {{ isSubmitting ? 'Traitement...' : `Payer ${(cartStore.totalPrice * 1.2).toFixed(2)}€` }}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <!-- Résumé de commande -->
      <div>
        <div class="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
          <h2 class="text-xl font-semibold mb-4">Votre commande</h2>

          <div class="space-y-4 mb-6">
            <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4">
              <img :src="item.cover" :alt="item.title" class="w-12 h-16 object-cover rounded" />
              <div class="flex-1">
                <p class="font-medium text-sm">{{ item.title }}</p>
                <p class="text-xs text-gray-500">Qté: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold">{{ (item.price * item.quantity).toFixed(2) }}€</p>
            </div>
          </div>

          <Separator class="my-4" />

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{{ cartStore.formattedTotalPrice }}€</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>TVA (20%)</span>
              <span>{{ (cartStore.totalPrice * 0.2).toFixed(2) }}€</span>
            </div>
            <div class="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span class="text-red-600">{{ (cartStore.totalPrice * 1.2).toFixed(2) }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
