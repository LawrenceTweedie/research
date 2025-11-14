<template>
  <section class="markets" id="markets">
    <div class="container markets__container">
      <h2 class="markets__title title">Рынки</h2>
      <div class="markets__header">
        <!-- Фильтр по регионам -->
        <div
          class="custom-select markets__header-cities"
          :class="{ 'is-open': regionSelectOpen }"
        >
          <div class="custom-select__trigger" @click.stop="toggleRegionSelect">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-location"></use>
            </svg>
            <div class="custom-select__trigger-input">
              <input
                v-model="regionSearchQuery"
                type="text"
                name="markets-cities"
                placeholder="Выберите регион..."
                autocomplete="off"
                @focus="regionSelectOpen = true"
              />
              <span class="custom-select__trigger-input-help"></span>
            </div>
            <div class="custom-select__trigger-icon">
              <svg width="24" height="24" aria-hidden="true">
                <use xlink:href="/img/sprite.svg#icon-arrow--select"></use>
              </svg>
            </div>
          </div>
          <div class="custom-select__dropdown" v-if="regionSelectOpen">
            <ul class="custom-select__list">
              <li class="custom-select__item" v-for="(region, index) in filteredRegions" :key="region.id">
                <label class="custom-field custom-field--checkbox" :for="`markets-cities-${index}`">
                  <input
                    class="visually-hidden"
                    :id="`markets-cities-${index}`"
                    name="markets-cities"
                    type="radio"
                    :checked="selectedRegion?.id === region.id"
                    @change="selectRegion(region)"
                    autocomplete="off"
                  />
                  <span class="custom-field__icon">
                    <svg width="24" height="24" aria-hidden="true">
                      <use xlink:href="/img/sprite.svg#icon-check"></use>
                    </svg>
                  </span>
                  <span class="custom-field__text">{{ region.name }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <!-- Фильтр по категориям -->
        <div
          class="custom-select markets__header-categories"
          :class="{ 'is-open': categorySelectOpen }"
        >
          <div class="custom-select__trigger" @click.stop="toggleCategorySelect">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-grid"></use>
            </svg>
            <div class="custom-select__trigger-input">
              <input
                v-model="categorySearchQuery"
                type="text"
                name="markets-categories"
                placeholder='Выберите категорию рынка - например, "Рынок недвижимости"...'
                autocomplete="off"
                @focus="categorySelectOpen = true"
              />
              <span class="custom-select__trigger-input-help"></span>
            </div>
            <div class="custom-select__trigger-icon">
              <svg width="24" height="24" aria-hidden="true">
                <use xlink:href="/img/sprite.svg#icon-arrow--select"></use>
              </svg>
            </div>
          </div>
          <div class="custom-select__dropdown" v-if="categorySelectOpen">
            <ul class="custom-select__list">
              <li class="custom-select__item" v-for="(category, index) in filteredCategories" :key="index">
                <label class="custom-field custom-field--checkbox" :for="`markets-categories-${index}`">
                  <input
                    class="visually-hidden"
                    :id="`markets-categories-${index}`"
                    name="markets-categories"
                    type="radio"
                    :checked="selectedCategory?.name === category.name"
                    @change="selectCategory(category)"
                    autocomplete="off"
                  />
                  <span class="custom-field__icon">
                    <svg width="24" height="24" aria-hidden="true">
                      <use xlink:href="/img/sprite.svg#icon-check"></use>
                    </svg>
                  </span>
                  <span class="custom-field__text">{{ category.name }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <a class="button markets__header-link button button--lg button--cold" title="Смотреть все рынки" href="#markets">
          Смотреть все
        </a>
      </div>

      <!-- Список рынков -->
      <ul class="markets__list">
        <li v-for="(market, index) in paginatedMarkets" :key="market.id" class="markets__item">
          <MarketCard :market="market" />
        </li>
      </ul>

      <!-- Пагинация -->
      <div class="pagination pagination--grid markets__pagination">
        <div class="pagination__info">{{ paginationInfo }}</div>
        <div class="pagination__navigation">
          <button
            class="pagination__btn pagination__btn--prev"
            type="button"
            title="Back page"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <svg width="16" height="16" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-arrow--select"></use>
            </svg>
            Back
          </button>
          <ul class="pagination__list">
            <li class="pagination__list-item" v-for="page in visiblePages" :key="page">
              <a
                class="pagination__list-item-link"
                :class="{ 'is-active': currentPage === page }"
                href="#!"
                :title="String(page)"
                @click.prevent="goToPage(page)"
              >
                {{ page }}
              </a>
            </li>
          </ul>
          <button
            class="pagination__btn pagination__btn--next"
            type="button"
            title="Next page"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
            <svg width="16" height="16" aria-hidden="true">
              <use xlink:href="/img/sprite.svg#icon-arrow--select"></use>
            </svg>
          </button>
        </div>
        <div class="pagination__select">
          <div class="pagination__select-text">Result per page</div>
          <div class="pagination-select">
            <div class="pagination-select__trigger" @click="itemsSelectOpen = !itemsSelectOpen">
              <div class="pagination-select__trigger-title">{{ itemsPerPage }}</div>
              <div class="pagination-select__trigger-icon">
                <svg width="16" height="16" aria-hidden="true">
                  <use xlink:href="/img/sprite.svg#icon-arrow--select"></use>
                </svg>
              </div>
            </div>
            <div class="pagination-select__list" v-if="itemsSelectOpen">
              <div
                class="pagination-select__item"
                v-for="count in [10, 25, 50, 100, 200, 500]"
                :key="count"
                :class="{ 'visually-hidden': count === itemsPerPage }"
                @click="changeItemsPerPage(count)"
              >
                {{ count }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import MarketCard from '~/components/MarketCard.vue'

// Props - можем передать начальные данные из родителя
const props = defineProps({
  initialMarkets: {
    type: Array,
    default: () => []
  }
})

// Состояния для данных
const allMarkets = ref(props.initialMarkets)
const regions = ref([])
const categories = ref([])

// Состояния для фильтров
const selectedRegion = ref(null)
const selectedCategory = ref(null)
const regionSearchQuery = ref('')
const categorySearchQuery = ref('')

// Состояния для dropdown
const regionSelectOpen = ref(false)
const categorySelectOpen = ref(false)
const itemsSelectOpen = ref(false)

// Состояния для пагинации
const currentPage = ref(1)
const itemsPerPage = ref(10)

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

// Загрузка данных
onMounted(async () => {
  // Если данные уже переданы через props, загружаем только regions и categories
  if (props.initialMarkets && props.initialMarkets.length > 0) {
    try {
      const regionsRes = await fetch('/data/regions.json')
      const regionsData = await regionsRes.json()
      regions.value = regionsData.map(([id, name]) => ({ id, name }))

      const uniqueCategories = [...new Set(allMarkets.value.map(m => m.category))]
      categories.value = uniqueCategories.map(cat => ({ name: cat }))
    } catch (error) {
      console.error('Error loading regions:', error)
    }
    return
  }

  // Полная загрузка данных (если initialMarkets не передали)
  try {
    // Загружаем markets.json
    const marketsRes = await fetch('/data/markets.json')
    const marketsData = await marketsRes.json()

    // Загружаем regions.json
    const regionsRes = await fetch('/data/regions.json')
    const regionsData = await regionsRes.json()
    regions.value = regionsData.map(([id, name]) => ({ id, name }))

    // Загружаем search.json
    const searchRes = await fetch('/data/search.json')
    const searchData = await searchRes.json()

    // Для каждого рынка загружаем данные
    const marketPromises = Object.entries(marketsData).map(async ([marketId, marketName]) => {
      try {
        // Загружаем новости для получения эмоции
        const newsRes = await fetch(`/data/${marketId}_news.json`)
        const newsData = await newsRes.json()

        // Загружаем данные по регионам для получения метрик
        const regionRes = await fetch(`/data/${marketId}_region.json`)
        const regionData = await regionRes.json()

        // Получаем агрегированные данные по всей России
        const firstRegion = Object.keys(regionData)[0]
        const metrics = firstRegion ? regionData[firstRegion] : {}

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

        // Определяем emotion для AI и экспертов
        let emotionAI = 'neutral'
        let emotionExperts = 'neutral'

        // Новая структура: отдельные поля для AI и экспертов
        if (newsData.emotion_ai || newsData.emotion_experts) {
          emotionAI = parseEmotion(newsData.emotion_ai)
          emotionExperts = parseEmotion(newsData.emotion_experts)
        }
        // Старая структура: одно поле emotion для обоих
        else if (newsData.emotion) {
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
          category: marketName,
          regions: searchData[marketName] || []
        }
      } catch (error) {
        console.error(`Error loading data for market ${marketId}:`, error)
        return null
      }
    })

    const markets = await Promise.all(marketPromises)
    allMarkets.value = markets.filter(m => m !== null)

    // Извлекаем уникальные категории
    const uniqueCategories = [...new Set(allMarkets.value.map(m => m.category))]
    categories.value = uniqueCategories.map(cat => ({ name: cat }))

  } catch (error) {
    console.error('Error loading markets data:', error)
    // Используем статические данные если пр опс не передал
    if (allMarkets.value.length === 0) {
      allMarkets.value = getSampleMarkets()
    }
  }
})

// Статические данные как fallback
const getSampleMarkets = () => ([
  {
    id: '1',
    title: 'Добыча угля',
    emotionAI: 'positive',
    emotionExperts: 'positive',
    marketVolume: '450 млрд руб.',
    investmentVolume: '680 млрд руб.',
    profitability: '12%',
    instability: '28%',
    link: '/1',
    category: 'Добыча угля',
    regions: []
  },
  {
    id: '2',
    title: 'Рынок акустической аппаратуры',
    emotionAI: 'neutral',
    emotionExperts: 'neutral',
    marketVolume: '180 млрд руб.',
    investmentVolume: '320 млрд руб.',
    profitability: '6%',
    instability: '42%',
    link: '/2',
    category: 'Рынок акустической аппаратуры',
    regions: []
  },
  {
    id: '3',
    title: 'Рынок программного обеспечения',
    emotionAI: 'positive',
    emotionExperts: 'positive',
    marketVolume: '890 млрд руб.',
    investmentVolume: '1.2 трлн руб.',
    profitability: '10%',
    instability: '30%',
    link: '/3',
    category: 'Рынок программного обеспечения',
    regions: []
  }
])

// Фильтрованные регионы для поиска
const filteredRegions = computed(() => {
  if (!regionSearchQuery.value) return regions.value
  const query = regionSearchQuery.value.toLowerCase()
  return regions.value.filter(r => r.name.toLowerCase().includes(query))
})

// Фильтрованные категории для поиска
const filteredCategories = computed(() => {
  if (!categorySearchQuery.value) return categories.value
  const query = categorySearchQuery.value.toLowerCase()
  return categories.value.filter(c => c.name.toLowerCase().includes(query))
})

// Фильтрованные рынки
const filteredMarkets = computed(() => {
  let filtered = allMarkets.value

  // Фильтр по региону
  if (selectedRegion.value) {
    filtered = filtered.filter(m =>
      m.regions.includes(selectedRegion.value.name)
    )
  }

  // Фильтр по категории
  if (selectedCategory.value) {
    filtered = filtered.filter(m =>
      m.category.toLowerCase().includes(selectedCategory.value.name.toLowerCase())
    )
  }

  return filtered
})

// Пагинированные рынки
const paginatedMarkets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMarkets.value.slice(start, end)
})

// Общее количество страниц
const totalPages = computed(() => {
  return Math.ceil(filteredMarkets.value.length / itemsPerPage.value)
})

// Видимые страницы для пагинации
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Информация о пагинации
const paginationInfo = computed(() => {
  if (filteredMarkets.value.length === 0) return '0 of 0'
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(start + itemsPerPage.value - 1, filteredMarkets.value.length)
  return `${start}-${end} of ${filteredMarkets.value.length}`
})

// Функции управления dropdown
const toggleRegionSelect = () => {
  regionSelectOpen.value = !regionSelectOpen.value
  if (regionSelectOpen.value) categorySelectOpen.value = false
}

const toggleCategorySelect = () => {
  categorySelectOpen.value = !categorySelectOpen.value
  if (categorySelectOpen.value) regionSelectOpen.value = false
}

const selectRegion = (region) => {
  selectedRegion.value = region
  regionSearchQuery.value = region.name
  regionSelectOpen.value = false
  currentPage.value = 1
}

const selectCategory = (category) => {
  selectedCategory.value = category
  categorySearchQuery.value = category.name
  categorySelectOpen.value = false
  currentPage.value = 1
}

// Закрытие dropdown при клике вне их
if (process.client) {
  onMounted(() => {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.markets__header-cities')) {
        regionSelectOpen.value = false
      }
      if (!e.target.closest('.markets__header-categories')) {
        categorySelectOpen.value = false
      }
      if (!e.target.closest('.pagination-select')) {
        itemsSelectOpen.value = false
      }
    })
  })
}

// Функции пагинации
const goToPage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Прокрутка к началу секции markets
    if (process.client) {
      document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const changeItemsPerPage = (count) => {
  itemsPerPage.value = count
  currentPage.value = 1
  itemsSelectOpen.value = false
}

// Сброс на первую страницу при изменении фильтров
watch([selectedRegion, selectedCategory], () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* Компонент использует глобальные стили */
</style>
