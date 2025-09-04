/**
 * 智能体配置解析工具函数
 * 统一处理智能体的design字段解析，避免冒号问题
 */

/**
 * 从design字段中提取背景设定
 * @param {string} design - 设计字段内容
 * @returns {string} 背景设定文本
 */
export const extractBackground = (design) => {
  if (!design) return "";

  // 尝试多种匹配模式
  const patterns = [
    /##【背景设定】\s*([^#]*)/i,
    /##【背景】\s*([^#]*)/i,
    /背景设定[:：]\s*([^#]*)/i,
    /背景[:：]\s*([^#]*)/i,
  ];

  for (const pattern of patterns) {
    const match = design.match(pattern);
    if (match) {
      let result = match[1].trim();
      // 移除开头的冒号（如果存在）
      result = result.replace(/^[:：]\s*/, '');
      if (result) return result;
    }
  }

  // 如果没有找到特定格式，尝试提取第一段作为背景
  const sections = design.split(/##/);
  if (sections.length > 1) {
    // 找到第一个非空的section
    for (const section of sections) {
      let cleaned = section.trim();
      // 移除可能的标题和冒号
      cleaned = cleaned.replace(/^【[^】]*】[:：]?\s*/, '');
      cleaned = cleaned.replace(/^[:：]\s*/, '');
      if (cleaned && !cleaned.startsWith("【")) {
        return cleaned;
      }
    }
  }

  return "";
};

/**
 * 从design字段中提取性格特征
 * @param {string} design - 设计字段内容
 * @returns {string} 性格特征文本
 */
export const extractPersonality = (design) => {
  if (!design) return "";

  // 尝试多种匹配模式
  const patterns = [
    /##【性格特征】\s*([^#]*)/i,
    /##【性格】\s*([^#]*)/i,
    /性格特征[:：]\s*([^#]*)/i,
    /性格[:：]\s*([^#]*)/i,
    /##【人设】\s*([^#]*)/i,
    /人设[:：]\s*([^#]*)/i,
  ];

  for (const pattern of patterns) {
    const match = design.match(pattern);
    if (match) {
      let result = match[1].trim();
      // 移除开头的冒号（如果存在）
      result = result.replace(/^[:：]\s*/, '');
      if (result) return result;
    }
  }

  return "";
};

/**
 * 从design字段中提取介绍信息（优先背景设定，其次性格特征）
 * @param {string} design - 设计字段内容
 * @returns {string} 介绍信息
 */
export const extractIntroduction = (design) => {
  const background = extractBackground(design);
  if (background) return background;
  
  const personality = extractPersonality(design);
  if (personality) return personality;
  
  return "";
};

/**
 * 清理描述文本，移除开头的冒号和多余空格
 * @param {string} description - 描述文本
 * @returns {string} 清理后的描述文本
 */
export const cleanDescription = (description) => {
  if (!description) return "";
  
  let cleaned = description.trim();
  // 移除开头的冒号
  cleaned = cleaned.replace(/^[:：]\s*/, '');
  // 移除多余的空格和换行
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};