<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="main-title">
        多模态资源检索与生成，{{ UI_TEXT.MAIN_TITLE.UNDERLINE_TEXT
        }}<span class="highlight">更高效</span>
      </h1>

      <ModeSelector :active-mode="activeMode" @mode-change="handleModeChange" />

      <ChatInput
        :active-mode="activeMode"
        :loading="appStore.isLoading"
        type="input"
        @send-message="handleSendMessage"
        @stop-request="handleStopRequest"
      />

      <ExampleCards :active-mode="activeMode" @card-select="handleCardSelect" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/index.js";
import { useRouter } from "vue-router";
import ModeSelector from "@/components/ModeSelector";
import ChatInput from "@/components/ChatInput";
import ExampleCards from "@/components/ExampleCards";
import { UI_TEXT } from "./constants.js";
import {
  handleModeChange as handleModeChangeUtil,
  handleSendMessage as handleSendMessageUtil,
  handleCardSelect as handleCardSelectUtil,
} from "./utils.js";

const appStore = useAppStore();
const router = useRouter();

const activeMode = computed(() => appStore.activeMode);

const handleModeChange = (mode) => {
  handleModeChangeUtil(mode, appStore);
};

const handleSendMessage = (data) => {
  handleSendMessageUtil(data, appStore, router);
};

const handleCardSelect = (example) => {
  handleCardSelectUtil(example);
};

const handleStopRequest = () => {
  appStore.setLoading(false);
  console.log("停止生成");
};

const handleClearConversation = () => {
  console.log("清除对话");
  // 这里可以添加清除对话的逻辑
};
</script>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - 64px);
  background: transparent;
  position: relative;

  .hero-section {
    padding: 60px 24px 40px;
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;

    .main-title {
      display: inline-block;
      font-size: 32px;
      font-weight: 700;
      color: #1a365d;
      margin-bottom: 48px;
      line-height: 1.4;
      position: relative;

      // 下方装饰线图片
      &::before {
        content: "";
        position: absolute;
        bottom: -57px;
        left: 80px;
        right: 0;
        height: 76px;
        background: url(/images/backgrounds/homePageTileUnderLine.png) no-repeat;
        width: 71%;
        background-size: contain;
        z-index: -1;
      }

      // 右上角装饰图片
      &::after {
        content: "";
        position: absolute;
        top: -30px;
        right: -44px;
        width: 80px;
        height: 50px;
        background: url("/images/backgrounds/hongPageTileMark.png") no-repeat
          center;
        background-size: contain;
      }

      .highlight {
        color: #355eff;
      }

      .underline {
        position: relative;
        color: #4caf50;

        &::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #4caf50;
          border-radius: 2px;
          transform: scaleX(0.8);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .home {
    .hero-section {
      padding: 40px 16px 24px;

      .main-title {
        font-size: 24px;
        margin-bottom: 32px;
      }
    }
  }
}
</style>