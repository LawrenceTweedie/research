<script setup>
import { ref, onMounted } from 'vue'
import MarketCard from '~/components/MarketCard.vue'
import CallbackForm from '~/components/CallbackForm.vue'

// Примеры рынков для отображения на главной странице
const sampleMarkets = ref([
  {
    title: 'Рынок оборудования для очистки жидкостей',
    emotion: 'negative',
    marketVolume: '268 млрд руб.',
    investmentVolume: '463 млрд руб.',
    profitability: '4%',
    instability: '48%',
    link: '/1'
  },
  {
    title: 'Рынок картофеля',
    emotion: 'negative',
    marketVolume: '180 млрд руб.',
    investmentVolume: '320 млрд руб.',
    profitability: '6%',
    instability: '42%',
    link: '/1'
  },
  {
    title: 'Рынок программного обеспечения',
    emotion: 'positive',
    marketVolume: '450 млрд руб.',
    investmentVolume: '680 млрд руб.',
    profitability: '12%',
    instability: '28%',
    link: '/1'
  },
  {
    title: 'Рынок недвижимости',
    emotion: 'positive',
    marketVolume: '3.2 трлн руб.',
    investmentVolume: '1.8 трлн руб.',
    profitability: '8%',
    instability: '35%',
    link: '/1'
  },
  {
    title: 'Рынок электроники',
    emotion: 'positive',
    marketVolume: '890 млрд руб.',
    investmentVolume: '1.2 трлн руб.',
    profitability: '10%',
    instability: '30%',
    link: '/1'
  },
  {
    title: 'Рынок строительных материалов',
    emotion: 'neutral',
    marketVolume: '520 млрд руб.',
    investmentVolume: '720 млрд руб.',
    profitability: '5%',
    instability: '40%',
    link: '/1'
  }
])
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
    <section class="markets" id="markets">
      <div class="container markets__container">
        <h2 class="markets__title title">Рынки</h2>
        <div class="markets__header">
          <div class="custom-select markets__header-cities">
            <div class="custom-select__trigger">
              <svg width="24" height="24" aria-hidden="true">
                <use xlink:href="#icon-location"></use>
              </svg>
              <div class="custom-select__trigger-input">
                <input type="text" name="markets-cities" placeholder="Выберите регион..." autocomplete="off"><span class="custom-select__trigger-input-help"></span>
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
                  <label class="custom-field custom-field--checkbox" for="markets-cities-0">
                    <input class="visually-hidden" id="markets-cities-0" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Москва</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-1">
                    <input class="visually-hidden" id="markets-cities-1" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Санкт-Петербург</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-2">
                    <input class="visually-hidden" id="markets-cities-2" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Новосибирск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-3">
                    <input class="visually-hidden" id="markets-cities-3" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Екатеринбург</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-4">
                    <input class="visually-hidden" id="markets-cities-4" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Казань</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-5">
                    <input class="visually-hidden" id="markets-cities-5" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Нижний Новгород</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-6">
                    <input class="visually-hidden" id="markets-cities-6" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Челябинск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-7">
                    <input class="visually-hidden" id="markets-cities-7" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Самара</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-8">
                    <input class="visually-hidden" id="markets-cities-8" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Уфа</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-9">
                    <input class="visually-hidden" id="markets-cities-9" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Ростов-на-Дону</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-10">
                    <input class="visually-hidden" id="markets-cities-10" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Красноярск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-11">
                    <input class="visually-hidden" id="markets-cities-11" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Пермь</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-12">
                    <input class="visually-hidden" id="markets-cities-12" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Воронеж</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-13">
                    <input class="visually-hidden" id="markets-cities-13" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Волгоград</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-14">
                    <input class="visually-hidden" id="markets-cities-14" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Краснодар</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-15">
                    <input class="visually-hidden" id="markets-cities-15" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Саратов</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-16">
                    <input class="visually-hidden" id="markets-cities-16" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Тюмень</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-17">
                    <input class="visually-hidden" id="markets-cities-17" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Тольятти</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-18">
                    <input class="visually-hidden" id="markets-cities-18" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Ижевск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-19">
                    <input class="visually-hidden" id="markets-cities-19" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Барнаул</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-20">
                    <input class="visually-hidden" id="markets-cities-20" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Ульяновск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-21">
                    <input class="visually-hidden" id="markets-cities-21" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Иркутск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-22">
                    <input class="visually-hidden" id="markets-cities-22" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Хабаровск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-23">
                    <input class="visually-hidden" id="markets-cities-23" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Ярославль</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-24">
                    <input class="visually-hidden" id="markets-cities-24" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Владивосток</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-25">
                    <input class="visually-hidden" id="markets-cities-25" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Махачкала</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-26">
                    <input class="visually-hidden" id="markets-cities-26" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Томск</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-27">
                    <input class="visually-hidden" id="markets-cities-27" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Оренбург</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-28">
                    <input class="visually-hidden" id="markets-cities-28" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Кемерово</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-cities-29">
                    <input class="visually-hidden" id="markets-cities-29" name="markets-cities" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Новокузнецк</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div class="custom-select markets__header-categories">
            <div class="custom-select__trigger">
              <svg width="24" height="24" aria-hidden="true">
                <use xlink:href="#icon-grid"></use>
              </svg>
              <div class="custom-select__trigger-input">
                <input type="text" name="markets-categories" placeholder="Выберите категорию рынка - например, “Рынок недвижимости”..." autocomplete="off"><span class="custom-select__trigger-input-help"></span>
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
                  <label class="custom-field custom-field--checkbox" for="markets-categories-0">
                    <input class="visually-hidden" id="markets-categories-0" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Фото / кинооборудование</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-categories-1">
                    <input class="visually-hidden" id="markets-categories-1" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Компьютерные игры</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-categories-2">
                    <input class="visually-hidden" id="markets-categories-2" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Дизайнерские услуги</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-categories-3">
                    <input class="visually-hidden" id="markets-categories-3" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Инвестиции</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-categories-4">
                    <input class="visually-hidden" id="markets-categories-4" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Недвижимость</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-categories-5">
                    <input class="visually-hidden" id="markets-categories-5" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Медицинское оборудование</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-categories-6">
                    <input class="visually-hidden" id="markets-categories-6" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Смартфоны и Гаджеты</span>
                  </label>
                </li>
                <li class="custom-select__item">
                  <label class="custom-field custom-field--checkbox" for="markets-categories-7">
                    <input class="visually-hidden" id="markets-categories-7" name="markets-categories" type="radio" autocomplete="off"><span class="custom-field__icon">
                          <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                          </svg></span><span class="custom-field__text">Спецтехника</span>
                  </label>
                </li>
              </ul>
            </div>
          </div><a class="button markets__header-link button button--lg button--cold" title="text" href="#!">Смотреть все</a>
        </div>
        <ul class="markets__list">
          <li v-for="(market, index) in sampleMarkets" :key="index" class="markets__item">
            <MarketCard :market="market" />
          </li>
          <!-- Статичный пример для демонстрации (можно удалить) -->
          <!-- <li class="markets__item"> <a class="market-card markets__item-card market-card--negative" href="/markets.html" title="Рынок оборудования для очистки жидкостей">
            <div class="market-card__icon">
              <svg aria-hidden="true">
                <use xlink:href="#icon-arrow--link"></use>
              </svg>
            </div>
            <div class="market-card__title">Рынок оборудования для очистки жидкостей<span class="color--gray">2024</span></div>
            <ul class="market-card__state">
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-brain"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">AI:</div>
                <div class="market-card__state-item-text">Негативно</div>
              </li>
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-expert"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">Эксперты:</div>
                <div class="market-card__state-item-text">Негативно</div>
              </li>
            </ul>
            <ul class="market-card__list">
              <li class="market-card__item">
                <div class="market-card__item-name">Объем рынка:</div>
                <div class="market-card__item-number">268 млрд руб. </div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Объем инвестиций:</div>
                <div class="market-card__item-number">463 млрд руб.</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Среднерыночная рентабельность:</div>
                <div class="market-card__item-number">4%</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Уровень финансовой нестабильности:</div>
                <div class="market-card__item-number">48%</div>
              </li>
            </ul></a>
          </li>
          <li class="markets__item"> <a class="market-card markets__item-card market-card--negative" href="/markets.html" title="Рынок оборудования для очистки жидкостей">
            <div class="market-card__icon">
              <svg aria-hidden="true">
                <use xlink:href="#icon-arrow--link"></use>
              </svg>
            </div>
            <div class="market-card__title">Рынок оборудования для очистки жидкостей<span class="color--gray">2024</span></div>
            <ul class="market-card__state">
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-brain"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">AI:</div>
                <div class="market-card__state-item-text">Негативно</div>
              </li>
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-expert"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">Эксперты:</div>
                <div class="market-card__state-item-text">Негативно</div>
              </li>
            </ul>
            <ul class="market-card__list">
              <li class="market-card__item">
                <div class="market-card__item-name">Объем рынка:</div>
                <div class="market-card__item-number">268 млрд руб. </div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Объем инвестиций:</div>
                <div class="market-card__item-number">463 млрд руб.</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Среднерыночная рентабельность:</div>
                <div class="market-card__item-number">4%</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Уровень финансовой нестабильности:</div>
                <div class="market-card__item-number">48%</div>
              </li>
            </ul></a>
          </li>
          <li class="markets__item"> <a class="market-card markets__item-card market-card--positive" href="/markets.html" title="Рынок оборудования для очистки жидкостей">
            <div class="market-card__icon">
              <svg aria-hidden="true">
                <use xlink:href="#icon-arrow--link"></use>
              </svg>
            </div>
            <div class="market-card__title">Рынок оборудования для очистки жидкостей<span class="color--gray">2024</span></div>
            <ul class="market-card__state">
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-brain"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">AI:</div>
                <div class="market-card__state-item-text">Положительно</div>
              </li>
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-expert"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">Эксперты:</div>
                <div class="market-card__state-item-text">Положительно</div>
              </li>
            </ul>
            <ul class="market-card__list">
              <li class="market-card__item">
                <div class="market-card__item-name">Объем рынка:</div>
                <div class="market-card__item-number">268 млрд руб. </div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Объем инвестиций:</div>
                <div class="market-card__item-number">463 млрд руб.</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Среднерыночная рентабельность:</div>
                <div class="market-card__item-number">4%</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Уровень финансовой нестабильности:</div>
                <div class="market-card__item-number">48%</div>
              </li>
            </ul></a>
          </li>
          <li class="markets__item"> <a class="market-card markets__item-card market-card--positive" href="/markets.html" title="Рынок оборудования для очистки жидкостей">
            <div class="market-card__icon">
              <svg aria-hidden="true">
                <use xlink:href="#icon-arrow--link"></use>
              </svg>
            </div>
            <div class="market-card__title">Рынок оборудования для очистки жидкостей<span class="color--gray">2024</span></div>
            <ul class="market-card__state">
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-brain"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">AI:</div>
                <div class="market-card__state-item-text">Положительно</div>
              </li>
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-expert"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">Эксперты:</div>
                <div class="market-card__state-item-text">Положительно</div>
              </li>
            </ul>
            <ul class="market-card__list">
              <li class="market-card__item">
                <div class="market-card__item-name">Объем рынка:</div>
                <div class="market-card__item-number">268 млрд руб. </div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Объем инвестиций:</div>
                <div class="market-card__item-number">463 млрд руб.</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Среднерыночная рентабельность:</div>
                <div class="market-card__item-number">4%</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Уровень финансовой нестабильности:</div>
                <div class="market-card__item-number">48%</div>
              </li>
            </ul></a>
          </li>
          <li class="markets__item"> <a class="market-card markets__item-card market-card--positive" href="/markets.html" title="Рынок оборудования для очистки жидкостей">
            <div class="market-card__icon">
              <svg aria-hidden="true">
                <use xlink:href="#icon-arrow--link"></use>
              </svg>
            </div>
            <div class="market-card__title">Рынок оборудования для очистки жидкостей<span class="color--gray">2024</span></div>
            <ul class="market-card__state">
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-brain"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">AI:</div>
                <div class="market-card__state-item-text">Положительно</div>
              </li>
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-expert"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">Эксперты:</div>
                <div class="market-card__state-item-text">Положительно</div>
              </li>
            </ul>
            <ul class="market-card__list">
              <li class="market-card__item">
                <div class="market-card__item-name">Объем рынка:</div>
                <div class="market-card__item-number">268 млрд руб. </div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Объем инвестиций:</div>
                <div class="market-card__item-number">463 млрд руб.</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Среднерыночная рентабельность:</div>
                <div class="market-card__item-number">4%</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Уровень финансовой нестабильности:</div>
                <div class="market-card__item-number">48%</div>
              </li>
            </ul></a>
          </li>
          <li class="markets__item"> <a class="market-card markets__item-card market-card--" href="/markets.html" title="Рынок оборудования для очистки жидкостей">
            <div class="market-card__icon">
              <svg aria-hidden="true">
                <use xlink:href="#icon-arrow--link"></use>
              </svg>
            </div>
            <div class="market-card__title">Рынок оборудования для очистки жидкостей<span class="color--gray">2024</span></div>
            <ul class="market-card__state">
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-brain"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">AI:</div>
                <div class="market-card__state-item-text">Нейтрально</div>
              </li>
              <li class="market-card__state-item">
                <div class="market-card__state-item-icon">
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="#icon-expert"></use>
                  </svg>
                </div>
                <div class="market-card__state-item-title">Эксперты:</div>
                <div class="market-card__state-item-text">Нейтрально</div>
              </li>
            </ul>
            <ul class="market-card__list">
              <li class="market-card__item">
                <div class="market-card__item-name">Объем рынка:</div>
                <div class="market-card__item-number">268 млрд руб. </div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Объем инвестиций:</div>
                <div class="market-card__item-number">463 млрд руб.</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Среднерыночная рентабельность:</div>
                <div class="market-card__item-number">4%</div>
              </li>
              <li class="market-card__item">
                <div class="market-card__item-name">Уровень финансовой нестабильности:</div>
                <div class="market-card__item-number">48%</div>
              </li>
            </ul></a>
          </li> -->
        </ul>
        <div class="pagination pagination--grid markets__pagination">
          <div class="pagination__info">1-10 of 1,250</div>
          <div class="pagination__navigation">
            <button class="pagination__btn pagination__btn--prev" type="button" title="Back page" disabled>
              <svg width="16" height="16" aria-hidden="true">
                <use xlink:href="#icon-arrow--select"></use>
              </svg>Back
            </button>
            <ul class="pagination__list">
              <li class="pagination__list-item"><a class="pagination__list-item-link is-active" href="#!" title="1">1</a></li>
              <li class="pagination__list-item"><a class="pagination__list-item-link" href="#!" title="2">2</a></li>
              <li class="pagination__list-item"><a class="pagination__list-item-link" href="#!" title="3">3</a></li>
              <li class="pagination__list-item"><a class="pagination__list-item-link" href="#!" title="4">4</a></li>
              <li class="pagination__list-item"><a class="pagination__list-item-link" href="#!" title="5">5</a></li>
              <li class="pagination__list-item"><a class="pagination__list-item-link" href="#!" title="6-10">...</a></li>
              <li class="pagination__list-item"><a class="pagination__list-item-link" href="#!" title="123">123</a></li>
            </ul>
            <button class="pagination__btn pagination__btn--next" type="button" title="Next page">Next
              <svg width="16" height="16" aria-hidden="true">
                <use xlink:href="#icon-arrow--select"></use>
              </svg>
            </button>
          </div>
          <div class="pagination__select">
            <div class="pagination__select-text">Result per page</div>
            <div class="pagination-select">
              <div class="pagination-select__trigger">
                <div class="pagination-select__trigger-title">10</div>
                <div class="pagination-select__trigger-icon">
                  <svg width="16" height="16" aria-hidden="true">
                    <use xlink:href="#icon-arrow--select"></use>
                  </svg>
                </div>
              </div>
              <div class="pagination-select__list">
                <div class="pagination-select__item visually-hidden">10</div>
                <div class="pagination-select__item">25</div>
                <div class="pagination-select__item">50</div>
                <div class="pagination-select__item">100</div>
                <div class="pagination-select__item">200</div>
                <div class="pagination-select__item">500</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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