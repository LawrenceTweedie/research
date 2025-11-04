// Плагин для подключения vendor скриптов
// Раскомментируйте если у вас есть vendor.min.js с важными библиотеками

export default defineNuxtPlugin((nuxtApp) => {
  // Если нужно подключить vendor скрипты, раскомментируйте:

  /*
  const loadVendorScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = '/js/vendor.min.js'
      script.defer = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Загружаем vendor скрипты перед инициализацией основного функционала
  nuxtApp.hook('app:beforeMount', async () => {
    try {
      await loadVendorScript()
      console.log('Vendor scripts loaded successfully')
    } catch (error) {
      console.error('Failed to load vendor scripts:', error)
    }
  })
  */
})