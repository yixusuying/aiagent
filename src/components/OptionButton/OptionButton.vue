<template>
  <div
    class="option-button"
    :class="{ active: isActive }"
    @click="handleClick"
  >
    {{ text }}
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.option-button {
  min-width: 0;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  gap: 8px;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 1px solid #e4e8ee;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  text-align: center;
  word-break: keep-all;
  white-space: nowrap;

  &:hover {
    border-color: #355eff;
    color: #355eff;
  }

  &.active {
    background: rgba(53, 94, 255, 0.06);
    border: 1px solid #355eff;
    color: #355eff;
  }
}
</style>