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
  
  // App config
  app: {
    head: {
      title: 'Movie Portal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Descubra os melhores filmes e séries' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz',
          crossorigin: 'anonymous'
        }
      ]
    }
  }
})