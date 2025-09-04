<template>
  <div class="loading-skeleton">
    <div class="skeleton-container">
      <div class="skeleton-item skeleton-header"></div>
      <div class="skeleton-item skeleton-content"></div>
      <div class="skeleton-item skeleton-content short"></div>
      <div class="skeleton-item skeleton-content"></div>
    </div>
  </div>
</template>

<script setup>
// 简单的骨架屏组件，用于路由加载时显示
</script>

<style lang="scss" scoped>
.loading-skeleton {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F3F8FF;
}

.skeleton-container {
  width: 100%;
  max-width: 600px;
  padding: 20px;
}

.skeleton-item {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
}

.skeleton-header {
  height: 32px;
  width: 60%;
}

.skeleton-content {
  height: 16px;
  width: 100%;
  
  &.short {
    width: 75%;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>