<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" 
    fill="none"
  >
    <path 
      d="M12 5V19M5 12H19" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  size: {
    type: [Number, String],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  }
})
</script>