// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Configuração do SSR
  ssr: true,
  
  // Modules
  modules: [
    '@pinia/nuxt'
  ],
  
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  
  // CSS Global
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  
  // Runtime Config para variáveis de ambiente
  runtimeConfig: {
    // Chaves privadas (só disponíveis no servidor)
    private: {},
    
    // Chaves públicas (expostas no cliente)
    public: {
      tmdbApiKey: process.env.TMDB_API_KEY,
      tmdbBaseUrl: 'https://api.themoviedb.org/3',
      tmdbImageUrl: 'https://image.tmdb.org/t/p'
    }
  },

  // ===== OTIMIZAÇÕES DE PERFORMANCE (VÁLIDAS) =====
  
  // Build optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  // Experimental features (só as que existem)
  experimental: {
    payloadExtraction: false
  },

  // Vite optimizations (simplificadas)
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'bootstrap': ['bootstrap'],
            'pinia': ['pinia']
          }
        }
      }
    }
  },

  // Route rules para cache
  routeRules: {
    '/': { isr: 3600 },
    '/movie/**': { isr: 1800 },
    '/favoritos': { ssr: true }
  },
  
  // App config
  app: {
    head: {
      title: 'Movie Portal',
      htmlAttrs: {
        lang: 'pt-BR' // Define o idioma do HTML
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Descubra os melhores filmes e séries' },
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' }
      ],
      link: [
        // Preconnect para APIs externas
        { rel: 'preconnect', href: 'https://api.themoviedb.org' },
        { rel: 'preconnect', href: 'https://image.tmdb.org' },
        { rel: 'dns-prefetch', href: 'https://api.themoviedb.org' },
        { rel: 'dns-prefetch', href: 'https://image.tmdb.org' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz',
          crossorigin: 'anonymous',
          defer: true
        }
      ]
    }
  }
})