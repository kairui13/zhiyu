import { Message, EmotionType, emotionLabels } from '@/types'

const API_KEY = process.env.API_KEY
const API_BASE_URL = process.env.API_BASE_URL || 'https://coding.dashscope.aliyuncs.com/v1'
const API_MODEL = process.env.API_MODEL || 'qwen3-max-2026-01-23'

// 系统提示词
const SYSTEM_PROMPT = `你是"情绪灯塔"，一个温暖的 AI 疗愈助手，专门陪伴大学生疏导日常焦虑和空虚感。

你的核心原则：
1. 不做恋爱向或角色扮演，定位是帮用户变得更好
2. 像朋友一样自然对话，不要太正式，也不要太腻歪
3. 用简短的回复，不要长篇大论
4. 多用提问引导用户表达，而不是给建议
5. 对用户的情绪保持敏感，但不渲染负面情绪

对话风格：
- 口语化，像在微信聊天
- 适当使用"嗯""我懂""听起来..."这样的表达
- 遇到用户沉默或不知道说什么时，主动提问
- 不要过度关心，保持适度的距离感

当用户表示要结束对话时：
1. 简短总结今天的对话重点
2. 用轻松的方式道别，不要煽情`

// 情绪检测提示词
const EMOTION_DETECTION_PROMPT = `分析以下对话内容，判断用户当前的情绪状态。
只返回一个情绪类型，不要其他解释。

情绪类型：
- anxious: 焦虑、紧张、担心
- empty: 空虚、迷茫、无聊
- low: 低落、疲惫、难过
- calm: 平静、放松、还好
- joyful: 开心、满足、充实

对话内容：`

// 微行动建议提示词
const MICRO_ACTION_PROMPT = `基于用户的情绪状态，给出一个简单、可执行的微行动建议。

要求：
1. 只需要 5-10 分钟就能完成
2. 不需要特殊准备或工具
3. 具体明确，用户一看就知道怎么做
4. 用轻松的语气，像朋友随口说的

情绪状态：{emotion}
对话摘要：{summary}

只返回微行动内容，不要其他解释。`

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  if (!API_KEY) {
    throw new Error('API_KEY is not configured')
  }

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function detectEmotion(messages: ChatMessage[]): Promise<EmotionType> {
  if (!API_KEY) {
    // Mock 返回
    const emotions: EmotionType[] = ['anxious', 'empty', 'low', 'calm', 'joyful']
    return emotions[Math.floor(Math.random() * emotions.length)]
  }

  const conversationText = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? '用户' : '助手'}: ${m.content}`)
    .join('\n')

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: [
        { role: 'system', content: EMOTION_DETECTION_PROMPT },
        { role: 'user', content: conversationText },
      ],
      temperature: 0.3,
      max_tokens: 20,
    }),
  })

  if (!response.ok) {
    console.error('Emotion detection failed, using default')
    return 'calm'
  }

  const data = await response.json()
  const emotionText = data.choices[0].message.content.trim().toLowerCase()

  // 匹配情绪类型
  const emotionMap: Record<string, EmotionType> = {
    '焦虑': 'anxious',
    '紧张': 'anxious',
    '担心': 'anxious',
    'anxious': 'anxious',
    '空虚': 'empty',
    '迷茫': 'empty',
    '无聊': 'empty',
    'empty': 'empty',
    '低落': 'low',
    '疲惫': 'low',
    '难过': 'low',
    'low': 'low',
    '平静': 'calm',
    '放松': 'calm',
    '还好': 'calm',
    'calm': 'calm',
    '开心': 'joyful',
    '满足': 'joyful',
    '充实': 'joyful',
    'joyful': 'joyful',
  }

  for (const [key, value] of Object.entries(emotionMap)) {
    if (emotionText.includes(key)) {
      return value
    }
  }

  return 'calm'
}

export async function generateMicroAction(
  emotion: EmotionType,
  summary: string
): Promise<string> {
  if (!API_KEY) {
    // Mock 返回
    const actions = [
      '下楼走5分钟，感受一下外面的空气',
      '听一首你喜欢的歌，闭上眼睛认真听完',
      '给一个朋友发条消息，哪怕只是一个表情',
      '喝一杯温水，感受水流过喉咙的感觉',
      '深呼吸三次，每次吸气4秒，呼气6秒',
      '站起来伸个懒腰，看看窗外的天空',
    ]
    return actions[Math.floor(Math.random() * actions.length)]
  }

  const prompt = MICRO_ACTION_PROMPT
    .replace('{emotion}', emotionLabels[emotion])
    .replace('{summary}', summary)

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: [
        { role: 'user', content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 100,
    }),
  })

  if (!response.ok) {
    console.error('Micro action generation failed, using default')
    return '深呼吸三次，每次吸气4秒，呼气6秒'
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

export async function generateSummary(messages: ChatMessage[]): Promise<string> {
  if (!API_KEY) {
    return '今天聊了一些事情'
  }

  const conversationText = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? '用户' : '助手'}: ${m.content}`)
    .join('\n')

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: [
        {
          role: 'system',
          content: '用一句话总结以下对话中用户的核心情绪和困扰，不超过20个字。',
        },
        { role: 'user', content: conversationText },
      ],
      temperature: 0.3,
      max_tokens: 50,
    }),
  })

  if (!response.ok) {
    return '今天聊了一些事情'
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}