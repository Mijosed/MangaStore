<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Section principale -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Image du manga -->
      <div class="space-y-4">
        <div class="aspect-[3/4] relative overflow-hidden rounded-lg border bg-gray-100">
          <img
            :src="manga.cover"
            :alt="manga.title"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      <!-- Informations du manga -->
      <div class="space-y-6">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold">{{ manga.title }}</h1>
          <p class="text-gray-500">Par {{ manga.author }}</p>
        </div>

        <!-- Prix et notation -->
        <div class="flex items-center justify-between">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold">{{ manga.price }}€</span>
            <span class="text-sm text-gray-500">TTC</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="lucide:star" class="w-5 h-5 text-yellow-400 fill-current" />
            <span class="font-semibold">{{ manga.rating }}/5</span>
          </div>
        </div>

        <!-- Stock et quantité -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-sm">
            <Icon 
              :name="manga.stock > 0 ? 'lucide:check-circle' : 'lucide:x-circle'" 
              class="w-5 h-5"
              :class="manga.stock > 0 ? 'text-green-500' : 'text-red-500'"
            />
            <span>{{ manga.stock > 0 ? `En stock (${manga.stock} disponibles)` : 'Rupture de stock' }}</span>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center border rounded">
              <button 
                class="px-3 py-2 hover:bg-gray-100 transition-colors"
                @click="decrementQuantity"
                :disabled="quantity <= 1"
              >
                <Icon name="lucide:minus" class="w-4 h-4" />
              </button>
              <span class="px-4 py-2 border-x text-center min-w-[3rem]">{{ quantity }}</span>
              <button 
                class="px-3 py-2 hover:bg-gray-100 transition-colors"
                @click="incrementQuantity"
                :disabled="quantity >= manga.stock"
              >
                <Icon name="lucide:plus" class="w-4 h-4" />
              </button>
            </div>
            <Button class="flex-1" @click="addToCart">
              <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>

        <!-- Badges d'information -->
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">{{ manga.category }}</span>
          <span v-for="genre in manga.genres" :key="genre" class="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {{ genre }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tabs d'information -->
    <div class="mt-12">
      <Tabs defaultValue="description" class="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Caractéristiques</TabsTrigger>
          <TabsTrigger value="reviews">Avis ({{ manga.reviews.length }})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" class="prose max-w-none mt-6">
          <p class="whitespace-pre-line">{{ manga.description }}</p>
        </TabsContent>
        <TabsContent value="details" class="mt-6">
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Format</dt>
              <dd>{{ manga.specifications.format }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Pages</dt>
              <dd>{{ manga.specifications.pages }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Langue</dt>
              <dd>{{ manga.specifications.language }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">ISBN</dt>
              <dd>{{ manga.specifications.isbn }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Date de sortie</dt>
              <dd>{{ new Date(manga.releaseDate).toLocaleDateString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Éditeur</dt>
              <dd>{{ manga.publisher }}</dd>
            </div>
          </dl>
        </TabsContent>
        <TabsContent value="reviews" class="mt-6">
          <div class="space-y-6">
            <div v-for="review in manga.reviews" :key="review.id" class="border-b pb-6 last:border-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">{{ review.author }}</span>
                  <div class="flex items-center">
                    <Icon 
                      v-for="i in 5" 
                      :key="i"
                      name="lucide:star" 
                      class="w-4 h-4"
                      :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                    />
                  </div>
                </div>
                <span class="text-sm text-gray-500">
                  {{ new Date(review.date).toLocaleDateString() }}
                </span>
              </div>
              <p class="text-gray-600">{{ review.comment }}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const quantity = ref(1)

// Données fictives du manga (à remplacer par des vraies données plus tard)
const manga = ref({
  id: 1,
  title: 'One Piece - Tome 1',
  author: 'Eiichiro Oda',
  cover: '/images/images.jpg',
  price: 6.99,
  rating: 4.8,
  stock: 15,
  releaseDate: '2025-01-15',
  publisher: 'Glénat',
  category: 'Shonen',
  genres: ['Action', 'Aventure', 'Comédie'],
  description: `L'histoire suit Monkey D. Luffy, un jeune pirate élastique, qui parcourt Grand Line à la recherche du trésor ultime connu sous le nom de "One Piece" afin de devenir le Roi des Pirates. Avec son équipage de pirates, appelé l'équipage de Chapeau de paille, Luffy explore la mer, fait face à des ennemis et vit des aventures palpitantes.

Ce premier tome pose les bases de cette saga épique qui deviendra l'une des séries manga les plus populaires au monde.`,
  specifications: {
    format: '11,5 x 17,5 cm',
    pages: 208,
    language: 'Français',
    isbn: '978-2723488525'
  },
  reviews: [
    { id: 1, author: 'Sarah M.', rating: 5, comment: 'Un classique incontournable ! Le début d\'une grande aventure.', date: '2025-05-15' },
    { id: 2, author: 'Thomas R.', rating: 4, comment: 'Excellent premier tome qui donne envie de lire la suite.', date: '2025-05-10' }
  ]
})

const incrementQuantity = () => {
  if (quantity.value < manga.value.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  // TODO: Implémenter l'ajout au panier
  console.log(`Ajout de ${quantity.value} exemplaire(s) au panier`)
}
</script>