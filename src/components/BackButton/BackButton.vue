<template>
  <button class="back-button" @click="handleClick">
    <LeftOutlined />
    <span v-if="text" class="back-text">{{ text }}</span>
  </button>
</template>

<script setup>
import { LeftOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  to: {
    type: [String, Object],
    default: null
  }
})

const emit = defineEmits(['click'])

const router = useRouter()

const handleClick = () => {
  emit('click')
  
  if (props.to) {
    router.push(props.to)
  } else {
    if (window.history.length > 1) {
      router.go(-1)
    } else {
      router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  .anticon {
    font-size: 16px;
  }
  
  .back-text {
    font-size: 16px;
  }
  
  &:hover {
    color: #355EFF;
    background: #f5f5f5;
  }
}

.back-button.icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  justify-content: center;
  gap: 0;
  
  .back-text {
    display: none;
  }
  
  .anticon {
    font-size: 16px;
  }
  
  &:hover {
    background: #f5f5f5;
    color: #1976d2;
  }
}
</style>