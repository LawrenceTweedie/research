import fs from 'fs'
import path from 'path'

// Кэш для общих файлов, чтобы не читать их каждый раз
const cache = new Map<string, any>()

export function getMarketsData() {
  if (cache.has('markets')) {
    return cache.get('markets')
  }

  const filePath = path.resolve(process.cwd(), 'public/data/markets.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  cache.set('markets', data)
  return data
}

export function getRegionsData() {
  if (cache.has('regions')) {
    return cache.get('regions')
  }

  const filePath = path.resolve(process.cwd(), 'public/data/regions.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  cache.set('regions', data)
  return data
}

export function getSearchData() {
  if (cache.has('search')) {
    return cache.get('search')
  }

  const filePath = path.resolve(process.cwd(), 'public/data/search.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  cache.set('search', data)
  return data
}

export function getMarketFile(marketId: string, type: string) {
  try {
    const filePath = path.resolve(process.cwd(), `public/data/${marketId}_${type}.json`)
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return type === 'okv' || type === 'top10' ? [] : {}
  }
}
