
<script setup>
import { Button } from '@/components/ui/button'

const props = defineProps({
  manga: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
})

defineEmits(['add-to-cart', 'increment-quantity', 'decrement-quantity'])
</script>

<template>
  <div class="grid lg:grid-cols-5 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
    <!-- Image Column - Optimisée pour éviter les images trop grandes -->
    <div class="lg:col-span-2 md:col-span-1 flex justify-center">
      <div class="relative group">
        <img
          :src="manga.cover_url"
          :alt="manga.title"
          class="max-w-[300px] w-full h-auto aspect-[3/4] object-cover rounded-lg shadow-xl border border-gray-200 group-hover:shadow-2xl transition-shadow duration-300"
        />
        <!-- Badge de note si disponible -->
        <div v-if="manga.average_rating && manga.average_rating > 0" 
             class="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold shadow-lg">
          <Icon name="lucide:star" class="w-3 h-3 inline mr-1" />
          {{ manga.average_rating.toFixed(1) }}
        </div>
      </div>
    </div>

    <!-- Details Column - Plus d'espace pour les informations -->
    <div class="lg:col-span-3 md:col-span-2 space-y-6">
      <!-- En-tête du manga -->
      <div class="border-b border-gray-200 pb-6">
        <h1 class="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight">{{ manga.title }}</h1>
        <p class="text-xl text-gray-600 mb-4">par <span class="font-semibold">{{ manga.author || 'Auteur inconnu' }}</span></p>
        
        <!-- Tags catégorie et genres -->
        <div class="flex gap-2 flex-wrap">
          <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ manga.category?.name || 'Non catégorisé' }}
          </span>
          <span
            v-for="mg in (manga.manga_genres || []).slice(0, 3)"
            :key="mg.genre?.id"
            class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ mg.genre?.name }}
          </span>
          <span v-if="(manga.manga_genres || []).length > 3" 
                class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            +{{ (manga.manga_genres || []).length - 3 }} autres
          </span>
        </div>
      </div>

      <!-- Prix et stock -->
      <div class="bg-gray-50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl font-bold text-gray-900">{{ manga.price }}€</span>
          <div class="text-right">
            <div v-if="manga.stock > 0" class="text-green-600 font-medium">
              <Icon name="lucide:check-circle" class="w-5 h-5 inline mr-1" />
              En stock
            </div>
            <div v-else class="text-red-600 font-medium">
              <Icon name="lucide:x-circle" class="w-5 h-5 inline mr-1" />
              Rupture de stock
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ manga.stock }} exemplaires disponibles</p>
          </div>
        </div>

        <!-- Contrôles de quantité et ajout au panier -->
        <div class="flex gap-4 items-center">
          <div class="flex border border-gray-300 rounded-lg bg-white shadow-sm">
            <Button
              variant="outline"
              size="icon"
              @click="$emit('decrement-quantity')"
              :disabled="quantity <= 1"
              class="rounded-r-none border-r-0 hover:bg-gray-50"
            >
              <Icon name="lucide:minus" class="w-4 h-4" />
            </Button>
            <div class="px-6 py-2 border-x-0 flex items-center min-w-[4rem] justify-center font-medium bg-white">
              {{ quantity }}
            </div>
            <Button
              variant="outline"
              size="icon"
              @click="$emit('increment-quantity')"
              :disabled="quantity >= manga.stock"
              class="rounded-l-none border-l-0 hover:bg-gray-50"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
            </Button>
          </div>
          <Button
            @click="$emit('add-to-cart')"
            :disabled="manga.stock === 0"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Icon name="lucide:shopping-cart" class="w-5 h-5 mr-3" />
            Ajouter au panier
          </Button>
        </div>
      </div>

      <!-- Informations rapides -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-sm text-gray-500 mb-1">Éditeur</div>
          <div class="font-medium">{{ manga.publisher || 'Non spécifié' }}</div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-sm text-gray-500 mb-1">Date de sortie</div>
          <div class="font-medium">
            {{ manga.releaseDate ? new Date(manga.releaseDate).toLocaleDateString('fr-FR') : 'Non spécifiée' }}
          </div>
        </div>
      </div>

      <!-- Description courte si disponible -->
      <div v-if="manga.description" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-2 flex items-center">
          <Icon name="lucide:book-open" class="w-5 h-5 mr-2 text-blue-600" />
          Aperçu
        </h3>
        <p class="text-gray-700 leading-relaxed line-clamp-3">
          {{ manga.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

