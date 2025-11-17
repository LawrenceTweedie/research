import { getMarketsData, getRegionsData, getSearchData, getMarketFile } from '../../../utils/marketData'

export default defineEventHandler((event) => {
  const marketId = getRouterParam(event, 'id')
  const regionId = getRouterParam(event, 'regionId')

  if (!marketId || !regionId) {
    throw createError({ statusCode: 400, message: 'Market ID and Region ID required' })
  }

  const marketsData = getMarketsData()
  const regionsData = getRegionsData()
  const searchData = getSearchData()

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
})
