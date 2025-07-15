// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/image", "shadcn-nuxt", "@nuxtjs/supabase", "@nuxt/icon", "@pinia/nuxt"],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    transpile: ["@supabase/ssr", "cookie"],
  },

  runtimeConfig: {
    public: {
      supabase: {
        redirect: false,
        // Configuration pour gérer les erreurs de token
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        // Durée de vie du token (optionnel)
        sessionRefreshTimeout: 30 * 60 * 1000, // 30 minutes
      },
      stripe: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      }
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  typescript: {
    strict: true
  }
});