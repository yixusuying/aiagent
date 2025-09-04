<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" 
    fill="none"
  >
    <path 
      d="M2 12L22 2L13 21L11 13L2 12Z" 
      :fill="color"
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
  }
})
</script>