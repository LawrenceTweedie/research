<template>
  <form class="hero__search search-form" @submit.prevent="handleSearch">
    <div class="search-form__line">
      <!-- Выбор рынка -->
      <div class="custom-select search-form__categories" :class="{ 'is-open': isMarketSelectOpen }" data-vue-managed>
        <div class="custom-select__trigger" @click="toggleMarketSelect">
          <svg width="24" height="24" aria-hidden="true">
            <use xlink:href="#icon-grid"></use>
          </svg>
          <div class="custom-select__trigger-input">
            <input
              type="text"
              v-model="marketSearchQuery"
              @input="onMarketSearch"
              @focus="isMarketSelectOpen = true"
              name="search-categories"
              placeholder="Выберите категорию рынка - например, &quot;Рынок недвижимости&quot;..."
              autocomplete="off"
            >
            <span class="custom-select__trigger-input-help"></span>
          </div>
          <div class="custom-select__trigger-icon">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="#icon-arrow--select"></use>
            </svg>
          </div>
        </div>
        <div class="custom-select__dropdown">
          <ul class="custom-select__list">
            <li v-for="(market, index) in filteredMarkets" :key="index" class="custom-select__item">
              <label class="custom-field custom-field--checkbox" :for="`search-categories-${index}`">
                <input
                  class="visually-hidden"
                  :id="`search-categories-${index}`"
                  name="search-categories"
                  type="radio"
                  @change="selectMarket(market)"
                  :checked="selectedMarket === market"
                  autocomplete="off"
                >
                <span class="custom-field__icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </span>
                <span class="custom-field__text">{{ market }}</span>
              </label>
            </li>
            <li v-if="filteredMarkets.length === 0" class="custom-select__item">
              <span class="custom-field__text">Ничего не найдено</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Выбор региона -->
      <div class="custom-select search-form__cities" :class="{ 'is-open': isRegionSelectOpen, 'is-disabled': !selectedMarket }" data-vue-managed>
        <div class="custom-select__trigger" @click="toggleRegionSelect">
          <svg width="24" height="24" aria-hidden="true">
            <use xlink:href="#icon-location"></use>
          </svg>
          <div class="custom-select__trigger-input">
            <input
              type="text"
              v-model="regionSearchQuery"
              @input="onRegionSearch"
              @focus="isRegionSelectOpen = selectedMarket !== null"
              name="search-cities"
              placeholder="Выберите регион или оставьте &quot;Вся Россия&quot;"
              autocomplete="off"
              :disabled="!selectedMarket"
            >
            <span class="custom-select__trigger-input-help"></span>
          </div>
          <div class="custom-select__trigger-icon">
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="#icon-arrow--select"></use>
            </svg>
          </div>
        </div>
        <div class="custom-select__dropdown">
          <ul class="custom-select__list">
            <li class="custom-select__item">
              <label class="custom-field custom-field--checkbox" for="search-cities-all">
                <input
                  class="visually-hidden"
                  id="search-cities-all"
                  name="search-cities"
                  type="radio"
                  @change="selectRegion(null)"
                  :checked="selectedRegion === null"
                  autocomplete="off"
                >
                <span class="custom-field__icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </span>
                <span class="custom-field__text">Вся Россия</span>
              </label>
            </li>
            <li v-for="(region, index) in filteredRegions" :key="index" class="custom-select__item">
              <label class="custom-field custom-field--checkbox" :for="`search-cities-${index}`">
                <input
                  class="visually-hidden"
                  :id="`search-cities-${index}`"
                  name="search-cities"
                  type="radio"
                  @change="selectRegion(region)"
                  :checked="selectedRegion === region"
                  autocomplete="off"
                >
                <span class="custom-field__icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </span>
                <span class="custom-field__text">{{ region }}</span>
              </label>
            </li>
            <li v-if="filteredRegions.length === 0" class="custom-select__item">
              <span class="custom-field__text">Ничего не найдено</span>
            </li>
          </ul>
        </div>
      </div>

      <button class="button search-form__submit button--2xl" title="Поиск" type="submit" :disabled="!selectedMarket">
        <svg width="24" height="24" aria-hidden="true">
          <use xlink:href="#icon-loupe"></use>
        </svg>
        Поиск
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Состояния
const marketsData = ref({})
const marketsIdMapping = ref({})
const regionsData = ref([])
const isMarketSelectOpen = ref(false)
const isRegionSelectOpen = ref(false)
const marketSearchQuery = ref('')
const regionSearchQuery = ref('')
const selectedMarket = ref(null)
const selectedMarketId = ref(null)
const selectedRegion = ref(null)

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    const [marketsResponse, regionsResponse, marketsIdResponse] = await Promise.all([
      fetch('/data/search.json'),
      fetch('/data/regions.json'),
      fetch('/data/markets.json')
    ])

    marketsData.value = await marketsResponse.json()
    regionsData.value = await regionsResponse.json()
    marketsIdMapping.value = await marketsIdResponse.json()
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
})

// Фильтрованный список рынков
const filteredMarkets = computed(() => {
  const markets = Object.keys(marketsData.value)
  const query = marketSearchQuery.value.toLowerCase()
  if (!query) return markets

  return markets.filter(market =>
    market.toLowerCase().includes(query)
  )
})

// Доступные регионы для выбранного рынка
const availableRegions = computed(() => {
  if (!selectedMarket.value || !marketsData.value[selectedMarket.value]) {
    return []
  }
  return marketsData.value[selectedMarket.value]
})

// Фильтрованный список регионов
const filteredRegions = computed(() => {
  const query = regionSearchQuery.value.toLowerCase()
  if (!query) return availableRegions.value

  return availableRegions.value.filter(region =>
    region.toLowerCase().includes(query)
  )
})

// Методы
const toggleMarketSelect = () => {
  isMarketSelectOpen.value = !isMarketSelectOpen.value
  if (isMarketSelectOpen.value) {
    isRegionSelectOpen.value = false
  }
}

const toggleRegionSelect = () => {
  if (!selectedMarket.value) return
  isRegionSelectOpen.value = !isRegionSelectOpen.value
  if (isRegionSelectOpen.value) {
    isMarketSelectOpen.value = false
  }
}

const onMarketSearch = () => {
  isMarketSelectOpen.value = true
}

const onRegionSearch = () => {
  if (selectedMarket.value) {
    isRegionSelectOpen.value = true
  }
}

const selectMarket = (market) => {
  selectedMarket.value = market
  marketSearchQuery.value = market
  isMarketSelectOpen.value = false

  // Находим ID рынка
  const marketId = Object.keys(marketsIdMapping.value).find(
    id => marketsIdMapping.value[id] === market
  )
  selectedMarketId.value = marketId || '1'

  // Сброс выбранного региона при смене рынка
  selectedRegion.value = null
  regionSearchQuery.value = ''
}

const selectRegion = (region) => {
  selectedRegion.value = region
  regionSearchQuery.value = region || 'Вся Россия'
  isRegionSelectOpen.value = false
}

const handleSearch = () => {
  if (!selectedMarket.value || !selectedMarketId.value) return

  // Получаем ID рынка
  const marketId = selectedMarketId.value

  // Получаем ID региона из regionsData
  let regionId = null
  if (selectedRegion.value) {
    const regionEntry = regionsData.value.find(r => r[1] === selectedRegion.value)
    if (regionEntry) {
      regionId = regionEntry[0]
    }
  }

  // Формируем URL: /id_рынка или /id_рынка/id_региона
  const url = regionId
    ? `/${marketId}/${regionId}`
    : `/${marketId}`

  // Переходим на страницу
  router.push(url)
}

// Закрытие выпадающих списков при клике вне компонента
const handleClickOutside = (event) => {
  if (!event.target.closest('.custom-select[data-vue-managed]')) {
    isMarketSelectOpen.value = false
    isRegionSelectOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
/* Стили для Vue-управляемых селектов */
.custom-select[data-vue-managed].is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Скрываем дропдаун по умолчанию */
.custom-select[data-vue-managed] .custom-select__dropdown {
  display: none !important;
}

/* Показываем дропдаун когда открыт */
.custom-select[data-vue-managed].is-open .custom-select__dropdown {
  display: block !important;
}

.custom-select[data-vue-managed] .custom-select__list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
