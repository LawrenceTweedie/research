export default defineEventHandler(async () => {
  const baseData = loadBaseData()
  const marketsRes = baseData.markets
  const searchRes = baseData.search

  // Для каждого рынка загружаем данные
  const markets = []

  for (const [marketId, marketName] of Object.entries(marketsRes)) {
    try {
      const newsData = loadDataFile(`${marketId}_news.json`) || {}
      const regionData = loadDataFile(`${marketId}_region.json`) || {}

      // Получаем агрегированные данные по всей России
      const firstRegion = Object.keys(regionData)[0]
      const metrics = firstRegion ? regionData[firstRegion] : {}

      // Определяем emotion для AI и экспертов
      let emotionAI = 'neutral'
      let emotionExperts = 'neutral'

      if (newsData.emotion_ai || newsData.emotion_experts) {
        emotionAI = newsData.emotion_ai || 'neutral'
        emotionExperts = newsData.emotion_experts || 'neutral'
      } else if (newsData.emotion) {
        emotionAI = newsData.emotion
        emotionExperts = newsData.emotion
      }

      markets.push({
        id: marketId,
        title: marketName,
        emotionAI,
        emotionExperts,
        metrics: {
          marketVolume: metrics['Объем рынка 2024'] || null,
          investmentVolume: metrics['Объем инвестиций в основной капитал 2024'] || null,
          profitability: metrics['Рентабельность рынка 2024'] || null,
          instability: metrics['Уровень финансовой нестабильности (Индекс Ниши) 2024'] || null
        },
        link: `/${marketId}`,
        category: marketName,
        regions: searchRes[marketName] || []
      })
    } catch (error) {
      console.error(`Error loading data for market ${marketId}:`, error)
    }
  }

  return markets
})
