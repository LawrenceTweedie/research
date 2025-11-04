<template>
  <section class="callback-form" id="callback-form">
    <div class="container callback-form__container">
      <h2 class="callback-form__title title">Контакты</h2>
      <div class="callback-form__form">
        <form class="callback-form__form-content form" @submit.prevent="handleSubmit" v-if="!isSubmitted">
          <div class="form__row">
            <div class="form__field">
              <div class="form__field-title">Ваше имя</div>
              <div class="custom-field">
                <input
                  class="custom-field__input"
                  id="user-name"
                  v-model="formData.name"
                  name="callback-form-name"
                  type="text"
                  placeholder="Как вас зовут?"
                  required
                >
                <div class="empty" v-if="errors.name">Необходимо заполнить</div>
              </div>
            </div>
            <div class="form__field">
              <div class="form__field-title">Фамилия</div>
              <div class="custom-field">
                <input
                  class="custom-field__input"
                  id="user-last-name"
                  v-model="formData.lastName"
                  name="callback-form-last-name"
                  type="text"
                  placeholder="Ваша фамилия"
                >
              </div>
            </div>
          </div>
          <div class="form__row">
            <div class="form__field">
              <div class="form__field-title">Почтовый адрес</div>
              <div class="custom-field">
                <input
                  class="custom-field__input"
                  id="user-email"
                  v-model="formData.email"
                  name="callback-form-email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                >
                <div class="error" v-if="errors.email">Некорректно заполнено</div>
                <div class="empty" v-if="errors.emailEmpty">Необходимо заполнить</div>
              </div>
            </div>
            <div class="form__field">
              <div class="form__field-title">Телефон</div>
              <div class="custom-field">
                <input
                  class="custom-field__input"
                  id="user-phone"
                  v-model="formData.phone"
                  name="callback-form-phone"
                  type="tel"
                  placeholder="+7 ___ ___ __ __"
                  required
                >
                <div class="error" v-if="errors.phone">Некорректно заполнено</div>
                <div class="empty" v-if="errors.phoneEmpty">Необходимо заполнить</div>
              </div>
            </div>
          </div>
          <div class="form__field">
            <div class="form__field-title">Предмет исследования</div>
            <div class="custom-field custom-field--textarea">
              <textarea
                class="custom-field__input"
                id="user-description"
                v-model="formData.description"
                name="callback-form-description"
                placeholder="Краткое описание продукта/услуги, рынка, отрасли..."
              ></textarea>
            </div>
          </div>
          <div class="form__footer">
            <label class="custom-field custom-field--checkbox" for="user-agreement-0">
              <input
                class="visually-hidden"
                id="user-agreement-0"
                v-model="formData.agreement"
                name="form-agreement"
                type="checkbox"
                required
              >
              <span class="custom-field__icon">
                <svg width="24" height="24" aria-hidden="true">
                  <use xlink:href="#icon-check"></use>
                </svg>
              </span>
              <span class="custom-field__text">
                Я ознакомлен с политикой конфиденциальности и даю согласие на обработку персональных данных
              </span>
              <div class="empty" v-if="errors.agreement">Необходимо дать согласие</div>
            </label>
            <button class="button form__submit button button--lg button--cold" title="text" type="submit">
              Оставить заявку
            </button>
          </div>
        </form>
        <div class="callback-form__form-aside">
          <img src="/img/content/pictures/computer.png" srcset="/img/content/pictures/computer@2x.png 2x" width="657" height="552" alt="Заголовок" v-if="!isSubmitted">
          <div class="callback-form__form-aside-sended" v-if="isSubmitted">
            <svg width="48" height="48" aria-hidden="true">
              <use xlink:href="#icon-handshake"></use>
            </svg>
            <p>Мы свяжемся с вами в ближайшее время! <br>А также мы обещаем не беспокоить вас со всякой ерундой;) <br><br>С уважением, команда Inresearch</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  lastName: '',
  email: '',
  phone: '',
  description: '',
  agreement: false
})

const errors = ref({
  name: false,
  email: false,
  emailEmpty: false,
  phone: false,
  phoneEmpty: false,
  agreement: false
})

const isSubmitted = ref(false)

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePhone = (phone) => {
  // Простая валидация телефона (можно улучшить)
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10
}

const handleSubmit = () => {
  // Сброс ошибок
  errors.value = {
    name: false,
    email: false,
    emailEmpty: false,
    phone: false,
    phoneEmpty: false,
    agreement: false
  }

  let isValid = true

  // Валидация имени
  if (!formData.value.name) {
    errors.value.name = true
    isValid = false
  }

  // Валидация email
  if (!formData.value.email) {
    errors.value.emailEmpty = true
    isValid = false
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = true
    isValid = false
  }

  // Валидация телефона
  if (!formData.value.phone) {
    errors.value.phoneEmpty = true
    isValid = false
  } else if (!validatePhone(formData.value.phone)) {
    errors.value.phone = true
    isValid = false
  }

  // Валидация согласия
  if (!formData.value.agreement) {
    errors.value.agreement = true
    isValid = false
  }

  if (isValid) {
    // В реальности здесь должна быть отправка данных на сервер
    console.log('Отправка формы:', formData.value)

    // Показываем сообщение об успешной отправке
    isSubmitted.value = true

    // Можно добавить отправку на сервер:
    // await fetch('/api/callback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData.value)
    // })
  }
}
</script>

<style scoped>
/* Стили уже есть в глобальных стилях */
</style>
