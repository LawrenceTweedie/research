<template>
  <!-- Информация о рынке -->
  <section class="market-info">
    <div class="container market-info__container">
      <div class="market-info__header">
        <h2 class="market-info__title title">{{ marketName }} <span v-if="regionName !== 'Вся Россия'">- {{ regionName }}</span></h2>
        <div class="market-info__description">
          {{ descriptionShort }}
          <button
            v-if="marketDescription && marketDescription.length > 200"
            class="show-more-btn"
            @click="descriptionExpanded = !descriptionExpanded"
          >
            {{ descriptionExpanded ? 'Скрыть' : 'Показать больше' }}
            <svg width="20" height="20" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-arrow--select"></use>
            </svg>
          </button>
          <span v-if="descriptionExpanded && marketDescription" class="text--hidden">{{ descriptionRest }}</span>
        </div>
        <div class="market-info__header-btns">
          <button class="market-info__btn" type="button" title="Поделиться">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-share"></use>
            </svg>
          </button>
          <button class="market-info__btn" type="button" title="Добавить в избранное">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-star"></use>
            </svg>
          </button>
        </div>
      </div>

      <!-- Выбор города с использованием custom-select -->
      <div
        v-if="availableRegions.length > 0"
        class="custom-select market-info__cities"
        :class="{ 'is-open': selectOpen }"
      >
        <div class="custom-select__trigger" @click.stop="toggleSelect">
          <svg width="24" height="24" aria-hidden="true">
            <use xlink:href="/img/sprite.svg#icon-location"></use>
          </svg>
          <div class="custom-select__trigger-input">
            <input
              type="text"
              name="market-info-cities"
              :value="selectedRegionName"
              placeholder="Выберите регион..."
              autocomplete="off"
              readonly
            >
            <span class="custom-select__trigger-input-help"></span>
          </div>
          <div class="custom-select__trigger-icon">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-arrow--select"></use>
            </svg>
          </div>
        </div>
        <div class="custom-select__dropdown" v-if="selectOpen">
          <ul class="custom-select__list">
            <li class="custom-select__item" @click="selectRegion('', 'Вся Россия')">
              <label class="custom-field custom-field--checkbox">
                <input
                  class="visually-hidden"
                  type="radio"
                  name="market-info-cities"
                  :checked="selectedRegionId === ''"
                  autocomplete="off"
                >
                <span class="custom-field__icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="/img/sprite.svg#icon-check"></use>
                  </svg>
                </span>
                <span class="custom-field__text">Вся Россия</span>
              </label>
            </li>
            <li
              v-for="(region, index) in availableRegions"
              :key="region[0]"
              class="custom-select__item"
              @click="selectRegion(region[0], region[1])"
            >
              <label class="custom-field custom-field--checkbox">
                <input
                  class="visually-hidden"
                  :id="`market-info-cities-${index}`"
                  type="radio"
                  name="market-info-cities"
                  :checked="selectedRegionId === region[0]"
                  autocomplete="off"
                >
                <span class="custom-field__icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="/img/sprite.svg#icon-check"></use>
                  </svg>
                </span>
                <span class="custom-field__text">{{ region[1] }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      <div class="market-info__content">
        <!-- Виды деятельности -->
        <div class="market-info__activities" v-if="activities.length > 0">
          <div class="market-info__subtitle h3">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-chart"></use>
            </svg>
            Виды деятельности:
          </div>
          <ul class="market-info__activities-list">
            <li
              v-for="(activity, index) in activities"
              :key="index"
              class="market-info__activities-item"
            >
              {{ activity }}
              <svg width="24" height="24" aria-hidden="true">
                <use xlink:href="/img/sprite.svg#icon-check"></use>
              </svg>
            </li>
          </ul>
        </div>

        <!-- Карточка оценки рынка -->
        <div class="market-info__rating" v-if="newsEmotion">
          <div
            class="market-card"
            :class="`market-card--${emotionClass}`"
          >
            <div class="market-card__title market-info__subtitle h3">
              <svg width="24" height="24" aria-hidden="true">
                <use xlink:href="/img/sprite.svg#icon-star--filled"></use>
              </svg>
              Оценка
            </div>

            <ul class="market-card__state">
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="/img/sprite.svg#icon-brain"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">AI:</div>
                <div class="market-card__state-item-text">{{ newsEmotion }}</div>
              </li>
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="/img/sprite.svg#icon-expert"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">Эксперты:</div>
                <div class="market-card__state-item-text">{{ newsEmotion }}</div>
              </li>
            </ul>

            <ul class="market-card__list" v-if="Object.keys(metrics).length > 0">
              <li class="market-card__item">
                <div class="market-card__item-name">Объем рынка:</div>
                <div class="market-card__item-number">{{ formatNumber(metrics['Объем рынка 2024'] || 0) }} тыс. руб.</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Рентабельность:</div>
                <div class="market-card__item-number">{{ metrics['Рентабельность рынка 2024'] || 'н/д' }}%</div>
              </li>
              <li class="market-card__item" v-if="metrics['Количество компаний 2024']">
                <div class="market-card__item-name">Количество компаний:</div>
                <div class="market-card__item-number">{{ formatNumber(metrics['Количество компаний 2024']) }}</div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Источники (новости) -->
        <div class="market-info__sources" v-if="news.length > 0">
          <div class="market-info__subtitle h3">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-source"></use>
            </svg>
            Источники
          </div>
          <ul class="market-info__sources-list">
            <li
              v-for="(newsItem, index) in news"
              :key="index"
              class="market-info__sources-item"
            >
              <a
                class="market-info__sources-link"
                :href="newsItem.link"
                :title="newsItem.title"
                target="_blank"
                rel="noopener"
              >
                <span>{{ newsItem.title }}</span>
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="/img/sprite.svg#icon-arrow--link"></use>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Топ-10 компаний -->
  <section class="bests" v-if="companies.length > 0">
    <div class="container">
      <h2 class="title title--center bests__title">Топ-10 по объему выручки</h2>
      <ul class="bests__list">
        <li
          v-for="company in companies"
          :key="company['ИНН']"
          class="bests__item company"
        >
            <h4 class="company__name">{{ company['Название компании'] }}</h4>
            <p class="company__inn">ИНН: {{ company['ИНН'] }}</p>
            <p class="company__fund">{{ formatNumber(company['Объем выручки 2024']) }} тыс. руб.</p>
        </li>
        <!-- Заполняем пустые слоты до 10 -->
        <li
          v-for="i in Math.max(0, 10 - companies.length)"
          :key="`empty-${i}`"
          class="bests__item company"
        >
            <h4 class="company__name">—</h4>
            <p class="company__inn">—</p>
            <p class="company__fund">—</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- Показатели рынка -->
  <section class="indicators" v-if="Object.keys(metrics).length > 0">
    <div class="container">
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
    </div>
  </section>
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
const descriptionExpanded = ref(false)

// Данные
const marketDescription = ref('Этот рынок представляет собой важный сегмент российской экономики, характеризующийся стабильным ростом и развитием. На протяжении последних лет наблюдается положительная динамика ключевых показателей.')
const activities = ref([])
const news = ref([])
const newsEmotion = ref('')
const companies = ref([])
const metrics = ref({})

// Computed для описания
const descriptionShort = computed(() => {
  if (!marketDescription.value) return ''
  if (marketDescription.value.length <= 200) return marketDescription.value
  return marketDescription.value.substring(0, 200)
})

const descriptionRest = computed(() => {
  if (!marketDescription.value || marketDescription.value.length <= 200) return ''
  return marketDescription.value.substring(200)
})

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

    // Получаем название рынка (инвертируем маппинг: из {"название": id} в {id: "название"})
    const invertedMapping = Object.fromEntries(
      Object.entries(marketsIdMapping.value).map(([name, id]) => [id, name])
    )
    marketName.value = invertedMapping[marketId.value] || 'Неизвестный рынок'

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
  // Если значение пустое или undefined
  if (!num && num !== 0) return '0'

  // Если это уже строка с пробелами (уже отформатированная)
  if (typeof num === 'string' && num.includes(' ')) {
    return num
  }

  // Если это строка без пробелов, преобразуем в число
  if (typeof num === 'string') {
    num = num.replace(/\s/g, '') // Удаляем пробелы на всякий случай
    num = parseFloat(num)
  }

  // Форматируем число
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
