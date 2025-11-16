<script setup>
import CallbackForm from '~/components/CallbackForm.vue'
import MarketsSection from '~/components/MarketsSection.vue'

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

// Загружаем данные СИНХРОННО при SSG - данные встраиваются прямо в HTML
// Используем прямой await $fetch вместо useAsyncData чтобы избежать payload
let marketsData = []
try {
  // Загружаем основные данные из публичной директории
  const marketsRes = await $fetch('/data/markets.json')
  const searchRes = await $fetch('/data/search.json')

  // Для каждого рынка загружаем данные
  const marketPromises = Object.entries(marketsRes).map(async ([marketName, marketId]) => {
    try {
      const newsData = await $fetch(`/data/${marketId}_news.json`)
      const regionData = await $fetch(`/data/${marketId}_region.json`)

      // Получаем агрегированные данные по всей России
      const firstRegion = Object.keys(regionData)[0]
      const metrics = firstRegion ? regionData[firstRegion] : {}

      // Определяем emotion для AI и экспертов
      let emotionAI = 'neutral'
      let emotionExperts = 'neutral'

      if (newsData.emotion_ai || newsData.emotion_experts) {
        emotionAI = parseEmotion(newsData.emotion_ai)
        emotionExperts = parseEmotion(newsData.emotion_experts)
      } else if (newsData.emotion) {
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
        regions: searchRes[marketName] || []
      }
    } catch (error) {
      console.error(`Error loading data for market ${marketId}:`, error)
      return null
    }
  })

  const markets = await Promise.all(marketPromises)
  marketsData = markets.filter(m => m !== null)
} catch (error) {
  console.error('Error loading markets data:', error)
  marketsData = []
}
</script>

<template>
  <main>
    <section class="hero">
      <div class="container hero__container">
        <div class="hero__content">
          <div class="hero__bg"><img class="hero__bg-gif lazy-load-gif" src="/img/content/hero/ff-hero-bnr-0.webp" alt="Анимированный баннер" data-src="/img/content/hero/hero-bnr-0.gif" loading="lazy"></div>
          <h1 class="hero__title">Все рынки России и&nbsp;её&nbsp;регионов&nbsp;&mdash; в&nbsp;одном месте</h1>
          <p class="hero__subtitle">Данные, которые вы&nbsp;искали неделями&nbsp;&mdash; теперь доступны за&nbsp;3&nbsp;клика бесплатно</p>
          <SearchForm />
          <div class="hero__sources">
            <div class="hero__sources-bg"> <img src="/img/content/pictures/hero-footnote-bg.png" srcset="/img/content/pictures/hero-footnote-bg@2x.png 2x" width="425" height="176" alt="hero-footnonte-bg">
            </div>
            <div class="hero__sources-text"> <span class="color--gray">Источники: </span><span class="text--500">ФНС, Росстат, Опросы, Исследования</span></div>
            <ul class="hero__sources-pics">
              <li class="hero__sources-pics-item"><img src="/img/content/sources/fns.png" srcset="/img/content/sources/fns@2x.png 2x" width="54" height="54" alt="ФНС">
              </li>
              <li class="hero__sources-pics-item"><img src="/img/content/sources/rosstat.png" srcset="/img/content/sources/rosstat@2x.png 2x" width="54" height="54" alt="Росстат">
              </li>
              <li class="hero__sources-pics-item"><img src="/img/content/sources/polls.png" srcset="/img/content/sources/polls@2x.png 2x" width="54" height="54" alt="Опросы">
              </li>
              <li class="hero__sources-pics-item"><img src="/img/content/sources/researches.png" srcset="/img/content/sources/researches@2x.png 2x" width="54" height="54" alt="Исследования">
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="about-us" id="about-us">
      <div class="about-us__bg about-us__bg--1"><img src="/img/content/pictures/ai.png" srcset="/img/content/pictures/ai@2x.png 2x" width="423" height="423" alt="AI">
      </div>
      <div class="about-us__bg about-us__bg--2"><img src="/img/content/pictures/chart.png" srcset="/img/content/pictures/chart@2x.png 2x" width="284" height="298" alt="chart">
      </div>
      <div class="container about-us__container">
        <div class="about-us__pretitle pretitle">О нас</div>
        <h2 class="about-us__title title">InResearch - это</h2>
        <ul class="about-us__list">
          <li class="about-us__item">
            <h3 class="about-us__item-title title">1500+</h3>
            <p class="about-us__item-desc">Рынков по РФ и регионам</p><span class="about-us__item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg></span>
          </li>
          <li class="about-us__item">
            <h3 class="about-us__item-title title">3 000+</h3>
            <p class="about-us__item-desc">Анализируемых источников ежедневно</p><span class="about-us__item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg></span>
          </li>
          <li class="about-us__item">
            <h3 class="about-us__item-title title">1 000 000+</h3>
            <p class="about-us__item-desc">Финансовых отчетностей компаний</p><span class="about-us__item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg></span>
          </li>
          <li class="about-us__item">
            <h3 class="about-us__item-title title">50 000+</h3>
            <p class="about-us__item-desc">Активных исследователей</p><span class="about-us__item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg></span>
          </li>
          <li class="about-us__item">
            <h3 class="about-us__item-title title">AI-решение</h3>
            <p class="about-us__item-desc">Собственной разработки</p><span class="about-us__item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-check"></use>
                  </svg></span>
          </li>
        </ul>
      </div>
    </section>
    <section class="peculiarities" id="peculiarities">
      <div class="container peculiarities__container">
        <div class="peculiarities__pretitle pretitle">Немного подробностей</div>
        <h2 class="peculiarities__title title">Особенности </h2>
        <ul class="peculiarities__list">
          <li class="peculiarities__item"><span class="peculiarities__item-icon">
                  <svg width="32" height="32" aria-hidden="true">
                    <use xlink:href="#icon-robot"></use>
                  </svg></span>
            <h3 class="peculiarities__item-title">AI&nbsp;следит за&nbsp;рынком</h3>
            <p class="peculiarities__item-desc">Искусственный Интеллект анализирует 10&nbsp;000+ статей в&nbsp;неделю</p>
          </li>
          <li class="peculiarities__item"><span class="peculiarities__item-icon">
                  <svg width="32" height="32" aria-hidden="true">
                    <use xlink:href="#icon-map"></use>
                  </svg></span>
            <h3 class="peculiarities__item-title">Большая часть рынков под анализом</h3>
            <p class="peculiarities__item-desc">Охват&nbsp;&mdash; 70% рынков в&nbsp;во&nbsp;всех регионах</p>
          </li>
          <li class="peculiarities__item"><span class="peculiarities__item-icon">
                  <svg width="32" height="32" aria-hidden="true">
                    <use xlink:href="#icon-bulb"></use>
                  </svg></span>
            <h3 class="peculiarities__item-title">Каждая цифра&nbsp;&mdash; обоснована</h3>
            <p class="peculiarities__item-desc">Научный подход к&nbsp;выбору и&nbsp;расчету показателей</p>
          </li>
          <li class="peculiarities__item"><span class="peculiarities__item-icon">
                  <svg width="32" height="32" aria-hidden="true">
                    <use xlink:href="#icon-money-hand"></use>
                  </svg></span>
            <h3 class="peculiarities__item-title">Вся экономика страны&nbsp;&mdash; в&nbsp;одном месте</h3>
            <p class="peculiarities__item-desc">Самое крупное в&nbsp;РФ аналитическое пространство</p>
          </li>
          <li class="peculiarities__item"><span class="peculiarities__item-icon">
                  <svg width="32" height="32" aria-hidden="true">
                    <use xlink:href="#icon-money-hand"></use>
                  </svg></span>
            <h3 class="peculiarities__item-title">Данные открыты и&nbsp;доступны для всех</h3>
            <p class="peculiarities__item-desc">Открытый доступ к&nbsp;аналитике экономики страны для каждого</p>
          </li>
        </ul>
      </div>
    </section>
    <MarketsSection :initial-markets="marketsData" />
    <section class="services" id="services">
      <div class="container services__container">
        <div class="services__pretitle pretitle">Поддержите нашу деятельность приобретением глубокого исследования</div>
        <h2 class="services__title title">Чем мы&nbsp;можем помочь?</h2>
        <ul class="services__list">
          <li class="services__item service">
            <div class="service__header">
              <h3 class="service__title">Исследование конъюктуры рынка</h3>
              <div class="service__price">199 000 руб.
              </div>
            </div>
            <ul class="service__list">
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Более 80&nbsp;показателей
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Финансовый анализ каждой фирмы в&nbsp;отрасли
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Анализ 1000+ российских и&nbsp;международных новостных источников
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Глубинные интервью с&nbsp;представителями отрасли
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Глубинные интервью с&nbsp;представителями отрасли
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Прогнозы на&nbsp;основе экономико-математических методов и&nbsp;машинного обучения
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Анализ всех научных публикаций по&nbsp;теме отрасли за&nbsp;последние 10&nbsp;лет
              </li>
            </ul>
            <button class="button service__link button button--lg button--cold" title="text" type="button" data-anchor="callback-form">Приобрести услуги</button>
            <div class="service__bg"> <img src="/img/content/pictures/research.png" srcset="/img/content/pictures/research@2x.png 2x" width="456" height="456" alt="research">
            </div>
          </li>
          <li class="services__item service">
            <div class="service__header">
              <h3 class="service__title">База данных всех компаний отрасли</h3>
              <div class="service__price">9 000 руб.
                <div class="service__price-old">19 000 руб.</div>
              </div>
            </div>
            <ul class="service__list">
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Все показатели в&nbsp;одном месте
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Глубокий финансовый анализ всех компаний
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Единая удобная база данных
              </li>
              <li class="service__item">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>Ретроспектива&nbsp;&mdash; 5&nbsp;лет
              </li>
            </ul>
            <button class="button service__link button button--lg button--cold" title="text" type="button" data-anchor="callback-form">Приобрести услуги</button>
            <div class="service__bg"> <img src="/img/content/pictures/server.png" srcset="/img/content/pictures/server@2x.png 2x" width="456" height="456" alt="server">
            </div>
          </li>
        </ul>
      </div>
    </section>
    <CallbackForm />
  </main>
</template>

<style scoped>

</style>