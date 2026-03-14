'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckInRecord, MicroAction, EmotionType } from '@/types'
import type { User } from '@supabase/supabase-js'

export function useCheckInRecords(user: User | null) {
  const [records, setRecords] = useState<CheckInRecord[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // 从 Supabase 加载数据
  useEffect(() => {
    if (!user) {
      setRecords([])
      return
    }

    const fetchRecords = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('emotion_records')
        .select('*')
        .order('date', { ascending: false })

      if (!error && data) {
        const formattedRecords: CheckInRecord[] = data.map((r) => ({
          id: r.id,
          date: r.date,
          emotion: r.emotion as EmotionType,
          emotionScore: r.intensity,
          summary: r.content || '',
          microAction: r.micro_action ? {
            id: `${r.id}-action`,
            content: r.micro_action,
            completed: false,
            createdAt: new Date(r.created_at),
          } as MicroAction : null,
          messages: [],
          createdAt: new Date(r.created_at),
        }))
        setRecords(formattedRecords)
      }
      setLoading(false)
    }

    fetchRecords()
  }, [user, supabase])

  // 添加新记录
  const addRecord = useCallback(async (record: {
    emotion: EmotionType
    emotionScore: number
    summary: string
    microAction: MicroAction | null
    messages: any[]
  }) => {
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('emotion_records')
      .insert({
        user_id: user.id,
        date: today,
        emotion: record.emotion,
        intensity: record.emotionScore,
        content: record.summary,
        micro_action: record.microAction?.content || null,
        ai_response: JSON.stringify(record.messages),
      })
      .select()
      .single()

    if (!error && data) {
      const newRecord: CheckInRecord = {
        id: data.id,
        date: data.date,
        emotion: data.emotion as EmotionType,
        emotionScore: data.intensity,
        summary: data.content || '',
        microAction: data.micro_action ? {
          id: `${data.id}-action`,
          content: data.micro_action,
          completed: false,
          createdAt: new Date(data.created_at),
        } as MicroAction : null,
        messages: record.messages,
        createdAt: new Date(data.created_at),
      }
      setRecords((prev) => [newRecord, ...prev])
    }
  }, [user, supabase])

  // 更新微行动状态
  const updateMicroAction = useCallback((recordId: string, completed: boolean) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId && r.microAction) {
          return {
            ...r,
            microAction: {
              ...r.microAction,
              completed,
            },
          }
        }
        return r
      })
    )
  }, [])

  // 检查今天是否已签到
  const hasCheckedInToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return records.some((r) => r.date === today)
  }, [records])

  // 获取今天签到记录
  const getTodayRecord = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return records.find((r) => r.date === today) || null
  }, [records])

  // 获取近 N 天记录
  const getRecentRecords = useCallback((days: number) => {
    return records.slice(0, days)
  }, [records])

  return {
    records,
    loading,
    addRecord,
    updateMicroAction,
    hasCheckedInToday,
    getTodayRecord,
    getRecentRecords,
  }
}