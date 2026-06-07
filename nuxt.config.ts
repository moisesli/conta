// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      await import('@tailwindcss/vite').then(m => m.default()),
    ],
  },

  modules: ['@nuxtjs/supabase'],
})