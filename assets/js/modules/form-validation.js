// Модуль для валидации форм
export function initValidateFields() {
  const textFields = Array.from(document.querySelectorAll('[data-validate="text"]'))
  const phoneFields = Array.from(document.querySelectorAll('[data-validate="phone"]'))
  const emailFields = Array.from(document.querySelectorAll('[data-validate="email"]'))
  const checkboxFields = Array.from(document.querySelectorAll('[data-validate="checkbox"]'))

  textFields.forEach(field => {
    field.addEventListener('focus', handleFieldFocus)
  })

  phoneFields.forEach(field => {
    if (field.value) validatePhone({ target: field })
    field.addEventListener('focus', handlePhoneFocus)
  })

  emailFields.forEach(field => {
    field.addEventListener('focus', handleEmailFocus)
    field.addEventListener('keydown', handleEmailKeydown)
    field.addEventListener('change', handleEmailChange)
  })

  checkboxFields.forEach(field => {
    field.addEventListener('change', handleCheckboxChange)
  })
}

export function initValidateForms() {
  const forms = Array.from(document.querySelectorAll('.form'))

  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit)
  })
}

function handleFieldFocus(e) {
  const field = e.target.closest('.custom-field')
  if (field) {
    field.classList.remove('not-valid')
    field.classList.remove('is-empty')
  }
}

function handlePhoneFocus(e) {
  const field = e.target.closest('.custom-field')
  if (field) {
    field.classList.remove('not-valid')
    field.classList.remove('is-empty')
  }
  validatePhone(e)
}

function validatePhone(e) {
  const input = e.target
  const baseCountryCode = input.dataset.baseCountryCode || '+7'
  const baseMatrixMask = input.dataset.baseMatrixMask || '+7 (___) ___-__-__'

  // Логика валидации телефона
  // Здесь должна быть ваша логика маски и валидации
}

function handleEmailFocus(e) {
  const field = e.target.closest('.custom-field')
  if (field) {
    field.classList.remove('not-valid')
    field.classList.remove('is-empty')
  }
}

function handleEmailKeydown(e) {
  // Предотвращение ввода кириллицы
  if (e.key && /[а-яё]/i.test(e.key)) {
    e.preventDefault()
  }
}

function handleEmailChange(e) {
  const input = e.target
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (input.value && !emailRegex.test(input.value)) {
    const field = input.closest('.custom-field')
    if (field) field.classList.add('not-valid')
  }
}

function handleCheckboxChange(e) {
  const field = e.target.closest('.custom-field')
  if (field) {
    if (e.target.checked) {
      field.classList.remove('is-empty')
    } else {
      field.classList.add('is-empty')
    }
  }
}

function handleFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const requiredFields = Array.from(form.querySelectorAll('input[data-required]'))
  let validFieldsCount = 0

  requiredFields.forEach(field => {
    const fieldType = field.getAttribute('data-validate')
    const fieldParent = field.parentElement

    // Проверка на пустоту
    if (field.value.length === 0 && fieldType !== 'checkbox') {
      fieldParent.classList.add('not-valid')
      fieldParent.classList.add('is-empty')
    }

    // Проверка для чекбоксов
    if (fieldType === 'checkbox' && !field.checked) {
      fieldParent.classList.add('is-empty')
    }

    // Счетчик валидных полей
    if (!fieldParent.classList.contains('not-valid') &&
        !fieldParent.classList.contains('is-empty')) {
      validFieldsCount++
    }
  })

  // Если все поля валидны
  if (requiredFields.length === validFieldsCount) {
    form.classList.add('is-sended')

    // Здесь можно добавить логику отправки формы

    setTimeout(() => {
      form.classList.remove('is-sended')
    }, 3000)

    form.reset()
  }
}