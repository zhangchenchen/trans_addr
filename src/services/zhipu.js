import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://open.bigmodel.cn/api/paas/v4',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': import.meta.env.VITE_ZHIPU_API_KEY
  }
})

export const translateAddress = async (address, fromLang, toLang) => {
  try {
    console.log('Sending request to GLM-4 with:', {
      address,
      fromLang,
      toLang,
      apiKey: import.meta.env.VITE_ZHIPU_API_KEY ? 'Present' : 'Missing'
    })

    const response = await apiClient.post('/chat/completions', {
      model: "glm-4-plus",
      messages: [
        {
          role: "system",
          content: `
          任务描述：
            请将以下[源语言]地址转换为符合[目标语言]格式的地址。确保转换后的地址信息准确、完整，并符合[目标语言]的地址书写习惯。
          `
        },
        {
          role: "user",
          content: `
          源语言地址: ${address},
          目标语言: ${toLang},

          转换要求：
            保留所有原始地址信息，包括地名、门牌号、邮政编码等。
            按照目标语言的地址格式重新排列信息。
            如有需要，翻译地名和其他相关词汇，确保符合目标语言的表述习惯。
            在转换过程中，注意目标语言中特有的地址书写规范，如邮政编码的位置、地址的层级顺序等。

          注意事项：
                如遇专有名词或无法翻译的地名，请保留原样。
                确保邮政编码的正确性和位置。
                如有疑问，请参考目标语言的官方地址书写指南。
                只输出转换后的地址，不要输出任何其他内容。
          `
        } 
      ],
      temperature: 0.7,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false
    })

    console.log('GLM-4 Response:', response.data)
    return response.data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Detailed GLM-4 Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    throw error
  }
} 