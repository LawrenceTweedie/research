import fs from 'fs'
import path from 'path'

// Кэш для общих файлов
const cache = new Map<string, any>()

function getMarketFile(marketId: string, type: string) {
  try {
    const filePath = path.resolve(process.cwd(), `public/data/${marketId}_${type}.json`)
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return type === 'okv' || type === 'top10' ? [] : {}
  }
}

export default defineEventHandler((event) => {
  try {
    const marketId = getRouterParam(event, 'id')
    const regionId = getRouterParam(event, 'regionId')

    if (!marketId || !regionId) {
      throw createError({ statusCode: 400, message: 'Market ID and Region ID required' })
    }

    // Загружаем общие данные с кэшированием
    if (!cache.has('markets')) {
      const filePath = path.resolve(process.cwd(), 'public/data/markets.json')
      cache.set('markets', JSON.parse(fs.readFileSync(filePath, 'utf-8')))
    }
    if (!cache.has('regions')) {
      const filePath = path.resolve(process.cwd(), 'public/data/regions.json')
      cache.set('regions', JSON.parse(fs.readFileSync(filePath, 'utf-8')))
    }
    if (!cache.has('search')) {
      const filePath = path.resolve(process.cwd(), 'public/data/search.json')
      cache.set('search', JSON.parse(fs.readFileSync(filePath, 'utf-8')))
    }

    const marketsData = cache.get('markets')
    const regionsData = cache.get('regions')
    const searchData = cache.get('search')

    const activities = getMarketFile(marketId, 'okv')
    const newsData = getMarketFile(marketId, 'news')
    const regionDataAll = getMarketFile(marketId, 'region')
    const regionsTop10Data = getMarketFile(marketId, 'regions_top10')

    // Обрабатываем новости
    const news = []
    let i = 1
    while (newsData[`header ${i}`]) {
      news.push({
        title: newsData[`header ${i}`],
        link: newsData[`link ${i}`]
      })
      i++
    }

    // Получаем название рынка
    const invertedMapping = Object.fromEntries(
      Object.entries(marketsData).map(([name, id]) => [id, name])
    )
    const marketName = invertedMapping[marketId] || 'Неизвестный рынок'

    // Находим регион по ID
    const region = regionsData.find((r: [string, string]) => r[0] === regionId)
    const regionName = region ? region[1] : 'Неизвестный регион'

    // Получаем данные для этого региона
    const companies = regionsTop10Data[regionName] || []
    const metrics = regionDataAll[regionName] || {}

    // Получаем доступные регионы
    const regionNames = searchData[marketName] || []
    const availableRegions = regionsData.filter((r: [string, string]) =>
      regionNames.includes(r[1])
    )

    return {
      marketName,
      regionName,
      activities,
      news,
      newsEmotion: newsData?.emotion || 'нейтрально',
      companies,
      metrics,
      availableRegions
    }
  } catch (error) {
    console.error('[API /market-data/[id]/[regionId]] Error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to load market data: ${error.message}`
    })
  }
})
