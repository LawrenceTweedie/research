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
          <div class="market-info__actions">
            <button class="icon-btn" title="Поделиться">📤</button>
            <button class="icon-btn" title="В избранное">⭐</button>
          </div>
        </div>

        <div class="market-info__description">
          <p>С 2020 по 2024 годы рынок {{ marketName.toLowerCase() }} демонстрировал динамичное развитие.</p>
        </div>

        <!-- Выбор региона -->
        <div class="region-selector">
          <label>Выберите регион:</label>
          <select v-model="selectedRegionId" @change="changeRegion">
            <option value="99">Вся Россия</option>
            <option v-for="region in availableRegions" :key="region[0]" :value="region[0]">
              {{ region[1] }}
            </option>
          </select>
        </div>
      </section>

      <!-- Виды деятельности -->
      <section class="activities">
        <h2 class="section-title">Виды деятельности</h2>
        <div class="activities-grid">
          <div v-for="activity in mockActivities" :key="activity" class="activity-card">
            {{ activity }}
          </div>
        </div>
        <p class="info-note">
          * Данные о видах деятельности загружаются из файла {{marketId}}_okv.json на сервере
        </p>
      </section>

      <!-- Анализ новостей -->
      <section class="news-analysis">
        <h2 class="section-title">Анализ новостей с помощью ИИ</h2>
        <div class="news-grid">
          <div v-for="news in mockNews" :key="news.title" class="news-card" :class="`news-card--${news.emotion}`">
            <div class="news-card__emotion">
              {{ news.emotion === 'positive' ? '😊' : news.emotion === 'negative' ? '😟' : '😐' }}
            </div>
            <h3 class="news-card__title">{{ news.title }}</h3>
            <a :href="news.link" class="news-card__link" target="_blank">Читать полностью →</a>
          </div>
        </div>
        <p class="info-note">
          * Новости автоматически обновляются раз в месяц из файла {{marketId}}_news.json
        </p>
      </section>

      <!-- Топ-10 компаний -->
      <section class="top-companies">
        <h2 class="section-title">Топ-10 компаний по выручке</h2>
        <div class="table-wrapper">
          <table class="companies-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Название компании</th>
                <th>Выручка (млн руб.)</th>
                <th>Регион</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(company, index) in mockCompanies" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ company.name }}</td>
                <td>{{ company.revenue }}</td>
                <td>{{ company.region }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="info-note">
          * Данные загружаются из файла {{marketId}}_top10.json (для всей России) или
          {{marketId}}_regions_top10.json (для конкретного региона)
        </p>
      </section>

      <!-- Показатели рынка -->
      <section class="market-metrics">
        <h2 class="section-title">Показатели рынка (2020-2024)</h2>
        <div class="metrics-grid">
          <div v-for="metric in mockMetrics" :key="metric.name" class="metric-card">
            <h3 class="metric-card__title">{{ metric.name }}</h3>
            <div class="metric-chart">
              <div v-for="(value, year) in metric.data" :key="year" class="chart-bar">
                <div class="chart-bar__value" :style="{ height: `${value / Math.max(...Object.values(metric.data)) * 100}%` }">
                  <span class="chart-bar__label">{{ value }}</span>
                </div>
                <div class="chart-bar__year">{{ year }}</div>
              </div>
            </div>
          </div>
        </div>
        <p class="info-note">
          * Данные загружаются из файла {{marketId}}_metrics.json (для всей России) или
          {{marketId}}_region.json (для конкретного региона)
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const marketId = computed(() => route.params.marketId);
const regionId = ref(route.params.regionId);

const searchData = ref({});
const regionsData = ref([]);
const marketName = ref('Загрузка...');
const regionName = ref('Загрузка...');
const selectedRegionId = ref(regionId.value);
const availableRegions = ref([]);

// Моковые данные (в реальности загружаются с сервера)
const mockActivities = ref([
  'Производство оборудования',
  'Оптовая торговля',
  'Розничная торговля',
  'Техническое обслуживание',
  'Консультационные услуги'
]);

const mockNews = ref([
  {
    title: 'Рост спроса на продукцию в регионе',
    emotion: 'positive',
    link: '#'
  },
  {
    title: 'Снижение инвестиций в отрасль',
    emotion: 'negative',
    link: '#'
  },
  {
    title: 'Стабильная динамика рынка',
    emotion: 'neutral',
    link: '#'
  }
]);

const mockCompanies = ref([
  { name: 'ООО "Компания 1"', revenue: '1500', region: 'Москва' },
  { name: 'ООО "Компания 2"', revenue: '1200', region: 'Санкт-Петербург' },
  { name: 'ООО "Компания 3"', revenue: '1000', region: 'Москва' },
  { name: 'ООО "Компания 4"', revenue: '850', region: 'Новосибирск' },
  { name: 'ООО "Компания 5"', revenue: '700', region: 'Екатеринбург' },
  { name: 'ООО "Компания 6"', revenue: '650', region: 'Казань' },
  { name: 'ООО "Компания 7"', revenue: '600', region: 'Нижний Новгород' },
  { name: 'ООО "Компания 8"', revenue: '550', region: 'Красноярск' },
  { name: 'ООО "Компания 9"', revenue: '500', region: 'Челябинск' },
  { name: 'ООО "Компания 10"', revenue: '450', region: 'Самара' }
]);

const mockMetrics = ref([
  {
    name: 'Объем рынка (млрд руб.)',
    data: { 2020: 50, 2021: 65, 2022: 80, 2023: 95, 2024: 110 }
  },
  {
    name: 'Количество компаний',
    data: { 2020: 150, 2021: 180, 2022: 200, 2023: 220, 2024: 250 }
  }
]);

// Загрузка данных
onMounted(async () => {
  try {
    const [searchRes, regionsRes] = await Promise.all([
      fetch('/data/search.json'),
      fetch('/data/regions.json')
    ]);
    searchData.value = await searchRes.json();
    regionsData.value = await regionsRes.json();

    // Получаем название рынка
    const markets = Object.keys(searchData.value);
    const marketIndex = parseInt(marketId.value) - 1;
    marketName.value = markets[marketIndex] || 'Неизвестный рынок';

    // Получаем название региона
    if (regionId.value === '99') {
      regionName.value = 'Вся Россия';
    } else {
      const region = regionsData.value.find(r => r[0] === regionId.value);
      regionName.value = region ? region[1] : 'Неизвестный регион';
    }

    // Получаем доступные регионы для этого рынка
    const regionNames = searchData.value[marketName.value] || [];
    availableRegions.value = regionsData.value.filter(r => regionNames.includes(r[1]));
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
});

const changeRegion = () => {
  router.push(`/${marketId.value}/${selectedRegionId.value}`);
};
</script>

