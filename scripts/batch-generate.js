import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Настройки
const BATCH_SIZE = 100 // Генерировать по 100 страниц за раз (оптимально для памяти)
const OUTPUT_DIR = path.resolve(__dirname, '../.output')
const FINAL_OUTPUT = path.resolve(__dirname, '../.output-final')

console.log('🚀 Запуск батчевой генерации статических страниц...\n')

// Функция для копирования директории рекурсивно
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return

  // Создаем целевую директорию если не существует
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Читаем данные для получения всех маршрутов
const publicDir = path.resolve(__dirname, '../public/data')
const searchData = JSON.parse(fs.readFileSync(path.join(publicDir, 'search.json'), 'utf-8'))
const regionsData = JSON.parse(fs.readFileSync(path.join(publicDir, 'regions.json'), 'utf-8'))
const marketsData = JSON.parse(fs.readFileSync(path.join(publicDir, 'markets.json'), 'utf-8'))

// Генерируем список всех маршрутов
const routes = ['/']

for (const [marketName, marketId] of Object.entries(marketsData)) {
  if (typeof marketName !== 'string' || !marketId) continue

  // Добавляем страницу "вся Россия"
  routes.push(`/${marketId}`)

  // Добавляем региональные страницы
  const regionsForMarket = searchData[marketName] || []
  if (Array.isArray(regionsForMarket)) {
    for (const regionName of regionsForMarket) {
      const regionEntry = regionsData.find(([id, name]) => name === regionName)
      if (regionEntry) {
        routes.push(`/${marketId}/${regionEntry[0]}`)
      }
    }
  }
}

console.log(`📋 Всего маршрутов для генерации: ${routes.length}`)
console.log(`📦 Размер батча: ${BATCH_SIZE} страниц`)

// Разбиваем маршруты на батчи
const batches = []
for (let i = 0; i < routes.length; i += BATCH_SIZE) {
  batches.push(routes.slice(i, i + BATCH_SIZE))
}

console.log(`🔢 Количество батчей: ${batches.length}\n`)

// Очищаем старую финальную директорию
if (fs.existsSync(FINAL_OUTPUT)) {
  console.log('🧹 Очистка старой финальной директории...')
  fs.rmSync(FINAL_OUTPUT, { recursive: true, force: true })
}

// Создаем финальную директорию
fs.mkdirSync(FINAL_OUTPUT, { recursive: true })

// Генерируем каждый батч
for (let i = 0; i < batches.length; i++) {
  const batch = batches[i]
  const batchNum = i + 1

  console.log(`\n${'='.repeat(60)}`)
  console.log(`⚡ Батч ${batchNum}/${batches.length}: генерация ${batch.length} страниц...`)
  console.log(`${'='.repeat(60)}\n`)

  // Очищаем временную директорию перед каждым батчом
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
  }

  // Сохраняем маршруты текущего батча во временный файл
  const batchFile = path.resolve(__dirname, '../.batch-routes.json')
  fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2))

  try {
    // Запускаем Nuxt generate с текущим батчом
    const startTime = Date.now()

    execSync(
      `node --max-old-space-size=16384 --expose-gc ./node_modules/nuxt/bin/nuxt.mjs generate`,
      {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..'),
        env: {
          ...process.env,
          BATCH_MODE: 'true',
          BATCH_FILE: batchFile
        }
      }
    )

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`\n✅ Батч ${batchNum} завершен за ${duration}s`)

    // Копируем результаты в финальную директорию
    console.log('📋 Копирование результатов батча в финальную директорию...')
    const publicOutput = path.join(OUTPUT_DIR, 'public')
    const finalPublic = path.join(FINAL_OUTPUT, 'public')

    copyDirRecursive(publicOutput, finalPublic)
    console.log('✓ Результаты скопированы')

    // Пауза между батчами для очистки памяти
    if (i < batches.length - 1) {
      console.log('⏳ Пауза 5 секунд для полной очистки памяти...')
      // Явно вызываем сборку мусора если доступно
      if (global.gc) {
        console.log('🧹 Запуск принудительной сборки мусора...')
        global.gc()
      }
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

  } catch (error) {
    console.error(`❌ Ошибка при генерации батча ${batchNum}:`, error.message)
    process.exit(1)
  } finally {
    // Удаляем временный файл
    if (fs.existsSync(batchFile)) {
      fs.unlinkSync(batchFile)
    }
  }
}

// Копируем также server и другие необходимые файлы из последнего батча
console.log('\n📦 Копирование дополнительных файлов сборки...')
if (fs.existsSync(OUTPUT_DIR)) {
  const entries = fs.readdirSync(OUTPUT_DIR)
  for (const entry of entries) {
    if (entry !== 'public') {
      const srcPath = path.join(OUTPUT_DIR, entry)
      const destPath = path.join(FINAL_OUTPUT, entry)
      if (fs.statSync(srcPath).isDirectory()) {
        copyDirRecursive(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }
}

// Переименовываем финальную директорию в .output
console.log('\n📁 Финализация...')
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
}
fs.renameSync(FINAL_OUTPUT, OUTPUT_DIR)

console.log('\n' + '='.repeat(60))
console.log('🎉 Генерация всех страниц завершена!')
console.log(`📊 Всего сгенерировано: ${routes.length} страниц`)
console.log(`📂 Результат: ${OUTPUT_DIR}/public`)
console.log('='.repeat(60))
