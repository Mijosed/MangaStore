<script setup>
  import LandingHero from '@/components/home/LandingHero.vue'
  import LandingCategories from '@/components/home/LandingCategories.vue'
</script>

<template>
  <div class="flex flex-col w-full">
    <LandingHero />
    <div class="container mx-auto px-4">
      <LandingCategories />
    </div>
  </div>
</template>

