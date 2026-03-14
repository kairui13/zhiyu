'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Message, MicroAction, EmotionType, emotionLabels, emotionColors } from '@/types'

interface ChatInterfaceProps {
  onComplete?: (record: {
    emotion: EmotionType
    emotionScore: number
    summary: string
    microAction: MicroAction | null
    messages: Message[]
  }) => void
}

export default function ChatInterface({ onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '嘿，来啦。今天过得怎么样？',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showMicroAction, setShowMicroAction] = useState(false)
  const [microAction, setMicroAction] = useState<MicroAction | null>(null)
  const [emotion, setEmotion] = useState<EmotionType>('calm')
  const [emotionScore, setEmotionScore] = useState(3)
  const [showEmotionSelect, setShowEmotionSelect] = useState(false)
  const [showEmotionScore, setShowEmotionScore] = useState(false)
  const [summary, setSummary] = useState('')
  const [conversationEnded, setConversationEnded] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // 检测是否要结束对话
    const endKeywords = ['结束了', '先这样', '不聊了', '拜拜', '再见', '好的谢谢', '没了', '完了']
    const shouldEnd = endKeywords.some(keyword => input.includes(keyword))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || '抱歉，我有点走神了，能再说一遍吗？',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // 如果检测到结束关键词，触发情绪选择
      if (shouldEnd || messages.length >= 8) {
        setTimeout(() => {
          setShowEmotionSelect(true)
        }, 1000)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，网络有点问题，能再试一次吗？',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleEmotionSelect = (selectedEmotion: EmotionType) => {
    setEmotion(selectedEmotion)
    setShowEmotionSelect(false)
    setShowEmotionScore(true)
  }

  const handleEmotionScoreSelect = (score: number) => {
    setEmotionScore(score)
    setShowEmotionScore(false)
    setIsTyping(true)

    // 调用 check-in API 获取微行动
    fetch('/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary)
        setMicroAction({
          id: Date.now().toString(),
          content: data.microAction,
          completed: null,
          createdAt: new Date(),
        })
        setShowMicroAction(true)
        setIsTyping(false)
      })
      .catch(error => {
        console.error('Check-in error:', error)
        setSummary('今天聊了一些事情')
        setMicroAction({
          id: Date.now().toString(),
          content: '深呼吸三次，每次吸气4秒，呼气6秒',
          completed: null,
          createdAt: new Date(),
        })
        setShowMicroAction(true)
        setIsTyping(false)
      })
  }

  const handleMicroActionComplete = (completed: boolean) => {
    if (microAction) {
      setMicroAction({
        ...microAction,
        completed,
      })
      setConversationEnded(true)

      // 回调父组件
      if (onComplete) {
        onComplete({
          emotion,
          emotionScore,
          summary,
          microAction: {
            ...microAction,
            completed,
          },
          messages,
        })
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-bubble ${
                message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble chat-bubble-ai">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-warmgray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-warmgray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1.5 h-1.5 bg-warmgray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 情绪选择 */}
      {showEmotionSelect && (
        <div className="bg-cream-100 rounded-2xl p-4 mb-4">
          <p className="text-sm text-warmgray-600 mb-3">聊完啦，现在感觉怎么样？</p>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(emotionLabels) as EmotionType[]).map((e) => (
              <button
                key={e}
                onClick={() => handleEmotionSelect(e)}
                className="px-4 py-2 rounded-full text-sm bg-white border border-oat-200 hover:border-oat-300 hover:bg-oat-50 transition-colors"
                style={{ borderColor: emotionColors[e] }}
              >
                {emotionLabels[e]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 情绪强度选择 */}
      {showEmotionScore && (
        <div className="bg-cream-100 rounded-2xl p-4 mb-4">
          <p className="text-sm text-warmgray-600 mb-3">这种情绪有多强烈？</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleEmotionScoreSelect(score)}
                className="w-10 h-10 rounded-full bg-white border border-oat-200 hover:border-oat-300 hover:bg-oat-50 transition-colors text-sm font-medium"
              >
                {score}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-warmgray-400 mt-2 px-2">
            <span>很轻微</span>
            <span>很强烈</span>
          </div>
        </div>
      )}

      {/* 微行动建议 */}
      {showMicroAction && microAction && (
        <div className="bg-sage-50 rounded-2xl p-4 mb-4 border border-sage-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-sage-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-warmgray-600 mb-2">或许可以试试这个：</p>
              <p className="text-warmgray-800 font-medium mb-3">{microAction.content}</p>
              {microAction.completed === null ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMicroActionComplete(true)}
                    className="px-4 py-1.5 rounded-full text-sm bg-white border border-sage-300 text-sage-600 hover:bg-sage-100 transition-colors"
                  >
                    做了 ✓
                  </button>
                  <button
                    onClick={() => handleMicroActionComplete(false)}
                    className="px-4 py-1.5 rounded-full text-sm bg-white border border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50 transition-colors"
                  >
                    暂时没做
                  </button>
                </div>
              ) : (
                <p className="text-sm text-sage-600">
                  {microAction.completed ? '很棒，迈出一小步就是进步 🌱' : '没关系，下次试试看'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 输入区域 */}
      {!showMicroAction && !showEmotionSelect && !showEmotionScore && !conversationEnded && (
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="说点什么..."
            className="flex-1 resize-none rounded-2xl border border-oat-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-oat-300 focus:ring-2 focus:ring-oat-100 min-h-[48px] max-h-[120px]"
            rows={1}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-oat-300 text-warmgray-700 flex items-center justify-center hover:bg-oat-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 对话结束提示 */}
      {conversationEnded && (
        <div className="text-center py-4">
          <p className="text-sm text-warmgray-500">今天的签到完成啦，明天见 💫</p>
        </div>
      )}
    </div>
  )
}