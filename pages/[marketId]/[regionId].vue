<template>
  <div class="container">
    <!-- Информация о рынке -->
    <section class="market-info">
      <div class="market-info__header">
        <h1 class="title title--big">{{ marketName }}</h1>

        <!-- Выбор города с использованием custom-select -->
        <div class="market-info__cities" v-if="availableRegions.length > 0">
          <div class="custom-select" :class="{ 'is-open': selectOpen }">
            <div class="custom-select__trigger" @click="toggleSelect">
              <div class="custom-select__trigger-input">
                <input
                  type="text"
                  :value="selectedRegionName"
                  readonly
                  placeholder="Выберите город"
                >
              </div>
              <div class="custom-select__trigger-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <div class="custom-select__dropdown" v-if="selectOpen">
              <ul class="custom-select__list">
                <li class="custom-select__item" @click="selectRegion('')">
                  <label>Вся Россия</label>
                </li>
                <li
                  v-for="region in availableRegions"
                  :key="region[0]"
                  class="custom-select__item"
                  @click="selectRegion(region[0], region[1])"
                >
                  <label>{{ region[1] }}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Субтитл с названием региона -->
      <p class="market-info__subtitle" v-if="regionName !== 'Вся Россия'">{{ regionName }}</p>

      <!-- Описание рынка -->
      <p class="market-info__description" v-if="marketDescription">
        {{ marketDescription }}
      </p>

      <!-- Виды деятельности -->
      <ul class="market-info__activities" v-if="activities.length > 0">
        <li
          v-for="(activity, index) in activities"
          :key="index"
          class="market-info__activities-item"
        >
          <svg class="icon icon--check" width="24" height="24">
            <use xlink:href="/img/sprite.svg#check"></use>
          </svg>
          {{ activity }}
        </li>
      </ul>

      <!-- Карточка оценки рынка -->
      <div class="market-info__rating" v-if="newsEmotion">
        <div
          class="market-card"
          :class="`market-card--${emotionClass}`"
        >
          <div class="market-card__icon">
            <svg width="48" height="48">
              <use :xlink:href="`/img/sprite.svg#${emotionIcon}`"></use>
            </svg>
          </div>

          <h3 class="market-card__title">
            Оценка рынка
          </h3>

          <div class="market-card__state">
            <div class="market-card__state-item">
              <svg class="market-card__state-item-icon" width="24" height="24">
                <use xlink:href="/img/sprite.svg#ai"></use>
              </svg>
              <span class="market-card__state-item-title">AI оценка:</span>
              <span class="market-card__state-item-text">{{ newsEmotion }}</span>
            </div>
            <div class="market-card__state-item">
              <svg class="market-card__state-item-icon" width="24" height="24">
                <use xlink:href="/img/sprite.svg#expert"></use>
              </svg>
              <span class="market-card__state-item-title">Эксперты:</span>
              <span class="market-card__state-item-text">{{ newsEmotion }}</span>
            </div>
          </div>

          <ul class="market-card__list" v-if="Object.keys(metrics).length > 0">
            <li class="market-card__item">
              <span class="market-card__item-name">Объем рынка 2024</span>
              <span class="market-card__item-number">{{ formatNumber(metrics['Объем рынка 2024'] || 0) }} тыс. руб.</span>
            </li>
            <li class="market-card__item">
              <span class="market-card__item-name">Рентабельность</span>
              <span class="market-card__item-number">{{ metrics['Рентабельность рынка 2024'] || 'н/д' }}%</span>
            </li>
            <li class="market-card__item" v-if="metrics['Количество компаний 2024']">
              <span class="market-card__item-name">Количество компаний</span>
              <span class="market-card__item-number">{{ formatNumber(metrics['Количество компаний 2024']) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Источники (новости) -->
      <div class="market-info__sources" v-if="news.length > 0">
        <h3 class="subtitle">Источники</h3>
        <ul class="sources-list">
          <li v-for="(newsItem, index) in news" :key="index" class="sources-list__item">
            <a :href="newsItem.link" target="_blank" rel="noopener" class="link">
              {{ newsItem.title }}
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- Топ-10 компаний -->
    <section class="bests" v-if="companies.length > 0">
      <h2 class="title title--center bests__title">Топ-10 по объему выручки</h2>
      <ul class="bests__list">
        <li
          v-for="company in companies"
          :key="company['ИНН']"
          class="bests__item"
        >
          <div class="company">
            <h4 class="company__name">{{ company['Название компании'] }}</h4>
            <p class="company__inn">ИНН: {{ company['ИНН'] }}</p>
            <p class="company__fund">{{ formatNumber(company['Объем выручки 2024']) }} тыс. руб.</p>
          </div>
        </li>
        <!-- Заполняем пустые слоты до 10 -->
        <li
          v-for="i in Math.max(0, 10 - companies.length)"
          :key="`empty-${i}`"
          class="bests__item"
        >
          <div class="company">
            <h4 class="company__name">—</h4>
            <p class="company__inn">—</p>
            <p class="company__fund">—</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- Показатели рынка -->
    <section class="indicators" v-if="Object.keys(metrics).length > 0">
      <h2 class="title title--center indicators__title">Показатели</h2>

      <!-- Выбор показателя -->
      <div class="indicators__select">
        <div class="custom-select" :class="{ 'is-open': indicatorSelectOpen }">
          <div class="custom-select__trigger" @click="toggleIndicatorSelect">
            <div class="custom-select__trigger-input">
              <input
                type="text"
                :value="selectedIndicatorName"
                readonly
                placeholder="Выберите показатель"
              >
            </div>
            <div class="custom-select__trigger-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="custom-select__dropdown" v-if="indicatorSelectOpen">
            <ul class="custom-select__list">
              <li class="custom-select__item" @click="selectIndicator('', 'Все показатели')">
                <label>Все показатели</label>
              </li>
              <li
                v-for="(metricData, metricName) in metricsFormatted"
                :key="metricName"
                class="custom-select__item"
                @click="selectIndicator(metricName, metricName)"
              >
                <label>{{ metricName }}</label>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Список показателей -->
      <ul class="indicators__list">
        <li
          v-for="(metricData, metricName) in filteredMetrics"
          :key="metricName"
          class="indicators__item"
        >
          <div class="indicator">
            <h4 class="indicator__title">{{ metricName }}</h4>

            <!-- График -->
            <div class="chart">
              <div
                v-for="(value, year) in metricData"
                :key="year"
                class="chart__item"
                :class="{ 'chart__item--top': isTopYear(value, metricData) }"
              >
                <p class="chart__item-value">{{ value }}</p>
                <div class="chart__item-bar">
                  <span :style="{ height: `${calculateBarHeight(value, metricData)}%` }"></span>
                </div>
                <p class="chart__item-year">{{ year }}</p>
              </div>
            </div>

            <!-- Значения по годам -->
            <div class="indicator__years">
              <div
                v-for="(value, year) in metricData"
                :key="year"
                class="indicator__years-item"
              >
                <span class="indicator__years-item-year">{{ year }}:</span>
                <span class="indicator__years-item-value">{{ value }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>
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
const regionsData = ref([])
const marketsIdMapping = ref({})
const marketName = ref('Загрузка...')
const regionName = ref('Вся Россия')
const selectedRegionId = ref(regionId.value)
const selectedRegionName = ref('Вся Россия')
const availableRegions = ref([])

// UI состояния
const selectOpen = ref(false)
const indicatorSelectOpen = ref(false)
const selectedIndicator = ref('')
const selectedIndicatorName = ref('Все показатели')

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
      if (region) {
        regionName.value = region[1]
        selectedRegionName.value = region[1]
      }
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

// Иконка эмоции
const emotionIcon = computed(() => {
  const emotion = newsEmotion.value.toLowerCase()
  if (emotion.includes('положительно') || emotion.includes('positive')) return 'smile'
  if (emotion.includes('отрицательно') || emotion.includes('negative')) return 'sad'
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

// Проверка, является ли год топовым
const isTopYear = (value, data) => {
  const values = Object.values(data).map(v => parseFloat(v) || 0)
  const maxValue = Math.max(...values)
  return parseFloat(value) === maxValue
}

// Форматирование чисел
const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}

// Управление custom-select для регионов
const toggleSelect = () => {
  selectOpen.value = !selectOpen.value
}

const selectRegion = (regionIdValue, regionNameValue = 'Вся Россия') => {
  selectedRegionId.value = regionIdValue
  selectedRegionName.value = regionNameValue
  selectOpen.value = false

  const url = regionIdValue
    ? `/${marketId.value}/${regionIdValue}`
    : `/${marketId.value}`
  router.push(url)
}

// Управление custom-select для показателей
const toggleIndicatorSelect = () => {
  indicatorSelectOpen.value = !indicatorSelectOpen.value
}

const selectIndicator = (indicatorValue, indicatorNameValue) => {
  selectedIndicator.value = indicatorValue
  selectedIndicatorName.value = indicatorNameValue
  indicatorSelectOpen.value = false
}

// Закрытие селектов при клике вне их
if (process.client) {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
      selectOpen.value = false
      indicatorSelectOpen.value = false
    }
  })
}
</script>

<style scoped>
/* Дополнительные стили, если нужны */
.sources-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sources-list__item {
  margin-bottom: 12px;
}

.sources-list__item .link {
  color: #5586E7;
  text-decoration: none;
  transition: color 0.2s;
}

.sources-list__item .link:hover {
  color: #3d6bc7;
  text-decoration: underline;
}

.icon--check {
  flex-shrink: 0;
}

.market-info__activities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 24px 0;
}

.market-info__activities-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.market-info__subtitle {
  margin-top: 8px;
  margin-bottom: 16px;
  font-size: 20px;
  color: #8A8E9F;
}
</style>
