'use client'

import { CheckInRecord, emotionLabels, emotionColors, EmotionType } from '@/types'
import { ChevronRight, Check } from 'lucide-react'

interface HistoryPageProps {
  records: CheckInRecord[]
}

// Mock 历史数据 (当没有真实数据时显示)
const mockHistoryData: CheckInRecord[] = [
  {
    id: '1',
    date: '2024-03-14',
    emotion: 'calm',
    emotionScore: 4,
    summary: '今天状态不错，完成了一些工作',
    microAction: {
      id: 'a1',
      content: '下楼走5分钟',
      completed: true,
      createdAt: new Date('2024-03-14'),
    },
    messages: [],
    createdAt: new Date('2024-03-14'),
  },
  {
    id: '2',
    date: '2024-03-13',
    emotion: 'anxious',
    emotionScore: 2,
    summary: '明天有考试，有点紧张',
    microAction: {
      id: 'a2',
      content: '深呼吸三次',
      completed: true,
      createdAt: new Date('2024-03-13'),
    },
    messages: [],
    createdAt: new Date('2024-03-13'),
  },
  {
    id: '3',
    date: '2024-03-12',
    emotion: 'low',
    emotionScore: 2,
    summary: '感觉有点累，没什么动力',
    microAction: {
      id: 'a3',
      content: '给朋友发条消息',
      completed: false,
      createdAt: new Date('2024-03-12'),
    },
    messages: [],
    createdAt: new Date('2024-03-12'),
  },
  {
    id: '4',
    date: '2024-03-11',
    emotion: 'joyful',
    emotionScore: 5,
    summary: '收到了好消息，很开心',
    microAction: {
      id: 'a4',
      content: '听一首喜欢的歌',
      completed: true,
      createdAt: new Date('2024-03-11'),
    },
    messages: [],
    createdAt: new Date('2024-03-11'),
  },
  {
    id: '5',
    date: '2024-03-10',
    emotion: 'empty',
    emotionScore: 2,
    summary: '周末在宿舍躺了一天，感觉空虚',
    microAction: {
      id: 'a5',
      content: '下楼走5分钟',
      completed: false,
      createdAt: new Date('2024-03-10'),
    },
    messages: [],
    createdAt: new Date('2024-03-10'),
  },
]

export default function HistoryPage({ records }: HistoryPageProps) {
  // 如果没有记录，使用 mock 数据
  const displayRecords = records.length > 0 ? records : mockHistoryData
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split('T')[0]) {
      return '今天'
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '昨天'
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
  }

  return (
    <div className="space-y-3">
      {displayRecords.map((record) => (
        <div
          key={record.id}
          className="bg-white rounded-2xl p-4 border border-oat-100 hover:border-oat-200 transition-colors cursor-pointer"
        >
          {/* 日期和情绪 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-warmgray-500">{formatDate(record.date)}</span>
            <span
              className="px-3 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${emotionColors[record.emotion]}20`,
                color: emotionColors[record.emotion],
              }}
            >
              {emotionLabels[record.emotion]}
            </span>
          </div>

          {/* 摘要 */}
          <p className="text-warmgray-700 text-sm mb-3">{record.summary}</p>

          {/* 微行动 */}
          {record.microAction && (
            <div className="flex items-center gap-2 text-xs text-warmgray-500">
              {record.microAction.completed ? (
                <Check className="w-3.5 h-3.5 text-sage-500" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-warmgray-300" />
              )}
              <span className={record.microAction.completed ? 'text-sage-600' : ''}>
                {record.microAction.content}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* 加载更多 */}
      <button className="w-full py-3 text-sm text-warmgray-500 hover:text-warmgray-700 flex items-center justify-center gap-1">
        查看更多
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}