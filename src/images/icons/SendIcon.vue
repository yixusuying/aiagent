<template>
  <svg 
    :width="size" 
    :height="size" 
    :viewBox="`0 0 ${size} ${size}`"
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    fill="none"
  >
    <defs>
      <clipPath :id="`master_svg0_${uniqueId}`">
        <rect x="0" y="0" :width="size" :height="size" :rx="size * 0.33" />
      </clipPath>
    </defs>
    <g :clip-path="`url(#master_svg0_${uniqueId})`">
      <rect 
        x="0" 
        y="0" 
        :width="size" 
        :height="size" 
        :rx="size * 0.33" 
        fill="#355EFF" 
        fill-opacity="0.6"
      />
      <g>
        <g :transform="`matrix(1,0,0,-1,0,${size * 1.622})`">
          <path 
            :d="`M${size * 0.275},${size * 0.865}C${size * 0.238},${size * 0.847},${size * 0.198},${size * 0.884},${size * 0.214},${size * 0.922}L${size * 0.376},${size * 1.302}C${size * 0.385},${size * 1.327},${size * 0.412},${size * 1.337},${size * 0.435},${size * 1.326}L${size * 0.749},${size * 1.183}C${size * 0.783},${size * 1.168},${size * 0.784},${size * 1.12},${size * 0.750},${size * 1.103}L${size * 0.275},${size * 0.865}Z`"
            fill="#FFFFFF" 
            fill-opacity="0.38"
          />
        </g>
        <g>
          <path 
            :d="`M${size * 0.272},${size * 0.216}C${size * 0.235},${size * 0.199},${size * 0.196},${size * 0.236},${size * 0.212},${size * 0.274}L${size * 0.320},${size * 0.444}C${size * 0.328},${size * 0.464},${size * 0.351},${size * 0.472},${size * 0.372},${size * 0.463}L${size * 0.665},${size * 0.334}C${size * 0.695},${size * 0.320},${size * 0.696},${size * 0.278},${size * 0.667},${size * 0.262}L${size * 0.272},${size * 0.216}Z`"
            fill="#FFFFFF"
          />
        </g>
      </g>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 36
  }
})

// 生成唯一ID避免多个图标时clipPath冲突
const uniqueId = computed(() => Math.random().toString(36).substr(2, 9))
</script>