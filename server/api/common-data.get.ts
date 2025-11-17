import fs from 'fs'
import path from 'path'

// Глобальный кеш для общих данных
let cachedData = null

export default defineEventHandler(async () => {
  // Если данные уже в кеше, возвращаем их
  if (cachedData) {
    return cachedData
  }

  // Загружаем данные один раз
  const publicDir = path.resolve(process.cwd(), 'public/data')

  try {
    const searchData = JSON.parse(
      fs.readFileSync(path.join(publicDir, 'search.json'), 'utf-8')
    )
    const regionsData = JSON.parse(
      fs.readFileSync(path.join(publicDir, 'regions.json'), 'utf-8')
    )
    const marketsIdMapping = JSON.parse(
      fs.readFileSync(path.join(publicDir, 'markets.json'), 'utf-8')
    )

    // Сохраняем в кеш
    cachedData = {
      searchData,
      regionsData,
      marketsIdMapping
    }

    console.log('✅ Common data loaded and cached')
    return cachedData
  } catch (error) {
    console.error('❌ Failed to load common data:', error)
    throw error
  }
})
