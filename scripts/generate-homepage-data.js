import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Функция для определения emotion из текста
const parseEmotion = (emotionText) => {
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
const formatNumber = (num) => {
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

async function generateHomepageData() {
  console.log('🚀 Generating homepage-summary.json...')

  const dataDir = join(__dirname, '../public/data')

  try {
    // Загружаем основные файлы
    console.log('📥 Loading markets.json and search.json...')
    const marketsContent = await readFile(join(dataDir, 'markets.json'), 'utf-8')
    const searchContent = await readFile(join(dataDir, 'search.json'), 'utf-8')

    const markets = JSON.parse(marketsContent)
    const search = JSON.parse(searchContent)

    console.log(`📊 Found ${Object.keys(markets).length} markets`)

    // Обрабатываем каждый рынок
    const homepageData = []
    let processed = 0
    let errors = 0

    for (const [marketName, marketId] of Object.entries(markets)) {
      try {
        // Загружаем данные новостей и регионов
        const newsContent = await readFile(join(dataDir, `${marketId}_news.json`), 'utf-8')
        const regionContent = await readFile(join(dataDir, `${marketId}_region.json`), 'utf-8')

        const newsData = JSON.parse(newsContent)
        const regionData = JSON.parse(regionContent)

        // Получаем агрегированные данные по всей России (первый регион)
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

        // Создаем компактную запись для рынка
        homepageData.push({
          id: marketId,
          title: marketName,
          emotionAI,
          emotionExperts,
          marketVolume: metrics['Объем рынка 2024'] ? `${formatNumber(metrics['Объем рынка 2024'])} тыс. руб.` : 'н/д',
          investmentVolume: metrics['Объем инвестиций в основной капитал 2024'] ? `${formatNumber(metrics['Объем инвестиций в основной капитал 2024'])} тыс. руб.` : 'н/д',
          profitability: metrics['Рентабельность рынка 2024'] ? `${metrics['Рентабельность рынка 2024']}%` : 'н/д',
          instability: metrics['Уровень финансовой нестабильности (Индекс Ниши) 2024'] ? `${metrics['Уровень финансовой нестабильности (Индекс Ниши) 2024']}%` : 'н/д',
          link: `/${marketId}`,
          category: marketName,
          regions: search[marketName] || []
        })

        processed++
        if (processed % 20 === 0) {
          console.log(`✅ Processed ${processed}/${Object.keys(markets).length} markets`)
        }
      } catch (error) {
        console.error(`❌ Error processing market ${marketId} (${marketName}):`, error.message)
        errors++
      }
    }

    // Сохраняем результат
    const outputPath = join(dataDir, 'homepage-summary.json')
    await writeFile(outputPath, JSON.stringify(homepageData, null, 2), 'utf-8')

    console.log(`\n✨ Successfully generated homepage-summary.json`)
    console.log(`📈 Stats:`)
    console.log(`   - Total markets: ${Object.keys(markets).length}`)
    console.log(`   - Successfully processed: ${processed}`)
    console.log(`   - Errors: ${errors}`)
    console.log(`   - Output file: ${outputPath}`)

    // Подсчитываем размер файла
    const stats = await import('fs').then(m => m.promises.stat(outputPath))
    const fileSizeKB = (stats.size / 1024).toFixed(2)
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)
    console.log(`   - File size: ${fileSizeKB} KB (${fileSizeMB} MB)`)

    // Сравнение с оригинальными файлами
    console.log(`\n💡 Optimization impact:`)
    console.log(`   - Before: 404 JSON files (~136 MB)`)
    console.log(`   - After: 1 JSON file (~${fileSizeMB} MB)`)
    const reduction = (((136 - parseFloat(fileSizeMB)) / 136) * 100).toFixed(1)
    console.log(`   - Reduction: ~${reduction}%`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Запускаем генерацию
generateHomepageData()
