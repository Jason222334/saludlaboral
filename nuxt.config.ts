// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-12-04', // Agregamos la fecha que pide la terminal
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon'
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
    n8nWebhookConceptUrl: process.env.N8N_WEBHOOK_CONCEPT_URL,
    n8nWebhookLowStockUrl: process.env.N8N_WEBHOOK_LOW_STOCK_URL || 'http://localhost:5678/webhook/low-stock-alert',
    public: {
      apiBase: '/api'
    }
  },
  // Forzamos a Nuxt a escanear las páginas en la raíz
  srcDir: '.',
})