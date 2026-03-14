'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckInRecord, MicroAction, EmotionType } from '@/types'

const STORAGE_KEY = 'emotion-lighthouse-records'

export function useCheckInRecords() {
  const [records, setRecords] = useState<CheckInRecord[]>([])

  // 从 localStorage 加载数据
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // 转换日期格式
        const recordsWithDates = parsed.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          microAction: r.microAction
            ? {
                ...r.microAction,
                createdAt: new Date(r.microAction.createdAt),
              }
            : null,
        }))
        setRecords(recordsWithDates)
      } catch (e) {
        console.error('Failed to parse stored records:', e)
      }
    }
  }, [])

  // 保存到 localStorage
  const saveRecords = useCallback((newRecords: CheckInRecord[]) => {
    setRecords(newRecords)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords))
  }, [])

  // 添加新记录
  const addRecord = useCallback((record: {
    emotion: EmotionType
    emotionScore: number
    summary: string
    microAction: MicroAction | null
    messages: any[]
  }) => {
    const newRecord: CheckInRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      emotion: record.emotion,
      emotionScore: record.emotionScore,
      summary: record.summary,
      microAction: record.microAction,
      messages: record.messages,
      createdAt: new Date(),
    }

    setRecords((prev) => {
      const newRecords = [newRecord, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords))
      return newRecords
    })
  }, [])

  // 更新微行动状态
  const updateMicroAction = useCallback((recordId: string, completed: boolean) => {
    setRecords((prev) => {
      const newRecords = prev.map((r) => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords))
      return newRecords
    })
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
    addRecord,
    updateMicroAction,
    hasCheckedInToday,
    getTodayRecord,
    getRecentRecords,
  }
}