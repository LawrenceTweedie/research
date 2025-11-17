import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const marketId = getRouterParam(event, 'id')

  if (!marketId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Market ID is required'
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
      companies,
      metrics,
      searchData,
      regionsData,
      marketsData
    ] = await Promise.all([
      readJsonFile(`${marketId}_okv.json`),
      readJsonFile(`${marketId}_news.json`),
      readJsonFile(`${marketId}_top10.json`),
      readJsonFile(`${marketId}_metrics.json`),
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
        activities: activities || [],
        news: news || [],
        newsEmotion: newsData?.emotion || 'нейтрально',
        companies: companies || [],
        metrics: metrics || {},
        availableRegions: availableRegions || []
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки данных рынка:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load market data'
    })
  }
})
