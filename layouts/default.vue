<template>
  <div class="wrapper">
    <header class="header header--fit">
      <div class="container header__container">
        <NuxtLink to="/" class="header__logo logo">INRESEARCH</NuxtLink>

        <nav class="header__nav">
          <ul class="menu header__menu">
            <li class="menu__item">
              <NuxtLink to="/" class="menu__link">Главная</NuxtLink>
            </li>
            <li class="menu__item">
              <NuxtLink to="/markets" class="menu__link">Рынки</NuxtLink>
            </li>
            <li class="menu__item">
              <NuxtLink to="/about" class="menu__link">О нас</NuxtLink>
            </li>
            <li class="menu__item">
              <NuxtLink to="/contacts" class="menu__link">Контакты</NuxtLink>
            </li>
          </ul>
        </nav>

        <button class="header__button button button--header" type="button">
          Связаться с нами
        </button>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="container footer__container">
        <div class="footer__top">
          <NuxtLink to="/" class="footer__logo logo">INRESEARCH</NuxtLink>

          <nav class="footer__nav">
            <ul class="menu footer__menu">
              <li class="menu__item">
                <NuxtLink to="/" class="menu__link">Главная</NuxtLink>
              </li>
              <li class="menu__item">
                <NuxtLink to="/markets" class="menu__link">Рынки</NuxtLink>
              </li>
              <li class="menu__item">
                <NuxtLink to="/about" class="menu__link">О нас</NuxtLink>
              </li>
              <li class="menu__item">
                <NuxtLink to="/contacts" class="menu__link">Контакты</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <div class="footer__bottom">
          <p class="footer__copy">© 2024 INRESEARCH. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// This is the default layout for the application
// It includes the header with navigation and footer
</script>
