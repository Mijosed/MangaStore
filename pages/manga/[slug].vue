<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useManga } from '@/composables/useManga'
import { useCartStore } from '~/stores/cart'
import { useAuth } from '~/composables/useAuth'
import MangaHeader from '@/components/manga/MangaHeader.vue'
import ReviewForm from '@/components/manga/ReviewForm.vue'
import { StarRating } from '@/components/ui/rating'

const route = useRoute()
const router = useRouter()
const { manga, loading, error, fetchManga, refreshReviews } = useManga()
const cartStore = useCartStore()
const { user } = useAuth()

// Gestion locale de la quantité
const quantity = ref(1)

// Computed properties pour sécuriser l'accès aux données
const mangaSpecs = computed(() => manga.value?.specifications || {
  format: 'Format non spécifié',
  pages: 'Non spécifié',
  language: 'Non spécifié',
  isbn: 'Non spécifié'
})

const mangaReviews = computed(() => manga.value?.reviews || [])

const reviewsCount = computed(() => mangaReviews.value.length)

const incrementQuantity = (maxStock) => {
  if (quantity.value < maxStock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = async () => {
  if (!manga.value) return

  // Vérifier si l'utilisateur est connecté
  if (!user.value) {
    router.push('/login')
    return
  }

  // Ajouter la quantité demandée au panier
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem({
      id: manga.value.id,
      title: manga.value.title,
      author: manga.value.author || '',
      price: manga.value.price,
      cover: manga.value.cover_url,
      slug: manga.value.slug
    })
  }

}

const goBackToCatalogue = () => {
  router.push('/catalogue')
}

const handleReviewAdded = async () => {
  if (manga.value) {
    await refreshReviews(manga.value.id)
  }
}

// Charger les données au montage du composant
onMounted(async () => {
  const data = await fetchManga(route.params.slug)
  if (!data) {
    router.push('/404')
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center min-h-[60vh] flex flex-col items-center justify-center">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <Button @click="fetchManga(route.params.slug)">Réessayer</Button>
    </div>

    <!-- Content -->
    <div v-else-if="manga">
      <!-- Bouton retour au catalogue -->
      <div class="mb-6">
        <Button 
          variant="outline" 
          @click="goBackToCatalogue"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Retour au catalogue
        </Button>
      </div>

      <MangaHeader 
        :manga="manga"
        :quantity="quantity"
        @increment-quantity="incrementQuantity(manga.stock)"
        @decrement-quantity="decrementQuantity"
        @add-to-cart="handleAddToCart"
      />

      <Tabs default-value="description" class="w-full mt-8">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="reviews">
            Avis ({{ reviewsCount }})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" class="mt-6">
          <div class="bg-white rounded-lg p-6 shadow-sm border">
            <h3 class="text-xl font-semibold mb-4">Description</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ manga.description || 'Aucune description disponible pour ce manga.' }}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="details" class="mt-6">
          <div class="bg-white rounded-lg p-6 shadow-sm border">
            <h3 class="text-xl font-semibold mb-4">Détails techniques</h3>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border-b pb-2">
                <dt class="font-medium text-gray-600">Format</dt>
                <dd class="text-gray-900">{{ mangaSpecs.format }}</dd>
              </div>
              <div class="border-b pb-2">
                <dt class="font-medium text-gray-600">Pages</dt>
                <dd class="text-gray-900">{{ mangaSpecs.pages }}</dd>
              </div>
              <div class="border-b pb-2">
                <dt class="font-medium text-gray-600">Langue</dt>
                <dd class="text-gray-900">{{ mangaSpecs.language }}</dd>
              </div>
              <div class="border-b pb-2">
                <dt class="font-medium text-gray-600">ISBN</dt>
                <dd class="text-gray-900">{{ mangaSpecs.isbn }}</dd>
              </div>
              <div class="border-b pb-2">
                <dt class="font-medium text-gray-600">Date de sortie</dt>
                <dd class="text-gray-900">
                  {{ manga.releaseDate ? new Date(manga.releaseDate).toLocaleDateString('fr-FR') : 'Non spécifiée' }}
                </dd>
              </div>
              <div class="border-b pb-2">
                <dt class="font-medium text-gray-600">Éditeur</dt>
                <dd class="text-gray-900">{{ manga.publisher || 'Non spécifié' }}</dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="reviews" class="mt-6">
          <div class="space-y-6">
            <!-- Formulaire d'ajout d'avis (seulement si connecté) -->
            <ReviewForm
              v-if="user"
              :manga-id="manga.id"
              @review-added="handleReviewAdded"
            />
            
            <!-- Message pour les utilisateurs non connectés -->
            <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <Icon name="lucide:info" class="w-5 h-5 text-blue-600" />
                <div>
                  <p class="text-blue-800 font-medium">Connectez-vous pour laisser un avis</p>
                  <p class="text-blue-600 text-sm mt-1">
                    Vous devez être connecté pour partager votre opinion sur ce manga.
                  </p>
                </div>
              </div>
              <div class="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  @click="router.push('/login')"
                  class="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Se connecter
                </Button>
              </div>
            </div>

            <!-- Liste des avis -->
            <div class="bg-white rounded-lg p-6 shadow-sm border">
              <h3 class="text-xl font-semibold mb-4">Avis des lecteurs</h3>
              
              <div v-if="reviewsCount === 0" class="text-center py-8 text-gray-500">
                <Icon name="lucide:message-circle" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun avis pour ce manga pour le moment.</p>
                <p class="text-sm mt-2">Soyez le premier à partager votre opinion !</p>
              </div>

              <div v-else class="space-y-6">
                <div v-for="review in mangaReviews" :key="review.id" class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {{ review.author ? review.author[0].toUpperCase() : 'U' }}
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-gray-900">{{ review.author || 'Utilisateur anonyme' }}</span>
                        <span class="text-sm text-gray-500">
                          {{ review.date ? new Date(review.date).toLocaleDateString('fr-FR') : 'Date inconnue' }}
                        </span>
                      </div>
                      <div class="mb-2">
                        <StarRating 
                          :rating="review.rating || 0"
                          :show-label="true"
                          size="sm"
                        />
                      </div>
                      <p class="text-gray-700 leading-relaxed">{{ review.comment || 'Aucun commentaire.' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

