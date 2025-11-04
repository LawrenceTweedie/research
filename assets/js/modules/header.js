// Модуль для работы с хедером
export function initHeader() {
  const header = document.querySelector('header')
  if (!header) return

  // Функция проверки позиции скролла
  function checkScrollPosition() {
    if (window.scrollY > 100) {
      header.classList.add('header--fit')
    } else {
      header.classList.remove('header--fit')
    }
  }

  // Инициализация
  checkScrollPosition()

  // Throttled scroll handler
  let ticking = false
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(checkScrollPosition)
      ticking = true
      setTimeout(() => { ticking = false }, 100)
    }
  }

  window.addEventListener('scroll', requestTick)

  // Мобильное меню
  const menuBtn = header.querySelector('.header__menu-btn')
  if (menuBtn) {
    function closeHeaderMenu() {
      document.documentElement.classList.remove('overflow-hidden')
      header.classList.remove('is-open')
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }

    function handleOutsideClick(e) {
      if (!e.target.closest('.menu') && e.target !== menuBtn) {
        closeHeaderMenu()
      }
    }

    function handleEscape(e) {
      if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
        closeHeaderMenu()
      }
    }

    menuBtn.addEventListener('click', () => {
      if (header.classList.contains('is-open')) {
        closeHeaderMenu()
      } else {
        document.documentElement.classList.add('overflow-hidden')
        header.classList.add('is-open')
        document.addEventListener('click', handleOutsideClick)
        document.addEventListener('keydown', handleEscape)
      }
    })

    // Делаем функцию доступной глобально
    window.closeHeaderMenu = closeHeaderMenu
  }
}