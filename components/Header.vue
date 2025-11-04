<template>
  <header class="header">
    <div class="container header__container">
      <NuxtLink to="/" class="header__logo logo" title="INRESEARCH">
        INRESEARCH
      </NuxtLink>
      <nav class="header__nav">
        <button class="header__menu-btn desktop-hidden">
          <span></span>
        </button>
        <ul class="header__nav-menu menu">
          <li class="menu__item">
            <a class="menu__item-link" href="#markets" title="Рынки">Рынки</a>
          </li>
          <li class="menu__item">
            <a class="menu__item-link" href="#about-us" title="О проекте">О проекте</a>
          </li>
          <li class="menu__item">
            <a class="menu__item-link" href="#services" title="Услуги">Услуги</a>
          </li>
          <li class="menu__item">
            <a class="menu__item-link" href="#callback-form" title="Контакты">Контакты</a>
          </li>
          <li class="menu__item menu__item--btn desktop-hidden">
            <button class="menu__contact-us button button--xl" type="button" title="Связаться с нами">
              Связаться с&nbsp;нами
            </button>
          </li>
        </ul>
      </nav>
      <button class="header__contact-us button button--xl mobile-hidden" type="button" title="Связаться с нами">
        Связаться с&nbsp;нами
      </button>
    </div>
  </header>
</template>

<script setup>
</script>
