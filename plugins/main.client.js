// Плагин для инициализации JavaScript функциональности
import { initHeader } from '~/assets/js/modules/header.js'
import { initCharts } from '~/assets/js/modules/charts.js'
import { initCustomSelects } from '~/assets/js/modules/custom-select.js'
import { initValidateFields, initValidateForms } from '~/assets/js/modules/form-validation.js'
import { initLazyLoadGif } from '~/assets/js/modules/lazy-load-gif.js'
import { initAnchors } from '~/assets/js/modules/anchors.js'

export default defineNuxtPlugin((nuxtApp) => {
  // Ждем полной загрузки DOM
  nuxtApp.hook('app:mounted', () => {
    // Инициализация всех JS модулей из статической верстки
    initMainFunctionality()
  })

  // Инициализация при клиентской навигации
  nuxtApp.hook('page:finish', () => {
    initMainFunctionality()
  })
})

function initMainFunctionality() {
  console.log('Initializing main functionality...')

  // Установка CSS переменных для viewport
  setViewportVariables()

  // Расчет ширины скроллбара
  setScrollbarWidth()

  // Инициализация всех модулей
  initHeader()
  initLazyLoadGif()
  initAnchors()
  initCustomSelects()
  initValidateFields()
  initValidateForms()
  initCharts()
}

function setViewportVariables() {
  const setVH = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  const throttledSetVH = throttle(setVH, 100)

  setVH()
  document.addEventListener('scroll', throttledSetVH)
  window.addEventListener('resize', setVH)
  window.addEventListener('orientationchange', setVH)
}

function setScrollbarWidth() {
  const calcWidthScrollbar = () => {
    const div = document.createElement('div')
    div.style.overflowY = 'scroll'
    div.style.width = '50px'
    div.style.height = '50px'
    document.body.append(div)

    const scrollbarWidth = div.offsetWidth - div.clientWidth
    div.remove()

    return scrollbarWidth
  }

  const scrollbarWidth = calcWidthScrollbar()
  document.documentElement.style.setProperty('--padding-right', `${scrollbarWidth}px`)

  // Обновление при изменении размера окна
  const updateScrollbarWidth = () => {
    const width = calcWidthScrollbar()
    document.documentElement.style.setProperty('--padding-right', `${width}px`)
  }

  window.addEventListener('resize', updateScrollbarWidth)
  window.addEventListener('orientationchange', updateScrollbarWidth)
}

// Вспомогательные функции
function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}