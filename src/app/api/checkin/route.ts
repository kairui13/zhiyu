import { NextRequest, NextResponse } from 'next/server'
import {
  ChatMessage,
  detectEmotion,
  generateMicroAction,
  generateSummary,
} from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    // 并行处理：情绪检测、摘要生成
    const [emotion, summary] = await Promise.all([
      detectEmotion(messages),
      generateSummary(messages),
    ])

    // 根据情绪和摘要生成微行动
    const microAction = await generateMicroAction(emotion, summary)

    return NextResponse.json({
      emotion,
      summary,
      microAction,
    })
  } catch (error) {
    console.error('Check-in API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}