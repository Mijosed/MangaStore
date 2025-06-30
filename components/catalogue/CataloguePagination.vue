<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  visiblePages: number[]
}>()

defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const buttonClass = (page: number) => [
  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
  props.currentPage === page
    ? 'bg-red-600 text-white border border-red-600'
    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
]
</script>

<template>
  <nav v-if="totalPages > 1" class="flex justify-center mt-8">
    <div class="flex items-center space-x-2" aria-label="Pagination">
      <!-- Bouton Précédent -->
      <button
        @click="$emit('update:currentPage', currentPage - 1)"
        :disabled="currentPage === 1"
        class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Précédent
      </button>

      <!-- Pages simples (≤ 7 pages) -->
      <template v-if="totalPages <= 7">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="$emit('update:currentPage', page)"
          :class="buttonClass(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Pagination avec ellipses (> 7 pages) -->
      <template v-else>
        <!-- Page 1 -->
        <button
          @click="$emit('update:currentPage', 1)"
          :class="buttonClass(1)"
        >
          1
        </button>

        <!-- Ellipse début -->
        <span v-if="currentPage > 3" class="px-2 py-2 text-gray-500">...</span>

        <!-- Pages autour de la page actuelle -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('update:currentPage', page)"
          :class="buttonClass(page)"
        >
          {{ page }}
        </button>

        <!-- Ellipse fin -->
        <span v-if="currentPage < totalPages - 2" class="px-2 py-2 text-gray-500">...</span>

        <!-- Dernière page -->
        <button
          v-if="totalPages > 1"
          @click="$emit('update:currentPage', totalPages)"
          :class="buttonClass(totalPages)"
        >
          {{ totalPages }}
        </button>
      </template>

      <!-- Bouton Suivant -->
      <button
        @click="$emit('update:currentPage', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
      >
        Suivant
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </nav>
</template>

