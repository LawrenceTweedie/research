// Модуль для работы с кастомными селектами
export function initCustomSelects() {
  // Исключаем Vue-управляемые селекты
  const selects = Array.from(document.querySelectorAll('.custom-select:not([data-vue-managed])'))

  selects.forEach(select => initCustomSelect(select))
}

function initCustomSelect(select) {
  const trigger = select.querySelector('.custom-select__trigger')
  const input = trigger?.querySelector('input')
  const helpText = trigger?.querySelector('.custom-select__trigger-input-help')
  const list = select.querySelector('.custom-select__list')
  const items = list ? Array.from(list.querySelectorAll('.custom-select__item')) : []

  function resetItemsVisibility() {
    items.forEach(item => item.classList.remove('visually-hidden'))
    if (helpText) helpText.textContent = ''
  }

  // Клик по триггеру
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      if (e.target !== input) {
        select.classList.toggle('is-open')
        if (helpText) helpText.textContent = ''
        e.stopPropagation()
      }
    })
  }

  // Клик по элементу списка
  items.forEach(item => {
    item.addEventListener('click', () => {
      const text = item.querySelector('.custom-field__text').textContent
      if (input) input.value = text
      select.classList.remove('is-open')
      resetItemsVisibility()
    })
  })

  // Поиск/фильтрация
  if (input) {
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase()
      let firstMatch = null
      let hasMatches = false
      const startsWithUpper = query.length > 0 && query[0] === query[0].toUpperCase()

      items.forEach(item => {
        const text = item.querySelector('.custom-field__text')?.textContent.trim() || ''
        const lowerText = text.toLowerCase()
        const checkbox = item.querySelector('input')

        if (lowerText.includes(query)) {
          item.classList.remove('visually-hidden')
          hasMatches = true

          if (query.length >= 2) {
            select.classList.add('is-open')
          } else {
            select.classList.remove('is-open')
          }

          if (!firstMatch && query.length > 0 && startsWithUpper && text.startsWith(query)) {
            firstMatch = text
          }

          if (query.length > 0 && lowerText === query) {
            if (checkbox) checkbox.checked = true
            if (input) input.value = text
            select.classList.remove('is-open')
            resetItemsVisibility()
            input.blur()
          } else {
            if (checkbox) checkbox.checked = false
          }
        } else {
          item.classList.add('visually-hidden')
          if (checkbox) checkbox.checked = false
        }
      })

      if (helpText) {
        helpText.textContent = firstMatch || ''
      }

      if (hasMatches) {
        select.classList.remove('is-empty')
      } else {
        select.classList.add('is-empty')
      }
    })

    input.addEventListener('focus', () => select.classList.add('is-focused'))
    input.addEventListener('blur', () => select.classList.remove('is-focused'))
  }

  // Закрытие при клике вне
  document.addEventListener('click', (e) => {
    if (!select.contains(e.target)) {
      select.classList.remove('is-open')
      if (helpText) helpText.textContent = ''
    }
  })
}