<template>
  <div class="create-agent">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <BackButton class="icon-only" @click="handleGoBack" />
        <h1 class="page-title">创建智能体</h1>
      </div>
    </div>

    <!-- 创建表单 -->
    <div class="form-container">
      <a-form
        ref="formRef"
        :model="formData"
        layout="vertical"
        class="create-agent-form"
      >
        <!-- 智能体头像 -->
        <div class="form-section">
          <div class="avatar-upload">
            <a-upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
              @change="handleAvatarChange"
            >
              <div v-if="imageUrl" class="avatar-preview">
                <img :src="imageUrl" alt="avatar" />
              </div>
              <div v-else class="upload-placeholder">
                <PlusOutlined />
                <div class="upload-text">
                  {{ UI_TEXT.FORM.AVATAR.UPLOAD_TEXT }}
                </div>
              </div>
            </a-upload>
          </div>
        </div>

        <!-- 智能体名称 -->
        <div class="form-section">
          <div class="section-title">{{ UI_TEXT.FORM.NAME.TITLE }}</div>
          <a-form-item
            name="name"
            :rules="[{ required: true, message: '请输入智能体名称' }]"
          >
            <a-input
              v-model:value="formData.name"
              :placeholder="UI_TEXT.FORM.NAME.PLACEHOLDER"
              size="large"
              class="name-input"
            />
          </a-form-item>
        </div>

        <!-- 目标受众设置 -->
        <div class="form-section">
          <div class="section-title">
            {{ UI_TEXT.FORM.TARGET_AUDIENCE.TITLE }}
            <span class="section-subtitle">（{{ UI_TEXT.FORM.TARGET_AUDIENCE.SUBTITLE }}）</span>
          </div>
          <a-form-item
            name="targetAudience"
            :rules="[{ required: true, message: '请选择目标受众' }]"
          >
            <div class="option-group">
              <div
                v-for="option in TARGET_AUDIENCE_OPTIONS"
                :key="option.key"
                class="option-item"
                :class="{ active: formData.targetAudience === option.key }"
                @click="formData.targetAudience = option.key"
              >
                {{ option.label }}
              </div>
            </div>
          </a-form-item>
        </div>

        <!-- 内容复杂度 -->
        <div class="form-section">
          <div class="section-title">
            {{ UI_TEXT.FORM.CONTENT_COMPLEXITY.TITLE }}
            <span class="section-subtitle">（{{ UI_TEXT.FORM.CONTENT_COMPLEXITY.SUBTITLE }}）</span>
          </div>
          <a-form-item
            name="contentComplexity"
            :rules="[{ required: true, message: '请选择内容复杂度' }]"
          >
            <div class="option-group">
              <div
                v-for="option in COMPLEXITY_OPTIONS"
                :key="option.key"
                class="option-item"
                :class="{ active: formData.contentComplexity === option.key }"
                @click="formData.contentComplexity = option.key"
              >
                {{ option.label }}
              </div>
            </div>
          </a-form-item>
        </div>

        <!-- 交流风格 -->
        <div class="form-section">
          <div class="section-title">
            {{ UI_TEXT.FORM.INTERACTION_STYLE.TITLE }}
          </div>

          <!-- 主要风格 -->
          <div class="subsection">
            <div class="subsection-title">
              {{ UI_TEXT.FORM.INTERACTION_STYLE.MAIN_STYLE.TITLE }}
              <span class="subsection-subtitle"
                >（{{
                  UI_TEXT.FORM.INTERACTION_STYLE.MAIN_STYLE.SUBTITLE
                }}）</span
              >
            </div>
            <a-form-item
              name="mainStyle"
              :rules="[{ required: true, message: '请选择主要风格' }]"
            >
              <div class="option-group">
                <div
                  v-for="option in MAIN_STYLE_OPTIONS"
                  :key="option.key"
                  class="option-item main-style"
                  :class="{ active: formData.mainStyle === option.key }"
                  @click="formData.mainStyle = option.key"
                >
                  {{ option.label }}
                </div>
              </div>
            </a-form-item>
          </div>

          <!-- 辅助特色 -->
          <div class="subsection">
            <div class="subsection-title">
              {{ UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.TITLE }}
              <span class="subsection-subtitle"
                >（{{
                  UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.SUBTITLE
                }}）为智能体添加额外的个性特征</span
              >
            </div>
            <div class="additional-traits">
              <div
                v-for="option in ADDITIONAL_TRAITS_OPTIONS"
                :key="option.key"
                class="trait-item"
                :class="{
                  active: formData.additionalTraits.includes(option.key),
                }"
                @click="toggleAdditionalTrait(option.key)"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-footer">
          <FormButton
            :loading="submitting"
            :icon="UserOutlined"
            :text="UI_TEXT.FORM.SUBMIT_BUTTON"
            @click="handleSubmit"
          />
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import {
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import {
  UI_TEXT,
  ROUTES,
  TARGET_AUDIENCE_OPTIONS,
  COMPLEXITY_OPTIONS,
  MAIN_STYLE_OPTIONS,
  ADDITIONAL_TRAITS_OPTIONS,
} from "./constants.js";
import { handleAvatarUpload, submitForm } from "./utils.js";
import FormButton from "@/components/FormButton";
import BackButton from "@/components/BackButton";

const router = useRouter();
const formRef = ref();
const submitting = ref(false);
const imageUrl = ref("");
const fileList = ref([]);

const formData = reactive({
  name: "",
  targetAudience: "middle",
  contentComplexity: "medium",
  mainStyle: "humorous",
  additionalTraits: ["practical"],
  avatar: null,
});

const handleBeforeUpload = (file) => {
  return handleAvatarUpload(file);
};

const handleAvatarChange = (info) => {
  if (info.file.status === "done") {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      imageUrl.value = reader.result;
    });
    reader.readAsDataURL(info.file.originFileObj);
    formData.avatar = info.file.originFileObj;
  }
};

const toggleAdditionalTrait = (key) => {
  const index = formData.additionalTraits.indexOf(key);
  if (index > -1) {
    formData.additionalTraits.splice(index, 1);
  } else {
    formData.additionalTraits.push(key);
  }
};

const handleGoBack = () => {
  
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitting.value = true;
    await submitForm(formData, router);
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.create-agent {
  padding: 0;
  min-height: 100vh;
  background: #F1F7FF;
  padding-bottom: 25px;

  .page-header {
    width: 100%;
    height: 64px;
    padding: 14px 0;
    background: white;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;

    .header-left {
      max-width: 1200px;
      margin: 0;
      padding: 0 32px;
      display: flex;
      align-items: center;
      gap: 16px;

      // BackButton组件样式由组件内部管理

      .page-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }
    }
  }

  .form-container {
    width: 1200px;
    margin: 16px auto;
    margin-bottom: 0px;

    .create-agent-form {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #f0f0f0;
      height: 975px;
      background-image: url('/images/backgrounds/createAgentFormTileBg.png');
      background-repeat: no-repeat;
      background-position: top center;
      background-size: contain;
    }
  }

  .form-section {
    margin-bottom: 24px;

    // 头像上传section的特殊样式
    &:first-child {
      width: 680px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 48px;
      margin-bottom: 0;
    }

    // 表单项错误信息对齐
    :deep(.ant-form-item) {
      width: 696px;
      margin: 0 auto;
      margin-left: calc(50% - 340px - 16px);
      
      .ant-form-item-explain {
        width: 696px;
        text-align: left;
        padding-left: 0;
      }
      
      .ant-form-item-explain-error {
        color: #ff4d4f;
        font-size: 12px;
        line-height: 1.5;
        margin-top: 4px;
      }
    }

    .section-title {
      color: #181b49;
      font-size: 14px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0px;
      margin-bottom: 4px;
      position: relative;
      width: 680px;
      margin-left: auto;
      margin-right: auto;

      &::before {
        content: "";
        position: absolute;
        left: -16px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background: #355EFF;
      }
    }

    .section-subtitle {
      font-size: 13px;
      color: #999;
      font-weight: normal;
      margin-left: 4px;
    }
  }

  .avatar-upload {
    display: flex;
    justify-content: center;
    margin-bottom: 11px;
    align-items: center;
    .ant-upload-wrapper {
      width: unset;
    }

    .avatar-uploader {
      // 重置ant-design的默认样式
      :deep(.ant-upload-select) {
        border: none;
        margin: 0;
        width: 80px;
        height: 80px;
        border-radius: 12px;
        border: 2px dashed #d9d9d9;
        transition: all 0.3s ease;
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          border-color: #1976d2;
          background: #f0f9ff;
        }
      }

      :deep(.ant-upload) {
        width: 80px;
        height: 80px;
        padding: 0;
      }

      .upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #999;

        .anticon {
          font-size: 24px;
          margin-bottom: 4px;
          color: #1976d2;
        }

        .upload-text {
          font-size: 12px;
        }
      }

      .avatar-preview {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .name-input {
    border-radius: 6px;
    font-size: 14px;
    background: #fafafa;
    border: 1px solid #e0e0e0;
    width: 696px;
    margin: 0;
    display: block;

    &:focus {
      background: white;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }
  }

  .option-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    width: 696px;
    margin: 0;
    justify-content: flex-start;

    .option-item {
      width: 164px;
      height: 44px;
      border-radius: 8px;
      opacity: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
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
  }

  .subsection {
    margin-bottom: 24px;

    .subsection-title {
      color: #646479;
      font-size: 12px;
      font-weight: normal;
      height: 24px;
      line-height: 24px;
      margin-bottom: 4px;
      width: 696px;
      margin-left: calc(50% - 340px - 16px);
      margin-right: auto;
      display: flex;
      align-items: center;

      .subsection-subtitle {
        font-size: 12px;
        font-weight: normal;
        color: #999;
      }
    }
  }

  .additional-traits {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    width: 696px;
    margin: 0;
    margin-left: calc(50% - 340px - 16px);
    justify-content: flex-start;

    .trait-item {
      width: 164px;
      height: 44px;
      border-radius: 8px;
      opacity: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      gap: 10px;
      flex-shrink: 0;
      box-sizing: border-box;
      border: 1px solid #e4e8ee;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 12px;
      font-weight: 500;
      color: #333;

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
  }

  .form-footer {
    margin-top: 209px;
    display: flex;
    justify-content: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .create-agent {
    .page-header {
      height: 64px;
      padding: 14px 0;

      .header-left {
        padding: 0 16px;
      }
    }

    .form-container {
      margin: 16px auto;
      padding: 0 16px;
    }

    .form-section .section-title::before {
      left: -12px;
    }

    .option-group {
      gap: 8px;

      .option-item {
        padding: 6px 12px;
        font-size: 12px;
      }
    }

    .additional-traits {
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 6px;

      .trait-item {
        padding: 4px 8px;
        font-size: 11px;
      }
    }
  }
}
</style>