/**
 * 图片缓存管理器
 * 用于避免智能体头像的重复网络请求
 */

class ImageCache {
  constructor() {
    // 图片缓存存储
    this.cache = new Map()
    // 正在加载的图片Promise
    this.loadingPromises = new Map()
    // 缓存清理时间（默认30分钟）
    this.cacheExpiry = 30 * 60 * 1000
  }

  /**
   * 预加载图片并缓存
   * @param {string} url - 图片URL
   * @returns {Promise<string>} 返回可用的图片URL
   */
  async preloadImage(url) {
    if (!url || typeof url !== 'string') {
      return url
    }

    // 如果是emoji或很短的字符串，直接返回
    if (url.length <= 5 || (!url.includes('http') && !url.includes('/'))) {
      return url
    }

    // 检查缓存
    const cached = this.cache.get(url)
    if (cached && this.isCacheValid(cached)) {
      return cached.dataUrl || url
    }

    // 检查是否正在加载
    if (this.loadingPromises.has(url)) {
      return await this.loadingPromises.get(url)
    }

    // 开始加载图片
    const loadPromise = this.loadImageToCache(url)
    this.loadingPromises.set(url, loadPromise)

    try {
      const result = await loadPromise
      return result
    } finally {
      this.loadingPromises.delete(url)
    }
  }

  /**
   * 将图片加载到缓存中
   * @param {string} url - 图片URL
   * @returns {Promise<string>} 返回缓存的图片URL
   */
  loadImageToCache(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        try {
          // 创建canvas将图片转换为dataURL进行缓存
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          ctx.drawImage(img, 0, 0)
          
          const dataUrl = canvas.toDataURL('image/png')
          
          // 缓存图片数据
          this.cache.set(url, {
            dataUrl: dataUrl,
            originalUrl: url,
            timestamp: Date.now(),
            loaded: true
          })
          
          resolve(dataUrl)
        } catch (error) {
          console.warn('图片缓存失败，使用原始URL:', error)
          // 即使缓存失败，也标记为已加载避免重复请求
          this.cache.set(url, {
            dataUrl: null,
            originalUrl: url,
            timestamp: Date.now(),
            loaded: true
          })
          resolve(url)
        }
      }
      
      img.onerror = () => {
        console.warn('图片加载失败，使用原始URL:', url)
        // 标记为失败但已尝试，避免重复请求
        this.cache.set(url, {
          dataUrl: null,
          originalUrl: url,
          timestamp: Date.now(),
          loaded: false,
          error: true
        })
        resolve(url)
      }
      
      // 设置crossOrigin以避免CORS问题
      img.crossOrigin = 'anonymous'
      img.src = url
    })
  }

  /**
   * 检查缓存是否有效
   * @param {Object} cached - 缓存对象
   * @returns {boolean} 缓存是否有效
   */
  isCacheValid(cached) {
    if (!cached) return false
    
    const now = Date.now()
    const isExpired = now - cached.timestamp > this.cacheExpiry
    
    return !isExpired
  }

  /**
   * 获取图片URL（同步方法，用于已缓存的图片）
   * @param {string} url - 原始图片URL
   * @returns {string} 缓存的图片URL或原始URL
   */
  getCachedImage(url) {
    if (!url || typeof url !== 'string') {
      return url
    }

    // 如果是emoji或很短的字符串，直接返回
    if (url.length <= 5 || (!url.includes('http') && !url.includes('/'))) {
      return url
    }

    const cached = this.cache.get(url)
    if (cached && this.isCacheValid(cached) && cached.dataUrl) {
      return cached.dataUrl
    }

    return url
  }

  /**
   * 清理特定图片的缓存
   * @param {string} url - 要清理的图片URL
   */
  clearImageCache(url) {
    if (url) {
      this.cache.delete(url)
      this.loadingPromises.delete(url)
    }
  }

  /**
   * 清理所有缓存
   */
  clearAllCache() {
    this.cache.clear()
    this.loadingPromises.clear()
  }

  /**
   * 批量预加载图片（针对role-avatar-image等组件优化）
   * @param {Array<string>} urls - 图片URL数组
   * @returns {Promise<Array>} 预加载结果数组
   */
  async batchPreloadImages(urls) {
    if (!Array.isArray(urls)) return []
    
    const promises = urls
      .filter(url => url && typeof url === 'string')
      .map(url => this.preloadImage(url).catch(error => {
        console.warn(`预加载图片失败: ${url}`, error)
        return url // 失败时返回原始URL
      }))
    
    try {
      return await Promise.allSettled(promises)
    } catch (error) {
      console.warn('批量预加载图片失败:', error)
      return []
    }
  }

  /**
   * 检查是否有图片正在加载
   * @returns {boolean} 是否有图片正在加载
   */
  hasLoadingImages() {
    return this.loadingPromises.size > 0
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 缓存统计
   */
  getCacheStats() {
    const now = Date.now()
    let validCount = 0
    let expiredCount = 0
    
    for (const cached of this.cache.values()) {
      const isExpired = now - cached.timestamp > this.cacheExpiry
      if (isExpired) {
        expiredCount++
      } else {
        validCount++
      }
    }
    
    return {
      total: this.cache.size,
      valid: validCount,
      expired: expiredCount,
      loading: this.loadingPromises.size
    }
  }

  /**
   * 清理过期缓存
   */
  cleanExpiredCache() {
    const now = Date.now()
    for (const [url, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.cacheExpiry) {
        this.cache.delete(url)
      }
    }
  }
}

// 创建全局单例
const imageCache = new ImageCache()

// 定期清理过期缓存
setInterval(() => {
  imageCache.cleanExpiredCache()
}, 5 * 60 * 1000) // 每5分钟清理一次

export default imageCache