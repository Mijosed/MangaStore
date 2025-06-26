<script setup>
    import HeaderLogo from './HeaderLogo.vue'
    import HeaderNav from './HeaderNav.vue'
    import HeaderSearch from './HeaderSearch.vue'
</script>

<template>
    <header class="bg-neutral-900 text-white">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <!-- Logo à gauche -->
        <div class="flex-shrink-0">
          <HeaderLogo />
        </div>

        <!-- Searchbar au centre -->
        <div class="flex-1 mx-8">
          <HeaderSearch class="hidden md:flex w-full max-w-xl mx-auto" />
        </div>

        <!-- Navigation à droite -->
        <HeaderNav />
      </div>
    </header>
</template>

