// 情绪类型
export type EmotionType = 'anxious' | 'empty' | 'low' | 'calm' | 'joyful'

// 情绪标签映射
export const emotionLabels: Record<EmotionType, string> = {
  anxious: '焦虑',
  empty: '空虚',
  low: '低落',
  calm: '平静',
  joyful: '愉悦',
}

// 情绪颜色映射
export const emotionColors: Record<EmotionType, string> = {
  anxious: '#D4A574',
  empty: '#A8B5C4',
  low: '#B8A99A',
  calm: '#9FB3C8',
  joyful: '#C4B08A',
}

// 聊天消息
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// 微行动
export interface MicroAction {
  id: string
  content: string
  completed: boolean | null // null = not responded yet
  feedback?: string
  createdAt: Date
}

// 签到记录
export interface CheckInRecord {
  id: string
  date: string // YYYY-MM-DD
  emotion: EmotionType
  emotionScore: number // 1-5
  messages: Message[]
  microAction?: MicroAction | null
  summary?: string
  createdAt: Date
}

// 用户记忆
export interface UserMemory {
  userName?: string
  importantEvents: Array<{
    content: string
    date: string
  }>
  recentTopics: string[]
  lastCheckIn?: string
}