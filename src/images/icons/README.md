# SVG 图标组件

这个文件夹包含了项目中使用的 SVG 图标组件。

## 使用方法

```vue
<template>
  <div>
    <!-- 基本使用 -->
    <SendIcon />
    
    <!-- 自定义大小 -->
    <SendIcon :size="32" />
    
    <!-- 自定义颜色（对于支持颜色的图标） -->
    <SimpleSendIcon :size="24" color="#355EFF" />
    
    <!-- 自定义描边宽度（对于描边图标） -->
    <MicIcon :size="20" color="#666" :stroke-width="1.5" />
  </div>
</template>

<script setup>
import { SendIcon, SimpleSendIcon, MicIcon } from '@/images/icons'
</script>
```

## 可用图标

### SendIcon
- 复杂的发送图标，带有渐变背景和剪切路径
- Props: `size` (默认: 36)

### SimpleSendIcon  
- 简单的发送图标
- Props: `size` (默认: 24), `color` (默认: 'currentColor')

### MicIcon
- 麦克风图标
- Props: `size` (默认: 24), `color` (默认: 'currentColor'), `strokeWidth` (默认: 2)

### ArrowBackIcon
- 返回箭头图标
- Props: `size` (默认: 24), `color` (默认: 'currentColor'), `strokeWidth` (默认: 2)

### PlusIcon
- 加号图标
- Props: `size` (默认: 24), `color` (默认: 'currentColor'), `strokeWidth` (默认: 2)

### SettingsIcon
- 设置齿轮图标
- Props: `size` (默认: 24), `color` (默认: 'currentColor'), `strokeWidth` (默认: 2)

## 添加新图标

1. 创建新的 .vue 文件，按照现有图标的模式
2. 在 index.js 中导出新图标
3. 更新此文档

## 设计原则

- 所有图标都支持 `size` 属性来控制大小
- 描边图标支持 `color` 和 `strokeWidth` 属性
- 使用 Vue 3 的 `<script setup>` 语法
- 保持 SVG 的可缩放性和清晰度