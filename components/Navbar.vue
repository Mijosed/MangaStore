<script setup>
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, watch } from 'vue'

const { user, signOut } = useAuth()
const router = useRouter()
const showMenu = ref(false)
const showMobileMenu = ref(false)
const menuRef = ref(null)
const buttonRef = ref(null)
const searchQuery = ref('')

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleClickOutside = (event) => {
  if (showMenu.value && 
      menuRef.value && 
      !menuRef.value.contains(event.target) &&
      buttonRef.value && 
      !buttonRef.value.contains(event.target)) {
    showMenu.value = false
  }
}

const handleLogout = async () => {
  await signOut()
  showMenu.value = false
  showMobileMenu.value = false
  router.push('/')
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Rediriger vers la page de résultats avec la query
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
  }
}

const handleSearchKeydown = (event) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="bg-gray-100 shadow-md glass">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-4 h-16 gap-4">
      <!-- Logo -->
      <div class="w-32 flex-shrink-0">
        <NuxtLink to="/" class="w-full">
          <img src="/logo.svg" alt="Logo" class="object-fill h-16 w-full pt-2">
        </NuxtLink>
      </div>

      <!-- Menu principal - Desktop -->
      <nav class="hidden lg:flex font-Lato items-center gap-6 text-sm text-gray-700">
        <NuxtLink to="/catalogue" class="hover:text-bleu">Catalogue</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-bleu">Contact</NuxtLink>
      </nav>

      <!-- Barre de recherche - Desktop -->
      <div class="hidden md:flex flex-1 max-w-md mx-4">
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            @keydown="handleSearchKeydown"
            type="text"
            placeholder="Rechercher un manga..."
            class="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bleu focus:border-transparent"
          >
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-bleu"
          >
            <Icon name="lucide:search" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Section utilisateur - Desktop -->
      <div class="hidden md:flex items-center gap-2">
        <!-- Icône panier -->
        <NuxtLink 
          to="/cart"
          class="flex items-center gap-1 hover:text-bleu p-2 rounded-full hover:bg-gray-200 transition-colors relative"
        >
          <Icon name="lucide:shopping-cart" size="26" class="text-gray-600" />
          <!-- Badge pour le nombre d'articles (optionnel) -->
          <!-- <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span> -->
        </NuxtLink>

        <!-- Menu utilisateur -->
        <div class="relative">
          <button 
            ref="buttonRef"
            @click.stop="toggleMenu" 
            class="flex items-center gap-1 hover:text-bleu p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Icon name="lucide:user-circle" size="26" class=" text-gray-600" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showMenu"
            ref="menuRef"
            class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg text-sm z-50"
          >
            <!-- Info utilisateur si connecté -->
            <div v-if="user" class="px-4 py-3 border-b border-gray-100">
              <div class="text-xs text-gray-500">Connecté en tant que :</div>
              <div class="text-sm font-medium text-gray-700 truncate">{{ user.email }}</div>
            </div>

            <NuxtLink
              v-if="user"
              to="/account"
              class="block px-4 py-2 hover:bg-gray-100 transition-colors"
              @click="showMenu = false"
            >
              <Icon name="lucide:user" class="w-4 h-4 inline mr-2" />
              Mon profil
            </NuxtLink>

            <button
              v-if="user"
              @click="handleLogout"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
            >
              <Icon name="lucide:log-out" class="w-4 h-4 inline mr-2" />
              Se déconnecter
            </button>

            <div v-if="!user">
              <NuxtLink
                to="/login"
                class="block px-4 py-2 hover:bg-gray-100 transition-colors"
                @click="showMenu = false"
              >
                <Icon name="lucide:log-in" class="w-4 h-4 inline mr-2" />
                Se connecter
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="block px-4 py-2 hover:bg-gray-100 transition-colors"
                @click="showMenu = false"
              >
                <Icon name="lucide:user-plus" class="w-4 h-4 inline mr-2" />
                Créer un compte
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu burger - Mobile -->
      <button 
        @click="toggleMobileMenu"
        class="md:hidden flex items-center justify-center w-8 h-8"
      >
        <Icon 
          :name="showMobileMenu ? 'lucide:x' : 'lucide:menu'" 
          class=" text-gray-700" 
          size="26"
        />
      </button>
    </div>

    <!-- Menu mobile -->
    <div 
      v-if="showMobileMenu"
      class="md:hidden bg-white border-t shadow-lg"
    >
      <nav class="flex flex-col py-4">
        <!-- Barre de recherche mobile -->
        <div class="px-4 pb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keydown="handleSearchKeydown"
              type="text"
              placeholder="Rechercher un manga..."
              class="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bleu focus:border-transparent"
            >
            <button
              @click="handleSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-bleu"
            >
              <Icon name="lucide:search" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Liens de navigation -->
        <NuxtLink 
          to="/catalogue" 
          class="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-bleu"
          @click="closeMobileMenu"
        >
          Catalogue
        </NuxtLink>
        <NuxtLink 
          to="/contact" 
          class="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-bleu"
          @click="closeMobileMenu"
        >
          Contact
        </NuxtLink>
        
        <!-- Lien panier -->
        <NuxtLink 
          to="/cart" 
          class="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-bleu flex items-center"
          @click="closeMobileMenu"
        >
          <Icon name="lucide:shopping-cart" class="w-4 h-4 inline mr-2" />
          Mon panier
        </NuxtLink>

        <!-- Séparateur -->
        <hr class="my-2 border-gray-200">

        <!-- Section utilisateur mobile -->
        <div v-if="user" class="px-4 py-2">
          <div class="text-xs text-gray-500 mb-1">Connecté en tant que :</div>
          <div class="text-sm text-gray-600 font-medium mb-3 truncate">
            {{ user.email }}
          </div>
          <NuxtLink 
            to="/account" 
            class="block py-2 text-gray-700 hover:text-bleu"
            @click="closeMobileMenu"
          >
            <Icon name="lucide:user" class="w-4 h-4 inline mr-2" />
            Mon profil
          </NuxtLink>
          <button 
            @click="handleLogout"
            class="block py-2 text-red-600 hover:text-red-800"
          >
            <Icon name="lucide:log-out" class="w-4 h-4 inline mr-2" />
            Se déconnecter
          </button>
        </div>

        <!-- Liens d'authentification si non connecté -->
        <div v-if="!user" class="px-4">
          <NuxtLink 
            to="/login" 
            class="block py-2 text-gray-700 hover:text-bleu"
            @click="closeMobileMenu"
          >
            <Icon name="lucide:log-in" class="w-4 h-4 inline mr-2" />
            Se connecter
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="block py-2 text-gray-700 hover:text-bleu"
            @click="closeMobileMenu"
          >
            <Icon name="lucide:user-plus" class="w-4 h-4 inline mr-2" />
            Créer un compte
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
