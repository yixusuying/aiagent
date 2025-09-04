<template>
  <div class="mode-selector">
    <div class="custom-tabs">
      <div 
        v-for="mode in modes"
        :key="mode.key"
        class="tab-item" 
        :class="{ active: activeMode === mode.key }"
        @click="handleModeChange(mode.key)"
      >
        <img v-if="mode.iconPath" :src="activeMode === mode.key ? mode.iconPath : mode.defaultIconPath" :alt="mode.label" class="tab-icon" />
        <span v-else class="mode-icon">{{ mode.icon }}</span>
        {{ mode.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { getAllModes, handleModeChange as handleModeChangeUtil } from '@/components/ModeSelector/utils.js'

const props = defineProps({
  activeMode: {
    type: String,
    default: 'ai-role-generation'
  }
})

const emit = defineEmits(['mode-change'])

const modes = getAllModes()

const handleModeChange = (mode) => {
  handleModeChangeUtil(mode, emit)
}
</script>

<style lang="scss" scoped>
.mode-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  
  .custom-tabs {
    display: inline-flex;
    background: rgba(255, 255, 255, 0.48);
    border-radius: 8px;
    padding: 4px;
    gap: 4px;
    
    .tab-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #646479;
      background: transparent;
      
      &.active {
        background: #ffffff;
        color: #181B49;
        font-weight: 500;
        box-shadow: 0 4px 16px rgba(53, 94, 255, 0.16);
      }
      
      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.6);
        color: #355EFF;
      }
      
      .tab-icon {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }
      
      .mode-icon {
        font-size: 16px;
      }
    }
  }
}
</style>