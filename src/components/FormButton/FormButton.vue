<template>
  <a-button
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    @click="handleClick"
    class="form-button"
  >
    <template #icon v-if="icon">
      <component :is="icon" />
    </template>
    <slot>{{ text }}</slot>
  </a-button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'large'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    default: null
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.form-button {
  width: 164px;
  height: 44px;
  border-radius: 8px;
  opacity: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 6px;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 1px solid #355eff;
  background: #355eff;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: #2347e6;
    border-color: #2347e6;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &.ant-btn-loading {
    .anticon {
      color: white;
    }
  }
}
</style>