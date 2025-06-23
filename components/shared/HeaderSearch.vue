<template>
    <div class="relative w-full">
      <input
        v-model="query"
        @keydown.enter="search"
        type="text"
        placeholder="Rechercher un manga..."
        class="w-full px-4 py-2 pr-10 text-sm bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-200 placeholder-gray-400 transition-colors"
      />
      <button @click="search" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
        <Icon name="lucide:search" class="w-5 h-5" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  const query = ref('')
  const router = useRouter()
  const search = () => {
    if (query.value.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.value.trim())}`)
      query.value = ''
    }
  }
  </script>
