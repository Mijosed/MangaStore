<script setup lang="ts">
    import Header from '@/components/shared/Header.vue'
    import Footer from '@/components/shared/Footer.vue'
    const { profile } = useProfile()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Header -->
    <Header />

    <!-- Main content avec sidebar -->
    <div class="flex-1 flex">
      <!-- Sidebar pour desktop -->
      <aside class="hidden w-64 border-r bg-background md:block">
        <div class="flex h-full flex-col">
          <div class="border-b px-6 py-4">
            <h2 class="text-lg font-semibold">Mon Compte</h2>
          </div>
          <nav class="flex-1 space-y-1 p-4">
            <!-- Menu Items -->
            <NuxtLink
              to="/account"
              class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              active-class="bg-gray-100 dark:bg-gray-800"
              exact
            >
              <Icon name="heroicons:user" class="mr-3 h-5 w-5" />
              <span>Informations générales</span>
            </NuxtLink>

            <NuxtLink
              to="/account/orders"
              class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              active-class="bg-gray-100 dark:bg-gray-800"
            >
              <Icon name="heroicons:shopping-bag" class="mr-3 h-5 w-5" />
              <span>Mes commandes</span>
            </NuxtLink>

            <!-- Admin section -->
            <template v-if="profile?.role === 'admin'">
              <div class="my-4 border-t dark:border-gray-700"></div>
              <div class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Administration
              </div>
              <NuxtLink
                to="/account/users"
                class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                active-class="bg-gray-100 dark:bg-gray-800"
              >
                <Icon name="heroicons:users" class="mr-3 h-5 w-5" />
                <span>Gestion des utilisateurs</span>
              </NuxtLink>
              <NuxtLink
                to="/account/mangas"
                class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                active-class="bg-gray-100 dark:bg-gray-800"
              >
                <Icon name="heroicons:book-open" class="mr-3 h-5 w-5" />
                <span>Gestion des mangas</span>
              </NuxtLink>
            </template>
          </nav>
        </div>
      </aside>

      <!-- Mobile sidebar -->
      <Sheet>
        <SheetTrigger class="absolute left-4 top-20 z-40 md:hidden">
          <Button variant="outline" size="icon">
            <Icon name="heroicons:bars-3" class="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" class="w-64 p-0">
          <div class="flex h-full flex-col">
            <div class="border-b px-6 py-4">
              <h2 class="text-lg font-semibold">Mon Compte</h2>
            </div>
            <nav class="flex-1 space-y-1 p-4">
              <!-- Mobile Menu Items (same as desktop) -->
              <NuxtLink
                to="/account"
                class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                active-class="bg-gray-100 dark:bg-gray-800"
                exact
              >
                <Icon name="heroicons:user" class="mr-3 h-5 w-5" />
                <span>Informations générales</span>
              </NuxtLink>

              <NuxtLink
                to="/account/orders"
                class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                active-class="bg-gray-100 dark:bg-gray-800"
              >
                <Icon name="heroicons:shopping-bag" class="mr-3 h-5 w-5" />
                <span>Mes commandes</span>
              </NuxtLink>

              <!-- Admin section mobile -->
              <template v-if="profile?.role === 'admin'">
                <div class="my-4 border-t dark:border-gray-700"></div>
                <div class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Administration
                </div>
                <NuxtLink
                  to="/account/users"
                  class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  active-class="bg-gray-100 dark:bg-gray-800"
                >
                  <Icon name="heroicons:users" class="mr-3 h-5 w-5" />
                  <span>Gestion des utilisateurs</span>
                </NuxtLink>
                <NuxtLink
                  to="/account/mangas"
                  class="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  active-class="bg-gray-100 dark:bg-gray-800"
                >
                  <Icon name="heroicons:book-open" class="mr-3 h-5 w-5" />
                  <span>Gestion des mangas</span>
                </NuxtLink>
              </template>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="container px-4 py-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>


