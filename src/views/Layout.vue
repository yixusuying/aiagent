<template>
  <a-layout class="app-layout">
    <a-layout-header class="header">
      <div class="header-con">
        <div class="logo">
          <img src="/images/avatars/logo.png" alt="智能体" />
        </div>
        <div class="nav-menu">
          <a-menu
            mode="horizontal"
            theme="light"
            class="main-menu"
            :default-selected-keys="['home']"
            v-model:selectedKeys="selectedKeys"
          >
            <a-menu-item key="home">
              <router-link to="/">首页</router-link>
            </a-menu-item>
            <a-menu-item key="resource"> 资源中心 </a-menu-item>
            <a-menu-item key="question"> 试题中心 </a-menu-item>
            <a-menu-item key="application"> 应用中心 </a-menu-item>
            <a-menu-item key="product"> 产品中心 </a-menu-item>
          </a-menu>
        </div>
        <div class="user-actions">
          <a-button class="open-platform-btn">
            <img src="/images/avatars/openPlatformIcon.png" alt="开放平台" class="platform-icon" />
            开放平台
          </a-button>
          <div class="divider"></div>
          
          <!-- 未登录状态 -->
          <template v-if="!userStore.isLoggedIn">
            <span class="login-text" @click="handleLoginClick">登录</span>
            <div class="user-avatar" @click="handleLoginClick">
              <img
                src="/images/avatars/userAvatar.png"
                alt="User Avatar"
                class="avatar-image"
                @error="handleImageError"
                @load="handleImageLoad"
                onerror="this.style.display='none'"
              />
            </div>
          </template>
          
          <!-- 已登录状态 -->
          <template v-else>
            <a-dropdown :trigger="['click']" placement="bottomRight">
              <div class="user-info" @click.prevent>
                <span class="username-text">{{ userStore.displayName }}</span>
                <div class="user-avatar">
                  <img
                    src="/images/avatars/userAvatar.png"
                    alt="User Avatar"
                    class="avatar-image"
                    @error="handleImageError"
                    @load="handleImageLoad"
                    onerror="this.style.display='none'"
                  />
                </div>
                <DownOutlined class="dropdown-icon" />
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="main-content">
      <slot />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/userStore.js";

const router = useRouter();
const userStore = useUserStore();
const selectedKeys = ref(["home"]);

const handleImageError = (event) => {
  console.error('Avatar image failed to load:', event.target.src);
  // 可以设置一个默认图片或者显示默认样式
  event.target.style.display = 'none';
};

const handleImageLoad = (event) => {
  console.log('Avatar image loaded successfully:', event.target.src);
};

const handleLoginClick = () => {
  router.push('/login');
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    message.success('退出登录成功');
    // 跳转到首页
    if (router.currentRoute.value.path !== '/') {
      router.push('/');
    }
  } catch (error) {
    console.error('Logout failed:', error);
    message.error('退出登录失败');
  }
};
</script>

<style lang="scss" scoped>
// 变量定义
$header-height: 64px;
$header-padding: 24px;
$content-padding: 24px;

// Layout background
.app-layout {
  min-height: 100vh;
  position: relative;

  // Primary background - gradient fallback
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e8 100%);

  // Add decorative background elements
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(25, 118, 210, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(156, 39, 176, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
  }

  background-image: url("/images/backgrounds/homePageBg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.header {
  background: transparent;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 2;
  transition: all 0.3s ease;

  // Pure glass morphism effect - no background, only blur
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    pointer-events: none;
    z-index: 1;
  }

}

.header-con {
  display: flex;
  align-items: center;
  height: $header-height;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 0;
}

// Left section with logo and nav menu
.logo {
  margin-left: 360px;
  margin-right: 64px;
  flex-shrink: 0;

  img {
    height: 32px;
    object-fit: contain;
  }
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: flex-start;

  .main-menu {
    background: transparent;
    border: none;
    line-height: $header-height;

    :deep(.ant-menu-item) {
      padding: 20px 16px;
      position: relative;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #646479;

      a {
        color: inherit;
        text-decoration: none;
      }

      &.ant-menu-item-selected {
        color: #181B49;
        background-color: transparent;

        a {
          color: inherit;
        }

        &::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 4.5px;
          background-color: #355EFF;
          border-radius: 16px;
          border-color: unset;
          border-bottom: none;
        }
      }
    }
  }
}

.user-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 360px;

  .open-platform-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #1a365d;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 8px;
    background: white;
    border: 1px solid rgba(26, 54, 93, 0.2);

    .platform-icon {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }
  }

  .divider {
    width: 1px;
    height: 32px;
    background-color: #D0D5DC;
  }

  .login-text {
    color: #646479;
    font-size: 14px;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: color 0.3s ease;
    
    &:hover {
      color: #355eff;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
      
      .username-text {
        color: #355eff;
      }
    }
  }

  .username-text {
    color: #646479;
    font-size: 14px;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    transition: color 0.3s ease;
  }

  .dropdown-icon {
    display: none;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    
    // 备用背景，当图片加载失败时显示
    background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    
    // 添加悬停效果
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(53, 94, 255, 0.3);
      border: 2px solid rgba(53, 94, 255, 0.5);
    }
    
    &:active {
      transform: scale(1.05);
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      position: relative;
      z-index: 2;
      
      // 确保图片在加载失败时不显示破损图标
      &::before {
        content: none;
      }
    }
  }
}

.main-content {
  min-height: calc(100vh - $header-height);
  background: transparent;
  padding: 0;
  position: relative;
  z-index: 1;

}
</style>