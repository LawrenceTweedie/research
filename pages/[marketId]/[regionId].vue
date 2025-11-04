<template>
  <div class="market-page">
    <div class="container">
      <!-- Заголовок рынка -->
      <section class="market-info">
        <div class="market-info__header">
          <div>
            <h1 class="market-info__title">{{ marketName }}</h1>
            <p class="market-info__subtitle">{{ regionName }}</p>
          </div>
        </div>

        <!-- Описание рынка -->
        <div class="market-description" v-if="marketDescription">
          <p class="market-description__text" :class="{ 'market-description__text--expanded': descriptionExpanded }">
            {{ marketDescription }}
          </p>
          <button
            class="market-description__toggle"
            @click="descriptionExpanded = !descriptionExpanded"
            v-if="marketDescription.length > 200"
          >
            {{ descriptionExpanded ? 'Свернуть' : 'Показать больше' }}
          </button>
        </div>

        <!-- Выбор региона -->
        <div class="region-selector" v-if="availableRegions.length > 0">
          <label>Выберите регион:</label>
          <select v-model="selectedRegionId" @change="changeRegion">
            <option value="">Вся Россия</option>
            <option v-for="region in availableRegions" :key="region[0]" :value="region[0]">
              {{ region[1] }}
            </option>
          </select>
        </div>
      </section>

      <!-- Виды деятельности -->
      <section class="activities" v-if="activities.length > 0">
        <h2 class="section-title">Виды деятельности</h2>
        <div class="activities-grid">
          <div v-for="(activity, index) in activities" :key="index" class="activity-card">
            {{ activity }}
          </div>
        </div>
      </section>

      <!-- Карточка рейтинга -->
      <section class="market-rating" v-if="newsEmotion">
        <div class="market-card" :class="`market-card--${emotionClass}`">
          <div class="market-card__content">
            <h3 class="market-card__title">Оценка рынка</h3>
            <div class="market-card__ratings">
              <div class="rating-item">
                <span class="rating-item__label">AI оценка:</span>
                <span class="rating-item__value">{{ newsEmotion }}</span>
              </div>
              <div class="rating-item">
                <span class="rating-item__label">Эксперты:</span>
                <span class="rating-item__value">{{ newsEmotion }}</span>
              </div>
            </div>
            <div class="market-card__metrics" v-if="Object.keys(metrics).length > 0">
              <div class="metric-item">
                <span class="metric-item__label">Объем рынка 2024:</span>
                <span class="metric-item__value">{{ formatNumber(metrics['Объем рынка 2024'] || 0) }} тыс. руб.</span>
              </div>
              <div class="metric-item">
                <span class="metric-item__label">Рентабельность:</span>
                <span class="metric-item__value">{{ metrics['Рентабельность рынка 2024'] || 'н/д' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Анализ новостей -->
      <section class="news-analysis" v-if="news.length > 0">
        <h2 class="section-title">Анализ новостей с помощью ИИ</h2>
        <p class="section-subtitle">Оценка: {{ newsEmotion }}</p>
        <div class="news-grid">
          <article v-for="(newsItem, index) in news" :key="index" class="news-card">
            <h3 class="news-card__title">{{ newsItem.title }}</h3>
            <a :href="newsItem.link" class="news-card__link" target="_blank" rel="noopener">
              Читать полностью →
            </a>
          </article>
        </div>
      </section>

      <!-- Источники -->
      <section class="sources" v-if="news.length > 0">
        <h2 class="section-title">Источники</h2>
        <ul class="sources-list">
          <li v-for="(newsItem, index) in news" :key="index" class="sources-item">
            <a :href="newsItem.link" target="_blank" rel="noopener" class="sources-link">
              <span class="sources-icon">🔗</span>
              {{ newsItem.title }}
            </a>
          </li>
        </ul>
      </section>

      <!-- Топ-10 компаний -->
      <section class="top-companies" v-if="companies.length > 0">
        <h2 class="section-title">Топ-10 компаний по выручке</h2>
        <div class="table-wrapper">
          <table class="companies-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Название компании</th>
                <th>Выручка (тыс. руб.)</th>
                <th>ИНН</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="company in companies" :key="company['ИНН']">
                <td>{{ company['Ранг'] }}</td>
                <td>{{ company['Название компании'] }}</td>
                <td>{{ formatNumber(company['Объем выручки 2024']) }}</td>
                <td>{{ company['ИНН'] }}</td>
              </tr>
              <tr v-for="i in Math.max(0, 10 - companies.length)" :key="`empty-${i}`">
                <td>{{ companies.length + i }}</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Показатели рынка -->
      <section class="market-metrics" v-if="Object.keys(metrics).length > 0">
        <div class="metrics-header">
          <h2 class="section-title">Показатели рынка (2020-2024)</h2>
          <div class="metrics-filter">
            <label for="indicator-select">Выбрать показатель:</label>
            <select id="indicator-select" v-model="selectedIndicator" class="indicator-select">
              <option value="">Все показатели</option>
              <option v-for="(metricData, metricName) in metricsFormatted" :key="metricName" :value="metricName">
                {{ metricName }}
              </option>
            </select>
          </div>
        </div>

        <div class="metrics-grid">
          <div
            v-for="(metricData, metricName) in filteredMetrics"
            :key="metricName"
            class="metric-card"
          >
            <h3 class="metric-card__title">{{ metricName }}</h3>
            <div class="metric-values">
              <div v-for="(value, year) in metricData" :key="year" class="metric-values__item">
                <span class="metric-values__year">{{ year }}:</span>
                <span class="metric-values__value">{{ value }}</span>
              </div>
            </div>
            <div class="metric-chart">
              <div v-for="(value, year) in metricData" :key="year" class="chart-bar">
                <div class="chart-bar__value" :style="{ height: `${calculateBarHeight(value, metricData)}%` }">
                  <span class="chart-bar__label">{{ value }}</span>
                </div>
                <div class="chart-bar__year">{{ year }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const marketId = computed(() => route.params.marketId)
const regionId = computed(() => route.params.regionId || '')

const searchData = ref({})
const regionsData = ref({})
const marketsIdMapping = ref({})
const marketName = ref('Загрузка...')
const regionName = ref('Вся Россия')
const selectedRegionId = ref(regionId.value)
const availableRegions = ref([])

// UI состояния
const descriptionExpanded = ref(false)
const selectedIndicator = ref('')

// Данные
const marketDescription = ref('Этот рынок представляет собой важный сегмент российской экономики, характеризующийся стабильным ростом и развитием. На протяжении последних лет наблюдается положительная динамика ключевых показателей.')
const activities = ref([])
const news = ref([])
const newsEmotion = ref('')
const companies = ref([])
const metrics = ref({})

// Загрузка данных
onMounted(async () => {
  try {
    // Загружаем основные данные
    const [searchRes, regionsRes, marketsIdRes] = await Promise.all([
      fetch('/data/search.json'),
      fetch('/data/regions.json'),
      fetch('/data/markets.json')
    ])

    searchData.value = await searchRes.json()
    regionsData.value = await regionsRes.json()
    marketsIdMapping.value = await marketsIdRes.json()

    // Получаем название рынка
    marketName.value = marketsIdMapping.value[marketId.value] || 'Неизвестный рынок'

    // Получаем название региона
    if (regionId.value) {
      const region = regionsData.value.find(r => r[0] === regionId.value)
      regionName.value = region ? region[1] : 'Неизвестный регион'
    }

    // Получаем доступные регионы для этого рынка
    const regionNames = searchData.value[marketName.value] || []
    availableRegions.value = regionsData.value.filter(r => regionNames.includes(r[1]))

    // Загружаем данные рынка
    await loadMarketData()
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
})

// Загрузка данных рынка
const loadMarketData = async () => {
  const mid = marketId.value

  try {
    // Виды деятельности
    const okvRes = await fetch(`/data/${mid}_okv.json`)
    if (okvRes.ok) {
      activities.value = await okvRes.json()
    }

    // Новости
    const newsRes = await fetch(`/data/${mid}_news.json`)
    if (newsRes.ok) {
      const newsData = await newsRes.json()
      const newsArray = []
      let i = 1
      while (newsData[`header ${i}`]) {
        newsArray.push({
          title: newsData[`header ${i}`],
          link: newsData[`link ${i}`]
        })
        i++
      }
      news.value = newsArray
      newsEmotion.value = newsData.emotion || 'нейтрально'
    }

    // Компании
    if (regionId.value && regionId.value !== '') {
      // Для конкретного региона
      const regionsTop10Res = await fetch(`/data/${mid}_regions_top10.json`)
      if (regionsTop10Res.ok) {
        const regionsTop10Data = await regionsTop10Res.json()
        const region = regionsData.value.find(r => r[0] === regionId.value)
        if (region && regionsTop10Data[region[1]]) {
          companies.value = regionsTop10Data[region[1]]
        }
      }
    } else {
      // Для всей России
      const top10Res = await fetch(`/data/${mid}_top10.json`)
      if (top10Res.ok) {
        companies.value = await top10Res.json()
      }
    }

    // Метрики
    if (regionId.value && regionId.value !== '') {
      // Для конкретного региона
      const regionRes = await fetch(`/data/${mid}_region.json`)
      if (regionRes.ok) {
        const regionData = await regionRes.json()
        const region = regionsData.value.find(r => r[0] === regionId.value)
        if (region && regionData[region[1]]) {
          metrics.value = regionData[region[1]]
        }
      }
    } else {
      // Для всей России
      const metricsRes = await fetch(`/data/${mid}_metrics.json`)
      if (metricsRes.ok) {
        metrics.value = await metricsRes.json()
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки данных рынка:', error)
  }
}

// Класс эмоции для стилизации
const emotionClass = computed(() => {
  const emotion = newsEmotion.value.toLowerCase()
  if (emotion.includes('положительно') || emotion.includes('positive')) return 'positive'
  if (emotion.includes('отрицательно') || emotion.includes('negative')) return 'negative'
  return 'neutral'
})

// Форматирование метрик
const metricsFormatted = computed(() => {
  const formatted = {}
  const metricsByName = {}

  // Группируем метрики по названиям
  for (const [key, value] of Object.entries(metrics.value)) {
    // Извлекаем название метрики и год
    const match = key.match(/^(.*?)\s+(\d{4})$/)
    if (match) {
      const [, name, year] = match
      if (!metricsByName[name]) {
        metricsByName[name] = {}
      }
      metricsByName[name][year] = value
    }
  }

  return metricsByName
})

// Фильтрация метрик по выбранному показателю
const filteredMetrics = computed(() => {
  if (!selectedIndicator.value) {
    return metricsFormatted.value
  }
  return {
    [selectedIndicator.value]: metricsFormatted.value[selectedIndicator.value]
  }
})

// Вычисление высоты столбца
const calculateBarHeight = (value, data) => {
  const values = Object.values(data).map(v => parseFloat(v) || 0)
  const maxValue = Math.max(...values)
  if (maxValue === 0) return 0
  return (parseFloat(value) / maxValue) * 100
}

// Форматирование чисел
const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}

// Смена региона
const changeRegion = () => {
  const url = selectedRegionId.value
    ? `/${marketId.value}/${selectedRegionId.value}`
    : `/${marketId.value}`
  router.push(url)
}
</script>

<style scoped>
.market-page {
  padding: 40px 0;
}

.market-info {
  margin-bottom: 60px;
}

.market-info__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.market-info__title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

.market-info__subtitle {
  font-size: 20px;
  color: #666;
}

.region-selector {
  margin-top: 30px;
}

.region-selector label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
}

.region-selector select {
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  min-width: 300px;
  cursor: pointer;
}

.market-description {
  margin-top: 24px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
}

.market-description__text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  max-height: 4.8em;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.market-description__text--expanded {
  max-height: none;
}

.market-description__toggle {
  margin-top: 12px;
  padding: 8px 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.market-description__toggle:hover {
  background: #0056b3;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 18px;
  margin-bottom: 20px;
  color: #666;
}

.market-rating {
  margin-bottom: 60px;
}

.market-card {
  padding: 32px;
  border-radius: 16px;
  border: 3px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.market-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.market-card--positive {
  background: #e8f5e9;
  border-color: #4caf50;
}

.market-card--negative {
  background: #ffebee;
  border-color: #f44336;
}

.market-card--neutral {
  background: #fff3e0;
  border-color: #ff9800;
}

.market-card__title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.market-card__ratings {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.rating-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-item__label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.rating-item__value {
  font-size: 20px;
  font-weight: 700;
}

.market-card__metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-item__label {
  font-size: 14px;
  color: #666;
}

.metric-item__value {
  font-size: 16px;
  font-weight: 600;
}

.activities {
  margin-bottom: 60px;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.activity-card {
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-card::before {
  content: '✓';
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #4caf50;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.news-analysis {
  margin-bottom: 60px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.news-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.news-card__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.4;
}

.news-card__link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.news-card__link:hover {
  text-decoration: underline;
}

.sources {
  margin-bottom: 60px;
}

.sources-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sources-item {
  margin-bottom: 16px;
}

.sources-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: background 0.2s, transform 0.2s;
  font-size: 16px;
}

.sources-link:hover {
  background: #e0e0e0;
  transform: translateX(4px);
}

.sources-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.top-companies {
  margin-bottom: 60px;
}

.table-wrapper {
  overflow-x: auto;
}

.companies-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.companies-table th,
.companies-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.companies-table th {
  background: #f8f8f8;
  font-weight: 600;
}

.companies-table tr:hover {
  background: #f8f8f8;
}

.market-metrics {
  margin-bottom: 60px;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.metrics-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metrics-filter label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.indicator-select {
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  min-width: 250px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s;
}

.indicator-select:hover,
.indicator-select:focus {
  border-color: #007bff;
  outline: none;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 40px;
}

.metric-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.metric-card__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.metric-values {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
}

.metric-values__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-values__year {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.metric-values__value {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.metric-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  gap: 12px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar__value {
  width: 100%;
  background: linear-gradient(180deg, #4CAF50 0%, #45a049 100%);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  position: relative;
  transition: all 0.3s;
}

.chart-bar__value:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.chart-bar__label {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.chart-bar__year {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
</style>
