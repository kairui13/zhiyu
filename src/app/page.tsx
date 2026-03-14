'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import HistoryPage from '@/components/HistoryPage'
import EmotionChart from '@/components/EmotionChart'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuth } from '@/components/auth/useAuth'
import { useCheckInRecords } from '@/hooks/useCheckInRecords'
import { EmotionType, MicroAction, Message } from '@/types'
import { LogOut, Loader2 } from 'lucide-react'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const { records, addRecord } = useCheckInRecords(user)
  const [currentView, setCurrentView] = useState<'chat' | 'history' | 'chart'>('chat')

  const handleCheckInComplete = (data: {
    emotion: EmotionType
    emotionScore: number
    summary: string
    microAction: MicroAction | null
    messages: Message[]
  }) => {
    addRecord(data)
  }

  // 加载中
  if (loading) {
    return (
      <main className="page-container flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </main>
    )
  }

  // 未登录
  if (!user) {
    return (
      <main className="page-container flex items-center justify-center min-h-screen">
        <AuthForm />
      </main>
    )
  }

  // 已登录
  return (
    <main className="page-container">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-warmgray-800">情绪灯塔</h1>
        <div className="flex items-center gap-4">
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
          <button
            onClick={signOut}
            className="p-2 text-warmgray-500 hover:text-warmgray-700 hover:bg-oat-100 rounded-full transition"
            title="退出登录"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
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