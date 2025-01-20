<script setup>
import { ref, watch } from 'vue'
import { translateAddress } from './services/zhipu'

// 响应式数据
const fromLang = ref('en')
const toLang = ref('zh')
const inputAddress = ref('')
const transformedAddress = ref('')
const isLoading = ref(false)
const error = ref('')
const langWarning = ref('')

// 语言检测函数
const detectLanguage = (text) => {
  // 清空之前的警告
  langWarning.value = ''
  
  if (!text) return
  
  // 简单的语言特征检测
  const patterns = {
    zh: /[\u4e00-\u9fff]/, // 中文字符
    en: /^[a-zA-Z0-9\s,.'"-]+$/, // 英文字符
    ja: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/, // 日文(假名和汉字)
    ko: /[\uAC00-\uD7AF\u1100-\u11FF]/, // 韩文
  }

  // 获取输入文本的主要语言
  const text_trim = text.trim()
  const detected = Object.entries(patterns).find(([lang, pattern]) => {
    // 对于英文，需要整个字符串匹配
    if (lang === 'en') {
      return pattern.test(text_trim)
    }
    // 对于其他语言，检查是否包含相应字符
    return pattern.test(text_trim)
  })

  // 如果检测到的语言与选择的语言不匹配，显示警告
  if (detected && detected[0] !== fromLang.value) {
    const langNames = {
      zh: '中文',
      en: 'English',
      ja: '日本語',
      ko: '한국어'
    }
    langWarning.value = `This address appears to be in ${langNames[detected[0]]}. Please check your language selection.`
  }
}

// 监听输入变化
watch(inputAddress, (newValue) => {
  if (newValue) {
    detectLanguage(newValue)
  } else {
    langWarning.value = ''
  }
})

// 处理地址转换
const transformAddress = async () => {
  if (!inputAddress.value.trim()) {
    error.value = 'Please enter an address'
    return
  }

  try {
    isLoading.value = true
    error.value = ''
    transformedAddress.value = ''
    
    const result = await translateAddress(
      inputAddress.value.trim(),
      fromLang.value,
      toLang.value
    )
    
    transformedAddress.value = result
  } catch (e) {
    console.error('App Error:', e)
    error.value = e.response?.data?.error?.message || 
                 e.message || 
                 'Failed to transform address. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// 复制结果
const copyResult = async () => {
  if (transformedAddress.value) {
    try {
      await navigator.clipboard.writeText(transformedAddress.value)
      // 添加临时成功提示
      const originalError = error.value
      error.value = 'Copied to clipboard!'
      setTimeout(() => {
        error.value = originalError
      }, 2000)
    } catch (e) {
      error.value = 'Failed to copy text'
    }
  }
}

// 分享结果
const shareResult = async () => {
  if (transformedAddress.value) {
    try {
      await navigator.share({
        title: 'Transformed Address',
        text: transformedAddress.value,
        url: window.location.href
      })
    } catch (e) {
      // 如果浏览器不支持分享API或用户取消分享，静默失败
      console.log('Sharing failed:', e)
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        
        <!-- 标题 -->
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">TransAddr.com</h1>
              <p class="text-center text-gray-600 mb-8">Transform addresses between different language formats</p>

              <!-- 错误/成功提示 -->
              <div v-if="error" 
                :class="[
                  'text-sm text-center mb-4',
                  error === 'Copied to clipboard!' ? 'text-green-500' : 'text-red-500'
                ]">
                {{ error }}
              </div>

              <!-- 语言选择 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">From Language</label>
                <select 
                  v-model="fromLang"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>

              <!-- 地址输入 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Input Address</label>
                <textarea
                  v-model="inputAddress"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter the address you want to transform..."
                ></textarea>
                <!-- 语言检测警告 -->
                <div v-if="langWarning" class="mt-2 text-yellow-600 text-sm">
                  {{ langWarning }}
                </div>
              </div>

              <!-- 目标语言 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">To Language</label>
                <select 
                  v-model="toLang"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="zh" selected>中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>

              <!-- 转换按钮 -->
              <div class="mt-8 flex justify-center">
                <button 
                  @click="transformAddress"
                  :disabled="isLoading || !inputAddress.trim()"
                  class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isLoading">Transforming...</span>
                  <span v-else>Transform Address Format</span>
                </button>
              </div>

              <!-- 结果显示 -->
              <div v-if="transformedAddress || isLoading" class="mt-8">
                <label class="block text-sm font-medium text-gray-700 mb-2">Transformed Address</label>
                <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p v-if="isLoading" class="text-gray-500">Transforming...</p>
                  <p v-else class="text-gray-800">{{ transformedAddress }}</p>
                </div>
                <div v-if="transformedAddress" class="mt-4 flex space-x-4 justify-center">
                  <button 
                    @click="copyResult"
                    class="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Copy Result
                  </button>
                  <button 
                    @click="shareResult"
                    class="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Share Result
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件特定的样式可以在这里添加 */
</style>
