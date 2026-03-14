'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import HistoryPage from '@/components/HistoryPage'
import EmotionChart from '@/components/EmotionChart'
import { useCheckInRecords } from '@/hooks/useCheckInRecords'
import { EmotionType, MicroAction, Message } from '@/types'

export default function Home() {
  const [currentView, setCurrentView] = useState<'chat' | 'history' | 'chart'>('chat')
  const { records, addRecord, hasCheckedInToday, getTodayRecord } = useCheckInRecords()

  const handleCheckInComplete = (data: {
    emotion: EmotionType
    emotionScore: number
    summary: string
    microAction: MicroAction | null
    messages: Message[]
  }) => {
    addRecord(data)
  }

  const todayRecord = getTodayRecord()
  const checkedIn = hasCheckedInToday()

  return (
    <main className="page-container">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-warmgray-800">情绪灯塔</h1>
        <nav className="flex gap-2">
          <button
            onClick={() => setCurrentView('chat')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              currentView === 'chat'
                ? 'bg-oat-200 text-warmgray-700'
                : 'text-warmgray-500 hover:bg-oat-100'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              currentView === 'history'
                ? 'bg-oat-200 text-warmgray-700'
                : 'text-warmgray-500 hover:bg-oat-100'
            }`}
          >
            记录
          </button>
          <button
            onClick={() => setCurrentView('chart')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              currentView === 'chart'
                ? 'bg-oat-200 text-warmgray-700'
                : 'text-warmgray-500 hover:bg-oat-100'
            }`}
          >
            趋势
          </button>
        </nav>
      </header>

      {/* 内容区域 */}
      {currentView === 'chat' && (
        <ChatInterface
          onComplete={handleCheckInComplete}
        />
      )}
      {currentView === 'history' && <HistoryPage records={records} />}
      {currentView === 'chart' && <EmotionChart records={records} />}
    </main>
  )
}