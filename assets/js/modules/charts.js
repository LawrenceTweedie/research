// Модуль для работы с графиками
export function initCharts() {
  const charts = Array.from(document.querySelectorAll('.chart'))

  if (charts.length === 0) return

  charts.forEach(chartElement => {
    const years = Array.from(chartElement.querySelectorAll('.chart__year')).map(el => el.textContent)
    const values = Array.from(chartElement.querySelectorAll('.chart__value')).map(el => parseFloat(el.textContent))

    if (years.length !== values.length) {
      console.error('Массивы годов и значений должны иметь одинаковую длину.')
      return
    }

    createChart(chartElement, years, values)
  })
}

function createChart(container, years, values) {
  const maxValue = Math.max(...values)
  container.innerHTML = ''

  years.forEach((year, index) => {
    const value = values[index]
    const percentage = (value / maxValue) * 100
    const clampedPercentage = Math.min(percentage, 200)

    const chartItem = document.createElement('div')
    chartItem.className = 'chart__item'

    if (+value === +maxValue) {
      chartItem.classList.add('chart__item--top')
    }

    // Значение
    const valueElement = document.createElement('div')
    valueElement.className = 'chart__item-value'
    valueElement.textContent = formatNumber(value)
    chartItem.appendChild(valueElement)

    // Бар
    const barContainer = document.createElement('div')
    barContainer.className = 'chart__item-bar'

    const bar = document.createElement('span')
    bar.style.height = '0%'
    barContainer.appendChild(bar)
    chartItem.appendChild(barContainer)

    // Год
    const yearElement = document.createElement('div')
    yearElement.className = 'chart__item-year'
    yearElement.textContent = year
    chartItem.appendChild(yearElement)

    container.appendChild(chartItem)

    // Анимация
    setTimeout(() => {
      animateBar(bar, clampedPercentage)
    }, 50 * index)
  })
}

function animateBar(element, targetHeight) {
  let currentHeight = 0
  const increment = targetHeight / 30 // 30 frames for smooth animation

  function animate() {
    currentHeight += increment
    if (currentHeight >= targetHeight) {
      element.style.height = `${targetHeight}%`
    } else {
      element.style.height = `${currentHeight}%`
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M'
  }
  return new Intl.NumberFormat('ru-RU').format(num)
}