<template>
  <div class="setup-agent">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <BackButton class="icon-only" @click="handleGoBack" />
        <h1 class="page-title">
          {{ isEditMode ? "编辑智能体" : UI_TEXT.TITLE }}
        </h1>
      </div>
      <div class="nav-right">
        <button class="nav-btn secondary" @click="handleSave">
          <img
            src="/images/avatars/saveConfigIcon.png"
            class="nav-btn-icon"
            alt="保存配置"
          />
          保存配置
        </button>
        <button
          class="nav-btn secondary"
          @click="handleGoToRun"
          :loading="goingToRun"
        >
          <img
            src="/images/avatars/gotoRunIcon.png"
            class="nav-btn-icon"
            alt="去运行"
          />
          {{ goingToRun ? "启动中..." : "去运行" }}
        </button>
        <button class="nav-btn secondary">
          <img
            src="/images/avatars/sharedIcon.png"
            class="nav-btn-icon"
            alt="分享"
          />
          分享
        </button>
      </div>
    </div>

    <!-- 主要内容区域 - 两栏布局 -->
    <div class="main-content" :class="{ 'data-loading': dataLoading }">
      <!-- 左侧配置表单区域 -->
      <div class="config-sidebar">
        <div class="config-form">
          <!-- 智能体头像 -->
          <div class="avatar-section">
            <div class="avatar-upload">
              <div class="current-avatar">
                <!-- 头像加载状态 -->
                <div v-if="avatarLoading" class="avatar-loading">
                  <div class="loading-spinner"></div>
                  <span class="loading-text">生成头像中...</span>
                </div>
                <!-- 如果是URL图片则显示图片，否则显示emoji/文字 -->
                <template v-else>
                  <img
                    v-if="isImageUrl(formatAvatarUrl(agentConfig.avatar))"
                    :src="formatAvatarUrl(agentConfig.avatar)"
                    :alt="agentConfig.name + '的头像'"
                    class="avatar-image"
                    @error="handleAvatarError"
                  />
                  <span v-else class="avatar-icon">{{
                    getDisplayAvatar(agentConfig.avatar)
                  }}</span>
                </template>
                <button class="avatar-edit-btn" :disabled="avatarLoading">
                  <span class="edit-icon">✏️</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 智能体名称 -->
          <div class="form-section">
            <div class="section-title">{{ UI_TEXT.CONFIG.AGENT_NAME }}</div>
            <a-input
              v-model:value="agentConfig.name"
              :placeholder="UI_TEXT.CONFIG.PLACEHOLDERS.NAME"
              class="form-input"
            />
          </div>

          <!-- 角色设定 -->
          <div class="form-section">
            <div class="section-title">{{ UI_TEXT.CONFIG.ROLE_SETTING }}</div>

            <!-- 背景设定 -->
            <div class="subsection">
              <div class="subsection-title">
                {{ UI_TEXT.CONFIG.BACKGROUND_SETTING }}
              </div>
              <a-textarea
                v-model:value="agentConfig.backgroundSetting"
                :placeholder="UI_TEXT.CONFIG.PLACEHOLDERS.BACKGROUND"
                :rows="4"
                class="form-textarea"
              />
            </div>

            <!-- 角色性格 -->
            <div class="subsection">
              <div class="subsection-title">
                {{ UI_TEXT.CONFIG.PERSONALITY }}
              </div>
              <a-textarea
                v-model:value="agentConfig.design"
                :placeholder="UI_TEXT.CONFIG.PLACEHOLDERS.PERSONALITY"
                :rows="8"
                class="form-textarea"
              />
            </div>
          </div>

          <!-- 声音 -->
          <div class="form-section">
            <div class="section-title">{{ UI_TEXT.CONFIG.VOICE }}</div>
            <a-select
              v-model:value="agentConfig.voice"
              :placeholder="VOICE_OPTIONS[0].label"
              class="form-select"
            >
              <a-select-option
                v-for="option in VOICE_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>

          <!-- 开场白 -->
          <div class="form-section">
            <div class="section-title">
              {{ UI_TEXT.CONFIG.OPENING_REMARKS }}
            </div>
            <a-textarea
              v-model:value="agentConfig.openingRemarks"
              :placeholder="UI_TEXT.CONFIG.PLACEHOLDERS.OPENING_REMARKS"
              :rows="3"
              class="form-textarea"
            />
          </div>

          <!-- 预设提问 -->
          <div class="form-section">
            <div class="section-title">
              {{ UI_TEXT.CONFIG.PRESET_QUESTIONS
              }}<span class="section-desc-inline"
                >（每行输入一个问题，保存后将在右侧聊天区显示）</span
              >
            </div>
            <a-textarea
              v-model:value="presetQuestionsText"
              :placeholder="UI_TEXT.CONFIG.PLACEHOLDERS.PRESET_QUESTIONS"
              :rows="4"
              class="form-textarea"
              @blur="handlePresetQuestionsChange"
            />
          </div>

          <!-- 高级配置 -->
          <div class="form-section">
            <div class="custom-collapse">
              <div class="custom-collapse-header" @click="toggleAdvancedConfig">
                <span class="header-text">{{
                  UI_TEXT.CONFIG.ADVANCED_CONFIG
                }}</span>
                <component
                  :is="
                    advancedConfigActive.includes('advanced')
                      ? DownOutlined
                      : RightOutlined
                  "
                  class="toggle-icon"
                />
              </div>
              <a-collapse v-model:activeKey="advancedConfigActive" ghost>
                <a-collapse-panel key="advanced" :showArrow="false" header="">
                  <template #header></template>
                  <!-- 受众年龄 -->
                  <div class="advanced-section">
                    <div class="advanced-section-title">受众年龄</div>
                    <div class="option-group two-columns">
                      <OptionButton
                        v-for="option in AUDIENCE_AGE_OPTIONS"
                        :key="option.key"
                        :text="option.label"
                        :is-active="agentConfig.audienceAge === option.label"
                        @click="agentConfig.audienceAge = agentConfig.audienceAge === option.label ? undefined : option.label"
                      />
                    </div>
                  </div>

                  <!-- 内容复杂度 -->
                  <div class="advanced-section">
                    <div class="advanced-section-title">内容复杂度</div>
                    <div class="option-group three-columns">
                      <OptionButton
                        v-for="option in CONTENT_COMPLEXITY_OPTIONS"
                        :key="option.key"
                        :text="option.label"
                        :is-active="
                          agentConfig.contentComplexity === option.label
                        "
                        @click="agentConfig.contentComplexity = agentConfig.contentComplexity === option.label ? undefined : option.label"
                      />
                    </div>
                  </div>

                  <!-- 主要风格 -->
                  <div class="advanced-section">
                    <div class="advanced-section-title">主要风格</div>
                    <div class="option-group three-columns">
                      <OptionButton
                        v-for="option in MAIN_STYLE_OPTIONS"
                        :key="option.key"
                        :text="option.label"
                        :is-active="agentConfig.mainStyle === option.label"
                        @click="agentConfig.mainStyle = agentConfig.mainStyle === option.label ? undefined : option.label"
                      />
                    </div>
                  </div>

                  <!-- 辅助特色 -->
                  <div class="advanced-section">
                    <div class="advanced-section-title">辅助特色</div>
                    <div class="option-group three-columns">
                      <OptionButton
                        v-for="option in AUXILIARY_TRAIT_OPTIONS"
                        :key="option.key"
                        :text="option.label"
                        :is-active="
                          agentConfig.auxiliaryTraits.includes(option.label)
                        "
                        @click="toggleAuxiliaryTrait(option.label)"
                      />
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>

          <!-- 知识库 -->
          <!-- <div class="form-section">
            <div class="section-title">{{ UI_TEXT.CONFIG.KNOWLEDGE_BASE }}</div>
            <div class="knowledge-upload">
              <a-upload-dragger
                v-model:fileList="knowledgeFiles"
                name="files"
                :multiple="true"
                :before-upload="handleBeforeUpload"
                class="knowledge-uploader"
              >
                <div class="upload-content">
                  <img src="/images/avatars/fileUpload.png" class="upload-icon" alt="文件上传" />
                  <div class="upload-text">将文件拖到此处，或<span class="upload-link">点击上传</span></div>
                  <div class="upload-desc">{{ UI_TEXT.BUTTONS.SUPPORTED_FORMATS }}</div>
                </div>
              </a-upload-dragger>
            </div>
          </div> -->
        </div>

        <!-- 固定在底部的重新生成按钮 -->
        <div class="fixed-footer">
          <a-button
            type="primary"
            @click="handleRegenerate"
            :loading="regenerating"
            class="regenerate-btn"
          >
            <ReloadOutlined v-if="!regenerating" />
            {{ UI_TEXT.BUTTONS.REGENERATE }}
          </a-button>
        </div>
      </div>

      <!-- 右侧调试与预览区域 -->
      <div class="preview-area">
        <div class="preview-header">
          <h3 class="preview-title">{{ UI_TEXT.PREVIEW.TITLE }}</h3>
        </div>

        <!-- 智能体介绍卡片 -->
        <AgentIntroCard
          :agent="agentPreview"
          @question-click="handleQuestionClick"
        />

        <!-- 对话区域 -->
        <ChatContainer
          :messages="chatMessages"
          :agent-avatar="agentConfig.avatar"
          :placeholder="UI_TEXT.CHAT.INPUT_PLACEHOLDER"
          @send-message="handleSendMessageFromInput"
          ref="chatContainerRef"
          :showClearButton="true"
          :streaming-message-id="currentStreamingMessageId"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  DownOutlined,
  RightOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import ChatContainer from "@/components/ChatContainer";
import OptionButton from "@/components/OptionButton";
import BackButton from "@/components/BackButton";
import AgentIntroCard from "./components/AgentIntroCard.vue";
import { formatAvatarUrl, isImageUrl } from "@/services/api.js";
import { avatarService } from "@/services";
import { message } from "ant-design-vue";
import { extractBackground, extractPersonality, cleanDescription } from "@/utils/agentParser.js";
import {
  UI_TEXT,
  VOICE_OPTIONS,
  AUDIENCE_AGE_OPTIONS,
  CONTENT_COMPLEXITY_OPTIONS,
  MAIN_STYLE_OPTIONS,
  AUXILIARY_TRAIT_OPTIONS,
  DEFAULT_AGENT_CONFIG,
  SAMPLE_QUESTIONS,
} from "./constants.js";
import {
  saveAgentConfig,
  simulateAgentResponse,
  generateAgentPreview,
  loadAgentConfigById,
  createSessionAndNavigateToChat,
} from "./utils.js";

const router = useRouter();
const route = useRoute();

// 智能体配置数据
const agentConfig = reactive({ ...DEFAULT_AGENT_CONFIG });

// 编辑模式状态
const isEditMode = computed(() => route.query.mode === "edit");
const currentAgentId = computed(() => route.query.agentId);

// 预览数据
const agentPreview = computed(() => generateAgentPreview(agentConfig));

// 聊天相关状态
const chatMessages = ref([]);
const currentMessage = ref("");
const chatLoading = ref(false);
const chatContainerRef = ref(null);
const currentStreamingMessageId = ref(null); // 当前正在流式输入的消息ID

// 其他状态
const saving = ref(false);
const regenerating = ref(false);
const goingToRun = ref(false);
const advancedConfigActive = ref(["advanced"]);
const knowledgeFiles = ref([]);
const dataLoading = ref(false);
const avatarLoading = ref(false);

// 预设提问文本
const presetQuestionsText = ref("");

// 处理辅助特色切换
const toggleAuxiliaryTrait = (label) => {
  const index = agentConfig.auxiliaryTraits.indexOf(label);
  if (index > -1) {
    agentConfig.auxiliaryTraits.splice(index, 1);
  } else {
    agentConfig.auxiliaryTraits.push(label);
  }
};

// 处理预设提问文本变化
const handlePresetQuestionsChange = () => {
  // 将文本按换行符分割，过滤掉空行
  const questions = presetQuestionsText.value
    .split("\n")
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  agentConfig.presetQuestions = questions;
};

// 处理高级配置展开收起
const toggleAdvancedConfig = () => {
  const isActive = advancedConfigActive.value.includes("advanced");
  if (isActive) {
    advancedConfigActive.value = [];
  } else {
    advancedConfigActive.value = ["advanced"];
  }
};

// 处理文件上传前验证
const handleBeforeUpload = (file) => {
  const allowedTypes = [
    "text/plain",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const isAllowed = allowedTypes.includes(file.type);
  if (!isAllowed) {
    console.log("只支持txt、pdf、docx格式文件");
    return false;
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    console.log("文件大小不能超过10MB");
    return false;
  }
  return true;
};

// 处理重新生成
const handleRegenerate = async () => {
  regenerating.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("重新生成智能体");
  } finally {
    regenerating.value = false;
  }
};

/**
 * 加载智能体数据 - 支持编辑模式和调试模式
 */
const loadAgentData = async () => {
  const isDebugMode = route.query.mode === "debug";
  const isEditMode = route.query.mode === "edit";

  if (!isDebugMode && !isEditMode) return;

  try {
    dataLoading.value = true;
    let agentData = null;

    // 优先从路由状态获取数据（用于从首页创建跳转）
    const routeState = history.state;
    if (routeState && routeState.agentConfig) {
      agentData = routeState.agentConfig;
      console.log("从路由状态加载智能体数据 (创建模式):", agentData);
    } else if (currentAgentId.value) {
      // 从API获取数据（用于编辑模式或页面刷新）
      agentData = await loadAgentConfigById(currentAgentId.value);
      console.log("从API加载智能体数据:", agentData);
    }

    // 更新配置数据
    if (agentData) {
      // 根据API返回的数据结构进行映射
      console.log("原始API数据:", agentData);

      // 提取背景设定和性格特征
      let backgroundSetting = "";
      let personality = "";

      if (agentData.design) {
        // backgroundSetting = extractBackground(agentData.design)
        backgroundSetting = agentData.introduction;
        personality = extractPersonality(agentData.design);
        console.log("从design字段提取:", { backgroundSetting, personality });
      }

      // 使用API返回的字段，如果没有则使用提取的值或默认值
      Object.assign(agentConfig, {
        id: agentData.id || currentAgentId.value,
        name: agentData.name || agentData.title || "", // 支持title字段作为名称
        backgroundSetting:
          backgroundSetting || agentData.backgroundSetting || "",
        personality: personality || agentData.personality || "",
        avatar: agentData.avatar || "🤖",
        voice: agentData.voice || "male-cantonese-deep",
        openingRemarks: agentData.prologue || agentData.openingRemarks || "",
        presetQuestions:
          agentData.predefined_questions || agentData.presetQuestions || [],
        audienceAge: convertKeyToLabel(agentData.audience_age || agentData.audienceAge, AUDIENCE_AGE_OPTIONS) || undefined,
        contentComplexity: convertKeyToLabel(agentData.content_complexity || agentData.contentComplexity, CONTENT_COMPLEXITY_OPTIONS) || undefined,
        mainStyle: convertKeyToLabel(agentData.main_style || agentData.mainStyle, MAIN_STYLE_OPTIONS) || undefined,
        auxiliaryTraits: convertKeysToLabels(agentData.auxiliary_traits || agentData.auxiliaryTraits || [], AUXILIARY_TRAIT_OPTIONS),
        design: agentData.design,
      });

      console.log("映射后的配置:", agentConfig);

      // 初始化预设提问文本
      presetQuestionsText.value = agentConfig.presetQuestions.join("\n");

      // 检查是否需要生成头像（从首页创建跳转时）
      const routeState = history.state;
      if (
        routeState &&
        routeState.needAvatarGeneration &&
        routeState.fromCreate
      ) {
        generateAvatarForAgent(agentData);
      }
    }
  } catch (error) {
    console.error("加载智能体数据失败:", error);
  } finally {
    dataLoading.value = false;
  }
};

/**
 * 为智能体生成头像
 */
const generateAvatarForAgent = async (agentData) => {
  if (
    !agentData.avatar ||
    typeof agentData.avatar !== "string" ||
    agentData.avatar.length <= 10
  ) {
    return;
  }

  try {
    avatarLoading.value = true;
    console.log("正在生成智能体头像...", agentData.avatar);

    const avatarData = {
      agent_id: agentData.id,
      prompt: agentData.avatar, // 使用avatar字段作为生成提示
    };

    const avatarResponse = await avatarService.create(avatarData);
    console.log("智能体头像生成成功:", avatarResponse);

    // 更新智能体配置中的头像URL
    agentConfig.avatar = formatAvatarUrl(avatarResponse.avatar_url);
    message.success("智能体头像生成完成！");
  } catch (error) {
    console.error("头像生成失败:", error);
    message.warning("头像生成失败，已使用默认样式");
  } finally {
    avatarLoading.value = false;
  }
};


/**
 * 处理头像加载错误
 * @param {Event} event - 错误事件
 */
const handleAvatarError = (event) => {
  console.error("头像加载失败:", event.target.src);
  // 头像加载失败时隐藏图片，显示默认emoji
  event.target.style.display = "none";
};

/**
 * 将key值转换为对应的label值
 * @param {string} key - 需要转换的key值
 * @param {Array} options - 选项数组，包含key和label
 * @returns {string} 对应的label值，如果找不到则返回原值
 */
const convertKeyToLabel = (key, options) => {
  if (!key) return key;
  const option = options.find(opt => opt.key === key);
  return option ? option.label : key;
};

/**
 * 将key数组转换为对应的label数组
 * @param {Array} keys - 需要转换的key数组
 * @param {Array} options - 选项数组，包含key和label
 * @returns {Array} 对应的label数组
 */
const convertKeysToLabels = (keys, options) => {
  if (!Array.isArray(keys)) return [];
  return keys.map(key => convertKeyToLabel(key, options));
};

/**
 * 获取显示用的头像内容 - 如果是URL则显示默认emoji，否则显示原内容
 * @param {string} avatar - 头像内容
 * @returns {string} 显示用的头像内容
 */
const getDisplayAvatar = (avatar) => {
  if (!avatar) return "🤖";

  // 如果是URL路径（包含http、/或.，或者很长），显示默认emoji
  if (
    avatar.includes("http") ||
    avatar.includes("/") ||
    avatar.includes(".") ||
    avatar.length > 20 ||
    avatar.startsWith("static") ||
    avatar.includes("avatar")
  ) {
    return "🤖";
  }

  // 否则显示原内容（emoji或短文字）
  return avatar;
};

// 处理返回
const handleGoBack = () => {
  if (isEditMode.value) {
    // 编辑模式返回到对话页面
    router.push(`/chat/${currentAgentId.value}`);
  } else {
    // 创建模式返回到智能体列表
    router.push("/agents");
  }
};

// 处理取消
const handleCancel = () => {
  router.back();
};

// 处理保存
const handleSave = async () => {
  saving.value = true;
  try {
    await saveAgentConfig(agentConfig);
    console.log("保存成功");
  } catch (error) {
    console.error("保存失败:", error);
  } finally {
    saving.value = false;
  }
};

/**
 * 处理"去运行"按钮点击 - 创建会话并跳转到聊天页面
 */
const handleGoToRun = async () => {
  if (!agentConfig.id) {
    console.error("智能体ID不存在，无法创建会话");
    return;
  }

  try {
    goingToRun.value = true;
    
    // 1. 先保存/更新智能体配置
    console.log("正在保存智能体配置...");
    await saveAgentConfig(agentConfig);
    console.log("✅ 智能体配置保存成功");
    
    // 2. 配置保存成功后，创建会话并跳转到聊天页面
    console.log("正在创建会话并跳转...");
    await createSessionAndNavigateToChat(agentConfig.id, router);
    console.log("✅ 会话创建并跳转成功");
    
  } catch (error) {
    console.error("❌ 保存配置或跳转到聊天页面失败:", error);
    // saveAgentConfig 和 createSessionAndNavigateToChat 都有自己的错误提示
    // 这里不需要额外的错误提示
  } finally {
    goingToRun.value = false;
  }
};

// 处理问题点击
const handleQuestionClick = (question) => {
  handleSendMessage(question);
};

// 处理从 ChatInput 组件发送的消息
const handleSendMessageFromInput = (payload) => {
  handleSendMessage(payload.content);
};

// 处理发送消息
const handleSendMessage = async (message) => {
  if (!message.trim()) return;

  // 判断是否是第一次对话：只有一条开场白消息
  const isFirstMessage =
    chatMessages.value.length === 1 &&
    !chatMessages.value[0].isUser &&
    agentConfig.openingRemarks;

  // 添加用户消息
  chatMessages.value.push({
    id: Date.now(),
    content: message,
    isUser: true,
  });

  currentMessage.value = "";

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  // 模拟智能体回复
  chatLoading.value = true;

  // 创建智能体消息对象 - 使用reactive确保响应式更新
  const assistantMessage = reactive({
    id: Date.now() + 1,
    content: "",
    isUser: false,
  });
  chatMessages.value.push(assistantMessage);

  // 设置当前流式消息ID，用于显示加载状态
  currentStreamingMessageId.value = assistantMessage.id;

  // 立即滚动到新消息位置
  await nextTick();
  scrollToBottom();

  try {
    // 使用流式回调实时更新内容
    await simulateAgentResponse(
      message,
      agentConfig,
      null,
      isFirstMessage,
      (chunk) => {
        // 收到流式数据时立即更新内容，Vue响应式系统会立即更新UI
        assistantMessage.content += chunk;
        // 使用requestAnimationFrame确保滚动不阻塞流式更新
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      }
    );
  } catch (error) {
    console.error("获取回复失败:", error);
    // 如果出错且还没有内容，显示错误消息
    if (!assistantMessage.content) {
      assistantMessage.content = "抱歉，我现在无法回复，请稍后再试。";
    }
  } finally {
    chatLoading.value = false;
    // 流式对话结束，清除流式消息ID
    currentStreamingMessageId.value = null;
  }
};

// 滚动到聊天底部
const scrollToBottom = () => {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollToBottom();
  }
};

// 处理来自首页的智能体名称
const handleInitialAgentName = () => {
  const routeState = history.state;
  if (routeState && routeState.agentName && !isEditMode.value) {
    // 如果是从首页跳转来的创建模式，设置智能体名称
    agentConfig.name = routeState.agentName;
    console.log("从首页设置智能体名称:", routeState.agentName);
  }
};

// 初始化聊天
const initializeChat = () => {
  if (agentConfig.openingRemarks) {
    chatMessages.value.push({
      id: Date.now(),
      content: agentConfig.openingRemarks,
      isUser: false,
    });
  }
};

// 添加标志位防止重复加载
const hasInitialized = ref(false);

// 监听路由参数变化，重新加载数据
watch(
  [() => route.query.agentId, () => route.query.mode],
  async ([newAgentId, newMode], [oldAgentId, oldMode]) => {
    // 如果是初始化时触发（从undefined变为有值），跳过，由onMounted处理
    if (!hasInitialized.value) {
      return;
    }

    // 只有当agentId或mode真正发生变化时才重新加载
    if (
      newMode === "edit" &&
      newAgentId &&
      (newAgentId !== oldAgentId || newMode !== oldMode)
    ) {
      await loadAgentData();
      initializeChat();
    }
  },
  { immediate: false }
);

onMounted(async () => {
  // 根据模式加载数据
  const mode = route.query.mode;

  if (mode === "debug" || mode === "edit") {
    // 调试模式或编辑模式：加载智能体数据
    await loadAgentData();
  } else {
    // 创建模式：处理来从首页传递的智能体名称
    handleInitialAgentName();
    // 初始化预设提问文本
    presetQuestionsText.value = agentConfig.presetQuestions.join("\n");
  }

  initializeChat();

  // 标记已初始化，避免watch重复执行
  hasInitialized.value = true;
});
</script>

<style lang="scss" scoped>
.setup-agent {
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;

  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 0 24px;
    background: white;
    border-bottom: 1px solid #e8e8e8;

    .nav-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .page-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }
    }

    .nav-right {
      display: flex;
      gap: 12px;

      .nav-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        height: 36px;
        padding: 0 16px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        background: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;

        .nav-btn-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
        }

        &:hover {
          border-color: #355eff;
          color: #355eff;
        }

        &.primary {
          background: #355eff;
          border-color: #355eff;
          color: white;

          &:hover {
            background: #2a4ccc;
          }
        }
      }
    }
  }

  .main-content {
    display: flex;
    height: calc(100vh - 64px);
    background: #f3f8ff;
    transition: opacity 0.2s ease;

    &.data-loading {
      opacity: 0.8;
      pointer-events: none;
    }
  }

  .config-sidebar {
    width: 530px;
    flex-shrink: 0;
    background: white;
    border-radius: 16px;
    margin: 16px 20px 26px 32px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .config-form {
      padding: 0;
      flex: 1;
      overflow-y: auto;

      /* 隐藏滚动条但保持滚动功能 */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */

      &::-webkit-scrollbar {
        display: none; /* Chrome/Safari/Webkit */
      }

      .avatar-section {
        display: flex;
        justify-content: center;
        margin: 0 0 24px 0;
        padding: 32px 20px 24px 20px;
        background-image: url("/images/backgrounds/setupAgentTitleBg.png");
        background-size: 100% auto;
        background-position: top center;
        background-repeat: no-repeat;
        border-radius: 16px 16px 0 0;
        min-height: 120px;

        .avatar-upload {
          .current-avatar {
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #e8f4fd 0%, #badaff 100%);
            border-radius: 16px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              transform: scale(1.02);
            }

            .avatar-icon {
              font-size: 50px;
            }

            .avatar-image {
              width: 100%;
              height: 100%;
              border-radius: 16px;
              object-fit: cover;
              object-position: center;
            }

            // 头像加载状态
            .avatar-loading {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 8px;
              width: 100%;
              height: 100%;

              .loading-spinner {
                width: 24px;
                height: 24px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #355eff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }

              .loading-text {
                color: #666;
                font-size: 12px;
                text-align: center;
              }
            }

            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }

            .avatar-edit-btn {
              position: absolute;
              top: -4px;
              right: -4px;
              width: 24px;
              height: 24px;
              background: #355eff;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;

              &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;

              .edit-icon {
                font-size: 12px;
                color: white;
              }

              &:hover {
                background: #2a4ccc;
                transform: scale(1.1);
              }
            }
          }
        }
      }

      .form-section {
        margin-bottom: 24px;
        padding: 0 20px;

        .section-title {
          color: #181b49;
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
          margin-bottom: 8px;
          position: relative;
          padding-left: 16px;

          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 16px;
            background: #355eff;
            border-radius: 2px;
          }
        }

        .section-desc {
          font-size: 12px;
          color: #999;
          margin-bottom: 12px;
          padding-left: 16px;
        }

        .section-desc-inline {
          font-size: 12px;
          color: #999;
          font-weight: normal;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          margin-bottom: 12px;
        }

        .subsection {
          margin-bottom: 16px;

          .subsection-title {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
            padding-left: 16px;
          }
        }

        // 自定义高级配置样式
        .custom-collapse {
          .custom-collapse-header {
            color: #181b49;
            font-size: 14px;
            font-weight: 500;
            line-height: 24px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-left: 16px;

            &::before {
              content: "";
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 16px;
              background: #355eff;
              border-radius: 2px;
            }

            .header-text {
              flex: 1;
              pointer-events: none;
            }

            .toggle-icon {
              font-size: 12px;
              color: #999;
              cursor: pointer;
              padding: 4px;
              border-radius: 2px;
              transition: all 0.2s ease;

              &:hover {
                background: rgba(53, 94, 255, 0.1);
                color: #355eff;
              }
            }
          }

          :deep(.ant-collapse) {
            background: transparent;
            border: none;

            .ant-collapse-item {
              border: none;

              .ant-collapse-header {
                display: none;
              }

              .ant-collapse-content {
                border: none;
                background: transparent;

                .ant-collapse-content-box {
                  padding: 0 16px;
                }
              }
            }
          }
        }

        .advanced-section {
          margin-bottom: 20px;

          .advanced-section-title {
            font-size: 12px;
            color: #666;
            margin-bottom: 12px;
            line-height: 14px;
          }

          .option-group {
            display: grid;
            gap: 8px;
            margin-bottom: 16px;

            &.two-columns {
              grid-template-columns: repeat(2, 1fr);
            }

            &.three-columns {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        }

        .knowledge-upload {
          :deep(.ant-upload-wrapper) {
            .ant-upload-drag {
              border: 1px solid #d9d9d9 !important;
              border-radius: 8px;
              background: #f7f8fc;
              transition: all 0.3s ease;

              &:hover {
                border-color: #355eff !important;
                background: #f0f9ff;
              }

              .ant-upload-drag-container {
                padding: 24px 16px;
              }
            }
          }

          .upload-content {
            text-align: center;

            .upload-icon {
              width: 50px;
              height: 50px;
              margin-bottom: 8px;
              opacity: 0.6;
              object-fit: contain;
              border: 1px dashed #dad9da;
              border-radius: 4px;
            }

            .upload-text {
              font-size: 14px;
              color: #666;
              margin-bottom: 4px;

              .upload-link {
                color: #355eff;
                cursor: pointer;
              }
            }

            .upload-desc {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }

    .fixed-footer {
      flex-shrink: 0;
      padding: 20px;
      border-top: 1px solid #f0f0f0;
      background: white;
      border-radius: 0 0 16px 16px;
      display: flex;
      justify-content: center;
      align-items: center;

      .regenerate-btn {
        width: 112px;
        height: 36px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        .anticon {
          font-size: 14px;
        }
      }
    }
  }

  .preview-area {
    flex: 1;
    background: transparent;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 0; // 确保flex子元素能正确收缩

    .preview-header {
      margin-bottom: 20px;
      width: 780px;

      .preview-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }

    :deep(.chat-container) {
      margin-top: 16px;
      width: 780px;
      flex: 1; // 占用剩余空间
      min-height: 0; // 确保能正确收缩
      max-height: calc(100vh - 400px); // 为顶部导航(64px)、预览标题(60px)、AgentIntroCard(约250px)、padding等预留空间
      
      // 专门为配置智能体页面设置chat-input的margin-bottom为0
      .chat-input {
        margin-bottom: 0;
      }
    }
  }
}
</style>