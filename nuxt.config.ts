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
  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  typescript: {
    strict: true
  }
});