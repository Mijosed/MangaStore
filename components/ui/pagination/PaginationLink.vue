<script setup lang="ts">
defineProps<{
  isActive?: boolean
}>()
</script>

<template>
  <button
    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-border"
    :class="{ 
      'bg-primary text-primary-foreground border-primary': isActive,
      'bg-background hover:bg-accent': !isActive 
    }"
  >
    <slot />
  </button>
</template>
