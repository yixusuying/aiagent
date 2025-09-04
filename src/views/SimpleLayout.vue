<template>
  <div class="simple-layout">
    <slot />
  </div>
</template>

<script setup>
// 简单的Layout组件，不包含任何导航
</script>

<style lang="scss" scoped>
.simple-layout {
  min-height: 100vh;
  position: relative;
  
  // 复用主Layout的背景样式
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e8 100%);
  

  background-image: url("/images/backgrounds/homePageBg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>