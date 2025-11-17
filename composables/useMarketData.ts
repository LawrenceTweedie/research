// In-memory кеш для общих данных
const cache = {
  searchData: null as any,
  regionsData: null as any,
  marketsIdMapping: null as any,
  loading: false
}

/**
 * Композабл для загрузки и кеширования общих данных рынков
 */
export async function useCommonMarketData() {
  // Если данные уже загружены, возвращаем из кеша
  if (cache.searchData && cache.regionsData && cache.marketsIdMapping) {
    return {
      searchData: cache.searchData,
      regionsData: cache.regionsData,
      marketsIdMapping: cache.marketsIdMapping
    }
  }

  // Предотвращаем параллельные загрузки
  if (cache.loading) {
    // Ждем пока данные загрузятся
    while (cache.loading) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    return {
      searchData: cache.searchData,
      regionsData: cache.regionsData,
      marketsIdMapping: cache.marketsIdMapping
    }
  }

  cache.loading = true

  try {
    // Загружаем один раз и кешируем
    const [searchData, regionsData, marketsIdMapping] = await Promise.all([
      $fetch('/data/search.json'),
      $fetch('/data/regions.json'),
      $fetch('/data/markets.json')
    ])

    cache.searchData = searchData
    cache.regionsData = regionsData
    cache.marketsIdMapping = marketsIdMapping

    return { searchData, regionsData, marketsIdMapping }
  } finally {
    cache.loading = false
  }
}

/**
 * Загрузка данных конкретного рынка
 */
export async function useMarketSpecificData(marketId: string, regionId?: string) {
  const data = {
    activities: [] as any[],
    news: [] as any[],
    newsEmotion: 'нейтрально',
    companies: [] as any[],
    metrics: {} as any
  }

  try {
    // Виды деятельности
    try {
      data.activities = await $fetch(`/data/${marketId}_okv.json`)
    } catch (e) {
      data.activities = []
    }

    // Новости
    try {
      const newsData = await $fetch(`/data/${marketId}_news.json`)
      const newsArray = []
      let i = 1
      while (newsData[`header ${i}`]) {
        newsArray.push({
          title: newsData[`header ${i}`],
          link: newsData[`link ${i}`]
        })
        i++
      }
      data.news = newsArray
      data.newsEmotion = newsData.emotion || 'нейтрально'
    } catch (e) {
      data.news = []
      data.newsEmotion = 'нейтрально'
    }

    // Компании и метрики зависят от региона
    if (regionId) {
      // Для конкретного региона
      try {
        const [regionsTop10Data, regionData] = await Promise.all([
          $fetch(`/data/${marketId}_regions_top10.json`),
          $fetch(`/data/${marketId}_region.json`)
        ])

        const { regionsData } = await useCommonMarketData()
        const region = regionsData.find((r: any) => r[0] === regionId)

        if (region) {
          if (regionsTop10Data[region[1]]) {
            data.companies = regionsTop10Data[region[1]]
          }
          if (regionData[region[1]]) {
            data.metrics = regionData[region[1]]
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    } else {
      // Для всей России
      try {
        const [companiesData, metricsData] = await Promise.all([
          $fetch(`/data/${marketId}_top10.json`).catch(() => []),
          $fetch(`/data/${marketId}_metrics.json`).catch(() => ({}))
        ])

        data.companies = companiesData
        data.metrics = metricsData
      } catch (e) {
        // Игнорируем ошибки
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки данных рынка:', error)
  }

  return data
}
