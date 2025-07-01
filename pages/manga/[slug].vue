<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useManga } from '@/composables/useManga'
import { useCart } from '@/composables/useCart'
import MangaHeader from '@/components/manga/MangaHeader.vue'

const route = useRoute()
const router = useRouter()
const { manga, loading, error, fetchManga } = useManga()
const { quantity, incrementQuantity, decrementQuantity, addToCart } = useCart()

const handleAddToCart = async () => {
  if (!manga.value) return

  const result = await addToCart(manga.value.id, quantity.value)
  if (result.error === 'not_authenticated') {
    router.push('/login')
  } else if (result.success) {
    // TODO: Ajouter une notification de succès
    console.log(`${quantity.value} exemplaire(s) ajouté(s) au panier`)
  } else {
    // TODO: Ajouter une notification d'erreur
    console.error('Erreur lors de l\'ajout au panier')
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
      <MangaHeader 
        :manga="manga"
        :quantity="quantity"
        @increment-quantity="incrementQuantity(manga.stock)"
        @decrement-quantity="decrementQuantity"
        @add-to-cart="handleAddToCart"
      />

      <Tabs defaultValue="description" class="w-full mt-8">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="reviews">
            Avis ({{ manga.reviews.length }})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <p class="text-gray-700 whitespace-pre-line">{{ manga.description }}</p>
        </TabsContent>

        <TabsContent value="details">
          <dl class="grid grid-cols-2 gap-4">
            <div>
              <dt class="font-medium text-gray-600">Format</dt>
              <dd>{{ manga.specifications.format }}</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-600">Pages</dt>
              <dd>{{ manga.specifications.pages }}</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-600">Langue</dt>
              <dd>{{ manga.specifications.language }}</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-600">ISBN</dt>
              <dd>{{ manga.specifications.isbn }}</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-600">Date de sortie</dt>
              <dd>{{ new Date(manga.releaseDate).toLocaleDateString() }}</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-600">Éditeur</dt>
              <dd>{{ manga.publisher }}</dd>
            </div>
          </dl>
        </TabsContent>

        <TabsContent value="reviews">
          <div class="space-y-6">
            <div v-for="review in manga.reviews" :key="review.id" class="border-b pb-4">
              <div class="flex items-start gap-4">
                <img
                  :src="review.avatar || '/default-avatar.png'"
                  :alt="review.author"
                  class="w-10 h-10 rounded-full"
                />
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-medium">{{ review.author }}</span>
                    <span class="text-sm text-gray-500">
                      {{ new Date(review.date).toLocaleDateString() }}
                    </span>
                  </div>
                  <div class="flex items-center mb-2">
                    <div class="flex gap-0.5">
                      <i
                        v-for="star in 5"
                        :key="star"
                        :class="[
                          'fas fa-star text-sm',
                          star <= review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        ]"
                      ></i>
                    </div>
                  </div>
                  <p class="text-gray-700">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

