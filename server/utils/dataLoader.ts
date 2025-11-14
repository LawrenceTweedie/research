import fs from 'fs'
import path from 'path'

const publicDir = path.resolve(process.cwd(), 'public/data')

/**
 * Загружает JSON файл из директории public/data
 */
export function loadDataFile<T = any>(filename: string): T | null {
  try {
    const filePath = path.join(publicDir, filename)
    if (!fs.existsSync(filePath)) {
      return null
    }
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch (error) {
    console.error(`Ошибка загрузки файла ${filename}:`, error)
    return null
  }
}

/**
 * Загружает основные данные для SSG
 */
export function loadBaseData() {
  return {
    search: loadDataFile('search.json') || {},
    regions: loadDataFile('regions.json') || [],
    markets: loadDataFile('markets.json') || {}
  }
}

/**
 * Загружает данные для конкретного рынка
 */
export function loadMarketData(marketId: string) {
  return {
    okv: loadDataFile(`${marketId}_okv.json`) || [],
    news: loadDataFile(`${marketId}_news.json`) || {},
    top10: loadDataFile(`${marketId}_top10.json`) || [],
    metrics: loadDataFile(`${marketId}_metrics.json`) || {},
    regionsTop10: loadDataFile(`${marketId}_regions_top10.json`) || {},
    region: loadDataFile(`${marketId}_region.json`) || {}
  }
}
