import fs from 'fs'
import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Включаем SSR для статической генерации
  ssr: true,

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

  // Оптимизация и настройка SSG
  nitro: {
    esbuild: {
      options: {
        target: 'es2020'
      }
    },
    prerender: {
      // Включаем автоматическое сканирование ссылок
      crawlLinks: true,
      // Маршруты будут добавлены через хук ниже
      routes: ['/']
    }
  },

  // Хук для генерации всех маршрутов при билде
  hooks: {
    'nitro:config'(nitroConfig) {
      try {
        // Читаем данные из JSON файлов
        const publicDir = path.resolve(__dirname, 'public/data')

        const searchData = JSON.parse(
          fs.readFileSync(path.join(publicDir, 'search.json'), 'utf-8')
        )
        const regionsData = JSON.parse(
          fs.readFileSync(path.join(publicDir, 'regions.json'), 'utf-8')
        )
        const marketsData = JSON.parse(
          fs.readFileSync(path.join(publicDir, 'markets.json'), 'utf-8')
        )

        const routes = ['/']

        // Генерируем маршруты для каждой комбинации market + region
        for (const [marketId, marketName] of Object.entries(marketsData)) {
          // Добавляем страницу "вся Россия" для рынка
          routes.push(`/${marketId}`)

          // Находим регионы для этого рынка
          const regionsForMarket = searchData[marketName] || []

          // Для каждого региона создаем маршрут
          for (const regionName of regionsForMarket) {
            const regionEntry = regionsData.find(([id, name]) => name === regionName)
            if (regionEntry) {
              const regionId = regionEntry[0]
              routes.push(`/${marketId}/${regionId}`)
            }
          }
        }

        console.log(`📦 Генерация ${routes.length} статических страниц...`)

        // Добавляем маршруты в конфигурацию
        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.routes = routes

      } catch (error) {
        console.error('❌ Ошибка при генерации маршрутов:', error)
      }
    }
  }
})
