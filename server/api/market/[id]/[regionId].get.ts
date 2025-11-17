import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const marketId = getRouterParam(event, 'id')
  const regionId = getRouterParam(event, 'regionId')

  if (!marketId || !regionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Market ID and Region ID are required'
    })
  }

  try {
    const dataDir = path.resolve(process.cwd(), 'public/data')

    // Функция для безопасного чтения JSON файла
    const readJsonFile = async (filename: string) => {
      try {
        const filePath = path.join(dataDir, filename)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(fileContent)
      } catch (error) {
        console.warn(`Файл ${filename} не найден или поврежден`)
        return null
      }
    }

    // Загружаем все данные параллельно
    const [
      activities,
      newsData,
      regionsTop10Data,
      regionData,
      searchData,
      regionsData,
      marketsData
    ] = await Promise.all([
      readJsonFile(`${marketId}_okv.json`),
      readJsonFile(`${marketId}_news.json`),
      readJsonFile(`${marketId}_regions_top10.json`),
      readJsonFile(`${marketId}_region.json`),
      readJsonFile('search.json'),
      readJsonFile('regions.json'),
      readJsonFile('markets.json')
    ])

    // Обрабатываем новости
    const news = []
    if (newsData) {
      let i = 1
      while (newsData[`header ${i}`]) {
        news.push({
          title: newsData[`header ${i}`],
          link: newsData[`link ${i}`]
        })
        i++
      }
    }

    // Получаем название рынка
    let marketName = 'Неизвестный рынок'
    if (marketsData) {
      const invertedMapping = Object.fromEntries(
        Object.entries(marketsData).map(([name, id]) => [id, name])
      )
      marketName = invertedMapping[marketId] || 'Неизвестный рынок'
    }

    // Находим регион по ID
    const region = regionsData?.find((r: [string, string]) => r[0] === regionId)
    const regionName = region ? region[1] : 'Неизвестный регион'

    // Получаем компании для этого региона
    let companies = []
    if (regionsTop10Data && regionName && regionsTop10Data[regionName]) {
      companies = regionsTop10Data[regionName]
    }

    // Получаем метрики для этого региона
    let metrics = {}
    if (regionData && regionName && regionData[regionName]) {
      metrics = regionData[regionName]
    }

    // Получаем доступные регионы для этого рынка
    let availableRegions = []
    if (searchData && regionsData && marketName) {
      const regionNames = searchData[marketName] || []
      availableRegions = regionsData.filter((r: [string, string]) =>
        regionNames.includes(r[1])
      )
    }

    return {
      success: true,
      data: {
        marketId,
        marketName,
        regionId,
        regionName,
        activities: activities || [],
        news: news || [],
        newsEmotion: newsData?.emotion || 'нейтрально',
        companies: companies || [],
        metrics: metrics || {},
        availableRegions: availableRegions || []
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки региональных данных рынка:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load regional market data'
    })
  }
})
