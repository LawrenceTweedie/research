<template>
  <div class="market-card" :class="`market-card--${market.emotion}`">
    <div class="market-card__header">
      <h3 class="market-card__title">{{ market.name }}</h3>
      <div class="market-card__badges">
        <span class="badge badge--ai">AI: {{ emotionText }}</span>
        <span class="badge badge--expert">Эксперты: {{ emotionText }}</span>
      </div>
    </div>
    <NuxtLink :to="market.link" class="market-card__link">
      Подробнее →
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  market: {
    type: Object,
    required: true
  }
});

const emotionText = computed(() => {
  const emotions = {
    negative: 'Негативно',
    positive: 'Положительно',
    neutral: 'Нейтрально'
  };
  return emotions[props.market.emotion] || 'Нейтрально';
});
</script>
