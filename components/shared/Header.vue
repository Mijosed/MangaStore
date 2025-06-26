<script setup>
    import HeaderLogo from './HeaderLogo.vue'
    import HeaderNav from './HeaderNav.vue'
</script>

<template>
    <header class="sticky w-full bg-black/90 backdrop-blur-sm z-50 top-0">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <!-- Logo à gauche -->
        <div class="flex-shrink-0">
          <HeaderLogo />
        </div>


        <!-- Navigation à droite -->
        <HeaderNav />
      </div>
    </header>
</template>

