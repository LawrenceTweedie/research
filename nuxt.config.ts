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
      crawlLinks: false, // Отключаем, так как мы генерируем все маршруты явно
      // Оптимальный параллелизм с серверным API и кэшированием
      concurrency: 20, // Генерируем по 20 страниц одновременно
      // Маршруты будут добавлены через хук ниже
      routes: ['/'],
      // Retry для неудачных запросов
      retry: 3,
      retryDelay: 1000,
      interval: 0,
      failOnError: false // Продолжаем генерацию даже при ошибках
    },
    // Оптимизация для быстрой генерации
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    minify: true
  },

  // Оптимизация рендеринга
  experimental: {
    payloadExtraction: true, // Извлекаем payload в отдельные файлы для уменьшения HTML
    renderJsonPayloads: true
  },

  // Оптимизация роутинга
  router: {
    options: {
      strict: true
    }
  },

  // Хук для генерации всех маршрутов при билде
  hooks: {
    'nitro:config'(nitroConfig) {
      try {
        console.log('🚀 Начало генерации маршрутов для SSG...')
        const startTime = Date.now()

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
        let marketCount = 0
        let regionalCount = 0

        // Валидация загруженных данных
        if (typeof marketsData !== 'object' || Array.isArray(marketsData)) {
          console.error('❌ marketsData должен быть объектом, получен:', typeof marketsData)
          return
        }

        if (!Array.isArray(regionsData)) {
          console.error('❌ regionsData должен быть массивом, получен:', typeof regionsData)
          return
        }

        // Генерируем маршруты для каждой комбинации market + region
        for (const [marketName, marketId] of Object.entries(marketsData)) {
          // Валидация данных
          if (typeof marketName !== 'string' || marketName.length === 0) {
            console.warn('⚠️ Пропуск некорректного названия рынка:', marketName)
            continue
          }

          if (!marketId || (typeof marketId !== 'number' && typeof marketId !== 'string')) {
            console.warn('⚠️ Пропуск некорректного ID рынка:', marketId, 'для рынка:', marketName)
            continue
          }

          // Добавляем страницу "вся Россия" для рынка
          routes.push(`/${marketId}`)
          marketCount++

          // Находим регионы для этого рынка
          const regionsForMarket = searchData[marketName] || []

          // Валидация что это массив
          if (!Array.isArray(regionsForMarket)) {
            console.warn('⚠️ regionsForMarket не массив для рынка:', marketName)
            continue
          }

          // Для каждого региона создаем маршрут
          for (const regionName of regionsForMarket) {
            if (typeof regionName !== 'string') {
              console.warn('⚠️ Некорректное название региона:', regionName)
              continue
            }

            const regionEntry = regionsData.find(([id, name]) => name === regionName)
            if (regionEntry) {
              const regionId = regionEntry[0]
              routes.push(`/${marketId}/${regionId}`)
              regionalCount++
            }
          }
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
        console.log(`✅ Маршруты сгенерированы за ${elapsed}s`)
        console.log(`📊 Статистика:`)
        console.log(`   - Главная страница: 1`)
        console.log(`   - Страницы рынков (Россия): ${marketCount}`)
        console.log(`   - Региональные страницы: ${regionalCount}`)
        console.log(`   - Всего страниц: ${routes.length}`)
        console.log(`📦 Начало SSG генерации с concurrency=${nitroConfig.prerender?.concurrency || 1}...`)

        // Добавляем маршруты в конфигурацию
        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.routes = routes

      } catch (error) {
        console.error('❌ Ошибка при генерации маршрутов:', error)
      }
    }
  }
})
