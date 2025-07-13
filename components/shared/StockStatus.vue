<template>
  <div class="flex items-center gap-2">
    <Icon 
      :name="getStockIcon()" 
      class="w-4 h-4"
      :class="stockClass"
    />
    <span 
      :class="[stockClass, 'text-sm font-medium']"
    >
      {{ stockMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStockDisplay } from '~/composables/useStockDisplay'

interface Props {
  mangaId: string
  quantity?: number
  autoFetch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  quantity: 1,
  autoFetch: true
})

const { fetchSingleStock, getStock, getStockMessage, getStockClass, isInStock } = useStockDisplay()

const stockMessage = computed(() => getStockMessage(props.mangaId, props.quantity))
const stockClass = computed(() => getStockClass(props.mangaId, props.quantity))

const getStockIcon = () => {
  const stock = getStock(props.mangaId)
  
  if (stock === null) return 'lucide:loader-2'
  if (stock === 0) return 'lucide:x-circle'
  if (stock < props.quantity) return 'lucide:alert-triangle'
  if (stock <= 5) return 'lucide:alert-circle'
  return 'lucide:check-circle'
}

// Récupérer le stock au montage si autoFetch est activé
onMounted(async () => {
  if (props.autoFetch && getStock(props.mangaId) === null) {
    await fetchSingleStock(props.mangaId)
  }
})
</script>
