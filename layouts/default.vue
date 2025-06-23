<script setup>
import Header from '@/components/shared/Header.vue'
import Footer from '@/components/shared/Footer.vue'
</script>

<template>
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="flex-1">
        <slot />
      </main>    
      <Footer />
    </div>
</template>