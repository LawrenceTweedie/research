// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'INRESEARCH - Все рынки России',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Данные о рынках России и её регионов' }
      ],
      link: [
        { rel: 'preload', href: '/fonts/unbounded-regular.woff2', as: 'font', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/unbounded-600.woff2', as: 'font', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/inter-regular.woff2', as: 'font', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: '/css/style.css' }
      ],
      script: [
        // Подключение vendor скриптов если они есть
        // { src: '/js/vendor.min.js', defer: true }
      ]
    }
  },

  // Подключение CSS файлов
  css: [
    '~/assets/css/main.css',
    '~/assets/css/style.css'
  ],

  // Плагины для клиентской стороны
  plugins: [
    '~/plugins/main.client.js'
  ],

  // Оптимизация
  nitro: {
    esbuild: {
      options: {
        target: 'es2020'
      }
    }
  }
})
