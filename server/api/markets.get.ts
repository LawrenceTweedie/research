import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const publicDir = join(process.cwd(), 'public/data')

    // Загружаем основные данные
    const marketsData = JSON.parse(
      await readFile(join(publicDir, 'markets.json'), 'utf-8')
    )
    const searchData = JSON.parse(
      await readFile(join(publicDir, 'search.json'), 'utf-8')
    )

    // Функция для определения emotion из текста
    const parseEmotion = (emotionText: string | undefined): string => {
      if (!emotionText) return 'neutral'
      const text = emotionText.toLowerCase()
      if (text.includes('позитив') || text.includes('положительно')) {
        return 'positive'
      } else if (text.includes('негатив') || text.includes('отрицательно')) {
        return 'negative'
      }
      return 'neutral'
    }

    // Форматирование чисел
    const formatNumber = (num: any): string => {
      if (!num && num !== 0) return '0'
      if (typeof num === 'string' && num.includes(' ')) {
        return num
      }
      if (typeof num === 'string') {
        num = num.replace(/\s/g, '')
        num = parseFloat(num)
      }
      return new Intl.NumberFormat('ru-RU').format(num)
    }

    // Для каждого рынка загружаем данные
    const marketPromises = Object.entries(marketsData).map(async ([marketId, marketName]) => {
      try {
        const newsData = JSON.parse(
          await readFile(join(publicDir, `${marketId}_news.json`), 'utf-8')
        )
        const regionData = JSON.parse(
          await readFile(join(publicDir, `${marketId}_region.json`), 'utf-8')
        )

        // Получаем агрегированные данные по всей России
        const firstRegion = Object.keys(regionData)[0]
        const metrics = firstRegion ? regionData[firstRegion] : {}

        // Определяем emotion для AI и экспертов
        let emotionAI = 'neutral'
        let emotionExperts = 'neutral'

        if (newsData.emotion_ai || newsData.emotion_experts) {
          emotionAI = parseEmotion(newsData.emotion_ai)
          emotionExperts = parseEmotion(newsData.emotion_experts)
        } else if (newsData.emotion) {
          const commonEmotion = parseEmotion(newsData.emotion)
          emotionAI = commonEmotion
          emotionExperts = commonEmotion
        }

        return {
          id: marketId,
          title: marketName,
          emotionAI,
          emotionExperts,
          marketVolume: metrics['Объем рынка 2024'] ? `${formatNumber(metrics['Объем рынка 2024'])} тыс. руб.` : 'н/д',
          investmentVolume: metrics['Объем инвестиций в основной капитал 2024'] ? `${formatNumber(metrics['Объем инвестиций в основной капитал 2024'])} тыс. руб.` : 'н/д',
          profitability: metrics['Рентабельность рынка 2024'] ? `${metrics['Рентабельность рынка 2024']}%` : 'н/д',
          instability: metrics['Уровень финансовой нестабильности (Индекс Ниши) 2024'] ? `${metrics['Уровень финансовой нестабильности (Индекс Ниши) 2024']}%` : 'н/д',
          link: `/${marketId}`,
          category: marketName as string,
          regions: searchData[marketName as string] || []
        }
      } catch (error) {
        console.error(`Error loading data for market ${marketId}:`, error)
        return null
      }
    })

    const markets = await Promise.all(marketPromises)
    return markets.filter(m => m !== null)
  } catch (error) {
    console.error('Error loading markets data:', error)
    return []
  }
})
