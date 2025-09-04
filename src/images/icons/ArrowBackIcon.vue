<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" 
    fill="none"
  >
    <path 
      d="M19 12H5M12 19L5 12L12 5" 
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