<script setup>
    import { Button } from '@/components/ui/button'
</script>

<template>
    <section class="relative h-[70vh] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
             style="background-image: url('/images/background.jpg')">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">Plonge dans l'univers du manga</h1>
        <p class="text-white text-lg mb-8">
          Découvre les dernières sorties, tes classiques préférés et des éditions collector exclusives
        </p>
        <NuxtLink to="/catalogue">
          <Button size="lg" class="text-base font-medium cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">Explorer le catalogue</Button>
        </NuxtLink>
      </div>
    </section>
</template>
