<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" 
    fill="none"
  >
    <path 
      d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" 
      :stroke="color" 
      :stroke-width="strokeWidth"
    />
    <path 
      d="M19 10V12C19 16.4183 15.4183 20 11 20H13C13 20 13 20 13 20M5 10V12C5 16.4183 8.58172 20 13 20M13 20V23M10 23H16" 
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