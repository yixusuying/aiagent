<template>
  <div class="login-wrap">
    <!-- 左侧内容区域 -->
    <div class="left-content">
      <div class="brand-section">
        <img src="/images/avatars/logo.png" alt="智能体" class="brand-logo" />
        <div class="brand-subtitle">
          <span>多模态资源检索与生成，让备授课</span>
          <span class="highlight">更高效</span>
          <div class="underline"></div>
        </div>
      </div>
      
      <!-- 3D智能体图形区域 -->
    </div>
    
    <!-- 右侧登录表单区域 -->
    <div class="right-content">
      <div v-loading="loading" class="login-form">
        <h2 class="welcome-title">你好，欢迎登录 ~</h2>
        <div class="form-content">
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            size="large"
            class="input-item"
          />
          <a-input-password
            v-model:value="formData.password"
            placeholder="请输入密码"
            size="large"
            class="input-item"
          />
          <a-button
            @click="handleLogin"
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
          >
            登录
          </a-button>
        </div>
      </div>
    </div>
    
    <div class="copyright">版权所有: damengCoder</div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useUserStore } from "@/stores/userStore.js";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const formData = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  // 简单验证
  if (!formData.username) {
    message.error("请输入账号");
    return;
  }
  if (!formData.password) {
    message.error("请输入密码");
    return;
  }

  try {
    loading.value = true;
    await userStore.login(formData);
    
    message.success("登录成功！");
    
    // 登录成功后跳转到首页或之前的页面
    const redirectPath = router.currentRoute.value.query.redirect || "/";
    router.push(redirectPath);
  } catch (error) {
    console.error("Login failed:", error);
    message.error(
      error.response?.data?.detail || "登录失败，请检查用户名和密码"
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-wrap {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: url("/images/backgrounds/loginBg.png") no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;

  // 左侧内容区域
  .left-content {
    flex: 1;
    padding: 120px 0 0 120px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .brand-section {
      margin-bottom: 80px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .brand-logo {
        height: 48px;
        margin: 0 0 24px 0;
        object-fit: contain;
      }

      .brand-subtitle {
        font-size: 32px;
        color: #181B49;
        line-height: 1.5;
        position: relative;
        display: inline-block;
        font-weight: 400;

        .highlight {
          color: #355EFF;
        }

        .underline {
          position: absolute;
          bottom: -18px;
          left: 0;
          width: 62px;
          height: 3px;
          background: #355EFF;
          border-radius: 2px;
        }
      }
    }

    .ai-illustration {
      position: relative;
      width: 400px;
      height: 300px;

      .ai-device {
        position: relative;
        width: 280px;
        height: 200px;
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%);
        border-radius: 24px;
        box-shadow: 
          0 20px 40px rgba(59, 130, 246, 0.15),
          0 10px 20px rgba(59, 130, 246, 0.1);
        transform: perspective(1000px) rotateX(5deg) rotateY(-5deg);
        margin: 0 auto;

        .screen {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 100px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);

          .screen-text {
            color: white;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 1px;
          }
        }

        .ai-avatar {
          position: absolute;
          top: 130px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
          animation: float 3s ease-in-out infinite;

          .ai-label {
            color: white;
            font-size: 10px;
            font-weight: 600;
            text-align: center;
            line-height: 1.2;
          }
        }
      }

      .decoration-dots {
        .dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
          animation: pulse 4s ease-in-out infinite;

          &.dot-1 {
            width: 20px;
            height: 20px;
            top: 40px;
            left: 50px;
            animation-delay: 0s;
          }

          &.dot-2 {
            width: 16px;
            height: 16px;
            top: 80px;
            right: 60px;
            animation-delay: 1s;
          }

          &.dot-3 {
            width: 12px;
            height: 12px;
            bottom: 60px;
            left: 80px;
            animation-delay: 2s;
          }

          &.dot-4 {
            width: 24px;
            height: 24px;
            bottom: 40px;
            right: 40px;
            animation-delay: 3s;
          }
        }
      }
    }
  }

  // 右侧登录表单区域
  .right-content {
    width: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 60px;

    .login-form {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 100%);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 50px 32px;
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 10px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);

      .welcome-title {
        font-size: 24px;
        font-weight: 500;
        color: #1e293b;
        margin: 0 0 32px 0;
      }

      .form-content {
        .input-item {
          margin-bottom: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          height: 48px; // 固定高度确保一致性
          width: 368px;

          :deep(.ant-input) {
            border: none;
            font-size: 16px;
            background: transparent;
            height: 100%;
            line-height: 1.5;

            &:focus {
              box-shadow: none;
            }
          }

          :deep(.ant-input-password) {
            border: none;
            height: 100%;
            display: flex;
            align-items: center;

            .ant-input {
              border: none;
              padding: 12px 16px;
              background: transparent;
              height: 100%;
              line-height: 1.5;
              font-size: 16px;
            }

            .ant-input-suffix {
              padding-right: 16px;
            }
          }

          &:hover {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          &:focus-within {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }
        }

        .login-btn {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          background: rgba(53, 94, 255, 0.6);
          border: none;
          font-size: 16px;
          font-weight: 600;
          margin-top: 12px;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(53, 94, 255, 0.6);
            transform: translateY(-1px);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
    }
  }

  .copyright {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: black;
    font-size: 14px;
    pointer-events: none;
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .login-wrap {
    flex-direction: column;
    
    .left-content {
      padding: 40px;
      
      .ai-illustration {
        width: 300px;
        height: 200px;
        
        .ai-device {
          width: 200px;
          height: 150px;
        }
      }
    }
    
    .right-content {
      width: 100%;
      padding: 20px;
      
      .login-form {
        width: 100%;
        max-width: 400px;
      }
    }
  }
}
</style>