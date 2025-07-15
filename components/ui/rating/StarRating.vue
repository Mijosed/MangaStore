<template>
  <div class="flex items-center gap-1">
    <div class="flex gap-0.5">
      <Icon
        v-for="star in maxStars"
        :key="star"
        name="lucide:star"
        :class="[
          size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        ]"
      />
    </div>
    <span v-if="showLabel" :class="[
      'text-gray-600',
      size === 'sm' ? 'text-xs' : 'text-sm'
    ]">
      {{ rating }}/{{ maxStars }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  rating: {
    type: Number,
    default: 0
  },
  maxStars: {
    type: Number,
    default: 5
  },
  size: {
    type: String,
    default: 'md', 
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})
</script>
