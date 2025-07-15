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
  mangaId: string | number
  quantity?: number
  autoFetch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  quantity: 1,
  autoFetch: true
})

const { fetchSingleStock, getStock, getStockMessage, getStockClass, isInStock } = useStockDisplay()

const mangaIdString = computed(() => String(props.mangaId))

const stockMessage = computed(() => getStockMessage(mangaIdString.value, props.quantity))
const stockClass = computed(() => getStockClass(mangaIdString.value, props.quantity))

const getStockIcon = () => {
  const stock = getStock(mangaIdString.value)
  
  if (stock === null) return 'lucide:loader-2'
  if (stock === 0) return 'lucide:x-circle'
  if (stock < props.quantity) return 'lucide:alert-triangle'
  if (stock <= 5) return 'lucide:alert-circle'
  return 'lucide:check-circle'
}

onMounted(async () => {
  if (props.autoFetch && getStock(mangaIdString.value) === null) {
    await fetchSingleStock(mangaIdString.value)
  }
})
</script>
