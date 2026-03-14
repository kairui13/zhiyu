'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { CheckInRecord, emotionLabels, emotionColors, EmotionType } from '@/types'

interface EmotionChartProps {
  records: CheckInRecord[]
}

interface ChartDataItem {
  date: string
  score: number
  emotion: EmotionType
}

// Mock 数据 (当没有真实数据时显示)
const mockChartData: ChartDataItem[] = [
  { date: '3/8', score: 3, emotion: 'calm' },
  { date: '3/9', score: 2, emotion: 'anxious' },
  { date: '3/10', score: 2, emotion: 'empty' },
  { date: '3/11', score: 5, emotion: 'joyful' },
  { date: '3/12', score: 2, emotion: 'low' },
  { date: '3/13', score: 3, emotion: 'anxious' },
  { date: '3/14', score: 4, emotion: 'calm' },
]

// 自定义 Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem
    return (
      <div className="bg-white rounded-lg shadow-soft border border-oat-200 px-3 py-2">
        <p className="text-xs text-warmgray-500 mb-1">{label}</p>
        <p
          className="text-sm font-medium"
          style={{ color: emotionColors[data.emotion] }}
        >
          {emotionLabels[data.emotion]}
        </p>
      </div>
    )
  }
  return null
}

export default function EmotionChart({ records }: EmotionChartProps) {
  // 将记录转换为图表数据
  const chartData: ChartDataItem[] = records.length > 0
    ? records.slice(0, 7).reverse().map(r => ({
        date: new Date(r.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        score: r.emotionScore,
        emotion: r.emotion,
      }))
    : mockChartData
  // 计算平均情绪分数
  const avgScore =
    chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length

  // 统计各情绪出现次数
  const emotionCounts = chartData.reduce((acc, d) => {
    acc[d.emotion] = (acc[d.emotion] || 0) + 1
    return acc
  }, {} as Record<EmotionType, number>)

  const dominantEmotion = Object.entries(emotionCounts).sort(
    ([, a], [, b]) => b - a
  )[0] as [EmotionType, number]

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-oat-100">
          <p className="text-xs text-warmgray-500 mb-1">近7天平均</p>
          <p className="text-2xl font-medium text-warmgray-800">
            {avgScore.toFixed(1)}
          </p>
          <p className="text-xs text-warmgray-400 mt-1">情绪分数</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-oat-100">
          <p className="text-xs text-warmgray-500 mb-1">最常出现</p>
          <p
            className="text-2xl font-medium"
            style={{ color: emotionColors[dominantEmotion[0]] }}
          >
            {emotionLabels[dominantEmotion[0]]}
          </p>
          <p className="text-xs text-warmgray-400 mt-1">
            {dominantEmotion[1]}次
          </p>
        </div>
      </div>

      {/* 情绪曲线 */}
      <div className="bg-white rounded-2xl p-4 border border-oat-100">
        <h3 className="text-sm font-medium text-warmgray-700 mb-4">
          情绪趋势
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="emotionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9FB3C8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9FB3C8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9C9280' }}
              />
              <YAxis
                domain={[1, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9C9280' }}
                ticks={[1, 2, 3, 4, 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#9FB3C8"
                strokeWidth={2}
                fill="url(#emotionGradient)"
                dot={{
                  r: 4,
                  fill: '#9FB3C8',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#9FB3C8',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 情绪分布 */}
      <div className="bg-white rounded-2xl p-4 border border-oat-100">
        <h3 className="text-sm font-medium text-warmgray-700 mb-3">
          情绪分布
        </h3>
        <div className="space-y-2">
          {(Object.keys(emotionLabels) as EmotionType[]).map((emotion) => {
            const count = emotionCounts[emotion] || 0
            const percentage = (count / chartData.length) * 100
            return (
              <div key={emotion} className="flex items-center gap-3">
                <span
                  className="text-xs w-12"
                  style={{ color: emotionColors[emotion] }}
                >
                  {emotionLabels[emotion]}
                </span>
                <div className="flex-1 h-2 bg-oat-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: emotionColors[emotion],
                    }}
                  />
                </div>
                <span className="text-xs text-warmgray-400 w-8 text-right">
                  {count}次
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}