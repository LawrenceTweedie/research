<template>
  <a
    class="market-card markets__item-card"
    :class="`market-card--${emotionClass}`"
    :href="marketLink"
    :title="market.title"
  >
    <div class="market-card__icon">
      <svg aria-hidden="true">
        <use xlink:href="#icon-arrow--link"></use>
      </svg>
    </div>
    <div class="market-card__title">
      {{ market.title }}
      <span class="color--gray">2024</span>
    </div>
    <ul class="market-card__state">
      <li class="market-card__state-item">
        <div class="market-card__state-item-icon">
          <svg width="24" height="24" aria-hidden="true">
            <use xlink:href="#icon-brain"></use>
          </svg>
        </div>
        <div class="market-card__state-item-title">AI:</div>
        <div class="market-card__state-item-text">{{ emotionTextAI }}</div>
      </li>
      <li class="market-card__state-item">
        <div class="market-card__state-item-icon">
          <svg width="24" height="24" aria-hidden="true">
            <use xlink:href="#icon-expert"></use>
          </svg>
        </div>
        <div class="market-card__state-item-title">Эксперты:</div>
        <div class="market-card__state-item-text">{{ emotionTextExperts }}</div>
      </li>
    </ul>
    <ul class="market-card__list">
      <li class="market-card__item">
        <div class="market-card__item-name">Объем рынка:</div>
        <div class="market-card__item-number">{{ market.marketVolume }}</div>
      </li>
      <li class="market-card__item">
        <div class="market-card__item-name">Объем инвестиций:</div>
        <div class="market-card__item-number">{{ market.investmentVolume }}</div>
      </li>
      <li class="market-card__item">
        <div class="market-card__item-name">Среднерыночная рентабельность:</div>
        <div class="market-card__item-number">{{ market.profitability }}</div>
      </li>
      <li class="market-card__item">
        <div class="market-card__item-name">Уровень финансовой нестабильности:</div>
        <div class="market-card__item-number">{{ market.instability }}</div>
      </li>
    </ul>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  market: {
    type: Object,
    required: true
  }
})

const emotions = {
  negative: 'Негативно',
  positive: 'Положительно',
  neutral: 'Нейтрально'
}

const emotionTextAI = computed(() => {
  return emotions[props.market.emotionAI] || 'Нейтрально'
})

const emotionTextExperts = computed(() => {
  return emotions[props.market.emotionExperts] || 'Нейтрально'
})

// Класс карточки определяется по наиболее тревожной оценке
// Приоритет: negative > neutral > positive
const emotionClass = computed(() => {
  const ai = props.market.emotionAI || 'neutral'
  const experts = props.market.emotionExperts || 'neutral'

  // Если хотя бы одна оценка негативная, карточка красная
  if (ai === 'negative' || experts === 'negative') {
    return 'negative'
  }
  // Если хотя бы одна оценка нейтральная, карточка серая
  if (ai === 'neutral' || experts === 'neutral') {
    return 'neutral'
  }
  // Обе оценки позитивные - карточка зеленая
  return 'positive'
})

const marketLink = computed(() => {
  return props.market.link || '#'
})
</script>

<style scoped>
/* Стили уже есть в глобальных стилях */
</style>
