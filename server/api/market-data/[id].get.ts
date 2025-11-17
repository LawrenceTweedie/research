export default defineEventHandler((event) => {
  const marketId = getRouterParam(event, 'id')

  if (!marketId) {
    throw createError({ statusCode: 400, message: 'Market ID required' })
  }

  const marketsData = getMarketsData()
  const regionsData = getRegionsData()
  const searchData = getSearchData()

  const activities = getMarketFile(marketId, 'okv')
  const newsData = getMarketFile(marketId, 'news')
  const companies = getMarketFile(marketId, 'top10')
  const metrics = getMarketFile(marketId, 'metrics')

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

  // Получаем доступные регионы
  const regionNames = searchData[marketName] || []
  const availableRegions = regionsData.filter((r: [string, string]) =>
    regionNames.includes(r[1])
  )

  return {
    marketName,
    activities,
    news,
    newsEmotion: newsData?.emotion || 'нейтрально',
    companies,
    metrics,
    availableRegions
  }
})
