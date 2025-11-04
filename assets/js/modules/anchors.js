// Модуль для работы с якорями
export function initAnchors() {
  const anchors = Array.from(document.querySelectorAll('[data-anchor]'))

  anchors.forEach(anchor => {
    anchor.addEventListener('click', handleAnchorClick)
  })
}

function handleAnchorClick(e) {
  e.preventDefault()

  const anchor = e.currentTarget
  const targetId = anchor.getAttribute('data-anchor')
  const targetElement = document.getElementById(targetId)

  if (!targetElement) return

  // Проверка на мобильное устройство и аккордеон
  const isMobile = window.matchMedia('(max-width: 767px)').matches
  if (isMobile && anchor.classList.contains('js-accordion-trigger')) {
    return
  }

  setTimeout(() => {
    if (!targetElement) return

    const headerHeight = document.querySelector('.header')?.offsetHeight || 0
    const targetPosition = targetElement.getBoundingClientRect().top
    const infoNavMenu = document.querySelector('[data-info-nav-menu]')
    const infoNavMenuHeight = infoNavMenu ? infoNavMenu.offsetHeight : 0

    const offset = targetPosition - headerHeight - 20 - infoNavMenuHeight

    // Закрытие мобильного меню если нужно
    if (anchor.closest('.menu') && window.matchMedia('(max-width: 1023px)').matches) {
      const header = document.querySelector('header')
      if (header) {
        header.classList.remove('is-open')
      }
    }

    window.scrollBy({
      top: offset,
      behavior: 'smooth'
    })
  }, 100)
}