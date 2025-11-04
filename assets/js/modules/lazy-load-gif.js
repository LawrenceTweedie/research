// Модуль для ленивой загрузки GIF
export function initLazyLoadGif() {
  const lazyGifs = Array.from(document.querySelectorAll('.lazy-load-gif'))

  lazyGifs.forEach(gif => {
    const src = gif.dataset.src
    if (!src) return

    const parent = gif.parentElement
    if (parent) parent.classList.add('loading')

    const img = new Image()
    img.src = src

    img.onload = () => {
      gif.src = src
      gif.classList.add('loaded')
      if (parent) parent.classList.remove('loading')
    }

    img.onerror = () => {
      if (parent) {
        parent.classList.remove('loading')
        parent.style.background = '#eee url("error-placeholder.png") center/cover no-repeat'
      }
    }
  })
}